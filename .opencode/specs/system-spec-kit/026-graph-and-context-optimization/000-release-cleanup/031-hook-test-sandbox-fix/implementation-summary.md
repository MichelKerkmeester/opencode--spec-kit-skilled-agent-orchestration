---
title: "Implementation Summary: Hook Test Sandbox Fix"
template_source: "SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2"
description: "Sandbox-aware runtime hook tests now separate deterministic direct smokes from live CLI verdicts."
trigger_phrases:
  - "031-hook-test-sandbox-fix"
  - "hook test methodology"
  - "sandbox detection"
  - "BLOCKED_BY_TEST_SANDBOX"
  - "operator-run-outside-sandbox"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/031-hook-test-sandbox-fix"
    last_updated_at: "2026-04-29T21:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented sandbox-aware runner"
    next_safe_action: "Use normal shell for live verdict"
    blockers: []
    key_files:
      - "../030-hook-plugin-per-runtime-testing/runners/common.ts"
      - "../030-hook-plugin-per-runtime-testing/findings.md"
      - "methodology-correction.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-hook-test-sandbox-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical live CLI verdict requires operator-run-outside-sandbox."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-hook-test-sandbox-fix |
| **Completed** | 2026-04-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runner now treats direct hook/plugin smokes and live runtime CLI validation
as separate evidence layers. A sandboxed parent process produces direct-smoke
results and `SKIPPED_SANDBOX` live-cli cells instead of false hook failures.

### Runtime Runners

Each runtime adapter now emits a deterministic direct-smoke cell and a live-cli
cell. The orchestrator detects sandbox state once and passes the result into all
adapters.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../030-hook-plugin-per-runtime-testing/runners/common.ts` | Modified | Add sandbox detection, `SKIPPED_SANDBOX`, repo-root detection, and run-output path. |
| `../030-hook-plugin-per-runtime-testing/runners/run-all-runtime-hooks.ts` | Modified | Pass sandbox detection to runtime adapters and print verdict. |
| `../030-hook-plugin-per-runtime-testing/runners/test-*.ts` | Modified | Split direct-smoke and live-cli cells. |
| `../030-hook-plugin-per-runtime-testing/runners/README.md` | Modified | Document normal-shell live mode and sandbox partial mode. |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Modified | Add `hook-tests` script. |
| `../030-hook-plugin-per-runtime-testing/findings.md` | Modified | Add corrected classification amendment. |
| `methodology-correction.md` | Created | Explain root cause and operator path. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation first fixed classification at the shared result type level,
then updated each runtime adapter to execute direct smokes independently of live
CLI invocations. Documentation was updated after the runner behavior was proven
inside the current sandbox.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Use `SKIPPED_SANDBOX` only for live CLI cells, because direct smokes are valid
  inside the sandbox.
- Write new runner output under `run-output/latest`, because prior JSONL files
  are historical evidence.
- Use the local Node TS loader in `hook-tests`, because `npx tsx` can attempt a
  network fetch and the `tsx` CLI IPC path is blocked in this sandbox.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Command | Result |
|---------|--------|
| `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests` | PASS: 5 direct-smoke PASS cells, 5 live-cli `SKIPPED_SANDBOX` cells. |
| `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/031-hook-test-sandbox-fix --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The canonical live CLI verdict is intentionally deferred to a normal operator
shell. Sandbox mode validates hook/plugin code paths but cannot validate CLIs
that require user auth state, keychain, or home-directory state writes.
<!-- /ANCHOR:limitations -->
