// ───────────────────────────────────────────────────────────────
// MODULE: Workflow E2E Tests
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildRichSessionData, buildSparseSessionData, buildTreeThinningSessionData } from './fixtures/session-data-factory';

/* ───────────────────────────────────────────────────────────────
   1. CAPTURE MOCKS
──────────────────────────────────────────────────────────────── */

const captureConversation = vi.hoisted(() => vi.fn(async () => null));
const captureClaudeConversation = vi.hoisted(() => vi.fn(async () => null));
const captureCodexConversation = vi.hoisted(() => vi.fn(async () => null));
const captureCopilotConversation = vi.hoisted(() => vi.fn(async () => null));
const captureGeminiConversation = vi.hoisted(() => vi.fn(async () => null));

vi.mock('../extractors/opencode-capture', () => ({
  captureConversation,
}));

vi.mock('../extractors/claude-code-capture', () => ({
  captureClaudeConversation,
}));

vi.mock('../extractors/codex-cli-capture', () => ({
  captureCodexConversation,
}));

vi.mock('../extractors/copilot-cli-capture', () => ({
  captureCopilotConversation,
}));

vi.mock('../extractors/gemini-cli-capture', () => ({
  captureGeminiConversation,
}));

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const SPEC_RELATIVE_PATH = '02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/010-integration-testing';
const TEST_TEMPLATES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'templates',
);
const createdTempRoots = new Set<string>();
const originalCwd = process.cwd();
const originalEnv = {
  MEMORY_DB_PATH: process.env.MEMORY_DB_PATH,
  SPEC_KIT_DB_DIR: process.env.SPEC_KIT_DB_DIR,
  MEMORY_ALLOWED_PATHS: process.env.MEMORY_ALLOWED_PATHS,
  SYSTEM_SPEC_KIT_CAPTURE_SOURCE: process.env.SYSTEM_SPEC_KIT_CAPTURE_SOURCE,
};

/* ───────────────────────────────────────────────────────────────
   3. HARNESS SETUP
──────────────────────────────────────────────────────────────── */

interface WorkflowHarness {
  repoRoot: string;
  specFolderPath: string;
  contextDir: string;
  dbDir: string;
  dataDir: string;
  specRelativePath: string;
}

function buildPerFolderDescription(specRelativePath: string): Record<string, unknown> {
  const segments = specRelativePath.split('/').filter(Boolean);
  const folderName = segments[segments.length - 1] || '010-integration-testing';
  const specIdMatch = folderName.match(/^(\d+)/);

  return {
    specFolder: specRelativePath,
    description: 'Integration testing coverage for the perfect session capturing save pipeline.',
    keywords: ['integration', 'workflow', 'memory', 'testing'],
    lastUpdated: '2026-03-16T10:00:00.000Z',
    specId: specIdMatch ? specIdMatch[1] : '010',
    folderSlug: folderName.replace(/^\d+-/, ''),
    parentChain: segments.slice(0, -1),
    memorySequence: 0,
    memoryNameHistory: [],
  };
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8');
}

