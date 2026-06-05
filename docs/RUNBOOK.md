# Project Runbook

## Overview
This runbook provides instructions for operational incidents and routine maintenance.

## Common Tasks

### Starting the Gateway locally
```bash
docker-compose up --build
```

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
npx prisma migrate dev
```

## Troubleshooting

### High Latency
- Check Prometheus metrics on `/metrics`.
- Inspect OpenTelemetry traces in Jaeger/Zipkin.
- Verify downstream service health.

### Auth Failures
- Verify JWT secret is consistent.
- Check Redis connection for blacklist lookups.
