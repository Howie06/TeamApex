from __future__ import annotations

from app.core.database import initialize_database
from app.services.seed_service import seed_database


def bootstrap_database(force_seed: bool = False) -> None:
    initialize_database()
    seed_database(force=force_seed)
