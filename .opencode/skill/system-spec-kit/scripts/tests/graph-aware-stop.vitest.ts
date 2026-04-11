// TEST: graph-aware stop evaluation (phase 008 REQ-023)
//
// Validates that the reducer's graph_convergence event ingestion + dashboard
// surfacing work end-to-end. The test should fail if the reducer falls back
// to inline ratio math and ignores graph events.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const reducer = require('../../../sk-deep-research/scripts/reduce-state.cjs') as {
  reduceResearchState: (specFolder: string, options?: { write?: boolean }) => {
    registry: {
      graphConvergenceScore: number;
      graphDecision: string | null;
      graphBlockers: Array<Record<string, unknown>>;
      metrics: {
        iterationsCompleted: number;
        convergenceScore: number;
      };
    };
    dashboard: string;
  };
};

const tempRoots: string[] = [];

function makeTempSpecFolder(slug: string): string {
  // Realpath resolves macOS /var -> /private/var so reducer path handling
  // stays stable in temporary fixtures.
  const projectRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `graph-aware-stop-${slug}-`)));
  tempRoots.push(projectRoot);
  const specFolder = path.join(projectRoot, 'specs', 'phase-008', slug);
  fs.mkdirSync(path.join(specFolder, 'research', 'iterations'), { recursive: true });
  return specFolder;
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeConfig(specFolder: string, sessionId: string): void {
  writeFile(
    path.join(specFolder, 'research', 'deep-research-config.json'),
    `${JSON.stringify({
      topic: 'Graph-aware stop fixture',
      sessionId,
      maxIterations: 5,
      convergenceThreshold: 0.1,
      progressiveSynthesis: true,
      status: 'running',
      createdAt: '2026-04-11T00:00:00Z',
      lineage: {
        sessionId,
        parentSessionId: null,
        lineageMode: 'new',
        generation: 1,
      },
    }, null, 2)}\n`,
  );
}

function writeStrategy(specFolder: string): void {
  writeFile(
    path.join(specFolder, 'research', 'deep-research-strategy.md'),
    `---
title: Graph Stop Fixture
description: Minimal strategy fixture with all reducer-owned anchors.
---

# Deep Research Strategy - Session Tracking Template

<!-- ANCHOR:overview -->
## 1. OVERVIEW
Fixture overview
<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Graph-aware stop fixture
<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Does the graph_convergence event override inline stop heuristics?
<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
None
<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
Stop once graph convergence handling is proven.
<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]
<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]
<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]
<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]
<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[None yet]
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
None
<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.1
- Per-iteration budget: 4 tool calls, 10 minutes
- Progressive synthesis: true
<!-- /ANCHOR:research-boundaries -->
`,
  );
}

function writeIteration(specFolder: string, run: number, focus: string, nextFocus: string): void {
  writeFile(
    path.join(specFolder, 'research', 'iterations', `iteration-${String(run).padStart(3, '0')}.md`),
    `# Iteration ${run}: ${focus}

## Focus
${focus}

## Findings
- Graph convergence evidence is available for reducer ingestion.

## Ruled Out
- Inferring graph decisions from inline ratios alone.

## Dead Ends
- Skipping reducer-owned dashboard checks.

## Sources Consulted
- research/deep-research-state.jsonl

## Reflection
- What worked and why: Reducer output makes graph decisions inspectable.
- What did not work and why: Inline ratios alone cannot encode graph blockers.
- What I would do differently: Assert the event rollup directly in tests.

## Recommended Next Focus
${nextFocus}
`,
  );
}

function writeStateLog(specFolder: string, lines: string[]): void {
  writeFile(path.join(specFolder, 'research', 'deep-research-state.jsonl'), `${lines.join('\n')}\n`);
}

