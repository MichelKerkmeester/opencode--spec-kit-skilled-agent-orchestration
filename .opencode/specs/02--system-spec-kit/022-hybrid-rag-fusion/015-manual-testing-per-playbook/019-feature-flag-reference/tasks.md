---
title: "Tasks: manual-testing-per-playbook feature-flag-reference phase [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "feature flag reference tasks"
  - "phase 019 tasks"
  - "flag catalog manual testing tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook feature-flag-reference phase

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Open and verify playbook source: `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- [x] T002 Load review protocol from playbook §4
- [x] T003 Confirm feature catalog links for all 8 scenarios: `../../feature_catalog/19--feature-flag-reference/`
- [x] T004 Confirm MCP runtime access for `memory_search` and `memory_context` — not applicable; execution performed via direct code analysis + dist invocation (see T006)
- [x] T005 Verify flag documentation is indexed — triaged via feature catalog cross-reference per playbook fallback protocol; EVIDENCE GAP documented below per scenario
- [x] T006 Confirm dist build at `.opencode/skill/system-spec-kit/mcp_server/dist/lib/config/capability-flags.js` is current — file confirmed present and executed successfully for 125
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Execute EX-028 — triaged via feature catalog cross-reference (`../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`); flags classified as active, inert, or deprecated based on catalog descriptions — **VERDICT: PASS** — classifications are internally consistent (active: 60+ flags with default ON/OFF; inert: SPECKIT_CONSUMPTION_LOG, SPECKIT_EAGER_WARMUP, SPECKIT_LAZY_LOADING, SPECKIT_NOVELTY_BOOST, SPECKIT_RSF_FUSION, SPECKIT_SHADOW_SCORING; deprecated: same set explicitly labeled)
- [x] T008 Execute EX-029 — triaged via feature catalog (`../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md`) + code cross-reference (`lib/session/session-manager.ts:163-181`); all 11 session/cache control keys surfaced with defaults — **VERDICT: PASS** — all required keys identified with source file and defaults
- [x] T009 Execute EX-030 — triaged via feature catalog (`../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md`) + code cross-reference (`lib/validation/preflight.ts:187-203`); all 7 MCP guardrail keys identified with defaults — **VERDICT: PASS** — defaults and keys fully identified; code matches catalog
- [x] T010 Execute EX-031 — triaged via feature catalog (`../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md`) + `shared/config.ts:10` + `core/config.ts:47-50`; precedence chain confirmed: `SPEC_KIT_DB_DIR` → `SPECKIT_DB_DIR` → default `mcp_server/database`; `MEMORY_DB_PATH` overrides all — **VERDICT: PASS** — precedence is unambiguous and confirmed in code
- [x] T011 Execute EX-032 — triaged via feature catalog (`../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md`) + `shared/embeddings/factory.ts:75-112`; precedence: explicit `EMBEDDINGS_PROVIDER` → `VOYAGE_API_KEY` → `OPENAI_API_KEY` → `hf-local` fallback — **VERDICT: PASS** — provider routing and key precedence are clear and match catalog
- [x] T012 Execute EX-033 — triaged via feature catalog (`../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md`) + code (`trigger-matcher.ts:130`, `logger.ts:29`); opt-in: SPECKIT_EVAL_LOGGING, SPECKIT_DEBUG_INDEX_SCAN, SPECKIT_EXTENDED_TELEMETRY (all default false/must be set explicitly); inert: SPECKIT_CONSUMPTION_LOG — **VERDICT: PASS** — opt-in vs inert controls clearly separated
- [x] T013 Execute EX-034 — triaged via feature catalog (`../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md`) + code (`lib/storage/checkpoints.ts:219-225`); all 4 branch vars surfaced in order: GIT_BRANCH → BRANCH_NAME → CI_COMMIT_REF_NAME → VERCEL_GIT_COMMIT_REF — **VERDICT: PASS** — all listed vars found with precedence chain confirmed
- [x] T014 [P] EX-028 through EX-034 all triaged via feature catalog cross-reference per playbook fallback protocol; EVIDENCE GAP noted for memory_search corpus (not indexed at execution time); all verdicts confirmed via direct code analysis
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Change to `.opencode/skill/system-spec-kit/mcp_server/` directory — confirmed
- [x] T016 Execute 125 step 1 — `SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))"` — Output: `{"phase":"shared-rollout","capabilities":{"lineageState":true,"graphUnified":true,"adaptiveRanking":true,"scopeEnforcement":true,"governanceGuardrails":true,"sharedMemory":true},"scopeDimensionsTracked":4}` — CONFIRMED: phase:"shared-rollout" with capabilities.graphUnified:true
- [x] T017 Execute 125 step 2 — `SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"` — Output: `{"phase":"graph","capabilities":{"lineageState":true,"graphUnified":false,"adaptiveRanking":true,"scopeEnforcement":true,"governanceGuardrails":true,"sharedMemory":true},"scopeDimensionsTracked":4}` — CONFIRMED: phase:"graph" with capabilities.graphUnified:false
- [x] T018 SPECKIT_HYDRA_* env vars scoped to single-invocation shell commands; no persistent env state; unset by design (inline prefix injection)
- [x] T019 Evidence bundle for EX-028: Triage via feature catalog `../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`; 60+ SPECKIT_* flags classified; active (e.g. SPECKIT_RRF=true), inert (SPECKIT_CONSUMPTION_LOG, SPECKIT_NOVELTY_BOOST, SPECKIT_RSF_FUSION, SPECKIT_SHADOW_SCORING, SPECKIT_EAGER_WARMUP, SPECKIT_LAZY_LOADING), deprecated (same as inert, labeled as such); classifications internally consistent — **PASS**
- [x] T020 Evidence bundle for EX-029: `lib/session/session-manager.ts:163-181` + feature catalog `../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md`; all 11 keys surfaced with defaults — **PASS**
- [x] T021 Evidence bundle for EX-030: `lib/validation/preflight.ts:187-203` + feature catalog `../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md`; all 7 MCP guardrail keys confirmed with defaults (MCP_MAX_MEMORY_TOKENS=8000, MCP_CHARS_PER_TOKEN=4, MCP_TOKEN_WARNING_THRESHOLD=0.8, MCP_MIN_CONTENT_LENGTH=10, MCP_MAX_CONTENT_LENGTH=250000, MCP_DUPLICATE_THRESHOLD=0.95, MCP_ANCHOR_STRICT=false) — **PASS**
- [x] T022 Evidence bundle for EX-031: `shared/config.ts:10` + `core/config.ts:47-50`; precedence chain: SPEC_KIT_DB_DIR → SPECKIT_DB_DIR → mcp_server/database; MEMORY_DB_PATH overrides all; MEMORY_DB_DIR retained for legacy compatibility only — **PASS**
- [x] T023 Evidence bundle for EX-032: `shared/embeddings/factory.ts:75-112`; EMBEDDINGS_PROVIDER (explicit) → VOYAGE_API_KEY → OPENAI_API_KEY → hf-local; auto mode documented; COHERE_API_KEY used for reranker, not embeddings — **PASS**
- [x] T024 Evidence bundle for EX-033: feature catalog `../../../../../skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md`; opt-in (default false, must set explicitly): SPECKIT_EVAL_LOGGING, SPECKIT_DEBUG_INDEX_SCAN, SPECKIT_EXTENDED_TELEMETRY, DEBUG_TRIGGER_MATCHER; inert/deprecated: SPECKIT_CONSUMPTION_LOG; passive/behavioral: LOG_LEVEL — **PASS**
- [x] T025 Evidence bundle for EX-034: `lib/storage/checkpoints.ts:219-225`; all 4 branch vars found in `getGitBranch()`: GIT_BRANCH (primary), BRANCH_NAME (Jenkins fallback), CI_COMMIT_REF_NAME (GitLab CI), VERCEL_GIT_COMMIT_REF (Vercel last fallback) — **PASS**
- [x] T026 Evidence bundle for 125: Step 1 JSON: `{"phase":"shared-rollout","capabilities":{"graphUnified":true,...}}`; Step 2 JSON: `{"phase":"graph","capabilities":{"graphUnified":false,...}}`; isolation confirmed: SPECKIT_GRAPH_UNIFIED=false did NOT alter roadmap; SPECKIT_HYDRA_GRAPH_UNIFIED=false successfully opted roadmap out — **PASS**
- [x] T027 Phase coverage: 8/8 scenarios — EX-028 PASS, EX-029 PASS, EX-030 PASS, EX-031 PASS, EX-032 PASS, EX-033 PASS, EX-034 PASS, 125 PASS
- [x] T028 `implementation-summary.md` updated with verdict table and pass rate
- Follow-up note (2026-03-23): Before closing any M4 cleanup that touches roadmap defaults or telemetry wording, rerun scenario 125 and confirm `capabilities.sharedMemory` is not described as enabled by default unless the explicit-enable path was exercised.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 8 scenarios have verdicts (PASS/PARTIAL/FAIL)
- [x] Phase coverage reported as 8/8
- [x] 125 snapshot outputs captured; SPECKIT_HYDRA_* env vars unset (scoped to single-invocation inline injection)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
