import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts import enter_manual


class EnterManualTests(unittest.TestCase):
    def test_merge_values_requires_force_for_duplicate_period(self):
        existing = [{"t": "2026-01", "v": 10.0}]
        incoming = [{"t": "2026-01", "v": 11.0}]
        with self.assertRaises(ValueError):
            enter_manual.merge_values(existing, incoming, force=False)

        merged = enter_manual.merge_values(existing, incoming, force=True)
        self.assertEqual(merged, [{"t": "2026-01", "v": 11.0}])

    def test_build_manual_envelope_uses_month_end_last_data_point(self):
        source = {
            "id": "example_manual",
            "human_name": "Example manual source",
            "canonical_url": "https://example.test/source",
            "url": "https://example.test/source",
            "rights": "Example terms",
            "citation": "Example citation.",
        }
        env = enter_manual.build_manual_envelope(
            source,
            [{"t": "2026-02", "v": 42.0}],
            unit="units",
            notes="Checked table 1.",
        )

        self.assertEqual(env["source_id"], "example_manual")
        self.assertEqual(env["last_data_point"], "2026-02-28")
        self.assertEqual(env["status"], "ok")
        self.assertTrue(env["manual_entry"])


if __name__ == "__main__":
    unittest.main()
