import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const reducerModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-deep-research/scripts/reduce-state.cjs',
)) as {
  reduceResearchState: (specFolder: string, options?: { write?: boolean }) => {
    registry: {
      metrics: {
        iterationsCompleted: number;
        openQuestions: number;
        resolvedQuestions: number;
        keyFindings: number;
      };
    };
    strategyPath: string;
    dashboardPath: string;
    registryPath: string;
  };
};

const tempDirs: string[] = [];

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function makeFixtureSpecFolder(): string {
  const specFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'deep-research-reducer-'));
  tempDirs.push(specFolder);

  writeFile(
    path.join(specFolder, 'research', 'deep-research-config.json'),
    `${JSON.stringify(
      {
        topic: 'Reducer fixture topic',
        maxIterations: 5,
        convergenceThreshold: 0.05,
        progressiveSynthesis: true,
        createdAt: '2026-04-03T00:00:00Z',
        status: 'running',
        lineage: {
          sessionId: 'session-001',
          parentSessionId: null,
          lineageMode: 'resume',
          generation: 2,
          continuedFromRun: 1,
        },
      },
      null,
      2,
    )}\n`,
  );

  writeFile(
    path.join(specFolder, 'research', 'deep-research-state.jsonl'),
    [
      '{"type":"config","topic":"Reducer fixture topic","maxIterations":5,"convergenceThreshold":0.05,"createdAt":"2026-04-03T00:00:00Z","specFolder":"fixture"}',
      '{"type":"iteration","run":1,"status":"complete","focus":"First pass","findingsCount":2,"newInfoRatio":0.8,"answeredQuestions":["Question A"],"keyQuestions":["Question A","Question B"],"sourcesQueried":["https://example.com/one","src/feature.ts:10"],"toolsUsed":["Read","WebFetch"],"timestamp":"2026-04-03T00:05:00Z","durationMs":1000}',
      '{"type":"iteration","run":2,"status":"insight","focus":"Second pass","findingsCount":2,"newInfoRatio":0.4,"answeredQuestions":["Question B"],"keyQuestions":["Question B","Question C"],"sourcesQueried":["https://example.com/two","memory:previous-run"],"toolsUsed":["Read","Grep"],"convergenceSignals":{"compositeStop":0.61},"timestamp":"2026-04-03T00:10:00Z","durationMs":1200}',
      '',
    ].join('\n'),
  );

  writeFile(
    path.join(specFolder, 'research', 'deep-research-strategy.md'),
    `---
title: Fixture Strategy
description: reducer fixture
---

# Deep Research Strategy - Session Tracking Template

<!-- ANCHOR:overview -->
## 1. OVERVIEW
Fixture overview
<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Reducer fixture topic
<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Question A
- [ ] Question B
- [ ] Question C
<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
None
<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
Stop when enough evidence exists
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
Known context
<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Boundaries
<!-- /ANCHOR:research-boundaries -->
`,
  );

  writeFile(
    path.join(specFolder, 'research', 'iterations', 'iteration-001.md'),
    `# Iteration 1: First pass

## Focus
Survey the first research angle.

## Findings
1. Finding one from the first pass.
2. Finding two from the first pass.

## Ruled Out
- Retrying the same endpoint without new instrumentation.

## Dead Ends
- Browser-only profiling for this server-side problem.

## Sources Consulted
- https://example.com/one
- src/feature.ts:10

## Assessment
- New information ratio: 0.8
- Questions addressed: Question A
- Questions answered: Question A

## Reflection
- What worked and why: Broad source comparison revealed the first stable answer.
- What did not work and why: Single-source assumptions missed the implementation detail.
- What I would do differently: Start with mixed code and docs evidence earlier.

## Recommended Next Focus
Question C
`,
  );

  writeFile(
    path.join(specFolder, 'research', 'iterations', 'iteration-002.md'),
    `# Iteration 2: Second pass

## Focus
Refine the remaining uncertainty.

## Findings
1. Finding three from the second pass.
2. Finding four from the second pass.

## Ruled Out
- Re-reading the same migration note without new packet evidence.

## Dead Ends
- Browser-only profiling for this server-side problem.

## Sources Consulted
- https://example.com/two
- memory:previous-run

## Assessment
- New information ratio: 0.4
- Questions addressed: Question B
- Questions answered: Question B

## Reflection
- What worked and why: The second pass confirmed the lineage edge with a direct source.
- What did not work and why: Repeating weak evidence added no new confidence.
- What I would do differently: Move directly to the unresolved question once the registry is stable.

## Recommended Next Focus
Question C
`,
  );

  return specFolder;
}

afterEach(() => {
  while (tempDirs.length) {
    fs.rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

describe('deep-research reducer', () => {
  it('writes idempotent registry, strategy, and dashboard outputs from iteration state', () => {
    const specFolder = makeFixtureSpecFolder();

    const firstRun = reducerModule.reduceResearchState(specFolder, { write: true });
    const firstRegistry = fs.readFileSync(firstRun.registryPath, 'utf8');
    const firstStrategy = fs.readFileSync(firstRun.strategyPath, 'utf8');
    const firstDashboard = fs.readFileSync(firstRun.dashboardPath, 'utf8');

    const secondRun = reducerModule.reduceResearchState(specFolder, { write: true });
    const secondRegistry = fs.readFileSync(secondRun.registryPath, 'utf8');
    const secondStrategy = fs.readFileSync(secondRun.strategyPath, 'utf8');
    const secondDashboard = fs.readFileSync(secondRun.dashboardPath, 'utf8');

    expect(firstRun.registry.metrics.iterationsCompleted).toBe(2);
    expect(firstRun.registry.metrics.resolvedQuestions).toBe(2);
    expect(firstRun.registry.metrics.openQuestions).toBe(1);
    expect(firstRun.registry.metrics.keyFindings).toBe(4);

    expect(firstRegistry).toBe(secondRegistry);
    expect(firstStrategy).toBe(secondStrategy);
    expect(firstDashboard).toBe(secondDashboard);

    expect(firstStrategy).toContain('- [x] Question A');
    expect(firstStrategy).toContain('- [x] Question B');
    expect(firstStrategy).toContain('- [ ] Question C');
    expect(firstStrategy).toContain('## 7. WHAT WORKED');
    expect(firstStrategy).toContain('Broad source comparison revealed the first stable answer.');
    expect(firstStrategy).toContain('## 10. RULED OUT DIRECTIONS');
    expect(firstStrategy).toContain('Browser-only profiling for this server-side problem.');

    expect(firstDashboard).toContain('Session ID: session-001');
    expect(firstDashboard).toContain('convergenceScore: 0.61');
    expect(firstDashboard).toContain('Question C');
  });
});
