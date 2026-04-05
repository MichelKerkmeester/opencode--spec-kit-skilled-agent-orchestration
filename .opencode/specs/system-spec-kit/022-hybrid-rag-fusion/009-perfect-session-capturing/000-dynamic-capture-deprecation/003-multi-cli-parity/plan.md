---
title: "...ec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/plan]"
description: "Re-open phase 016 to add direct parity regression coverage, reconcile the phase docs, and validate the already-shipped runtime behavior."
trigger_phrases:
  - "parity hardening plan"
  - "phase 016 plan"
  - "multi-cli regression coverage"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Multi-CLI Parity Hardening

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | system-spec-kit scripts workspace |
| **Storage** | None for this phase; test and documentation updates only |
| **Testing** | Vitest, Node.js smoke runner, `tsc --build` |

### Overview
Phase 016 was reopened because its runtime behavior was already present in code, but the proof and documentation were incomplete. This pass keeps the runtime scope narrow, adds direct parity regression tests around the shipped behavior, and rewrites the phase folder so Level 2 validation reflects the real completed state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive regression-hardening on existing seams

### Key Components
- **`phase-classifier.ts` parity seam**: Canonical tool-name scoring through the public phase-classifier APIs.
- **`content-filter.ts` parity seam**: Shared built-in noise filtering for Copilot, Codex, and generic XML artifacts.
- **`input-normalizer.ts` parity seam**: CLI-derived file provenance and `view` observation title rendering.

### Data Flow
`CLI capture -> input normalizer / phase classifier / content filter -> focused parity tests -> completion evidence -> phase-016 doc validation`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the existing phase-016 runtime behavior in the three target code seams.
- [x] Audit the current phase-016 doc-validator failures and the missing parity-specific test coverage.
- [x] Lock scope to phase-016 tests and phase-016 spec artifacts only.

### Phase 2: Core Implementation
- [x] Add a classifier regression proving Copilot `view` aliases to canonical `read` scoring.
- [x] Add a focused content-filter parity test file covering Copilot lifecycle noise, Codex reasoning markers, and generic empty XML wrappers.
- [x] Extend runtime-memory input tests to prove CLI-derived `FILES` keep `_provenance: 'tool'` and `view` renders `Read ...` titles.
- [x] Rewrite the phase-016 spec artifacts to match the active Level 2 structure and current verification evidence.

### Phase 3: Verification
- [x] Run focused Vitest coverage for the parity seams plus provenance scoring safety nets.
- [x] Run `test-extractors-loaders.js`, `npm run typecheck`, and `npm run build`.
- [x] Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on the phase-016 folder and reconcile any remaining validator findings.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parity regressions in classifier, content filter, and input normalizer | Vitest |
| Integration | Extractor/loader baseline across scripts workspace | `node scripts/tests/test-extractors-loaders.js` |
| Static | TypeScript workspace integrity and build output | `npm run typecheck`, `npm run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 shared noise-filter pipeline | Internal | Green | Parity markers would need a new path, which is out of scope. |
| Phase 006 provenance-aware scoring | Internal | Green | `_provenance: 'tool'` would lose its scoring purpose without that prior behavior. |
| Phase 007 phase classifier scoring path | Internal | Green | Alias proof would not validate the intended downstream scoring behavior. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A parity regression test proves the shipped behavior is incorrect or a doc/template change breaks validator compliance.
- **Procedure**: Revert the phase-016 test/doc edits only, then re-run the same focused verification stack to confirm the previous baseline state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## 8. L2: PHASE DEPENDENCIES

N/A. Phase 016 does not decompose into sub-phases. The implementation phases in section 4 are sequential steps within a single pass.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## 9. L2: EFFORT ESTIMATION

| Phase | Estimated | Actual |
|-------|-----------|--------|
| Setup | 15 min | 10 min |
| Core Implementation | 60 min | 45 min |
| Verification | 15 min | 20 min |
| **Total** | **90 min** | **75 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. L2: ENHANCED ROLLBACK

N/A. The basic rollback plan in section 7 is sufficient for test-and-documentation-only changes. No staged rollback or feature flags apply.
<!-- /ANCHOR:enhanced-rollback -->
