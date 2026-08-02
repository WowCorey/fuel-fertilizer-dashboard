import importlib.util
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "build_trust_status.py"
SPEC = importlib.util.spec_from_file_location("build_trust_status", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

VALIDATOR_PATH = ROOT / "scripts" / "validate_trust_status_v2.py"
VALIDATOR_SPEC = importlib.util.spec_from_file_location("validate_trust_status_v2", VALIDATOR_PATH)
VALIDATOR = importlib.util.module_from_spec(VALIDATOR_SPEC)
sys.modules[VALIDATOR_SPEC.name] = VALIDATOR
assert VALIDATOR_SPEC.loader is not None
VALIDATOR_SPEC.loader.exec_module(VALIDATOR)


class TrustStatusV2Tests(unittest.TestCase):
    def test_source_inventory_counts_modes_and_unavailable_dashboards(self):
        manifest = {
            "sources": {
                "a": {
                    "fetch": "programmatic",
                    "has_generated": True,
                    "has_manual": False,
                    "used_by": ["fuel"],
                },
                "b": {
                    "fetch": "manual",
                    "has_generated": False,
                    "has_manual": True,
                    "used_by": ["fuel"],
                },
                "c": {
                    "fetch": "derived",
                    "has_generated": True,
                    "has_manual": False,
                    "used_by": ["fuel_security"],
                },
                "d": {
                    "fetch": "unavailable",
                    "has_generated": False,
                    "has_manual": True,
                    "used_by": ["fuel", "fuel_security"],
                },
                "e": {
                    "fetch": "unavailable",
                    "has_generated": False,
                    "has_manual": True,
                    "used_by": ["fuel_security"],
                },
            }
        }
        modes, presence, gaps = MODULE.source_inventory(manifest)
        self.assertEqual(modes["total"], 5)
        self.assertEqual(modes["programmatic"], 1)
        self.assertEqual(modes["manual"], 1)
        self.assertEqual(modes["derived"], 1)
        self.assertEqual(modes["unavailable"], 2)
        self.assertEqual(presence["generated_only"], 2)
        self.assertEqual(presence["manual_only"], 3)
        self.assertEqual(presence["both"], 0)
        self.assertEqual(presence["missing"], 0)
        self.assertEqual(gaps[0], {"dashboard": "fuel_security", "unavailable_sources": 2})

    def test_source_inventory_rejects_unknown_mode(self):
        with self.assertRaisesRegex(ValueError, "unknown fetch mode"):
            MODULE.source_inventory(
                {
                    "sources": {
                        "bad": {
                            "fetch": "sometimes",
                            "has_generated": False,
                            "has_manual": False,
                        }
                    }
                }
            )

    def test_validation_summary_keeps_manual_and_generated_staleness_separate(self):
        summary = MODULE.validation_summary(
            {
                "errors": [],
                "warnings": [
                    {"path": "data/manual/a.json", "message": "last_data_point may be stale for weekly cadence"},
                    {"path": "data/generated/b.json", "message": "last_data_point may be stale for monthly cadence"},
                    {"path": "data/sources.yml:source", "message": "rights_url is blank; verify upstream terms"},
                ],
            }
        )
        self.assertTrue(summary["ok"])
        self.assertEqual(summary["warning_count"], 3)
        self.assertEqual(summary["warning_categories"]["manual_stale"], 1)
        self.assertEqual(summary["warning_categories"]["generated_stale"], 1)
        self.assertEqual(summary["warning_categories"]["rights_metadata"], 1)
        self.assertEqual(summary["warning_categories"]["source_name_mismatch"], 0)
        self.assertEqual(summary["warning_categories"]["source_url_mismatch"], 0)
        self.assertEqual(summary["warning_categories"]["other"], 0)

    def test_public_warning_examples_redact_secret_query_values(self):
        summary = MODULE.validation_summary(
            {
                "errors": [],
                "warnings": [
                    {
                        "path": "data/manual/example.json",
                        "message": "upstream URL https://example.test/data?api_key=do-not-publish&format=json is stale",
                    }
                ],
            }
        )
        example = summary["warning_examples"]["manual_stale"][0]["message"]
        self.assertNotIn("do-not-publish", example)
        self.assertIn("[redacted]", example)

    def test_overall_status_never_hides_validation_failure(self):
        validation = {"error_count": 1, "warning_count": 0}
        refresh = {"status": "success"}
        links = {"repair_required_count": 0}
        self.assertEqual(MODULE.overall_status(validation, refresh, links), "validation_failed")

    def test_overall_status_discloses_warnings(self):
        validation = {"error_count": 0, "warning_count": 2}
        refresh = {"status": "success"}
        links = {"repair_required_count": 0}
        self.assertEqual(MODULE.overall_status(validation, refresh, links), "operational_with_warnings")

    def test_missing_link_report_is_unknown_not_healthy(self):
        result = MODULE.link_health_summary(None)
        self.assertEqual(result["status"], "not_yet_generated")
        self.assertIsNone(result["repair_required_count"])
        self.assertIsNone(result["classification_complete"])
        self.assertIn("does not imply", result["claim_boundary"])

    def test_link_health_preserves_classification_coverage(self):
        result = MODULE.link_health_summary(
            {
                "generated_at": "2026-08-02T00:00:00+00:00",
                "advisory": True,
                "repair_required_count": 0,
                "registered_source_count": 3,
                "classified_source_count": 3,
                "checker_failure_count": 1,
                "classification_complete": False,
                "summary": {"healthy": 2, "checker_failure": 1},
                "claim_boundary": "A request failure is not proof that a dataset is unavailable.",
            }
        )
        self.assertEqual(result["categories"], {"healthy": 2, "checker_failure": 1})
        self.assertEqual(result["checker_failure_count"], 1)
        self.assertFalse(result["classification_complete"])

    def test_missing_or_incomplete_link_health_keeps_warning_status(self):
        validation = {"error_count": 0, "warning_count": 0}
        refresh = {"status": "success"}
        self.assertEqual(
            MODULE.overall_status(validation, refresh, MODULE.link_health_summary(None)),
            "operational_with_warnings",
        )
        self.assertEqual(
            MODULE.overall_status(
                validation,
                refresh,
                {"status": "available", "classification_complete": False, "repair_required_count": 0},
            ),
            "operational_with_warnings",
        )

    def test_refresh_sha_semantics_are_explicit(self):
        result = MODULE.refresh_summary(
            {
                "status": "success",
                "refreshed_at": "2026-08-02T00:00:00+00:00",
                "git_sha": "abc",
            }
        )
        self.assertIn("input commit", result["sha_semantics"])
        self.assertIn("published refresh", result["sha_semantics"])

    def test_missing_refresh_marker_is_an_unknown_state(self):
        result = MODULE.refresh_summary(None)
        self.assertEqual(result["status"], "not_recorded")
        self.assertIsNone(result["refreshed_at"])
        self.assertIsNone(result["reported_git_sha"])
        self.assertEqual(
            MODULE.overall_status(
                {"error_count": 0, "warning_count": 0},
                result,
                {"status": "available", "classification_complete": True, "repair_required_count": 0},
            ),
            "refresh_status_unknown",
        )

    def test_validator_accepts_honest_missing_refresh_evidence(self):
        errors = []
        VALIDATOR.validate_refresh(MODULE.refresh_summary(None), errors)
        self.assertEqual(errors, [])

    def test_validator_rejects_false_complete_link_coverage(self):
        errors = []
        VALIDATOR.validate_link_health(
            {
                "status": "available",
                "generated_at": "2026-08-02T00:00:00+00:00",
                "advisory": True,
                "repair_required_count": 0,
                "registered_source_count": 5,
                "classified_source_count": 4,
                "checker_failure_count": 0,
                "classification_complete": True,
                "categories": {"healthy": 4},
                "claim_boundary": "A failed request is not proof of availability.",
                "evidence_path": "data/source_link_health.json",
            },
            errors,
        )
        self.assertTrue(any("complete link-health classification" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
