from __future__ import annotations


class AppError(Exception):
    status_code = 500
    detail = "Unexpected application error."

    def __init__(self, detail: str | None = None):
        if detail:
            self.detail = detail
        super().__init__(self.detail)


class NotFoundError(AppError):
    status_code = 404
    detail = "Requested resource was not found."


class ValidationError(AppError):
    status_code = 422
    detail = "The request data is invalid."


class ServiceUnavailableError(AppError):
    status_code = 503
    detail = "The requested service is currently unavailable."
