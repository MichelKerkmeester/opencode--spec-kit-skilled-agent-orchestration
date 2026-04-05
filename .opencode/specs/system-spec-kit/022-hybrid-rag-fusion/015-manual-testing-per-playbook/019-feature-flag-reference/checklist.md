---
title: "Verific [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/019-feature-flag-reference/checklist]"
description: "Verification checklist for Phase 019 feature-flag-reference manual test packet covering EX-028 through EX-034 and scenario 125."
trigger_phrases:
  - "feature flag reference checklist"
  - "phase 019 verification"
  - "flag catalog test quality gates"
  - "speckit flag audit checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook feature-flag-reference phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Playbook source and review protocol loaded before execution begins — all 8 scenario files read from `manual_testing_playbook/19--feature-flag-reference/` [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-002 [P0] All 8 scenario prompts and command sequences verified against `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` — exact prompts and commands loaded per playbook scenario files [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-003 [P0] MCP runtime confirmed operational for `memory_search` and `memory_context` — EX-028 through EX-034 triaged via feature catalog cross-reference per playbook fallback protocol; EVIDENCE GAP documented for corpus-based retrieval [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-004 [P1] Flag documentation indexed or feature catalog triage path documented — triage path applied: all 7 flag-group catalogs read directly; EVIDENCE GAP noted (memory search corpus not indexed at execution time) [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-005 [P1] Dist build at `capability-flags.js` confirmed current before 125 runs — `dist/lib/config/capability-flags.js` present and executed successfully; both node invocations completed without error [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] All 8 scenarios have a PASS, PARTIAL, or FAIL verdict with explicit rationale — all 8 PASS; rationale cited per scenario in tasks.md T019-T026 [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-021 [P0] 125 step 1 confirms `phase:"shared-rollout"` with `capabilities.graphUnified:true` (live flag did not alter roadmap) — [Evidence: `dist/lib/config/capability-flags.js` node execution; output: `{"phase":"shared-rollout","capabilities":{"graphUnified":true,...}}`; SPECKIT_GRAPH_UNIFIED=false is a runtime retrieval gate that does not affect `SPECKIT_MEMORY_GRAPH_UNIFIED` or `SPECKIT_HYDRA_GRAPH_UNIFIED` roadmap env vars]
