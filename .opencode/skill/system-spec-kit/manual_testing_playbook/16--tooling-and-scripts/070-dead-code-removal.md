---
title: "070 -- Dead code removal"
description: "This scenario validates Dead code removal for `070`. It focuses on Confirm dead path elimination."
---

# 070 -- Dead code removal

## 1. OVERVIEW

This scenario validates Dead code removal for `070`. It focuses on Confirm dead path elimination.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `070` and confirm the expected signals without contradicting evidence.

- Objective: Confirm dead path elimination
- Prompt: `Audit dead code removal outcomes. Capture the evidence needed to prove Removed symbols not found in codebase; representative flows execute without missing-reference errors; no dead imports remain. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Removed symbols not found in codebase; representative flows execute without missing-reference errors; no dead imports remain
- Pass/fail: PASS if removed symbols have zero references and representative flows execute cleanly

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 070 | Dead code removal | Confirm dead path elimination | `Audit dead code removal outcomes. Capture the evidence needed to prove Removed symbols not found in codebase; representative flows execute without missing-reference errors; no dead imports remain. Return a concise user-facing pass/fail verdict with the main reason.` | 1) search removed symbols 2) run representative flows 3) confirm no runtime references | Removed symbols not found in codebase; representative flows execute without missing-reference errors; no dead imports remain | Symbol search output (empty results) + flow execution transcripts + import audit | PASS if removed symbols have zero references and representative flows execute cleanly | Verify symbol removal was complete; check for dynamic references (string-based imports); run full test suite for regression |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/04-dead-code-removal.md](../../feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 070
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/070-dead-code-removal.md`
