---
title: "006 Campaign — Consolidated Findings Synthesis"
description: "Aggregated + deduplicated findings across all 39 deep-review reports from the 2026-04-21 006-search-routing-advisor campaign."
importance_tier: "high"
contextType: "review-synthesis"
review_date: "2026-04-21"
---

# 006 Campaign — Consolidated Findings

## Executive Summary
- **Phases reviewed:** 39
- **Iterations total:** 387
- **Unique findings (deduped):** 274
- **By severity:** P0=7 P1=165 P2=102
- **Verdict distribution:** PASS=8 CONDITIONAL=25 FAIL=6
- **Top themes:** Graph and Metadata Quality, Spec Structure and Validation, Evidence, References, and Replayability, Migration, Lineage, and Identity Drift, Packet State, Continuity, and Closeout, Routing Accuracy and Classifier Behavior, Skill Advisor Packaging and Graph, Search Fusion and Reranker Tuning, Security and Guardrails, Telemetry, Measurement, and Rollout Controls

## Theme 1: Graph and Metadata Quality
**Affected phases:** 32 (`001-search-and-routing-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile`, +29 more)
**Severity distribution:** P0=2 P1=42 P2=35
**Summary:** Derived metadata is the largest source of review debt. Findings repeatedly cite stale `description.json` and `graph-metadata.json` fields, low-signal entity extraction, duplicate key-file paths, and graph surfaces that omit or overstate the canonical packet evidence.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-108 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P0-001] Strict packet validation currently fails despite completion status. _(dimension: correctness)_ | `checklist.md:75`; `implementation-summary.md:103`; `implementation-summary.md:16`; `graph-metadata.json:209`; live validator output returned `RESULT: FAILED (strict)`. |
| CF-181 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-001] Recursive skill graph scan ingests a non-skill graph-metadata fixture and can leave the SQLite graph empty _(dimension: correctness)_ | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-137 | `001-search-and-routing-tuning` | [F001] Root packet completion state disagrees with graph-derived status _(dimension: correctness)_ | `spec.md:33-35`; `graph-metadata.json:37-45`; `graph-metadata.json:95-97` |
| CF-138 | `001-search-and-routing-tuning` | [F002] `description.json` overstates the root packet's authority _(dimension: traceability)_ | `description.json:21`; `spec.md:54-57`; `spec.md:66-74` |
| CF-139 | `001-search-and-routing-tuning` | [F003] Child packet 001 is level 3 complete without level-3 closeout surfaces _(dimension: maintainability)_ | `001-search-fusion-tuning/spec.md:2-5`; `SKILL.md:393-397`; `001-search-fusion-tuning/graph-metadata.json:195-200` |
| CF-140 | `001-search-and-routing-tuning` | [F004] Child packet 002 is level 3 complete without level-3 closeout surfaces _(dimension: traceability)_ | `002-content-routing-accuracy/spec.md:2-5`; `SKILL.md:393-397`; `002-content-routing-accuracy/graph-metadata.json:202-207` |
| CF-037 | `001-search-and-routing-tuning/001-search-fusion-tuning` | [DRV-P1-006] `graph-metadata.json` still points to stale `configs/search-weights.json` metadata. _(dimension: traceability)_ | `graph-metadata.json:39-56`; `spec.md:38-42` |
| CF-016 | `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | [F004] `graph-metadata.json` carries conflicting intent-classifier test paths _(dimension: maintainability)_ | [SOURCE: graph-metadata.json:34-41] |
| CF-042 | `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | [F004] Continuity frontmatter lags the packet metadata refresh by eight days. _(dimension: traceability)_ | `implementation-summary.md:12-16`, `graph-metadata.json:191-203` |
| CF-050 | `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | [F005] Continuity metadata hides the packet's remaining verification follow-up _(dimension: maintainability)_ | `implementation-summary.md:15-17`, `implementation-summary.md:26-29`, `implementation-summary.md:108-110`, `checklist.md:13-16` |
| CF-059 | `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | [F002] Canonical packet surfaces disagree on completion state _(dimension: correctness)_ | `spec.md:30`, `spec.md:49`, `implementation-summary.md:15`, `implementation-summary.md:28`, `graph-metadata.json:42` |
| CF-065 | `001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety` | [F002] `graph-metadata.json` `key_files` includes `tests/handler-memory-save.vitest.ts`, a repo-invalid path missing the `.opencode/skill/system-spec-kit/mcp_server/` prefix. _(dimension: traceability)_ | [SOURCE: graph-metadata.json:33-41], [SOURCE: implementation-summary.md:66-68] |
| CF-066 | `001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety` | [F003] `graph-metadata.json` stores `memory-save.ts` as `mcp_server/handlers/memory-save.ts`, dropping the system-spec-kit prefix and breaking path-level traceability. _(dimension: traceability)_ | [SOURCE: graph-metadata.json:83-86] |
| CF-071 | `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | [F006] The packet's `metadata_only -> implementation-summary.md` closure only becomes true after `memory-save.ts` resolves the router's internal `spec-frontmatter` alias. _(dimension: correctness)_ | `spec.md:23`; `spec.md:25`; `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:197`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1144`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157` |
| CF-132 | `001-search-and-routing-tuning/003-graph-metadata-validation` | [F003] Documented 16-entity cap drifts from live parser behavior _(dimension: correctness)_ | `spec.md:29-30`; `graph-metadata-parser.ts:897-912` |
| CF-133 | `001-search-and-routing-tuning/003-graph-metadata-validation` | [F004] Documented derived-field caps are not enforced by the schema validator _(dimension: correctness)_ | `spec.md:27-30`; `graph-metadata-schema.ts:36-49` |
| CF-135 | `001-search-and-routing-tuning/003-graph-metadata-validation` | [F006] Derived key_files still store the same parser file under mixed path formats _(dimension: maintainability)_ | `spec.md:37-40`; `graph-metadata.json:41-45` |
| CF-082 | `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | [F004] Packet evidence still points reviewers at `graph-metadata-parser.ts:498-510`, while the live fallback branch now lives at `969-1014`. _(dimension: traceability)_ | `spec.md:18-19`; `plan.md:13-14`; `checklist.md:7-8`; `graph-metadata-parser.ts:969-1014` |
| CF-084 | `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | [F006] `spec.md` under-documents the delivered verification surface by omitting the regression-test file that the packet’s own summary and graph metadata include. _(dimension: maintainability)_ | `spec.md:16-19`; `implementation-summary.md:63-70`; `graph-metadata.json:33-43` |
| CF-088 | `001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files` | [F002] `plan.md` still cites `../research/research.md` even though the current packet's derived source-doc inventory no longer includes a research artifact. _(dimension: traceability)_ | `plan.md:13-16`; `graph-metadata.json:195-201` |
| CF-089 | `001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files` | [F003] `decision-record.md` repeats the same stale `../research/research.md` authority path. _(dimension: traceability)_ | `decision-record.md:6-10`; `graph-metadata.json:195-201` |
| CF-090 | `001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files` | [F004] `checklist.md` marks blocking claims complete using stale parser line numbers that no longer land on the cited predicate/filter logic. _(dimension: traceability)_ | `checklist.md:7-13`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:545-590`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:929-942` |
| CF-091 | `001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files` | [F005] `graph-metadata.json` still stores duplicate aliases for the same parser/test files (`.opencode/skill/...` and `mcp_server/...`). _(dimension: maintainability)_ | `graph-metadata.json:33-40`; `implementation-summary.md:53-57`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:717-789` |
| CF-093 | `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | [F002] The packet claims the 16-entity cap is preserved, but live parser and test behavior now use a 24-entity cap. _(dimension: correctness)_ | `plan.md:16`; `tasks.md:10`; `checklist.md:12`; `implementation-summary.md:53`; `graph-metadata-parser.ts:912`; `graph-metadata-schema.vitest.ts:514-522` |
| CF-098 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F001] Completed packet claims active-only default, but implementation is inclusive by default. _(dimension: correctness)_ | `tasks.md:6`, `implementation-summary.md:39`, `backfill-graph-metadata.ts:7`, `backfill-graph-metadata.ts:73`, `graph-metadata-backfill.vitest.ts:78` |
| CF-099 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F002] Completed regression-test task describes the opposite of the checked-in test behavior. _(dimension: traceability)_ | `tasks.md:8`, `graph-metadata-backfill.vitest.ts:78`, `graph-metadata-backfill.vitest.ts:117` |
| CF-110 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P1-002] Graph README Key Files table is split by the new derivation section. _(dimension: maintainability)_ | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:82-100`. |
| CF-112 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P1-004] Verification-only scan surfaces are claimed but not traceable from spec scope. _(dimension: traceability)_ | `spec.md:91-101`; `checklist.md:55`; `implementation-summary.md:58-59`; `graph-metadata.json:43-59`. |
| CF-116 | `001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution` | [DR-SEC-001] Embedded parent-directory segments can escape intended key-file lookup roots because only leading `../` is rejected before `path.resolve()` lookup checks. _(dimension: security)_ | `graph-metadata-parser.ts:557`, `graph-metadata-parser.ts:730`, `graph-metadata-parser.ts:747`, `checklist.md:18` |
| CF-209 | `002-skill-advisor-graph` | [F004] Parent docs and graph metadata still point at retired skill-advisor runtime paths _(dimension: traceability)_ | - |
| CF-146 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-003] `graph-metadata.json` derived key files/entities retain stale paths. _(dimension: traceability)_ | `graph-metadata.json:50`, `graph-metadata.json:71`, `graph-metadata.json:89`. |
| CF-153 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F001] Packet routes operators to a non-existent Skill Advisor package root. _(dimension: correctness)_ | `spec.md:73`, `spec.md:104`, `graph-metadata.json:41`, `graph-metadata.json:48` |
| CF-155 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F003] Completion metadata contradicts verification state. _(dimension: traceability)_ | `spec.md:40`, `tasks.md:40`, `tasks.md:79`, `checklist.md:38`, `checklist.md:79`, `graph-metadata.json:39` |
| CF-168 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F004] Checklist evidence for `graph-metadata.json` key files does not match the actual `derived.key_files` array. _(dimension: traceability)_ | `checklist.md:57`, `graph-metadata.json:43`, `graph-metadata.json:64`, `graph-metadata.json:215` |
| CF-169 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F005] Moved packet metadata still exposes `011-skill-advisor-graph` as current parent/owner context in places, while the active packet path is under `002-skill-advisor-graph`. _(dimension: traceability)_ | `description.json:2`, `description.json:18`, `decision-record.md:38`, `decision-record.md:136` |
| CF-189 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-COR-001] Packet points to stale skill-advisor implementation paths. _(dimension: correctness)_ | `spec.md:101-104`, `graph-metadata.json:44-47`; actual files are under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...`. |
| CF-192 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-TRC-001] Graph metadata status contradicts the packet completion state. _(dimension: traceability)_ | `spec.md:54` says Complete; `graph-metadata.json:42` says `in_progress`. |
| CF-201 | `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | [DRFC-P1-003] Pattern-source references point to the obsolete skill-advisor path. _(dimension: traceability)_ | `plan.md:36-39`; `graph-metadata.json:41-43`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:13` |
| CF-202 | `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | [DRFC-P1-004] Level 3 review packet is missing `decision-record.md` and `implementation-summary.md`. _(dimension: traceability)_ | `spec.md:24`; `graph-metadata.json:199-203`; filesystem absence of both files |
| CF-218 | `003-advisor-phrase-booster-tailoring` | [F004] Spec docs and generated graph metadata point to non-existent `.opencode/skill/skill-advisor/...` paths. _(dimension: traceability)_ | `spec.md:54`, `spec.md:106`, `spec.md:107`, `implementation-summary.md:18`, `implementation-summary.md:78`, `graph-metadata.json:42`, `graph-metadata.json:53` |
| CF-219 | `003-advisor-phrase-booster-tailoring` | [F005] `graph-metadata.json` still says `status: planned` while the implementation summary/checklist say complete. _(dimension: traceability)_ | `graph-metadata.json:40`, `implementation-summary.md:26`, `implementation-summary.md:49`, `checklist.md:125`, `description.json:11` |
| CF-243 | `004-smart-router-context-efficacy` | [DR-MNT-001] Root graph metadata indexes only `spec.md` and omits completed child evidence. _(dimension: maintainability)_ | `graph-metadata.json:6-9`, `graph-metadata.json:31-49`, `002-skill-md-intent-router-efficacy/graph-metadata.json:43-55` |
| CF-234 | `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | [F001] Strict validation is claimed as complete, but the current strict validator fails. _(dimension: correctness)_ | `spec.md:123`, `spec.md:134`, `checklist.md:65`, `implementation-summary.md:115`, `spec.md:14`, `graph-metadata.json:77` |
| CF-268 | `007-deferred-remediation-and-telemetry-run` | [F001] Track 1 remains marked blocked although Codex registration files now exist. _(dimension: traceability)_ | `.codex/settings.json:1`, `.codex/policy.json:1`, `tasks.md:52`, `tasks.md:53`, `checklist.md:78`, `implementation-summary.md:64`, `implementation-summary.md:122`, `graph-metadata.json:47` |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-143 | `001-search-and-routing-tuning` | [F007] Root graph metadata still contains parser-noise entities _(dimension: maintainability)_ | `graph-metadata.json:71-88`; `003-graph-metadata-validation/spec.md:37-41` |
| CF-018 | `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | [F006] `graph-metadata.json` entity extraction includes low-signal tokens _(dimension: maintainability)_ | [SOURCE: graph-metadata.json:129] [SOURCE: graph-metadata.json:159] [SOURCE: graph-metadata.json:183] |
| CF-024 | `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | [F006] Generated metadata still advertises the pre-decision `4-5` ambiguity _(dimension: traceability)_ | `graph-metadata.json:25` |
| CF-057 | `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | [F006] Packet closure documents are internally inconsistent after completion. _(dimension: maintainability)_ | [SOURCE: `decision-record.md:1`] [SOURCE: `spec.md:1`] [SOURCE: `checklist.md:1`] [SOURCE: `graph-metadata.json:31`] |
| CF-063 | `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | [F006] graph-metadata entity extraction is carrying low-signal prose fragments _(dimension: maintainability)_ | `graph-metadata.json:193`, `graph-metadata.json:199`, `graph-metadata.json:205` |
| CF-073 | `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | [F004] `graph-metadata.json.derived.key_files` mixes canonical repo-relative paths with broken shorthand duplicates. _(dimension: maintainability)_ | `graph-metadata.json:33`; `graph-metadata.json:39`; `graph-metadata.json:40` |
| CF-074 | `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | [F005] `graph-metadata.json.derived.entities` still retains anchor markup and low-signal tokens. _(dimension: maintainability)_ | `graph-metadata.json:118`; `graph-metadata.json:130`; `graph-metadata.json:136`; `graph-metadata.json:142` |
| CF-136 | `001-search-and-routing-tuning/003-graph-metadata-validation` | [F007] Derived entity list still contains low-signal heading fragments _(dimension: correctness)_ | `graph-metadata.json:126-177` |
| CF-085 | `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | [F002] Derived graph metadata publishes broader root-scoped repository paths than the packet needs for its own review surface. _(dimension: security)_ | `graph-metadata.json:33-61` |
| CF-086 | `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | [F007] `graph-metadata.json` duplicates the parser/test file pair under two path spellings, increasing normalization cost for downstream consumers. _(dimension: maintainability)_ | `graph-metadata.json:33-43` |
| CF-094 | `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | [F003] The packet's graph metadata keeps mixed-format duplicate `key_files` for the same parser/test files. _(dimension: maintainability)_ | `graph-metadata.json:33-41`; `graph-metadata-parser.ts:938-942` |
| CF-095 | `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | [F004] The packet's entity list includes stop-word key phrases `a` and `the`, which waste entity slots. _(dimension: maintainability)_ | `graph-metadata.json:137-146`; `graph-metadata-parser.ts:897-908`; `entity-extractor.ts:139-149` |
| CF-097 | `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | [F006] Spec and plan line anchors for `deriveEntities()` point at stale parser line ranges. _(dimension: traceability)_ | `spec.md:18`; `plan.md:13-14`; `graph-metadata-parser.ts:820` |
| CF-103 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F006] Malformed `--root` usage silently falls back to the default root. _(dimension: security)_ | `backfill-graph-metadata.ts:89`, `backfill-graph-metadata.ts:90`, `backfill-graph-metadata.ts:91` |
| CF-104 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F007] `spec.md` key-files list omits the regression test that the packet relies on. _(dimension: maintainability)_ | `spec.md:20`, `spec.md:22`, `graph-metadata.json:34`, `graph-metadata.json:36` |
| CF-105 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F008] Generated entity extraction contains low-quality placeholder entities. _(dimension: maintainability)_ | `graph-metadata.json:93`, `graph-metadata.json:99`, `graph-metadata.json:111`, `graph-metadata.json:177` |
| CF-106 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F009] Verification command in the plan is a mutating backfill command, not a scan-only proof. _(dimension: correctness)_ | `plan.md:20`, `backfill-graph-metadata.ts:214`, `backfill-graph-metadata.ts:216` |
| CF-114 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P2-002] Derived entities include title-fragment noise. _(dimension: maintainability)_ | `graph-metadata.json:164-204`. |
| CF-119 | `001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution` | [DR-MNT-001] `graph-metadata.json` stores duplicate display paths for the same parser/test files. _(dimension: maintainability)_ | `graph-metadata.json:35`, `graph-metadata.json:36`, `graph-metadata.json:40`, `graph-metadata.json:43` |
| CF-122 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-COR-001] External canonical-doc filtering can overmatch non-spec support docs by suffix. _(dimension: correctness)_ | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:845`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:848`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:885` |
| CF-123 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-COR-002] Runtime-name test directly asserts only three of the nine banned names. _(dimension: correctness)_ | `spec.md:24`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:521`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:524` |
| CF-125 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-TRC-003] `graph-metadata.json` has duplicate aliases for the parser and test files in `derived.key_files`. _(dimension: traceability)_ | `graph-metadata.json:34`, `graph-metadata.json:43`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:94` |
| CF-126 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-TRC-004] Implementation summary visible metadata collapses the full packet route to a basename. _(dimension: traceability)_ | `implementation-summary.md:14`, `implementation-summary.md:44` |
| CF-128 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-MTN-001] Graph metadata README omits the new 24 cap, runtime-name filter, and external canonical-doc skip. _(dimension: maintainability)_ | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:88`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:95`, `implementation-summary.md:58`, `implementation-summary.md:61` |
| CF-214 | `002-skill-advisor-graph` | [F009] Packet status surfaces disagree between implemented docs and graph metadata _(dimension: traceability)_ | - |
| CF-158 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F006] `graph-metadata.json` `key_files` is stale and truncated against the current surface. _(dimension: maintainability)_ | `graph-metadata.json:40`, `graph-metadata.json:60`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:42`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:55` |
| CF-171 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F007] Timestamp terminology is split between `last_updated_at` guidance and packet graph metadata using `last_save_at`. _(dimension: traceability)_ | `spec.md:170`, `spec.md:210`, `graph-metadata.json:213` |
| CF-179 | `002-skill-advisor-graph/005-repo-wide-path-migration` | [F006] Continuity frontmatter is stale relative to refreshed graph metadata. _(dimension: maintainability)_ | Markdown frontmatter keeps April 13 timestamps; `description.json:11` and `graph-metadata.json:219` show April 21; validator emitted `CONTINUITY_FRESHNESS`. |
| CF-195 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-TRC-004] Graph metadata does not encode the documented predecessor dependency. _(dimension: traceability)_ | `spec.md:58`; `graph-metadata.json:7-10`. |
| CF-196 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-MNT-001] Continuity timestamps are stale relative to graph metadata. _(dimension: maintainability)_ | Validator `CONTINUITY_FRESHNESS` warning. |
| CF-198 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-MNT-003] Verification summary is dated before the migrated metadata state. _(dimension: maintainability)_ | `checklist.md:124` versus `description.json:11`. |
| CF-238 | `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | [F005] `decision-record.md` is absent and not explicitly marked non-applicable. _(dimension: traceability)_ | `graph-metadata.json:44`, `graph-metadata.json:80`, `implementation-summary.md:61`, `implementation-summary.md:70` |
| CF-255 | `005-skill-advisor-docs-and-code-alignment` | [F006] Spec status and continuity metadata are stale after completion. _(dimension: maintainability)_ | `spec.md:16`, `spec.md:40`, `graph-metadata.json:43`, `implementation-summary.md:20` |
| CF-256 | `005-skill-advisor-docs-and-code-alignment` | [F007] Migrated packet mixes 022/Phase 022 labels with local 005 path. _(dimension: maintainability)_ | `description.json:15`, `implementation-summary.md:39`, `graph-metadata.json:98` |
| CF-262 | `006-smart-router-remediation-and-opencode-plugin` | [F003] Prompt-safe status still exposes local executable/path metadata _(dimension: security)_ | .opencode/plugins/spec-kit-skill-advisor.js:405 |

## Theme 2: Spec Structure and Validation
**Affected phases:** 28 (`001-search-and-routing-tuning/001-search-fusion-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty`, `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry`, +25 more)
**Severity distribution:** P0=1 P1=36 P2=23
**Summary:** Many packets are complete in intent but incomplete as spec-kit artifacts. The repeated failures are missing required Level 2/3 surfaces, stale checklist or task IDs, absent decision records, and strict-validation gaps that make completion claims harder to trust.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-207 | `002-skill-advisor-graph` | [F002] Strict recursive packet validation fails with active template and integrity errors _(dimension: traceability)_ | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-032 | `001-search-and-routing-tuning/001-search-fusion-tuning` | [DRV-P1-001] Root packet closeout does not answer the packet's own RQ-1..RQ-5 or capture threshold recommendations/measurements. _(dimension: correctness)_ | `spec.md:28-60`; `tasks.md:11-16`; `checklist.md:13-21` |
| CF-033 | `001-search-and-routing-tuning/001-search-fusion-tuning` | [DRV-P1-002] Root Level 3 packet is missing `implementation-summary.md`. _(dimension: traceability)_ | `spec.md:2-5`; `AGENTS.md:260-268`; `001-search-fusion-tuning(dir):1-13` |
| CF-034 | `001-search-and-routing-tuning/001-search-fusion-tuning` | [DRV-P1-003] Root Level 3 packet is missing `decision-record.md`. _(dimension: traceability)_ | `spec.md:2-5`; `AGENTS.md:260-265`; `001-search-fusion-tuning(dir):1-13` |
| CF-035 | `001-search-and-routing-tuning/001-search-fusion-tuning` | [DRV-P1-004] Child decision records in phases `001-004` still say `status: planned` after packet completion. _(dimension: maintainability)_ | `001-remove-length-penalty/decision-record.md:1-3`; `002-add-reranker-telemetry/decision-record.md:1-3`; `003-continuity-search-profile/decision-record.md:1-3`; `004-raise-rerank-minimum/decision-record.md:1-3` |
| CF-002 | `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | [DR-P1-002] `plan.md` still tells follow-on work to remove helper surfaces that the shipped implementation intentionally kept as compatibility no-ops. _(dimension: traceability)_ | [SOURCE: plan.md:8] [SOURCE: plan.md:13-14] [SOURCE: implementation-summary.md:39-41] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577] |
| CF-003 | `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | [DR-P1-003] `checklist.md` records a targeted verification result of `15 files / 363 tests` for the documented four-suite command. _(dimension: traceability)_ | [SOURCE: checklist.md:9] |
| CF-004 | `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | [DR-P1-004] `decision-record.md` still reports `status: planned` even though the packet is complete. _(dimension: maintainability)_ | [SOURCE: decision-record.md:1-3] [SOURCE: spec.md:1-7] |
| CF-005 | `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | [DR-P1-005] The ADR still documents temporary `lp` cache-bucket duplication after tasks and implementation-summary say that fix already landed. _(dimension: maintainability)_ | [SOURCE: decision-record.md:10] [SOURCE: tasks.md:11] [SOURCE: implementation-summary.md:52-53] |
| CF-006 | `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | [DR-P1-006] `implementation-summary.md` now carries its own incompatible exact test count (`4 files / 126 tests`) for the same four-suite command. _(dimension: traceability)_ | [SOURCE: implementation-summary.md:47-48] [SOURCE: checklist.md:9] |
| CF-009 | `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry` | [F002] Packet docs still point at a removed sibling research path _(dimension: traceability)_ | `plan.md:13-15`, `tasks.md:6-7`, `checklist.md:11`, `decision-record.md:7` |
| CF-012 | `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry` | [F005] Decision record still advertises the phase as planned _(dimension: traceability)_ | `decision-record.md:1-3`, `spec.md:1-5`, `implementation-summary.md:1-10` |
| CF-013 | `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | [F001] `tasks.md` contradicts its own intent-classifier boundary _(dimension: traceability)_ | [SOURCE: tasks.md:8] [SOURCE: tasks.md:11] [SOURCE: tasks.md:15] |
| CF-014 | `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | [F002] `plan.md` and `implementation-summary.md` never reconcile the intent-classifier exception _(dimension: traceability)_ | [SOURCE: plan.md:13-16] [SOURCE: implementation-summary.md:52-54] |
| CF-017 | `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | [F005] Packet verification points at the wrong runtime seam for continuity handoff _(dimension: traceability)_ | [SOURCE: plan.md:13-16] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221-1227] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830-832] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:567-572] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209-210] |
| CF-077 | `001-search-and-routing-tuning/002-content-routing-accuracy` | [F003] Root closeout no longer preserves a parent-level synthesis for the original research exit criteria. _(dimension: correctness / traceability)_ | [SOURCE: `spec.md:67-73`] [SOURCE: `tasks.md:11-14`] [SOURCE: `checklist.md:13-19`] |
| CF-039 | `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | [F001] Packet rationale cites a missing research source. _(dimension: traceability)_ | `plan.md:13-16`, `tasks.md:6-8`, `checklist.md:7`, `decision-record.md:7` |
| CF-046 | `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | [F001] Packet completion surfaces overstate closure while checklist work remains open _(dimension: traceability)_ | `checklist.md:13-16`, `spec.md:3`, `implementation-summary.md:26-29` |
| CF-058 | `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | [F001] Strict-validation success claims are stale _(dimension: correctness)_ | `tasks.md:79`, `checklist.md:83`, `implementation-summary.md:117` |
| CF-131 | `001-search-and-routing-tuning/003-graph-metadata-validation` | [F002] Packet closeout surfaces overstate root refresh completion _(dimension: traceability)_ | `tasks.md:13`; `checklist.md:15`; `implementation-summary.md:25-26` |
| CF-134 | `001-search-and-routing-tuning/003-graph-metadata-validation` | [F005] Level-3 root packet is missing the required decision record surface _(dimension: maintainability)_ | `spec.md:3-4`; `AGENTS.md:260-265` |
| CF-211 | `002-skill-advisor-graph` | [F006] Child phase packets mix planned state, implemented runtime state, and incomplete Level 3 scaffolds _(dimension: maintainability)_ | - |
| CF-156 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F004] The specified 5-section RCAF template contract is incompatible with live scenario files. _(dimension: correctness)_ | `spec.md:87`, `spec.md:95`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:13`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:24` |
| CF-162 | `002-skill-advisor-graph/003-skill-advisor-packaging` | [P1-001] Catalog count and snippet-section claims are stale against the shipped catalog _(dimension: traceability)_ | `spec.md:119`; `spec.md:218`; `checklist.md:83`; `decision-record.md:109`; `decision-record.md:132`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:31`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md:13` |
| CF-166 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F002] The recorded compiler validation command is stale, and the current compiler validation path returns validation failure rather than the documented pass. _(dimension: correctness)_ | `spec.md:134`, `plan.md:109`, `checklist.md:68`, `implementation-summary.md:81` |
| CF-170 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F006] The recorded regression command writes outside the packet boundary and points at stale skill-advisor paths, contradicting the packet's scope claims. _(dimension: security)_ | `plan.md:123`, `tasks.md:109`, `checklist.md:78` |
| CF-175 | `002-skill-advisor-graph/005-repo-wide-path-migration` | [F002] Runtime verification paths point to a deleted skill-advisor location. _(dimension: correctness)_ | `plan.md:119-120`; `tasks.md:69-71`; `checklist.md:64-66`; `.opencode/skill/skill-advisor` is missing while the nested system-spec-kit path exists. |
| CF-176 | `002-skill-advisor-graph/005-repo-wide-path-migration` | [F003] Current compiler validation fails even at the live nested path. _(dimension: correctness)_ | `checklist.md:65`; `implementation-summary.md:84`; live `skill_graph_compiler.py --validate-only` exited 2 with zero-edge warnings for `sk-deep-research` and `sk-git`. |
| CF-177 | `002-skill-advisor-graph/005-repo-wide-path-migration` | [F004] Grep-zero and scope claims still target the old `011`/`007` root after the packet moved to `002`. _(dimension: traceability)_ | `spec.md:32`, `spec.md:115`, `spec.md:133`; `checklist.md:67`; no current `011-skill-advisor-graph` directory under the active parent. |
| CF-199 | `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | [DRFC-P1-001] Packet completion state is stale relative to shipped catalogs. _(dimension: correctness)_ | `spec.md:34-37`; `tasks.md:18-30`; `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31`; `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31`; `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29` |
| CF-215 | `003-advisor-phrase-booster-tailoring` | [F001] Regression command in the spec omits the required `--dataset` argument. The current harness requires it, so the documented command exits 2. _(dimension: correctness)_ | `skill_advisor_regression.py:8`, `skill_advisor_regression.py:242`, `spec.md:122`, `tasks.md:54`, `tasks.md:80` |
| CF-217 | `003-advisor-phrase-booster-tailoring` | [F003] REQ-010/CHK-032 claims five uplift-style validations, but four rows are `+0.00` high-confidence holds. _(dimension: correctness)_ | `spec.md:130`, `tasks.md:82`, `checklist.md:84`, `scratch/phrase-boost-delta.md:88-92` |
| CF-251 | `005-skill-advisor-docs-and-code-alignment` | [F002] README does not present hook invocation as the primary quick-start path. _(dimension: correctness)_ | `spec.md:122`, `tasks.md:42`, README lines 55, 57, 79 |
| CF-252 | `005-skill-advisor-docs-and-code-alignment` | [F003] Feature catalog lacks the claimed Phase 020 hook-surface entries. _(dimension: traceability)_ | `tasks.md:46`, `implementation-summary.md:55`, catalog lines 31 and 137 |
| CF-253 | `005-skill-advisor-docs-and-code-alignment` | [F004] Manual hook-routing smoke playbook is marked complete but absent. _(dimension: traceability)_ | `tasks.md:62`, `checklist.md:87`, missing `06--hook-routing/001-hook-routing-smoke.md` |
| CF-254 | `005-skill-advisor-docs-and-code-alignment` | [F005] Code-alignment audit target paths no longer exist. _(dimension: correctness)_ | `spec.md:82`, `tasks.md:70`, missing `mcp_server/lib/skill-advisor/freshness.ts` |
| CF-259 | `006-smart-router-remediation-and-opencode-plugin` | [F005] plan.md completion gates remain unchecked while downstream docs claim completion _(dimension: traceability)_ | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/plan.md:61 |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-022 | `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | [F004] Decision record lifecycle status is stale after completion _(dimension: maintainability)_ | `decision-record.md:3` |
| CF-045 | `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | [F007] `decision-record.md` still advertises `status: planned` after packet completion. _(dimension: maintainability)_ | `decision-record.md:1-4`, `spec.md:2-7`, `tasks.md:2-3` |
| CF-051 | `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | [F006] Decision record frontmatter still says planned after the packet completed _(dimension: maintainability)_ | `decision-record.md:1-3`, `spec.md:1-3` |
| CF-107 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F010] Review scope named `decision-record.md`, but the Level 2 packet has no such file. _(dimension: traceability)_ | `.opencode/skill/system-spec-kit/SKILL.md:397` |
| CF-113 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P2-001] Review input named `decision-record.md`, but the Level 2 packet has no such artifact. _(dimension: traceability)_ | Folder listing; `implementation-summary.md:85-92`. |
| CF-115 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P2-003] Backfill dry-run flags a false relationship hint from the phase dependency table header. _(dimension: correctness)_ | `plan.md:160`; dry-run output returned `prose_relationship_hints`. |
| CF-120 | `001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution` | [DR-TRA-002] Requested `decision-record.md` review input is absent; advisory because Level 2 packets do not strictly require it. _(dimension: traceability)_ | Packet root file listing |
| CF-124 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-TRC-002] `decision-record.md` is absent from the requested read set; key decisions live only in the summary. _(dimension: traceability)_ | `implementation-summary.md:83`, `implementation-summary.md:90` |
| CF-151 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-008] Plan still includes impossible `--audit-drift` verification for a deferred flag. _(dimension: maintainability)_ | `plan.md:185`, `checklist.md:95`; compiler help exposes no `--audit-drift`. |
| CF-152 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-009] Reason ordering debt remains and is visible in production output. _(dimension: maintainability)_ | `checklist.md:103`; `skill_advisor.py:2811` still sorts/truncates reasons alphabetically. |
| CF-159 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F007] Decision record documents obsolete expansion assumptions. _(dimension: maintainability)_ | `decision-record.md:40`, `decision-record.md:72`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:42` |
| CF-164 | `002-skill-advisor-graph/003-skill-advisor-packaging` | [P2-002] ADR-002 preserves the pre-Phase-027 catalog model _(dimension: traceability)_ | `decision-record.md:109`; `decision-record.md:132`; `decision-record.md:171`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:31` |
| CF-172 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F008] The packet hard-codes a point-in-time corpus count without defining an inclusion rule for fixtures. _(dimension: maintainability)_ | `spec.md:147`, `implementation-summary.md:90`, `checklist.md:65` |
| CF-194 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-TRC-003] `decision-record.md` was requested for review but is absent. _(dimension: traceability)_ | No such file in the packet; decisions appear only in `implementation-summary.md:93-100`. |
| CF-197 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-MNT-002] Canonical continuity regeneration remains deferred. _(dimension: maintainability)_ | `checklist.md:110`. |
| CF-205 | `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | [DRFC-P2-007] Continuity frontmatter still routes the next safe action to implementation. _(dimension: maintainability)_ | `spec.md:16-20`; `plan.md:8-12`; `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31` |
| CF-220 | `003-advisor-phrase-booster-tailoring` | [F006] Rollback instructions recommend `git checkout` against stale paths. _(dimension: security)_ | `plan.md:179`, `plan.md:227`, `scratch/phrase-boost-delta.md:195` |
| CF-222 | `003-advisor-phrase-booster-tailoring` | [F008] `decision-record.md` is absent from the requested review corpus. _(dimension: traceability)_ | Folder listing; review invocation |
| CF-224 | `003-advisor-phrase-booster-tailoring` | [F010] `tasks.md` remains unchecked despite completed implementation summary/checklist. _(dimension: correctness)_ | `tasks.md:54`, `tasks.md:67`, `tasks.md:80`, `implementation-summary.md:49`, `checklist.md:125` |
| CF-247 | `004-smart-router-context-efficacy` | [DR-COR-002] Implementation summary records strict validation without an explicit pass result. _(dimension: correctness)_ | `002-skill-md-intent-router-efficacy/implementation-summary.md:106-115`, current root validation exits 2 |
| CF-237 | `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | [F004] Verification summary leaves the strict-validator result ambiguous. _(dimension: maintainability)_ | `implementation-summary.md:107`, `implementation-summary.md:115`, `checklist.md:64`, `checklist.md:65`, `tasks.md:75`, `tasks.md:76` |
| CF-265 | `006-smart-router-remediation-and-opencode-plugin` | [F008] decision-record.md is absent from the requested review corpus _(dimension: traceability)_ | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/decision-record.md:1 |
| CF-272 | `007-deferred-remediation-and-telemetry-run` | [F005] No `decision-record.md` exists for the reviewed packet; durable decisions live only in `implementation-summary.md`. _(dimension: maintainability)_ | `implementation-summary.md:95`, `implementation-summary.md:104` |

