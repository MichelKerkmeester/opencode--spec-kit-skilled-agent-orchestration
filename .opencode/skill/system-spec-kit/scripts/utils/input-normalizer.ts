// ---------------------------------------------------------------
// MODULE: Input Normalizer
// ---------------------------------------------------------------
// Validates, normalizes, and transforms raw input data into structured session format
import { structuredLog } from './logger';

// 1. TYPES

/** Data source type indicating where loaded data came from */
export type DataSource = 'file' | 'opencode-capture' | 'simulation';

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
  SPEC_FOLDER?: string;
  filesModified?: string[];
  sessionSummary?: string;
  keyDecisions?: Array<string | DecisionItemObject>;
  technicalContext?: Record<string, unknown>;
  triggerPhrases?: string[];
  importanceTier?: string;
  FILES?: Array<FileEntry | Record<string, unknown>>;
  observations?: Observation[];
  userPrompts?: UserPrompt[];
  recentContext?: RecentContext[];
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
}

// ---------------------------------------------------------------
// 2. DECISION TRANSFORMATION
// ---------------------------------------------------------------

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

// ---------------------------------------------------------------
// 3. OBSERVATION BUILDERS
// ---------------------------------------------------------------

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

// ---------------------------------------------------------------
// 4. INPUT NORMALIZATION
// ---------------------------------------------------------------

function cloneInputData<T>(data: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(data);
  }

  return JSON.parse(JSON.stringify(data)) as T;
}

function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
  if (data.userPrompts || data.observations || data.recentContext) {
    return cloneInputData(data);
  }

  const normalized: NormalizedData = {
    observations: [],
    userPrompts: [],
    recentContext: [],
  };

  if (data.specFolder || data.SPEC_FOLDER) {
    normalized.SPEC_FOLDER = data.specFolder || data.SPEC_FOLDER;
  }

  if (data.filesModified && Array.isArray(data.filesModified)) {
    normalized.FILES = data.filesModified.map((filePath: string): FileEntry => ({
      FILE_PATH: filePath,
      DESCRIPTION: 'File modified (description pending)'
    }));
  }

  const observations: Observation[] = [];

  if (data.sessionSummary) {
    observations.push(buildSessionSummaryObservation(data.sessionSummary, data.triggerPhrases));
  }

  if (data.keyDecisions && Array.isArray(data.keyDecisions)) {
    for (const decisionItem of data.keyDecisions) {
      const observation = transformKeyDecision(decisionItem);
      if (observation) {
        observations.push(observation);
      }
    }
  }

  if (data.technicalContext && typeof data.technicalContext === 'object') {
    observations.push(buildTechnicalContextObservation(data.technicalContext));
  }

  normalized.observations = observations;

  normalized.userPrompts = [{
    prompt: data.sessionSummary || 'Manual context save',
    timestamp: new Date().toISOString()
  }];

  normalized.recentContext = [{
    request: data.sessionSummary || 'Manual context save',
    learning: data.sessionSummary || ''
  }];

  if (data.triggerPhrases) {
    normalized._manualTriggerPhrases = [...data.triggerPhrases];
  }

  if (data.keyDecisions && Array.isArray(data.keyDecisions)) {
    normalized._manualDecisions = data.keyDecisions.map((decision) => cloneInputData(decision));
  }

  console.log('   \u2713 Transformed manual format to MCP-compatible structure');
  return normalized;
}

// ---------------------------------------------------------------
// 5. INPUT VALIDATION
// ---------------------------------------------------------------

function validateInputData(data: RawInputData, specFolderArg: string | null = null): void {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    throw new Error('Input validation failed: data must be a non-null object');
  }

  if (specFolderArg === null && !data.specFolder && !data.SPEC_FOLDER) {
    if (!data.userPrompts && !data.observations && !data.recentContext) {
      errors.push('Missing required field: specFolder (or use CLI argument)');
    }
  }

  if (data.triggerPhrases !== undefined && !Array.isArray(data.triggerPhrases)) {
    errors.push('triggerPhrases must be an array');
  }

  if (data.keyDecisions !== undefined && !Array.isArray(data.keyDecisions)) {
    errors.push('keyDecisions must be an array');
  }

  if (data.filesModified !== undefined && !Array.isArray(data.filesModified)) {
    errors.push('filesModified must be an array');
  }

  const validTiers: string[] = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
  if (data.importanceTier !== undefined && !validTiers.includes(data.importanceTier)) {
    errors.push(`Invalid importanceTier: ${data.importanceTier}. Valid values: ${validTiers.join(', ')}`);
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

  if (errors.length > 0) {
    throw new Error(`Input validation failed: ${errors.join('; ')}`);
  }

  // Validation passed - function returns void on success, throws on failure
}

// ---------------------------------------------------------------
// 5.5. TOOL OBSERVATION TITLE BUILDER
// ---------------------------------------------------------------

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
      return desc || cmd || 'Bash command';
    }
    default:
      return shortPath ? `${toolName}: ${shortPath}` : `Tool: ${toolName}`;
  }
}

// ---------------------------------------------------------------
// 6. OPENCODE CAPTURE TRANSFORMATION
// ---------------------------------------------------------------

