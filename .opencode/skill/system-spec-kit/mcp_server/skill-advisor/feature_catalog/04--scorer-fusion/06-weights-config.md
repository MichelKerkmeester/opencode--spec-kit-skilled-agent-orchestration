---
title: "Lane Weights Configuration"
description: "Centralized weight configuration that exposes canonical lane weights and gates any proposed mutation through the promotion pipeline."
trigger_phrases:
  - "lane weights config"
  - "weights-config.ts"
  - "canonical weights"
  - "lane weight source of truth"
---

# Lane Weights Configuration

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Keep the canonical lane weights in exactly one place and expose them to callers so routing behavior remains auditable and tunable only through the promotion pipeline.

---

## 2. CURRENT REALITY

`lib/scorer/weights-config.ts` defines the canonical weights: `explicit_author: 0.45`, `lexical: 0.30`, `graph_causal: 0.15`, `derived_generated: 0.10`, `semantic_shadow: 0.00`. These values are surfaced through `advisor_status.laneWeights` and consumed by `lib/scorer/fusion.ts`. Any proposed weight change must go through `lib/promotion/weight-delta-cap.ts` and the 7-gate bundle before it can modify the live configuration.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts` — weight consumption.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts` — weight exposure.
- Playbook scenario [SC-001](../../manual_testing_playbook/08--scorer-fusion/001-five-lane-fusion.md).

---

## 5. RELATED

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [`05--promotion-gates/02-weight-delta-cap.md`](../05--promotion-gates/02-weight-delta-cap.md).
- [`05--promotion-gates/05-semantic-lock.md`](../05--promotion-gates/05-semantic-lock.md).
