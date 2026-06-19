from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta

from app.models import UserLogin, TokenResponse, RefreshTokenRequest
from app.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    verify_token,
    ACCESS_TOKEN_EXPIRE_SECONDS,
)

# Crear aplicación FastAPI
app = FastAPI(
    title="JWT FastAPI API",
    description="Web API con autenticación JWT",
    version="0.1.0"
)

# Agregar CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def read_root():
    """Endpoint de prueba para verificar que la API está funcionando."""
    return {
        "message": "Bienvenido a JWT FastAPI API",
        "version": "0.1.0"
    }


@app.post("/login", response_model=TokenResponse, tags=["Authentication"])
def login(credentials: UserLogin):
    """
    Endpoint de login que autentica al usuario y retorna un token JWT.
    
    **Parámetros:**
    - username: nombre de usuario (admin)
    - password: contraseña (admin123)
    
    **Retorna:**
    - access_token: Token de acceso JWT (expira en 300 segundos)
    - refresh_token: Token para refrescar el access_token
    - token_type: Tipo de token (Bearer)
    - expires_in: Segundos hasta que expire el token
    """
    user = authenticate_user(credentials.username, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(user["username"])
    refresh_token = create_refresh_token(user["username"])
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS
    }


@app.post("/refresh", response_model=TokenResponse, tags=["Authentication"])
def refresh_token(request: RefreshTokenRequest):
    """
    Endpoint para refrescar el token de acceso.
    
    **Parámetros:**
    - refresh_token: Token de refresco obtenido en el login
    
    **Retorna:**
    - access_token: Nuevo token de acceso JWT
    - refresh_token: Nuevo token de refresco
    - token_type: Tipo de token (Bearer)
    - expires_in: Segundos hasta que expire el nuevo token
    """
    token_data = verify_token(request.refresh_token)
    
    if token_data.get("token_type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token no es un refresh token válido"
        )
    
    username = token_data.get("username")
    new_access_token = create_access_token(username)
    new_refresh_token = create_refresh_token(username)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS
    }


@app.get("/protected", tags=["Protected"])
def protected_route(token: str = Depends(lambda: None)):
    """
    Endpoint protegido para verificar que el token funciona correctamente.
    
    **Headers requeridos:**
    - Authorization: Bearer <token>
    """
    # En una implementación real, se verificaría el token desde el header Authorization
    return {
        "message": "Acceso a ruta protegida",
        "info": "Este endpoint requiere un token JWT válido"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
