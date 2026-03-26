---
title: "178 -- Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS)"
description: "This scenario validates save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) for `178`. It focuses on the default-on graduated rollout and verifying short-critical quality gate exception for decision documents with structural signals."
---

# 178 -- Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS)

## 1. OVERVIEW

This scenario validates save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) for `178`. It focuses on the default-on graduated rollout and verifying short-critical quality gate exception for decision documents with structural signals.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `178` and confirm the expected signals without contradicting evidence.

- Objective: Verify short-critical quality gate exception for decision documents with structural signals
- Prompt: `Test the default-on SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS behavior. Save a short decision document (< 50 characters) with at least 2 structural signals (e.g., good title + anchors). Verify the document bypasses the MIN_CONTENT_LENGTH=50 check via the short-critical exception path. Confirm the exception requires context_type=decision and >= 2 structural signals, and that non-decision types or insufficient signals are still rejected. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: context_type=decision required; SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS=2 threshold; structural signals: title quality, trigger quality, anchor quality, metadata quality; bypasses MIN_CONTENT_LENGTH=50 in Layer 1; warn-only (not silent); non-decision types still rejected
- Pass/fail: PASS if short decision documents with >= 2 structural signals bypass length check; FAIL if decision documents rejected despite signals, non-decision types bypass check, or fewer than 2 signals allow bypass

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 178 | Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) | Verify short-critical quality gate exception for decision documents with structural signals | `Test the default-on SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS behavior. Save a short decision document and verify it bypasses the 50-char minimum. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` is unset or `true` 2) `memory_save({ title: "Chose SQLite over PostgreSQL", content: "Embedded deployment decision", context_type: "decision", anchors: ["architecture", "database"] })` 3) Verify save succeeds despite content < 50 chars 4) Save same content with context_type=general, verify rejection 5) Save decision with only 1 structural signal, verify rejection | isSaveQualityGateExceptionsEnabled() returns true; decision + >= 2 structural signals → bypass MIN_CONTENT_LENGTH=50; non-decision types rejected; < 2 signals rejected; Layer 1/2/3 validation still runs for other checks | Save result (pass/warn/reject) + structural signal count + quality gate layer outputs + test transcript | PASS if short decision with >= 2 structural signals bypasses length check; FAIL if decision rejected despite signals, non-decision bypasses, or < 2 signals allow bypass | Verify isSaveQualityGateExceptionsEnabled() → Confirm flag is not forced off → Check SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS=2 → Inspect structural signal detection logic → Verify MIN_CONTENT_LENGTH=50 bypass path → Check Layer 1 exception routing |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/24-save-quality-gate-exceptions.md](../../feature_catalog/13--memory-quality-and-indexing/24-save-quality-gate-exceptions.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/validation/save-quality-gate.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 178
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/178-save-quality-gate-exceptions-speckit-save-quality-gate-exceptions.md`
