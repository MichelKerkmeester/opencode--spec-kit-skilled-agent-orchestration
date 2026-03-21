---
title: "Standalone admin CLI"
description: "The standalone admin CLI provides non-MCP database maintenance commands for stats, bulk-delete, reindex and schema-downgrade operations."
---

# Standalone admin CLI

## 1. OVERVIEW

The standalone admin CLI provides non-MCP database maintenance commands for stats, bulk-delete, reindex and schema-downgrade operations.

This is a command-line maintenance tool for the memory database that you can run directly without going through the normal system. It lets you check database statistics, delete old records in bulk, rebuild the search index or roll back a database upgrade. Think of it as the "service panel" for the system that only operators use when routine maintenance or emergency recovery is needed.

---

## 2. CURRENT REALITY

Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint, where constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.

#### Checkpoint-before-delete contract (`bulk-delete`)

- `bulk-delete` attempts to create a pre-delete checkpoint before destructive deletion whenever `--skip-checkpoint` is **not** set.
- `--skip-checkpoint` is allowed for non-critical tiers, but blocked for `constitutional` and `critical`.
- Checkpoint creation is **best-effort** (not mandatory): if `createCheckpoint` fails, the CLI logs a warning and proceeds with deletion.

**Failure behavior:** checkpoint creation failure does **not** halt delete operations.

**Decision rationale:** this CLI is an operator recovery tool and must stay usable during partial storage failures. Making checkpoints mandatory for every delete could block necessary cleanup when checkpoint persistence is degraded. Instead, the command keeps explicit safety gates (tier validation and critical-tier scope requirements) and surfaces checkpoint failure clearly.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/cli.ts` | Core | CLI entry point and command dispatch |
| `mcp_server/lib/storage/schema-downgrade.ts` | Lib | Schema downgrade logic |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint storage for pre-delete snapshots |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/cli.vitest.ts` | CLI integration tests: stats success, bulk-delete execution with checkpoint creation, reindex success, schema-downgrade guardrails (`--confirm` required + safe failure for unsupported downgrade path), unknown command/missing-arg errors and database-path failure handling |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Checkpoint extended tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |

`mcp_server/tests/cli.vitest.ts` currently does **not** cover dry-run mode, invalid tier-value handling, or a successful schema-downgrade execution path.

---

## 4. SOURCE METADATA

- Group: Undocumented feature gap scan
- Source feature title: Standalone admin CLI
- Current reality source: 10-agent feature gap scan
- Playbook reference: 113
