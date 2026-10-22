export function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact)
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, field]) => [
        key,
        /password|passwd|token|secret|authorization|cookie|apikey|credential/i.test(key.replace(/[^a-z0-9]/gi, '')) || /^pwd$/i.test(key)
          ? '[REDACTED]'
          : redact(field),
      ]),
    );
  }

  return value;
}
