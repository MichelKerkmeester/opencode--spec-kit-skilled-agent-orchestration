import type { OptionRecord, EvidenceRecord, CaveatRecord, FollowUpRecord } from './ascii-boxes';
import type { DecisionRecord } from '../types/session-types';
/**
 * Decision node data for tree generation.
 *
 * Scalar fields are derived from DecisionRecord (session-types.ts) via
 * Partial<Pick<…>> so they stay in sync with the canonical type.
 * Array fields use the wider ascii-boxes rendering types (OptionRecord,
 * EvidenceRecord, etc.) because the formatting functions accept both
 * structured records and plain strings.
 */
export type DecisionNode = Partial<Pick<DecisionRecord, 'TITLE' | 'CONTEXT' | 'CONFIDENCE' | 'CHOICE_CONFIDENCE' | 'RATIONALE_CONFIDENCE' | 'TIMESTAMP' | 'CHOSEN' | 'RATIONALE'>> & {
    OPTIONS?: OptionRecord[];
    EVIDENCE?: Array<EvidenceRecord | string>;
    CAVEATS?: Array<CaveatRecord | string>;
    FOLLOWUP?: Array<FollowUpRecord | string>;
};
declare function generateDecisionTree(decisionData: DecisionNode | string, ...args: unknown[]): string;
export { generateDecisionTree };
//# sourceMappingURL=decision-tree-generator.d.ts.map