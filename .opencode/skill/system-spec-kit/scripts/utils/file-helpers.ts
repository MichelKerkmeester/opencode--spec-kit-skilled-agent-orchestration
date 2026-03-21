// ---------------------------------------------------------------
// MODULE: File Helpers
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. FILE HELPERS
// ───────────────────────────────────────────────────────────────
// Path normalization, description cleaning, and file categorization utilities

import { posix as pathPosix } from 'node:path';

export type DescriptionTier = 'placeholder' | 'activity-only' | 'semantic' | 'high-confidence';

interface DescriptionValidationResult {
  tier: DescriptionTier;
  normalized: string;
}

const DESCRIPTION_TIER_ORDER: Record<DescriptionTier, number> = {
  placeholder: 0,
  'activity-only': 1,
  semantic: 2,
  'high-confidence': 3,
};

const PLACEHOLDER_PATTERNS: readonly RegExp[] = [
  /^$/,
  /\s(?:and|or|to|the)\s*$/i,
  /^(?:description\s+pending|\(description pending\))$/i,
  /^(?:modified during session|tracked file history snapshot)$/i,
  /^recent commit:\s*(?:add(?:ed)?|change(?:d)?|delete(?:d)?|modify(?:ied)?|rename(?:d)?|update(?:d)?)\b.*repository history$/i,
  /^(?:tbd|todo|pending|n\/a|na)$/i,
  /^\[placeholder\]/i,
  /^(?:changed|modified)$/i,
] as const;

const ACTIVITY_ONLY_PATTERNS: readonly RegExp[] = [
  /^(?:created|edited|updated|modified|changed|touched|refactored|cleaned)\s+\w+$/i,
  /^(?:created|edited|updated|modified|changed|touched|refactored|cleaned)(?:\s+(?:the\s+)?)?(?:file|files|code|logic|implementation|workflow|module|system|project|repository|tests?)$/i,
  /^(?:implemented|added)\s+(?:changes?|updates?|support|improvements?)$/i,
  /^(?:updated|modified)\s+(?:file|code)\s+(?:for|during|via)\b/i,
] as const;

const HIGH_CONFIDENCE_HINTS: readonly RegExp[] = [
  /(?:^|[\s(])(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+(?:[\s).,]|$)/,
  /\b(?:regex|parser|workflow|extractor|validator|scorer|threshold|enum|interface|schema|frontmatter|trigger|provenance|magnitude|capture|alignment|sufficiency|normalization|diffstat|commit-touch)\b/i,
  /\b(?:because|so that|via|using|while|after|before|to avoid|to prevent)\b/i,
];

function normalizeDescriptionForValidation(description: string): string {
  if (!description) {
    return '';
  }

  return description
    .trim()
    .replace(/^#+\s+/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[.,;:]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ───────────────────────────────────────────────────────────────
// 2. PATH UTILITIES
// ───────────────────────────────────────────────────────────────
function normalizeRelativePath(filePath: string, projectRoot?: string): string {
  if (!filePath) return '';
  let cleaned: string = pathPosix.normalize(filePath.replace(/\\/g, '/'));

  if (projectRoot) {
    // F-02: Segment-boundary containment check prevents partial-prefix matches
    // (e.g., root="/foo/bar" must not match "/foo/barbaz/file")
    const normalizedRoot = pathPosix.normalize(projectRoot.replace(/\\/g, '/'))
      .replace(/\/+$/, '');

    if (cleaned === normalizedRoot) {
      cleaned = '';
    } else if (cleaned.startsWith(normalizedRoot + '/')) {
      cleaned = cleaned.slice(normalizedRoot.length + 1);
    } else if (pathPosix.isAbsolute(cleaned)) {
      // Absolute path outside project root — reject
      return '';
    }
  }

  cleaned = cleaned.replace(/^\.\//, '');
  if (cleaned === '.') cleaned = '';
  if (cleaned.includes('../') || cleaned.startsWith('..')) return '';

  return cleaned;
}

function toCanonicalRelativePath(filePath: string, projectRoot?: string): string {
  return normalizeRelativePath(filePath, projectRoot);
}

function toRelativePath(filePath: string, projectRoot?: string): string {
  const cleaned = normalizeRelativePath(filePath, projectRoot);
  if (!cleaned) return '';

  if (cleaned.length > 60) {
    const parts: string[] = cleaned.split('/');
    if (parts.length > 3) {
      return `${parts[0]}/.../${parts.slice(-2).join('/')}`;
    }
  }

  return cleaned;
}

// ───────────────────────────────────────────────────────────────
// 3. DESCRIPTION UTILITIES
// ───────────────────────────────────────────────────────────────
function getDescriptionTierRank(tier: DescriptionTier): number {
  return DESCRIPTION_TIER_ORDER[tier];
}

function validateDescription(description: string): DescriptionValidationResult {
  const raw = description.trim();
  if (/^#+\s/.test(raw) || /^[-*]\s/.test(raw)) {
    return { tier: 'placeholder', normalized: normalizeDescriptionForValidation(description) };
  }

  const normalized = normalizeDescriptionForValidation(description);
  const lowered = normalized.toLowerCase();

  if (normalized.length < 8 || PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(lowered))) {
    return { tier: 'placeholder', normalized };
  }

  if (ACTIVITY_ONLY_PATTERNS.some((pattern) => pattern.test(lowered))) {
    return { tier: 'activity-only', normalized };
  }

  const highConfidenceSignals = HIGH_CONFIDENCE_HINTS.filter((pattern) => pattern.test(normalized)).length;
  if (normalized.length >= 48 && highConfidenceSignals >= 2) {
    return { tier: 'high-confidence', normalized };
  }

  return {
    tier: normalized.length >= 16 ? 'semantic' : 'activity-only',
    normalized,
  };
}

function isDescriptionValid(description: string): boolean {
  return getDescriptionTierRank(validateDescription(description).tier) > getDescriptionTierRank('placeholder');
}

function cleanDescription(desc: string): string {
  if (!desc) return '';
  let cleaned = normalizeDescriptionForValidation(desc);

  if (cleaned.length > 60) {
    const truncated = cleaned.substring(0, 57);
    const lastSpace = truncated.lastIndexOf(' ');
    cleaned = (lastSpace > 20 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

// ───────────────────────────────────────────────────────────────
// 4. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  toRelativePath,
  toCanonicalRelativePath,
  getDescriptionTierRank,
  validateDescription,
  isDescriptionValid,
  cleanDescription,
};
