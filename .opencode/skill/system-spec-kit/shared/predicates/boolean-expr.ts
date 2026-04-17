// ---------------------------------------------------------------
// MODULE: BooleanExpr — Typed YAML Predicate Grammar (S7 / M11)
// ---------------------------------------------------------------
// Canonical grammar for command-asset YAML `when:` fields that must be
// mechanically evaluated (e.g. Step 0 intake branch decisions, intake-only
// gate). Replaces opaque quoted-string expressions like
// `intake_only == TRUE` / `folder_state == populated-folder` with a
// typed, schema-validatable contract.
//
// Contract overview:
//   - Canonical (object form, preferred):
//       when:
//         field: intake_only
//         op: "=="
//         value: true
//   - Legacy string literal (still accepted, parsed via bounded grammar):
//       when: "intake_only == TRUE"
//   - Prose timing notes MUST NOT live under `when:`. Use `after:` (new
//     field added by T-YML-PLN-04 / T-YML-CMP-01) for free-form narrative
//     timing hints.
//
// Related tasks: T-YML-PLN-02, T-YML-PLN-04, T-YML-CMP-01, T-YML-DPR-01.
// Related research IDs: R42-001, R43-002, R44-003, R48-002, R49-002, R50-001.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/** Operators permitted in a typed boolean predicate. */
export type BooleanExprOp = '==' | '!=' | 'in' | 'not_in';

/** Literal value slot for a predicate comparison. */
export type BooleanExprValue = string | number | boolean | ReadonlyArray<string | number | boolean>;

/**
 * Canonical typed predicate used under YAML `when:` keys.
 *
 * Object form is the preferred representation. Its three fields allow a
 * validator to type-check branch logic without relying on runner-specific
 * string parsing rules.
 */
export interface BooleanExpr {
  /** Left-hand operand: a workflow variable name (must be declared in the asset's outputs or bindings). */
  readonly field: string;
  /** Comparison operator. */
  readonly op: BooleanExprOp;
  /** Right-hand operand: literal value or array (for `in` / `not_in`). */
  readonly value: BooleanExprValue;
}

/** Result of string-to-BooleanExpr parsing. */
export interface ParsedBooleanExpr {
  readonly ok: boolean;
  readonly expr: BooleanExpr | null;
  readonly error: string | null;
}

/** Result of BooleanExpr validation (object form). */
export interface ValidatedBooleanExpr {
  readonly ok: boolean;
  readonly expr: BooleanExpr | null;
  readonly errors: ReadonlyArray<string>;
}

/** Error shape returned when prose bleed is detected inside a `when:` value. */
export interface WhenFieldDiagnostic {
  readonly kind: 'prose_bleed' | 'invalid_operator' | 'malformed_string' | 'unsupported_shape';
  readonly message: string;
  readonly suggestion: string;
}

// ---------------------------------------------------------------
// 2. CONSTANTS
// ---------------------------------------------------------------

const ALLOWED_OPERATORS: ReadonlySet<string> = new Set(['==', '!=', 'in', 'not_in']);

/**
 * Tokens that almost always indicate prose (timing / narrative) rather than
 * a mechanical predicate. When any of these appears inside a `when:` value,
 * the validator emits a `prose_bleed` diagnostic and recommends moving the
 * content into an `after:` field (T-YML-PLN-04 / T-YML-CMP-01).
 */
const PROSE_BLEED_TOKENS: ReadonlyArray<string> = [
  'immediately after',
  'after the',
  'before the',
  'when the generated',
  'when the canonical',
  'when the routed',
  ' is refreshed',
  'continuity artifact is written',
  'spec document is refreshed',
  'within the same setup prompt',
  'approval_source',
];

// ---------------------------------------------------------------
// 3. PARSERS
// ---------------------------------------------------------------

/**
 * Parse a legacy string-form predicate like
 * `intake_only == TRUE` or `folder_state != populated-folder`.
 *
 * Grammar (restricted, no arbitrary eval):
 *   expr   := field SP op SP value
 *   field  := identifier (letters, digits, underscore, hyphen)
 *   op     := "==" | "!=" | "in" | "not_in"
 *   value  := TRUE | FALSE | enum-token | quoted-string
 *
 * Boolean tokens match only the uppercase forms `TRUE` and `FALSE` to
 * preserve the existing runtime contract. Case-variants (`true`, `True`)
 * are rejected — see regression test T-TEST-NEW-19.
 */
