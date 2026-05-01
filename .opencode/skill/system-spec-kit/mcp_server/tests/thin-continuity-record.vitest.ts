import { describe, expect, it } from 'vitest';

import {
  THIN_CONTINUITY_MAX_BYTES,
  readThinContinuityRecord,
  upsertThinContinuityInMarkdown,
  validateThinContinuityRecord,
} from '../lib/continuity/thin-continuity-record';

const VALID_FINGERPRINT = `sha256:${'a'.repeat(64)}`;

function makeFrontmatterMarkdown(): string {
  return [
    '---',
    'title: "Continuity Fixture"',
    'description: "Fixture for thin continuity tests."',
    'importance_tier: important',
    'contextType: implementation',
    '---',
    '',
    '# Continuity Fixture',
    '',
    'Body content that should survive frontmatter updates.',
    '',
  ].join('\n');
}

describe('thin continuity record', () => {
  it('writes and re-reads a normalized continuity block from markdown frontmatter', () => {
    const markdown = makeFrontmatterMarkdown();

    const writeResult = upsertThinContinuityInMarkdown(markdown, {
      packet_pointer: '026-graph-and-context-optimization/006-canonical-continuity-refactor/',
      last_updated_at: '2026-04-11T18:48:00+02:00',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed continuity schema validation',
      next_safe_action: 'Review parity fixtures',
      blockers: ['none'],
      key_files: [
        'research//iterations/iteration-024.md',
        './scratch/resource-map/04-templates.md',
      ],
      session_dedup: {
        fingerprint: VALID_FINGERPRINT,
        session_id: 'gate-c-session-001',
        parent_session_id: 'gate-c-session-000',
      },
      completion_pct: 42,
      open_questions: ['Q10', 'q2'],
      answered_questions: ['q1'],
    });

    expect(writeResult.ok).toBe(true);
    expect(writeResult.markdown).toContain('_memory:');
    expect(writeResult.markdown).toContain('continuity:');
    expect(writeResult.markdown).toContain('Body content that should survive frontmatter updates.');

    const readResult = readThinContinuityRecord(writeResult.markdown!);
    expect(readResult.ok).toBe(true);
    expect(readResult.record).toMatchObject({
      packet_pointer: '026-graph-and-context-optimization/006-canonical-continuity-refactor',
      last_updated_at: '2026-04-11T16:48:00Z',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed continuity schema validation',
      next_safe_action: 'Review parity fixtures',
      blockers: [],
      key_files: ['research/iterations/iteration-024.md', 'scratch/resource-map/04-templates.md'],
      completion_pct: 42,
      open_questions: ['Q2', 'Q10'],
      answered_questions: ['Q1'],
      session_dedup: {
        fingerprint: VALID_FINGERPRINT,
        session_id: 'gate-c-session-001',
        parent_session_id: 'gate-c-session-000',
      },
    });
  });

  it('rejects malformed narrative recent_action content', () => {
    const result = validateThinContinuityRecord({
      packet_pointer: '026-graph-and-context-optimization/006-canonical-continuity-refactor',
      last_updated_at: '2026-04-11T16:48:00Z',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed iteration 24 validation design. This clarified why legacy blocks should auto-hydrate.',
      next_safe_action: 'Review parity fixtures',
      blockers: [],
      key_files: [],
      completion_pct: 10,
      open_questions: [],
      answered_questions: [],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'MEMORY_006', field: 'recent_action' }),
      ]),
    );
  });

  it('fails budget enforcement after normalization when the fragment remains oversized', () => {
    const packetPointer = Array.from({ length: 60 }, (_, index) => `segment-${index.toString().padStart(2, '0')}-canonical-continuity`)
      .join('/');

    const result = validateThinContinuityRecord({
      packet_pointer: packetPointer,
      last_updated_at: '2026-04-11T16:48:00Z',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed canonical continuity budget verification',
      next_safe_action: 'Review parity fixtures',
      blockers: [
        'awaiting-template-continuity-validation-pass',
        'awaiting-shadow-compare-verification-pass',
        'awaiting-integration-smoke-test-verification',
        'awaiting-parity-dashboard-refresh',
        'awaiting-post-save-fingerprint-review',
      ],
      key_files: Array.from({ length: 5 }, (_, index) => (
        `very/long/path/${index}/` +
        'phase-018-continuity/'.repeat(5) +
        `artifact-${index}.md`
      )),
      session_dedup: {
        fingerprint: VALID_FINGERPRINT,
        session_id: 'gate-c-session-001',
        parent_session_id: 'gate-c-session-000',
      },
      completion_pct: 55,
      open_questions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'],
      answered_questions: [],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'MEMORY_017',
          details: expect.objectContaining({
            actualBytes: expect.any(Number),
            heaviestFields: expect.any(Array),
          }),
        }),
      ]),
    );
    expect(result.errors[0]?.details?.actualBytes as number).toBeGreaterThan(THIN_CONTINUITY_MAX_BYTES);
  });

  it('normalizes timestamps, question ids, and sentinel blockers deterministically', () => {
    const result = validateThinContinuityRecord({
      packet_pointer: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/',
      last_updated_at: '2026-04-11T18:48:59+02:00',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed continuity normalization pass',
      next_safe_action: 'Inspect routing audit',
      blockers: [' none ', 'N/A', ''],
      key_files: ['./templates//manifest/spec.md.tmpl', 'templates/manifest/plan.md.tmpl'],
      completion_pct: 15,
      open_questions: ['q10', 'Q2', 'Q10'],
      answered_questions: ['q1', 'Q3'],
    });

    expect(result.ok).toBe(true);
    expect(result.record).toMatchObject({
      packet_pointer: 'specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor',
      last_updated_at: '2026-04-11T16:48:59Z',
      blockers: [],
      key_files: ['templates/manifest/spec.md.tmpl', 'templates/manifest/plan.md.tmpl'],
      open_questions: ['Q2', 'Q10'],
      answered_questions: ['Q1', 'Q3'],
    });
  });

  it('replaces an existing continuity block without duplicating frontmatter keys', () => {
    const initial = upsertThinContinuityInMarkdown(makeFrontmatterMarkdown(), {
      packet_pointer: 'specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim',
      last_updated_at: '2026-04-15T07:15:00Z',
      last_updated_by: 'worker-one',
      recent_action: 'Prepared transcript prototype set',
      next_safe_action: 'Run planner comparison',
      blockers: [],
      key_files: ['implementation-summary.md'],
      completion_pct: 70,
      open_questions: ['Q1'],
      answered_questions: [],
    });

    expect(initial.ok).toBe(true);

    const replaced = upsertThinContinuityInMarkdown(initial.markdown!, {
      packet_pointer: 'specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim',
      last_updated_at: '2026-04-15T08:05:00Z',
      last_updated_by: 'worker-two',
      recent_action: 'Reviewed transcript mismatches',
      next_safe_action: 'Complete packet 015 closeout',
      blockers: [],
      key_files: ['implementation-summary.md', 'tasks.md'],
      completion_pct: 95,
      open_questions: [],
      answered_questions: [],
    });

    expect(replaced.ok).toBe(true);
    expect(replaced.markdown?.match(/continuity:/g)).toHaveLength(1);
    expect(replaced.markdown).toContain('worker-two');
    expect(replaced.markdown).not.toContain('worker-one');
    expect(replaced.markdown).toContain('Body content that should survive frontmatter updates.');

    const readBack = readThinContinuityRecord(replaced.markdown!);
    expect(readBack.ok).toBe(true);
    expect(readBack.record).toMatchObject({
      last_updated_by: 'worker-two',
      recent_action: 'Reviewed transcript mismatches',
      next_safe_action: 'Complete packet 015 closeout',
      key_files: ['implementation-summary.md', 'tasks.md'],
      completion_pct: 95,
      open_questions: [],
      answered_questions: [],
    });
  });
});
