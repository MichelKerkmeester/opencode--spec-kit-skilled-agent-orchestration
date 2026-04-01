// ---------------------------------------------------------------
// MODULE: Session Types
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SESSION TYPES
// ───────────────────────────────────────────────────────────────
// Canonical type definitions shared between simulation-factory and extractors.
// Eliminates parallel type hierarchies (TECH-DEBT P6-05).

export type DescriptionProvenance = 'git' | 'spec-folder' | 'tool';

export type ModificationMagnitude = 'trivial' | 'small' | 'medium' | 'large' | 'unknown';

/** Captures a file change discovered in session data. */
export interface FileChange {
  FILE_PATH: string;
  DESCRIPTION: string;
  ACTION?: string;
  MODIFICATION_MAGNITUDE?: ModificationMagnitude;
  _provenance?: DescriptionProvenance;
  _synthetic?: boolean;
}

/** File entry accepted from normalized collected data. */
export interface CollectedFileEntry {
  FILE_PATH?: string;
  FILE_NAME?: string;
  DESCRIPTION?: string;
  ACTION?: string;
  MODIFICATION_MAGNITUDE?: ModificationMagnitude;
  path?: string;
  description?: string;
  action?: string;
  _provenance?: DescriptionProvenance;
  _synthetic?: boolean;
}

/** Manual decision enrichment captured on an observation. */
export interface ManualDecisionInfo {
  fullText?: string;
  chosenApproach?: string;
  confidence?: number;
}

/** Fact item captured on an observation.
 * The object variant uses an index signature because facts originate from
 * JSON-parsed session data whose shape is not fully controlled at compile time.
 */
export type FactValue =
  | string
  | {
    text?: string;
    files?: string[];
    /** @warn Index signature retained: facts may carry arbitrary JSON keys from external data. */
    [key: string]: unknown;
  };

/** Observation item consumed by the extractor pipeline. */
export interface Observation {
  type?: string;
  title?: string;
  narrative?: string;
  facts?: FactValue[];
  files?: string[];
  timestamp?: string;
  _manualDecision?: ManualDecisionInfo;
  _provenance?: DescriptionProvenance;
  _synthetic?: boolean;
}

/** Raw user prompt metadata consumed by the session pipeline. */
export interface UserPrompt {
  prompt: string;
  timestamp?: string;
}

/** Recent context entry used for session summarization. */
export interface RecentContextEntry {
  learning?: string;
  request?: string;
  continuationCount?: number;
  files?: string[];
}

/** Preflight learning metrics captured before task execution. */
export interface PreflightData {
  knowledgeScore?: number;
  uncertaintyScore?: number;
  contextScore?: number;
  timestamp?: string;
  gaps?: string[];
  confidence?: number;
  uncertaintyRaw?: number;
  readiness?: string;
}

/** Postflight learning metrics captured after task execution. */
export interface PostflightData {
  knowledgeScore?: number;
  uncertaintyScore?: number;
  contextScore?: number;
  gapsClosed?: string[];
  newGaps?: string[];
}

/** Summary of a tool call made during the session (JSON-mode enrichment). */
export interface ToolCallSummary {
  tool: string;
  inputSummary?: string;
  outputSummary?: string;
  status?: 'success' | 'error' | 'timeout';
  durationEstimate?: string;
}

/** Summary of a user-assistant exchange during the session (JSON-mode enrichment). */
export interface ExchangeSummary {
  userInput: string;
  assistantResponse: string;
  timestamp?: string;
}

/** Shared collected-data contract reused by extractor entrypoints.
 * Index signature removed: workflow.ts read helpers now accept `object` and cast internally.
 * SimCollectedData (simulation-factory.ts) extends Partial<CollectedDataBase> directly. */
