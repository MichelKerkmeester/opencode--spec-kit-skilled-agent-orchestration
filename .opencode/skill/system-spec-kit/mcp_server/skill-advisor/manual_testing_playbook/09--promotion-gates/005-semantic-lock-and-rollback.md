---
title: "PG-005 Semantic Lock and Atomic Rollback"
description: "Manual validation that semantic_shadow is locked at weight 0.00 until the first promotion wave and that rollback.ts reverts atomically on regression detection."
trigger_phrases:
  - "pg-005"
  - "semantic lock"
  - "promotion rollback"
  - "atomic rollback promotion"
---

# PG-005 Semantic Lock and Atomic Rollback

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/promotion/semantic-lock.ts` enforces `semantic_shadow.weight == 0.00` for live routing until the first promotion wave explicitly lifts the lock, and that `lib/promotion/rollback.ts` reverts atomically when a regression is detected post-promotion.

---

## 2. SETUP

- Repo root; MCP server built.
- Candidate set that tries to raise `semantic_shadow` above 0 pre-lock lift.
- Candidate set that passes all 7 gates and is then injected with a post-promotion regression for rollback testing.

---

## 3. STEPS

1. Attempt to stage a candidate with `semantic_shadow: 0.10` while the lock is active.
2. Confirm staging is rejected with a semantic-lock-violation reason.
3. Separately, promote a compliant candidate through two cycles.
4. After promotion, inject a regression (for example, mutate the corpus input to simulate accuracy drop) and trigger the rollback path.
5. Verify post-rollback state matches pre-promotion state.

---

## 4. EXPECTED

- Step 2 staging fails with an explicit semantic-lock message.
- Live `advisor_status.laneWeights.semantic_shadow` remains 0.00 throughout.
- Step 4 rollback reverts `laneWeights` atomically; no partial state is observable to readers.
- Post-rollback accuracy and behavior match pre-promotion capture.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Semantic weight raised | `semantic_shadow.weight > 0` in live envelope | Block release; semantic lock must hold. |
| Rollback leaves partial state | Some lane reverted, others not | Block release; rollback must be atomic. |
| Rollback masks root cause | Regression undetected but rollback fired anyway | Audit regression-detection wiring. |

---

## 6. RELATED

- Scenario [PG-003](./003-gate-bundle-safety.md) — gate bundle.
- Scenario [LC-005](../07--lifecycle-routing/005-rollback-lifecycle.md) — lifecycle rollback.
- Feature [`05--promotion-gates/05-semantic-lock.md`](../../feature_catalog/05--promotion-gates/05-semantic-lock.md) and [`05--promotion-gates/06-rollback.md`](../../feature_catalog/05--promotion-gates/06-rollback.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts` and `lib/promotion/rollback.ts`.
