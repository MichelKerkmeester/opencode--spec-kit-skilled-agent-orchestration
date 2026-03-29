// TEST: Task Enrichment Guardrails
// Ensures stateless-only enrichment for generic task labels
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateContentSlug, isContaminatedMemoryName, isGenericContentTask, pickBestContentName } from '../utils/slug-utils';
import { normalizeSpecTitleForMemory, pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';
import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
import { createFilterPipeline } from '../lib/content-filter';
import type { SessionData } from '../types/session-types';
import { collectSessionData } from '../extractors/collect-session-data';
import { populateTemplate } from '../renderers';

const workflowHarness = vi.hoisted(() => ({
  specFolderPath: '',
  contextDir: '',
  writtenFiles: [] as Array<{ contextDir: string; files: Record<string, string> }>,
  loaderSnapshots: [] as Array<{ dataFile: string | null; specFolderArg: string | null }>,
  detectSnapshots: [] as Array<{ specFolderArg: string | null }>,
  loaderDataWithFile: null as Record<string, unknown> | null,
  loaderDataWithoutFile: null as Record<string, unknown> | null,
}));
const qualityHarness = vi.hoisted(() => ({
  legacyResult: {
    score: 100,
    score01: 1,
    score100: 100,
    qualityScore: 1,
    warnings: [] as string[],
    qualityFlags: [] as string[],
    hadContamination: false,
    dimensions: [] as Array<Record<string, unknown>>,
    breakdown: {
      triggerPhrases: 20,
      keyTopics: 15,
      fileDescriptions: 20,
      contentLength: 15,
      noLeakedTags: 15,
      observationDedup: 15,
    },
    insufficiency: null,
  },
  v2Result: {
    score: 100,
    score01: 1,
    score100: 100,
    qualityScore: 1,
    warnings: [] as string[],
    qualityFlags: [] as string[],
    hadContamination: false,
    dimensions: [] as Array<Record<string, unknown>>,
    insufficiency: null,
  },
}));
const evaluateMemorySufficiencyMock = vi.hoisted(() => vi.fn(() => ({
  pass: true,
  rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT' as const,
  reasons: [],
  evidenceCounts: {
    primary: 2,
    support: 2,
    total: 4,
    semanticChars: 420,
    uniqueWords: 72,
    anchors: 2,
    triggerPhrases: 4,
  },
  score: 0.92,
})));

vi.mock('../spec-folder', () => ({
  detectSpecFolder: vi.fn(async (_collectedData: unknown, options?: { specFolderArg?: string | null }) => {
    workflowHarness.detectSnapshots.push({
      specFolderArg: options?.specFolderArg ?? null,
    });
    return workflowHarness.specFolderPath;
  }),
  setupContextDirectory: vi.fn(async () => workflowHarness.contextDir),
}));

vi.mock('../extractors', () => ({
  extractConversations: vi.fn(async () => ({
    MESSAGES: [{ TIMESTAMP: '2026-03-06T09:00:00Z', ROLE: 'User', CONTENT: 'Development session', TOOL_CALLS: [] }],
    MESSAGE_COUNT: 1,
    DURATION: '1m',
    FLOW_PATTERN: 'linear',
    PHASE_COUNT: 0,
    PHASES: [],
    AUTO_GENERATED_FLOW: '',
    TOOL_COUNT: 0,
    DATE: '06-03-26',
  })),
  extractDecisions: vi.fn(async () => ({
    DECISIONS: [],
    DECISION_COUNT: 0,
    HIGH_CONFIDENCE_COUNT: 0,
    MEDIUM_CONFIDENCE_COUNT: 0,
    LOW_CONFIDENCE_COUNT: 0,
    FOLLOWUP_COUNT: 0,
  })),
  extractDiagrams: vi.fn(async () => ({
    DIAGRAMS: [],
    DIAGRAM_COUNT: 0,
    HAS_AUTO_GENERATED: false,
    FLOW_TYPE: 'linear',
    AUTO_CONVERSATION_FLOWCHART: '',
    AUTO_DECISION_TREES: [],
    AUTO_FLOW_COUNT: 0,
    AUTO_DECISION_COUNT: 0,
    DIAGRAM_TYPES: [],
    PATTERN_SUMMARY: [],
  })),
  extractPhasesFromData: vi.fn(() => []),
  enhanceFilesWithSemanticDescriptions: vi.fn((files) => files),
}));

vi.mock('../renderers', () => ({
  populateTemplate: vi.fn(async (_templateName: string, data: Record<string, unknown>) => [
    '---',
    `title: "${String(data.MEMORY_TITLE ?? 'Test Memory')}"`,
    'description: "Workflow seam regression content preserved for testing."',
    String(data.TRIGGER_PHRASES_YAML ?? 'trigger_phrases: []'),
    'importance_tier: "normal"',
    'contextType: "implementation"',
    `_sourceTranscriptPath: "${String(data.SOURCE_TRANSCRIPT_PATH ?? '')}"`,
    `_sourceSessionId: "${String(data.SOURCE_SESSION_ID ?? '')}"`,
    `captured_file_count: ${String(data.CAPTURED_FILE_COUNT ?? 0)}`,
    `filesystem_file_count: ${String(data.FILESYSTEM_FILE_COUNT ?? 0)}`,
    `git_changed_file_count: ${String(data.GIT_CHANGED_FILE_COUNT ?? 0)}`,
    '---',
    '',
    `# ${String(data.MEMORY_TITLE ?? 'Test Memory')}`,
    '',
    '## SESSION SUMMARY',
    '',
    '| **Meta Data** | **Value** |',
    '|:--------------|:----------|',
    '| Total Messages | 1 |',
    '',
    '<!-- ANCHOR:continue-session -->',
    '<a id="continue-session"></a>',
    '',
    '## CONTINUE SESSION',
    '',
    'Resume this workflow test.',
    '',
    '<!-- ANCHOR:project-state-snapshot -->',
    '<a id="project-state-snapshot"></a>',
    '',
    '## PROJECT STATE SNAPSHOT',
    '',
    'Current regression state.',
    '',
    '<!-- ANCHOR:decisions -->',
    '<a id="decisions"></a>',
    '',
    '## 2. DECISIONS',
    '',
    'No decisions recorded.',
    '',
    '<!-- ANCHOR:session-history -->',
    '<a id="conversation"></a>',
    '',
    '## 3. CONVERSATION',
    '',
    'Single workflow seam regression message.',
    '',
    '<!-- ANCHOR:recovery-hints -->',
    '<a id="recovery-hints"></a>',
    '',
    '## RECOVERY HINTS',
    '',
    'No recovery hints required.',
    '',
    '<!-- ANCHOR:metadata -->',
    '<a id="memory-metadata"></a>',
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    'session_id: "test-session"',
    '```',
    '',
    '<!-- /ANCHOR:metadata -->',
    '',
    'Workflow seam regression content.',
  ].join('\n')),
}));

vi.mock('../core/file-writer', () => ({
  writeFilesAtomically: vi.fn(async (contextDir: string, files: Record<string, string>) => {
    workflowHarness.writtenFiles.push({ contextDir, files });
    return Object.keys(files);
  }),
}));

vi.mock('../loaders/data-loader', () => ({
  loadCollectedData: vi.fn(async (options?: { dataFile?: string | null; specFolderArg?: string | null }) => {
    workflowHarness.loaderSnapshots.push({
      dataFile: options?.dataFile ?? null,
      specFolderArg: options?.specFolderArg ?? null,
    });

    if (options?.dataFile) {
      return workflowHarness.loaderDataWithFile ?? {
        _source: 'file',
        userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:00:00Z' }],
      };
    }

    return workflowHarness.loaderDataWithoutFile ?? {
      _source: 'opencode-capture',
      userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:01:00Z' }],
    };
  }),
}));

vi.mock('../core/quality-scorer', () => ({
  scoreMemoryQuality: vi.fn(() => qualityHarness.legacyResult),
}));

vi.mock('../extractors/quality-scorer', () => ({
  scoreMemoryQuality: vi.fn(() => qualityHarness.v2Result),
}));

vi.mock('../lib/semantic-summarizer', () => ({
  generateImplementationSummary: vi.fn(() => ({
    task: 'Development session',
    solution: 'Implementation and updates',
    filesCreated: [],
    filesModified: [],
    decisions: [],
    outcomes: ['Session completed'],
    triggerPhrases: [],
    messageStats: {
      intent: 1,
      plan: 0,
      implementation: 0,
      result: 0,
      decision: 0,
      total: 1,
    },
  })),
  formatSummaryAsMarkdown: vi.fn(() => '## Implementation Summary'),
  buildWeightedEmbeddingSections: vi.fn(() => []),
  extractFileChanges: vi.fn(() => new Map()),
}));

vi.mock('../core/tree-thinning', () => ({
  applyTreeThinning: vi.fn(() => ({
    thinned: [],
    merged: [],
    stats: { totalFiles: 0, thinnedCount: 0, mergedCount: 0, tokensSaved: 0 },
  })),
}));

vi.mock('../core/memory-indexer', () => ({
  indexMemory: vi.fn(async () => null),
  updateMetadataEmbeddingStatus: vi.fn(async () => undefined),
}));

vi.mock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
  MEMORY_SUFFICIENCY_REJECTION_CODE: 'INSUFFICIENT_CONTEXT_ABORT',
  evaluateMemorySufficiency: evaluateMemorySufficiencyMock,
}));

