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
  matchesSpecAffinityFilePath,
  matchesSpecAffinityText,
  normalizeText,
} from './spec-affinity';

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

/** A single observation record produced by transformation */
export interface Observation {
  type: string;
  title: string;
  narrative: string;
  facts: string[];
  timestamp?: string;
  files?: string[];
  _manualDecision?: {
    fullText: string;
    chosenApproach: string;
    confidence: number;
  };
}

/** A user prompt record */
export interface UserPrompt {
  prompt: string;
  timestamp: string;
}

/** A recent context entry */
export interface RecentContext {
  request: string;
  learning: string;
}

/** A file entry in the FILES array */
export interface FileEntry {
  FILE_PATH: string;
  DESCRIPTION: string;
}

/** Raw input data that may be in manual or MCP-compatible format */
export interface RawInputData {
  specFolder?: string;
  spec_folder?: string;
  SPEC_FOLDER?: string;
  filesModified?: string[];
  files_modified?: string[];
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
  FILES?: Array<FileEntry | Record<string, unknown>>;
  observations?: Observation[];
  userPrompts?: UserPrompt[];
  user_prompts?: UserPrompt[];
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
  FILES?: FileEntry[];
  observations: Observation[];
  userPrompts: UserPrompt[];
  recentContext: RecentContext[];
  _manualTriggerPhrases?: string[];
  _manualDecisions?: Array<string | DecisionItemObject>;
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
  status?: string;
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
  userPrompts: UserPrompt[];
  observations: Observation[];
  recentContext: RecentContext[];
  FILES: FileEntry[];
  _source: DataSource;
  _sessionId?: string;
  _capturedAt?: string;
  _toolCallCount?: number;
}

