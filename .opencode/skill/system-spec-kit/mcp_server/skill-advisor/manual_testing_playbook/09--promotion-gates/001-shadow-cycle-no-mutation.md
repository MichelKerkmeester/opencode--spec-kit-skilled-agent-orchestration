---
title: "PG-001 Shadow Cycle No-Mutation"
description: "Manual validation that lib/promotion/shadow-cycle.ts replays the corpus through candidate weights with no effect on live routing state."
trigger_phrases:
  - "pg-001"
  - "shadow cycle"
  - "no mutation"
  - "candidate weights replay"
---

# PG-001 Shadow Cycle No-Mutation

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/promotion/shadow-cycle.ts` replays the corpus through candidate lane weights without mutating live routing state, live weights, cache, or diagnostics.

---

## 2. SETUP

- Repo root; MCP server built.
- A candidate weight set distinct from the canonical set (for example lexical +0.03, derived +0.02, graph_causal -0.05).
- Access to the shadow-cycle internal harness via test runner or MCP admin surface.

---

## 3. STEPS

1. Capture live status including `laneWeights`, `generation`, `lastScanAt`:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Run a shadow cycle with the candidate weights.
3. After the cycle completes, capture status again.
4. Run `advisor_recommend` for a baseline prompt and compare output to a recorded pre-cycle response.

---

## 4. EXPECTED

- Post-cycle `laneWeights` identical to pre-cycle values (no mutation of live weights).
- `generation` advances only if unrelated reindex occurred; shadow cycle alone does not bump generation.
- Baseline `advisor_recommend` responses identical pre and post.
- Shadow-cycle metrics (accuracy against candidate weights) are emitted separately and do not affect live cache.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Live weights changed | `laneWeights` differ | Block release; shadow cycle must be side-effect-free. |
| Cache poisoned | Baseline response differs after cycle | Audit `shadow-cycle.ts` cache isolation. |
| Shadow metrics leak into live | Live metric dashboard shows shadow counts | Separate observability streams. |

---

## 6. RELATED

- Scenario [PG-002](./002-weight-delta-cap.md) — weight delta cap.
- Scenario [SC-005](../08--scorer-fusion/005-ablation.md) — ablation comparison.
- Feature [`05--promotion-gates/01-shadow-cycle.md`](../../feature_catalog/05--promotion-gates/01-shadow-cycle.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts`.
