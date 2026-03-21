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
- Prompt: `Test SPECKIT_HYDE=true with deep mode. Run a search that produces low-confidence baseline results and verify a HyDE pseudo-document is generated with its embedding. Capture the evidence needed to prove generateHyDE() returns a pseudoDocument and embedding, the shared LLM cache is populated, and shadow mode logs results without merging into the candidate set (unless SPECKIT_HYDE_ACTIVE=true). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: HyDEResult contains pseudoDocument (non-empty) and embedding (Float32Array); low-confidence threshold (top score < 0.45) triggers generation; LLM cache shared with reformulation; shadow mode: results logged but not merged; SPECKIT_HYDE_ACTIVE=true required for full merge
- Pass/fail: PASS if pseudo-document generated for low-confidence query and results stay shadow-only when SPECKIT_HYDE_ACTIVE is not set; FAIL if no pseudo-document generated or shadow results merged without SPECKIT_HYDE_ACTIVE

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 162 | HyDE (SPECKIT_HYDE) | Verify HyDE pseudo-document generated | `Test SPECKIT_HYDE=true with deep mode on low-confidence queries. Verify pseudo-document generation and shadow-only behavior. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_HYDE=true` 2) `memory_search({ query: "obscure topic with few matches", mode: "deep" })` 3) Inspect HyDEResult for pseudoDocument + embedding 4) Verify shadow-only (no merge without SPECKIT_HYDE_ACTIVE) 5) Check LLM cache populated | HyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; shadow-only when SPECKIT_HYDE_ACTIVE unset; LLM cache shared | HyDEResult output + shadow log + cache key verification | PASS if pseudo-document generated for low-confidence query and shadow-only without SPECKIT_HYDE_ACTIVE; FAIL if no generation or shadow merged prematurely | Verify isHyDEEnabled() → Check LOW_CONFIDENCE_THRESHOLD (0.45) → Inspect baseline result scores → Verify getLlmCache() key → Check HYDE_TIMEOUT_MS (8000) → Verify SPECKIT_HYDE_ACTIVE gate |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/hyde.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 162
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/162-hyde-speckit-hyde.md`
