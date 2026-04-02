// ───────────────────────────────────────────────────────────────
// MODULE: Preflight
// ───────────────────────────────────────────────────────────────
import crypto from 'crypto';
import fs from 'fs';
import { CHUNKING_THRESHOLD } from '../chunking/anchor-chunker.js';

// Feature catalog: Dry-run preflight for memory_save


// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** Preflight error code identifiers */
export interface PreflightErrorCodes {
  ANCHOR_FORMAT_INVALID: string;
  ANCHOR_UNCLOSED: string;
  ANCHOR_ID_INVALID: string;
  DUPLICATE_DETECTED: string;
  DUPLICATE_EXACT: string;
  DUPLICATE_SIMILAR: string;
  TOKEN_BUDGET_EXCEEDED: string;
  TOKEN_BUDGET_WARNING: string;
  CONTENT_TOO_LARGE: string;
  CONTENT_TOO_SMALL: string;
}

/** Configuration for preflight checks */
export interface PreflightConfig {
  charsPerToken: number;
  max_tokens_per_memory: number;
  warning_threshold: number;
  min_content_length: number;
  max_content_length: number;
  exact_duplicate_enabled: boolean;
  similar_duplicate_threshold: number;
  anchor_validation_strict: boolean;
}

/** Issue (error or warning) reported during preflight */
export interface PreflightIssue {
  code: string;
  message: string;
  anchorId?: string;
  suggestion?: string;
  existingId?: number;
  existing_path?: string;
  similarity?: number;
}

/** Result of anchor format validation */
export interface AnchorValidationResult {
  valid: boolean;
  errors: PreflightIssue[];
  warnings: string[];
  anchors: string[];
}

/** Result of duplicate detection */
export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicate_type: 'exact' | 'similar' | null;
  existingId: number | null;
  existing_path: string | null;
  similarity: number | null;
  content_hash: string | null;
  existing_scope?: {
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    sharedSpaceId?: string | null;
  };
  redactedForScope?: boolean;
}

/** Result of token budget check */
export interface TokenBudgetResult {
  within_budget: boolean;
  estimated_tokens: number;
  maxTokens: number;
  percentage_used: number;
  warnings: (string | PreflightIssue)[];
  errors: PreflightIssue[];
}

/** Result of content size validation */
export interface ContentSizeResult {
  valid: boolean;
  content_length: number;
  errors: PreflightIssue[];
  warnings: PreflightIssue[];
}

/** Parameters for duplicate checking */
export interface DuplicateCheckParams {
  content: string;
  content_hash?: string;
  spec_folder?: string;
  database?: DatabaseLike;
  find_similar?: FindSimilarFn;
  embedding?: Float32Array | number[];
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
}

/** Options for duplicate checking */
export interface DuplicateCheckOptions {
  check_exact?: boolean;
  check_similar?: boolean;
  similarity_threshold?: number;
}

/** Parameters for the unified preflight check */
export interface PreflightParams {
  content: string;
  file_path?: string;
  spec_folder?: string;
  database?: DatabaseLike;
  find_similar?: FindSimilarFn;
  embedding?: Float32Array | number[];
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
}

/** Options for the unified preflight check */
export interface PreflightOptions {
  dry_run?: boolean;
  check_anchors?: boolean;
  check_duplicates?: boolean;
  check_similar?: boolean;
  check_tokens?: boolean;
  check_size?: boolean;
  strict_anchors?: boolean;
}

/** Details within a preflight result */
export interface PreflightDetails {
  file_path?: string;
  spec_folder?: string;
  checks_run: string[];
  [key: string]: unknown;
}

/** Unified preflight result */
export interface PreflightResult {
  pass: boolean;
  dry_run: boolean;
  dry_run_would_pass?: boolean;
  errors: PreflightIssue[];
  warnings: (string | PreflightIssue)[];
  details: PreflightDetails;
}

/** Error details for PreflightError constructor */
export interface PreflightErrorDetails {
  recoverable?: boolean;
  suggestion?: string | null;
  errors?: PreflightIssue[];
  [key: string]: unknown;
}

/** Minimal database interface for preflight checks */
interface DatabaseLike {
  prepare(sql: string): {
    get(...params: unknown[]): Record<string, unknown> | undefined;
  };
}

