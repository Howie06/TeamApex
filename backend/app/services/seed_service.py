from __future__ import annotations

import json
from datetime import datetime

from app.core.config import DEFAULT_DATA_SOURCE
from app.core.database import get_connection, table_has_rows


LOCATION_SEEDS = [
    {
        "name": "Melbourne",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.8136,
        "longitude": 144.9631,
        "search_terms": "melbourne|victoria|cbd|city",
        "peak_window": "11:00 AM - 3:00 PM",
    },
    {
        "name": "Carlton",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.8006,
        "longitude": 144.9658,
        "search_terms": "carlton|melbourne|unimelb|rmit|parkville|inner north",
        "peak_window": "11:00 AM - 3:00 PM",
    },
    {
        "name": "Footscray",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.8002,
        "longitude": 144.9003,
        "search_terms": "footscray|melbourne|west|victoria university|inner west",
        "peak_window": "10:50 AM - 2:50 PM",
    },
    {
        "name": "St Kilda",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.8676,
        "longitude": 144.9809,
        "search_terms": "st kilda|stkilda|melbourne|beach|bayside|south",
        "peak_window": "11:00 AM - 3:00 PM",
    },
    {
        "name": "Carnegie",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.8863,
        "longitude": 145.0589,
        "search_terms": "carnegie|koornang|glen eira|caulfield|melbourne south east",
        "peak_window": "10:55 AM - 2:55 PM",
    },
    {
        "name": "Clayton",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.9151,
        "longitude": 145.1290,
        "search_terms": "clayton|monash|monash university|south east|melbourne",
        "peak_window": "10:55 AM - 2:55 PM",
    },
    {
        "name": "Box Hill",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.8189,
        "longitude": 145.1256,
        "search_terms": "box hill|boxhill|eastern suburbs|melbourne east",
        "peak_window": "10:55 AM - 2:55 PM",
    },
    {
        "name": "Dandenong",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.9875,
        "longitude": 145.2150,
        "search_terms": "dandenong|south east|greater dandenong|melbourne",
        "peak_window": "10:50 AM - 2:50 PM",
    },
    {
        "name": "Geelong",
        "state": "VIC",
        "country": "Australia",
        "latitude": -38.1499,
        "longitude": 144.3617,
        "search_terms": "geelong|victoria|coast|surf coast",
        "peak_window": "10:45 AM - 2:45 PM",
    },
    {
        "name": "Ballarat",
        "state": "VIC",
        "country": "Australia",
        "latitude": -37.5622,
        "longitude": 143.8503,
        "search_terms": "ballarat|victoria|regional",
        "peak_window": "11:00 AM - 2:30 PM",
    },
    {
        "name": "Bendigo",
        "state": "VIC",
        "country": "Australia",
        "latitude": -36.757,
        "longitude": 144.2794,
        "search_terms": "bendigo|victoria|regional",
        "peak_window": "10:45 AM - 2:45 PM",
    },
    {
        "name": "Warrnambool",
        "state": "VIC",
        "country": "Australia",
        "latitude": -38.3818,
        "longitude": 142.4879,
        "search_terms": "warrnambool|victoria|south west",
        "peak_window": "11:15 AM - 2:30 PM",
    },
    {
        "name": "Mildura",
        "state": "VIC",
        "country": "Australia",
        "latitude": -34.184,
        "longitude": 142.1628,
        "search_terms": "mildura|victoria|north west",
        "peak_window": "10:30 AM - 3:00 PM",
    },
]

UV_READING_SERIES = {
    "Melbourne": [2, 5, 8, 9, 6],
    "Carlton": [2, 5, 8, 9, 6],
    "Footscray": [2, 5, 8, 8, 6],
    "St Kilda": [2, 5, 8, 9, 6],
    "Carnegie": [2, 5, 8, 8, 6],
    "Clayton": [2, 5, 8, 8, 6],
    "Box Hill": [2, 5, 8, 8, 6],
    "Dandenong": [2, 5, 8, 9, 6],
    "Geelong": [2, 4, 7, 8, 5],
    "Ballarat": [1, 4, 7, 7, 4],
    "Bendigo": [2, 5, 8, 8, 5],
    "Warrnambool": [1, 3, 6, 7, 4],
    "Mildura": [3, 6, 9, 10, 7],
}

