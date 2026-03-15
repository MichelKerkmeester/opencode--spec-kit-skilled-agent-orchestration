import { describe, expect, it } from 'vitest';

import { evaluateMemorySufficiency } from '@spec-kit/shared/parsing/memory-sufficiency';

describe('evaluateMemorySufficiency', () => {
  it('passes rich specific evidence', () => {
    const result = evaluateMemorySufficiency({
      title: 'Perfect Session Capturing Sufficiency Hardening',
      content: [
        '# Perfect Session Capturing Sufficiency Hardening',
        '',
        '## Overview',
        'Implemented a shared insufficiency gate across workflow and memory_save so thin saves fail explicitly.',
        '',
        '## Decisions',
        '- Chosen approach: reject thin memories before indexing because synthetic metadata should not count as durable context.',
        '- Rationale: the prior path could index generic sessions that matched workspace identity but not the real task.',
      ].join('\n'),
      triggerPhrases: ['perfect session capturing', 'memory sufficiency', 'memory save', 'alignment block'],
      files: [
        {
          path: 'scripts/core/workflow.ts',
          description: 'Runs the insufficiency gate after alignment and relevance filtering, before write and indexing.',
          specRelevant: true,
        },
      ],
      observations: [
        {
          title: 'Tool: bash validate save flow',
          narrative: 'Verified the runtime now surfaces explicit insufficiency reasons and evidence counts during dry-run.',
          specRelevant: true,
        },
      ],
      decisions: [
        'Decided to use one cross-platform insufficiency contract instead of backend-specific thresholds.',
      ],
      nextActions: [
        'Rerun the memory_save dry-run coverage after wiring the new rejection payload.',
      ],
      anchors: ['summary', 'decisions'],
    });

    expect(result.pass).toBe(true);
    expect(result.evidenceCounts.primary).toBeGreaterThanOrEqual(2);
    expect(result.evidenceCounts.total).toBeGreaterThanOrEqual(3);
    expect(result.score).toBeGreaterThanOrEqual(0.7);
  });

  it('fails a single anchored prompt with no durable evidence', () => {
    const result = evaluateMemorySufficiency({
      title: 'Perfect Session Capturing',
      content: [
        '# Perfect Session Capturing',
        '',
        '## Overview',
        'Please save context for perfect session capturing.',
      ].join('\n'),
      triggerPhrases: ['perfect session capturing'],
      recentContext: [
        {
          request: 'Save context',
          learning: 'Please save context for perfect session capturing.',
        },
      ],
      anchors: ['overview'],
    });

    expect(result.pass).toBe(false);
    expect(result.reasons.join(' ')).toMatch(/No primary evidence|Fewer than two spec-relevant evidence items/);
    expect(result.rejectionCode).toBe('INSUFFICIENT_CONTEXT_ABORT');
  });

  it('does not treat rendered template sections as primary evidence on their own', () => {
    const result = evaluateMemorySufficiency({
      title: 'Perfect Session Capturing',
      content: [
        '# Perfect Session Capturing',
        '',
        '## Summary',
        'This rendered file contains a long scaffolded summary block, several headings, and anchored metadata, but no real files, observations, decisions, or outcomes from the session.',
        '',
        '## Recovery Hints',
        'Rerun with more evidence if the save does not contain durable context.',
      ].join('\n'),
      triggerPhrases: ['perfect session capturing', 'recovery hints'],
      anchors: ['summary', 'recovery-hints'],
    });

    expect(result.pass).toBe(false);
    expect(result.evidenceCounts.primary).toBe(0);
    expect(result.reasons).toContain('No primary evidence was captured for this memory.');
  });

  it('fails long content when the memory title stays generic', () => {
    const result = evaluateMemorySufficiency({
      title: 'Development session',
      content: [
        '# Development session',
        '',
        '## Detailed Changes',
        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
        '',
        '## Verification',
        'Tested the new path with dry-run responses, workflow abort behavior, and explicit rejection-code propagation across save surfaces.',
      ].join('\n'),
      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
      observations: [
        {
          title: 'Tool: bash verify dry-run output',
          narrative: 'Confirmed the new rejection payload is explicit and non-mutating across the save path.',
          specRelevant: true,
        },
      ],
      decisions: [
        'Kept one shared insufficiency contract instead of backend-specific thresholds.',
      ],
    });

    expect(result.pass).toBe(false);
    expect(result.reasons).toContain('Memory title is too generic to stand alone later.');
    expect(result.evidenceCounts.primary).toBeGreaterThanOrEqual(1);
    expect(result.evidenceCounts.semanticChars).toBeGreaterThanOrEqual(250);
  });

  it('does not count placeholder file descriptions as primary evidence', () => {
    const result = evaluateMemorySufficiency({
      title: 'Perfect Session Capturing',
      content: [
        '# Perfect Session Capturing',
        '',
        '## Overview',
        'Tracked a file but did not preserve any meaningful role or outcome.',
      ].join('\n'),
      files: [
        { path: 'scripts/core/workflow.ts', description: 'Modified during session', specRelevant: true },
        { path: 'scripts/utils/input-normalizer.ts', description: 'Tracked file history snapshot', specRelevant: true },
      ],
      triggerPhrases: ['perfect session capturing', 'workflow'],
    });

    expect(result.pass).toBe(false);
    expect(result.evidenceCounts.primary).toBe(0);
  });

  it('counts spec-specific tool evidence as primary context', () => {
    const result = evaluateMemorySufficiency({
      title: 'Memory Save Insufficiency Dry-Run Contract',
      content: [
        '# Memory Save Insufficiency Dry-Run Contract',
        '',
        '## Detailed Changes',
        '### Tool: bash memory_save dry run',
        'Tool: bash. Result: dry-run now returns insufficiency reasons, evidence counts, and the rejection code before any write occurs.',
      ].join('\n'),
      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'evidence counts'],
      observations: [
        {
          title: 'Tool: bash memory_save dry run',
          narrative: 'Executed memory_save with dryRun=true and confirmed the insufficiency payload is explicit and non-mutating.',
          facts: ['Tool: bash', 'Result: insufficiency payload returned before indexing'],
          specRelevant: true,
        },
      ],
      nextActions: ['Validate the final dry-run response contract in handler-memory-save tests.'],
    });

    expect(result.pass).toBe(true);
    expect(result.evidenceCounts.primary).toBeGreaterThanOrEqual(1);
  });
});
