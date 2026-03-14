import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from psycopg import connect
from psycopg.rows import dict_row

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

OPENWEATHER_URL = "https://api.openweathermap.org/data/3.0/onecall"

app = FastAPI(
    title="TeamApex API",
    version="0.1.0",
    description="Minimal FastAPI backend for the TeamApex UV project.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise HTTPException(status_code=500, detail="DATABASE_URL is not configured.")
    return database_url


def get_openweather_api_key() -> str:
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENWEATHER_API_KEY is not configured.")
    return api_key


def get_location_coordinates_from_db(postcode: str, suburb: str) -> dict[str, object]:
    try:
        with connect(get_database_url(), row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select postcode, suburb, state, latitude, longitude
                    from postcodes_geo
                    where postcode = %s
                      and lower(suburb) = lower(%s)
                    limit 1
                    """,
                    (postcode, suburb),
                )
                result = cursor.fetchone()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to query location data.") from exc

    if result is None:
        raise HTTPException(status_code=404, detail="No matching postcode and suburb found.")

    return result


def fetch_openweather_current(latitude: float, longitude: float) -> dict[str, object]:
    params = {
        "lat": latitude,
        "lon": longitude,
        "exclude": "minutely,hourly,daily,alerts",
        "units": "metric",
        "appid": get_openweather_api_key(),
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(OPENWEATHER_URL, params=params)
            response.raise_for_status()
    except HTTPException:
        raise
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"OpenWeather request failed with status {exc.response.status_code}.",
        ) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Failed to reach OpenWeather.") from exc

    return response.json()


def classify_uv_risk(uv_index: float) -> str:
    if uv_index < 3:
        return "Low"
    if uv_index < 6:
        return "Moderate"
    if uv_index < 8:
        return "High"
    if uv_index < 11:
        return "Very High"
    return "Extreme"


def format_updated_at(timestamp: int, timezone_offset: int) -> str:
    local_timezone = timezone(timedelta(seconds=timezone_offset))
    local_datetime = datetime.fromtimestamp(timestamp, tz=local_timezone)
    return local_datetime.strftime("%d %b, %I:%M %p")


@app.get("/")
def read_root():
    return {
        "name": "TeamApex API",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/uv/current")
def get_current_uv(
    postcode: str = Query(..., min_length=4, max_length=5),
    suburb: str = Query(..., min_length=1, max_length=100),
):
    normalized_postcode = postcode.strip()
    normalized_suburb = suburb.strip()

    if not normalized_postcode.isdigit():
        raise HTTPException(status_code=422, detail="postcode must contain only digits.")

    location = get_location_coordinates_from_db(normalized_postcode, normalized_suburb)
    latitude = float(location["latitude"])
    longitude = float(location["longitude"])
    weather = fetch_openweather_current(latitude, longitude)
    current = weather.get("current")

    if not isinstance(current, dict):
        raise HTTPException(status_code=502, detail="OpenWeather response missing current data.")

    uv_index = float(current.get("uvi", 0))
    updated_at = format_updated_at(
        int(current.get("dt", 0)),
        int(weather.get("timezone_offset", 0)),
    )

    return {
        "postcode": location["postcode"],
        "suburb": location["suburb"],
        "state": location["state"],
        "latitude": latitude,
        "longitude": longitude,
        "location": f"{location['suburb']}, {location['state']}",
        "uvIndex": uv_index,
        "risk": classify_uv_risk(uv_index),
        "updatedAt": updated_at,
        "temperature": current.get("temp"),
        "weather": ((current.get("weather") or [{}])[0]).get("description"),
    }


@app.get("/api/location/coordinates")
def get_location_coordinates(
    postcode: str = Query(..., min_length=4, max_length=5),
    suburb: str = Query(..., min_length=1, max_length=100),
):
    normalized_postcode = postcode.strip()
    normalized_suburb = suburb.strip()

    if not normalized_postcode.isdigit():
        raise HTTPException(status_code=422, detail="postcode must contain only digits.")

    result = get_location_coordinates_from_db(normalized_postcode, normalized_suburb)

    return {
        "postcode": result["postcode"],
        "suburb": result["suburb"],
        "state": result["state"],
        "latitude": float(result["latitude"]),
        "longitude": float(result["longitude"]),
    }
