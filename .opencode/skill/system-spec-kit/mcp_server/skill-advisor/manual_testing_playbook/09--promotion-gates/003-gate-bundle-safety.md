---
title: "PG-003 Seven-Gate Bundle"
description: "Manual validation that lib/promotion/gate-bundle.ts evaluates the 7 gates (full corpus accuracy, holdout accuracy, gold-none no-increase, safety, latency, exact parity, regression suite) and blocks promotion on any failure."
trigger_phrases:
  - "pg-003"
  - "seven gate bundle"
  - "promotion gates"
  - "gate bundle safety"
---

# PG-003 Seven-Gate Bundle

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/promotion/gate-bundle.ts` runs all seven gates, each with its published threshold, and fails promotion on any one gate failure without short-circuiting silent ones. The gates are: full corpus top-1 >= 75%, holdout top-1 >= 72.5%, gold-none no-increase, safety slice, latency slice, exact parity with Python where applicable, and the regression suite.

---

## 2. SETUP

- Repo root; MCP server built.
- Three candidate weight sets: baseline (passes), one that fails latency, one that fails safety.

---

## 3. STEPS

1. Run the gate bundle against the baseline candidate.
2. Run against the latency-failing candidate.
3. Run against the safety-failing candidate.
4. For each run, capture per-gate pass/fail summary and the final bundle verdict.

---

## 4. EXPECTED

- Baseline candidate: all 7 gates pass; bundle verdict PASS.
- Latency-failing candidate: latency gate reports FAIL; bundle verdict FAIL; other gate results still reported.
- Safety-failing candidate: safety gate reports FAIL; bundle verdict FAIL; other gate results still reported.
- Gate thresholds in output match the documented thresholds (75%, 72.5%, no-increase on gold-none, safety green, latency green, exact parity, regression green).

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing gate in report | Only 6 gates evaluated | Audit gate bundle config. |
| False pass on failing candidate | Bundle reports PASS when a gate is red | Block release. |
| Short-circuit hides failures | Later gates show "skipped" | Require full evaluation for observability. |

---

## 6. RELATED

- Scenario [PG-002](./002-weight-delta-cap.md) — pre-bundle delta cap.
- Scenario [PG-004](./004-two-cycle-requirement.md) — two-cycle requirement.
- Feature [`05--promotion-gates/03-gate-bundle.md`](../../feature_catalog/05--promotion-gates/03-gate-bundle.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`.