export function parseBooleanExprString(raw: string): ParsedBooleanExpr {
  if (typeof raw !== 'string') {
    return { ok: false, expr: null, error: 'input is not a string' };
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { ok: false, expr: null, error: 'empty expression' };
  }

  // Detect prose bleed before attempting a grammar parse so callers can
  // surface a friendly diagnostic instead of a cryptic parser failure.
  const proseHit = findProseBleed(trimmed);
  if (proseHit) {
    return {
      ok: false,
      expr: null,
      error: `prose-like token detected in predicate: ${proseHit}; move timing narrative into an 'after:' field`,
    };
  }

  // Operator regex — 'in' / 'not_in' must be whitespace-delimited to avoid
  // clashing with identifiers. '==' / '!=' are symbol-delimited.
  const symbolMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*(==|!=)\s*(.+)$/);
  const wordMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s+(in|not_in)\s+(.+)$/);
  const match = symbolMatch ?? wordMatch;
  if (!match) {
    return {
      ok: false,
      expr: null,
      error: `unable to parse predicate string; expected '<field> <op> <value>' with op in [==, !=, in, not_in]`,
    };
  }

  const [, field, op, rawValue] = match;
  if (!ALLOWED_OPERATORS.has(op)) {
    return { ok: false, expr: null, error: `operator '${op}' is not permitted` };
  }

  const parsedValue = parseLiteralValue(rawValue.trim(), op as BooleanExprOp);
  if (parsedValue.error) {
    return { ok: false, expr: null, error: parsedValue.error };
  }

  return {
    ok: true,
    expr: {
      field,
      op: op as BooleanExprOp,
      value: parsedValue.value as BooleanExprValue,
    },
    error: null,
  };
}

/**
 * Validate a candidate BooleanExpr object (YAML-native form). Returns a
 * typed result and collects structural errors rather than throwing.
 */
export function validateBooleanExpr(candidate: unknown): ValidatedBooleanExpr {
  const errors: string[] = [];
  if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) {
    errors.push('predicate must be an object of shape { field, op, value }');
    return { ok: false, expr: null, errors };
  }

  const rec = candidate as Record<string, unknown>;

  if (typeof rec.field !== 'string' || rec.field.length === 0) {
    errors.push('field must be a non-empty string identifier');
  }

  if (typeof rec.op !== 'string' || !ALLOWED_OPERATORS.has(rec.op)) {
    errors.push(`op must be one of ${Array.from(ALLOWED_OPERATORS).join(', ')}`);
  }

  if (!isValidValueShape(rec.value, rec.op as string | undefined)) {
    errors.push(
      "value must be string | number | boolean; for 'in' / 'not_in' it must be a non-empty array of those primitives",
    );
  }

  if (errors.length > 0) {
    return { ok: false, expr: null, errors };
  }

  return {
    ok: true,
    expr: {
      field: rec.field as string,
      op: rec.op as BooleanExprOp,
      value: rec.value as BooleanExprValue,
    },
    errors: [],
  };
}

/**
 * Parse an arbitrary `when:` field value into a typed BooleanExpr, accepting
 * both legacy string form and the new YAML mapping form. Returns a unified
 * ParsedBooleanExpr shape so callers can treat the two paths identically.
 */
export function parseWhenField(value: unknown): ParsedBooleanExpr {
  if (typeof value === 'string') {
    return parseBooleanExprString(value);
  }
  const validated = validateBooleanExpr(value);
  if (!validated.ok) {
    return { ok: false, expr: null, error: validated.errors.join('; ') };
  }
  return { ok: true, expr: validated.expr, error: null };
}

// ---------------------------------------------------------------
// 4. EVALUATOR
// ---------------------------------------------------------------

/**
 * Evaluate a typed BooleanExpr against a runtime binding map. Returns
 * a boolean outcome or a diagnostic when the predicate references a field
 * that was never bound by the workflow.
 */
export function evaluateBooleanExpr(
  expr: BooleanExpr,
  bindings: Readonly<Record<string, unknown>>,
): { readonly ok: boolean; readonly result: boolean; readonly error: string | null } {
  if (!Object.prototype.hasOwnProperty.call(bindings, expr.field)) {
    return { ok: false, result: false, error: `field '${expr.field}' is not bound in the workflow context` };
  }
  const lhs = bindings[expr.field];

  switch (expr.op) {
    case '==':
      return { ok: true, result: scalarsEqual(lhs, expr.value), error: null };
    case '!=':
      return { ok: true, result: !scalarsEqual(lhs, expr.value), error: null };
    case 'in':
      if (!Array.isArray(expr.value)) {
        return { ok: false, result: false, error: "'in' requires an array literal on the right-hand side" };
      }
      return { ok: true, result: expr.value.some((candidate) => scalarsEqual(lhs, candidate)), error: null };
    case 'not_in':
      if (!Array.isArray(expr.value)) {
        return { ok: false, result: false, error: "'not_in' requires an array literal on the right-hand side" };
      }
      return { ok: true, result: !expr.value.some((candidate) => scalarsEqual(lhs, candidate)), error: null };
    default:
      return { ok: false, result: false, error: `unsupported operator '${String(expr.op)}'` };
  }
}

