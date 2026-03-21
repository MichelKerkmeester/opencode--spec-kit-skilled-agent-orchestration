// TEST: Memory Render Fixture Regression
// End-to-end regression for rendered memory naming and quality linting
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
import type { SessionData } from '../types/session-types';
import { validateMemoryTemplateContract } from '../../shared/parsing/memory-template-contract';

const workflowHarness = vi.hoisted(() => ({
  specFolderPath: '',
  contextDir: '',
}));

vi.mock('../spec-folder', () => ({
  detectSpecFolder: vi.fn(async () => workflowHarness.specFolderPath),
  setupContextDirectory: vi.fn(async () => workflowHarness.contextDir),
}));

vi.mock('../core/memory-indexer', () => ({
  indexMemory: vi.fn(async () => null),
  updateMetadataEmbeddingStatus: vi.fn(async () => true),
}));

vi.mock('@spec-kit/mcp-server/api/providers', () => ({
  retryManager: {
    getRetryStats: () => ({ queue_size: 0 }),
    processRetryQueue: vi.fn(async () => ({ processed: 0, succeeded: 0, failed: 0 })),
  },
}));

function createSessionData(specFolderName: string, overrides: Partial<SessionData> = {}): SessionData {
  return {
    TITLE: 'Memory Generator Naming Guardrail',
    DATE: '06-03-26',
    TIME: '09-30',
    SPEC_FOLDER: specFolderName,
    DURATION: '6m',
    SUMMARY: 'Validated rendered memory naming and quality lint output against a stable fixture.',
    FILES: [
      {
        FILE_PATH: 'scripts/core/workflow.ts',
        DESCRIPTION: 'Verified spec-title enrichment drives the rendered memory filename and heading.',
        ACTION: 'Modified',
      },
    ],
    HAS_FILES: true,
    FILE_COUNT: 1,
    CAPTURED_FILE_COUNT: 1,
    FILESYSTEM_FILE_COUNT: 1,
    GIT_CHANGED_FILE_COUNT: 0,
    OUTCOMES: [{ OUTCOME: 'Rendered memory output stays specific and passes the lint gate.', TYPE: 'status' }],
    TOOL_COUNT: 3,
    MESSAGE_COUNT: 2,
    QUICK_SUMMARY: 'Rendered memory fixture regression',
    SKILL_VERSION: '1.7.2',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    SESSION_ID: 'session-render-fixture',
    CHANNEL: 'test',
    IMPORTANCE_TIER: 'normal',
    CONTEXT_TYPE: 'implementation',
    CREATED_AT_EPOCH: 1_772_755_800,
    LAST_ACCESSED_EPOCH: 1_772_755_800,
    EXPIRES_AT_EPOCH: 1_780_531_800,
    TOOL_COUNTS: { Read: 2, Edit: 0, Write: 0, Bash: 1, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
    DECISION_COUNT: 0,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1,
    PROJECT_PHASE: 'IMPLEMENTATION',
    ACTIVE_FILE: 'scripts/core/workflow.ts',
    LAST_ACTION: 'Rendered a fixture memory from a spec-derived title.',
    NEXT_ACTION: 'Keep the regression test green as templates evolve.',
    BLOCKERS: 'None',
    FILE_PROGRESS: [{ FILE_NAME: 'scripts/core/workflow.ts', FILE_STATUS: 'VERIFIED' }],
    HAS_FILE_PROGRESS: true,
    HAS_IMPLEMENTATION_GUIDE: false,
    TOPIC: '',
    IMPLEMENTATIONS: [],
    IMPL_KEY_FILES: [],
    EXTENSION_GUIDES: [],
    PATTERNS: [],
    PREFLIGHT_KNOW_SCORE: 58,
    PREFLIGHT_UNCERTAINTY_SCORE: 32,
    PREFLIGHT_CONTEXT_SCORE: 55,
    PREFLIGHT_KNOW_ASSESSMENT: 'Moderate',
    PREFLIGHT_UNCERTAINTY_ASSESSMENT: 'Low uncertainty',
    PREFLIGHT_CONTEXT_ASSESSMENT: 'Moderate',
    PREFLIGHT_TIMESTAMP: '2026-03-06T09:24:00Z',
    PREFLIGHT_GAPS: [{ GAP_DESCRIPTION: 'Confirm rendered title stays free of template contamination.' }],
    PREFLIGHT_CONFIDENCE: 81,
    PREFLIGHT_UNCERTAINTY_RAW: 32,
    PREFLIGHT_READINESS: 'Ready to verify the rendered fixture output',
    HAS_PREFLIGHT_BASELINE: true,
    POSTFLIGHT_KNOW_SCORE: 80,
    POSTFLIGHT_UNCERTAINTY_SCORE: 12,
    POSTFLIGHT_CONTEXT_SCORE: 78,
    DELTA_KNOW_SCORE: '+22',
    DELTA_UNCERTAINTY_SCORE: '+20',
    DELTA_CONTEXT_SCORE: '+23',
    DELTA_KNOW_TREND: 'up',
    DELTA_UNCERTAINTY_TREND: 'down',
    DELTA_CONTEXT_TREND: 'up',
    LEARNING_INDEX: 22,
    LEARNING_SUMMARY: 'The fixture confirms naming enrichment and quality validation stay aligned.',
    HAS_POSTFLIGHT_DELTA: true,
    GAPS_CLOSED: [{ GAP_DESCRIPTION: 'Verified the rendered output title and slug are specific.' }],
    NEW_GAPS: [],
    SESSION_STATUS: 'Ready for follow-up',
    COMPLETION_PERCENT: 100,
    LAST_ACTIVITY_TIMESTAMP: '2026-03-06T09:30:00Z',
    SESSION_DURATION: '6m',
    CONTINUATION_COUNT: 0,
    CONTEXT_SUMMARY: 'This fixture exercises the real workflow render path with deterministic session data.',
    PENDING_TASKS: [],
    NEXT_CONTINUATION_COUNT: 1,
    RESUME_CONTEXT: [{ CONTEXT_ITEM: 'Review the generated memory heading and metadata title.' }],
    SOURCE_TRANSCRIPT_PATH: '',
    SOURCE_SESSION_ID: '',
    SOURCE_SESSION_CREATED: 0,
    SOURCE_SESSION_UPDATED: 0,
    HEAD_REF: null,
    COMMIT_REF: null,
    REPOSITORY_STATE: 'unavailable',
    IS_DETACHED_HEAD: false,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
});

afterEach(() => {
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
});

describe('rendered memory fixture regression', () => {
  it('preserves ANCHOR comments while stripping non-anchor HTML comments outside code fences', async () => {
    const { stripWorkflowHtmlOutsideCodeFences } = await import('../core/workflow');
    const raw = [
      '<!-- Template Configuration: remove this -->',
      '<!-- ANCHOR:metadata -->',
      '## Metadata',
      '<!-- /ANCHOR:metadata -->',
      '```md',
      '<!-- keep this inside code fence -->',
      '```',
    ].join('\n');

    const cleaned = stripWorkflowHtmlOutsideCodeFences(raw);

    expect(cleaned).toContain('<!-- ANCHOR:metadata -->');
    expect(cleaned).toContain('<!-- /ANCHOR:metadata -->');
    expect(cleaned).not.toContain('Template Configuration: remove this');
    expect(cleaned).toContain('<!-- keep this inside code fence -->');
  });

  it('renders a specific filename and non-contaminated title that passes the quality gate', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-fixture-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '014-rendered-memory-regression');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        [
          '---',
          'title: "Spec: Memory Generator Naming Guardrail"',
          '---',
          '# Spec',
        ].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const collectedData = {
        _source: 'opencode-capture',
        userPrompts: [
          {
            prompt: 'Development session',
            timestamp: '2026-03-06T09:25:00Z',
          },
        ],
        observations: [
          {
            timestamp: '2026-03-06T09:25:30Z',
            narrative: 'Verified rendered memory titles stay specific after template changes.',
            facts: [
              'Tool: Read File: scripts/core/workflow.ts Result: inspected naming pipeline',
            ],
            files: [path.join(specFolderPath, 'spec.md')],
          },
        ],
      };

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData,
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(specFolderName || '014-rendered-memory-regression'),
        silent: true,
      });

      const renderedPath = path.join(result.contextDir, result.contextFilename);
      const rendered = fs.readFileSync(renderedPath, 'utf-8');
      const validation = validateMemoryQualityContent(rendered);
      const contract = validateMemoryTemplateContract(rendered);
      const frontmatterTitle = rendered.match(/^title:\s*"([^"]+)"$/m)?.[1] ?? '';
      const heading = rendered.match(/^#\s+(.+)$/m)?.[1] ?? '';
      const frontmatter = rendered.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';
      const anchorMatches = rendered.match(/<!--\s*\/?ANCHOR:[^>]+-->/g) ?? [];

      expect(result.contextFilename).toBe('06-03-26_09-30__memory-generator-naming-guardrail.md');
      expect(result.contextFilename).not.toContain('development-session');
      expect(result.contextFilename).not.toContain('table-of-contents');
      expect(result.contextFilename).not.toContain('epistemic-state-captured');

      expect(heading).toBe('Memory Generator Naming Guardrail');
      expect(frontmatterTitle).toContain('Memory Generator Naming Guardrail');
      expect(frontmatterTitle).not.toMatch(/to promote a memory|epistemic state captured at session start|table of contents/i);
      expect(rendered).not.toMatch(/^#\s*(To promote a memory|Epistemic state captured at session start|Table of Contents)\b/im);
      expect(anchorMatches.length).toBeGreaterThan(0);
      expect(frontmatter).toContain('trigger_phrases:');
      expect(frontmatter).not.toContain('{{#TRIGGER_PHRASES}}');
      expect(frontmatter).not.toContain('{{/TRIGGER_PHRASES}}');
      expect(frontmatter.match(/trigger_phrases:/g)?.length ?? 0).toBe(1);
      expect(frontmatter).toMatch(/trigger_phrases:\n  - "/);
      expect(frontmatter).not.toContain('memory dashboard');
      expect(frontmatter).not.toContain('session summary');
      expect(frontmatter).not.toContain('context template');

      expect(validation.failedRules).toEqual([]);
      expect(validation.valid).toBe(true);
      expect(contract.valid).toBe(true);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('falls back to the folder-base slug when prompt and spec title are contaminated or generic', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-fixture-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '015-memory-render-guardrails');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        [
          '---',
          'title: "Spec: To promote a memory to constitutional tier (always surfaced)"',
          '---',
          '# Spec',
        ].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          _source: 'opencode-capture',
          userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:25:00Z' }],
          observations: [
            {
              timestamp: '2026-03-06T09:25:30Z',
              narrative: 'Table of Contents',
              facts: ['Tool: Read File: scripts/core/workflow.ts Result: development session'],
              files: [],
            },
          ],
        },
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
          specFolderName || '015-memory-render-guardrails',
          {
            TITLE: 'Development session',
            SUMMARY: 'Table of Contents',
            QUICK_SUMMARY: 'Implementation and updates',
          }
        ),
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');
      const validation = validateMemoryQualityContent(rendered);
      const frontmatterTitle = rendered.match(/^title:\s*"([^"]+)"$/m)?.[1] ?? '';
      const heading = rendered.match(/^#\s+(.+)$/m)?.[1] ?? '';

      expect(result.contextFilename).toBe('06-03-26_09-30__memory-render-guardrails.md');
      expect(result.contextFilename).not.toContain('development-session');
      expect(result.contextFilename).not.toContain('promote-a-memory');
      expect(result.contextFilename).not.toContain('constitutional-tier');
      expect(result.contextFilename).not.toContain('always-surfaced');

      expect(heading).not.toMatch(/development session|to promote a memory|constitutional tier|always surfaced/i);
      expect(frontmatterTitle).not.toMatch(/development session|to promote a memory|constitutional tier|always surfaced/i);

      expect(validation.valid).toBe(true);
      expect(validation.failedRules).toEqual([]);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('renders session-source provenance and split file counts into frontmatter', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-fixture-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '011-session-source-validation');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        ['---', 'title: "Spec: Session Source Validation"', '---', '# Spec'].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          _source: 'file',
          userPrompts: [{ prompt: 'Validate session source provenance', timestamp: '2026-03-16T12:00:00Z' }],
        },
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
          specFolderName || '011-session-source-validation',
          {
            SOURCE_TRANSCRIPT_PATH: '/tmp/.claude/projects/spec-kit/session-xyz.jsonl',
            SOURCE_SESSION_ID: 'session-xyz',
            SOURCE_SESSION_CREATED: 1_763_328_000_000,
            SOURCE_SESSION_UPDATED: 1_763_328_300_000,
            CAPTURED_FILE_COUNT: 3,
            FILESYSTEM_FILE_COUNT: 2,
            GIT_CHANGED_FILE_COUNT: 1,
            FILE_COUNT: 2,
          },
        ),
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');
      const frontmatter = rendered.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';

      expect(frontmatter).toContain('_sourceTranscriptPath: "/tmp/.claude/projects/spec-kit/session-xyz.jsonl"');
      expect(frontmatter).toContain('_sourceSessionId: "session-xyz"');
      expect(frontmatter).toContain('_sourceSessionCreated: 1763328000000');
      expect(frontmatter).toContain('_sourceSessionUpdated: 1763328300000');
      expect(frontmatter).toContain('captured_file_count: 3');
      expect(frontmatter).toContain('filesystem_file_count: 2');
      expect(frontmatter).toContain('git_changed_file_count: 1');
      expect(rendered).toContain('file_count: 2');
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('renders an empty trigger list when no trigger phrases are provided', async () => {
    const { CONFIG } = await import('../core');
    const { populateTemplate } = await import('../renderers');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      CONFIG.TEMPLATE_DIR = templatesDir;
      const rendered = await populateTemplate('context', {
        MEMORY_DASHBOARD_TITLE: 'Trigger Fallback Fixture',
        IMPORTANCE_TIER: 'normal',
        TRIGGER_PHRASES: [],
        TRIGGER_PHRASES_YAML: 'trigger_phrases: []',
        DATE: '15-03-26',
        CREATED_AT_EPOCH: 1,
        LAST_ACCESSED_EPOCH: 1,
        EXPIRES_AT_EPOCH: 0,
        MESSAGE_COUNT: 0,
        DECISION_COUNT: 0,
        TOOL_COUNT: 0,
        FILE_COUNT: 0,
        CAPTURED_FILE_COUNT: 0,
        FILESYSTEM_FILE_COUNT: 0,
        GIT_CHANGED_FILE_COUNT: 0,
        FOLLOWUP_COUNT: 0,
        ACCESS_COUNT: 0,
        LAST_SEARCH_QUERY: '',
        RELEVANCE_BOOST: 1,
        SOURCE_TRANSCRIPT_PATH: '',
        SOURCE_SESSION_ID: '',
        SOURCE_SESSION_CREATED: 0,
        SOURCE_SESSION_UPDATED: 0,
        TOPICS: [],
        KEY_FILES: [],
        RELATED_SESSIONS: [],
        PARENT_SPEC: '',
        CHILD_SESSIONS: [],
        EMBEDDING_MODEL: '',
        EMBEDDING_VERSION: '',
        CHUNK_COUNT: 0,
      });

      const frontmatter = rendered.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';
      expect(frontmatter).toContain('trigger_phrases: []');
      expect(frontmatter).not.toContain('{{#TRIGGER_PHRASES}}');
      expect(frontmatter.match(/trigger_phrases:/g)?.length ?? 0).toBe(1);
      expect(rendered).not.toContain('memory dashboard');
      expect(rendered).not.toContain('session summary');
      expect(rendered).not.toContain('context template');
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
    }
  });

  it('renders direct preloaded saves without placeholder leakage and with a non-zero tool count', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-direct-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '022-hybrid-rag-fusion');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          SPEC_FOLDER: '022-hybrid-rag-fusion',
          userPrompts: [
            {
              prompt: 'Retry the indexed direct save render quality closure for hybrid rag fusion.',
              timestamp: '2026-03-06T13:57:00Z',
            },
          ],
          recentContext: [
            {
              request: 'Finalize direct save render quality closure',
              learning: 'Direct save render quality closure for hybrid RAG fusion indexing',
            },
          ],
          observations: [
            {
              title: 'Direct save render quality closure for hybrid rag',
              narrative: 'Specific title should survive the direct preloaded collector path and keep the indexed save non-generic.',
              facts: [
                'Tool: read File: scripts/extractors/collect-session-data.ts Result: inspected quick summary derivation',
                'Tool: bash File: scripts/tests/memory-render-fixture.vitest.ts Result: validated direct save quality output',
              ],
              files: ['scripts/extractors/collect-session-data.ts', 'scripts/tests/memory-render-fixture.vitest.ts'],
              timestamp: '2026-03-06T13:57:30Z',
            },
          ],
        },
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');
      const validation = validateMemoryQualityContent(rendered);

      expect(result.contextFilename).toContain('__direct-save-render-quality-closure-for-hybrid-rag.md');
      expect(result.contextFilename).not.toContain('__hybrid-rag-fusion.md');
      expect(rendered).not.toContain('## PREFLIGHT BASELINE');
      expect(rendered).not.toContain('## POSTFLIGHT LEARNING DELTA');
      expect(rendered).not.toMatch(/\|\s*Tool Executions\s*\|\s*0\s*\|/);
      expect(validation.valid).toBe(true);
      expect(validation.failedRules).toEqual([]);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('escapes literal anchor examples from captured session text without breaking real anchors', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-anchor-escape-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '010-perfect-session-capturing');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          _source: 'codex-cli-capture',
          userPrompts: [
            {
              prompt: 'Document why the literal example <!-- ANCHOR:id --> / <!-- /ANCHOR:id --> should be preserved as text in the memory body.',
              timestamp: '2026-03-15T12:40:00Z',
            },
          ],
          observations: [
            {
              title: 'Escaped anchor example in captured prompt',
              narrative: 'Verified that literal anchor examples from the session render as escaped text instead of malformed real anchors.',
              facts: ['Tool: Read File: scripts/core/workflow.ts Result: escaped literal anchor examples before template render'],
              files: [path.join(specFolderPath, 'spec.md')],
              timestamp: '2026-03-15T12:41:00Z',
            },
          ],
        },
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(specFolderName || '010-perfect-session-capturing'),
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');
      const validation = validateMemoryQualityContent(rendered);
      const anchorMatches = rendered.match(/<!--\s*\/?ANCHOR:[^>]+-->/g) ?? [];

      expect(rendered).toContain('&lt;!-- ANCHOR:id --&gt;');
      expect(rendered).toContain('&lt;!-- /ANCHOR:id --&gt;');
      expect(anchorMatches.length).toBeGreaterThan(0);
      expect(validation.failedRules).toEqual([]);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('promotes stateless native tool evidence into rendered tool_count even without file entries', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-tool-evidence-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '016-stateless-tool-evidence');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        [
          '---',
          'title: "Spec: Stateless Tool Evidence Guardrail"',
          '---',
          '# Spec',
        ].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          _source: 'codex-cli-capture',
          _toolCallCount: 2,
          userPrompts: [
            {
              prompt: 'Validate stateless tool evidence without edited files.',
              timestamp: '2026-03-15T13:00:00Z',
            },
          ],
          recentContext: [
            {
              request: 'Validate stateless tool evidence without edited files.',
              learning: 'Read and bash executions should keep tool_count above zero.',
            },
          ],
          observations: [
            {
              title: 'Read loader state',
              narrative: 'Inspected the loader precedence order in stateless mode.',
              facts: ['Tool: Read', 'Status: completed'],
              files: [],
              timestamp: '2026-03-15T13:00:10Z',
            },
            {
              title: 'Run verification command',
              narrative: 'Executed a bash verification command without editing files.',
              facts: ['Tool: Bash', 'Status: completed'],
              files: [],
              timestamp: '2026-03-15T13:00:20Z',
            },
          ],
          FILES: [],
        },
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
          specFolderName || '016-stateless-tool-evidence',
          {
            TITLE: 'Stateless Tool Evidence Guardrail',
            SUMMARY: 'Stateless native capture preserved tool evidence even without file edits.',
            QUICK_SUMMARY: 'Stateless tool evidence guardrail',
            TOOL_COUNT: 0,
            TOOL_COUNTS: { Read: 0, Edit: 0, Write: 0, Bash: 0, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
            FILES: [],
            HAS_FILES: false,
            FILE_COUNT: 0,
            FILE_PROGRESS: [],
            HAS_FILE_PROGRESS: false,
          }
        ),
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');
      const validation = validateMemoryQualityContent(rendered);

      expect(rendered).not.toMatch(/\|\s*Tool Executions\s*\|\s*0\s*\|/);
      expect(validation.failedRules).not.toContain('V7');
      expect(validation.valid).toBe(true);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('renders git provenance metadata into the session summary table and YAML block (M-007d)', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-fixture-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '017-git-provenance-render');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        ['---', 'title: "Spec: Git Provenance Render"', '---', '# Spec'].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          _source: 'opencode-capture',
          userPrompts: [
            {
              prompt: 'Validate git provenance metadata render.',
              timestamp: '2026-03-17T10:00:00Z',
            },
          ],
          observations: [
            {
              title: 'Git provenance render validation',
              narrative: 'Verified git metadata flows through to rendered memory.',
              facts: ['Tool: Read File: scripts/core/workflow.ts Result: inspected enrichment pipeline'],
              files: [path.join(specFolderPath, 'spec.md')],
              timestamp: '2026-03-17T10:00:30Z',
            },
          ],
        },
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
          specFolderName || '017-git-provenance-render',
          {
            HEAD_REF: 'feat/m-007d-git-metadata',
            COMMIT_REF: 'a1b2c3d4e5f6',
            REPOSITORY_STATE: 'dirty',
            IS_DETACHED_HEAD: false,
          },
        ),
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');

      // Session summary table should include Git Ref row
      expect(rendered).toMatch(/\|\s*Git Ref\s*\|\s*feat\/m-007d-git-metadata\s*\(`a1b2c3d4e5f6`\)\s*\|/);

      // YAML metadata block should include git provenance fields
      expect(rendered).toContain('head_ref: "feat/m-007d-git-metadata"');
      expect(rendered).toContain('commit_ref: "a1b2c3d4e5f6"');
      expect(rendered).toContain('repository_state: "dirty"');
      expect(rendered).toContain('is_detached_head: No');
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('omits the Git Ref row when HEAD_REF is null (M-007d)', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-fixture-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '018-no-git-context');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        ['---', 'title: "Spec: No Git Context"', '---', '# Spec'].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          _source: 'opencode-capture',
          userPrompts: [
            {
              prompt: 'Validate git ref row is omitted when not available.',
              timestamp: '2026-03-17T10:05:00Z',
            },
          ],
          observations: [
            {
              title: 'No git context render validation',
              narrative: 'Verified git ref row is hidden when HEAD_REF is null.',
              facts: ['Tool: Read'],
              files: [],
              timestamp: '2026-03-17T10:05:30Z',
            },
          ],
        },
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
          specFolderName || '018-no-git-context',
          {
            HEAD_REF: null,
            COMMIT_REF: null,
            REPOSITORY_STATE: 'unavailable',
            IS_DETACHED_HEAD: false,
          },
        ),
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');

      // Git Ref row should NOT appear when HEAD_REF is null
      expect(rendered).not.toMatch(/\|\s*Git Ref\s*\|/);

      // YAML metadata block should still include the fields (empty values)
      expect(rendered).toContain('head_ref: ""');
      expect(rendered).toContain('repository_state: "unavailable"');
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('renders split decision confidence when choice and rationale diverge', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-render-fixture-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '016-decision-confidence-render');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        [
          '---',
          'title: "Spec: Decision Confidence Render"',
          '---',
          '# Spec',
        ].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const collectedData = {
        _source: 'opencode-capture',
        _toolCallCount: 2,
        FILES: [],
        userPrompts: [
          {
            prompt: 'Choose the database strategy for the render-confidence fixture.',
            timestamp: '2026-03-06T09:25:00Z',
          },
        ],
        observations: [
          {
            type: 'decision',
            title: 'Choose database',
            narrative: 'We reviewed the database options.',
            timestamp: '2026-03-06T09:25:30Z',
            facts: [
              'Option A: PostgreSQL - Relational database',
              'Option B: SQLite - Embedded database',
            ],
            _manualDecision: {
              fullText: 'Selected PostgreSQL.',
              chosenApproach: 'PostgreSQL',
            },
          },
        ],
      };

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData,
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
          specFolderName || '016-decision-confidence-render',
          {
            TOOL_COUNT: 0,
            TOOL_COUNTS: { Read: 0, Edit: 0, Write: 0, Bash: 0, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
            FILES: [],
            HAS_FILES: false,
            FILE_COUNT: 0,
            FILE_PROGRESS: [],
            HAS_FILE_PROGRESS: false,
          }
        ),
        silent: true,
      });

      const renderedPath = path.join(result.contextDir, result.contextFilename);
      const rendered = fs.readFileSync(renderedPath, 'utf-8');

      expect(rendered).toContain('Choice: 95% / Rationale: 70%');
      expect(rendered).toContain('**Confidence**: 70%');
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