## Theme 3: Evidence, References, and Replayability
**Affected phases:** 25 (`001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum`, `001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment`, `001-search-and-routing-tuning/002-content-routing-accuracy`, +22 more)
**Severity distribution:** P0=1 P1=31 P2=14
**Summary:** A large cross-phase class concerns proof that no longer replays. Broken research paths, stale line anchors, unresolved corpus references, and ambiguous verification evidence force future reviewers to rediscover the intended proof chain manually.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-174 | `002-skill-advisor-graph/005-repo-wide-path-migration` | [F001] Packet claims strict validation passes, but current strict validation fails. _(dimension: correctness)_ | `spec.md:112`; `plan.md:59`; `implementation-summary.md:87`; current strict validation exited 2 with 15 missing-reference integrity errors. |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-021 | `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | [F003] Checklist evidence claim overstates what the implementation summary provides _(dimension: traceability)_ | `checklist.md:13` |
| CF-026 | `001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment` | [F002] Packet scope references a non-replayable target path _(dimension: traceability)_ | `spec.md:98`, `implementation-summary.md:104-105` |
| CF-078 | `001-search-and-routing-tuning/002-content-routing-accuracy` | [F004] Root packet docs drift from the active Level-3 template/anchor/retrieval contract badly enough to break current tooling expectations. _(dimension: maintainability)_ | [SOURCE: `review/validation-strict.txt:34-71`] [SOURCE: `review/validation-strict.txt:134-182`] |
| CF-040 | `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | [F002] Packet evidence still points at stale `content-router.ts` line ranges. _(dimension: traceability)_ | `plan.md:13-16`, `tasks.md:6-7`, `checklist.md:7`, `decision-record.md:8`, `content-router.ts:404-423`, `content-router.ts:965-993` |
| CF-043 | `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | [F005] Core packet docs still miss required template, anchor, and `_memory` surfaces. _(dimension: maintainability)_ | `spec.md:1-24`, `plan.md:1-25`, `tasks.md:1-14`, `checklist.md:1-16`, `decision-record.md:1-10` |
| CF-044 | `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | [F006] Completed checklist claims are not backed by structured evidence markers. _(dimension: traceability)_ | `checklist.md:7-13` |
| CF-049 | `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | [F004] Packet evidence anchors still point at pre-growth code line ranges _(dimension: maintainability)_ | `plan.md:13-16`, `checklist.md:7-12`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409-411`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001-1014`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1039-1049` |
| CF-054 | `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | [F003] The phase packet documents the wrong Tier 3 enable flag and rollout model. _(dimension: traceability)_ | [SOURCE: `implementation-summary.md:53`] [SOURCE: `implementation-summary.md:94`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:130`] |
| CF-062 | `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | [F005] Three packet docs cite a non-existent `.opencode/agent/speckit.md` surface _(dimension: maintainability)_ | `tasks.md:58`, `checklist.md:71`, `checklist.md:72`, `implementation-summary.md:104` |
| CF-067 | `001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety` | [F004] The packet’s own task IDs use `T-01`/`T-02`/`T-V1`, but the packet template and routed merge path only accept `T###` / `CHK-###`, so this packet cannot serve as a faithful self-specimen for the guard it documents. _(dimension: maintainability)_ | [SOURCE: tasks.md:16-26], [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/tasks.md:45-55], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1282-1285], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:562-563] |
| CF-081 | `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | [F003] Core rationale still cites `../research/research.md`, but that artifact is absent under the parent packet. _(dimension: traceability)_ | `plan.md:13-16`; `decision-record.md:7-10`; `checklist.md:8-12` |
| CF-083 | `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | [F005] `tasks.md` uses `T-01` / `T-V1`, but the canonical routed update path only matches `T###` / `CHK-###`. _(dimension: traceability)_ | `tasks.md:6-14`; `templates/level_2/tasks.md:45-55`; `memory-save.ts:1282-1285`; `anchor-merge-operation.ts:562-564` |
| CF-102 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F005] Checklist completion depends on non-local corpus-scan evidence that is not present in the packet. _(dimension: traceability)_ | `checklist.md:10`, `checklist.md:16`, `plan.md:20`, `plan.md:21` |
| CF-111 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P1-003] Completion evidence overstates verification by marking failed strict validation as PASS. _(dimension: correctness)_ | `plan.md:68-72`; `checklist.md:75`; `implementation-summary.md:100-103`; live validator output. |
| CF-210 | `002-skill-advisor-graph` | [F005] The requested parent decision record is absent and handover references missing review artifacts _(dimension: traceability)_ | - |
| CF-144 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-001] Validation evidence is false: current strict graph validation exits 2. _(dimension: correctness)_ | `checklist.md:58`, `checklist.md:69`, `skill_graph_compiler.py:782`, `skill_graph_compiler.py:786`; live command exits 2 with zero-edge warnings for `sk-deep-research` and `sk-git`. |
| CF-145 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-002] Spec/checklist/summary point at non-existent skill-advisor paths. _(dimension: traceability)_ | `spec.md:133`, `spec.md:142`, `implementation-summary.md:82`; actual scripts live under `system-spec-kit/mcp_server/skill-advisor/scripts/`. |
| CF-148 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-005] Graph evidence separation does not lower uncertainty. _(dimension: correctness)_ | Original spec describes confidence/uncertainty inflation; `skill_advisor.py:2791` and `skill_advisor.py:2794` calculate uncertainty before any graph-fraction handling; `skill_advisor.py:2822` only adjusts confidence. |
| CF-165 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F001] Packet completion depends on `review/deep-review-findings.md`, but that file was absent before this review created `review/`; strict validation fails on missing references to it. _(dimension: correctness)_ | `spec.md:51`, `spec.md:144`, `checklist.md:43`, `tasks.md:46` |
| CF-167 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F003] The exact corpus-count command recorded as evidence now returns `22`, not `21`. _(dimension: correctness)_ | `checklist.md:65`, `tasks.md:106`, `implementation-summary.md:78` |
| CF-190 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-COR-002] Completion evidence claims validation passed, but strict validation fails. _(dimension: correctness)_ | `checklist.md:79`; validator exits `2`; `implementation-summary.md:111` says validation was pending. |
| CF-191 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-COR-003] Checked P0 checklist evidence references nonexistent paths or stale line ranges. _(dimension: correctness)_ | `checklist.md:66-80`; actual fallback code is around `skill_advisor.py:721-758` at the new package path. |
| CF-203 | `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | [DRFC-P1-008] Strict spec validation fails Level 3 structural, anchor, frontmatter, and integrity gates. _(dimension: maintainability)_ | `review/validation-summary.md`; `plan.md:1-4`; `tasks.md:1-9`; `checklist.md:1-9` |
| CF-216 | `003-advisor-phrase-booster-tailoring` | [F002] REQ-001 verification evidence uses stale line ranges and does not scan the current `INTENT_BOOSTERS` block. _(dimension: correctness)_ | `spec.md:120`, `plan.md:85`, `plan.md:120`, `scratch/phrase-boost-delta.md:102`, `skill_advisor.py:1154`, `skill_advisor.py:1418` |
| CF-240 | `004-smart-router-context-efficacy` | [DR-COR-001] Root packet status and continuity point to already-completed work. _(dimension: correctness)_ | `spec.md:14-18`, `spec.md:40`, `001-initial-research/research/research.md:3-5`, `002-skill-md-intent-router-efficacy/spec.md:47-53`, `002-skill-md-intent-router-efficacy/implementation-summary.md:55-59` |
| CF-241 | `004-smart-router-context-efficacy` | [DR-TRC-001] Root Level 3 packet is missing required documents and anchors. _(dimension: traceability)_ | `spec.md:23`, `spec.md:38`, strict validator missing root `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, plus required anchors |
| CF-242 | `004-smart-router-context-efficacy` | [DR-TRC-002] `001-initial-research` declares Level 2 but lacks required scaffolding and structured anchors. _(dimension: traceability)_ | `001-initial-research/spec.md:1-5`, strict validator missing child `plan.md`, `tasks.md`, `checklist.md`, anchors, and template sections |
| CF-225 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P1-001] REQ-011 cross-runtime delta table is not delivered. _(dimension: correctness)_ | `../spec.md:103`, `../spec.md:104`, `research/research.md:39`, `research/research.md:41`, `research/research-validation.md:61`, `research/research-validation.md:68` |
| CF-229 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P1-005] Empirical measurement protocol is deferred rather than delivered as fixture prompts plus AI harness. _(dimension: traceability)_ | `../spec.md:97`, `research/research.md:63`, `research/research.md:65`, `research/research-validation.md:59`, `research/research-validation.md:68`, `research/iterations/iteration-018.md:20` |
| CF-250 | `005-skill-advisor-docs-and-code-alignment` | [F001] Migrated spec uses relative skill-advisor doc paths that resolve to non-existent files. _(dimension: traceability)_ | `spec.md:75`, `checklist.md:84`, resolved `.opencode/specs/skill/skill-advisor/README.md` absent |
| CF-260 | `006-smart-router-remediation-and-opencode-plugin` | [F006] Full test suite green acceptance is not evidenced _(dimension: traceability)_ | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:155 |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-079 | `001-search-and-routing-tuning/002-content-routing-accuracy` | [F006] Completed checklist items rely on prose evidence strings instead of replayable command evidence, weakening reproducibility. _(dimension: traceability / maintainability)_ | [SOURCE: `review/validation-strict.txt:30-33`] [SOURCE: `checklist.md:13-15`] |
| CF-118 | `001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution` | [DR-COR-001] Corpus hit-rate evidence is prose-only and not packet-replayable. _(dimension: correctness)_ | `implementation-summary.md:104`, `implementation-summary.md:106`, `implementation-summary.md:115` |
| CF-149 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-006] Regression evidence counts are stale. _(dimension: traceability)_ | Docs claim 44/44 and 12/12 P0; current regression reports 104/104 and 24/24 P0 across two runners. |
| CF-150 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-007] Compiled graph size evidence conflicts with current artifact. _(dimension: maintainability)_ | `checklist.md:68` and `tasks.md:77` claim under 4KB; current `skill-graph.json` is 4667 bytes. |
| CF-161 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F009] Task evidence is summary-only and cannot reproduce the claimed checks. _(dimension: traceability)_ | `tasks.md:40`, `tasks.md:79`, `checklist.md:38`, `checklist.md:79` |
| CF-173 | `002-skill-advisor-graph/004-graph-metadata-enrichment` | [F009] ADR-002 lacks the same anchor granularity and heading structure used by ADR-001. _(dimension: maintainability)_ | `decision-record.md:29`, `decision-record.md:128` |
| CF-204 | `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | [DRFC-P2-006] Catalog-root naming guidance conflicts between the packet and sk-doc reference. _(dimension: maintainability)_ | `spec.md:66-67`; `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md:62-74`; `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:82-85` |
| CF-221 | `003-advisor-phrase-booster-tailoring` | [F007] Checklist evidence index references `scratch/multi-word-inventory.md`, but that file is absent. _(dimension: traceability)_ | `checklist.md:59`, `checklist.md:134`, `tasks.md:87` |
| CF-246 | `004-smart-router-context-efficacy` | [DR-SEC-001] Default-on plugin rollout lacks an explicit adversarial corpus gate in root requirements. _(dimension: security)_ | `spec.md:91-104`, `001-initial-research/research/research.md:35-37`, `001-initial-research/research/research.md:55-57` |
| CF-248 | `004-smart-router-context-efficacy` | [DR-TRC-004] Code-graph plugin reference remains TBD after the research resolved it. _(dimension: traceability)_ | `spec.md:121`, `001-initial-research/research/research.md:47-49` |
| CF-249 | `004-smart-router-context-efficacy` | [DR-MNT-003] Follow-up recommendations are not mapped to owning packets or tasks. _(dimension: maintainability)_ | `002-skill-md-intent-router-efficacy/research/research.md:85-92`, `002-skill-md-intent-router-efficacy/spec.md:159-165` |
| CF-231 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P2-002] Default-on rollout remains blocked by adversarial and blind-following follow-up tests. _(dimension: security)_ | `research/research.md:37`, `research/research.md:57`, `research/iterations/iteration-016.md:20`, `research/iterations/iteration-018.md:24` |
| CF-232 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P2-003] Completion language can read stronger than the convergence evidence. _(dimension: correctness)_ | `../spec.md:96`, `research/iterations/iteration-020.md:21`, `research/deep-research-state.jsonl:23` |
| CF-239 | `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | [F007] Security/no-secret checklist evidence is assertion-only. _(dimension: security)_ | `checklist.md:72`, `checklist.md:75`, `research/research-validation.md:25`, `research/research-validation.md:26` |

