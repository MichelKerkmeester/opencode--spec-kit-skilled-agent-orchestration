---
title: "241 -- Session Extraction and Enrichment"
description: "This scenario validates session extraction and enrichment for `241`. It focuses on confirming extractor loading, session enrichment, phase classification, and description enrichment behavior."
---

# 241 -- Session Extraction and Enrichment

## 1. OVERVIEW

This scenario validates session extraction and enrichment for `241`. It focuses on confirming extractor loading, session enrichment, phase classification, and description enrichment behavior.

---

## 2. SCENARIO CONTRACT

Operators validate the extractor-layer contract through the loader smoke test plus the targeted enrichment suites that cover file shaping, phase classification, and description-quality upgrades.

- Objective: Confirm extractor loading, enrichment behavior, and phase classification stability
- Prompt: `As a tooling validation operator, validate Session Extraction and Enrichment against cd .opencode/skill/system-spec-kit/scripts && node tests/test-extractors-loaders.js. Verify extractor loading, enrichment behavior, and phase classification stability. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: extractor loader script passes; targeted Vitest suites pass; enrichment-specific assertions remain green
- Pass/fail: PASS if the extractor-layer tests pass together and the loader script confirms the barrel surface is usable

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm extractor loading, enrichment behavior, and phase classification stability against cd .opencode/skill/system-spec-kit/scripts && node tests/test-extractors-loaders.js. Verify extractor loader script passes; all targeted Vitest suites pass; no regression in enrichment or phase-classification expectations. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/scripts && node tests/test-extractors-loaders.js`
2. `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/session-enrichment.vitest.ts tests/phase-classification.vitest.ts tests/description-enrichment.vitest.ts`

### Expected

Extractor loader script passes; all targeted Vitest suites pass; no regression in enrichment or phase-classification expectations

### Evidence

Loader script output and Vitest transcript

### Pass / Fail

- **Pass**: the loader smoke test and all targeted suites pass
- **Fail**: extraction, enrichment, or classification behavior regresses

### Failure Triage

Inspect `scripts/extractors/file-extractor.ts`, `diagram-extractor.ts`, `session-activity-signal.ts`, and the extractor barrel if module loading or enrichment semantics fail

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/27-session-extraction-and-enrichment.md](../../feature_catalog/16--tooling-and-scripts/27-session-extraction-and-enrichment.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 241
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/241-session-extraction-and-enrichment.md`
