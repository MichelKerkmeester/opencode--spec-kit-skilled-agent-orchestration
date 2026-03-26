---
title: "M-002 -- Targeted Memory Lookup"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`."
---

# M-002 -- Targeted Memory Lookup

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Find rationale for <specific decision>. Capture the evidence needed to prove precise fact-level retrieval. Return a concise user-facing pass/fail verdict with the main reason.`
- Commands:
  - `memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]})`
- Expected: precise fact-level retrieval.
- Evidence: fact + source snippet.
- Pass: question answered with traceable result.
- Fail triage: refine query terms; use focused mode.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: M-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/002-targeted-memory-lookup.md`
