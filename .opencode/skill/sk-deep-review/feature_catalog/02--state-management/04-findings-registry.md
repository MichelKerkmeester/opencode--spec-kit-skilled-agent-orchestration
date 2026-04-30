---
title: "Findings registry"
description: "Holds the reducer-owned view of active, resolved, repeated, and blocked findings."
---

# Findings registry

## 1. OVERVIEW

Holds the reducer-owned view of active, resolved, repeated, and blocked findings.

`deep-review-findings-registry.json` is the reduced state surface for the loop. It condenses raw iteration history into the totals and lists that convergence, dashboards, and synthesis read directly.

## 2. CURRENT REALITY

The findings registry is machine-owned and regenerated after every iteration and lifecycle transition. It stores open and resolved findings, dimension coverage, severity totals, open and resolved counts, convergence score, blocked-stop history, graph convergence fields, repeated or severity-changed findings, and corruption warnings.

The reducer contract is fail-closed by default. Malformed JSONL or missing machine-owned strategy anchors are treated as reducer failures unless an explicit escape hatch is used. That makes the registry both a summary artifact and a guardrail surface that can stop the loop from trusting broken packet state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/state_format.md` | Schema | Defines the registry schema, blocked-stop history, graph fields, and fail-closed semantics. |
| `references/loop_protocol.md` | Protocol | Defines reducer refresh inputs, outputs, and metrics consumed during the loop. |
| `SKILL.md` | Skill contract | Declares canonical reducer inputs, outputs, and metric names. |
| `assets/review_mode_contract.yaml` | Contract | Declares reducer IO and output surfaces that stay aligned with the registry. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` | Manual scenario | Verifies blocked-stop history reaches reducer-owned state. |
| `manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md` | Manual scenario | Exercises fail-closed reducer behavior. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md` | Manual scenario | Verifies registry alignment with synthesis-time deduplication. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/04-findings-registry.md`
- Primary sources: `references/state_format.md`, `references/loop_protocol.md`, `SKILL.md`, `assets/review_mode_contract.yaml`
