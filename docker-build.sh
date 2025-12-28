#!/bin/bash

# Docker Build Script Only
# Builds the production Docker image without pushing

set -e

IMAGE_NAME="longnguyen1331/admin-htl"
TAG="${1:-latest}"
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"
DOCKERFILE_PATH="./Admin/Dockerfile"
BUILD_CONTEXT="./Admin"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Building Docker image: ${FULL_IMAGE_NAME}${NC}"
echo ""

docker buildx build \
    --platform linux/amd64 \
    --file "${DOCKERFILE_PATH}" \
    --tag "${FULL_IMAGE_NAME}" \
    --load \
    "${BUILD_CONTEXT}"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Build completed successfully${NC}"
    echo ""
    docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

