from __future__ import annotations

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class MessageResponse(BaseModel):
    message: str


class RootResponse(BaseModel):
    name: str
    status: str
    docs: str
    version: str


class ErrorResponse(BaseModel):
    detail: str
