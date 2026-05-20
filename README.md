# Secure Satellite API Gateway

> Secure satellite API gateway – normalizes access to telemetry and mission data with fine-grained authorization and lineage tracking

## Key Features
- **Security First:** Built-in OWASP Top 10 protection, JWT/OAuth2 Auth, and strict RBAC/ABAC.
- **Observability:** Distributed tracing with OpenTelemetry and metrics with Prometheus.
- **Resilience:** Circuit Breaker pattern and Redis-backed rate limiting.
- **Data Integrity:** JSON Schema validation and automated payload normalization.
- **Automated Testing:** Comprehensive suite with Jest and Robot Framework.

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL & Redis

### Local Setup
```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma db seed

# Run in development mode
npm run dev
```

### Documentation
- API Docs: `http://localhost:3000/api-docs`
- Metrics: `http://localhost:3000/metrics`
- Runbook: [docs/RUNBOOK.md](docs/RUNBOOK.md)

## Testing
```bash
# Unit Tests
npm test

# Performance Tests
# Requires k6 installed locally
k6 run tests/performance/load-test.js
```

## License
[MIT](LICENSE)
