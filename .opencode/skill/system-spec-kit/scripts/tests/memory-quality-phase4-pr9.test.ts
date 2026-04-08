import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectedDataFull } from '../extractors/collect-session-data';
import {
  METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM,
  METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL,
  METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL,
  METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL,
  METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL,
  METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL,
  METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL,
  METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL,
  METRIC_M9_MEMORY_SAVE_DURATION_SECONDS,
} from '../lib/memory-telemetry';
import { printPostSaveReview, reviewPostSaveQuality, type PostSaveReviewInput } from '../core/post-save-review';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
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

type ReviewFixture = {
  collectedData: NonNullable<PostSaveReviewInput['collectedData']>;
  savedContentLines: string[];
};

const tempFiles: string[] = [];
const tempDirs: string[] = [];

function readFixture(name: string): ReviewFixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as ReviewFixture;
}

function buildSavedContent(lines: string[]): string {
  return `${lines.join('\n')}\n`;
}

async function writeTempMemoryFile(content: string): Promise<string> {
  const filePath = path.join(
    os.tmpdir(),
    `memory-quality-phase4-pr9-${Date.now()}-${Math.random().toString(16).slice(2)}.md`,
  );
  await fsp.writeFile(filePath, content, 'utf8');
  tempFiles.push(filePath);
  return filePath;
}

function buildCollectedData(overrides: Partial<NonNullable<PostSaveReviewInput['collectedData']>> = {}): NonNullable<PostSaveReviewInput['collectedData']> {
  return {
    _source: 'file',
    saveMode: 'json',
    sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
    importanceTier: 'important',
    contextType: 'implementation',
    keyDecisions: [{ decision: 'Keep the reviewer deterministic' }],
    provenanceExpected: true,
    ...overrides,
  };
}

function buildMemoryContent(options: {
  title?: string;
  description?: string;
  triggerPhrases?: string[];
  commentAnchor?: string;
  closingAnchor?: string;
  overview?: string;
  decisionHeading?: string;
  decisionBody?: string;
  metadataTier?: string;
  headRef?: string;
  commitRef?: string;
  repositoryState?: string;
  supersedes?: string[];
} = {}): string {
  const triggerPhrases = options.triggerPhrases ?? [
    'phase 4 reviewer fixture',
    'memory telemetry contract',
  ];
  const supersedes = options.supersedes ?? [];
  const supersedesLines = supersedes.length > 0
    ? supersedes.map((entry) => `    - "${entry}"`)
    : ['    []'];

  return [
    '---',
    `title: "${options.title ?? 'Healthy Phase 4 Reviewer Fixture'}"`,
    `description: "${options.description ?? 'Healthy reviewer fixture for Phase 4 PR-9.'}"`,
    'trigger_phrases:',
    ...triggerPhrases.map((phrase) => `  - "${phrase}"`),
    'importance_tier: "important"',
    'context_type: "implementation"',
    '---',
    '',
    '# Healthy Phase 4 Reviewer Fixture',
    '',
    '## Table of Contents',
    '- [OVERVIEW](#overview)',
    '- [DECISIONS](#decisions)',
    '- [MEMORY METADATA](#memory-metadata)',
    '',
    `<!-- ANCHOR:${options.commentAnchor ?? 'overview'} -->`,
    '## 1. OVERVIEW',
    '',
    options.overview ?? 'Healthy reviewer contract baseline for PR-9.',
    '',
    `<!-- /ANCHOR:${options.closingAnchor ?? options.commentAnchor ?? 'overview'} -->`,
    '',
    '## 2. DECISIONS',
    '',
    options.decisionHeading ?? '### Decision 1: Keep the reviewer deterministic',
    '',
    options.decisionBody ?? 'Authored decision text is preserved without placeholder contamination.',
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    'session_id: "phase4-pr9-inline"',
    `head_ref: "${options.headRef ?? 'main'}"`,
    `commit_ref: "${options.commitRef ?? 'abc123def456'}"`,
    `repository_state: "${options.repositoryState ?? 'clean'}"`,
    'is_detached_head: false',
    `importance_tier: "${options.metadataTier ?? 'important'}"`,
    'context_type: "implementation"',
    'decision_count: 1',
    'causal_links:',
    '  caused_by:',
    '    []',
    '  supersedes:',
    ...supersedesLines,
    '  derived_from:',
    '    []',
    '```',
    '',
  ].join('\n');
}

function parseStructuredEvents(stderrOutput: string): Array<Record<string, unknown>> {
  return stderrOutput
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as Record<string, unknown>];
      } catch {
        return [];
      }
    });
}

async function captureStreams<T>(fn: () => Promise<T> | T): Promise<{ result: T; stdout: string; stderr: string }> {
  let stdout = '';
  let stderr = '';
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
    stdout += `${args.map((arg) => String(arg)).join(' ')}\n`;
  });
  const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((chunk: string | Uint8Array) => {
    stdout += typeof chunk === 'string' ? chunk : chunk.toString();
    return true;
  }) as typeof process.stdout.write);
  const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((chunk: string | Uint8Array) => {
    stderr += typeof chunk === 'string' ? chunk : chunk.toString();
    return true;
  }) as typeof process.stderr.write);

  try {
    const result = await fn();
    return { result, stdout, stderr };
  } finally {
    consoleLogSpy.mockRestore();
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  }
}

