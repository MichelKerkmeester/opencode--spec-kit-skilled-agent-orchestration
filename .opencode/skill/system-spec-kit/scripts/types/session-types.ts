// ---------------------------------------------------------------
// MODULE: SessionTypes
// ---------------------------------------------------------------
// Canonical type definitions shared between simulation-factory and extractors.
// Eliminates parallel type hierarchies (TECH-DEBT P6-05).
// ---------------------------------------------------------------

import type { FileChange, ObservationDetailed } from '../extractors/file-extractor';
import type { ToolCounts, SpecFileEntry } from '../extractors/session-extractor';

// ---------------------------------------------------------------
// 1. DECISION TYPES
// ---------------------------------------------------------------

/** Option within a decision — canonical type */
export interface DecisionOption {
  OPTION_NUMBER: number;
  LABEL: string;
  DESCRIPTION: string;
  HAS_PROS_CONS: boolean;
  PROS: Array<{ PRO: string }>;
  CONS: Array<{ CON: string }>;
  [key: string]: unknown;
}

/** A single decision record — canonical type */
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
  [key: string]: unknown;
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

// ---------------------------------------------------------------
// 2. PHASE / CONVERSATION TYPES
// ---------------------------------------------------------------

/** Phase entry — canonical type (used by diagram + conversation extractors) */
export interface PhaseEntry {
  PHASE_NAME: string;
  DURATION: string;
  ACTIVITIES?: string[];
  [key: string]: unknown;
}

/** Tool call entry in a message — canonical type */
export interface ToolCallEntry {
  TOOL_NAME: string;
  DESCRIPTION: string;
  HAS_RESULT: boolean;
  RESULT_PREVIEW: string;
  HAS_MORE: boolean;
  [key: string]: unknown;
}

/** Message entry in conversation data — canonical type */
export interface ConversationMessage {
  TIMESTAMP: string;
  ROLE: 'User' | 'Assistant';
  CONTENT: string;
  TOOL_CALLS: ToolCallEntry[];
}

/** Conversation phase — canonical type */
export interface ConversationPhase {
  PHASE_NAME: string;
  DURATION: string;
  [key: string]: unknown;
}

/** Conversation data structure — canonical type */
export interface ConversationData {
  MESSAGES: ConversationMessage[];
  MESSAGE_COUNT: number;
  DURATION: string;
  FLOW_PATTERN: string;
  PHASE_COUNT: number;
  PHASES: ConversationPhase[];
  AUTO_GENERATED_FLOW: string;
  TOOL_COUNT: number;
  DATE: string;
}

// ---------------------------------------------------------------
// 3. DIAGRAM TYPES
// ---------------------------------------------------------------

/** Diagram output entry — canonical type */
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
  [key: string]: unknown;
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

// ---------------------------------------------------------------
// 4. SESSION TYPES
// ---------------------------------------------------------------

/** Outcome entry — canonical type */
export interface OutcomeEntry {
  OUTCOME: string;
  TYPE?: string;
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
  OUTCOMES: OutcomeEntry[];
  TOOL_COUNT: number;
  MESSAGE_COUNT: number;
  QUICK_SUMMARY: string;
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
  FILE_PROGRESS: Array<{ FILE_NAME: string; FILE_STATUS: string }>;
  HAS_FILE_PROGRESS: boolean;
  [key: string]: unknown;
}
