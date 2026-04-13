---
title: "Synthesis"
description: "Compiles iteration output into the final review report, verdict, and terminal state."
---

# Synthesis

## 1. OVERVIEW

Compiles iteration output into the final review report, verdict, and terminal state.

This phase converts the accumulated review packet into a final deliverable. It consolidates findings, replays the stop decision from stored state, writes the nine-section review report, and marks the packet complete.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 2. CURRENT REALITY

Synthesis reads all iteration files, groups duplicate findings by file and root cause, keeps the highest adjudicated severity, and preserves the audit trail back to contributing iterations. It then replays convergence from `deep-review-state.jsonl`, including the coverage vote, traceability status, and gate outcomes, before building `review-report.md`.

The final report follows a fixed nine-section contract covering the executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. Verdict routing is fixed as FAIL or CONDITIONAL to `/spec_kit:plan`, or PASS to `/create:changelog`, with `hasAdvisories=true` when only P2 remains.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/loop_protocol.md` | Protocol | Defines synthesis deduplication, replay validation, review-report generation, verdict determination, and final JSONL emission. |
| `references/state_format.md` | Schema | Defines the nine report sections, synthesis event payload, and active-finding registry expectations. |
| `references/convergence.md` | Protocol | Defines the provisional verdict contract and convergence report content reused at synthesis time. |
| `assets/review_mode_contract.yaml` | Contract | Declares the report sections, verdict conditions, and next-command routing. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md` | Manual scenario | Verifies the report structure and synthesis output. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md` | Manual scenario | Confirms verdict routing after synthesis. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md` | Manual scenario | Exercises synthesis-time deduplication and registry alignment. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/04-synthesis.md`
- Primary sources: `references/loop_protocol.md`, `references/state_format.md`, `references/convergence.md`, `assets/review_mode_contract.yaml`