UV_TIMES = [
    "2026-03-11T08:00:00",
    "2026-03-11T10:00:00",
    "2026-03-11T12:00:00",
    "2026-03-11T14:00:00",
    "2026-03-11T16:00:00",
]

AWARENESS_STATS = [
    ("skin_cancer_trend", "2021", 34, "reported_cases_per_100k", "Earlier baseline for young adults.", 1),
    ("skin_cancer_trend", "2022", 41, "reported_cases_per_100k", "Awareness grows, but behaviour still lags.", 2),
    ("skin_cancer_trend", "2023", 47, "reported_cases_per_100k", "Younger cohorts continue to underestimate routine exposure.", 3),
    ("skin_cancer_trend", "2024", 56, "reported_cases_per_100k", "Trendlines reinforce the need for prevention habits.", 4),
    ("skin_cancer_trend", "2025", 64, "reported_cases_per_100k", "Current seeded demo peak for mentor review.", 5),
    ("uv_trend", "2019", 18, "high_uv_days", "High UV days in a typical season.", 1),
    ("uv_trend", "2020", 20, "high_uv_days", "A slight increase in strong UV exposure days.", 2),
    ("uv_trend", "2021", 22, "high_uv_days", "Higher sustained summer UV periods.", 3),
    ("uv_trend", "2022", 24, "high_uv_days", "More days needing proactive protection.", 4),
    ("uv_trend", "2023", 27, "high_uv_days", "Young adults face frequent high-risk windows.", 5),
    ("uv_trend", "2024", 29, "high_uv_days", "Seeded trend signals a rising burden of caution.", 6),
]

MYTH_FACTS = [
    (
        "Tanning myth",
        "A tan protects you from future UV damage.",
        "A tan is a visible sign of skin damage, not a reliable protective layer.",
        "behaviour",
        1,
    ),
    (
        "Weather myth",
        "Cool or cloudy weather means UV is not a problem.",
        "UV can remain high even when the temperature feels mild or clouds reduce visible brightness.",
        "weather",
        2,
    ),
    (
        "Skin tone myth",
        "Darker skin does not need sunscreen or UV protection.",
        "Darker skin may burn less visibly, but UV damage and eye exposure still matter.",
        "skin-tone",
        3,
    ),
    (
        "Application myth",
        "One sunscreen application in the morning lasts all day.",
        "Sunscreen needs enough coverage and timely reapplication, especially during long outdoor exposure.",
        "prevention",
        4,
    ),
]

