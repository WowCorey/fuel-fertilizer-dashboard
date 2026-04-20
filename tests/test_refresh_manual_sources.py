from scripts import refresh_manual_sources


def test_to_month_token_handles_multiple_supported_formats():
    assert refresh_manual_sources.to_month_token("2026-04") == "2026-04"
    assert refresh_manual_sources.to_month_token("2026/04") == "2026-04"
    assert refresh_manual_sources.to_month_token("Apr 2026") == "2026-04"
    assert refresh_manual_sources.to_month_token("report for 2026-4 period") == "2026-04"


def test_parse_numeric_handles_currency_percent_and_parentheses():
    assert refresh_manual_sources.parse_numeric("$1,200.50") == 1200.5
    assert refresh_manual_sources.parse_numeric("(123)") == -123.0
    assert refresh_manual_sources.parse_numeric("7.1%") == 7.1
    assert refresh_manual_sources.parse_numeric("n/a") is None


def test_score_candidate_prefers_expected_format_and_penalizes_archives():
    good_pdf = "https://example.com/latest-report.pdf"
    old_pdf = "https://example.com/archive/older-report.pdf"
    assert refresh_manual_sources.score_candidate(good_pdf, "PDF") > refresh_manual_sources.score_candidate(old_pdf, "PDF")


def test_non_extractor_block_contains_reachability_metadata(monkeypatch):
    monkeypatch.setattr(refresh_manual_sources, "now_iso", lambda: "2026-04-20T00:00:00+00:00")
    source = {"id": "sample_manual"}

    block = refresh_manual_sources.non_extractor_block(
        source,
        "https://example.com/doc.pdf",
        "discovered_from_canonical:pdf",
        True,
        "HTTP 200",
    )

    assert block["status"] == "unavailable"
    assert block["extra"]["schema"] == refresh_manual_sources.EXTRA_SCHEMA
    assert block["extra"]["fields"]["reachable"] is True
    assert block["extra"]["fields"]["checked_at"] == "2026-04-20T00:00:00+00:00"


def test_extract_report_year_ignores_embedded_numeric_ids():
    text = "Corporate Tax Transparency Report 2019-20 income tax details"
    url = (
        "https://data.gov.au/data/dataset/c2524c87-cea4-4636-acac-599a82048a26/"
        "resource/db83/download/report.xlsx"
    )

    year = refresh_manual_sources.extract_report_year(text, url)

    assert year == 2020


def test_extract_report_year_rejects_implausible_future_year():
    text = "Annual report FY 2099 effective tax rate summary"

    try:
        refresh_manual_sources.extract_report_year(text, "https://example.com/report.pdf")
        assert False, "expected RuntimeError for implausible report year"
    except RuntimeError as exc:
        assert "could not infer a plausible report year" in str(exc)


def test_extract_direct_tax_rate_percent_requires_rate_label():
    missing = refresh_manual_sources.extract_direct_tax_rate_percent(
        "Profit before tax was 1234 and tax expense was 321."
    )
    assert missing is None

    found = refresh_manual_sources.extract_direct_tax_rate_percent(
        "Effective tax rate was 27.6% for the reporting period."
    )
    assert found == (27.6, "effective tax rate")


def test_extract_direct_tax_rate_percent_converts_fractional_values():
    found = refresh_manual_sources.extract_direct_tax_rate_percent(
        "Income tax rate 0.286 in the current year."
    )
    assert found == (28.6, "income tax rate")
