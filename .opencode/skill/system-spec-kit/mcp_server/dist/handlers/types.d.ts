export type { Database, DatabaseExtended, EmbeddingProfile, EmbeddingProfileExtended, MCPResponse, } from '@spec-kit/shared/types';
/** Intent classification result from the intent classifier */
export interface IntentClassification {
    intent: string;
    confidence: number;
    fallback?: boolean;
    reason?: string;
}
//# sourceMappingURL=types.d.ts.map