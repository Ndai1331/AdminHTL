# Docker Setup Guide

## Local Development (macOS)

### Quick Start

```bash
# Build and start the development container
docker-compose up admin-local

# Or run in detached mode
docker-compose up -d admin-local
```

The application will be available at:
- HTTP: http://localhost:5188
- HTTPS: https://localhost:7014

### Features

- **Live Code Reload**: Code changes are automatically reflected (volume mounts)
- **Node.js Dependencies**: Installed once and persisted in volume
- **.NET Watch**: Automatically rebuilds and restarts on code changes
- **Frontend Assets**: Built automatically on first run

### Manual Commands

If you prefer to run commands manually:

```bash
# Start container in interactive mode
docker-compose run --rm admin-local bash

# Inside container:
cd /app
yarn install          # Install Node.js dependencies
yarn run build        # Build frontend assets
dotnet restore        # Restore .NET packages
dotnet watch run      # Run with hot reload
```

### Stop and Clean

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Production Build (Linux/amd64)

### Build Image

```bash
# Build production image
docker build -f Admin/Dockerfile -t menilo-admin:latest ./Admin

# Or build for specific platform
docker buildx build --platform linux/amd64 -f Admin/Dockerfile -t menilo-admin:latest ./Admin
```

### Run Production Container

```bash
# Run with docker-compose
docker-compose --profile production up admin-prod

# Or run directly
docker run -d \
  --name menilo-admin \
  -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  menilo-admin:latest
```

### Using Production Docker Compose

```bash
# Start production service
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

## Environment Variables

You can override configuration using environment variables:

```bash
# Local development
docker-compose up -e DirectusApi__BaseUrl=https://your-api-url.com/api/

# Production
docker run -e DirectusApi__BaseUrl=https://your-api-url.com/api/ menilo-admin:latest
```

## Troubleshooting

### Port Already in Use

If ports 5188 or 7014 are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "5189:5188"  # Change host port
  - "7015:7014"
```

### Node Modules Issues

If node_modules has issues, remove volume and rebuild:

```bash
docker-compose down -v
docker-compose up admin-local
```

### .NET SDK Not Found

Make sure you're using the correct Dockerfile.local which includes .NET SDK 9.0.

### Permission Issues (Linux)

If you encounter permission issues, ensure the user in the container has proper permissions:

```bash
docker-compose exec admin-local chown -R $(id -u):$(id -g) /app
```

## Build and Push to Docker Hub

### Using the provided script (Recommended)

```bash
# Build and push with latest tag
./docker-build-push.sh

# Build and push with custom tag/version
./docker-build-push.sh v1.0.0
./docker-build-push.sh 2024.12.28
```

The script will:
1. Check Docker installation and login status
2. Build the production image for linux/amd64
3. Tag it as `longnguyen1331/admin-htl:latest` (or your custom tag)
4. Push to Docker Hub (with confirmation)

### Manual Build and Push

```bash
# Build only
./docker-build.sh

# Or build manually
docker buildx build \
  --platform linux/amd64 \
  -f Admin/Dockerfile \
  -t longnguyen1331/admin-htl:latest \
  --load \
  ./Admin

# Push only (if image already built)
./docker-push.sh

# Or push manually
docker push longnguyen1331/admin-htl:latest
```

### Pull and Run the Image

```bash
# Pull from Docker Hub
docker pull longnguyen1331/admin-htl:latest

# Run the container
docker run -d \
  --name admin-htl \
  -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  longnguyen1331/admin-htl:latest
```

## Multi-Architecture Build

For building on different architectures:

```bash
# Install buildx if not already installed
docker buildx create --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Admin/Dockerfile \
  -t longnguyen1331/admin-htl:latest \
  --push \
  ./Admin
```

