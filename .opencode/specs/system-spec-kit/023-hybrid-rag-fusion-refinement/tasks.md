---
title: "Tasks: ESM Module Compliance [system-spec-kit/023-hybrid-rag-fusion-refinement/tasks]"
description: "Subsystem-grouped closure worklist for the completed shared plus mcp_server native ESM migration and remaining follow-on documentation convergence."
trigger_phrases:
  - "esm tasks"
  - "mcp_server esm migration tasks"
importance_tier: "normal"
contextType: "implementation"
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

- [x] T001 Update `shared/package.json` to package-local native ESM metadata and truthful exports - WHY: `shared` cannot stay CommonJS-shaped if it migrates with `mcp_server` - Acceptance: package metadata matches native ESM runtime behavior [EVIDENCE: Phase 1 — shared/package.json has "type":"module", ESM exports, root export updated to dist/index.js in Phase 6]
- [x] T002 Apply package-local TypeScript settings for `shared` ESM emit - WHY: authoring syntax alone does not change emitted runtime mode - Acceptance: `shared` emits native ESM without forcing the whole workspace to flip [EVIDENCE: Phase 1 — shared/tsconfig.json uses nodenext module/moduleResolution]
- [x] T003 Rewrite production `shared` imports and exports to runtime-valid ESM specifiers - WHY: Node ESM requires explicit runtime-valid relative specifiers - Acceptance: non-test `shared` sources no longer depend on extensionless relative imports/exports [EVIDENCE: Phase 1 — 48 import/export rewrites with .js specifiers]

### `@spec-kit/mcp-server` Metadata, Config, Import Rewrite, and CommonJS Cleanup

- [x] T004 Update `mcp_server/package.json` `type`, `main`, `exports`, and `bin` for native ESM - WHY: Node needs runtime metadata that matches the emitted package contract - Acceptance: public package surfaces reflect the locked ESM strategy [EVIDENCE: Phase 2 — mcp_server/package.json has "type":"module", ESM exports/bin]
- [x] T005 Apply package-local TypeScript settings for `mcp_server` ESM emit - WHY: `mcp_server` must emit truthful native ESM rather than CommonJS wrappers - Acceptance: emitted server entrypoints are native ESM [EVIDENCE: Phase 2 — mcp_server/tsconfig.json uses nodenext]
- [x] T006 Rewrite production `mcp_server` imports and exports to runtime-valid ESM specifiers - WHY: emitted runtime files must resolve under Node ESM rules - Acceptance: non-test `mcp_server` sources no longer depend on extensionless relative imports/exports [EVIDENCE: Phase 2 — 839 import rewrites across 181 files]
- [x] T007 Replace cross-package relative imports and CommonJS-only runtime assumptions in `mcp_server` - WHY: the server cannot rely on sibling-relative CommonJS behavior after the migration - Acceptance: package/subpath imports replace cross-package relative hops and CommonJS globals/path assumptions are removed from production runtime files [EVIDENCE: Phase 2 — __dirname/__filename replaced with import.meta equivalents, require() converted, JSON import attributes added]

### `@spec-kit/scripts` CommonJS Interoperability Work

- [x] T008 Keep `scripts/package.json` CommonJS while introducing explicit async interoperability boundaries - WHY: `scripts` must remain CommonJS as a package while consuming ESM siblings safely - Acceptance: scripts-owned runtime consumers no longer depend on direct CommonJS `require()` of ESM sibling packages [EVIDENCE: Phase 3 — scripts/package.json keeps "type":"commonjs"; runtime consumers cross into ESM with guarded async imports]
- [x] T009 Refactor scripts-side loaders, bridges, and API entrypoints to use the explicit interoperability boundary - WHY: package-level CommonJS retention is only safe if every affected call site crosses the new boundary correctly - Acceptance: `scripts -> shared` and `scripts -> mcp_server/api*` flows resolve through the new loader pattern [EVIDENCE: Phase 3 — workflow.ts and related save paths use async package-boundary loading; top-level-await blockers were removed]

### Test Rewrites for Old CommonJS-Emit Assumptions

- [x] T010 Rewrite module-sensitive tests that currently assert CommonJS output details - WHY: tests anchored to old emit shape can hide real runtime breakage after the migration - Acceptance: targeted suites assert runtime-truth behavior instead of `require(...)` / `exports` wrappers [EVIDENCE: Phase 4 — ESM test files updated, Phase 5 — all skipped/todo tests converted to real tests]
- [x] T011 Add or update scripts interop tests where current coverage is insufficient - WHY: scripts interoperability proof is required, not optional - Acceptance: scripts-owned tests exercise the explicit interop helpers and failing paths meaningfully [EVIDENCE: Phase 4/5 — scripts 483/483 tests pass, interop tests green]

### Highest-Risk Retest Surfaces

- [x] T012 Re-test the hottest recent runtime surfaces first - WHY: research identified these as the most likely regression zones under ESM path changes - Acceptance: the first targeted retests cover `memory-save.ts`, `memory-index.ts`, `shared-memory.ts`, `vector-index-store.ts`, `session-manager.ts`, `scripts/memory/generate-context.ts`, and `scripts/core/workflow.ts` [EVIDENCE: Phase 4/5 — all high-risk surfaces retested, mcp-server 8997/8997 + scripts 483/483 pass]
- [x] T013 Run the exact research verification matrix after subsystem work lands - WHY: packet closure depends on runtime proof, not just a successful import rewrite - Acceptance: all required root commands, workspace commands, targeted Vitest runs, runtime smokes, and scripts interop proofs from `research/research.md` pass [EVIDENCE: Phase 5 — 9480 total tests pass, runtime smokes verified]

### Deferred Standards-Doc Sync After Runtime Proof

- [x] T014 Update standards docs outside 023 only after runtime verification passes - WHY: standards should describe the verified implementation rather than the intended strategy - Acceptance: downstream standards docs remain deferred until T013 is complete, then sync from the final runtime truth [EVIDENCE: Phase 4 — standards docs updated from verified ESM state after verification matrix passed]
- [x] T015 Refresh `implementation-summary.md` with final runtime evidence at actual completion time - WHY: the packet summary should record what shipped and what passed, not only the planning state - Acceptance: summary captures the eventual runtime migration evidence without overstating progress early [EVIDENCE: implementation-summary.md records all 5 phases with runtime verification results]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Packet Completion Gate

- [x] T016 Close the packet only after runtime verification, scripts interoperability proof, and deferred standards-doc sync all exist - WHY: research made those gates mandatory - Acceptance: no implementation-pending caveat remains once the packet is actually completed [EVIDENCE: Root packet truth-sync now reflects the completed migration and closed child-phase record]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All pending runtime migration tasks marked `[x]`
- [x] `@spec-kit/shared` plus `@spec-kit/mcp-server` native ESM migration is proven by runtime verification
- [x] `@spec-kit/scripts` interoperability proof exists while the package remains CommonJS
- [x] Standards docs outside 023 are updated only after runtime proof passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research Source of Truth**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
