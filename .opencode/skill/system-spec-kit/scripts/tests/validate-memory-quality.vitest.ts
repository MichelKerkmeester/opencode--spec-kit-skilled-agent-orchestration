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

describe('validateMemoryQualityContent filePath option', () => {
  const validMemoryContent = `---
title: "Implementation session for phase 009"
spec_folder: ""
trigger_phrases:
  - "reindex validator"
  - "false positive fix"
tool_count: 0
---

# Implementation session

This body contains enough technical detail about the reindex validator false positive fixes to pass content density checks.
The spec folder field is intentionally empty to test the filePath fallback mechanism.
`;

  it('V8 filePath fallback: extracts spec folder from multi-level path', () => {
    const result = validateMemoryQualityContent(validMemoryContent, {
      filePath: '/project/specs/02--system-spec-kit/009-reindex-validator/memory/session.md',
    });
    const v8 = result.ruleResults.find((rule) => rule.ruleId === 'V8');
    expect(v8).toBeDefined();
    expect(v8?.passed).toBe(true);
  });

  it('V8 filePath fallback: extracts spec folder from single-level path', () => {
    const result = validateMemoryQualityContent(validMemoryContent, {
      filePath: '/project/specs/009-reindex-validator/memory/session.md',
    });
    const v8 = result.ruleResults.find((rule) => rule.ruleId === 'V8');
    expect(v8).toBeDefined();
    expect(v8?.passed).toBe(true);
  });

  it('V12 skip: memory directory files bypass topical coherence', () => {
    const memoryContent = `---
title: "Feature flag graduation notes"
spec_folder: "02--system-spec-kit/023-esm-module-compliance"
trigger_phrases:
  - "feature flag graduation"
  - "rollout strategy"
tool_count: 0
---

# Feature Flag Graduation

Detailed notes about graduating feature flags with different terminology than parent spec trigger phrases.
The topical coherence check should be skipped for memory directory files.
`;
    const result = validateMemoryQualityContent(memoryContent, {
      filePath: '/project/specs/02--system-spec-kit/023-esm-module-compliance/memory/flag-graduation.md',
    });
    const v12 = result.ruleResults.find((rule) => rule.ruleId === 'V12');
    expect(v12).toBeDefined();
    expect(v12?.passed).toBe(true);
  });

  it('V12 skip: spec doc files bypass topical coherence', () => {
    const specDocContent = `---
title: "Plan for ESM module compliance"
spec_folder: "02--system-spec-kit/023-esm-module-compliance"
trigger_phrases:
  - "esm migration"
  - "module compliance"
tool_count: 0
---

# Plan: ESM Module Compliance

This plan document defines the approach for ensuring ESM module compliance across the codebase.
It should bypass V12 because spec docs define the spec itself.
`;
    const result = validateMemoryQualityContent(specDocContent, {
      filePath: '/project/specs/02--system-spec-kit/023-esm-module-compliance/plan.md',
    });
    const v12 = result.ruleResults.find((rule) => rule.ruleId === 'V12');
    expect(v12).toBeDefined();
    expect(v12?.passed).toBe(true);
  });

  it('rule results include descriptive name field', () => {
    const result = validateMemoryQualityContent(validMemoryContent);
    const v8 = result.ruleResults.find((rule) => rule.ruleId === 'V8');
    expect(v8?.name).toBe('cross-spec-contamination');
    const v12 = result.ruleResults.find((rule) => rule.ruleId === 'V12');
    expect(v12?.name).toBe('topical-coherence-mismatch');
  });
});
