---
title: "Shadow Cycle (No-Mutation Corpus Replay)"
description: "Shadow cycle that replays the 200-prompt corpus through candidate lane weights without touching live routing, live weights, or caches."
trigger_phrases:
  - "shadow cycle"
  - "no mutation replay"
  - "candidate corpus replay"
  - "shadow cycle promotion"
---

# Shadow Cycle (No-Mutation Corpus Replay)

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Let operators evaluate a candidate lane weight configuration safely by replaying the corpus against it with no live side effects.

---

## 2. CURRENT REALITY

`lib/promotion/shadow-cycle.ts` runs the full corpus through the scorer using a candidate weight configuration. Live routing state, live weights, prompt cache, and diagnostics are untouched. The cycle emits its own metrics stream that feeds the 7-gate bundle; these metrics do not mix with live observability.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` — shadow-cycle isolation.
- Playbook scenario [PG-001](../../manual_testing_playbook/09--promotion-gates/001-shadow-cycle-no-mutation.md).

---

## 5. RELATED

- [02-weight-delta-cap.md](./02-weight-delta-cap.md).
- [03-gate-bundle.md](./03-gate-bundle.md).
- [04-two-cycle.md](./04-two-cycle.md).
