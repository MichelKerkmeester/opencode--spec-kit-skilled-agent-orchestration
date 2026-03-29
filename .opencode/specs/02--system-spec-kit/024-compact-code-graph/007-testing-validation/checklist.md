# Checklist: Phase 7 — Testing & Validation

## P0
- [ ] RuntimeFixture contract implemented with factory for all 4 runtimes
- [ ] `runtime-routing.vitest.ts` passing — runtime detection verified
- [ ] `hook-precompact.vitest.ts` passing — precompute and cache logic verified
- [ ] `hook-session-start.vitest.ts` passing — injection and source matching verified
- [ ] `hook-stop-token-tracking.vitest.ts` passing — transcript parsing and snapshots verified
- [ ] `cross-runtime-fallback.vitest.ts` passing — tool fallback for non-hook runtimes verified
- [ ] All 7 test matrix scenarios covered by at least one test
- [ ] All tests pass in CI (vitest)

## P1
- [ ] `token-snapshot-store.vitest.ts` passing — SQLite CRUD verified
- [ ] `session-token-resume.vitest.ts` passing — session resume from snapshot verified
- [ ] `dual-scope-hooks.vitest.ts` extended with compaction fixtures
- [ ] `crash-recovery.vitest.ts` extended with real SQLite fixtures
- [ ] Shared test utilities reusable across all test files
- [ ] Manual testing playbook scenarios executed
- [ ] Manual test results documented with pass/fail evidence

## P2
- [ ] Test coverage report generated
- [ ] Edge cases covered: empty transcript, MCP unavailable, expired cache, concurrent sessions
- [ ] Performance assertions: hook scripts complete in < 2 seconds
- [ ] Regression tests: existing test suite still passes after extensions
- [ ] Copilot/Gemini hook adapter fixtures prepared for v2
