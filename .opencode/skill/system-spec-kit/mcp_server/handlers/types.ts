// --- 1. HANDLER TYPES ---
// Re-exports canonical types from shared/ for handler convenience.
// Previously declared duplicates locally — now imports from the
// Single source of truth.
// Re-export canonical types from shared
export type {
  Database,
  DatabaseExtended,
  EmbeddingProfile,
  EmbeddingProfileExtended,
  MCPResponse,
} from '@spec-kit/shared/types';

/** Intent classification result from the intent classifier */
export interface IntentClassification {
  intent: string;
  confidence: number;
  fallback?: boolean;
  reason?: string;
}
