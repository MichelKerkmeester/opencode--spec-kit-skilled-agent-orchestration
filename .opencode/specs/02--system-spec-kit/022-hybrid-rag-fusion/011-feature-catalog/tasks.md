---
title: "Tasks: Feature Catalog Audit & Remediation"
---
# Tasks: Feature Catalog Audit & Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase A: Spec Folder Upgrade (L1 → L3)

- [x] T001 Run upgrade-level.sh --to 3
- [x] T002 Update description.json level to 3
- [x] T003 Rewrite spec.md for L3 audit scope (spec.md)
- [x] T004 Create plan.md with technical approach (plan.md)
- [x] T005 Rewrite tasks.md with new breakdown (tasks.md)
- [x] T006 Create decision-record.md with 3 ADRs (decision-record.md)
- [x] T007 Create checklist.md with audit checks (checklist.md)

---

## Phase B: Research Delegation (30 Agents) — COMPLETE

### Stream 1: Feature Verification (20 Codex Agents, GPT-5.4)

- [x] T010 [P] C01: Verify 01-retrieval — 9 files (scratch/verification-C01.md)
- [x] T011 [P] C02: Verify 02-mutation — 10 files (scratch/verification-C02.md)
- [x] T012 [P] C03: Verify 03-discovery + 04-maint + 05-lifecycle — 12 files (scratch/verification-C03.md)
- [x] T013 [P] C04: Verify 06-analysis + 07-evaluation — 9 files (scratch/verification-C04.md)
- [x] T014 [P] C05: Verify 08-bug-fixes (1-6) — 6 files (scratch/verification-C05.md)
- [x] T015 [P] C06: Verify 08-bug-fixes (7-11) — 5 files (scratch/verification-C06.md)
- [x] T016 [P] C07: Verify 09-eval-measurement (1-8) — 8 files (scratch/verification-C07.md)
- [x] T017 [P] C08: Verify 09-eval-measurement (9-14) — 6 files (scratch/verification-C08.md)
- [x] T018 [P] C09: Verify 10-graph-signal (1-5) — 5 files (scratch/verification-C09.md)
- [x] T019 [P] C10: Verify 10-graph-signal (6-11) + 11-scoring (1-4) — 10 files (scratch/verification-C10.md)
- [x] T020 [P] C11: Verify 11-scoring (5-10) — 6 files (scratch/verification-C11.md)
- [x] T021 [P] C12: Verify 11-scoring (11-17) — 7 files (scratch/verification-C12.md)
- [x] T022 [P] C13: Verify 12-query-intelligence — 6 files (scratch/verification-C13.md)
- [x] T023 [P] C14: Verify 13-memory-quality (1-9) — 9 files (scratch/verification-C14.md)
- [x] T024 [P] C15: Verify 13-memory-quality (10-16) — 7 files (scratch/verification-C15.md)
- [x] T025 [P] C16: Verify 14-pipeline (1-12) — 12 files (scratch/verification-C16.md)
- [x] T026 [P] C17: Verify 14-pipeline (13-21) — 9 files (scratch/verification-C17.md)
- [x] T027 [P] C18: Verify 15-retrieval-enhancements — 9 files (scratch/verification-C18.md)
- [x] T028 [P] C19: Verify 16-tooling + 17-governance — 10 files (scratch/verification-C19.md)
- [x] T029 [P] C20: Verify 18-ux-hooks + 19-decisions + 20-flags — 25 files (scratch/verification-C20.md)

### Stream 2: Gap Investigation (10 Codex Agents, GPT-5.3-Codex)

- [x] T030 [P] X01: Gaps #1-4 — Server & Ops — 4 confirmed, 3 new (scratch/investigation-X01.md)
- [x] T031 [P] X02: Gaps #5-9 — Save Path — 5 confirmed (scratch/investigation-X02.md)
- [x] T032 [P] X03: Gaps #10-13 — Discovery — 4 confirmed, 3 new (scratch/investigation-X03.md)
- [x] T033 [P] X04: Gaps #14-17 — Search — 2 confirmed, 2 false pos, 2 new (scratch/investigation-X04.md)
- [x] T034 [P] X05: Gaps #18-23 — Cognitive — 4 confirmed, 2 false pos, 3 new (scratch/investigation-X05.md)
- [x] T035 [P] X06: Gaps #24-31 — Scoring — 8 confirmed, 4 new (scratch/investigation-X06.md)
- [x] T036 [P] X07: Gaps #32-37 — Infra — 3 confirmed, 3 false pos, 3 new (scratch/investigation-X07.md)
- [x] T037 [P] X08: Gaps #38-42 — Storage — 5 confirmed, 5 new (scratch/investigation-X08.md)
- [x] T038 [P] X09: Gaps #43-48 — Search internals — 6 confirmed, 3 new (scratch/investigation-X09.md)
- [x] T039 [P] X10: Gaps #49-55 — Handlers — 7 confirmed, 3 new (scratch/investigation-X10.md)

