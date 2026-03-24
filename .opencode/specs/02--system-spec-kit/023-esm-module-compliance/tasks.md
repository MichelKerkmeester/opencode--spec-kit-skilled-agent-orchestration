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

- [ ] T001 Choose and implement the final `mcp_server` ESM strategy in compiler config - WHY: source syntax alone does not change the runtime module system - Acceptance: `tsconfig` and any workspace overrides emit ESM for `mcp_server`
- [ ] T002 Update `.opencode/skill/system-spec-kit/mcp_server/package.json` entrypoints and metadata - WHY: Node needs package metadata that matches the emitted module format - Acceptance: `main`, `exports`, and `bin` resolve correctly under the chosen ESM runtime
- [ ] T003 Preserve or explicitly isolate `scripts/` CommonJS behavior - WHY: the memory CLI must keep working while `mcp_server` migrates - Acceptance: `scripts/` runtime expectations remain stable or an approved follow-up spec is created

### Source Migration

- [ ] T004 Rewrite non-test relative imports/exports in `mcp_server/**/*.ts` - WHY: Node ESM requires runtime-valid relative specifiers - Acceptance: production files no longer rely on extensionless relative imports/exports
- [ ] T005 Normalize barrel exports and deep relative paths - WHY: re-export chains are a common hidden breakage point during ESM migration - Acceptance: barrel files and nested imports resolve correctly under the new module mode
- [ ] T006 Update test imports and module-resolution-sensitive tooling - WHY: mixed `.js` and extensionless paths can hide regressions - Acceptance: targeted tests and local tooling resolve the same paths as production code
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verification and Documentation

- [ ] T007 Run build, typecheck, and targeted server verification - WHY: emitted runtime behavior matters more than source syntax - Acceptance: the required commands pass and `dist/context-server.js` is confirmed to be ESM
- [ ] T008 Update `.opencode/skill/sk-code--opencode/SKILL.md` and any related decision docs - WHY: standards should describe the architecture that actually shipped - Acceptance: docs no longer present CommonJS-only assumptions for `mcp_server`
- [ ] T009 Refresh `implementation-summary.md` with final migration evidence - WHY: the spec folder should preserve how the refactor was completed and verified - Acceptance: summary records what changed, what passed, and any remaining limitations
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All migration tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain for the chosen phase boundary
- [ ] Runtime verification proves ESM output, not just ESM-style source syntax
- [ ] Standards docs and the spec package match the final implementation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
