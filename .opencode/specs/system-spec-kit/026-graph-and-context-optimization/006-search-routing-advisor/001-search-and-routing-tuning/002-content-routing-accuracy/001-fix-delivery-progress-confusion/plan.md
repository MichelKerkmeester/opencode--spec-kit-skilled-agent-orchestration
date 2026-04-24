---
title: "...-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion/plan]"
description: "Execution plan for the delivery/progress routing remediation and evidence refresh."
trigger_phrases:
  - "delivery progress routing plan"
  - "strong delivery mechanics"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex"
    recent_action: "Refreshed plan anchors and current code evidence"
    next_safe_action: "No further phase-local work required"
    completion_pct: 100
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Fix Delivery vs Progress Routing Confusion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest |
| **Framework** | system-spec-kit MCP server |
| **Storage** | Spec docs and routing prototype JSON |
| **Testing** | `content-router.vitest.ts` |

### Overview
The phase sharpens the delivery/progress boundary inside the existing router. Delivery mechanics now live in the cue bundle at `content-router.ts:404-423`, while the progress and delivery floors use the `strongDeliveryMechanics` guard at `content-router.ts:965-993`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target routing file identified.
- [x] Target regression test identified.

### Definition of Done
- [x] Delivery cue evidence lands on current code lines.
- [x] Targeted TypeScript and Vitest verification are recorded.
- [x] Packet docs use active anchors and memory frontmatter.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cue-level router calibration inside the existing three-tier routing pipeline.

### Components
- `RULE_CUES.narrative_delivery` for explicit delivery language.
- `scoreCategories()` for progress-floor suppression and delivery lift.
- `content-router.vitest.ts` for mixed-signal regression coverage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm delivery and progress cue locations.

### Phase 2: Implementation
- [x] Expand `RULE_CUES.narrative_delivery` in `content-router.ts:404-423`.
- [x] Use `strongDeliveryMechanics` in `content-router.ts:965-993`.
- [x] Refresh ambiguous routing prototypes.

### Phase 3: Verification
- [x] Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- [x] Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Router category selection | Vitest |
| Type | TypeScript compile contract | `tsc --noEmit` |
| Manual | Evidence replay | Direct file-line reads |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `content-router.ts` | Runtime code | Green | Cannot prove cue behavior |
| `content-router.vitest.ts` | Test code | Green | Cannot prove regression closure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Targeted router tests fail after cue changes.
- **Procedure**: Revert the cue/prototype/test changes through orchestrator-owned git flow and reopen this packet.
<!-- /ANCHOR:rollback -->
