# Standalone admin CLI

## Current Reality

Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint; constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/cli.ts` | Core | CLI entry point and command dispatch |
| `mcp_server/lib/storage/schema-downgrade.ts` | Lib | Schema downgrade logic |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint storage for pre-delete snapshots |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Checkpoint extended tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |

## Source Metadata

- Group: Undocumented feature gap scan
- Source feature title: Standalone admin CLI
- Current reality source: 10-agent feature gap scan
- Playbook reference: NEW-113
