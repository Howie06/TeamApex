from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from typing import Iterator

from app.core.config import DATABASE_PATH


SCHEMA_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        state TEXT NOT NULL,
        country TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        search_terms TEXT NOT NULL DEFAULT '',
        peak_window TEXT NOT NULL DEFAULT ''
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS uv_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id INTEGER NOT NULL,
        uv_index REAL NOT NULL,
        recorded_at TEXT NOT NULL,
        source TEXT NOT NULL,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS awareness_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        label TEXT NOT NULL,
        metric_value REAL NOT NULL,
        unit TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS protection_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        min_uv REAL NOT NULL,
        max_uv REAL NOT NULL,
        risk_level TEXT NOT NULL,
        clothing_advice TEXT NOT NULL,
        sunscreen_advice TEXT NOT NULL,
        general_advice TEXT NOT NULL,
        checklist_json TEXT NOT NULL DEFAULT '[]',
        dosage_advice TEXT NOT NULL DEFAULT '',
        dosage_json TEXT NOT NULL DEFAULT '[]'
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS myth_facts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        myth TEXT NOT NULL,
        fact TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        sort_order INTEGER NOT NULL DEFAULT 0
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS skin_tone_guidance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skin_type TEXT NOT NULL,
        min_uv REAL NOT NULL,
        max_uv REAL NOT NULL,
        burn_window TEXT NOT NULL,
        guidance TEXT NOT NULL,
        emphasis TEXT NOT NULL
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        reminder_time TEXT NOT NULL,
        frequency TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """,
]


def create_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    connection = create_connection()
    try:
        yield connection
    finally:
        connection.close()


def initialize_database() -> None:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with get_connection() as connection:
        for statement in SCHEMA_STATEMENTS:
            connection.execute(statement)
        connection.commit()


def table_has_rows(table_name: str) -> bool:
    with get_connection() as connection:
        row = connection.execute(f"SELECT COUNT(*) AS count FROM {table_name}").fetchone()
    return bool(row["count"])
