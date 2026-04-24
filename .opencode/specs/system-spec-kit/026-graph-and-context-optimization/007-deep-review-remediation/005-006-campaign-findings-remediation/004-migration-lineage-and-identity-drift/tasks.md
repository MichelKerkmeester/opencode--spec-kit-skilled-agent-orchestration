---
title: "...ion/007-deep-review-remediation/005-006-campaign-findings-remediation/004-migration-lineage-and-identity-drift/tasks]"
description: "Task ledger for 004-migration-lineage-and-identity-drift Migration, Lineage, and Identity Drift Remediation."
trigger_phrases:
  - "tasks 004 migration lineage and identity drift migration lineage and ide"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/004-migration-lineage-and-identity-drift"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Generated task ledger"
    next_safe_action: "Work tasks by severity"
    completion_pct: 0
---
# Tasks: 004-migration-lineage-and-identity-drift Migration, Lineage, and Identity Drift Remediation
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

- [x] T001 [P0] Confirm consolidated findings source is readable [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T002 [P0] Verify severity counts against the source report [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T003 [P1] Identify target source phases before implementation edits [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] [P1] CF-036: [DRV-P1-005] description.json and graph-metadata.json disagree on the parent lineage after renumbering. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning. Evidence: description.json:15-19; graph-metadata.json:3-5; description.json:31-38 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T011 [P] [P1] CF-038: [DRV-P1-007] prompts/deep-research-prompt.md still points to the legacy packet path and stale open research charter. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning. Evidence: prompts/deep-research-prompt.md:7-9; prompts/deep-research-prompt.md:27-41; spec.md:52-60 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T012 [P] [P1] CF-001: [DR-P1-001] description.json still advertises the retired 010-search-and-routing-tuning parent node after renumbering. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Evidence: SOURCE: description.json:2 SOURCE: description.json:13-18 SOURCE: description.json:25-31 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T013 [P] [P1] CF-010: [F003] description.json parentChain still encodes the old phase number _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry. Evidence: description.json:16-19, graph-metadata.json:3-5 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T014 [P] [P1] CF-015: [F003] description.json retained the pre-renumber parentChain _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile. Evidence: SOURCE: description.json:14-19 SOURCE: description.json:26 SOURCE: graph-metadata.json:3-5 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T015 [P] [P1] CF-019: [F001] description.json parent chain still points at the retired 010-search-and-routing-tuning slug _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum. Evidence: description.json:18 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T016 [P] [P1] CF-020: [F002] Packet-local research citations no longer resolve after migration _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum. Evidence: plan.md:13 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T017 [P] [P1] CF-025: [F001] Regenerated packet ancestry is stale after renumber _(dimension: traceability / correctness)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment. Evidence: description.json:17-22, graph-metadata.json:3-5, generate-description.ts:75-88 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T018 [P] [P1] CF-030: [F002] description.json still points at the pre-renumber parent phase _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation. Evidence: description.json:15-20, description.json:31-34, graph-metadata.json:215-223 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T019 [P] [P1] CF-076: [F002] description.json.parentChain still points at 010-search-and-routing-tuning, while graph-metadata.json uses the current 001-search-and-routing-tuning parent. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy. Evidence: SOURCE: description.json:14-31 SOURCE: graph-metadata.json:3-5 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T020 [P] [P1] CF-041: [F003] description.json.parentChain still carries the legacy 010-search-and-routing-tuning slug. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion. Evidence: description.json:14-20, generate-description.ts:75-88, memory-parser.ts:532-565 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T021 [P] [P1] CF-047: [F002] Renumbered packet still cites a dead sibling research path _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion. Evidence: plan.md:13-14, tasks.md:6-9, decision-record.md:7 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T022 [P] [P1] CF-048: [F003] description.json.parentChain still carries the obsolete 010-search-and-routing-tuning slug _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion. Evidence: description.json:14-19, .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-88 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T023 [P] [P1] CF-055: [F004] description.json parentChain still points at the pre-renumbered phase slug. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier. Evidence: SOURCE: description.json:15 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T024 [P] [P1] CF-060: [F003] description.json parentChain still points at the pre-renumber path _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment. Evidence: description.json:18, description.json:22, description.json:30, description.json:34 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T025 [P] [P1] CF-061: [F004] Packet-local continuity identity still uses legacy 018/phase-004 markers _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment. Evidence: spec.md:6, spec.md:27, plan.md:6, tasks.md:6, checklist.md:6, implementation-summary.md:25 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T026 [P] [P1] CF-064: [F001] description.json parentChain still references 010-search-and-routing-tuning instead of the canonical 001-search-and-routing-tuning packet path. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety. Evidence: SOURCE: description.json:15-20, SOURCE: graph-metadata.json:213-220 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T027 [P] [P1] CF-070: [F003] description.json.parentChain still records 010-search-and-routing-tuning instead of the live 001-search-and-routing-tuning segment. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment. Evidence: description.json:2; description.json:15; description.json:19 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T028 [P] [P1] CF-130: [F001] Root packet lineage still points at the pre-renumbering parent in canonical docs _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation. Evidence: spec.md:6; description.json:15-20; graph-metadata.json:3-5 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T029 [P] [P1] CF-080: [F001] description.json.parentChain still advertises 010-search-and-routing-tuning after the packet moved to 001-search-and-routing-tuning, so machine-readable ancestry is wrong. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation. Evidence: description.json:14-20; generate-description.ts:75-89; memory-parser.ts:544-566 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T030 [P] [P1] CF-087: [F001] description.json.parentChain still points at 010-search-and-routing-tuning instead of the current 001-search-and-routing-tuning branch. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files. Evidence: description.json:14-20; .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-88; .opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts:38-42 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T031 [P] [P1] CF-092: [F001] description.json parentChain still points at the pre-renumbered 010-search-and-routing-tuning phase while specFolder and graph-metadata.json point at 001-search-and-routing-tuning. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities. Evidence: description.json:2; description.json:13-18; description.json:23-31; graph-metadata.json:3-5 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T032 [P] [P1] CF-100: [F003] graph-metadata.json causal summary still advertises the retired migration objective. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: spec.md:16, spec.md:18, graph-metadata.json:189 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T033 [P] [P1] CF-101: [F004] description.json parentChain retains stale 010-search-and-routing-tuning after migration to 001-search-and-routing-tuning. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: description.json:2, description.json:18, description.json:26, description.json:31 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T034 [P] [P1] CF-109: [DR-P1-001] description.json parentChain still points at old 010-search-and-routing-tuning while packet identity is now under 001-search-and-routing-tuning. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: description.json:2; description.json:17-23; graph-metadata.json:3-5. [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T035 [P] [P1] CF-117: [DR-TRA-001] description.json parentChain still points at 010-search-and-routing-tuning even though the active path is under 001-search-and-routing-tuning. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution. Evidence: description.json:2, description.json:15, description.json:19, description.json:32 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T036 [P] [P1] CF-121: [DR-TRC-001] description.json parentChain still points at pre-renumbered 010-search-and-routing-tuning while the active route is 001-search-and-routing-tuning. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: description.json:2, description.json:18, description.json:26, description.json:31 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T037 [P] [P1] CF-178: [F005] description.json parentChain disagrees with the current packet location. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/005-repo-wide-path-migration. Evidence: description.json:14-19; graph-metadata.json:3-5; description.json:25. [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T038 [P] [P1] CF-185: [F-005] Advisor runtime still silently falls back to legacy skill-graph.json _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/006-skill-graph-sqlite-migration. Evidence: - [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T039 [P] [P1] CF-193: [DR-TRC-002] description.json parent chain still names the old 011-skill-advisor-graph phase. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: description.json:14-19 conflicts with description.json:2. [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T040 [P] [P1] CF-244: [DR-MNT-002] Migrated identity still mixes 021 and 004 numbering surfaces. _(dimension: maintainability)_ Source phase: 004-smart-router-context-efficacy. Evidence: spec.md:4-7, spec.md:28-29, description.json:11-13, 002-skill-md-intent-router-efficacy/description.json:15-20 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T041 [P] [P1] CF-245: [DR-TRC-003] Root corpus reference resolves to a missing path after migration. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy. Evidence: spec.md:116-121, path check shows ../research/... missing and ../../research/... exists [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T042 [P] [P1] CF-227: [DR-P1-003] Completed research state still advertises initialized and legacy 021 lineage. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: research/deep-research-config.json:7, research/deep-research-config.json:9, research/deep-research-state.jsonl:1, research/deep-research-state.jsonl:23, graph-metadata.json:49, graph-metadata.json:52 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T043 [P] [P1] CF-235: [F002] Research JSONL config still points at the pre-migration spec folder. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy. Evidence: research/deep-research-state.jsonl:1, research/deep-research-config.json:7, graph-metadata.json:3, graph-metadata.json:4, graph-metadata.json:5 [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T044 [P] [P2] CF-142: [F006] Child specs still advertise the pre-renumber parent slug _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning. Evidence: 001-search-fusion-tuning/spec.md:6; 002-content-routing-accuracy/spec.md:6; 003-graph-metadata-validation/spec.md:6; description.json:53-56 [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
- [x] T045 [P] [P2] CF-127: [DR-TRC-005] description.json lastUpdated predates its own renumbered_at event. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: description.json:11, description.json:33 [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
- [x] T046 [P] [P2] CF-160: [F008] description.json parentChain still points at the old 011-skill-advisor-graph phase identifier. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: description.json:14, description.json:19, description.json:30, description.json:36 [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
- [x] T047 [P] [P2] CF-180: [F007] The packet never names the two forbidden legacy patterns it claims to grep. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/005-repo-wide-path-migration. Evidence: spec.md:115; tasks.md:72; implementation-summary.md:86. [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
- [x] T048 [P] [P2] CF-233: [DR-P2-004] Migrated packet metadata still exposes legacy 021 trigger phrases. _(dimension: maintainability)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: spec.md:3, spec.md:5, description.json:3, description.json:7, graph-metadata.json:15, graph-metadata.json:16, graph-metadata.json:35 [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
- [x] T049 [P] [P2] CF-236: [F003] description.json parentChain keeps the old phase slug after migration. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy. Evidence: description.json:15, description.json:19, graph-metadata.json:5, graph-metadata.json:106 [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
- [x] T050 [P] [P2] CF-264: [F007] Phase and status metadata are stale after migration/renumbering _(dimension: traceability)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:40 [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
- [x] T051 [P] [P2] CF-274: [F007] Renumbered 007 packet still exposes Phase 024 identifiers in canonical user-facing docs. _(dimension: traceability)_ Source phase: 007-deferred-remediation-and-telemetry-run. Evidence: description.json:14, description.json:31, description.json:32, implementation-summary.md:38, spec.md:40, graph-metadata.json:104, graph-metadata.json:105 [Deferred/Triaged: user requested P0/P1 remediation in this pass; P2 remains tracked for orchestrator follow-up]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 [P0] Run strict packet validation [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T901 [P1] Update graph metadata after implementation [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
- [x] T902 [P1] Add implementation summary closeout evidence [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:57]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly deferred [Evidence: tasks.md task ledger updated for P0/P1 closure and P2 triage]
- [x] No `[B]` blocked tasks remaining [Evidence: no blocked task marker remains in this ledger]
- [x] Manual verification passed [Evidence: targeted vitest, typecheck, build, and strict validation recorded in implementation-summary.md]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
