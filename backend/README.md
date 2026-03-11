# FastAPI Backend

This folder contains a minimal FastAPI backend for the TeamApex project.

## 1. Install Python

Install Python 3.11 or newer and make sure `python` is available in your terminal.

## 2. Create a virtual environment

From the project root:

```powershell
python -m venv backend\.venv
```

## 3. Activate the virtual environment

On PowerShell:

```powershell
backend\.venv\Scripts\Activate.ps1
```

## 4. Install backend dependencies

```powershell
python -m pip install -r backend\requirements.txt
```

## 5. Run the FastAPI server

```powershell
python -m uvicorn app.main:app --reload --app-dir backend
```

## 6. Open the API

- API root: `http://127.0.0.1:8000/`
- Health check: `http://127.0.0.1:8000/health`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Sample UV endpoint: `http://127.0.0.1:8000/api/uv/current`

## Notes

- The frontend can keep running separately with `npm run dev`.
- CORS is already enabled for the Vite dev server on port `5173`.
