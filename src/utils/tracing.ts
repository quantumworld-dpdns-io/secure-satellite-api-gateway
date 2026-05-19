import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import logger from '@/utils/logger.js';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

export const initTracing = () => {
  sdk.start();
  logger.info('🔭 OpenTelemetry SDK started');

  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => logger.info('Tracing terminated'))
      .catch((error) => logger.error('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
};
