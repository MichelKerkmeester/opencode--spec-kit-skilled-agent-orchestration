---
title: "...-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/001-graph-and-metadata-quality/tasks]"
description: "Task ledger for 001-graph-and-metadata-quality Graph and Metadata Quality Remediation."
trigger_phrases:
  - "tasks 001 graph and metadata quality graph and metadata quality remediat"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/001-graph-and-metadata-quality"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Generated task ledger"
    next_safe_action: "Work tasks by severity"
    completion_pct: 0
---
# Tasks: 001-graph-and-metadata-quality Graph and Metadata Quality Remediation
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

- [x] T001 [P0] Confirm consolidated findings source is readable - Evidence: consolidated-findings.md:19-28 lists Theme 1 and P0 findings.
- [x] T002 [P0] Verify severity counts against the source report - Evidence: consolidated-findings.md:21 and checklist.md summary show P0=2 P1=42 P2=35.
- [x] T003 [P1] Identify target source phases before implementation edits - Evidence: tasks.md:51-94 maps CF ids to source phases before edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T010 [P] [P0] CF-108: [DR-P0-001] Strict packet validation currently fails despite completion status. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: validation still exits 2 with CONTINUITY_FRESHNESS; fix requires editing the cited source packet implementation-summary.md outside this worker's write authority.
- [x] T011 [P] [P0] CF-181: [F-001] Recursive skill graph scan ingests a non-skill graph-metadata fixture and can leave the SQLite graph empty _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/006-skill-graph-sqlite-migration. Evidence: skill-graph-db.ts:347, skill-graph-db.ts:463, skill-graph-db.vitest.ts:64; targeted vitest PASS.
- [ ] T012 [P] [P1] CF-137: [F001] Root packet completion state disagrees with graph-derived status _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning. Evidence: spec.md:33-35; graph-metadata.json:37-45; graph-metadata.json:95-97
- [ ] T013 [P] [P1] CF-138: [F002] description.json overstates the root packet's authority _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning. Evidence: description.json:21; spec.md:54-57; spec.md:66-74
- [ ] T014 [P] [P1] CF-139: [F003] Child packet 001 is level 3 complete without level-3 closeout surfaces _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning. Evidence: 001-search-fusion-tuning/spec.md:2-5; SKILL.md:393-397; 001-search-fusion-tuning/graph-metadata.json:195-200
- [ ] T015 [P] [P1] CF-140: [F004] Child packet 002 is level 3 complete without level-3 closeout surfaces _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning. Evidence: 002-content-routing-accuracy/spec.md:2-5; SKILL.md:393-397; 002-content-routing-accuracy/graph-metadata.json:202-207
- [ ] T016 [P] [P1] CF-037: [DRV-P1-006] graph-metadata.json still points to stale configs/search-weights.json metadata. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning. Evidence: graph-metadata.json:39-56; spec.md:38-42
- [ ] T017 [P] [P1] CF-016: [F004] graph-metadata.json carries conflicting intent-classifier test paths _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile. Evidence: SOURCE: graph-metadata.json:34-41
- [ ] T018 [P] [P1] CF-042: [F004] Continuity frontmatter lags the packet metadata refresh by eight days. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion. Evidence: implementation-summary.md:12-16, graph-metadata.json:191-203
- [ ] T019 [P] [P1] CF-050: [F005] Continuity metadata hides the packet's remaining verification follow-up _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion. Evidence: implementation-summary.md:15-17, implementation-summary.md:26-29, implementation-summary.md:108-110, checklist.md:13-16
- [ ] T020 [P] [P1] CF-059: [F002] Canonical packet surfaces disagree on completion state _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment. Evidence: spec.md:30, spec.md:49, implementation-summary.md:15, implementation-summary.md:28, graph-metadata.json:42
- [ ] T021 [P] [P1] CF-065: [F002] graph-metadata.json key_files includes tests/handler-memory-save.vitest.ts, a repo-invalid path missing the .opencode/skill/system-spec-kit/mcp_server/ prefix. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety. Evidence: SOURCE: graph-metadata.json:33-41, SOURCE: implementation-summary.md:66-68
- [ ] T022 [P] [P1] CF-066: [F003] graph-metadata.json stores memory-save.ts as mcp_server/handlers/memory-save.ts, dropping the system-spec-kit prefix and breaking path-level traceability. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety. Evidence: SOURCE: graph-metadata.json:83-86
- [x] T023 [P] [P1] CF-071: [F006] The packet's metadata_only -> implementation-summary.md closure only becomes true after memory-save.ts resolves the router's internal spec-frontmatter alias. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment. Evidence: content-router.ts:1075, content-router.vitest.ts:198, content-router.vitest.ts:662; targeted vitest PASS.
- [ ] T024 [P] [P1] CF-132: [F003] Documented 16-entity cap drifts from live parser behavior _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation. Evidence: spec.md:29-30; graph-metadata-parser.ts:897-912
- [x] T025 [P] [P1] CF-133: [F004] Documented derived-field caps are not enforced by the schema validator _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation. Evidence: graph-metadata-schema.ts:12, graph-metadata-schema.ts:40, graph-metadata-parser.ts:1070, graph-metadata-schema.vitest.ts:565; targeted vitest PASS.
- [ ] T026 [P] [P1] CF-135: [F006] Derived key_files still store the same parser file under mixed path formats _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation. Evidence: spec.md:37-40; graph-metadata.json:41-45
- [ ] T027 [P] [P1] CF-082: [F004] Packet evidence still points reviewers at graph-metadata-parser.ts:498-510, while the live fallback branch now lives at 969-1014. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation. Evidence: spec.md:18-19; plan.md:13-14; checklist.md:7-8; graph-metadata-parser.ts:969-1014
- [ ] T028 [P] [P1] CF-084: [F006] spec.md under-documents the delivered verification surface by omitting the regression-test file that the packet's own summary and graph metadata include. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation. Evidence: spec.md:16-19; implementation-summary.md:63-70; graph-metadata.json:33-43
- [ ] T029 [P] [P1] CF-088: [F002] plan.md still cites ../research/research.md even though the current packet's derived source-doc inventory no longer includes a research artifact. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files. Evidence: plan.md:13-16; graph-metadata.json:195-201
- [ ] T030 [P] [P1] CF-089: [F003] decision-record.md repeats the same stale ../research/research.md authority path. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files. Evidence: decision-record.md:6-10; graph-metadata.json:195-201
- [ ] T031 [P] [P1] CF-090: [F004] checklist.md marks blocking claims complete using stale parser line numbers that no longer land on the cited predicate/filter logic. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files. Evidence: checklist.md:7-13; .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:545-590; .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:929-942
- [ ] T032 [P] [P1] CF-091: [F005] graph-metadata.json still stores duplicate aliases for the same parser/test files (.opencode/skill/... and mcp_server/...). _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files. Evidence: graph-metadata.json:33-40; implementation-summary.md:53-57; .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:717-789
- [ ] T033 [P] [P1] CF-093: [F002] The packet claims the 16-entity cap is preserved, but live parser and test behavior now use a 24-entity cap. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities. Evidence: plan.md:16; tasks.md:10; checklist.md:12; implementation-summary.md:53; graph-metadata-parser.ts:912; graph-metadata-schema.vitest.ts:514-522
- [ ] T034 [P] [P1] CF-098: [F001] Completed packet claims active-only default, but implementation is inclusive by default. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: tasks.md:6, implementation-summary.md:39, backfill-graph-metadata.ts:7, backfill-graph-metadata.ts:73, graph-metadata-backfill.vitest.ts:78
- [ ] T035 [P] [P1] CF-099: [F002] Completed regression-test task describes the opposite of the checked-in test behavior. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: tasks.md:8, graph-metadata-backfill.vitest.ts:78, graph-metadata-backfill.vitest.ts:117
- [ ] T036 [P] [P1] CF-110: [DR-P1-002] Graph README Key Files table is split by the new derivation section. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:82-100.
- [ ] T037 [P] [P1] CF-112: [DR-P1-004] Verification-only scan surfaces are claimed but not traceable from spec scope. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: spec.md:91-101; checklist.md:55; implementation-summary.md:58-59; graph-metadata.json:43-59.
- [x] T038 [P] [P1] CF-116: [DR-SEC-001] Embedded parent-directory segments can escape intended key-file lookup roots because only leading ../ is rejected before path.resolve() lookup checks. _(dimension: security)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution. Evidence: graph-metadata-parser.ts:549, graph-metadata-parser.ts:568, graph-metadata-parser.ts:738, graph-metadata-parser.ts:786, graph-metadata-schema.vitest.ts:401, graph-metadata-schema.vitest.ts:446; targeted vitest PASS.
- [ ] T039 [P] [P1] CF-209: [F004] Parent docs and graph metadata still point at retired skill-advisor runtime paths _(dimension: traceability)_ Source phase: 002-skill-advisor-graph. Evidence: -
- [ ] T040 [P] [P1] CF-146: [DR-003] graph-metadata.json derived key files/entities retain stale paths. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/001-research-findings-fixes. Evidence: graph-metadata.json:50, graph-metadata.json:71, graph-metadata.json:89.
- [ ] T041 [P] [P1] CF-153: [F001] Packet routes operators to a non-existent Skill Advisor package root. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: spec.md:73, spec.md:104, graph-metadata.json:41, graph-metadata.json:48
- [ ] T042 [P] [P1] CF-155: [F003] Completion metadata contradicts verification state. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: spec.md:40, tasks.md:40, tasks.md:79, checklist.md:38, checklist.md:79, graph-metadata.json:39
- [ ] T043 [P] [P1] CF-168: [F004] Checklist evidence for graph-metadata.json key files does not match the actual derived.key_files array. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: checklist.md:57, graph-metadata.json:43, graph-metadata.json:64, graph-metadata.json:215
- [ ] T044 [P] [P1] CF-169: [F005] Moved packet metadata still exposes 011-skill-advisor-graph as current parent/owner context in places, while the active packet path is under 002-skill-advisor-graph. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: description.json:2, description.json:18, decision-record.md:38, decision-record.md:136
- [ ] T045 [P] [P1] CF-189: [DR-COR-001] Packet points to stale skill-advisor implementation paths. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: spec.md:101-104, graph-metadata.json:44-47; actual files are under .opencode/skill/system-spec-kit/mcp_server/skill-advisor/....
- [ ] T046 [P] [P1] CF-192: [DR-TRC-001] Graph metadata status contradicts the packet completion state. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: spec.md:54 says Complete; graph-metadata.json:42 says in_progress.
- [ ] T047 [P] [P1] CF-201: [DRFC-P1-003] Pattern-source references point to the obsolete skill-advisor path. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Evidence: plan.md:36-39; graph-metadata.json:41-43; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:13
- [ ] T048 [P] [P1] CF-202: [DRFC-P1-004] Level 3 review packet is missing decision-record.md and implementation-summary.md. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Evidence: spec.md:24; graph-metadata.json:199-203; filesystem absence of both files
- [ ] T049 [P] [P1] CF-218: [F004] Spec docs and generated graph metadata point to non-existent .opencode/skill/skill-advisor/... paths. _(dimension: traceability)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: spec.md:54, spec.md:106, spec.md:107, implementation-summary.md:18, implementation-summary.md:78, graph-metadata.json:42, graph-metadata.json:53
- [ ] T050 [P] [P1] CF-219: [F005] graph-metadata.json still says status: planned while the implementation summary/checklist say complete. _(dimension: traceability)_ Source phase: 003-advisor-phrase-booster-tailoring. Evidence: graph-metadata.json:40, implementation-summary.md:26, implementation-summary.md:49, checklist.md:125, description.json:11
- [ ] T051 [P] [P1] CF-243: [DR-MNT-001] Root graph metadata indexes only spec.md and omits completed child evidence. _(dimension: maintainability)_ Source phase: 004-smart-router-context-efficacy. Evidence: graph-metadata.json:6-9, graph-metadata.json:31-49, 002-skill-md-intent-router-efficacy/graph-metadata.json:43-55
- [ ] T052 [P] [P1] CF-234: [F001] Strict validation is claimed as complete, but the current strict validator fails. _(dimension: correctness)_ Source phase: 004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy. Evidence: spec.md:123, spec.md:134, checklist.md:65, implementation-summary.md:115, spec.md:14, graph-metadata.json:77
- [ ] T053 [P] [P1] CF-268: [F001] Track 1 remains marked blocked although Codex registration files now exist. _(dimension: traceability)_ Source phase: 007-deferred-remediation-and-telemetry-run. Evidence: .codex/settings.json:1, .codex/policy.json:1, tasks.md:52, tasks.md:53, checklist.md:78, implementation-summary.md:64, implementation-summary.md:122, graph-metadata.json:47
- [ ] T054 [P] [P2] CF-143: [F007] Root graph metadata still contains parser-noise entities _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning. Evidence: graph-metadata.json:71-88; 003-graph-metadata-validation/spec.md:37-41
- [ ] T055 [P] [P2] CF-018: [F006] graph-metadata.json entity extraction includes low-signal tokens _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile. Evidence: SOURCE: graph-metadata.json:129 SOURCE: graph-metadata.json:159 SOURCE: graph-metadata.json:183
- [ ] T056 [P] [P2] CF-024: [F006] Generated metadata still advertises the pre-decision 4-5 ambiguity _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum. Evidence: graph-metadata.json:25
- [ ] T057 [P] [P2] CF-057: [F006] Packet closure documents are internally inconsistent after completion. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier. Evidence: SOURCE: decision-record.md:1 SOURCE: spec.md:1 SOURCE: checklist.md:1 SOURCE: graph-metadata.json:31
- [ ] T058 [P] [P2] CF-063: [F006] graph-metadata entity extraction is carrying low-signal prose fragments _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment. Evidence: graph-metadata.json:193, graph-metadata.json:199, graph-metadata.json:205
- [ ] T059 [P] [P2] CF-073: [F004] graph-metadata.json.derived.key_files mixes canonical repo-relative paths with broken shorthand duplicates. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment. Evidence: graph-metadata.json:33; graph-metadata.json:39; graph-metadata.json:40
- [ ] T060 [P] [P2] CF-074: [F005] graph-metadata.json.derived.entities still retains anchor markup and low-signal tokens. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment. Evidence: graph-metadata.json:118; graph-metadata.json:130; graph-metadata.json:136; graph-metadata.json:142
- [ ] T061 [P] [P2] CF-136: [F007] Derived entity list still contains low-signal heading fragments _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation. Evidence: graph-metadata.json:126-177
- [ ] T062 [P] [P2] CF-085: [F002] Derived graph metadata publishes broader root-scoped repository paths than the packet needs for its own review surface. _(dimension: security)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation. Evidence: graph-metadata.json:33-61
- [ ] T063 [P] [P2] CF-086: [F007] graph-metadata.json duplicates the parser/test file pair under two path spellings, increasing normalization cost for downstream consumers. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation. Evidence: graph-metadata.json:33-43
- [ ] T064 [P] [P2] CF-094: [F003] The packet's graph metadata keeps mixed-format duplicate key_files for the same parser/test files. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities. Evidence: graph-metadata.json:33-41; graph-metadata-parser.ts:938-942
- [ ] T065 [P] [P2] CF-095: [F004] The packet's entity list includes stop-word key phrases a and the, which waste entity slots. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities. Evidence: graph-metadata.json:137-146; graph-metadata-parser.ts:897-908; entity-extractor.ts:139-149
- [ ] T066 [P] [P2] CF-097: [F006] Spec and plan line anchors for deriveEntities() point at stale parser line ranges. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities. Evidence: spec.md:18; plan.md:13-14; graph-metadata-parser.ts:820
- [ ] T067 [P] [P2] CF-103: [F006] Malformed --root usage silently falls back to the default root. _(dimension: security)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: backfill-graph-metadata.ts:89, backfill-graph-metadata.ts:90, backfill-graph-metadata.ts:91
- [ ] T068 [P] [P2] CF-104: [F007] spec.md key-files list omits the regression test that the packet relies on. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: spec.md:20, spec.md:22, graph-metadata.json:34, graph-metadata.json:36
- [ ] T069 [P] [P2] CF-105: [F008] Generated entity extraction contains low-quality placeholder entities. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: graph-metadata.json:93, graph-metadata.json:99, graph-metadata.json:111, graph-metadata.json:177
- [ ] T070 [P] [P2] CF-106: [F009] Verification command in the plan is a mutating backfill command, not a scan-only proof. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files. Evidence: plan.md:20, backfill-graph-metadata.ts:214, backfill-graph-metadata.ts:216
- [ ] T071 [P] [P2] CF-114: [DR-P2-002] Derived entities include title-fragment noise. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment. Evidence: graph-metadata.json:164-204.
- [ ] T072 [P] [P2] CF-119: [DR-MNT-001] graph-metadata.json stores duplicate display paths for the same parser/test files. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution. Evidence: graph-metadata.json:35, graph-metadata.json:36, graph-metadata.json:40, graph-metadata.json:43
- [ ] T073 [P] [P2] CF-122: [DR-COR-001] External canonical-doc filtering can overmatch non-spec support docs by suffix. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:845, .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:848, .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:885
- [ ] T074 [P] [P2] CF-123: [DR-COR-002] Runtime-name test directly asserts only three of the nine banned names. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: spec.md:24, .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:521, .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:524
- [ ] T075 [P] [P2] CF-125: [DR-TRC-003] graph-metadata.json has duplicate aliases for the parser and test files in derived.key_files. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: graph-metadata.json:34, graph-metadata.json:43, .opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:94
- [ ] T076 [P] [P2] CF-126: [DR-TRC-004] Implementation summary visible metadata collapses the full packet route to a basename. _(dimension: traceability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: implementation-summary.md:14, implementation-summary.md:44
- [ ] T077 [P] [P2] CF-128: [DR-MTN-001] Graph metadata README omits the new 24 cap, runtime-name filter, and external canonical-doc skip. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:88, .opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:95, implementation-summary.md:58, implementation-summary.md:61
- [ ] T078 [P] [P2] CF-214: [F009] Packet status surfaces disagree between implemented docs and graph metadata _(dimension: traceability)_ Source phase: 002-skill-advisor-graph. Evidence: -
- [ ] T079 [P] [P2] CF-158: [F006] graph-metadata.json key_files is stale and truncated against the current surface. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: graph-metadata.json:40, graph-metadata.json:60, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:42, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:55
- [ ] T080 [P] [P2] CF-171: [F007] Timestamp terminology is split between last_updated_at guidance and packet graph metadata using last_save_at. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/004-graph-metadata-enrichment. Evidence: spec.md:170, spec.md:210, graph-metadata.json:213
- [ ] T081 [P] [P2] CF-179: [F006] Continuity frontmatter is stale relative to refreshed graph metadata. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/005-repo-wide-path-migration. Evidence: Markdown frontmatter keeps April 13 timestamps; description.json:11 and graph-metadata.json:219 show April 21; validator emitted CONTINUITY_FRESHNESS.
- [ ] T082 [P] [P2] CF-195: [DR-TRC-004] Graph metadata does not encode the documented predecessor dependency. _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: spec.md:58; graph-metadata.json:7-10.
- [ ] T083 [P] [P2] CF-196: [DR-MNT-001] Continuity timestamps are stale relative to graph metadata. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: Validator CONTINUITY_FRESHNESS warning.
- [ ] T084 [P] [P2] CF-198: [DR-MNT-003] Verification summary is dated before the migrated metadata state. _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/007-skill-graph-auto-setup. Evidence: checklist.md:124 versus description.json:11.
- [ ] T085 [P] [P2] CF-238: [F005] decision-record.md is absent and not explicitly marked non-applicable. _(dimension: traceability)_ Source phase: 004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy. Evidence: graph-metadata.json:44, graph-metadata.json:80, implementation-summary.md:61, implementation-summary.md:70
- [ ] T086 [P] [P2] CF-255: [F006] Spec status and continuity metadata are stale after completion. _(dimension: maintainability)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: spec.md:16, spec.md:40, graph-metadata.json:43, implementation-summary.md:20
- [ ] T087 [P] [P2] CF-256: [F007] Migrated packet mixes 022/Phase 022 labels with local 005 path. _(dimension: maintainability)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: description.json:15, implementation-summary.md:39, graph-metadata.json:98
- [ ] T088 [P] [P2] CF-262: [F003] Prompt-safe status still exposes local executable/path metadata _(dimension: security)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/plugins/spec-kit-skill-advisor.js:405
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
