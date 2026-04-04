import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
import type { MemoryTemplateContractResult } from '@spec-kit/shared/parsing/memory-template-contract';
import type { QualityLoopResult } from '../../handlers/quality-loop.js';
import type { IndexResult, ParsedMemory } from './types.js';
import type { ParsedMemoryValidation } from '../../lib/parsing/memory-parser.js';
declare function applyInsufficiencyMetadata(parsed: ParsedMemory, sufficiencyResult: MemorySufficiencyResult): void;
declare function buildInsufficiencyRejectionResult(parsed: ParsedMemory, validation: ParsedMemoryValidation, sufficiencyResult: MemorySufficiencyResult): IndexResult;
declare function buildTemplateContractRejectionResult(parsed: ParsedMemory, validation: ParsedMemoryValidation, templateContract: MemoryTemplateContractResult): IndexResult;
declare function buildDryRunSummary(sufficiencyResult: MemorySufficiencyResult, qualityLoopResult: QualityLoopResult, templateContract: MemoryTemplateContractResult): string;
export { applyInsufficiencyMetadata, buildInsufficiencyRejectionResult, buildTemplateContractRejectionResult, buildDryRunSummary, };
//# sourceMappingURL=validation-responses.d.ts.map