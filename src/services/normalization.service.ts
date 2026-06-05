export class NormalizationService {
  static normalizeTemperature(value: number, unit: 'C' | 'F' | 'K' = 'C'): number {
    // Standardize to Celsius
    if (unit === 'F') return (value - 32) * (5 / 9);
    if (unit === 'K') return value - 273.15;
    return value;
  }

  static normalizeTimestamp(timestamp: string | number): string {
    return new Date(timestamp).toISOString();
  }

  static normalizeCoordinates(lat: number, lon: number) {
    return {
      lat: parseFloat(lat.toFixed(6)),
      lon: parseFloat(lon.toFixed(6)),
    };
  }

  static maskSensitiveData(data: any, clearance: number): any {
    if (clearance < 2) {
      const masked = { ...data };
      if (masked.secretKey) masked.secretKey = '********';
      if (masked.payload) delete masked.payload;
      return masked;
    }
    return data;
  }
}
