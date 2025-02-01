# Stage 1: Build React application
FROM node:20-slim AS react-builder

ARG REACT_APP_COMMIT_HASH
ENV REACT_APP_COMMIT_HASH=${REACT_APP_COMMIT_HASH}

WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY web ./
RUN npm run build

# Stage 2: Build Python dependencies
FROM python:3.13-slim-bookworm AS python-builder
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        libcurl4-openssl-dev \
    && pip install --no-cache-dir --user -r requirements.txt \
    && pip install --no-cache-dir --user gunicorn

# Stage 3: Final production image
FROM python:3.13-slim-bookworm

# OCI labels
LABEL org.opencontainers.image.title="TekBetter Server" \
      org.opencontainers.image.description="TekBetter API Server with Flask" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="eliaute,maelapp" \
      app.component="api-server" \
      app.dependencies="mongodb,redis"

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=python-builder /root/.local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=python-builder /root/.local/bin /usr/local/bin

# Copy React build
COPY --from=react-builder /app/web/build /app/dashboard_build

# Set environment variables
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production \
    FLASK_DEBUG=0 \
    DASHBOARD_BUILD_PATH=/app/dashboard_build \
    DATA_PATH=/data

# Create non-root user
RUN useradd -m -s /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# Copy application code
COPY --chown=appuser:appuser app /app/app
COPY --chown=appuser:appuser gunicorn.conf.py /app/

EXPOSE 8080

CMD ["gunicorn", "--config", "gunicorn.conf.py", "app.main:create_app()"]