---
title: "Traceability"
description: "Audits whether claims and linked artifacts line up with shipped behavior."
---

# Traceability

## 1. OVERVIEW

Audits whether claims and linked artifacts line up with shipped behavior.

Traceability is the review dimension that checks alignment across docs, specs, catalogs, playbooks, and code. It is where the review loop executes the protocol-based evidence checks that prove whether claims about the system are actually supported.

## 2. CURRENT REALITY

The review contract ranks traceability third. Its checks cover spec alignment, completion evidence, and cross-reference integrity across linked artifacts. During traceability-focused iterations, the loop can execute core protocols such as `spec_code` and `checklist_evidence`, then add overlay checks like `skill_agent`, `feature_catalog_code`, and `playbook_capability` when the target type makes them applicable.

Traceability is not marked `requiredForSeverityCoverage` in the contract, but it is still required for full review coverage and for a legal clean stop. Its protocol results feed the strategy's cross-reference table, JSONL `traceabilityChecks`, the final report's traceability section, and the stop decision's coverage gate.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/review_mode_contract.yaml` | Contract | Declares traceability checks and the core and overlay cross-reference protocols. |
| `references/loop_protocol.md` | Protocol | Defines protocol execution during traceability iterations and required protocol coverage in convergence. |
| `references/state_format.md` | Schema | Defines `traceabilityChecks`, protocol status summaries, and report surfaces for traceability output. |
| `assets/deep_review_strategy.md` | Template | Provides the `cross-reference-status` table maintained during traceability work. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md` | Manual scenario | Exercises protocol execution and misalignment reporting. |
| `manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md` | Manual scenario | Verifies required protocol coverage participates in the stop vote. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md` | Manual scenario | Confirms traceability status is preserved in the final report. |

---

## 4. SOURCE METADATA

- Group: Review dimensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--review-dimensions/03-traceability.md`
- Primary sources: `assets/review_mode_contract.yaml`, `references/loop_protocol.md`, `references/state_format.md`, `assets/deep_review_strategy.md`
