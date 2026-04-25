---
title: "Schema v1 to v2 Additive Backfill"
description: "Additive schema migration between graph-metadata v1 and v2 that preserves existing data and supports rollback."
trigger_phrases:
  - "schema migration"
  - "v1 v2 additive"
  - "additive backfill"
  - "schema rollback"
---

# Schema v1 to v2 Additive Backfill

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Evolve graph metadata without breaking existing snapshots. Additive-only migration means v1 fields are preserved and rollback to v1 is safe.

---

## 2. CURRENT REALITY

`lib/lifecycle/schema-migration.ts` upgrades v1 graph-metadata to v2 by adding new fields (such as lifecycle lanes and derived provenance) while leaving v1 fields byte-identical. Rollback restores the pre-migration state cleanly so downgrades do not leak v2 residue. The migration runs internally during daemon bring-up; errors fail open without exposing stack traces to MCP consumers.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/schema-migration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/rollback.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` — migration and rollback invariants.
- Playbook scenario [LC-004](../../manual_testing_playbook/07--lifecycle-routing/004-schema-migration.md).

---

## 5. RELATED

- [05-rollback.md](./05-rollback.md).
- [`01--daemon-and-freshness/06-rebuild-from-source.md`](../01--daemon-and-freshness/06-rebuild-from-source.md).
- [`02--auto-indexing/04-sync.md`](../02--auto-indexing/04-sync.md).
