---
title: "Checklist: CLI Matrix Adapter Runners"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification checklist for packet 036 CLI matrix adapter runners."
trigger_phrases:
  - "023-cli-matrix-adapter-runners"
  - "CLI matrix adapter"
  - "matrix runner adapters"
  - "cli-codex adapter"
  - "cli-copilot adapter"
  - "cli-gemini adapter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners"
    last_updated_at: "2026-04-29T17:16:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Checklist complete"
    next_safe_action: "Run targeted smoke"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: CLI Matrix Adapter Runners

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or explicitly document blocker |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Packet 030 design read. [EVIDENCE: `spec.md` cites `030.../spec.md:48` and `030.../plan.md:54`]
- [x] CHK-002 [P0] Packet 035 findings read. [EVIDENCE: `spec.md` cites `035.../findings.md:15`, `:73`, `:75`]
- [x] CHK-003 [P0] CLI invocation patterns read. [EVIDENCE: adapter argv shapes match CLI docs and existing deep-loop tests]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared contract is typed. [EVIDENCE: `adapter-common.ts:14`, `:16`, `:24`]
- [x] CHK-011 [P0] Each adapter is thin and CLI-specific. [EVIDENCE: `adapter-cli-codex.ts:11`; `adapter-cli-opencode.ts:11`]
- [x] CHK-012 [P0] Spawn errors return `BLOCKED`. [EVIDENCE: `adapter-common.ts:124`, `:151`]
- [x] CHK-013 [P0] Timeouts return `TIMEOUT_CELL`. [EVIDENCE: `adapter-common.ts:134`]
- [x] CHK-014 [P1] PASS requires expected stdout signal. [EVIDENCE: `adapter-common.ts:70`, `:163`]
- [x] CHK-015 [P1] Meta-runner uses concurrency 3. [EVIDENCE: `run-matrix.ts:66`, `:248`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] TypeScript build passes. [EVIDENCE: `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` exit 0]
- [x] CHK-021 [P0] Adapter smoke tests pass. [EVIDENCE: `npx vitest run matrix-adapter` -> 5 files, 10 tests passed]
- [x] CHK-022 [P0] Tests do not invoke real CLIs. [EVIDENCE: each test file mocks `node:child_process`; see `matrix-adapter-codex.vitest.ts:3`]
- [x] CHK-023 [P1] Timeout path tested per adapter. [EVIDENCE: `matrix-adapter-codex.vitest.ts:37`; `matrix-adapter-opencode.vitest.ts:37`]
- [x] CHK-024 [P1] Manifest sanity checked. [EVIDENCE: JSON check output `70`, `14`, `5`, `F11-cli-gemini`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No provider secrets logged. [EVIDENCE: tests use mocks; real matrix not executed]
- [x] CHK-031 [P0] No real external CLIs invoked during verification. [EVIDENCE: targeted Vitest mock suite only]
- [x] CHK-032 [P1] Real matrix execution remains explicit CLI command. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md:14`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Runner README created. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md`]
- [x] CHK-041 [P1] MCP README references new runner directory. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:1301`, `:1322`]
- [x] CHK-042 [P1] Packet docs cite design, findings, and implementation evidence. [EVIDENCE: `spec.md`, `plan.md`, `implementation-summary.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Required seven packet files exist. [EVIDENCE: strict validator exit 0]
- [x] CHK-051 [P1] Runtime files are under `mcp_server/matrix_runners/`. [EVIDENCE: target directory created]
- [x] CHK-052 [P1] Tests are under `mcp_server/tests/`. [EVIDENCE: `matrix-adapter-*.vitest.ts`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-29 - adapter runner implementation complete
<!-- /ANCHOR:summary -->
