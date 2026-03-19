---
title: "NEW-067 -- Search pipeline safety"
description: "This scenario validates Search pipeline safety for `NEW-067`. It focuses on Confirm Sprint 8 pipeline safety fixes."
---

# NEW-067 -- Search pipeline safety

## 1. OVERVIEW

This scenario validates Search pipeline safety for `NEW-067`. It focuses on Confirm Sprint 8 pipeline safety fixes.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-067` and confirm the expected signals without contradicting evidence.

- Objective: Confirm Sprint 8 pipeline safety fixes
- Prompt: `Validate search pipeline safety bundle. Capture the evidence needed to prove Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions
- Pass/fail: PASS if pipeline safely handles summary/lexical heavy queries with correct filtering and tokenization

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-067 | Search pipeline safety | Confirm Sprint 8 pipeline safety fixes | `Validate search pipeline safety bundle. Capture the evidence needed to prove Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions. Return a concise user-facing pass/fail verdict with the main reason.` | 1) run summary/lexical heavy queries 2) inspect filters/tokenization 3) verify safety outcomes | Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions | Query output for heavy/edge-case inputs + filter inspection + tokenization output | PASS if pipeline safely handles summary/lexical heavy queries with correct filtering and tokenization | Inspect error handling in pipeline stages; verify filter boundary conditions; check tokenizer for malformed input handling |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/07-search-pipeline-safety.md](../../feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: NEW-067
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/067-search-pipeline-safety.md`
