import type { QualityFlag, QualityScoreResult } from '../types/session-types';
import type { ContaminationSeverity } from './contamination-filter';
import { type QualityRuleId } from '../lib/validate-memory-quality';
interface ValidationSignal {
    ruleId: QualityRuleId;
    passed: boolean;
}
interface QualityInputs {
    content: string;
    validatorSignals?: ValidationSignal[];
    hadContamination?: boolean;
    contaminationSeverity?: ContaminationSeverity | null;
    messageCount?: number;
    toolCount?: number;
    decisionCount?: number;
    sufficiencyScore?: number;
    insufficientContext?: boolean;
}
declare function scoreMemoryQuality(inputs: QualityInputs): QualityScoreResult;
export { scoreMemoryQuality, };
export type { QualityFlag, QualityInputs, QualityScoreResult, ValidationSignal, };
//# sourceMappingURL=quality-scorer.d.ts.map