function verifyStoredContentMatch(
  storedContent: string | null | undefined,
  storedPath: string | null | undefined,
  incomingContent: string,
): boolean | null {
  if (typeof storedContent === 'string') {
    return storedContent === incomingContent;
  }

  if (typeof storedPath === 'string' && storedPath.length > 0) {
    try {
      if (fs.existsSync(storedPath)) {
        return fs.readFileSync(storedPath, 'utf-8') === incomingContent;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/** Type for the find_similar callback */
type FindSimilarFn = (embedding: Float32Array | number[], options: {
  limit: number;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
}) => Array<{
  id: number;
  file_path: string;
  similarity: number;
  tenant_id?: string | null;
  user_id?: string | null;
  agent_id?: string | null;
  shared_space_id?: string | null;
}>;

// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION

// ───────────────────────────────────────────────────────────────
/**
 * Defines the PreflightErrorCodes constant.
 */
export const PreflightErrorCodes: Readonly<PreflightErrorCodes> = {
  ANCHOR_FORMAT_INVALID: 'PF001',
  ANCHOR_UNCLOSED: 'PF002',
  ANCHOR_ID_INVALID: 'PF003',
  DUPLICATE_DETECTED: 'PF010',
  DUPLICATE_EXACT: 'PF011',
  DUPLICATE_SIMILAR: 'PF012',
  TOKEN_BUDGET_EXCEEDED: 'PF020',
  TOKEN_BUDGET_WARNING: 'PF021',
  CONTENT_TOO_LARGE: 'PF030',
  CONTENT_TOO_SMALL: 'PF031',
} as const;

/**
 * Defines the PREFLIGHT_CONFIG constant.
 */
export const PREFLIGHT_CONFIG: PreflightConfig = {
  // Token budget estimation (~4 chars/token — harmonized with quality-loop.ts)
  charsPerToken: parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4'),
  max_tokens_per_memory: parseInt(process.env.MCP_MAX_MEMORY_TOKENS || '8000', 10),
  warning_threshold: parseFloat(process.env.MCP_TOKEN_WARNING_THRESHOLD || '0.8'),

  // Content size limits
  min_content_length: parseInt(process.env.MCP_MIN_CONTENT_LENGTH || '10', 10),
  max_content_length: parseInt(process.env.MCP_MAX_CONTENT_LENGTH || '250000', 10),

  // Duplicate detection thresholds
  exact_duplicate_enabled: true,
  similar_duplicate_threshold: parseFloat(process.env.MCP_DUPLICATE_THRESHOLD || '0.95'),

  // Anchor validation
  anchor_validation_strict: process.env.MCP_ANCHOR_STRICT === 'true',
};

// ───────────────────────────────────────────────────────────────
// 3. PREFLIGHT ERROR CLASS

// ───────────────────────────────────────────────────────────────
/**
 * Represents the PreflightError type.
 */
export class PreflightError extends Error {
  public code: string;
  public details: PreflightErrorDetails;
  public recoverable: boolean;
  public suggestion: string | null;

  constructor(code: string, message: string, details: PreflightErrorDetails = {}) {
    super(message);
    // Required for proper instanceof checks when targeting ES5 or with certain TS compilation targets
    Object.setPrototypeOf(this, PreflightError.prototype);
    this.name = 'PreflightError';
    this.code = code;
    this.details = details;
    this.recoverable = details.recoverable ?? false;
    this.suggestion = details.suggestion ?? null;
  }

  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      recoverable: this.recoverable,
      suggestion: this.suggestion,
    };
  }
}

// ───────────────────────────────────────────────────────────────
// 4. ANCHOR FORMAT VALIDATION

// ───────────────────────────────────────────────────────────────
const VALID_ANCHOR_ID_PATTERN: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-/]*$/;
const ANCHOR_OPENING_PATTERN: RegExp = /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi;

/**
 * Provides the validateAnchorFormat helper.
 */
export function validateAnchorFormat(content: string, options: { strict?: boolean } = {}): AnchorValidationResult {
  const { strict = PREFLIGHT_CONFIG.anchor_validation_strict } = options;

  const result: AnchorValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    anchors: [],
  };

  if (!content || typeof content !== 'string') {
    result.warnings.push('No content provided for anchor validation');
    return result;
  }

  // Find all opening anchor tags
  const openingTags: Array<{ id: string; position: number; full_match: string }> = [];
  let match: RegExpExecArray | null;
  const pattern = new RegExp(ANCHOR_OPENING_PATTERN.source, 'gi');

  while ((match = pattern.exec(content)) !== null) {
    const anchorId = match[1].trim();
    const position = match.index;

    openingTags.push({ id: anchorId, position, full_match: match[0] });
  }

  // Track seen anchor IDs for duplicate detection
  const seenIds = new Set<string>();

  for (const tag of openingTags) {
    const { id: anchorId, position } = tag;

    // Check for duplicate anchor IDs
    if (seenIds.has(anchorId)) {
      const errorMsg = `Duplicate anchor ID "${anchorId}" - each anchor must be unique`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
        message: errorMsg,
        anchorId,
        suggestion: `Rename one of the duplicate anchors to a unique ID`,
      });
      result.valid = false;
      continue;
    }
    seenIds.add(anchorId);

    // Validate anchor ID format
    if (!VALID_ANCHOR_ID_PATTERN.test(anchorId)) {
      const errorMsg = `Invalid anchor ID "${anchorId}" - must start with alphanumeric and contain only alphanumeric, hyphens, or slashes`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_ID_INVALID,
        message: errorMsg,
        anchorId,
        suggestion: `Use format like "summary", "decisions-001", or "spec-folder/section"`,
      });
      result.valid = false;
      continue;
    }

    // Check for corresponding closing tag
    const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const closingPattern = new RegExp(
      `<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(anchorId)}\\s*-->`,
      'i'
    );

    // Search for closing tag AFTER the opening tag
    const contentAfterOpen = content.slice(position + tag.full_match.length);
    const hasClosing = closingPattern.test(contentAfterOpen);

    if (!hasClosing) {
      const errorMsg = `Anchor "${anchorId}" is missing closing tag <!-- /ANCHOR:${anchorId} -->`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_UNCLOSED,
        message: errorMsg,
        anchorId,
        suggestion: `Add closing tag: <!-- /ANCHOR:${anchorId} --> after the anchor content`,
      });
      result.valid = false;
    } else {
      // Valid anchor
      result.anchors.push(anchorId);
    }
  }

  // In strict mode, throw on any validation errors
  if (strict && !result.valid) {
    const error = new PreflightError(
      PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
      `Anchor validation failed: ${result.errors.length} error(s)`,
      {
        errors: result.errors,
        recoverable: true,
        suggestion: 'Fix anchor format issues and retry',
      }
    );
    throw error;
  }

  return result;
}

