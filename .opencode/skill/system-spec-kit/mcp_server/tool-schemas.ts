// ───────────────────────────────────────────────────────────────
// MODULE: Tool Schemas
// ───────────────────────────────────────────────────────────────
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
import {
  MAX_INGEST_PATHS,
  MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS,
} from './schemas/tool-input-schemas.js';

/**
 * Re-export schema validation helpers used by the MCP tool entry points.
 */
export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Normalized definition for a single MCP tool and its JSON schema.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

// ───────────────────────────────────────────────────────────────
// 2. TOOL DEFINITIONS

// ───────────────────────────────────────────────────────────────
// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
const memoryContext: ToolDefinition = {
  name: 'memory_context',
  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
};

// L2: Core - Primary operations (Token Budget: 3500)
const memorySearch: ToolDefinition = {
  name: 'memory_search',
  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    properties: {
      cursor: {
        type: 'string',
        minLength: 1,
        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
      },
      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
      concepts: {
        type: 'array',
        items: { type: 'string', minLength: 1 },
        minItems: 2,
        maxItems: 5,
        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
      },
      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
      sessionId: {
        type: 'string',
        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
      },
      enableDedup: {
        type: 'boolean',
        default: true,
        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
      },
      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
      includeConstitutional: {
        type: 'boolean',
        default: true,
        description: 'Include constitutional tier memories at top of results (default: true)'
      },
      enableSessionBoost: {
        type: 'boolean',
        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
      },
      enableCausalBoost: {
        type: 'boolean',
        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
      },
      includeContent: {
        type: 'boolean',
        default: false,
        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls.'
      },
      anchors: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
      },
      profile: {
        type: 'string',
        enum: ['quick', 'research', 'resume', 'debug'],
        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
      },
      min_quality_score: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
      },
      minQualityScore: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
      },
      bypassCache: {
        type: 'boolean',
        default: false,
        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
      },
      rerank: {
        type: 'boolean',
        default: true,
        description: 'Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation.'
      },
      applyLengthPenalty: {
        type: 'boolean',
        default: true,
        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
      },
      applyStateLimits: {
        type: 'boolean',
        default: false,
        description: 'Apply per-tier quantity limits to results. When true, enforces maximum counts per state tier to balance result diversity.'
      },
      minState: {
        type: 'string',
        enum: ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'],
        default: 'WARM',
        description: 'Minimum memory state to include in results. Memories below this state are filtered out. Order: HOT > WARM > COLD > DORMANT > ARCHIVED.'
      },
      intent: {
        type: 'string',
        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'],
        description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.'
      },
      autoDetectIntent: {
        type: 'boolean',
        default: true,
        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
      },
      // Fix #13 : Expose previously hidden handler parameters
      trackAccess: {
        type: 'boolean',
        default: false,
        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
      },
      includeArchived: {
        type: 'boolean',
        default: false,
        description: 'Include archived memories in search results. Default: false (archived excluded).'
      },
      mode: {
        type: 'string',
        enum: ['auto', 'deep'],
        default: 'auto',
        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
      },
      includeTrace: {
        type: 'boolean',
        default: false,
        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
      }
    }
  },
};

// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
const memoryQuickSearch: ToolDefinition = {
  name: 'memory_quick_search',
  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
      specFolder: { type: 'string', description: 'Restrict to spec folder' },
      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
    },
    required: ['query'],
  },
};

const memoryMatchTriggers: ToolDefinition = {
  name: 'memory_match_triggers',
  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
};

// T306: Added asyncEmbedding parameter for non-blocking embedding generation
const memorySave: ToolDefinition = {
  name: 'memory_save',
  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
};

// L3: Discovery - Browse and explore (Token Budget: 800)
const memoryList: ToolDefinition = {
  name: 'memory_list',
  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
};

const memoryStats: ToolDefinition = {
  name: 'memory_stats',
  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
};

