// TEST: Task Enrichment Guardrails
// Ensures stateless-only enrichment for generic task labels
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateContentSlug, isContaminatedMemoryName, isGenericContentTask, pickBestContentName } from '../utils/slug-utils';
import { normalizeSpecTitleForMemory, pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';
import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
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
    `# ${String(data.MEMORY_TITLE ?? 'Test Memory')}`,
    '',
    '```yaml',
    'title: test-memory',
    '```',
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
  scoreMemoryQuality: vi.fn(() => ({
    score: 100,
    warnings: [],
    breakdown: {
      triggerPhrases: 20,
      keyTopics: 15,
      fileDescriptions: 20,
      contentLength: 15,
      noLeakedTags: 15,
      observationDedup: 15,
    },
  })),
}));

vi.mock('../extractors/quality-scorer', () => ({
  scoreMemoryQuality: vi.fn(() => ({ qualityScore: 100, qualityFlags: [] })),
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
  updateMetadataWithEmbedding: vi.fn(async () => undefined),
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
    OUTCOMES: [{ OUTCOME: 'Session completed' }],
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
    TOOL_COUNTS: { Read: 0, Write: 0, Edit: 0, Bash: 0, Grep: 0, Glob: 0, WebFetch: 0 },
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
  workflowHarness.writtenFiles = [];
  workflowHarness.loaderSnapshots = [];
  workflowHarness.detectSnapshots = [];
  workflowHarness.loaderDataWithFile = null;
  workflowHarness.loaderDataWithoutFile = null;
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
    body?: string[];
  } = {}): string {
    const triggerLines = (overrides.triggerPhrases ?? ['memory audit', 'lint gate'])
      .map((phrase) => `  - "${phrase}"`)
      .join('\n');

    return [
      '---',
      `title: "${overrides.title ?? 'Memory Audit Naming Fix'}"`,
      `spec_folder: "${overrides.specFolder ?? '022-hybrid-rag-fusion/013-memory-search-bug-fixes'}"`,
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
      'Inspected `scripts/core/workflow.ts` and `scripts/memory/validate-memory-quality.ts`.',
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

  it('fails when template instructional text leaks into the title', () => {
    const result = validateMemoryQualityContent(buildMemoryContent({
      title: 'To promote a memory to constitutional tier (always surfaced)',
    }));

    expect(result.valid).toBe(false);
    expect(result.failedRules).toContain('V9');
  });

  it('passes practical generated memory content', () => {
    const result = validateMemoryQualityContent(buildMemoryContent());

    expect(result.valid).toBe(true);
    expect(result.failedRules).toEqual([]);
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

  it('allows stateless saves when captured files match code paths declared in the target spec', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '010-perfect-session-capturing');
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
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '010-perfect-session-capturing'),
        silent: true,
      });

      expect(result.contextFilename).toContain('.md');
      expect(workflowHarness.writtenFiles).toHaveLength(1);
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('hard-blocks same-workspace stateless saves when no target-spec anchor exists', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '010-perfect-session-capturing');
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
      await expect(runWorkflow({
        specFolderArg: specFolderPath,
        collectSessionDataFn: async (_collectedData, specFolderName) => createSessionData(specFolderName || '010-perfect-session-capturing'),
        silent: true,
      })).rejects.toThrow(/ALIGNMENT_BLOCK: Captured stateless content matched the workspace but not the target spec folder/);

      expect(workflowHarness.writtenFiles).toHaveLength(0);
    } finally {
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

  it('strips broader leaked HTML outside fenced code blocks while preserving fenced HTML', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-'));
    const specFolderPath = path.join(tempRoot, '022-hybrid-rag-fusion');
    const contextDir = path.join(tempRoot, 'memory');
    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Workflow HTML Sanitization"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    vi.mocked(populateTemplate).mockResolvedValueOnce([
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

    const { runWorkflow } = await import('../core/workflow');

    try {
      await runWorkflow({
        collectedData: {
          _source: 'opencode-capture',
          SPEC_FOLDER: '022-hybrid-rag-fusion',
          userPrompts: [{ prompt: 'Sanitize workflow HTML leaks.', timestamp: '2026-03-06T09:00:00Z' }],
        },
        specFolderArg: 'specs/02--system-spec-kit/022-hybrid-rag-fusion',
        silent: true,
      });

      const written = workflowHarness.writtenFiles.at(-1);
      expect(written).toBeDefined();

      const [writtenContent] = Object.values(written!.files);
      expect(writtenContent).toContain('Leaked');
      expect(writtenContent).toContain('alpha');
      expect(writtenContent).toContain('beta');
      expect(writtenContent).toContain('tail');
      expect(writtenContent).toContain('inline');
      expect(writtenContent).not.toContain('hidden comment');
      expect(writtenContent).not.toContain('alert("drop me")');
      expect(writtenContent).not.toContain('drop the svg payload');
      expect(writtenContent).not.toContain('<section>');
      expect(writtenContent).not.toContain('<strong>');
      expect(writtenContent).not.toContain('<ul>');
      expect(writtenContent).not.toContain('<li>');
      expect(writtenContent).not.toContain('<script>');
      expect(writtenContent).not.toContain('<img');
      expect(writtenContent).not.toContain('<iframe');
      expect(writtenContent).not.toContain('<svg>');
      expect(writtenContent).not.toContain('<p>');
      expect(writtenContent).not.toContain('<code>inline</code>');
      expect(writtenContent).toContain('```html\n<div class="preserve-me">keep fenced html</div>\n```');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