PROTECTION_RULES = [
    {
        "min_uv": 0,
        "max_uv": 2.99,
        "risk_level": "Low",
        "clothing_advice": "Light coverage, sunglasses, and a hat are useful for longer outdoor periods.",
        "sunscreen_advice": "Apply sunscreen when you expect extended direct exposure.",
        "general_advice": "Low UV still adds up across long routines, so keep sun-safe habits consistent.",
        "checklist": [
            "Carry sunglasses",
            "Keep sunscreen available",
            "Plan for longer outdoor sessions",
        ],
        "dosage_advice": "Focus on exposed areas during longer outdoor exposure.",
        "dosage_guide": [
            {"area": "Face + neck", "amount": "0.5 tsp", "note": "Useful for walks and commuting."},
            {"area": "Both arms", "amount": "1 tsp", "note": "Apply if arms are uncovered."},
        ],
    },
    {
        "min_uv": 3,
        "max_uv": 5.99,
        "risk_level": "Moderate",
        "clothing_advice": "Add sunglasses, a brimmed hat, and lightweight shoulder coverage.",
        "sunscreen_advice": "Use SPF 50+ before midday exposure and reapply if you stay outside.",
        "general_advice": "Moderate UV should still trigger planned protection during study, commuting, and social time.",
        "checklist": [
            "Apply SPF 50+",
            "Pack sunglasses",
            "Choose shade when possible",
        ],
        "dosage_advice": "Cover face, neck, arms, and any uncovered upper body zones.",
        "dosage_guide": [
            {"area": "Face + neck", "amount": "0.5 tsp", "note": "Do not forget ears and nose."},
            {"area": "Both arms", "amount": "1 tsp", "note": "Cover the backs of hands too."},
            {"area": "Upper body", "amount": "1 tsp", "note": "Relevant for open necklines."},
        ],
    },
    {
        "min_uv": 6,
        "max_uv": 7.99,
        "risk_level": "High",
        "clothing_advice": "Use a wide-brim hat, sunglasses, and breathable long sleeves for midday exposure.",
        "sunscreen_advice": "Apply SPF 50+ generously and plan a reapplication reminder.",
        "general_advice": "High UV means visible heat is no longer a reliable cue. Protect exposed skin before going out.",
        "checklist": [
            "Wide-brim hat",
            "SPF 50+ before leaving",
            "Set reapply reminder",
        ],
        "dosage_advice": "Prioritise consistent, full exposed-area coverage.",
        "dosage_guide": [
            {"area": "Face + neck", "amount": "0.5 tsp", "note": "Apply carefully across high points."},
            {"area": "Both arms", "amount": "1 tsp", "note": "Needed for short sleeves or rolled cuffs."},
            {"area": "Upper body", "amount": "1 tsp", "note": "Useful for outdoor recreation."},
            {"area": "Both legs", "amount": "2 tsp", "note": "Relevant for shorts or activewear."},
        ],
    },
    {
        "min_uv": 8,
        "max_uv": 10.99,
        "risk_level": "Very High",
        "clothing_advice": "Use a wide-brim hat, UV-rated sunglasses, and light long sleeves wherever possible.",
        "sunscreen_advice": "Apply SPF 50+ before exposure and reapply during long outdoor periods.",
        "general_advice": "Very high UV can damage skin quickly, so combine shade, clothing, and sunscreen instead of relying on one measure.",
        "checklist": [
            "SPF 50+ before next walk",
            "Hat and sunglasses packed",
            "Long sleeves ready for peak UV",
        ],
        "dosage_advice": "Treat this as full exposed-area coverage before outdoor activity.",
        "dosage_guide": [
            {"area": "Face + neck", "amount": "0.5 tsp", "note": "Apply first, especially nose and hairline."},
            {"area": "Both arms", "amount": "1 tsp", "note": "Cover forearms and backs of hands."},
            {"area": "Upper body", "amount": "1 tsp", "note": "Needed for sportswear and open shirts."},
            {"area": "Both legs", "amount": "2 tsp", "note": "Important for shorts or skirts."},
        ],
    },
    {
        "min_uv": 11,
        "max_uv": 20,
        "risk_level": "Extreme",
        "clothing_advice": "Maximise coverage with long sleeves, a broad-brim hat, sunglasses, and shade-first movement.",
        "sunscreen_advice": "Apply SPF 50+ generously, reapply on schedule, and avoid assuming short exposure is safe.",
        "general_advice": "Extreme UV conditions need immediate protection and reduced peak-time exposure wherever possible.",
        "checklist": [
            "Full coverage clothing",
            "Strict sunscreen reapplication",
            "Avoid peak sun where possible",
        ],
        "dosage_advice": "Use the highest coverage routine across all exposed areas.",
        "dosage_guide": [
            {"area": "Face + neck", "amount": "0.5 tsp", "note": "Repeat carefully around facial high points."},
            {"area": "Both arms", "amount": "1 tsp", "note": "Use enough product for full coverage."},
            {"area": "Upper body", "amount": "1 tsp", "note": "Relevant for all uncovered torso areas."},
            {"area": "Both legs", "amount": "2 tsp", "note": "Cover all exposed lower-body skin."},
        ],
    },
]

SKIN_TONE_GUIDANCE = [
    ("light", 0, 20, "10-15 min", "Higher sensitivity. Early protection matters even when the day feels mild.", "Use SPF 50+, shade first, and reapply before the peak block starts."),
    ("medium", 0, 20, "20-30 min", "Can still burn quickly during strong UV periods, especially on shoulders, nose, and neck.", "Pack sunglasses and a hat, and do not assume a tan equals protection."),
    ("olive", 0, 20, "30-40 min", "Visible burning may take longer, but DNA damage still builds under strong UV.", "Use lightweight long sleeves and keep reapplication on schedule."),
    ("deep", 0, 20, "40+ min", "Lower burn visibility does not remove the need for eye and skin protection.", "Prioritise sunglasses, sunscreen, and midday shade for consistent prevention."),
]

