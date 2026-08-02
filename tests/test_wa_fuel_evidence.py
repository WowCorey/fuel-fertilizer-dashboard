import json
import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


class WaFuelEvidenceBoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.quantified = json.loads(
            (ROOT / "data" / "manual" / "wa_fuel_security_stockouts.json").read_text(encoding="utf-8")
        )
        cls.qualitative = json.loads(
            (ROOT / "data" / "manual" / "wa_fuel_security_weekly_update.json").read_text(encoding="utf-8")
        )

    def test_quantified_and_qualitative_evidence_use_distinct_sources(self):
        self.assertNotEqual(self.quantified["source_id"], self.qualitative["source_id"])
        self.assertEqual(self.quantified["source_url"], "https://fuelplan.gov.au/fuel-statistics")
        self.assertIn("wa.gov.au", self.qualitative["source_url"])

    def test_display_value_is_the_explicit_fuel_plan_diesel_field(self):
        fields = self.quantified["extra"]["fields"]["quantified_stockouts"]
        self.assertEqual(fields["display_field"], "diesel_stockout_sites")
        self.assertEqual(self.quantified["values"][0]["v"], fields["diesel_stockout_sites"])
        self.assertEqual(self.quantified["unit"], "sites reporting no diesel")
        self.assertEqual(self.quantified["last_data_point"], fields["as_at"])

    def test_qualitative_wording_is_not_converted_to_a_value(self):
        fields = self.qualitative["extra"]["fields"]
        self.assertEqual(self.qualitative["values"], [])
        self.assertEqual(fields["numeric_conversion"], "not permitted")
        self.assertEqual(self.qualitative["last_data_point"], "2026-07-24")

    def test_historical_aggregate_is_explicitly_not_comparable(self):
        historical = self.quantified["extra"]["fields"]["historical_wa_quantified_snapshot"]
        self.assertEqual(historical["status"], "historical_only")
        self.assertIn("not directly comparable", historical["note"])


if __name__ == "__main__":
    unittest.main()
