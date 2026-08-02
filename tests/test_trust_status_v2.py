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
        self.assertEqual(gaps[0], {"dashboard": "fuel_security", "unavailable_sources": 2})

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
        self.assertIn("does not imply", result["claim_boundary"])

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


if __name__ == "__main__":
    unittest.main()
