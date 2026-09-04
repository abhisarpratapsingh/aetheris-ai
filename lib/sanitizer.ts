/**
 * Payload Sanitizer & Defensive Utilities
 * Enforces Challenge Section 6: Strict Undefined-Stripping (Zero-Crash Payload Hygiene)
 */

export function stripUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  return JSON.parse(
    JSON.stringify(obj, (_, value) => (value === undefined ? null : value))
  );
}

/**
 * Defensive Payload Ingestion (Null-Safe Destructuring)
 */
export function safeObject<T = Record<string, any>>(input: unknown, fallback: T = {} as T): T {
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    return input as T;
  }
  return fallback;
}