function transformOpencodeCapture(capture: OpencodeCapture, specFolderHint?: string | null): TransformedCapture {
  // RC-10: Normalize snake_case fields from ConversationCapture to camelCase OpencodeCapture.
  // ConversationCapture emits both forms; OpencodeCapture interface only declares camelCase.
  const raw = capture as unknown as Record<string, unknown>;
  const normalizedCapture: OpencodeCapture = {
    exchanges: capture.exchanges,
    toolCalls: capture.toolCalls,
    metadata: capture.metadata,
    sessionTitle: capture.sessionTitle ?? (raw.session_title as string | undefined),
    sessionId: capture.sessionId ?? (raw.session_id as string | undefined),
    capturedAt: capture.capturedAt ?? (raw.captured_at as string | undefined),
  };

  const { exchanges, toolCalls, metadata, sessionTitle } = normalizedCapture;

  // --- Spec-folder relevance filter ---
  // When a spec folder hint is provided, filter tool calls to only those
  // whose file paths relate to the target spec folder. This prevents
  // unrelated session content (e.g., from prior conversations in the same
  // OpenCode session) from polluting the memory file.
  const relevanceKeywords: string[] = [];
  if (specFolderHint) {
    // Extract keywords from the spec folder path for relevance matching
    // e.g., "02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog"
    // yields segments like "feature-catalog", "hybrid-rag-fusion", "system-spec-kit"
    const segments = specFolderHint.split('/').map(s => s.replace(/^\d+--?/, ''));
    relevanceKeywords.push(...segments.filter(s => s.length > 2));
    // Also include the full path for direct substring matching
    relevanceKeywords.push(specFolderHint);
  }

  function isToolRelevant(tool: CaptureToolCall): boolean {
    if (relevanceKeywords.length === 0) return true; // no filter
    const filePath = tool.input?.filePath || tool.input?.file_path || tool.input?.path || '';
    const title = tool.title || '';
    const combined = `${filePath} ${title}`.toLowerCase();
    return relevanceKeywords.some(kw => combined.includes(kw.toLowerCase()));
  }

  const filteredToolCalls = specFolderHint
    ? (toolCalls || []).filter(isToolRelevant)
    : (toolCalls || []);

  const toSafeISOString = (timestamp?: number | string): string => {
    if (timestamp === undefined) {
      return new Date().toISOString();
    }

    if (typeof timestamp === 'number' && (!Number.isFinite(timestamp) || timestamp < 0)) {
      return new Date().toISOString();
    }

    const date = new Date(timestamp);
    return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
  };

  const allUserPrompts: UserPrompt[] = exchanges.map((ex: CaptureExchange): UserPrompt => ({
    prompt: ex.userInput || '',
    timestamp: toSafeISOString(ex.timestamp)
  }));

  // RC-2: Filter userPrompts by spec-folder relevance — prevents cross-spec
  // content (e.g., SGQS/skill-graphs) from leaking into unrelated memory files.
  // Falls back to all prompts when no keyword match is found, because generic
  // prompts ("continue from previous work") are common and losing them erases
  // the entire conversation timeline (extractConversations iterates userPrompts).
  const userPrompts: UserPrompt[] = (() => {
    if (!specFolderHint || relevanceKeywords.length === 0) return allUserPrompts;
    const filtered = allUserPrompts.filter(p => {
      const lower = p.prompt.toLowerCase();
      return relevanceKeywords.some(kw => lower.includes(kw.toLowerCase()));
    });
    if (filtered.length === 0) {
      structuredLog('warn', 'Spec relevance filter produced no user prompt matches — using all prompts', {
        specFolderHint,
        relevanceKeywordsCount: relevanceKeywords.length,
        totalUserPrompts: allUserPrompts.length
      });
      return allUserPrompts;
    }
    return filtered;
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
        // doesn't mention any relevant keyword
        if (specFolderHint && relevanceKeywords.length > 0) {
          const responseRelevant = relevanceKeywords.some(kw =>
            lowerResponse.includes(kw.toLowerCase())
          );
          const inputRelevant = ex.userInput
            ? relevanceKeywords.some(kw => ex.userInput!.toLowerCase().includes(kw.toLowerCase()))
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
      facts: [`Tool: ${tool.tool}`, `Status: ${tool.status}`],
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
  // foreign-spec content from propagating into SUMMARY via learning field.
  const relevantExchanges = (specFolderHint && relevanceKeywords.length > 0)
    ? exchanges.filter(ex => {
        const combined = `${ex.userInput || ''} ${ex.assistantResponse || ''}`.toLowerCase();
        return relevanceKeywords.some(kw => combined.includes(kw.toLowerCase()));
      })
    : exchanges;
  const contextExchanges = (() => {
    if (specFolderHint && relevanceKeywords.length > 0 && relevantExchanges.length === 0) {
      structuredLog('warn', 'Spec relevance filter produced no context exchange matches', {
        specFolderHint,
        relevanceKeywordsCount: relevanceKeywords.length,
        totalExchanges: exchanges.length
      });
    }
    return relevantExchanges;
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
    _source: 'opencode-capture',
    _sessionId: normalizedCapture.sessionId,
    _capturedAt: normalizedCapture.capturedAt
  };
}

// ---------------------------------------------------------------
// 7. EXPORTS
// ---------------------------------------------------------------

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
