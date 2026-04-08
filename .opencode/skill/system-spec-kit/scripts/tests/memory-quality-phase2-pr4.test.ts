import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectedDataFull } from '../extractors/collect-session-data';
import type { SessionData } from '../types/session-types';
import { normalizeInputData, type RawInputData } from '../utils/input-normalizer';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality');
const SCRIPT_DIR = path.resolve(TEST_DIR, '..');

const workflowHarness = vi.hoisted(() => ({
  specFolderPath: '',
  contextDir: '',
}));

const gitHarness = vi.hoisted(() => ({
  result: {
    observations: [
      {
        title: 'Stubbed git observation',
        narrative: 'Injected git observation should never leak into JSON-mode saves.',
        facts: ['This fact should never appear in authored JSON-mode content.'],
        files: ['.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts'],
      },
    ],
    FILES: [
      {
        FILE_PATH: '.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts',
        DESCRIPTION: 'Injected git file description should never appear in JSON-mode files.',
        ACTION: 'Modified',
      },
    ],
    summary: 'STUBBED GIT SUMMARY SHOULD NOT LEAK',
    commitCount: 12,
    uncommittedCount: 1,
    headRef: 'HEAD',
    commitRef: 'abc1234',
    repositoryState: 'dirty',
    isDetachedHead: true,
  },
}));

const extractGitContextMock = vi.hoisted(() => vi.fn(async () => gitHarness.result));

vi.mock('../spec-folder', () => ({
  detectSpecFolder: vi.fn(async () => workflowHarness.specFolderPath),
  setupContextDirectory: vi.fn(async () => workflowHarness.contextDir),
}));

vi.mock('../extractors/git-context-extractor', () => ({
  extractGitContext: extractGitContextMock,
}));

vi.mock('../core/memory-indexer', () => ({
  indexMemory: vi.fn(async () => 42),
  updateMetadataEmbeddingStatus: vi.fn(async () => true),
}));

vi.mock('@spec-kit/mcp-server/api/providers', () => ({
  retryManager: {
    getRetryStats: () => ({ queue_size: 0 }),
    processRetryQueue: vi.fn(async () => ({ processed: 0, succeeded: 0, failed: 0 })),
  },
}));

interface ProvenanceFixture {
  specFolder: string;
  sessionSummary: string;
  observations: RawInputData['observations'];
  keyDecisions: Array<{ decision: string; rationale?: string }>;
  filesModified: Array<{ path: string; action?: string; description?: string }>;
  triggerPhrases: string[];
  nextSteps: string[];
}

function readFixture(name: string): ProvenanceFixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as ProvenanceFixture;
}

