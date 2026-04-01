// ---------------------------------------------------------------
// MODULE: Input Normalizer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INPUT NORMALIZER
// ───────────────────────────────────────────────────────────────
// Validates, normalizes, and transforms raw input data into structured session format
import { structuredLog } from './logger';
import {
  buildSpecAffinityTargets,
  evaluateSpecAffinityText,
  extractSpecIds,
  matchesSpecAffinityFilePath,
  matchesSpecAffinityText,
  normalizeText,
} from './spec-affinity';
import type { Observation, RecentContextEntry } from '../types/session-types';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Data source type indicating where loaded data came from */
export type DataSource =
  | 'file'
  | 'opencode-capture'
  | 'claude-code-capture'
  | 'codex-cli-capture'
  | 'copilot-cli-capture'
  | 'gemini-cli-capture'
  | 'simulation';

export type CaptureDataSource = Exclude<DataSource, 'file' | 'simulation'>;

// O3-1: Re-export canonical Observation from session-types
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

// O3-7: Use canonical RecentContextEntry and create required-field alias
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
  TECHNICAL_CONTEXT?: Array<{ KEY: string; VALUE: string }>;
  importanceTier?: string;
  contextType?: string;
  projectPhase?: string;
  // TODO(O3-12): Remove index signature once all dynamic fields are explicitly declared
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

// ───────────────────────────────────────────────────────────────
// 3. DECISION TRANSFORMATION
// ───────────────────────────────────────────────────────────────
function extractAlternativeLabel(alt: unknown): string {
  if (typeof alt === 'string') return alt;
  if (typeof alt === 'object' && alt !== null) {
    const obj = alt as Record<string, unknown>;
    if (typeof obj.label === 'string') return obj.label;
    if (typeof obj.title === 'string') return obj.title;
    if (typeof obj.name === 'string') return obj.name;
  }
  return JSON.stringify(alt);
}

/**
 * Transforms a key decision item (string or object) into a structured decision observation.
 * @param decisionItem - The decision as a plain string, a DecisionItemObject, or null.
 * @returns An Observation of type 'decision' with extracted facts and confidence, or null if the input is invalid.
 */
function transformKeyDecision(decisionItem: string | DecisionItemObject | null): Observation | null {
  let decisionText: string;
  let chosenApproach: string | null;
  let rationale: string;
  let alternatives: string[];

  if (typeof decisionItem === 'string') {
    decisionText = decisionItem;
    const choiceMatch = decisionText.match(/(?:chose|selected|decided on|using|went with|opted for|implemented)\s+([^.,]+)/i);
    chosenApproach = choiceMatch ? choiceMatch[1].trim() : null;
    rationale = decisionText;
    alternatives = [];
  } else if (typeof decisionItem === 'object' && decisionItem !== null) {
    decisionText = decisionItem.decision || decisionItem.title || 'Unknown decision';
    chosenApproach = decisionItem.chosenOption || decisionItem.chosen || decisionItem.decision || null;
    rationale = decisionItem.rationale || decisionItem.reason || decisionText;
    alternatives = Array.isArray(decisionItem.alternatives)
      ? decisionItem.alternatives.map(extractAlternativeLabel)
      : [];

    if (decisionItem.rationale) {
      decisionText = `${decisionText} - ${decisionItem.rationale}`;
    }
    if (alternatives.length > 0) {
      decisionText += ` Alternatives considered: ${alternatives.join(', ')}.`;
    }
  } else {
    return null;
  }

  const titleMatch = decisionText.match(/^([^.!?]+[.!?]?)/);
  const title: string = titleMatch
    ? titleMatch[1].substring(0, 200).trim()
    : decisionText.substring(0, 200).trim();

  const finalChosenApproach: string = chosenApproach || title;
  const hasMultipleAlternativesMentioned: boolean = alternatives.length > 1
    || /alternatives?\s+considered:\s*[^.]+,\s*[^.]+/i.test(decisionText);
  const confidence: number = chosenApproach
    ? (hasMultipleAlternativesMentioned ? 0.70 : 0.65)
    : 0.50;

  const facts: string[] = [
    `Option 1: ${finalChosenApproach}`,
    `Chose: ${finalChosenApproach}`,
    `Rationale: ${rationale}`
  ];

  alternatives.forEach((alt: string, i: number) => {
    facts.push(`Alternative ${i + 2}: ${alt}`);
  });

  return {
    type: 'decision',
    title: title,
    narrative: decisionText,
    facts: facts,
    _manualDecision: {
      fullText: decisionText,
      chosenApproach: finalChosenApproach,
      confidence
    }
  };
}

// ───────────────────────────────────────────────────────────────
// 4. OBSERVATION BUILDERS
// ───────────────────────────────────────────────────────────────
/**
 * Builds a feature observation from a session summary string and optional trigger phrases.
 * @param summary - The session summary text to use as title and narrative.
 * @param triggerPhrases - Optional array of trigger phrases stored as observation facts.
 * @returns An Observation of type 'feature' representing the session summary.
 */
function buildSessionSummaryObservation(summary: string, triggerPhrases: string[] = []): Observation {
  const summaryTitle: string = summary.length > 100
    ? summary.substring(0, 100).replace(/\s+\S*$/, '') + '...'
    : summary;

  // Truncate narrative to avoid verbatim duplication with OVERVIEW section.
  // T09b: Increased from 200→500 for richer semantic content in JSON mode
  const narrativeText: string = summary.length > 500
    ? summary.substring(0, 500).replace(/\s+\S*$/, '') + '...'
    : summary;

  return {
    type: 'feature',
    title: summaryTitle,
    narrative: narrativeText,
    facts: triggerPhrases
  };
}

/**
 * Builds an implementation observation from a technical context key-value map.
 * @param techContext - A record of technical details (e.g., stack, config, dependencies).
 * @returns An Observation of type 'implementation' with a semicolon-delimited narrative of the context entries.
 */
function buildTechnicalContextObservation(techContext: Record<string, unknown>): Observation {
  const techDetails: string = Object.entries(techContext)
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join('; ');

  return {
    type: 'implementation',
    title: 'Technical Implementation Details',
    narrative: techDetails,
    facts: []
  };
}

/**
 * Maps a technicalContext record to the structured TECHNICAL_CONTEXT array format.
 * @param techContext - A record of technical details (e.g., stack, config, dependencies).
 * @returns An array of {KEY, VALUE} objects for the dedicated template section.
 */
