// ---------------------------------------------------------------
// MODULE: Tool Input Schemas
// ---------------------------------------------------------------
// Centralized strict Zod validation schemas for MCP tool inputs.
// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
// ---------------------------------------------------------------

import { z, ZodError, type ZodType } from 'zod';

type ToolInput = Record<string, unknown>;
type ToolInputSchema = ZodType<ToolInput>;

export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
  const base = z.object(shape);
  return strict ? base.strict() : base.passthrough();
};

// Sprint 9 fix: safeNumericPreprocess.pipe(z.number()) silently coerces "", null, false → 0.
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

const memoryContextSchema = getSchema({
  input: z.string().min(1),
  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
  intent: intentEnum.optional(),
  specFolder: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  sessionId: z.string().optional(),
  enableDedup: z.boolean().optional(),
  includeContent: z.boolean().optional(),
  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
  tokenUsage: boundedNumber(0, 1).optional(),
  anchors: optionalStringArray,
});

const memorySearchSchema = getSchema({
  query: z.string().min(2).max(1000).optional(),
  concepts: z.array(z.string().min(1)).min(2).max(5).optional(),
  specFolder: z.string().optional(),
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
}).superRefine((value, ctx) => {
  const hasQuery = typeof value.query === 'string' && value.query.trim().length > 0;
  const hasConcepts = Array.isArray(value.concepts) && value.concepts.length >= 2;
  if (!hasQuery && !hasConcepts) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either "query" (string) or "concepts" (array with 2-5 items) is required.',
      path: ['query'],
    });
  }
});

const memoryMatchTriggersSchema = getSchema({
  prompt: z.string().min(1),
  limit: positiveIntMax(100).optional(),
  session_id: z.string().optional(),
  turnNumber: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  include_cognitive: z.boolean().optional(),
});

const memorySaveSchema = getSchema({
  filePath: z.string().min(1),
  force: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  skipPreflight: z.boolean().optional(),
  asyncEmbedding: z.boolean().optional(),
});

// Discriminated delete: branch 1 requires `id` (single-record delete).
// Branch 2 requires `specFolder` + `confirm: true` (bulk folder delete).
// Codex fix: `confirm` accepts only `true` (not `false`) in both branches
// to prevent semantically meaningless `confirm: false` from passing validation.
const memoryDeleteSchema = z.union([
  getSchema({
    id: positiveInt,
    specFolder: z.string().optional(),
    confirm: z.literal(true).optional(),
  }),
  getSchema({
    specFolder: z.string().min(1),
    confirm: z.literal(true),
  }),
]);

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

const memoryBulkDeleteSchema = getSchema({
  tier: importanceTierEnum,
  specFolder: z.string().optional(),
  confirm: z.boolean(),
  olderThanDays: safeNumericPreprocess.pipe(z.number().int().min(0)).optional(),
  skipCheckpoint: z.boolean().optional(),
});

const memoryListSchema = getSchema({
  limit: positiveIntMax(100).optional(),
  offset: safeNumericPreprocess.pipe(z.number().int().min(0)).optional(),
  specFolder: z.string().optional(),
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
  specFolder: z.string().optional(),
});

const checkpointCreateSchema = getSchema({
  name: z.string().min(1),
  specFolder: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const checkpointListSchema = getSchema({
  specFolder: z.string().optional(),
  limit: positiveIntMax(100).optional(),
});

const checkpointRestoreSchema = getSchema({
  name: z.string().min(1),
  clearExisting: z.boolean().optional(),
});

const checkpointDeleteSchema = getSchema({
  name: z.string().min(1),
});

const taskPreflightSchema = getSchema({
  specFolder: z.string().min(1),
  taskId: z.string().min(1),
  knowledgeScore: boundedNumber(0, 100),
  uncertaintyScore: boundedNumber(0, 100),
  contextScore: boundedNumber(0, 100),
  knowledgeGaps: optionalStringArray,
  sessionId: z.string().optional(),
});

const taskPostflightSchema = getSchema({
  specFolder: z.string().min(1),
  taskId: z.string().min(1),
  knowledgeScore: boundedNumber(0, 100),
  uncertaintyScore: boundedNumber(0, 100),
  contextScore: boundedNumber(0, 100),
  gapsClosed: optionalStringArray,
  newGapsDiscovered: optionalStringArray,
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
  channels: z.array(z.enum(['vector', 'bm25', 'fts5', 'graph', 'trigger'])).optional(),
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
  specFolder: z.string().optional(),
  force: z.boolean().optional(),
  includeConstitutional: z.boolean().optional(),
  includeSpecDocs: z.boolean().optional(),
  incremental: z.boolean().optional(),
});

const memoryGetLearningHistorySchema = getSchema({
  specFolder: z.string().min(1),
  sessionId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  onlyComplete: z.boolean().optional(),
  includeSummary: z.boolean().optional(),
});

const memoryIngestStartSchema = getSchema({
  paths: z.array(z.string().min(1)).min(1),
  specFolder: z.string().optional(),
});

const memoryIngestStatusSchema = getSchema({
  jobId: z.string().min(1),
});

const memoryIngestCancelSchema = getSchema({
  jobId: z.string().min(1),
});

export const TOOL_SCHEMAS: Record<string, ToolInputSchema> = {
  memory_context: memoryContextSchema as unknown as ToolInputSchema,
  memory_search: memorySearchSchema as unknown as ToolInputSchema,
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
};

const ALLOWED_PARAMETERS: Record<string, string[]> = {
  memory_context: ['input', 'mode', 'intent', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'tokenUsage', 'anchors'],
  memory_search: ['query', 'concepts', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace'],
  memory_match_triggers: ['prompt', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding'],
  memory_list: ['limit', 'offset', 'specFolder', 'sortBy', 'includeChunks'],
  memory_stats: ['folderRanking', 'excludePatterns', 'includeScores', 'includeArchived', 'limit'],
  memory_health: ['reportMode', 'limit', 'specFolder'],
  memory_delete: ['id', 'specFolder', 'confirm'],
  memory_update: ['id', 'title', 'triggerPhrases', 'importanceWeight', 'importanceTier', 'allowPartialUpdate'],
  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
  memory_bulk_delete: ['tier', 'specFolder', 'confirm', 'olderThanDays', 'skipCheckpoint'],
  checkpoint_create: ['name', 'specFolder', 'metadata'],
  checkpoint_list: ['specFolder', 'limit'],
  checkpoint_restore: ['name', 'clearExisting'],
  checkpoint_delete: ['name'],
  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered'],
  memory_drift_why: ['memoryId', 'maxDepth', 'direction', 'relations', 'includeMemoryDetails'],
  memory_causal_link: ['sourceId', 'targetId', 'relation', 'strength', 'evidence'],
  memory_causal_stats: [],
  memory_causal_unlink: ['edgeId'],
  eval_run_ablation: ['channels', 'groundTruthQueryIds', 'recallK', 'storeResults', 'includeFormattedReport'],
  eval_reporting_dashboard: ['sprintFilter', 'channelFilter', 'metricFilter', 'limit', 'format'],
  memory_index_scan: ['specFolder', 'force', 'includeConstitutional', 'includeSpecDocs', 'incremental'],
  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
  memory_ingest_start: ['paths', 'specFolder'],
  memory_ingest_status: ['jobId'],
  memory_ingest_cancel: ['jobId'],
};

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
    return rawInput;
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
    throw error;
  }
}