export interface CollectedDataBase {
  recentContext?: RecentContextEntry[];
  observations?: Observation[];
  userPrompts?: UserPrompt[];
  SPEC_FOLDER?: string;
  FILES?: CollectedFileEntry[];
  SUMMARY?: string;
  importanceTier?: string;
  filesModified?: Array<{ path: string; changes_summary?: string }>;
  /** Alias for filesModified — accepted in JSON payloads, mapped during normalization */
  filesChanged?: string[];
  _manualDecisions?: Array<string | Record<string, unknown>>;
  _manualTriggerPhrases?: string[];
  _isSimulation?: boolean;
  preflight?: PreflightData;
  postflight?: PostflightData;
  /** JSON-mode tool call summaries (AI-composed, richer than DB extraction) */
  toolCalls?: ToolCallSummary[];
  /** JSON-mode exchange summaries (AI-composed conversation highlights) */
  exchanges?: ExchangeSummary[];
  // Explicitly declared fields previously accessed via index signature (O3-6)
  sessionSummary?: string;
  keyDecisions?: Array<Record<string, unknown>>;
  nextSteps?: Array<Record<string, unknown>>;
  _source?: string;
  _sourceTranscriptPath?: string;
  _sourceSessionId?: string;
  _sessionId?: string;
  _sourceSessionCreated?: number;
  _sourceSessionUpdated?: number;
  headRef?: string | null;
  commitRef?: string | null;
  repositoryState?: string | null;
  isDetachedHead?: boolean | null;
  TECHNICAL_CONTEXT?: Array<{ KEY: string; VALUE: string }>;
  // Fields surfaced during O3-6 index signature removal (captured-session enrichment + capture pipeline)
  /** Snake-case variant for raw JSON compatibility. Prefer importanceTier (camelCase) in new code. */
  importance_tier?: string;
  _toolCallCount?: number;
  _narrativeObservations?: Observation[];
  _specContextLoaded?: boolean;
  _gitContextLoaded?: boolean;
  _relevanceFallback?: boolean;
  _capturedAt?: string;
  // Fields accessed by workflow.ts read helpers for memory classification, dedup, and causal links
  // (AI-composed JSON data from generate-context.js input)
  /** Snake-case variant for raw JSON compatibility. Prefer memoryClassification (camelCase) in new code. */
  memory_classification?: Record<string, unknown>;
  memoryClassification?: Record<string, unknown>;
  /** Snake-case variant for raw JSON compatibility. Prefer memoryType (camelCase) in new code. */
  memory_type?: string;
  memoryType?: string;
  /** Snake-case variant for raw JSON compatibility. Prefer sessionDedup (camelCase) in new code. */
  session_dedup?: Record<string, unknown>;
  sessionDedup?: Record<string, unknown>;
  /** Snake-case variant for raw JSON compatibility. Prefer causalLinks (camelCase) in new code. */
  causal_links?: Record<string, unknown>;
  causalLinks?: Record<string, unknown>;
  // RC5: Explicit contextType from JSON payload (mirrors importanceTier pattern)
  contextType?: string;
  /** Snake-case variant for raw JSON compatibility. Prefer contextType (camelCase) in new code. */
  context_type?: string;
  // Phase 002 T029: Explicit projectPhase from JSON payload (mirrors contextType pattern)
  projectPhase?: string;
  /** Snake-case variant for raw JSON compatibility. Prefer projectPhase (camelCase) in new code. */
  project_phase?: string;
}

/** Reusable collected-data subset helper derived from the canonical base contract. */
export type CollectedDataSubset<Keys extends keyof CollectedDataBase> = Pick<CollectedDataBase, Keys>;

/** Normalized observation details enriched with anchors and metadata. */
export interface ObservationDetailed {
  TYPE: string;
  TITLE: string;
  NARRATIVE: string;
  HAS_FILES: boolean;
  FILES_LIST: string;
  HAS_FACTS: boolean;
  FACTS_LIST: string;
  ANCHOR_ID: string;
  IS_DECISION: boolean;
}

/** Counts tool usage by category within a session.
 * @warn Index signature retained: tool names are iterated as string variables
 * in `countToolsByType()` (session-extractor.ts) via `counts[tool]++`.
 */
export interface ToolCounts {
  Read: number;
  Edit: number;
  Write: number;
  Bash: number;
  Grep: number;
  Glob: number;
  Task: number;
  WebFetch: number;
  WebSearch: number;
  Skill: number;
  [key: string]: number;
}

/** File entry metadata consumed by session state helpers. */
export interface FileEntry {
  FILE_PATH: string;
  FILE_NAME?: string;
  DESCRIPTION?: string;
}

/** Spec file entry metadata consumed by the session pipeline. */
export interface SpecFileEntry {
  FILE_NAME: string;
  FILE_PATH?: string;
  DESCRIPTION?: string;
}

/** Progress summary for an individual tracked file. */
export interface FileProgressEntry {
  FILE_NAME: string;
  FILE_STATUS: string;
}

/** Describes an identified gap between preflight and postflight state. */
export interface GapDescription {
  GAP_DESCRIPTION: string;
}

/** Represents a pending task extracted from session context. */
export interface PendingTask {
  TASK_ID: string;
  TASK_DESCRIPTION: string;
  TASK_PRIORITY: string;
}

/** Represents a context item included in continue-session payloads. */
export interface ContextItem {
  CONTEXT_ITEM: string;
}

