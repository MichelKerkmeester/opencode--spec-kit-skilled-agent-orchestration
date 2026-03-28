// ───────────────────────────────────────────────────────────────
// MODULE: Recovery Hints
// ───────────────────────────────────────────────────────────────
// Feature catalog: Guards and edge cases
// Error catalog with recovery hints (REQ-004, REQ-009)
// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Defines the Severity type.
 */
export type Severity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Describes the RecoveryHint shape.
 */
export interface RecoveryHint {
  hint: string;
  actions: string[];
  severity: Severity;
  toolTip?: string;
}

/**
 * Defines the RecoveryHintMap type.
 */
export type RecoveryHintMap = Record<string, RecoveryHint>;

/**
 * Defines the ToolSpecificHintMap type.
 */
export type ToolSpecificHintMap = Record<string, Record<string, RecoveryHint>>;

// ───────────────────────────────────────────────────────────────
// 2. ERROR CODES CATALOG

// ───────────────────────────────────────────────────────────────
//
// Organized by category for maintainability.
// Zero runtime cost - static constants.
/**
 * Defines the ERROR_CODES constant.
 */
export const ERROR_CODES = {
  // Embedding errors (E001-E009)
  EMBEDDING_FAILED: 'E001',
  EMBEDDING_DIMENSION_INVALID: 'E002',
  EMBEDDING_TIMEOUT: 'E003',
  EMBEDDING_PROVIDER_UNAVAILABLE: 'E004',

  // File errors (E010-E019)
  FILE_NOT_FOUND: 'E010',
  FILE_ACCESS_DENIED: 'E011',
  FILE_ENCODING_ERROR: 'E012',
  FILE_TOO_LARGE: 'E013',
  FILE_INVALID_PATH: 'E014',

  // Database errors (E020-E029)
  DB_CONNECTION_FAILED: 'E020',
  DB_QUERY_FAILED: 'E021',
  DB_TRANSACTION_FAILED: 'E022',
  DB_MIGRATION_FAILED: 'E023',
  DB_CORRUPTION: 'E024',
  DATABASE_ERROR: 'E025',

  // Parameter errors (E030-E039)
  INVALID_PARAMETER: 'E030',
  MISSING_REQUIRED_PARAM: 'E031',
  PARAMETER_OUT_OF_RANGE: 'E032',
  INVALID_SPEC_FOLDER: 'E033',

  // Search errors (E040-E049)
  SEARCH_FAILED: 'E040',
  VECTOR_SEARCH_UNAVAILABLE: 'E041',
  QUERY_TOO_LONG: 'E042',
  QUERY_EMPTY: 'E043',
  NO_RESULTS: 'E044',

  // API/Auth errors (E050-E059)
  API_KEY_INVALID_STARTUP: 'E050',
  API_KEY_INVALID_RUNTIME: 'E051',
  LOCAL_MODEL_UNAVAILABLE: 'E052',
  API_RATE_LIMITED: 'E053',

  // Checkpoint errors (E060-E069)
  CHECKPOINT_NOT_FOUND: 'E060',
  CHECKPOINT_RESTORE_FAILED: 'E061',
  CHECKPOINT_CREATE_FAILED: 'E062',
  CHECKPOINT_DUPLICATE_NAME: 'E063',

  // Session errors (E070-E079)
  SESSION_EXPIRED: 'E070',
  SESSION_INVALID: 'E071',
  SESSION_RECOVERY_FAILED: 'E072',

  // Memory operation errors (E080-E089)
  MEMORY_NOT_FOUND: 'E080',
  MEMORY_SAVE_FAILED: 'E081',
  MEMORY_DELETE_FAILED: 'E082',
  MEMORY_UPDATE_FAILED: 'E083',
  MEMORY_DUPLICATE: 'E084',

  // Validation errors (E090-E099)
  VALIDATION_FAILED: 'E090',
  ANCHOR_FORMAT_INVALID: 'E091',
  TOKEN_BUDGET_EXCEEDED: 'E092',
  PREFLIGHT_FAILED: 'E093',

  // Causal graph errors (E100-E109)
  CAUSAL_EDGE_NOT_FOUND: 'E100',
  CAUSAL_CYCLE_DETECTED: 'E101',
  CAUSAL_INVALID_RELATION: 'E102',
  CAUSAL_SELF_REFERENCE: 'E103',
  CAUSAL_GRAPH_ERROR: 'E104',
  TRAVERSAL_ERROR: 'E105',

  // Rate limiting (HTTP-style codes)
  RATE_LIMITED: 'E429',
  SERVICE_UNAVAILABLE: 'E503',
} as const;

