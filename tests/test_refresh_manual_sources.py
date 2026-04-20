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
