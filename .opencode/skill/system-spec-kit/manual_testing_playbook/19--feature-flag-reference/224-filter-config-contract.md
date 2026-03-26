---
title: "224 -- Filter Config Contract"
description: "This scenario validates Filter Config Contract for `224`. It focuses on confirming the content-filter loader honors file-backed pipeline settings, stage order, thresholds, and deep-merge fallback behavior."
---

# 224 -- Filter Config Contract

## 1. OVERVIEW

This scenario validates Filter Config Contract for `224`. It focuses on confirming the content-filter loader honors file-backed pipeline settings, stage order, thresholds, and deep-merge fallback behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `224` and confirm the expected signals without contradicting evidence.

- Objective: confirming the content-filter loader honors file-backed pipeline settings, stage order, thresholds, and deep-merge fallback behavior
- Prompt: `Validate the filter config contract for filters.jsonc using a disposable fixture. Prove that the pipeline can be disabled cleanly, the configured stage order and threshold values drive filtering behavior when enabled, and malformed or partial config falls back to code defaults without breaking the filter pipeline.`
- Expected signals: `pipeline.enabled: false` returns the original prompt list unchanged; enabled runs respect the configured `noise`, `dedupe`, and `quality` stages in the declared order; configured thresholds such as `similarityThreshold` and `warnThreshold` affect filtering decisions; partial overrides preserve unspecified nested defaults; malformed JSONC logs a warning and falls back to built-in defaults
- Pass/fail: PASS if filters.jsonc actively controls the filter pipeline while deep-merge fallback keeps the pipeline operational when fields are omitted or the file is malformed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 224 | Filter Config Contract | Confirm the content-filter loader honors file-backed pipeline settings, stage order, thresholds, and deep-merge fallback behavior | `Validate the filter config contract for filters.jsonc using a disposable fixture. Prove that the pipeline can be disabled cleanly, the configured stage order and threshold values drive filtering behavior when enabled, and malformed or partial config falls back to code defaults without breaking the filter pipeline.` | 1) Copy `config/filters.jsonc` into a disposable sandbox, keep `pipeline.enabled: true`, and set distinctive values for `pipeline.stages`, `noise.minContentLength`, `dedupe.similarityThreshold`, and `quality.warnThreshold`. 2) Run the content-filter pipeline against a fixed prompt list containing short noise entries, exact duplicates, near-duplicates, and low-quality content, then capture which items are removed and in what order. 3) Change the sandbox config to `pipeline.enabled: false`, rerun the same prompt list, and confirm the original prompts are returned unchanged. 4) Re-enable the pipeline but provide only a partial nested override, rerun the fixture, and confirm unspecified defaults such as the remaining stages or quality factors are preserved through deep merge. 5) Replace the sandbox file with malformed JSONC, rerun the fixture, and confirm the loader logs a warning while the filter still runs with built-in defaults. | `pipeline.enabled: false` returns the original prompt list unchanged; enabled runs respect the configured `noise`, `dedupe`, and `quality` stages in the declared order; configured thresholds such as `similarityThreshold` and `warnThreshold` affect filtering decisions; partial overrides preserve unspecified nested defaults; malformed JSONC logs a warning and falls back to built-in defaults | sandbox copies of `filters.jsonc`, captured before or after prompt lists for each run, warning logs from malformed config, and a short note showing which thresholds or stages changed behavior | PASS if filters.jsonc actively controls the filter pipeline while deep-merge fallback keeps the pipeline operational when fields are omitted or the file is malformed | Inspect `scripts/lib/content-filter.ts` loader and merge logic, verify the fixture prompt list actually exercises noise plus dedupe plus quality branches, and confirm the malformed-config run did not silently reuse stale in-memory config from a prior execution |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/10-filter-config-contract.md](../../feature_catalog/19--feature-flag-reference/10-filter-config-contract.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 224
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/224-filter-config-contract.md`
