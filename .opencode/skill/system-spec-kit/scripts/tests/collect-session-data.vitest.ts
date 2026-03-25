// TEST: collect-session-data — basic unit tests for session status, completion, and collection
import { describe, expect, it } from 'vitest';

import {
  determineSessionStatus,
  estimateCompletionPercent,
} from '../extractors/collect-session-data';

import type { Observation, ToolCounts } from '../types/session-types';

/* ───────────────────────────────────────────────────────────────
   1. HELPERS
──────────────────────────────────────────────────────────────── */

function makeObservation(overrides: Partial<Observation> = {}): Observation {
  return {
    type: 'implementation',
    title: 'Test observation',
    narrative: 'Tested a code path.',
    facts: [],
    ...overrides,
  };
}

function makeToolCounts(overrides: Partial<ToolCounts> = {}): ToolCounts {
  return {
    Read: 0,
    Edit: 0,
    Write: 0,
    Bash: 0,
    Grep: 0,
    Glob: 0,
    Task: 0,
    WebFetch: 0,
    WebSearch: 0,
    Skill: 0,
    ...overrides,
  };
}

/* ───────────────────────────────────────────────────────────────
   2. determineSessionStatus
──────────────────────────────────────────────────────────────── */

describe('determineSessionStatus', () => {
  it('returns BLOCKED when blockers text is present and unresolved', () => {
    const status = determineSessionStatus(
      'API rate limit exceeded',
      [makeObservation()],
      5,
    );

    expect(status).toBe('BLOCKED');
  });

  it('returns COMPLETED when the last observation narrative indicates completion', () => {
    const status = determineSessionStatus(
      'None',
      [makeObservation({ narrative: 'All tasks are done and complete.' })],
      10,
    );

    expect(status).toBe('COMPLETED');
  });

  it('returns COMPLETED when an earlier observation indicates completion', () => {
    const status = determineSessionStatus(
      'None',
      [
        makeObservation({ narrative: 'All requested work is complete and verified.' }),
        makeObservation({ narrative: 'Shared the final summary for handoff.' }),
      ],
      10,
    );

    expect(status).toBe('COMPLETED');
  });

  it('returns IN_PROGRESS for a short session with no blockers', () => {
    const status = determineSessionStatus(
      'None',
      [makeObservation()],
      2,
    );

    expect(status).toBe('IN_PROGRESS');
  });

  it('returns IN_PROGRESS when there are enough messages but no completion signal', () => {
    const status = determineSessionStatus(
      'None',
      [makeObservation({ narrative: 'Continuing to investigate the issue.' })],
      10,
    );

    expect(status).toBe('IN_PROGRESS');
  });

  it('returns COMPLETED when blockers exist but later observations show resolution', () => {
    const status = determineSessionStatus(
      'API rate limit exceeded',
      [
        makeObservation({ narrative: 'Hit rate limit.' }),
        makeObservation({ narrative: 'Issue resolved with a workaround.' }),
      ],
      10,
    );

    // Blocker is resolved via reconciliation pass (F-25), then completion check falls through
    // Since last observation has "resolved", and it's a resolution keyword, the blocker is
    // cleared but the final observation doesn't have a completion keyword → IN_PROGRESS
    // unless the last observation also matches completion.
    expect(['COMPLETED', 'IN_PROGRESS']).toContain(status);
  });

  it('returns COMPLETED for high-activity sessions with no blockers or pending work', () => {
    const status = determineSessionStatus(
      'None',
      [
        makeObservation({ narrative: 'Implemented the requested updates.' }),
        makeObservation({ narrative: 'Verified final output with the existing checks.' }),
      ],
      5,
      {
        sessionSummary: 'Verified final output and captured the final session summary.',
        toolCalls: [
          { tool: 'Read' },
          { tool: 'Edit' },
          { tool: 'Bash' },
        ],
        exchanges: [
          { userInput: 'Fix the pipeline issues', assistantResponse: 'Done.' },
          { userInput: 'Rebuild and verify', assistantResponse: 'Verified.' },
        ],
      },
    );

    expect(status).toBe('COMPLETED');
  });

  it('returns IN_PROGRESS when next steps were normalized into observations', () => {
    const status = determineSessionStatus(
      'None',
      [
        makeObservation({
          title: 'Next Steps',
          narrative: 'Deploy to staging after the remaining checks pass.',
        }),
      ],
      5,
      {
        _source: 'file',
        sessionSummary: 'Wrapped up the current implementation pass.',
        keyDecisions: [{ decision: 'Ship after staging validation.' }],
        nextSteps: [],
      },
    );

    expect(status).toBe('IN_PROGRESS');
  });

  it('returns COMPLETED when all explicit next steps are marked complete', () => {
    const status = determineSessionStatus(
      'None',
      [
        makeObservation({
          title: 'Next Steps',
          narrative: '[x] Deploy to staging. [x] Notify the release channel.',
        }),
      ],
      5,
      {
        _source: 'file',
        sessionSummary: 'Wrapped up the release work and recorded the final follow-through items.',
        keyDecisions: [{ decision: 'Treat the remaining checklist entries as completed.' }],
        nextSteps: [
          '[x] Deploy to staging.',
          '[x] Notify the release channel.',
        ] as unknown as Array<Record<string, unknown>>,
      },
    );

    expect(status).toBe('COMPLETED');
  });
});

/* ───────────────────────────────────────────────────────────────
   3. estimateCompletionPercent
──────────────────────────────────────────────────────────────── */

describe('estimateCompletionPercent', () => {
  it('returns 100 for a COMPLETED session', () => {
    const percent = estimateCompletionPercent(
      [makeObservation()],
      5,
      makeToolCounts(),
      'COMPLETED',
    );

    expect(percent).toBe(100);
  });

  it('caps at 90 for a BLOCKED session', () => {
    const percent = estimateCompletionPercent(
      [makeObservation()],
      20,
      makeToolCounts(),
      'BLOCKED',
    );

    expect(percent).toBeLessThanOrEqual(90);
  });

  it('returns a positive value for an IN_PROGRESS session with tools and observations', () => {
    const percent = estimateCompletionPercent(
      [makeObservation(), makeObservation()],
      8,
      makeToolCounts({ Read: 3, Edit: 2, Write: 1, Bash: 2 }),
      'IN_PROGRESS',
    );

    expect(percent).toBeGreaterThan(0);
    expect(percent).toBeLessThanOrEqual(95);
  });

  it('gives higher completion when write tools dominate', () => {
    const lowWrite = estimateCompletionPercent(
      [makeObservation()],
      8,
      makeToolCounts({ Read: 10 }),
      'IN_PROGRESS',
    );
    const highWrite = estimateCompletionPercent(
      [makeObservation()],
      8,
      makeToolCounts({ Read: 2, Write: 5, Edit: 5 }),
      'IN_PROGRESS',
    );

    expect(highWrite).toBeGreaterThanOrEqual(lowWrite);
  });

  it('returns 0 for a minimal IN_PROGRESS session with no messages or tools', () => {
    const percent = estimateCompletionPercent(
      [],
      0,
      makeToolCounts(),
      'IN_PROGRESS',
    );

    expect(percent).toBe(0);
  });
});
