---
title: "Claim adjudication"
description: "Turns new P0 and P1 findings into typed, review-visible claims with evidence and downgrade rules."
---

# Claim adjudication

## 1. OVERVIEW

Turns new P0 and P1 findings into typed, review-visible claims with evidence and downgrade rules.

Claim adjudication is the typed review packet that stops severe findings from floating through the loop as unstructured prose. It records what the finding claims, what evidence supports it, what counterevidence was sought, and whether the severity should stand.

## 2. CURRENT REALITY

Every new P0 or P1 must carry a typed packet embedded in the iteration file. Required fields include the finding ID, the single claim, evidence refs, counterevidence search, alternative explanation, final severity, confidence, downgrade trigger, and transition history when severity changes. The orchestrator parses this packet after evaluation and writes a `claim_adjudication` event into `deep-review-state.jsonl`.

Missing packets or missing required fields fail the adjudication step and trip `claimAdjudicationGate` on the next stop check. That means STOP can be vetoed even when the rest of the convergence math passes. Downgraded findings update the accepted final severity while preserving the original finding trail for the audit appendix.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/loop_protocol.md` | Protocol | Defines the claim-adjudication step, required packet fields, and stop-veto behavior. |
| `references/state_format.md` | Schema | Defines the typed packet schema, required fields, validation rules, and severity transitions. |
| `references/convergence.md` | Protocol | Includes `claimAdjudicationGate` in blocked-stop event payloads and legal-stop evaluation. |
| `assets/review_mode_contract.yaml` | Contract | Declares the claim-adjudication gate as part of the persisted gate-result bundle. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md` | Manual scenario | Covers the severe-finding validation path that precedes adjudication. |
| `manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` | Manual scenario | Verifies failed stop attempts surface through blocked-stop state. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md` | Manual scenario | Verifies adjudicated severities survive into synthesis and registry output. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/03-claim-adjudication.md`
- Primary sources: `references/loop_protocol.md`, `references/state_format.md`, `references/convergence.md`, `assets/review_mode_contract.yaml`
