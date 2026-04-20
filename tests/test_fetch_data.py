import json

from scripts import fetch_data


def test_retail_result_filters_non_positive_prices_and_computes_average():
    result = fetch_data.retail_result("WA", [0, -1, 179.9, 180.1], "2026-04-20", "sample")

    assert result is not None
    assert result["state"] == "WA"
    assert result["stations"] == 2
    assert result["average"] == 180.0


def test_source_check_url_prefers_fetch_url_for_default_mode():
    source = {
        "url": "https://example.com/origin",
        "canonical_url": "https://example.com/canonical",
        "fetch_url": "https://example.com/fetch",
    }
    assert fetch_data.source_check_url(source, all_links=False) == "https://example.com/fetch"


def test_source_check_url_prefers_canonical_for_all_links_mode():
    source = {
        "url": "https://example.com/origin",
        "canonical_url": "https://example.com/canonical",
        "fetch_url": "https://example.com/fetch",
    }
    assert fetch_data.source_check_url(source, all_links=True) == "https://example.com/canonical"


def test_private_feed_enabled_respects_gate(monkeypatch):
    monkeypatch.delenv("TAPIS_ENABLE_PRIVATE_FEED", raising=False)
    assert fetch_data.private_feed_enabled({"private_feed_gate": True}) is False

    monkeypatch.setenv("TAPIS_ENABLE_PRIVATE_FEED", "1")
    assert fetch_data.private_feed_enabled({"private_feed_gate": True}) is True
    assert fetch_data.private_feed_enabled({"private_feed_gate": False}) is True


def test_source_check_policy_defaults_to_blocking():
    policy, note = fetch_data.source_check_policy({})
    assert policy == "blocking"
    assert "blocking" in note


def test_source_check_policy_non_blocking_uses_reason():
    policy, note = fetch_data.source_check_policy(
        {"check_policy": "non_blocking", "check_policy_reason": "anti-bot"}
    )
    assert policy == "non_blocking"
    assert note == "anti-bot"


def test_fetch_abs_petroleum_imports_yoy_derives_expected_values(tmp_path, monkeypatch):
    generated_dir = tmp_path / "generated"
    generated_dir.mkdir(parents=True, exist_ok=True)
    parent = {
        "status": "ok",
        "source_url": "https://example.com/source",
        "last_data_point": "2026-02-01",
        "values": [{"t": f"2025-{month:02d}", "v": 100.0 + month} for month in range(1, 13)]
        + [{"t": "2026-01", "v": 111.1}, {"t": "2026-02", "v": 112.2}],
    }
    with (generated_dir / "abs_petroleum_imports.json").open("w", encoding="utf-8") as f:
        json.dump(parent, f)

    monkeypatch.setattr(fetch_data, "GENERATED_DIR", generated_dir)
    source = {"id": "abs_petroleum_imports_yoy", "derived_from": "abs_petroleum_imports"}

    result = fetch_data.fetch_abs_petroleum_imports_yoy(source)

    assert result["unit"] == "%"
    assert result["last_data_point"] == "2026-02-01"
    assert result["values"] == [{"t": "2026-01", "v": 10.0}, {"t": "2026-02", "v": 10.0}]
