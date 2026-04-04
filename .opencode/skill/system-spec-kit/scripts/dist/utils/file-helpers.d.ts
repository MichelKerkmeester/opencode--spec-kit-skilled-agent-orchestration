export type DescriptionTier = 'placeholder' | 'activity-only' | 'semantic' | 'high-confidence';
interface DescriptionValidationResult {
    tier: DescriptionTier;
    normalized: string;
}
declare function toCanonicalRelativePath(filePath: string, projectRoot?: string): string;
declare function toRelativePath(filePath: string, projectRoot?: string): string;
declare function getDescriptionTierRank(tier: DescriptionTier): number;
declare function validateDescription(description: string): DescriptionValidationResult;
declare function isDescriptionValid(description: string): boolean;
declare function cleanDescription(desc: string): string;
export { toRelativePath, toCanonicalRelativePath, getDescriptionTierRank, validateDescription, isDescriptionValid, cleanDescription, };
//# sourceMappingURL=file-helpers.d.ts.map