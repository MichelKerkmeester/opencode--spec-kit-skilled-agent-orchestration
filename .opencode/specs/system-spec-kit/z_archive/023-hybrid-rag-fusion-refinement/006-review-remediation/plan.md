---
title: "Implementation Plan: Deep Review [system-spec-kit/023-hybrid-rag-fusion-refinement/006-review-remediation/plan]"
description: "Ordered implementation plan for fixing all 18 findings from the 10-iteration deep review, grouped by workstream with dependency ordering."
trigger_phrases:
  - "remediation plan"
  - "review fix plan"
  - "023 phase 6 plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/006-review-remediation"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Deep Review Remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | OpenCode skill workspace, MCP server |
| **Testing** | Vitest, workspace builds, runtime smokes |

### Overview
Fix all 18 findings from the deep review in dependency order: runtime correctness first (unblocks testing), then security hardening, then doc truth-sync, then completeness/quality items. Each workstream is independently testable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Deep review report exists with all 18 findings documented
- [x] Each finding has file:line evidence and fix recommendation
- [x] Parent packet and Phase 4 child packet are accessible

### Definition of Done
- [x] All 14 P1 findings have code fixes with test evidence
- [x] All 4 P2 findings have code fixes
- [x] All workspace builds pass
- [x] All workspace tests pass (no regressions; pre-existing failures unchanged)
- [x] Parent packet docs truth-synced
- [x] Phase 4 child packet closed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Remediate by workstream, then truth-sync the packet after code and verification evidence converge.

### Key Components
- **Runtime fixes**: ESM entrypoint, engines, and export correctness
- **Security and reliability fixes**: Save pipeline, path validation, duplicate preflight, response warnings
- **Documentation sync**: Parent packet alignment and phase packet closure

### Data Flow
Code remediation by workstream -> targeted tests and builds -> packet truth-sync -> final verification and re-review.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Runtime Correctness (WS-2 + WS-7) — 3 P1 + 1 P2
*Do first: unblocks all testing and verifies ESM contracts are sound.*

**A1. Fix __dirname in ESM wrappers (P1-COR-03)**
- `mcp_server/scripts/map-ground-truth-ids.ts`: Replace `__dirname` with `import.meta.dirname`
- `mcp_server/scripts/reindex-embeddings.ts`: Replace `__dirname` with `import.meta.dirname`
- Verify: `node dist/scripts/map-ground-truth-ids.js` and `node dist/scripts/reindex-embeddings.js` no longer throw ReferenceError

**A2. Guard root export against side-effectful import (P1-COR-01)**
- `mcp_server/context-server.ts`: Wrap `main()` call in `if (import.meta.url === ...)` or move to a separate `bin.ts` entrypoint
- `mcp_server/package.json`: Update `bin` if entrypoint changes
- Verify: `import '@spec-kit/mcp-server'` does NOT start the server

**A3. Align Node engine contracts (P1-COR-02)**
- Root `package.json`: Change `engines.node` to `>=20.11.0`
- `scripts/package.json`: Change `engines.node` to `>=20.11.0`
- `shared/package.json`: Verify already `>=20.11.0`
- `mcp_server/package.json`: Verify already `>=20.11.0`
- Verify: All 4 package.json files agree on `>=20.11.0`

**A4. Fix shared root export (P2-COR-01)**
- `shared/package.json`: Point `main` and `exports["."]` at `dist/index.js` instead of `dist/embeddings.js`
- Add explicit `exports["./embeddings"]` subpath for the embeddings surface
- Verify: `import '@spec-kit/shared'` resolves to `index.js`

**Gate**: `npm run build` for all 3 packages passes. Runtime smokes pass.

---

### Phase B: Security Hardening (WS-1) — 4 P1
*After runtime correctness is sound, tighten trust boundaries.*

**B1. Shared-memory admin auth binding (P1-SEC-01)**
- `mcp_server/handlers/shared-memory.ts`: Validate `actorUserId`/`actorAgentId` against a trusted session principal from the MCP transport rather than accepting caller-supplied values directly
- If trusted binding is not available in current architecture, add explicit documentation that shared-memory admin operations require a trusted transport and log a warning when caller-supplied identity is used without session binding

**B2. V-rule bridge fail-closed (P1-SEC-02)**
- `mcp_server/handlers/v-rule-bridge.ts`: When the validation module fails to load, return a failure result (not `_unavailable` success) that blocks the save
- `mcp_server/handlers/memory-save.ts`: Handle the new fail-closed result — surface a clear error explaining that scripts must be built
- Verify: Save fails with actionable error when `scripts/dist/memory/validate-memory-quality.js` is missing

**B3. Path discovery boundary validation (P1-SEC-03)**
- `shared/paths.ts`: Validate that resolved paths stay within the expected workspace boundary (the directory containing system-spec-kit or an ancestor with package.json)
- Add a guard that rejects paths outside the workspace root
- Verify: Launching from `/tmp` does not redirect database outside workspace

**B4. Scope-aware duplicate preflight (P1-CMP-03)**
- `mcp_server/lib/validation/preflight.ts`: Thread governed scope (tenant/user/agent/shared-space) into the `content_hash` duplicate query
- Redact cross-scope metadata from duplicate-detection responses
- Verify: Duplicate check respects scope boundaries and doesn't leak metadata

**Gate**: All security-related tests pass. Targeted manual verification of each fix.

---

### Phase C: Reliability & Maintainability (WS-5) — 2 P1 + 1 P2
*Fix response quality and code clarity.*

**C1. Fix warning flattening in response builder (P1-REL-01)**
- `mcp_server/handlers/save/response-builder.ts`: Preserve specific warning categories (e.g., "file-persistence-failed", "db-file-divergence") instead of flattening all to "anchor issues"
- `mcp_server/handlers/memory-save.ts`: Emit typed warnings when post-commit file write fails
- Verify: A simulated file-write failure produces a specific warning, not generic anchor text

