// ───────────────────────────────────────────────────────────────
// MODULE: Tool Input Schemas
// ───────────────────────────────────────────────────────────────
// Centralized strict Zod validation schemas for MCP tool inputs.
// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { z, ZodError, type ZodType } from 'zod';

// Feature catalog: Strict Zod schema validation

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

type ToolInput = Record<string, unknown>;
type ToolInputSchema = ZodType<ToolInput>;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
  const base = z.object(shape);
  return strict ? base.strict() : base.passthrough();
};

/* ───────────────────────────────────────────────────────────────
   4. CONSTANTS
──────────────────────────────────────────────────────────────── */

// Guard against safeNumericPreprocess.pipe(z.number()) coercing "", null, and false to 0.
// Use a safe preprocessor that only accepts actual numbers or numeric strings.
const safeNumericPreprocess = z.preprocess((val) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim().length > 0) {
    const parsed = Number(val);
    return Number.isFinite(parsed) ? parsed : val;
  }
  return val;
}, z.number());

const positiveInt = safeNumericPreprocess.pipe(z.number().int().positive());
const positiveIntMax = (max: number) => safeNumericPreprocess.pipe(z.number().int().min(1).max(max));
const boundedNumber = (min: number, max: number) => safeNumericPreprocess.pipe(z.number().min(min).max(max));
const optionalStringArray = z.array(z.string()).optional();

const PATH_TRAVERSAL_MESSAGE = 'Path must not contain traversal sequences';
const isSafePath = (value: string): boolean => !value.includes('..') && !value.includes('\0');
const pathString = (minLength = 0) => {
  let schema = z.string();
  if (minLength > 0) {
    schema = schema.min(minLength);
  }
  return schema.refine(isSafePath, { message: PATH_TRAVERSAL_MESSAGE });
};
const optionalPathString = (minLength = 0) => pathString(minLength).optional();

/** Shared max paths constant — used by both schema and handler. */
export const MAX_INGEST_PATHS = 50;
export const MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS = 1;

const intentEnum = z.enum([
  'add_feature',
  'fix_bug',
  'refactor',
  'security_audit',
  'understand',
  'find_spec',
  'find_decision',
]);

const importanceTierEnum = z.enum([
  'constitutional',
  'critical',
  'important',
  'normal',
  'temporary',
  'deprecated',
]);

const relationEnum = z.enum([
  'caused',
  'enabled',
  'supersedes',
  'contradicts',
  'derived_from',
  'supports',
]);

/* ───────────────────────────────────────────────────────────────
   5. SCHEMA DEFINITIONS
──────────────────────────────────────────────────────────────── */

const memoryContextSchema = getSchema({
  input: z.string().min(1),
  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
  intent: intentEnum.optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  sessionId: z.string().optional(),
  enableDedup: z.boolean().optional(),
  includeContent: z.boolean().optional(),
  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
  tokenUsage: boundedNumber(0, 1).optional(),
  anchors: optionalStringArray,
  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
});

const memorySearchSchema = getSchema({
  cursor: z.string().min(1).optional(),
  query: z.string().min(2).max(1000).optional(),
  concepts: z.array(z.string().min(1)).min(2).max(5).optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  sessionId: z.string().optional(),
  enableDedup: z.boolean().optional(),
  tier: importanceTierEnum.optional(),
  contextType: z.string().optional(),
  useDecay: z.boolean().optional(),
  includeContiguity: z.boolean().optional(),
  includeConstitutional: z.boolean().optional(),
  enableSessionBoost: z.boolean().optional(),
  enableCausalBoost: z.boolean().optional(),
  includeContent: z.boolean().optional(),
  anchors: optionalStringArray,
  min_quality_score: boundedNumber(0, 1).optional(),
  minQualityScore: boundedNumber(0, 1).optional(),
  bypassCache: z.boolean().optional(),
  rerank: z.boolean().optional(),
  applyLengthPenalty: z.boolean().optional(),
  applyStateLimits: z.boolean().optional(),
  minState: z.enum(['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED']).optional(),
  intent: intentEnum.optional(),
  autoDetectIntent: z.boolean().optional(),
  trackAccess: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
  mode: z.enum(['auto', 'deep']).optional(),
  includeTrace: z.boolean().optional(),
  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
});

