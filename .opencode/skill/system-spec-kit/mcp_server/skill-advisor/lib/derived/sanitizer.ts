// ───────────────────────────────────────────────────────────────
// MODULE: Derived Metadata Sanitizer
// ───────────────────────────────────────────────────────────────

import { sanitizeSkillLabel } from '../../../lib/skill-advisor/render.js';
import { SKILL_DERIVED_SANITIZER_VERSION } from '../../schemas/skill-derived-v2.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type DerivedWriteBoundary =
  | 'sqlite'
  | 'graph-metadata'
  | 'envelope'
  | 'diagnostic';

export interface SanitizedBoundaryValue {
  readonly value: string;
  readonly boundary: DerivedWriteBoundary;
  readonly sanitizerVersion: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const MAX_VALUE_CHARS = 160;
const INSTRUCTION_SHAPE_PATTERN =
  /\b(ignore|override|forget|bypass|disable|execute|run|call|tool|system|developer|assistant|previous instructions|all instructions)\b/i;
const MARKUP_INSTRUCTION_PATTERN = /<!--|-->|```|<script\b|<\/script>|^\s*(system|instruction|developer|assistant)\s*:/i;

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function isInstructionShaped(value: string): boolean {
  return INSTRUCTION_SHAPE_PATTERN.test(value) || MARKUP_INSTRUCTION_PATTERN.test(value);
}

export function sanitizeDerivedValue(value: unknown, boundary: DerivedWriteBoundary): SanitizedBoundaryValue | null {
  if (typeof value !== 'string') return null;
  const collapsed = value.replace(/\s+/g, ' ').trim();
  if (!collapsed || collapsed.length > MAX_VALUE_CHARS || isInstructionShaped(collapsed)) {
    return null;
  }

  const sanitized = sanitizeSkillLabel(collapsed);
  if (!sanitized || isInstructionShaped(sanitized)) {
    return null;
  }

  return {
    value: sanitized,
    boundary,
    sanitizerVersion: SKILL_DERIVED_SANITIZER_VERSION,
  };
}

export function sanitizeDerivedArray(values: readonly unknown[], boundary: DerivedWriteBoundary, maxItems: number): string[] {
  const seen = new Set<string>();
  const sanitized: string[] = [];
  for (const value of values) {
    const result = sanitizeDerivedValue(value, boundary);
    if (!result) continue;
    const key = result.value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    sanitized.push(result.value);
    if (sanitized.length >= maxItems) break;
  }
  return sanitized;
}

export function sanitizeDiagnostic(value: string): string {
  return sanitizeDerivedValue(value, 'diagnostic')?.value ?? 'SANITIZED_DIAGNOSTIC';
}

export function sanitizeEnvelopeSkillLabel(value: string): string | null {
  return sanitizeDerivedValue(value, 'envelope')?.value ?? null;
}

export const DERIVED_SANITIZER_VERSION = SKILL_DERIVED_SANITIZER_VERSION;