/** Describes a concrete implementation step for the guide output. */
export interface ImplementationStep {
  FEATURE_NAME: string;
  DESCRIPTION: string;
}

/** Associates an important file with its role in the implementation. */
export interface KeyFileWithRole {
  FILE_PATH: string;
  ROLE: string;
}

/** Describes how the implementation can be extended safely. */
export interface ExtensionGuide {
  GUIDE_TEXT: string;
}

/** Summarizes a reusable code pattern identified in the implementation. */
export interface CodePattern {
  PATTERN_NAME: string;
  USAGE: string;
}

// ───────────────────────────────────────────────────────────────
// 1b. QUALITY TYPES (shared between core/ and extractors/)
// ───────────────────────────────────────────────────────────────

export type QualityFlag =
  | 'has_contamination'
  | 'has_insufficient_context'
  | 'missing_trigger_phrases'
  | 'missing_key_topics'
  | 'missing_file_context'
  | 'generic_title'
  | 'short_content'
  | 'leaked_html'
  | 'duplicate_observations'
  | 'has_placeholders'
  | 'has_fallback_decision'
  | 'sparse_semantic_fields'
  | 'has_tool_state_mismatch'
  | 'has_session_source_mismatch'
  | 'has_spec_relevance_mismatch'
  | 'has_contaminated_title'
  | 'has_error_content'
  | 'insufficient_capture'
  | 'has_malformed_spec_folder'
  | 'has_topical_mismatch';

export interface QualityDimensionScore {
  id: string;
  score01: number;
  score100: number;
  maxScore100: number;
  passed?: boolean;
}

export interface QualityInsufficiencySummary {
  pass: boolean;
  score01: number | null;
  reasons: string[];
}

/** Represents quality score. */
export interface QualityScoreResult {
  /** Legacy alias. Prefer score100. */
  score: number;
  score01: number;
  score100: number;
  /** Legacy alias. Prefer score01. */
  qualityScore: number;
  warnings: string[];
  qualityFlags: QualityFlag[];
  hadContamination: boolean;
  dimensions: QualityDimensionScore[];
  breakdown?: {
    triggerPhrases: number;
    keyTopics: number;
    fileDescriptions: number;
    contentLength: number;
    noLeakedTags: number;
    observationDedup: number;
  };
  insufficiency: QualityInsufficiencySummary | null;
}

// ───────────────────────────────────────────────────────────────
// 2. DECISION TYPES
// ───────────────────────────────────────────────────────────────
/** Option within a decision — canonical type.
 * Index signature removed: validateDataStructure() now accepts generic T extends Record. */
export interface DecisionOption {
  OPTION_NUMBER: number;
  LABEL: string;
  DESCRIPTION: string;
  HAS_PROS_CONS: boolean;
  PROS: Array<{ PRO: string }>;
  CONS: Array<{ CON: string }>;
}

/** A single decision record — canonical type.
 * Index signature removed: validateDataStructure() now accepts generic T extends Record. */
export interface DecisionRecord {
  INDEX: number;
  TITLE: string;
  CONTEXT: string;
  TIMESTAMP: string;
  OPTIONS: DecisionOption[];
  CHOSEN: string;
  RATIONALE: string;
  HAS_PROS: boolean;
  PROS: Array<{ PRO: string }>;
  HAS_CONS: boolean;
  CONS: Array<{ CON: string }>;
  CHOICE_CONFIDENCE: number;
  RATIONALE_CONFIDENCE: number;
  CONFIDENCE: number;
  HAS_EVIDENCE: boolean;
  EVIDENCE: Array<{ EVIDENCE_ITEM: string }>;
  HAS_CAVEATS: boolean;
  CAVEATS: Array<{ CAVEAT_ITEM: string }>;
  HAS_FOLLOWUP: boolean;
  FOLLOWUP: Array<{ FOLLOWUP_ITEM: string }>;
  DECISION_TREE: string;
  HAS_DECISION_TREE: boolean;
  DECISION_ANCHOR_ID: string;
  DECISION_IMPORTANCE: string;
}

/** Decision data structure — canonical type */
export interface DecisionData {
  DECISIONS: DecisionRecord[];
  DECISION_COUNT: number;
  HIGH_CONFIDENCE_COUNT: number;
  MEDIUM_CONFIDENCE_COUNT: number;
  LOW_CONFIDENCE_COUNT: number;
  FOLLOWUP_COUNT: number;
}

