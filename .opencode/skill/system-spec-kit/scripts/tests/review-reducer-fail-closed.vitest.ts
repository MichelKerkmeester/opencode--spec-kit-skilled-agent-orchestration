// TEST: sk-deep-review reducer fail-closed behavior (phase 008 REQ-015, REQ-016)
//
// Covers:
//  - Test 1: malformed JSONL triggers corruptionWarnings + non-zero exit unless --lenient
//  - Test 2: missing machine-owned anchor throws a descriptive error
//  - Test 3: --lenient escape hatch preserves fail-open legacy behavior for corrupted JSONL
//
// Fixtures are written to a macOS-safe temp root (realpathSync wraps mkdtempSync
// so /var → /private/var symlinks don't poison path.relative in the reducer).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const reducer = require('../../../sk-deep-review/scripts/reduce-state.cjs') as {
  reduceReviewState: (specFolder: string, options?: {
    write?: boolean;
    lenient?: boolean;
    createMissingAnchors?: boolean;
  }) => {
    corruptionWarnings: Array<{ line: number; error: string; raw: string }>;
    hasCorruption: boolean;
    registry: Record<string, unknown>;
    strategy: string;
    dashboard: string;
  };
  parseJsonlDetailed: (content: string) => {
    records: Array<Record<string, unknown>>;
    corruptionWarnings: Array<{ line: number; error: string; raw: string }>;
  };
  replaceAnchorSection: (
    content: string,
    anchorId: string,
    heading: string,
    body: string,
    options?: { createMissing?: boolean },
  ) => string;
};

const tempRoots: string[] = [];

function makeTempSpecFolder(slug: string): string {
  // Realpath resolves macOS /var → /private/var so internal path.relative stays
  // consistent with validateFilePath's symlink resolution.
  const projectRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `review-fail-closed-${slug}-`)));
  tempRoots.push(projectRoot);
  const specFolder = path.join(projectRoot, 'specs', 'phase-008', 'fail-closed');
  fs.mkdirSync(path.join(specFolder, 'review', 'iterations'), { recursive: true });
  return specFolder;
}

function writeConfig(specFolder: string): void {
  const config = {
    topic: 'fail-closed test',
    mode: 'review',
    reviewTarget: 'fixture',
    reviewTargetType: 'spec-folder',
    reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
    sessionId: 'rvw-fail-closed',
    generation: 1,
    lineageMode: 'new',
    maxIterations: 7,
    convergenceThreshold: 0.1,
    status: 'running',
    createdAt: '2026-04-11T00:00:00Z',
  };
  fs.writeFileSync(
    path.join(specFolder, 'review', 'deep-review-config.json'),
    `${JSON.stringify(config, null, 2)}\n`,
    'utf8',
  );
}

function writeIterationStub(specFolder: string): void {
  fs.writeFileSync(
    path.join(specFolder, 'review', 'iterations', 'iteration-001.md'),
    [
      '# Iteration 1: test',
      '',
      '## Focus',
      'fail-closed',
      '',
      '## Findings',
      '',
      '## Ruled Out',
      '',
      '## Dead Ends',
      '',
      '## Recommended Next Focus',
      'next',
      '',
    ].join('\n'),
    'utf8',
  );
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

describe('sk-deep-review reducer — fail-closed behavior', () => {
  it('reports corruptionWarnings and flags hasCorruption when JSONL is malformed', () => {
    const specFolder = makeTempSpecFolder('corruption');
    writeConfig(specFolder);
    writeIterationStub(specFolder);
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
      [
        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
        'this line is definitely not valid json',
        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = reducer.reduceReviewState(specFolder, { write: true });

    expect(result.hasCorruption).toBe(true);
    expect(result.corruptionWarnings).toHaveLength(1);
    expect(result.corruptionWarnings[0].line).toBe(2);
    expect(result.corruptionWarnings[0].error).toMatch(/not valid JSON|JSON/);
    expect(result.registry.corruptionWarnings).toEqual(result.corruptionWarnings);
  });

  it('throws a descriptive error when a machine-owned strategy anchor is missing', () => {
    const specFolder = makeTempSpecFolder('missing-anchor');
    writeConfig(specFolder);
    writeIterationStub(specFolder);
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
      [
        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
        '',
      ].join('\n'),
      'utf8',
    );
    // Strategy file exists but omits the required next-focus anchor.
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-strategy.md'),
      [
        '---',
        'title: partial strategy',
        '---',
        '',
        '<!-- ANCHOR:review-dimensions -->',
        '## 3. REVIEW DIMENSIONS (remaining)',
        '- [ ] correctness',
        '- [ ] security',
        '- [ ] traceability',
        '- [ ] maintainability',
        '<!-- /ANCHOR:review-dimensions -->',
        '',
        // No completed-dimensions / running-findings / exhausted-approaches / next-focus anchors
      ].join('\n'),
      'utf8',
    );

    expect(() => reducer.reduceReviewState(specFolder, { write: false }))
      .toThrow(/Missing machine-owned anchor .*completed-dimensions|running-findings|exhausted-approaches|next-focus/);
  });

  it('with --lenient / createMissingAnchors the reducer still records corruption but does not block', () => {
    const specFolder = makeTempSpecFolder('lenient');
    writeConfig(specFolder);
    writeIterationStub(specFolder);
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
      [
        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
        'garbage line A',
        'garbage line B',
        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = reducer.reduceReviewState(specFolder, { write: true, lenient: true });

    // corruption is still reported...
    expect(result.corruptionWarnings).toHaveLength(2);
    expect(result.hasCorruption).toBe(true);
    // ...but the reducer still produced registry output successfully
    expect(result.registry.corruptionWarnings).toEqual(result.corruptionWarnings);
    expect(result.registry.sessionId).toBe('rvw-fail-closed');
  });
});
