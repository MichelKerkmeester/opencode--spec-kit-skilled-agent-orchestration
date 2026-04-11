---
title: "EX-006 -- Memory indexing (memory_save)"
description: "This scenario validates Memory indexing (memory_save) for `EX-006`. It focuses on New memory ingestion."
audited_post_018: true
phase_018_replaces: "legacy memory-file ingestion scenario with spec-doc anchored continuity save validation"
---

# EX-006 -- Memory indexing (memory_save)

## 1. OVERVIEW

This scenario validates Memory indexing (memory_save) for `EX-006`. It focuses on spec-doc anchored continuity save routing.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-006` and confirm the expected signals without contradicting evidence.

- Objective: Spec-doc anchored continuity save routing
- Prompt: `Save a spec doc and report action. Capture the evidence needed to prove Routed save action reported; spec-doc continuity updated; searchable result appears; no template-contract or insufficiency rejection. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Save action reported; spec-doc continuity updated; searchable result appears; no template-contract or insufficiency rejection
- Pass/fail: PASS if the document is indexed and retrievable and the save does not report `INSUFFICIENT_CONTEXT_ABORT` or template-contract failure

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-006 | Memory indexing (memory_save) | Spec-doc anchored continuity save routing | `Save a spec doc and report action. Capture the evidence needed to prove Routed save action reported; spec-doc continuity updated; searchable result appears; no template-contract or insufficiency rejection. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_save(filePath)` -> `memory_stats()` -> `memory_search(title)` | Save action reported; spec-doc continuity updated; searchable result appears; no template-contract or insufficiency rejection | Save output + follow-up search | PASS if the document is indexed and retrievable and the save does not report `INSUFFICIENT_CONTEXT_ABORT` or template-contract failure | Validate file path/type, rendered anchor/frontmatter shape, and content quality |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/01-memory-indexing-memorysave.md](../../feature_catalog/02--mutation/01-memory-indexing-memorysave.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-006
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/006-memory-indexing-memory-save.md`
