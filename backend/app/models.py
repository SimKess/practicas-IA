from pydantic import BaseModel
from typing import Optional


class UserLogin(BaseModel):
    """Modelo para las credenciales de usuario."""
    username: str
    password: str


class TokenResponse(BaseModel):
    """Modelo para la respuesta del token."""
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """Modelo para la solicitud de refresco de token."""
    refresh_token: str


class TokenData(BaseModel):
    """Modelo para los datos del token."""
    username: Optional[str] = None
    exp: Optional[int] = None
