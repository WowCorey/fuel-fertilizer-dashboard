import importlib.util
import pathlib
import sys
import tempfile
import unittest
from unittest import mock

MODULE_PATH = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "check_source_links.py"
SPEC = importlib.util.spec_from_file_location("check_source_links", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class FakeResponse:
    def __init__(self, status_code, url):
        self.status_code = status_code
        self.url = url
        self.closed = False

    def close(self):
        self.closed = True


class FakeSession:
    def __init__(self, response):
        self.response = response
        self.calls = []

    def get(self, url, **kwargs):
        self.calls.append((url, kwargs))
        return self.response


class SourceLinkHealthTests(unittest.TestCase):
    def test_http_status_categories(self):
        self.assertEqual(
            MODULE.classify_http_status(200, requested_url="https://example.test").category,
            "healthy",
        )
        self.assertEqual(
            MODULE.classify_http_status(
                200,
                requested_url="https://old.example.test",
                final_url="https://new.example.test",
            ).category,
            "healthy_redirect",
        )
        self.assertEqual(
            MODULE.classify_http_status(403, requested_url="https://example.test").category,
            "access_blocked",
        )
        self.assertEqual(
            MODULE.classify_http_status(404, requested_url="https://example.test").category,
            "confirmed_broken",
        )
        self.assertEqual(
            MODULE.classify_http_status(503, requested_url="https://example.test").category,
            "transient_error",
        )
        self.assertEqual(
            MODULE.classify_http_status(410, requested_url="https://example.test").category,
            "confirmed_broken",
        )
        self.assertEqual(
            MODULE.classify_http_status(429, requested_url="https://example.test").category,
            "access_blocked",
        )

    def test_malformed_url_is_distinct(self):
        result = MODULE.check_url_once("")
        self.assertEqual(result.category, "malformed_url")
        self.assertIn("blank", result.detail)

        missing_host = MODULE.check_url_once("https:///missing-host")
        self.assertEqual(missing_host.category, "malformed_url")

    def test_internal_project_document_exists(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = pathlib.Path(temp_dir)
            target = root / "docs" / "method.md"
            target.parent.mkdir(parents=True)
            target.write_text("ok", encoding="utf-8")
            result = MODULE.check_url_once(
                "https://wowcorey.github.io/fuel-fertilizer-dashboard/docs/method.md",
                root=root,
            )
        self.assertEqual(result.category, "healthy_internal")

    def test_internal_project_document_missing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            result = MODULE.check_url_once(
                "https://wowcorey.github.io/fuel-fertilizer-dashboard/docs/missing.md",
                root=pathlib.Path(temp_dir),
            )
        self.assertEqual(result.category, "internal_missing")

    def test_request_uses_get_and_closes_response(self):
        response = FakeResponse(200, "https://example.test")
        session = FakeSession(response)
        result = MODULE.check_url_once("https://example.test", session=session)
        self.assertEqual(result.category, "healthy")
        self.assertTrue(response.closed)
        self.assertEqual(session.calls[0][0], "https://example.test")
        self.assertTrue(session.calls[0][1]["stream"])

    def test_healthy_fetch_distinguishes_blocked_canonical_page(self):
        canonical = MODULE.LinkResult(
            "access_blocked",
            "HTTP 403",
            "https://publisher.example/page",
            http_status=403,
        )
        fetch = MODULE.LinkResult(
            "healthy",
            "HTTP 200",
            "https://publisher.example/data.csv",
            http_status=200,
        )
        self.assertEqual(
            MODULE.combine_category(canonical, fetch),
            "canonical_blocked_fetch_healthy",
        )

    def test_broken_canonical_remains_a_repair_when_fetch_is_healthy(self):
        canonical = MODULE.LinkResult(
            "confirmed_broken",
            "HTTP 404",
            "https://publisher.example/old-page",
            http_status=404,
        )
        fetch = MODULE.LinkResult(
            "healthy",
            "HTTP 200",
            "https://publisher.example/data.csv",
            http_status=200,
        )
        self.assertEqual(
            MODULE.combine_category(canonical, fetch),
            "canonical_broken_fetch_healthy",
        )

    def test_unexpected_checker_failure_is_not_reported_as_http_health(self):
        with mock.patch.object(MODULE, "check_url_once", side_effect=RuntimeError("worker failed")):
            results = MODULE.check_many(["https://example.test"], workers=1, timeout=1)

        self.assertEqual(results["https://example.test"].category, "checker_failure")
        self.assertIn("worker failed", results["https://example.test"].detail)

    def test_report_marks_checker_failure_as_incomplete(self):
        source = {
            "id": "broken_worker",
            "url": "https://example.test/source",
            "fetch": "manual",
        }
        failure = MODULE.LinkResult(
            "checker_failure",
            "unexpected checker failure: RuntimeError: worker failed",
            source["url"],
        )
        with mock.patch.object(MODULE, "load_sources", return_value=[source]), mock.patch.object(
            MODULE, "load_governance", return_value={"overrides": {}}
        ), mock.patch.object(MODULE, "check_many", return_value={source["url"]: failure}):
            report = MODULE.build_report(only=None, workers=1, timeout=1)

        self.assertFalse(report["classification_complete"])
        self.assertEqual(report["checker_failure_count"], 1)
        self.assertEqual(report["classified_source_count"], report["registered_source_count"])

    def test_external_output_path_has_a_printable_fallback(self):
        with tempfile.TemporaryDirectory() as root_dir, tempfile.TemporaryDirectory() as output_dir:
            root = pathlib.Path(root_dir)
            output = pathlib.Path(output_dir) / "health.json"
            self.assertEqual(MODULE.printable_output_path(output, root=root), str(output))


if __name__ == "__main__":
    unittest.main()
