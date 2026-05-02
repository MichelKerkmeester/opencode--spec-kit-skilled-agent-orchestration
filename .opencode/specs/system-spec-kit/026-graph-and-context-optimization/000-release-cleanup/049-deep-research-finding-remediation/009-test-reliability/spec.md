---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 009 Test Reliability Remediation [template:level_2/spec.md]"
description: "Resolve six findings F-015-C5-01..06 from packet 046 iteration-015 across the stress-test and unit-test surface. Removes machine-coupled paths, gates absolute latency assertions behind benchmark mode, replaces real-timer sleeps with deterministic fake timers, and snapshots/restores process env mutations so tests stay isolated and host-portable."
trigger_phrases:
  - "F-015-C5"
  - "test reliability remediation"
  - "gate-d-resume-perf hard-coded path"
  - "vi.useFakeTimers envelope latency"
  - "env snapshot restore"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/009-test-reliability"
    last_updated_at: "2026-05-01T07:30:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored; ready for implementation"
    next_safe_action: "Apply six surgical test edits, run each in isolation, then validate strict + commit"
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
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: 009 Test Reliability Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (2 findings) + P2 (4 findings) |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-search-quality-tuning |
| **Successor** | 010-cli-orchestrator-drift |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six tests in the stress-test and unit-test surface have reliability defects that make them brittle on non-developer machines, in CI, or under repeated runs. One test hard-codes the original developer's local checkout path. One asserts absolute latency budgets that can fail on slower hardware. One uses real-timer sleeps with elapsed-time assertions, slowing the suite and producing flakes. Two tests mutate process env vars (`SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_MMR`) without restoration, leaking state across the run. One test uses a repo-local temp fixture root that collides between parallel runs and survives crashes.

### Purpose
Land six surgical test-only edits so each finding is fixed with the minimum code change. Tests stay green individually, the full `npm run stress` suite stays at 56+ files / 163+ tests exit 0, and a small shared `env-snapshot` helper at `mcp_server/lib/test-helpers/env-snapshot.ts` removes the duplicated env-restore pattern that two tests need.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Six surgical test-only edits, one per finding F-015-C5-01..06
- One small shared helper `mcp_server/lib/test-helpers/env-snapshot.ts` consumed by C5-04 and C5-05
- Strict validation pass on this packet
- One commit pushed to `origin main`

### Out of Scope
- Any product-code change (these are test-only fixes)
- Any change to other sub-phases in packet 049
- Any fix to other test reliability defects beyond F-015-C5-01..06
- Re-architecting the stress-test harness or vitest config

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts` | Modify | F-015-C5-01: replace hard-coded `REPO_ROOT` with captured `process.cwd()` at module load |
| `mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts` | Modify | F-015-C5-02: gate absolute p50/p95 latency asserts behind `process.env.BENCHMARK === '1'` |
| `mcp_server/tests/envelope.vitest.ts` | Modify | F-015-C5-03: replace real `setTimeout` + elapsed asserts with `vi.useFakeTimers()` + `vi.setSystemTime` deterministic time control |
| `mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Modify | F-015-C5-04: snapshot env in `beforeEach`, restore in `afterEach` via shared helper |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Modify | F-015-C5-05: snapshot env in `beforeEach`, restore in `afterEach` via shared helper |
| `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | Modify | F-015-C5-06: replace fixed repo-local `tmp-test-fixtures/` with per-test `mkdtempSync` random-suffix root (kept inside `process.cwd()` because the handler's `ALLOWED_BASE_PATHS` rejects `os.tmpdir()` paths) |
| `mcp_server/lib/test-helpers/env-snapshot.ts` | Create | New shared helper: snapshot/restore process env keys for tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1: gate-d-resume-perf.vitest.ts no longer references the developer's home directory; original cwd is captured from `process.cwd()` at module load and restored in `afterAll`.
- FR-2: gate-d-benchmark-session-resume.vitest.ts wraps `expect(summary.p50).toBeLessThan(300)` and `expect(summary.p95).toBeLessThan(500)` inside `if (process.env.BENCHMARK === '1') { ... }` so CI runs only assert correctness (memory.source === 'handover') and the latency telemetry is logged but not asserted unless BENCHMARK=1 is set.
- FR-3: envelope.vitest.ts T154 latency tests use `vi.useFakeTimers()` with `vi.setSystemTime` to advance the clock deterministically, ensuring `vi.useRealTimers()` runs in `afterEach` (or the test cleanup path) even on test failure.
- FR-4: opencode-plugin-bridge-stress.vitest.ts captures the relevant env keys (`SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`) in `beforeEach` and restores them in `afterEach`, even when a test fails (try/finally semantics handled by the helper).
- FR-5: hybrid-search-flags.vitest.ts captures `SPECKIT_MMR` in `beforeEach` and restores in `afterEach`, even when a test fails.
- FR-6: memory-save-pipeline-enforcement.vitest.ts replaces the fixed `path.join(process.cwd(), 'tmp-test-fixtures', ...)` FIXTURE_ROOT with `fs.mkdtempSync(path.join(process.cwd(), 'tmp-test-fixtures-'))` so concurrent and crashed runs do not collide. The mkdtemp root remains inside `process.cwd()` (rather than `os.tmpdir()` as the research note suggested) because `handleMemorySave`'s `ALLOWED_BASE_PATHS` validator rejects paths outside the repo unless `MEMORY_BASE_PATH` is set at module-load time, and modifying that validator is out of scope for this test-only packet.
- FR-7: New helper `mcp_server/lib/test-helpers/env-snapshot.ts` exports `snapshotEnv(keys: string[])` returning a function `restore()` that resets each key to its captured value (re-set if it had a value, delete if it was undefined).

### Non-Functional
- NFR-1: `validate.sh --strict` exit 0 for this packet.
- NFR-2: Each modified test passes in isolation when run alone (`npx vitest run <file>`).
- NFR-3: Full `npm run stress` remains 56+ files / 163+ tests exit 0.
- NFR-4: A sample unit-test invocation `cd mcp_server && npx vitest run tests/envelope.vitest.ts tests/hybrid-search-flags.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts` exits 0.
- NFR-5: Each edit cites its finding ID in a comment marker (`// F-015-C5-NN:` or `// F-015-C5-NN —`) for traceability.

