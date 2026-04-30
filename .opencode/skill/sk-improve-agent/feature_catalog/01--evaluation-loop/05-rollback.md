---
title: "Rollback"
description: "Restores the archived canonical target after a guarded improve-agent promotion."
---

# Rollback

## 1. OVERVIEW

Restores the archived canonical target after a guarded improve-agent promotion.

This feature covers the safety path that makes canonical mutation reversible once a promotion has already happened and later evidence shows the promoted file should be undone.

---

## 2. CURRENT REALITY

Rollback is implemented as a dedicated helper instead of an automatic side effect of promotion. `rollback-candidate.cjs` validates the requested target against the runtime config and the single canonical target named by the manifest, then copies the archived backup back onto the canonical file and returns a `rolled_back` result.

The rollback helper is deliberately narrow. It does not emit journal rows, re-run the scorer, or reconcile runtime mirrors by itself. Those follow-on checks live in the rollback runbook and surrounding orchestration, which keeps file restoration separate from audit logging and packaging review.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/rollback-candidate.cjs` | Rollback helper | Restores the archived backup after validating the runtime config and canonical manifest target. |
| `.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs` | Promotion helper | Creates the archived backup that rollback later restores. |
| `.opencode/skill/sk-improve-agent/references/rollback_runbook.md` | Runbook | Defines the operator steps around rollback and post-rollback proof. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/mirror_drift_policy.md` | Policy reference | Separates rollback from later mirror-review work. |
| `.opencode/skill/sk-improve-agent/references/promotion_rules.md` | Policy reference | Defines when rollback-ready evidence must exist before promotion proceeds. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/05-rollback.md`
