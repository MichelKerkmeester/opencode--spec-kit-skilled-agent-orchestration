---
title: "Implementation Summary: 037/005 Stress Test Folder Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2"
description: "Moves confirmed MCP server stress tests into mcp_server/stress_test, adds opt-in stress runner wiring, and documents the new boundary."
trigger_phrases:
  - "037-005-stress-test-folder-migration"
  - "stress test folder"
  - "dedicated stress folder"
  - "mcp_server/stress_test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/README"
      - ".opencode/skill/system-spec-kit/mcp_server/vitest.config.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/package.json"
      - "migration-plan.md"
    session_dedup:
      fingerprint: "sha256:037005stresstestfoldermigrationimplementation0000000000"
      session_id: "037-005-stress-test-folder-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 037/005 Stress Test Folder Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-stress-test-folder-migration |
| **Completed** | Blocked on default test suite |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The MCP server now has a dedicated `stress_test/` folder for explicit stress, load, matrix-cell, degraded-state sweep, and performance validation. Default tests stay under `tests/`; operators can run the moved stress coverage with `npm run stress`.

### Stress Folder

Two confirmed stress suites moved out of `tests/`: `session-manager-stress.vitest.ts` and `code-graph-degraded-sweep.vitest.ts`. Fixture-only W7 cells stayed in `stress_test/search-quality/` because they assert static measurement fixtures rather than running stress harness logic.

### Runner Wiring

`vitest.config.ts` excludes stress tests from default runs. `vitest.stress.config.ts` and `package.json` expose stress coverage through `npm run stress`, and `tsconfig.json` excludes moved `.vitest.ts` files from production build.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/session-manager-stress.vitest.ts` | Moved | Place session capacity stress coverage in the dedicated folder |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | Moved | Place packet-013 degraded stress cell in the dedicated folder |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/README` | Created | Document purpose, run commands, and boundary with default tests |
| `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` | Modified | Add opt-in stress include/exclude behavior |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Modified | Add `stress` script |
| `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` | Modified | Exclude stress tests from production build |
| `.opencode/skill/system-spec-kit/mcp_server/README` | Modified | Add `stress_test/` to MCP server structure |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README` | Modified | Clarify default suite vs stress-suite boundary |
| `specs/.../011-mcp-runtime-stress-remediation/**/*.md` | Modified | Refresh direct references to the moved degraded stress suite |
| `specs/.../005-stress-test-folder-migration/*` | Created | Add packet docs and migration plan |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Discovery used filename search, TypeScript content search, and docs reference search. The move stayed surgical: no production runtime modules changed, relative imports still resolve from the sibling `stress_test/` folder, and direct docs references now point at the new path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `stress_test/` instead of `tests/stress/` | The operator explicitly asked for a dedicated folder outside `tests/`. |
| Move `code-graph-degraded-sweep.vitest.ts` | Packet 013 names it a degraded stress cell and its docs define it as a stress-run remediation sweep. |
| Leave W7 fixture-only cells in `stress_test/search-quality/` | They mention stress cells, but they do not execute load, capacity, or live degraded-state stress logic. |
| Gate stress tests behind `vitest.stress.config.ts` | Default `npm test` remains the fast normal verification path. |
| Use filesystem `mv` instead of `git mv` | Sandbox denied `.git/index.lock`; the file move still appears as a rename in Git status/diff. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 4. VERIFICATION

| Command | Result |
|---------|--------|
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration --strict` | PASS - 0 errors, 0 warnings |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | PASS - `tsc --build` exited 0 |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm test` | BLOCKED - broad suite reported unrelated failures and then stopped producing output; see checklist |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run stress` | PASS - 2 files, 7 tests passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Default suite is not green in this workspace.** `npm test` reported failures in existing suites such as `copilot-hook-wiring`, `plugin-bridge`, `handler-memory-save`, `modularization`, `checkpoints-extended`, `context-server`, code-graph tests, and docs parity tests before it stopped producing output. The moved stress suite itself passes through `npm run stress`.
<!-- /ANCHOR:limitations -->
