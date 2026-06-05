export const telemetrySchema = {
  type: 'object',
  properties: {
    satelliteId: { type: 'string', format: 'uuid' },
    timestamp: { type: 'string', format: 'date-time' },
    sensors: {
      type: 'object',
      properties: {
        temperature: { type: 'number' },
        battery: { type: 'number', minimum: 0, maximum: 100 },
        coordinates: {
          type: 'object',
          properties: {
            lat: { type: 'number', minimum: -90, maximum: 90 },
            lon: { type: 'number', minimum: -180, maximum: 180 },
          },
          required: ['lat', 'lon'],
        },
      },
      required: ['temperature', 'battery'],
    },
  },
  required: ['satelliteId', 'timestamp', 'sensors'],
};

export const missionSchema = {
  type: 'object',
  properties: {
    missionId: { type: 'string' },
    command: { type: 'string' },
    params: { type: 'object' },
  },
  required: ['missionId', 'command'],
};