## Theme 4: Migration, Lineage, and Identity Drift
**Affected phases:** 32 (`001-search-and-routing-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty`, +29 more)
**Severity distribution:** P0=0 P1=34 P2=8
**Summary:** The 026 renumbering left visible seams across child packets. Stale `010`, `018`, `021`, and `024` identifiers continue to appear in metadata, continuity, trigger phrases, and user-facing docs, weakening ancestry-based routing and resume behavior.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P0 findings in this theme. | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-036 | `001-search-and-routing-tuning/001-search-fusion-tuning` | [DRV-P1-005] `description.json` and `graph-metadata.json` disagree on the parent lineage after renumbering. _(dimension: traceability)_ | `description.json:15-19`; `graph-metadata.json:3-5`; `description.json:31-38` |
| CF-038 | `001-search-and-routing-tuning/001-search-fusion-tuning` | [DRV-P1-007] `prompts/deep-research-prompt.md` still points to the legacy packet path and stale open research charter. _(dimension: correctness)_ | `prompts/deep-research-prompt.md:7-9`; `prompts/deep-research-prompt.md:27-41`; `spec.md:52-60` |
| CF-001 | `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | [DR-P1-001] `description.json` still advertises the retired `010-search-and-routing-tuning` parent node after renumbering. _(dimension: traceability)_ | [SOURCE: description.json:2] [SOURCE: description.json:13-18] [SOURCE: description.json:25-31] |
| CF-010 | `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry` | [F003] `description.json` parentChain still encodes the old phase number _(dimension: traceability)_ | `description.json:16-19`, `graph-metadata.json:3-5` |
| CF-015 | `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | [F003] `description.json` retained the pre-renumber parentChain _(dimension: traceability)_ | [SOURCE: description.json:14-19] [SOURCE: description.json:26] [SOURCE: graph-metadata.json:3-5] |
| CF-019 | `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | [F001] `description.json` parent chain still points at the retired `010-search-and-routing-tuning` slug _(dimension: traceability)_ | `description.json:18` |
| CF-020 | `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | [F002] Packet-local research citations no longer resolve after migration _(dimension: traceability)_ | `plan.md:13` |
| CF-025 | `001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment` | [F001] Regenerated packet ancestry is stale after renumber _(dimension: traceability / correctness)_ | `description.json:17-22`, `graph-metadata.json:3-5`, `generate-description.ts:75-88` |
| CF-030 | `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation` | [F002] `description.json` still points at the pre-renumber parent phase _(dimension: traceability)_ | `description.json:15-20`, `description.json:31-34`, `graph-metadata.json:215-223` |
| CF-076 | `001-search-and-routing-tuning/002-content-routing-accuracy` | [F002] `description.json.parentChain` still points at `010-search-and-routing-tuning`, while `graph-metadata.json` uses the current `001-search-and-routing-tuning` parent. _(dimension: traceability)_ | [SOURCE: `description.json:14-31`] [SOURCE: `graph-metadata.json:3-5`] |
| CF-041 | `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | [F003] `description.json.parentChain` still carries the legacy `010-search-and-routing-tuning` slug. _(dimension: traceability)_ | `description.json:14-20`, `generate-description.ts:75-88`, `memory-parser.ts:532-565` |
| CF-047 | `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | [F002] Renumbered packet still cites a dead sibling research path _(dimension: traceability)_ | `plan.md:13-14`, `tasks.md:6-9`, `decision-record.md:7` |
| CF-048 | `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | [F003] description.json.parentChain still carries the obsolete 010-search-and-routing-tuning slug _(dimension: traceability)_ | `description.json:14-19`, `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-88` |
| CF-055 | `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | [F004] `description.json` parentChain still points at the pre-renumbered phase slug. _(dimension: traceability)_ | [SOURCE: `description.json:15`] |
| CF-060 | `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | [F003] `description.json` parentChain still points at the pre-renumber path _(dimension: traceability)_ | `description.json:18`, `description.json:22`, `description.json:30`, `description.json:34` |
| CF-061 | `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | [F004] Packet-local continuity identity still uses legacy 018/phase-004 markers _(dimension: traceability)_ | `spec.md:6`, `spec.md:27`, `plan.md:6`, `tasks.md:6`, `checklist.md:6`, `implementation-summary.md:25` |
| CF-064 | `001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety` | [F001] `description.json` parentChain still references `010-search-and-routing-tuning` instead of the canonical `001-search-and-routing-tuning` packet path. _(dimension: traceability)_ | [SOURCE: description.json:15-20], [SOURCE: graph-metadata.json:213-220] |
| CF-070 | `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | [F003] `description.json.parentChain` still records `010-search-and-routing-tuning` instead of the live `001-search-and-routing-tuning` segment. _(dimension: traceability)_ | `description.json:2`; `description.json:15`; `description.json:19` |
| CF-130 | `001-search-and-routing-tuning/003-graph-metadata-validation` | [F001] Root packet lineage still points at the pre-renumbering parent in canonical docs _(dimension: traceability)_ | `spec.md:6`; `description.json:15-20`; `graph-metadata.json:3-5` |
| CF-080 | `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | [F001] `description.json.parentChain` still advertises `010-search-and-routing-tuning` after the packet moved to `001-search-and-routing-tuning`, so machine-readable ancestry is wrong. _(dimension: correctness)_ | `description.json:14-20`; `generate-description.ts:75-89`; `memory-parser.ts:544-566` |
| CF-087 | `001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files` | [F001] `description.json.parentChain` still points at `010-search-and-routing-tuning` instead of the current `001-search-and-routing-tuning` branch. _(dimension: correctness)_ | `description.json:14-20`; `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-88`; `.opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts:38-42` |
| CF-092 | `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | [F001] `description.json` parentChain still points at the pre-renumbered `010-search-and-routing-tuning` phase while `specFolder` and `graph-metadata.json` point at `001-search-and-routing-tuning`. _(dimension: traceability)_ | `description.json:2`; `description.json:13-18`; `description.json:23-31`; `graph-metadata.json:3-5` |
| CF-100 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F003] `graph-metadata.json` causal summary still advertises the retired migration objective. _(dimension: traceability)_ | `spec.md:16`, `spec.md:18`, `graph-metadata.json:189` |
| CF-101 | `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | [F004] `description.json` parentChain retains stale `010-search-and-routing-tuning` after migration to `001-search-and-routing-tuning`. _(dimension: traceability)_ | `description.json:2`, `description.json:18`, `description.json:26`, `description.json:31` |
| CF-109 | `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | [DR-P1-001] `description.json` parentChain still points at old `010-search-and-routing-tuning` while packet identity is now under `001-search-and-routing-tuning`. _(dimension: traceability)_ | `description.json:2`; `description.json:17-23`; `graph-metadata.json:3-5`. |
| CF-117 | `001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution` | [DR-TRA-001] `description.json` parentChain still points at `010-search-and-routing-tuning` even though the active path is under `001-search-and-routing-tuning`. _(dimension: traceability)_ | `description.json:2`, `description.json:15`, `description.json:19`, `description.json:32` |
| CF-121 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-TRC-001] `description.json` parentChain still points at pre-renumbered `010-search-and-routing-tuning` while the active route is `001-search-and-routing-tuning`. _(dimension: traceability)_ | `description.json:2`, `description.json:18`, `description.json:26`, `description.json:31` |
| CF-178 | `002-skill-advisor-graph/005-repo-wide-path-migration` | [F005] `description.json` parentChain disagrees with the current packet location. _(dimension: traceability)_ | `description.json:14-19`; `graph-metadata.json:3-5`; `description.json:25`. |
| CF-185 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-005] Advisor runtime still silently falls back to legacy `skill-graph.json` _(dimension: correctness)_ | - |
| CF-193 | `002-skill-advisor-graph/007-skill-graph-auto-setup` | [DR-TRC-002] `description.json` parent chain still names the old `011-skill-advisor-graph` phase. _(dimension: traceability)_ | `description.json:14-19` conflicts with `description.json:2`. |
| CF-244 | `004-smart-router-context-efficacy` | [DR-MNT-002] Migrated identity still mixes `021` and `004` numbering surfaces. _(dimension: maintainability)_ | `spec.md:4-7`, `spec.md:28-29`, `description.json:11-13`, `002-skill-md-intent-router-efficacy/description.json:15-20` |
| CF-245 | `004-smart-router-context-efficacy` | [DR-TRC-003] Root corpus reference resolves to a missing path after migration. _(dimension: traceability)_ | `spec.md:116-121`, path check shows `../research/...` missing and `../../research/...` exists |
| CF-227 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P1-003] Completed research state still advertises initialized and legacy 021 lineage. _(dimension: traceability)_ | `research/deep-research-config.json:7`, `research/deep-research-config.json:9`, `research/deep-research-state.jsonl:1`, `research/deep-research-state.jsonl:23`, `graph-metadata.json:49`, `graph-metadata.json:52` |
| CF-235 | `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | [F002] Research JSONL config still points at the pre-migration spec folder. _(dimension: traceability)_ | `research/deep-research-state.jsonl:1`, `research/deep-research-config.json:7`, `graph-metadata.json:3`, `graph-metadata.json:4`, `graph-metadata.json:5` |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-142 | `001-search-and-routing-tuning` | [F006] Child specs still advertise the pre-renumber parent slug _(dimension: traceability)_ | `001-search-fusion-tuning/spec.md:6`; `002-content-routing-accuracy/spec.md:6`; `003-graph-metadata-validation/spec.md:6`; `description.json:53-56` |
| CF-127 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-TRC-005] `description.json` lastUpdated predates its own renumbered_at event. _(dimension: traceability)_ | `description.json:11`, `description.json:33` |
| CF-160 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F008] `description.json` parentChain still points at the old `011-skill-advisor-graph` phase identifier. _(dimension: traceability)_ | `description.json:14`, `description.json:19`, `description.json:30`, `description.json:36` |
| CF-180 | `002-skill-advisor-graph/005-repo-wide-path-migration` | [F007] The packet never names the two forbidden legacy patterns it claims to grep. _(dimension: maintainability)_ | `spec.md:115`; `tasks.md:72`; `implementation-summary.md:86`. |
| CF-233 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P2-004] Migrated packet metadata still exposes legacy 021 trigger phrases. _(dimension: maintainability)_ | `spec.md:3`, `spec.md:5`, `description.json:3`, `description.json:7`, `graph-metadata.json:15`, `graph-metadata.json:16`, `graph-metadata.json:35` |
| CF-236 | `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | [F003] `description.json` parentChain keeps the old phase slug after migration. _(dimension: traceability)_ | `description.json:15`, `description.json:19`, `graph-metadata.json:5`, `graph-metadata.json:106` |
| CF-264 | `006-smart-router-remediation-and-opencode-plugin` | [F007] Phase and status metadata are stale after migration/renumbering _(dimension: traceability)_ | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:40 |
| CF-274 | `007-deferred-remediation-and-telemetry-run` | [F007] Renumbered 007 packet still exposes Phase 024 identifiers in canonical user-facing docs. _(dimension: traceability)_ | `description.json:14`, `description.json:31`, `description.json:32`, `implementation-summary.md:38`, `spec.md:40`, `graph-metadata.json:104`, `graph-metadata.json:105` |

## Theme 5: Packet State, Continuity, and Closeout
**Affected phases:** 13 (`001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum`, `001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment`, `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation`, +10 more)
**Severity distribution:** P0=2 P1=7 P2=8
**Summary:** Several reports found completion surfaces that disagree with active checklist work or delivered state. These issues are less about runtime behavior and more about whether resume and orchestration surfaces dispatch the right next action.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-028 | `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation` | [—] None _(dimension: —)_ | — |
| CF-206 | `002-skill-advisor-graph` | [F001] Completed compiler validation gate is false in current repo state _(dimension: correctness)_ | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-075 | `001-search-and-routing-tuning/002-content-routing-accuracy` | [F001] Root packet is marked complete even though it currently fails the Level-3 root-packet contract. _(dimension: correctness)_ | [SOURCE: `spec.md:2-5`] [SOURCE: `review/validation-strict.txt:15-17`] [SOURCE: `AGENTS.md:260-268`] |
| CF-068 | `001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety` | [F005] `implementation-summary.md` still says the broad `handler-memory-save` suite fails outside the task-update slice, but the current full suite now passes; the limitation note is stale. _(dimension: maintainability)_ | [SOURCE: implementation-summary.md:109-111] |
| CF-208 | `002-skill-advisor-graph` | [F003] Advisor health is degraded even though the packet only records graph-loaded success _(dimension: correctness)_ | - |
| CF-212 | `002-skill-advisor-graph` | [F007] Validation and closeout claims are duplicated with stale command paths and obsolete counts _(dimension: maintainability)_ | - |
| CF-147 | `002-skill-advisor-graph/001-research-findings-fixes` | [DR-004] Current advisor health is degraded by graph/discovery inventory mismatch. _(dimension: correctness)_ | `skill_advisor.py --health` reports `status: degraded`, `inventory_parity.in_sync: false`, `missing_in_discovery: ["skill-advisor"]`. |
| CF-184 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-004] Packet documentation is not synchronized with the implemented state _(dimension: traceability)_ | - |
| CF-226 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P1-002] Canonical root spec-kit docs are absent for the reviewed packet. _(dimension: traceability)_ | `spec.md:21`, `spec.md:63`, `spec.md:69`, root directory listing |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-023 | `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | [F005] Implementation summary verification count drifted from the live suite _(dimension: maintainability)_ | `implementation-summary.md:48` |
| CF-027 | `001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment` | [F003] Changed-file summary is harder to replay than the underlying packet scope _(dimension: maintainability)_ | `spec.md:94-100`, `implementation-summary.md:72-73`, `implementation-summary.md:104-105` |
| CF-096 | `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | [F005] `_memory.continuity.next_safe_action` still says to run repo-wide backfill even though this packet and the parent closeout claim completion. _(dimension: traceability)_ | `implementation-summary.md:17`; `implementation-summary.md:27`; `../implementation-summary.md:20-21` |
| CF-129 | `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | [DR-MTN-002] REQ-002 leaves the canonical-doc exception ambiguous against the implemented external-doc skip. _(dimension: maintainability)_ | `spec.md:23`, `spec.md:31`, `implementation-summary.md:88`, `implementation-summary.md:89` |
| CF-213 | `002-skill-advisor-graph` | [F008] Parent plan still carries obsolete 20-skill and 2KB targets _(dimension: correctness)_ | - |
| CF-163 | `002-skill-advisor-graph/003-skill-advisor-packaging` | [P2-001] Implementation summary keeps a stale validator-warning limitation _(dimension: correctness)_ | `implementation-summary.md:81`; `implementation-summary.md:91` |
| CF-188 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-008] `skill_graph_status` reports `isHealthy: true` while weight-band violations exist _(dimension: maintainability)_ | - |
| CF-223 | `003-advisor-phrase-booster-tailoring` | [F009] Delta report line guidance for PHRASE additions is stale. _(dimension: maintainability)_ | `scratch/phrase-boost-delta.md:69`, `skill_advisor.py:1418`, `skill_advisor.py:1623` |