async function reviewFixture(
  fixture: ReviewFixture,
  overrides: Partial<PostSaveReviewInput> = {},
): Promise<{ result: ReturnType<typeof reviewPostSaveQuality>; stdout: string; stderr: string }> {
  const savedFilePath = await writeTempMemoryFile(buildSavedContent(fixture.savedContentLines));

  return captureStreams(() => reviewPostSaveQuality({
    savedFilePath,
    inputMode: 'file',
    collectedData: fixture.collectedData,
    ...overrides,
  }));
}

function expectCheck(result: ReturnType<typeof reviewPostSaveQuality>, checkId: string, severity: 'HIGH' | 'MEDIUM'): void {
  expect(result.issues).toContainEqual(expect.objectContaining({
    checkId,
    severity,
  }));
}

function expectMetric(events: Array<Record<string, unknown>>, metricName: string): void {
  expect(events.some((event) => event.message === 'memory_metric' && event.metric_name === metricName)).toBe(true);
}

afterEach(async () => {
  vi.restoreAllMocks();
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
  await Promise.all(tempFiles.splice(0).map((filePath) => fsp.rm(filePath, { force: true })));
  await Promise.all(tempDirs.splice(0).map((dirPath) => fsp.rm(dirPath, { recursive: true, force: true })));
});