// ───────────────────────────────────────────────────────────────
// 5. DUPLICATE DETECTION

// ───────────────────────────────────────────────────────────────
/**
 * Provides the computeContentHash helper.
 */
export function computeContentHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Provides the checkDuplicate helper.
 */
export function checkDuplicate(params: DuplicateCheckParams, options: DuplicateCheckOptions = {}): DuplicateCheckResult {
  const {
    content,
    content_hash: provided_hash,
    spec_folder,
    database,
    find_similar,
    embedding,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
  } = params;

  const {
    check_exact = PREFLIGHT_CONFIG.exact_duplicate_enabled,
    check_similar = false,
    similarity_threshold = PREFLIGHT_CONFIG.similar_duplicate_threshold,
  } = options;

  const result: DuplicateCheckResult = {
    isDuplicate: false,
    duplicate_type: null,
    existingId: null,
    existing_path: null,
    similarity: null,
    content_hash: null,
  };

  const normalizeScopeValue = (value?: string): string | null => {
    if (typeof value !== 'string') return null;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  };

  const requestedScope = {
    tenantId: normalizeScopeValue(tenantId),
    userId: normalizeScopeValue(userId),
    agentId: normalizeScopeValue(agentId),
    sharedSpaceId: normalizeScopeValue(sharedSpaceId),
  };

  const scopeFilters = [
    ['tenant_id', requestedScope.tenantId],
    ['user_id', requestedScope.userId],
    ['agent_id', requestedScope.agentId],
    ['shared_space_id', requestedScope.sharedSpaceId],
  ] as const;

  const redactDuplicateForScope = (
    duplicate: {
      tenant_id?: string | null;
      user_id?: string | null;
      agent_id?: string | null;
      shared_space_id?: string | null;
      file_path?: string | null;
    },
    similarity?: number | null,
  ): void => {
    const existingScope = {
      tenantId: duplicate.tenant_id ?? null,
      userId: duplicate.user_id ?? null,
      agentId: duplicate.agent_id ?? null,
      sharedSpaceId: duplicate.shared_space_id ?? null,
    };
    const existingValues = [
      existingScope.tenantId,
      existingScope.userId,
      existingScope.agentId,
      existingScope.sharedSpaceId,
    ];
    const isDifferentScope = scopeFilters.some(([_, value], index) => {
      if (value === null) return false;
      return existingValues[index] !== value;
    });

    result.redactedForScope = isDifferentScope;
    result.similarity = similarity ?? result.similarity;

    if (isDifferentScope) {
      result.existing_scope = undefined;
      result.existingId = null;
      result.existing_path = null;
      return;
    }

    result.existing_scope = existingScope;
    if (typeof duplicate.file_path === 'string') {
      result.existing_path = duplicate.file_path;
    }
  };

  // Compute content hash if not provided
  const content_hash = provided_hash || computeContentHash(content);
  result.content_hash = content_hash;

  // Check 1: Exact duplicate via content hash (fast)
  if (check_exact && database) {
    try {
      const whereClauses = ['content_hash = ?'];
      const paramsArray: unknown[] = [content_hash];
      if (spec_folder) {
        whereClauses.push('spec_folder = ?');
        paramsArray.push(spec_folder);
      }
      for (const [column, value] of scopeFilters) {
        if (value !== null) {
          whereClauses.push(`${column} = ?`);
          paramsArray.push(value);
        }
      }
      const sql = `
        SELECT id, file_path, content_text, tenant_id, user_id, agent_id, shared_space_id
        FROM memory_index
        WHERE ${whereClauses.join(' AND ')}
        LIMIT 1
      `;
      const existing = database.prepare(sql).get(...paramsArray) as {
        id: number;
        file_path: string;
        content_text?: string | null;
        tenant_id?: string | null;
        user_id?: string | null;
        agent_id?: string | null;
        shared_space_id?: string | null;
      } | undefined;

      if (existing) {
        const verifiedMatch = verifyStoredContentMatch(
          existing.content_text,
          existing.file_path,
          content,
        );
        if (verifiedMatch === false) {
          return result;
        }
        result.isDuplicate = true;
        result.duplicate_type = 'exact';
        result.existingId = existing.id;
        redactDuplicateForScope(existing, 1.0);
        return result;
      }
    } catch (err: unknown) {
      // Non-fatal: log and continue with other checks
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[preflight] Exact duplicate check failed:', message);
    }
  }

  // Check 2: Similar duplicate via vector similarity (requires embedding)
  if (check_similar && find_similar && embedding) {
    try {
      const candidates = find_similar(embedding, {
        limit: 1,
        specFolder: spec_folder,
        tenantId: requestedScope.tenantId ?? undefined,
        userId: requestedScope.userId ?? undefined,
        agentId: requestedScope.agentId ?? undefined,
        sharedSpaceId: requestedScope.sharedSpaceId ?? undefined,
      });

      if (candidates && candidates.length > 0) {
        const bestMatch = candidates[0] as {
          id: number;
          file_path?: string | null;
          similarity: number;
          tenant_id?: string | null;
          user_id?: string | null;
          agent_id?: string | null;
          shared_space_id?: string | null;
        };
        const similarity = bestMatch.similarity;

        if (similarity >= similarity_threshold) {
          result.isDuplicate = true;
          result.duplicate_type = 'similar';
          result.existingId = bestMatch.id;
          redactDuplicateForScope(bestMatch, similarity);
          return result;
        }
      }
    } catch (err: unknown) {
      // Non-fatal: log and continue
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[preflight] Similar duplicate check failed:', message);
    }
  }

  return result;
}