function createHarness(): WorkflowHarness {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-e2e-'));
  const specFolderPath = path.join(repoRoot, '.opencode', 'specs', SPEC_RELATIVE_PATH);
  const contextDir = path.join(specFolderPath, 'memory');
  const dbDir = path.join(repoRoot, '.tmp-db');
  const dataDir = path.join(repoRoot, '.tmp-data');
  createdTempRoots.add(repoRoot);

  fs.mkdirSync(contextDir, { recursive: true });
  fs.mkdirSync(path.join(specFolderPath, 'scratch'), { recursive: true });
  fs.mkdirSync(dbDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(
    path.join(specFolderPath, 'spec.md'),
    [
      '---',
      'title: "Perfect Session Capturing - Integration Testing"',
      'trigger_phrases:',
      '  - "perfect session capturing"',
      '  - "integration testing"',
      '---',
      '',
      '# Perfect Session Capturing - Integration Testing',
      '',
      '## Scope',
      '',
      'Validate the real save pipeline with temp-repo isolation and filesystem assertions.',
      '',
      '## Files',
      '',
      '| File Path | Change Type | Description |',
      '|-----------|-------------|-------------|',
      '| `scripts/tests/workflow-e2e.vitest.ts` | Add | Real save-pipeline E2E coverage |',
      '| `scripts/tests/test-integration.vitest.ts` | Add | Legacy integration parity in Vitest |',
    ].join('\n'),
    'utf-8',
  );
  fs.writeFileSync(path.join(specFolderPath, 'plan.md'), '# Plan\n\n## Summary\n\nAdd real workflow integration coverage.\n', 'utf-8');
  fs.writeFileSync(path.join(specFolderPath, 'tasks.md'), '- [ ] Add workflow save E2E coverage\n- [ ] Migrate legacy integration runner\n', 'utf-8');
  fs.writeFileSync(path.join(specFolderPath, 'checklist.md'), '## P0\n- [ ] Filesystem side effects verified\n', 'utf-8');
  fs.writeFileSync(path.join(specFolderPath, 'decision-record.md'), '## DR-010\n\n**Decision:** Keep the real write path under test.\n', 'utf-8');
  writeJson(path.join(specFolderPath, 'description.json'), buildPerFolderDescription(SPEC_RELATIVE_PATH));

  return {
    repoRoot,
    specFolderPath,
    contextDir,
    dbDir,
    dataDir,
    specRelativePath: SPEC_RELATIVE_PATH,
  };
}

function createExplicitJsonInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    spec_folder: SPEC_RELATIVE_PATH,
    session_summary: 'Implemented the integration testing phase with a real workflow save harness and Vitest migration.',
    trigger_phrases: [
      'perfect session capturing',
      'integration testing',
      'workflow save pipeline',
      'memory sequence tracking',
    ],
    user_prompts: [
      {
        prompt: 'Implement the integration testing phase with a temp-repo harness and real save-pipeline assertions.',
        timestamp: '2026-03-16T10:15:00.000Z',
      },
      {
        prompt: 'Cover duplicate deduplication, insufficiency aborts, index failures, and tree-thinning interaction.',
        timestamp: '2026-03-16T10:18:00.000Z',
      },
    ],
    observations: [
      {
        type: 'implementation',
        title: 'Workflow save pipeline evidence',
        narrative: 'Verified the workflow, file writer, and memory tracking path against the integration testing spec.',
        facts: [
          'Tool: Read File: scripts/core/workflow.ts Result: verified write, description tracking, and indexing order.',
          'Tool: Bash Result: exercised the workflow against isolated temp-repo fixtures.',
          'Decision: Keep the render, quality, and file-writing path real while only narrowing mocks outside the save boundary.',
        ],
        files: [
          'scripts/core/workflow.ts',
          'scripts/core/file-writer.ts',
          'scripts/tests/test-integration.vitest.ts',
        ],
        timestamp: '2026-03-16T10:20:00.000Z',
      },
    ],
    recent_context: [
      {
        request: 'Finish integration testing for perfect session capturing.',
        learning: 'A deterministic collectSessionDataFn stabilizes save-path assertions while the real render and write path remains under test.',
      },
    ],
    FILES: [
      {
        FILE_PATH: 'scripts/core/workflow.ts',
        DESCRIPTION: 'Confirmed the workflow saves markdown before updating description.json and indexing.',
        ACTION: 'Modified',
      },
      {
        FILE_PATH: 'scripts/tests/test-integration.vitest.ts',
        DESCRIPTION: 'Migrated the legacy integration runner into a Vitest suite.',
        ACTION: 'Created',
      },
    ],
    key_decisions: [
      'Use an isolated temp repo with real write paths for workflow integration testing.',
      'Keep deterministic session data collection limited to save-boundary assertions that would otherwise flap.',
    ],
    next_steps: [
      'Keep the workflow E2E suite green as the save pipeline evolves.',
    ],
    ...overrides,
  };
}

function writeInputFile(harness: WorkflowHarness, name: string, payload: Record<string, unknown>): string {
  const dataFile = path.join(harness.dataDir, name);
  writeJson(dataFile, payload);
  return dataFile;
}

/* ───────────────────────────────────────────────────────────────
   4. ASSERTION HELPERS
──────────────────────────────────────────────────────────────── */