### Constraints
- Stay on `main`; commit pushes immediately to `origin main`.
- No product code touched; no `mcp_server/handlers/**`, `mcp_server/lib/response/**`, `mcp_server/lib/search/**`, or other product files modified.
- The new helper at `mcp_server/lib/test-helpers/env-snapshot.ts` is test-only infrastructure; it does not export from any product entry point.
- No changes to `vitest.stress.config.ts` or `vitest.config.ts`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [ ] All six test edits applied with finding ID markers
- [ ] Shared `env-snapshot` helper created and consumed by C5-04 + C5-05
- [ ] Each modified test passes individually via `npx vitest run <file>`
- [ ] Full `npm run stress` exit 0 (56+ files / 163+ tests)
- [ ] Sample unit-test invocation exit 0
- [ ] `validate.sh --strict` exit 0
- [ ] One commit pushed to `origin main` with finding IDs in body
- [ ] implementation-summary.md updated with Findings closed table (6 rows)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Fake timers in envelope test interfere with async setTimeout used in test setup | Scope `vi.useFakeTimers` to only the T154 describe block; restore real timers in `afterEach` so other describes are unaffected |
| Env-snapshot helper imports add test dependency surface | Helper is pure Node, zero deps, ~30 LOC; imports from a sibling path inside `mcp_server/lib/test-helpers/` |
| BENCHMARK gate inadvertently disables a real correctness assertion | Keep `expect(...memory.source).toBe('handover')` outside the benchmark gate so the correctness contract still runs every CI build |
| mkdtemp fixture root breaks tests that hard-code paths inside FIXTURE_ROOT | Read each fixture-using test; verify all path references go through the FIXTURE_ROOT constant; no string-literal collisions |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §C5 (test reliability findings)
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Test crashes mid-run | OS signal / process crash | mkdtemp roots in `os.tmpdir()` are OS-managed; env-snapshot helper uses try/finally so restore runs even on uncaught throw |
| Module-load cwd differs from test cwd | Vitest runs tests from a worker subdir | Captured cwd is whatever the file sees at module load — that is the cwd the test must restore to before the next file loads |
| BENCHMARK env left set across runs | Developer forgot to unset | The gate reads each invocation; no persistent state; doc the env in the test description so future readers see it |
| Helper consumed before test imports | Hoisting issue with vi.mock | Helper is plain ESM with no vi.mock dependencies; safe to import alongside other test imports |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-015-C5-01 | gate-d-resume-perf.vitest.ts | 5 |
| F-015-C5-02 | gate-d-benchmark-session-resume.vitest.ts | 8 |
| F-015-C5-03 | envelope.vitest.ts | 15 |
| F-015-C5-04 | opencode-plugin-bridge-stress.vitest.ts | 7 |
| F-015-C5-05 | hybrid-search-flags.vitest.ts | 5 |
| F-015-C5-06 | memory-save-pipeline-enforcement.vitest.ts | 10 |
| Helper | mcp_server/lib/test-helpers/env-snapshot.ts | 5 |
| **Total** | | **~55** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The shared helper extraction is a small DRY win; if it adds friction, the inline snapshot pattern is acceptable per task description.
<!-- /ANCHOR:questions -->
