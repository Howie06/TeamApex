from __future__ import annotations

from dataclasses import dataclass

NO_CURRENT_UV_THRESHOLD = 0.2


@dataclass(frozen=True, slots=True)
class UVRiskProfile:
    level: str
    color: str
    warning_message: str
    human_alert: str
    estimated_damage_window: str


def _estimate_damage_minutes(uv_index: float) -> int:
    if uv_index <= NO_CURRENT_UV_THRESHOLD:
        return 120

    return max(8, min(120, round(96 / uv_index)))


def _format_damage_window(uv_index: float) -> str:
    minutes = _estimate_damage_minutes(uv_index)

    if minutes >= 60:
        lower = max(45, minutes - 15)
        upper = minutes
        return f"{lower}-{upper} minutes"

    if minutes >= 20:
        lower = max(15, minutes - 5)
        upper = minutes + 5
        return f"{lower}-{upper} minutes"

    return f"{max(5, minutes - 2)}-{minutes + 2} minutes"


def _build_human_alert(uv_index: float, location_name: str, action: str) -> str:
    minutes = _estimate_damage_minutes(uv_index)
    return (
        f"Unprotected skin may start taking damage in about {minutes} minutes in "
        f"{location_name}. {action}"
    )


def map_uv_risk(uv_index: float, location_name: str) -> UVRiskProfile:
    if uv_index <= NO_CURRENT_UV_THRESHOLD:
        return UVRiskProfile(
            level="No current",
            color="#5B8DEF",
            warning_message=(
                f"UV is currently negligible in {location_name}. Active sun protection is not needed right now."
            ),
            human_alert=(
                f"Current UV is 0 in {location_name}. No immediate sun-protection action is needed unless you are planning ahead for the next daytime outing."
            ),
            estimated_damage_window="No immediate UV damage risk",
        )

    estimated_damage_window = _format_damage_window(uv_index)

    if uv_index <= 2:
        return UVRiskProfile(
            level="Low",
            color="#2E8B57",
            warning_message=(
                f"Low UV in {location_name}. Protection is still recommended for long outdoor exposure."
            ),
            human_alert=_build_human_alert(
                uv_index,
                location_name,
                "Keep sunscreen nearby for long outdoor sessions.",
            ),
            estimated_damage_window=estimated_damage_window,
        )

    if uv_index <= 5:
        return UVRiskProfile(
            level="Moderate",
            color="#D4A017",
            warning_message=(
                f"Moderate UV in {location_name}. Use sunscreen, sunglasses, and plan around midday sun."
            ),
            human_alert=_build_human_alert(
                uv_index,
                location_name,
                "Pack sunscreen and choose shade before midday exposure builds.",
            ),
            estimated_damage_window=estimated_damage_window,
        )

    if uv_index <= 7:
        return UVRiskProfile(
            level="High",
            color="#F28C28",
            warning_message=(
                f"High UV in {location_name}. Limit direct sun exposure and apply SPF 50+ before going outside."
            ),
            human_alert=_build_human_alert(
                uv_index,
                location_name,
                "Apply SPF 50+ and shorten open-sun time now.",
            ),
            estimated_damage_window=estimated_damage_window,
        )

    if uv_index <= 10:
        return UVRiskProfile(
            level="Very High",
            color="#D94841",
            warning_message=(
                f"Very high UV in {location_name}. Skin damage can happen quickly, so use shade, clothing, and sunscreen together."
            ),
            human_alert=_build_human_alert(
                uv_index,
                location_name,
                "Find shade now and use clothing plus sunscreen together.",
            ),
            estimated_damage_window=estimated_damage_window,
        )

    return UVRiskProfile(
        level="Extreme",
        color="#7A306C",
        warning_message=(
            f"Extreme UV in {location_name}. Avoid peak sun where possible and use full protection immediately."
        ),
        human_alert=_build_human_alert(
            uv_index,
            location_name,
            "Move indoors or under deep shade immediately and fully cover exposed skin.",
        ),
        estimated_damage_window=estimated_damage_window,
    )
