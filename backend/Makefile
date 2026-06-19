.PHONY: help install dev build docker-up docker-down docker-logs clean

help:
	@echo "JWT FastAPI Application - Comandos disponibles:"
	@echo ""
	@echo "  make install        - Instalar dependencias con Poetry"
	@echo "  make dev            - Ejecutar la aplicación en modo desarrollo"
	@echo "  make build          - Construir la imagen Docker"
	@echo "  make docker-up      - Ejecutar la aplicación con Docker Compose"
	@echo "  make docker-down    - Detener los contenedores Docker"
	@echo "  make docker-logs    - Ver logs de Docker"
	@echo "  make clean          - Limpiar archivos temporales"
	@echo ""

install:
	poetry install

dev:
	poetry shell && python -m uvicorn app.main:app --reload

build:
	docker build -t jwt-fastapi-api .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f api

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
	rm -rf build dist *.egg-info
