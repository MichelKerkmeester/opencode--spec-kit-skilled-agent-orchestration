# Dynamic server instructions at MCP initialization

## Current Reality

**IMPLEMENTED (Sprint 019).** Startup in `context-server.ts` uses `server.setInstructions()` to inject a dynamic memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload. Reuses existing `memory_stats` logic. Gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Dynamic server instructions at MCP initialization
- Current reality source: feature_catalog.md
