# TeamApex

TeamApex is a university onboarding iteration project about the generational shift in sun-safety attitudes. The repository contains a React frontend and a FastAPI backend for a web-based sun-safety experience focused on young adults in Victoria, Australia.

## Frontend

The frontend is a Vite + React + TypeScript app in the project root.

```powershell
npm install
npm run dev
```

## Backend

The backend lives in `backend/` and provides:

- health checks
- location search
- seeded UV endpoints
- awareness trend data
- prevention guidance
- reminder CRUD

Quick start:

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python backend\scripts\init_db.py
python backend\scripts\seed_db.py --force
python -m uvicorn app.main:app --reload --app-dir backend
```

Frontend can point at the backend with:

```powershell
$env:VITE_API_BASE_URL="http://127.0.0.1:8000"
npm run dev
```

Useful URLs:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`

More backend details are documented in `backend/README.md`.
