---
title: "T [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/006-default-on-boost-rollout/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "boost rollout tasks"
  - "session boost tasks"
  - "causal boost tasks"
  - "deep expansion tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/006-default-on-boost-rollout"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Default-ON Boost Rollout — Session, Causal & Deep Expansion

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

- [x] T001 Trace `session-boost.ts isEnabled()` — `isFeatureEnabled('SPECKIT_SESSION_BOOST')` returns true when env var is unset. No suppression at function level.
- [x] T002 Trace `causal-boost.ts isEnabled()` — `isFeatureEnabled('SPECKIT_CAUSAL_BOOST')` returns true when env var is unset. No suppression at function level.
- [x] T003 [P] Audit `stage2-fusion.ts` — guards at L774/L795 check `config.enableSessionBoost`/`config.enableCausalBoost` which default to `isEnabled()` → true. Metadata reported 'off' even when enabled but no data boosted; changed to 'enabled'.
- [x] T004 [P] `buildDeepQueryVariants` called `isExpansionActive(query)` which returned false for "simple" queries → only [original] returned. Fixed by removing expansion gate and adding fallback reformulation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Session boost confirmed default-ON; added JSDoc kill-switch comment; changed stage2-fusion metadata from 'off' to 'enabled' when boost runs but no data found
- [x] T006 Causal boost confirmed default-ON; added JSDoc kill-switch comment; changed stage2-fusion metadata from 'off' to 'enabled' when boost runs but no data found
- [x] T007 Removed `isExpansionActive(query)` guard from `buildDeepQueryVariants`; added fallback reformulation (reverse word order / "about X") to ensure ≥2 variants
- [x] T008 [P] Added `isSessionBoostEnabled()` and `isCausalBoostEnabled()` to `search-flags.ts` section 2
- [x] T009 Updated `memory-search.ts` and `shadow-evaluation-runtime.ts` imports to use `search-flags.ts` helpers
- [x] T017 Added `SPECKIT_SESSION_BOOST` and `SPECKIT_CAUSAL_BOOST` env vars to `.mcp.json`
- [x] T018 Added boost env vars + updated `_NOTE_7_FEATURE_FLAGS` in `opencode.json`
- [x] T019 Added boost env vars + updated `_NOTE_7_FEATURE_FLAGS` in `.claude/mcp.json`
- [x] T020 Added boost env vars + updated `_NOTE_7_FEATURE_FLAGS` in `.codex/config.toml`
- [x] T021 Added boost env vars + updated `_NOTE_7_FEATURE_FLAGS` in `Barter/coder/opencode.json`
- [x] T022 Expanded `QUERY_PATTERNS`: research +7 keywords (search, retrieval, pipeline, indexing, embedding, vector, semantic); implementation-summary +5 (config, setup, env, flag, setting); memory +3 (resume, recover, continuation)
- [x] T023 Added intent→artifact fallback in `getStrategyForQuery()` with INTENT_TO_ARTIFACT map: 7 intents → artifact classes at confidence 0.4
- [x] T024 Wired intent into `getStrategyForQuery()` — re-calls with detected intent when initial routing returns unknown/0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Code verified: stage2-fusion L784 now returns 'enabled' (not 'off') when boost runs but no data to boost. Requires MCP server restart to verify live.
- [x] T011 Code verified: stage2-fusion L808 now returns 'enabled' (not 'off') when boost runs but no data to boost. Requires MCP server restart to verify live.
- [x] T012 Code verified: `buildDeepQueryVariants` now always returns ≥2 variants — "semantic search" → ["semantic search", "search semantic"]. Requires MCP server restart.
- [x] T013 Code verified: `isFeatureEnabled` returns false when env var is 'false' (rollout-policy.ts L62). Guard at L774 blocks entry → metadata stays 'off'.
- [x] T014 Code verified: same pattern as T013 for causal boost guard at L795.
- [x] T015 Code verified: when env vars unset, `isFeatureEnabled` returns true (rollout-policy.ts L60-66). Guards pass → metadata = 'enabled' or 'applied'.
- [x] T016 [P] Update feature catalog entry for session boost and causal boost to reflect graduated status [EVIDENCE: Created feature_catalog/15--retrieval-enhancements/10-session-boost-graduated.md and 11-causal-boost-graduated.md]
- [x] T025 Code verified: "semantic search" now matches `research` class via keywords "search" + "semantic" (score=2, confidence=0.33). If keyword match fails, intent "understand" → research via INTENT_TO_ARTIFACT fallback.
- [x] T026 Code verified: "vector retrieval" → research (keywords "vector"+"retrieval"), "find the config" → implementation-summary (keyword "config"), varied queries covered by expanded keywords + intent fallback.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T026 tasks marked `[x]` (T016 deferred — P1, feature catalog update)
- [x] No `[B]` blocked tasks remaining
- [x] Code-level verification confirms SC-001 through SC-005 from spec.md (live MCP tests require server restart)
- [x] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Epic**: `../spec.md` (011-indexing-and-adaptive-fusion)
- **Sibling Phase**: `../005-e2e-integration-test/` (completed)
- **Key Source**: `mcp_server/lib/search/session-boost.ts:29`, `causal-boost.ts:145`, `stage1-candidate-gen.ts:573`, `artifact-routing.ts:156-301`
- **Config Files**: `.mcp.json`, `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `Barter/coder/opencode.json`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