## Theme 6: Routing Accuracy and Classifier Behavior
**Affected phases:** 9 (`001-search-and-routing-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation`, `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier`, +6 more)
**Severity distribution:** P0=1 P1=6 P2=8
**Summary:** Routing findings cluster around content-router behavior, Tier3 classifier save routing, task-update merge safety, and prompt enrichment. The shared risk is that documented routing semantics or test coverage lag behind shipped routing behavior.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-052 | `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | [F001] Full-auto canonical saves bypass the advertised Tier 3 rollout gate and can exfiltrate content to the LLM endpoint. _(dimension: security)_ | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`] [SOURCE: `implementation-summary.md:53`] |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-141 | `001-search-and-routing-tuning` | [F005] Tier3 LLM routing research closes without a security objective _(dimension: security)_ | `002-content-routing-accuracy/spec.md:14`; `002-content-routing-accuracy/spec.md:35-45`; `002-content-routing-accuracy/spec.md:67-73` |
| CF-029 | `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation` | [F001] Continuity fixture validates a handover-first packet state that this packet does not ship _(dimension: correctness)_ | `spec.md:102`, `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:45-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation:1-7` |
| CF-053 | `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | [F002] Built-in Tier 3 cache keys ignore routing context and can replay stale destinations. _(dimension: correctness)_ | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:313`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:26`] |
| CF-069 | `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | [F001] The Tier 3 prompt still leaks the internal `drop_candidate` alias inside a contract that says only the existing 8 public categories are valid. _(dimension: correctness)_ | `spec.md:24`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1275`; `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582` |
| CF-157 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F005] Current prompt-leakage release gates are omitted from the packet acceptance scope. _(dimension: security)_ | `spec.md:120`, `spec.md:132`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:101`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:56` |
| CF-269 | `007-deferred-remediation-and-telemetry-run` | [F002] Analyzer artifact mixes static unknown records into the live telemetry stream while the static stream is absent. _(dimension: traceability)_ | `smart-router-analyze-report-2026-04-19T17-57-07-192Z.md:3`, `smart-router-analyze-report-2026-04-19T17-57-07-192Z.md:19`, `smart-router-analyze-report-2026-04-19T17-57-07-192Z.md:20`, `smart-router-measurement.ts:107`, `smart-router-measurement.ts:637`, `.opencode/skill/.smart-router-telemetry/compliance.jsonl:1` |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-031 | `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation` | [F003] Tier 3 prompt contract mixes canonical `drop` with the internal `drop_candidate` alias _(dimension: maintainability)_ | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273-1288`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582-585`, `implementation-summary.md:59` |
| CF-056 | `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | [F005] Shared Tier 3 cache keeps session entries forever with no bound or eviction. _(dimension: maintainability)_ | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:310`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:806`] |
| CF-072 | `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | [F002] The new continuity paragraph discloses more internal topology to the external Tier 3 classifier than before. _(dimension: security)_ | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273` |
| CF-230 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P2-001] Status diagnostics are called prompt-safe but do not define a redaction allowlist. _(dimension: security)_ | `research/research-validation.md:31`, `research/research-validation.md:33`, `research/research-validation.md:46`, `research/research-validation.md:49` |
| CF-257 | `005-skill-advisor-docs-and-code-alignment` | [F008] Prompt-cache HMAC default secret uses `Math.random()` entropy. _(dimension: security)_ | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:39` through line 41 |
| CF-263 | `006-smart-router-remediation-and-opencode-plugin` | [F004] Telemetry sanitizes control characters but does not bound caller-supplied field length _(dimension: security)_ | .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:59 |
| CF-267 | `006-smart-router-remediation-and-opencode-plugin` | [F010] Static router checker has no fixture-level regression coverage for parser variants _(dimension: maintainability)_ | .opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:55 |
| CF-270 | `007-deferred-remediation-and-telemetry-run` | [F003] Static parser leaves a large unknown/zero-resource slice, limiting savings conclusions. _(dimension: correctness)_ | `smart-router-measurement-report.md:23`, `smart-router-measurement-report.md:25`, `smart-router-measurement-report.md:30`, `smart-router-measurement-report.md:32`, `smart-router-measurement-report.md:38`, `smart-router-measurement-results.jsonl:199` |

## Theme 7: Skill Advisor Packaging and Graph
**Affected phases:** 4 (`002-skill-advisor-graph/002-manual-testing-playbook`, `002-skill-advisor-graph/006-skill-graph-sqlite-migration`, `006-smart-router-remediation-and-opencode-plugin`, +1 more)
**Severity distribution:** P0=0 P1=3 P2=4
**Summary:** Skill-advisor findings focus on packaging truth, graph setup, SQLite migration, feature-catalog expansion, and manual testing docs. Most are traceability or maintainability issues that could make advisor setup and graph reasoning drift from the shipped package.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P0 findings in this theme. | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-154 | `002-skill-advisor-graph/002-manual-testing-playbook` | [F002] The reviewed 24-scenario corpus no longer matches the live 47-scenario playbook. _(dimension: correctness)_ | `spec.md:30`, `spec.md:56`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:40`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:101` |
| CF-182 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-002] Session bootstrap does not include the required skill graph topology summary _(dimension: traceability)_ | - |
| CF-258 | `006-smart-router-remediation-and-opencode-plugin` | [F001] Native-path advisor brief hardcodes the second score as 0.00 _(dimension: correctness)_ | .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122 |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-187 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-006] Skill graph validation rules are duplicated across database, status, validate, and compiler paths _(dimension: maintainability)_ | - |
| CF-261 | `006-smart-router-remediation-and-opencode-plugin` | [F002] Status reports runtime ready before any bridge/probe validation _(dimension: correctness)_ | .opencode/plugins/spec-kit-skill-advisor.js:369 |
| CF-266 | `006-smart-router-remediation-and-opencode-plugin` | [F009] Bridge duplicates advisor rendering/sanitization logic for the native path _(dimension: maintainability)_ | .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:99 |
| CF-273 | `007-deferred-remediation-and-telemetry-run` | [F006] Live wrapper only observes exact `Read` tool names, so runtime aliases can silently evade telemetry. _(dimension: correctness)_ | `live-session-wrapper.ts:156`, `live-session-wrapper.ts:158`, `LIVE_SESSION_WRAPPER_SETUP.md:48`, `LIVE_SESSION_WRAPPER_SETUP.md:52` |

## Theme 8: Search Fusion and Reranker Tuning
**Affected phases:** 4 (`001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty`, `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry`, `002-skill-advisor-graph/008-deep-skill-feature-catalogs`, +1 more)
**Severity distribution:** P0=0 P1=4 P2=1
**Summary:** Search-tuning findings are narrower but important: continuity profile thresholds, reranker minimums, telemetry claims, and fusion evidence need tighter replay surfaces. The runtime direction is mostly sound, but packet evidence needs to stay aligned with the actual search pipeline.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P0 findings in this theme. | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-008 | `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry` | [F001] Cache key ignores document content _(dimension: correctness)_ | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248-265`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433-439` |
| CF-011 | `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry` | [F004] Stale-hit and eviction telemetry remain unprotected by targeted regression tests _(dimension: maintainability)_ | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140-153`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442-444`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:433-460`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:193-200` |
| CF-200 | `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | [DRFC-P1-002] Feature-count acceptance criteria understate the implemented catalog surface. _(dimension: correctness)_ | `spec.md:103-106`; `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31`; `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31`; `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29` |
| CF-228 | `004-smart-router-context-efficacy/001-initial-research` | [DR-P1-004] Plugin proposal omits explicit manifest and concrete hook registration detail required by REQ-010. _(dimension: correctness)_ | `../spec.md:103`, `research/research-validation.md:22`, `research/research-validation.md:33`, `research/research-validation.md:51`, `research/research-validation.md:56` |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-007 | `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | [DR-P2-001] No-op `LENGTH_PENALTY`, `calculateLengthPenalty()`, and `applyLengthPenalty()` remain public compatibility exports, extending the contract and test surface. _(dimension: maintainability)_ | [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62-67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230-239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577] |

## Theme 9: Security and Guardrails
**Affected phases:** 1 (`002-skill-advisor-graph/006-skill-graph-sqlite-migration`)
**Severity distribution:** P0=0 P1=2 P2=0
**Summary:** Security-specific residuals are concentrated in redaction, path containment, prompt-safety, adversarial-corpus gates, and denylist limitations. Most were advisory, but they should be remediated before default-on rollout or trusted metadata ingestion expands.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P0 findings in this theme. | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-183 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-003] `skill_graph_query` leaks nested `sourcePath` and `contentHash` in several response shapes _(dimension: security)_ | - |
| CF-186 | `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | [F-007] `skill_graph_scan` can erase the live graph when pointed at an empty workspace directory _(dimension: security)_ | - |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P2 findings in this theme. | - |

