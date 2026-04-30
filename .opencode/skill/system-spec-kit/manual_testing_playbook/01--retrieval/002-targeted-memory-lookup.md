---
title: "M-002 -- Targeted Memory Lookup"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`."
audited_post_018: true
---

# M-002 -- Targeted Memory Lookup

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`.
- Real user request: `Please validate Targeted Memory Lookup against memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]}) and tell me whether the expected signals are present: precise fact-level retrieval.`
- RCAF Prompt: `As a retrieval validation operator, validate Targeted Memory Lookup against memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]}). Verify precise fact-level retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: precise fact-level retrieval
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: question answered with traceable result.

---

## 3. TEST EXECUTION

### Prompt

`As a retrieval validation operator, validate Targeted Memory Lookup against memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]}). Verify precise fact-level retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Commands
- `memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]})`
### Expected

precise fact-level retrieval.
### Evidence

fact + source snippet.
### Pass/Fail

question answered with traceable result.
### Failure Triage

refine query terms; use focused mode.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: M-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/002-targeted-memory-lookup.md`