describe('Phase 4 PR-9 reviewer checks', () => {
  it('triggers CHECK-D1 HIGH on the broken truncation fixture and emits M1 + M8', async () => {
    const { result, stderr } = await reviewFixture(readFixture('F-broken-D1.json'));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D1', 'HIGH');
    expectMetric(events, METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM);
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('triggers CHECK-D2 HIGH on placeholder contamination and emits M2 + M8', async () => {
    const content = buildMemoryContent({
      decisionHeading: '### Observation Decision 1',
      decisionBody: 'Fallback placeholder text leaked into the saved file.',
    });
    const savedFilePath = await writeTempMemoryFile(content);
    const { result, stderr } = await captureStreams(() => reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: buildCollectedData({
        sessionSummary: 'Placeholder contamination should be caught.',
        keyDecisions: [{ decision: 'Use authored decisions first' }],
      }),
    }));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D2', 'HIGH');
    expectMetric(events, METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL);
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('triggers CHECK-D3 MEDIUM on unsanitized trigger phrases and emits M3 + M8', async () => {
    const content = buildMemoryContent({
      triggerPhrases: ['and', 'with phases', 'specs/026-graph-and-context-optimization'],
    });
    const savedFilePath = await writeTempMemoryFile(content);
    const { result, stderr } = await captureStreams(() => reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: buildCollectedData({
        sessionSummary: 'Unsanitized trigger phrases should be caught.',
      }),
    }));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D3', 'MEDIUM');
    expectMetric(events, METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL);
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('triggers CHECK-D4 HIGH on the broken tier-drift fixture and emits M4 + M8', async () => {
    const { result, stderr } = await reviewFixture(readFixture('F-broken-D4.json'));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D4', 'HIGH');
    expectMetric(events, METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL);
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('triggers CHECK-D5 MEDIUM on continuation titles without supersedes and emits M5 + M8', async () => {
    const content = buildMemoryContent({
      title: 'Extended Deep Research Round 2',
      supersedes: [],
    });
    const savedFilePath = await writeTempMemoryFile(content);
    const { result, stderr } = await captureStreams(() => reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: buildCollectedData({
        sessionSummary: 'Continuation saves should carry supersedes lineage.',
      }),
    }));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D5', 'MEDIUM');
    expectMetric(events, METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL);
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('triggers CHECK-D6 MEDIUM on duplicate trigger phrases and emits M8', async () => {
    const content = buildMemoryContent({
      triggerPhrases: ['phase 4 reviewer fixture', 'phase 4 reviewer fixture'],
    });
    const savedFilePath = await writeTempMemoryFile(content);
    const { result, stderr } = await captureStreams(() => reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: buildCollectedData({
        sessionSummary: 'Duplicate trigger phrases should be caught.',
      }),
    }));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D6', 'MEDIUM');
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('triggers CHECK-D7 HIGH on the broken provenance fixture and emits M6 + M8', async () => {
    const { result, stderr } = await reviewFixture(readFixture('F-broken-D7.json'));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D7', 'HIGH');
    expectMetric(events, METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL);
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('triggers CHECK-D8 MEDIUM on the broken anchor fixture and emits M7 + M8', async () => {
    const { result, stderr } = await reviewFixture(readFixture('F-broken-D8.json'));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('ISSUES_FOUND');
    expectCheck(result, 'D8', 'MEDIUM');
    expectMetric(events, METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL);
    expectMetric(events, METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL);
  });

  it('keeps the clean F-AC8 fixture silent with zero findings', async () => {
    const { result, stderr } = await reviewFixture(readFixture('F-AC8-clean.json'));
    const events = parseStructuredEvents(stderr);

    expect(result.status).toBe('PASSED');
    expect(result.issues).toHaveLength(0);
    expect(events.some((event) => event.message === 'memory_save_review_violation')).toBe(false);
    expect(events.some((event) => event.metric_name === METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL)).toBe(false);
  });
});

describe('Phase 4 PR-9 composite blocker', () => {
  it('rejects when two HIGH guardrail checks fire together', async () => {
    const content = buildMemoryContent({
      overview: 'This broken overview proves the reviewer catches truncation when the rendered text still ends mid toke...',
      metadataTier: 'normal',
    });
    const savedFilePath = await writeTempMemoryFile(content);
    const { result } = await captureStreams(() => reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: buildCollectedData({
        sessionSummary: 'This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.',
      }),
    }));

    expect(result.status).toBe('REJECTED');
    expect(result.blocking).toBe(true);
    expect(result.blockerReason).toContain('2 HIGH');
  });

  it('rejects when one HIGH and two MEDIUM guardrail checks fire together', async () => {
    const content = buildMemoryContent({
      title: 'Extended Deep Research Round 2',
      metadataTier: 'normal',
      commentAnchor: 'summary',
      closingAnchor: 'summary',
      supersedes: [],
    });
    const savedFilePath = await writeTempMemoryFile(content);
    const { result } = await captureStreams(() => reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: buildCollectedData({
        sessionSummary: 'Composite blocker should reject one HIGH plus two MEDIUM findings.',
      }),
    }));

    expect(result.status).toBe('REJECTED');
    expect(result.blocking).toBe(true);
    expect(result.blockerReason).toContain('1 HIGH, 2 MEDIUM');
  });

  it('does not reject when only one HIGH guardrail check fires', async () => {
    const { result } = await reviewFixture(readFixture('F-broken-D4.json'));

    expect(result.status).toBe('ISSUES_FOUND');
    expect(result.blocking).toBe(false);
  });
});

describe('Phase 4 PR-9 workflow telemetry', () => {
  it('emits M9 plus save-boundary structured logs to stderr and not stdout', async () => {
    const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), 'speckit-phase4-pr9-workflow-'));
    const specFolderPath = path.join(tempRoot, '004-heuristics-refactor-guardrails');
    const contextDir = path.join(specFolderPath, 'memory');
    tempDirs.push(tempRoot);

    await fsp.mkdir(contextDir, { recursive: true });
    await fsp.writeFile(
      path.join(specFolderPath, 'spec.md'),
      ['---', 'title: "Spec: Phase 4 PR-9 Workflow Fixture"', '---', '# Spec'].join('\n'),
      'utf8',
    );

    workflowHarness.specFolderPath = specFolderPath;
    workflowHarness.contextDir = contextDir;

    const { runWorkflow } = await import('../core/workflow');
    const { result, stdout, stderr } = await captureStreams(() => runWorkflow({
      specFolderArg: specFolderPath,
      collectedData: {
        _source: 'file',
        sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
        triggerPhrases: ['phase 4 reviewer fixture', 'memory telemetry contract'],
        keyDecisions: [
          {
            decision: 'Emit save-boundary telemetry on stderr only',
            rationale: 'Keep stdout reserved for CLI review output and data.',
          },
        ],
        filesModified: [
          {
            path: '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
            action: 'modified',
            description: 'Wire save-boundary telemetry at Step 10.5.',
          },
        ],
        nextSteps: ['Verify Phase 4 PR-9 telemetry output'],
      } as unknown as CollectedDataFull,
      silent: true,
    }));
    const events = parseStructuredEvents(stderr);

    expect(result.contextFilename.endsWith('.md')).toBe(true);
    expectMetric(events, METRIC_M9_MEMORY_SAVE_DURATION_SECONDS);
    expect(events.some((event) => event.message === 'memory_save_started')).toBe(true);
    expect(events.some((event) => event.message === 'memory_save_review_completed')).toBe(true);
    expect(stdout).not.toContain('"message":"memory_metric"');
    expect(stdout).not.toContain('"message":"memory_save_started"');
    expect(stdout).not.toContain('"message":"memory_save_review_completed"');
  });

  it('keeps structured telemetry on stderr even when the human-readable review is printed to stdout', async () => {
    const fixture = readFixture('F-broken-D8.json');
    const savedFilePath = await writeTempMemoryFile(buildSavedContent(fixture.savedContentLines));
    const reviewResult = reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: fixture.collectedData,
    });

    const { stdout, stderr } = await captureStreams(() => printPostSaveReview(reviewResult));

    expect(stdout).toContain('POST-SAVE QUALITY REVIEW');
    expect(stderr).toBe('');
  });
});
