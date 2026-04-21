---
title: "Seven-Gate Promotion Bundle"
description: "Seven-gate promotion bundle covering full-corpus accuracy, holdout accuracy, gold-none no-increase, safety, latency, exact parity, and regression suite."
trigger_phrases:
  - "seven gate bundle"
  - "gate bundle promotion"
  - "promotion gates"
  - "release gate bundle"
---

# Seven-Gate Promotion Bundle

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Enforce a release-readiness gate that covers quality, safety, performance, parity, and regression risk in one bundle. A single red gate blocks promotion.

---

## 2. CURRENT REALITY

`lib/promotion/gate-bundle.ts` evaluates seven gates per cycle:

| Gate | Threshold |
| --- | --- |
| Full-corpus top-1 | >= 75% |
| Holdout top-1 | >= 72.5% |
| Gold-none | UNKNOWN count must not increase |
| Safety slice | Adversarial + sanitization pass |
| Latency slice | Cache-hit p95 <= 50 ms, uncached p95 <= 60 ms |
| Exact parity | Zero regressions on Python-correct prompts |
| Regression suite | `skill_advisor_regression.py` passes 52/52 |

All gates are evaluated even when earlier ones fail, so the operator sees a complete picture per cycle.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`.
- Playbook scenario [PG-003](../../manual_testing_playbook/09--promotion-gates/003-gate-bundle-safety.md).

---

## 5. RELATED

- [02-weight-delta-cap.md](./02-weight-delta-cap.md).
- [04-two-cycle.md](./04-two-cycle.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
