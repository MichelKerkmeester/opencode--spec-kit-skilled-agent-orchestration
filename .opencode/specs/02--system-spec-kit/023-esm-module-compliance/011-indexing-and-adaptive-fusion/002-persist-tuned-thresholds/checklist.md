---
title: "Verification Checklist: Phase 2 — Persist Tuned Thresholds"
description: "Quality gates for SQLite threshold persistence in adaptive-ranking.ts."
trigger_phrases:
  - "persist tuned thresholds checklist"
  - "adaptive thresholds verification"
  - "phase 2 checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Phase 2 — Persist Tuned Thresholds

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-007 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — table schema and data-flow diagram present
- [ ] CHK-003 [P1] Phase 1 (001-wire-promotion-gate) merged or available on branch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `pnpm tsc --noEmit` exits 0 with no type errors after all changes
- [ ] CHK-011 [P0] No unhandled SQLite exceptions — all DB calls wrapped with appropriate error handling
- [ ] CHK-012 [P1] `INSERT OR REPLACE` upsert used (not separate INSERT/UPDATE logic)
- [ ] CHK-013 [P1] `signal_weights` serialised to JSON for storage, deserialised on read
- [ ] CHK-014 [P1] WeakMap warm-path check is the first statement in `getAdaptiveThresholdConfig()`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Persistence round-trip test passes: set overrides → get config → values match
- [ ] CHK-021 [P0] Cold-cache test passes: WeakMap entry removed → get config → SQLite values returned
- [ ] CHK-022 [P0] `pnpm vitest run` exits 0 with zero regressions in existing test suite
- [ ] CHK-023 [P1] No-row edge case confirmed: `getAdaptiveThresholdConfig()` returns compiled-in defaults when `adaptive_thresholds` table is empty
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials in new code
- [ ] CHK-031 [P0] SQLite parameters are bound (not string-concatenated) to prevent injection
- [ ] CHK-032 [P1] `adaptive_thresholds` table uses singleton row (id=1) — no unbounded row growth
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md all consistent (no stale placeholders)
- [ ] CHK-041 [P1] Table schema documented in plan.md architecture section
- [ ] CHK-042 [P2] Code comment in `ensureAdaptiveTables()` explains singleton-row contract
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only `adaptive-ranking.ts` and its vitest file are modified (no scope creep)
- [ ] CHK-051 [P1] No temp or debug files left in the spec folder or source tree
- [ ] CHK-052 [P2] Session context saved to `memory/` after implementation completes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 8 | 0/8 |
| P2 Items | 3 | 0/3 |

**Verification Date**: (to be filled on completion)
<!-- /ANCHOR:summary -->