const memoryHealth: ToolDefinition = {
  name: 'memory_health',
  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      reportMode: {
        type: 'string',
        enum: ['full', 'divergent_aliases'],
        default: 'full',
        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
      },
      limit: {
        type: 'number',
        default: 20,
        minimum: 1,
        maximum: 200,
        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
      },
      specFolder: {
        type: 'string',
        description: 'Optional spec folder filter for divergent alias triage mode.'
      },
      autoRepair: {
        type: 'boolean',
        default: false,
        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
      },
      confirmed: {
        type: 'boolean',
        default: false,
        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
      }
    },
    required: []
  },
};

// L4: Mutation - Modify existing memories (Token Budget: 500)
const memoryDelete: ToolDefinition = {
  name: 'memory_delete',
  description: '[L4:Mutation] Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information. Requires EITHER id (single delete) OR specFolder + confirm:true (bulk delete). Token Budget: 500.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    'x-requiredAnyOf': [['id'], ['specFolder', 'confirm']],
    properties: {
      id: { type: 'number', minimum: 1, description: 'Memory ID to delete (single delete mode)' },
      specFolder: { type: 'string', minLength: 1, description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
      confirm: { type: 'boolean', const: true, description: 'Safety gate. When provided, confirm must be true.' }
    }
  },
};

const memoryUpdate: ToolDefinition = {
  name: 'memory_update',
  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
};

const memoryValidate: ToolDefinition = {
  name: 'memory_validate',
  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: { type: 'number', minimum: 1, description: 'Memory ID to validate' },
      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
      queryId: { type: 'string', description: 'Optional query identifier to attach implicit feedback/ground-truth selection context' },
      queryTerms: { type: 'array', items: { type: 'string' }, description: 'Optional normalized query terms used for learned feedback term extraction' },
      resultRank: { type: 'number', minimum: 1, description: 'Optional rank position (1-based) of the selected memory in search results' },
      totalResultsShown: { type: 'number', minimum: 1, description: 'Optional total number of results shown to the user' },
      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
      intent: { type: 'string', description: 'Optional classified intent associated with the originating query' },
      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
      notes: { type: 'string', description: 'Optional free-form notes associated with this validation event' },
    },
    required: ['id', 'wasUseful']
  },
};

const memoryBulkDelete: ToolDefinition = {
  name: 'memory_bulk_delete',
  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
};

// L5: Lifecycle - Checkpoints and versioning (Token Budget: 600)
const checkpointCreate: ToolDefinition = {
  name: 'checkpoint_create',
  description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, description: 'Unique checkpoint name' },
      specFolder: { type: 'string', description: 'Limit to specific spec folder' },
      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
      metadata: { type: 'object', description: 'Additional metadata' }
    },
    required: ['name']
  },
};

const checkpointList: ToolDefinition = {
  name: 'checkpoint_list',
  description: '[L5:Lifecycle] List all available checkpoints. Token Budget: 600.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      specFolder: { type: 'string', description: 'Filter by spec folder' },
      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
      limit: { type: 'number', default: 50, minimum: 1, maximum: 100 }
    }
  },
};

const checkpointRestore: ToolDefinition = {
  name: 'checkpoint_restore',
  description: '[L5:Lifecycle] Restore memory state from a checkpoint. Token Budget: 600.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, description: 'Checkpoint name to restore' },
      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
      clearExisting: { type: 'boolean', default: false }
    },
    required: ['name']
  },
};

const checkpointDelete: ToolDefinition = {
  name: 'checkpoint_delete',
  description: '[L5:Lifecycle] Delete a checkpoint. Token Budget: 600.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, description: 'Checkpoint name to delete' },
      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
      confirmName: {
        type: 'string',
        minLength: 1,
        description: 'Required safety confirmation. It must exactly match name.'
      }
    },
    required: ['name', 'confirmName']
  },
};

