// ───────────────────────────────────────────────────────────────
// MODULE: Importance Tiers
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
export interface TierConfig {
  value: number;
  searchBoost: number;
  decay: boolean;
  autoExpireDays: number | null;
  excludeFromSearch?: boolean;
  alwaysSurface?: boolean;
  maxTokens?: number;
  description: string;
}

export type ImportanceTier =
  | 'constitutional'
  | 'critical'
  | 'important'
  | 'normal'
  | 'temporary'
  | 'deprecated';

// ───────────────────────────────────────────────────────────────
// 2. TIER CONFIGURATION

// ───────────────────────────────────────────────────────────────
export const IMPORTANCE_TIERS: Readonly<Record<ImportanceTier, TierConfig>> = {
  constitutional: {
    value: 1.0,
    searchBoost: 3.0,
    decay: false,
    autoExpireDays: null,
    alwaysSurface: true,
    maxTokens: 2000,
    description: 'Core rules and constraints - always surface at top of results',
  },
  critical: {
    value: 1.0,
    searchBoost: 2.0,
    decay: false,
    autoExpireDays: null,
    description: 'Never expire, always surface first',
  },
  important: {
    value: 0.8,
    searchBoost: 1.5,
    decay: false,
    autoExpireDays: null,
    description: 'High priority, no decay',
  },
  normal: {
    value: 0.5,
    searchBoost: 1.0,
    decay: true,
    autoExpireDays: null,
    description: 'Standard memory',
  },
  temporary: {
    value: 0.3,
    searchBoost: 0.5,
    decay: true,
    autoExpireDays: 7,
    description: 'Session-scoped, auto-expires',
  },
  deprecated: {
    value: 0.1,
    searchBoost: 0.0,
    decay: false,
    autoExpireDays: null,
    excludeFromSearch: true,
    description: 'Hidden from search results',
  },
};

export const VALID_TIERS: readonly ImportanceTier[] = Object.keys(IMPORTANCE_TIERS) as ImportanceTier[];
export const DEFAULT_TIER: ImportanceTier = 'normal';

// ───────────────────────────────────────────────────────────────
// 3. TIER CONFIGURATION FUNCTIONS

// ───────────────────────────────────────────────────────────────
// Get tier configuration by name (returns normal tier if invalid)
export function getTierConfig(tierName: string | null | undefined): TierConfig {
  if (!tierName || typeof tierName !== 'string') {
    return IMPORTANCE_TIERS[DEFAULT_TIER];
  }
  return IMPORTANCE_TIERS[tierName.toLowerCase() as ImportanceTier] || IMPORTANCE_TIERS[DEFAULT_TIER];
}

// Apply tier boost to a search score (critical=2x, important=1.5x, etc.)
export function applyTierBoost(score: number, tier: string): number {
  if (typeof score !== 'number' || isNaN(score) || !isFinite(score)) {
    return 0;
  }
  const config = getTierConfig(tier);
  return score * config.searchBoost;
}

// Check if tier should be excluded from search (deprecated tier)
export function isExcludedFromSearch(tier: string): boolean {
  const config = getTierConfig(tier);
  return config.excludeFromSearch === true;
}

// Check if tier allows decay over time (normal, temporary)
export function allowsDecay(tier: string): boolean {
  const config = getTierConfig(tier);
  return config.decay === true;
}

// Get auto-expiration days for tier (null = never expires)
export function getAutoExpireDays(tier: string): number | null {
  const config = getTierConfig(tier);
  return config.autoExpireDays;
}

// Validate if tier name is valid
export function isValidTier(tier: string | null | undefined): boolean {
  if (!tier || typeof tier !== 'string') {
    return false;
  }
  return (VALID_TIERS as readonly string[]).includes(tier.toLowerCase());
}

// Get numeric importance value for tier (0.0-1.0)
export function getTierValue(tier: string): number {
  const config = getTierConfig(tier);
  return config.value;
}

// ───────────────────────────────────────────────────────────────
// 4. SQL FILTER HELPERS

// ───────────────────────────────────────────────────────────────
// SQL WHERE clause for finding expired temporary memories
export function getExpiredTemporaryFilter(): string {
  const tempConfig = IMPORTANCE_TIERS.temporary;
  const days = tempConfig.autoExpireDays;
  return `importance_tier = 'temporary' AND created_at < datetime('now', '-${days} days')`;
}

// SQL WHERE clause for searchable tiers (excludes deprecated)
export function getSearchableTiersFilter(): string {
  return "importance_tier != 'deprecated'";
}

// Check if tier should always surface in search (constitutional)
export function shouldAlwaysSurface(tier: string): boolean {
  const config = getTierConfig(tier);
  return config.alwaysSurface === true;
}

// Get maximum token budget for tier (null = unlimited)
export function getMaxTokens(tier: string): number | null {
  const config = getTierConfig(tier);
  return config.maxTokens || null;
}

// SQL WHERE clause for constitutional tier
export function getConstitutionalFilter(): string {
  return "importance_tier = 'constitutional'";
}

// ───────────────────────────────────────────────────────────────
// 5. UTILITY FUNCTIONS

// ───────────────────────────────────────────────────────────────
// Normalize tier input to valid tier name (returns default if invalid)
export function normalizeTier(tier: string | null | undefined): ImportanceTier {
  if (!tier || typeof tier !== 'string') {
    return DEFAULT_TIER;
  }
  const normalized = tier.toLowerCase() as ImportanceTier;
  return (VALID_TIERS as readonly string[]).includes(normalized) ? normalized : DEFAULT_TIER;
}

// Compare tiers for sorting (negative if A > B, positive if B > A)
export function compareTiers(tierA: string, tierB: string): number {
  const valueA = getTierValue(tierA);
  const valueB = getTierValue(tierB);
  return valueB - valueA; // Higher value = more important, so reverse for descending sort
}

// Get all tiers sorted by importance (highest first)
export function getTiersByImportance(): ImportanceTier[] {
  return ([...VALID_TIERS] as ImportanceTier[]).sort((a, b) => {
    return IMPORTANCE_TIERS[b].value - IMPORTANCE_TIERS[a].value;
  });
}

// 5. DOCUMENT TYPE HELPERS

/**
 * Get the default importance tier for a given document type.
 * Spec/plan/decision-record are 'important'; others are 'normal'.
 */
export function normalizeDocumentType(documentType: string | null | undefined): string {
  if (!documentType || typeof documentType !== 'string') {
    return 'memory';
  }

  return documentType
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

export function getDefaultTierForDocumentType(documentType: string): ImportanceTier {
  const DOC_TYPE_TIERS: Record<string, ImportanceTier> = {
    spec: 'important',
    plan: 'important',
    decision_record: 'important',
    constitutional: 'constitutional',
    tasks: 'normal',
    checklist: 'normal',
    implementation_summary: 'normal',
    research: 'normal',
    handover: 'normal',
    memory: 'normal',
  };

  const normalizedDocumentType = normalizeDocumentType(documentType);
  return DOC_TYPE_TIERS[normalizedDocumentType] || 'normal';
}
