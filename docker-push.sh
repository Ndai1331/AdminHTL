#!/bin/bash

# Quick Docker Push Script
# Assumes image is already built, just pushes to Docker Hub

set -e

IMAGE_NAME="longnguyen1331/admin-htl"
TAG="${1:-latest}"
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Pushing ${FULL_IMAGE_NAME} to Docker Hub...${NC}"

docker push "${FULL_IMAGE_NAME}"

echo -e "${GREEN}✓ Push completed successfully${NC}"
echo ""
echo "Image: ${FULL_IMAGE_NAME}"

