import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.auth import pwd_context, USERS_DB

client = TestClient(app)


def test_root():
    """Prueba el endpoint raíz."""
    response = client.get("/")
    assert response.status_code == 200
    assert "version" in response.json()


def test_login_success():
    """Prueba un login exitoso con credenciales válidas."""
    response = client.post(
        "/login",
        json={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 300


def test_login_invalid_user():
    """Prueba un login con usuario inválido."""
    response = client.post(
        "/login",
        json={"username": "invalid", "password": "password"}
    )
    assert response.status_code == 401
    assert "Credenciales inválidas" in response.json()["detail"]


def test_login_invalid_password():
    """Prueba un login con contraseña inválida."""
    response = client.post(
        "/login",
        json={"username": "admin", "password": "wrong_password"}
    )
    assert response.status_code == 401
    assert "Credenciales inválidas" in response.json()["detail"]


def test_refresh_token():
    """Prueba la refrescación de token."""
    # Primero, hacer login
    login_response = client.post(
        "/login",
        json={"username": "admin", "password": "admin123"}
    )
    refresh_token = login_response.json()["refresh_token"]
    
    # Refrescar el token
    response = client.post(
        "/refresh",
        json={"refresh_token": refresh_token}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_refresh_with_invalid_token():
    """Prueba refrescación con token inválido."""
    response = client.post(
        "/refresh",
        json={"refresh_token": "invalid_token"}
    )
    assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
