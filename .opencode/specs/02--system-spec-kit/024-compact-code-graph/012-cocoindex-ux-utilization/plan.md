---
title: "Implementation Plan: Phase 012 — CocoIndex UX, Utilization & Usefulness"
description: "Restate the Phase 012 delivery plan using the actual shipped CocoIndex behavior and remaining gaps."
trigger_phrases:
  - "plan"
  - "phase 012"
  - "cocoindex"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Phase 012 — CocoIndex UX, Utilization & Usefulness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript hooks, MCP helpers, Markdown packet docs |
| **Framework** | system-spec-kit Phase 012 packet |
| **Storage** | Local repo files and local JSONL feedback storage |
| **Testing** | Manual build checks, hook smoke tests, targeted runtime-routing tests |

### Overview
This plan documents what Phase 012 actually delivered and how to verify it honestly. The emphasis is on status-only SessionStart reporting, hint-only PreCompact guidance, lightweight helper-tool behavior, and explicit tracking of the work that remains undone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The packet scope is limited to Phase 012 documentation inside this folder
- [x] Current implementation gaps are identified
- [x] Required Level 2 sections are defined

### Definition of Done
- [x] All packet docs use the Level 2 scaffold
- [x] Current-reality corrections are consistent across docs
- [x] Verification references manual build checks and hook smoke tests instead of a nonexistent script
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation alignment for a partially delivered implementation

### Key Components
- **SessionStart path**: Reports CocoIndex binary availability only
- **PreCompact path**: Adds semantic-search hint text only
- **Helper tools**: `ccc_status`, `ccc_reindex`, and `ccc_feedback` expose limited operational helpers
- **Packet docs**: Keep delivered scope and non-implemented items synchronized

### Data Flow
Implementation facts flow from shipped hooks and helper tools into the packet. The packet then drives review and validation by describing what exists, how it was verified, and what still requires a future phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Rebuild the packet around the Level 2 template contract
- [x] Remove stale or contradictory claims

### Phase 2: Core Implementation
- [x] Document SessionStart as status-only binary reporting
- [x] Document PreCompact as hint-only semantic guidance
- [x] Document `ccc_status` and `ccc_feedback` with their actual contracts
- [x] Keep README/tool-reference updates and SessionStart background re-index marked as not implemented

### Phase 3: Verification
- [x] Align checklist evidence with manual build output verification and hook smoke tests
- [x] Validate the packet after edits
- [ ] Implement broader CocoIndex readiness automation or background re-indexing
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | `npm run build` output review for `dist/hooks/claude/*.js` | Bash |
| Manual | Hook smoke tests for `session-prime.js`, `compact-inject.js`, `session-stop.js` | Node |
| Integration | Routing behavior already exercised by runtime-routing coverage | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing Phase 012 code changes | Internal | Green | Packet cannot stay accurate if implementation facts are wrong |
| Validator contract in `.opencode/skill/system-spec-kit/templates/level_2/` | Internal | Green | Packet structure drifts and validation fails |
| Manual build and hook smoke evidence | Internal | Yellow | Verification claims weaken if evidence is not retained |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet validation regresses or packet claims no longer match shipped behavior.
- **Procedure**: Revert the packet docs to the last accurate revision, re-read current implementation facts, and re-run validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Current packet contents | Core packet rewrite |
| Core | Setup | Verification |
| Verification | Core | Completion report |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium | 45 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **85 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Packet-only scope confirmed
- [x] Required reality corrections captured
- [x] Validation command identified

### Rollback Procedure
1. Restore the last packet revision that matched implementation facts.
2. Re-check manual build verification and hook smoke-test evidence.
3. Re-apply only factual corrections that are still true.
4. Re-run `validate.sh` before closing the packet update.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
