# TeamApex

This project now contains:

- a React + TypeScript + Vite frontend in the project root
- a minimal FastAPI backend in [backend](d:\5120prototype\UV\TeamApex\backend)

## Frontend

Install frontend dependencies:

```powershell
npm install
```

Run the frontend dev server:

```powershell
npm run dev
```

## Backend

Backend files live in [backend](d:\5120prototype\UV\TeamApex\backend).

Quick start:

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn app.main:app --reload --app-dir backend
```

Useful backend URLs after startup:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/api/uv/current`

## Current limitation

Python is not installed in the current environment, so the FastAPI server could not be started or verified here. The backend structure and instructions are in place.
