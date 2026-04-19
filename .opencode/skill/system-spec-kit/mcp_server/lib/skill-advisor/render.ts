// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Brief Renderer
// ───────────────────────────────────────────────────────────────

import { canonicalFold } from '@spec-kit/shared/unicode-normalization';
import type { AdvisorHookResult } from './skill-advisor-brief.js';
import type { AdvisorRecommendation } from './subprocess.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface AdvisorBriefRenderOptions {
  readonly tokenCap?: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const DEFAULT_TOKEN_CAP = 80;
const AMBIGUOUS_TOKEN_CAP = 120;
const MAX_TOKEN_CAP = 120;
const TOKEN_TO_CHAR_ESTIMATE = 4;
const AMBIGUITY_EPSILON = 1e-9;
const INSTRUCTION_LABEL_PATTERN =
  /^\s*(SYSTEM|INSTRUCTION|IGNORE|EXECUTE|<!--|```)|\b(ignore\s+(previous|all)\s+instructions|system\s*:|instruction\s*:|execute\s*:)/i;
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function clampTokenCap(tokenCap: number | undefined): number {
  if (typeof tokenCap !== 'number' || Number.isNaN(tokenCap)) {
    return DEFAULT_TOKEN_CAP;
  }
  return Math.min(Math.max(1, Math.floor(tokenCap)), MAX_TOKEN_CAP);
}

function capText(text: string, tokenCap: number): string {
  const charCap = tokenCap * TOKEN_TO_CHAR_ESTIMATE;
  if (text.length <= charCap) {
    return text;
  }
  const truncated = text.slice(0, Math.max(1, charCap - 3)).trimEnd();
  return `${truncated}...`;
}

function sanitizeSkillLabel(skillLabel: string | null | undefined): string | null {
  if (typeof skillLabel !== 'string') {
    return null;
  }
  const folded = canonicalFold(skillLabel);
  if (/[\n\r]/.test(folded)) {
    return null;
  }
  const singleLine = folded
    .replace(CONTROL_CHAR_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!singleLine || INSTRUCTION_LABEL_PATTERN.test(singleLine)) {
    return null;
  }
  return singleLine;
}

function formatScore(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00';
}

function passingRecommendations(result: AdvisorHookResult): readonly AdvisorRecommendation[] {
  return result.recommendations.filter((recommendation) => (
    recommendation.passes_threshold === true
    || (recommendation.confidence >= 0.8 && recommendation.uncertainty <= 0.35)
  ));
}

function isAmbiguous(recommendations: readonly AdvisorRecommendation[]): boolean {
  const [first, second] = recommendations;
  return !!first && !!second && Math.abs(first.confidence - second.confidence) <= 0.05 + AMBIGUITY_EPSILON;
}

function metadataSkillLabel(result: AdvisorHookResult): string | null {
  const metadata = result.sharedPayload?.metadata;
  return typeof metadata?.skillLabel === 'string' ? metadata.skillLabel : null;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

/**
 * Render the model-visible advisor brief from typed advisor output only.
 *
 * The renderer is the prompt-boundary guard: it ignores free-form reasons,
 * descriptions, stdout/stderr, and prompt text, and emits nothing when the
 * repository-authored skill label looks instruction-shaped after folding.
 */
export function renderAdvisorBrief(
  result: AdvisorHookResult,
  options: AdvisorBriefRenderOptions = {},
): string | null {
  if (result.status !== 'ok') {
    return null;
  }
  if (result.freshness !== 'live' && result.freshness !== 'stale') {
    return null;
  }

  const tokenCap = clampTokenCap(options.tokenCap);
  const recommendations = passingRecommendations(result);
  const [top, second] = recommendations;
  if (!top) {
    return null;
  }

  const topLabel = sanitizeSkillLabel(metadataSkillLabel(result) ?? top.skill);
  if (!topLabel) {
    return null;
  }

  if (tokenCap > DEFAULT_TOKEN_CAP && second && isAmbiguous(recommendations)) {
    const secondLabel = sanitizeSkillLabel(second.skill);
    if (!secondLabel) {
      return null;
    }
    return capText(
      `Advisor: ${result.freshness}; ambiguous: ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} vs ${secondLabel} ${formatScore(second.confidence)}/${formatScore(second.uncertainty)} pass.`,
      Math.min(tokenCap, AMBIGUOUS_TOKEN_CAP),
    );
  }

  return capText(
    `Advisor: ${result.freshness}; use ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} pass.`,
    Math.min(tokenCap, DEFAULT_TOKEN_CAP),
  );
}

export { sanitizeSkillLabel };
