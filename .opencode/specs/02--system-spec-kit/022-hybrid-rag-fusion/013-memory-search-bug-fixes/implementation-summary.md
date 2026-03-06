---
title: "Implementation Summary: Memory Search Bug Fixes (Unified)"
description: "Canonical merged summary for stateless parity fixes, folder-discovery follow-up, and the Voyage 4 memory-index fix under spec 013"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-memory-search-bug-fixes |
| **Completed** | 2026-03-06 |
| **Level** | 2 |
| **Status** | Unified canonical packet updated after verified Voyage 4 launcher/config remediation and the follow-up `memory_health` reporting fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This spec now captures all completed workstreams in one canonical Level 2 packet.

### Workstream A: Stateless filename/generic-slug parity
- Preserved title fallback enrichment for generic task labels in stateless mode.
- Added explicit stateless-only guard so JSON/file-backed mode remains unchanged.
- Prevented file-backed/JSON mode from reselecting `specTitle` later through preferred-task fallback.
- Added a workflow serialization guard so overlapping `runWorkflow()` calls do not interleave invocation-local state.
- Restored invocation-local config state after `runWorkflow()` so a file-backed run cannot leak `CONFIG.DATA_FILE` into a later stateless run, and the seam test now proves the later stateless invocation reaches the loader path with `CONFIG.DATA_FILE === null`.
- Aligned generic-task semantics with slug behavior including `Implementation and updates`.
- Preserved template honesty (`IMPL_TASK` still reflects original task field).
- Added regression tests proving JSON-vs-stateless divergence, workflow-level seam isolation, overlapping-call serialization, and slug outcomes.

### Workstream B: Folder-discovery follow-up
- Added depth-limited recursive discovery with max depth 8.
- Added canonical-path dedupe for alias roots while preserving first-candidate behavior.
- Updated staleness checks to use recursively discovered folders.
- Added stale-cache shrink follow-up coverage plus future-dated cache invalidation when cached/discovered folder sets differ, while keeping future-dated caches fresh when the folder set still matches.
- Added alias-root order determinism integration coverage so canonical root ordering remains stable.
- Ensured invalid/nonexistent non-empty explicit input paths return an empty cache object.
- Added/updated unit and integration verification coverage.

### Workstream C: Voyage 4 memory-index environment fix
- Updated `opencode.json` so `spec_kit_memory` keeps `EMBEDDINGS_PROVIDER=auto` for provider compatibility instead of hard-pinning `voyage`.
- Removed literal `${VOYAGE_API_KEY}` and `${OPENAI_API_KEY}` interpolation from `opencode.json` after confirming the managed MCP child process was receiving those placeholders as bogus API keys; the real cloud-provider keys now come only from the parent shell/launcher environment.
- Kept the existing 1024d database path in place to preserve the fuller active index while aligning the runtime to Voyage 4.
- Changed startup so `context-server.ts` throws on embedding dimension mismatch instead of warning and continuing.
- Added focused regression coverage proving startup exits on a 1024 vs 768 mismatch.
- Fixed `memory_health` so it resolves the lazy embedding profile before formatting `embeddingProvider`, which removed the stale 768d fallback and made the health payload report the active `voyage` / `voyage-4` / `1024` profile.
- Verified provider-resolution compatibility with `embeddings.vitest.ts`, then verified both managed startup and a real MCP SDK `memory_health` call: managed startup connected `spec_kit_memory` with Voyage and validated dimension 1024, and the stdio client returned `Memory system healthy: 963 memories indexed` plus `embeddingProvider { provider: voyage, model: voyage-4, dimension: 1024, healthy: true }`.
- Verified direct `handleMemoryIndexScan` for this packet completed with `failed: 0` after the fix.
- Recorded the residual out-of-scope limitation that true startup auth failures still exit before `memory_health` can provide diagnostics.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files-changed -->
## Files Changed

