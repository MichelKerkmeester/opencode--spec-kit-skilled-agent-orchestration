---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: memory_search response policy [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/009-memory-search-response-policy/plan]"
description: "Add hard responsePolicy + citationPolicy fields and extend RecoveryAction vocabulary so weak retrieval is a binding refusal contract instead of advisory metadata."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "memory search response policy plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/009-memory-search-response-policy"
    last_updated_at: "2026-04-27T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: memory_search response policy

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP server |
| **Storage** | None |
| **Testing** | vitest |

### Overview
Insert `responsePolicy` and `citationPolicy` fields into `memory_search` response envelopes so weak/partial/no-result retrieval carries a binding refusal contract. Implement `deriveResponsePolicy(requestQuality, recovery)` helper per 007 §9 example. Extend `RecoveryAction` vocabulary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem stated (007/Q4 + 006/I2 hallucination)
- [x] Success criteria measurable (REQ-001..004)
- [x] Dependencies identified

### Definition of Done
- [ ] All REQs PASS (vitest green)
- [ ] `npm run build` clean
- [ ] dist marker grep PASS
- [ ] 006/I2 repro after daemon restart shows new fields
- [ ] `validate.sh --strict` PASS
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive contract layer. Server-side derivation; caller-side enforcement out of scope.

### Key Components
- **search-results.ts:951-1035** — formatter insertion point for new fields.
- **recovery-payload.ts:28-37, :152-164** — RecoveryAction enum extension.
- **deriveResponsePolicy()** — new helper deriving policy from `requestQuality` + `recovery`.

### Data Flow
```
search complete -> requestQuality computed -> recovery payload built
  -> deriveResponsePolicy(qual, rec) -> if non-null, attach to data
  -> citationPolicy derived from quality label
  -> response envelope emitted with policy fields
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source
- [ ] Read search-results.ts:951-1035 + recovery-payload.ts end-to-end.
- [ ] Extend `RecoveryAction` type with 3 new values.
- [ ] Add `deriveResponsePolicy()` helper per 007 §9.
- [ ] Insert responsePolicy + citationPolicy into response data shape.
- [ ] Guarantee non-empty suggestedQueries when ask_user OR set responsePolicy fallback.

### Phase 2: Tests
- [ ] Update d5-recovery-payload.vitest.ts to assert new enum values.
- [ ] Update empty-result-recovery.vitest.ts to assert citationPolicy.
- [ ] Add new test: weak-quality response carries responsePolicy.noCanonicalPathClaims:true.
- [ ] Add new test: good-quality response carries citationPolicy:"cite_results", no responsePolicy.
- [ ] Add new test: empty suggestedQueries + ask_user is replaced by either non-empty queries OR responsePolicy:ask_disambiguation.

### Phase 3: Verify
- [ ] `npm test -- --run tests/d5-recovery-payload.vitest.ts tests/empty-result-recovery.vitest.ts` green.
- [ ] `npm run build` clean.
- [ ] grep dist for `responsePolicy`, `citationPolicy`, `ask_disambiguation` markers.
- [ ] Update implementation-summary.md.
- [ ] Document daemon restart requirement.
- [ ] Commit + push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | deriveResponsePolicy + enum extension | vitest |
| Integration | response envelope shape | vitest fixture |
| Live probe | 006/I2 repro after restart | MCP daemon |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007 research | Internal | Green | Defines contract |
| Packet 013 rebuild protocol | Internal | Green | Documents restart |
| recovery-payload.ts callers | Internal | Green | Multiple files reference enum |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Downstream parser failures or test regressions.
- **Procedure**: Revert patch commit; rebuild dist; restart daemon. Fields are additive so rollback is safe.
<!-- /ANCHOR:rollback -->