// ───────────────────────────────────────────────────────────────
// 6. TOKEN BUDGET ESTIMATION

// ───────────────────────────────────────────────────────────────
/**
 * Provides the estimateTokens helper.
 */
export function estimateTokens(content: string | unknown): number {
  if (!content) return 0;
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  return Math.max(1, Math.ceil(text.length / PREFLIGHT_CONFIG.charsPerToken));
}

/**
 * Provides the checkTokenBudget helper.
 */
export function checkTokenBudget(content: string, options: {
  maxTokens?: number;
  warning_threshold?: number;
  include_embedding_overhead?: boolean;
} = {}): TokenBudgetResult {
  const {
    maxTokens = PREFLIGHT_CONFIG.max_tokens_per_memory,
    warning_threshold = PREFLIGHT_CONFIG.warning_threshold,
    include_embedding_overhead = true,
  } = options;

  const result: TokenBudgetResult = {
    within_budget: true,
    estimated_tokens: 0,
    maxTokens,
    percentage_used: 0,
    warnings: [],
    errors: [],
  };

  if (!content) {
    result.warnings.push('No content provided for token budget check');
    return result;
  }

  // Estimate tokens for content
  let estimated = estimateTokens(content);

  // Add overhead for embedding API call (context + response)
  if (include_embedding_overhead) {
    const embeddingOverhead = 150;
    estimated += embeddingOverhead;
  }

  result.estimated_tokens = estimated;
  result.percentage_used = estimated / maxTokens;

  // Check if over budget
  if (estimated > maxTokens) {
    result.within_budget = false;
    result.errors.push({
      code: PreflightErrorCodes.TOKEN_BUDGET_EXCEEDED,
      message: `Content exceeds token budget: ${estimated} tokens (max: ${maxTokens})`,
      suggestion: `Reduce content by approximately ${estimated - maxTokens} tokens (${Math.ceil((estimated - maxTokens) * PREFLIGHT_CONFIG.charsPerToken)} characters)`,
    });
  }
  // Check if approaching budget
  else if (result.percentage_used >= warning_threshold) {
    result.warnings.push({
      code: PreflightErrorCodes.TOKEN_BUDGET_WARNING,
      message: `Content is ${Math.round(result.percentage_used * 100)}% of token budget (${estimated}/${maxTokens} tokens)`,
      suggestion: 'Consider splitting into smaller memories for better retrieval',
    });
  }

  return result;
}

