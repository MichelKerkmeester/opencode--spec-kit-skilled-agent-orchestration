// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Response Envelope
// ───────────────────────────────────────────────────────────────

type HandlerResponse = { content: Array<{ type: string; text: string }> };

const POSIX_PATH_PATTERN = /(?:^|[\s"'=:(])((?:\/Users|\/var|\/tmp|\/private|\/Volumes)\/[^\s"',)]+)/g;
const WINDOWS_PATH_PATTERN = /[A-Za-z]:\\[^\s"',)]+/g;

export function redactDiagnosticText(value: string): string {
  return value
    .replace(POSIX_PATH_PATTERN, (match, pathValue: string) => match.replace(pathValue, '[REDACTED_PATH]'))
    .replace(WINDOWS_PATH_PATTERN, '[REDACTED_PATH]');
}

export function redactDiagnosticValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return redactDiagnosticText(value);
  }
  if (Array.isArray(value)) {
    return value.map(redactDiagnosticValue);
  }
  if (value && typeof value === 'object') {
    const redacted: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      redacted[key] = redactDiagnosticValue(nestedValue);
    }
    return redacted;
  }
  return value;
}

export function okResponse(data: Record<string, unknown>): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: redactDiagnosticValue(data) }),
    }],
  };
}

export function errorResponse(error: string, code?: string): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'error',
        error: redactDiagnosticText(error),
        ...(code ? { code } : {}),
      }),
    }],
  };
}
