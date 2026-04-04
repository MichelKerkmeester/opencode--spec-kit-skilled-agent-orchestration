import type { FileEntry, FileProgressEntry, Observation, RecentContextEntry, SpecFileEntry, ToolCounts, UserPrompt } from '../types/session-types';
export type { FileEntry, FileProgressEntry, Observation, RecentContextEntry, SpecFileEntry, ToolCounts, UserPrompt, };
/** High-level characteristics inferred from the session. */
export interface SessionCharacteristics {
    contextType: string;
    importanceTier: string;
    decisionCount: number;
    toolCounts: ToolCounts;
}
/** Snapshot of the project state captured for session output. */
export interface ProjectStateSnapshot {
    projectPhase: string;
    activeFile: string;
    lastAction: string;
    nextAction: string;
    blockers: string;
    fileProgress: FileProgressEntry[];
}
/** Related documentation entry referenced by the session. */
export interface RelatedDoc {
    FILE_NAME: string;
    FILE_PATH: string;
    DESCRIPTION: string;
}
/** Input parameters required to build a project state snapshot. */
export interface ProjectStateParams {
    toolCounts: ToolCounts;
    observations: Observation[];
    messageCount: number;
    FILES: FileEntry[];
    SPEC_FILES: SpecFileEntry[];
    specFolderPath: string | null;
    recentContext?: RecentContextEntry[];
    explicitProjectPhase?: string | null;
}
/**
 * Generate a unique session identifier using CSPRNG.
 * @returns Session ID in the format `session-{timestamp}-{12-char-hex}` with 48 bits of entropy.
 */
declare function generateSessionId(): string;
/**
 * Detect the current git branch to use as the session channel.
 * @returns Branch name, a `detached:{short-sha}` string, or `'default'` on failure.
 */
declare function getChannel(): string;
/**
 * Classify the session context type based on tool usage ratios and decision count.
 * @param toolCounts - Aggregated counts of each tool type used in the session.
 * @param decisionCount - Number of decision observations recorded.
 * @returns One of `'planning'`, `'research'`, `'implementation'`, or `'general'`.
 */
declare function detectContextType(toolCounts: ToolCounts, decisionCount: number): string;
/**
 * Determine the importance tier of a session based on modified file paths and context type.
 * @param filesModified - Array of file paths modified during the session.
 * @param contextType - The detected context type (e.g. `'decision'`).
 * @returns One of `'critical'`, `'important'`, or `'normal'`.
 */
declare function detectImportanceTier(filesModified: string[], contextType: string): string;
/**
 * Infer the current project phase from tool ratios and observation types.
 * @param toolCounts - Aggregated counts of each tool type used in the session.
 * @param observations - Session observations containing type and fact data.
 * @param messageCount - Total number of messages in the conversation.
 * @returns One of `'RESEARCH'`, `'PLANNING'`, `'IMPLEMENTATION'`, `'DEBUGGING'`, or `'REVIEW'`.
 */
declare function detectProjectPhase(toolCounts: ToolCounts, observations: Observation[], messageCount: number): string;
/**
 * Resolve the project phase, honouring an explicit caller-provided override when valid.
 * Follows the same explicit-override pattern as `resolveImportanceTier`.
 * @param toolCounts - Aggregated counts of each tool type used in the session.
 * @param observations - Session observations containing type and fact data.
 * @param messageCount - Total number of messages in the conversation.
 * @param explicitProjectPhase - Optional caller-provided phase override from structured input.
 * @returns One of `'RESEARCH'`, `'PLANNING'`, `'IMPLEMENTATION'`, `'DEBUGGING'`, or `'REVIEW'`.
 */
export declare function resolveProjectPhase(toolCounts: ToolCounts, observations: Observation[], messageCount: number, explicitProjectPhase?: string | null): string;
/**
 * Identify the most recently active file from observations, preferring non-synthetic entries.
 * @param observations - Session observations that may reference files.
 * @param files - Fallback file entries if no observation references a file.
 * @returns The file path of the most recently active file, or `'N/A'`.
 */
declare function extractActiveFile(observations: Observation[], files: FileEntry[] | undefined): string;
/**
 * Extract the next planned action from observation facts or recent context learning entries.
 * @param observations - Session observations containing fact strings to search.
 * @param recentContext - Optional recent context entries with learning text.
 * @returns The next action string, or `'Continue implementation'` as default.
 */