## Theme 10: Telemetry, Measurement, and Rollout Controls
**Affected phases:** 1 (`007-deferred-remediation-and-telemetry-run`)
**Severity distribution:** P0=0 P1=0 P2=1
**Summary:** Telemetry debt is concentrated in the final rollout packet. Static and live telemetry streams are not cleanly separated, and measurement coverage has caveats that need to be explicit before the results drive remediation priority.

### P0 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P0 findings in this theme. | - |

### P1 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P1 findings in this theme. | - |

### P2 Findings
| ID | Phase | Finding | Evidence |
| --- | --- | --- | --- |
| CF-271 | `007-deferred-remediation-and-telemetry-run` | [F004] Codex denylist is phrase-based and remains a starter guard, not a comprehensive destructive-command policy. _(dimension: security)_ | `.codex/policy.json:4`, `.codex/policy.json:22`, `pre-tool-use.ts:168`, `pre-tool-use.ts:174` |

## Per-Phase Verdict Table
| Phase | Verdict | P0 | P1 | P2 |
| --- | --- | ---: | ---: | ---: |
| `001-search-and-routing-tuning` | CONDITIONAL | 0 | 5 | 2 |
| `001-search-and-routing-tuning/001-search-fusion-tuning` | CONDITIONAL | 0 | 7 | 0 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | CONDITIONAL | 0 | 6 | 1 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry` | CONDITIONAL | 0 | 5 | 0 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | CONDITIONAL | 0 | 5 | 1 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | PASS | 0 | 3 | 3 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment` | CONDITIONAL | 0 | 2 | 1 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation` | PASS | 1 | 2 | 1 |
| `001-search-and-routing-tuning/002-content-routing-accuracy` | CONDITIONAL | 0 | 4 | 1 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | CONDITIONAL | 0 | 6 | 1 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | CONDITIONAL | 0 | 5 | 1 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | FAIL | 1 | 3 | 2 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | CONDITIONAL | 0 | 5 | 1 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety` | CONDITIONAL | 0 | 5 | 0 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | PASS | 0 | 3 | 3 |
| `001-search-and-routing-tuning/003-graph-metadata-validation` | CONDITIONAL | 0 | 6 | 1 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | CONDITIONAL | 0 | 5 | 2 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files` | CONDITIONAL | 0 | 5 | 0 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | FAIL | 0 | 2 | 4 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | CONDITIONAL | 0 | 5 | 5 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | FAIL | 1 | 4 | 3 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution` | PASS | 0 | 2 | 3 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | PASS | 0 | 1 | 8 |
| `002-skill-advisor-graph` | FAIL | 2 | 5 | 2 |
| `002-skill-advisor-graph/001-research-findings-fixes` | CONDITIONAL | 0 | 5 | 4 |
| `002-skill-advisor-graph/002-manual-testing-playbook` | CONDITIONAL | 0 | 5 | 4 |
| `002-skill-advisor-graph/003-skill-advisor-packaging` | PASS | 0 | 1 | 2 |
| `002-skill-advisor-graph/004-graph-metadata-enrichment` | CONDITIONAL | 0 | 6 | 3 |
| `002-skill-advisor-graph/005-repo-wide-path-migration` | FAIL | 1 | 4 | 2 |
| `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | FAIL | 1 | 5 | 2 |
| `002-skill-advisor-graph/007-skill-graph-auto-setup` | CONDITIONAL | 0 | 5 | 5 |
| `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | CONDITIONAL | 0 | 5 | 2 |
| `003-advisor-phrase-booster-tailoring` | CONDITIONAL | 0 | 5 | 5 |
| `004-smart-router-context-efficacy` | CONDITIONAL | 0 | 6 | 4 |
| `004-smart-router-context-efficacy/001-initial-research` | CONDITIONAL | 0 | 5 | 4 |
| `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | PASS | 0 | 2 | 4 |
| `005-skill-advisor-docs-and-code-alignment` | CONDITIONAL | 0 | 5 | 3 |
| `006-smart-router-remediation-and-opencode-plugin` | CONDITIONAL | 0 | 3 | 7 |
| `007-deferred-remediation-and-telemetry-run` | PASS | 0 | 2 | 5 |

## Cross-Phase Patterns
- Systemic: Graph metadata quality/coverage drift appears in 33 phases (`001-search-and-routing-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile`, +30 more).
- Systemic: Stale `description.json.parentChain` / lineage after renumbering appears in 21 phases (`001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry`, `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile`, `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum`, +18 more).
- Systemic: Decision-record/status closeout drift appears in 16 phases (`001-search-and-routing-tuning/001-search-fusion-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty`, `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry`, +13 more).
- Systemic: Legacy numbering/migration identifiers remain visible appears in 10 phases (`001-search-and-routing-tuning/001-search-fusion-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty`, `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment`, +7 more).
- Systemic: Incomplete spec scaffolding / validation surfaces appears in 8 phases (`001-search-and-routing-tuning`, `001-search-and-routing-tuning/001-search-fusion-tuning`, `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files`, +5 more).
- Systemic: Broken or non-replayable research evidence paths appears in 5 phases (`001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum`, `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion`, `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion`, +2 more).
- Metadata and spec-doc remediation should be batched before runtime follow-up work, because many runtime-facing claims are currently obscured by stale packet identity, graph, and evidence surfaces.
- Several PASS or PASS-with-advisories packets still carry P1/P2 traceability debt, so verdict alone is not enough to decide remediation priority.

## Recommended Remediation Order
1. Graph and Metadata Quality (P0=2, P1=42, P2=35) — largest finding cluster and foundational for search, memory, and graph traversal correctness.
2. Packet State, Continuity, and Closeout (P0=2, P1=7, P2=8) — prevents orchestration from dispatching completed or misleading next actions.
3. Spec Structure and Validation (P0=1, P1=36, P2=23) — blocks clean validation and reliable packet completion claims.
4. Evidence, References, and Replayability (P0=1, P1=31, P2=14) — needed so 007/005 remediation can prove fixes without rediscovering every source path.
5. Routing Accuracy and Classifier Behavior (P0=1, P1=6, P2=8) — directly affects save routing, task update safety, and Tier3 classifier behavior.
6. Migration, Lineage, and Identity Drift (P0=0, P1=34, P2=8) — cross-cuts parent/child routing, resume, and memory discovery after the 026 renumber.
7. Search Fusion and Reranker Tuning (P0=0, P1=4, P2=1) — keeps search-ranking evidence aligned with shipped pipeline changes.
8. Skill Advisor Packaging and Graph (P0=0, P1=3, P2=4) — stabilizes advisor setup and catalog truth before more graph-based advisor work.
9. Security and Guardrails (P0=0, P1=2, P2=0) — protects rollout and metadata ingestion boundaries.
10. Telemetry, Measurement, and Rollout Controls (P0=0, P1=0, P2=1) — makes rollout metrics trustworthy enough to guide final prioritization.

## Part 2: Implementation-Focused Review (Second Pass)

## Executive Summary
- **Implementation reports found:** 34 `review-impl-report.md` files in this packet.
- **Expected phase surface:** 39 phases from Part 1; 5 phases do not currently have a `review-impl/review-impl-report.md` file.
- **Raw implementation findings parsed:** 139.
- **Evidence-compliant implementation findings counted:** 137. Two shell-only findings were excluded from the counted Part 2 set because this pass requires `.ts`, `.py`, `.js`, or `.mjs` file-line evidence.
- **By severity:** P0=3 P1=84 P2=50.
- **Verdict distribution:** CONDITIONAL=21 PASS=2 FAIL/CHANGES REQUESTED=4 NO-IMPLEMENTATION=7 MISSING-REPORT=5.
- **Deduped Part 2 findings:** 129 unique code-focused findings after collapsing repeated parent/child report duplicates.
- **Main implementation verdict:** not release-clean. Most packets are directionally functional, but Tier 3 routing containment, cache identity, provider/test isolation, and regression coverage need remediation before this campaign can be treated as production-hard.

Missing implementation second-pass reports:

| Phase | Status |
| --- | --- |
| `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | Missing `review-impl-report.md` |
| `001-search-and-routing-tuning/002-content-routing-accuracy` | Missing `review-impl-report.md` |
| `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | Missing `review-impl-report.md` |
| `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | Missing `review-impl-report.md` |
| `004-smart-router-context-efficacy/001-initial-research` | Missing `review-impl-report.md` |

