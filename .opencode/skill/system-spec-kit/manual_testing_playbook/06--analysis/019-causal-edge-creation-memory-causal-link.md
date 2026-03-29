---
title: "EX-019 -- Causal edge creation (memory_causal_link)"
description: "This scenario validates Causal edge creation (memory_causal_link) for `EX-019`. It focuses on Causal provenance linking."
---

# EX-019 -- Causal edge creation (memory_causal_link)

## 1. OVERVIEW

This scenario validates Causal edge creation (memory_causal_link) for `EX-019`. It focuses on Causal provenance linking plus exact-first batch reference resolution.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-019` and confirm the expected signals without contradicting evidence.

- Objective: Causal provenance linking plus exact-first batch reference resolution
- Prompt: `Validate causal edge creation. Capture the evidence needed to prove a direct supports edge appears in chain trace, auto-extracted causal-link references are resolved in batch, canonical_file_path/file_path exact equality is attempted before fuzzy LIKE fallback, and only unresolved references fall through to fuzzy matching. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Direct edge appears in chain trace; batched causal-link reference resolution succeeds for exact path matches first; fuzzy fallback is only used for unresolved references
- Pass/fail: PASS if the direct relation is visible in trace and the batch resolver proves exact canonical/file-path lookup wins before fuzzy fallback. FAIL if the trace is missing, references are resolved one-by-one without batching, or fuzzy matching is used before exact path equality.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-019 | Causal edge creation (memory_causal_link) | Causal provenance linking plus exact-first batch reference resolution | `Validate causal edge creation. Capture the evidence needed to prove a direct supports edge appears in chain trace, auto-extracted causal-link references are resolved in batch, canonical_file_path/file_path exact equality is attempted before fuzzy LIKE fallback, and only unresolved references fall through to fuzzy matching. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a direct edge with `memory_causal_link({ sourceId:"<memory-id-a>", targetId:"<memory-id-b>", relation:"supports", strength:0.8 })` 2) Confirm the edge is visible via `memory_drift_why({ memoryId:"<memory-id-b>", direction:"both", maxDepth:4 })` 3) Prepare or update a memory file containing multiple causal-link references, including exact canonical/file-path references and one fallback-only fuzzy reference, then run the indexing path that triggers `processCausalLinks()` 4) Capture processor logs, diagnostics, or test-harness evidence showing `resolveMemoryReferencesBatch()` resolves the reference set once, exact `canonical_file_path`/`file_path` equality is attempted before fuzzy `LIKE`, and only unresolved references fall through to the fuzzy pass 5) Verify the inserted auto-extracted edges appear in causal trace output or storage inspection | Direct edge appears in chain trace; batched causal-link reference resolution succeeds for exact path matches first; fuzzy fallback is only used for unresolved references | Link + trace outputs + indexing/processor diagnostics showing batched exact-first resolution + evidence of fallback only for unresolved references | PASS if the direct relation is visible in trace and the batch resolver proves exact canonical/file-path lookup wins before fuzzy fallback. FAIL if the trace is missing, references are resolved one-by-one without batching, or fuzzy matching is used before exact path equality. | Validate IDs and relation type -> normalize path references before indexing -> inspect `canonical_file_path` presence in `memory_index` -> confirm only unresolved references reach the fuzzy fallback stage |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [06--analysis/01-causal-edge-creation-memorycausallink.md](../../feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-019
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--analysis/019-causal-edge-creation-memory-causal-link.md`
