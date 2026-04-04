import type { CollectedDataBase } from '../types/session-types';
export interface SessionActivitySignal {
    toolCallPaths: string[];
    gitChangedFiles: string[];
    transcriptMentions: string[];
    confidenceBoost: number;
}
declare function buildSessionActivitySignal(collectedData: CollectedDataBase | null, candidateRelativePath: string): SessionActivitySignal;
export { buildSessionActivitySignal, };
//# sourceMappingURL=session-activity-signal.d.ts.map