function mapTechnicalContext(techContext: Record<string, unknown>): Array<{ KEY: string; VALUE: string }> {
  return Object.entries(techContext)
    .map(([key, value]) => ({
      KEY: key,
      VALUE: typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));
}

function dedupeObservationsByNarrative(observations: Observation[]): Observation[] {
  const seenNarratives = new Set<string>();
  const dedupedObservations: Observation[] = [];

  for (const observation of observations) {
    const dedupeKey = typeof observation === 'object'
      && observation !== null
      && typeof (observation as Record<string, unknown>).narrative === 'string'
      ? (observation as Record<string, unknown>).narrative as string
      : JSON.stringify(observation);

    if (seenNarratives.has(dedupeKey)) {
      continue;
    }

    seenNarratives.add(dedupeKey);
    dedupedObservations.push(observation);
  }

  return dedupedObservations;
}

function buildNextStepsObservation(nextSteps: string[]): Observation {
  if (nextSteps.length === 0) {
    return { type: 'followup', title: 'Next Steps', narrative: '', facts: [] };
  }

  const [firstStep, ...remainingSteps] = nextSteps;

  return {
    type: 'followup',
    title: 'Next Steps',
    narrative: nextSteps.join(' '),
    facts: [
      `Next: ${firstStep}`,
      ...remainingSteps.map((step) => `Follow-up: ${step}`),
    ],
  };
}

function hasPersistedNextStepsObservation(observations: Observation[]): boolean {
  return observations.some((observation) => {
    if (!Array.isArray(observation.facts)) {
      return false;
    }

    return observation.facts.some((fact) => {
      if (typeof fact !== 'string') {
        return false;
      }

      return /^Next:\s+/i.test(fact) || /^Follow-up:\s+/i.test(fact);
    });
  });
}

// ───────────────────────────────────────────────────────────────
// 5. INPUT NORMALIZATION
// ───────────────────────────────────────────────────────────────
function cloneInputData<T>(data: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(data);
  }

  return JSON.parse(JSON.stringify(data)) as T;
}

function safeString(value: unknown, fallback: string): string {
  if (typeof value === 'string') return value;
  if (value != null && typeof value !== 'object') return String(value);
  return fallback;
}

const VALID_MAGNITUDES = new Set(['trivial', 'small', 'medium', 'large', 'unknown']);

function normalizeFileEntryLike(file: NormalizedFileEntry | Record<string, unknown>): NormalizedFileEntry {
  // BUG-003: Trim and capitalize ACTION
  const rawActionValue = 'ACTION' in file
    ? file.ACTION
    : ('action' in file ? file.action : undefined);
  const rawAction = typeof rawActionValue === 'string' ? rawActionValue : undefined;
  const action = rawAction ? rawAction.trim().charAt(0).toUpperCase() + rawAction.trim().slice(1) : undefined;

  const rawProvenance = '_provenance' in file ? file._provenance : undefined;
  const provenance = rawProvenance === 'git' || rawProvenance === 'spec-folder' || rawProvenance === 'tool'
    ? rawProvenance
    : undefined;

  // BUG-003: Default invalid MAGNITUDE to 'unknown' only when a value was provided but invalid
  const rawMagnitude = 'MODIFICATION_MAGNITUDE' in file ? file.MODIFICATION_MAGNITUDE : undefined;
  const modificationMagnitude: NormalizedFileEntry['MODIFICATION_MAGNITUDE'] =
    (typeof rawMagnitude === 'string' && VALID_MAGNITUDES.has(rawMagnitude))
      ? rawMagnitude as NormalizedFileEntry['MODIFICATION_MAGNITUDE']
      : (rawMagnitude != null ? 'unknown' : undefined);

  const rawSynthetic = '_synthetic' in file ? file._synthetic : undefined;
  const synthetic = typeof rawSynthetic === 'boolean'
    ? rawSynthetic
    : undefined;

  // BUG-001: Safe coercion via safeString — rejects objects/arrays, coerces primitives
  const rawFilePath = ('FILE_PATH' in file ? file.FILE_PATH : undefined)
    ?? ('path' in file ? file.path : undefined);
  const rawDescription = ('DESCRIPTION' in file ? file.DESCRIPTION : undefined)
    ?? ('description' in file ? file.description : undefined);
  const filePath = safeString(rawFilePath, '');
  const description = safeString(rawDescription, 'Modified during session');

  return {
    FILE_PATH: filePath,
    DESCRIPTION: description,
    ...(action ? { ACTION: action } : {}),
    ...(modificationMagnitude ? { MODIFICATION_MAGNITUDE: modificationMagnitude } : {}),
    ...(provenance ? { _provenance: provenance } : {}),
    ...(synthetic !== undefined ? { _synthetic: synthetic } : {}),
  };
}

/**
 * Normalizes raw input data from manual or mixed formats into the MCP-compatible NormalizedData structure.
 * @param data - The raw input data with camelCase or snake_case fields.
 * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.
 */
