# Standalone admin CLI

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Standalone admin CLI.

## 2. CURRENT REALITY

Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint; constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.

### Checkpoint-before-delete contract (`bulk-delete`)

- `bulk-delete` attempts to create a pre-delete checkpoint before destructive deletion whenever `--skip-checkpoint` is **not** set.
- `--skip-checkpoint` is allowed for non-critical tiers, but blocked for `constitutional` and `critical`.
- Checkpoint creation is **best-effort** (not mandatory): if `createCheckpoint` fails, the CLI logs a warning and proceeds with deletion.

**Failure behavior:** checkpoint creation failure does **not** halt delete operations.

**Decision rationale:** this CLI is an operator recovery tool and must stay usable during partial storage failures. Making checkpoints mandatory for every delete could block necessary cleanup when checkpoint persistence is degraded; instead, the command keeps explicit safety gates (tier validation and critical-tier scope requirements) and surfaces checkpoint failure clearly.

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
| `mcp_server/tests/cli.vitest.ts` | CLI integration tests: stats success, bulk-delete execution with checkpoint creation, reindex success, schema-downgrade guardrails (`--confirm` required + safe failure for unsupported downgrade path), unknown command/missing-arg errors, and database-path failure handling |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Checkpoint extended tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |

`mcp_server/tests/cli.vitest.ts` currently does **not** cover dry-run mode, invalid tier-value handling, or a successful schema-downgrade execution path.

## 4. SOURCE METADATA

- Group: Undocumented feature gap scan
- Source feature title: Standalone admin CLI
- Current reality source: 10-agent feature gap scan
- Playbook reference: NEW-113
