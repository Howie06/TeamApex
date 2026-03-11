from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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
def get_current_uv():
    return {
        "location": "Melbourne, VIC",
        "uvIndex": 9,
        "risk": "Very High",
        "peakWindow": "11:00 AM - 3:00 PM",
        "message": "Sample response from the FastAPI backend.",
    }