**C2. Consolidate dynamic-import degradation contracts (P1-MNT-01)**
- `scripts/core/workflow.ts`: Unify the three different `await import('@spec-kit/mcp-server/api...')` error-handling patterns into one shared helper
- Verify: All three call sites use the same degradation/fallback behavior

**C3. Narrow API barrel re-exports (P2-MNT-02)**
- `mcp_server/api/index.ts`: Audit all re-exports; remove deep `lib/` internals that are not part of the stable public surface
- Verify: No external consumers break (grep all import sites)

**Gate**: Workspace tests pass. No import resolution failures.

---

### Phase D: Performance (WS-6) — 2 P2
*Optimize startup and hot paths.*

**D1. Hoist dynamic imports in vector-index-store (P2-PRF-01)**
- `mcp_server/lib/search/vector-index-store.ts`: Replace per-call `await import(...)` with module-level lazy-init pattern for hot retrieval/read methods
- Verify: Search operations no longer pay repeated async import overhead

**D2. Defer CLI heavy imports (P2-PRF-02)**
- `mcp_server/cli.ts`: Move command-specific heavy imports (vector-index, checkpoint, access-tracker, etc.) behind per-command loader functions
- Verify: `node dist/cli.js --help` is faster; lightweight commands don't load DB stack

**Gate**: All CLI subcommands still work. Tests pass.

---

### Phase E: Documentation Truth-Sync (WS-3 + WS-4) — 5 P1
*After code changes land, sync all docs to match reality.*

**E1. Fix CHK-010 false positive and close closeable items (P1-TRC-01)**
- `../checklist.md`: Uncheck CHK-010 or rewrite its evidence to match reality; close CHK-015 (evidence exists); update summary counts

**E2. Truth-sync parent packet docs (P1-TRC-02)**
- `../tasks.md`: Mark T001-T016 as `[x]` with evidence references
- `../plan.md`: Check off Definition of Done items
- `../checklist.md`: Check off items now provable (CHK-005, CHK-006, CHK-007, CHK-008, CHK-009 after Phase A-D fixes)
- `../implementation-summary.md`: Update to reflect Phase 6 remediation work

**E3. Remove stale spec.md addendum (P1-TRC-03)**
- `../spec.md`: Remove the stale phase-parent addendum section (lines ~213+) with the "Phase 6 → Phase 7" placeholder; update phase map to include Phase 6

**E4. Close Phase 4 child packet (P1-CMP-01)**
- `../004-verification-and-standards/tasks.md`: Mark completed tasks
- `../004-verification-and-standards/implementation-summary.md`: Write actual completion summary replacing template stub
- `../004-verification-and-standards/plan.md`: Check off completed items

**E5. Add verification evidence for CHK-005/CHK-006 (P1-CMP-02)**
- Add or update tests that prove whole-tree ESM import hygiene (CHK-005) and emitted-artifact correctness (CHK-006)
- `../checklist.md`: Check off CHK-005 and CHK-006 with evidence

**Gate**: `validate.sh` passes on parent spec folder.

---

### Phase F: Final Verification
*Prove everything works together.*

- Run full workspace build + test suite
- Run runtime smokes: `node dist/context-server.js`, `node scripts/dist/memory/generate-context.js --help`
- Run targeted re-review of fixed areas (D3/D7 dimensions)
- Update this phase's implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command/Proof |
|-----------|-------|---------------|
| Package builds | All 3 packages | `npm run build --workspace=@spec-kit/shared`, `--workspace=@spec-kit/mcp-server`, `--workspace=@spec-kit/scripts` |
| Workspace tests | Full suite | `npm run test --workspace=@spec-kit/mcp-server`; `npm run test --workspace=@spec-kit/scripts` |
| Runtime smokes | Server + scripts | `node dist/context-server.js`; `node scripts/dist/memory/generate-context.js --help` |
| ESM wrapper proof | Fixed scripts | `node dist/scripts/map-ground-truth-ids.js`; `node dist/scripts/reindex-embeddings.js` |
| Security manual | Trust boundaries | Verify shared-memory auth, V-rule fail-closed, path boundary, scope preflight |
| Import hygiene | CHK-005/CHK-006 | New or updated tests asserting whole-tree import correctness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase A runtime fixes | Internal | Ready | Blocks all testing |
| Phase B security changes | Internal | Ready | Independent of A but test after A |
| Phase E doc sync | Internal | Blocked by A-D | Cannot truth-sync until code changes land |
| Phase 4 child packet | Internal | Ready | Only needs doc updates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Per-workstream rollback**: Each phase (A-E) is independently revertable via git
- **If security changes break saves**: Revert B2 (V-rule) first; it has the highest behavioral impact
- **If barrel narrowing breaks imports**: Revert C3 and audit consumers before retrying
- **If engine floor change breaks CI**: Revert A3 and document the Node 18 exception
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (runtime) ──┐
Phase B (security) ─┤
Phase C (reliability)┤──> Phase E (docs) ──> Phase F (verification)
Phase D (performance)┘
```

Phases A-D are independently implementable but must all complete before Phase E (docs) can truth-sync.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| A: Runtime correctness | Low-Medium | 2-3h |
| B: Security hardening | Medium | 3-5h |
| C: Reliability/Maintainability | Low-Medium | 2-3h |
| D: Performance | Low | 1-2h |
| E: Documentation truth-sync | Low | 1-2h |
| F: Final verification | Low | 1h |
| **Total** | **Medium** | **10-16h** |
<!-- /ANCHOR:effort -->
