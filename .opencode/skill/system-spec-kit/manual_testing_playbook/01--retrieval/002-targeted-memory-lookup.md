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

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

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

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: M-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/002-targeted-memory-lookup.md`
