#!/bin/bash
# Script to build and run Docker container với Dockerfile.chiseled

echo "Building Docker image với Dockerfile.chiseled..."
docker-compose -f docker-compose.chiseled.yml build

if [ $? -eq 0 ]; then
    echo "Build thành công! Starting container..."
    docker-compose -f docker-compose.chiseled.yml up -d
    
    echo "Container đang chạy. Xem logs:"
    echo "docker-compose -f docker-compose.chiseled.yml logs -f"
    echo ""
    echo "Xem container status:"
    echo "docker-compose -f docker-compose.chiseled.yml ps"
    echo ""
    echo "Stop container:"
    echo "docker-compose -f docker-compose.chiseled.yml down"
else
    echo "Build failed. Kiểm tra lỗi ở trên."
    exit 1
fi