---

## Phase C: Analysis & Synthesis — COMPLETE

- [x] T040 Parse all 30 scratch files and extract structured findings
- [x] T041 Create remediation-manifest.md (scratch/remediation-manifest.md)
- [x] T042 Cross-validate Stream 1 and Stream 2 findings (7 false positives identified)
- [x] T043 Create analysis-summary.md (scratch/analysis-summary.md)

**Key findings:**
- 180 features verified, 7 pass (3.9%), 173 need remediation
- 48/55 original gaps confirmed, 7 false positives, 29 new gaps discovered
- 3 invalid file paths affecting 55 snippet files (batch-fixable)
- 18 features need complete rewrite
- 49.4% description accuracy (below 95% target)

---

## Phase D: Documentation Update — COMPLETE

- [x] T050 Update tasks.md with concrete remediation items (this file)
- [x] T051 Update checklist.md with verification results
- [x] T052 Update plan.md with Phase C findings

---

## Phase E: Remediation Execution (FUTURE — from manifest)

### E1: Batch Fixes (P0 — Scriptable)
- [ ] T100 Global replace `retry.vitest.ts` → `retry-manager.vitest.ts` (52 snippets)
- [ ] T101 Remove `slug-utils.ts` reference (2 snippets: 13-memory-quality/04, 11)
- [ ] T102 Remove `check-architecture-boundaries.ts` reference (1 snippet: 16-tooling/02)
- [ ] T103 Run `replace-monolith-source-files.mjs` to sync monolith

### E2: Feature Rewrites (P1 — 18 features)
- [ ] T110 [P] Rewrite 02-mutation/07-namespace-management-crud-tools
- [ ] T111 [P] Rewrite 02-mutation/10-per-memory-history-log
- [ ] T112 [P] Rewrite 08-bug-fixes/08-mathmax-min-stack-overflow-elimination
- [ ] T113 [P] Rewrite 09-eval/14-cross-ai-validation-fixes
- [ ] T114 [P] Rewrite 10-graph/08-graph-and-cognitive-memory-fixes
- [ ] T115 [P] Rewrite 11-scoring/07-double-intent-weighting-investigation
- [ ] T116 [P] Rewrite 11-scoring/17-temporal-structural-coherence-scoring
- [ ] T117 [P] Rewrite 12-query/02-relative-score-fusion-in-shadow-mode
- [ ] T118 [P] Rewrite 13-quality/16-dry-run-preflight-for-memory-save
- [ ] T119 [P] Rewrite 14-pipeline/02-mpab-chunk-to-memory-aggregation
- [ ] T120 [P] Rewrite 14-pipeline/08-performance-improvements
- [ ] T121 [P] Rewrite 14-pipeline/10-legacy-v1-pipeline-removal
- [ ] T122 [P] Rewrite 14-pipeline/16-backend-storage-adapter-abstraction
- [ ] T123 [P] Rewrite 14-pipeline/18-atomic-write-then-index-api
- [ ] T124 [P] Rewrite 14-pipeline/21-atomic-pending-file-recovery
- [ ] T125 [P] Rewrite 17-governance/02-feature-flag-sunset-audit
- [ ] T126 [P] Rewrite 20-flags/01-1-search-pipeline-features-speckit
- [ ] T127 [P] Rewrite 20-flags/05-5-embedding-and-api

### E3: Description + Path Updates (P1 — 63 features)
- [ ] T130 [P] Update BOTH features across all 20 categories (per manifest)

### E4: Path-Only Updates (P1 — 81 features, post-batch)
- [ ] T140 [P] Verify remaining path issues after P0 batch fix

### E5: Description-Only Updates (P1 — 11 features)
- [ ] T150 [P] Update descriptions for 11 features (per manifest)

### E6: New Feature Entries (P2 — 48 confirmed + 29 new = 77 entries)
- [ ] T160 [P] Create snippet files for 48 confirmed original gaps
- [ ] T161 [P] Create snippet files for 29 newly discovered gaps

### E7: Final Sync
- [ ] T170 Run `replace-monolith-source-files.mjs` to sync monolith
- [ ] T171 Run file path validation: all paths must resolve

---

## Completion Criteria

- [x] All Phase A tasks `[x]`
- [x] All 30 agent reports exist and are non-empty
- [x] Remediation manifest produced
- [x] No `[B]` blocked tasks remaining
- [ ] Phase E remediation executed (separate workflow)

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Analysis Summary**: See `scratch/analysis-summary.md`
- **Remediation Manifest**: See `scratch/remediation-manifest.md`

---

## Merged Section: 016-feature-catalog-code-references Tasks

> **Merge note (2026-03-14)**: Originally `016-feature-catalog-code-references/tasks.md`.

