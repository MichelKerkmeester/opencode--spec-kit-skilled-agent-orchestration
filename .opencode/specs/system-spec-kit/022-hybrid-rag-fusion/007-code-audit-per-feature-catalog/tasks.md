---
title: "Tasks: Code Audit per Feature [system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/tasks]"
description: "Master task list for the full code audit across 22 child folders"
trigger_phrases:
  - "tasks"
  - "code audit"
importance_tier: "important"
contextType: "general"
---
# Tasks: Code Audit per Feature Catalog

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create Level 3 spec folders for all 23 spec folders (parent + 22 children)
- [x] T002 Verify feature catalog currency — 19 categories, 222 live features confirmed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Audit 001-retrieval (11 live features; 10 audited, 1 pending coverage sync) — 8 MATCH, 2 PARTIAL
- [x] T004 Audit 002-mutation (10 features) — 8 MATCH, 2 PARTIAL
- [x] T005 Audit 003-discovery (3 features) — 2 MATCH, 1 PARTIAL
- [x] T006 Audit 004-maintenance (2 features) — 1 MATCH, 1 PARTIAL
- [x] T007 Audit 005-lifecycle (7 features) — 4 MATCH, 3 PARTIAL
- [x] T008 Audit 006-analysis (7 features) — 5 MATCH, 2 PARTIAL
- [x] T009 Audit 007-evaluation (2 features) — 1 MATCH, 1 PARTIAL
- [x] T010 Audit 008-bug-fixes-and-data-integrity (11 features) — 9 MATCH, 2 PARTIAL
- [x] T011 Audit 009-evaluation-and-measurement (14 features) — 11 MATCH, 3 PARTIAL
- [x] T012 Audit 010-graph-signal-activation (16 features) — 12 MATCH, 4 PARTIAL
- [x] T013 Audit 011-scoring-and-calibration (22 features) — 20 MATCH, 2 PARTIAL
- [x] T014 Audit 012-query-intelligence (11 features) — 8 MATCH, 3 PARTIAL
- [x] T015 Audit 013-memory-quality-and-indexing (24 features) — 20 MATCH, 4 PARTIAL
- [x] T016 Audit 014-pipeline-architecture (22 features) — 19 MATCH, 3 PARTIAL
- [x] T017 Audit 015-retrieval-enhancements (9 features) — 8 MATCH, 1 PARTIAL
- [x] T018 Audit 016-tooling-and-scripts (17 features) — 16 MATCH, 1 PARTIAL
- [x] T019 Audit 017-governance (4 features) — 3 MATCH, 1 PARTIAL
- [x] T020 Audit 018-ux-hooks (19 features) — 17 MATCH, 2 PARTIAL
- [x] T021 Audit 020-feature-flag-reference (7 features) — 6 MATCH, 1 PARTIAL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Complete 019-decisions-and-deferrals analysis — 4 decisions, 4 deferrals, 4 deprecated modules
- [x] T023 Complete 021-remediation-revalidation tracking — prioritized backlog documented
- [x] T024 Inventory 022-implement-and-remove-deprecated-features under umbrella ownership — downstream child tracked

---

### Phase 4: Synthesis

- [x] T025 Cross-phase dependency analysis — shared patterns identified across all phases
- [x] T026 Master audit findings report — implementation-summary.md in all 23 spec folders
<!-- /ANCHOR:phase-3 -->

---

### Phase 5: Deep Research Remediation (2026-03-26)

> Source: 12-agent deep research (~3.3M tokens GPT-5.4 via Codex CLI).
> Full findings: `../006-feature-catalog/research/deep-research-gap-report-2026-03-26.md`, `../006-feature-catalog/research/deep-research-round2-2026-03-26.md`.

### 5A: Stale Metadata Fixes

- [x] T030 Update umbrella spec feature count from 218 to 222 across spec.md, plan.md, and phase docs — updated in spec.md (frontmatter, problem statement, complexity) and checklist.md
- [x] T031 Update SC-001 to "222 of 222" — all 222 features now have explicit audit findings across all phases

### 5B: Audit 5 Unaudited Snippets

