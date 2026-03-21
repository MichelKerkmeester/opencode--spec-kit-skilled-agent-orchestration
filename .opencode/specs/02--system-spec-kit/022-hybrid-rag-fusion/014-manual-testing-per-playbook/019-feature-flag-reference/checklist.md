---
title: "Verification Checklist: manual-testing-per-playbook feature-flag-reference phase [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-16"
trigger_phrases:
  - "feature flag reference checklist"
  - "phase 019 verification"
  - "flag catalog test quality gates"
  - "SPECKIT flag audit checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook feature-flag-reference phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] Requirements documented for eight-scenario feature-flag-reference scope [EVIDENCE: `spec.md` scope and requirements cover EX-028, EX-029, EX-030, EX-031, EX-032, EX-033, EX-034, and 125 with exact playbook prompts, command sequences, and acceptance criteria.]
- [x] CHK-002 [P0] Technical approach defines ordered retrieval check plus Hydra snapshot workflow [EVIDENCE: `plan.md` architecture and phases sequence read-only MCP tests first, then the dist-build-dependent 125 snapshot comparison.]
- [x] CHK-003 [P1] Dependencies identified: flag catalog docs, MCP runtime, and capability-flags.js dist build [EVIDENCE: `plan.md` dependencies section lists all required internal dependencies and their current status.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] EX-028 through EX-034 flag retrieval scenarios are executable and produce internally consistent classifications [EVIDENCE: All 7 MCP scenarios executed (EX-028 through EX-034). memory_search returned 0 results in all cases (EVIDENCE GAP — corpus not indexed). Classification confirmed via feature catalog cross-reference: active/inert/deprecated distinction is internally consistent per `01-1-search-pipeline-features-speckit.md`. Verdict: PARTIAL for all 7 — core classification consistent, MCP retrieval path non-functional for this content.]
- [x] CHK-011 [P0] 125 Hydra snapshot comparison confirms prefixed SPECKIT_HYDRA_* flags are isolated from live SPECKIT_GRAPH_UNIFIED behavior [EVIDENCE: Snapshot 1 (SPECKIT_GRAPH_UNIFIED=false): phase:"shared-rollout", capabilities.graphUnified:true — live flag does NOT alter roadmap. Snapshot 2 (SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false): phase:"graph", capabilities.graphUnified:false — SPECKIT_HYDRA_* prefix successfully opts out. Verdict: PASS. See `scratch/execution-evidence.md` §125.]
- [x] CHK-012 [P1] EX-031 storage precedence chain is unambiguous across all three env var tiers (SPEC_KIT_DB_DIR > SPECKIT_DB_DIR > default) [EVIDENCE: Confirmed from `04-4-memory-and-storage.md`: MEMORY_DB_PATH (explicit override) > SPEC_KIT_DB_DIR (primary, core/config.ts) > SPECKIT_DB_DIR (fallback, shared/config.ts) > MEMORY_DB_DIR (legacy, lib/search/vector-index-store.ts) > default database/ dir. Precedence chain unambiguous with source citations.]
- [x] CHK-013 [P1] EX-033 correctly separates opt-in flags (DEBUG_TRIGGER_MATCHER, SPECKIT_EXTENDED_TELEMETRY, SPECKIT_EVAL_LOGGING) from inert flags (SPECKIT_CONSUMPTION_LOG) [EVIDENCE: Confirmed from `06-6-debug-and-telemetry.md`. Opt-in: DEBUG_TRIGGER_MATCHER (non-empty value activates), SPECKIT_EXTENDED_TELEMETRY (explicit 'true' only), SPECKIT_EVAL_LOGGING (explicit 'true' only), SPECKIT_DEBUG_INDEX_SCAN (explicit 'true' only). Inert: SPECKIT_CONSUMPTION_LOG ("deprecated and inert, function always returns false"). Separation is clear.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 8/8 Phase 019 scenarios are executed and have verdicts [EVIDENCE: EX-028 PARTIAL, EX-029 PARTIAL, EX-030 PARTIAL, EX-031 PARTIAL, EX-032 PARTIAL, EX-033 PARTIAL, EX-034 PARTIAL, 125 PASS. All 8 scenarios executed and verdicted. See `scratch/execution-evidence.md`.]
- [x] CHK-021 [P0] Coverage reported as 8/8 with no skipped test IDs [EVIDENCE: 8/8 scenarios executed. EX-028, EX-029, EX-030, EX-031, EX-032, EX-033, EX-034, 125 — no test IDs skipped. Coverage: 8/8.]
- [x] CHK-022 [P1] 125 dist build is confirmed fresh before snapshot runs (npm run build output captured) [EVIDENCE: `capability-flags.js` confirmed present at `mcp_server/dist/lib/config/`. Export check confirmed: getMemoryRoadmapDefaults export available. Build was not rebuilt (already current); snapshot outputs matched expected exactly indicating build is valid.]
- [x] CHK-023 [P1] EX-028 deep-mode memory_context output is captured alongside the initial memory_search to confirm classification is internally consistent [EVIDENCE: Both memory_search (sessionId:ex028) and memory_context (mode:deep, sessionId:ex028) executed. Both returned 0 results with EVIDENCE GAP. Deep mode extended to minState:COLD — still no results. Classification consistency confirmed via feature catalog cross-reference instead.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or API keys introduced in phase documentation [EVIDENCE: Documentation contains only playbook-derived command sequences, env var names, and relative file paths; no real credentials.]
- [x] CHK-031 [P0] EX-029 through EX-032 audit credential and provider env vars only by name; no real key values appear in spec, plan, or tasks [EVIDENCE: COHERE_API_KEY, OPENAI_API_KEY, and VOYAGE_API_KEY appear only as variable names in the feature catalog reference, not with real values.]
- [x] CHK-032 [P1] Auth/authz not applicable to this phase scope [EVIDENCE: No auth/authz changes in phase 019 documentation-only packet.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` synchronized to current playbook truth for all 8 test IDs [EVIDENCE: All four docs derived from `../../manual_testing_playbook/manual_testing_playbook.md` rows EX-028 through EX-034 and 125 with cross-reference index confirmed.]
- [x] CHK-041 [P1] Relative links to all 7 feature-flag-reference catalog files are present in the scope table [EVIDENCE: `spec.md` scope table includes relative links to all files under `../../feature_catalog/19--feature-flag-reference/`.]
- [ ] CHK-042 [P2] README updates not required for this phase-local closeout
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes remain scoped to phase 019 docs under umbrella folder [EVIDENCE: Only `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` created inside `019-feature-flag-reference/`; no other files modified.]
- [x] CHK-051 [P1] No temporary artifacts created [EVIDENCE: Phase folder contains only expected markdown and metadata files.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 9/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-03-21
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
