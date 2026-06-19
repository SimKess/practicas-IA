from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status

# Configuración de criptografía
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secreto para JWT (en producción debe estar en variables de entorno)
SECRET_KEY = "tu-clave-secreta-muy-segura-cambiar-en-produccion"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 300
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Usuarios de prueba (en producción estaría en una base de datos)
USERS_DB = {
    "admin": {
        "username": "admin",
        "hashed_password": pwd_context.hash("admin123")
    }
}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica que la contraseña en texto plano coincida con la contraseña hasheada."""
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Autentica un usuario verificando sus credenciales."""
    if username not in USERS_DB:
        return None
    
    user = USERS_DB[username]
    if not verify_password(password, user["hashed_password"]):
        return None
    
    return user


def create_access_token(username: str, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un token de acceso JWT."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    
    to_encode = {
        "sub": username,
        "exp": expire,
        "type": "access"
    }
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(username: str, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un token de refresco JWT."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "sub": username,
        "exp": expire,
        "type": "refresh"
    }
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verifica un token JWT y retorna los datos del token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo validar las credenciales"
            )
        
        return {
            "username": username,
            "token_type": token_type,
            "exp": payload.get("exp")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token ha expirado"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
