// ---------------------------------------------------------------
// MODULE: Simulation Factory
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SIMULATION FACTORY
// ───────────────────────────────────────────────────────────────
import crypto from 'crypto';

// Canonical shared types — single source of truth (resolves TECH-DEBT P6-05)
import type {
  CollectedDataBase,
  DecisionOption,
  DecisionRecord,
  DecisionData,
  PhaseEntry,
  ToolCallEntry,
  ConversationMessage,
  ConversationData,
  DiagramOutput,
  DiagramData,
  SessionData,
  OutcomeEntry,
} from '../types/session-types';

// Re-export canonical types for backward compatibility
export type {
  DecisionOption,
  DecisionRecord,
  DecisionData,
  PhaseEntry,
  ToolCallEntry,
  ConversationMessage,
  ConversationData,
  DiagramOutput,
  DiagramData,
  SessionData,
  OutcomeEntry,
};

// 1. TYPES (local to simulation-factory only)
/** Timestamp format options */
export type SimTimestampFormat = 'iso' | 'readable' | 'date' | 'date-dutch' | 'time' | 'time-short' | 'filename';

/** Configuration for session data creation */
export interface SessionConfig {
  sessionId?: string;
  specFolder?: string;
  channel?: string;
  skillVersion?: string;
  userMessage?: string;
  assistantMessage?: string;
  title?: string;
  context?: string;
  description?: string;
  [key: string]: unknown;
}

/** Full simulation result */
export interface FullSimulation {
  session: SessionData;
  conversations: ConversationData;
  decisions: DecisionData;
  diagrams: DiagramData;
  phases: PhaseEntry[];
}

/** Collected data that might need simulation.
 * Extends CollectedDataBase (all fields optional via Partial) so the simulation
 * detector shares the same property types as the real pipeline. */
export interface SimCollectedData extends Partial<CollectedDataBase> {}

/** Simulation metadata */
export interface SimulationMetadata {
  isSimulated?: boolean;
  _simulationWarning?: string;
  [key: string]: unknown;
}

// ───────────────────────────────────────────────────────────────
// 2. UTILITIES
// ───────────────────────────────────────────────────────────────
function secureRandomString(length: number = 9): string {
  return crypto.randomBytes(Math.ceil(length * 0.75))
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, length);
}

// NOTE: Similar to utils/message-utils.ts:formatTimestamp but differs in:
// - Uses raw UTC (message-utils applies CONFIG.TIMEZONE_OFFSET_HOURS adjustment)
// - Silently falls back for invalid dates (message-utils logs console.warn)
// - Returns raw ISO for unknown format (message-utils logs console.warn)
// Intentionally kept separate: simulation data should use raw UTC without timezone offset.
function formatTimestamp(date: Date | string | number = new Date(), format: SimTimestampFormat = 'iso'): string {
  const d: Date = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    return formatTimestamp(new Date(), format);
  }

  const isoString: string = d.toISOString();
  const [datePart, timePart] = isoString.split('T');
  const timeWithoutMs: string = timePart.split('.')[0];

  switch (format) {
    case 'iso':
      return isoString.split('.')[0] + 'Z';
    case 'readable':
      return `${datePart} @ ${timeWithoutMs}`;
    case 'date':
      return datePart;
    case 'date-dutch': {
      const [year, month, day] = datePart.split('-');
      const shortYear: string = year.slice(-2);
      return `${day}-${month}-${shortYear}`;
    }
    case 'time':
      return timeWithoutMs;
    case 'time-short': {
      const [hours, minutes] = timeWithoutMs.split(':');
      return `${hours}-${minutes}`;
    }
    case 'filename':
      return `${datePart}_${timeWithoutMs.replace(/:/g, '-')}`;
    default:
      return isoString;
  }
}

// NOTE: Similar to extractors/session-extractor.ts:generateSessionId but differs in randomness source.
// Both this file and session-extractor use crypto.randomBytes (CSPRNG).
// Same output format: session-{timestamp}-{9-char-random}
function generateSessionId(): string {
  return `session-${Date.now()}-${secureRandomString(9)}`;
}

