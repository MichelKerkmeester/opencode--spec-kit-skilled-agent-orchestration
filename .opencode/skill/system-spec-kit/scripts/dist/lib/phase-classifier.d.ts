import type { ConversationPhase, ConversationPhaseLabel, TopicCluster } from '../types/session-types';
/** Input shape for a single conversation exchange to be classified. */
export interface PhaseClassifierExchangeInput {
    id: string;
    messageIndexes: number[];
    observationIndexes: number[];
    prompt: string;
    narratives: string[];
    factTexts: string[];
    toolNames: string[];
    observationTypes: string[];
    startTimestamp: string;
    endTimestamp: string;
}
/** Result of classifying conversation exchanges into topic clusters and phases. */
export interface PhaseClassificationResult {
    topicClusters: TopicCluster[];
    phases: ConversationPhase[];
    flowPattern: string;
    uniquePhaseCount: number;
}
/** Classifies conversation exchanges into topic clusters, phases, and a flow pattern. */
export declare function classifyConversationExchanges(exchanges: PhaseClassifierExchangeInput[]): PhaseClassificationResult;
/** Backward-compatible single-exchange classifier returning only the phase label. */
export declare function classifyConversationPhase(toolCalls: Array<{
    tool?: string;
}>, messageContent: string): ConversationPhaseLabel;
//# sourceMappingURL=phase-classifier.d.ts.map