---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 009 Test Reliability Remediation [template:level_2/tasks.md]"
description: "Task list for closing F-015-C5-01..06. Six surgical test edits + one shared helper + isolation tests + validate + commit + push."
trigger_phrases:
  - "F-015-C5 tasks"
  - "009 test reliability tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/009-test-reliability"
    last_updated_at: "2026-05-01T07:34:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Apply edits, run isolation tests, validate, commit, push"
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
# Tasks: 009 Test Reliability Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §C5 (test reliability) to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (six target files)
- [x] T003 [P1] Author spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md mirroring sub-phase 010 worked-pilot pattern
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P2] Create shared helper `snapshotEnv(keys: string[])` (`mcp_server/lib/test-helpers/env-snapshot.ts`)
- [ ] T005 [P1] Replace hard-coded `REPO_ROOT` literal with captured `process.cwd()` at module load (F-015-C5-01) (`mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts`)
- [ ] T006 [P2] Gate `expect(summary.p50).toBeLessThan(300)` and `expect(summary.p95).toBeLessThan(500)` behind `process.env.BENCHMARK === '1'` (F-015-C5-02) (`mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts`)
- [ ] T007 [P2] Replace real-timer sleeps + elapsed asserts with `vi.useFakeTimers()` + `vi.setSystemTime` deterministic time control in T154 latency tests (F-015-C5-03) (`mcp_server/tests/envelope.vitest.ts`)
- [ ] T008 [P1] Snapshot/restore `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` env via shared helper (F-015-C5-04) (`mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`)
- [ ] T009 [P2] Snapshot/restore `SPECKIT_MMR` env via shared helper (F-015-C5-05) (`mcp_server/tests/hybrid-search-flags.vitest.ts`)
- [ ] T010 [P2] Replace `path.join(process.cwd(), 'tmp-test-fixtures', ...)` with `fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-pipeline-fixture-'))` (F-015-C5-06) (`mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 [P1] Run each modified test in isolation: `cd mcp_server && npx vitest run <path>` for all six files
- [ ] T012 [P1] Run sample unit-test invocation: `cd mcp_server && npx vitest run tests/envelope.vitest.ts tests/hybrid-search-flags.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts` — exit 0
- [ ] T013 [P1] Run full `npm run stress` — must remain 56+ files / 163+ tests exit 0
- [ ] T014 [P1] Run `validate.sh --strict` on this packet — must exit 0
- [ ] T015 [P1] Confirm git diff shows only the six test files + new helper + this packet's spec docs
- [ ] T016 [P1] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All six findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- Each modified test passes individually
- `npm run stress` exit 0
- `validate.sh --strict` exit 0 on this packet
- Commit pushed to origin main with finding IDs in body
- No product code touched; no `mcp_server/handlers/**` or `mcp_server/lib/{response,search,parsing}/**` files modified
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §C5
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: sub-phase 010-cli-orchestrator-drift (committed as `889d1ee08`)
<!-- /ANCHOR:cross-refs -->
