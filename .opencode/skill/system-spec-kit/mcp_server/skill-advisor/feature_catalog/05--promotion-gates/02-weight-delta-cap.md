---
title: "Weight Delta Cap (0.05 max per promotion)"
description: "Promotion precondition that rejects any candidate whose per-lane weight delta exceeds 0.05 compared to live weights."
trigger_phrases:
  - "weight delta cap"
  - "max 0.05 delta"
  - "promotion cap"
  - "delta gate"
---

# Weight Delta Cap (0.05 max per promotion)

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Keep promotion small-step. A single promotion cycle may not move any lane weight more than 0.05, which bounds the blast radius of any regression.

---

## 2. CURRENT REALITY

`lib/promotion/weight-delta-cap.ts` compares the candidate configuration to the live `laneWeights` and rejects any candidate where a lane moves by more than 0.05. The check runs before the 7-gate bundle so rejected candidates do not consume downstream resources. Multiple promotions can still move a lane across many cycles — each cycle is capped individually.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/weight-delta-cap.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` — delta cap enforcement.
- Playbook scenario [PG-002](../../manual_testing_playbook/09--promotion-gates/002-weight-delta-cap.md).

---

## 5. RELATED

- [01-shadow-cycle.md](./01-shadow-cycle.md).
- [03-gate-bundle.md](./03-gate-bundle.md).
- [`04--scorer-fusion/06-weights-config.md`](../04--scorer-fusion/06-weights-config.md).