const sharedSpaceUpsert: ToolDefinition = {
  name: 'shared_space_upsert',
  description: '[L5:Lifecycle] Create or update a shared-memory space. Caller authentication is required. New spaces may only be created by the configured shared-memory admin; updates require the configured admin or a current space owner.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      spaceId: { type: 'string', description: 'Stable shared-space identifier.' },
      tenantId: { type: 'string', description: 'Owning tenant for the shared space.' },
      name: { type: 'string', description: 'Display name for the shared space.' },
      actorUserId: { type: 'string', description: 'Authenticated caller user ID. Provide exactly one of actorUserId or actorAgentId.' },
      actorAgentId: { type: 'string', description: 'Authenticated caller agent ID. Provide exactly one of actorUserId or actorAgentId.' },
      rolloutEnabled: { type: 'boolean', default: false, description: 'Enable this space for rollout.' },
      rolloutCohort: { type: 'string', description: 'Optional rollout cohort label.' },
      killSwitch: { type: 'boolean', default: false, description: 'Immediately disable access for this space.' },
    },
    // oneOf/not removed — Claude Code MCP client rejects top-level oneOf/anyOf/allOf/not
    // Runtime handler validates exactly-one-of actorUserId/actorAgentId
    required: ['spaceId', 'tenantId', 'name'],
  },
};

const sharedSpaceMembershipSet: ToolDefinition = {
  name: 'shared_space_membership_set',
  description: '[L5:Lifecycle] Set deny-by-default shared-space membership for a user or agent. Caller authentication is required; membership changes require the configured shared-memory admin or a current space owner.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      spaceId: { type: 'string', description: 'Shared-space identifier.' },
      tenantId: { type: 'string', description: 'Tenant boundary for the membership mutation.' },
      actorUserId: { type: 'string', description: 'Authenticated caller user ID. Provide exactly one of actorUserId or actorAgentId.' },
      actorAgentId: { type: 'string', description: 'Authenticated caller agent ID. Provide exactly one of actorUserId or actorAgentId.' },
      subjectType: { type: 'string', description: 'Membership subject type: "user" or "agent".' },
      subjectId: { type: 'string', description: 'Membership subject identifier.' },
      role: { type: 'string', description: 'Access role inside the shared space: "owner", "editor", or "viewer".' },
    },
    required: ['spaceId', 'tenantId', 'subjectType', 'subjectId', 'role'],
  },
};

const sharedMemoryStatus: ToolDefinition = {
  name: 'shared_memory_status',
  description: '[L5:Lifecycle] Inspect current shared-memory rollout and the spaces accessible to the authenticated caller.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      tenantId: { type: 'string', description: 'Optional tenant filter applied to the authenticated caller scope.' },
      actorUserId: { type: 'string', description: 'Authenticated caller user ID. Provide exactly one of actorUserId or actorAgentId.' },
      actorAgentId: { type: 'string', description: 'Authenticated caller agent ID. Provide exactly one of actorUserId or actorAgentId.' },
    },
    required: [],
  },
};

const sharedMemoryEnable: ToolDefinition = {
  name: 'shared_memory_enable',
  description: '[L5:Lifecycle] Enable the shared-memory subsystem. First-run setup: persists enablement, creates infrastructure tables, and generates a README. Idempotent — subsequent calls return alreadyEnabled: true.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {},
    required: [],
  },
};

// L6: Analysis - Deep inspection and lineage (Token Budget: 1200)
const taskPreflight: ToolDefinition = {
  name: 'task_preflight',
  description: '[L6:Analysis] Capture epistemic baseline before task execution. Call at the start of implementation work to record knowledge, uncertainty, and context scores for learning measurement. Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
};

const taskPostflight: ToolDefinition = {
  name: 'task_postflight',
  description: '[L6:Analysis] Capture epistemic state after task execution and calculate learning delta. Call after completing implementation work. Calculates Learning Index: LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25). Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
};