Evidence-rule exclusions:

| Source phase | Finding | Why excluded from counted Part 2 |
| --- | --- | --- |
| `002-skill-advisor-graph/007-skill-graph-auto-setup` | Init script aborts before JSON export and health because validation currently exits nonzero under `set -e`. | Source evidence cites only `.sh` file lines. |
| `006-smart-router-remediation-and-opencode-plugin` | Smart-router checker accepts traversal-shaped router resources because prefix/suffix validation does not reject `..` segments before checking `skill_dir / resource`. | Source evidence cites only `.sh` file lines. |

## Top Themes
- **Overlap with Part 1:** cache identity and stale routing context; Tier 3 routing/LLM guardrails; graph metadata path and key-file handling; stale telemetry/parser conclusions; test evidence that does not replay cleanly.
- **New code-specific theme: Tier 3 save containment.** Three P0s converge on the same trust boundary: model-returned routing targets are not sufficiently constrained before canonical save resolution.
- **New code-specific theme: provider and test isolation.** Reranker fallback tests, provider limits, malformed provider responses, and timeout scope all show that live-provider and response-boundary paths are under-tested.
- **New code-specific theme: advisor/runtime routing behavior.** Phrase boosters, router style parsing, prompt cache entropy, plugin bridge rendering, and live-session observation all have implementation-level gaps beyond doc drift.
- **New code-specific theme: graph metadata implementation safety.** Key-file sanitization, legacy migration bypasses, canonical-doc cap survival, and temp-file cleanup recur across parser and writer paths.

