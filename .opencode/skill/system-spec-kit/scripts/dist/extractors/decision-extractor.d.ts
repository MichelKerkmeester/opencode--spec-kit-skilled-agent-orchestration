import type { CollectedDataSubset, DecisionOption, DecisionRecord, DecisionData } from '../types/session-types';
export type { DecisionOption, DecisionRecord, DecisionData };
declare function extractDecisions(collectedData: CollectedDataSubset<'_manualDecisions' | 'SPEC_FOLDER' | 'userPrompts' | 'observations'> | null): Promise<DecisionData>;
export { extractDecisions };
//# sourceMappingURL=decision-extractor.d.ts.map