import type { CollectedDataSubset, ConversationData, ConversationMessage, ConversationPhase, ToolCallEntry } from '../types/session-types';
export type { ToolCallEntry, ConversationMessage, ConversationPhase, ConversationData, };
declare function extractConversations(collectedData: CollectedDataSubset<'userPrompts' | 'observations' | 'sessionSummary' | 'keyDecisions' | 'nextSteps'> | null): Promise<ConversationData>;
export { extractConversations, };
//# sourceMappingURL=conversation-extractor.d.ts.map