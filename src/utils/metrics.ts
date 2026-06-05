import { Registry, Counter, Histogram } from 'prom-client';

export const register = new Registry();

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const circuitBreakerState = new Counter({
  name: 'gateway_circuit_breaker_state_total',
  help: 'Total number of circuit breaker state changes',
  labelNames: ['service', 'state'],
  registers: [register],
});
