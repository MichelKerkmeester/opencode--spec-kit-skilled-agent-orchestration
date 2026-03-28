---
title: "Tasks: ESM Module Compliance"
description: "Subsystem-grouped worklist for the pending shared plus mcp_server native ESM migration and the deferred standards-doc follow-on."
trigger_phrases:
  - "esm tasks"
  - "mcp_server esm migration tasks"
importance_tier: "standard"
contextType: "architecture"
---
# Tasks: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description - WHY - Acceptance`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Packet Sync

- [x] T000 Sync the Level 2 packet to the finished 20-iteration research - WHY: implementation work should start from the locked strategy, not the older docs-only framing - Acceptance: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` match `research/research.md` while still marking runtime migration as pending
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### `@spec-kit/shared` Metadata, Config, and Import Rewrite

- [ ] T001 Update `shared/package.json` to package-local native ESM metadata and truthful exports - WHY: `shared` cannot stay CommonJS-shaped if it migrates with `mcp_server` - Acceptance: package metadata matches native ESM runtime behavior
- [ ] T002 Apply package-local TypeScript settings for `shared` ESM emit - WHY: authoring syntax alone does not change emitted runtime mode - Acceptance: `shared` emits native ESM without forcing the whole workspace to flip
- [ ] T003 Rewrite production `shared` imports and exports to runtime-valid ESM specifiers - WHY: Node ESM requires explicit runtime-valid relative specifiers - Acceptance: non-test `shared` sources no longer depend on extensionless relative imports/exports

### `@spec-kit/mcp-server` Metadata, Config, Import Rewrite, and CommonJS Cleanup

- [ ] T004 Update `mcp_server/package.json` `type`, `main`, `exports`, and `bin` for native ESM - WHY: Node needs runtime metadata that matches the emitted package contract - Acceptance: public package surfaces reflect the locked ESM strategy
- [ ] T005 Apply package-local TypeScript settings for `mcp_server` ESM emit - WHY: `mcp_server` must emit truthful native ESM rather than CommonJS wrappers - Acceptance: emitted server entrypoints are native ESM
- [ ] T006 Rewrite production `mcp_server` imports and exports to runtime-valid ESM specifiers - WHY: emitted runtime files must resolve under Node ESM rules - Acceptance: non-test `mcp_server` sources no longer depend on extensionless relative imports/exports
- [ ] T007 Replace cross-package relative imports and CommonJS-only runtime assumptions in `mcp_server` - WHY: the server cannot rely on sibling-relative CommonJS behavior after the migration - Acceptance: package/subpath imports replace cross-package relative hops and CommonJS globals/path assumptions are removed from production runtime files

### `@spec-kit/scripts` CommonJS Interoperability Work

- [ ] T008 Keep `scripts/package.json` CommonJS while introducing explicit dynamic-import interoperability helpers - WHY: `scripts` must remain CommonJS as a package while consuming ESM siblings safely - Acceptance: scripts-owned runtime consumers no longer depend on direct CommonJS `require()` of ESM sibling packages
- [ ] T009 Refactor scripts-side loaders, bridges, and API entrypoints to use the explicit interoperability boundary - WHY: package-level CommonJS retention is only safe if every affected call site crosses the new boundary correctly - Acceptance: `scripts -> shared` and `scripts -> mcp_server/api*` flows resolve through the new loader pattern

### Test Rewrites for Old CommonJS-Emit Assumptions

- [ ] T010 Rewrite module-sensitive tests that currently assert CommonJS output details - WHY: tests anchored to old emit shape can hide real runtime breakage after the migration - Acceptance: targeted suites assert runtime-truth behavior instead of `require(...)` / `exports` wrappers
- [ ] T011 Add or update scripts interop tests where current coverage is insufficient - WHY: scripts interoperability proof is required, not optional - Acceptance: scripts-owned tests exercise the explicit interop helpers and failing paths meaningfully

### Highest-Risk Retest Surfaces

- [ ] T012 Re-test the hottest recent runtime surfaces first - WHY: research identified these as the most likely regression zones under ESM path changes - Acceptance: the first targeted retests cover `memory-save.ts`, `memory-index.ts`, `shared-memory.ts`, `vector-index-store.ts`, `session-manager.ts`, `scripts/memory/generate-context.ts`, and `scripts/core/workflow.ts`
- [ ] T013 Run the exact research verification matrix after subsystem work lands - WHY: packet closure depends on runtime proof, not just a successful import rewrite - Acceptance: all required root commands, workspace commands, targeted Vitest runs, runtime smokes, and scripts interop proofs from `research/research.md` pass

### Deferred Standards-Doc Sync After Runtime Proof

- [ ] T014 Update standards docs outside 023 only after runtime verification passes - WHY: standards should describe the verified implementation rather than the intended strategy - Acceptance: downstream standards docs remain deferred until T013 is complete, then sync from the final runtime truth
- [ ] T015 Refresh `implementation-summary.md` with final runtime evidence at actual completion time - WHY: the packet summary should record what shipped and what passed, not only the planning state - Acceptance: summary captures the eventual runtime migration evidence without overstating progress early
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Packet Completion Gate

- [ ] T016 Close the packet only after runtime verification, scripts interoperability proof, and deferred standards-doc sync all exist - WHY: research made those gates mandatory - Acceptance: no implementation-pending caveat remains once the packet is actually completed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All pending runtime migration tasks marked `[x]`
- [ ] `@spec-kit/shared` plus `@spec-kit/mcp-server` native ESM migration is proven by runtime verification
- [ ] `@spec-kit/scripts` interoperability proof exists while the package remains CommonJS
- [ ] Standards docs outside 023 are updated only after runtime proof passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research Source of Truth**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