// ───────────────────────────────────────────────────────────────
// 3. DECISION TRANSFORMATION
// ───────────────────────────────────────────────────────────────
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
    alternatives = (decisionItem.alternatives || []).map(alt =>
      typeof alt === 'string' ? alt : (alt as Record<string, unknown>).label as string || (alt as Record<string, unknown>).title as string || (alt as Record<string, unknown>).name as string || JSON.stringify(alt)
    );

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
    ? titleMatch[1].substring(0, 80).trim()
    : decisionText.substring(0, 80).trim();

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
function buildSessionSummaryObservation(summary: string, triggerPhrases: string[] = []): Observation {
  const summaryTitle: string = summary.length > 100
    ? summary.substring(0, 100).replace(/\s+\S*$/, '') + '...'
    : summary;

  return {
    type: 'feature',
    title: summaryTitle,
    narrative: summary,
    facts: triggerPhrases
  };
}

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
      cloned.FILES = cloned.FILES.map((f) => {
        const entry = f as unknown as Record<string, unknown>;
        return {
          FILE_PATH: (entry.FILE_PATH || entry.path || '') as string,
          DESCRIPTION: (entry.DESCRIPTION || entry.description || 'Modified during session') as string,
        };
      });
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
  if (filesModified.length > 0) {
    normalized.FILES = filesModified.map((entry: string | { path?: string; changes_summary?: string }) => {
      let filePath: string;
      let changesSummary: string;
      if (typeof entry === 'string') {
        // P0-2: Parse "path - description" compound format
        const sepIdx = entry.indexOf(' - ');
        if (sepIdx > 0 && (entry.substring(0, sepIdx).includes('.') || entry.substring(0, sepIdx).includes('/'))) {
          filePath = entry.substring(0, sepIdx).trim();
          changesSummary = entry.substring(sepIdx + 3).trim();
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
      return { FILE_PATH: filePath, DESCRIPTION: description };
    });
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
  }

  if (nextSteps.length > 0) {
    observations.push(buildNextStepsObservation(nextSteps));
  }

  normalized.observations = observations;

  normalized.userPrompts = [{
    prompt: sessionSummary || 'Manual context save',
    timestamp: new Date().toISOString()
  }];

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

  console.log('   \u2713 Transformed manual format to MCP-compatible structure');
  return normalized;
}

// ───────────────────────────────────────────────────────────────
// 6. INPUT VALIDATION
// ───────────────────────────────────────────────────────────────
function validateInputData(data: RawInputData, specFolderArg: string | null = null): void {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    throw new Error('Input validation failed: data must be a non-null object');
  }

  if (specFolderArg === null && !data.specFolder && !data.spec_folder && !data.SPEC_FOLDER) {
    if (!data.userPrompts && !data.user_prompts && !data.observations && !data.recentContext && !data.recent_context) {
      errors.push('Missing required field: specFolder (or use CLI argument)');
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
        } else if (!(file as FileEntry).FILE_PATH && !(file as Record<string, unknown>).path) {
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

// 5.5. TOOL OBSERVATION TITLE BUILDER
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

function buildSpecRelevanceKeywords(specFolderHint?: string | null): string[] {
  if (!specFolderHint) return [];

  const keywords = new Set<string>();
  const segments = specFolderHint
    .split('/')
    .map((segment) => segment.replace(/^\d+--?/, '').trim())
    .filter(Boolean);

  for (const segment of segments) {
    const normalizedSegment = normalizeText(segment);
    if (normalizedSegment.length > 2) {
      keywords.add(normalizedSegment);
    }

    for (const token of normalizedSegment.split(' ')) {
      if (token.length > 2) {
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

const SPEC_ID_REGEX = /\b\d{3}-[a-z0-9][a-z0-9-]*\b/g;

function extractSpecIds(value: string): string[] {
  return Array.from(new Set((value.match(SPEC_ID_REGEX) || []).map((specId) => specId.toLowerCase())));
}

function getCurrentSpecId(specFolderHint?: string | null): string | null {
  if (!specFolderHint) {
    return null;
  }

  const specIds = extractSpecIds(specFolderHint);
  return specIds.at(-1) || null;
}

function isSafeSpecFallback(currentSpecId: string | null, ...parts: Array<string | undefined>): boolean {
  const discoveredIds = extractSpecIds(parts.filter(Boolean).join(' '));
  if (discoveredIds.length === 0) {
    return true;
  }

  return currentSpecId !== null && discoveredIds.every((specId) => specId === currentSpecId);
}

// ───────────────────────────────────────────────────────────────
// 7. OPENCODE CAPTURE TRANSFORMATION
// ───────────────────────────────────────────────────────────────
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

    const safeToolContext = toolTextParts.some((part) => isSafeSpecFallback(currentSpecId, part));
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

  const allUserPrompts: UserPrompt[] = exchanges.map((ex: CaptureExchange): UserPrompt => ({
    prompt: ex.userInput || '',
    timestamp: toSafeISOString(ex.timestamp)
  }));

  // RC-2: Filter userPrompts by spec-folder relevance — prevents cross-spec
  // Content from leaking into unrelated memory files. When no keyword match
  // exists, keep only generic/current-spec prompts instead of re-including
  // obviously foreign-spec content.
  const userPrompts: UserPrompt[] = (() => {
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
      isSafeSpecFallback(currentSpecId, prompt.prompt)
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
    'simulation mode'
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
      isSafeSpecFallback(currentSpecId, exchange.userInput, exchange.assistantResponse)
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

  const FILES: FileEntry[] = [];
  const seenPaths: Set<string> = new Set();

  for (const tool of filteredToolCalls) {
    if ((tool.tool === 'edit' || tool.tool === 'write') && tool.input) {
      const filePath: string | undefined = tool.input.filePath || tool.input.file_path || tool.input.path;
      if (filePath && !seenPaths.has(filePath)) {
        seenPaths.add(filePath);
        FILES.push({
          FILE_PATH: filePath,
          DESCRIPTION: tool.title || `${tool.tool === 'write' ? 'Created' : 'Edited'} via ${tool.tool} tool`
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
  };
}

// ───────────────────────────────────────────────────────────────
// 8. EXPORTS
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
