import type { CollectedDataSubset, DiagramOutput, AutoDecisionTree, DiagramTypeCount, PatternSummaryEntry, PhaseEntry, DiagramData } from '../types/session-types';
export type { DiagramOutput, AutoDecisionTree, DiagramTypeCount, PatternSummaryEntry, PhaseEntry, DiagramData, };
declare function extractPhasesFromData(collectedData: CollectedDataSubset<'observations' | 'userPrompts'> | null): PhaseEntry[];
declare function extractDiagrams(collectedData: CollectedDataSubset<'observations' | 'userPrompts'> | null): Promise<DiagramData>;
export { extractPhasesFromData, extractDiagrams };
//# sourceMappingURL=diagram-extractor.d.ts.map