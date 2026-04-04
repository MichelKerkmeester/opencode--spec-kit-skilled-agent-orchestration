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
export type ImportanceTier = 'constitutional' | 'critical' | 'important' | 'normal' | 'temporary' | 'deprecated';
export declare const IMPORTANCE_TIERS: Readonly<Record<ImportanceTier, TierConfig>>;
export declare const VALID_TIERS: readonly ImportanceTier[];
export declare const DEFAULT_TIER: ImportanceTier;
export declare function getTierConfig(tierName: string | null | undefined): TierConfig;
export declare function applyTierBoost(score: number, tier: string): number;
export declare function isExcludedFromSearch(tier: string): boolean;
export declare function allowsDecay(tier: string): boolean;
export declare function getAutoExpireDays(tier: string): number | null;
export declare function isValidTier(tier: string | null | undefined): boolean;
export declare function getTierValue(tier: string): number;
export declare function getExpiredTemporaryFilter(): string;
export declare function getSearchableTiersFilter(): string;
export declare function shouldAlwaysSurface(tier: string): boolean;
export declare function getMaxTokens(tier: string): number | null;
export declare function getConstitutionalFilter(): string;
export declare function normalizeTier(tier: string | null | undefined): ImportanceTier;
export declare function compareTiers(tierA: string, tierB: string): number;
export declare function getTiersByImportance(): ImportanceTier[];
/**
 * Get the default importance tier for a given document type.
 * Spec/plan/decision-record are 'important'; others are 'normal'.
 */
export declare function normalizeDocumentType(documentType: string | null | undefined): string;
export declare function getDefaultTierForDocumentType(documentType: string): ImportanceTier;
//# sourceMappingURL=importance-tiers.d.ts.map