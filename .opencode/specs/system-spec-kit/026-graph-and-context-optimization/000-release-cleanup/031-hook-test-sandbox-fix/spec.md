---
title: "Spec: Hook Test Sandbox Fix"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Level 2 packet for sandbox-aware runtime hook test methodology and corrected prior findings classification."
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
    recent_action: "Added sandbox-aware methodology"
    next_safe_action: "Run strict validator and build"
    blockers: []
    completion_pct: 95
---
# Spec: Hook Test Sandbox Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Parent** | 026-graph-and-context-optimization |
| **Mode** | Methodology fix plus corrected findings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The prior runtime hook matrix ran live runtime CLIs from inside a sandboxed
`codex exec --sandbox workspace-write` parent process. That parent sandbox
blocked access to user auth state, keychain, home config, and runtime state
directories, so the live CLI failures were misclassified as hook or auth
failures.

### Purpose

Make the runner detect sandboxed execution, preserve direct hook/plugin smoke
coverage inside the sandbox, skip only invalid live CLI cells, and correct the
prior findings with the real `BLOCKED_BY_TEST_SANDBOX` cause.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add sandbox detection to the shared runtime hook runner utilities.
- Split each runtime result into a direct-smoke cell and a live-cli cell.
- Introduce `SKIPPED_SANDBOX` for live CLI cells skipped by sandbox detection.
- Add an operator-facing package script for live hook tests.
- Document normal-shell live mode and sandbox partial mode.
- Amend the prior findings document with corrected classification.

### Out of Scope

- Hook source changes; deterministic direct smokes already pass.
- Plugin source changes; the OpenCode transform smoke already passes.
- Rewriting historical result JSONL evidence.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../030-hook-plugin-per-runtime-testing/runners/common.ts` | Modify | Add sandbox detection, `SKIPPED_SANDBOX`, root resolution, and run-output path. |
| `../030-hook-plugin-per-runtime-testing/runners/run-all-runtime-hooks.ts` | Modify | Detect sandbox once, pass it to adapters, and print aggregate verdict. |
| `../030-hook-plugin-per-runtime-testing/runners/test-*.ts` | Modify | Emit direct-smoke and live-cli cells separately. |
| `../030-hook-plugin-per-runtime-testing/runners/README.md` | Modify | Document operator live mode and sandbox partial mode. |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Modify | Add `hook-tests` script using the local TS loader. |
| `../030-hook-plugin-per-runtime-testing/findings.md` | Modify | Add corrected amendment while preserving original verdict. |
| `methodology-correction.md` | Create | Document root cause and corrected operator path. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detect sandboxed execution. | `detectSandbox()` returns `sandboxed`, `reason`, and `detectionMethod`. |
| REQ-002 | Cover known sandbox signals. | Detection checks `CODEX_SANDBOX`, `SANDBOX_PROFILE`, home mismatch, and home write probe failures. |
| REQ-003 | Preserve direct smokes. | Direct hook/plugin smokes still run inside a sandbox. |
| REQ-004 | Skip invalid live CLIs. | Sandboxed live CLI cells are recorded as `SKIPPED_SANDBOX`. |
| REQ-005 | Keep normal live mode. | Outside a sandbox, direct-smoke and live-cli cells both run. |
| REQ-006 | Preserve historical evidence. | Existing prior `results/*.jsonl` files are not overwritten. |
| REQ-007 | Correct the prior verdict. | All five live failures are reclassified as `BLOCKED_BY_TEST_SANDBOX`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Sandboxed runner output reports five direct-smoke `PASS` cells.
- **SC-002**: Sandboxed runner output reports five live-cli `SKIPPED_SANDBOX` cells.
- **SC-003**: Build for the MCP server package exits 0.
- **SC-004**: Strict validation for this packet exits 0.
- **SC-005**: Prior findings open with a corrected amendment and keep the original verdict as history.

### Acceptance Scenarios

- **SCN-001**: **Given** `CODEX_SANDBOX` is set, **When** the orchestrator starts, **Then** it prints a sandbox warning and skips live CLI cells.
- **SCN-002**: **Given** a direct hook smoke emits expected context, **When** the live CLI is skipped, **Then** the direct-smoke cell is still `PASS`.
- **SCN-003**: **Given** a normal shell without sandbox signals, **When** the orchestrator starts, **Then** runtime CLIs are invoked.
- **SCN-004**: **Given** a missing runtime binary outside a sandbox, **When** the live cell starts, **Then** it remains `SKIPPED`, not `SKIPPED_SANDBOX`.
- **SCN-005**: **Given** prior live CLI evidence shows home/keychain/state denial, **When** findings are amended, **Then** the cause is `BLOCKED_BY_TEST_SANDBOX`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Handling |
|------|------|--------|----------|
| Risk | Symlinked `specs` path | Repo-root detection can land at `.opencode` | Detect repo root by marker directory, not fixed depth only. |
| Risk | Sandbox false positive | Live tests could be skipped in a valid shell | Record detection method and reason in result evidence. |
| Risk | Historical evidence overwrite | Prior JSONL proof could be lost | Default new output to `run-output/latest`. |
| Dependency | Runtime auth and state | Canonical live verdict still needs user auth | Document normal-shell operator path. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Do not mutate hook or plugin source code.
- **NFR-R02**: Keep sandbox detection deterministic and local.
- **NFR-R03**: Keep `SKIPPED_SANDBOX` distinct from missing binary/config `SKIPPED`.
- **NFR-S01**: Do not add auth material or secrets to docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- `CODEX_SANDBOX` present: live CLI cells become `SKIPPED_SANDBOX`.
- `SANDBOX_PROFILE` present: live CLI cells become `SKIPPED_SANDBOX`.
- Home differs from OS-level home: live CLI cells become `SKIPPED_SANDBOX`.
- Home write probe fails with `EPERM` or `EACCES`: live CLI cells become `SKIPPED_SANDBOX`.
- Runtime binary missing outside sandbox: live CLI cell remains `SKIPPED`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Runtime breadth | Medium | Five runtime adapters changed. |
| Methodology risk | High | Misclassification affected the prior verdict. |
| Code risk | Medium | Shared runner types and path resolution changed. |
| Documentation risk | Medium | Prior findings require correction without deleting history. |
| Overall | Level 2 | Verification-heavy change across bounded runner/docs files. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions remain. The deferred live verdict belongs to an operator
run from a normal shell.
<!-- /ANCHOR:questions -->

