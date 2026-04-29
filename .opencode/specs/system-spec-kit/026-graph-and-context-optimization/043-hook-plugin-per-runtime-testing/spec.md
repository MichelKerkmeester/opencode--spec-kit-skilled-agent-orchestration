---
title: "Spec: Hook Plugin Per Runtime Testing"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Level 2 packet for live runtime hook and plugin validation across Claude, Codex, Copilot, Gemini, and OpenCode."
trigger_phrases:
  - "043-hook-plugin-per-runtime-testing"
  - "runtime hook tests"
  - "per-runtime hook validation"
  - "cli skill hook tests"
  - "hook live testing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/043-hook-plugin-per-runtime-testing"
    last_updated_at: "2026-04-29T21:12:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Live runtime matrix captured"
    next_safe_action: "Review findings matrix"
    blockers: []
    completion_pct: 100
---
# Spec: Hook Plugin Per Runtime Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Parent** | 026-graph-and-context-optimization |
| **Mode** | Live CLI execution plus deterministic hook evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The hook contract docs and adapter scaffolding describe how Claude Code, Codex CLI, GitHub Copilot CLI, Gemini CLI, and OpenCode should receive Spec Kit prompt and lifecycle context. That contract still needed a live execution pass that invokes each runtime CLI and records whether the documented hook or plugin signal is observable in this host.

### Purpose

Create packet-local runners, execute the five runtime cells, save JSONL evidence, and publish a signed-off findings matrix with PASS, FAIL, SKIPPED, or TIMEOUT_CELL verdicts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create live runtime hook runners under `runners/`.
- Invoke `claude`, `codex`, `copilot`, `gemini`, and `opencode` when their binaries and configs exist.
- Capture stdout, stderr, exit code, timeout, config snippets, and deterministic hook/plugin observables.
- Write one JSONL result per runtime event under `results/`.
- Write `findings.md` with the full runtime/event matrix.
- Preserve existing packet logs and research prompts.

### Out of Scope

- Do not edit runtime hook config files to make cells pass.
- Do not repair provider authentication, keychain, session-store, or sandbox permission failures.
- Do not commit changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runners/*.ts` | Create | Per-runtime live hook harness and orchestrator |
| `runners/README.md` | Create | Operator quickstart |
| `results/*.jsonl` | Create | Per-cell live evidence |
| `findings.md` | Create | Signed-off runtime matrix |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create | Level 2 packet docs |
| `description.json`, `graph-metadata.json` | Create | Discovery and graph metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide per-runtime runners. | Five runner files exist under `runners/`, one per supported runtime. |
| REQ-002 | Provide shared classification. | `common.ts` defines status, result, timeout, redaction, and JSONL helpers. |
| REQ-003 | Run with three-wide concurrency. | `run-all-runtime-hooks.ts` uses a concurrency limit of 3. |
| REQ-004 | Capture live evidence. | Each result JSONL includes CLI command evidence and hook or plugin observables. |
| REQ-005 | Preserve honest outcomes. | Missing binary/config becomes SKIPPED; failed invocation becomes FAIL; timeout becomes TIMEOUT_CELL. |
| REQ-006 | Avoid config mutation. | Runners only read runtime config and write packet-local results. |
| REQ-007 | Publish findings. | `findings.md` lists the full runtime/event matrix and remediation notes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `results/` contains JSONL evidence for Claude, Codex, Copilot, Gemini, and OpenCode.
- **SC-002**: `findings.md` reports all runtime/event statuses with exact failed assertions.
- **SC-003**: Secret-like config values are redacted from result snippets.
- **SC-004**: Strict spec validation exits 0.

### Acceptance Scenarios

- **SCN-001**: **Given** a runtime binary is absent, **When** its runner starts, **Then** it writes SKIPPED with `binary_not_present`.
- **SCN-002**: **Given** a runtime config file is absent, **When** its runner starts, **Then** it writes SKIPPED with `config_not_present`.
- **SCN-003**: **Given** a runtime CLI exits nonzero, **When** direct hook evidence succeeds, **Then** the cell remains FAIL.
- **SCN-004**: **Given** a runtime CLI exceeds 300 seconds, **When** the runner classifies the result, **Then** the cell is TIMEOUT_CELL.
- **SCN-005**: **Given** a config snippet contains a key-like value, **When** JSONL evidence is written, **Then** the value is redacted.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Handling |
|------|------|--------|----------|
| Dependency | Runtime provider auth | CLI calls can fail before hooks become visible | Record stderr and classify as FAIL |
| Dependency | Host sandbox permissions | CLIs may need state directories outside writable roots | Record EPERM/session-store failures |
| Risk | Secret leakage in config snippets | Runtime config may contain API keys | Redact key-like values before writing JSONL |
| Risk | Hook output not model-visible | Some runtime CLIs do not echo injected context | Record deterministic hook/plugin smoke evidence alongside CLI output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Per-cell timeout remains 300 seconds.
- **NFR-R02**: The orchestrator runs at most three cells concurrently.
- **NFR-S01**: Result snippets must redact API keys and token-like values.
- **NFR-M01**: Runtime model defaults are overrideable through environment variables.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- CLI binary absent: SKIPPED with `binary_not_present`.
- Config absent: SKIPPED with `config_not_present`.
- CLI exits nonzero while direct hook smoke passes: FAIL, because the live runtime invocation failed.
- CLI prompts interactively until timeout: TIMEOUT_CELL.
- Hook/plugin smoke emits expected context while CLI fails: record both; do not upgrade the cell to PASS.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Runtime breadth | Medium | Five separate CLI surfaces |
| Environment risk | High | Auth, keychain, and sandbox state can fail independently |
| Code risk | Medium | New packet-local TypeScript harness |
| Documentation risk | Low | Packet-local findings only |
| Overall | Level 2 | Verification-heavy implementation with bounded code changes |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions remain. Follow-up work should decide whether runtime-auth and state-directory failures belong to operator setup docs or runtime-specific remediation packets.
<!-- /ANCHOR:questions -->
