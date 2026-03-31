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

describe('V8 filePath fallback', () => {
  it('extracts spec folder from filePath when frontmatter spec_folder is empty', () => {
    const content = `---
title: "Test Memory"
trigger_phrases: ["test"]
importance_tier: "normal"
contextType: "implementation"
---
# Test
References to 024-compact-code-graph should not trigger V8 when in the same spec.
`;

    const result = validateMemoryQualityContent(content, {
      filePath: '/path/specs/02--system-spec-kit/024-compact-code-graph/memory/test.md',
    });

    const v8 = result.ruleResults.find((rule) => rule.ruleId === 'V8');
    expect(v8?.passed).toBe(true);
  });
});

describe('V12 skip for memory files', () => {
  it('skips topical coherence for files in memory directories', () => {
    const content = `---
title: "Test Memory"
trigger_phrases: ["completely unrelated terms"]
importance_tier: "normal"
contextType: "implementation"
spec_folder: "02--system-spec-kit/024-compact-code-graph"
---
# Test
This content has zero overlap with the parent spec trigger phrases.
`;

    const result = validateMemoryQualityContent(content, {
      filePath: '/path/specs/02--system-spec-kit/024-compact-code-graph/memory/test.md',
    });

    const v12 = result.ruleResults.find((rule) => rule.ruleId === 'V12');
    expect(v12?.passed).toBe(true);
  });

  it('skips topical coherence for spec.md files', () => {
    const content = `---
title: "Spec Doc"
trigger_phrases: ["unrelated"]
importance_tier: "normal"
contextType: "implementation"
spec_folder: "02--system-spec-kit/024-compact-code-graph"
---
# Spec
`;

    const result = validateMemoryQualityContent(content, {
      filePath: '/path/specs/02--system-spec-kit/024-compact-code-graph/spec.md',
    });

    const v12 = result.ruleResults.find((rule) => rule.ruleId === 'V12');
    expect(v12?.passed).toBe(true);
  });
});
