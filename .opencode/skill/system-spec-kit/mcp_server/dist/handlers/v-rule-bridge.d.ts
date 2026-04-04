type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';
type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';
interface RuleResult {
    ruleId: QualityRuleId;
    passed: boolean;
    message: string;
}
interface ValidationResult {
    valid: boolean;
    failedRules: QualityRuleId[];
    ruleResults: RuleResult[];
}
interface ValidationDispositionResult {
    disposition: ValidationDisposition;
    blockingRuleIds: QualityRuleId[];
    indexBlockingRuleIds: QualityRuleId[];
    softRuleIds: QualityRuleId[];
}
type VRuleUnavailableResult = {
    passed: false;
    status: 'error' | 'warning';
    message: string;
    _unavailable: true;
};
export declare function validateMemoryQualityContent(content: string, options?: {
    filePath?: string;
}): ValidationResult | VRuleUnavailableResult | null;
/** Check whether the V-rule validator module is loaded and operational. */
export declare function isVRuleBridgeAvailable(): boolean;
export declare function determineValidationDisposition(failedRules: readonly QualityRuleId[], source?: string | null): ValidationDispositionResult | null;
export type { ValidationResult, ValidationDispositionResult, QualityRuleId };
//# sourceMappingURL=v-rule-bridge.d.ts.map