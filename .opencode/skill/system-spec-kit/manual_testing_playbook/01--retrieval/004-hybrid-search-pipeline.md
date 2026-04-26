---
title: "EX-004 -- Hybrid search pipeline"
description: "This scenario validates Hybrid search pipeline for `EX-004`. It focuses on channel fusion sanity, caller-preserving fallback, and trace consistency."
audited_post_018: true
---

# EX-004 -- Hybrid search pipeline

## 1. OVERVIEW

This scenario validates Hybrid search pipeline for `EX-004`. It focuses on channel fusion sanity, caller-preserving fallback, and trace consistency.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-004` and confirm the expected signals without contradicting evidence.

- Objective: Confirm multi-channel fusion stays coherent when routing and fallback interact
- Prompt: `As a retrieval validation operator, validate Hybrid search pipeline against memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true }). Verify multi-channel fusion stays coherent when routing and fallback interact. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across the exposed score aliases; `useGraph:false` suppresses both graph and degree contributions even during fallback; lexical fallback only uses still-allowed lexical channels
- Pass/fail: PASS if fusion evidence is coherent, explicit channel disables are preserved across fallback, and no contradictory trace signals appear

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, validate Channel fusion sanity, caller-preserving fallback, and trace consistency against memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true }). Verify non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across exposed score aliases; useGraph:false suppresses graph and degree contributions even during fallback; lexical fallback only uses still-allowed lexical channels. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true })`
2. `memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true, useGraph:false })`
3. Compare the trace envelopes and confirm graph plus degree contributions disappear from the second run
4. Source-check `collectRawCandidates()` in `mcp_server/lib/search/hybrid-search.ts` if the trace does not make the fallback routing explicit

### Expected

Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across exposed score aliases; `useGraph:false` suppresses graph and degree contributions even during fallback; lexical fallback only uses still-allowed lexical channels

### Evidence

Paired trace outputs plus source-backed fallback routing confirmation if needed

### Pass / Fail

- **Pass**: fusion evidence is coherent, explicit channel disables survive fallback, and no contradictory channel trace appears
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `hybrid-search.ts` candidate routing and trace fields if graph or degree signals leak into the `useGraph:false` run

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/04-hybrid-search-pipeline.md](../../feature_catalog/01--retrieval/04-hybrid-search-pipeline.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/004-hybrid-search-pipeline.md`
