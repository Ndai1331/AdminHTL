#!/bin/bash

# Docker Build and Push Script
# Builds the production Docker image and pushes it to Docker Hub

set -e  # Exit on any error

# Configuration
IMAGE_NAME="longnguyen1331/admin-htl"
TAG="${1:-latest}"  # Use first argument as tag, default to 'latest'
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"
DOCKERFILE_PATH="./Admin/Dockerfile"
BUILD_CONTEXT="./Admin"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Docker Build and Push Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker daemon is not running${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed and running${NC}"

# Check if user is logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}Warning: You may not be logged in to Docker Hub${NC}"
    echo -e "${YELLOW}Run: docker login${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Display build information
echo ""
echo -e "${BLUE}Build Information:${NC}"
echo "  Image Name: ${FULL_IMAGE_NAME}"
echo "  Dockerfile: ${DOCKERFILE_PATH}"
echo "  Build Context: ${BUILD_CONTEXT}"
echo "  Platform: linux/amd64"
echo ""

# Build the Docker image
echo -e "${BLUE}Step 1: Building Docker image...${NC}"
docker buildx build \
    --platform linux/amd64 \
    --file "${DOCKERFILE_PATH}" \
    --tag "${FULL_IMAGE_NAME}" \
    --load \
    "${BUILD_CONTEXT}"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

# Show image information
echo -e "${BLUE}Image Information:${NC}"
docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
echo ""

# Ask for confirmation before pushing
read -p "Push image to Docker Hub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Image built but not pushed. You can push it later with:${NC}"
    echo -e "${YELLOW}  docker push ${FULL_IMAGE_NAME}${NC}"
    exit 0
fi

# Push the Docker image
echo -e "${BLUE}Step 2: Pushing Docker image to Docker Hub...${NC}"
docker push "${FULL_IMAGE_NAME}"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker push failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Docker image pushed successfully${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Success!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Image available at:"
echo "  ${FULL_IMAGE_NAME}"
echo ""
echo "Pull with:"
echo "  docker pull ${FULL_IMAGE_NAME}"
echo ""
echo "Run with:"
echo "  docker run -d -p 8080:8080 ${FULL_IMAGE_NAME}"
echo ""

