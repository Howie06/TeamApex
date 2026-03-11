from __future__ import annotations

import argparse
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.bootstrap import bootstrap_database
from app.core.config import DATABASE_PATH


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the TeamApex SQLite database.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Clear seeded tables before reseeding.",
    )
    args = parser.parse_args()

    bootstrap_database(force_seed=args.force)
    print(f"Seeded SQLite database at {DATABASE_PATH}")