/**
 * Defines the ErrorCodeKey type.
 */
export type ErrorCodeKey = keyof typeof ERROR_CODES;
/**
 * Defines the ErrorCodeValue type.
 */
export type ErrorCodeValue = (typeof ERROR_CODES)[ErrorCodeKey];

// ───────────────────────────────────────────────────────────────
// 3. RECOVERY HINTS CATALOG

// ───────────────────────────────────────────────────────────────
//
// Each error code has specific recovery guidance.
// Default hint is "Run memory_health() for diagnostics".
/**
 * Defines the RECOVERY_HINTS constant.
 */
export const RECOVERY_HINTS: RecoveryHintMap = {
  // --- Embedding Errors ---
  [ERROR_CODES.EMBEDDING_FAILED]: {
    hint: 'Embedding generation failed. Search will fall back to BM25 text matching.',
    actions: [
      'Check VOYAGE_API_KEY or OPENAI_API_KEY environment variable is set',
      'Verify network connectivity to embedding provider',
      'Run memory_health() to check embedding system status'
    ],
    severity: 'medium',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.EMBEDDING_DIMENSION_INVALID]: {
    hint: 'Embedding dimension mismatch. The vector index may need reindexing.',
    actions: [
      'Run memory_index_scan with force=true to rebuild index',
      'Check if embedding provider changed (e.g., Voyage vs OpenAI)',
      'Verify VOYAGE_MODEL_VERSION matches indexed content'
    ],
    severity: 'high',
    toolTip: 'memory_index_scan({ force: true })'
  },
  [ERROR_CODES.EMBEDDING_TIMEOUT]: {
    hint: 'Embedding request timed out. This may be a transient issue.',
    actions: [
      'Retry the operation after a few seconds',
      'Check network latency to embedding provider',
      'Consider enabling local fallback: ENABLE_LOCAL_FALLBACK=true'
    ],
    severity: 'medium',
    toolTip: 'Retry or enable ENABLE_LOCAL_FALLBACK'
  },
  [ERROR_CODES.EMBEDDING_PROVIDER_UNAVAILABLE]: {
    hint: 'No embedding provider available. Search limited to text matching.',
    actions: [
      'Set VOYAGE_API_KEY or OPENAI_API_KEY environment variable',
      'Enable local fallback: ENABLE_LOCAL_FALLBACK=true',
      'Run memory_health() to see current provider status'
    ],
    severity: 'high',
    toolTip: 'memory_health()'
  },

  // --- File Errors ---
  [ERROR_CODES.FILE_NOT_FOUND]: {
    hint: 'Memory file not found at specified path.',
    actions: [
      'Verify the file path is absolute and correct',
      'Check if file was moved or deleted',
      'Run memory_list() to see indexed memories and their paths'
    ],
    severity: 'medium',
    toolTip: 'memory_list({ limit: 20 })'
  },
  [ERROR_CODES.FILE_ACCESS_DENIED]: {
    hint: 'Permission denied accessing memory file.',
    actions: [
      'Check file permissions (should be readable)',
      'Verify the MCP server has access to the file location',
      'Check if file is locked by another process'
    ],
    severity: 'medium'
  },
  [ERROR_CODES.FILE_ENCODING_ERROR]: {
    hint: 'Failed to read file due to encoding issues.',
    actions: [
      'Ensure file is UTF-8 encoded',
      'Remove any binary content from the memory file',
      'Check for corrupted characters in file content'
    ],
    severity: 'low'
  },
  [ERROR_CODES.FILE_TOO_LARGE]: {
    hint: 'File exceeds maximum size limit for indexing.',
    actions: [
      'Split large memory files into smaller focused documents',
      'Use anchors to organize content within the file',
      'Consider summarizing lengthy content'
    ],
    severity: 'low'
  },
  [ERROR_CODES.FILE_INVALID_PATH]: {
    hint: 'Invalid file path. Memory files must be in valid spec folder locations.',
    actions: [
      'Place memory files in specs/**/memory/ directories',
      'Or use .opencode/skill/*/constitutional/ for constitutional memories',
      'Check path format (must be absolute)'
    ],
    severity: 'medium'
  },

  // --- Database Errors ---
  [ERROR_CODES.DB_CONNECTION_FAILED]: {
    hint: 'Failed to connect to memory database.',
    actions: [
      'Check if SQLite database file exists and is accessible',
      'Verify SPECKIT_DB_PATH environment variable if set',
      'Restart the MCP server to reinitialize connection'
    ],
    severity: 'critical',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.DB_QUERY_FAILED]: {
    hint: 'Database query failed.',
    actions: [
      'Run memory_health() to check database integrity',
      'If persistent, database may need repair or rebuild',
      'Check server logs for detailed error message'
    ],
    severity: 'medium',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.DB_TRANSACTION_FAILED]: {
    hint: 'Database transaction failed (possibly due to concurrent access).',
    actions: [
      'Retry the operation after a moment',
      'If using multiple processes, ensure proper locking',
      'Check for database file locks'
    ],
    severity: 'medium'
  },
  [ERROR_CODES.DB_MIGRATION_FAILED]: {
    hint: 'Database schema migration failed.',
    actions: [
      'Check server logs for migration error details',
      'Backup existing database before manual intervention',
      'Contact support with schema version info from memory_health()'
    ],
    severity: 'critical',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.DB_CORRUPTION]: {
    hint: 'Database corruption detected.',
    actions: [
      'Run memory_health() to assess damage',
      'Restore from most recent checkpoint: checkpoint_list()',
      'If no checkpoint available, rebuild index: memory_index_scan({ force: true })'
    ],
    severity: 'critical',
    toolTip: 'checkpoint_list()'
  },
  [ERROR_CODES.DATABASE_ERROR]: {
    hint: 'General database error occurred.',
    actions: [
      'Run memory_health() to check database status',
      'Restart the MCP server to reinitialize the database connection',
      'Check server logs for detailed error information'
    ],
    severity: 'high',
    toolTip: 'memory_health()'
  },

  // --- Parameter Errors ---
  [ERROR_CODES.INVALID_PARAMETER]: {
    hint: 'Invalid parameter value provided.',
    actions: [
      'Check parameter type matches expected schema',
      'Review tool documentation for valid parameter values',
      'Ensure strings are properly quoted'
    ],
    severity: 'low'
  },
  [ERROR_CODES.MISSING_REQUIRED_PARAM]: {
    hint: 'Required parameter is missing.',
    actions: [
      'Check the tool schema for required parameters',
      'Provide all required parameters in the request'
    ],
    severity: 'low'
  },
  [ERROR_CODES.PARAMETER_OUT_OF_RANGE]: {
    hint: 'Parameter value is outside valid range.',
    actions: [
      'Check parameter constraints (min/max values)',
      'Use memory_health() to see current system limits'
    ],
    severity: 'low'
  },
  [ERROR_CODES.INVALID_SPEC_FOLDER]: {
    hint: 'Invalid or non-existent spec folder.',
    actions: [
      'Verify spec folder path exists',
      'Use memory_stats() to see available spec folders',
      'Check path format (relative to workspace root)'
    ],
    severity: 'medium',
    toolTip: 'memory_stats()'
  },

  // --- Search Errors ---
  [ERROR_CODES.SEARCH_FAILED]: {
    hint: 'Search operation failed.',
    actions: [
      'Try simplifying your query',
      'Check memory_health() for system status',
      'If vector search failed, results may still include BM25 matches'
    ],
    severity: 'medium',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.VECTOR_SEARCH_UNAVAILABLE]: {
    hint: 'Vector search unavailable. Using text-based search as fallback.',
    actions: [
      'Check embedding provider status with memory_health()',
      'Ensure at least one embedding method is configured',
      'Text search (BM25) will still work for keyword matches'
    ],
    severity: 'medium',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.QUERY_TOO_LONG]: {
    hint: 'Query exceeds maximum length.',
    actions: [
      'Shorten query to under 4096 characters',
      'Focus on key concepts rather than full context',
      'Use memory_match_triggers() for prompt-based matching instead'
    ],
    severity: 'low',
    toolTip: 'memory_match_triggers()'
  },
  [ERROR_CODES.QUERY_EMPTY]: {
    hint: 'Query cannot be empty.',
    actions: [
      'Provide a non-empty query string',
      'Or use concepts array for multi-concept search',
      'Use memory_list() to browse all memories without query'
    ],
    severity: 'low',
    toolTip: 'memory_list()'
  },
  [ERROR_CODES.NO_RESULTS]: {
    hint: 'No memories matched your query.',
    actions: [
      'Try broader search terms',
      'Remove specFolder filter to search all memories',
      'Check memory_stats() to see what content is indexed'
    ],
    severity: 'low',
    toolTip: 'memory_stats()'
  },

  // --- API/Auth Errors ---
  [ERROR_CODES.API_KEY_INVALID_STARTUP]: {
    hint: 'API key validation failed at startup. Embedding features disabled.',
    actions: [
      'Check VOYAGE_API_KEY or OPENAI_API_KEY is correct',
      'Verify API key has not expired',
      'Enable local fallback: ENABLE_LOCAL_FALLBACK=true'
    ],
    severity: 'high'
  },
  [ERROR_CODES.API_KEY_INVALID_RUNTIME]: {
    hint: 'API key validation failed during operation.',
    actions: [
      'Check API key environment variable',
      'Verify account has sufficient credits',
      'Try operation again after checking key'
    ],
    severity: 'high'
  },
  [ERROR_CODES.LOCAL_MODEL_UNAVAILABLE]: {
    hint: 'Local embedding model not available.',
    actions: [
      'Install local model: npm install @huggingface/transformers',
      'Ensure sufficient disk space for model download',
      'Use API-based embedding as alternative'
    ],
    severity: 'medium'
  },
  [ERROR_CODES.API_RATE_LIMITED]: {
    hint: 'Rate limited by embedding provider. Retry after delay.',
    actions: [
      'Wait a few seconds before retrying',
      'Consider enabling local fallback for high-volume operations',
      'Check provider rate limits documentation'
    ],
    severity: 'low'
  },

  // --- Checkpoint Errors ---
  [ERROR_CODES.CHECKPOINT_NOT_FOUND]: {
    hint: 'Checkpoint with specified name not found.',
    actions: [
      'Use checkpoint_list() to see available checkpoints',
      'Check for typos in checkpoint name',
      'Verify checkpoint was not deleted'
    ],
    severity: 'medium',
    toolTip: 'checkpoint_list()'
  },
  [ERROR_CODES.CHECKPOINT_RESTORE_FAILED]: {
    hint: 'Failed to restore from checkpoint.',
    actions: [
      'Check checkpoint_list() for checkpoint status',
      'Verify checkpoint is not corrupted (check metadata)',
      'Try restoring to a different checkpoint if available'
    ],
    severity: 'high',
    toolTip: 'checkpoint_list()'
  },
  [ERROR_CODES.CHECKPOINT_CREATE_FAILED]: {
    hint: 'Failed to create checkpoint.',
    actions: [
      'Check available disk space',
      'Verify write permissions to database directory',
      'Run memory_health() to check system status'
    ],
    severity: 'medium',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.CHECKPOINT_DUPLICATE_NAME]: {
    hint: 'A checkpoint with this name already exists.',
    actions: [
      'Use a unique checkpoint name',
      'Delete existing checkpoint first: checkpoint_delete()',
      'Use checkpoint_list() to see existing names'
    ],
    severity: 'low',
    toolTip: 'checkpoint_list()'
  },

  // --- Session Errors ---
  [ERROR_CODES.SESSION_EXPIRED]: {
    hint: 'Session has expired.',
    actions: [
      'Start a new session with fresh sessionId',
      'Previously sent memories will be resent',
      'Consider using /spec_kit:resume for session recovery'
    ],
    severity: 'low'
  },
  [ERROR_CODES.SESSION_INVALID]: {
    hint: 'Invalid session identifier.',
    actions: [
      'Provide a valid session ID string',
      'Session IDs are typically UUIDs or conversation IDs',
      'Omit sessionId to disable session deduplication'
    ],
    severity: 'low'
  },
  [ERROR_CODES.SESSION_RECOVERY_FAILED]: {
    hint: 'Failed to recover session state.',
    actions: [
      'Session data may have been lost during crash',
      'Start fresh with new sessionId',
      'Check memory_health() for recovery options'
    ],
    severity: 'medium',
    toolTip: 'memory_health()'
  },

  // --- Memory Operation Errors ---
  [ERROR_CODES.MEMORY_NOT_FOUND]: {
    hint: 'Memory with specified ID not found.',
    actions: [
      'Use memory_list() to find valid memory IDs',
      'Memory may have been deleted',
      'Check if using correct ID type (number, not string)'
    ],
    severity: 'medium',
    toolTip: 'memory_list()'
  },
  [ERROR_CODES.MEMORY_SAVE_FAILED]: {
    hint: 'Failed to save memory.',
    actions: [
      'Check file path is valid and in allowed directory',
      'Verify file content is valid markdown with YAML frontmatter',
      'Use memory_save({ dryRun: true }) to validate first',
      'If the response includes INSUFFICIENT_CONTEXT_ABORT, gather at least one concrete file, tool result, decision, blocker, next action, or outcome before retrying'
    ],
    severity: 'medium',
    toolTip: 'memory_save({ dryRun: true })'
  },
  [ERROR_CODES.MEMORY_DELETE_FAILED]: {
    hint: 'Failed to delete memory.',
    actions: [
      'Verify memory ID exists',
      'For bulk delete, ensure confirm=true is set',
      'Check database is not locked'
    ],
    severity: 'medium'
  },
  [ERROR_CODES.MEMORY_UPDATE_FAILED]: {
    hint: 'Failed to update memory.',
    actions: [
      'Verify memory ID exists',
      'Check parameter types match schema',
      'Run memory_health() to check database status'
    ],
    severity: 'medium',
    toolTip: 'memory_health()'
  },
  [ERROR_CODES.MEMORY_DUPLICATE]: {
    hint: 'Memory with same content already exists.',
    actions: [
      'Use force=true to overwrite existing memory',
      'Or use memory_update() to modify existing entry',
      'Check memory_search() for existing similar content'
    ],
    severity: 'low',
    toolTip: 'memory_save({ force: true })'
  },

  // --- Validation Errors ---
  [ERROR_CODES.VALIDATION_FAILED]: {
    hint: 'Memory validation failed.',
    actions: [
      'Run memory_save({ dryRun: true }) for detailed validation report',
      'Check memory file format matches template',
      'Verify YAML frontmatter is valid'
    ],
    severity: 'medium',
    toolTip: 'memory_save({ dryRun: true })'
  },
  [ERROR_CODES.ANCHOR_FORMAT_INVALID]: {
    hint: 'Invalid anchor format in memory file.',
    actions: [
      'Use format: <!-- ANCHOR: anchor_name -->',
      'Anchor names should be lowercase with underscores',
      'End sections with <!-- /ANCHOR: anchor_name -->'
    ],
    severity: 'low'
  },
  [ERROR_CODES.TOKEN_BUDGET_EXCEEDED]: {
    hint: 'Memory file exceeds token budget limit.',
    actions: [
      'Split content into multiple focused memory files',
      'Use anchors to allow partial loading',
      'Summarize verbose sections'
    ],
    severity: 'medium'
  },
  [ERROR_CODES.PREFLIGHT_FAILED]: {
    hint: 'Pre-flight validation failed.',
    actions: [
      'Review validation errors in response',
      'Fix issues before proceeding with save',
      'Use skipPreflight=true only if necessary'
    ],
    severity: 'low'
  },

  // --- Causal Graph Errors ---
  [ERROR_CODES.CAUSAL_EDGE_NOT_FOUND]: {
    hint: 'Causal edge not found.',
    actions: [
      'Use memory_drift_why() to find valid edge IDs',
      'Edge may have been deleted',
      'Check memory_causal_stats() for graph status'
    ],
    severity: 'medium',
    toolTip: 'memory_causal_stats()'
  },
  [ERROR_CODES.CAUSAL_CYCLE_DETECTED]: {
    hint: 'Causal relationship would create a cycle.',
    actions: [
      'Check existing relationships with memory_drift_why()',
      'Consider using "supports" relation instead of "caused"',
      'Review the intended relationship direction'
    ],
    severity: 'medium',
    toolTip: 'memory_drift_why()'
  },
  [ERROR_CODES.CAUSAL_INVALID_RELATION]: {
    hint: 'Invalid causal relation type.',
    actions: [
      'Valid relations: caused, enabled, supersedes, contradicts, derived_from, supports',
      'Check spelling of relation parameter',
      'See memory_causal_link() documentation for relation semantics'
    ],
    severity: 'low'
  },
  [ERROR_CODES.CAUSAL_SELF_REFERENCE]: {
    hint: 'Cannot create self-referential causal link.',
    actions: [
      'Source and target memory IDs must be different',
      'Check if IDs were accidentally swapped',
      'Use memory_list() to verify correct IDs'
    ],
    severity: 'low',
    toolTip: 'memory_list()'
  },
  [ERROR_CODES.CAUSAL_GRAPH_ERROR]: {
    hint: 'The causal graph operation failed.',
    actions: [
      'Retry the graph operation',
      'Run memory_causal_stats() to inspect graph health',
      'Check server logs for the detailed failure'
    ],
    severity: 'medium',
    toolTip: 'memory_causal_stats()'
  },
  [ERROR_CODES.TRAVERSAL_ERROR]: {
    hint: 'The causal traversal could not be completed.',
    actions: [
      'Retry memory_drift_why() with a smaller maxDepth',
      'Run memory_causal_stats() to inspect graph integrity',
      'Check server logs for the detailed failure'
    ],
    severity: 'medium',
    toolTip: 'memory_drift_why()'
  },

  // --- Rate Limiting ---
  [ERROR_CODES.RATE_LIMITED]: {
    hint: 'Operation rate limited. Please wait before retrying.',
    actions: [
      'Wait a few seconds before retrying',
      'Reduce request frequency',
      'For bulk operations, use batch methods when available'
    ],
    severity: 'low'
  },
  [ERROR_CODES.SERVICE_UNAVAILABLE]: {
    hint: 'Service temporarily unavailable.',
    actions: [
      'Wait and retry in a few moments',
      'Check memory_health() for system status',
      'If persistent, restart the MCP server'
    ],
    severity: 'high',
    toolTip: 'memory_health()'
  },
};

