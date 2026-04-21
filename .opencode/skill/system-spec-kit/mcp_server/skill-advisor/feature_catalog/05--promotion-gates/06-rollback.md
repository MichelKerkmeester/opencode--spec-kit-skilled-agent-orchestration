---
title: "Atomic Promotion Rollback"
description: "Promotion-level rollback that atomically reverts lane weights on regression detection after a live promotion."
trigger_phrases:
  - "promotion rollback"
  - "atomic rollback promotion"
  - "regression rollback"
  - "post promotion rollback"
---

# Atomic Promotion Rollback

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Give promotion a safety net. If post-promotion telemetry detects a regression, the rollback path reverts live weights to the prior configuration atomically.

---

## 2. CURRENT REALITY

`lib/promotion/rollback.ts` snapshots the prior live weights before each promotion. On regression detection, rollback restores the snapshot in a single atomic step; there is no partially-reverted state observable to readers. Rollback telemetry feeds into `advisor_validate` so the next validation cycle starts from known-good state.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` — rollback atomicity.
- Playbook scenario [PG-005](../../manual_testing_playbook/09--promotion-gates/005-semantic-lock-and-rollback.md).

---

## 5. RELATED

- [05-semantic-lock.md](./05-semantic-lock.md).
- [`03--lifecycle-routing/05-rollback.md`](../03--lifecycle-routing/05-rollback.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
