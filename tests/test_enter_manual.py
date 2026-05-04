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

    def test_build_manual_envelope_uses_fiscal_year_end_last_data_point(self):
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
            [{"t": "2023-24", "v": 1705.0}],
            unit="A$m",
            notes="Checked fiscal-year table.",
        )

        self.assertEqual(env["last_data_point"], "2024-06-30")

    def test_parse_field_preserves_text_and_parses_numbers(self):
        self.assertEqual(enter_manual.parse_field("total_income=1234.5"), ("total_income", 1234.5))
        self.assertEqual(enter_manual.parse_field("fiscal_year=2023-24"), ("fiscal_year", "2023-24"))

    def test_build_manual_envelope_allows_typed_extra_without_values(self):
        source = {
            "id": "company_example",
            "human_name": "Example company report",
            "canonical_url": "https://example.test/report",
            "url": "https://example.test/report",
            "rights": "Company copyright",
            "citation": "Example company annual report.",
        }
        env = enter_manual.build_manual_envelope(
            source,
            [],
            unit="",
            notes="Checked annual report table.",
            extra={
                "schema": "manual_extra_fields.v1",
                "fields": {
                    "fiscal_year": "2023-24",
                    "total_income": 1000,
                    "taxable_income": 500,
                    "income_tax_paid": 150,
                },
            },
            last_data_point="2024-06-30",
        )

        self.assertEqual(env["last_data_point"], "2024-06-30")
        self.assertEqual(env["values"], [])
        self.assertEqual(env["extra"]["fields"]["income_tax_paid"], 150)
        self.assertEqual(env["status"], "ok")

    def test_merge_fields_requires_force_for_duplicate_key(self):
        existing = {"schema": "manual_extra_fields.v1", "fields": {"total_income": 100}}
        with self.assertRaises(ValueError):
            enter_manual.merge_fields(existing, {"total_income": 101}, force=False)

        merged = enter_manual.merge_fields(existing, {"total_income": 101}, force=True)
        self.assertEqual(merged["total_income"], 101)


if __name__ == "__main__":
    unittest.main()