// ───────────────────────────────────────────────────────────────
// 4. DEFAULT HINT (REQ-009)

// ───────────────────────────────────────────────────────────────
/**
 * Defines the DEFAULT_HINT constant.
 */
export const DEFAULT_HINT: RecoveryHint = {
  hint: 'An unexpected error occurred.',
  actions: [
    'Run memory_health() for diagnostics',
    'Check server logs for detailed error information',
    'Retry the operation after a moment'
  ],
  severity: 'medium',
  toolTip: 'memory_health()'
};

// ───────────────────────────────────────────────────────────────
// 5. TOOL-SPECIFIC HINTS

// ───────────────────────────────────────────────────────────────
/**
 * Defines the TOOL_SPECIFIC_HINTS constant.
 */
export const TOOL_SPECIFIC_HINTS: ToolSpecificHintMap = {
  // Memory_search specific hints
  memory_search: {
    [ERROR_CODES.EMBEDDING_FAILED]: {
      hint: 'Semantic search unavailable. Results limited to keyword matching.',
      actions: [
        'BM25 text search will still return relevant results',
        'Check embedding provider status: memory_health()',
        'Try memory_match_triggers() for trigger-based matching'
      ],
      severity: 'medium',
      toolTip: 'memory_match_triggers()'
    },
    [ERROR_CODES.VECTOR_SEARCH_UNAVAILABLE]: {
      hint: 'Vector index not ready. Using text search.',
      actions: [
        'Wait for index initialization to complete',
        'Run memory_index_scan() to rebuild if needed',
        'Text results will still be relevant for exact matches'
      ],
      severity: 'low',
      toolTip: 'memory_index_scan()'
    },
  },

  // Checkpoint_restore specific hints
  checkpoint_restore: {
    [ERROR_CODES.CHECKPOINT_NOT_FOUND]: {
      hint: 'Cannot restore: checkpoint does not exist.',
      actions: [
        'List available checkpoints: checkpoint_list()',
        'Create a new checkpoint first: checkpoint_create()',
        'Checkpoints are named - check for typos'
      ],
      severity: 'medium',
      toolTip: 'checkpoint_list()'
    },
    [ERROR_CODES.CHECKPOINT_RESTORE_FAILED]: {
      hint: 'Checkpoint restore failed. Database state unchanged.',
      actions: [
        'Check checkpoint metadata for errors',
        'Try an earlier checkpoint if available',
        'Run memory_health() to verify database integrity'
      ],
      severity: 'high',
      toolTip: 'memory_health()'
    },
  },

  // Memory_save specific hints
  memory_save: {
    [ERROR_CODES.FILE_NOT_FOUND]: {
      hint: 'Memory file not found. Cannot index non-existent file.',
      actions: [
        'Verify the file path is correct and absolute',
        'Create the memory file before calling memory_save',
        'Use generate-context.js script to create memory files'
      ],
      severity: 'medium'
    },
    [ERROR_CODES.EMBEDDING_FAILED]: {
      hint: 'Memory saved but embedding failed. Will be searchable via text only.',
      actions: [
        'Memory is indexed and searchable via BM25 text search',
        'Embedding will be retried by background job',
        'Check memory_health() for embedding provider status'
      ],
      severity: 'low',
      toolTip: 'memory_health()'
    },
    [ERROR_CODES.VALIDATION_FAILED]: {
      hint: 'Memory file failed validation checks.',
      actions: [
        'Run with dryRun=true to see detailed validation report',
        'Check YAML frontmatter format',
        'Ensure anchors use correct format'
      ],
      severity: 'medium',
      toolTip: 'memory_save({ dryRun: true })'
    },
  },

  // Memory_index_scan specific hints
  memory_index_scan: {
    [ERROR_CODES.EMBEDDING_PROVIDER_UNAVAILABLE]: {
      hint: 'Scan complete but embeddings unavailable. Files indexed for text search only.',
      actions: [
        'Configure an embedding provider for semantic search',
        'Re-run scan after configuring embeddings',
        'Text search will work for all indexed files'
      ],
      severity: 'medium'
    },
  },

  // Memory_drift_why specific hints
  memory_drift_why: {
    [ERROR_CODES.MEMORY_NOT_FOUND]: {
      hint: 'Cannot trace lineage: memory not found.',
      actions: [
        'Use memory_list() to find valid memory IDs',
        'Ensure memory is indexed before tracing',
        'Check if memory was deleted'
      ],
      severity: 'medium',
      toolTip: 'memory_list()'
    },
  },

  // Memory_causal_link specific hints
  memory_causal_link: {
    [ERROR_CODES.MEMORY_NOT_FOUND]: {
      hint: 'Cannot create link: one or both memories not found.',
      actions: [
        'Verify both source and target memory IDs exist',
        'Use memory_list() to find valid IDs',
        'Index the memory files first if needed'
      ],
      severity: 'medium',
      toolTip: 'memory_list()'
    },
  },
};

