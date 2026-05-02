---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 009 Test Reliability Remediation [template:level_2/plan.md]"
description: "Six surgical test-only edits + one shared env-snapshot helper to close findings F-015-C5-01..06 from packet 046 iteration-015."
trigger_phrases:
  - "F-015-C5 plan"
  - "009 test reliability plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/009-test-reliability"
    last_updated_at: "2026-05-01T07:32:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec"
    next_safe_action: "Apply six surgical edits + helper, run isolation tests, then validate + commit"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/test-helpers/env-snapshot.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-009-test-reliability"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 009 Test Reliability Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Six surgical test-only edits across stress-test and unit-test files close findings F-015-C5-01..06. A small shared helper at `mcp_server/lib/test-helpers/env-snapshot.ts` removes the duplicated env-restore pattern that two of the tests need. No product code is touched.

### Technical Context

The six tests live across three test surfaces:
- `mcp_server/stress_test/session/` — Gate D resume ladder benchmarks
- `mcp_server/stress_test/skill-advisor/` — OpenCode plugin bridge stress
- `mcp_server/tests/` — envelope, hybrid-search-flags, memory-save-pipeline-enforcement

Each fix is the minimum change that resolves the cited reliability defect: replace a hard-coded path with captured cwd, gate absolute latency assertions behind `BENCHMARK=1`, swap real-timer sleeps for `vi.useFakeTimers`, snapshot/restore process env mutations, and replace a repo-local fixture root with `os.tmpdir()` mkdtemp.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict | exit 0 (errors=0) |
| Git diff scope | six test files + new helper file + this packet's spec docs only |
| Each modified test in isolation | passes via `npx vitest run <file>` |
| Full stress suite | exit 0, 56+ files / 163+ tests |
| Sample unit-test invocation | `npx vitest run tests/envelope.vitest.ts tests/hybrid-search-flags.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts` exit 0 |
| Inline traceability markers | one `// F-015-C5-NN` marker per finding |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Test-only changes plus one shared helper. Each test file is self-contained; the helper is a ~30 LOC ESM module with zero runtime dependencies — it captures `process.env[key]` for a list of keys at call time and returns a `restore()` function that re-sets or deletes each key. Both consumers (C5-04 and C5-05) call `snapshotEnv([...])` in `beforeEach` and the returned `restore()` in `afterEach`.

The two C5-04 / C5-05 fixes intentionally do not couple to vitest beyond import order. The helper is pure Node and could be unit-tested separately, but at this packet's scope the integration via the two consuming tests is sufficient evidence of correctness.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Create | New helper `snapshotEnv` | mcp_server/lib/test-helpers/env-snapshot.ts | helper | Pending |
| 2 | Edit | Replace hard-coded REPO_ROOT with captured cwd | gate-d-resume-perf.vitest.ts | F-015-C5-01 | Pending |
| 3 | Edit | Gate absolute p50/p95 asserts behind BENCHMARK=1 | gate-d-benchmark-session-resume.vitest.ts | F-015-C5-02 | Pending |
| 4 | Edit | Replace real setTimeout + elapsed asserts with fake timers | envelope.vitest.ts | F-015-C5-03 | Pending |
| 5 | Edit | Snapshot/restore env via shared helper | opencode-plugin-bridge-stress.vitest.ts | F-015-C5-04 | Pending |
| 6 | Edit | Snapshot/restore SPECKIT_MMR via shared helper | hybrid-search-flags.vitest.ts | F-015-C5-05 | Pending |
| 7 | Edit | Replace repo-local fixture root with os.tmpdir() mkdtemp | memory-save-pipeline-enforcement.vitest.ts | F-015-C5-06 | Pending |
| 8 | Verify | Run each modified test in isolation | this packet | — | Pending |
| 9 | Verify | Run sample unit-test invocation + full `npm run stress` | this packet | — | Pending |
| 10 | Validate | validate.sh --strict | this packet | — | Pending |
| 11 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification is the test suite itself, run in three modes:
1. **Per-file isolation:** Each modified test passes when run alone (`npx vitest run path/to/file.vitest.ts`). This catches order-dependent failures masked by suite-wide test order.
2. **Sample unit suite:** `cd mcp_server && npx vitest run tests/envelope.vitest.ts tests/hybrid-search-flags.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts` — confirms no regression in the unit-test surface.
3. **Full stress suite:** `cd mcp_server && npm run stress` must remain at 56+ files / 163+ tests exit 0.

No new automated tests are added because the helper is exercised end-to-end by the two consuming tests. A unit test for the helper itself is out of scope.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §C5 (test reliability)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Vitest >= 1.x (project default; provides `vi.useFakeTimers`, `vi.setSystemTime`)
- No other packet dependencies. Sub-phase 009 is independent within Wave 1.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a test-only fix introduces a regression in the stress or unit suite:
1. `git revert <commit-sha>` reverts all six edits + helper atomically
2. Re-run the failing test to confirm baseline restored
3. Reauthor the failing edit with smaller scope (e.g., inline the helper instead of importing it)

Each edit carries an inline finding marker so isolating one fix's revert (cherry-pick a subset of hunks) is straightforward.
<!-- /ANCHOR:rollback -->