- [x] T032 Audit `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md` → MATCH — added to 001-retrieval/implementation-summary.md. All source files exist and match catalog description.
- [x] T033 Audit `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md` → MATCH — added to 016-tooling/implementation-summary.md. 3-layer defense-in-depth system verified across 7 source files.
- [x] T034 Review `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md` → META — reclassified as meta note in 020/implementation-summary.md. Explicitly excluded from accuracy scoring per file header.
- [x] T035 Review `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md` → MATCH — not a stub. Full catalog entry documenting runtime remediation surface. Added to 021/implementation-summary.md. 7 source files verified.
- [x] T036 Review `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md` → MATCH — not a stub. Full catalog entry documenting retired runtime shims. Added to 022/implementation-summary.md. 5 source files verified.

### 5C: Audit 13 BOTH_MISSING Capabilities

- [x] T037 Audit `mcp_server/api/index.ts` (112 lines) → assigned to 016-tooling. ARCH-1 barrel export, central API surface. No separate catalog entry needed.
- [x] T038 Audit `mcp_server/api/eval.ts` (31 lines) → assigned to 009-evaluation. Stable re-export for ablation/BM25/ground-truth. No separate catalog entry needed.
- [x] T039 Audit `mcp_server/api/indexing.ts` (63 lines) → assigned to 004-maintenance. Public indexing runtime bootstrap. No separate catalog entry needed.
- [x] T040 Audit `mcp_server/api/search.ts` (21 lines) → assigned to 001-retrieval. Stable re-export for search functionality. No separate catalog entry needed.
- [x] T041 Audit `mcp_server/api/providers.ts` (14 lines) → assigned to 014-pipeline. Embedding providers re-export. No separate catalog entry needed.
- [x] T042 Audit `scripts/spec/check-completion.sh` (414 lines) → assigned to 016-tooling. Checklist completion verification rule.
- [x] T043 Audit `scripts/ops/runbook.sh` (170 lines) → assigned to 016-tooling. Operational runbook for 4 failure classes.
- [x] T044 Audit `scripts/evals/run-ablation.ts` (182 lines) → assigned to 007-evaluation. Ablation study runtime entry point.
- [x] T045 Audit `config/config.jsonc` (159 lines) → assigned to 020-feature-flag. Runtime configuration (Section 1 active, rest documentation-only).
- [x] T046 Audit `config/filters.jsonc` (53 lines) → assigned to 020-feature-flag. Content filter pipeline configuration.
- [x] T047 Audit `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` (107 lines) → assigned to 017-governance. Constitutional memory for mandatory gate enforcement.
- [x] T048 Audit `.opencode/skill/system-spec-kit/nodes/phase-system.md` (108 lines) → assigned to 016-tooling. Phase decomposition knowledge node.
- [x] T049 Note `mcp_server/api/storage.ts` (10 lines) → NOT dead code. Minimal re-export facade for storage initialization. Skip formal audit.

### 5D: Audit 2 AUDIT_MISSING Items

- [x] T050 Formally audit `scripts/spec/create.sh` (~690 lines) → MATCH in 016-tooling. Spec folder creation with Level 1-3+ templates, phase support, CORE+ADDENDUM architecture.
- [x] T051 Formally audit `scripts/spec/validate.sh` (~600 lines) → MATCH in 016-tooling. 21-rule validation orchestrator with recursive phase support and configurable severity.

### 5E: Stale Phase Remediation

- [x] T052 Phases 019/021/022 confirmed as mapping/meta packets — already correctly classified in umbrella phase map as "cross-cutting", "meta-phase", and "follow-up" respectively
- [x] T053 Phase 009 implementation-summary reviewed — feature count (16) includes 1 MISMATCH (shadow scoring @deprecated). Already documented in re-audit. No overcount beyond known deprecated entries.
- [x] T054 Phase 011 implementation-summary reviewed — feature count (23) includes 1 MISMATCH (fusion policy shadow eval V2). Already documented in re-audit. No overcount beyond known deprecated entries.

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All completed audit packets truth-synced to live inventories, with the remaining Retrieval gap explicitly tracked
- [x] Cross-cutting analysis done
- [x] Master report delivered and live child `022-implement-and-remove-deprecated-features` inventoried
- [x] Phase 5 deep research remediation tasks addressed (2026-03-26) — all 25 tasks (T030-T054) complete: 5 metadata fixes, 5 unaudited snippets audited (4 MATCH + 1 META), 13 BOTH_MISSING capabilities documented, 2 AUDIT_MISSING scripts audited (2 MATCH), 3 stale phases reviewed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
