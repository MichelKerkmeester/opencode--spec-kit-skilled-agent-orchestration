---
title: "234 -- Ops Self-Healing Runbooks"
description: "This scenario validates ops self-healing runbooks for `234`. It focuses on confirming the runbook dispatcher, metadata surfaces, successful drills, and bounded escalation behavior."
---

# 234 -- Ops Self-Healing Runbooks

## 1. OVERVIEW

This scenario validates ops self-healing runbooks for `234`. It focuses on confirming the runbook dispatcher, metadata surfaces, successful drills, and bounded escalation behavior.

---

## 2. CURRENT REALITY

Operators exercise the shell runbook surface end to end and confirm the dispatcher exposes the documented failure classes, returns ownership metadata, and emits deterministic recovery or escalation payloads.

- Objective: Confirm runbook listing, metadata lookup, success drills, and escalation drills
- Prompt: `Validate the ops self-healing runbooks. Capture the evidence needed to prove runbook.sh lists the documented failure classes, show returns owner and escalation metadata, success drills emit RECOVERY_COMPLETE payloads for supported classes, and escalation drills emit bounded ESCALATION payloads for degraded classes. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `list` prints four classes; `show` prints trigger, owner, escalation, and drill command; supported success drills emit recovery payloads; degraded drills emit escalation payloads or non-zero aggregate status
- Pass/fail: PASS if the dispatcher and metadata surface behave deterministically and the drill outcomes match the current degraded-versus-supported reality

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 234 | Ops Self-Healing Runbooks | Confirm runbook listing, metadata lookup, success drills, and escalation drills | `Validate the ops self-healing runbooks. Capture the evidence needed to prove runbook.sh lists the documented failure classes, show returns owner and escalation metadata, success drills emit RECOVERY_COMPLETE payloads for supported classes, and escalation drills emit bounded ESCALATION payloads for degraded classes. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh list` 2) `bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh show index-drift` 3) `bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill index-drift --scenario success --max-attempts 3` 4) `bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill ledger-mismatch --scenario success --max-attempts 3` 5) `bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill telemetry-drift --scenario escalate --max-attempts 2 || true` 6) `bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill all --scenario success --max-attempts 2 || true` | Four failure classes listed; `show` prints trigger, owner, escalation, and drill fields; supported drills emit `RECOVERY_COMPLETE`; degraded classes surface `ESCALATION` or non-zero aggregate drill status | Shell transcript for list/show/drill commands, including JSON-like recovery or escalation payloads and exit codes | PASS if listing, metadata lookup, supported recovery, and degraded escalation all align with the documented current reality | Inspect `runbook.sh`, `ops-common.sh`, and the individual `heal-*.sh` runners if a class is missing, misrouted, or emits the wrong payload shape |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/20-ops-self-healing-runbooks.md](../../feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 234
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/234-ops-self-healing-runbooks.md`
