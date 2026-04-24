---
title: "...on/007-deep-review-remediation/005-006-campaign-findings-remediation/003-evidence-references-and-replayability/tasks]"
description: "Task ledger for 003-evidence-references-and-replayability Evidence, References, and Replayability Remediation."
trigger_phrases:
  - "tasks 003 evidence references and replayability evidence references and"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/003-evidence-references-and-replayability"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Generated task ledger"
    next_safe_action: "Work tasks by severity"
    completion_pct: 0
---
# Tasks: 003-evidence-references-and-replayability Evidence, References, and Replayability Remediation
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

- [ ] T001 [P0] Confirm consolidated findings source is readable
- [ ] T002 [P0] Verify severity counts against the source report
- [ ] T003 [P1] Identify target source phases before implementation edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 [P] [P0] CF-174: [F001] Packet claims strict validation passes, but current strict validation fails. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/005-repo-wide-path-migration. Evidence: spec.md:112; plan.md:59; implementation-summary.md:87; current strict validation exited 2 with 15 missing-reference integrity errors.
- [ ] T011 [P] [P1] CF-021: [F003] Checklist evidence claim overstates what the implementation summary provides _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum. Evidence: checklist.md:13
- [ ] T012 [P] [P1] CF-026: [F002] Packet scope references a non-replayable target path _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment. Evidence: spec.md:98, implementation-summary.md:104-105
- [ ] T013 [P] [P1] CF-078: [F004] Root packet docs drift from the active Level-3 template/anchor/retrieval contract badly enough to break current tooling expectations. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy. Evidence: SOURCE: review/validation-strict.txt:34-71 SOURCE: review/validation-strict.txt:134-182
- [ ] T014 [P] [P1] CF-040: [F002] Packet evidence still points at stale content-router.ts line ranges. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion. Evidence: plan.md:13-16, tasks.md:6-7, checklist.md:7, decision-record.md:8, content-router.ts:404-423, content-router.ts:965-993
- [ ] T015 [P] [P1] CF-043: [F005] Core packet docs still miss required template, anchor, and _memory surfaces. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion. Evidence: spec.md:1-24, plan.md:1-25, tasks.md:1-14, checklist.md:1-16, decision-record.md:1-10
- [ ] T016 [P] [P1] CF-044: [F006] Completed checklist claims are not backed by structured evidence markers. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion. Evidence: checklist.md:7-13
- [ ] T017 [P] [P1] CF-049: [F004] Packet evidence anchors still point at pre-growth code line ranges _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion. Evidence: plan.md:13-16, checklist.md:7-12, .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409-411, .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001-1014, .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1039-1049
- [ ] T018 [P] [P1] CF-054: [F003] The phase packet documents the wrong Tier 3 enable flag and rollout model. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier. Evidence: SOURCE: implementation-summary.md:53 SOURCE: implementation-summary.md:94 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366 SOURCE: .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:130
- [ ] T019 [P] [P1] CF-062: [F005] Three packet docs cite a non-existent .opencode/agent/speckit.md surface _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment. Evidence: tasks.md:58, checklist.md:71, checklist.md:72, implementation-summary.md:104
- [ ] T020 [P] [P1] CF-067: [F004] The packet's own task IDs use T-01/T-02/T-V1, but the packet template and routed merge path only accept T### / CHK-###, so this packet cannot serve as a faithful self-specimen for the guard it documents. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety. Evidence: SOURCE: tasks.md:16-26, SOURCE: .opencode/skill/system-spec-kit/templates/level_2/tasks.md:45-55, SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1282-1285, SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:562-563
- [ ] T021 [P] [P1] CF-081: [F003] Core rationale still cites ../research/research.md, but that artifact is absent under the parent packet. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation. Evidence: plan.md:13-16; decision-record.md:7-10; checklist.md:8-12
- [ ] T022 [P] [P1] CF-083: [F005] tasks.md uses T-01 / T-V1, but the canonical routed update path only matches T### / CHK-###. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation. Evidence: tasks.md:6-14; templates/level_2/tasks.md:45-55; memory-save.ts:1282-1285; anchor-merge-operation.ts:562-564
- [ ] T023 [P] [P1] CF-102: [F005] Checklist completion depends on non-local corpus-scan evidence that is not present in the packet. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: checklist.md:10, checklist.md:16, plan.md:20, plan.md:21
- [ ] T024 [P] [P1] CF-111: [DR-P1-003] Completion evidence overstates verification by marking failed strict validation as PASS. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: plan.md:68-72; checklist.md:75; implementation-summary.md:100-103; live validator output.
- [ ] T025 [P] [P1] CF-210: [F005] The requested parent decision record is absent and handover references missing review artifacts _(dimension: traceability)_ Source phase: 002-skill-advisor-graph. Evidence: -
- [ ] T026 [P] [P1] CF-144: [DR-001] Validation evidence is false: current strict graph validation exits 2. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: checklist.md:58, checklist.md:69, skill_graph_compiler.py:782, skill_graph_compiler.py:786; live command exits 2 with zero-edge warnings for sk-deep-research and sk-git.
- [ ] T027 [P] [P1] CF-145: [DR-002] Spec/checklist/summary point at non-existent skill-advisor paths. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: spec.md:133, spec.md:142, implementation-summary.md:82; actual scripts live under system-spec-kit/mcp_server/skill-advisor/scripts/.
- [ ] T028 [P] [P1] CF-148: [DR-005] Graph evidence separation does not lower uncertainty. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: Original spec describes confidence/uncertainty inflation; skill_advisor.py:2791 and skill_advisor.py:2794 calculate uncertainty before any graph-fraction handling; skill_advisor.py:2822 only adjusts confidence.
- [ ] T029 [P] [P1] CF-165: [F001] Packet completion depends on review/deep-review-findings.md, but that file was absent before this review created review/; strict validation fails on missing references to it. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: spec.md:51, spec.md:144, checklist.md:43, tasks.md:46
- [ ] T030 [P] [P1] CF-167: [F003] The exact corpus-count command recorded as evidence now returns 22, not 21. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: checklist.md:65, tasks.md:106, implementation-summary.md:78
- [ ] T031 [P] [P1] CF-190: [DR-COR-002] Completion evidence claims validation passed, but strict validation fails. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: checklist.md:79; validator exits 2; implementation-summary.md:111 says validation was pending.
- [ ] T032 [P] [P1] CF-191: [DR-COR-003] Checked P0 checklist evidence references nonexistent paths or stale line ranges. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: checklist.md:66-80; actual fallback code is around skill_advisor.py:721-758 at the new package path.
- [ ] T033 [P] [P1] CF-203: [DRFC-P1-008] Strict spec validation fails Level 3 structural, anchor, frontmatter, and integrity gates. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Evidence: review/validation-summary.md; plan.md:1-4; tasks.md:1-9; checklist.md:1-9
- [ ] T034 [P] [P1] CF-216: [F002] REQ-001 verification evidence uses stale line ranges and does not scan the current INTENT_BOOSTERS block. _(dimension: correctness)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: spec.md:120, plan.md:85, plan.md:120, scratch/phrase-boost-delta.md:102, skill_advisor.py:1154, skill_advisor.py:1418
- [ ] T035 [P] [P1] CF-240: [DR-COR-001] Root packet status and continuity point to already-completed work. _(dimension: correctness)_ Source phase: 004-smart-router-context-efficacy. Evidence: spec.md:14-18, spec.md:40, 001-initial-research/research/research.md:3-5, 002-skill-md-intent-router-efficacy/spec.md:47-53, 002-skill-md-intent-router-efficacy/implementation-summary.md:55-59
- [ ] T036 [P] [P1] CF-241: [DR-TRC-001] Root Level 3 packet is missing required documents and anchors. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy. Evidence: spec.md:23, spec.md:38, strict validator missing root plan.md, tasks.md, checklist.md, decision-record.md, plus required anchors
- [ ] T037 [P] [P1] CF-242: [DR-TRC-002] 001-initial-research declares Level 2 but lacks required scaffolding and structured anchors. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy. Evidence: 001-initial-research/spec.md:1-5, strict validator missing child plan.md, tasks.md, checklist.md, anchors, and template sections
- [ ] T038 [P] [P1] CF-225: [DR-P1-001] REQ-011 cross-runtime delta table is not delivered. _(dimension: correctness)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: ../spec.md:103, ../spec.md:104, research/research.md:39, research/research.md:41, research/research-validation.md:61, research/research-validation.md:68
- [ ] T039 [P] [P1] CF-229: [DR-P1-005] Empirical measurement protocol is deferred rather than delivered as fixture prompts plus AI harness. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: ../spec.md:97, research/research.md:63, research/research.md:65, research/research-validation.md:59, research/research-validation.md:68, research/iterations/iteration-018.md:20
- [ ] T040 [P] [P1] CF-250: [F001] Migrated spec uses relative skill-advisor doc paths that resolve to non-existent files. _(dimension: traceability)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: spec.md:75, checklist.md:84, resolved .opencode/specs/skill/skill-advisor/README.md absent
- [ ] T041 [P] [P1] CF-260: [F006] Full test suite green acceptance is not evidenced _(dimension: traceability)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:155
- [ ] T042 [P] [P2] CF-079: [F006] Completed checklist items rely on prose evidence strings instead of replayable command evidence, weakening reproducibility. _(dimension: traceability / maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy. Evidence: SOURCE: review/validation-strict.txt:30-33 SOURCE: checklist.md:13-15
- [ ] T043 [P] [P2] CF-118: [DR-COR-001] Corpus hit-rate evidence is prose-only and not packet-replayable. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution. Evidence: implementation-summary.md:104, implementation-summary.md:106, implementation-summary.md:115
- [ ] T044 [P] [P2] CF-149: [DR-006] Regression evidence counts are stale. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: Docs claim 44/44 and 12/12 P0; current regression reports 104/104 and 24/24 P0 across two runners.
- [ ] T045 [P] [P2] CF-150: [DR-007] Compiled graph size evidence conflicts with current artifact. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: checklist.md:68 and tasks.md:77 claim under 4KB; current skill-graph.json is 4667 bytes.
- [ ] T046 [P] [P2] CF-161: [F009] Task evidence is summary-only and cannot reproduce the claimed checks. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: tasks.md:40, tasks.md:79, checklist.md:38, checklist.md:79
- [ ] T047 [P] [P2] CF-173: [F009] ADR-002 lacks the same anchor granularity and heading structure used by ADR-001. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: decision-record.md:29, decision-record.md:128
- [ ] T048 [P] [P2] CF-204: [DRFC-P2-006] Catalog-root naming guidance conflicts between the packet and sk-doc reference. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Evidence: spec.md:66-67; .opencode/skill/sk-doc/references/specific/feature_catalog_creation.md:62-74; .opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:82-85
- [ ] T049 [P] [P2] CF-221: [F007] Checklist evidence index references scratch/multi-word-inventory.md, but that file is absent. _(dimension: traceability)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: checklist.md:59, checklist.md:134, tasks.md:87
- [ ] T050 [P] [P2] CF-246: [DR-SEC-001] Default-on plugin rollout lacks an explicit adversarial corpus gate in root requirements. _(dimension: security)_ Source phase: 004-smart-router-context-efficacy. Evidence: spec.md:91-104, 001-initial-research/research/research.md:35-37, 001-initial-research/research/research.md:55-57
- [ ] T051 [P] [P2] CF-248: [DR-TRC-004] Code-graph plugin reference remains TBD after the research resolved it. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy. Evidence: spec.md:121, 001-initial-research/research/research.md:47-49
- [ ] T052 [P] [P2] CF-249: [DR-MNT-003] Follow-up recommendations are not mapped to owning packets or tasks. _(dimension: maintainability)_ Source phase: 004-smart-router-context-efficacy. Evidence: 002-skill-md-intent-router-efficacy/research/research.md:85-92, 002-skill-md-intent-router-efficacy/spec.md:159-165
- [ ] T053 [P] [P2] CF-231: [DR-P2-002] Default-on rollout remains blocked by adversarial and blind-following follow-up tests. _(dimension: security)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: research/research.md:37, research/research.md:57, research/iterations/iteration-016.md:20, research/iterations/iteration-018.md:24
- [ ] T054 [P] [P2] CF-232: [DR-P2-003] Completion language can read stronger than the convergence evidence. _(dimension: correctness)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: ../spec.md:96, research/iterations/iteration-020.md:21, research/deep-research-state.jsonl:23
- [ ] T055 [P] [P2] CF-239: [F007] Security/no-secret checklist evidence is assertion-only. _(dimension: security)_ Source phase: 004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy. Evidence: checklist.md:72, checklist.md:75, research/research-validation.md:25, research/research-validation.md:26
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T900 [P0] Run strict packet validation
- [ ] T901 [P1] Update graph metadata after implementation
- [ ] T902 [P1] Add implementation summary closeout evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or explicitly deferred
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
