---
title: "Atomic Lifecycle Rollback"
description: "Atomic rollback of lifecycle metadata mutations (supersession, archive status, schema version) that leaves no partial state observable."
trigger_phrases:
  - "lifecycle rollback"
  - "atomic rollback lifecycle"
  - "supersession rollback"
  - "lifecycle revert"
---

# Atomic Lifecycle Rollback

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Keep lifecycle mutations reversible so operators can experiment with supersession, archival, and schema changes without fear of leaving the routing surface in a half-applied state.

---

## 2. CURRENT REALITY

`lib/lifecycle/rollback.ts` reverts lifecycle metadata changes atomically. It coordinates with `lib/lifecycle/supersession.ts` and `lib/lifecycle/archive-handling.ts` so that redirect metadata, derived entries, and archive classification all snap back together. Readers never observe a partial rollback; either the rollback commits fully or the prior state remains in effect.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/rollback.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/supersession.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/archive-handling.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` — rollback invariants.
- Playbook scenario [LC-005](../../manual_testing_playbook/07--lifecycle-routing/005-rollback-lifecycle.md).

---

## 5. RELATED

- [04-schema-migration.md](./04-schema-migration.md).
- [02-supersession.md](./02-supersession.md).
