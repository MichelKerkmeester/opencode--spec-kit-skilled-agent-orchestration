---
title: "PG-002 Weight Delta Cap (max 0.05 per promotion)"
description: "Manual validation that lib/promotion/weight-delta-cap.ts rejects promotion candidates whose lane weight change exceeds 0.05 per promotion cycle."
trigger_phrases:
  - "pg-002"
  - "weight delta cap"
  - "max delta 0.05"
  - "promotion cap"
---

# PG-002 Weight Delta Cap (max 0.05 per promotion)

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/promotion/weight-delta-cap.ts` blocks promotion when any single lane weight change exceeds 0.05 between the current live set and the candidate set.

---

## 2. SETUP

- Repo root; MCP server built.
- Two candidate weight sets: one with max delta <= 0.05, one with a lane delta > 0.05 (for example lexical 0.30 → 0.40).

---

## 3. STEPS

1. Stage the compliant candidate set and run promotion validation.
2. Stage the over-cap candidate set and run promotion validation.
3. Record outcome of each validation step.
4. Call `advisor_status` after both runs and confirm live weights are unchanged.

---

## 4. EXPECTED

- Compliant candidate passes the delta cap check (still subject to remaining gates).
- Over-cap candidate is rejected with an explicit cap violation reason.
- Live weights remain unchanged in both cases.
- Cap check runs before the 7-gate bundle so a rejected candidate does not consume downstream resources.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Over-cap candidate accepted | Validation reports pass despite delta > 0.05 | Block release; audit cap enforcement. |
| Compliant candidate rejected | Valid delta blocked | Check cap threshold constant. |
| Live weights mutate on reject | Post-reject weights differ | Audit side-effect isolation. |

---

## 6. RELATED

- Scenario [PG-003](./003-gate-bundle-safety.md) — full 7-gate bundle.
- Scenario [PG-004](./004-two-cycle-requirement.md) — two consecutive passing cycles.
- Feature [`05--promotion-gates/02-weight-delta-cap.md`](../../feature_catalog/05--promotion-gates/02-weight-delta-cap.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/weight-delta-cap.ts`.
