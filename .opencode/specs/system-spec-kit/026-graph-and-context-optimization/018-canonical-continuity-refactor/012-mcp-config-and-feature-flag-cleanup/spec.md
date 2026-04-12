---
title: "Phase 012 — MCP Config + Feature Flag Cleanup"
description: "Standardize MCP server configs across all 6 runtimes, remove redundant feature flags, update rerank model to 2.5, remove MEMORY_DB_PATH, and document the graduated flag system."
trigger_phrases:
  - "mcp config"
  - "feature flags"
  - "rerank update"
  - "embedding config"
importance_tier: "important"
contextType: "implementation"
level: 2
status: "complete"
parent: "018-canonical-continuity-refactor"
---
# Phase 012 — MCP Config + Feature Flag Cleanup

## Scope

Post-018 cleanup of MCP server configuration files and feature flag management.

### What was done

1. **Removed `MEMORY_DB_PATH`** from all 6 MCP configs — DB path now auto-derived from the embedding provider profile via `shared/embeddings/profile.ts`. Works for any provider setup (Voyage, OpenAI, HF Local) without config changes.

2. **Updated rerank model** from deprecated `rerank-2` to `rerank-2.5` in `cross-encoder.ts`. Local cross-encoder fallback (`ms-marco-MiniLM-L-6-v2`) preserved for users without API keys.

3. **Made `EMBEDDING_DIM` dynamic** — derived from provider profile instead of hardcoded `768`. Voyage-4 uses 1024, HF Local uses 768, both work automatically.

4. **Documented `voyage-code-3`** for CocoIndex code embeddings when `VOYAGE_API_KEY` is present.

5. **Removed 7 redundant feature flags** from all MCP configs — all default to ON in code via graduated `isFeatureEnabled()` semantics in `rollout-policy.ts`. Only `EMBEDDINGS_PROVIDER=auto` remains as a real env var.

6. **Synced all 6 configs** to identical structure: same env vars, same notes, same ordering (flags before notes).

### Feature Flag Architecture

The `isFeatureEnabled()` function in `mcp_server/lib/cognitive/rollout-policy.ts` uses **graduated semantics**:
- `undefined` / empty → `true` (ON by default)
- Explicit `'false'` or `'0'` → `false` (OFF)
- Any other value → `true`

This means all feature flags are ON by default without any config. Users only need to set a flag if they want to **disable** it (set to `false`).

### Flags documented in `_NOTE_7`

All default ON — set to `false` to disable:
- `SPECKIT_ADAPTIVE_FUSION` — adaptive score fusion in hybrid search
- `SPECKIT_SESSION_BOOST` — boosts results from current session's spec folder
- `SPECKIT_CAUSAL_BOOST` — boosts results with causal graph edges
- `SPECKIT_HYDE_ACTIVE` — hypothetical document embeddings for better retrieval
- `SPECKIT_ENTITY_LINKING` — extracts entities on save for graph linking
- `SPECKIT_GRAPH_CONCEPT_ROUTING` — noun-phrase concept routing in queries
- `SPECKIT_GRAPH_REFRESH_MODE` — defaults to `write_local` (refreshes graph on save)

### Configs synced

| Config | Runtime |
|---|---|
| `.mcp.json` | OpenCode / Copilot |
| `.claude/mcp.json` | Claude Code |
| `.vscode/mcp.json` | VS Code |
| `.gemini/settings.json` | Gemini CLI |
| `opencode.json` | OpenCode |
| Barter `opencode.json` | Barter project |
