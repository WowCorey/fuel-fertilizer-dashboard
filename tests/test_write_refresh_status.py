import datetime as dt
import importlib.util
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "write_refresh_status.py"
SPEC = importlib.util.spec_from_file_location("write_refresh_status", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class RefreshStatusV2Tests(unittest.TestCase):
    def setUp(self):
        self.input_sha = "1" * 40
        self.output_sha = "2" * 40
        self.now = dt.datetime(2026, 8, 2, 16, 0, tzinfo=dt.timezone.utc)
        self.env = {
            "GITHUB_WORKFLOW": "Weekly data refresh",
            "GITHUB_RUN_ID": "12345",
            "GITHUB_RUN_ATTEMPT": "2",
            "GITHUB_REF": "refs/heads/main",
            "GITHUB_REF_NAME": "main",
        }

    def test_prepare_distinguishes_input_commit_from_unpublished_output(self):
        marker = MODULE.prepare_payload(now=self.now, environ=self.env, input_sha=self.input_sha)
        self.assertEqual(marker["schema"], MODULE.SCHEMA_V2)
        self.assertEqual(marker["status"], "pending_publication")
        self.assertEqual(marker["publication_state"], "prepared")
        self.assertEqual(marker["workflow_input_sha"], self.input_sha)
        self.assertEqual(marker["git_sha"], self.input_sha)
        self.assertEqual(marker["source_data_refreshed_at"], "2026-08-02T16:00:00+00:00")
        self.assertEqual(marker["workflow_run_id"], "12345")
        self.assertEqual(marker["workflow_run_attempt"], "2")
        self.assertEqual(marker["ref"], "refs/heads/main")
        self.assertEqual(marker["branch"], "main")
        self.assertIsNone(marker["output_commit_sha"])
        self.assertFalse(marker["output_commit_pushed"])

    def test_finalize_records_the_already_pushed_output_commit(self):
        prepared = MODULE.prepare_payload(now=self.now, environ=self.env, input_sha=self.input_sha)
        marker = MODULE.finalize_payload(prepared, self.output_sha.upper(), pushed=True)
        self.assertEqual(marker["status"], "success")
        self.assertEqual(marker["publication_state"], "published")
        self.assertEqual(marker["output_commit_sha"], self.output_sha)
        self.assertTrue(marker["output_commit_pushed"])
        self.assertEqual(marker["source_data_refreshed_at"], prepared["source_data_refreshed_at"])
        self.assertIn("not the later marker commit", marker["sha_semantics"])
        self.assertIn("not proof of the latest deployed commit", marker["sha_semantics"])

    def test_finalize_rejects_missing_push_proof(self):
        prepared = MODULE.prepare_payload(now=self.now, environ=self.env, input_sha=self.input_sha)
        with self.assertRaisesRegex(ValueError, "push succeeded"):
            MODULE.finalize_payload(prepared, self.output_sha, pushed=False)

    def test_finalize_rejects_invalid_output_sha(self):
        prepared = MODULE.prepare_payload(now=self.now, environ=self.env, input_sha=self.input_sha)
        with self.assertRaisesRegex(ValueError, "40 hexadecimal"):
            MODULE.finalize_payload(prepared, "not-a-sha", pushed=True)

    def test_finalize_rejects_legacy_marker(self):
        with self.assertRaisesRegex(ValueError, "prepared v2"):
            MODULE.finalize_payload({"schema": "fuel_resilience_refresh_status.v1"}, self.output_sha, pushed=True)

    def test_weekly_workflow_pushes_output_before_finalizing_marker(self):
        workflow = (ROOT / ".github" / "workflows" / "refresh-data.yml").read_text(encoding="utf-8")
        prepare = workflow.index("python scripts/write_refresh_status.py\n")
        first_push = workflow.index('git push origin "HEAD:${GITHUB_REF_NAME}"')
        finalize = workflow.index('python scripts/write_refresh_status.py --finalize "$OUTPUT_COMMIT_SHA" --pushed')
        second_push = workflow.index('git push origin "HEAD:${GITHUB_REF_NAME}"', first_push + 1)
        self.assertLess(prepare, first_push)
        self.assertLess(first_push, finalize)
        self.assertLess(finalize, second_push)
        self.assertIn(
            "git add data/last_successful_refresh.json data/trust_status_manifest.json",
            workflow,
        )

    def test_ci_and_pages_follow_successful_main_refresh_runs(self):
        for relative_path in (
            ".github/workflows/ci.yml",
            ".github/workflows/pages.yml",
        ):
            workflow = (ROOT / relative_path).read_text(encoding="utf-8")
            self.assertIn('workflows: ["Weekly data refresh"]', workflow, relative_path)
            self.assertIn("types: [completed]", workflow, relative_path)
            self.assertIn("github.event.workflow_run.conclusion == 'success'", workflow, relative_path)
            self.assertIn("github.event.workflow_run.head_branch == 'main'", workflow, relative_path)

        ci = (ROOT / ".github" / "workflows" / "ci.yml").read_text(encoding="utf-8")
        self.assertIn("workflow_dispatch:", ci)


if __name__ == "__main__":
    unittest.main()
