import type { ContaminationAuditRecord } from './content-filter';
import type { DataSource } from '../utils/input-normalizer';
import { type KnownDataSource } from '../utils/source-capabilities';
type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14';
type ValidationRuleSeverity = 'low' | 'medium' | 'high';
type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';
interface ValidationRuleMetadata {
    ruleId: QualityRuleId;
    name: string;
    severity: ValidationRuleSeverity;
    blockOnWrite: boolean;
    blockOnIndex: boolean;
    appliesToSources: 'all' | readonly KnownDataSource[];
    reason: string;
}
interface ValidationDispositionResult {
    disposition: ValidationDisposition;
    blockingRuleIds: QualityRuleId[];
    indexBlockingRuleIds: QualityRuleId[];
    softRuleIds: QualityRuleId[];
}
declare const VALIDATION_RULE_METADATA: Record<QualityRuleId, ValidationRuleMetadata>;
declare const HARD_BLOCK_RULES: readonly QualityRuleId[];
interface RuleResult {
    ruleId: QualityRuleId;
    name?: string;
    passed: boolean;
    message: string;
}
interface ValidationResult {
    valid: boolean;
    failedRules: QualityRuleId[];
    ruleResults: RuleResult[];
    contaminationAudit: ContaminationAuditRecord;
}
declare function getRuleMetadata(ruleId: QualityRuleId): ValidationRuleMetadata;
declare function shouldBlockWrite(ruleId: QualityRuleId, source?: DataSource | string | null): boolean;
declare function shouldBlockIndex(ruleId: QualityRuleId, source?: DataSource | string | null): boolean;
declare function determineValidationDisposition(failedRules: readonly QualityRuleId[], source?: DataSource | string | null): ValidationDispositionResult;
declare function validateMemoryQualityContent(content: string, options?: {
    filePath?: string;
    source?: DataSource | string | null;
}): ValidationResult;
declare function validateMemoryQualityFile(filePath: string): ValidationResult;
export { HARD_BLOCK_RULES, VALIDATION_RULE_METADATA, determineValidationDisposition, getRuleMetadata, shouldBlockIndex, shouldBlockWrite, validateMemoryQualityContent, validateMemoryQualityFile, };
export type { ValidationDisposition, ValidationDispositionResult, ValidationRuleMetadata, ValidationRuleSeverity, QualityRuleId, ValidationResult, RuleResult, };
//# sourceMappingURL=validate-memory-quality.d.ts.map