// ───────────────────────────────────────────────────────────────
// 7. CONTENT SIZE VALIDATION

// ───────────────────────────────────────────────────────────────
/**
 * Provides the validateContentSize helper.
 */
export function validateContentSize(content: string, options: {
  min_length?: number;
  maxLength?: number;
} = {}): ContentSizeResult {
  const {
    min_length = PREFLIGHT_CONFIG.min_content_length,
    maxLength = PREFLIGHT_CONFIG.max_content_length,
  } = options;

  const result: ContentSizeResult = {
    valid: true,
    content_length: 0,
    errors: [],
    warnings: [],
  };

  if (!content || typeof content !== 'string') {
    result.valid = false;
    result.errors.push({
      code: PreflightErrorCodes.CONTENT_TOO_SMALL,
      message: 'Content is empty or invalid',
      suggestion: 'Provide valid content for the memory file',
    });
    return result;
  }

  result.content_length = content.length;

  if (content.length < min_length) {
    result.valid = false;
    result.errors.push({
      code: PreflightErrorCodes.CONTENT_TOO_SMALL,
      message: `Content too short: ${content.length} chars (min: ${min_length})`,
      suggestion: `Add at least ${min_length - content.length} more characters`,
    });
  }

  if (content.length > maxLength) {
    result.valid = false;
    result.errors.push({
      code: PreflightErrorCodes.CONTENT_TOO_LARGE,
      message: `Content too large: ${content.length} chars (max: ${maxLength})`,
      suggestion: `Reduce content by ${content.length - maxLength} characters or split into multiple memories`,
    });
  } else if (content.length >= CHUNKING_THRESHOLD) {
    result.warnings.push({
      code: PreflightErrorCodes.CONTENT_TOO_LARGE,
      message: `Content is large (${content.length} chars) — will be chunked automatically into smaller records`,
      suggestion: 'No action needed: chunked indexing handles large files',
    });
  }

  return result;
}

