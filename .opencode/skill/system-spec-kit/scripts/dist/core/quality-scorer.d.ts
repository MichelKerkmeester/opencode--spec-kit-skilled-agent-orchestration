import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
import type { DescriptionProvenance, QualityScoreResult } from '../types/session-types';
import type { ContaminationSeverity } from '../extractors/contamination-filter';
interface FileWithDescription {
    DESCRIPTION?: string;
    _provenance?: DescriptionProvenance;
    _synthetic?: boolean;
}
interface ObservationWithNarrative {
    TITLE?: string;
    NARRATIVE?: string;
}
export type { QualityFlag, QualityDimensionScore, QualityInsufficiencySummary, QualityScoreResult } from '../types/session-types';
export declare function scoreMemoryQuality(content: string, triggerPhrases: string[], keyTopics: string[], files: FileWithDescription[], observations: ObservationWithNarrative[], sufficiencyResult?: MemorySufficiencyResult, hadContamination?: boolean, contaminationSeverity?: ContaminationSeverity | null): QualityScoreResult;
//# sourceMappingURL=quality-scorer.d.ts.map