// E3: Simplified search schema — 3 params only
const memoryQuickSearchSchema = getSchema({
  query: z.string().min(2).max(1000),
  limit: positiveIntMax(100).optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
});

const memoryMatchTriggersSchema = getSchema({
  prompt: z.string().min(1),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  session_id: z.string().optional(),
  turnNumber: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  include_cognitive: z.boolean().optional(),
});

const memorySaveSchema = getSchema({
  filePath: pathString(1),
  force: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  skipPreflight: z.boolean().optional(),
  asyncEmbedding: z.boolean().optional(),
  // Governance args — accepted by tool-schemas.ts tool definition and
  // validated at runtime by scope-governance.ts (F3.04 fix).
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sessionId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  provenanceSource: z.string().optional(),
  provenanceActor: z.string().optional(),
  governedAt: z.string().optional(),
  retentionPolicy: z.enum(['keep', 'ephemeral', 'shared']).optional(),
  deleteAfter: z.string().optional(),
});

// Discriminated delete: branch 1 requires `id` (single-record delete).
// Branch 2 requires `specFolder` + `confirm: true` (bulk folder delete).
// Codex fix: `confirm` accepts only `true` (not `false`) in both branches
// To prevent semantically meaningless `confirm: false` from passing validation.
const memoryDeleteSchema = getSchema({
  id: positiveInt.optional().describe('Memory ID to delete (required unless specFolder + confirm provided for bulk)'),
  specFolder: optionalPathString().describe('Spec folder scope for bulk delete (requires confirm: true)'),
  confirm: z.boolean().optional().describe('Must be true for spec-folder bulk delete'),
});

const memoryUpdateSchema = getSchema({
  id: positiveInt,
  title: z.string().optional(),
  triggerPhrases: optionalStringArray,
  importanceWeight: boundedNumber(0, 1).optional(),
  importanceTier: importanceTierEnum.optional(),
  allowPartialUpdate: z.boolean().optional(),
});

const memoryValidateSchema = getSchema({
  id: positiveInt,
  wasUseful: z.boolean(),
  queryId: z.string().optional(),
  queryTerms: optionalStringArray,
  resultRank: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  totalResultsShown: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  searchMode: z.string().optional(),
  intent: z.string().optional(),
  sessionId: z.string().optional(),
  notes: z.string().optional(),
});

export const memoryBulkDeleteSchema = getSchema({
  tier: importanceTierEnum,
  specFolder: optionalPathString(),
  confirm: z.literal(true),
  olderThanDays: safeNumericPreprocess
    .pipe(z.number().int().min(MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS))
    .optional(),
  skipCheckpoint: z.boolean().optional(),
});

const memoryListSchema = getSchema({
  limit: positiveIntMax(100).optional(),
  offset: safeNumericPreprocess.pipe(z.number().int().min(0)).optional(),
  specFolder: optionalPathString(),
  sortBy: z.enum(['created_at', 'updated_at', 'importance_weight']).optional(),
  includeChunks: z.boolean().optional(),
});

const memoryStatsSchema = getSchema({
  folderRanking: z.enum(['count', 'recency', 'importance', 'composite']).optional(),
  excludePatterns: optionalStringArray,
  includeScores: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
  limit: positiveIntMax(100).optional(),
});

const memoryHealthSchema = getSchema({
  reportMode: z.enum(['full', 'divergent_aliases']).optional(),
  limit: positiveIntMax(200).optional(),
  specFolder: optionalPathString(),
  autoRepair: z.boolean().optional(),
  confirmed: z.boolean().optional(),
});

