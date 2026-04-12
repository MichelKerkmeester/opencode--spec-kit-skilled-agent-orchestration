---
title: "Tasks — Phase 013"
status: "planned"
level: 3
parent: "006-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 013 — Dead Code & Architecture Audit

---

## Phase 1: Scanning

- [ ] T001 Run `tsc --noUnusedLocals --noUnusedParameters` on mcp_server workspace
- [ ] T002 Run `tsc --noUnusedLocals --noUnusedParameters` on scripts workspace
- [ ] T003 Grep for dead concept branches: `shadow_only`, `dual_write`, `archived_hit_rate`, `observation_window` in active code (not schema column comments)
- [ ] T004 Grep for `console.log`/`console.error`/`console.warn` in production code (exclude tests)
- [ ] T005 Build import graph and identify circular dependencies
- [ ] T006 Identify orphaned `.ts` files (not imported, not tool-registered, not test files)

## Phase 2: Fix Pass

- [ ] T007 Remove unused imports across `mcp_server/handlers/`
- [ ] T008 Remove unused imports across `mcp_server/lib/`
- [ ] T009 Remove unused imports across `scripts/`
- [ ] T010 Remove dead concept branches found in T003
- [ ] T011 Replace `console.log`/`console.error` with structured logger in production code
- [ ] T012 Fix circular dependencies found in T005
- [ ] T013 Delete or document orphaned files found in T006
- [ ] T014 Verify import ordering follows sk-code-opencode convention

## Phase 3: Architecture + READMEs

- [ ] T015 Read and audit ARCHITECTURE.md against actual module layout
- [ ] T016 Add new Phase 006 modules to ARCHITECTURE.md (graph-metadata, resume-ladder, anchor-merge, content-router, atomic-index-memory)
- [ ] T017 Remove deleted modules from ARCHITECTURE.md (shared-memory, shared-spaces, canonical-continuity-rollout, canonical-continuity-shadow)
- [ ] T018 Verify handler → lib → storage layering (no wrong-layer imports)
- [ ] T019 Walk `mcp_server/` directories, create missing READMEs
- [ ] T020 Update stale READMEs with current directory contents
- [ ] T021 Verify new directories from Phase 006 have READMEs (lib/graph/, lib/resume/, lib/merge/, lib/routing/)

## Phase 4: Resource Map

- [ ] T022 Read `006-canonical-continuity-refactor/resource-map.md`
- [ ] T023 Add new file rows for phases 010-012
- [ ] T024 Remove rows for deleted files (shared-memory handler, shared-spaces lib, etc.)
- [ ] T025 Update verb/effort columns for modified files

## Phase 5: Verification

- [ ] T026 `npm run --workspace=@spec-kit/mcp-server typecheck` → pass
- [ ] T027 `npm run --workspace=@spec-kit/scripts typecheck` → pass
- [ ] T028 Run affected test files → pass
- [ ] T029 `validate.sh --strict` on phase 013 packet → pass
- [ ] T030 Final grep: zero dead concept references in active code
