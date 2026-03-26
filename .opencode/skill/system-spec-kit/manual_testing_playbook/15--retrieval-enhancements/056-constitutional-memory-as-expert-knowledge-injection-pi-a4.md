---
title: "056 -- Constitutional memory as expert knowledge injection (PI-A4)"
description: "This scenario validates Constitutional memory as expert knowledge injection (PI-A4) for `056`. It focuses on Confirm directive enrichment."
---

# 056 -- Constitutional memory as expert knowledge injection (PI-A4)

## 1. OVERVIEW

This scenario validates Constitutional memory as expert knowledge injection (PI-A4) for `056`. It focuses on Confirm directive enrichment.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `056` and confirm the expected signals without contradicting evidence.

- Objective: Confirm directive enrichment
- Prompt: `Verify constitutional memory directive injection (PI-A4). Capture the evidence needed to prove Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated
- Pass/fail: PASS if constitutional directives are injected into retrieval results with correct metadata and tier

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 056 | Constitutional memory as expert knowledge injection (PI-A4) | Confirm directive enrichment | `Verify constitutional memory directive injection (PI-A4). Capture the evidence needed to prove Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise user-facing pass/fail verdict with the main reason.` | 1) save constitutional directive 2) run retrieval 3) inspect directive metadata | Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated | Save output + retrieval output showing directive metadata + tier classification evidence | PASS if constitutional directives are injected into retrieval results with correct metadata and tier | Verify constitutional/ directory contains valid directives; check tier classification logic; inspect enrichment pipeline for directive handling |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md](../../feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 056
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/056-constitutional-memory-as-expert-knowledge-injection-pi-a4.md`
