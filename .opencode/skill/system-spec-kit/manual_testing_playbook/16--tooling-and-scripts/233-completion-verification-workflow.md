---
title: "233 -- Completion Verification Workflow"
description: "This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses."
---

# 233 -- Completion Verification Workflow

## 1. OVERVIEW

This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm advisory handling, COMPLETE status, and evidence-aware blocking for `check-completion.sh`.
- Real user request: `Please validate Completion Verification Workflow against the documented validation surface and tell me whether the expected signals are present: missing checklist returns exit 0 advisory; compliant checklist returns COMPLETE; degraded checklist returns non-zero with evidence or blocking status.`
- RCAF Prompt: `As a tooling validation operator, validate Completion Verification Workflow against the documented validation surface. Verify advisory handling, COMPLETE status, and evidence-aware blocking for check-completion.sh. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: missing checklist returns exit 0 advisory; compliant checklist returns COMPLETE; degraded checklist returns non-zero with evidence or blocking status
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if advisory, COMPLETE, and blocking outcomes match the fixture state and exit codes remain consistent with the script contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate the completion verification workflow across Level 1 advisory cases, compliant Level 3 checklists, and degraded evidence cases. Capture the evidence needed to prove missing checklist files do not hard-fail lightweight specs, compliant checklists return COMPLETE, and checked P0/P1 items without evidence are blocked. Return a concise user-facing pass/fail verdict with the main reason.
```

### Commands

1. `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1`
2. `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`
3. `TMP_DIR="$(mktemp -d /tmp/speckit-completion-XXXXXX)"`
4. `cp -R .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 "$TMP_DIR/level3-missing-evidence"`
5. `perl -0pi -e 's/ \\[EVIDENCE:[^\\n]+\\]//' "$TMP_DIR/level3-missing-evidence/checklist.md"`
6. `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --json || true`
7. `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --strict || true`

### Expected

Level 1 fixture returns advisory exit 0; compliant Level 3 fixture reports COMPLETE; degraded fixture reports blocking status such as EVIDENCE_MISSING or another non-pass status with non-zero exit

### Evidence

Command transcript, JSON output for the compliant and degraded runs, and the modified checklist diff in the temp fixture

### Pass / Fail

- **Pass**: the lightweight fixture does not hard-fail, the compliant fixture reports COMPLETE, and the degraded fixture blocks completion with a non-zero exit and explicit reason
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh`, especially checklist parsing, inherited priority logic, and evidence marker detection

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/19-completion-verification-workflow.md](../../feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 233
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/233-completion-verification-workflow.md`
