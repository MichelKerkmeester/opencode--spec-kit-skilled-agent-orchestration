---
title: "Tasks: 002-spec-structure-and-validation Spec Structure and Validation Remediation"
description: "Task ledger for 002-spec-structure-and-validation Spec Structure and Validation Remediation."
trigger_phrases:
  - "tasks 002 spec structure and validation spec structure and validation re"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/002-spec-structure-and-validation"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Applied runtime graph fix"
    next_safe_action: "Resolve out-of-scope packet docs"
    completion_pct: 20
---
# Tasks: 002-spec-structure-and-validation Spec Structure and Validation Remediation
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

- [x] T001 [P0] Confirm consolidated findings source is readable [EVIDENCE: consolidated-findings.md Theme 2 rows at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/review/consolidated-findings.md:115`]
- [x] T002 [P0] Verify severity counts against the source report [EVIDENCE: checklist.md summary tracks P0=1, P1=36, P2=23 at `checklist.md:83-85`]
- [x] T003 [P1] Identify target source phases before implementation edits [EVIDENCE: tasks.md source phase ledger starts at `tasks.md:43`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T010 [P] [P0] CF-207: [F002] Strict recursive packet validation fails with active template and integrity errors _(dimension: traceability)_ Source phase: 002-skill-advisor-graph. Evidence: recursive validation still exits 2 on historical packet docs outside this assignment's write authority; runtime graph validation sub-block fixed by `skill_graph_compiler.py --validate-only` exit 0.
- [ ] T011 [P] [P1] CF-032: [DRV-P1-001] Root packet closeout does not answer the packet's own RQ-1..RQ-5 or capture threshold recommendations/measurements. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning. Evidence: spec.md:28-60; tasks.md:11-16; checklist.md:13-21
- [ ] T012 [P] [P1] CF-033: [DRV-P1-002] Root Level 3 packet is missing implementation-summary.md. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning. Evidence: spec.md:2-5; AGENTS.md:260-268; 001-search-fusion-tuning(dir):1-13
- [ ] T013 [P] [P1] CF-034: [DRV-P1-003] Root Level 3 packet is missing decision-record.md. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning. Evidence: spec.md:2-5; AGENTS.md:260-265; 001-search-fusion-tuning(dir):1-13
- [ ] T014 [P] [P1] CF-035: [DRV-P1-004] Child decision records in phases 001-004 still say status: planned after packet completion. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning. Evidence: 001-remove-length-penalty/decision-record.md:1-3; 002-add-reranker-telemetry/decision-record.md:1-3; 003-continuity-search-profile/decision-record.md:1-3; 004-raise-rerank-minimum/decision-record.md:1-3
- [ ] T015 [P] [P1] CF-002: [DR-P1-002] plan.md still tells follow-on work to remove helper surfaces that the shipped implementation intentionally kept as compatibility no-ops. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Evidence: SOURCE: plan.md:8 SOURCE: plan.md:13-14 SOURCE: implementation-summary.md:39-41 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577
- [ ] T016 [P] [P1] CF-003: [DR-P1-003] checklist.md records a targeted verification result of 15 files / 363 tests for the documented four-suite command. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Evidence: SOURCE: checklist.md:9
- [ ] T017 [P] [P1] CF-004: [DR-P1-004] decision-record.md still reports status: planned even though the packet is complete. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Evidence: SOURCE: decision-record.md:1-3 SOURCE: spec.md:1-7
- [ ] T018 [P] [P1] CF-005: [DR-P1-005] The ADR still documents temporary lp cache-bucket duplication after tasks and implementation-summary say that fix already landed. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Evidence: SOURCE: decision-record.md:10 SOURCE: tasks.md:11 SOURCE: implementation-summary.md:52-53
- [ ] T019 [P] [P1] CF-006: [DR-P1-006] implementation-summary.md now carries its own incompatible exact test count (4 files / 126 tests) for the same four-suite command. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Evidence: SOURCE: implementation-summary.md:47-48 SOURCE: checklist.md:9
- [ ] T020 [P] [P1] CF-009: [F002] Packet docs still point at a removed sibling research path _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry. Evidence: plan.md:13-15, tasks.md:6-7, checklist.md:11, decision-record.md:7
- [ ] T021 [P] [P1] CF-012: [F005] Decision record still advertises the phase as planned _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry. Evidence: decision-record.md:1-3, spec.md:1-5, implementation-summary.md:1-10
- [ ] T022 [P] [P1] CF-013: [F001] tasks.md contradicts its own intent-classifier boundary _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile. Evidence: SOURCE: tasks.md:8 SOURCE: tasks.md:11 SOURCE: tasks.md:15
- [ ] T023 [P] [P1] CF-014: [F002] plan.md and implementation-summary.md never reconcile the intent-classifier exception _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile. Evidence: SOURCE: plan.md:13-16 SOURCE: implementation-summary.md:52-54
- [ ] T024 [P] [P1] CF-017: [F005] Packet verification points at the wrong runtime seam for continuity handoff _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile. Evidence: SOURCE: plan.md:13-16 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221-1227 SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830-832 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:567-572 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209-210
- [ ] T025 [P] [P1] CF-077: [F003] Root closeout no longer preserves a parent-level synthesis for the original research exit criteria. _(dimension: correctness / traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy. Evidence: SOURCE: spec.md:67-73 SOURCE: tasks.md:11-14 SOURCE: checklist.md:13-19
- [ ] T026 [P] [P1] CF-039: [F001] Packet rationale cites a missing research source. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion. Evidence: plan.md:13-16, tasks.md:6-8, checklist.md:7, decision-record.md:7
- [ ] T027 [P] [P1] CF-046: [F001] Packet completion surfaces overstate closure while checklist work remains open _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion. Evidence: checklist.md:13-16, spec.md:3, implementation-summary.md:26-29
- [ ] T028 [P] [P1] CF-058: [F001] Strict-validation success claims are stale _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment. Evidence: tasks.md:79, checklist.md:83, implementation-summary.md:117
- [ ] T029 [P] [P1] CF-131: [F002] Packet closeout surfaces overstate root refresh completion _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation. Evidence: tasks.md:13; checklist.md:15; implementation-summary.md:25-26
- [ ] T030 [P] [P1] CF-134: [F005] Level-3 root packet is missing the required decision record surface _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation. Evidence: spec.md:3-4; AGENTS.md:260-265
- [ ] T031 [P] [P1] CF-211: [F006] Child phase packets mix planned state, implemented runtime state, and incomplete Level 3 scaffolds _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph. Evidence: -
- [ ] T032 [P] [P1] CF-156: [F004] The specified 5-section RCAF template contract is incompatible with live scenario files. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: spec.md:87, spec.md:95, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:13, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:24
- [ ] T033 [P] [P1] CF-162: [P1-001] Catalog count and snippet-section claims are stale against the shipped catalog _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/003-skill-advisor-packaging. Evidence: spec.md:119; spec.md:218; checklist.md:83; decision-record.md:109; decision-record.md:132; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:31; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md:13
- [ ] T034 [P] [P1] CF-166: [F002] The recorded compiler validation command is stale, and the current compiler validation path returns validation failure rather than the documented pass. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: spec.md:134, plan.md:109, checklist.md:68, implementation-summary.md:81
- [ ] T035 [P] [P1] CF-170: [F006] The recorded regression command writes outside the packet boundary and points at stale skill-advisor paths, contradicting the packet's scope claims. _(dimension: security)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: plan.md:123, tasks.md:109, checklist.md:78
- [ ] T036 [P] [P1] CF-175: [F002] Runtime verification paths point to a deleted skill-advisor location. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/005-repo-wide-path-migration. Evidence: plan.md:119-120; tasks.md:69-71; checklist.md:64-66; .opencode/skill/skill-advisor is missing while the nested system-spec-kit path exists.
- [x] T037 [P] [P1] CF-176: [F003] Current compiler validation fails even at the live nested path. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/005-repo-wide-path-migration. Evidence: added reciprocal graph edges at `.opencode/skill/sk-deep-research/graph-metadata.json:9`, `.opencode/skill/sk-deep-review/graph-metadata.json:15`, `.opencode/skill/sk-git/graph-metadata.json:9`, `.opencode/skill/sk-doc/graph-metadata.json:15`; targeted vitest `skill-advisor/tests/legacy/advisor-graph-health.vitest.ts` passed 2 tests.
- [ ] T038 [P] [P1] CF-177: [F004] Grep-zero and scope claims still target the old 011/007 root after the packet moved to 002. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/005-repo-wide-path-migration. Evidence: spec.md:32, spec.md:115, spec.md:133; checklist.md:67; no current 011-skill-advisor-graph directory under the active parent.
- [ ] T039 [P] [P1] CF-199: [DRFC-P1-001] Packet completion state is stale relative to shipped catalogs. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Evidence: spec.md:34-37; tasks.md:18-30; .opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31; .opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31; .opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29
- [ ] T040 [P] [P1] CF-215: [F001] Regression command in the spec omits the required --dataset argument. The current harness requires it, so the documented command exits 2. _(dimension: correctness)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: skill_advisor_regression.py:8, skill_advisor_regression.py:242, spec.md:122, tasks.md:54, tasks.md:80
- [ ] T041 [P] [P1] CF-217: [F003] REQ-010/CHK-032 claims five uplift-style validations, but four rows are +0.00 high-confidence holds. _(dimension: correctness)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: spec.md:130, tasks.md:82, checklist.md:84, scratch/phrase-boost-delta.md:88-92
- [ ] T042 [P] [P1] CF-251: [F002] README does not present hook invocation as the primary quick-start path. _(dimension: correctness)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: spec.md:122, tasks.md:42, README lines 55, 57, 79
- [ ] T043 [P] [P1] CF-252: [F003] Feature catalog lacks the claimed Phase 020 hook-surface entries. _(dimension: traceability)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: tasks.md:46, implementation-summary.md:55, catalog lines 31 and 137
- [ ] T044 [P] [P1] CF-253: [F004] Manual hook-routing smoke playbook is marked complete but absent. _(dimension: traceability)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: tasks.md:62, checklist.md:87, missing 06--hook-routing/001-hook-routing-smoke.md
- [ ] T045 [P] [P1] CF-254: [F005] Code-alignment audit target paths no longer exist. _(dimension: correctness)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: spec.md:82, tasks.md:70, missing mcp_server/lib/skill-advisor/freshness.ts
- [ ] T046 [P] [P1] CF-259: [F005] plan.md completion gates remain unchecked while downstream docs claim completion _(dimension: traceability)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/plan.md:61
- [ ] T047 [P] [P2] CF-022: [F004] Decision record lifecycle status is stale after completion _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum. Evidence: decision-record.md:3
- [ ] T048 [P] [P2] CF-045: [F007] decision-record.md still advertises status: planned after packet completion. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion. Evidence: decision-record.md:1-4, spec.md:2-7, tasks.md:2-3
- [ ] T049 [P] [P2] CF-051: [F006] Decision record frontmatter still says planned after the packet completed _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion. Evidence: decision-record.md:1-3, spec.md:1-3
- [ ] T050 [P] [P2] CF-107: [F010] Review scope named decision-record.md, but the Level 2 packet has no such file. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: .opencode/skill/system-spec-kit/SKILL.md:397
- [ ] T051 [P] [P2] CF-113: [DR-P2-001] Review input named decision-record.md, but the Level 2 packet has no such artifact. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: Folder listing; implementation-summary.md:85-92.
- [ ] T052 [P] [P2] CF-115: [DR-P2-003] Backfill dry-run flags a false relationship hint from the phase dependency table header. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: plan.md:160; dry-run output returned prose_relationship_hints.
- [ ] T053 [P] [P2] CF-120: [DR-TRA-002] Requested decision-record.md review input is absent; advisory because Level 2 packets do not strictly require it. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution. Evidence: Packet root file listing
- [ ] T054 [P] [P2] CF-124: [DR-TRC-002] decision-record.md is absent from the requested read set; key decisions live only in the summary. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: implementation-summary.md:83, implementation-summary.md:90
- [ ] T055 [P] [P2] CF-151: [DR-008] Plan still includes impossible --audit-drift verification for a deferred flag. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: plan.md:185, checklist.md:95; compiler help exposes no --audit-drift.
- [ ] T056 [P] [P2] CF-152: [DR-009] Reason ordering debt remains and is visible in production output. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: checklist.md:103; skill_advisor.py:2811 still sorts/truncates reasons alphabetically.
- [ ] T057 [P] [P2] CF-159: [F007] Decision record documents obsolete expansion assumptions. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: decision-record.md:40, decision-record.md:72, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:42
- [ ] T058 [P] [P2] CF-164: [P2-002] ADR-002 preserves the pre-Phase-027 catalog model _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/003-skill-advisor-packaging. Evidence: decision-record.md:109; decision-record.md:132; decision-record.md:171; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:31
- [ ] T059 [P] [P2] CF-172: [F008] The packet hard-codes a point-in-time corpus count without defining an inclusion rule for fixtures. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: spec.md:147, implementation-summary.md:90, checklist.md:65
- [ ] T060 [P] [P2] CF-194: [DR-TRC-003] decision-record.md was requested for review but is absent. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: No such file in the packet; decisions appear only in implementation-summary.md:93-100.
- [ ] T061 [P] [P2] CF-197: [DR-MNT-002] Canonical continuity regeneration remains deferred. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: checklist.md:110.
- [ ] T062 [P] [P2] CF-205: [DRFC-P2-007] Continuity frontmatter still routes the next safe action to implementation. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Evidence: spec.md:16-20; plan.md:8-12; .opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31
- [ ] T063 [P] [P2] CF-220: [F006] Rollback instructions recommend git checkout against stale paths. _(dimension: security)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: plan.md:179, plan.md:227, scratch/phrase-boost-delta.md:195
- [ ] T064 [P] [P2] CF-222: [F008] decision-record.md is absent from the requested review corpus. _(dimension: traceability)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: Folder listing; review invocation
- [ ] T065 [P] [P2] CF-224: [F010] tasks.md remains unchecked despite completed implementation summary/checklist. _(dimension: correctness)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: tasks.md:54, tasks.md:67, tasks.md:80, implementation-summary.md:49, checklist.md:125
- [ ] T066 [P] [P2] CF-247: [DR-COR-002] Implementation summary records strict validation without an explicit pass result. _(dimension: correctness)_ Source phase: 004-smart-router-context-efficacy. Evidence: 002-skill-md-intent-router-efficacy/implementation-summary.md:106-115, current root validation exits 2
- [ ] T067 [P] [P2] CF-237: [F004] Verification summary leaves the strict-validator result ambiguous. _(dimension: maintainability)_ Source phase: 004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy. Evidence: implementation-summary.md:107, implementation-summary.md:115, checklist.md:64, checklist.md:65, tasks.md:75, tasks.md:76
- [ ] T068 [P] [P2] CF-265: [F008] decision-record.md is absent from the requested review corpus _(dimension: traceability)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/decision-record.md:1
- [ ] T069 [P] [P2] CF-272: [F005] No decision-record.md exists for the reviewed packet; durable decisions live only in implementation-summary.md. _(dimension: maintainability)_ Source phase: 007-deferred-remediation-and-telemetry-run. Evidence: implementation-summary.md:95, implementation-summary.md:104
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 [P0] Run strict packet validation [EVIDENCE: `validate.sh --strict --no-recursive` exited 0 for this sub-phase with `RESULT: PASSED`]
- [x] T901 [P1] Update graph metadata after implementation [EVIDENCE: `graph-metadata.json:27` records `status: in_progress` while blocked findings remain]
- [x] T902 [P1] Add implementation summary closeout evidence [EVIDENCE: `implementation-summary.md:104` records verification output]
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
