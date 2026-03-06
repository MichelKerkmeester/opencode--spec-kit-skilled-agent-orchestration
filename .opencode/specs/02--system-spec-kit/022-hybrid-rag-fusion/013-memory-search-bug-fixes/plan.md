---
title: "Plan: Memory Search Bug Fixes (Unified)"
description: "Canonical Level 2 execution plan for stateless parity, folder discovery, and Voyage 4 environment hardening under spec 013"
importance_tier: "normal"
contextType: "implementation"
---
# Plan: Memory Search Bug Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

This unified plan captures the documented bug-fix workstreams for `013-memory-search-bug-fixes`:

1. Stateless filename/generic-slug parity stabilization.
2. Folder-discovery robustness follow-up, including the stale-cache shrink remediation.
3. Voyage 4 memory-index environment hardening so the MCP runtime uses the intended provider, reports that provider accurately in `memory_health`, and fails safe on dimension drift.

Approach stayed intentionally narrow: adjust only the affected workflow/utilities/tests for workstream A, folder-discovery module/tests for workstream B, and the MCP launch/startup/test surface for workstream C.
<!-- /ANCHOR:summary -->

---

## Technical Context

| Aspect | Context |
|--------|---------|
| Stack | TypeScript/Node.js |
| Scope A | `.opencode/skill/system-spec-kit/scripts/*` workflow + utility + tests |
| Scope B | `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` + direct tests |
| Scope C | `opencode.json`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` |
| Validation Tooling | Vitest, `tsc`, alignment drift script, spec validator |
| Build Constraint | `npm run typecheck` and `npm run build` both pass in `.opencode/skill/system-spec-kit` |

---

## Architecture

The solution keeps architecture unchanged and applies targeted behavior fixes:
- Stateless enrichment routing remains in workflow path with explicit JSON/file-backed guard and invocation-local config restoration after `runWorkflow()`.
- Generic-task parity remains centralized in slug/enrichment utility semantics.
- Folder discovery stays in existing module, expanded with bounded recursion, canonical root dedupe, and graceful invalid-path handling.
- MCP memory runtime remains on the existing 1024d database path, keeps `EMBEDDINGS_PROVIDER=auto`, avoids literal `${...}` key interpolation in `opencode.json`, resolves lazy provider metadata before formatting `memory_health`, and aborts startup if provider/database dimensions disagree.

---

<!-- ANCHOR:architecture -->
## 2. Technical Approach

### Workstream A
- Preserve spec-title fallback enrichment for stateless generic tasks.
- Enforce explicit stateless-only guard (`JSON/file-backed` path bypasses enrichment).
- Prevent file-backed/JSON mode from reselecting `specTitle` later through preferred-task fallback.
- Restore invocation-local config state after each `runWorkflow()` call so file-backed runs cannot leak `CONFIG.DATA_FILE` into later stateless runs.
- Align generic-task classification with slug behavior (`implementation-and-updates` included).
- Keep template rendering honest by preserving original `implSummary.task` in `IMPL_TASK`.

### Workstream B
- Add depth-limited recursive discovery (max depth 8).
- Dedupe alias roots by canonical path while preserving first candidate path behavior.
- Evaluate staleness over recursive discovered folders.
- Invalidate future-dated caches when cached/discovered folder sets differ, while keeping future-dated caches fresh when the folder set still matches.
- Return empty cache object for invalid/nonexistent non-empty explicit input paths.

### Workstream C
- Keep the workspace MCP memory runtime on `EMBEDDINGS_PROVIDER=auto` in `opencode.json` so provider compatibility remains intact.
- Remove literal `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` interpolation from `opencode.json` so managed MCP workers use the real parent shell/launcher environment instead of placeholder strings.
- Refuse startup when `validateEmbeddingDimension()` reports a provider/database mismatch.
- Resolve the lazy embedding profile inside `memory_health` before reporting `embeddingProvider`.
- Lock the fail-fast behavior with focused `context-server.vitest.ts` coverage.
- Verify managed startup via `opencode mcp list`, probe `memory_health` through a real MCP SDK client against `dist/context-server.js`, and re-run direct packet indexing under the corrected environment.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. Implementation Phases

### Phase A: Stateless Filename + Slug Parity
- [x] Add/keep stateless enrichment fallback path.
- [x] Add stateless-only enrichment guard.
- [x] Align generic-task semantics with slug behavior.
- [x] Add regression tests for JSON-vs-stateless behavior, workflow seam restoration, and slug outcomes.

### Phase B: Folder Discovery Follow-up
- [x] Implement recursive discovery with max depth 8.
- [x] Implement canonical-path root dedupe with first-candidate retention.
- [x] Route staleness checks through recursive discoveries.
- [x] Add stale-cache shrink follow-up coverage for deleted cached folders.
- [x] Implement graceful empty-cache return for invalid/nonexistent explicit input paths.

### Phase C: Verification + Documentation Consolidation
- [x] Run targeted workstream tests and compile checks.
- [x] Consolidate duplicate root/addendum docs into one canonical Level 2 packet.
- [x] Normalize references to standard filenames only.

### Phase D: Voyage 4 Runtime Hardening
- [x] Update MCP workspace config to keep `EMBEDDINGS_PROVIDER=auto` and remove literal `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` interpolation.
- [x] Make startup fail on embedding dimension mismatch instead of continuing.
- [x] Add focused regression coverage for fatal startup on mismatch.
- [x] Fix `memory_health` lazy provider metadata reporting and add regression coverage.
- [x] Verify managed startup and real MCP SDK `memory_health` both report `voyage` / `voyage-4` with dimension `1024`.
- [x] Verify direct `handleMemoryIndexScan` for this packet completes with `failed: 0`.
- [x] Record the residual out-of-scope auth-failure diagnostic limitation honestly.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. Testing Strategy

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Regression tests | Stateless task enrichment, preferred-task fallback guard, workflow seam loader-path proof, and slug parity | `npm run test:task-enrichment` -> PASS (30 passed) |
| Unit tests | Folder discovery recursion/depth/invalid paths | `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts` -> PASS (45 passed) |
| Integration tests | Alias-root dedupe + recursive staleness behavior, including stale-cache shrink and folder-set mismatch invalidation coverage | `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` -> PASS (28 passed) |
| MCP startup tests | Fatal startup on embedding dimension mismatch | `npm run test --workspace=mcp_server -- tests/context-server.vitest.ts` -> PASS (307 passed) |
| Provider-resolution tests | Auto-mode provider compatibility remains intact | `npm run test --workspace=mcp_server -- tests/embeddings.vitest.ts` -> PASS (14 passed) |
| Health-handler regression tests | Lazy provider profile reporting remains accurate | `npx vitest run tests/memory-crud-extended.vitest.ts` -> PASS (68 passed) |
| Type/build checks | Type safety and build consistency | `npx tsc --noEmit` (PASS), `npx tsc -p tsconfig.json --noEmit` (PASS), `npx tsc -p tsconfig.json` (PASS), `npm run typecheck` (PASS), `npm run build` (PASS) |
| Managed startup probe | Host-managed MCP startup reaches the intended provider | PASS (`spec_kit_memory` connected; startup logs reported `API key validated (provider: voyage)` and `Embedding dimension validated: 1024`) |
| Direct runtime probe | Real MCP SDK `memory_health` alignment in auto mode | PASS (`Memory system healthy: 963 memories indexed`; `provider: voyage`; `voyage-4`; `dimension: 1024`) |
| Direct indexing proof | Built runtime packet indexing under corrected Voyage env | PASS (`handleMemoryIndexScan` for `02--system-spec-kit/022-hybrid-rag-fusion/013-memory-search-bug-fixes` -> `failed: 0`) |
| Alignment check | Full skill-root drift check | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` (PASS) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Existing memory workflow utilities/tests | Green | Needed for stateless vs JSON behavior proof and file-backed/stateless seam coverage |
| Filesystem canonical path behavior | Green | Needed for alias-root dedupe correctness |
| Parent launcher environment supplies real cloud-provider keys | Green | `opencode.json` no longer overrides those keys with literal `${...}` placeholders |
| Pre-flight auth-validation order | Mixed | True credential failures still exit before `memory_health` is available; documented as out-of-scope follow-up |
| Vitest/type/build tooling | Green | Required for verification evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. Rollback Plan

- Revert targeted workstream files if regression appears.
- Re-run targeted test suites and compile checks to confirm restoration.
- Keep rollback scope limited to touched workflow/util, folder-discovery, and MCP runtime config/startup/test surfaces.
<!-- /ANCHOR:rollback -->
