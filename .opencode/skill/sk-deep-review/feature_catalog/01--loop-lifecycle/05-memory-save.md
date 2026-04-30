---
title: "Memory save"
description: "Preserves the completed review packet for future recovery without making it part of the verdict path."
---

# Memory save

## 1. OVERVIEW

Preserves the completed review packet for future recovery without making it part of the verdict path.

This is the final lifecycle phase after synthesis. It hands the completed review context to the continuity system while keeping the on-disk review packet authoritative if the save step fails.

## 2. CURRENT REALITY

The save step is intentionally narrow. It runs `generate-context.js` at the spec-folder boundary after the review report has already been written, and the skill treats that script as the supported continuity handoff. The save step is not allowed to rewrite the review conclusions or downgrade the packet if continuity persistence has trouble.

If the save step fails, the current `review/` packet remains the ground truth. The report, JSONL log, strategy, registry, and iteration files stay intact for resume or manual follow-up, so the failure is a continuity problem rather than a review-integrity problem.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/loop_protocol.md` | Protocol | Defines the save phase, supported script boundary, and failure behavior. |
| `SKILL.md` | Skill contract | Requires `generate-context.js` for continuity saves and marks save as a post-loop phase. |
| `assets/review_mode_contract.yaml` | Contract | Supplies the canonical packet outputs that must remain intact regardless of save result. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md` | Manual scenario | Verifies post-synthesis continuity save behavior and guardrails. |
| `manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Acts as the top-level validation package for the save-and-guardrails category. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/05-memory-save.md`
- Primary sources: `references/loop_protocol.md`, `SKILL.md`, `assets/review_mode_contract.yaml`