vi.mock('@spec-kit/mcp-server/api/providers', () => ({
  retryManager: {
    getRetryStats: () => ({ queue_size: 0 }),
    processRetryQueue: vi.fn(async () => ({ processed: 0, succeeded: 0, failed: 0 })),
  },
}));

function createSessionData(specFolderName: string): SessionData {
  return {
    TITLE: 'Memory Search Bug Fixes',
    DATE: '06-03-26',
    TIME: '09-00',
    SPEC_FOLDER: specFolderName,
    DURATION: '1m',
    SUMMARY: 'Workflow seam regression test summary.',
    FILES: [],
    HAS_FILES: false,
    FILE_COUNT: 0,
    CAPTURED_FILE_COUNT: 0,
    FILESYSTEM_FILE_COUNT: 0,
    GIT_CHANGED_FILE_COUNT: 0,
    OUTCOMES: [{ OUTCOME: 'Session completed', TYPE: 'status' }],
    TOOL_COUNT: 0,
    MESSAGE_COUNT: 1,
    QUICK_SUMMARY: 'Workflow seam regression test',
    SKILL_VERSION: '1.7.2',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    SESSION_ID: 'session-test',
    CHANNEL: 'test',
    IMPORTANCE_TIER: 'normal',
    CONTEXT_TYPE: 'implementation',
    CREATED_AT_EPOCH: 0,
    LAST_ACCESSED_EPOCH: 0,
    EXPIRES_AT_EPOCH: 0,
    TOOL_COUNTS: { Read: 0, Write: 0, Edit: 0, Bash: 0, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
    DECISION_COUNT: 0,
    ACCESS_COUNT: 0,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 0,
    PROJECT_PHASE: 'implementation',
    ACTIVE_FILE: '',
    LAST_ACTION: 'Testing workflow seam',
    NEXT_ACTION: 'Assert filename output',
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
    LEARNING_SUMMARY: 'Workflow seam regression test has no learning delta.',
    GAPS_CLOSED: [],
    NEW_GAPS: [],
    CONTINUATION_COUNT: 0,
    NEXT_CONTINUATION_COUNT: 1,
    LAST_ACTIVITY_TIMESTAMP: '2026-03-06T09:00:00Z',
    SESSION_DURATION: '1m',
    SESSION_STATUS: 'IN_PROGRESS',
    COMPLETION_PERCENT: 100,
    PENDING_TASKS: [],
    RESUME_CONTEXT: [],
    CONTEXT_SUMMARY: '',
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

function createDeferred<T = void>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
} {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

beforeEach(() => {
  vi.clearAllMocks();
  evaluateMemorySufficiencyMock.mockReset();
  evaluateMemorySufficiencyMock.mockReturnValue({
    pass: true,
    rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT',
    reasons: [],
    evidenceCounts: {
      primary: 2,
      support: 2,
      total: 4,
      semanticChars: 420,
      uniqueWords: 72,
      anchors: 2,
      triggerPhrases: 4,
    },
    score: 0.92,
  });
  workflowHarness.writtenFiles = [];
  workflowHarness.loaderSnapshots = [];
  workflowHarness.detectSnapshots = [];
  workflowHarness.loaderDataWithFile = null;
  workflowHarness.loaderDataWithoutFile = null;
  qualityHarness.legacyResult = {
    score: 100,
    score01: 1,
    score100: 100,
    qualityScore: 1,
    warnings: [],
    qualityFlags: [],
    hadContamination: false,
    dimensions: [],
    breakdown: {
      triggerPhrases: 20,
      keyTopics: 15,
      fileDescriptions: 20,
      contentLength: 15,
      noLeakedTags: 15,
      observationDedup: 15,
    },
    insufficiency: null,
  };
  qualityHarness.v2Result = {
    score: 100,
    score01: 1,
    score100: 100,
    qualityScore: 1,
    warnings: [],
    qualityFlags: [],
    hadContamination: false,
    dimensions: [],
    insufficiency: null,
  };
});

afterEach(() => {
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
});

const GENERIC_TASKS = [
  'Development session',
  'Session summary',
  'Session context',
  'Session',
  'Context',
  'Implementation',
  'Work session',
  'Implementation and updates',
];

describe('isGenericContentTask', () => {
  it('marks known generic task labels as generic', () => {
    for (const task of GENERIC_TASKS) {
      expect(isGenericContentTask(task)).toBe(true);
    }
  });

  it('does not mark specific tasks as generic', () => {
    expect(isGenericContentTask('Generic memory filename fix in stateless mode')).toBe(false);
    expect(isGenericContentTask('Architecture boundary remediation')).toBe(false);
  });
});

describe('isContaminatedMemoryName', () => {
  it('detects leaked template and instructional titles', () => {
    expect(isContaminatedMemoryName('To promote a memory to constitutional tier (always surfaced):')).toBe(true);
    expect(isContaminatedMemoryName('Epistemic state captured at session start for learning delta calculation.')).toBe(true);
    expect(isContaminatedMemoryName('Architecture boundary remediation')).toBe(false);
  });
});

describe('shouldEnrichTaskFromSpecTitle', () => {
  it('blocks enrichment in JSON data mode', () => {
    expect(shouldEnrichTaskFromSpecTitle('Development session', 'file', null)).toBe(false);
    expect(shouldEnrichTaskFromSpecTitle('Development session', 'opencode-capture', '/tmp/context.json')).toBe(false);
  });

  it('allows enrichment in stateless mode for generic tasks', () => {
    expect(shouldEnrichTaskFromSpecTitle('Development session', 'opencode-capture', null)).toBe(true);
    expect(shouldEnrichTaskFromSpecTitle('Session context', 'simulation', null)).toBe(true);
  });

  it('skips enrichment for specific tasks even in stateless mode', () => {
    expect(shouldEnrichTaskFromSpecTitle('Architecture boundary remediation', 'opencode-capture', null)).toBe(false);
  });
});

describe('normalizeSpecTitleForMemory', () => {
  it('strips spec-style prefixes and template suffixes from frontmatter titles', () => {
    expect(normalizeSpecTitleForMemory('Spec: Generic Memory Filename Fix in Stateless Mode'))
      .toBe('Generic Memory Filename Fix in Stateless Mode');
    expect(normalizeSpecTitleForMemory('Feature Specification: Session Handover [template:spec.md]'))
      .toBe('Session Handover');
  });

  it('strips markdown heading noise and trailing punctuation', () => {
    expect(normalizeSpecTitleForMemory('# Spec: Hybrid Search Relevance Drift;'))
      .toBe('Hybrid Search Relevance Drift');
  });
});

describe('slug outcome guardrail', () => {
  const folderBase = 'hybrid-rag-fusion';
  const genericTask = 'Development session';
  const prefixedSpecTitle = 'Spec: Generic Memory Filename Fix in Stateless Mode';
  const normalizedSpecTitle = normalizeSpecTitleForMemory(prefixedSpecTitle);

  it('keeps JSON mode behavior unchanged', () => {
    const taskForSlug = shouldEnrichTaskFromSpecTitle(genericTask, 'file', '/tmp/context.json')
      ? normalizedSpecTitle
      : genericTask;
    expect(generateContentSlug(taskForSlug, folderBase)).toBe('hybrid-rag-fusion');
  });

  it('normalizes spec-prefixed frontmatter titles before slug generation', () => {
    expect(generateContentSlug(normalizedSpecTitle, folderBase)).toBe('generic-memory-filename-fix-in-stateless-mode');
  });

  it('uses spec-derived task in stateless mode', () => {
    const taskForSlug = shouldEnrichTaskFromSpecTitle(genericTask, 'opencode-capture', null)
      ? normalizedSpecTitle
      : genericTask;
    expect(generateContentSlug(taskForSlug, folderBase)).toBe('generic-memory-filename-fix-in-stateless-mode');
  });

  it('keeps slug fallback in sync with generic-task classification', () => {
    for (const task of GENERIC_TASKS) {
      expect(generateContentSlug(task, folderBase)).toBe(folderBase);
    }
  });

  it('falls back for JSON mode implementation-and-updates', () => {
    const taskForSlug = shouldEnrichTaskFromSpecTitle('Implementation and updates', 'file', '/tmp/context.json')
      ? normalizedSpecTitle
      : 'Implementation and updates';
    expect(generateContentSlug(taskForSlug, folderBase)).toBe(folderBase);
  });

  it('uses enriched spec title for stateless implementation-and-updates', () => {
    const taskForSlug = shouldEnrichTaskFromSpecTitle('Implementation and updates', 'opencode-capture', null)
      ? normalizedSpecTitle
      : 'Implementation and updates';
    expect(generateContentSlug(taskForSlug, folderBase)).toBe('generic-memory-filename-fix-in-stateless-mode');
  });

  it('ignores contaminated task text and prefers specific alternatives', () => {
    expect(generateContentSlug(
      'To promote a memory to constitutional tier (always surfaced):',
      folderBase,
      ['Hybrid search relevance drift remediation']
    )).toBe('hybrid-search-relevance-drift-remediation');
  });

  it('strips literal mustache tokens from candidate titles before slug generation', () => {
    expect(generateContentSlug(
      'How `{{TRIGGER_PHRASES}}` is used later in the template',
      folderBase
    )).toBe('how-is-used-later-in-the-template');
  });

  it('picks the best specific memory task from task, spec title, and folder base', () => {
    expect(pickPreferredMemoryTask(
      'To promote a memory to constitutional tier (always surfaced):',
      'Spec: Hybrid Search Relevance Drift Remediation',
      folderBase
    )).toBe('Hybrid Search Relevance Drift Remediation');
  });

  it('prefers specific session semantics over folder fallback when task and spec title are unusable', () => {
    expect(pickPreferredMemoryTask(
      'Development session',
      'Spec: To promote a memory to constitutional tier (always surfaced)',
      folderBase,
      ['Hybrid RAG fusion recall regression audit']
    )).toBe('Hybrid RAG fusion recall regression audit');
  });

  it('skips spec title fallback in file-backed mode and preserves other specific candidates', () => {
    expect(pickPreferredMemoryTask(
      'Development session',
      'Spec: Generic Memory Filename Fix in Stateless Mode',
      folderBase,
      ['Hybrid RAG fusion recall regression audit'],
      false
    )).toBe('Hybrid RAG fusion recall regression audit');
  });

  it('falls back to the folder base when file-backed mode has no usable candidates', () => {
    expect(pickPreferredMemoryTask(
      'Development session',
      'Spec: Generic Memory Filename Fix in Stateless Mode',
      folderBase,
      [],
      false
    )).toBe(folderBase);
  });

  it('returns the first non-generic, non-contaminated content name', () => {
    expect(pickBestContentName([
      'Implementation and updates',
      'To promote a memory to constitutional tier (always surfaced):',
      'Hybrid Search Relevance Drift Remediation',
    ])).toBe('Hybrid Search Relevance Drift Remediation');
  });
});

describe('memory quality lint gate', () => {
  function buildMemoryContent(overrides: {
    title?: string;
    specFolder?: string;
    toolCount?: number;
    triggerPhrases?: string[];
    capturedFileCount?: number;
    filesystemFileCount?: number;
    gitChangedFileCount?: number;
    body?: string[];
  } = {}): string {
    const triggerLines = (overrides.triggerPhrases ?? ['memory audit', 'lint gate'])
      .map((phrase) => `  - "${phrase}"`)
      .join('\n');

    return [
      '---',
      `title: "${overrides.title ?? 'Memory Audit Naming Fix'}"`,
      `spec_folder: "${overrides.specFolder ?? '022-hybrid-rag-fusion/013-memory-search-bug-fixes'}"`,
      `captured_file_count: ${String(overrides.capturedFileCount ?? 2)}`,
      `filesystem_file_count: ${String(overrides.filesystemFileCount ?? 2)}`,
      `git_changed_file_count: ${String(overrides.gitChangedFileCount ?? 1)}`,
      '---',
      '# Memory Audit Naming Fix',
      '',
      '## SESSION SUMMARY',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      `| Tool Executions | ${String(overrides.toolCount ?? 2)} |`,
      '',
      '## PREFLIGHT BASELINE',
      '| Metric | Value | Assessment |',
      '|--------|-------|------------|',
      '| Knowledge Score | 40/100 | moderate |',
      '| Uncertainty Score | 50/100 | elevated |',
      '| Context Score | 45/100 | partial |',
      '| Timestamp | 2026-03-06T09:00:00Z | Session start |',
      '',
      '**Initial Gaps Identified:**',
      '- No significant gaps identified at session start',
      '',
      '**Dual-Threshold Status at Start:**',
      '- Confidence: 60%',
      '- Uncertainty: 50',
      '- Readiness: Needs targeted follow-up',
      '',
      '## CONVERSATION',
      '**Tool: Read**',
      'Inspected `scripts/core/workflow.ts` and `scripts/lib/validate-memory-quality.ts`.',
      '',
      '## MEMORY METADATA',
      '```yaml',
      `tool_count: ${String(overrides.toolCount ?? 2)}`,
      'trigger_phrases:',
      triggerLines,
      '```',
      '',
      ...(overrides.body ?? ['Aligned lint rules with 013-memory-search-bug-fixes and 022-hybrid-rag-fusion.']),
    ].join('\n');
  }

  it('fails placeholder leakage for obvious empty generated values', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      body: [
        '| Knowledge Score | /100 | moderate |',
        '- Confidence: %',
        '- Readiness: ',
      ],
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V6');
  });

  it('does not treat quoted template tokens in session content as V6 leakage', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      body: [
        'Documented the render fix for the literal token `{{TRIGGER_PHRASES}}` so debugging notes can mention it safely.',
        'The old banner phrase was discussed in prose, but it did not render as the memory title or heading.',
      ],
    }));

    expect(result.failedRules).not.toContain('V6');
  });

  it('fails when tool_count is zero but execution evidence is present', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({ toolCount: 0 }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V7');
  });

  it('fails when foreign spec ids dominate the generated content', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      body: [
        'Investigated 031-memory-search-state-filter-fix, 031-memory-search-state-filter-fix, and 031-memory-search-state-filter-fix regressions.',
        'Cross-spec contamination also referenced 031-memory-search-state-filter-fix in the audit appendix.',
      ],
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V8');
  });

  it('fails when frontmatter trigger phrases reference a foreign spec id', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      triggerPhrases: [
        '013-memory-search-bug-fixes',
        '031-memory-search-state-filter-fix',
      ],
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V8');
    expect(result.contaminationAudit.matchesFound).toEqual(
      expect.arrayContaining([expect.stringMatching(/^frontmatter:031-memory-search-state-filter-fix/)])
    );
  });

  it('fails when low-volume foreign spec ids are scattered across multiple specs', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      body: [
        'Compared the save guard with 031-memory-search-state-filter-fix during regression review.',
        'Cross-checked edge cases from 041-memory-quality-loop-follow-up while tightening the final wording.',
      ],
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V8');
    expect(result.contaminationAudit.matchesFound).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^body-scattered:031-memory-search-state-filter-fix/),
        expect.stringMatching(/^body-scattered:041-memory-quality-loop-follow-up/),
      ])
    );
  });

  it('allows child phase ids when the target spec folder contains a child spec.md', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-v8-child-phase-'));
    const specFolder = path.join(tempRoot, '023-parent-phase');
    const childSpecFolder = path.join(specFolder, '001-child');

    try {
      fs.mkdirSync(childSpecFolder, { recursive: true });
      fs.writeFileSync(
        path.join(childSpecFolder, 'spec.md'),
        [
          '---',
          'title: "Child Phase"',
          'description: "V8 allowlist fixture"',
          '---',
          '# Child Phase',
          '',
          'Child phase fixture.',
        ].join('\n'),
        'utf8',
      );

      const result = validateMemoryQualityContent(buildMemoryContent({
        specFolder,
        body: [
          'Validated the 001-child phase memory save path during the follow-up audit.',
          'The 001-child folder remains an allowed descendant reference for V8.',
        ],
      }));

      expect(result.failedRules).not.toContain('V8');
      expect(result.valid).toBe(true);
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('fails when template instructional text leaks into the title', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      title: 'To promote a memory to constitutional tier (always surfaced)',
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V9');
  });

  it('fails when a generic stub title survives into the rendered output', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      title: 'Draft',
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V9');
    expect(result.contaminationAudit.matchesFound).toContain('title:generic stub title');
  });

  it('fails V10 when filesystem truth diverges sharply from captured transcript counts', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      capturedFileCount: 9,
      filesystemFileCount: 3,
      gitChangedFileCount: 2,
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V10');
  });

  it('passes V10 when small count differences stay within the tolerance window', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      capturedFileCount: 4,
      filesystemFileCount: 3,
      gitChangedFileCount: 2,
    }));

    expect(result.failedRules).not.toContain('V10');
  });

  it('passes V10 when file count difference is below the relaxed threshold', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      capturedFileCount: 8,
      filesystemFileCount: 4,
      gitChangedFileCount: 2,
    }));
    // diff=4, ratio=2.0 — was FAIL under old threshold of 3, now PASS under 5
    expect(result.failedRules).not.toContain('V10');
  });

  it('passes V10 when capturedFileCount is 0 (no file references in session)', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      capturedFileCount: 0,
      filesystemFileCount: 6,
      gitChangedFileCount: 4,
    }));
    expect(result.failedRules).not.toContain('V10');
  });

  it('passes V10 when filesystemFileCount is 0 (symmetric zero-count case)', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      capturedFileCount: 5,
      filesystemFileCount: 0,
      gitChangedFileCount: 0,
    }));
    expect(result.failedRules).not.toContain('V10');
  });

  it('passes practical generated memory content', () => {
    const result = validateMemoryQualityContent(buildMemoryContent());

    expect(result.valid).toBe(true);
    expect(result.failedRules).toEqual([]);
  });
});

