from __future__ import annotations

import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import DATABASE_PATH
from app.core.database import initialize_database


if __name__ == "__main__":
    initialize_database()
    print(f"Initialized SQLite database at {DATABASE_PATH}")
