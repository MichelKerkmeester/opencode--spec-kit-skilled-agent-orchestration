---
title: Rollback Runbook
description: Rollback and post-promotion verification procedure for bounded agent-improver promotions.
---

# Rollback Runbook

Operational runbook for the controlled promotion and rollback path. Use it when the evaluator gates have already passed and the next question is how to mutate and restore the canonical target safely.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Explains the operator steps for guarded promotion, rollback, and post-rollback verification.

### When to Use

Use this reference when:
- a candidate is promotion-eligible
- you need a safe rollback path before mutating the canonical target
- you need to record post-promotion or post-rollback proof

### Core Principle

Rollback is part of the promotion contract. If a promotion cannot be reversed quickly and proven, it is not safe enough to run.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:promotion-preconditions -->
## 2. PROMOTION PRECONDITIONS

- candidate score file exists
- recommendation is `candidate-better`
- delta meets threshold
- operator explicitly approves promotion
- backup path is recorded before mutation

---

<!-- /ANCHOR:promotion-preconditions -->
<!-- ANCHOR:promotion-steps -->
## 3. PROMOTION STEPS

1. Archive the current canonical target
2. Copy the accepted candidate into the canonical target
3. Re-run the scorer against the promoted target if needed
4. Run any packet verification tied to the target surface

---

<!-- /ANCHOR:promotion-steps -->
<!-- ANCHOR:rollback-steps -->
## 4. ROLLBACK STEPS

1. Restore the archived pre-promotion file to the canonical target
2. Verify the target parses cleanly
3. Record the rollback in the packet evidence

---

<!-- /ANCHOR:rollback-steps -->
<!-- ANCHOR:post-verification -->
## 5. POST-PROMOTION VERIFICATION

- `git diff -- <target>` shows only the intended canonical target edits when the worktree is otherwise clean
- packet validation still passes
- derived runtime surfaces are either synchronized or captured in drift-review evidence
- direct comparison to the archived backup proves the rollback restored the pre-promotion file

### Dimensional Score Preservation

After rollback, re-run `score-candidate.cjs --dynamic` against the restored target to confirm dimensional scores return to baseline levels. Record the post-rollback dimensional snapshot in the ledger for audit trail continuity.

---

<!-- /ANCHOR:post-verification -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

- `promotion_rules.md`
- `mirror_drift_policy.md`
- `../scripts/promote-candidate.cjs`
- `../scripts/rollback-candidate.cjs`

<!-- /ANCHOR:related-resources -->
