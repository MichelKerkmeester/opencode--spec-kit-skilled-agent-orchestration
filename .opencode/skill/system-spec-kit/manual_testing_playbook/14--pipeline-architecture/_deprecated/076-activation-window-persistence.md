---
title: "076 -- Activation window persistence [deprecated]"
description: "Archived copy of the Activation window persistence scenario. The live playbook no longer includes the retired quality-gate timer path."
audited_post_018: true
deprecated_at: 2026-04-11
deprecated_by: phase-018-canonical-continuity-refactor
deprecated_reason: "The retired quality-gate timer path is no longer part of the live playbook."
---

# 076 -- Activation window persistence [deprecated]

## 1. OVERVIEW

This scenario validates Activation window persistence for `076`. It focuses on confirming the retired timer-persistence record.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `076` and confirm the expected signals without contradicting evidence.

- Objective: Confirm the archived activation-timestamp persistence record remains source-accurate
- Prompt: `Verify the archived activation-timestamp persistence record. Capture the evidence needed to prove the historical save-quality-gate path persisted its timer across restart, that the archived record clearly marks the behavior as retired, and that no live phase-018 flow depends on this timer path. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Archived record stays source-accurate; historical activation timestamp persistence is documented; no live phase-018 flow depends on the retired timer path
- Pass/fail: PASS if the archival record is accurate and clearly marked retired; FAIL if it implies the timer path is still live or contradicts the source files

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 076 | Activation window persistence | Confirm the archived activation-timestamp persistence record remains source-accurate | `Verify the archived activation-timestamp persistence record. Capture the evidence needed to prove the historical save-quality-gate path persisted its timer across restart, that the archived record clearly marks the behavior as retired, and that no live phase-018 flow depends on this timer path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect the archived catalog and playbook records 2) Inspect the historical source anchors in `save-quality-gate.ts` and the associated tests 3) Confirm the archived wording stays historical-only 4) Confirm no live phase-018 flow depends on this timer path | Archived record stays source-accurate; historical activation timestamp persistence is documented; no live phase-018 flow depends on the retired timer path | Archived doc text plus source/test anchors showing the historical timer behavior | PASS if the archival record is accurate and clearly marked retired; FAIL if it implies the timer path is still live or contradicts the source files | Inspect `mcp_server/lib/validation/save-quality-gate.ts`, `mcp_server/tests/save-quality-gate.vitest.ts`, and any current save-pipeline references for unintended live dependencies |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/_deprecated/09-activation-window-persistence.md](../../feature_catalog/14--pipeline-architecture/_deprecated/09-activation-window-persistence.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 076
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/_deprecated/076-activation-window-persistence.md`
