.PHONY: help install start build test clean docker-build docker-run docker-stop docker-logs setup

help:
	@echo "════════════════════════════════════════════════════════════════"
	@echo "🔐 Frontend - React App with JWT Authentication"
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""
	@echo "📦 Development Commands:"
	@echo "  make install         - Install npm dependencies"
	@echo "  make start           - Start development server (http://localhost:3000)"
	@echo "  make build           - Build for production"
	@echo "  make test            - Run tests"
	@echo "  make clean           - Clean node_modules and build artifacts"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  make docker-build    - Build Docker image"
	@echo "  make docker-run      - Run Docker container (http://localhost:3000)"
	@echo "  make docker-stop     - Stop and remove Docker container"
	@echo "  make docker-logs     - View Docker container logs"
	@echo ""
	@echo "🔧 Utility Commands:"
	@echo "  make setup           - Complete setup (Linux/Mac)"
	@echo "  make env-setup       - Create .env file from .env.example"
	@echo "  make lint            - Check code with ESLint"
	@echo ""
	@echo "════════════════════════════════════════════════════════════════"

install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed!"

start:
	@echo "🚀 Starting development server..."
	npm start

build:
	@echo "🏗️ Building for production..."
	npm run build
	@echo "✅ Build complete!"

test:
	@echo "🧪 Running tests..."
	npm test

clean:
	@echo "🧹 Cleaning up..."
	rm -rf node_modules build package-lock.json
	@echo "✅ Cleanup complete!"

docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t jwt-frontend:latest .
	@echo "✅ Docker image built!"

docker-run:
	@echo "🚀 Running Docker container..."
	docker run -p 3000:3000 \
		-e REACT_APP_API_BASE_URL=http://localhost:8000 \
		-e REACT_APP_API_TIMEOUT=10000 \
		-e REACT_APP_TOKEN_REFRESH_THRESHOLD=30 \
		--name jwt-frontend \
		jwt-frontend:latest

docker-stop:
	@echo "🛑 Stopping Docker container..."
	docker stop jwt-frontend || true
	docker rm jwt-frontend || true
	@echo "✅ Container stopped!"

docker-logs:
	@echo "📋 Docker logs:"
	docker logs jwt-frontend

setup:
	@echo "⚙️ Setting up project..."
	$(MAKE) clean
	$(MAKE) install
	$(MAKE) env-setup
	@echo "✅ Setup complete! Run 'make start' to begin development"

env-setup:
	@if [ -f .env ]; then \
		echo "⚠️  .env already exists"; \
	else \
		echo "📝 Creating .env from .env.example..."; \
		cp .env.example .env; \
		echo "✅ .env created!"; \
	fi

start:
	@echo "Starting development server..."
	npm start

build:
	@echo "Building for production..."
	npm run build

test:
	@echo "Running tests..."
	npm test

clean:
	@echo "Cleaning up..."
	rm -rf node_modules build
	npm cache clean --force

docker-build:
	@echo "Building Docker image..."
	docker build -t auth-jwt-frontend .

docker-run:
	@echo "Running Docker container..."
	docker run -p 3000:3000 \
		-e REACT_APP_API_URL=http://localhost:8000 \
		-e REACT_APP_TOKEN_REFRESH_INTERVAL=280000 \
		auth-jwt-frontend

docker-stop:
	@echo "Stopping Docker container..."
	docker stop auth-jwt-frontend || true
	docker rm auth-jwt-frontend || true

docker-compose-up:
	@echo "Starting services with docker-compose..."
	docker-compose up --build

docker-compose-down:
	@echo "Stopping services..."
	docker-compose down

setup:
	@bash setup.sh
