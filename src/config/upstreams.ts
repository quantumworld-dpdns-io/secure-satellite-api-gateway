export interface UpstreamConfig {
  id: string;
  target: string;
  pathRewrite?: Record<string, string>;
  changeOrigin?: boolean;
}

export const upstreams: Record<string, UpstreamConfig> = {
  telemetry: {
    id: 'telemetry',
    target: process.env.TELEMETRY_SERVICE_URL || 'http://localhost:4001',
    pathRewrite: { '^/api/v1/telemetry': '' },
  },
  mission: {
    id: 'mission',
    target: process.env.MISSION_SERVICE_URL || 'http://localhost:4002',
    pathRewrite: { '^/api/v1/mission': '' },
  },
};
