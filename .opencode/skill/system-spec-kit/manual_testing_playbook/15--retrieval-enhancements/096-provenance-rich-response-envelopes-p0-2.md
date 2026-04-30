---
title: "096 -- Provenance-rich response envelopes (P0-2)"
description: "This scenario validates Provenance-rich response envelopes (P0-2) for `096`. It focuses on Confirm includeTrace opt-in exposes scores/source/trace."
audited_post_018: true
---

# 096 -- Provenance-rich response envelopes (P0-2)

## 1. OVERVIEW

This scenario validates Provenance-rich response envelopes (P0-2) for `096`. It focuses on Confirm includeTrace opt-in exposes scores/source/trace.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm includeTrace opt-in exposes scores/source/trace.
- Real user request: `Please validate Provenance-rich response envelopes (P0-2) against SPECKIT_RESPONSE_TRACE and tell me whether the expected signals are present: Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Provenance-rich response envelopes (P0-2) against SPECKIT_RESPONSE_TRACE. Verify trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if trace objects present when opt-in or env-forced and absent otherwise

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, confirm includeTrace opt-in exposes scores/source/trace against SPECKIT_RESPONSE_TRACE. Verify trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. **Precondition:** ensure `SPECKIT_RESPONSE_TRACE` is unset or `false` before running the "absent" assertion (env var forces trace inclusion regardless of arg).
2. `memory_search({query:"test", includeTrace:true})` → verify `scores`, `source`, `trace` objects in response
3. `memory_search({query:"test"})` (no includeTrace, env unset) → verify these objects are absent
4. set `SPECKIT_RESPONSE_TRACE=true` and repeat without arg → verify trace objects appear due to env override
5. inspect score fields: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention

### Expected

Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields

### Evidence

Search outputs with/without includeTrace + env override

### Pass / Fail

- **Pass**: trace objects present when opt-in or env-forced and absent otherwise
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `handlers/memory-search.ts` for includeTrace and env branching

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/08-provenance-rich-response-envelopes.md](../../feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 096
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/096-provenance-rich-response-envelopes-p0-2.md`