// ---------------------------------------------------------------
// 5. PROSE BLEED DETECTOR
// ---------------------------------------------------------------

/**
 * Scan a raw `when:` string for tokens that indicate prose timing notes
 * have bled into a predicate slot. Returns the offending token if detected,
 * otherwise null. Callers should surface a WhenFieldDiagnostic of kind
 * `prose_bleed` and recommend moving the content to an `after:` field.
 */
export function findProseBleed(raw: string): string | null {
  const lower = raw.toLowerCase();
  for (const token of PROSE_BLEED_TOKENS) {
    if (lower.includes(token)) {
      return token;
    }
  }
  return null;
}

// ---------------------------------------------------------------
// 6. HELPERS
// ---------------------------------------------------------------

function parseLiteralValue(
  raw: string,
  op: BooleanExprOp,
): { readonly value: BooleanExprValue | null; readonly error: string | null } {
  if (op === 'in' || op === 'not_in') {
    if (!raw.startsWith('[') || !raw.endsWith(']')) {
      return { value: null, error: `'${op}' requires a bracketed array literal on the right-hand side` };
    }
    const inner = raw.slice(1, -1).trim();
    if (inner.length === 0) {
      return { value: null, error: `'${op}' array literal must contain at least one entry` };
    }
    const parts = inner.split(',').map((p) => p.trim()).filter((p) => p.length > 0);
    const items: Array<string | number | boolean> = [];
    for (const part of parts) {
      const scalar = parseScalarLiteral(part);
      if (scalar.error) return { value: null, error: scalar.error };
      items.push(scalar.value as string | number | boolean);
    }
    return { value: items, error: null };
  }

  return parseScalarLiteral(raw);
}

function parseScalarLiteral(raw: string): {
  readonly value: string | number | boolean | null;
  readonly error: string | null;
} {
  if (raw.length === 0) {
    return { value: null, error: 'empty literal' };
  }

  // Boolean — strict uppercase TRUE/FALSE only (preserves existing runtime contract).
  if (raw === 'TRUE') return { value: true, error: null };
  if (raw === 'FALSE') return { value: false, error: null };
  if (raw === 'true' || raw === 'True' || raw === 'false' || raw === 'False') {
    return {
      value: null,
      error: `boolean literal '${raw}' rejected; use uppercase TRUE or FALSE to match the predicate contract`,
    };
  }

  // Quoted string — tolerate single or double quotes, strip delimiters.
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return { value: raw.slice(1, -1), error: null };
  }

  // Numeric literal — integer or decimal without quotes.
  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    const num = Number(raw);
    return Number.isFinite(num)
      ? { value: num, error: null }
      : { value: null, error: `invalid numeric literal '${raw}'` };
  }

  // Bare identifier-style enum token (e.g. `populated-folder`, `empty-folder`).
  // Accept lowercase letters, digits, underscore, hyphen — matches the
  // canonical intake-contract start_state enum shape.
  if (/^[A-Za-z][A-Za-z0-9_-]*$/.test(raw)) {
    return { value: raw, error: null };
  }

  return { value: null, error: `unrecognized literal '${raw}'; quote strings explicitly or use an enum token` };
}

function isValidValueShape(value: unknown, op: string | undefined): boolean {
  if (op === 'in' || op === 'not_in') {
    if (!Array.isArray(value) || value.length === 0) return false;
    return value.every((entry) => isScalarShape(entry));
  }
  return isScalarShape(value);
}

function isScalarShape(value: unknown): boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function scalarsEqual(a: unknown, b: unknown): boolean {
  if (typeof a === typeof b) return a === b;
  // Allow "TRUE"/"FALSE" strings to compare equal to boolean primitives for
  // forward compatibility with legacy string-literal payloads.
  if ((a === true && b === 'TRUE') || (a === 'TRUE' && b === true)) return true;
  if ((a === false && b === 'FALSE') || (a === 'FALSE' && b === false)) return true;
  return false;
}