// ───────────────────────────────────────────────────────────────
// 3. PHASE / CONVERSATION TYPES
// ───────────────────────────────────────────────────────────────
/** Phase entry — canonical type (used by diagram + conversation extractors). */
export interface PhaseEntry {
  PHASE_NAME: string;
  DURATION: string;
  ACTIVITIES: string[];
}

/** Tool call entry in a message — canonical type.
 * message-utils.ts ToolCall is now a type alias for ToolCallEntry.
 * Index signature removed: all construction sites (conversation-extractor.ts) produce only declared fields. */
export interface ToolCallEntry {
  TOOL_NAME: string;
  DESCRIPTION: string;
  HAS_RESULT: boolean;
  RESULT_PREVIEW: string;
  HAS_MORE: boolean;
}

/** Message entry in conversation data — canonical type */
export interface ConversationMessage {
  TIMESTAMP: string;
  ROLE: 'User' | 'Assistant';
  CONTENT: string;
  TOOL_CALLS: ToolCallEntry[];
}

export type ConversationPhaseLabel =
  | 'Research'
  | 'Planning'
  | 'Implementation'
  | 'Debugging'
  | 'Verification'
  | 'Discussion';

export interface PhaseScoreMap {
  Research: number;
  Planning: number;
  Implementation: number;
  Debugging: number;
  Verification: number;
  Discussion: number;
}

export interface TopicCluster {
  id: string;
  label: string;
  messageIndexes: number[];
  observationIndexes: number[];
  dominantTerms: string[];
  phaseScores: PhaseScoreMap;
  primaryPhase: ConversationPhaseLabel;
  confidence: number;
}

/** Conversation phase — canonical type. */
export interface ConversationPhase {
  PHASE_NAME: string;
  DURATION: string;
  CLUSTER_ID?: string;
  CONFIDENCE?: number;
  START_MESSAGE_INDEX?: number;
  END_MESSAGE_INDEX?: number;
  DOMINANT_TERMS?: string[];
}

/** Conversation data structure — canonical type */
export interface ConversationData {
  MESSAGES: ConversationMessage[];
  MESSAGE_COUNT: number;
  DURATION: string;
  FLOW_PATTERN: string;
  PHASE_COUNT: number;
  UNIQUE_PHASE_COUNT: number;
  PHASES: ConversationPhase[];
  TOPIC_CLUSTERS: TopicCluster[];
  AUTO_GENERATED_FLOW: string;
  TOOL_COUNT: number;
  DATE: string;
}

// ───────────────────────────────────────────────────────────────
// 4. DIAGRAM TYPES
// ───────────────────────────────────────────────────────────────
/** Diagram output entry — canonical type.
 * Index signature removed: validateDataStructure() now accepts generic T extends Record. */
export interface DiagramOutput {
  TITLE: string;
  TIMESTAMP: string;
  DIAGRAM_TYPE: string;
  PATTERN_NAME: string;
  COMPLEXITY: string;
  HAS_DESCRIPTION: boolean;
  DESCRIPTION: string;
  ASCII_ART: string;
  HAS_NOTES: boolean;
  NOTES: unknown[];
  HAS_RELATED_FILES: boolean;
  RELATED_FILES: Array<{ FILE_PATH: string }>;
}

/** Auto-generated decision tree — canonical type */
export interface AutoDecisionTree {
  INDEX: number;
  DECISION_TITLE: string;
  DECISION_TREE: string;
}

/** Diagram type count — canonical type */
export interface DiagramTypeCount {
  TYPE: string;
  COUNT: number;
}

/** Pattern summary entry — canonical type */
export interface PatternSummaryEntry {
  PATTERN_NAME: string;
  COUNT: number;
}

/** Diagram data structure — canonical type */
export interface DiagramData {
  DIAGRAMS: DiagramOutput[];
  DIAGRAM_COUNT: number;
  HAS_AUTO_GENERATED: boolean;
  FLOW_TYPE: string;
  AUTO_CONVERSATION_FLOWCHART: string;
  AUTO_DECISION_TREES: AutoDecisionTree[];
  AUTO_FLOW_COUNT: number;
  AUTO_DECISION_COUNT: number;
  DIAGRAM_TYPES: DiagramTypeCount[];
  PATTERN_SUMMARY: PatternSummaryEntry[];
}

// ───────────────────────────────────────────────────────────────
// 5. SESSION TYPES
// ───────────────────────────────────────────────────────────────
/** Outcome entry — canonical type */
export interface OutcomeEntry {
  OUTCOME: string;
  TYPE: string;
}

