# Multi-stage build for Linux/amd64 production
# Stage 1: Build Node.js assets
FROM node:22-alpine AS node-builder
WORKDIR /src
COPY Admin/package.json Admin/yarn.lock Admin/package-copy.json Admin/preload.js ./
COPY Admin/webpack.config.js ./
COPY Admin/src ./src

# Install dependencies
RUN yarn install --frozen-lockfile

# Build assets
RUN yarn run build

# Stage 2: Build .NET application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnet-builder
WORKDIR /src

# Copy csproj and restore dependencies
COPY Admin/Menilo.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY Admin/ ./
COPY --from=node-builder /src/wwwroot/assets ./wwwroot/assets

# Build the application
RUN dotnet build -c Release --no-restore
RUN dotnet publish -c Release --no-build -o /app/publish

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy published app
COPY --from=dotnet-builder /app/publish .

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check (remove if health endpoint doesn't exist)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost:8080/health || exit 1

# Entry point
ENTRYPOINT ["dotnet", "Menilo.dll"]