describe('content filter contamination audit', () => {
  it('applies configured noise patterns and emits an audit trail', () => {
    const pipeline = createFilterPipeline({
      pipeline: {
        enabled: true,
        stages: ['noise'],
      },
      noise: {
        enabled: true,
        minContentLength: 3,
        minUniqueWords: 1,
        patterns: [{ pattern: '^custom placeholder$', flags: 'i' }],
      },
    });

    const filtered = pipeline.filter([
      { prompt: 'Custom placeholder' },
      { prompt: 'Implemented contamination audit trail in workflow metadata.' },
    ]);
    const stats = pipeline.getStats();

    expect(filtered).toHaveLength(1);
    expect(filtered[0].prompt).toContain('Implemented contamination audit trail');
    expect(stats.contaminationAudit).toHaveLength(1);
    expect(stats.contaminationAudit[0].matchesFound).toEqual(
      expect.arrayContaining([expect.stringMatching(/custom placeholder/i)])
    );
  });
});

describe('workflow seam guardrail', () => {
  it('promotes strong recent-context semantics into quick summary through the real collector path', async () => {
    const collectedData = {
      SPEC_FOLDER: '022-hybrid-rag-fusion',
      observations: [
        {
          title: 'Implementation and updates',
          narrative: 'Generic observation that should not win the quick summary selection.',
        },
      ],
      recentContext: [
        {
          request: 'Implementation and updates',
          learning: 'Direct save naming fix for hybrid RAG fusion collector path',
        },
      ],
      userPrompts: [
        {
          prompt: 'Fix the direct save naming edge case in the real collector path for hybrid RAG fusion.',
          timestamp: '2026-03-06T09:00:00Z',
        },
      ],
    };

    const sessionData = await collectSessionData(collectedData, '022-hybrid-rag-fusion');

    expect(sessionData.TITLE).toBe('hybrid rag fusion');
    expect(sessionData.QUICK_SUMMARY).toBe('Direct save naming fix for hybrid RAG fusion collector path');
  });

  it('splits captured, filesystem, and git file counts while treating filesystem truth as FILE_COUNT', async () => {
    const sessionData = await collectSessionData({
      SPEC_FOLDER: '009-perfect-session-capturing',
      userPrompts: [{ prompt: 'Validate session source counts', timestamp: '2026-03-16T08:00:00Z' }],
      observations: [],
      FILES: [
        {
          FILE_PATH: 'scripts/extractors/claude-code-capture.ts',
          DESCRIPTION: 'Captured from transcript tool evidence.',
          _provenance: 'tool',
        },
        {
          FILE_PATH: 'scripts/core/workflow.ts',
          DESCRIPTION: 'Recovered from git truth.',
          _provenance: 'git',
        },
        {
          FILE_PATH: 'scripts/lib/validate-memory-quality.ts',
          DESCRIPTION: 'Declared in spec scope.',
          _provenance: 'spec-folder',
        },
      ],
      _sourceTranscriptPath: '/tmp/.claude/projects/spec-kit/session-123.jsonl',
      _sourceSessionId: 'session-123',
      _sourceSessionCreated: 1_763_308_800_000,
      _sourceSessionUpdated: 1_763_309_100_000,
    }, '009-perfect-session-capturing');

    expect(sessionData.CAPTURED_FILE_COUNT).toBe(1);
    expect(sessionData.FILESYSTEM_FILE_COUNT).toBe(2);
    expect(sessionData.GIT_CHANGED_FILE_COUNT).toBe(1);
    expect(sessionData.FILE_COUNT).toBe(2);
    expect(sessionData.SOURCE_TRANSCRIPT_PATH).toContain('session-123.jsonl');
    expect(sessionData.SOURCE_SESSION_ID).toBe('session-123');
  });

  it('uses quick summary for file-backed root saves before falling back to the folder slug', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '022-hybrid-rag-fusion');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: To promote a memory to constitutional tier (always surfaced)"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { runWorkflow } = await import('../core/workflow');

    const collectSessionDataFn = async (_collectedData: unknown, specFolderName?: string) => {
      const sessionData = createSessionData(specFolderName || '022-hybrid-rag-fusion');
      sessionData.QUICK_SUMMARY = 'Hybrid RAG fusion recall regression audit';
      sessionData.TITLE = 'Hybrid RAG fusion recall regression audit';
      sessionData.SUMMARY = 'Hybrid RAG fusion recall regression audit for file-backed root save naming.';
      return sessionData;
    };

    const fileBackedData = {
      _source: 'file',
      userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:00:00Z' }],
    };

    try {
      const result = await runWorkflow({
        dataFile: '/tmp/context.json',
        collectedData: fileBackedData,
        collectSessionDataFn,
        silent: true,
      });

      expect(result.contextFilename).toContain('__hybrid-rag-fusion-recall-regression-audit.md');
      expect(result.contextFilename).not.toBe('06-03-26_09-00__hybrid-rag-fusion.md');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('records the three-stage contamination audit trail in metadata.json', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '009-perfect-session-capturing');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { runWorkflow } = await import('../core/workflow');

    try {
      await runWorkflow({
        dataFile: '/tmp/context.json',
        collectedData: {
          _source: 'file',
          SUMMARY: "I'll execute this step by step before tightening contamination validation.",
          observations: [
            {
              title: 'Implementation and updates',
              narrative: 'Added contamination audit coverage for the rendered output.',
            },
          ],
          userPrompts: [{ prompt: 'Perfect session capturing', timestamp: '2026-03-15T15:00:00Z' }],
        },
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '009-perfect-session-capturing'),
        silent: true,
      });

      expect(workflowHarness.writtenFiles).toHaveLength(1);
      const metadata = JSON.parse(workflowHarness.writtenFiles[0].files['metadata.json']) as {
        contaminationAudit: Array<{ stage: string }>;
      };
      expect(metadata.contaminationAudit.map((entry) => entry.stage)).toEqual([
        'extractor-scrub',
        'content-filter',
        'post-render',
      ]);
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('persists source provenance fields and excludes raw path noise from trigger extraction', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '011-session-source-validation');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Session Source Validation"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { runWorkflow } = await import('../core/workflow');

    try {
      const result = await runWorkflow({
        dataFile: '/tmp/context.json',
        collectedData: {
          _source: 'file',
          userPrompts: [{ prompt: 'Validate Claude session source provenance', timestamp: '2026-03-16T12:00:00Z' }],
        },
        collectSessionDataFn: async (_collectedData, specFolderName) => ({
          ...createSessionData(specFolderName || '011-session-source-validation'),
          SUMMARY: 'Bound Claude transcript selection to expected session id and history timestamps.',
          FILES: [
            {
              FILE_PATH: 'scripts/extractors/claude-code-capture.ts',
              DESCRIPTION: 'Bound Claude transcript selection to expected session id and history timestamps.',
              _provenance: 'tool',
            },
            {
              FILE_PATH: 'src/zorbiumsessionpath.ts',
              DESCRIPTION: 'Merged tiny files under synthnoisedesc aggregator.',
              _synthetic: true,
              _provenance: 'spec-folder',
            },
          ],
          HAS_FILES: true,
          FILE_COUNT: 1,
          CAPTURED_FILE_COUNT: 1,
          FILESYSTEM_FILE_COUNT: 1,
          GIT_CHANGED_FILE_COUNT: 0,
          SOURCE_TRANSCRIPT_PATH: '/tmp/.claude/projects/spec-kit/session-abc.jsonl',
          SOURCE_SESSION_ID: 'session-abc',
          SOURCE_SESSION_CREATED: 1_763_328_000_000,
          SOURCE_SESSION_UPDATED: 1_763_328_300_000,
        }),
        silent: true,
      });

      const rendered = workflowHarness.writtenFiles[0].files[result.contextFilename];
      expect(rendered).toContain('_sourceTranscriptPath: "/tmp/.claude/projects/spec-kit/session-abc.jsonl"');
      expect(rendered).toContain('_sourceSessionId: "session-abc"');
      expect(rendered).toContain('captured_file_count: 1');
      expect(rendered).toContain('filesystem_file_count: 1');
      expect(rendered).not.toContain('zorbiumsessionpath');
      expect(rendered).not.toContain('synthnoisedesc');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('allows stateless saves when captured files match code paths declared in the target spec', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '009-perfect-session-capturing');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      [
        '# Spec',
        '',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Insert enrichment after alignment guards |',
      ].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;
    workflowHarness.loaderDataWithoutFile = {
      _source: 'opencode-capture',
      userPrompts: [{ prompt: 'Perfect session capturing hardening', timestamp: '2026-03-06T09:01:00Z' }],
      observations: [
        {
          title: 'Workflow hardening',
          narrative: 'Updated stateless alignment handling for perfect session capturing.',
          files: ['.opencode/skill/system-spec-kit/scripts/core/workflow.ts'],
        },
      ],
      FILES: [
        {
          FILE_PATH: '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
          DESCRIPTION: 'Adjusted stateless alignment guards for the target spec.',
        },
      ],
    };

    const { runWorkflow } = await import('../core/workflow');

    try {
      const result = await runWorkflow({
        specFolderArg: specFolderPath,
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '009-perfect-session-capturing'),
        silent: true,
      });

      expect(result.contextFilename).toContain('.md');
      expect(workflowHarness.writtenFiles).toHaveLength(1);
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('hard-blocks stateless saves via Block B when captured file paths do not overlap with target spec folder', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '009-perfect-session-capturing');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      [
        '# Spec',
        '',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Insert enrichment after alignment guards |',
      ].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;
    workflowHarness.loaderDataWithoutFile = {
      _source: 'opencode-capture',
      userPrompts: [{ prompt: 'Route to the media editor and convert images to webp.', timestamp: '2026-03-15T11:20:00Z' }],
      observations: [
        {
          title: 'Prepare media editor flow',
          narrative: 'Queued the image conversion workflow for hero assets.',
          files: ['.opencode/skill/system-spec-kit/scripts/core/config.ts'],
        },
      ],
      FILES: [
        {
          FILE_PATH: '.opencode/skill/system-spec-kit/scripts/core/config.ts',
          DESCRIPTION: 'Generic infrastructure path touched during unrelated media workflow.',
        },
      ],
    };

    const { runWorkflow } = await import('../core/workflow');

    try {
      // Q1: Block A now warns instead of throwing for explicit CLI args,
      // but Block B (file-path overlap) still hard-blocks when captured file paths
      // don't relate to the target spec folder (overlap < 15%).
      await expect(runWorkflow({
        specFolderArg: specFolderPath,
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '009-perfect-session-capturing'),
        silent: true,
      })).rejects.toThrow(/ALIGNMENT_BLOCK.*% of captured file paths/);

      expect(workflowHarness.writtenFiles).toHaveLength(0);
      const memoryIndexer = await import('../core/memory-indexer');
      expect(memoryIndexer.indexMemory).not.toHaveBeenCalled();
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('rejects thin explicit JSON saves with INSUFFICIENT_CONTEXT_ABORT', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '009-perfect-session-capturing');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;
    evaluateMemorySufficiencyMock.mockReturnValueOnce({
      pass: false,
      rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT',
      reasons: [
        'No primary evidence was captured for this memory.',
        'Fewer than two spec-relevant evidence items were captured.',
      ],
      evidenceCounts: {
        primary: 0,
        support: 1,
        total: 1,
        semanticChars: 96,
        uniqueWords: 18,
        anchors: 1,
        triggerPhrases: 1,
      },
      score: 0.18,
    });

    const { runWorkflow } = await import('../core/workflow');

    try {
      await expect(runWorkflow({
        dataFile: '/tmp/context.json',
        collectedData: {
          _source: 'file',
          userPrompts: [{ prompt: 'Perfect session capturing', timestamp: '2026-03-15T15:00:00Z' }],
        },
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '009-perfect-session-capturing'),
        silent: true,
      })).rejects.toThrow(/INSUFFICIENT_CONTEXT_ABORT/);

      expect(workflowHarness.writtenFiles).toHaveLength(0);
      const memoryIndexer = await import('../core/memory-indexer');
      expect(memoryIndexer.indexMemory).not.toHaveBeenCalled();
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('uses canonical score01 when applying the workflow quality abort threshold', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '009-perfect-session-capturing');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;
    qualityHarness.legacyResult = {
      ...qualityHarness.legacyResult,
      score: 90,
      score01: 0.9,
      score100: 90,
      qualityScore: 0.9,
      warnings: [],
    };
    qualityHarness.v2Result = {
      ...qualityHarness.v2Result,
      score: 40,
      score01: 0.4,
      score100: 40,
      qualityScore: 0.4,
      warnings: ['Canonical score intentionally below threshold for workflow gating coverage.'],
    };

    const { runWorkflow } = await import('../core/workflow');
    const { CONFIG } = await import('../core');
    const previousThreshold = CONFIG.QUALITY_ABORT_THRESHOLD;
    CONFIG.QUALITY_ABORT_THRESHOLD = 0.5;

    try {
      await expect(runWorkflow({
        dataFile: '/tmp/context.json',
        collectedData: {
          _source: 'file',
          userPrompts: [{ prompt: 'Perfect session capturing', timestamp: '2026-03-15T15:00:00Z' }],
          observations: [
            {
              title: 'Threshold coverage',
              narrative: 'This fixture proves workflow gating compares the canonical 0.0-1.0 score.',
              files: ['spec.md'],
            },
          ],
        },
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '009-perfect-session-capturing'),
        silent: true,
      })).rejects.toThrow(/QUALITY_GATE_ABORT: Memory quality score 40\/100 \(0\.40\) is below minimum threshold \(0\.50\)/);

      expect(workflowHarness.writtenFiles).toHaveLength(0);
    } finally {
      CONFIG.QUALITY_ABORT_THRESHOLD = previousThreshold;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('rejects malformed rendered memories before write when the template contract is violated', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '009-perfect-session-capturing');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const populateTemplateMock = vi.mocked(populateTemplate);
    const previousImplementation = populateTemplateMock.getMockImplementation();
    populateTemplateMock.mockImplementationOnce(async () => [
      '---',
      'title: "Broken render"',
      'description: "Missing required anchors."',
      'trigger_phrases:',
      '  - "broken render"',
      'importance_tier: "normal"',
      'contextType: "implementation"',
      '---',
      '',
      '# Broken render',
      '',
      '## SESSION SUMMARY',
      '',
      'No mandatory sections follow.',
    ].join('\n'));

    const { runWorkflow } = await import('../core/workflow');

    try {
      await expect(runWorkflow({
        dataFile: '/tmp/context.json',
        collectedData: {
          _source: 'file',
          userPrompts: [{ prompt: 'Perfect session capturing', timestamp: '2026-03-15T15:00:00Z' }],
          observations: [
            {
              title: 'Contract proof',
              narrative: 'This explicit JSON fixture is rich enough to pass sufficiency but the rendered template is broken.',
              files: ['spec.md'],
            },
          ],
        },
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '009-perfect-session-capturing'),
        silent: true,
      })).rejects.toThrow(/QUALITY_GATE_ABORT: Rendered memory violated template contract/);

      expect(workflowHarness.writtenFiles).toHaveLength(0);
      const memoryIndexer = await import('../core/memory-indexer');
      expect(memoryIndexer.indexMemory).not.toHaveBeenCalled();
    } finally {
      if (previousImplementation) {
        populateTemplateMock.mockImplementation(previousImplementation);
      }
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('does not let file-backed state leak into a later stateless workflow run', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '013-memory-search-bug-fixes');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Generic Memory Filename Fix in Stateless Mode"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { runWorkflow } = await import('../core/workflow');
    const { CONFIG } = await import('../core');
    CONFIG.DATA_FILE = null;
    CONFIG.SPEC_FOLDER_ARG = null;
    workflowHarness.loaderDataWithoutFile = {
      _source: 'opencode-capture',
      userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:01:00Z' }],
    };

    const collectSessionDataFn = async (_collectedData: unknown, specFolderName?: string) => {
      const sessionData = createSessionData(specFolderName || '013-memory-search-bug-fixes');
      sessionData.QUICK_SUMMARY = 'Development session';
      sessionData.TITLE = 'Development session';
      sessionData.SUMMARY = 'Implementation and updates';
      return sessionData;
    };

    const fileBackedData = {
      _source: 'file',
      userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:00:00Z' }],
    };

    const fileBackedResult = await runWorkflow({
      dataFile: '/tmp/context.json',
      collectedData: fileBackedData,
      collectSessionDataFn,
      silent: true,
    });
    const statelessResult = await runWorkflow({
      collectSessionDataFn,
      silent: true,
    });

    expect(fileBackedResult.contextFilename).toContain('__memory-search-bug-fixes.md');
    expect(statelessResult.contextFilename).toContain('__generic-memory-filename-fix-in-stateless-mode.md');
    expect(workflowHarness.loaderSnapshots).toEqual([
      { dataFile: null, specFolderArg: null },
    ]);
    expect(CONFIG.DATA_FILE).toBeNull();
    expect(CONFIG.SPEC_FOLDER_ARG).toBeNull();

    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('serializes overlapping workflow runs so per-run config state stays isolated', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '013-memory-search-bug-fixes');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Generic Memory Filename Fix in Stateless Mode"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { runWorkflow } = await import('../core/workflow');
    const { CONFIG } = await import('../core');
    const specFolderModule = await import('../spec-folder');
    const detectSpecFolderMock = vi.mocked(specFolderModule.detectSpecFolder);
    const detectSnapshots: Array<{ specFolderArg: string | null }> = [];
    const firstLoadStarted = createDeferred<void>();
    const releaseFirstLoad = createDeferred<void>();

    CONFIG.DATA_FILE = null;
    CONFIG.SPEC_FOLDER_ARG = null;

    detectSpecFolderMock.mockImplementation(async (_collectedData: unknown, options?: { specFolderArg?: string | null }) => {
      detectSnapshots.push({
        specFolderArg: options?.specFolderArg ?? null,
      });
      return workflowHarness.specFolderPath;
    });

    const collectSessionDataFn = async (_collectedData: unknown, specFolderName?: string) => {
      return createSessionData(specFolderName || '013-memory-search-bug-fixes');
    };

    const firstRunPromise = runWorkflow({
      dataFile: '/tmp/first.json',
      specFolderArg: '001-first-run',
      loadDataFn: async () => {
        firstLoadStarted.resolve();
        await releaseFirstLoad.promise;
        return {
          _source: 'file',
          userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:00:00Z' }],
        } as never;
      },
      collectSessionDataFn,
      silent: true,
    });

    await firstLoadStarted.promise;

    const secondRunPromise = runWorkflow({
      dataFile: '/tmp/second.json',
      specFolderArg: '002-second-run',
      loadDataFn: async () => ({
        _source: 'file',
        userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:01:00Z' }],
      }) as never,
      collectSessionDataFn,
      silent: true,
    });

    releaseFirstLoad.resolve();

    await Promise.all([firstRunPromise, secondRunPromise]);

    expect(detectSnapshots).toEqual([
      { specFolderArg: '001-first-run' },
      { specFolderArg: '002-second-run' },
    ]);
    expect(CONFIG.DATA_FILE).toBeNull();
    expect(CONFIG.SPEC_FOLDER_ARG).toBeNull();

    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('uses collector-derived quick summary during direct preloaded workflow saves', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '022-hybrid-rag-fusion');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: To promote a memory to constitutional tier (always surfaced)"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { runWorkflow } = await import('../core/workflow');

    const collectedData = {
      _source: 'opencode-capture',
      SPEC_FOLDER: '022-hybrid-rag-fusion',
      observations: [
        {
          title: 'Implementation and updates',
          narrative: 'Generic observation title should not force a folder slug fallback.',
        },
      ],
      recentContext: [
        {
          request: 'Implementation and updates',
          learning: 'Direct save naming fix for hybrid RAG fusion collector path',
        },
      ],
      userPrompts: [
        {
          prompt: 'Fix the direct save naming edge case in the real collector path for hybrid RAG fusion.',
          timestamp: '2026-03-06T09:00:00Z',
        },
      ],
    };

    try {
      const result = await runWorkflow({
        collectedData,
        specFolderArg: 'specs/02--system-spec-kit/022-hybrid-rag-fusion',
        silent: true,
      });

      expect(result.contextFilename).toContain('__direct-save-naming-fix-for-hybrid-rag-fusion.md');
      expect(result.contextFilename).not.toContain('__hybrid-rag-fusion.md');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('V11 fails when description contains API error text', () => {
    const errorContent = `\
\`\`\`yaml
spec_folder: "05--agent-orchestration/028-auto-deep-research"
tool_count: 5
description: "API Error: 500 {\\"type\\":\\"error\\",\\"error\\":{\\"type\\":\\"api_error\\"}}"
trigger_phrases:
  - "research"
  - "investigation"
\`\`\`

# Test Memory

Decision: adopt error handling.
`;
    const result = validateMemoryQualityContent(errorContent);
    expect(result.failedRules).toContain('V11');
  });

  it('V11 fails when trigger phrases are error-dominated', () => {
    const errorContent = `\
\`\`\`yaml
spec_folder: "05--agent-orchestration/028-auto-deep-research"
tool_count: 5
trigger_phrases:
  - "api error type error"
  - "error request req_011cz9"
  - "api api overloaded"
  - "500 internal server"
  - "clean phrase"
\`\`\`

# Test Memory

Decision: adopt error handling.
`;
    const result = validateMemoryQualityContent(errorContent);
    expect(result.failedRules).toContain('V11');
  });

  it('V11 passes on clean memory content', () => {
    const cleanContent = `\
\`\`\`yaml
spec_folder: "02--system-spec-kit/020-mcp-working-memory-hybrid-rag"
tool_count: 9
trigger_phrases:
  - "memory"
  - "quality"
  - "validation"
\`\`\`

# Clean Memory Title

Decision: adopt deterministic scoring.
`;
    const result = validateMemoryQualityContent(cleanContent);
    expect(result.failedRules).not.toContain('V11');
  });

  it('strips broader leaked HTML outside fenced code blocks while preserving fenced HTML', async () => {
    const { stripWorkflowHtmlOutsideCodeFences } = await import('../core/workflow');
    const cleaned = stripWorkflowHtmlOutsideCodeFences([
      '# Workflow HTML Sanitization',
      '',
      '<section><strong>Leaked</strong><ul><li>alpha</li><li>beta</li></ul></section>',
      '<!-- hidden comment -->',
      '<script>alert("drop me")</script>',
      '<img src="https://example.com/leak.png" alt="tracker" />',
      '<iframe src="https://example.com/embed"></iframe>',
      '<svg><title>vector</title><text>drop the svg payload</text></svg>',
      '',
      '```html',
      '<div class="preserve-me">keep fenced html</div>',
      '```',
      '',
      '<p>tail</p><code>inline</code>',
    ].join('\n'));

    expect(cleaned).toContain('Leaked');
    expect(cleaned).toContain('alpha');
    expect(cleaned).toContain('beta');
    expect(cleaned).toContain('tail');
    expect(cleaned).toContain('inline');
    expect(cleaned).not.toContain('hidden comment');
    expect(cleaned).not.toContain('alert("drop me")');
    expect(cleaned).not.toContain('drop the svg payload');
    expect(cleaned).not.toContain('<section>');
    expect(cleaned).not.toContain('<strong>');
    expect(cleaned).not.toContain('<ul>');
    expect(cleaned).not.toContain('<li>');
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('<img');
    expect(cleaned).not.toContain('<iframe');
    expect(cleaned).not.toContain('<svg>');
    expect(cleaned).not.toContain('<p>');
    expect(cleaned).not.toContain('<code>inline</code>');
    expect(cleaned).toContain('```html\n<div class="preserve-me">keep fenced html</div>\n```');
  });
});
