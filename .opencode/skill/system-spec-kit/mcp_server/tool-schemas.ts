// ---------------------------------------------------------------
// MODULE: Tool Schemas
// ---------------------------------------------------------------
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
// ---------------------------------------------------------------

export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas';

// --- 1. TYPES ---

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

// --- 2. TOOL DEFINITIONS ---

// T061: L1 Orchestration - Unified entry point (Token Budget: 2000)
const memoryContext: ToolDefinition = {
  name: 'memory_context',
  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 2000.',
  inputSchema: { type: 'object', properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Caller-supplied session identifier. If omitted, server generates an ephemeral UUID for this call only (not persisted across requests).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] },
};

// L2: Core - Primary operations (Token Budget: 1500)
const memorySearch: ToolDefinition = {
  name: 'memory_search',
  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. Token Budget: 1500.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Natural language search query' },
      concepts: {
        type: 'array',
        items: { type: 'string' },
        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
      },
      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
      limit: { type: 'number', default: 10, description: 'Maximum number of results to return' },
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
      // Fix #13 (017-refinement-phase-6): Expose previously hidden handler parameters
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

const memoryMatchTriggers: ToolDefinition = {
  name: 'memory_match_triggers',
  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turn_number for cognitive features. Token Budget: 1500.',
  inputSchema: { type: 'object', properties: { prompt: { type: 'string', description: 'User prompt or text to match against trigger phrases' }, limit: { type: 'number', default: 3, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
};

// T306: Added asyncEmbedding parameter for non-blocking embedding generation
const memorySave: ToolDefinition = {
  name: 'memory_save',
  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 1500.',
  inputSchema: { type: 'object', properties: { filePath: { type: 'string', description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' } }, required: ['filePath'] },
};

// L3: Discovery - Browse and explore (Token Budget: 800)
const memoryList: ToolDefinition = {
  name: 'memory_list',
  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
  inputSchema: { type: 'object', properties: { limit: { type: 'number', default: 20, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
};

const memoryStats: ToolDefinition = {
  name: 'memory_stats',
  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
  inputSchema: { type: 'object', properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', description: 'Maximum number of folders to return', default: 10 } } },
};

const memoryHealth: ToolDefinition = {
  name: 'memory_health',
  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
  inputSchema: {
    type: 'object',
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
        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
      },
      specFolder: {
        type: 'string',
        description: 'Optional spec folder filter for divergent alias triage mode.'
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
    properties: {
      id: { type: 'number', description: 'Memory ID to delete (single delete mode)' },
      specFolder: { type: 'string', description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
      confirm: { type: 'boolean', description: 'Required safety gate for bulk delete: must be true when using specFolder without id' }
    }
  },
};

const memoryUpdate: ToolDefinition = {
  name: 'memory_update',
  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
  inputSchema: { type: 'object', properties: { id: { type: 'number', description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
};

const memoryValidate: ToolDefinition = {
  name: 'memory_validate',
  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'number', description: 'Memory ID to validate' },
      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
      queryId: { type: 'string', description: 'Optional query identifier to attach implicit feedback/ground-truth selection context' },
      queryTerms: { type: 'array', items: { type: 'string' }, description: 'Optional normalized query terms used for learned feedback term extraction' },
      resultRank: { type: 'number', description: 'Optional rank position (1-based) of the selected memory in search results' },
      totalResultsShown: { type: 'number', description: 'Optional total number of results shown to the user' },
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
  inputSchema: { type: 'object', properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
};

// L5: Lifecycle - Checkpoints and versioning (Token Budget: 600)
const checkpointCreate: ToolDefinition = {
  name: 'checkpoint_create',
  description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.',
  inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Unique checkpoint name' }, specFolder: { type: 'string', description: 'Limit to specific spec folder' }, metadata: { type: 'object', description: 'Additional metadata' } }, required: ['name'] },
};

const checkpointList: ToolDefinition = {
  name: 'checkpoint_list',
  description: '[L5:Lifecycle] List all available checkpoints. Token Budget: 600.',
  inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Filter by spec folder' }, limit: { type: 'number', default: 50 } } },
};

const checkpointRestore: ToolDefinition = {
  name: 'checkpoint_restore',
  description: '[L5:Lifecycle] Restore memory state from a checkpoint. Token Budget: 600.',
  inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Checkpoint name to restore' }, clearExisting: { type: 'boolean', default: false } }, required: ['name'] },
};

const checkpointDelete: ToolDefinition = {
  name: 'checkpoint_delete',
  description: '[L5:Lifecycle] Delete a checkpoint. Token Budget: 600.',
  inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Checkpoint name to delete' } }, required: ['name'] },
};

// L6: Analysis - Deep inspection and lineage (Token Budget: 1200)
const taskPreflight: ToolDefinition = {
  name: 'task_preflight',
  description: '[L6:Analysis] Capture epistemic baseline before task execution. Call at the start of implementation work to record knowledge, uncertainty, and context scores for learning measurement. Token Budget: 1200.',
  inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
};

const taskPostflight: ToolDefinition = {
  name: 'task_postflight',
  description: '[L6:Analysis] Capture epistemic state after task execution and calculate learning delta. Call after completing implementation work. Calculates Learning Index: LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25). Token Budget: 1200.',
  inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
};

// T043-T047: Causal Memory Graph tools (REQ-012) - L6: Analysis
const memoryDriftWhy: ToolDefinition = {
  name: 'memory_drift_why',
  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
  inputSchema: { type: 'object', properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (required)' }, maxDepth: { type: 'number', default: 3, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', enum: ['outgoing', 'incoming', 'both'], default: 'both', description: 'Traversal direction: outgoing (what this caused), incoming (what caused this), or both' }, relations: { type: 'array', items: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'] }, description: 'Filter to specific relationship types' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
};

const memoryCausalLink: ToolDefinition = {
  name: 'memory_causal_link',
  description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.',
  inputSchema: { type: 'object', properties: { sourceId: { type: 'string', description: 'Source memory ID (the cause/enabler/superseder)' }, targetId: { type: 'string', description: 'Target memory ID (the effect/superseded)' }, relation: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'], description: 'Relationship type' }, strength: { type: 'number', default: 1.0, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] },
};

const memoryCausalStats: ToolDefinition = {
  name: 'memory_causal_stats',
  description: '[L6:Analysis] Get statistics about the causal memory graph. Shows total edges, coverage percentage, and breakdown by relationship type. Target: 60% of memories linked (CHK-065). Token Budget: 1200.',
  inputSchema: { type: 'object', properties: {}, required: [] },
};

const memoryCausalUnlink: ToolDefinition = {
  name: 'memory_causal_unlink',
  description: '[L6:Analysis] Remove a causal relationship by edge ID. Use memory_drift_why to find edge IDs. Token Budget: 1200.',
  inputSchema: { type: 'object', properties: { edgeId: { type: 'number', description: 'Edge ID to delete (required)' } }, required: ['edgeId'] },
};

const evalRunAblation: ToolDefinition = {
  name: 'eval_run_ablation',
  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
  inputSchema: {
    type: 'object',
    properties: {
      channels: {
        type: 'array',
        items: { type: 'string', enum: ['vector', 'bm25', 'fts5', 'graph', 'trigger'] },
        description: 'Channels to ablate (default: all channels).'
      },
      groundTruthQueryIds: {
        type: 'array',
        items: { type: 'number' },
        description: 'Optional subset of ground truth query IDs to evaluate.'
      },
      recallK: { type: 'number', description: 'Recall cutoff K (default: 20).' },
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
    properties: {
      sprintFilter: { type: 'array', items: { type: 'string' }, description: 'Optional sprint label filters.' },
      channelFilter: { type: 'array', items: { type: 'string' }, description: 'Optional channel filters.' },
      metricFilter: { type: 'array', items: { type: 'string' }, description: 'Optional metric-name filters.' },
      limit: { type: 'number', description: 'Maximum sprint groups to return (most recent).' },
      format: { type: 'string', enum: ['text', 'json'], default: 'text', description: 'Formatted report payload type.' },
    },
    required: [],
  },
};

// L7: Maintenance - Indexing and system operations (Token Budget: 1000)
const memoryIndexScan: ToolDefinition = {
  name: 'memory_index_scan',
  description: '[L7:Maintenance] Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files. Token Budget: 1000.',
  inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research.md, handover.md). These are indexed with higher priority than regular memories. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
};

const memoryGetLearningHistory: ToolDefinition = {
  name: 'memory_get_learning_history',
  description: '[L7:Maintenance] Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Use to analyze learning patterns across tasks within a spec. Token Budget: 1000.',
  inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
};

const memoryIngestStart: ToolDefinition = {
  name: 'memory_ingest_start',
  description: '[L7:Maintenance] Start an async ingestion job for multiple markdown files. Returns immediately with a jobId, while files are processed sequentially in the background.',
  inputSchema: {
    type: 'object',
    properties: {
      paths: {
        type: 'array',
        items: { type: 'string' },
        description: 'Absolute file paths to ingest (required, at least one).',
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
    properties: {
      jobId: { type: 'string', description: 'Ingestion job identifier (required).' },
    },
    required: ['jobId'],
  },
};

const memoryIngestCancel: ToolDefinition = {
  name: 'memory_ingest_cancel',
  description: '[L7:Maintenance] Cancel a running async ingestion job. Cancellation is checked between files.',
  inputSchema: {
    type: 'object',
    properties: {
      jobId: { type: 'string', description: 'Ingestion job identifier (required).' },
    },
    required: ['jobId'],
  },
};

// --- 4. AGGREGATED DEFINITIONS ---

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // L1: Orchestration
  memoryContext,
  // L2: Core
  memorySearch,
  memoryMatchTriggers,
  memorySave,
  // L3: Discovery
  memoryList,
  memoryStats,
  memoryHealth,
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
];
