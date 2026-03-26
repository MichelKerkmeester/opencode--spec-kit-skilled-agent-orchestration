---
title: "070 -- Dead code removal"
description: "This scenario validates Dead code removal for `070`. It focuses on Confirm dead path elimination."
---

# 070 -- Dead code removal

## 1. OVERVIEW

This scenario validates Dead code removal for `070`. It focuses on Confirm documented removals remain absent.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `070` and confirm the expected signals without contradicting evidence.

- Objective: Confirm documented removals remain absent
- Prompt: `Audit dead code removal outcomes. Capture the evidence needed to prove removed hybrid-search branches stay absent; retired helpers (isShadowScoringEnabled/isRsfEnabled) are gone; dead module state and exports listed in the audit stay absent; representative flows execute without missing-reference errors. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors
- Pass/fail: PASS if the documented removals have zero live references and representative flows execute cleanly

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 070 | Dead code removal | Confirm documented removals remain absent | `Audit dead code removal outcomes. Capture the evidence needed to prove removed hybrid-search branches stay absent; retired helpers (isShadowScoringEnabled/isRsfEnabled) are gone; dead module state and exports listed in the audit stay absent; representative flows execute without missing-reference errors. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Search for removed branch helpers and symbols: `isShadowScoringEnabled`, `isRsfEnabled`, `stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, `computeCausalDepth`, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent` 2) Search for removed working-memory config fields: `decayInterval`, `attentionDecayRate`, `minAttentionScore` 3) Run representative flows 4) Confirm no missing-reference errors | Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors | Empty symbol-search output + representative flow transcripts | PASS if the documented removals have zero live references and representative flows execute cleanly; FAIL if any removed symbol is still wired or a representative flow trips a missing reference | Re-check the dead-code audit list against the codebase; inspect string-based references; run targeted regression suites for the affected subsystems |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/04-dead-code-removal.md](../../feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 070
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/070-dead-code-removal.md`
