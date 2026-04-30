---
title: "Severity classification"
description: "Assigns P0 or P1 or P2 meaning and severity weight to each review finding."
---

# Severity classification

## 1. OVERVIEW

Assigns P0 or P1 or P2 meaning and severity weight to each review finding.

The severity system converts raw review observations into blocker, required, or suggestion findings. Those levels control convergence math, verdict routing, and whether a finding can block release.

## 2. CURRENT REALITY

The live contract uses three severity levels with fixed weights: `P0 = 10.0`, `P1 = 5.0`, `P2 = 1.0`. All severities require concrete file-line evidence. The loop uses those weights to compute `newFindingsRatio`, including half-weight refinements, and applies the P0 override so any newly discovered blocker raises the ratio to at least `0.50`.

The semantic meaning of each level is stable across the skill. P0 covers correctness failures, security vulnerabilities, and hard contradictions. P1 covers degraded behavior, incomplete implementation, or missing validation. P2 covers advisory items such as clarity gaps, naming issues, or documentation cleanup.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Summarizes P0, P1, and P2 criteria and blocking behavior. |
| `references/convergence.md` | Protocol | Defines severity weights, weighted ratio math, and the P0 override rule. |
| `references/state_format.md` | Schema | Defines severity weights, iteration finding sections, and finding-registry severity fields. |
| `assets/review_mode_contract.yaml` | Contract | Declares the stable severity taxonomy and per-level weights. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md` | Manual scenario | Verifies severities and counts are recorded correctly in iteration state. |
| `manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md` | Manual scenario | Confirms the blocker override path in convergence logic. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/01-severity-classification.md`
- Primary sources: `SKILL.md`, `references/convergence.md`, `references/state_format.md`, `assets/review_mode_contract.yaml`
