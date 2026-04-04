import type { WeightedDocumentSections } from '@spec-kit/shared/index';
/** Message type classification labels */
export type MessageType = 'intent' | 'plan' | 'implementation' | 'result' | 'decision' | 'question' | 'context';
/** Message-like record for semantic analysis */
export interface SemanticMessage {
    prompt?: string;
    content?: string;
    CONTENT?: string;
    timestamp?: string;
    toolCalls?: Array<Record<string, unknown>>;
    _semanticType?: MessageType;
    [key: string]: unknown;
}
/** Observation record with file references */
export interface SemanticObservation {
    files?: string[];
    narrative?: string;
    [key: string]: unknown;
}
/** File change information */
export interface FileChangeInfo {
    action: string;
    description: string;
    changes: unknown[];
    mentions: number;
}
/** Extracted decision record */
export interface ExtractedDecision {
    question: string;
    choice: string;
    context: string;
}
/** File entry in the summary */
export interface SummaryFileEntry {
    path: string;
    description: string;
}
/** Message statistics breakdown */
export interface MessageStats {
    intent: number;
    plan: number;
    implementation: number;
    result: number;
    decision: number;
    total: number;
}
/** Summary options for controlling generation */
export interface SummaryOptions {
    maxFiles?: number;
    maxDecisions?: number;
    maxOutcomes?: number;
    includeStats?: boolean;
}
/** Implementation summary result */
export interface ImplementationSummary {
    task: string;
    solution: string;
    filesCreated: SummaryFileEntry[];
    filesModified: SummaryFileEntry[];
    decisions: ExtractedDecision[];
    outcomes: string[];
    triggerPhrases: string[];
    messageStats: MessageStats;
}
declare const MESSAGE_TYPES: Record<string, MessageType>;
declare function classifyMessage(content: string): MessageType;
declare function classifyMessages(messages: SemanticMessage[]): Map<MessageType, SemanticMessage[]>;
declare function extractFileChanges(messages: SemanticMessage[], observations?: SemanticObservation[]): Map<string, FileChangeInfo>;
declare function extractDecisions(messages: SemanticMessage[]): ExtractedDecision[];
declare function generateImplementationSummary(messages: SemanticMessage[], observations?: SemanticObservation[]): ImplementationSummary;
declare function formatSummaryAsMarkdown(summary: ImplementationSummary): string;
declare function buildWeightedEmbeddingSections(summary: ImplementationSummary, markdownContent: string): WeightedDocumentSections;
export { MESSAGE_TYPES, classifyMessage, classifyMessages, extractFileChanges, extractDecisions, generateImplementationSummary, buildWeightedEmbeddingSections, formatSummaryAsMarkdown, };
//# sourceMappingURL=semantic-summarizer.d.ts.map