function listMarkdownFiles(contextDir: string): string[] {
  if (!fs.existsSync(contextDir)) {
    return [];
  }

  return fs.readdirSync(contextDir).filter((entry) => entry.endsWith('.md')).sort();
}

function readDescription(harness: WorkflowHarness): { memorySequence: number; memoryNameHistory: string[] } {
  const raw = fs.readFileSync(path.join(harness.specFolderPath, 'description.json'), 'utf-8');
  return JSON.parse(raw) as { memorySequence: number; memoryNameHistory: string[] };
}

function readMetadata(harness: WorkflowHarness): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(harness.contextDir, 'metadata.json'), 'utf-8')) as Record<string, unknown>;
}

/* ───────────────────────────────────────────────────────────────
   5. ENVIRONMENT & MODULE IMPORT
──────────────────────────────────────────────────────────────── */

function configureHarnessEnvironment(harness: WorkflowHarness, extraEnv: Record<string, string | undefined> = {}): void {
  process.chdir(harness.repoRoot);
  process.env.MEMORY_DB_PATH = path.join(harness.dbDir, 'context-index.sqlite');
  process.env.SPEC_KIT_DB_DIR = harness.dbDir;
  process.env.MEMORY_ALLOWED_PATHS = [harness.repoRoot, harness.specFolderPath, harness.contextDir].join(path.delimiter);

  if ('SYSTEM_SPEC_KIT_CAPTURE_SOURCE' in extraEnv) {
    if (extraEnv.SYSTEM_SPEC_KIT_CAPTURE_SOURCE === undefined) {
      delete process.env.SYSTEM_SPEC_KIT_CAPTURE_SOURCE;
    } else {
      process.env.SYSTEM_SPEC_KIT_CAPTURE_SOURCE = extraEnv.SYSTEM_SPEC_KIT_CAPTURE_SOURCE;
    }
  }
}

async function importWorkflowForHarness(
  harness: WorkflowHarness,
  options: {
    statelessCapture?: Record<string, unknown> | null;
    failEmbedding?: boolean;
  } = {},
): Promise<typeof import('../core/workflow')> {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock('../core/memory-indexer');

  captureConversation.mockReset();
  captureClaudeConversation.mockReset();
  captureCodexConversation.mockReset();
  captureCopilotConversation.mockReset();
  captureGeminiConversation.mockReset();
  captureConversation.mockResolvedValue(options.statelessCapture ?? null);
  captureClaudeConversation.mockResolvedValue(null);
  captureCodexConversation.mockResolvedValue(null);
  captureCopilotConversation.mockResolvedValue(null);
  captureGeminiConversation.mockResolvedValue(null);

  if (options.failEmbedding) {
    vi.doMock('../core/memory-indexer', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../core/memory-indexer')>();
      return {
        ...actual,
        indexMemory: vi.fn(async () => {
          throw new Error('forced embedding failure for workflow E2E');
        }),
      };
    });
  }

  const coreModule = await import('../core');
  coreModule.CONFIG.PROJECT_ROOT = harness.repoRoot;
  coreModule.CONFIG.TEMPLATE_DIR = TEST_TEMPLATES_DIR;
  coreModule.CONFIG.DATA_FILE = null;
  coreModule.CONFIG.SPEC_FOLDER_ARG = null;

  return import('../core/workflow');
}

/* ───────────────────────────────────────────────────────────────
   6. TEARDOWN
──────────────────────────────────────────────────────────────── */

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.doUnmock('../core/memory-indexer');
  captureConversation.mockReset();
  captureClaudeConversation.mockReset();
  captureCodexConversation.mockReset();
  captureCopilotConversation.mockReset();
  captureGeminiConversation.mockReset();

  if (originalEnv.MEMORY_DB_PATH === undefined) {
    delete process.env.MEMORY_DB_PATH;
  } else {
    process.env.MEMORY_DB_PATH = originalEnv.MEMORY_DB_PATH;
  }

  if (originalEnv.SPEC_KIT_DB_DIR === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalEnv.SPEC_KIT_DB_DIR;
  }

  if (originalEnv.MEMORY_ALLOWED_PATHS === undefined) {
    delete process.env.MEMORY_ALLOWED_PATHS;
  } else {
    process.env.MEMORY_ALLOWED_PATHS = originalEnv.MEMORY_ALLOWED_PATHS;
  }

  if (originalEnv.SYSTEM_SPEC_KIT_CAPTURE_SOURCE === undefined) {
    delete process.env.SYSTEM_SPEC_KIT_CAPTURE_SOURCE;
  } else {
    process.env.SYSTEM_SPEC_KIT_CAPTURE_SOURCE = originalEnv.SYSTEM_SPEC_KIT_CAPTURE_SOURCE;
  }

  process.chdir(originalCwd);

  for (const root of createdTempRoots) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch (err) {
      console.warn(`[workflow-e2e] cleanup failed for ${root}: ${(err as Error).message}`);
    }
  }
  createdTempRoots.clear();
});

