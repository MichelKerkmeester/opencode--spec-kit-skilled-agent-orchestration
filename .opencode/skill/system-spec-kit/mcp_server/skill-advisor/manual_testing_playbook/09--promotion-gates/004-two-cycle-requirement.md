---
title: "PG-004 Two Consecutive Passing Cycles"
description: "Manual validation that lib/promotion/two-cycle-requirement.ts blocks promotion unless two consecutive shadow cycles pass the gate bundle."
trigger_phrases:
  - "pg-004"
  - "two cycle requirement"
  - "consecutive passing cycles"
  - "promotion durability"
---

# PG-004 Two Consecutive Passing Cycles

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/promotion/two-cycle-requirement.ts` blocks promotion after a single passing cycle and only advances promotion after two consecutive passing shadow cycles. Intervening failures reset the counter.

---

## 2. SETUP

- Repo root; MCP server built.
- Candidate weight set known to pass the gate bundle.
- Shadow-cycle harness available.

---

## 3. STEPS

1. Run shadow cycle 1 with candidate weights; capture pass status.
2. Attempt promotion and confirm it is blocked with a "second cycle required" reason.
3. Run shadow cycle 2 with the same candidate.
4. Attempt promotion again.
5. As a negative test, run cycle 3 with modified weights that fail; confirm cycle counter resets.

---

## 4. EXPECTED

- After cycle 1 only, promotion is blocked.
- After cycle 2 (identical candidate passes), promotion may advance.
- A failure in any subsequent cycle resets the consecutive-pass counter to 0.
- Cycle counter state is persisted between cycles and readable via the promotion telemetry surface.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Promotion after one cycle | Promotion advances after a single pass | Block release; two-cycle gate bypassed. |
| Counter never increments | Cycle 2 still reports "second cycle required" | Audit counter persistence. |
| Failure does not reset counter | A failed cycle still lets promotion advance | Audit reset logic. |

---

## 6. RELATED

- Scenario [PG-003](./003-gate-bundle-safety.md) — gate bundle.
- Scenario [PG-005](./005-semantic-lock-and-rollback.md) — semantic lock and rollback.
- Feature [`05--promotion-gates/04-two-cycle.md`](../../feature_catalog/05--promotion-gates/04-two-cycle.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`.
