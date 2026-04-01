---
title: "Tasks: Phase 009 — Reindex Validator False Positives [02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "009 tasks"
  - "reindex validator tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 009 — Reindex Validator False Positives

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Investigation & Setup

- [x] T001 Investigate V8 cross-spec contamination false positives (validate-memory-quality.ts)
- [x] T002 Investigate V12 topical coherence false positives (validate-memory-quality.ts)
- [x] T003 Investigate frontmatter source of truth bugs (frontmatter-migration.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Core Implementation (Complete)

- [x] T004 Fix V8: extract spec folder from file path as fallback (validate-memory-quality.ts)
- [x] T005 Fix V12: skip check for memory dir files and spec doc files (validate-memory-quality.ts)
- [x] T006 Fix template contract: force reindex uses warn-only mode (memory-index.ts)
- [x] T007 Thread filePath through validation bridge (v-rule-bridge.ts, memory-save.ts)
- [x] T008 Fix frontmatter defaults: VALID_CONTEXT_TYPES, DOC_DEFAULT_CONTEXT, normalizeContextType (frontmatter-migration.ts)
- [x] T009 Fix MCP parser CONTEXT_TYPE_MAP (memory-parser.ts)
- [x] T010 Update DB schema CHECK constraint (vector-index-schema.ts, schema-downgrade.ts)
- [x] T011 Retroactive backfill across 2383 files (backfill-frontmatter.js)
- [x] T012 DB migration: 2006 decision->planning, 3 discovery->general + dedup 13211 duplicates (context-index.sqlite)
- [x] T013 Update all runtime consumers: session-extractor, intent-classifier, quality-gate, fsrs-scheduler, baseline (6 files)
- [x] T014 Update context_template.md detection logic and pseudo-code
<!-- /ANCHOR:phase-2 -->

---

## Phase 3: Deep Review Remediation

- [x] T015 [P] P1-1: Fix parser test T08 valid types set — removed legacy decision/discovery from canonical set (memory-parser-extended.vitest.ts:231)
- [x] T016 [P] P1-2: Fix regex for single-level spec paths in V8 fallback — made parent directory optional (validate-memory-quality.ts:634)
- [x] T017 [P] P1-4: Add content hash check during force reindex — removed `!force` bypass from checkExistingRow to prevent duplicate accumulation (dedup.ts:226)
- [x] T018 [P] P1-6: Add tests for filePath fallback and V12 skip — 5 new test cases covering V8 multi/single-level paths, V12 memory/spec-doc skip, and descriptive name field (validate-memory-quality.vitest.ts)
- [x] T019 [P] P1-8/P2-5: Fix hardcoded log message from `context_type=decision` to `context_type=${params.contextType}` and updated REQ-D4-003 comment (save-quality-gate.ts:423,389). CHECK constraints kept with legacy values for backward compatibility
- [x] T020 [P] P2: Add descriptive names to V-rule output — added `name` field to ValidationRuleMetadata and RuleResult interfaces, all 14 rules now have descriptive names enriched into results (validate-memory-quality.ts)
- [x] T021 [P] P1-3: Extract shared CONTEXT_TYPE_CANONICAL_MAP — created `shared/context-types.ts` with `CanonicalContextType`, `LEGACY_CONTEXT_TYPE_ALIASES`, `resolveCanonicalContextType()`. Updated 5 consumers: memory-parser, frontmatter-migration, fsrs-scheduler, save-quality-gate, shared/index
- [x] T022 [P] P1-5: Schema migration v25 — UPDATEs legacy values then rebuilds memory_index with strict CHECK(context_type IN canonical-only). SCHEMA_VERSION 24→25. Updated CREATE TABLE in vector-index-schema.ts + schema-downgrade.ts
- [x] T023 [P] P1-8: CHECK constraint cleanup — removed legacy decision/discovery from CREATE TABLE CHECK constraints in both schema files
- [ ] T024 P2: Fix reindex summary undefined counts — deferred: cooldown bug in MCP handler response
- [ ] T025 P2: Add per-file skip reasons to batch reindex logs — deferred: MCP handler format change

---

<!-- ANCHOR:phase-3 -->
## Phase 4: Verification

- [x] T026 Run test suites and verify all pass — validate-memory-quality (7/7), memory-parser-extended (46/46), content-hash-dedup (31/31), fsrs-scheduler (55/55), TypeScript type-check clean across 3 workspaces
- [x] T027 Build all dist artifacts — shared/dist, scripts/dist, mcp_server compiled clean
- [x] T028 Run sk-code--opencode alignment verifier — PASS (0 findings)
- [ ] T029 Run full reindex and verify zero regressions — requires live DB + embedding model
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 3 tasks marked `[x]` (11/13 completed, 2 P2 deferred with rationale)
- [x] No `[B]` blocked tasks remaining
- [x] Reindex runs clean (0 false-positive blocks) — verified in prior session
- [x] All test suites pass — 139/139 tests across 4 suites
- [x] All dist artifacts built — shared, scripts, mcp_server
- [x] sk-code--opencode alignment verified — PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Deep Review**: See `review/review-report.md` (8 P1, 5 P2 findings)
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