/* ───────────────────────────────────────────────────────────────
   7. TESTS
──────────────────────────────────────────────────────────────── */

// Sequential-only: tests mutate process.cwd() and process.env, which
// prevents safe parallel execution within this file.
describe('workflow E2E save pipeline', { timeout: 30_000 }, () => {
  it('writes markdown and metadata, then updates memorySequence and memoryNameHistory', async () => {
    const harness = createHarness();
    configureHarnessEnvironment(harness);
    const dataFile = writeInputFile(harness, 'happy-path.json', createExplicitJsonInput());
    const workflowModule = await importWorkflowForHarness(harness);

    const result = await workflowModule.runWorkflow({
      dataFile,
      specFolderArg: harness.specFolderPath,
      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
      silent: true,
    });

    const memoryPath = path.join(result.contextDir, result.contextFilename);
    const description = readDescription(harness);

    expect(fs.existsSync(memoryPath)).toBe(true);
    expect(fs.existsSync(path.join(result.contextDir, 'metadata.json'))).toBe(true);
    expect(result.writtenFiles).toEqual(expect.arrayContaining([result.contextFilename, 'metadata.json']));
    expect(description.memorySequence).toBe(1);
    expect(description.memoryNameHistory).toEqual([result.contextFilename]);
  });

  it('blocks stateless saves that do not align to the target spec folder and leaves bookkeeping unchanged', async () => {
    const harness = createHarness();
    configureHarnessEnvironment(harness, {
      SYSTEM_SPEC_KIT_CAPTURE_SOURCE: 'opencode-capture',
    });

    const workflowModule = await importWorkflowForHarness(harness, {
      statelessCapture: {
        exchanges: [],
        toolCalls: [
          {
            tool: 'bash',
            status: 'completed',
            timestamp: '2026-03-16T10:46:00.000Z',
            input: {
              command: "sed -n '1,80p' .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-outsourced-agent-memory/spec.md",
            },
            output: 'Inspected a foreign spec for a different phase.',
          },
        ],
        metadata: {},
        sessionTitle: 'Foreign spec capture',
        sessionId: 'foreign-spec-session',
        capturedAt: '2026-03-16T10:46:30.000Z',
      },
    });

    await expect(workflowModule.runWorkflow({
      specFolderArg: harness.specRelativePath,
      silent: true,
    })).rejects.toThrow(/ALIGNMENT_BLOCK.*(?:No spec-specific anchors|% of captured file paths)/);

    const description = readDescription(harness);
    expect(listMarkdownFiles(harness.contextDir)).toEqual([]);
    expect(fs.existsSync(path.join(harness.contextDir, 'metadata.json'))).toBe(false);
    expect(description.memorySequence).toBe(0);
    expect(description.memoryNameHistory).toEqual([]);
  });

  it('skips duplicate markdown content on a second identical save without bumping description tracking', async () => {
    const harness = createHarness();
    configureHarnessEnvironment(harness);
    const dataFile = writeInputFile(harness, 'duplicate.json', createExplicitJsonInput());
    const workflowModule = await importWorkflowForHarness(harness);
    const sessionDataFactory = async (_collectedData: unknown, specFolderName?: string | null) => (
      buildRichSessionData(specFolderName || harness.specRelativePath)
    );

    const first = await workflowModule.runWorkflow({
      dataFile,
      specFolderArg: harness.specFolderPath,
      collectSessionDataFn: sessionDataFactory,
      silent: true,
    });
    const firstDescription = readDescription(harness);

    const second = await workflowModule.runWorkflow({
      dataFile,
      specFolderArg: harness.specFolderPath,
      collectSessionDataFn: sessionDataFactory,
      silent: true,
    });
    const secondDescription = readDescription(harness);

    expect(listMarkdownFiles(harness.contextDir)).toEqual([first.contextFilename]);
    expect(firstDescription.memorySequence).toBe(1);
    expect(secondDescription.memorySequence).toBe(1);
    expect(secondDescription.memoryNameHistory).toEqual([first.contextFilename]);
    expect(second.writtenFiles).not.toContain(second.contextFilename);
  });

  it('aborts on insufficient context before writing files or mutating description tracking', async () => {
    const harness = createHarness();
    configureHarnessEnvironment(harness);
    const dataFile = writeInputFile(harness, 'insufficient.json', createExplicitJsonInput({
      session_summary: 'Sparse insufficiency probe for the workflow guard chain.',
      trigger_phrases: ['integration testing', 'sufficiency'],
      observations: [],
      FILES: [],
      key_decisions: [],
      next_steps: [],
    }));
    const workflowModule = await importWorkflowForHarness(harness);

    await expect(workflowModule.runWorkflow({
      dataFile,
      specFolderArg: harness.specFolderPath,
      collectSessionDataFn: async (_collectedData, specFolderName) => buildSparseSessionData(specFolderName || harness.specRelativePath),
      silent: true,
    })).rejects.toThrow(/INSUFFICIENT_CONTEXT_ABORT/);

    const description = readDescription(harness);
    expect(listMarkdownFiles(harness.contextDir)).toEqual([]);
    expect(fs.existsSync(path.join(harness.contextDir, 'metadata.json'))).toBe(false);
    expect(description.memorySequence).toBe(0);
    expect(description.memoryNameHistory).toEqual([]);
  });

  it('commits markdown and description tracking even when indexing fails later', async () => {
    const harness = createHarness();
    configureHarnessEnvironment(harness);
    const dataFile = writeInputFile(harness, 'index-failure.json', createExplicitJsonInput());
    const workflowModule = await importWorkflowForHarness(harness, { failEmbedding: true });

    const result = await workflowModule.runWorkflow({
      dataFile,
      specFolderArg: harness.specFolderPath,
      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
      silent: true,
    });

    const description = readDescription(harness);
    const metadata = readMetadata(harness) as { embedding?: { status?: string } };

    expect(result.memoryId).toBeNull();
    expect(result.indexingStatus).toMatchObject({
      status: 'failed_embedding',
      memoryId: null,
    });
    expect(fs.existsSync(path.join(result.contextDir, result.contextFilename))).toBe(true);
    expect(metadata.embedding?.status).toBe('failed_embedding');
    expect((metadata.embedding as { errorMessage?: string } | undefined)?.errorMessage).toBe('forced embedding failure for workflow E2E');
    expect(description.memorySequence).toBe(1);
    expect(description.memoryNameHistory).toEqual([result.contextFilename]);
  });

  it('renders tree-thinning merge notes while still completing save bookkeeping', async () => {
    const harness = createHarness();
    configureHarnessEnvironment(harness);
    const dataFile = writeInputFile(harness, 'tree-thinning.json', createExplicitJsonInput({
      trigger_phrases: ['tree thinning', 'workflow integration', 'memory sequence'],
    }));
    const workflowModule = await importWorkflowForHarness(harness);

    const result = await workflowModule.runWorkflow({
      dataFile,
      specFolderArg: harness.specFolderPath,
      collectSessionDataFn: async (_collectedData, specFolderName) => buildTreeThinningSessionData(specFolderName || harness.specRelativePath),
      silent: true,
    });

    const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');
    const description = readDescription(harness);

    expect(rendered).toContain('Tree-thinning merged 3 small files');
    expect(fs.existsSync(path.join(result.contextDir, 'metadata.json'))).toBe(true);
    expect(description.memorySequence).toBe(1);
    expect(description.memoryNameHistory).toEqual([result.contextFilename]);
  });
});
