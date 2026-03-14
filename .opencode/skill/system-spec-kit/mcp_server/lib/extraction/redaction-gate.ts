// ───────────────────────────────────────────────────────────────
// MODULE: Redaction Gate
// ───────────────────────────────────────────────────────────────
// Feature catalog: Guards and edge cases
interface RedactionMatch {
  value: string;
  category: string;
}

interface RedactionResult {
  redactedText: string;
  redactionApplied: boolean;
  matches: RedactionMatch[];
}

interface RedactionPattern {
  category: string;
  expression: RegExp;
}

const GIT_SHA_40 = /^[0-9a-f]{40}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const GENERIC_HIGH_ENTROPY_MIN_LENGTH = 40;

const PATTERNS: RedactionPattern[] = [
  { category: 'api_key', expression: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { category: 'bearer_token', expression: /\bBearer\s+[A-Za-z0-9._\-]{20,}\b/gi },
  { category: 'aws_access_key', expression: /\bAKIA[0-9A-Z]{16}\b/g },
  { category: 'private_key', expression: /-----BEGIN(?: RSA)? PRIVATE KEY-----[\s\S]*?-----END(?: RSA)? PRIVATE KEY-----/g },
  { category: 'email', expression: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { category: 'jwt', expression: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g },
  { category: 'generic_high_entropy', expression: /\b[A-Za-z0-9+/_=-]{40,}\b/g },
];

function shouldSkipMatch(value: string, category: string): boolean {
  if (category !== 'generic_high_entropy') {
    return false;
  }

  if (value.length < GENERIC_HIGH_ENTROPY_MIN_LENGTH) {
    return true;
  }

  if (GIT_SHA_40.test(value)) {
    return true;
  }

  if (UUID_PATTERN.test(value)) {
    return true;
  }

  return false;
}

function redactWithPattern(inputText: string, pattern: RedactionPattern, matches: RedactionMatch[]): string {
  return inputText.replace(pattern.expression, (value: string) => {
    if (shouldSkipMatch(value, pattern.category)) {
      return value;
    }

    matches.push({ value, category: pattern.category });
    return '[REDACTED]';
  });
}

function applyRedactionGate(inputText: string): RedactionResult {
  if (typeof inputText !== 'string' || inputText.length === 0) {
    return { redactedText: '', redactionApplied: false, matches: [] };
  }

  const matches: RedactionMatch[] = [];
  let redactedText = inputText;
  for (const pattern of PATTERNS) {
    redactedText = redactWithPattern(redactedText, pattern, matches);
  }

  return {
    redactedText,
    redactionApplied: matches.length > 0,
    matches,
  };
}

export {
  applyRedactionGate,
  GENERIC_HIGH_ENTROPY_MIN_LENGTH,
};

/**
 * Re-exports related public types.
 */
export type {
  RedactionResult,
  RedactionMatch,
};
