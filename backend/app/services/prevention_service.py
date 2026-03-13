from __future__ import annotations

import json

from app.core.database import get_connection
from app.core.exceptions import NotFoundError
from app.schemas.prevention import (
    DosageGuideItem,
    PreventionRecommendationResponse,
    SkinGuidanceResponse,
    SunscreenDosageResponse,
)
from app.services.risk_service import map_uv_risk

NO_CURRENT_UV_THRESHOLD = 0.2


def _get_rule_for_uv(uv_index: float):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM protection_rules
            WHERE min_uv <= ? AND max_uv >= ?
            ORDER BY min_uv DESC
            LIMIT 1
            """,
            (uv_index, uv_index),
        ).fetchone()

    if row is None:
        raise NotFoundError(f"No protection rule found for UV index {uv_index}.")

    return row


def get_recommendations(uv_index: float) -> PreventionRecommendationResponse:
    if uv_index <= NO_CURRENT_UV_THRESHOLD:
        return PreventionRecommendationResponse(
            uv_index=uv_index,
            risk_level="No current",
            clothing_advice="No special sun-protective clothing is needed right now under UV 0 conditions.",
            sunscreen_advice="Sunscreen is not needed for the current conditions.",
            general_advice="If you expect to go outside during daylight later, check the UV again closer to that time.",
            checklist=[
                "No immediate UV protection action is needed",
                "Check UV again before the next daytime outing",
            ],
        )

    rule = _get_rule_for_uv(uv_index)
    risk = map_uv_risk(uv_index, "Victoria")

    return PreventionRecommendationResponse(
        uv_index=uv_index,
        risk_level=risk.level,
        clothing_advice=rule["clothing_advice"],
        sunscreen_advice=rule["sunscreen_advice"],
        general_advice=rule["general_advice"],
        checklist=json.loads(rule["checklist_json"]),
    )


def get_sunscreen_dosage(uv_index: float) -> SunscreenDosageResponse:
    if uv_index <= NO_CURRENT_UV_THRESHOLD:
        return SunscreenDosageResponse(
            uv_index=uv_index,
            risk_level="No current",
            dosage_advice="No sunscreen dose is needed right now under UV 0 conditions.",
            dosage_guide=[
                DosageGuideItem(
                    area="Current conditions",
                    amount="No dose needed",
                    note="Check again before the next daytime outdoor session.",
                )
            ],
        )

    rule = _get_rule_for_uv(uv_index)
    risk = map_uv_risk(uv_index, "Victoria")

    return SunscreenDosageResponse(
        uv_index=uv_index,
        risk_level=risk.level,
        dosage_advice=rule["dosage_advice"],
        dosage_guide=[
            DosageGuideItem(**item) for item in json.loads(rule["dosage_json"])
        ],
    )


def get_skin_guidance(uv_index: float, skin_type: str) -> SkinGuidanceResponse:
    normalized_skin_type = skin_type.strip().lower()

    if uv_index <= NO_CURRENT_UV_THRESHOLD:
        return SkinGuidanceResponse(
            uv_index=uv_index,
            skin_type=normalized_skin_type,
            burn_window="No immediate burn risk",
            guidance="UV is effectively zero right now, so active sun protection is not needed until daytime UV rises again.",
            emphasis="Use this time to plan ahead for the next daytime outing rather than reapplying sunscreen now.",
        )

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM skin_tone_guidance
            WHERE lower(skin_type) = ?
              AND min_uv <= ?
              AND max_uv >= ?
            LIMIT 1
            """,
            (normalized_skin_type, uv_index, uv_index),
        ).fetchone()

    if row is None:
        raise NotFoundError(
            f"No skin guidance found for skin_type '{skin_type}' and UV index {uv_index}."
        )

    return SkinGuidanceResponse(
        uv_index=uv_index,
        skin_type=row["skin_type"],
        burn_window=row["burn_window"],
        guidance=row["guidance"],
        emphasis=row["emphasis"],
    )