function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
  const nextSteps = Array.isArray(data.nextSteps)
    ? data.nextSteps
    : Array.isArray(data.next_steps)
      ? data.next_steps
      : [];
  const userPrompts = Array.isArray(data.userPrompts)
    ? data.userPrompts
    : Array.isArray(data.user_prompts)
      ? data.user_prompts
      : [];
  const recentContext = Array.isArray(data.recentContext)
    ? data.recentContext
    : Array.isArray(data.recent_context)
      ? data.recent_context
      : [];
  const triggerPhrases = Array.isArray(data.triggerPhrases)
    ? data.triggerPhrases
    : Array.isArray(data.trigger_phrases)
      ? data.trigger_phrases
      : [];

  // F-15: Field-by-field completion instead of early return — backfill missing arrays
  if (data.userPrompts || data.user_prompts || data.observations || data.recentContext || data.recent_context) {
    const cloned = cloneInputData(data) as NormalizedData;
    if (!Array.isArray(cloned.userPrompts)) cloned.userPrompts = userPrompts;
    if (!Array.isArray(cloned.recentContext)) cloned.recentContext = recentContext;
    if (!Array.isArray(cloned.observations)) cloned.observations = [];
    // F-16: Ensure FILES uses FileEntry format
    if (cloned.FILES && Array.isArray(cloned.FILES)) {
      cloned.FILES = cloned.FILES.map((f) => normalizeFileEntryLike(f));
    }
    // P0: Convert filesModified to FILES on fast-path (mirrors slow-path at lines 504-540)
    if (!cloned.FILES || (Array.isArray(cloned.FILES) && cloned.FILES.length === 0)) {
      const fmFast = Array.isArray(data.filesModified)
        ? data.filesModified
        : Array.isArray(data.files_modified)
          ? data.files_modified
          : undefined;
      if (fmFast !== undefined) {
        if (fmFast.length > 0) {
          cloned.FILES = fmFast.map((entry: string | { path?: string; changes_summary?: string }) => {
            let filePath: string;
            let changesSummary: string;
            if (typeof entry === 'string') {
              const sepMatch = entry.match(/^(.+?)\s+(?:[-\u2013\u2014]|:)\s+(.+)$/);
              if (sepMatch && (sepMatch[1].includes('.') || sepMatch[1].includes('/'))) {
                filePath = sepMatch[1].trim();
                changesSummary = sepMatch[2].trim();
              } else {
                filePath = entry;
                changesSummary = '';
              }
            } else {
              filePath = entry.path || '';
              changesSummary = entry.changes_summary || '';
            }
            let description = changesSummary;
            if (!description) {
              const basename = filePath.replace(/\\/g, '/').split('/').pop()?.replace(/\.[^.]+$/, '') || '';
              description = basename
                ? `Modified ${basename.replace(/[-_]/g, ' ')}`
                : 'File modified';
            }
            return { FILE_PATH: filePath, DESCRIPTION: description, ACTION: 'Modified' };
          });
        } else {
          // T004: Empty filesModified: [] produces FILES: [], not key omission
          cloned.FILES = [];
        }
      }
    }
    // Rec 1: Map filesChanged to FILES on fast-path when no filesModified present
    if (!cloned.FILES || (Array.isArray(cloned.FILES) && cloned.FILES.length === 0)) {
      const fcFast = Array.isArray(data.filesChanged)
        ? data.filesChanged
        : Array.isArray((data as Record<string, unknown>).files_changed)
          ? (data as Record<string, unknown>).files_changed as string[]
          : undefined;
      if (fcFast !== undefined && fcFast.length > 0) {
        cloned.FILES = fcFast.map((entry: string) => {
          const basename = entry.replace(/\\/g, '/').split('/').pop()?.replace(/\.[^.]+$/, '') || '';
          return {
            FILE_PATH: entry,
            DESCRIPTION: basename ? `Modified ${basename.replace(/[-_]/g, ' ')}` : 'File changed',
            ACTION: 'Changed',
          };
        });
      }
    }

    if (nextSteps.length > 0 && !hasPersistedNextStepsObservation(cloned.observations)) {
      cloned.observations.push(buildNextStepsObservation(nextSteps));
    }
    if (triggerPhrases.length > 0) {
      cloned._manualTriggerPhrases = [...triggerPhrases];
    }
    if (data.specFolder || data.spec_folder || data.SPEC_FOLDER) {
      cloned.SPEC_FOLDER = (data.specFolder || data.spec_folder || data.SPEC_FOLDER) as string;
    }
    // Q3: Backfill TECHNICAL_CONTEXT for fast-path data
    if (data.technicalContext && typeof data.technicalContext === 'object' && !cloned.TECHNICAL_CONTEXT) {
      cloned.TECHNICAL_CONTEXT = mapTechnicalContext(data.technicalContext);
    }
    // BUG-006: Propagate importanceTier through fast-path
    const fastPathTier = data.importanceTier || data.importance_tier;
    if (typeof fastPathTier === 'string' && fastPathTier.length > 0) {
      cloned.importanceTier = fastPathTier;
    }
    // RC5: Propagate contextType through fast-path (mirrors importanceTier pattern)
    const fastPathContextType = data.contextType || data.context_type;
    if (typeof fastPathContextType === 'string' && fastPathContextType.length > 0) {
      cloned.contextType = fastPathContextType;
    }
    // Phase 002 T028: Propagate projectPhase through fast-path (mirrors contextType pattern)
    const fastPathProjectPhase = (data as Record<string, unknown>).projectPhase || (data as Record<string, unknown>).project_phase;
    if (typeof fastPathProjectPhase === 'string' && fastPathProjectPhase.length > 0) {
      (cloned as Record<string, unknown>).projectPhase = fastPathProjectPhase;
    }
    // RC3: Propagate keyDecisions through fast-path
    const keyDecisions = Array.isArray(data.keyDecisions)
      ? data.keyDecisions
      : Array.isArray(data.key_decisions)
        ? data.key_decisions
        : [];
    if (keyDecisions.length > 0 && !cloned._manualDecisions) {
      cloned._manualDecisions = keyDecisions.map((d) => cloneInputData(d));
    }
    if (keyDecisions.length > 0) {
      const hasDecisionObs = (cloned.observations || []).some(
        (obs: Observation) => obs.type === 'decision'
      );
      if (!hasDecisionObs) {
        for (const item of keyDecisions) {
          const obs = transformKeyDecision(item);
          if (obs) cloned.observations.push(obs);
        }
      }
    }

    cloned.observations = dedupeObservationsByNarrative(cloned.observations);

    return cloned;
  }

  const normalized: NormalizedData = {
    observations: [],
    userPrompts: [],
    recentContext: [],
  };

  if (data.specFolder || data.spec_folder || data.SPEC_FOLDER) {
    normalized.SPEC_FOLDER = (data.specFolder || data.spec_folder || data.SPEC_FOLDER) as string;
  }

  // F-16: Convert filesModified to FileEntry format with ACTION field
  const filesModified = Array.isArray(data.filesModified)
    ? data.filesModified
    : Array.isArray(data.files_modified)
      ? data.files_modified
      : [];
  if (Array.isArray(data.FILES) && data.FILES.length > 0) {
    normalized.FILES = data.FILES.map((entry) => normalizeFileEntryLike(entry));
  } else if (filesModified.length > 0) {
    normalized.FILES = filesModified.map((entry: string | { path?: string; changes_summary?: string }) => {
      let filePath: string;
      let changesSummary: string;
      if (typeof entry === 'string') {
        // Fix 6: Parse "path <separator> description" compound format
        // Support: " - ", " — " (em dash), " – " (en dash), " : "
        const sepMatch = entry.match(/^(.+?)\s+(?:[-\u2013\u2014]|:)\s+(.+)$/);
        if (sepMatch && (sepMatch[1].includes('.') || sepMatch[1].includes('/'))) {
          filePath = sepMatch[1].trim();
          changesSummary = sepMatch[2].trim();
        } else {
          filePath = entry;
          changesSummary = '';
        }
      } else {
        filePath = entry.path || '';
        changesSummary = entry.changes_summary || '';
      }
      // CG-06: Generate description from changes_summary or filename instead of "description pending"
      let description = changesSummary;
      if (!description) {
        const basename = filePath.replace(/\\/g, '/').split('/').pop()?.replace(/\.[^.]+$/, '') || '';
        description = basename
          ? `Modified ${basename.replace(/[-_]/g, ' ')}`
          : 'File modified';
      }
      return { FILE_PATH: filePath, DESCRIPTION: description, ACTION: 'Modified' };
    });
  }

  // Rec 1: Map filesChanged to FILES when filesModified not provided
  if ((!normalized.FILES || normalized.FILES.length === 0) && !filesModified.length) {
    const filesChanged = Array.isArray(data.filesChanged)
      ? data.filesChanged
      : Array.isArray(data.files_changed)
        ? (data.files_changed as string[])
        : [];
    if (filesChanged.length > 0) {
      normalized.FILES = filesChanged.map((entry: string) => {
        const sepMatch = entry.match(/^(.+?)\s+(?:[-\u2013\u2014]|:)\s+(.+)$/);
        let filePath: string;
        let description: string;
        if (sepMatch && (sepMatch[1].includes('.') || sepMatch[1].includes('/'))) {
          filePath = sepMatch[1].trim();
          description = sepMatch[2].trim();
        } else {
          filePath = entry;
          const basename = filePath.replace(/\\/g, '/').split('/').pop()?.replace(/\.[^.]+$/, '') || '';
          description = basename ? `Modified ${basename.replace(/[-_]/g, ' ')}` : 'File changed';
        }
        return { FILE_PATH: filePath, DESCRIPTION: description, ACTION: 'Changed' };
      });
    }
  }

  const observations: Observation[] = [];

  const sessionSummary = typeof data.sessionSummary === 'string'
    ? data.sessionSummary
    : (typeof data.session_summary === 'string' ? data.session_summary : '');

  if (sessionSummary) {
    observations.push(buildSessionSummaryObservation(sessionSummary, triggerPhrases));
  }

  const keyDecisions = Array.isArray(data.keyDecisions)
    ? data.keyDecisions
    : Array.isArray(data.key_decisions)
      ? data.key_decisions
      : [];
  if (keyDecisions.length > 0) {
    for (const decisionItem of keyDecisions) {
      const observation = transformKeyDecision(decisionItem);
      if (observation) {
        observations.push(observation);
      }
    }
  }

  if (data.technicalContext && typeof data.technicalContext === 'object') {
    observations.push(buildTechnicalContextObservation(data.technicalContext));
    // Q3: Also store structured key-value pairs for dedicated template section
    normalized.TECHNICAL_CONTEXT = mapTechnicalContext(data.technicalContext);
  }

  if (nextSteps.length > 0) {
    observations.push(buildNextStepsObservation(nextSteps));
  }

  // Phase 004 T033: Observation dedup at normalization time — string-equality dedup
  normalized.observations = dedupeObservationsByNarrative(observations);

  // T09b: Promote exchanges to multi-message userPrompts for richer semantic input
  const promotedPrompts: Array<{ prompt: string; timestamp: string }> = [];
  // T09b fast-path guard: slow-path and fast-path are separate functions, so this guards
  // against rich payloads that already populated userPrompts via earlier normalization steps
  if (Array.isArray(data.exchanges) && (!normalized.userPrompts || normalized.userPrompts.length < 3)) {
    const sessionSummaryLower = (sessionSummary || '').toLowerCase();
    for (const exchange of data.exchanges.slice(0, 10)) {
      const userInput = typeof exchange === 'object' && exchange !== null
        ? (exchange as Record<string, unknown>).userInput || (exchange as Record<string, unknown>).user || ''
        : '';
      const inputStr = String(userInput).trim();
      if (inputStr.length > 10 && !sessionSummaryLower.includes(inputStr.toLowerCase().slice(0, 50))) {
        promotedPrompts.push({ prompt: inputStr, timestamp: new Date().toISOString() });
      }
    }
  }

  // T09b: Promote toolCalls to implementation observations
  if (Array.isArray(data.toolCalls)) {
    for (const tc of data.toolCalls.slice(0, 10)) {
      const tool = typeof tc === 'object' && tc !== null ? (tc as Record<string, unknown>) : {};
      const toolName = String(tool.tool || tool.name || 'unknown').trim();
      const toolTitle = String(tool.title || tool.action || '').trim();
      if (toolName && toolTitle) {
        normalized.observations.push({
          type: 'implementation' as const,
          title: `Tool: ${toolName}`,
          narrative: toolTitle,
          facts: [],
        });
      }
    }
  }

  // T09b: Use promoted exchange prompts alongside sessionSummary fallback
  normalized.userPrompts = promotedPrompts.length > 0
    ? [...promotedPrompts, { prompt: sessionSummary || 'Manual context save', timestamp: new Date().toISOString() }]
    : [{ prompt: sessionSummary || 'Manual context save', timestamp: new Date().toISOString() }];

  normalized.recentContext = [{
    request: sessionSummary || 'Manual context save',
    learning: sessionSummary || ''
  }];

  if (triggerPhrases.length > 0) {
    normalized._manualTriggerPhrases = [...triggerPhrases];
  }

  if (keyDecisions.length > 0) {
    normalized._manualDecisions = keyDecisions.map((decision) => cloneInputData(decision));
  }

  // BUG-006: Propagate importanceTier through slow-path
  const slowPathTier = data.importanceTier || data.importance_tier;
  if (typeof slowPathTier === 'string' && slowPathTier.length > 0) {
    normalized.importanceTier = slowPathTier;
  }
  // RC5: Propagate contextType through slow-path (mirrors importanceTier pattern)
  const slowPathContextType = data.contextType || data.context_type;
  if (typeof slowPathContextType === 'string' && slowPathContextType.length > 0) {
    normalized.contextType = slowPathContextType;
  }
  // Phase 002 T029: Propagate projectPhase through slow-path (mirrors contextType pattern)
  const slowPathProjectPhase = (data as Record<string, unknown>).projectPhase || (data as Record<string, unknown>).project_phase;
  if (typeof slowPathProjectPhase === 'string' && slowPathProjectPhase.length > 0) {
    normalized.projectPhase = slowPathProjectPhase;
  }

  // T06: Propagate preflight/postflight epistemic data through slow-path
  const slowPreflight = (data as Record<string, unknown>).preflight;
  if (slowPreflight && typeof slowPreflight === 'object') {
    (normalized as Record<string, unknown>).preflight = slowPreflight;
  }
  const slowPostflight = (data as Record<string, unknown>).postflight;
  if (slowPostflight && typeof slowPostflight === 'object') {
    (normalized as Record<string, unknown>).postflight = slowPostflight;
  }

  console.log('   \u2713 Transformed manual format to MCP-compatible structure');
  return normalized;
}

