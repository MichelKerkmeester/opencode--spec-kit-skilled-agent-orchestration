import type { ConversationPhaseLabel } from '../types/session-types';
/** Confidence level for tool call detection */
export type ToolConfidence = 'high' | 'medium' | 'low';
/** Result of tool call detection */
export interface ToolUsage {
    tool: string;
    confidence: ToolConfidence;
}
/** Tool call record for phase classification */
export interface ToolCallRecord {
    tool?: string;
    [key: string]: unknown;
}
/** Conversation phase classification labels */
export type ConversationPhase = ConversationPhaseLabel;
declare function detectToolCall(text: string): ToolUsage | null;
declare function isProseContext(text: string, matchStartIndex: number): boolean;
/** Pass-through wrapper. Prefer classifyPhaseViaSignals from phase-classifier.ts directly. */
declare function classifyConversationPhase(toolCalls: ToolCallRecord[], messageContent: string): ConversationPhase;
export { detectToolCall, isProseContext, classifyConversationPhase, };
//# sourceMappingURL=tool-detection.d.ts.map