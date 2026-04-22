import json
import pathlib
import sys
import tempfile
import unittest
import datetime as dt
from unittest import mock

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts import fetch_data


class FakeResponse:
    def __init__(self, *, text="", content=None, json_doc=None, status_code=200):
        self.text = text
        self.content = content if content is not None else text.encode("utf-8")
        self._json_doc = json_doc
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(f"HTTP {self.status_code}")

    def json(self):
        return self._json_doc


class FetchTransformTests(unittest.TestCase):
    def test_abs_sdmx_parses_single_series(self):
        doc = {
            "dataSets": [
                {
                    "series": {
                        "0:0:0": {
                            "observations": {
                                "0": [1000],
                                "1": [1250],
                            }
                        }
                    }
                }
            ],
            "structure": {
                "dimensions": {
                    "observation": [
                        {
                            "id": "TIME_PERIOD",
                            "values": [
                                {"id": "2026-01", "end": "2026-01-31T00:00:00"},
                                {"id": "2026-02", "end": "2026-02-28T00:00:00"},
                            ],
                        }
                    ]
                },
                "attributes": {
                    "dataSet": [
                        {"id": "UNIT_MEASURE", "values": [{"id": "AUD"}]},
                        {"id": "UNIT_MULT", "values": [{"id": "3"}]},
                    ]
                },
            },
        }
        with mock.patch.object(fetch_data.requests, "get", return_value=FakeResponse(json_doc=doc)) as get:
            out = fetch_data.fetch_abs_sdmx("MERCH_IMP", "33.TOT.TOT.M", "2026-01")

        self.assertEqual(
            get.call_args.args[0],
            "https://data.api.abs.gov.au/rest/data/MERCH_IMP/33.TOT.TOT.M?format=jsondata&startPeriod=2026-01",
        )
        self.assertEqual(out["unit"], "AUD thousands")
        self.assertEqual(out["last_data_point"], "2026-02-28")
        self.assertEqual(out["values"], [{"t": "2026-01", "v": 1000}, {"t": "2026-02", "v": 1250}])

    def test_petroleum_imports_yoy_derivation(self):
        source = {"id": "abs_petroleum_imports_yoy", "derived_from": "abs_petroleum_imports"}
        with tempfile.TemporaryDirectory() as tmp:
            generated = pathlib.Path(tmp)
            parent = {
                "status": "ok",
                "last_data_point": "2026-01-31",
                "source_url": "https://example.test/source",
                "values": [
                    {"t": f"2025-{month:02d}", "v": 100.0}
                    for month in range(1, 13)
                ] + [{"t": "2026-01", "v": 125.0}],
            }
            (generated / "abs_petroleum_imports.json").write_text(json.dumps(parent), encoding="utf-8")
            old_generated = fetch_data.GENERATED_DIR
            fetch_data.GENERATED_DIR = generated
            try:
                out = fetch_data.fetch_abs_petroleum_imports_yoy(source)
            finally:
                fetch_data.GENERATED_DIR = old_generated

        self.assertEqual(out["unit"], "%")
        self.assertEqual(out["values"][-1], {"t": "2026-01", "v": 25.0})
        self.assertEqual(out["last_data_point"], "2026-01-31")

    def test_abs_fertiliser_source_concentration(self):
        countries = [
            ("TOT", "Total"),
            ("SA", "Saudi Arabia"),
            ("MA", "Morocco"),
            ("CN", "China"),
            ("US", "United States"),
        ]
        doc = {
            "dataSets": [{"series": {}}],
            "structure": {
                "dimensions": {
                    "series": [
                        {"id": "COMMODITY_SITC", "values": [{"id": "562", "name": "Fertilisers"}]},
                        {"id": "COUNTRY_ORIGIN", "values": [{"id": code, "name": name} for code, name in countries]},
                        {"id": "STATE_DEST", "values": [{"id": "TOT", "name": "Total"}]},
                        {"id": "FREQ", "values": [{"id": "M", "name": "Monthly"}]},
                    ],
                    "observation": [
                        {
                            "id": "TIME_PERIOD",
                            "values": [
                                {"id": "2026-01", "end": "2026-01-31T00:00:00"},
                                {"id": "2026-02", "end": "2026-02-28T00:00:00"},
                            ],
                        }
                    ],
                }
            },
        }
        rows = {
            0: [1000, 2000],
            1: [300, 800],
            2: [250, 500],
            3: [200, 400],
            4: [100, 100],
        }
        for country_idx, values in rows.items():
            doc["dataSets"][0]["series"][f"0:{country_idx}:0:0"] = {
                "observations": {"0": [values[0]], "1": [values[1]]}
            }

        source = {
            "id": "abs_fertiliser_source_concentration",
            "fetch_dataflow": "MERCH_IMP",
            "fetch_key": "562..TOT.M",
            "fetch_start_period": "2026-01",
            "fetch_commodity": "562",
        }
        with mock.patch.object(fetch_data.requests, "get", return_value=FakeResponse(json_doc=doc)) as get:
            out = fetch_data.fetch_abs_fertiliser_source_concentration(source)

        self.assertEqual(
            get.call_args.args[0],
            "https://data.api.abs.gov.au/rest/data/MERCH_IMP/562..TOT.M?format=jsondata&startPeriod=2026-01",
        )
        self.assertEqual(out["unit"], "%")
        self.assertEqual(out["last_data_point"], "2026-02-28")
        self.assertEqual(out["values"], [{"t": "2026-01", "v": 75.0}, {"t": "2026-02", "v": 85.0}])
        fields = out["extra"]["fields"]
        self.assertEqual(fields["top3_share_percent"], 85.0)
        self.assertEqual(fields["total_import_value_aud_thousands"], 2000)
        self.assertEqual([row["country"] for row in fields["top_countries"]], ["Saudi Arabia", "Morocco", "China"])

    def test_rba_f11_monthly_means(self):
        csv_text = "\n".join(
            [
                "Some intro",
                "More intro",
                "More intro",
                "More intro",
                "More intro",
                "More intro",
                "More intro",
                "More intro",
                "More intro",
                "Title,A$1=USD,Other",
                "Description,Australian dollar US dollar,Other",
                "Series ID,F11.1,Other",
                "01-Jan-2026,0.6500,x",
                "02-Jan-2026,0.6700,x",
                "03-Feb-2026,0.7000,x",
            ]
        )
        with mock.patch.object(fetch_data.requests, "get", return_value=FakeResponse(content=csv_text.encode("utf-8-sig"))):
            out = fetch_data.fetch_rba_f11("https://example.test/f11.csv")

        self.assertEqual(out["unit"], "USD per AUD")
        self.assertEqual(out["values"], [{"t": "2026-01", "v": 0.66}, {"t": "2026-02", "v": 0.7}])
        self.assertEqual(out["last_data_point"], "2026-02-03")

    def test_aps_xlsx_series_reads_named_sheet_and_column(self):
        import openpyxl

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Sales of products"
        ws.append(["Month", "Diesel oil: total (ML)"])
        ws.append([dt.date(2026, 1, 1), 1200.44])
        ws.append([dt.date(2026, 2, 1), 1300.56])

        source = {
            "id": "aps_sales_diesel",
            "fetch_url": "https://example.test/package",
            "aps_sheet": "Sales of products",
            "aps_column": "Diesel oil: total (ML)",
            "fetch_unit": "ML",
        }
        with mock.patch.object(fetch_data, "discover_aps_workbook_url", return_value="https://example.test/aps.xlsx"), \
             mock.patch.object(fetch_data, "load_xlsx_from_url", return_value=wb):
            out = fetch_data.fetch_aps_xlsx_series(source)

        self.assertEqual(out["unit"], "ML")
        self.assertEqual(out["values"], [{"t": "2026-01", "v": 1200.4}, {"t": "2026-02", "v": 1300.6}])
        self.assertEqual(out["last_data_point"], "2026-02-28")
        self.assertIn("Sales of products", out["notes"])

    def test_aip_tgp_monthly_average_from_workbook(self):
        import openpyxl

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Petrol TGP"
        ws.append(["Date", "National Average"])
        ws.append([dt.date(2026, 1, 1), 180.0])
        ws.append([dt.date(2026, 1, 2), 184.0])
        ws.append([dt.date(2026, 2, 1), 190.0])

        source = {"id": "aip_tgp", "fetch_url": "https://example.test/aip"}
        with mock.patch.object(fetch_data, "discover_aip_tgp_workbook_url", return_value="https://example.test/aip.xlsx"), \
             mock.patch.object(fetch_data, "load_xlsx_from_url", return_value=wb):
            out = fetch_data.fetch_aip_tgp(source)

        self.assertEqual(out["unit"], "cents per litre")
        self.assertEqual(out["values"], [{"t": "2026-01", "v": 182.0}, {"t": "2026-02", "v": 190.0}])
        self.assertEqual(out["last_data_point"], "2026-02-01")

    def test_retail_multistate_weighted_average(self):
        contributors = [
            {"state": "NSW", "average": 190.0, "stations": 10, "date": "2026-04-20"},
            {"state": "QLD", "average": 200.0, "stations": 20, "date": "2026-04-20"},
            {"state": "WA", "average": 220.0, "stations": 5, "date": "2026-04-20"},
        ]
        with mock.patch.object(fetch_data, "fetch_nsw_fuelcheck", return_value=contributors[0]), \
             mock.patch.object(fetch_data, "fetch_qld_open_data", return_value=contributors[1]), \
             mock.patch.object(fetch_data, "fetch_wa_fuelwatch", return_value=contributors[2]):
            out = fetch_data.fetch_retail_multistate({})

        self.assertEqual(out["unit"], "cents per litre")
        self.assertRegex(out["last_data_point"], r"^20\d{2}-\d{2}-\d{2}$")
        self.assertEqual(out["values"][0]["v"], 200.0)
        self.assertEqual(out["extra"]["fields"]["states"], contributors)


if __name__ == "__main__":
    unittest.main()