// T043-T047: Causal Memory Graph tools (REQ-012) - L6: Analysis
const memoryDriftWhy: ToolDefinition = {
  name: 'memory_drift_why',
  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
  // oneOf removed from property definitions — Claude Code MCP client rejects nested oneOf in some cases
  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (number or string, required)' }, maxDepth: { type: 'number', default: 3, minimum: 1, maximum: 10, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', description: 'Traversal direction: outgoing, incoming, or both (default: both)' }, relations: { type: 'array', items: { type: 'string' }, description: 'Filter to specific relationship types: caused, enabled, supersedes, contradicts, derived_from, supports' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
};

const memoryCausalLink: ToolDefinition = {
  name: 'memory_causal_link',
  description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { sourceId: { type: 'string', description: 'Source memory ID (the cause/enabler/superseder, number or string)' }, targetId: { type: 'string', description: 'Target memory ID (the effect/superseded, number or string)' }, relation: { type: 'string', description: 'Relationship type: caused, enabled, supersedes, contradicts, derived_from, or supports' }, strength: { type: 'number', default: 1.0, minimum: 0, maximum: 1, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] },
};

const memoryCausalStats: ToolDefinition = {
  name: 'memory_causal_stats',
  description: '[L6:Analysis] Get statistics about the causal memory graph. Shows total edges, coverage percentage, and breakdown by relationship type. Target: 60% of memories linked (CHK-065). Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

const memoryCausalUnlink: ToolDefinition = {
  name: 'memory_causal_unlink',
  description: '[L6:Analysis] Remove a causal relationship by edge ID. Use memory_drift_why to find edge IDs. Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { edgeId: { type: 'number', minimum: 1, description: 'Edge ID to delete (required)' } }, required: ['edgeId'] },
};

const evalRunAblation: ToolDefinition = {
  name: 'eval_run_ablation',
  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      mode: {
        type: 'string',
        enum: ['ablation', 'k_sensitivity'],
        description: 'Evaluation mode. Defaults to ablation; use k_sensitivity for raw pre-fusion RRF K analysis.'
      },
      channels: {
        type: 'array',
        items: { type: 'string', enum: ['vector', 'bm25', 'fts5', 'graph', 'trigger'] },
        description: 'Channels to ablate (default: all channels).'
      },
      queries: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional custom query set for k_sensitivity mode.'
      },
      groundTruthQueryIds: {
        type: 'array',
        items: { type: 'number', minimum: 1 },
        description: 'Optional subset of ground truth query IDs to evaluate.'
      },
      recallK: { type: 'number', minimum: 1, maximum: 100, description: 'Recall cutoff K (default: 20).' },
      storeResults: { type: 'boolean', default: true, description: 'Persist ablation metrics to eval_metric_snapshots (default: true).' },
      includeFormattedReport: { type: 'boolean', default: true, description: 'Include human-readable markdown report in response (default: true).' },
    },
    required: [],
  },
};

const evalReportingDashboard: ToolDefinition = {
  name: 'eval_reporting_dashboard',
  description: '[L6:Analysis] Generate R13-S3 reporting dashboard output with sprint/channel trend aggregation from eval DB metrics. Token Budget: 1200.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      sprintFilter: { type: 'array', items: { type: 'string' }, description: 'Optional sprint label filters.' },
      channelFilter: { type: 'array', items: { type: 'string' }, description: 'Optional channel filters.' },
      metricFilter: { type: 'array', items: { type: 'string' }, description: 'Optional metric-name filters.' },
      limit: { type: 'number', minimum: 1, maximum: 200, description: 'Maximum sprint groups to return (most recent).' },
      format: { type: 'string', enum: ['text', 'json'], default: 'text', description: 'Formatted report payload type.' },
    },
    required: [],
  },
};

// L7: Maintenance - Indexing and system operations (Token Budget: 1000)
const memoryIndexScan: ToolDefinition = {
  name: 'memory_index_scan',
  description: '[L7:Maintenance] Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files. Token Budget: 1000.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
};

const memoryGetLearningHistory: ToolDefinition = {
  name: 'memory_get_learning_history',
  description: '[L7:Maintenance] Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Use to analyze learning patterns across tasks within a spec. Token Budget: 1000.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
};