## Per-Phase Verdict Table
| Phase | Second-pass verdict | P0 | P1 | P2 | Impl findings |
| --- | --- | ---: | ---: | ---: | ---: |
| `001-search-and-routing-tuning` | FAILING VERIFICATION | 0 | 5 | 3 | 8 |
| `001-search-and-routing-tuning/001-search-fusion-tuning` | CONDITIONAL | 0 | 1 | 3 | 4 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty` | MISSING REPORT | 0 | 0 | 0 | 0 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry` | CONDITIONAL | 0 | 3 | 3 | 6 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile` | CONDITIONAL | 0 | 4 | 1 | 5 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum` | PASS WITH ADVISORIES | 0 | 1 | 2 | 3 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment` | NO-IMPLEMENTATION | 0 | 0 | 0 | 0 |
| `001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation` | CONDITIONAL | 0 | 4 | 2 | 6 |
| `001-search-and-routing-tuning/002-content-routing-accuracy` | MISSING REPORT | 0 | 0 | 0 | 0 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion` | CONDITIONAL | 0 | 4 | 1 | 5 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion` | CHANGES REQUIRED | 1 | 2 | 2 | 5 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier` | FAIL | 1 | 4 | 1 | 6 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment` | NO-IMPLEMENTATION | 0 | 0 | 0 | 0 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety` | CHANGES REQUESTED | 1 | 2 | 0 | 3 |
| `001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment` | PASS | 0 | 0 | 0 | 0 |
| `001-search-and-routing-tuning/003-graph-metadata-validation` | CONDITIONAL | 0 | 1 | 3 | 4 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation` | CONDITIONAL | 0 | 2 | 2 | 4 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files` | CONDITIONAL | 0 | 5 | 1 | 6 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities` | CONDITIONAL PASS | 0 | 2 | 3 | 5 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files` | CONDITIONAL | 0 | 1 | 3 | 4 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment` | PASS WITH P1 REMEDIATION REQUIRED | 0 | 3 | 2 | 5 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution` | CONDITIONAL PASS WITH P1 REMEDIATION NEEDED | 0 | 3 | 1 | 4 |
| `001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements` | MISSING REPORT | 0 | 0 | 0 | 0 |
| `002-skill-advisor-graph` | CONDITIONAL | 0 | 4 | 2 | 6 |
| `002-skill-advisor-graph/001-research-findings-fixes` | CONDITIONAL | 0 | 3 | 2 | 5 |
| `002-skill-advisor-graph/002-manual-testing-playbook` | CONDITIONAL | 0 | 4 | 2 | 6 |
| `002-skill-advisor-graph/003-skill-advisor-packaging` | CONDITIONAL | 0 | 2 | 1 | 3 |
| `002-skill-advisor-graph/004-graph-metadata-enrichment` | NO-IMPLEMENTATION | 0 | 0 | 0 | 0 |
| `002-skill-advisor-graph/005-repo-wide-path-migration` | NO-IMPLEMENTATION | 0 | 0 | 0 | 0 |
| `002-skill-advisor-graph/006-skill-graph-sqlite-migration` | MISSING REPORT | 0 | 0 | 0 | 0 |
| `002-skill-advisor-graph/007-skill-graph-auto-setup` | CONDITIONAL | 0 | 5 | 2 | 7 |
| `002-skill-advisor-graph/008-deep-skill-feature-catalogs` | NO-IMPLEMENTATION | 0 | 0 | 0 | 0 |
| `003-advisor-phrase-booster-tailoring` | CONDITIONAL | 0 | 5 | 1 | 6 |
| `004-smart-router-context-efficacy` | NO-IMPLEMENTATION | 0 | 0 | 0 | 0 |
| `004-smart-router-context-efficacy/001-initial-research` | MISSING REPORT | 0 | 0 | 0 | 0 |
| `004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy` | NO-IMPLEMENTATION | 0 | 0 | 0 | 0 |
| `005-skill-advisor-docs-and-code-alignment` | CONDITIONAL | 0 | 7 | 3 | 10 |
| `006-smart-router-remediation-and-opencode-plugin` | CONDITIONAL | 0 | 2 | 3 | 5 |
| `007-deferred-remediation-and-telemetry-run` | CONDITIONAL | 0 | 5 | 1 | 6 |

