# Warm server / daemon mode

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Warm server / daemon mode.

## 2. CURRENT REALITY

**PLANNED (Sprint 019) — DEFERRED.** HTTP daemon transport for warm, persistent server execution is deferred while MCP SDK HTTP transport conventions continue evolving. Current transport remains stdio. Estimated effort: L (2-3 weeks).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Core | Current stdio transport and server lifecycle entrypoint |
| `mcp_server/lib/providers/embeddings.ts` | Lib | `shouldEagerWarmup()` remains permanently false while daemon mode is deferred |
| `mcp_server/cli.ts` | Core | CLI bootstrap path for server startup |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/context-server.vitest.ts` | Verifies stdio server behavior and core request lifecycle |
| `mcp_server/tests/lazy-loading.vitest.ts` | Verifies deferred warmup flags and `shouldEagerWarmup()` behavior |
| `mcp_server/tests/stdio-logging-safety.vitest.ts` | Verifies stdio-safe runtime logging in non-daemon mode |

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Warm server / daemon mode
- Current reality source: feature_catalog.md
