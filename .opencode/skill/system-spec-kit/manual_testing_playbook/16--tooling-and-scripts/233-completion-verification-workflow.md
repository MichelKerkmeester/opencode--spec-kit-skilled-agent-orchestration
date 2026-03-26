---
title: "233 -- Completion Verification Workflow"
description: "This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses."
---

# 233 -- Completion Verification Workflow

## 1. OVERVIEW

This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses.

---

## 2. CURRENT REALITY

Operators run the completion gate against compliant, lightweight, and intentionally degraded fixtures and confirm the workflow returns the expected advisory, pass, and blocking states.

- Objective: Confirm advisory handling, COMPLETE status, and evidence-aware blocking for `check-completion.sh`
- Prompt: `Validate the completion verification workflow across Level 1 advisory cases, compliant Level 3 checklists, and degraded evidence cases. Capture the evidence needed to prove missing checklist files do not hard-fail lightweight specs, compliant checklists return COMPLETE, and checked P0/P1 items without evidence are blocked. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: missing checklist returns exit 0 advisory; compliant checklist returns COMPLETE; degraded checklist returns non-zero with evidence or blocking status
- Pass/fail: PASS if advisory, COMPLETE, and blocking outcomes match the fixture state and exit codes remain consistent with the script contract

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 233 | Completion Verification Workflow | Confirm advisory handling, COMPLETE status, and evidence-aware blocking for `check-completion.sh` | `Validate the completion verification workflow across Level 1 advisory cases, compliant Level 3 checklists, and degraded evidence cases. Capture the evidence needed to prove missing checklist files do not hard-fail lightweight specs, compliant checklists return COMPLETE, and checked P0/P1 items without evidence are blocked. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1` 2) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json` 3) `TMP_DIR="$(mktemp -d /tmp/speckit-completion-XXXXXX)"` 4) `cp -R .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 "$TMP_DIR/level3-missing-evidence"` 5) `perl -0pi -e 's/ \\[EVIDENCE:[^\\n]+\\]//' "$TMP_DIR/level3-missing-evidence/checklist.md"` 6) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --json || true` 7) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --strict || true` | Level 1 fixture returns advisory exit 0; compliant Level 3 fixture reports COMPLETE; degraded fixture reports blocking status such as EVIDENCE_MISSING or another non-pass status with non-zero exit | Command transcript, JSON output for the compliant and degraded runs, and the modified checklist diff in the temp fixture | PASS if the lightweight fixture does not hard-fail, the compliant fixture reports COMPLETE, and the degraded fixture blocks completion with a non-zero exit and explicit reason | Inspect `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh`, especially checklist parsing, inherited priority logic, and evidence marker detection |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/19-completion-verification-workflow.md](../../feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 233
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/233-completion-verification-workflow.md`
