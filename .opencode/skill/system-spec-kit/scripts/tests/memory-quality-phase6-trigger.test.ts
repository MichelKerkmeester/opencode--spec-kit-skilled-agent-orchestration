import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectedDataFull } from '../extractors/collect-session-data';

const TEST_DIR = path.dirname(new URL(import.meta.url).pathname);
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality');

const workflowHarness = vi.hoisted(() => ({
  specFolderPath: '',
  contextDir: '',
}));

vi.mock('../spec-folder', () => ({
  detectSpecFolder: vi.fn(async () => workflowHarness.specFolderPath),
  setupContextDirectory: vi.fn(async () => workflowHarness.contextDir),
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

interface Phase6TriggerFixture {
  specFolder: string;
  sessionSummary: string;
  triggerPhrases?: string[];
  keyDecisions?: Array<{ decision: string; rationale?: string }>;
  filesModified?: Array<{ path: string; action?: string; description?: string }>;
  expectedPresentTriggers?: string[];
  expectedAbsentTriggers?: string[];
}

const createdTempRoots: string[] = [];

function readFixture(name: string): Phase6TriggerFixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as Phase6TriggerFixture;
}

function buildSpecFolder(tempRoot: string, fixture: Phase6TriggerFixture): string {
  const specFolderPath = path.join(tempRoot, fixture.specFolder);
  fs.mkdirSync(path.join(specFolderPath, 'memory'), { recursive: true });
  fs.writeFileSync(
    path.join(specFolderPath, 'spec.md'),
    [
      '---',
      'title: "Spec: Phase 6 trigger fixture"',
      'trigger_phrases:',
      '  - "phase 6 trigger fixture"',
      '---',
      '',
      '# Phase 6 Trigger Fixture',
    ].join('\n'),
    'utf8',
  );
  return specFolderPath;
}

function parseFrontmatterTriggerPhrases(content: string): string[] {
  const lines = content.split('\n');
  const triggerIndex = lines.findIndex((line) => line.trim() === 'trigger_phrases:');
  if (triggerIndex === -1) {
    return [];
  }

  const phrases: string[] = [];
  for (let index = triggerIndex + 1; index < lines.length; index++) {
    const line = lines[index];
    if (line.startsWith('  - ')) {
      phrases.push(line.replace(/^  - /, '').replace(/^"|"$/g, '').toLowerCase());
      continue;
    }
    break;
  }

  return phrases;
}

afterEach(() => {
  vi.clearAllMocks();
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
  while (createdTempRoots.length > 0) {
    const tempRoot = createdTempRoots.pop();
    if (tempRoot) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
});

describe('Phase 6 trigger-surface duplication fixes', () => {
  it('keeps one useful cluster anchor while dropping parent packet scaffold noise', async () => {
    const fixture = readFixture('F-DUP-001-trigger-cluster.json');
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-phase6-trigger-cluster-'));
    createdTempRoots.push(tempRoot);

    const specFolderPath = buildSpecFolder(tempRoot, fixture);
    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = path.join(specFolderPath, 'memory');

    const { runWorkflow } = await import('../core/workflow');
    const result = await runWorkflow({
      specFolderArg: specFolderPath,
      collectedData: { ...fixture, _source: 'file' } as unknown as CollectedDataFull,
      silent: true,
    });

    const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf8');
    const triggerPhrases = parseFrontmatterTriggerPhrases(rendered);

    expect(triggerPhrases).toContain('claude optimization settings');
    expect(triggerPhrases).toContain('graphify research');
    expect(triggerPhrases).not.toContain('graph and context optimization');
    expect(triggerPhrases).not.toContain('kit/026');
    expect(triggerPhrases).not.toContain('optimization/001');
  });

  it('collapses hyphen-space aliases to one canonical trigger while preserving api cli mcp anchors', async () => {
    const fixture = readFixture('F-DUP-003-canonical-trigger.json');
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-phase6-trigger-canonical-'));
    createdTempRoots.push(tempRoot);

    const specFolderPath = buildSpecFolder(tempRoot, fixture);
    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = path.join(specFolderPath, 'memory');

    const { runWorkflow } = await import('../core/workflow');
    const result = await runWorkflow({
      specFolderArg: specFolderPath,
      collectedData: { ...fixture, _source: 'file' } as unknown as CollectedDataFull,
      silent: true,
    });

    const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf8');
    const triggerPhrases = parseFrontmatterTriggerPhrases(rendered);

    expect(triggerPhrases).toContain('codex-cli-compact');
    expect(triggerPhrases).toContain('tree-sitter');
    expect(triggerPhrases).toContain('implementation-summary');
    expect(triggerPhrases).not.toContain('codex cli compact');
    expect(triggerPhrases).not.toContain('tree sitter');
    expect(triggerPhrases).not.toContain('implementation summary');
    expect(triggerPhrases).toContain('api');
    expect(triggerPhrases).toContain('cli');
    expect(triggerPhrases).toContain('mcp');
  });
});