declare function extractNextAction(observations: Observation[], recentContext?: RecentContextEntry[]): string;
/**
 * Scan observation narratives for blocker keywords and return the first valid blocker sentence.
 * @param observations - Session observations whose narratives are searched for blockers.
 * @returns A trimmed blocker sentence (max 100 chars), or `'None'` if no blockers found.
 */
declare function extractBlockers(observations: Observation[]): string;
/**
 * Build a file progress list from spec files, marking each as `'EXISTS'`.
 * @param specFiles - Optional array of spec file entries to convert.
 * @returns Array of file progress entries, or empty array if no spec files provided.
 */
declare function buildFileProgress(specFiles: SpecFileEntry[] | undefined): FileProgressEntry[];
/**
 * Count tool invocations by type from observation facts.
 * @param observations - Session observations containing tool-usage facts.
 * @param userPrompts - User prompts (reserved for future use; not counted to avoid false positives).
 * @returns An object mapping each known tool name to its invocation count.
 */
declare function countToolsByType(observations: Observation[], userPrompts: UserPrompt[]): ToolCounts;
/**
 * Calculate the elapsed duration between the first and last user prompts.
 * @param userPrompts - Array of user prompts with optional timestamp strings.
 * @param now - Current date used as fallback when timestamps are missing or invalid.
 * @returns Human-readable duration string (e.g. `'2h 15m'` or `'45m'`), or `'N/A'` if empty.
 */
declare function calculateSessionDuration(userPrompts: UserPrompt[], now: Date): string;
/**
 * Compute the expiry epoch (in seconds) for a memory entry based on its importance tier.
 * @param importanceTier - The importance tier (e.g. `'critical'`, `'temporary'`, `'normal'`).
 * @param createdAtEpoch - Creation timestamp as a Unix epoch in seconds.
 * @returns Expiry epoch in seconds, or `0` for non-expiring tiers.
 */
declare function calculateExpiryEpoch(importanceTier: string, createdAtEpoch: number): number;
/**
 * Discover related documentation files in the spec folder and its parent.
 * @param specFolderPath - Absolute path to the spec folder to scan.
 * @returns Array of related doc entries with name, relative path, and description.
 */
declare function detectRelatedDocs(specFolderPath: string): Promise<RelatedDoc[]>;
interface DecisionForTopics {
    TITLE?: string;
    RATIONALE?: string;
    CHOSEN?: string;
}
/**
 * Extract up to 10 key topic terms from a session summary and decision records using semantic signal extraction.
 *
 * NOTE: Similar to core/topic-extractor.ts:extractKeyTopics but differs in:
 * - Accepts `string | undefined` (topic-extractor requires `string`)
 * - Broader placeholder detection (checks SIMULATION MODE, [response], placeholder, <20 chars)
 * - Processes TITLE, RATIONALE, and CHOSEN from decisions (topic-extractor only uses TITLE/RATIONALE)
 * - Both delegate to SemanticSignalExtractor with aggressive stopword profile
 *
 * @param summary - Optional session summary text; placeholders are filtered out.
 * @param decisions - Array of decision objects whose titles, rationales, and choices are weighted.
 * @returns Array of up to 10 extracted topic term strings.
 */
declare function extractKeyTopics(summary: string | undefined, decisions?: DecisionForTopics[]): string[];
declare function detectSessionCharacteristics(observations: Observation[], userPrompts: UserPrompt[], FILES: FileEntry[], explicitImportanceTier?: string | null, explicitContextType?: string | null): SessionCharacteristics;
/**
 * Assemble a complete project state snapshot from session parameters.
 * @param params - Composite input containing tool counts, observations, files, and recent context.
 * @returns Snapshot with project phase, active file, last/next actions, blockers, and file progress.
 */
declare function buildProjectStateSnapshot(params: ProjectStateParams): ProjectStateSnapshot;
export { generateSessionId, getChannel, detectContextType, detectImportanceTier, detectProjectPhase, extractActiveFile, extractNextAction, extractBlockers, buildFileProgress, countToolsByType, calculateSessionDuration, calculateExpiryEpoch, detectRelatedDocs, extractKeyTopics, detectSessionCharacteristics, buildProjectStateSnapshot, };
//# sourceMappingURL=session-extractor.d.ts.map