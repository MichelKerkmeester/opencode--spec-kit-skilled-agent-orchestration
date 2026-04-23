---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Task Breakdown: Skill-Advisor Plugin Hardening"
description: "Tasks T-01..T-12 across state refactor, in-flight dedup, size caps + LRU, and verification."
trigger_phrases:
  - "026/009/008 tasks"
  - "skill advisor hardening tasks"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/008-skill-advisor-plugin-hardening"
    last_updated_at: "2026-04-23T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented plugin hardening and verified focused tests/build"
    next_safe_action: "Dispatch codex"
    completion_pct: 100
---
# Task Breakdown: Skill-Advisor Plugin Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending. `[x]` complete with evidence in checklist + impl summary.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-01** Read `.opencode/plugins/spec-kit-skill-advisor.js` end-to-end. Identified original module-global state declarations at lines 28-36 and final state references at lines 297-308, 315, 355-387, 400-430, 436-452, 464, 527-540, and 561-581. [EVIDENCE: `nl -ba` and `rg -n "state\.|advisorCache|inFlight|runtimeReady|lastBridgeStatus|lastErrorCode|lastDurationMs|bridgeInvocations|cacheHits|cacheMisses|advisorLookups|disabledReason" .opencode/plugins/spec-kit-skill-advisor.js`.]
- [x] **T-02** Run baseline `cd .opencode/skill/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` and confirm 23/23 pass before any changes. [EVIDENCE: `Tests 23 passed (23)` at 2026-04-23T08:06Z.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-03** Refactor module-global state into a per-instance `state` object created inside `SpecKitSkillAdvisorPlugin(ctx, opts)`. Update every helper function to read/write `state.X` instead of bare `X`. [EVIDENCE: module-level state declarations removed; closure `state` object at `.opencode/plugins/spec-kit-skill-advisor.js:296`.]
- [x] **T-04** Update the `event:` handler closure to mutate `state.runtimeReady` etc. instead of module globals. [EVIDENCE: `session.created` updates `state.runtimeReady` / `state.lastBridgeStatus`; session deletion iterates `state.advisorCache`.]
- [x] **T-05** Update the status tool's `execute()` body to read from `state` instead of module globals. [EVIDENCE: status output reads `state.disabledReason`, `state.runtimeReady`, `state.bridgeInvocations`, `state.advisorLookups`, and cache counters.]
- [x] **T-06** Run all 23 existing tests. They MUST still pass before proceeding. [EVIDENCE: focused Vitest returned `Tests 23 passed (23)` after the state refactor.]
- [x] **T-07** Add `state.inFlight = new Map()` and modify `getAdvisorContext` to dedup concurrent identical-key requests. The in-flight hit should increment `cacheHits` (it's a logical hit — caller didn't pay for a fresh subprocess). [EVIDENCE: `state.inFlight.get/set/delete` in `getAdvisorContext`; dedup test asserts five concurrent calls spawn once.]
- [x] **T-08** Add `DEFAULT_MAX_PROMPT_BYTES`, `DEFAULT_MAX_BRIEF_CHARS`, `DEFAULT_MAX_CACHE_ENTRIES` constants. Extend `normalizeOptions` to read overrides from `options.maxPromptBytes`/`maxBriefChars`/`maxCacheEntries`. [EVIDENCE: constants added near existing defaults and status exposes override values.]
- [x] **T-09** Implement `clampPrompt(prompt, maxBytes)` (byte-aware) and `clampBrief(brief, maxChars)` (char-count). Apply `clampPrompt` before the bridge stdin write in `runBridge`. Apply `clampBrief` in `appendAdvisorBrief` before pushing into `output.system[]`. [EVIDENCE: `bridgePayloadJson()` budgets stdin payload before write; brief clamp test asserts 2048-char output.]
- [x] **T-10** Implement `insertWithEviction(cache, key, value, maxEntries)` and use it everywhere `state.advisorCache.set(key, value)` happens. [EVIDENCE: helper deletes `cache.keys().next().value`; eviction test keeps cache at 2 and forces oldest prompt to respawn.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-11** Add new vitest cases (target 5+ new tests, one per REQ-001..REQ-005, plus one for status-tool-per-instance). [EVIDENCE: focused Vitest passes 30 tests; 7 new hardening cases added.]
- [x] **T-12** Run `npm run build`, full focused vitest, `validate.sh --strict`, and `generate-context.js`. Update `implementation-summary.md` and `checklist.md` with evidence. Update parent docs. [EVIDENCE: build passed, focused Vitest 30/30 passed; strict validation and generate-context evidence recorded in checklist after final runs.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 + P1 checklist items complete with evidence.
- All 23 Phase 5 tests still pass + 5+ new tests added.
- Strict validation 0/0; canonical save invoked.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Impl summary: `implementation-summary.md`
- Source of deferrals: `../007-opencode-plugin-loader-remediation/decision-record.md` ADR-005
<!-- /ANCHOR:cross-refs -->
