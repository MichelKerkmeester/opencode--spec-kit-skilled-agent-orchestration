import { describe, expect, it } from 'vitest';

import {
  extractSpecIdCandidates,
  validateMemoryQualityContent,
} from '../lib/validate-memory-quality';

describe('V8 spec id extraction calibration', () => {
  const evidenceTokens = [
    '002-014',
    '002-i003-p1-001',
    '002-implement-cache-warning-hooks',
    '003-memory-quality-issues',
    '008-graph-first-routing-nudge',
    '008-i001-p1-001',
    '010-fts-capability-cascade-floor',
    '010-i001-p1-001',
    '013-i003-p1-001',
    '013-warm-start-bundle-conditional-validation',
    '005-code-graph-upgrades',
    '014-i001-p1-001',
    '026-04-09',
    '026-graph-and-context-optimization',
    '098-be14cbc33dbe',
  ];

  it('keeps only the legitimate spec slugs from the RCA evidence list', () => {
    const matches = extractSpecIdCandidates(evidenceTokens.join('\n'));

    expect(matches).toEqual([
      '002-implement-cache-warning-hooks',
      '003-memory-quality-issues',
      '008-graph-first-routing-nudge',
      '010-fts-capability-cascade-floor',
      '013-warm-start-bundle-conditional-validation',
      '005-code-graph-upgrades',
      '026-graph-and-context-optimization',
    ]);
  });

  it('passes V8 for a good memory that only contains dates, session ids, and finding ids', () => {
    const result = validateMemoryQualityContent(`---
title: "Memory save verification"
spec_folder: "system-spec-kit/026-graph-and-context-optimization"
trigger_phrases:
  - "memory save verification"
tool_count: 0
---

# Memory save verification

This memory references 2026-04-09, session-1775716659098-be14cbc33dbe, 002-I003-P1-001, 008-I001-P1-001,
and the range 002-014 while still discussing the real 026-graph-and-context-optimization packet only.
The body remains focused on the current packet and contains enough content to satisfy density rules.
`);

    const v8 = result.ruleResults.find((rule) => rule.ruleId === 'V8');
    expect(v8?.passed).toBe(true);
  });

  it('still fails V8 for a fabricated foreign spec that dominates the memory body', () => {
    const result = validateMemoryQualityContent(`---
title: "Foreign contamination fixture"
spec_folder: "system-spec-kit/026-graph-and-context-optimization"
trigger_phrases:
  - "foreign contamination fixture"
tool_count: 0
---

# Foreign contamination fixture

This note repeatedly cites 999-fake-spec-folder to verify contamination detection.
The same 999-fake-spec-folder is mentioned again so the body is dominated by the fabricated foreign slug.
A third 999-fake-spec-folder mention pushes the dominance threshold over the real current packet.
`);

    const v8 = result.ruleResults.find((rule) => rule.ruleId === 'V8');
    expect(v8?.passed).toBe(false);
    expect(v8?.message).toContain('foreign spec ids dominate rendered content');
  });
});
