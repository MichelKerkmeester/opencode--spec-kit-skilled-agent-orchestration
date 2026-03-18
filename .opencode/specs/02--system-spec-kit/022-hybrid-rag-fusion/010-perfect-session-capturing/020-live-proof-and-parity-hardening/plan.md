---
title: "Implementation Plan: Live Proof And Parity Hardening [template:level_1/plan.md]"
description: "Describe the remaining retained live-proof work and the conditions that would let the parent pack close phase 020 honestly."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase 020"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Live Proof And Parity Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON retained artifacts, manual/live proof workflows |
| **Framework** | system-spec-kit session-capturing verification flow |
| **Storage** | Retained proof artifacts under the parent research surface |
| **Testing** | Manual/live CLI evidence plus parent recursive validation |

### Overview
Phase `020` is the closeout gate. The plan is to refresh retained live artifacts for the supported CLI/runtime paths, confirm the shared direct/stateless and structured-input scenarios, and only then allow the parent pack to claim current multi-CLI proof.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Phases `018` and `019` define the shared runtime contract.
- [x] The parent pack keeps the proof boundary conservative.

### Definition of Done
- [ ] Retained live artifacts refreshed.
- [ ] Parent pack updated to reflect the new retained proof.
- [ ] Recursive validation rerun after closeout edits.

---

## 3. ARCHITECTURE

### Pattern
Automated parity baseline followed by retained live-proof refresh.

### Key Components
- **Retained artifacts**: the proof files that preserve current CLI evidence
- **Manual/live scenarios**: direct, `--stdin`, `--json`, and repeated-save expectations
- **Parent closeout**: only updated after live proof exists

### Data Flow
Shared runtime contract -> live/manual scenario execution -> retained artifacts -> parent proof-boundary update.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Artifact Refresh
- [ ] Refresh retained live CLI artifacts.
- [ ] Capture supported save modes.

### Phase 2: Parity Hardening
- [ ] Reconfirm same-minute save expectations.
- [ ] Reconfirm warning-free successful flows.

### Phase 3: Parent Closeout
- [ ] Update parent proof language only after retained artifacts exist.

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual/live | Supported CLI/runtime flows | Real CLI sessions and retained artifacts |
| Structural validation | Parent pack after closeout | `validate.sh --strict --recursive` |
| Completion | Parent closeout checklist | `check-completion.sh --strict` |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Access to supported CLIs | External | Yellow | Phase stays open |
| Current automated parity baseline | Internal | Green | Live proof would lose its contract anchor |

---

## 7. ROLLBACK PLAN

- **Trigger**: Retained proof is incomplete or contradictory.
- **Procedure**: Leave phase `020` open, keep the parent pack conservative, and do not upgrade the proof claim.