/** Session data structure — canonical type */
export interface SessionData {
  TITLE: string;
  DATE: string;
  TIME: string;
  SPEC_FOLDER: string;
  DURATION: string;
  SUMMARY: string;
  FILES: FileChange[];
  HAS_FILES: boolean;
  FILE_COUNT: number;
  CAPTURED_FILE_COUNT: number;
  FILESYSTEM_FILE_COUNT: number;
  GIT_CHANGED_FILE_COUNT: number;
  OUTCOMES: OutcomeEntry[];
  TOOL_COUNT: number;
  MESSAGE_COUNT: number;
  QUICK_SUMMARY: string;
  /** RC1: Raw sessionSummary from JSON payload, used as preferred title candidate */
  _JSON_SESSION_SUMMARY?: string | null;
  SKILL_VERSION: string;
  OBSERVATIONS: ObservationDetailed[];
  HAS_OBSERVATIONS: boolean;
  SPEC_FILES: SpecFileEntry[];
  HAS_SPEC_FILES: boolean;
  SESSION_ID: string;
  CHANNEL: string;
  IMPORTANCE_TIER: string;
  CONTEXT_TYPE: string;
  CREATED_AT_EPOCH: number;
  LAST_ACCESSED_EPOCH: number;
  EXPIRES_AT_EPOCH: number;
  TOOL_COUNTS: ToolCounts;
  DECISION_COUNT: number;
  ACCESS_COUNT: number;
  LAST_SEARCH_QUERY: string;
  RELEVANCE_BOOST: number;
  PROJECT_PHASE: string;
  ACTIVE_FILE: string;
  LAST_ACTION: string;
  NEXT_ACTION: string;
  BLOCKERS: string;
  FILE_PROGRESS: FileProgressEntry[];
  HAS_FILE_PROGRESS: boolean;
  HAS_IMPLEMENTATION_GUIDE: boolean;
  TECHNICAL_CONTEXT: Array<{ KEY: string; VALUE: string }>;
  HAS_TECHNICAL_CONTEXT: boolean;
  TOPIC: string;
  IMPLEMENTATIONS: ImplementationStep[];
  IMPL_KEY_FILES: KeyFileWithRole[];
  EXTENSION_GUIDES: ExtensionGuide[];
  PATTERNS: CodePattern[];
  HAS_PREFLIGHT_BASELINE: boolean;
  PREFLIGHT_KNOW_SCORE: number | null;
  PREFLIGHT_CONTEXT_SCORE: number | null;
  PREFLIGHT_UNCERTAINTY_SCORE: number | null;
  PREFLIGHT_KNOW_ASSESSMENT: string;
  PREFLIGHT_UNCERTAINTY_ASSESSMENT: string;
  PREFLIGHT_CONTEXT_ASSESSMENT: string;
  PREFLIGHT_TIMESTAMP: string | null;
  PREFLIGHT_GAPS: GapDescription[];
  PREFLIGHT_CONFIDENCE: number | null;
  PREFLIGHT_UNCERTAINTY_RAW: number | null;
  PREFLIGHT_READINESS: string | null;
  HAS_POSTFLIGHT_DELTA: boolean;
  POSTFLIGHT_KNOW_SCORE: number | null;
  POSTFLIGHT_CONTEXT_SCORE: number | null;
  POSTFLIGHT_UNCERTAINTY_SCORE: number | null;
  DELTA_KNOW_SCORE: string | null;
  DELTA_CONTEXT_SCORE: string | null;
  DELTA_UNCERTAINTY_SCORE: string | null;
  DELTA_KNOW_TREND: string;
  DELTA_CONTEXT_TREND: string;
  DELTA_UNCERTAINTY_TREND: string;
  LEARNING_INDEX: number | null;
  LEARNING_SUMMARY: string;
  GAPS_CLOSED: GapDescription[];
  NEW_GAPS: GapDescription[];
  CONTINUATION_COUNT: number;
  NEXT_CONTINUATION_COUNT: number;
  LAST_ACTIVITY_TIMESTAMP: string;
  SESSION_DURATION: string;
  SESSION_STATUS: string;
  COMPLETION_PERCENT: number;
  PENDING_TASKS: PendingTask[];
  RESUME_CONTEXT: ContextItem[];
  CONTEXT_SUMMARY: string;
  SOURCE_TRANSCRIPT_PATH: string;
  SOURCE_SESSION_ID: string;
  SOURCE_SESSION_CREATED: number;
  SOURCE_SESSION_UPDATED: number;
  HEAD_REF: string | null;
  COMMIT_REF: string | null;
  REPOSITORY_STATE: string;
  IS_DETACHED_HEAD: boolean;
}
