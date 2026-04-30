---
title: "162 -- HyDE (SPECKIT_HYDE)"
description: "This scenario validates HyDE (SPECKIT_HYDE) for `162`. It focuses on enabling the flag in deep mode and verifying a HyDE pseudo-document is generated."
audited_post_018: true
---

# 162 -- HyDE (SPECKIT_HYDE)

## 1. OVERVIEW

This scenario validates HyDE (SPECKIT_HYDE) for `162`. It focuses on enabling the flag in deep mode and verifying a HyDE pseudo-document is generated.

---

## 2. SCENARIO CONTRACT


- Objective: Verify HyDE pseudo-document generation for low-confidence deep queries.
- Real user request: `Please validate HyDE (SPECKIT_HYDE) against SPECKIT_HYDE=true and tell me whether the expected signals are present: HyDEResult contains pseudoDocument (non-empty) and embedding (Float32Array); low-confidence threshold (top score < 0.45) triggers generation; LLM cache shared with reformulation; active mode (default): results merged into candidates; shadow mode (SPECKIT_HYDE_ACTIVE=false): results logged but not merged.`
- RCAF Prompt: `As a query-intelligence validation operator, validate HyDE (SPECKIT_HYDE) against SPECKIT_HYDE=true. Verify hyDE pseudo-document generation for low-confidence deep queries. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: HyDEResult contains pseudoDocument (non-empty) and embedding (Float32Array); low-confidence threshold (top score < 0.45) triggers generation; LLM cache shared with reformulation; active mode (default): results merged into candidates; shadow mode (SPECKIT_HYDE_ACTIVE=false): results logged but not merged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if pseudo-document generated for low-confidence query and results are merged by default (active mode), and stay shadow-only when SPECKIT_HYDE_ACTIVE=false; FAIL if no pseudo-document generated or merge behavior does not match flag state

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify HyDE pseudo-document generated against SPECKIT_HYDE=true. Verify hyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; active merge by default (SPECKIT_HYDE_ACTIVE ON); shadow-only when SPECKIT_HYDE_ACTIVE=false; LLM cache shared. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_HYDE=true`
2. `memory_search({ query: "obscure topic with few matches", mode: "deep" })`
3. Inspect HyDEResult for pseudoDocument + embedding
4. Verify active merge (default, SPECKIT_HYDE_ACTIVE is ON)
5. Set `SPECKIT_HYDE_ACTIVE=false`, verify shadow-only (logged, not merged)
6. Check LLM cache populated

### Expected

HyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; active merge by default (SPECKIT_HYDE_ACTIVE ON); shadow-only when SPECKIT_HYDE_ACTIVE=false; LLM cache shared

### Evidence

HyDEResult output + merge verification + shadow log + cache key verification

### Pass / Fail

- **Pass**: pseudo-document generated for low-confidence query, merged by default, and shadow-only with SPECKIT_HYDE_ACTIVE=false
- **Fail**: no generation or merge behavior mismatches flag state

### Failure Triage

Verify isHyDEEnabled() → Check LOW_CONFIDENCE_THRESHOLD (0.45) → Inspect baseline result scores → Verify getLlmCache() key → Check HYDE_TIMEOUT_MS (8000) → Verify isHyDEActive() gate

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/08-hyde-hypothetical-document-embeddings.md](../../feature_catalog/12--query-intelligence/08-hyde-hypothetical-document-embeddings.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/hyde.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 162
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/162-hyde-speckit-hyde.md`
