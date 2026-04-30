---
title: "Promotion gates"
description: "Applies the narrow policy and helper checks that decide whether canonical promotion is even allowed."
---

# Promotion gates

## 1. OVERVIEW

Applies the narrow policy and helper checks that decide whether canonical promotion is even allowed.

This feature covers the point where an interesting candidate stops being only a proposal and starts needing proof that a canonical edit is safe, reversible, and within the manifest boundary.

---

## 2. CURRENT REALITY

The policy surface is explicit about promotion being narrower than scoring. `promotion_rules.md`, `loop_protocol.md`, and the runtime charter all require explicit approval, benchmark evidence, repeatability, manifest compliance, and a rollback path before canonical mutation can happen.

The helper that enforces those rules is stricter than the current dynamic scorer output. `promote-candidate.cjs` still refuses promotion unless the score file says `candidate-better` and includes a `delta` that clears `scoring.thresholdDelta`, but `score-candidate.cjs` currently emits `candidate-acceptable` or `needs-improvement` and does not add a delta field. The promotion gate is therefore shipped, but it is not satisfied by an untouched dynamic score file from the current scorer alone.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/promotion_rules.md` | Policy reference | Defines the keep, reject, tie-break, and promotion-prerequisite rules. |
| `.opencode/skill/sk-improve-agent/references/loop_protocol.md` | Workflow reference | Places promotion after score, benchmark, and reduction stages. |
| `.opencode/skill/sk-improve-agent/assets/improvement_charter.md` | Runtime policy | Freezes legal-stop gates and approval rules inside the copied runtime control bundle. |
| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Runtime config | Supplies `proposalOnly`, `promotionEnabled`, and `scoring.thresholdDelta` checks consumed by the helper. |
| `.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs` | Promotion helper | Validates score, benchmark, repeatability, runtime config, manifest target, and approval before copying a candidate into the canonical target. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/evaluator_contract.md` | Contract reference | Documents the current scorer output shape and recommendation labels. |
| `.opencode/skill/sk-improve-agent/references/no_go_conditions.md` | Safety reference | Defines the conditions that should block expansion or promotion. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/04-promotion-gates.md`