// ───────────────────────────────────────────────────────────────
// 3. SESSION DATA FACTORY
// ───────────────────────────────────────────────────────────────
function createSessionData(config: SessionConfig = {}): SessionData {
  const now: Date = new Date();
  const sessionId: string = config.sessionId || generateSessionId();
  const specFolder: string = config.specFolder || 'simulation';
  const channel: string = config.channel || 'default';
  const skillVersion: string = config.skillVersion || '11.2.0';
  const simulatedEpoch: number = Math.floor(Date.now() / 1000);

  const dateOnly: string = formatTimestamp(now, 'date-dutch');
  const timeOnly: string = formatTimestamp(now, 'time-short');
  const folderTitle: string = specFolder.replace(/^\d{3}-/, '').replace(/-/g, ' ');

  return {
    TITLE: folderTitle,
    DATE: dateOnly,
    TIME: timeOnly,
    SPEC_FOLDER: specFolder,
    DURATION: 'N/A (simulated)',
    SUMMARY: '\u26A0\uFE0F SIMULATION MODE - No real conversation data available. This is placeholder data for testing.',
    FILES: [
      { FILE_PATH: '\u26A0\uFE0F SIMULATION MODE', DESCRIPTION: 'No files were tracked - using fallback data' },
    ],
    HAS_FILES: true,
    FILE_COUNT: 1,
    CAPTURED_FILE_COUNT: 1,
    FILESYSTEM_FILE_COUNT: 1,
    GIT_CHANGED_FILE_COUNT: 0,
    OUTCOMES: [
      { OUTCOME: '\u26A0\uFE0F SIMULATION MODE - Real conversation data not available', TYPE: 'simulation' },
    ],
    TOOL_COUNT: 0,
    MESSAGE_COUNT: 0,
    QUICK_SUMMARY: '\u26A0\uFE0F SIMULATION MODE - Provide conversation data via JSON file for real output',
    SKILL_VERSION: skillVersion,
    SESSION_ID: sessionId,
    CHANNEL: channel,
    IMPORTANCE_TIER: 'normal',
    CONTEXT_TYPE: 'general',
    CREATED_AT_EPOCH: simulatedEpoch,
    LAST_ACCESSED_EPOCH: simulatedEpoch,
    EXPIRES_AT_EPOCH: simulatedEpoch + (90 * 24 * 60 * 60),
    TOOL_COUNTS: { Read: 0, Edit: 0, Write: 0, Bash: 0, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
    DECISION_COUNT: 0,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1.0,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    TECHNICAL_CONTEXT: [],
    HAS_TECHNICAL_CONTEXT: false,
    PROJECT_PHASE: 'simulation',
    ACTIVE_FILE: '',
    LAST_ACTION: '',
    NEXT_ACTION: '',
    BLOCKERS: 'None',
    FILE_PROGRESS: [],
    HAS_FILE_PROGRESS: false,
    HAS_IMPLEMENTATION_GUIDE: false,
    TOPIC: '',
    IMPLEMENTATIONS: [],
    IMPL_KEY_FILES: [],
    EXTENSION_GUIDES: [],
    PATTERNS: [],
    HAS_PREFLIGHT_BASELINE: false,
    PREFLIGHT_KNOW_SCORE: null,
    PREFLIGHT_CONTEXT_SCORE: null,
    PREFLIGHT_UNCERTAINTY_SCORE: null,
    PREFLIGHT_KNOW_ASSESSMENT: '',
    PREFLIGHT_UNCERTAINTY_ASSESSMENT: '',
    PREFLIGHT_CONTEXT_ASSESSMENT: '',
    PREFLIGHT_TIMESTAMP: null,
    PREFLIGHT_GAPS: [],
    PREFLIGHT_CONFIDENCE: null,
    PREFLIGHT_UNCERTAINTY_RAW: null,
    PREFLIGHT_READINESS: null,
    HAS_POSTFLIGHT_DELTA: false,
    POSTFLIGHT_KNOW_SCORE: null,
    POSTFLIGHT_CONTEXT_SCORE: null,
    POSTFLIGHT_UNCERTAINTY_SCORE: null,
    DELTA_KNOW_SCORE: null,
    DELTA_CONTEXT_SCORE: null,
    DELTA_UNCERTAINTY_SCORE: null,
    DELTA_KNOW_TREND: '\u2192',
    DELTA_CONTEXT_TREND: '\u2192',
    DELTA_UNCERTAINTY_TREND: '\u2192',
    LEARNING_INDEX: null,
    LEARNING_SUMMARY: 'Simulation session has no learning delta.',
    GAPS_CLOSED: [],
    NEW_GAPS: [],
    CONTINUATION_COUNT: 0,
    NEXT_CONTINUATION_COUNT: 1,
    LAST_ACTIVITY_TIMESTAMP: now.toISOString(),
    SESSION_DURATION: 'N/A (simulated)',
    SESSION_STATUS: 'SIMULATION',
    COMPLETION_PERCENT: 0,
    PENDING_TASKS: [],
    RESUME_CONTEXT: [],
    CONTEXT_SUMMARY: 'Simulation session placeholder data.',
    SOURCE_TRANSCRIPT_PATH: '',
    SOURCE_SESSION_ID: '',
    SOURCE_SESSION_CREATED: 0,
    SOURCE_SESSION_UPDATED: 0,
    HEAD_REF: null,
    COMMIT_REF: null,
    REPOSITORY_STATE: 'unavailable',
    IS_DETACHED_HEAD: false,
  };
}

// ───────────────────────────────────────────────────────────────
// 4. CONVERSATION DATA FACTORY
// ───────────────────────────────────────────────────────────────
function createConversationData(config: SessionConfig = {}): ConversationData {
  const userMessage: string = config.userMessage || 'This is a simulated user message.';
  const assistantMessage: string = config.assistantMessage || 'This is a simulated assistant response.';
  const now: Date = new Date();

  return {
    MESSAGES: [
      {
        TIMESTAMP: formatTimestamp(now, 'readable'),
        ROLE: 'User' as const,
        CONTENT: userMessage,
        TOOL_CALLS: [],
      },
      {
        TIMESTAMP: formatTimestamp(now, 'readable'),
        ROLE: 'Assistant' as const,
        CONTENT: assistantMessage,
        TOOL_CALLS: [
          {
            TOOL_NAME: 'Read',
            DESCRIPTION: 'Read example.js',
            HAS_RESULT: true,
            RESULT_PREVIEW: 'const example = "simulated";',
            HAS_MORE: false,
          },
        ],
      },
    ],
    MESSAGE_COUNT: 2,
    DURATION: 'N/A (simulated)',
    FLOW_PATTERN: 'Linear Sequential',
    PHASE_COUNT: 4,
    UNIQUE_PHASE_COUNT: 4,
    PHASES: [
      { PHASE_NAME: 'Research', DURATION: '10 min' },
      { PHASE_NAME: 'Planning', DURATION: '2 min' },
      { PHASE_NAME: 'Implementation', DURATION: '30 min' },
      { PHASE_NAME: 'Verification', DURATION: '5 min' },
    ],
    TOPIC_CLUSTERS: [
      {
        id: 'cluster-1',
        label: 'research / docs',
        messageIndexes: [0],
        observationIndexes: [],
        dominantTerms: ['research', 'docs'],
        phaseScores: { Research: 6, Planning: 1, Implementation: 0, Debugging: 0, Verification: 0, Discussion: 0 },
        primaryPhase: 'Research',
        confidence: 0.86,
      },
      {
        id: 'cluster-2',
        label: 'plan / approach',
        messageIndexes: [1],
        observationIndexes: [],
        dominantTerms: ['plan', 'approach'],
        phaseScores: { Research: 0, Planning: 5, Implementation: 1, Debugging: 0, Verification: 0, Discussion: 0 },
        primaryPhase: 'Planning',
        confidence: 0.83,
      },
    ],
    AUTO_GENERATED_FLOW: createSimulationFlowchart(),
    TOOL_COUNT: 1,
    DATE: now.toISOString().split('T')[0],
  };
}

// ───────────────────────────────────────────────────────────────
// 5. DECISION DATA FACTORY
// ───────────────────────────────────────────────────────────────
function createDecisionData(config: SessionConfig = {}): DecisionData {
  const title: string = config.title || 'Simulated Decision Example';
  const context: string = config.context || 'This is a simulated decision for testing purposes.';
  const now: Date = new Date();

  const decisions: DecisionRecord[] = [
    {
      INDEX: 1,
      TITLE: title,
      CONTEXT: context,
      TIMESTAMP: formatTimestamp(now),
      OPTIONS: [
        {
          OPTION_NUMBER: 1,
          LABEL: 'Option A',
          DESCRIPTION: 'First option description',
          HAS_PROS_CONS: true,
          PROS: [{ PRO: 'Simple to implement' }],
          CONS: [{ CON: 'Limited flexibility' }],
        },
        {
          OPTION_NUMBER: 2,
          LABEL: 'Option B',
          DESCRIPTION: 'Second option description',
          HAS_PROS_CONS: true,
          PROS: [{ PRO: 'More flexible' }],
          CONS: [{ CON: 'More complex' }],
        },
      ],
      CHOSEN: 'Option B',
      RATIONALE: 'Flexibility was prioritized over simplicity for this use case.',
      HAS_PROS: true,
      PROS: [
        { PRO: 'Flexible architecture' },
        { PRO: 'Extensible design' },
      ],
      HAS_CONS: true,
      CONS: [
        { CON: 'Higher initial complexity' },
      ],
      CHOICE_CONFIDENCE: 0.85,
      RATIONALE_CONFIDENCE: 0.75,
      CONFIDENCE: 0.75,
      HAS_EVIDENCE: true,
      EVIDENCE: [
        { EVIDENCE_ITEM: 'example.js:123' },
      ],
      HAS_CAVEATS: true,
      CAVEATS: [
        { CAVEAT_ITEM: 'Requires additional setup time' },
      ],
      HAS_FOLLOWUP: true,
      FOLLOWUP: [
        { FOLLOWUP_ITEM: 'Review performance after implementation' },
      ],
      DECISION_TREE: '',
      HAS_DECISION_TREE: false,
      DECISION_ANCHOR_ID: 'decision-simulated-example-000',
      DECISION_IMPORTANCE: 'medium',
    },
  ];

  return {
    DECISIONS: decisions,
    DECISION_COUNT: 1,
    HIGH_CONFIDENCE_COUNT: 1,
    MEDIUM_CONFIDENCE_COUNT: 0,
    LOW_CONFIDENCE_COUNT: 0,
    FOLLOWUP_COUNT: 1,
  };
}

// ───────────────────────────────────────────────────────────────
// 6. DIAGRAM DATA FACTORY
// ───────────────────────────────────────────────────────────────
function createDiagramData(config: SessionConfig = {}): DiagramData {
  const title: string = config.title || 'Example Workflow';
  const description: string = config.description || 'Simulated workflow diagram';
  const now: Date = new Date();

  const asciiWorkflow: string = `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  Start  \u2502
\u2514\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2518
     \u2502
     \u25BC
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502 Process \u2502
\u2514\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2518
     \u2502
     \u25BC
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502   End   \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`;

  return {
    DIAGRAMS: [
      {
        TITLE: title,
        TIMESTAMP: formatTimestamp(now),
        DIAGRAM_TYPE: 'Workflow',
        PATTERN_NAME: 'Sequential Flow',
        COMPLEXITY: 'Low',
        HAS_DESCRIPTION: true,
        DESCRIPTION: description,
        ASCII_ART: asciiWorkflow,
        HAS_NOTES: false,
        NOTES: [],
        HAS_RELATED_FILES: false,
        RELATED_FILES: [],
      },
    ],
    DIAGRAM_COUNT: 1,
    HAS_AUTO_GENERATED: true,
    FLOW_TYPE: 'Conversation Flow',
    AUTO_CONVERSATION_FLOWCHART: createSimulationFlowchart(),
    AUTO_DECISION_TREES: [],
    AUTO_FLOW_COUNT: 1,
    AUTO_DECISION_COUNT: 0,
    DIAGRAM_TYPES: [
      { TYPE: 'Workflow', COUNT: 1 },
    ],
    PATTERN_SUMMARY: [
      { PATTERN_NAME: 'Sequential Flow', COUNT: 1 },
    ],
  };
}

// ───────────────────────────────────────────────────────────────
// 7. FLOWCHART AND PHASES
// ───────────────────────────────────────────────────────────────
function createSimulationFlowchart(initialRequest: string = 'User Request'): string {
  const pad = (text: string, length: number): string => {
    const truncated: string = text.substring(0, length);
    return truncated.padEnd(length);
  };

  return `\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
\u2502  ${pad(initialRequest, 16)}  \u2502
\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F
         \u2502
         \u25BC
   \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
   \u2502  Done  \u2502
    \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F`;
}

function createSimulationPhases(): PhaseEntry[] {
  return [
    {
      PHASE_NAME: 'Research',
      DURATION: '5 min',
      ACTIVITIES: ['Exploring codebase', 'Reading documentation', 'Understanding requirements'],
    },
    {
      PHASE_NAME: 'Planning',
      DURATION: '3 min',
      ACTIVITIES: ['Designing solution', 'Creating task breakdown'],
    },
    {
      PHASE_NAME: 'Implementation',
      DURATION: '15 min',
      ACTIVITIES: ['Writing code', 'Applying changes', 'Refactoring'],
    },
    {
      PHASE_NAME: 'Verification',
      DURATION: '2 min',
      ACTIVITIES: ['Running tests', 'Validating results'],
    },
  ];
}

// ───────────────────────────────────────────────────────────────
// 8. FULL SIMULATION AND DETECTION
// ───────────────────────────────────────────────────────────────
function createFullSimulation(config: SessionConfig = {}): FullSimulation {
  return {
    session: createSessionData(config),
    conversations: createConversationData(config),
    decisions: createDecisionData(config),
    diagrams: createDiagramData(config),
    phases: createSimulationPhases(),
  };
}

function requiresSimulation(collectedData: SimCollectedData | null): boolean {
  if (!collectedData) return true;
  if (collectedData._isSimulation) return true;

  const hasUserPrompts: boolean = !!(collectedData.userPrompts && collectedData.userPrompts.length > 0);
  const hasObservations: boolean = !!(collectedData.observations && collectedData.observations.length > 0);
  const hasRecentContext: boolean = !!(collectedData.recentContext && collectedData.recentContext.length > 0);

  return !hasUserPrompts && !hasObservations && !hasRecentContext;
}

// ───────────────────────────────────────────────────────────────
// 9. SIMULATION WARNING UTILITIES
// ───────────────────────────────────────────────────────────────
function addSimulationWarning(content: string): string {
  const warning: string = `<!-- WARNING: This is simulated/placeholder content - NOT from a real session -->\n\n`;
  return warning + content;
}

function markAsSimulated(metadata: SimulationMetadata): SimulationMetadata {
  return {
    ...metadata,
    isSimulated: true,
    _simulationWarning: 'This memory was generated using placeholder data, not from a real conversation',
  };
}

// ───────────────────────────────────────────────────────────────
// 10. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  createConversationData,
  createSimulationFlowchart,
  createSimulationPhases,
  createDiagramData,
  createSessionData,
  requiresSimulation,
  createDecisionData,
};