REMINDER_SEEDS = [
    {
        "title": "Midday sunscreen reminder",
        "reminder_time": "12:30 PM",
        "frequency": "daily",
        "status": "active",
        "notes": "Useful before lunch or between classes.",
    },
    {
        "title": "Afternoon reapply reminder",
        "reminder_time": "03:15 PM",
        "frequency": "weekdays",
        "status": "active",
        "notes": "Supports long outdoor commutes and sport.",
    },
]


def _clear_tables(connection) -> None:
    for table_name in [
        "uv_readings",
        "awareness_stats",
        "protection_rules",
        "myth_facts",
        "skin_tone_guidance",
        "reminders",
        "locations",
    ]:
        connection.execute(f"DELETE FROM {table_name}")


def _seed_locations(connection) -> dict[str, int]:
    for location in LOCATION_SEEDS:
        connection.execute(
            """
            INSERT INTO locations (name, state, country, latitude, longitude, search_terms, peak_window)
            VALUES (:name, :state, :country, :latitude, :longitude, :search_terms, :peak_window)
            """,
            location,
        )

    rows = connection.execute("SELECT id, name FROM locations").fetchall()
    return {row["name"]: row["id"] for row in rows}


def _seed_uv_readings(connection, location_ids: dict[str, int]) -> None:
    for location_name, values in UV_READING_SERIES.items():
        location_id = location_ids[location_name]
        for recorded_at, uv_index in zip(UV_TIMES, values, strict=True):
            connection.execute(
                """
                INSERT INTO uv_readings (location_id, uv_index, recorded_at, source)
                VALUES (?, ?, ?, ?)
                """,
                (location_id, uv_index, recorded_at, DEFAULT_DATA_SOURCE),
            )


def _seed_awareness(connection) -> None:
    connection.executemany(
        """
        INSERT INTO awareness_stats (category, label, metric_value, unit, description, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        AWARENESS_STATS,
    )


def _seed_myths(connection) -> None:
    connection.executemany(
        """
        INSERT INTO myth_facts (title, myth, fact, category, sort_order)
        VALUES (?, ?, ?, ?, ?)
        """,
        MYTH_FACTS,
    )


def _seed_protection_rules(connection) -> None:
    for rule in PROTECTION_RULES:
        connection.execute(
            """
            INSERT INTO protection_rules (
                min_uv,
                max_uv,
                risk_level,
                clothing_advice,
                sunscreen_advice,
                general_advice,
                checklist_json,
                dosage_advice,
                dosage_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                rule["min_uv"],
                rule["max_uv"],
                rule["risk_level"],
                rule["clothing_advice"],
                rule["sunscreen_advice"],
                rule["general_advice"],
                json.dumps(rule["checklist"]),
                rule["dosage_advice"],
                json.dumps(rule["dosage_guide"]),
            ),
        )


def _seed_skin_tone_guidance(connection) -> None:
    connection.executemany(
        """
        INSERT INTO skin_tone_guidance (
            skin_type,
            min_uv,
            max_uv,
            burn_window,
            guidance,
            emphasis
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        SKIN_TONE_GUIDANCE,
    )


def _seed_reminders(connection) -> None:
    now = datetime.now().isoformat(timespec="seconds")
    for reminder in REMINDER_SEEDS:
        connection.execute(
            """
            INSERT INTO reminders (title, reminder_time, frequency, status, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                reminder["title"],
                reminder["reminder_time"],
                reminder["frequency"],
                reminder["status"],
                reminder["notes"],
                now,
                now,
            ),
        )


def seed_database(force: bool = False) -> None:
    required_tables = [
        "locations",
        "uv_readings",
        "awareness_stats",
        "protection_rules",
        "myth_facts",
        "skin_tone_guidance",
        "reminders",
    ]

    if not force and all(table_has_rows(table_name) for table_name in required_tables):
        return

    with get_connection() as connection:
        _clear_tables(connection)

        location_ids = _seed_locations(connection)
        _seed_uv_readings(connection, location_ids)
        _seed_awareness(connection)
        _seed_myths(connection)
        _seed_protection_rules(connection)
        _seed_skin_tone_guidance(connection)
        _seed_reminders(connection)
        connection.commit()
