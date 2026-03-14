# Dry-run preflight for memory_save

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

The `dryRun` parameter on `memory_save` runs preflight validation without indexing, database mutation or file writes.

## 2. CURRENT REALITY

The `memory_save` tool accepts a `dryRun` parameter that runs preflight validation only (content size, anchor validation, token budget estimation and exact duplicate checks) without indexing, database mutation, or file writes. In dry-run mode, handler responses are returned from the preflight result (`would_pass`, validation errors/warnings/details) and the save/index pipeline is not executed.

This allows agents to preview validation outcomes before committing while still using the same preflight validator used by non-dry-run requests. In non-dry-run mode, the same preflight checks run first (unless `skipPreflight=true`) and then `indexMemoryFile` executes quality-loop, quality-gate, PE-gating and persistence flows.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler with dry-run path |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions including dryRun flag |
| `mcp_server/lib/validation/preflight.ts` | Lib | Pre-flight validation logic |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod schema with dryRun parameter |
| `mcp_server/tool-schemas.ts` | Core | Tool schema with dryRun option |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/preflight.vitest.ts` | Pre-flight validation tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler validation |

### Validation coverage snapshot

- `mcp_server/tests/preflight.vitest.ts`: 39 test cases
- `mcp_server/tests/handler-memory-save.vitest.ts`: 23 test cases
- Combined scoped total for this feature path: 62 test cases

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Dry-run preflight for memory_save
- Current reality source: audit-D04 gap backfill

## 5. IN SIMPLE TERMS

Before committing a memory to storage, you can do a practice run to see if it would pass all the checks. Nothing gets saved or changed. It is like using the "print preview" button before printing: you catch problems before they become permanent, without wasting paper.
