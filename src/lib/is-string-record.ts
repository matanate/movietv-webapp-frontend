// Type guard to check if a value is Record<string, string | string[]>
export default function isStringRecord(value: unknown): value is Record<string, string | string[]> {
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).every(
      (v) => typeof v === 'string' || (Array.isArray(v) && v.every((item) => typeof item === 'string'))
    );
  }
  return false;
}