// 6. getRecoveryHint() FUNCTION (T010)
//
// Returns recovery hint for tool + error code.
// Zero runtime cost - static lookup.
/**
 * Get recovery hint for a specific error in tool context.
 * Checks tool-specific hints first, then generic hints.
 */
export function getRecoveryHint(toolName: string, errorCode: string): RecoveryHint {
  // 1. Check tool-specific hints first
  const toolHints = TOOL_SPECIFIC_HINTS[toolName];
  if (toolHints && toolHints[errorCode]) {
    return toolHints[errorCode];
  }

  // 2. Fall back to generic error code hints
  if (RECOVERY_HINTS[errorCode]) {
    return RECOVERY_HINTS[errorCode];
  }

  // 3. Return default hint (REQ-009)
  return DEFAULT_HINT;
}

// ───────────────────────────────────────────────────────────────
// 6. HELPER FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * Check if a specific hint exists (not default).
 */
export function hasSpecificHint(toolName: string, errorCode: string): boolean {
  const toolHints = TOOL_SPECIFIC_HINTS[toolName];
  if (toolHints && toolHints[errorCode]) return true;
  if (RECOVERY_HINTS[errorCode]) return true;
  return false;
}

/**
 * Get all available hints for a tool.
 * Useful for documentation generation.
 */
export function getAvailableHints(toolName: string): RecoveryHintMap {
  const result: RecoveryHintMap = {};

  // Add generic hints
  for (const code of Object.keys(RECOVERY_HINTS)) {
    result[code] = RECOVERY_HINTS[code];
  }

  // Override with tool-specific hints
  const toolHints = TOOL_SPECIFIC_HINTS[toolName];
  if (toolHints) {
    for (const code of Object.keys(toolHints)) {
      result[code] = toolHints[code];
    }
  }

  return result;
}

/**
 * Get all error codes.
 */
export function getErrorCodes(): typeof ERROR_CODES {
  return ERROR_CODES;
}