// ───────────────────────────────────────────────────────────────
// 6. INPUT VALIDATION
// ───────────────────────────────────────────────────────────────
/**
 * Validates raw input data, throwing an error if required fields are missing or fields have incorrect types.
 * @param data - The raw input data object to validate.
 * @param specFolderArg - Optional spec folder path from CLI argument; when provided, the specFolder field in data is not required.
 * @returns Nothing on success; throws an Error with concatenated validation messages on failure.
 */
// P1: Known fields for unknown-field detection (T007)
const KNOWN_RAW_INPUT_FIELDS: Set<string> = new Set([
  'specFolder', 'spec_folder', 'SPEC_FOLDER',
  'filesModified', 'files_modified', 'filesChanged', 'files_changed',
  'sessionSummary', 'session_summary',
  'keyDecisions', 'key_decisions',
  'nextSteps', 'next_steps',
  'technicalContext',
  'triggerPhrases', 'trigger_phrases',
  'importanceTier', 'importance_tier',
  'contextType', 'context_type',
  'projectPhase', 'project_phase',
  'toolCalls', 'exchanges',
  'FILES', 'observations',
  'userPrompts', 'user_prompts',
  'recentContext', 'recent_context',
  // T06: Preflight/postflight epistemic tracking fields
  'knowledgeScore', 'knowledge_score',
  'uncertaintyScore', 'uncertainty_score',
  'contextScore', 'context_score',
  'knowledgeGaps', 'knowledge_gaps',
  'gapsClosed', 'gaps_closed',
  'newGapsDiscovered', 'new_gaps_discovered',
]);