| File | Changes |
|------|---------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Stateless enrichment consumption, preferred-task fallback guarding for file-backed/JSON mode, overlapping-call serialization guard, fallback handling for descriptive slug/title generation, and invocation-local config restoration after `runWorkflow()` |
| `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts` | Stateless-only enrichment guard helper |
| `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts` | Generic classification parity for `implementation-and-updates` |
| `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` | Regression coverage for mode divergence, preferred-task fallback guarding, workflow seam loader-path proof, overlapping-call serialization, and slug outcomes |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Recursive discovery, canonical root dedupe, recursive staleness checks, future-dated cache invalidation on folder-set mismatch, and graceful invalid-path cache behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts` | Unit tests for deep recursion/depth boundary/invalid-path behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` | Integration tests for alias dedupe, alias-root order determinism, future-dated cache invalidation on folder-set mismatch, and recursive staleness behavior |
| `opencode.json` | `EMBEDDINGS_PROVIDER=auto`, no literal `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` interpolation, and updated notes clarifying parent-environment key sourcing |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Fatal startup behavior when embedding dimension and active database disagree |
| `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Regression coverage for startup exit on embedding dimension mismatch |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Lazy-profile resolution before `memory_health` reports `embeddingProvider` |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts` | Provider metadata type widened for runtime health reporting |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Regression coverage for lazy-profile health reporting and configured fallback behavior |
| `decision-record.md` | Decision rationale for workflow serialization and alias-root order stability |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `handover.md` | Canonical Level 2 documentation merge for spec 013 |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS |
| `npm run test:task-enrichment` | PASS (30 passed; includes preferred-task fallback guarding, workflow-level seam proof that the later stateless run reaches the loader path with `CONFIG.DATA_FILE === null`, and overlapping-call concurrency coverage) |
| `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts` | PASS (45 passed) |
| `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` | PASS (28 passed; includes stale-cache shrink follow-up coverage, future-dated cache invalidation on folder-set mismatch, and alias-root order determinism integration assertions) |
| `npm run test --workspace=mcp_server -- tests/context-server.vitest.ts` | PASS (307 passed; includes fatal startup mismatch coverage) |
| `npm run test --workspace=mcp_server -- tests/embeddings.vitest.ts` | PASS (14 passed; includes auto-mode provider-resolution coverage) |
| `npx vitest run tests/memory-crud-extended.vitest.ts` | PASS (68 passed; includes lazy-profile health reporting coverage) |
| `~/.opencode/bin/opencode --print-logs --log-level DEBUG mcp list` | PASS (`spec_kit_memory` connected; startup logs reported `API key validated (provider: voyage)` and `Embedding dimension validated: 1024`) |
| `npx tsc -p tsconfig.json --noEmit` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `npx tsc -p tsconfig.json` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `npm run typecheck` in `.opencode/skill/system-spec-kit` | PASS |
| `npm run build` in `.opencode/skill/system-spec-kit` | PASS |
| Real MCP SDK `memory_health` probe against `dist/context-server.js` | PASS (`Memory system healthy: 963 memories indexed`; `provider: voyage`; `voyage-4`; `dimension: 1024`; `healthy: true`) |
| Direct `handleMemoryIndexScan` for `02--system-spec-kit/022-hybrid-rag-fusion/013-memory-search-bug-fixes` | PASS (`failed: 0`) |
| `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` | PASS |
| Spec validator (`validate.sh`) | PASS |
| Context memory save | PASS via owning-root save workflow; direct nested packet save rejected deterministically, then closure context saved at `022-hybrid-rag-fusion` and packet docs refreshed via `memory_index_scan` |
| Raw verification artifacts | Saved under `scratch/verification-logs/` for command-level audit evidence |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Recursive discovery is intentionally bounded to max depth 8.
2. Invalid/nonexistent non-empty explicit paths intentionally degrade to empty cache object.
3. If startup auth truly fails, pre-flight validation still exits before `memory_health` is available; that broader boot-order behavior remains outside this spec’s completed scope.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:post-review-remediation -->
## Post-Review Remediation

Following the 8-agent multi-perspective review (2026-03-06), 7 findings were identified and addressed:

### Findings Addressed

| ID | Severity | Description | Resolution |
|----|----------|-------------|------------|
| F1 | BLOCKING | tasks.md lacked REQ-xxx traceability | Added inline REQ references to all 32 tasks |
| F2 | BLOCKING | No getEmbeddingProfileAsync rejection test | Added EXT-H4d test with mockRejectedValue |
| F3 | MINOR | Phase naming inconsistency (1/2/3/4 vs A/B/C/D) | Aligned plan.md to letter naming (A/B/C/D) |
| F4 | MINOR | Pre-impl P0 evidence cited docs not commands | Enhanced with grep-verifiable evidence |
| F5 | MINOR | ProviderMetadata type divergence + unsafe cast | Removed unsafe `as` cast, aligned types |
| F6 | MINOR | No depth-8 positive boundary test | Added T046-10a2 acceptance test |
| F7 | MINOR | Test singleton reuse without module reset | Added afterAll with vi.resetModules() |

### Files Changed

- `tasks.md` — REQ-xxx inline references (F1)
- `plan.md` — Phase header renaming (F3)
- `checklist.md` — P0 evidence enhancement (F4)
- `implementation-summary.md` — This remediation section (meta)
- `memory-crud-types.ts` — Type alignment (F5)
- `memory-crud-health.ts` — Cast removal (F5)
- `memory-crud-extended.vitest.ts` — Rejection test + cleanup (F2, F7)
- `folder-discovery-integration.vitest.ts` — Depth-8 boundary test (F6)
<!-- /ANCHOR:post-review-remediation -->
