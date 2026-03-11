# FastAPI Backend

This backend supports the TeamApex sun-safety onboarding project for young adults in Victoria, Australia.

## Stack

- FastAPI
- SQLite
- Seeded demo data for locations, UV, awareness, prevention rules, myths, and reminders
- Mock UV provider with a clear extension point for real APIs

## Project Structure

```text
backend/
  app/
    core/        # config, DB setup, bootstrap, app exceptions
    models/      # lightweight entities
    providers/   # UV provider abstraction
    routers/     # API route groups
    schemas/     # request and response models
    services/    # business logic
    main.py      # FastAPI entrypoint
  scripts/
    init_db.py
    seed_db.py
  requirements.txt
```

## Setup

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

## Run

```powershell
python backend\scripts\init_db.py
python backend\scripts\seed_db.py --force
python -m uvicorn app.main:app --reload --app-dir backend
```

Swagger docs: `http://127.0.0.1:8000/docs`

## Environment

Optional variables:

- `CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`
- `DEFAULT_LOCATION_NAME=Melbourne`
- `UV_PROVIDER_MODE=hybrid`
- `OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1/forecast`
- `UV_REQUEST_TIMEOUT_SECONDS=8`

## Endpoints

### Health

- `GET /health`

### Locations

- `GET /api/locations`
- `GET /api/locations/search?q=melb`

### UV

- `GET /api/uv/current?location=Melbourne`
- `GET /api/uv/by-coordinates?lat=-37.8136&lng=144.9631`
- `GET /api/uv/history?location=Geelong`

Returns:

- `location`
- `uv_index`
- `risk_level`
- `risk_color`
- `warning_message`
- `human_alert`
- `estimated_damage_window`
- `recorded_at`
- `source`
- `peak_window` for current UV

### Awareness

- `GET /api/awareness/skin-cancer-trend`
- `GET /api/awareness/uv-trend`
- `GET /api/awareness/myths`

### Prevention

- `GET /api/prevention/recommendations?uv_index=8`
- `GET /api/prevention/sunscreen-dosage?uv_index=8`
- `GET /api/prevention/skin-guidance?uv_index=8&skin_type=medium`

### Reminders

- `GET /api/reminders`
- `POST /api/reminders`
- `PATCH /api/reminders/{id}`
- `DELETE /api/reminders/{id}`

Example create payload:

```json
{
  "title": "Campus sports sunscreen reminder",
  "reminder_time": "01:00 PM",
  "frequency": "weekdays",
  "status": "active",
  "notes": "Reapply before training."
}
```

## Seeded Demo Scope

- Locations are seeded for Victoria, Australia
- UV values are seeded for demo stability
- Awareness and myth/fact responses are chart-friendly JSON
- Protection rules cover UV-driven clothing and sunscreen guidance

## Frontend Integration

- CORS is enabled for Vite on port `5173`
- The backend is suitable for a frontend to replace static seed data incrementally
- In `hybrid` mode the backend tries Open-Meteo first and falls back to seeded SQLite UV data if the live request fails
