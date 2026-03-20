---
title: "Implementation Plan: Session Source Validation"
---
# Implementation Plan: Session Source Validation

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | Native capture pipeline, quality validation, render path |
| **Storage** | CLI session artifacts, frontmatter provenance fields, file-count metrics |
| **Testing** | Vitest plus memory-quality lane and phase-local spec validation |

### Overview

This phase is also already shipped. The remaining work was to document the real session-source validation surface: Claude session hints and fallback behavior, provenance fields, split file-count metrics, V10 divergence validation, contamination scoring, trigger sanitization, and the current focused proof lanes that keep those seams green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The shipped session-source runtime seams were re-read.
- [x] The focused session-source regression lanes were rerun locally.
- [x] The phase was classified as shipped code plus documentation drift, not as missing runtime work.

### Definition of Done

- [x] Plan, tasks, checklist, and summary match the shipped session-source behavior.
- [x] The focused four-file session-source lane and memory-quality lane pass with current evidence.
- [x] Phase-local memory save and final strict gate reruns are recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Native-source validation and provenance hardening at the capture, quality, and rendering seams.

### Key Components

- **`claude-code-capture.ts`**: session hints and capture provenance behavior.
- **`collect-session-data.ts`**: split file-count metrics.
- **`quality-scorer-calibration.vitest.ts`**: score and contamination calibration proof.
- **`task-enrichment.vitest.ts` and `memory-render-fixture.vitest.ts`**: downstream validation that uses the new provenance and file-count truth.

### Data Flow

Native capture selection -> provenance fields and split file counts -> quality validation and contamination handling -> rendered output and regression proof -> phase documentation closeout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shipped Surface Audit

- [x] Review native capture, quality, and rendering seams that this phase owns.
- [x] Confirm the phase deliverables are already in the live codebase.
- [x] Confirm the current focused proof lanes still cover the same surface.

### Phase 2: Documentation Reconciliation

- [x] Rewrite the phase docs to describe the shipped session-source behavior.
- [x] Replace placeholder checklist language with current evidence-backed assertions.
- [x] Keep live CLI freshness caveats separate from the shipped phase-runtime claims.

### Phase 3: Verification

- [x] Rerun the focused four-file session-source proof lane.
- [x] Rerun the memory-quality lane that exercises the same validation surface.
- [x] Record memory-save closeout and final strict phase gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Native capture | Claude capture behavior and session-source hints | `claude-code-capture.vitest.ts` |
| Quality and contamination | Scorer calibration and divergence logic | `quality-scorer-calibration.vitest.ts`, `test-memory-quality-lane.js` |
| Downstream integration | Render and enrichment behavior that depends on provenance and file counts | `task-enrichment.vitest.ts`, `memory-render-fixture.vitest.ts` |
| Phase-local truth | Spec validation and completion | `validate.sh`, `check-completion.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Native capture and provenance runtime | Internal | Green | Phase claims would not be anchored to shipped behavior |
| Focused four-file session-source lane | Internal | Green | Phase proof would be incomplete |
| Memory-quality lane | Internal | Green | Quality and divergence behavior would lack direct confirmation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase docs drift from the shipped runtime or the focused proof lanes stop matching the documented surface.
- **Procedure**: Revert only the phase docs, rerun the focused session-source commands, and reapply the minimum evidence-backed documentation updates.
<!-- /ANCHOR:rollback -->