const memoryIngestStart: ToolDefinition = {
  name: 'memory_ingest_start',
  description: '[L7:Maintenance] Start an async ingestion job for multiple markdown files. Returns immediately with a jobId, while files are processed sequentially in the background.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      paths: {
        type: 'array',
        items: { type: 'string', minLength: 1 },
        minItems: 1,
        maxItems: MAX_INGEST_PATHS,
        description: `Absolute file paths to ingest (required, at least one, max ${MAX_INGEST_PATHS}).`,
      },
      specFolder: {
        type: 'string',
        description: 'Optional spec folder label attached to the ingest job.',
      },
    },
    required: ['paths'],
  },
};

const memoryIngestStatus: ToolDefinition = {
  name: 'memory_ingest_status',
  description: '[L7:Maintenance] Get current state and progress for an async ingestion job.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      jobId: { type: 'string', minLength: 1, description: 'Ingestion job identifier (required).' },
    },
    required: ['jobId'],
  },
};

const memoryIngestCancel: ToolDefinition = {
  name: 'memory_ingest_cancel',
  description: '[L7:Maintenance] Cancel a running async ingestion job. Cancellation is checked between files.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      jobId: { type: 'string', minLength: 1, description: 'Ingestion job identifier (required).' },
    },
    required: ['jobId'],
  },
};

// Code Graph - Structural code analysis tools
const codeGraphScan: ToolDefinition = {
  name: 'code_graph_scan',
  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      rootDir: { type: 'string', description: 'Root directory to scan (default: workspace root)' },
      includeGlobs: { type: 'array', items: { type: 'string' }, description: 'Glob patterns for files to include' },
      excludeGlobs: { type: 'array', items: { type: 'string' }, description: 'Additional glob patterns to exclude' },
      incremental: { type: 'boolean', default: true, description: 'Skip unchanged files (default: true)' },
    },
    required: [],
  },
};

const codeGraphQuery: ToolDefinition = {
  name: 'code_graph_query',
  description: '[L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph). Use INSTEAD of Grep for structural queries (callers, imports, dependencies). Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      operation: { type: 'string', enum: ['outline', 'calls_from', 'calls_to', 'imports_from', 'imports_to'], description: 'Query operation (required)' },
      subject: { type: 'string', minLength: 1, description: 'File path, symbol name, or symbolId to query (required)' },
      edgeType: { type: 'string', description: 'Filter by edge type (optional)' },
      limit: { type: 'number', minimum: 1, maximum: 200, default: 50, description: 'Max results' },
      includeTransitive: { type: 'boolean', default: false, description: 'Enable multi-hop BFS traversal (follows edges transitively)' },
      maxDepth: { type: 'number', minimum: 1, maximum: 10, default: 3, description: 'Max traversal depth when includeTransitive is true' },
    },
    required: ['operation', 'subject'],
  },
};

const codeGraphStatus: ToolDefinition = {
  name: 'code_graph_status',
  description: '[L7:Maintenance] Report code graph index health: file count, node/edge counts by type, parse health summary, last scan timestamp, DB file size, schema version. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

const codeGraphContext: ToolDefinition = {
  name: 'code_graph_context',
  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      input: { type: 'string', description: 'Natural language context query' },
      queryMode: { type: 'string', enum: ['neighborhood', 'outline', 'impact'], default: 'neighborhood', description: 'Graph expansion mode' },
      subject: { type: 'string', description: 'Symbol name, fqName, or symbolId' },
      seeds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filePath: { type: 'string' },
            startLine: { type: 'number' },
            endLine: { type: 'number' },
            query: { type: 'string' },
            provider: { type: 'string', enum: ['cocoindex', 'manual', 'graph'], description: 'Seed provider type' },
            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
            score: { type: 'number', description: 'CocoIndex relevance score' },
            symbolName: { type: 'string', description: 'Manual seed symbol name' },
            symbolId: { type: 'string', description: 'Graph seed symbol ID' },
          },
        },
        description: 'Seeds from CocoIndex, manual input, or graph lookups',
      },
      budgetTokens: { type: 'number', minimum: 100, maximum: 4000, default: 1200, description: 'Token budget for response' },
      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
      includeTrace: { type: 'boolean', description: 'Include trace metadata in response for debugging' },
    },
    required: [],
  },
};

