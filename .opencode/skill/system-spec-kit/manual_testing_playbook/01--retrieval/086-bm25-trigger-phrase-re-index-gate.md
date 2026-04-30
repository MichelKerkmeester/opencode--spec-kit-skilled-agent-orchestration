---
title: "086 -- BM25 trigger phrase re-index gate"
description: "This scenario validates BM25 trigger phrase re-index gate for `086`. It focuses on confirming trigger edits cause re-index when BM25 is explicitly enabled."
audited_post_018: true
---

# 086 -- BM25 trigger phrase re-index gate

## 1. OVERVIEW

This scenario validates BM25 trigger phrase re-index gate for `086`. It focuses on confirming trigger edits cause re-index when BM25 is explicitly enabled.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm trigger edit causes re-index when BM25 is enabled.
- Real user request: `` Please validate BM25 trigger phrase re-index gate against ENABLE_BM25=true and tell me whether the expected signals are present: `ENABLE_BM25=true` activates the in-memory BM25 path; trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed; FTS5 remains default when BM25 is disabled. ``
- RCAF Prompt: `As a retrieval validation operator, validate BM25 trigger phrase re-index gate against ENABLE_BM25=true. Verify trigger edit causes re-index when BM25 is enabled. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `ENABLE_BM25=true` activates the in-memory BM25 path; trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed; FTS5 remains default when BM25 is disabled
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if editing trigger phrases causes automatic BM25 re-index only when BM25 is explicitly enabled and new triggers are immediately searchable

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, confirm trigger edit causes re-index against ENABLE_BM25=true. Verify eNABLE_BM25=true activates the in-memory BM25 path; trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed; FTS5 remains available as the default lexical path when BM25 is off. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Start with `ENABLE_BM25=true` and verify `isBm25Enabled()` activates the in-memory BM25 path
2. Edit trigger phrases and confirm the update handler re-index condition still checks title OR trigger phrases when BM25 is enabled
3. Query the new trigger phrase and confirm it becomes searchable without a blocking full rebuild
4. Optionally unset `ENABLE_BM25` and confirm the BM25-specific re-index path stays inactive while FTS5 remains available

### Expected

`ENABLE_BM25=true` activates the in-memory BM25 path; trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed; FTS5 remains available as the default lexical path when BM25 is off

### Evidence

Re-index activity evidence + search output for new trigger phrase + optional evidence that default lexical retrieval remains FTS5 when BM25 is disabled

### Pass / Fail

- **Pass**: editing trigger phrases causes automatic BM25 re-index only when BM25 is explicitly enabled and new triggers are immediately searchable
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify the re-index gate detects trigger mutations, confirm BM25 enablement state, inspect `syncChangedRows()` maintenance behavior, and avoid treating FTS5-only lexical updates as BM25 evidence

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/06-bm25-trigger-phrase-re-index-gate.md](../../feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 086
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/086-bm25-trigger-phrase-re-index-gate.md`
