---
title: "246 -- Shared script libraries and utilities"
description: "This scenario validates shared script libraries and utilities for `246`. It focuses on confirming semantic helpers, utility regressions, and workspace identity behavior through targeted suites."
---

# 246 -- Shared script libraries and utilities

## 1. OVERVIEW

This scenario validates shared script libraries and utilities for `246`. It focuses on confirming semantic helpers, utility regressions, and workspace identity behavior through targeted suites.

---

## 2. CURRENT REALITY

Operators validate the shared helper layer through the regression suites that cover semantic signal extraction, general utility behavior, workspace normalization, backfill helpers, and tool sanitization.

- Objective: Confirm shared helper modules remain stable across semantic extraction, utilities, identity, and tool-safety suites
- Prompt: `Validate the shared script libraries and utilities surface. Capture the evidence needed to prove the semantic-signal golden suite, utility regression suite, workspace-identity suite, backfill-frontmatter suite, and tool-sanitizer suite all pass together. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: all targeted suites pass; no helper-layer regressions surface
- Pass/fail: PASS if the helper-layer suites pass together without failures or unexpected skips

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 246 | Shared script libraries and utilities | Confirm shared helper modules remain stable across semantic extraction, utilities, identity, and tool-safety suites | `Validate the shared script libraries and utilities surface. Capture the evidence needed to prove the semantic-signal golden suite, utility regression suite, workspace-identity suite, backfill-frontmatter suite, and tool-sanitizer suite all pass together. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/semantic-signal-golden.vitest.ts tests/utils-regressions.vitest.ts tests/workspace-identity.vitest.ts tests/backfill-frontmatter.vitest.ts tests/tool-sanitizer.vitest.ts` | All targeted Vitest suites pass; helper-layer regressions do not surface | Vitest transcript with passing suite and test counts | PASS if every targeted helper-layer suite passes; FAIL if any semantic, path, workspace, backfill, or tool-safety regression appears | Inspect `scripts/lib/semantic-signal-extractor.ts`, `scripts/utils/*.ts`, `workspace-identity.ts`, `path-utils.ts`, and related compatibility wrappers if one of the helper suites fails |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/32-shared-script-libraries-and-utilities.md](../../feature_catalog/16--tooling-and-scripts/32-shared-script-libraries-and-utilities.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 246
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/246-shared-script-libraries-and-utilities.md`
