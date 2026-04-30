---
title: "Security"
description: "Audits trust boundaries, exploit paths, and exposure risk."
---

# Security

## 1. OVERVIEW

Audits trust boundaries, exploit paths, and exposure risk.

Security is the second review dimension. It examines whether the target exposes vulnerabilities through input handling, authn or authz drift, secrets leakage, or other attacker-controlled paths.

## 2. CURRENT REALITY

The review contract ranks security second, immediately after correctness, and marks it as required for severity coverage. Its checks explicitly cover trust boundaries, authentication and authorization behavior, input handling, secrets exposure, and exploit paths.

Because security findings can escalate to P0, this dimension sits near the front of the loop and participates in both the core coverage model and the claim-adjudication path. A confirmed security blocker can keep the loop in `release-blocking` state and prevent PASS even when the rest of the review is clean.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/review_mode_contract.yaml` | Contract | Declares security as dimension `2`, defines its checks, and marks it as required for severity coverage. |
| `SKILL.md` | Skill contract | Lists security in the live four-dimension model and ties it to vulnerability review. |
| `references/loop_protocol.md` | Protocol | Orders security second and includes it in required convergence coverage. |
| `assets/deep_review_strategy.md` | Template | Seeds the strategy checklist with the security dimension. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--initialization-and-state-setup/007-scope-discovery-and-dimension-ordering.md` | Manual scenario | Verifies security stays in the default second position. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md` | Manual scenario | Exercises blocker validation on high-severity findings, including security blockers. |
| `manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md` | Manual scenario | Confirms critical findings, often security-driven, block early stop. |

---

## 4. SOURCE METADATA

- Group: Review dimensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--review-dimensions/02-security.md`
- Primary sources: `assets/review_mode_contract.yaml`, `SKILL.md`, `references/loop_protocol.md`, `assets/deep_review_strategy.md`
