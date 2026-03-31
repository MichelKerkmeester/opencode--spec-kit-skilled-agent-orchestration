---
title: "Implementati [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/plan]"
description: "This phase shifts routine saves to JSON-primary behavior and aligns the runtime, operator docs, and archived follow-up phase map."
trigger_phrases:
  - "plan"
  - "json primary deprecation"
  - "017 json primary deprecation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: JSON-Primary Deprecation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Markdown |
| **Framework** | system-spec-kit memory pipeline |
| **Storage** | Filesystem-backed memory artifacts |
| **Testing** | `npm run build`, Vitest, JSON validation |

### Overview
This phase changes the routine save posture from dynamic-capture-first to JSON-primary. The implementation spans runtime warnings, structured JSON enrichment support, operator-document updates, and the documentation move that groups obsolete dynamic-capture follow-ups under the archived branch parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Runtime warnings and structured JSON support shipped
- [x] Operator docs updated to JSON-primary wording
- [x] Archived follow-up phases dispositioned and documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime contract shift with aligned documentation and archive ownership.

### Key Components
- **Runtime save path**: Warns on the deprecated routine stateless mode and accepts richer structured JSON input.
- **Operator guidance**: Teaches the JSON-primary contract and points legacy dynamic-capture work into the archived branch parent.

### Data Flow
The runtime surfaces its new posture first, the structured JSON path carries the richer input model, and the phase documentation preserves historical follow-up ownership by moving obsolete dynamic-capture work under the archived parent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the handoff from `016-json-mode-hybrid-enrichment`
- [x] Freeze JSON-primary as the routine-save target posture
- [x] Identify the follow-up phases that need keep, reframe, or archive outcomes

### Phase 2: Core Implementation
- [x] Add runtime deprecation warnings for routine stateless saves
- [x] Extend the JSON input contract and related normalization/indexing paths
- [x] Update the operator docs and move obsolete follow-up phases under `../000-dynamic-capture-deprecation/`

### Phase 3: Verification
- [x] Rebuild and rerun the targeted tests
- [x] Validate modified JSON artifacts
- [x] Verify the archive layout and documentation handoff
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | TypeScript compile and output generation | `npm run build` |
| Integration | Runtime input and weighting behavior | Vitest |
| Validation | JSON artifact integrity and archive review | `python3` JSON parsing plus doc validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `016-json-mode-hybrid-enrichment` | Internal | Green | The JSON-primary shift loses its immediate predecessor context |
| Archived branch parent `../000-dynamic-capture-deprecation/` | Internal | Green | The moved dynamic-capture follow-ups lose a valid owner |
| Operator doc surfaces in the skill and command directories | Internal | Green | Runtime posture and human guidance drift apart |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The JSON-primary shift breaks a valid save flow or the operator contract becomes misleading.
- **Procedure**: Revert the runtime warnings and operator-doc wording together, restore the prior guidance, and re-evaluate whether the contract change needs smaller intermediate steps.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ---> Phase 2 (Core) ---> Phase 3 (Verify)
         \______________________________________________/
                   archive and doc alignment gate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `016-json-mode-hybrid-enrichment` | Core, Verify |
| Core | Setup | Verify |
| Verify | Setup, Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 4-6 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Runtime contract shift reviewed
- [x] Archive ownership identified
- [x] Operator docs selected for synchronized updates

### Rollback Procedure
1. Revert the JSON-primary runtime warnings and input-contract edits.
2. Restore the previous operator guidance in the skill and save command docs.
3. Revalidate the archived branch parent references if any moved-doc ownership changes are reverted.
4. Re-run the targeted build and doc-validation gates.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
