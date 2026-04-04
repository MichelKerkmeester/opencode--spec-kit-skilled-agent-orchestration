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
/**
 * Defines the PreflightErrorCodes constant.
 */
export declare const PreflightErrorCodes: Readonly<PreflightErrorCodes>;
/**
 * Defines the PREFLIGHT_CONFIG constant.
 */
export declare const PREFLIGHT_CONFIG: PreflightConfig;
/**
 * Represents the PreflightError type.
 */
export declare class PreflightError extends Error {
    code: string;
    details: PreflightErrorDetails;
    recoverable: boolean;
    suggestion: string | null;
    constructor(code: string, message: string, details?: PreflightErrorDetails);
    toJSON(): Record<string, unknown>;
}
/**
 * Provides the validateAnchorFormat helper.
 */
export declare function validateAnchorFormat(content: string, options?: {
    strict?: boolean;
}): AnchorValidationResult;
/**
 * Provides the computeContentHash helper.
 */
export declare function computeContentHash(content: string): string;
/**
 * Provides the checkDuplicate helper.
 */
export declare function checkDuplicate(params: DuplicateCheckParams, options?: DuplicateCheckOptions): DuplicateCheckResult;
/**
 * Provides the estimateTokens helper.
 */
export declare function estimateTokens(content: string | unknown): number;
/**
 * Provides the checkTokenBudget helper.
 */
export declare function checkTokenBudget(content: string, options?: {
    maxTokens?: number;
    warning_threshold?: number;
    include_embedding_overhead?: boolean;
}): TokenBudgetResult;
/**
 * Provides the validateContentSize helper.
 */
export declare function validateContentSize(content: string, options?: {
    min_length?: number;
    maxLength?: number;
}): ContentSizeResult;
/**
 * Provides the runPreflight helper.
 */
export declare function runPreflight(params: PreflightParams, options?: PreflightOptions): PreflightResult;
export {};
//# sourceMappingURL=preflight.d.ts.map