const cccStatus: ToolDefinition = {
  name: 'ccc_status',
  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

const cccReindex: ToolDefinition = {
  name: 'ccc_reindex',
  description: '[L7:Maintenance] Trigger CocoIndex incremental (or full) re-indexing of the workspace.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      full: { type: 'boolean', default: false, description: 'Full re-index (slower) vs incremental' },
    },
    required: [],
  },
};

const cccFeedback: ToolDefinition = {
  name: 'ccc_feedback',
  description: '[L7:Maintenance] Submit quality feedback on CocoIndex search results to improve future searches.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      query: { type: 'string', description: 'The search query that was executed' },
      resultFile: { type: 'string', description: 'File path from the result being rated' },
      rating: { type: 'string', enum: ['helpful', 'not_helpful', 'partial'], description: 'Quality rating' },
      comment: { type: 'string', description: 'Optional free-form feedback' },
    },
    required: ['query', 'rating'],
  },
};

// T018: Session health diagnostic tool
const sessionHealth: ToolDefinition = {
  name: 'session_health',
  description: '[L3:Discovery] Check session readiness: priming status, code graph freshness, time since last tool call. Call periodically during long sessions to check for context drift. Returns ok/warning/stale with actionable hints. No arguments required.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

// Phase 020: Composite session resume tool
const sessionResume: ToolDefinition = {
  name: 'session_resume',
  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
    },
    required: [],
  },
};

// Phase 024 / Item 7: Composite session bootstrap tool
const sessionBootstrap: ToolDefinition = {
  name: 'session_bootstrap',
  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
    },
    required: [],
  },
  outputSchema: {
    type: 'object',
    properties: {
      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
      hints: { type: 'array', items: { type: 'string' }, description: 'Aggregated hints from sub-calls' },
      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
    },
    required: ['resume', 'health', 'hints', 'nextActions'],
  },
};

// ───────────────────────────────────────────────────────────────
// 3. AGGREGATED DEFINITIONS

// ───────────────────────────────────────────────────────────────
/**
 * Canonical ordered list of MCP tool registrations exposed by this server.
 */
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // L1: Orchestration
  memoryContext,
  sessionResume,
  sessionBootstrap,
  // L2: Core
  memorySearch,
  memoryQuickSearch,
  memoryMatchTriggers,
  memorySave,
  // L3: Discovery
  memoryList,
  memoryStats,
  memoryHealth,
  sessionHealth,
  // L4: Mutation
  memoryDelete,
  memoryUpdate,
  memoryValidate,
  memoryBulkDelete,
  // L5: Lifecycle
  checkpointCreate,
  checkpointList,
  checkpointRestore,
  checkpointDelete,
  sharedSpaceUpsert,
  sharedSpaceMembershipSet,
  sharedMemoryStatus,
  sharedMemoryEnable,
  // L6: Analysis
  taskPreflight,
  taskPostflight,
  memoryDriftWhy,
  memoryCausalLink,
  memoryCausalStats,
  memoryCausalUnlink,
  evalRunAblation,
  evalReportingDashboard,
  // L7: Maintenance
  memoryIndexScan,
  memoryGetLearningHistory,
  memoryIngestStart,
  memoryIngestStatus,
  memoryIngestCancel,
  // L8: Code Graph
  codeGraphScan,
  codeGraphQuery,
  codeGraphStatus,
  codeGraphContext,
  // L8: CocoIndex
  cccStatus,
  cccReindex,
  cccFeedback,
];
