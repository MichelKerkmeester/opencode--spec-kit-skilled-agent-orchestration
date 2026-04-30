---
title: "056 -- Constitutional memory as expert knowledge injection (PI-A4)"
description: "This scenario validates Constitutional memory as expert knowledge injection (PI-A4) for `056`. It focuses on Confirm directive enrichment."
audited_post_018: true
---

# 056 -- Constitutional memory as expert knowledge injection (PI-A4)

## 1. OVERVIEW

This scenario validates Constitutional memory as expert knowledge injection (PI-A4) for `056`. It focuses on Confirm directive enrichment.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm directive enrichment.
- Real user request: `Please validate Constitutional memory as expert knowledge injection (PI-A4) against the documented validation surface and tell me whether the expected signals are present: Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Constitutional memory as expert knowledge injection (PI-A4) against the documented validation surface. Verify directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if constitutional directives are injected into retrieval results with correct metadata and tier

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, confirm directive enrichment against the documented validation surface. Verify directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. save constitutional directive
2. run retrieval
3. inspect directive metadata

### Expected

Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated

### Evidence

Save output + retrieval output showing directive metadata + tier classification evidence

### Pass / Fail

- **Pass**: constitutional directives are injected into retrieval results with correct metadata and tier
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify constitutional/ directory contains valid directives; check tier classification logic; inspect enrichment pipeline for directive handling

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md](../../feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 056
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/056-constitutional-memory-as-expert-knowledge-injection-pi-a4.md`
