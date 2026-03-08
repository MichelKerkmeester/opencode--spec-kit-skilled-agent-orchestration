// ---------------------------------------------------------------
// MODULE: Input Normalizer
// ---------------------------------------------------------------
// Validates, normalizes, and transforms raw input data into structured session format

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
  alternatives?: string[];
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
    alternatives = decisionItem.alternatives || [];

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
      confidence: 75
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

function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
  if (data.userPrompts || data.observations || data.recentContext) {
    return data;
  }

  const normalized: NormalizedData = {
    observations: [],
    userPrompts: [],
    recentContext: [],
  };

  if (data.specFolder) {
    normalized.SPEC_FOLDER = data.specFolder;
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
    normalized._manualTriggerPhrases = data.triggerPhrases;
  }

  if (data.keyDecisions && Array.isArray(data.keyDecisions)) {
    normalized._manualDecisions = data.keyDecisions;
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
// 6. OPENCODE CAPTURE TRANSFORMATION
// ---------------------------------------------------------------

function transformOpencodeCapture(capture: OpencodeCapture, specFolderHint?: string | null): TransformedCapture {
  const { exchanges, toolCalls, metadata, sessionTitle } = capture;

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

  const userPrompts: UserPrompt[] = exchanges.map((ex: CaptureExchange): UserPrompt => ({
    prompt: ex.userInput || '',
    timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString()
  }));

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
          timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString(),
          facts: [],
          files: []
        });
      }
    }
  }

  for (const tool of filteredToolCalls) {
    const toolObs: Observation = {
      type: tool.tool === 'edit' || tool.tool === 'write' ? 'implementation' : 'observation',
      title: `Tool: ${tool.tool}`,
      narrative: tool.title || `Executed ${tool.tool}`,
      timestamp: tool.timestamp ? new Date(tool.timestamp).toISOString() : new Date().toISOString(),
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

  const recentContext: RecentContext[] = exchanges.length > 0 ? [{
    request: exchanges[0].userInput || sessionTitle || 'OpenCode session',
    learning: exchanges[exchanges.length - 1]?.assistantResponse || ''
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
    _sessionId: capture.sessionId,
    _capturedAt: capture.capturedAt
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
