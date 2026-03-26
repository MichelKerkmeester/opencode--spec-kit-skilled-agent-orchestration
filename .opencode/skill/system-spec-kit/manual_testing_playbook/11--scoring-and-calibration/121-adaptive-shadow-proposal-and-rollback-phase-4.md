---
title: "121 -- Adaptive shadow proposal and rollback (Phase 4)"
description: "This scenario validates Adaptive shadow proposal and rollback (Phase 4) for `121`. It focuses on Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly."
---

# 121 -- Adaptive shadow proposal and rollback (Phase 4)

## 1. OVERVIEW

This scenario validates Adaptive shadow proposal and rollback (Phase 4) for `121`. It focuses on Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `121` and confirm the expected signals without contradicting evidence.

- Objective: Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly
- Prompt: `Validate Phase 4 adaptive shadow proposal flow. Capture the evidence needed to prove Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output
- Pass/fail: PASS: Shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; FAIL: Live order changes under shadow mode or proposal persists after disable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 121 | Adaptive shadow proposal and rollback (Phase 4) | Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly | `Validate Phase 4 adaptive shadow proposal flow. Capture the evidence needed to prove Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Set `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` and leave `SPECKIT_MEMORY_ADAPTIVE_MODE` unset 2) Trigger access/validation events for one memory 3) Run `memory_search({ query:"adaptive shadow check", includeTrace:true })` 4) Verify response includes `adaptiveShadow` proposal data while production ordering remains the live result order 5) Disable the flag and repeat | Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output | Search output with `adaptiveShadow` payload + before/after flag comparison + signal capture evidence from validation/access paths | PASS: Shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; FAIL: Live order changes under shadow mode or proposal persists after disable | Verify adaptive signals were recorded from access/validation → Inspect bounded delta cap → Confirm disable path clears proposal output without schema rollback |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md](../../feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 121
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/121-adaptive-shadow-proposal-and-rollback-phase-4.md`
