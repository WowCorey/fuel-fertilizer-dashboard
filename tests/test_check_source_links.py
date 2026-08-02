import importlib.util
import pathlib
import sys
import tempfile
import unittest

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

    def test_malformed_url_is_distinct(self):
        result = MODULE.check_url_once("")
        self.assertEqual(result.category, "malformed_url")
        self.assertIn("blank", result.detail)

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


if __name__ == "__main__":
    unittest.main()
