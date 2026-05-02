---
title: "Spec: CLI Matrix Adapter Runners"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Level 2 remediation packet that adds CLI adapter runners, a 70-cell manifest, meta-runner, docs, and mocked smoke tests for packet 030's F1-F14 x CLI matrix."
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
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    completion_pct: 100
---
# Spec: CLI Matrix Adapter Runners

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-29 |
| **Parent** | 026-graph-and-context-optimization |
| **Depends On** | 035 execution validation; 030 full-matrix design |
| **Mode** | Runtime implementation + mocked smoke tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 035 signed off a CONDITIONAL baseline because the full Option C design was not executable: 42 cells were `RUNNER_MISSING`, and no complete `matrix-manifest.json`, feature x executor runner tree, or packet-030 meta-aggregator existed (`022-full-matrix-execution-validation/findings.md:5`, `:15`, `:73`, `:75`). Packet 030 had already established the target shape: F1-F14, external CLI executors, non-applicable cells as first-class outputs, and per-feature runners plus a meta-aggregator (`030-v1-0-4-full-matrix-stress-test-design/spec.md:48`, `:96`, `:97`, `:100`; `030-v1-0-4-full-matrix-stress-test-design/plan.md:52`, `:54`, `:95`, `:97`, `:99`).

### Purpose

Build the external CLI adapter layer for `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, and `cli-opencode`, then wire those adapters into a manifest-driven meta-runner with mocked smoke tests. This converts packet 035's runner-missing cells into executable cells that can now resolve to `PASS`, `FAIL`, `TIMEOUT_CELL`, `NA`, or `BLOCKED`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/` with shared adapter process handling.
- Add five per-CLI adapter entrypoints with the requested argv/stdin contracts.
- Add a 70-cell `F1-F14 x five CLI executors` manifest and prompt templates.
- Add a meta-runner that loads the manifest, respects concurrency 3, writes per-cell JSONL, writes `summary.tsv`, and prints pass-rate aggregates.
- Add one mocked smoke test file per adapter. Tests mock `spawn`; they do not invoke real CLIs.
- Add runner docs and a short `.opencode/skill/system-spec-kit/mcp_server/README.md` structure reference.
- Create this Level 2 packet's required seven docs/metadata files.

### Out of Scope

- Do not run the full matrix or invoke real CLI providers.
- Do not update packet 035 findings.
- Do not remediate external CLI auth/keychain blockers from ticket 037.
- Do not fix F11 Copilot hook parity, F12 validator timeout, or F13 native/inline stress-cycle runner gaps.
- Do not commit.

### Files Changed

| Path | Change Type | Purpose |
|------|-------------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts` | Create | Shared timeout, spawn, stdout/stderr capture, expected-signal parsing, result normalization |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-*.ts` | Create | Five CLI-specific adapters |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` | Create | 70-cell external CLI matrix with F11 Gemini `NA` |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | Create | Manifest-driven meta-runner |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/*.md` | Create | Feature prompt templates |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-*.vitest.ts` | Create | Five mocked adapter smoke tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts` | Create | Test spawn mock helper |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md` | Create | Quickstart and manifest docs |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Update | Structure reference for matrix runners |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/*` | Create | Packet documentation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement adapter contract. | Shared types expose `AdapterInput`, `AdapterResult`, and status union (`adapter-common.ts:14`, `:16`, `:24`). |
| REQ-002 | Implement five CLI adapters. | Adapter files invoke `codex`, `copilot`, `gemini`, `claude`, and `opencode` with the requested contracts (`adapter-cli-codex.ts:16`, `adapter-cli-copilot.ts:14`, `adapter-cli-gemini.ts:14`, `adapter-cli-claude-code.ts:14`, `adapter-cli-opencode.ts:16`). |
| REQ-003 | Treat spawn failures and timeouts as typed outcomes. | Shared runner returns `BLOCKED` for spawn errors and `TIMEOUT_CELL` on timeout (`adapter-common.ts:124`, `:134`, `:151`). |
| REQ-004 | Detect PASS via stdout expected signal. | Shared runner checks substring or regex signals before returning `PASS` (`adapter-common.ts:70`, `:160`). |
| REQ-005 | Freeze the external CLI matrix. | Manifest contains 70 cells, 14 features, 5 executors, and F11 cli-gemini as `NA` per manifest check output. |
| REQ-006 | Add meta-runner. | `run-matrix.ts` loads the manifest, routes adapters, writes per-cell JSONL and `summary.tsv`, and aggregates pass rates (`run-matrix.ts:125`, `:134`, `:172`, `:180`, `:238`, `:263`). |
| REQ-007 | Add one smoke test per adapter. | `npx vitest run matrix-adapter` reports 5 files and 10 tests passed. |
| REQ-008 | Update docs. | Runner README documents quickstart, manifest fields, outcomes, and verification (`.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md:12`, `:31`, `:54`, `:64`); MCP README lists the new directory (`.opencode/skill/system-spec-kit/mcp_server/README.md:1301`, `:1322`). |
| REQ-009 | Build succeeds. | `npm run build` in `mcp_server` exits 0. |
| REQ-010 | Strict validator passes. | Final validator command exits 0 for this packet. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The meta-runner can construct all 70 external CLI cells without reading the conversation.
- **SC-002**: Each CLI executor has a typed adapter and a mocked PASS/timeout smoke test.
- **SC-003**: F11 cli-gemini is explicit `NA`, not omitted.
- **SC-004**: Real CLI execution remains opt-in through `run-matrix.ts`; tests never call real binaries.
- **SC-005**: Build, targeted adapter tests, and strict packet validation all pass.

