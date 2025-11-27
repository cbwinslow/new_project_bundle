# Makefile for common development tasks
# Usage: make <target>

.PHONY: help install dev build test lint format clean docker-build docker-up docker-down release

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# Project info
PROJECT_NAME := new-project-bundle
VERSION := $(shell cat package.json 2>/dev/null | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[",]//g' | tr -d ' ')

##@ General

help: ## Display this help message
	@awk 'BEGIN {FS = ":.*##"; printf "\n$(BLUE)Usage:$(RESET)\n  make $(GREEN)<target>$(RESET)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(RESET)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

version: ## Show project version
	@echo "$(PROJECT_NAME) v$(VERSION)"

##@ Development

install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	npm ci
	@echo "$(GREEN)Dependencies installed!$(RESET)"

dev: ## Start development server
	@echo "$(BLUE)Starting development server...$(RESET)"
	npm run dev

build: ## Build for production
	@echo "$(BLUE)Building for production...$(RESET)"
	npm run build
	@echo "$(GREEN)Build complete!$(RESET)"

##@ Testing

test: ## Run all tests
	@echo "$(BLUE)Running tests...$(RESET)"
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

##@ Code Quality

lint: ## Run linter
	@echo "$(BLUE)Running linter...$(RESET)"
	npm run lint

lint-fix: ## Fix linting issues
	npm run lint:fix

format: ## Format code
	@echo "$(BLUE)Formatting code...$(RESET)"
	npm run format

format-check: ## Check code formatting
	npm run format:check

typecheck: ## Run type checking
	npm run typecheck

##@ Docker

docker-build: ## Build Docker image
	@echo "$(BLUE)Building Docker image...$(RESET)"
	docker build -t $(PROJECT_NAME):$(VERSION) -t $(PROJECT_NAME):latest .

docker-up: ## Start Docker containers
	@echo "$(BLUE)Starting Docker containers...$(RESET)"
	docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "$(BLUE)Stopping Docker containers...$(RESET)"
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-clean: ## Remove Docker containers, images, and volumes
	docker-compose down -v --rmi all

docker-dev: ## Start development with Docker
	docker-compose --profile dev up -d

##@ Database

db-migrate: ## Run database migrations
	npm run db:migrate

db-seed: ## Seed database
	npm run db:seed

db-reset: ## Reset database
	npm run db:reset

##@ Release

release-patch: ## Create patch release
	npm version patch
	git push --follow-tags

release-minor: ## Create minor release
	npm version minor
	git push --follow-tags

release-major: ## Create major release
	npm version major
	git push --follow-tags

changelog: ## Generate changelog
	npx conventional-changelog -p angular -i CHANGELOG.md -s

##@ Cleanup

clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(RESET)"
	rm -rf dist build .next coverage node_modules/.cache
	@echo "$(GREEN)Clean complete!$(RESET)"

clean-all: clean ## Clean everything including node_modules
	rm -rf node_modules

##@ Security

security-audit: ## Run security audit
	npm audit

security-fix: ## Fix security issues
	npm audit fix

##@ Documentation

docs: ## Generate documentation
	npm run docs

docs-serve: ## Serve documentation locally
	npm run docs:serve
