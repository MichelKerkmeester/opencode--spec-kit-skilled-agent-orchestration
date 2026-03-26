---
title: "096 -- Provenance-rich response envelopes (P0-2)"
description: "This scenario validates Provenance-rich response envelopes (P0-2) for `096`. It focuses on Confirm includeTrace opt-in exposes scores/source/trace."
---

# 096 -- Provenance-rich response envelopes (P0-2)

## 1. OVERVIEW

This scenario validates Provenance-rich response envelopes (P0-2) for `096`. It focuses on Confirm includeTrace opt-in exposes scores/source/trace.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `096` and confirm the expected signals without contradicting evidence.

- Objective: Confirm includeTrace opt-in exposes scores/source/trace
- Prompt: `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior. Capture the evidence needed to prove Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields
- Pass/fail: PASS if trace objects present when opt-in or env-forced and absent otherwise

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 096 | Provenance-rich response envelopes (P0-2) | Confirm includeTrace opt-in exposes scores/source/trace | `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior. Capture the evidence needed to prove Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** ensure `SPECKIT_RESPONSE_TRACE` is unset or `false` before running the "absent" assertion (env var forces trace inclusion regardless of arg). 1) `memory_search({query:"test", includeTrace:true})` → verify `scores`, `source`, `trace` objects in response 2) `memory_search({query:"test"})` (no includeTrace, env unset) → verify these objects are absent 3) set `SPECKIT_RESPONSE_TRACE=true` and repeat without arg → verify trace objects appear due to env override 4) inspect score fields: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention | Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields | Search outputs with/without includeTrace + env override | PASS if trace objects present when opt-in or env-forced and absent otherwise | Check `handlers/memory-search.ts` for includeTrace and env branching |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/08-provenance-rich-response-envelopes.md](../../feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 096
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/096-provenance-rich-response-envelopes-p0-2.md`
