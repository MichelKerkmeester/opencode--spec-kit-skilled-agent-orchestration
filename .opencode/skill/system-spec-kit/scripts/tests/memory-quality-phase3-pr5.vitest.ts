import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectedDataFull } from '../extractors/collect-session-data';
import { sanitizeTriggerPhrase } from '../lib/trigger-phrase-sanitizer';

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

interface Phase3Fixture {
  specFolder: string;
  sessionSummary: string;
  triggerPhrases?: string[];
  keyDecisions?: Array<{ decision: string; rationale?: string }>;
  nextSteps?: string[];
  filesModified?: Array<{ path: string; action?: string; description?: string }>;
  expectedAbsentTriggers?: string[];
  expectedPresentTriggers?: string[];
  expectedAbsentTopics?: string[];
  expectedPresentTopics?: string[];
}

const createdTempRoots: string[] = [];

function readFixture(name: string): Phase3Fixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as Phase3Fixture;
}

function buildSpecFolder(tempRoot: string, fixture: Phase3Fixture): string {
  const specFolderPath = path.join(tempRoot, fixture.specFolder);
  fs.mkdirSync(path.join(specFolderPath, 'memory'), { recursive: true });
  fs.writeFileSync(
    path.join(specFolderPath, 'spec.md'),
    [
      '---',
      'title: "Spec: Phase 3 PR-5 Fixture"',
      'trigger_phrases:',
      '  - "phase 3 pr5 fixture"',
      '  - "trigger phrase sanitizer"',
      '---',
      '',
      '# Phase 3 PR-5 Fixture',
    ].join('\n'),
    'utf-8'
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

function parseKeyTopics(content: string): string[] {
  const match = content.match(/\*\*Key Topics:\*\*\s*(.+)/);
  if (!match) {
    return [];
  }

  return Array.from(match[1].matchAll(/`([^`]+)`/g)).map((entry) => entry[1].toLowerCase());
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

describe('Phase 3 PR-5 F-AC3 fixture replay', () => {
  const fixtureNames = [
    'F-AC3-path-fragment.json',
    'F-AC3-standalone-stopwords.json',
    'F-AC3-suspicious-prefix.json',
    'F-AC3-synthetic-bigrams.json',
    'F-AC3-happy-path.json',
  ];

  it.each(fixtureNames)('keeps saved triggers and rendered topics free of junk for %s', async (fixtureName) => {
    const fixture = readFixture(fixtureName);
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-phase3-pr5-'));
    createdTempRoots.push(tempRoot);

    const specFolderPath = buildSpecFolder(tempRoot, fixture);
    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = path.join(specFolderPath, 'memory');

    const { runWorkflow } = await import('../core/workflow');
    const rawInput = { ...fixture, _source: 'file' };
    const result = await runWorkflow({
      specFolderArg: specFolderPath,
      collectedData: rawInput as unknown as CollectedDataFull,
      silent: true,
    });

    const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf8');
    const triggerPhrases = parseFrontmatterTriggerPhrases(rendered);
    const keyTopics = parseKeyTopics(rendered);

    for (const phrase of triggerPhrases) {
      expect(sanitizeTriggerPhrase(phrase).keep).toBe(true);
    }

    for (const phrase of keyTopics) {
      expect(sanitizeTriggerPhrase(phrase).keep).toBe(true);
    }

    for (const phrase of fixture.expectedAbsentTriggers ?? []) {
      expect(triggerPhrases).not.toContain(phrase.toLowerCase());
    }

    for (const phrase of fixture.expectedPresentTriggers ?? []) {
      expect(triggerPhrases).toContain(phrase.toLowerCase());
    }

    for (const phrase of fixture.expectedAbsentTopics ?? []) {
      expect(keyTopics).not.toContain(phrase.toLowerCase());
    }

    for (const phrase of fixture.expectedPresentTopics ?? []) {
      expect(keyTopics).toContain(phrase.toLowerCase());
    }
  });
});
