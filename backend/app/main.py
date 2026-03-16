from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.bootstrap import bootstrap_database
from app.core.config import FRONTEND_ORIGIN_REGEX, FRONTEND_ORIGINS
from app.core.exceptions import AppError
from app.routers import awareness, health, locations, prevention, reminders, uv
from app.schemas.common import ErrorResponse, RootResponse


@asynccontextmanager
async def lifespan(_: FastAPI):
    bootstrap_database()
    yield


app = FastAPI(
    title="TeamApex API",
    version="0.2.0",
    description=(
        "FastAPI backend for the TeamApex university onboarding iteration project "
        "on the generational shift in sun-safety attitudes."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_origin_regex=FRONTEND_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(detail=exc.detail).model_dump(),
    )


@app.exception_handler(Exception)
async def unexpected_error_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(detail=f"Internal server error: {exc}").model_dump(),
    )


@app.get("/", response_model=RootResponse)
def read_root() -> RootResponse:
    return RootResponse(
        name="TeamApex API",
        status="ok",
        docs="/docs",
        version=app.version,
    )


app.include_router(health.router)
app.include_router(locations.router)
app.include_router(uv.router)
app.include_router(awareness.router)
app.include_router(prevention.router)
app.include_router(reminders.router)
