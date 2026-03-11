from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class UVRiskProfile:
    level: str
    color: str
    warning_message: str


def map_uv_risk(uv_index: float, location_name: str) -> UVRiskProfile:
    if uv_index <= 2:
        return UVRiskProfile(
            level="Low",
            color="#2E8B57",
            warning_message=(
                f"Low UV in {location_name}. Protection is still recommended for long outdoor exposure."
            ),
        )

    if uv_index <= 5:
        return UVRiskProfile(
            level="Moderate",
            color="#D4A017",
            warning_message=(
                f"Moderate UV in {location_name}. Use sunscreen, sunglasses, and plan around midday sun."
            ),
        )

    if uv_index <= 7:
        return UVRiskProfile(
            level="High",
            color="#F28C28",
            warning_message=(
                f"High UV in {location_name}. Limit direct sun exposure and apply SPF 50+ before going outside."
            ),
        )

    if uv_index <= 10:
        return UVRiskProfile(
            level="Very High",
            color="#D94841",
            warning_message=(
                f"Very high UV in {location_name}. Skin damage can happen quickly, so use shade, clothing, and sunscreen together."
            ),
        )

    return UVRiskProfile(
        level="Extreme",
        color="#7A306C",
        warning_message=(
            f"Extreme UV in {location_name}. Avoid peak sun where possible and use full protection immediately."
        ),
    )
