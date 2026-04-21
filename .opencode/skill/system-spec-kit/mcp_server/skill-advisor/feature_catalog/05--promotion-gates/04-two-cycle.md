---
title: "Two Consecutive Passing Cycles"
description: "Promotion durability requirement: two back-to-back passing shadow cycles before a candidate advances to live weights."
trigger_phrases:
  - "two cycle requirement"
  - "consecutive passing cycles"
  - "promotion durability"
  - "two shadow cycles"
---

# Two Consecutive Passing Cycles

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Protect against a single flukey pass. Candidates must demonstrate stability by clearing the gate bundle twice in a row with the same weights.

---

## 2. CURRENT REALITY

`lib/promotion/two-cycle-requirement.ts` tracks consecutive passing cycles for each candidate. A single pass is insufficient — promotion is blocked with a "second cycle required" reason. Any failure in between resets the counter to zero. The counter state is persisted across daemon restarts through the promotion telemetry surface.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`.
- Playbook scenario [PG-004](../../manual_testing_playbook/09--promotion-gates/004-two-cycle-requirement.md).

---

## 5. RELATED

- [03-gate-bundle.md](./03-gate-bundle.md).
- [05-semantic-lock.md](./05-semantic-lock.md).
- [06-rollback.md](./06-rollback.md).
