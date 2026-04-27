---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: memory_search response policy [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/014-memory-search-response-policy/implementation-summary]"
description: "Implemented responsePolicy and citationPolicy refusal contract for weak memory_search retrieval."
trigger_phrases:
  - "memory search response policy summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/014-memory-search-response-policy"
    last_updated_at: "2026-04-27T09:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Phase 2 source/test patches and Phase 3 build/dist marker verification"
    next_safe_action: "Restart the MCP-owning client/runtime, then run live memory_search probes"
    blockers:
      - "Live runtime probes require user MCP daemon/client restart before they reflect rebuilt dist output"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-memory-search-response-policy |
| **Completed** | 2026-04-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the server-side refusal contract for `memory_search` weak retrieval:

- Added `citationPolicy: "cite_results" | "do_not_cite_results"` to memory search response data.
- Added conditional `responsePolicy` with `requiredAction`, `noCanonicalPathClaims`, `citationRequiredForPaths`, and `safeResponse` when request quality is not good and recovery is present.
- Extended `RecoveryAction` with `ask_disambiguation`, `refuse_without_evidence`, and `broaden_or_ask`.
- Updated recovery action selection so no-evidence, ambiguous, and partial retrieval states can emit the new action values.
- Guaranteed `ask_user` recovery does not ship with empty `suggestedQueries` by synthesizing two safe broadening suggestions from the original query tokens.
- Added Vitest coverage for weak-quality policy, good-quality citation behavior, and the `ask_user` empty-suggestion guard.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` | Modified | Added `deriveResponsePolicy`, `deriveCitationPolicy`, and response data fields |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts` | Modified | Extended `RecoveryAction`, mapped new actions, added safe suggestion synthesis |
| `.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts` | Modified | Added enum/action and `ask_user` suggestion coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts` | Modified | Added responsePolicy/citationPolicy contract cases |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/014-memory-search-response-policy/implementation-summary.md` | Modified | Recorded implementation and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly against `spec.md`, `tasks.md`, and the 007 research anchors for Q4, security guardrails, code patterns, and API shape. The patch stayed additive to response envelopes and used targeted `npx vitest run` rather than the broader pretest hook.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Server-side contract, not caller enforcement | The 006/I2 hallucination happened despite recovery metadata being present; advisory metadata is not enough. |
| Additive fields | Backward compatibility. |
| Citation defaults to `do_not_cite_results` unless request quality is explicitly `good` | Unknown or weak quality should not authorize canonical path claims. |
| `ask_user` empty suggestions are repaired in recovery payload construction | Keeps the recovery payload itself actionable before formatter policy fallback is needed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/d5-recovery-payload.vitest.ts tests/empty-result-recovery.vitest.ts` | PASS: 2 files passed, 48 tests passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | PASS: `tsc --build` completed successfully |
| `grep -l responsePolicy .opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js` | PASS: matched `dist/formatters/search-results.js` |
| `grep -l citationPolicy .opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js` | PASS: matched `dist/formatters/search-results.js` |
| `grep -l ask_disambiguation .opencode/skill/system-spec-kit/mcp_server/dist/lib/search/recovery-payload.js` | PASS: matched `dist/lib/search/recovery-payload.js` |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/014-memory-search-response-policy --strict` | PASS: Errors 0, Warnings 0 |
| Live `memory_search({query:"find the spec for the cache warning hooks packet"})` probe | PASS (cite_results branch): recorded 2026-04-27T10:12:37.318Z; `data.citationPolicy:"cite_results"`, `requestQuality.label:"good"`, `intent.type:"find_spec"`, top hit is the `001-cache-warning-hooks` spec at similarity 84.07. `evidenceGapWarning` still surfaces (`Z=1.21`) per 007/Q4 contract. Weak-quality branch (`do_not_cite_results`/`responsePolicy.noCanonicalPathClaims`/`safeResponse`/`ask_disambiguation`) not exercised here — covered by `tests/d5-recovery-payload.vitest.ts` and `tests/empty-result-recovery.vitest.ts`; restart confirms cite_results path is live in production. |
| 006/I2 weak-quality live repro after restart | DEFERRED: still requires the original 006/I2 query that yielded `requestQuality:"weak"`; this probe used a good-quality query to confirm cite_results path. Recommend running 006/I2 reproduction during item 2.2 sweep re-run. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Server-side contract only.** This packet adds the policy fields; caller-side enforcement (model behavior to honor noCanonicalPathClaims) is out of scope. CLI runtimes need their own contract to read these fields.
2. **MCP daemon restart required.** The rebuilt `dist` files are on disk, but live MCP probes will not reflect this change until the user restarts the MCP-owning client/runtime.
<!-- /ANCHOR:limitations -->