// P1: Valid contextType values for enum validation (T009)
const VALID_CONTEXT_TYPES: string[] = [
  'implementation', 'research', 'debugging', 'review', 'planning',
  'decision', 'architecture', 'configuration', 'documentation', 'general',
];

function validateInputData(data: RawInputData, specFolderArg: string | null = null): void {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    throw new Error('Input validation failed: data must be a non-null object');
  }

  // P1: Warn on unknown fields for typo detection (T008)
  for (const key of Object.keys(data)) {
    if (!KNOWN_RAW_INPUT_FIELDS.has(key)) {
      console.warn(`[WARN] Unknown field in input data: "${key}" — this field will be ignored`);
    }
  }

  if (specFolderArg === null && !data.specFolder && !data.spec_folder && !data.SPEC_FOLDER) {
    if (!data.userPrompts && !data.user_prompts && !data.observations && !data.recentContext && !data.recent_context) {
      errors.push('Missing required field: specFolder (or use CLI argument)');
    }
  }

  // P1: contextType enum validation (T010)
  if (data.contextType !== undefined && typeof data.contextType === 'string' && !VALID_CONTEXT_TYPES.includes(data.contextType)) {
    errors.push(`Invalid contextType: "${data.contextType}". Valid values: ${VALID_CONTEXT_TYPES.join(', ')}`);
  }
  if (data.context_type !== undefined && typeof data.context_type === 'string' && !VALID_CONTEXT_TYPES.includes(data.context_type)) {
    errors.push(`Invalid context_type: "${data.context_type}". Valid values: ${VALID_CONTEXT_TYPES.join(', ')}`);
  }

  // P1: String length limits (T011-T013)
  if (typeof data.sessionSummary === 'string' && data.sessionSummary.length > 50000) {
    errors.push(`sessionSummary exceeds maximum length of 50000 characters (got ${data.sessionSummary.length})`);
  }
  if (typeof data.session_summary === 'string' && data.session_summary.length > 50000) {
    errors.push(`session_summary exceeds maximum length of 50000 characters (got ${data.session_summary.length})`);
  }
  if (Array.isArray(data.triggerPhrases)) {
    for (let i = 0; i < data.triggerPhrases.length; i++) {
      if (typeof data.triggerPhrases[i] === 'string' && (data.triggerPhrases[i] as string).length > 200) {
        errors.push(`triggerPhrases[${i}] exceeds maximum length of 200 characters`);
      }
    }
  }
  if (Array.isArray(data.trigger_phrases)) {
    for (let i = 0; i < data.trigger_phrases.length; i++) {
      if (typeof data.trigger_phrases[i] === 'string' && (data.trigger_phrases[i] as string).length > 200) {
        errors.push(`trigger_phrases[${i}] exceeds maximum length of 200 characters`);
      }
    }
  }
  if (Array.isArray(data.observations)) {
    for (let i = 0; i < data.observations.length; i++) {
      const obs = data.observations[i];
      if (obs && typeof obs === 'object' && typeof (obs as Record<string, unknown>).narrative === 'string') {
        const narrative = (obs as Record<string, unknown>).narrative as string;
        if (narrative.length > 5000) {
          errors.push(`observations[${i}].narrative exceeds maximum length of 5000 characters`);
        }
      }
    }
  }

  if (data.triggerPhrases !== undefined && !Array.isArray(data.triggerPhrases)) {
    errors.push('triggerPhrases must be an array');
  }
  if (data.trigger_phrases !== undefined && !Array.isArray(data.trigger_phrases)) {
    errors.push('trigger_phrases must be an array');
  }

  if (data.keyDecisions !== undefined && !Array.isArray(data.keyDecisions)) {
    errors.push('keyDecisions must be an array');
  }
  if (data.key_decisions !== undefined && !Array.isArray(data.key_decisions)) {
    errors.push('key_decisions must be an array');
  }

  if (data.filesModified !== undefined && !Array.isArray(data.filesModified)) {
    errors.push('filesModified must be an array');
  }
  if (data.files_modified !== undefined && !Array.isArray(data.files_modified)) {
    errors.push('files_modified must be an array');
  }
  if (data.filesChanged !== undefined && !Array.isArray(data.filesChanged)) {
    errors.push('filesChanged must be an array');
  }
  if (data.files_changed !== undefined && !Array.isArray(data.files_changed)) {
    errors.push('files_changed must be an array');
  }

  // P2-004: Array-length caps to prevent memory pressure from oversized inputs
  const ARRAY_LENGTH_CAP = 500;
  if (Array.isArray(data.keyDecisions) && data.keyDecisions.length > ARRAY_LENGTH_CAP) {
    errors.push(`keyDecisions exceeds maximum length of ${ARRAY_LENGTH_CAP} (got ${data.keyDecisions.length})`);
  }
  if (Array.isArray(data.key_decisions) && data.key_decisions.length > ARRAY_LENGTH_CAP) {
    errors.push(`key_decisions exceeds maximum length of ${ARRAY_LENGTH_CAP} (got ${data.key_decisions.length})`);
  }
  if (Array.isArray(data.filesModified) && data.filesModified.length > ARRAY_LENGTH_CAP) {
    errors.push(`filesModified exceeds maximum length of ${ARRAY_LENGTH_CAP} (got ${data.filesModified.length})`);
  }
  if (Array.isArray(data.filesChanged) && data.filesChanged.length > ARRAY_LENGTH_CAP) {
    errors.push(`filesChanged exceeds maximum length of ${ARRAY_LENGTH_CAP} (got ${data.filesChanged.length})`);
  }

  if (data.nextSteps !== undefined && !Array.isArray(data.nextSteps)) {
    errors.push('nextSteps must be an array');
  }

  if (data.next_steps !== undefined && !Array.isArray(data.next_steps)) {
    errors.push('next_steps must be an array');
  }

  const validTiers: string[] = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
  if (data.importanceTier !== undefined && !validTiers.includes(data.importanceTier)) {
    errors.push(`Invalid importanceTier: ${data.importanceTier}. Valid values: ${validTiers.join(', ')}`);
  }
  if (data.importance_tier !== undefined && !validTiers.includes(data.importance_tier)) {
    errors.push(`Invalid importance_tier: ${data.importance_tier}. Valid values: ${validTiers.join(', ')}`);
  }

  if (data.FILES !== undefined) {
    if (!Array.isArray(data.FILES)) {
      errors.push('FILES must be an array');
    } else {
      for (let i = 0; i < data.FILES.length; i++) {
        const file = data.FILES[i];
        if (typeof file !== 'object' || file === null) {
          errors.push(`FILES[${i}] must be an object`);
        } else if (!(file as NormalizedFileEntry).FILE_PATH && !(file as Record<string, unknown>).path) {
          errors.push(`FILES[${i}] missing required FILE_PATH or path field`);
        }
      }
    }
  }

  if (data.observations !== undefined) {
    if (!Array.isArray(data.observations)) {
      errors.push('observations must be an array');
    }
  }
  if (data.user_prompts !== undefined && !Array.isArray(data.user_prompts)) {
    errors.push('user_prompts must be an array');
  }
  if (data.recent_context !== undefined && !Array.isArray(data.recent_context)) {
    errors.push('recent_context must be an array');
  }

  if (errors.length > 0) {
    throw new Error(`Input validation failed: ${errors.join('; ')}`);
  }

  // Validation passed - function returns void on success, throws on failure
}