function createSessionData(specFolderName: string, collectedData: CollectedDataFull): SessionData {
  const firstFile = collectedData.FILES?.[0];
  return {
    TITLE: 'Phase 2 PR-4 Provenance Fixture',
    DATE: '08-04-26',
    TIME: '12-00',
    SPEC_FOLDER: specFolderName,
    DURATION: '5m',
    SUMMARY: collectedData.SUMMARY || 'Missing summary',
    FILES: (collectedData.FILES || []).map((file) => ({
      FILE_PATH: file.FILE_PATH || file.path || '',
      DESCRIPTION: file.DESCRIPTION || file.description || '',
      ACTION: file.ACTION || file.action || 'Modified',
    })),
    HAS_FILES: (collectedData.FILES || []).length > 0,
    FILE_COUNT: (collectedData.FILES || []).length,
    CAPTURED_FILE_COUNT: (collectedData.FILES || []).length,
    FILESYSTEM_FILE_COUNT: (collectedData.FILES || []).length,
    GIT_CHANGED_FILE_COUNT: 0,
    OUTCOMES: [{ OUTCOME: 'JSON-mode provenance fields render from the stubbed git seam only.', TYPE: 'status' }],
    TOOL_COUNT: 2,
    MESSAGE_COUNT: 1,
    QUICK_SUMMARY: 'JSON-mode provenance fixture',
    SKILL_VERSION: '1.7.2',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    SESSION_ID: 'phase2-pr4-fixture',
    CHANNEL: 'test',
    IMPORTANCE_TIER: 'important',
    CONTEXT_TYPE: 'implementation',
    CREATED_AT_EPOCH: 1_775_649_600,
    LAST_ACCESSED_EPOCH: 1_775_649_600,
    EXPIRES_AT_EPOCH: 1_783_425_600,
    TOOL_COUNTS: { Read: 1, Edit: 0, Write: 0, Bash: 1, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
    DECISION_COUNT: 1,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1,
    PROJECT_PHASE: 'IMPLEMENTATION',
    ACTIVE_FILE: firstFile?.FILE_PATH || firstFile?.path || '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
    LAST_ACTION: 'Verified JSON-mode provenance-only injection.',
    NEXT_ACTION: 'Keep the F-AC6 regression test green.',
    BLOCKERS: 'None',
    HEAD_REF: collectedData.headRef ?? null,
    COMMIT_REF: collectedData.commitRef ?? null,
    REPOSITORY_STATE: collectedData.repositoryState ?? 'unavailable',
    IS_DETACHED_HEAD: collectedData.isDetachedHead === true,
    STATUS: 'active',
  };
}

function countProvenanceBlockLines(workflowSource: string): number {
  const lines = workflowSource.split('\n');
  const startIndex = lines.findIndex((line) => line.includes('PR-4 PROVENANCE BLOCK START'));
  const endIndex = lines.findIndex((line) => line.includes('PR-4 PROVENANCE BLOCK END'));

  expect(startIndex).toBeGreaterThanOrEqual(0);
  expect(endIndex).toBeGreaterThan(startIndex);

  return lines
    .slice(startIndex + 1, endIndex)
    .filter((line) => line.trim().length > 0)
    .length;
}

afterEach(() => {
  vi.clearAllMocks();
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
});

// TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper fixtures. The contract flip to compact retrieval wrappers changes the rendered body shape this test inspects.
describe.skip('F-AC6 — JSON-mode provenance-only injection', () => {
  // TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper template fixtures
  it.skip('fills only provenance fields from the stubbed git seam without contaminating authored JSON content', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-phase2-pr4-'));
    const specFolderPath = path.join(tempRoot, '002-single-owner-metadata');
    const contextDir = path.join(specFolderPath, 'memory');
    const snapshotInput: Array<Record<string, unknown>> = [];
    const fixture = readFixture('F-AC6-provenance.json');
    const rawInput = { ...fixture, _source: 'file' } as RawInputData;
    const normalized = normalizeInputData(rawInput) as CollectedDataFull;

    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Phase 2 PR-4 Provenance Fixture"', '---', '# Spec'].join('\n'),
      'utf-8'
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    CONFIG.TEMPLATE_DIR = path.resolve(TEST_DIR, '..', '..', 'templates');

    try {
      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        specFolderArg: specFolderPath,
        collectedData: rawInput as unknown as CollectedDataFull,
        collectSessionDataFn: async (collectedData, specFolderName) => {
          snapshotInput.push(JSON.parse(JSON.stringify({
            SUMMARY: collectedData.SUMMARY,
            observations: collectedData.observations,
            _manualDecisions: (collectedData as Record<string, unknown>)._manualDecisions,
            headRef: collectedData.headRef,
            commitRef: collectedData.commitRef,
            repositoryState: collectedData.repositoryState,
            isDetachedHead: collectedData.isDetachedHead,
          })) as Record<string, unknown>);
          return createSessionData(specFolderName || '002-single-owner-metadata', collectedData);
        },
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf8');
      const workflowSource = fs.readFileSync(path.join(SCRIPT_DIR, 'core', 'workflow.ts'), 'utf8');
      const provenanceBlockLines = countProvenanceBlockLines(workflowSource);

      expect(extractGitContextMock).toHaveBeenCalledOnce();
      expect(extractGitContextMock).toHaveBeenCalledWith(CONFIG.PROJECT_ROOT, specFolderPath);
      expect(snapshotInput).toHaveLength(1);
      expect(snapshotInput[0].headRef).toBe('HEAD');
      expect(snapshotInput[0].commitRef).toBe('abc1234');
      expect(snapshotInput[0].repositoryState).toBe('dirty');
      expect(snapshotInput[0].isDetachedHead).toBe(true);
      expect(snapshotInput[0].SUMMARY).toBe(normalized.SUMMARY);
      expect(snapshotInput[0].observations).toEqual(normalized.observations);
      expect(snapshotInput[0]._manualDecisions).toEqual((normalized as Record<string, unknown>)._manualDecisions);
      expect(rendered).toContain('head_ref: "HEAD"');
      expect(rendered).toContain('commit_ref: "abc1234"');
      expect(rendered).toContain('repository_state: "dirty"');
      expect(rendered).toContain('is_detached_head: Yes');
      expect(rendered).toContain(fixture.sessionSummary);
      expect(rendered).not.toContain('STUBBED GIT SUMMARY SHOULD NOT LEAK');
      expect(rendered).not.toContain('Injected git observation should never leak into JSON-mode saves.');
      expect(rendered).not.toContain('Injected git file description should never appear in JSON-mode files.');
      expect(provenanceBlockLines).toBeLessThanOrEqual(10);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