const checkpointCreateSchema = getSchema({
  name: z.string().min(1),
  specFolder: optionalPathString(),
  tenantId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  agentId: z.string().min(1).optional(),
  sharedSpaceId: z.string().min(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const checkpointListSchema = getSchema({
  specFolder: optionalPathString(),
  tenantId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  agentId: z.string().min(1).optional(),
  sharedSpaceId: z.string().min(1).optional(),
  limit: positiveIntMax(100).optional(),
});

const checkpointRestoreSchema = getSchema({
  name: z.string().min(1),
  tenantId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  agentId: z.string().min(1).optional(),
  sharedSpaceId: z.string().min(1).optional(),
  clearExisting: z.boolean().optional(),
});

const checkpointDeleteSchema = getSchema({
  name: z.string().min(1),
  tenantId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  agentId: z.string().min(1).optional(),
  sharedSpaceId: z.string().min(1).optional(),
  confirmName: z.string().min(1),
});

const taskPreflightSchema = getSchema({
  specFolder: pathString(1),
  taskId: z.string().min(1),
  knowledgeScore: boundedNumber(0, 100),
  uncertaintyScore: boundedNumber(0, 100),
  contextScore: boundedNumber(0, 100),
  knowledgeGaps: optionalStringArray,
  sessionId: z.string().optional(),
});

const taskPostflightSchema = getSchema({
  specFolder: pathString(1),
  taskId: z.string().min(1),
  knowledgeScore: boundedNumber(0, 100),
  uncertaintyScore: boundedNumber(0, 100),
  contextScore: boundedNumber(0, 100),
  gapsClosed: optionalStringArray,
  newGapsDiscovered: optionalStringArray,
  sessionId: z.string().optional(),
});

const memoryDriftWhySchema = getSchema({
  memoryId: z.union([positiveInt, z.string().min(1)]),
  maxDepth: safeNumericPreprocess.pipe(z.number().int().min(1).max(10)).optional(),
  direction: z.enum(['outgoing', 'incoming', 'both']).optional(),
  relations: z.array(relationEnum).optional(),
  includeMemoryDetails: z.boolean().optional(),
});

const memoryCausalLinkSchema = getSchema({
  sourceId: z.union([positiveInt, z.string().min(1)]),
  targetId: z.union([positiveInt, z.string().min(1)]),
  relation: relationEnum,
  strength: boundedNumber(0, 1).optional(),
  evidence: z.string().optional(),
});

const memoryCausalStatsSchema = getSchema({});

const memoryCausalUnlinkSchema = getSchema({
  edgeId: positiveInt,
});

const evalRunAblationSchema = getSchema({
  mode: z.enum(['ablation', 'k_sensitivity']).optional(),
  channels: z.array(z.enum(['vector', 'bm25', 'fts5', 'graph', 'trigger'])).optional(),
  queries: z.array(z.string()).optional(),
  groundTruthQueryIds: z.array(positiveInt).optional(),
  recallK: positiveIntMax(100).optional(),
  storeResults: z.boolean().optional(),
  includeFormattedReport: z.boolean().optional(),
});

const evalReportingDashboardSchema = getSchema({
  sprintFilter: optionalStringArray,
  channelFilter: optionalStringArray,
  metricFilter: optionalStringArray,
  limit: positiveIntMax(200).optional(),
  format: z.enum(['text', 'json']).optional(),
});

const memoryIndexScanSchema = getSchema({
  specFolder: optionalPathString(),
  force: z.boolean().optional(),
  includeConstitutional: z.boolean().optional(),
  includeSpecDocs: z.boolean().optional(),
  incremental: z.boolean().optional(),
});

const memoryGetLearningHistorySchema = getSchema({
  specFolder: pathString(1),
  sessionId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  onlyComplete: z.boolean().optional(),
  includeSummary: z.boolean().optional(),
});

const memoryIngestStartSchema = getSchema({
  paths: z.array(pathString(1)).min(1).max(MAX_INGEST_PATHS),
  specFolder: optionalPathString(),
});

const memoryIngestStatusSchema = getSchema({
  jobId: z.string().min(1),
});

const memoryIngestCancelSchema = getSchema({
  jobId: z.string().min(1),
});

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

export const TOOL_SCHEMAS: Record<string, ToolInputSchema> = {
  memory_context: memoryContextSchema as unknown as ToolInputSchema,
  memory_search: memorySearchSchema as unknown as ToolInputSchema,
  memory_quick_search: memoryQuickSearchSchema as unknown as ToolInputSchema,
  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
  memory_save: memorySaveSchema as unknown as ToolInputSchema,
  memory_list: memoryListSchema as unknown as ToolInputSchema,
  memory_stats: memoryStatsSchema as unknown as ToolInputSchema,
  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
  memory_delete: memoryDeleteSchema as unknown as ToolInputSchema,
  memory_update: memoryUpdateSchema as unknown as ToolInputSchema,
  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
  memory_bulk_delete: memoryBulkDeleteSchema as unknown as ToolInputSchema,
  checkpoint_create: checkpointCreateSchema as unknown as ToolInputSchema,
  checkpoint_list: checkpointListSchema as unknown as ToolInputSchema,
  checkpoint_restore: checkpointRestoreSchema as unknown as ToolInputSchema,
  checkpoint_delete: checkpointDeleteSchema as unknown as ToolInputSchema,
  task_preflight: taskPreflightSchema as unknown as ToolInputSchema,
  task_postflight: taskPostflightSchema as unknown as ToolInputSchema,
  memory_drift_why: memoryDriftWhySchema as unknown as ToolInputSchema,
  memory_causal_link: memoryCausalLinkSchema as unknown as ToolInputSchema,
  memory_causal_stats: memoryCausalStatsSchema as unknown as ToolInputSchema,
  memory_causal_unlink: memoryCausalUnlinkSchema as unknown as ToolInputSchema,
  eval_run_ablation: evalRunAblationSchema as unknown as ToolInputSchema,
  eval_reporting_dashboard: evalReportingDashboardSchema as unknown as ToolInputSchema,
  memory_index_scan: memoryIndexScanSchema as unknown as ToolInputSchema,
  memory_get_learning_history: memoryGetLearningHistorySchema as unknown as ToolInputSchema,
  memory_ingest_start: memoryIngestStartSchema as unknown as ToolInputSchema,
  memory_ingest_status: memoryIngestStatusSchema as unknown as ToolInputSchema,
  memory_ingest_cancel: memoryIngestCancelSchema as unknown as ToolInputSchema,
  shared_space_upsert: getSchema({
    spaceId: z.string(),
    tenantId: z.string(),
    name: z.string(),
    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    rolloutEnabled: z.boolean().optional(),
    rolloutCohort: z.string().optional(),
    killSwitch: z.boolean().optional(),
  }),
  shared_space_membership_set: getSchema({
    spaceId: z.string(),
    tenantId: z.string(),
    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    subjectType: z.enum(['user', 'agent']),
    subjectId: z.string(),
    role: z.enum(['owner', 'editor', 'viewer']),
  }),
  shared_memory_status: getSchema({
    tenantId: z.string().optional(),
    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
  }),
  shared_memory_enable: getSchema({}) as unknown as ToolInputSchema,
  session_bootstrap: getSchema({
    specFolder: optionalPathString(),
  }) as unknown as ToolInputSchema,
  session_health: getSchema({}) as unknown as ToolInputSchema,
  session_resume: getSchema({
    specFolder: optionalPathString(),
    minimal: z.boolean().optional(),
  }) as unknown as ToolInputSchema,
};

const ALLOWED_PARAMETERS: Record<string, string[]> = {
  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
  memory_list: ['limit', 'offset', 'specFolder', 'sortBy', 'includeChunks'],
  memory_stats: ['folderRanking', 'excludePatterns', 'includeScores', 'includeArchived', 'limit'],
  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
  memory_delete: ['id', 'specFolder', 'confirm'],
  memory_update: ['id', 'title', 'triggerPhrases', 'importanceWeight', 'importanceTier', 'allowPartialUpdate'],
  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
  memory_bulk_delete: ['tier', 'specFolder', 'confirm', 'olderThanDays', 'skipCheckpoint'],
  checkpoint_create: ['name', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'metadata'],
  checkpoint_list: ['specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit'],
  checkpoint_restore: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'clearExisting'],
  checkpoint_delete: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'confirmName'],
  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
  memory_drift_why: ['memoryId', 'maxDepth', 'direction', 'relations', 'includeMemoryDetails'],
  memory_causal_link: ['sourceId', 'targetId', 'relation', 'strength', 'evidence'],
  memory_causal_stats: [],
  memory_causal_unlink: ['edgeId'],
  eval_run_ablation: ['mode', 'channels', 'queries', 'groundTruthQueryIds', 'recallK', 'storeResults', 'includeFormattedReport'],
  eval_reporting_dashboard: ['sprintFilter', 'channelFilter', 'metricFilter', 'limit', 'format'],
  memory_index_scan: ['specFolder', 'force', 'includeConstitutional', 'includeSpecDocs', 'incremental'],
  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
  memory_ingest_start: ['paths', 'specFolder'],
  memory_ingest_status: ['jobId'],
  memory_ingest_cancel: ['jobId'],
  shared_space_upsert: ['spaceId', 'tenantId', 'name', 'actorUserId', 'actorAgentId', 'rolloutEnabled', 'rolloutCohort', 'killSwitch'],
  shared_space_membership_set: ['spaceId', 'tenantId', 'actorUserId', 'actorAgentId', 'subjectType', 'subjectId', 'role'],
  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
  shared_memory_enable: [],
  session_bootstrap: ['specFolder'],
  session_health: [],
  session_resume: ['specFolder', 'minimal'],
};

/* ───────────────────────────────────────────────────────────────
   7. VALIDATION
──────────────────────────────────────────────────────────────── */

export class ToolSchemaValidationError extends Error {
  public readonly toolName: string;
  public readonly code = 'E030';
  public readonly details: Record<string, unknown>;

  constructor(toolName: string, message: string, details: Record<string, unknown>) {
    super(message);
    this.name = 'ToolSchemaValidationError';
    this.toolName = toolName;
    this.details = details;
  }
}

export function formatZodError(toolName: string, error: ZodError): ToolSchemaValidationError {
  const allowed = ALLOWED_PARAMETERS[toolName] ?? [];
  const lines: string[] = [];
  const unknownKeys = new Set<string>();
  const issueSummaries: string[] = [];

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '<root>';
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) unknownKeys.add(key);
      continue;
    }

    issueSummaries.push(`${path}: ${issue.message}`);

    if (issue.code === 'invalid_type' && issue.path.length > 0) {
      const received = typeof issue.input === 'undefined' ? 'undefined' : Array.isArray(issue.input) ? 'array' : typeof issue.input;
      lines.push(`Parameter "${path}" has invalid type. Expected ${issue.expected}, received ${received}.`);
    } else {
      lines.push(`Parameter "${path}" is invalid: ${issue.message}`);
    }
  }

  if (unknownKeys.size > 0) {
    lines.push(`Unknown parameter(s): ${Array.from(unknownKeys).join(', ')}.`);
  }

  if (allowed.length > 0) {
    lines.push(`Expected parameter names: ${allowed.join(', ')}.`);
  }

  lines.push('Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.');

  return new ToolSchemaValidationError(
    toolName,
    `Invalid arguments for "${toolName}". ${lines.join(' ')}`,
    {
      tool: toolName,
      issues: issueSummaries,
      unknownParameters: Array.from(unknownKeys),
      expectedParameters: allowed,
    },
  );
}

export function getToolSchema(toolName: string): ToolInputSchema | null {
  return TOOL_SCHEMAS[toolName] ?? null;
}

export function validateToolArgs(toolName: string, rawInput: Record<string, unknown>): ToolInput {
  const schema = getToolSchema(toolName);
  if (!schema) {
    throw new ToolSchemaValidationError(toolName, `Unknown tool: "${toolName}". No schema registered.`, {
      tool: toolName,
      issues: ['unknown_tool'],
      unknownParameters: [],
      expectedParameters: [],
    });
  }

  try {
    return schema.parse(rawInput);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const formatted = formatZodError(toolName, error);
      // CHK-029: Log rejected params for audit trail (MCP uses stderr)
      console.error(`[schema-validation] ${toolName}: ${formatted.message}`);
      throw formatted;
    }
    throw new Error('Schema validation encountered an unexpected error');
  }
}
