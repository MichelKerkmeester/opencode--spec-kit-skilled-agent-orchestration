---
title: "Adversarial self-check"
description: "Re-reads blocker evidence before a P0 can become a confirmed review conclusion."
---

# Adversarial self-check

## 1. OVERVIEW

Re-reads blocker evidence before a P0 can become a confirmed review conclusion.

This control keeps the review loop from overcalling blockers. Before a P0 is treated as real enough to shape the verdict, the workflow requires a deliberate re-check of the cited evidence.

## 2. CURRENT REALITY

The skill contract requires an adversarial self-check on every P0 finding. The guidance is simple but strict: re-read the cited code, actively try to disprove the blocker, and only keep the P0 label when the evidence still holds. This guard appears both in the loop rules and in the success criteria for final review completion.

The adversarial re-check is separate from the typed claim-adjudication packet. Self-check focuses on whether the blocker is genuine at all, while adjudication records the evidence trail and the final accepted severity. Together they keep FAIL verdicts from depending on inference-only or weakly supported blockers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Requires adversarial self-check on P0 findings in both the loop rules and success criteria. |
| `references/loop_protocol.md` | Protocol | Places blocker re-read and severity confirmation in the post-iteration evaluation flow. |
| `references/convergence.md` | Protocol | Treats unresolved active P0 findings as a legal-stop blocker and verdict driver. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md` | Manual scenario | Verifies the blocker re-check path is executed. |
| `manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md` | Manual scenario | Confirms confirmed P0 findings still block stop after the self-check path. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/02-adversarial-self-check.md`
- Primary sources: `SKILL.md`, `references/loop_protocol.md`, `references/convergence.md`
