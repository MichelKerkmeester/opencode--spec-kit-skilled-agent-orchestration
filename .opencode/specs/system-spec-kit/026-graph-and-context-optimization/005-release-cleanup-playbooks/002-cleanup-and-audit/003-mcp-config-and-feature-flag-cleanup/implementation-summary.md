---
title: "...n/005-release-cleanup-playbooks/002-cleanup-and-audit/003-mcp-config-and-feature-flag-cleanup/implementation-summary]"
description: "Implementation closeout for the five-config MCP cleanup and the runtime default checks behind it."
trigger_phrases:
  - "018 012 implementation summary"
  - "mcp config cleanup summary"
  - "feature flag cleanup summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/003-mcp-config-and-feature-flag-cleanup"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed the packet with config, code, and validation evidence"
    next_safe_action: "Review verification output and commit-ready files"
    key_files: ["implementation-summary.md", "checklist.md", "spec.md"]
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mcp-config-and-feature-flag-cleanup |
| **Completed** | 2026-04-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase locked the Public MCP config cleanup to five checked-in configs and verified the code defaults that make those configs minimal. The Spec Kit Memory env block is identical across `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, and `opencode.json`: `EMBEDDINGS_PROVIDER=auto` plus the same `_NOTE_*` guidance in the same order.

### Config cleanup

`MEMORY_DB_PATH` is gone from the five Public configs, and the redundant checked-in `SPECKIT_*` feature flags stay removed. `_NOTE_7_FEATURE_FLAGS` now serves as the operator-facing reminder that the seven listed flags are opt-out only.

### Runtime default verification

The shipped code matches the cleaned config surface:

- `cross-encoder.ts` uses Voyage `rerank-2.5`.
- `vector-index-store.ts` exports `EMBEDDING_DIM` via `getEmbeddingDimension()`.
- `rollout-policy.ts` treats undefined or empty flags as enabled, with only explicit `false` or `0` turning a flag off.

### Packet repair

The phase packet itself was rebuilt to a valid Level 2 state so strict validation can certify the cleanup instead of failing on missing docs and template drift.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The review started with direct reads of the five Public configs, the reranker/default code, and the packet docs. That surfaced two concrete defects: the phase packet only had a lightweight `spec.md` plus a non-template `implementation-summary.md`, and the packet docs overstated the scope as six configs including Barter. The fix kept the runtime/config code as-is where it already matched the requested state, rewrote the phase docs around the verified five-config scope, and left the config env blocks untouched because they were already aligned.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the five Public configs as the only cleanup surface | The operator explicitly scoped this phase to the Public repo and named five configs. |
| Verify parity at the Spec Kit Memory env-block level | The runtime wrapper schemas differ, but the shared env contract is what the phase actually standardizes. |
| Keep default-on behavior in code rather than reintroducing checked-in feature flags | The cleanup goal is a minimal checked-in config surface, not another config knob layer. |
| Rebuild the packet docs instead of excusing validator failures | The user asked for nothing deferred, so the phase packet itself had to be brought up to the same quality bar as 010 and 011. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run --workspace=@spec-kit/mcp-server typecheck` | PASS from `.opencode/skill/system-spec-kit` |
| `npm run --workspace=@spec-kit/scripts typecheck` | PASS from `.opencode/skill/system-spec-kit` |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/tool-input-schema.vitest.ts mcp_server/tests/graph-metadata-schema.vitest.ts mcp_server/tests/graph-metadata-integration.vitest.ts mcp_server/tests/cross-encoder.vitest.ts mcp_server/tests/cross-encoder-extended.vitest.ts mcp_server/tests/rollout-policy.vitest.ts mcp_server/tests/feature-flag-reference-docs.vitest.ts --config mcp_server/vitest.config.ts` | PASS |
| `node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/graph-metadata-refresh.vitest.ts scripts/tests/graph-metadata-backfill.vitest.ts --config mcp_server/vitest.config.ts --root scripts` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/003-mcp-config-and-feature-flag-cleanup` | PASS |
| `rg -n "MEMORY_DB_PATH|SPECKIT_ADAPTIVE_FUSION|SPECKIT_SESSION_BOOST|SPECKIT_CAUSAL_BOOST|SPECKIT_HYDE_ACTIVE|SPECKIT_ENTITY_LINKING|SPECKIT_GRAPH_CONCEPT_ROUTING|SPECKIT_GRAPH_REFRESH_MODE" .mcp.json .claude/mcp.json .vscode/mcp.json .gemini/settings.json opencode.json` | PASS, expected note-only matches plus `EMBEDDINGS_PROVIDER=auto` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The full config files are not byte-identical because each runtime uses its own wrapper schema. The verified parity target is the shared Spec Kit Memory env block.
2. Test fixtures still use `MEMORY_DB_PATH` and `EMBEDDING_DIM` where they intentionally exercise compatibility behavior. This phase only removes those values from the checked-in Public MCP configs.
<!-- /ANCHOR:limitations -->
