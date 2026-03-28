---
title: "Tasks: ESM Module Compliance"
description: "Task breakdown for the real mcp_server ESM compliance refactor and the follow-on standards updates."
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

### Analysis and Spec Refresh

- [x] T000 Refresh the spec package with current-state evidence - WHY: the previous docs understated the work by framing this as a standards-only change - Acceptance: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` describe the real runtime migration scope and verification needs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Toolchain and Package Alignment

- [ ] T001 Implement the locked package-local NodeNext strategy in `shared` and `mcp_server` compiler config - WHY: source syntax alone does not change the runtime module system - Acceptance: package-local `tsconfig` files emit ESM for both packages without flipping the workspace root
- [ ] T002 Update `.opencode/skill/system-spec-kit/shared/package.json` exports and metadata - WHY: Node needs package metadata that matches the emitted module format - Acceptance: shared public surfaces resolve correctly under native ESM
- [ ] T003 Update `.opencode/skill/system-spec-kit/mcp_server/package.json` entrypoints and metadata - WHY: Node needs package metadata that matches the emitted module format - Acceptance: `main`, `exports`, and `bin` resolve correctly under the chosen ESM runtime
- [ ] T004 Preserve `scripts/` CommonJS behavior through explicit interoperability loaders - WHY: the memory CLI and scripts-owned entrypoints must keep working while sibling packages migrate - Acceptance: `scripts/` runtime expectations stay stable without direct `require()` of ESM sibling packages

### Source Migration

- [ ] T005 Rewrite non-test relative imports/exports in `shared/**/*.ts` - WHY: Node ESM requires runtime-valid relative specifiers in every emitted sibling package - Acceptance: shared production files no longer rely on extensionless relative imports/exports
- [ ] T006 Rewrite non-test relative imports/exports in `mcp_server/**/*.ts` - WHY: Node ESM requires runtime-valid relative specifiers - Acceptance: production server files no longer rely on extensionless relative imports/exports
- [ ] T007 Replace cross-package relative imports and CommonJS-only globals in `mcp_server` runtime files - WHY: package metadata alone does not fix ESM-incompatible code shape or sibling-boundary leaks - Acceptance: high-risk files such as `v-rule-bridge.ts`, `memory-crud-health.ts`, `core/config.ts`, and `lib/errors/core.ts` resolve paths and modules safely under ESM and use package/subpath imports across package boundaries
- [ ] T008 Normalize barrel exports, deep relative paths, scripts-side interop call sites, and dist-sensitive test imports/assertions - WHY: re-export chains, internal CommonJS callers, and CommonJS-emit assertions are common hidden breakage points during ESM migration - Acceptance: barrel files, internal scripts modules, nested imports, and module-sensitive tests resolve the same paths as production code
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verification and Documentation

- [ ] T009 Run deterministic root and workspace verification commands - WHY: emitted runtime behavior matters more than source syntax and the root scripts require `--workspaces=false` in this environment - Acceptance: the exact matrix from `research/research.md` passes for typecheck, CLI, build, and targeted Vitest coverage
- [ ] T010 Run direct boundary smoke tests for `node dist/context-server.js`, scripts CLI entrypoints, and high-risk bridge handlers - WHY: package metadata and tests can still pass while runtime path resolution breaks - Acceptance: direct startup and targeted handler/interoperability smokes prove the mixed-module boundary is safe
- [ ] T011 Update `.opencode/skill/sk-code--opencode/SKILL.md` and any related decision docs - WHY: standards should describe the architecture that actually shipped - Acceptance: docs no longer present CommonJS-only assumptions for `shared` / `mcp_server`
- [ ] T012 Refresh `implementation-summary.md` with final migration evidence - WHY: the spec folder should preserve how the refactor was completed and verified - Acceptance: summary records what changed, what passed, and any remaining limitations
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All migration tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain for the chosen phase boundary
- [ ] Runtime verification proves ESM output and CommonJS interoperability, not just ESM-style source syntax
- [ ] Standards docs and the spec package match the final implementation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