function makeFixture(slug: string, stateLines: string[]): string {
  const specFolder = makeTempSpecFolder(slug);
  writeConfig(specFolder, `graph-stop-${slug}`);
  writeStrategy(specFolder);
  writeIteration(specFolder, 1, 'Baseline graph stop probe', 'Inspect the latest graph convergence event.');
  writeStateLog(specFolder, stateLines);
  return specFolder;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

describe('graph-aware stop evaluation', () => {
  it('propagates graph STOP_BLOCKED blockers into the registry and dashboard', () => {
    const specFolder = makeFixture('blocked', [
      '{"type":"config","topic":"Graph-aware stop fixture","sessionId":"graph-stop-blocked","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
      '{"type":"iteration","run":1,"status":"complete","focus":"Baseline graph stop probe","findingsCount":1,"newInfoRatio":0.95,"timestamp":"2026-04-11T00:05:00Z","durationMs":1000}',
      '{"type":"event","event":"graph_convergence","decision":"STOP_BLOCKED","signals":{"blendedScore":0.41},"blockers":[{"signal":"contradictionDensity","severity":"high"}],"timestamp":"2026-04-11T00:06:00Z"}',
    ]);

    const result = reducer.reduceResearchState(specFolder, { write: false });

    expect(result.registry.graphDecision).toBe('STOP_BLOCKED');
    expect(result.registry.graphConvergenceScore).toBe(0.41);
    expect(result.registry.graphBlockers).toHaveLength(1);
    expect(result.registry.graphBlockers[0]).toMatchObject({
      signal: 'contradictionDensity',
      severity: 'high',
    });
    expect(result.dashboard).toContain('graphDecision: STOP_BLOCKED');
  });

  it('uses the most recent graph_convergence event when STOP_ALLOWED supersedes an earlier block', () => {
    const specFolder = makeFixture('allowed', [
      '{"type":"config","topic":"Graph-aware stop fixture","sessionId":"graph-stop-allowed","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
      '{"type":"iteration","run":1,"status":"complete","focus":"Baseline graph stop probe","findingsCount":1,"newInfoRatio":0.01,"timestamp":"2026-04-11T00:05:00Z","durationMs":1000}',
      '{"type":"event","event":"graph_convergence","decision":"STOP_BLOCKED","signals":{"blendedScore":0.33},"blockers":[{"signal":"questionCoverage","severity":"medium"}],"timestamp":"2026-04-11T00:06:00Z"}',
      '{"type":"event","event":"graph_convergence","decision":"STOP_ALLOWED","signals":{"blendedScore":0.92},"blockers":[],"timestamp":"2026-04-11T00:07:00Z"}',
    ]);

    const result = reducer.reduceResearchState(specFolder, { write: false });

    expect(result.registry.graphDecision).toBe('STOP_ALLOWED');
    expect(result.registry.graphConvergenceScore).toBe(0.92);
    expect(result.registry.graphBlockers).toEqual([]);
    expect(result.dashboard).toContain('graphDecision: STOP_ALLOWED');
    expect(result.dashboard).toContain('graphConvergenceScore: 0.92');
  });

  it('defaults graph fields when no graph_convergence events are present', () => {
    const specFolder = makeFixture('default', [
      '{"type":"config","topic":"Graph-aware stop fixture","sessionId":"graph-stop-default","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
      '{"type":"iteration","run":1,"status":"complete","focus":"Baseline graph stop probe","findingsCount":1,"newInfoRatio":0.88,"timestamp":"2026-04-11T00:05:00Z","durationMs":1000}',
    ]);

    const result = reducer.reduceResearchState(specFolder, { write: false });

    expect(result.registry.graphConvergenceScore).toBe(0);
    expect(result.registry.graphDecision).toBeNull();
    expect(result.registry.graphBlockers).toEqual([]);
    expect(result.dashboard).toContain('graphDecision: [Not recorded]');
    expect(result.dashboard).toContain('graphBlockers: none recorded');
  });

  it('consumes the canonical MCP handler output shape (phase 008 P1-01 closure)', () => {
    // Phase 008 P1-01 closure: the MCP handler emits a canonical `score`
    // field at the top level of the graph_convergence event (and mirrored in
    // signals.score). The reducer MUST consume this shape directly without
    // relying on synthetic `blendedScore` aliases. This test seeds the exact
    // shape the handler produces and asserts the reducer reads it verbatim.
    const specFolder = makeFixture('handler-shape', [
      '{"type":"config","topic":"Handler-shape fixture","sessionId":"graph-stop-handler","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
      '{"type":"iteration","run":1,"status":"complete","focus":"Handler-shape probe","findingsCount":2,"newInfoRatio":0.1,"timestamp":"2026-04-11T00:05:00Z","durationMs":1000}',
      '{"type":"event","event":"graph_convergence","decision":"STOP_ALLOWED","score":0.74,"signals":{"questionCoverage":0.8,"claimVerificationRate":0.7,"contradictionDensity":0.05,"sourceDiversity":2.1,"evidenceDepth":3.2,"score":0.74},"blockers":[],"trace":[],"timestamp":"2026-04-11T00:06:00Z","sessionId":"graph-stop-handler","generation":1}',
    ]);

    const result = reducer.reduceResearchState(specFolder, { write: false });

    expect(result.registry.graphDecision).toBe('STOP_ALLOWED');
    // The reducer reads signals.score ?? signals.blendedScore ?? 0, so it
    // picks up the canonical 0.74 directly from the handler-shaped payload.
    expect(result.registry.graphConvergenceScore).toBe(0.74);
    expect(result.registry.graphBlockers).toEqual([]);
    expect(result.dashboard).toContain('graphDecision: STOP_ALLOWED');
    expect(result.dashboard).toContain('graphConvergenceScore: 0.74');
  });
});