### Acceptance Scenarios

- **SCN-001**: **Given** stdout containing `MATRIX_CELL_PASS F1`, when an adapter resolves a zero-exit process, then the adapter returns `PASS`.
- **SCN-002**: **Given** a process that never closes before the cell timeout, when the adapter timer fires, then the adapter returns `TIMEOUT_CELL`.
- **SCN-003**: **Given** a manifest row with `applicable:false`, when the meta-runner reaches it, then it writes an `NA` result without spawning a CLI.
- **SCN-004**: **Given** `--filter` or `--executors`, when the meta-runner starts, then it limits execution to matching cells.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Handling |
|------|------|--------|----------|
| Dependency | External CLI auth | Real cells may return `BLOCKED` even when adapters work | Adapter layer records spawn/auth stderr as evidence; ticket 037 owns auth |
| Risk | Matrix execution cost | Running all 69 applicable external cells can hammer provider APIs | Meta-runner concurrency is fixed at 3 (`run-matrix.ts:66`, `:248`) |
| Risk | Prompt templates are generic smoke prompts | They prove adapter executability, not deep feature correctness | Future verification packets can replace templates with richer feature scenarios |
| Risk | Expected signal is model-output dependent | A capable but non-compliant response becomes `FAIL` | The prompt templates require exact `MATRIX_CELL_PASS F#` output |
| Risk | F13 native/inline runner still absent | This packet does not close ticket 040 | Scope limited to five external CLI adapters |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Adapter tests must mock `spawn` and avoid real CLI invocations.
- **NFR-R02**: Per-cell JSONL rows must retain stdout, stderr, exit code, duration, status, and reason.
- **NFR-R03**: The meta-runner must continue aggregation after `FAIL`, `BLOCKED`, `TIMEOUT_CELL`, or `NA`.
- **NFR-M01**: CLI defaults must remain overrideable through environment variables where adapters set model/tier defaults.
- **NFR-S01**: No secrets, auth tokens, or provider credentials are logged by the implementation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Spawn throws synchronously or emits `error`: adapter returns `BLOCKED`.
- Spawn error code is `EAGAIN`, `ENOSPC`, `ENOENT`, or `EACCES`: adapter returns `BLOCKED`.
- Process exits 0 without expected signal: adapter returns `FAIL`.
- Expected signal is a regex string: adapter attempts regex matching after substring matching.
- Prompt template path is missing: meta-runner passes the manifest value as inline prompt text instead of crashing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Matrix breadth | Medium | 70 external CLI cells, one `NA` |
| Runtime risk | Medium | Real execution depends on five CLIs and provider auth |
| Code mutation risk | Medium | New runner directory plus tests and docs |
| Test risk | Low | Targeted smoke tests mock process spawn |
| Overall | Level 2 | Cross-executor implementation with verification but no architecture rewrite |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions remain for packet 036. Follow-up packets still own real external CLI auth, hook parity, validator timeout hardening, and the F13 native/inline runner.
<!-- /ANCHOR:questions -->
