---
title: "...stem-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/008-skill-advisor-plugin-hardening/checklist]"
description: "Evidence-backed checklist for the 3 deferred P2 items: per-instance state, in-flight dedup, size caps + LRU."
trigger_phrases:
  - "026/009/008 checklist"
  - "skill advisor hardening checklist"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/008-skill-advisor-plugin-hardening"
    last_updated_at: "2026-04-23T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented plugin hardening and verified focused tests/build"
    next_safe_action: "Dispatch codex"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
---
# Verification Checklist: Skill-Advisor Plugin Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

### P0 - Blockers

- [x] **P0-01** Per-instance state isolation. [EVIDENCE: vitest case `keeps two plugin instances state-isolated` passes; status for instance B remains `runtime_ready=false`, `cache_entries=0`, `cache_misses=0`, `bridge_invocations=0` after instance A handles a prompt.]
- [x] **P0-02** In-flight dedup proven. [EVIDENCE: vitest case `dedups concurrent identical requests into one bridge spawn` runs `Promise.all` of 5 identical calls and asserts `spawn` called once, `cache_hits=4`, `cache_misses=1`.]
- [x] **P0-03** Prompt clamp enforced. [EVIDENCE: vitest case `clamps oversized prompt payload before bridge stdin write` sends a 100KB prompt and asserts bridge stdin byte length `<= 65536`.]
- [x] **P0-04** Brief clamp enforced. [EVIDENCE: vitest case `clamps oversized advisor brief before pushing system output` returns a 10KB brief and asserts `output.system[0].length === 2048`.]
- [x] **P0-05** LRU eviction enforced. [EVIDENCE: vitest case `evicts oldest cache entry when max cache entries is exceeded` uses `maxCacheEntries=2`, inserts 3 prompts, verifies `cache_entries=2`, then re-runs first prompt and observes a fourth bridge spawn.]
- [x] **P0-06** Phase 5 regression: all 23 existing tests still pass. [EVIDENCE: baseline focused Vitest `Tests 23 passed (23)` before edits; post-refactor gate `Tests 23 passed (23)` before dedup/caps.]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### P1 - Required

- [x] **P1-01** Status tool reflects per-instance state. [EVIDENCE: vitest case `reports status metrics independently for each plugin instance` asserts A=`[1,2,2,3]` and B=`[0,1,1,1]` for hits/misses/bridge/lookups.]
- [x] **P1-02** Phase 5 cache invariants preserved per-instance. [EVIDENCE: same status test asserts `cache_misses === bridge_invocations` and `cache_hits + cache_misses === advisor_lookups` for each instance.]
- [x] **P1-03** Strict spec validation. [EVIDENCE: final `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../008-skill-advisor-plugin-hardening --strict` returned 0 errors / 0 warnings.]
- [x] **P1-04** Canonical save invoked. [EVIDENCE: final `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json ... <packet>` exited 0.]
- [x] **P1-05** Parent docs updated with 008 phase outcome row. [EVIDENCE: parent docs record the 008 phase outcome.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **P1-CQ01** `npm run build` in mcp_server passes. [EVIDENCE: `npm run build` exited 0; output `tsc --build`.]
- [x] **P1-CQ02** No new TypeScript or lint errors introduced. [EVIDENCE: TypeScript build passed; focused Vitest passed 30/30.]
- [x] **P1-CQ03** Module-global `let` declarations for plugin state are fully removed. [EVIDENCE: plugin now has no module-level `let` state declarations; mutable runtime fields appear only as `state.*` under the plugin closure.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **P1-T01** Focused vitest passes 28+ tests (was 23 from Phase 5, +5 new). [EVIDENCE: final focused run returned `Tests 30 passed (30)`.]
- [x] **P1-T02** Negative test: state-isolation failure mode. [EVIDENCE: temporarily changed `state.advisorCache` to a shared module-level `TEMP_SHARED_ADVISOR_CACHE`; `vitest -t "keeps two plugin instances state-isolated"` failed because instance B reported `cache_entries=1`; reverted and full focused Vitest returned 30/30.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **P1-S01** Brief clamp acts as defense-in-depth against bridge regression. [EVIDENCE: oversized 10KB mocked bridge brief capped to `DEFAULT_MAX_BRIEF_CHARS` (2048) before `output.system[]`.]
- [x] **P1-S02** Prompt clamp limits subprocess stdin payload. [EVIDENCE: 100KB prompt produced bridge stdin payload `<= DEFAULT_MAX_PROMPT_BYTES` (65536).]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **P2-D01** Inline JSDoc comment above the per-instance `state` object explains why state was moved out of module scope (cite packet 008 + sibling 007 ADR-005). [EVIDENCE: plugin comment above `state` cites packet 008 and sibling 007 ADR-005.]
- [x] **P2-D02** Inline comment above `inFlight` Map explains the dedup pattern. [EVIDENCE: plugin comment above `inFlight` says concurrent identical-key requests share one bridge spawn.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **P1-F01** Plugin file remains at `.opencode/plugins/spec-kit-skill-advisor.js` with no new helper files spun out. [EVIDENCE: implementation touched only the scoped plugin file for runtime code.]
- [x] **P1-F02** Test file remains at `tests/spec-kit-skill-advisor-plugin.vitest.ts`; no new test files added. [EVIDENCE: hardening coverage added to the existing focused test file only.]
- [x] **P1-F03** Spec packet docs remain in this child phase folder. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` remain in `008-skill-advisor-plugin-hardening/`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

### P2 - Recommended

- [x] **P2-01** Caps configurable via plugin options. [EVIDENCE: vitest case `applies configurable prompt, brief, and cache caps` sets `maxPromptBytes=4096`, `maxBriefChars=64`, `maxCacheEntries=1` and asserts all three caps apply.]

### Verification Log

- 2026-04-23T08:06Z: baseline focused Vitest passed 23/23 before edits.
- 2026-04-23T08:08Z: post-refactor focused Vitest passed 23/23 before dedup/caps.
- 2026-04-23T08:10Z: final focused Vitest passed 30/30.
- 2026-04-23T08:10Z: `npm run build` passed (`tsc --build`).
- 2026-04-23T08:11Z: negative state-isolation mutation failed the targeted test as expected, then reverted; focused Vitest passed 30/30 again.
- 2026-04-23T08:12Z: strict packet validation passed 0 errors / 0 warnings.
- 2026-04-23T08:13Z: canonical `generate-context.js` save exited 0; embeddings fell back to deferred indexing because network embedding calls failed.
<!-- /ANCHOR:summary -->
