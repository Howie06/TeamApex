from __future__ import annotations

import os
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATABASE_PATH = BACKEND_DIR / "app.db"

FRONTEND_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

DEFAULT_LOCATION_NAME = os.getenv("DEFAULT_LOCATION_NAME", "Melbourne")
DEFAULT_DATA_SOURCE = "Seeded university onboarding dataset"
UV_PROVIDER_MODE = os.getenv("UV_PROVIDER_MODE", "mock")
