---
title: "162 -- HyDE (SPECKIT_HYDE)"
description: "This scenario validates HyDE (SPECKIT_HYDE) for `162`. It focuses on enabling the flag in deep mode and verifying a HyDE pseudo-document is generated."
---

# 162 -- HyDE (SPECKIT_HYDE)

## 1. OVERVIEW

This scenario validates HyDE (SPECKIT_HYDE) for `162`. It focuses on enabling the flag in deep mode and verifying a HyDE pseudo-document is generated.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `162` and confirm the expected signals without contradicting evidence.

- Objective: Verify HyDE pseudo-document generation for low-confidence deep queries
- Prompt: `Test SPECKIT_HYDE=true with deep mode. Run a search that produces low-confidence baseline results and verify a HyDE pseudo-document is generated with its embedding. Capture the evidence needed to prove generateHyDE() returns a pseudoDocument and embedding, the shared LLM cache is populated, and active mode merges results into the candidate set (SPECKIT_HYDE_ACTIVE is ON by default). Then set SPECKIT_HYDE_ACTIVE=false and verify shadow mode logs results without merging. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: HyDEResult contains pseudoDocument (non-empty) and embedding (Float32Array); low-confidence threshold (top score < 0.45) triggers generation; LLM cache shared with reformulation; active mode (default): results merged into candidates; shadow mode (SPECKIT_HYDE_ACTIVE=false): results logged but not merged
- Pass/fail: PASS if pseudo-document generated for low-confidence query and results are merged by default (active mode), and stay shadow-only when SPECKIT_HYDE_ACTIVE=false; FAIL if no pseudo-document generated or merge behavior does not match flag state

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 162 | HyDE (SPECKIT_HYDE) | Verify HyDE pseudo-document generated | `Test SPECKIT_HYDE=true with deep mode on low-confidence queries. Verify pseudo-document generation and active merge (default). Then set SPECKIT_HYDE_ACTIVE=false and verify shadow-only behavior. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_HYDE=true` 2) `memory_search({ query: "obscure topic with few matches", mode: "deep" })` 3) Inspect HyDEResult for pseudoDocument + embedding 4) Verify active merge (default, SPECKIT_HYDE_ACTIVE is ON) 5) Set `SPECKIT_HYDE_ACTIVE=false`, verify shadow-only (logged, not merged) 6) Check LLM cache populated | HyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; active merge by default (SPECKIT_HYDE_ACTIVE ON); shadow-only when SPECKIT_HYDE_ACTIVE=false; LLM cache shared | HyDEResult output + merge verification + shadow log + cache key verification | PASS if pseudo-document generated for low-confidence query, merged by default, and shadow-only with SPECKIT_HYDE_ACTIVE=false; FAIL if no generation or merge behavior mismatches flag state | Verify isHyDEEnabled() → Check LOW_CONFIDENCE_THRESHOLD (0.45) → Inspect baseline result scores → Verify getLlmCache() key → Check HYDE_TIMEOUT_MS (8000) → Verify isHyDEActive() gate |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/08-hyde-hypothetical-document-embeddings.md](../../feature_catalog/12--query-intelligence/08-hyde-hypothetical-document-embeddings.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/hyde.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 162
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/162-hyde-speckit-hyde.md`
