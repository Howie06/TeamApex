from __future__ import annotations

import os
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATABASE_PATH = BACKEND_DIR / "app.db"

FRONTEND_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://stately-florentine-f56527.netlify.app",
    ).split(",")
    if origin.strip()
]
FRONTEND_ORIGIN_REGEX = os.getenv(
    "CORS_ORIGIN_REGEX",
    r"https://.*\.(netlify\.app|onrender\.com)",
) or None

DEFAULT_LOCATION_NAME = os.getenv("DEFAULT_LOCATION_NAME", "Melbourne")
DEFAULT_DATA_SOURCE = "Seeded university onboarding dataset"
UV_PROVIDER_MODE = os.getenv("UV_PROVIDER_MODE", "hybrid")
OPEN_METEO_BASE_URL = os.getenv(
    "OPEN_METEO_BASE_URL",
    "https://api.open-meteo.com/v1/forecast",
)
UV_REQUEST_TIMEOUT_SECONDS = float(os.getenv("UV_REQUEST_TIMEOUT_SECONDS", "15"))
