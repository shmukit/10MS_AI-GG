#!/bin/bash

# Deployment Script for 10MS SheSTEM
# This script helps deploy the application to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment
check_environment() {
    print_status "Checking environment..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check environment variables
    if [ ! -f .env ]; then
        print_warning ".env file not found. Please create one based on .env.example"
        exit 1
    fi
    
    print_success "Environment check passed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Function to build application
build_app() {
    local mode=${1:-production}
    print_status "Building application for $mode mode..."
    
    case $mode in
        "production")
            npm run build:prod
            ;;
        "staging")
            npm run build:staging
            ;;
        "development")
            npm run build
            ;;
        *)
            print_error "Invalid mode: $mode. Use production, staging, or development"
            exit 1
            ;;
    esac
    
    print_success "Application built successfully for $mode mode"
}

# Function to check deployment configuration
check_deployment_config() {
    print_status "Checking deployment configuration..."
    npm run deploy:check
    print_success "Deployment configuration check passed"
}

# Function to start preview server
start_preview() {
    local port=${1:-3000}
    print_status "Starting preview server on port $port..."
    npm run start
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build [MODE]     Build the application (production|staging|development)"
    echo "  deploy [MODE]    Full deployment process (production|staging|development)"
    echo "  check            Check environment and configuration"
    echo "  preview [PORT]   Start preview server (default: 3000)"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build production"
    echo "  $0 deploy staging"
    echo "  $0 check"
    echo "  $0 preview 8080"
}

# Main script logic
case "${1:-help}" in
    "build")
        check_environment
        install_dependencies
        build_app "${2:-production}"
        ;;
    "deploy")
        check_environment
        install_dependencies
        build_app "${2:-production}"
        check_deployment_config
        print_success "Deployment completed successfully!"
        print_status "Next steps:"
        print_status "1. Upload the 'dist' folder to your server"
        print_status "2. Configure your web server to serve the application"
        print_status "3. Set up environment variables on your server"
        ;;
    "check")
        check_environment
        check_deployment_config
        ;;
    "preview")
        check_environment
        install_dependencies
        build_app "development"
        start_preview "${2:-3000}"
        ;;
    "help"|*)
        show_help
        ;;
esac
