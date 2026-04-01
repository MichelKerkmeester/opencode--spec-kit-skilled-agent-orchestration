// ───────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────
// Shared types for tool dispatch modules (T303).
// Re-export canonical MCPResponse from shared
export type { MCPResponse } from '@spec-kit/shared/types';

/** Narrow pre-validated MCP tool args to a specific handler arg type.
 *  Centralises the single protocol-boundary cast so call sites stay clean. */
export function parseArgs<T>(args: Record<string, unknown>): T {
  // Guard against null/undefined/non-object
  // At the protocol boundary before casting.
  if (args == null || typeof args !== 'object') {
    return {} as T;
  }
  return args as unknown as T;
}

/* ───────────────────────────────────────────────────────────────
   Handler Arg Types
──────────────────────────────────────────────────────────────── */

/** Arguments for memory context requests. */
export interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean;
  tokenUsage?: number;
  anchors?: string[];
  profile?: 'quick' | 'research' | 'resume' | 'debug';
}

/** Arguments for memory search requests. */
export interface SearchArgs {
  cursor?: string;
  query?: string;
  concepts?: string[];
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
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

/** Arguments for trigger matching requests. */
export interface TriggerArgs {
  prompt: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
}

/** Arguments for memory deletion requests. */
export interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

/** Arguments for memory update requests. */
export interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  allowPartialUpdate?: boolean;
}

/** Arguments for memory listing requests. */
export interface ListArgs {
  limit?: number;
  offset?: number;
  specFolder?: string;
  sortBy?: string;
  includeChunks?: boolean;
}

/** Arguments for memory statistics requests. */
export interface StatsArgs {
  folderRanking?: string;
  excludePatterns?: string[];
  includeScores?: boolean;
  includeArchived?: boolean;
  limit?: number;
}

/** Arguments for memory health checks.
 * Intentionally declared inline to preserve the public interface contract
 * asserted by context-server.vitest.ts. */
export interface HealthArgs {
  reportMode?: 'full' | 'divergent_aliases';
  limit?: number;
  specFolder?: string;
  autoRepair?: boolean;
  confirmed?: boolean;
}

/** Arguments for memory validation feedback requests. */
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

/** Arguments for memory save requests. */
export interface SaveArgs {
  filePath: string;
  force?: boolean;
  dryRun?: boolean;
  skipPreflight?: boolean;
  asyncEmbedding?: boolean; // T306: When true, embedding generation is deferred (non-blocking)
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  sharedSpaceId?: string;
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
  deleteAfter?: string;
}

/** Arguments for memory index scan requests. */
export interface ScanArgs {
  specFolder?: string | null;
  force?: boolean;
  includeConstitutional?: boolean;
  includeSpecDocs?: boolean;
  incremental?: boolean;
}

export interface SharedSpaceUpsertArgs {
  spaceId: string;
  tenantId: string;
  name: string;
  actorUserId?: string;
  actorAgentId?: string;
  rolloutEnabled?: boolean;
  rolloutCohort?: string;
  killSwitch?: boolean;
}

export interface SharedSpaceMembershipArgs {
  spaceId: string;
  tenantId: string;
  actorUserId?: string;
  actorAgentId?: string;
  subjectType: 'user' | 'agent';
  subjectId: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface SharedMemoryStatusArgs {
  tenantId?: string;
  actorUserId?: string;
  actorAgentId?: string;
}

/** Arguments for session resume requests. */
export interface SessionResumeArgs {
  specFolder?: string;
  minimal?: boolean;
}

/** Arguments for session bootstrap requests. */
export interface SessionBootstrapArgs {
  specFolder?: string;
}

/** Arguments for checkpoint creation requests. */
export interface CheckpointCreateArgs {
  name: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  metadata?: Record<string, unknown>;
}

/** Arguments for checkpoint listing requests. */
export interface CheckpointListArgs {
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
}

/** Arguments for checkpoint restore requests. */
export interface CheckpointRestoreArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  clearExisting?: boolean;
}

/** Arguments for checkpoint deletion requests. */
export interface CheckpointDeleteArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  confirmName: string;
}

/** Arguments for task preflight requests. */
export interface PreflightArgs {
  specFolder: string;
  taskId: string;
  knowledgeScore: number;
  uncertaintyScore: number;
  contextScore: number;
  knowledgeGaps?: string[];
  sessionId?: string | null;
}

/** Arguments for task postflight requests. */
export interface PostflightArgs {
  specFolder: string;
  taskId: string;
  knowledgeScore: number;
  uncertaintyScore: number;
  contextScore: number;
  gapsClosed?: string[];
  newGapsDiscovered?: string[];
  sessionId?: string | null;
}

/** Arguments for learning history requests. */
export interface LearningHistoryArgs {
  specFolder: string;
  sessionId?: string;
  limit?: number;
  onlyComplete?: boolean;
  includeSummary?: boolean;
}

/** Arguments for causal drift trace requests. */
export interface DriftWhyArgs {
  memoryId: string | number;
  maxDepth?: number;
  direction?: string;
  relations?: string[] | null;
  includeMemoryDetails?: boolean;
}

/** Arguments for causal link creation requests. */
export interface CausalLinkArgs {
  sourceId: string | number;
  targetId: string | number;
  relation: string;
  strength?: number;
  evidence?: string | null;
}

/** Arguments for causal statistics requests. */
export interface CausalStatsArgs {
  _?: never;
}

/** Arguments for causal link removal requests. */
export interface CausalUnlinkArgs {
  edgeId: number;
}

/** Arguments for bulk memory deletion requests. */
export interface BulkDeleteArgs {
  tier: string;
  specFolder?: string;
  confirm: boolean;
  olderThanDays?: number;
  skipCheckpoint?: boolean;
}

/** Arguments for evaluation ablation runs. */
export interface EvalRunAblationArgs {
  mode?: 'ablation' | 'k_sensitivity';
  channels?: Array<'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger'>;
  queries?: string[];
  groundTruthQueryIds?: number[];
  recallK?: number;
  storeResults?: boolean;
  includeFormattedReport?: boolean;
}

/** Arguments for evaluation dashboard requests. */
export interface EvalReportingDashboardArgs {
  sprintFilter?: string[];
  channelFilter?: string[];
  metricFilter?: string[];
  limit?: number;
  format?: 'text' | 'json';
}

/** Arguments for ingestion job start requests. */
export interface IngestStartArgs {
  paths: string[];
  specFolder?: string;
}

/** Arguments for ingestion job status requests. */
export interface IngestStatusArgs {
  jobId: string;
}

/** Arguments for ingestion job cancellation requests. */
export interface IngestCancelArgs {
  jobId: string;
}