// ───────────────────────────────────────────────────────────────
// 8. UNIFIED PREFLIGHT CHECK

// ───────────────────────────────────────────────────────────────
/**
 * Provides the runPreflight helper.
 */
export function runPreflight(params: PreflightParams, options: PreflightOptions = {}): PreflightResult {
  const {
    content,
    file_path,
    spec_folder,
    database,
    find_similar,
    embedding,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
  } = params;

  const {
    dry_run = false,
    check_anchors = true,
    check_duplicates = true,
    check_similar = false,
    check_tokens = true,
    check_size = true,
    strict_anchors = false,
  } = options;

  const result: PreflightResult = {
    pass: true,
    dry_run,
    errors: [],
    warnings: [],
    details: {
      file_path,
      spec_folder,
      checks_run: [],
    },
  };

  // Track which checks were run
  const addCheck = (name: string, check_result: unknown): void => {
    result.details.checks_run.push(name);
    result.details[name] = check_result;
  };

  // 010-index-large-files: token-budget overages can be warnings when chunking can safely handle them.
  const isChunkEligible = !!content
    && content.length >= CHUNKING_THRESHOLD
    && content.length <= PREFLIGHT_CONFIG.max_content_length;

  // 1. Content size validation (fast, do first)
  if (check_size) {
    const sizeResult = validateContentSize(content);
    addCheck('content_size', sizeResult);

    if (!sizeResult.valid) {
      result.pass = false;
      result.errors.push(...sizeResult.errors);
    }
    if (sizeResult.warnings.length > 0) {
      result.warnings.push(...sizeResult.warnings);
    }
  }

  // 2. Anchor format validation
  if (check_anchors && content) {
    const anchorResult = validateAnchorFormat(content, { strict: strict_anchors });
    addCheck('anchor_format', anchorResult);

    if (!anchorResult.valid) {
      // Anchor errors are warnings by default unless strict mode
      if (strict_anchors) {
        result.pass = false;
        result.errors.push(...anchorResult.errors);
      } else {
        result.warnings.push(...anchorResult.errors);
      }
    }
    if (anchorResult.warnings.length > 0) {
      result.warnings.push(...anchorResult.warnings);
    }
  }

  // 3. Token budget estimation
  if (check_tokens && content) {
    const tokenResult = checkTokenBudget(content);
    addCheck('token_budget', tokenResult);

    if (!tokenResult.within_budget) {
      if (isChunkEligible) {
        // Large files will be chunked — convert to warning
        result.warnings.push(...tokenResult.errors);
      } else {
        result.pass = false;
        result.errors.push(...tokenResult.errors);
      }
    }
    if (tokenResult.warnings.length > 0) {
      result.warnings.push(...tokenResult.warnings);
    }
  }

  // 4. Duplicate detection
  if (check_duplicates && content) {
    const dupResult = checkDuplicate(
      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
      { check_exact: true, check_similar }
    );
    addCheck('duplicate_check', dupResult);

    if (dupResult.isDuplicate) {
      // Exact duplicates block save
      if (dupResult.duplicate_type === 'exact') {
        result.pass = false;
        result.errors.push({
          code: PreflightErrorCodes.DUPLICATE_EXACT,
          message: `Exact duplicate found: memory #${dupResult.existingId}`,
          existingId: dupResult.existingId ?? undefined,
          existing_path: dupResult.existing_path ?? undefined,
          suggestion: 'Use force=true to re-index, or delete the existing memory first',
        });
      }
      // Similar duplicates are warnings (PE-gating handles them)
      else if (dupResult.duplicate_type === 'similar') {
        result.warnings.push({
          code: PreflightErrorCodes.DUPLICATE_SIMILAR,
          message: `Similar memory found: #${dupResult.existingId} (${Math.round((dupResult.similarity ?? 0) * 100)}% similar)`,
          existingId: dupResult.existingId ?? undefined,
          similarity: dupResult.similarity ?? undefined,
          suggestion: 'Memory may be reinforced or updated instead of created (PE-gating)',
        });
      }
    }
  }

  // In dry-run mode, never actually block - just report
  if (dry_run) {
    result.pass = true;
    result.dry_run_would_pass = result.errors.length === 0;
  }

  return result;
}
