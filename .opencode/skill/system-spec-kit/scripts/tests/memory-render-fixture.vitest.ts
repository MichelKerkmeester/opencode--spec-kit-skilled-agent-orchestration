// TEST: Memory Render Fixture Regression
// End-to-end regression for rendered memory naming and quality linting
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
import type { SessionData } from '../types/session-types';

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
  updateMetadataWithEmbedding: vi.fn(async () => undefined),
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
    OUTCOMES: [{ OUTCOME: 'Rendered memory output stays specific and passes the lint gate.' }],
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
            files: ['scripts/core/workflow.ts'],
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
      const frontmatterTitle = rendered.match(/^title:\s*"([^"]+)"$/m)?.[1] ?? '';
      const heading = rendered.match(/^#\s+(.+)$/m)?.[1] ?? '';

      expect(result.contextFilename).toBe('06-03-26_09-30__memory-generator-naming-guardrail.md');
      expect(result.contextFilename).not.toContain('development-session');
      expect(result.contextFilename).not.toContain('table-of-contents');
      expect(result.contextFilename).not.toContain('epistemic-state-captured');

      expect(heading).toBe('Memory Generator Naming Guardrail');
      expect(frontmatterTitle).toContain('Memory Generator Naming Guardrail');
      expect(frontmatterTitle).not.toMatch(/to promote a memory|epistemic state captured at session start|table of contents/i);
      expect(rendered).not.toMatch(/^#\s*(To promote a memory|Epistemic state captured at session start|Table of Contents)\b/im);

      expect(validation.failedRules).toEqual([]);
      expect(validation.valid).toBe(true);
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
});
