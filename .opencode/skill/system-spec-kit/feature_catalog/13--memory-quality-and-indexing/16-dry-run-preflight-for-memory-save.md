# Dry-run preflight for memory_save

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Dry-run preflight for memory_save.

## 2. CURRENT REALITY

The `memory_save` tool accepts a `dryRun` parameter that runs the full save pipeline — content normalization, quality gate evaluation, deduplication check, token budget estimation — without committing any changes to the database or writing files to disk. The response includes what would have happened: whether the save would pass quality gates, the computed quality score breakdown, any near-duplicate warnings, and the estimated token cost.

This allows agents to preview a save operation before committing, catching quality gate rejections or duplicate content early. The dry-run path shares the same validation code as the real save path, ensuring preview accuracy matches production behavior.

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

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Dry-run preflight for memory_save
- Current reality source: audit-D04 gap backfill
