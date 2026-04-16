<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | level2-verify | compact -->
---
title: "Validate Continuity Profile Weights - Execution Plan"
status: completed
parent_spec: 006-continuity-profile-validation/spec.md
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the judged continuity sweep and prompt enrichment work"
    next_safe_action: "Resume from implementation-summary.md if follow-on tuning work opens"
---
# Implementation Plan: Validate Continuity Profile Weights

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Vitest + MCP server runtime |
| **Storage** | None |
| **Testing** | `npx tsc --noEmit`, focused Vitest, strict packet validation |

### Overview
Add judged continuity evaluation to the existing K-sweep harness, then align the Tier 3 prompt with the same continuity model. The delivered scope follows the user-directed 12-query fixture instead of the earlier 20-30 planning target.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Judged continuity fixture added and recommendation recorded
- [x] Tier 3 prompt paragraph updated and asserted
- [x] Packet docs updated with completion evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Focused test-harness extension plus prompt-contract alignment

### Key Components
- **`optimizeKValuesByIntent()` harness**: Reused for the judged continuity fixture and recommendation assertion
- **`buildTier3Prompt()`**: Receives the continuity resume-ladder paragraph

### Data Flow
Continuity-style synthetic queries flow through the existing K-sweep metrics helper, producing a keep/change recommendation that is then mirrored by the Tier 3 prompt language for the same continuity model.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the existing K-sweep harness and Tier 3 prompt contract
- [x] Confirm the packet-local documentation and verification expectations

### Phase 2: Core Implementation
- [x] Add the judged 12-query continuity fixture to `k-value-optimization.vitest.ts`
- [x] Record the keep recommendation for baseline `K=60`
- [x] Add the continuity paragraph to `buildTier3Prompt()`

### Phase 3: Verification
- [x] Run TypeScript verification
- [x] Run focused Vitest coverage
- [x] Normalize packet docs to strict validator headers
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | K-sweep continuity fixture, prompt contract | Vitest |
| Integration | Type-level compatibility across the MCP server package | TypeScript compiler |
| Manual | Packet-closeout validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing K grid and metrics helpers | Internal | Green | Would force a new evaluation surface |
| Existing Tier 3 prompt builder | Internal | Green | Would block the continuity-paragraph delivery |
| Level 2 packet validator | Internal | Green | Would prevent clean closeout evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The judged continuity fixture produces noisy or contradictory recommendations, or the prompt paragraph introduces taxonomy confusion.
- **Procedure**: Revert the continuity fixture and prompt paragraph together so the evaluation model and routing model stay aligned.
<!-- /ANCHOR:rollback -->