// 7. TOOL OBSERVATION TITLE BUILDER
/**
 * Build a descriptive observation title from a tool call.
 * Uses the tool's file path, pattern, or command to create a meaningful title
 * instead of a generic "Tool: grep" label.
 */
function buildToolObservationTitle(tool: CaptureToolCall): string {
  const toolName = tool.tool || 'unknown';
  const input = tool.input || {};

  // Prefer the tool's own title if it's descriptive (not just a tool name)
  if (tool.title && tool.title.length > 10 && !/^Tool:\s/i.test(tool.title)) {
    return tool.title.substring(0, 80);
  }

  const filePath = input.filePath || input.file_path || input.path || '';
  const shortPath = filePath ? filePath.split('/').slice(-2).join('/') : '';
  const outputSummary = typeof tool.output === 'string'
    ? tool.output.replace(/\s+/g, ' ').trim().slice(0, 60)
    : '';

  switch (toolName.toLowerCase()) {
    case 'view':  // Copilot CLI equivalent of 'read'
    case 'read':
      return shortPath ? `Read ${shortPath}` : 'Read file';
    case 'edit':
      return shortPath ? `Edit ${shortPath}` : 'Edit file';
    case 'write':
      return shortPath ? `Write ${shortPath}` : 'Write file';
    case 'grep': {
      const pattern = typeof input.pattern === 'string' ? input.pattern.substring(0, 40) : '';
      return pattern ? `Grep: ${pattern}` : 'Grep search';
    }
    case 'glob': {
      const globPattern = typeof input.pattern === 'string' ? input.pattern.substring(0, 40) : '';
      return globPattern ? `Glob: ${globPattern}` : 'Glob search';
    }
    case 'bash': {
      const desc = typeof input.description === 'string' ? input.description.substring(0, 60) : '';
      const cmd = typeof input.command === 'string' ? input.command.substring(0, 40) : '';
      return shortPath ? `Bash ${shortPath}` : (desc || cmd || outputSummary || 'Bash command');
    }
    default:
      return shortPath
        ? `${toolName}: ${shortPath}`
        : (outputSummary ? `${toolName}: ${outputSummary}` : `Tool: ${toolName}`);
  }
}

// P3-1: Stopword list for spec relevance keywords.
// RELEVANCE_PATH_STOPWORDS (permissive) — for spec-path-derived keywords; only blocks truly generic words.
// Words like 'testing', 'playbook', 'memory', 'session' are meaningful when from a path and should NOT be stopped.
const RELEVANCE_PATH_STOPWORDS = new Set([
  'add', 'and', 'are', 'but', 'can', 'did', 'for', 'get', 'had', 'has',
  'how', 'its', 'may', 'new', 'not', 'our', 'out', 'own', 'put', 'run',
  'set', 'the', 'too', 'use', 'was', 'who', 'all', 'any', 'also',
]);

function buildSpecRelevanceKeywords(specFolderHint?: string | null): string[] {
  if (!specFolderHint) return [];

  const keywords = new Set<string>();
  const segments = specFolderHint
    .split('/')
    .map((segment) => segment.replace(/^\d+--?/, '').trim())
    .filter(Boolean);

  for (const segment of segments) {
    const normalizedSegment = normalizeText(segment);
    // Multi-word phrases are specific enough to keep (e.g., "session capturing")
    if (normalizedSegment.length > 2 && normalizedSegment.includes(' ')) {
      keywords.add(normalizedSegment);
    }

    for (const token of normalizedSegment.split(' ')) {
      // P1-07: Skip generic single tokens that cause false-positive relevance matches
      if (token.length > 2 && !RELEVANCE_PATH_STOPWORDS.has(token)) {
        keywords.add(token);
      }
    }
  }

  const normalizedHint = normalizeText(specFolderHint);
  if (normalizedHint.length > 2) {
    keywords.add(normalizedHint);
  }

  return Array.from(keywords);
}

function containsRelevantKeyword(keywords: string[], ...parts: Array<string | undefined>): boolean {
  if (keywords.length === 0) return true;
  const normalized = normalizeText(parts.filter(Boolean).join(' '));
  return keywords.some((keyword) => normalized.includes(keyword));
}

function getCurrentSpecId(specFolderHint?: string | null): string | null {
  if (!specFolderHint) {
    return null;
  }

  const specIds = extractSpecIds(specFolderHint);
  return specIds.at(-1) || null;
}

function isSafeSpecFallback(
  currentSpecId: string | null,
  specFolderHint: string | null | undefined,
  ...parts: Array<string | undefined>
): boolean {
  const text = parts.filter(Boolean).join(' ');
  const discoveredIds = extractSpecIds(text);
  // Original check: no foreign spec IDs
  if (discoveredIds.length > 0) {
    if (currentSpecId === null || !discoveredIds.every((specId) => specId === currentSpecId)) {
      return false;
    }
  }
  // P3-3: Require at least one topical anchor when a spec hint exists.
  if (!specFolderHint) return true;
  const specSegments = specFolderHint
    .split('/')
    .map((segment) => segment.replace(/^\d+--?/, '').trim().toLowerCase())
    .filter((segment) => segment.length > 2);
  const normalizedText = text.toLowerCase();
  return specSegments.some((segment) => normalizedText.includes(segment));
}

// ───────────────────────────────────────────────────────────────
// 8. OPENCODE CAPTURE TRANSFORMATION
// ───────────────────────────────────────────────────────────────
/**
 * Transforms a raw OpenCode session capture into a structured TransformedCapture with observations, prompts, and file entries.
 * @param capture - The raw OpenCode capture containing exchanges, tool calls, and metadata.
 * @param specFolderHint - Optional spec folder path used to filter content by spec-folder relevance.
 * @param source - The data source identifier, defaults to 'opencode-capture'.
 * @returns A TransformedCapture with userPrompts, observations, recentContext, FILES, and source metadata.
 */
