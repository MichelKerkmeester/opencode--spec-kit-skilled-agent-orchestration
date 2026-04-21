---
title: "LC-004 Schema v1 to v2 Additive Backfill"
description: "Manual validation that schema migration from v1 to v2 is additive, preserves existing data, and supports rollback without data loss."
trigger_phrases:
  - "lc-004"
  - "schema migration"
  - "v1 to v2 backfill"
  - "additive migration"
---

# LC-004 Schema v1 to v2 Additive Backfill

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/lifecycle/schema-migration.ts` performs additive backfill from the v1 schema to v2 without dropping or mutating existing fields, and that a rollback to v1 leaves original data intact.

---

## 2. SETUP

- Disposable workspace copy containing a v1 schema seed of `skill-graph.sqlite` or `graph-metadata.json` entries.
- MCP server built.
- Ability to invoke migration logic on startup or via the exposed management interface.

---

## 3. STEPS

1. Snapshot the v1 state:

```bash
cp /tmp/path-to-copy/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill-graph.sqlite /tmp/pre-v1.sqlite
```

2. Trigger migration by bringing up the daemon against the v1 workspace:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

3. Inspect the post-migration state and verify new v2 fields are populated while v1 fields remain identical.
4. Trigger rollback (per documented rollback path) and confirm v1 state.

---

## 4. EXPECTED

- All v1 fields remain present and byte-identical after migration.
- New v2 fields are populated with default or computed values.
- `schemaVersion` (or equivalent) reports v2 after migration and v1 after rollback.
- No migration errors in logs.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Data loss during migration | v1 field missing in post state | Block release; migration must be additive. |
| Rollback leaves v2 residue | Rollback state contains v2 columns | Audit rollback path in `lib/lifecycle/rollback.ts`. |
| Migration errors surface to user | Error echoed in envelope | Confirm migration runs internally and fails open. |

---

## 6. RELATED

- Scenario [LC-005](./005-rollback-lifecycle.md) — lifecycle rollback.
- Scenario [AU-005](../05--auto-update-daemon/005-rebuild-from-source.md) — rebuild-from-source.
- Feature [`03--lifecycle-routing/04-schema-migration.md`](../../feature_catalog/03--lifecycle-routing/04-schema-migration.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/schema-migration.ts`.
