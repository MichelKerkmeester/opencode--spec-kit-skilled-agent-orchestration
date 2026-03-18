---
title: "Dry-run preflight for memory_save"
description: "The `dryRun` parameter on `memory_save` runs preflight validation without indexing, database mutation or file writes."
---

# Dry-run preflight for memory_save

## 1. OVERVIEW

The `dryRun` parameter on `memory_save` runs preflight validation without indexing, database mutation or file writes.

Before committing a memory to storage, you can do a practice run to see if it would pass all the checks. Nothing gets saved or changed. It is like using the "print preview" button before printing: you catch problems before they become permanent, without wasting paper.

---

## 2. CURRENT REALITY

The `memory_save` tool accepts a `dryRun` parameter that still performs preflight validation without indexing, database mutation, or file writes, but dry-run no longer stops at preflight-only reporting.

Current dry-run behavior now surfaces the same early semantic decision points that a real save would encounter:

- preflight status (`would_pass`, errors, warnings, details)
- quality-loop status
- shared semantic sufficiency result
- `rejectionCode` when insufficiency fails

This allows agents to preview whether a memory is merely well-formed or actually durable enough to save.

In non-dry-run mode, the same preflight checks run first (unless `skipPreflight=true`) and then `indexMemoryFile` executes quality-loop, sufficiency, quality-gate, PE-gating, and persistence flows. In dry-run mode those later stages are evaluated for reporting only and do not produce write, embedding, or indexing side effects.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler with dry-run, quality-loop, and sufficiency reporting paths |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions including `dryRun`, `rejectionCode`, and sufficiency fields |
| `mcp_server/lib/validation/preflight.ts` | Lib | Pre-flight validation logic |
| `shared/parsing/memory-sufficiency.ts` | Shared | Shared semantic sufficiency evaluation used during dry-run preview |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod schema with dryRun parameter |
| `mcp_server/tool-schemas.ts` | Core | Tool schema with dryRun option |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/preflight.vitest.ts` | Pre-flight validation tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler dry-run and insufficiency reporting |

### Validation coverage snapshot

- Targeted save-quality rerun on 2026-03-15 passed with `6` files and `298` tests.
- That scoped rerun included:
  - `tests/handler-memory-save.vitest.ts`
  - `tests/recovery-hints.vitest.ts`
  - `tests/quality-loop.vitest.ts`
  - `tests/save-quality-gate.vitest.ts`
  - `tests/preflight.vitest.ts`
  - `tests/integration-save-pipeline.vitest.ts`

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Dry-run preflight for memory_save
- Current reality source: audit-D04 gap backfill
