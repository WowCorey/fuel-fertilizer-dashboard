import importlib.util
import io
import pathlib
import sys
import tempfile
import unittest
from contextlib import redirect_stderr
from unittest import mock


ROOT = pathlib.Path(__file__).resolve().parents[1]


def load_module(name: str, relative_path: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


APPLY = load_module("apply_source_url_governance", "scripts/apply_source_url_governance.py")
VALIDATE = load_module("validate_project", "scripts/validate_project.py")


class SourceUrlGovernanceTests(unittest.TestCase):
    def test_url_validation_requires_a_host(self):
        self.assertTrue(VALIDATE.valid_http_url("https://example.test/path"))
        self.assertFalse(VALIDATE.valid_http_url("https:///missing-host"))
        self.assertFalse(VALIDATE.valid_http_url("https://example.test/path "))

    def test_unknown_override_source_id_is_blocking(self):
        errors = []
        warnings = []
        governed = VALIDATE.governance_checks(
            {},
            {
                "schema": "fuel_resilience_source_url_governance.v1",
                "reviewed_at": "2026-08-02",
                "overrides": {
                    "unknown_source": {
                        "canonical_url": "https://example.test/source",
                        "reason": "test",
                    }
                },
            },
            errors,
            warnings,
        )

        self.assertEqual(governed, set())
        self.assertTrue(any("unknown source id" in item["message"] for item in errors))

    def test_missing_governed_envelope_is_blocking(self):
        errors = []
        warnings = []
        source_id = "known_source"
        with tempfile.TemporaryDirectory() as temp_dir:
            generated = pathlib.Path(temp_dir) / "generated"
            manual = pathlib.Path(temp_dir) / "manual"
            generated.mkdir()
            manual.mkdir()
            with mock.patch.object(VALIDATE, "GENERATED_DIR", generated), mock.patch.object(
                VALIDATE, "MANUAL_DIR", manual
            ):
                VALIDATE.governance_checks(
                    {source_id: {"id": source_id}},
                    {
                        "schema": "fuel_resilience_source_url_governance.v1",
                        "reviewed_at": "2026-08-02",
                        "overrides": {
                            source_id: {
                                "canonical_url": "https://example.test/source",
                                "reason": "test",
                            }
                        },
                    },
                    errors,
                    warnings,
                )

        self.assertTrue(any("no envelope" in item["message"] for item in errors))

    def test_apply_only_rejects_unknown_governed_source_id(self):
        governance = {
            "schema": "fuel_resilience_source_url_governance.v1",
            "reviewed_at": "2026-08-02",
            "overrides": {"known_source": {}},
        }
        stderr = io.StringIO()
        with mock.patch.object(APPLY, "load_governance", return_value=governance), mock.patch.object(
            sys, "argv", ["apply_source_url_governance.py", "--only", "missing_source"]
        ), redirect_stderr(stderr):
            result = APPLY.main()

        self.assertEqual(result, 1)
        self.assertIn("unknown governed source id", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()
