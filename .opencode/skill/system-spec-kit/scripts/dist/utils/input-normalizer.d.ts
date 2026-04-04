import type { Observation, RecentContextEntry } from '../types/session-types';
/** Data source type indicating where loaded data came from */
export type DataSource = 'file' | 'opencode-capture' | 'claude-code-capture' | 'codex-cli-capture' | 'copilot-cli-capture' | 'gemini-cli-capture' | 'simulation';
export type CaptureDataSource = Exclude<DataSource, 'file' | 'simulation'>;
export type { Observation };
/** Observation with required fields as produced by the normalizer pipeline */
export type NormalizedObservation = Observation & {
    type: string;
    title: string;
    narrative: string;
    facts: string[];
};
/** A user prompt record with required timestamp (stricter than session-types UserPrompt) */
export interface NormalizedUserPrompt {
    prompt: string;
    timestamp: string;
}
export type RecentContext = Required<Pick<RecentContextEntry, 'request' | 'learning'>>;
/** A file entry in the FILES array (normalizer-specific shape, not session-types FileEntry) */
export interface NormalizedFileEntry {
    FILE_PATH: string;
    DESCRIPTION: string;
    ACTION?: string;
    MODIFICATION_MAGNITUDE?: 'trivial' | 'small' | 'medium' | 'large' | 'unknown';
    action?: string;
    _provenance?: 'git' | 'spec-folder' | 'tool';
    _synthetic?: boolean;
}
/** Compat alias for NormalizedUserPrompt. */
export type UserPrompt = NormalizedUserPrompt;
/** Compat alias for NormalizedFileEntry. */
export type FileEntry = NormalizedFileEntry;
/** Raw input data that may be in manual or MCP-compatible format */
export interface RawInputData {
    specFolder?: string;
    spec_folder?: string;
    SPEC_FOLDER?: string;
    filesModified?: string[];
    files_modified?: string[];
    filesChanged?: string[];
    files_changed?: string[];
    sessionSummary?: string;
    session_summary?: string;
    keyDecisions?: Array<string | DecisionItemObject>;
    key_decisions?: Array<string | DecisionItemObject>;
    nextSteps?: string[];
    next_steps?: string[];
    technicalContext?: Record<string, unknown>;
    triggerPhrases?: string[];
    trigger_phrases?: string[];
    importanceTier?: string;
    importance_tier?: string;
    contextType?: string;
    context_type?: string;
    projectPhase?: string;
    project_phase?: string;
    FILES?: Array<NormalizedFileEntry | Record<string, unknown>>;
    observations?: Observation[];
    userPrompts?: NormalizedUserPrompt[];
    user_prompts?: NormalizedUserPrompt[];
    recentContext?: RecentContext[];
    recent_context?: RecentContext[];
    [key: string]: unknown;
}
/** Decision item when provided as an object */
export interface DecisionItemObject {
    decision?: string;
    title?: string;
    chosenOption?: string;
    chosen?: string;
    rationale?: string;
    reason?: string;
    alternatives?: Array<string | Record<string, unknown>>;
}
/** Normalized data in MCP-compatible format */
export interface NormalizedData {
    SPEC_FOLDER?: string;
    FILES?: NormalizedFileEntry[];
    observations: Observation[];
    userPrompts: NormalizedUserPrompt[];
    recentContext: RecentContext[];
    _manualTriggerPhrases?: string[];
    _manualDecisions?: Array<string | DecisionItemObject>;
    TECHNICAL_CONTEXT?: Array<{
        KEY: string;
        VALUE: string;
    }>;
    importanceTier?: string;
    contextType?: string;
    projectPhase?: string;
    [key: string]: unknown;
}
/** An exchange in an OpenCode capture */
export interface CaptureExchange {
    userInput?: string;
    assistantResponse?: string;
    timestamp?: number | string;
}
/** A tool call in an OpenCode capture */
export interface CaptureToolCall {
    tool: string;
    title?: string;
    status?: 'pending' | 'completed' | 'error' | 'snapshot' | 'unknown';
    timestamp?: number | string;
    output?: string;
    input?: {
        filePath?: string;
        file_path?: string;
        path?: string;
        [key: string]: unknown;
    };
}
/** OpenCode session capture structure */
export interface OpencodeCapture {
    exchanges: CaptureExchange[];
    toolCalls?: CaptureToolCall[];
    metadata?: Record<string, unknown>;
    sessionTitle?: string;
    sessionId?: string;
    capturedAt?: string;
}
/** Transformed OpenCode capture result */
export interface TransformedCapture {
    userPrompts: NormalizedUserPrompt[];
    observations: Observation[];
    recentContext: RecentContext[];
    FILES: NormalizedFileEntry[];
    _source: DataSource;
    _sessionId?: string;
    _capturedAt?: string;
    _toolCallCount?: number;
    _sourceTranscriptPath?: string;
    _sourceSessionId?: string;
    _sourceSessionCreated?: number;
    _sourceSessionUpdated?: number;
    _relevanceFallback?: boolean;
}
/**
 * Transforms a key decision item (string or object) into a structured decision observation.
 * @param decisionItem - The decision as a plain string, a DecisionItemObject, or null.
 * @returns An Observation of type 'decision' with extracted facts and confidence, or null if the input is invalid.
 */
declare function transformKeyDecision(decisionItem: string | DecisionItemObject | null): Observation | null;
/**
 * Builds a feature observation from a session summary string and optional trigger phrases.
 * @param summary - The session summary text to use as title and narrative.
 * @param triggerPhrases - Optional array of trigger phrases stored as observation facts.
 * @returns An Observation of type 'feature' representing the session summary.
 */
declare function buildSessionSummaryObservation(summary: string, triggerPhrases?: string[]): Observation;
/**
 * Builds an implementation observation from a technical context key-value map.
 * @param techContext - A record of technical details (e.g., stack, config, dependencies).
 * @returns An Observation of type 'implementation' with a semicolon-delimited narrative of the context entries.
 */
declare function buildTechnicalContextObservation(techContext: Record<string, unknown>): Observation;
/**
 * Normalizes raw input data from manual or mixed formats into the MCP-compatible NormalizedData structure.
 * @param data - The raw input data with camelCase or snake_case fields.
 * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.
 */
declare function normalizeInputData(data: RawInputData): NormalizedData | RawInputData;
declare function validateInputData(data: RawInputData, specFolderArg?: string | null): void;
/**
 * Transforms a raw OpenCode session capture into a structured TransformedCapture with observations, prompts, and file entries.
 * @param capture - The raw OpenCode capture containing exchanges, tool calls, and metadata.
 * @param specFolderHint - Optional spec folder path used to filter content by spec-folder relevance.
 * @param source - The data source identifier, defaults to 'opencode-capture'.
 * @returns A TransformedCapture with userPrompts, observations, recentContext, FILES, and source metadata.
 */
declare function transformOpencodeCapture(capture: OpencodeCapture, specFolderHint?: string | null, source?: CaptureDataSource): TransformedCapture;
export { transformKeyDecision, buildSessionSummaryObservation, buildTechnicalContextObservation, normalizeInputData, validateInputData, transformOpencodeCapture, transformOpencodeCapture as transformOpenCodeCapture, };
//# sourceMappingURL=input-normalizer.d.ts.map