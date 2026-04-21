---
title: "Semantic Shadow Weight Lock"
description: "Lock that keeps semantic_shadow.weight at 0.00 for live routing until the first promotion wave explicitly lifts the lock."
trigger_phrases:
  - "semantic lock"
  - "semantic_shadow lock"
  - "shadow only weight"
  - "semantic weight zero"
---

# Semantic Shadow Weight Lock

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Measure semantic similarity in shadow without ever affecting live routing until the promotion pipeline has explicitly validated and lifted the lock.

---

## 2. CURRENT REALITY

`lib/promotion/semantic-lock.ts` enforces `semantic_shadow.weight == 0.00` for the live configuration. Candidate configurations that try to raise the semantic weight are rejected at staging. Semantic scoring still runs (it can be measured) but it contributes zero to live fusion. The lock is lifted only by an explicit promotion that passes the gate bundle and the delta cap together.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/semantic-shadow.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` — lock enforcement.
- Playbook scenario [PG-005](../../manual_testing_playbook/09--promotion-gates/005-semantic-lock-and-rollback.md).

---

## 5. RELATED

- [04-two-cycle.md](./04-two-cycle.md).
- [06-rollback.md](./06-rollback.md).
- [`04--scorer-fusion/01-five-lane-fusion.md`](../04--scorer-fusion/01-five-lane-fusion.md).