function transformOpencodeCapture(
  capture: OpencodeCapture,
  specFolderHint?: string | null,
  source: CaptureDataSource = 'opencode-capture',
): TransformedCapture {
  // F-14: Runtime guards — validate capture shape before processing
  if (!capture || typeof capture !== 'object') {
    return { userPrompts: [], observations: [], recentContext: [], FILES: [], _source: source };
  }

  // RC-10: Normalize snake_case fields from ConversationCapture to camelCase OpencodeCapture.
  // ConversationCapture emits both forms; OpencodeCapture interface only declares camelCase.
  const raw = capture as unknown as Record<string, unknown>;
  const normalizedCapture: OpencodeCapture = {
    exchanges: Array.isArray(capture.exchanges) ? capture.exchanges : [],
    toolCalls: Array.isArray(capture.toolCalls) ? capture.toolCalls : [],
    metadata: capture.metadata,
    sessionTitle: capture.sessionTitle ?? (raw.session_title as string | undefined),
    sessionId: capture.sessionId ?? (raw.session_id as string | undefined),
    capturedAt: capture.capturedAt ?? (raw.captured_at as string | undefined),
  };

  const { exchanges, toolCalls, metadata, sessionTitle } = normalizedCapture;
  const specAffinityTargets = buildSpecAffinityTargets(specFolderHint);

  // --- Spec-folder relevance filter ---
  // When a spec folder hint is provided, filter tool calls to only those
  // Whose file paths relate to the target spec folder. This prevents
  // Unrelated session content (e.g., from prior conversations in the same
  // OpenCode session) from polluting the memory file.
  const relevanceKeywords = buildSpecRelevanceKeywords(specFolderHint);
  const currentSpecId = getCurrentSpecId(specFolderHint);
  const alignedExchangeTexts = exchanges.filter((exchange) => (
    matchesSpecAffinityText([exchange.userInput || '', exchange.assistantResponse || ''].join(' '), specAffinityTargets)
    || containsRelevantKeyword(relevanceKeywords, exchange.userInput, exchange.assistantResponse)
  ));

  function flattenToolContextStrings(value: unknown, output: string[] = [], depth: number = 0): string[] {
    if (depth > 2 || value === null || value === undefined) {
      return output;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        output.push(trimmed);
      }
      return output;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        flattenToolContextStrings(item, output, depth + 1);
      }
      return output;
    }

    if (typeof value === 'object') {
      for (const nestedValue of Object.values(value as Record<string, unknown>)) {
        flattenToolContextStrings(nestedValue, output, depth + 1);
      }
    }

    return output;
  }

  function isToolRelevant(tool: CaptureToolCall): boolean {
    if (!specFolderHint) {
      return true;
    }

    const toolTextParts = flattenToolContextStrings({
      title: tool.title || '',
      output: tool.output || '',
      input: tool.input || {},
    });

    if ((tool.input?.filePath && matchesSpecAffinityFilePath(tool.input.filePath, specAffinityTargets))
      || (tool.input?.file_path && matchesSpecAffinityFilePath(tool.input.file_path, specAffinityTargets))
      || (tool.input?.path && matchesSpecAffinityFilePath(tool.input.path, specAffinityTargets))
    ) {
      return true;
    }

    if (toolTextParts.some((part) => matchesSpecAffinityText(part, specAffinityTargets))) {
      return true;
    }

    const safeToolContext = toolTextParts.some((part) => isSafeSpecFallback(currentSpecId, specFolderHint, part));
    return safeToolContext && alignedExchangeTexts.length > 0;
  }

  const filteredToolCalls = specFolderHint
    ? (toolCalls || []).filter(isToolRelevant)
    : (toolCalls || []);

  // F-33: Capture-scoped monotonic counter for deterministic fallback timestamps
  const rawBaseTime = normalizedCapture.capturedAt
    ? new Date(normalizedCapture.capturedAt).getTime()
    : Date.now();
  const captureBaseTime = Number.isFinite(rawBaseTime) ? rawBaseTime : Date.now();
  let monotonicCounter = 0;

  const toSafeISOString = (timestamp?: number | string): string => {
    if (timestamp !== undefined) {
      if (typeof timestamp === 'number' && Number.isFinite(timestamp) && timestamp > 0) {
        const date = new Date(timestamp);
        if (Number.isFinite(date.getTime())) return date.toISOString();
      } else if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (Number.isFinite(date.getTime())) return date.toISOString();
      }
    }
    // Deterministic fallback: base time + counter offset (1ms increments)
    return new Date(captureBaseTime + monotonicCounter++).toISOString();
  };

  const allUserPrompts: NormalizedUserPrompt[] = exchanges.map((ex: CaptureExchange): NormalizedUserPrompt => ({
    prompt: ex.userInput || '',
    timestamp: toSafeISOString(ex.timestamp)
  }));
  let relevanceFallbackUsed = false;

  // RC-2: Filter userPrompts by spec-folder relevance — prevents cross-spec
  // Content from leaking into unrelated memory files. When no keyword match
  // exists, keep only generic/current-spec prompts instead of re-including
  // obviously foreign-spec content.
  const userPrompts: NormalizedUserPrompt[] = (() => {
    if (!specFolderHint || relevanceKeywords.length === 0) return allUserPrompts;
    const filtered = allUserPrompts.filter(p => {
      return containsRelevantKeyword(relevanceKeywords, p.prompt)
        || matchesSpecAffinityText(p.prompt, specAffinityTargets);
    });
    if (filtered.length > 0) {
      return filtered;
    }

    const safeFallback = alignedExchangeTexts.length > 0
      ? allUserPrompts.filter((prompt) =>
      isSafeSpecFallback(currentSpecId, specFolderHint, prompt.prompt)
      )
      : [];
    if (safeFallback.length > 0) {
      structuredLog('warn', 'Spec relevance filter produced no prompt keyword matches — using generic/current-spec prompts only', {
        specFolderHint,
        currentSpecId,
        relevanceKeywordsCount: relevanceKeywords.length,
        totalUserPrompts: allUserPrompts.length,
        retainedUserPrompts: safeFallback.length,
      });
      relevanceFallbackUsed = true;
      return safeFallback;
    }

    structuredLog('warn', 'Spec relevance filter produced no safe user prompt matches', {
      specFolderHint,
      currentSpecId,
      relevanceKeywordsCount: relevanceKeywords.length,
      totalUserPrompts: allUserPrompts.length,
    });
    return [];
  })();

  const observations: Observation[] = [];

  const placeholderPatterns: string[] = [
    '[response]',
    'Assistant processed request',
    'placeholder',
    'simulation mode',
    // API/service error patterns — prevent error messages becoming observations
    'api error:',
    '"type":"error"',
    '"api_error"',
    '"overloaded_error"',
    '"rate_limit_error"',
    'internal server error',
  ];

  for (const ex of exchanges) {
    if (ex.assistantResponse) {
      const lowerResponse: string = ex.assistantResponse.toLowerCase();
      const isPlaceholder: boolean = placeholderPatterns.some((p: string) => lowerResponse.includes(p.toLowerCase()));

      if (!isPlaceholder && ex.assistantResponse.length > 20) {
        // When spec folder hint is provided, skip exchanges whose content
        // Doesn't mention any relevant keyword
        if (specFolderHint && relevanceKeywords.length > 0) {
          const responseRelevant = containsRelevantKeyword(relevanceKeywords, ex.assistantResponse)
            || matchesSpecAffinityText(ex.assistantResponse, specAffinityTargets);
          const inputRelevant = ex.userInput
            ? (
              containsRelevantKeyword(relevanceKeywords, ex.userInput)
              || matchesSpecAffinityText(ex.userInput, specAffinityTargets)
            )
            : false;
          if (!responseRelevant && !inputRelevant) {
            continue; // skip irrelevant exchange
          }
        }

        observations.push({
          type: 'feature',
          title: ex.assistantResponse.substring(0, 80),
          narrative: ex.assistantResponse,
          timestamp: toSafeISOString(ex.timestamp),
          facts: [],
          files: []
        });
      }
    }
  }

  for (const tool of filteredToolCalls) {
    const toolTitle = buildToolObservationTitle(tool);
    const toolObs: Observation = {
      type: tool.tool === 'edit' || tool.tool === 'write' ? 'implementation' : 'observation',
      title: toolTitle,
      narrative: tool.title || `Executed ${tool.tool}`,
      timestamp: toSafeISOString(tool.timestamp),
      facts: [
        `Tool: ${tool.tool}`,
        `Status: ${tool.status}`,
        ...(tool.output ? [`Result: ${tool.output.substring(0, 160)}`] : []),
      ],
      files: []
    };

    if (tool.input && toolObs.files) {
      if (tool.input.filePath) {
        toolObs.files.push(tool.input.filePath);
      } else if (tool.input.file_path) {
        toolObs.files.push(tool.input.file_path);
      } else if (tool.input.path) {
        toolObs.files.push(tool.input.path);
      }
    }

    observations.push(toolObs);
  }

  // RC-2: Build recentContext from relevance-filtered exchanges to prevent
  // Foreign-spec content from propagating into SUMMARY via learning field.
  const relevantExchanges = (specFolderHint && relevanceKeywords.length > 0)
    ? exchanges.filter(ex => {
        return containsRelevantKeyword(relevanceKeywords, ex.userInput, ex.assistantResponse)
          || matchesSpecAffinityText([ex.userInput || '', ex.assistantResponse || ''].join(' '), specAffinityTargets);
      })
    : exchanges;
  const contextExchanges = (() => {
    if (!specFolderHint || relevanceKeywords.length === 0) {
      return relevantExchanges;
    }

    if (relevantExchanges.length > 0) {
      return relevantExchanges;
    }

    const safeFallback = alignedExchangeTexts.length > 0
      ? exchanges.filter((exchange) =>
      isSafeSpecFallback(currentSpecId, specFolderHint, exchange.userInput, exchange.assistantResponse)
      )
      : [];
    if (safeFallback.length > 0) {
      structuredLog('warn', 'Spec relevance filter produced no context keyword matches — using generic/current-spec exchanges only', {
        specFolderHint,
        currentSpecId,
        relevanceKeywordsCount: relevanceKeywords.length,
        totalExchanges: exchanges.length,
        retainedExchanges: safeFallback.length,
      });
      return safeFallback;
    }

    structuredLog('warn', 'Spec relevance filter produced no safe context exchange matches', {
      specFolderHint,
      currentSpecId,
      relevanceKeywordsCount: relevanceKeywords.length,
      totalExchanges: exchanges.length,
    });
    return [];
  })();
  const recentContext: RecentContext[] = contextExchanges.length > 0 ? [{
    request: contextExchanges[0].userInput || sessionTitle || 'OpenCode session',
    learning: contextExchanges[contextExchanges.length - 1]?.assistantResponse || ''
  }] : [];

  const FILES: NormalizedFileEntry[] = [];
  const seenPaths: Set<string> = new Set();

  for (const tool of filteredToolCalls) {
    // Exclude snapshot tool calls from FILES — they inflate capturedFileCount
    // without matching filesystem changes, causing false V10 failures
    if (tool.status === 'snapshot') {
      continue;
    }
    if ((tool.tool === 'edit' || tool.tool === 'write') && tool.input) {
      const filePath: string | undefined = tool.input.filePath || tool.input.file_path || tool.input.path;
      if (filePath && !seenPaths.has(filePath)) {
        seenPaths.add(filePath);
        FILES.push({
          FILE_PATH: filePath,
          DESCRIPTION: tool.title || `${tool.tool === 'write' ? 'Created' : 'Edited'} via ${tool.tool} tool`,
          _provenance: 'tool',
        });
      }
    }
  }

  return {
    userPrompts,
    observations,
    recentContext,
    FILES,
    _source: source,
    _sessionId: normalizedCapture.sessionId,
    _capturedAt: normalizedCapture.capturedAt,
    _toolCallCount: filteredToolCalls.length,
    _sourceTranscriptPath: (() => {
      if (typeof metadata?.file_summary === 'object' && metadata?.file_summary !== null) {
        const summary = metadata.file_summary as Record<string, unknown>;
        const candidate = summary.transcriptPath ?? summary.eventsPath ?? summary.sessionPath;
        if (typeof candidate === 'string') return candidate;
      }
      return undefined;
    })(),
    _sourceSessionId: typeof metadata?._sourceSessionId === 'string'
      ? metadata._sourceSessionId as string
      : normalizedCapture.sessionId,
    _sourceSessionCreated: typeof metadata?._sourceSessionCreated === 'number'
      ? metadata._sourceSessionCreated as number
      : typeof metadata?.session_created === 'number'
        ? metadata.session_created as number
        : undefined,
    _sourceSessionUpdated: typeof metadata?._sourceSessionUpdated === 'number'
      ? metadata._sourceSessionUpdated as number
      : typeof metadata?.session_updated === 'number'
        ? metadata.session_updated as number
        : undefined,
    _relevanceFallback: relevanceFallbackUsed || undefined,
  };
}

// ───────────────────────────────────────────────────────────────
// 9. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  // Primary exports
  transformKeyDecision,
  buildSessionSummaryObservation,
  buildTechnicalContextObservation,
  normalizeInputData,
  validateInputData,
  transformOpencodeCapture,
  // Backwards compatibility alias (camelCase)
  transformOpencodeCapture as transformOpenCodeCapture,
};