## Findings by Dimension

### Correctness
**Evidence-compliant findings:** 38 (P0=0 P1=32 P2=6)

| Consolidated finding group | Count | Representative evidence |
| --- | ---: | --- |
| Reranker and Tier 3 caches reuse stale decisions because cache keys omit content or route-shaping context. | 8 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:254`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:434`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`; `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296` |
| Routing/parser logic misclassifies shipped forms, prompt IDs, or target lines. | 7 | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:123`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:154`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:285`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:477` |
| Skill advisor ranking and phrase matching still produce wrong or missing recommendations for review, proposal-only, and implementation-search prompts. | 6 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1536`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1623`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2524`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3021` |
| Task-update and merge matching can select the wrong checklist/task line. | 3 | `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:542`; `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:573`; `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:576` |
| Graph metadata derivation can evict canonical docs or preserve stale/incorrect status inputs. | 8 | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:516` |
| Tier 3 prompt and classifier semantics expose internal aliases or collapse distinct signals. | 6 | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1275`; `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1010` |

### Security
**Evidence-compliant findings:** 19 (P0=3 P1=8 P2=8)

| Consolidated finding group | Count | Representative evidence |
| --- | ---: | --- |
| Tier 3 model-returned `target_doc` can escape the current spec folder before canonical merge/write handling. | 3 | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:837`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:856`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427` |
| `plannerMode: full-auto` can activate live Tier 3 transport more broadly than the explicit router flag suggests. | 2 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366` |
| Prompt/cache/telemetry paths expose weak boundaries: unstable HMAC defaults, unbounded telemetry fields, or unnecessary topology disclosure. | 6 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:39`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:41`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:59`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273` |
| Routing drop/guard phrases can still override intended handover/task-save flows in security-sensitive contexts. | 3 | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1010` |
| Reranker cache and provider paths carry collision or external-call risks without enough containment tests. | 5 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:218`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:221`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`; `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:206` |

### Robustness
**Evidence-compliant findings:** 38 (P0=0 P1=16 P2=22)

| Consolidated finding group | Count | Representative evidence |
| --- | ---: | --- |
| Provider contracts are under-validated: max-document limits, malformed response indexes, and body parsing timeout boundaries are not fully enforced. | 11 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:31`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1073` |
| CLI/config inputs accept invalid or extreme values, including NaN/negative limits and unclamped weight factors. | 5 | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:597`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:755`; `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:356` |
| Graph metadata writer and parser paths can bypass sanitizers, leave temp files, or retain malformed legacy inputs. | 8 | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:293`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:350`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1148`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1149` |
| Live-session and observability wrappers can throw or under-observe when runtime input shapes differ from the happy path. | 5 | `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:118`; `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:125`; `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:156`; `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:209` |
| Caches are unbounded or have infinite effective lifetime in long-lived MCP processes. | 4 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:310`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:326`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:806` |
| Phrase and router matching is brittle around raw substrings, literal regex-looking keys, and unsupported router styles. | 5 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1509`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1524`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:477` |

### Testing
**Evidence-compliant findings:** 42 (P0=0 P1=28 P2=14)

| Consolidated finding group | Count | Representative evidence |
| --- | ---: | --- |
| Scoped tests miss high-risk negative cases for unsafe Tier 3 targets, cache context shifts, task dependency matching, and provider failures. | 13 | `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:261`; `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1625`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1735` |
| Provider and fallback tests can inherit live environment or fail to cover malformed response bodies. | 7 | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:213`; `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:228`; `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:231`; `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:291` |
| Adaptive/search tests are non-hermetic or assert only helper-level behavior instead of production-stage paths. | 7 | `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240`; `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:259`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146`; `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:137` |
| Skill advisor coverage is too happy-path oriented and does not lock ranking, threshold, fixture, or graph-parity regressions. | 8 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py:148`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py:154`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:35` |
| Observability/live wrapper behavior lacks direct tests across configure, onToolCall, finalize, and alias handling. | 4 | `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:102`; `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:209`; `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:217`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:123` |
| Graph metadata parser/writer tests miss production bypasses, cap survival, and failed atomic-swap cleanup. | 3 | `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:237`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:514`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:540` |

## Cross-Phase Patterns
- **Testing gaps repeat in 22 phases.** The most common implementation pattern is not missing code, but tests that prove only the happy path or helper path while high-risk production paths remain unpinned.
- **Cache identity/freshness repeats in 8 phases.** Search reranking and Tier 3 routing both reuse decisions across content or context changes.
- **Tier 3 routing and save-boundary risks repeat in 6 phases.** The highest-severity cluster is the trust boundary around model output, `target_doc`, live transport activation, and prompt/context disclosure.
- **Graph metadata key-file and parser robustness repeats in 6 phases.** The code pass confirms that Part 1's metadata drift has implementation causes in sanitizer, migration, cap, and writer paths.
- **Skill advisor routing/packaging behavior repeats in 7 phases.** Phrase boosters, graph auto-setup, package alignment, plugin bridge rendering, and catalog/fixture coverage still need runtime-focused cleanup.
- **Observability and telemetry assumptions repeat in 5 phases.** Static/live streams, router-style parsing, field sanitization, and wrapper tool-name matching are not robust enough for rollout metrics.

## Updated Grand-Total Summary: Part 1 + Part 2 Combined
| Metric | Count | Notes |
| --- | ---: | --- |
| Part 1 unique findings | 274 | Existing consolidated doc-drift/original deep-review findings. |
| Part 2 raw implementation findings | 139 | Parsed from 34 available `review-impl-report.md` files. |
| Part 2 evidence-compliant findings | 137 | Counted only when at least one `.ts`, `.py`, `.js`, or `.mjs` file-line citation exists. |
| Part 2 internally deduped findings | 129 | Collapses repeated parent/child report instances of the same code-root issue. |
| Cross-part overlaps removed | 10 | Examples: reranker content cache, Tier 3 routing cache, shared Tier 3 cache lifetime, prompt-cache entropy, telemetry field bounds, static parser unknowns, live wrapper alias observation. |
| **Combined unique findings after dedupe** | **393** | `274 + 129 - 10`. |

Combined severity after Part 2 evidence filtering:

| Source | P0 | P1 | P2 | Total |
| --- | ---: | ---: | ---: | ---: |
| Part 1 | 7 | 165 | 102 | 274 |
| Part 2 evidence-compliant raw | 3 | 84 | 50 | 137 |
| Part 2 internally deduped | 2 | 79 | 48 | 129 |
| Combined deduped estimate | 8 | 239 | 146 | 393 |

The combined remediation priority remains: fix Tier 3 save/routing containment first, then cache identity and provider/test isolation, then graph metadata parser/writer robustness, then advisor/plugin/telemetry accuracy.
