---
title: "EX-002 -- Semantic and lexical search (memory_search)"
description: "This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check."
audited_post_018: true
---

# EX-002 -- Semantic and lexical search (memory_search)

## 1. OVERVIEW

This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-002` and confirm the expected signals without contradicting evidence.

- Objective: Hybrid precision check
- Prompt: `As a retrieval validation operator, validate Semantic and lexical search (memory_search) against memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 }). Verify relevant ranked results with hybrid signals. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Relevant ranked results with hybrid signals
- Pass/fail: PASS if top results match query intent

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, validate Hybrid precision check against memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 }). Verify relevant ranked results with hybrid signals. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 })
2. memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, bypassCache:true })

### Expected

Relevant ranked results with hybrid signals

### Evidence

Search output snapshot

### Pass / Fail

- **Pass**: top results match query intent
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Lower minState; disable cache and retry

---

### Prompt

```
As a retrieval validation operator, validate the response-policy refusal contract on memory_search. With a deliberately weak query (high lexical noise, no real anchor), verify the response includes responsePolicy.noCanonicalPathClaims:true, safeResponse:true, and citationPolicy enumerated. Re-run with a high-quality query and assert noCanonicalPathClaims:false with citationPolicy.canonicalPathsAllowed:true. Return a concise pass/fail verdict.
```

### Commands

1. `memory_search({ query:"<gibberish-string-with-no-anchor>", limit:5 })` — assert `responsePolicy.noCanonicalPathClaims:true`, `safeResponse:true`, `citationPolicy` present
2. `memory_search({ query:"<strong-spec-doc-anchor-keyword>", limit:5 })` — assert `responsePolicy.noCanonicalPathClaims:false`, `citationPolicy.canonicalPathsAllowed:true`

### Expected

Weak query: handler refuses canonical-path claims; `safeResponse:true`; client surface MUST display refusal, not citations.
Strong query: refusal disabled; canonical paths allowed in response.

### Evidence

memory_search responses for both queries showing the responsePolicy / citationPolicy blocks

### Pass / Fail

- **Pass**: weak query enforces refusal contract; strong query disables refusal and exposes citation policy
- **Fail**: refusal absent on weak query, refusal present on strong query, or citationPolicy missing

### Failure Triage

Inspect `mcp_server/handlers/memory/search.ts` response-policy logic and confidence/recall thresholds; confirm packet 009 dist marker present

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/002-semantic-and-lexical-search-memory-search.md`
