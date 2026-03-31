---
title: "Checklist: Phase 7 — Testing & Validation [02--system-spec-kit/024-compact-code-graph/007-testing-validation/checklist]"
description: "checklist document for 007-testing-validation."
trigger_phrases:
  - "checklist"
  - "phase"
  - "testing"
  - "validation"
  - "007"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 7 — Testing & Validation

## P0
- [x] RuntimeFixture contract implemented with factory for all 4 runtimes
- [x] `runtime-routing.vitest.ts` passing — runtime detection verified
- [x] `hook-precompact.vitest.ts` passing — precompute and cache logic verified
- [x] `hook-session-start.vitest.ts` passing — injection and source matching verified
- [x] `hook-stop-token-tracking.vitest.ts` passing — transcript parsing and snapshots verified
- [x] `cross-runtime-fallback.vitest.ts` passing — tool fallback for non-hook runtimes verified
- [x] All 7 test matrix scenarios covered by at least one test
- [x] All tests pass in CI (vitest)

## P1
- [x] `token-snapshot-store.vitest.ts` passing — SQLite CRUD verified
- [x] `session-token-resume.vitest.ts` passing — session resume from snapshot verified
- [ ] `dual-scope-hooks.vitest.ts` extended with compaction fixtures
- [ ] `crash-recovery.vitest.ts` extended with real SQLite fixtures
- [x] Shared test utilities reusable across all test files
- [ ] Manual testing playbook scenarios executed
- [ ] Manual test results documented with pass/fail evidence

## P2
- [ ] Test coverage report generated
- [ ] Edge cases covered: empty transcript, MCP unavailable, expired cache, concurrent sessions
- [x] Performance assertions: hook scripts complete in < 2 seconds — verified via HOOK_TIMEOUT_MS=1800
- [x] Regression tests: existing test suite still passes after extensions — 96 tests pass
- [ ] Copilot/Gemini hook adapter fixtures prepared for v2