# Tasks: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:phase-a -->
## Phase A: Cleanup Stale References

- [x] **T-A1**: Scan all `.ts` source files for sprint number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A2**: Scan all `.ts` source files for phase number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A3**: Scan all `.ts` source files for spec folder number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A4**: Review and categorize each stale reference (remove vs rewrite) [Evidence: Stale project-history references in non-test source comments were removed or reworded]
- [x] **T-A5**: Remove or rewrite all stale references [Evidence: Stale project-history references in non-test source comments were removed or reworded]
- [x] **T-A6**: Verify zero stale references remain [Evidence: Non-test source grep for stale refs returned no matches]
<!-- /ANCHOR:phase-a -->

<!-- ANCHOR:phase-b -->
## Phase B: Add Feature Catalog References

- [x] **T-B1**: Build file-to-feature catalog mapping from SOURCE FILES tables [Evidence: Mapping used for handler-wide and strong-match module annotations]
- [x] **T-B2**: Annotate handler files with `// Feature catalog: <name>` comments [Evidence: 40 handler `.ts` files and 40 handler files containing a `// Feature catalog:` comment]
- [x] **T-B3**: Annotate core lib modules with feature catalog references [Evidence: Additional mapped files in `mcp_server` received feature catalog comments where mapping was strong]
- [x] **T-B4**: Annotate shared algorithm modules with feature catalog references [Evidence: Additional mapped files in `shared` received feature catalog comments where mapping was strong]
- [x] **T-B5**: Annotate script modules with feature catalog references [Evidence: `mcp_server/scripts` coverage check passed (3 TypeScript scripts, all 3 annotated with `// Feature catalog:`)]
- [x] **T-B6**: Verify all references use name-only format (no numbers) [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
- [x] **T-B7**: TypeScript compile check (`tsc --noEmit`) [Evidence: `npm run typecheck` in `.opencode/skill/system-spec-kit` exited 0]
<!-- /ANCHOR:phase-b -->

<!-- ANCHOR:verification -->
## Verification

- [x] **T-V1**: Grep confirms zero sprint/phase/spec-number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-V2**: Grep confirms all `Feature catalog:` references use name-only format [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
- [x] **T-V3**: No runtime behavior changes (comment-only diff) [Evidence: Comment-only diff audit for `mcp_server` + `shared` returned `{"comment_only": true}`]
<!-- /ANCHOR:verification -->

<!-- ANCHOR:phase-c -->
## Phase C: CHK-012 Resolution, MODULE: Alignment, and Documentation

- [x] **T-C1**: Transform `// 1. NAME` headers to `// MODULE: Name` in all 228 non-test mcp_server .ts files [Evidence: Python batch transform applied; verify_alignment_drift.py returns 0 TS-MODULE-HEADER findings]
- [x] **T-C2**: Add `// MODULE: Name` headers to 82 scripts/ .ts files [Evidence: Headers added; verify_alignment_drift.py PASS]
- [x] **T-C3**: Add `// MODULE: Name` headers to 2 headerless files (session-transition.ts, ranking-contract.ts) [Evidence: Headers added manually]
- [x] **T-C4**: Add missing `// Feature catalog:` annotations to 91 unannotated files across lib/cognitive, lib/search, lib/eval, lib/telemetry, lib/storage, lib/scoring, lib/graph, shared/ [Evidence: Cross-validation: 124 unique annotations, 0 invalid names]
- [x] **T-C5**: Create feature catalog snippet `16--tooling-and-scripts/11-feature-catalog-code-references.md` [Evidence: File created with OVERVIEW, CURRENT REALITY, SOURCE FILES, METADATA, PLAYBOOK sections]
- [x] **T-C6**: Add H3 entry in main `feature_catalog.md` under Tooling section [Evidence: Entry added with Description, Current Reality, Source Files]
- [x] **T-C7**: Add manual testing playbook scenarios NEW-135..NEW-138 [Evidence: 4 scenarios added with grep traceability, name validity, multi-feature coverage, MODULE: compliance]
- [x] **T-C8**: Update playbook TOC range to NEW-001..NEW-138 and add coverage mappings [Evidence: TOC and section heading updated, 4 coverage mapping rows added]
- [x] **T-C9**: Add Code Conventions section to mcp_server/README.md [Evidence: MODULE: header and Feature catalog annotation conventions documented]
- [x] **T-C10**: Add traceability mention to system-spec-kit/README.md [Evidence: Brief mention added in MCP Server component description]
- [x] **T-C11**: Mark CHK-012 as complete in checklist.md [Evidence: CHK-012 marked [x] with 91 annotations and 0 invalid names evidence]
- [x] **T-C12**: TypeScript compile check (`tsc --noEmit`) [Evidence: `npx tsc --noEmit` in system-spec-kit exited 0]
<!-- /ANCHOR:phase-c -->
