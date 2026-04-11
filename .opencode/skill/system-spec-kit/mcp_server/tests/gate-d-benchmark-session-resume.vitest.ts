import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { loadMostRecentStateMock } = vi.hoisted(() => ({
  loadMostRecentStateMock: vi.fn(() => null),
}));

vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getStats: vi.fn(() => ({
    totalFiles: 10,
    totalNodes: 50,
    totalEdges: 30,
    lastScanTimestamp: new Date().toISOString(),
    dbFileSize: 2048,
    schemaVersion: 1,
    nodesByKind: {},
    edgesByType: {},
    parseHealthSummary: {},
  })),
}));

vi.mock('../lib/code-graph/ensure-ready.js', () => ({
  getGraphFreshness: vi.fn(() => 'fresh'),
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  computeQualityScore: vi.fn(() => ({
    level: 'ready',
    score: 0.95,
    factors: { recency: 1, recovery: 1, graphFreshness: 1, continuity: 1 },
  })),
  recordMetricEvent: vi.fn(),
  recordBootstrapEvent: vi.fn(),
}));

vi.mock('../hooks/claude/hook-state.js', () => ({
  loadMostRecentState: loadMostRecentStateMock,
}));

import { handleSessionResume } from '../handlers/session-resume.js';

const TEMP_WORKSPACES: string[] = [];

function makeWorkspace(): string {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-d-bench-resume-'));
  TEMP_WORKSPACES.push(workspace);
  return workspace;
}

function writeDoc(workspace: string, specFolder: string, relativePath: string, content: string): void {
  const fullPath = path.join(workspace, '.opencode', 'specs', specFolder, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function buildHandover(): string {
  return [
    '---',
    'title: "Gate D Handover"',
    'last_updated: "2026-04-11T12:00:00Z"',
    '---',
    '# Handover',
    '',
    '**Recent action**: Reader handlers retargeted to canonical sources',
    '**Next safe action**: Run Gate D perf verification',
    '**Blockers**: None',
    '',
  ].join('\n');
}

function buildImplementationSummary(specFolder: string): string {
  return [
    '---',
    'title: "Gate D implementation summary"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${specFolder}"`,
    '    last_updated_at: "2026-04-11T11:00:00Z"',
    '    last_updated_by: "gate-d-benchmark"',
    '    recent_action: "Prepared the 3-level resume ladder"',
    '    next_safe_action: "Run the resume perf benchmark"',
    '    blockers: []',
    '    key_files:',
    '      - "mcp_server/handlers/session-resume.ts"',
    '    completion_pct: 85',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '# Implementation Summary',
    '',
    'Resume continuity fallback content.',
    '',
  ].join('\n');
}

function percentile(sortedDurations: number[], ratio: number): number {
  const index = Math.min(sortedDurations.length - 1, Math.floor(sortedDurations.length * ratio));
  return sortedDurations[index] ?? 0;
}

function summarizeDurations(durations: number[]) {
  const sorted = [...durations].sort((left, right) => left - right);
  return {
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
  };
}

describe('Gate D benchmark — session resume', () => {
  let originalCwd = process.cwd();

  beforeEach(() => {
    vi.clearAllMocks();
    originalCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
    while (TEMP_WORKSPACES.length > 0) {
      const workspace = TEMP_WORKSPACES.pop();
      if (workspace) {
        fs.rmSync(workspace, { recursive: true, force: true });
      }
    }
  });

  it('keeps the 3-level happy-path resume ladder under the Gate D latency budget', async () => {
    const workspace = makeWorkspace();
    const specFolder =
      'system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready';

    writeDoc(workspace, specFolder, 'handover.md', buildHandover());
    writeDoc(workspace, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));
    process.chdir(workspace);

    const warmup = await handleSessionResume({ specFolder });
    const warmupPayload = JSON.parse(warmup.content[0].text) as Record<string, any>;
    expect(warmupPayload.data.memory.source).toBe('handover');

    const durations: number[] = [];
    const ITERATIONS = 80;

    for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
      const start = performance.now();
      const response = await handleSessionResume({ specFolder });
      const elapsedMs = performance.now() - start;
      durations.push(elapsedMs);

      const payload = JSON.parse(response.content[0].text) as Record<string, any>;
      expect(payload.data.memory.source).toBe('handover');
    }

    const summary = summarizeDurations(durations);
    console.log(`[gate-d-benchmark][resume] p50=${summary.p50.toFixed(2)}ms p95=${summary.p95.toFixed(2)}ms p99=${summary.p99.toFixed(2)}ms iterations=${ITERATIONS}`);

    expect(summary.p50).toBeLessThan(300);
    expect(summary.p95).toBeLessThan(500);
  });
});
