import datetime as dt

from scripts import validate_data


def test_is_iso_date_accepts_date_instances_and_strings():
    assert validate_data.is_iso_date(dt.date(2025, 1, 31))
    assert validate_data.is_iso_date("2025-01-31")


def test_is_iso_date_rejects_datetime_and_bad_strings():
    assert not validate_data.is_iso_date(dt.datetime(2025, 1, 31, 12, 0))
    assert not validate_data.is_iso_date("31-01-2025")
    assert not validate_data.is_iso_date("")


def test_validate_values_rejects_bool_and_bad_point_shapes(tmp_path):
    errors = []
    payload = [{"t": "2025-01", "v": True}, {"bad": "shape"}]
    path = validate_data.ROOT / "data" / "generated" / "sample.json"

    validate_data.validate_values(path, payload, errors)

    assert any("v must be numeric" in item["message"] for item in errors)
    assert any("t must be a non-empty string" in item["message"] for item in errors)


def test_has_structured_extra_requires_schema_and_fields():
    assert validate_data.has_structured_extra({"extra": {"schema": "x", "fields": {"a": 1}}})
    assert not validate_data.has_structured_extra({"extra": {"schema": "x"}})
    assert not validate_data.has_structured_extra({"extra": ["not-a-dict"]})


def test_check_stale_warns_when_last_data_point_exceeds_grace(tmp_path, monkeypatch):
    class FixedDateTime(dt.datetime):
        @classmethod
        def now(cls, tz=None):
            return cls(2026, 4, 20, 0, 0, tzinfo=dt.timezone.utc)

    monkeypatch.setattr(validate_data.dt, "datetime", FixedDateTime)
    warnings = []
    source = {"update_cadence": "monthly"}
    env = {"last_data_point": "2025-12-01"}
    path = validate_data.ROOT / "data" / "generated" / "monthly.json"

    validate_data.check_stale(path, env, source, warnings)

    assert any("may be stale for monthly cadence" in item["message"] for item in warnings)
