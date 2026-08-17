import copy
import importlib.util
import pathlib
import sys
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "validate_national_status_gate.py"
SPEC = importlib.util.spec_from_file_location("validate_national_status_gate", MODULE_PATH)
VALIDATOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = VALIDATOR
assert SPEC.loader is not None
SPEC.loader.exec_module(VALIDATOR)


class NationalStatusGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.gate = VALIDATOR.load_json(VALIDATOR.GATE_PATH)
        cls.sources = VALIDATOR.load_json(VALIDATOR.SOURCE_MANIFEST_PATH)
        cls.trust = VALIDATOR.load_json(VALIDATOR.TRUST_MANIFEST_PATH)
        cls.routes = VALIDATOR.load_json(VALIDATOR.ROUTES_PATH)
        bootstrap_errors = []
        cls.indicators = VALIDATOR.load_indicator_states(ROOT, bootstrap_errors)
        if bootstrap_errors:
            raise AssertionError(bootstrap_errors)

    def validate(self, *, gate=None, sources=None, trust=None, routes=None, indicators=None):
        return VALIDATOR.validate_gate(
            copy.deepcopy(gate if gate is not None else self.gate),
            copy.deepcopy(sources if sources is not None else self.sources),
            copy.deepcopy(trust if trust is not None else self.trust),
            copy.deepcopy(routes if routes is not None else self.routes),
            copy.deepcopy(indicators if indicators is not None else self.indicators),
            root=ROOT,
        )

    def test_committed_gate_reconciles_to_explicit_repository_fields(self):
        self.assertEqual(self.validate(), [])

    def test_unknown_readiness_category_is_rejected(self):
        gate = copy.deepcopy(self.gate)
        gate["readiness_dimensions"]["coverage_readiness"]["status"] = "mostly_ready"
        errors = self.validate(gate=gate)
        self.assertTrue(any("unknown readiness category" in error for error in errors))

    def test_unknown_source_mode_is_rejected_instead_of_disappearing(self):
        sources = copy.deepcopy(self.sources)
        first_source = next(iter(sources["sources"].values()))
        first_source["fetch"] = "automatic_if_possible"
        errors = self.validate(sources=sources)
        self.assertTrue(any("unknown source mode" in error for error in errors))

    def test_source_mode_count_mismatch_is_rejected(self):
        gate = copy.deepcopy(self.gate)
        gate["current_repository"]["source_modes"]["manual"] += 1
        errors = self.validate(gate=gate)
        self.assertTrue(any("current_repository.source_modes: count mismatch" in error for error in errors))

    def test_envelope_presence_count_mismatch_is_rejected(self):
        gate = copy.deepcopy(self.gate)
        gate["current_repository"]["envelope_presence"]["missing"] = 1
        errors = self.validate(gate=gate)
        self.assertTrue(any("current_repository.envelope_presence: count mismatch" in error for error in errors))

    def test_warning_and_route_count_mismatches_are_rejected(self):
        gate = copy.deepcopy(self.gate)
        gate["current_repository"]["validation_warnings"]["manual_stale"] -= 1
        gate["current_repository"]["public_routes"] += 1
        errors = self.validate(gate=gate)
        self.assertTrue(any("current_repository.validation_warnings: count mismatch" in error for error in errors))
        self.assertTrue(any("current_repository.public_routes: count mismatch" in error for error in errors))

    def test_unresolved_null_cannot_be_silently_converted_to_zero(self):
        gate = copy.deepcopy(self.gate)
        threshold = next(item for item in gate["thresholds"] if item["id"] == "minimum_historical_baseline_periods")
        threshold["value"] = 0
        errors = self.validate(gate=gate)
        self.assertTrue(any("null-to-zero conversion is forbidden" in error for error in errors))

    def test_threshold_without_rationale_is_rejected(self):
        gate = copy.deepcopy(self.gate)
        gate["thresholds"][0]["rationale"] = ""
        errors = self.validate(gate=gate)
        self.assertTrue(any("thresholds[0].rationale" in error for error in errors))

    def test_public_ready_result_is_rejected_while_blockers_remain(self):
        gate = copy.deepcopy(self.gate)
        gate["current_outcome"] = "ready_for_public_composite_model"
        gate["publication"]["public_composite_model_ready"] = True
        errors = self.validate(gate=gate)
        self.assertTrue(any("current_outcome" in error and "blocking conditions remain" in error for error in errors))
        self.assertTrue(any("publication" in error and "blocking conditions remain" in error for error in errors))

    def test_score_and_status_publication_require_approved_methodology(self):
        gate = copy.deepcopy(self.gate)
        gate["publication"]["published_score"] = 0
        gate["publication"]["published_status_label"] = "Stable"
        errors = self.validate(gate=gate)
        self.assertTrue(any("published_score" in error for error in errors))
        self.assertTrue(any("published_status_label" in error for error in errors))
        self.assertTrue(any("require approved methodology" in error for error in errors))

    def test_required_indicator_state_drift_is_rejected(self):
        indicators = copy.deepcopy(self.indicators)
        indicators["fuel_security_status_model"] = "ok"
        errors = self.validate(indicators=indicators)
        self.assertTrue(any("required_indicator_states: state mismatch" in error for error in errors))

    def test_claim_boundary_cannot_drop_required_limit(self):
        gate = copy.deepcopy(self.gate)
        gate["claim_boundary"] = gate["claim_boundary"][:-1]
        errors = self.validate(gate=gate)
        self.assertTrue(any("security assessment" in error for error in errors))

    def test_validation_is_integrated_into_relevant_workflows(self):
        for filename in ("ci.yml", "pages.yml", "refresh-data.yml", "manual-data-review.yml"):
            with self.subTest(workflow=filename):
                text = (ROOT / ".github" / "workflows" / filename).read_text(encoding="utf-8")
                self.assertIn("python scripts/validate_national_status_gate.py", text)


if __name__ == "__main__":
    unittest.main()