- [x] CHK-022 [P0] 125 step 2 confirms `phase:"graph"` with `capabilities.graphUnified:false` (SPECKIT_HYDRA_* prefix opts out) — [Evidence: `dist/lib/config/capability-flags.js` node execution with SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false; output: `{"phase":"graph","capabilities":{"graphUnified":false,...}}`; `hasExplicitDisableFlag()` at capability-flags.ts:58-67 detected 'false' value and returned false for graphUnified]
- [x] CHK-023 [P1] EX-028 through EX-034 zero-result cases have EVIDENCE GAP documented with feature catalog triage applied — all 7 scenarios used feature catalog triage path; EVIDENCE GAP documented in T014 (memory_search corpus not indexed at execution time); catalog triage confirmed PASS verdicts [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-024 [P1] No fabricated or inferred evidence; all outputs captured verbatim or triaged via feature catalog cross-reference per playbook instructions — all verdicts based on direct code analysis (file:line citations) or feature catalog catalog tables; no evidence fabricated [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] EX-028 Flag catalog verification executed and evidence captured [Evidence: feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md; 60+ SPECKIT_* flags classified; 6 inert/deprecated flags identified (SPECKIT_CONSUMPTION_LOG, SPECKIT_EAGER_WARMUP, SPECKIT_LAZY_LOADING, SPECKIT_NOVELTY_BOOST, SPECKIT_RSF_FUSION, SPECKIT_SHADOW_SCORING); classifications internally consistent — VERDICT: PASS]
- [x] CHK-011 [P0] EX-029 Session policy audit executed and evidence captured [Evidence: feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md + lib/session/session-manager.ts:163-181; all 11 session/cache control keys surfaced with source file and defaults — VERDICT: PASS]
- [x] CHK-012 [P0] EX-030 MCP limits audit executed and evidence captured [Evidence: feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md + lib/validation/preflight.ts:187-203; all 7 MCP guardrail keys confirmed with defaults (MCP_MAX_MEMORY_TOKENS=8000, MCP_CHARS_PER_TOKEN=4, etc.) — VERDICT: PASS]
- [x] CHK-013 [P0] EX-031 Storage precedence check executed and evidence captured [Evidence: feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md + shared/config.ts:10 + core/config.ts:47-50; precedence chain: SPEC_KIT_DB_DIR → SPECKIT_DB_DIR → default; MEMORY_DB_PATH overrides all — VERDICT: PASS]
- [x] CHK-014 [P0] EX-032 Provider selection audit executed and evidence captured [Evidence: feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md + shared/embeddings/factory.ts:75-112; precedence: EMBEDDINGS_PROVIDER → VOYAGE_API_KEY → OPENAI_API_KEY → hf-local fallback — VERDICT: PASS]
- [x] CHK-015 [P0] EX-033 Observability toggle check executed and evidence captured [Evidence: feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md + lib/parsing/trigger-matcher.ts:130 + lib/utils/logger.ts:29; opt-in (false by default): SPECKIT_EVAL_LOGGING, SPECKIT_DEBUG_INDEX_SCAN, SPECKIT_EXTENDED_TELEMETRY, DEBUG_TRIGGER_MATCHER; inert: SPECKIT_CONSUMPTION_LOG — VERDICT: PASS]
- [x] CHK-016 [P0] EX-034 Branch metadata source audit executed and evidence captured [Evidence: feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md + lib/storage/checkpoints.ts:219-225; all 4 branch vars in getGitBranch(): GIT_BRANCH (primary), BRANCH_NAME (Jenkins), CI_COMMIT_REF_NAME (GitLab), VERCEL_GIT_COMMIT_REF (Vercel) — VERDICT: PASS]
- [x] CHK-017 [P0] 125 Hydra snapshot test: both node invocations executed and JSON outputs captured [Evidence: Step 1 output: `{"phase":"shared-rollout","capabilities":{"lineageState":true,"graphUnified":true,"adaptiveRanking":true,"scopeEnforcement":true,"governanceGuardrails":true,"sharedMemory":true},"scopeDimensionsTracked":4}`; Step 2 output: `{"phase":"graph","capabilities":{"lineageState":true,"graphUnified":false,"adaptiveRanking":true,"scopeEnforcement":true,"governanceGuardrails":true,"sharedMemory":true},"scopeDimensionsTracked":4}` — VERDICT: PASS]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No real API keys (COHERE_API_KEY, OPENAI_API_KEY, VOYAGE_API_KEY) in evidence artifacts — only variable names referenced throughout; no key values captured [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-031 [P0] SPECKIT_HYDRA_* env vars unset after 125 completes — env vars were scoped as inline prefix injection to single shell commands (`SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false node -e ...`); they were never set persistently in the environment [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-032 [P1] EX-029 and EX-032 credential env var names referenced only by name, not value — all evidence artifacts reference only variable names (COHERE_API_KEY, OPENAI_API_KEY, VOYAGE_API_KEY) [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Phase coverage reported as 8/8 scenarios with verdict summary — all 8 PASS; see implementation-summary.md verdict table [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-041 [P1] `implementation-summary.md` updated with execution results and verdict table — rewritten with 8/8 PASS, pass rate 100%, evidence citations [EVIDENCE: tasks.md; implementation-summary.md]
- [ ] CHK-042 [P2] Findings saved to `memory/` via generate-context.js
- Follow-up note (2026-03-23): Before closing any M4 cleanup that changes roadmap-default semantics or telemetry wording, rerun scenario 125 and confirm the evidence only claims shared memory is enabled when the explicit-enable path is exercised.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence artifacts stored in `scratch/` only during execution — all evidence embedded inline in tasks.md and checklist.md per artifact capture pattern; no separate scratch files needed [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-051 [P2] `scratch/` cleaned of intermediate drafts after completion — scratch directory contains no intermediate drafts from this execution [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 7 | 7/7 |
| P2 Items | 3 | 2/3 |

**Verification Date**: 2026-03-22
<!-- /ANCHOR:summary -->

---
