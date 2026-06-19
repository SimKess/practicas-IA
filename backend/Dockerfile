# Etapa de construcción
FROM python:3.11-slim as builder

WORKDIR /app

# Instalar Poetry
RUN pip install --no-cache-dir poetry

# Copiar archivos de configuración de Poetry
COPY pyproject.toml poetry.lock* ./

# Instalar dependencias
RUN poetry config virtualenvs.create false && \
    poetry install --only main --no-interaction --no-ansi

# Etapa final
FROM python:3.11-slim

WORKDIR /app

# Copiar las dependencias instaladas del builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copiar la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8000

# Comando de inicio
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
