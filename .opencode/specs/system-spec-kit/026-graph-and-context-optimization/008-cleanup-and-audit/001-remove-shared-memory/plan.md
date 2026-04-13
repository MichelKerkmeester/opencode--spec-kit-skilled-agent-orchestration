---
title: "018 / 010 — Shared memory removal plan"
description: "Execution plan for deleting the shared-memory lifecycle, shared-space runtime, and all related documentation/test surfaces while preserving the schema-column exception."
trigger_phrases: ["018 010 plan", "shared memory removal plan", "hard delete shared memory plan"]
importance_tier: "critical"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Defined the execution plan for the hard-delete pass"
    next_safe_action: "Review implementation-summary.md for exact verification output"
    key_files: ["plan.md", "tasks.md", "implementation-summary.md"]
---
# Implementation Plan: 018 / 010 — Remove shared memory

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP runtime, Markdown docs, Vitest test suite, shell validation |
| **Framework** | `system-spec-kit`, Spec Kit Memory MCP |
| **Storage** | SQLite schema definitions plus packet docs |
| **Testing** | Workspace typecheck, workspace build, Vitest, strict packet validation, final grep |

### Overview
This phase removes shared memory in four slices: tool surface, runtime plumbing, documentation/catalog/playbook surface, and tests. The implementation keeps only the unavoidable schema columns in `vector-index-schema.ts`, with the requested one-line comment on the `memory_index.shared_space_id` definition.

The refactor stays deletion-first. If a file becomes trivial after shared-memory removal, the file is deleted. If a shared-memory-only doc or test exists, it is deleted rather than marked inactive.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Shared-memory runtime, docs, and tests were mapped through direct file reads and repo-wide `rg` sweeps.
- [x] The phase packet defines the hard-delete scope and the schema-column exception clearly.
- [x] Dirty-tree scope was checked so unrelated edits in sibling phase folders remain untouched.

### Definition of Done
- [x] Shared-memory lifecycle tools and runtime files are removed.
- [x] `sharedSpaceId` request plumbing is removed from active runtime paths.
- [x] Shared-memory docs, catalog rows, playbook scenarios, and shared-only tests are deleted or cleaned.
- [x] Requested verification commands and final grep pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Delete feature surface, then simplify shared contracts back to non-shared governance only.

### Key Components
- **Lifecycle surface**: `tools/lifecycle-tools.ts`, `tools/types.ts`, `schemas/tool-input-schemas.ts`, and `tool-schemas.ts`.
- **Runtime surface**: `handlers/index.ts`, `handlers/memory-save.ts`, `handlers/memory-search.ts`, `handlers/memory-context.ts`, `handlers/memory-triggers.ts`, checkpoints, preflight, and search pipeline helpers.
- **Deleted modules**: `handlers/shared-memory.ts`, `lib/collab/shared-spaces.ts`, shared-space documentation folders, and shared-memory-only tests.
- **Documentation surface**: command docs, MCP docs, skill docs, feature catalog, manual testing playbook, and master indices.

### Data Flow
1. Remove shared-memory tools and dedicated shared-space modules.
2. Remove `sharedSpaceId` from live tool contracts and the internal scope types they feed.
3. Trim save/search/checkpoint/preflight logic so only tenant, user, agent, and session scope remain.
4. Delete the shared-memory documentation inventory and shared-only tests.
5. Verify with typecheck, build, tests, strict packet validation, and final grep.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet setup
- [x] Create the `010-remove-shared-memory` phase folder and populate the required Level 2 docs.
- [x] Anchor the packet to the user’s hard-delete instruction set and verification contract.

### Phase 2: Tool and runtime removal
- [x] Remove shared-memory lifecycle tool registrations, schemas, and type definitions.
- [x] Delete the shared-memory handler and shared-space collaboration library.
- [x] Remove shared-space-specific imports, exports, filters, and request parameters from the remaining runtime.

### Phase 3: Documentation and test cleanup
- [x] Remove the `shared` subcommand docs and shared-memory README/catalog/playbook surfaces.
- [x] Delete shared-memory-only tests and trim mixed tests so they no longer reference shared memory.

### Phase 4: Verification and closeout
- [x] Run the requested typecheck, build, tests, strict packet validation, and final grep checks.
- [x] Capture the verification results and final file inventory in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | MCP server and scripts workspaces | `npm run --workspace=@spec-kit/mcp-server typecheck`, `npm run --workspace=@spec-kit/scripts typecheck` |
| Build | Scripts workspace | `npm run build --workspace=@spec-kit/scripts` |
| Tests | Remaining test suite after deletions | workspace Vitest run |
| Packet validation | Phase packet docs | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <010-folder>` |
| Final audit | Shared-memory residue check | operator-specified `grep -rn ...` command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shared-memory references are exhaustively located first | Internal | Green | Missing one leaves broken imports or grep residue. |
| `vector-index-schema.ts` keeps the schema-column exception | Internal | Green | Removing live references while keeping schema compatibility depends on this file staying consistent. |
| Test suite updates match deleted runtime/docs surface | Internal | Yellow | Shared-only or mixed tests can fail after the runtime delete if not trimmed. |
| Master indices are updated after entry deletions | Internal | Yellow | Deleted catalog/playbook files leave broken index rows if not cleaned. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typecheck, build, tests, or final grep fails because a shared-memory dependency is still wired into the remaining runtime.
- **Procedure**: Fix the dangling reference immediately in scope. Do not restore the shared-memory feature or replace it with deprecation code paths.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Packet setup -> Tool/runtime delete -> Docs/tests cleanup -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet setup | Existing parent packet | Implementation and validation evidence |
| Tool/runtime delete | Packet setup | Docs/tests cleanup, verification |
| Docs/tests cleanup | Tool/runtime delete | Final verification |
| Verification | Tool/runtime delete, docs/tests cleanup | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet setup | Low | <1 hour |
| Tool/runtime delete | High | 4-6 hours |
| Docs/tests cleanup | High | 3-5 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **One concentrated implementation pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All target files were read before editing or deleting them.
- [x] The delete list includes both code and documentation/test surfaces.
- [x] The schema-column exception is isolated to `vector-index-schema.ts`.

### Rollback Procedure
1. Fix broken imports or contract mismatches inside the active scope.
2. Re-run the failing verification command.
3. Repeat until the runtime is clean and the final grep only leaves the allowed schema/doc hits.
4. Do not reintroduce shared-memory behavior to make a failing test pass.

### Data Reversal
- **Has data migrations?** No new migrations. Existing schema columns stay in place.
- **Reversal procedure**: N/A for this phase because the change is a hard delete of runtime/doc surfaces, not a reversible rollout toggle.
<!-- /ANCHOR:enhanced-rollback -->
