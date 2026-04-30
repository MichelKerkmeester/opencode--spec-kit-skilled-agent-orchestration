---
title: "Spec: Full-Matrix Execution Validation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Tier D execution-validation packet for packet 030 full feature x executor matrix."
trigger_phrases:
  - "035-full-matrix-execution-validation"
  - "full matrix execution"
  - "v1-0-4 stress"
  - "matrix execution validation"
  - "feature x executor matrix"
  - "feature × executor matrix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    completion_pct: 100
---
# Spec: Full-Matrix Execution Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Conditional |
| **Created** | 2026-04-29 |
| **Parent** | 026-graph-and-context-optimization |
| **Depends On** | 031, 032, 033, 034, and 030 matrix design |
| **Mode** | Research/validation only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 030 designed a full v1.0.4 matrix but intentionally did not execute it. It chose per-feature runners plus a meta-aggregator, and it required non-applicable cells to be first-class results. This packet executes the available runner surface, freezes the feature x executor matrix, and records honest blockers where packet 030's design is not yet backed by runner code.

### Purpose

Create a signed-off first full-matrix baseline with per-cell evidence, aggregate counts, and scoped remediation tickets for missing runners, blocked external CLI dispatch, hook drift, validator timeout, and the absent F13 stress-cycle runner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read packet 030 matrix docs and 013 packet-035 scope.
- Freeze F1-F14 x seven executor cells before result aggregation.
- Run focused feature-adjacent runners only; do not run the full vitest suite.
- Capture packet-local logs and per-cell JSONL rows under this packet.
- Produce findings with matrix, evidence, metrics, convergence verdicts, and tickets.

### Out of Scope

- Runtime code changes.
- New runner implementation.
- Full-suite vitest execution.
- Commits.
- Direct aggregate comparison to v1.0.2, v1.0.3, or packet 029.

### Files Changed

| Path | Change Type | Purpose |
|------|-------------|---------|
| `spec.md` | Create | Packet contract |
| `plan.md` | Create | Execution plan and evidence flow |
| `tasks.md` | Create | Task ledger |
| `checklist.md` | Create | Verification checklist |
| `implementation-summary.md` | Create | Final summary |
| `description.json` | Create | Memory metadata |
| `graph-metadata.json` | Create | Graph metadata |
| `research/iterations/iteration-001.md` | Create | Frozen matrix scope |
| `results/*.jsonl` | Create | Per-cell result rows |
| `findings.md` | Create | Signed-off findings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Freeze matrix before aggregation. | `research/iterations/iteration-001.md` lists all 98 cells with applicability. |
| REQ-002 | Run available focused runners only. | Logs under `logs/feature-runs/`; no full vitest suite command is used. |
| REQ-003 | Capture per-cell JSONL. | `results/<feature>-<executor>.jsonl` exists for every F1-F14 x executor cell. |
| REQ-004 | Aggregate honestly. | `findings.md` reports pass/fail/blocked/runner_missing/not_applicable counts and rates. |
| REQ-005 | Ticket unresolved cells. | `findings.md` maps failures and runner gaps to follow-up packets. |
| REQ-006 | Preserve new-baseline caveat. | Findings state this baseline is not comparable to v1.0.2/v1.0.3/029. |
| REQ-007 | Strict validator passes. | Final action is `validate.sh <packet> --strict` exit 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every matrix cell has an explicit status.
- **SC-002**: Every executed cell has packet-local evidence.
- **SC-003**: Missing runner surfaces are not hidden or scored as failures.
- **SC-004**: Findings include both strict metrics and caveats.
- **SC-005**: Final terminal state is CONDITIONAL because runner and external CLI coverage is incomplete.

### Acceptance Scenarios

- **SCN-001**: **Given** packet 030's corpus plan, **when** packet 035 freezes scope, **then** every F1-F14 x executor cell appears in `research/iterations/iteration-001.md`.
- **SCN-002**: **Given** a focused runner exists, **when** the cell is executed, **then** the matching `results/<feature>-<executor>.jsonl` row cites packet-local evidence.
- **SCN-003**: **Given** no runner exists, **when** aggregation runs, **then** the cell is `RUNNER_MISSING` with a remediation ticket rather than a silent omission.
- **SCN-004**: **Given** a runtime is blocked or not reachable, **when** aggregation runs, **then** the cell records `BLOCKED`, `TIMEOUT_CELL`, or `NA` with an explicit reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Handling |
|------|------|--------|----------|
| Dependency | Packet 030 did not ship runners | Many applicable cells become RUNNER_MISSING | Ticket 036 |
| Dependency | Current runtime is Codex | cli-codex self-invocation is blocked | Ticket 037 for non-Codex dispatch |
| Dependency | Copilot keychain state | cli-copilot real dispatch blocked | Ticket 037 |
| Risk | Validator test can hang | F12 progressive runner timed out | Ticket 039; normalizer-lint passed separately |
| Risk | Hook config drift | F11 Copilot wiring assertion failed | Ticket 038 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Logs and results must be parseable and packet-local.
- **NFR-R02**: Timeout cells must continue aggregation.
- **NFR-M01**: Follow-up tickets must be scoped, not broad rewrites.
- **NFR-S01**: No secrets or auth material copied into packet docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- If a runner is absent, the cell is RUNNER_MISSING rather than FAIL.
- If a CLI is installed but unusable, the cell is BLOCKED with observed smoke evidence.
- If a runner times out at 5 minutes, the cell is TIMEOUT_CELL and aggregation continues.
- If a runtime hook cannot be reached from a CLI executor, the cell is NA with reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Matrix breadth | High | 98 feature x executor cells |
| Runtime risk | Medium | External CLIs and hooks vary by host |
| Code mutation risk | Low | Packet-local research/validation artifacts only |
| Overall | Level 2 | Execution validation with broad evidence, no runtime implementation |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions remain for packet 035. Follow-up scope is captured in the findings ticket table.
<!-- /ANCHOR:questions -->
