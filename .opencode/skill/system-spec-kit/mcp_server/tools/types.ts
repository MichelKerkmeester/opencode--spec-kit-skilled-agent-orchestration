// ---------------------------------------------------------------
// MODULE: Tool Types
// ---------------------------------------------------------------
// Shared types for tool dispatch modules (T303).
// ---------------------------------------------------------------

// Re-export canonical MCPResponse from shared
export type { MCPResponse } from '@spec-kit/shared/types';

// Import for extension
import type { MCPResponse } from '@spec-kit/shared/types';
import { validateToolArgs } from '../schemas/tool-input-schemas';

/** Extended MCP response with auto-surfaced context (SK-004) */
export interface MCPResponseWithContext extends MCPResponse {
  autoSurfacedContext?: unknown;
}

/** Narrow pre-validated MCP tool args to a specific handler arg type.
 *  Centralises the single protocol-boundary cast so call sites stay clean. */
export function parseArgs<T>(args: Record<string, unknown>): T {
  // AI-WHY: Fix #36 (017-refinement-phase-6) — Guard against null/undefined/non-object
  // at the protocol boundary before casting.
  if (args == null || typeof args !== 'object') {
    return {} as T;
  }
  return args as unknown as T;
}

/** Parse and validate tool arguments using Zod schema definitions. */
export function parseValidatedArgs<T>(toolName: string, args: Record<string, unknown>): T {
  if (args == null || typeof args !== 'object') {
    return parseArgs<T>(validateToolArgs(toolName, {}));
  }
  return parseArgs<T>(validateToolArgs(toolName, args));
}

/* ---------------------------------------------------------------
   Handler Arg Types
--------------------------------------------------------------- */

export interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean;
  tokenUsage?: number;
  anchors?: string[];
}

export interface SearchArgs {
  query?: string;
  concepts?: string[];
  specFolder?: string;
  limit?: number;
  tier?: string;
  contextType?: string;
  useDecay?: boolean;
  includeContiguity?: boolean;
  includeConstitutional?: boolean;
  includeContent?: boolean;
  anchors?: string[];
  bypassCache?: boolean;
  sessionId?: string;
  enableDedup?: boolean;
  intent?: string;
  autoDetectIntent?: boolean;
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  rerank?: boolean;
  applyLengthPenalty?: boolean;
  applyStateLimits?: boolean;
  minState?: 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
  trackAccess?: boolean;
  includeArchived?: boolean;
  mode?: 'auto' | 'deep';
  includeTrace?: boolean;
}

export interface TriggerArgs {
  prompt: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
}

export interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

export interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  allowPartialUpdate?: boolean;
}

export interface ListArgs {
  limit?: number;
  offset?: number;
  specFolder?: string;
  sortBy?: string;
  includeChunks?: boolean;
}

export interface StatsArgs {
  folderRanking?: string;
  excludePatterns?: string[];
  includeScores?: boolean;
  includeArchived?: boolean;
  limit?: number;
}

export interface HealthArgs {
  reportMode?: 'full' | 'divergent_aliases';
  limit?: number;
  specFolder?: string;
  autoRepair?: boolean;
}

export interface MemoryValidateArgs {
  id: number | string;
  wasUseful: boolean;
  queryId?: string;
  queryTerms?: string[];
  resultRank?: number;
  totalResultsShown?: number;
  searchMode?: string;
  intent?: string;
  sessionId?: string;
  notes?: string;
}

export interface SaveArgs {
  filePath: string;
  force?: boolean;
  dryRun?: boolean;
  skipPreflight?: boolean;
  asyncEmbedding?: boolean; // T306: When true, embedding generation is deferred (non-blocking)
}

export interface ScanArgs {
  specFolder?: string | null;
  force?: boolean;
  includeConstitutional?: boolean;
  includeSpecDocs?: boolean;
  incremental?: boolean;
}

export interface CheckpointCreateArgs {
  name: string;
  specFolder?: string;
  metadata?: Record<string, unknown>;
}

export interface CheckpointListArgs {
  specFolder?: string;
  limit?: number;
}

export interface CheckpointRestoreArgs {
  name: string;
  clearExisting?: boolean;
}

export interface CheckpointDeleteArgs {
  name: string;
  confirmName: string;
}

export interface PreflightArgs {
  specFolder: string;
  taskId: string;
  knowledgeScore: number;
  uncertaintyScore: number;
  contextScore: number;
  knowledgeGaps?: string[];
  sessionId?: string | null;
}

export interface PostflightArgs {
  specFolder: string;
  taskId: string;
  knowledgeScore: number;
  uncertaintyScore: number;
  contextScore: number;
  gapsClosed?: string[];
  newGapsDiscovered?: string[];
}

export interface LearningHistoryArgs {
  specFolder: string;
  sessionId?: string;
  limit?: number;
  onlyComplete?: boolean;
  includeSummary?: boolean;
}

export interface DriftWhyArgs {
  memoryId: string | number;
  maxDepth?: number;
  direction?: string;
  relations?: string[] | null;
  includeMemoryDetails?: boolean;
}

export interface CausalLinkArgs {
  sourceId: string | number;
  targetId: string | number;
  relation: string;
  strength?: number;
  evidence?: string | null;
}

export interface CausalStatsArgs {
  _?: never;
}

export interface CausalUnlinkArgs {
  edgeId: number;
}

export interface BulkDeleteArgs {
  tier: string;
  specFolder?: string;
  confirm: boolean;
  olderThanDays?: number;
  skipCheckpoint?: boolean;
}

export interface EvalRunAblationArgs {
  channels?: Array<'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger'>;
  groundTruthQueryIds?: number[];
  recallK?: number;
  storeResults?: boolean;
  includeFormattedReport?: boolean;
}

export interface EvalReportingDashboardArgs {
  sprintFilter?: string[];
  channelFilter?: string[];
  metricFilter?: string[];
  limit?: number;
  format?: 'text' | 'json';
}

export interface IngestStartArgs {
  paths: string[];
  specFolder?: string;
}

export interface IngestStatusArgs {
  jobId: string;
}

export interface IngestCancelArgs {
  jobId: string;
}
