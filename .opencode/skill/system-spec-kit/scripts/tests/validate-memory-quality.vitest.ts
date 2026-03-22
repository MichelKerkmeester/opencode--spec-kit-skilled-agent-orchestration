import { describe, expect, it } from 'vitest';

import { validateMemoryQualityContent } from '../lib/validate-memory-quality';

describe('validateMemoryQualityContent frontmatter YAML parsing', () => {
  it('flags malformed YAML frontmatter through V13', () => {
    const result = validateMemoryQualityContent(`---
title: "Broken title
spec_folder: "022-hybrid-rag-fusion/009-perfect-session-capturing"
trigger_phrases:
  - "phase 016"
tool_count: 0
---

# Broken frontmatter

This body has enough non-whitespace characters to avoid the density check from masking the YAML parse failure.
`);

    expect(result.failedRules).toContain('V13');
    const v13 = result.ruleResults.find((rule) => rule.ruleId === 'V13');
    expect(v13?.message).toMatch(/malformed frontmatter YAML/i);
  });

  it('accepts valid YAML lists parsed through the real YAML loader', () => {
    const result = validateMemoryQualityContent(`---
title: "Valid memory"
spec_folder: "022-hybrid-rag-fusion/009-perfect-session-capturing"
trigger_phrases:
  - "phase 016"
  - "json mode"
tool_count: 0
status: "in_progress"
percentage: 50
---

# Valid frontmatter

This body includes plenty of technical detail so the quality gate sees it as a real saved memory rather than sparse placeholder output.
`);

    expect(result.failedRules).not.toContain('V13');
  });
});
