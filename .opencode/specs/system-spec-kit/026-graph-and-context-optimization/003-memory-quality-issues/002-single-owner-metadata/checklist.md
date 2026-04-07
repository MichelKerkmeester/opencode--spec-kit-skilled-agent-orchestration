---
title: "Verification Checklist: Phase 2 — Single-Owner Metadata Fixes"
description: "Verification checklist for PR-3 and PR-4 delivery in Phase 2."
trigger_phrases:
  - "phase 2 checklist"
  - "single-owner metadata checklist"
  - "f-ac4 checklist"
  - "f-ac6 checklist"
importance_tier: important
contextType: planning
---
# Verification Checklist: Phase 2 — Single-Owner Metadata Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Phase cannot close until complete |
| **P1** | Required | Must complete or be explicitly deferred |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] **CHK-201 [P0]** `spec.md`, `plan.md`, and `tasks.md` describe only PR-3 and PR-4 scope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1156-1157]
- [ ] **CHK-202 [P0]** The D4 owner decision is documented as one resolver plus deferring consumers. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:191-192]
- [ ] **CHK-203 [P1]** F-AC4 and F-AC6 fixtures are identified before implementation begins. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1514-1518]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] **CHK-210 [P0]** Frontmatter ↔ YAML metadata drift assertion is installed in `post-save-review.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:83-83]
- [ ] **CHK-211 [P0]** D7 patch remains provenance-only and does not reuse `enrichCapturedSessionData()` wholesale. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1538-1538]
- [ ] **CHK-212 [P1]** The provenance patch is verified at `≤10 LOC` with `git diff --stat`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1157-1157] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:197-198]
- [ ] **CHK-213 [P1]** No JSON-mode summary regression is observed after the D7 insertion. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:67-70]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] **CHK-220 [P0]** F-AC4 is green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:198-198]
- [ ] **CHK-221 [P0]** F-AC6 is green with the stubbed git seam. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:198-198] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1518-1518]
- [ ] **CHK-222 [P0]** `validate.sh` exits `0` for this child folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190]
- [ ] **CHK-223 [P1]** Capture-mode-adjacent logic remains non-regressed while D7 JSON-mode behavior is fixed. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-025.md:31-31]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security / Isolation

- [ ] **CHK-225 [P0]** F-AC6 does not depend on live git state, ad hoc shell calls, or environment-specific branch naming. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1518-1518] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:83-83]
- [ ] **CHK-226 [P1]** The D7 patch does not pull in captured-session observations, decisions, trigger phrases, or summary content. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1538-1538]
- [ ] **CHK-227 [P1]** Phase 2 scope stays inside PR-3 and PR-4 and does not absorb later PRs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1158-1162]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] **CHK-230 [P1]** Spec/plan/tasks/checklist remain synchronized on PR-3 and PR-4 only. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1156-1157]
- [ ] **CHK-231 [P2]** Release notes draft mentions D4 and D7, with D7 described as JSON-mode-specific. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1531-1531]
- [ ] **CHK-232 [P2]** Importance-tier SSOT decision is documented in memory or handoff notes for later phases. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] **CHK-240 [P1]** Only Phase 2 implementation files and approved fixture/test surfaces were edited during execution. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1156-1157]
- [ ] **CHK-241 [P1]** Parent `PHASE DOCUMENTATION MAP` row is updated only after all phase evidence is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:177-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-188]
- [ ] **CHK-242 [P2]** Any temporary fixture artifacts remain phase-local or are cleaned up before completion. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 3 | [ ]/3 |

**Verification Date**: 2026-04-07
<!-- /ANCHOR:summary -->
