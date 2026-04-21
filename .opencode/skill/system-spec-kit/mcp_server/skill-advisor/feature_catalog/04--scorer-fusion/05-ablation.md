---
title: "Lane-by-Lane Ablation Protocol"
description: "Ablation harness that disables each lane in isolation and measures accuracy impact without mutating live routing weights."
trigger_phrases:
  - "ablation protocol"
  - "lane ablation"
  - "scorer ablation"
  - "ablation accuracy"
---

# Lane-by-Lane Ablation Protocol

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Quantify each lane's contribution to accuracy so lane weights can be reasoned about empirically. Ablation must never mutate live weights.

---

## 2. CURRENT REALITY

`lib/scorer/ablation.ts` drives the ablation protocol: it reads the active lane weight configuration, runs the corpus with each non-zero lane set to zero in turn, and emits per-lane accuracy deltas. The live `laneWeights` (exposed via `advisor_status`) are unchanged after ablation. Results feed into `advisor_validate` ablation slices.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ablation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts` — ablation slices.
- Playbook scenario [SC-005](../../manual_testing_playbook/08--scorer-fusion/005-ablation.md).

---

## 5. RELATED

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [`05--promotion-gates/01-shadow-cycle.md`](../05--promotion-gates/01-shadow-cycle.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
