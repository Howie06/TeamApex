from __future__ import annotations

from app.core.config import DEFAULT_DATA_SOURCE
from app.core.database import get_connection
from app.core.exceptions import NotFoundError
from app.schemas.awareness import (
    AwarenessPoint,
    AwarenessTrendResponse,
    MythFactListResponse,
    MythFactResponse,
)


TREND_METADATA = {
    "skin_cancer_trend": {
        "title": "Skin cancer trend",
        "metric": "reported_cases_per_100k",
    },
    "uv_trend": {
        "title": "UV exposure trend",
        "metric": "high_uv_days",
    },
}


def _get_trend(category: str) -> AwarenessTrendResponse:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT label, metric_value, description
            FROM awareness_stats
            WHERE category = ?
            ORDER BY sort_order ASC
            """,
            (category,),
        ).fetchall()

    if not rows:
        raise NotFoundError(f"No awareness data found for category '{category}'.")

    metadata = TREND_METADATA[category]
    return AwarenessTrendResponse(
        title=metadata["title"],
        metric=metadata["metric"],
        source=DEFAULT_DATA_SOURCE,
        series=[
            AwarenessPoint(
                label=row["label"],
                value=row["metric_value"],
                description=row["description"],
            )
            for row in rows
        ],
    )


def get_skin_cancer_trend() -> AwarenessTrendResponse:
    return _get_trend("skin_cancer_trend")


def get_uv_trend() -> AwarenessTrendResponse:
    return _get_trend("uv_trend")


def get_myths() -> MythFactListResponse:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, title, myth, fact, category
            FROM myth_facts
            ORDER BY sort_order ASC
            """
        ).fetchall()

    if not rows:
        raise NotFoundError("No myth and fact records were found.")

    return MythFactListResponse(
        source=DEFAULT_DATA_SOURCE,
        items=[
            MythFactResponse(
                id=row["id"],
                title=row["title"],
                myth=row["myth"],
                fact=row["fact"],
                category=row["category"],
            )
            for row in rows
        ],
    )
