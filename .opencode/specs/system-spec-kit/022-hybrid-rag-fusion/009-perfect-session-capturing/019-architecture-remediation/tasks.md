---
title: "Tasks [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/019-architecture-remediation/tasks]"
description: "Task breakdown for 15-agent architecture audit of the perfect-session-capturing subsystem."
trigger_phrases:
  - "019 tasks"
  - "architecture remediation tasks"
  - "wave 1 agents"
  - "wave 3 synthesis"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Architecture Remediation Deep Dive

<!-- SPECKIT_LEVEL: 3 -->
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
## Phase 1: Setup

- [x] T001 Upgrade spec folder to Level 3 (spec.md)
- [x] T002 Create Level 3 skeleton files — tasks.md, checklist.md, decision-record.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Wave 1+2 Analysis (Parallel) — 10 agents producing raw findings.*

- [x] T003 [P] CODEX-A1: Core pipeline logic analysis (scratch/codex-1-core-pipeline.md)
- [x] T004 [P] CODEX-A2: Extractor system & JSON-primary flow (scratch/codex-2-extractors.md)
- [x] T005 [P] CODEX-A3: Type system & contract safety (scratch/codex-3-utils-lib.md)
- [x] T006 [P] CODEX-A4: Test & eval coverage gaps (scratch/codex-4-memory-system.md)
- [x] T007 [P] CODEX-A5: Memory system & MCP handlers (scratch/codex-5-tests-evals.md)
- [x] T008 [P] OPUS-A1: Architecture boundary analysis (scratch/opus-1-phase-tree.md)
- [x] T009 [P] OPUS-A2: Spec-to-code alignment (scratch/opus-2-spec-alignment.md)
- [x] T010 [P] OPUS-A3: Phase tree & metadata consistency (scratch/opus-3-architecture.md)
- [x] T011 [P] OPUS-A4: Git diff impact analysis (scratch/opus-4-git-diff.md)
- [x] T012 [P] OPUS-A5: Duplicate code & technical debt (scratch/opus-5-type-system.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

*Wave 3 Synthesis — 5 agents validating and synthesizing all findings.*

- [x] T013 OPUS-B1: Prior findings verification — validated 197 unique findings (109 persist, 7 fixed, 53 new) against current HEAD
- [x] T014 OPUS-B2: Remediation priority matrix — 8-sprint plan, 197 findings scored and assigned (scratch/wave3-priority-matrix.md)
- [x] T015 OPUS-B3: Decision record synthesis — 8 ADRs produced (scratch/wave3-decision-records.md)
- [x] T016 OPUS-B4: Checklist generation — 90 CHK items generated: 15 P0, 31 P1, 44 P2 (scratch/wave3-checklist.md)
- [x] T017 OPUS-B5: Research compilation — supporting evidence aggregated per sprint
<!-- /ANCHOR:phase-3 -->

---

### Phase 4: Documentation

- [x] T018 Populate Level 3 docs from Wave 3 output — update plan.md, decision-record.md, checklist.md, spec.md, tasks.md, description.json
- [ ] T019 Run validate.sh on spec folder and resolve any errors

---

### Phase 5: Remediation

*Sprint-organized remediation tasks — derived from Wave 3 OPUS-B2 priority matrix.*

- [ ] T020 [P] Sprint S1: Critical/Blocking Fixes — stale dist artifacts, test-scripts-modules.js assertions, broken ops scripts, ast-parser import, dist rebuild, tree-thinning threshold (22 findings, 4-6h, CRITICAL)
- [ ] T021 [P] Sprint S2: Data Integrity & Race Conditions — V-rule fail-closed, concurrent save race, atomic post-commit rewrites, workflow filesystem lock, JSON-mode validation, tree-thinning token counts (18 findings, 8-12h, HIGH)
- [ ] T022 [P] Sprint S3: Type System Cleanup — ConversationPhase/FileEntry/UserPrompt/ExchangeSummary/Observation naming collisions, ToolCounts closed union, LoadedData discriminated union, unsafe casts, non-null assertions, legacy quality scorer (24 findings, 6-8h, HIGH)
- [ ] T023 [P] Sprint S4: Architecture Remediation — break 4 circular deps via config/ facade, remove utils/ re-export shims, consolidate workflow.ts barrel imports, wire cli-capture-shared.ts, add lib/index.ts barrel (23 findings, 8-12h, HIGH)
- [ ] T024 [P] Sprint S5: Spec/Metadata Alignment — backfill status fields in 20 description.json, fix phase labels 011-014, update denominators, add 019 to root index, write check-phase-metadata.ts lint script (30 findings, 4-6h, MEDIUM)
- [ ] T025 [P] Sprint S6: Dead Code Deletion & Consolidation — delete deprecated eval script refs from READMEs, delete deprecated ops scripts, delete dead exports, snake_case alias cleanup, renderer internal exports (28 findings, 6-8h, MEDIUM)
- [ ] T026 [P] Sprint S7: Test Coverage Gaps — add tests for untested memory modules and helpers, fix SessionData fixture, add architecture-boundary test cases, fix silent test skips, add malformed transcript cases (26 findings, 6-8h, LOW)
- [ ] T027 [P] Sprint S8: Extractor Parity & Quality Gates — standardize session targeting, thread structured JSON fields, fix contamination filter gaps, add quality-loop dimension floors, fix KEY_FILES list, fix recency factor (26 findings, 6-8h, LOW)

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Wave 3 tasks (T013-T017) marked `[x]`
- [x] All 197 unique findings verified with persist/fixed/new status
- [x] Level 3 documentation populated from Wave 3 synthesis (T018)
- [ ] No `[B]` blocked tasks remaining
- [ ] validate.sh exits 0 or 1 (no exit 2 errors)
- [ ] All remediation sprints (T020-T027) marked `[x]` (Phase 5 pending)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (Sprint 1-6 remediation order)
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Raw Findings**: See `scratch/` (10 Wave 1 agent outputs)
<!-- /ANCHOR:cross-refs -->
