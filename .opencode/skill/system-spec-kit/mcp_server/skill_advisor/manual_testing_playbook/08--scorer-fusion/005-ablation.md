---
title: "SC-005 Lane-by-Lane Ablation Protocol"
description: "Manual validation that lib/scorer/ablation.ts supports lane-by-lane disable so operators can measure each lane's contribution without mutating the live weights."
trigger_phrases:
  - "sc-005"
  - "ablation protocol"
  - "lane ablation"
  - "scorer ablation"
---

# SC-005 Lane-by-Lane Ablation Protocol

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/scorer/ablation.ts` supports ablation protocols where each lane can be disabled in isolation to measure contribution, and that ablation runs do not mutate the live weights or persist across calls.

---

## 2. SETUP

- Repo root; MCP server built.
- `advisor_validate` exposes ablation slices or direct ablation entry is available via internal harness.
- Capture the canonical full-corpus baseline (80.5%).

---

## 3. STEPS

1. Capture baseline:

```text
advisor_validate({"skillSlug":null})
```

2. Inspect the ablation slice in the response (or run ablation harness).
3. For each lane ablated to 0 weight in turn, record the resulting accuracy on the corpus.
4. After ablation, call `advisor_status` and confirm live `laneWeights` are unchanged.

---

## 4. EXPECTED

- Baseline accuracy matches the documented baseline (within noise).
- Disabling any non-zero lane degrades accuracy by a measurable amount.
- Disabling `semantic_shadow` (already weight 0) has no effect on live scoring.
- Post-ablation `laneWeights` equal pre-ablation values (ablation does not mutate live configuration).

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Ablation mutates live weights | `advisor_status` differs post-run | Block release; ablation must be side-effect-free. |
| Ablation numbers match baseline exactly | Disabling a lane has no effect | Inspect `ablation.ts` weight override wiring. |
| Ablation crashes | Runtime exception | Treat as HALT and audit ablation path. |

---

## 6. RELATED

- Scenario [SC-001](./001-five-lane-fusion.md) — fusion baseline.
- Feature [`04--scorer-fusion/05-ablation.md`](../../feature_catalog/04--scorer-fusion/05-ablation.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ablation.ts`.
