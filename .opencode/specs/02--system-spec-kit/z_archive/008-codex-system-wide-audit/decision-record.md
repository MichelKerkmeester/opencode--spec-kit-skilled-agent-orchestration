---
title: "Decision Record: System-Wide Remediation [125-codex-system-wide-audit/decision-record]"
description: "The previous spec 125 documents mixed accurate findings with stale claims (for example, declaring completion while open P0 work remained). This made the folder unreliable as a w..."
trigger_phrases:
  - "decision"
  - "record"
  - "system"
  - "wide"
  - "remediation"
  - "decision record"
  - "125"
  - "codex"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: System-Wide Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 (refactored) -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Re-Baseline Spec 125 as Remediation Source of Truth

<!-- ANCHOR:adr-005-context -->
### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-02-16 |
| Deciders | User, @codex |
| Supersedes | Prior stale completion/orphan assumptions in spec 125 docs |

### Context

The previous spec 125 documents mixed accurate findings with stale claims (for example, declaring completion while open P0 work remained). This made the folder unreliable as a working contract.

<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-decision -->
### Decision

Spec 125 is re-authored as a remediation tracker anchored to confirmed findings and explicit verification gates.

<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-consequences -->
### Consequences

Positive:
- One authoritative backlog for both documentation and runtime defects.
- Lower risk of false-green completion signals.

Negative:
- Previous narrative history is compressed into updated ADR decisions.

<!-- /ANCHOR:adr-005-consequences -->

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Canonical Contracts for Exit Codes, Backup Model, and Status Claims

<!-- ANCHOR:adr-006-context -->
### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-02-16 |
| Deciders | User, @codex |
| Supersedes | Conflicting contract statements across spec/plan/checklist |

### Context

Three contract drifts were repeatedly observed:
1. Exit-code expectations differed across docs.
2. Backup semantics were described inconsistently.
3. Completion status was marked complete with open P0 items.

<!-- /ANCHOR:adr-006-context -->

<!-- ANCHOR:adr-006-decision -->
### Decision

Adopt and enforce these canonical contracts:

1. **Exit codes for `upgrade-level.sh`**
   - `0`: success
   - `1`: validation/dependency error
   - `2`: upgrade execution error
   - `3`: backup/restore error

2. **Backup model**
   - backup artifact is `.backup-<timestamp>/` directory,
   - preserve relative markdown paths under spec folder,
   - rollback behavior must be atomic and non-silent on failure.

3. **Status discipline**
   - no root doc may claim "complete" while any P0 task/checklist item is open.

<!-- /ANCHOR:adr-006-decision -->

<!-- ANCHOR:adr-006-consequences -->
### Consequences

Positive:
- Reduces operator confusion and tool-contract mismatch.
- Makes checklist gating enforceable.

Negative:
- Existing docs/tests need updates to align with these contracts.

<!-- /ANCHOR:adr-006-consequences -->

<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Remediation Execution Order

<!-- ANCHOR:adr-007-context -->
### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-02-16 |
| Deciders | User, @codex |

### Context

Fixes span docs, shell scripts, registry behavior, and MCP TypeScript handlers. Applying changes out of order can reintroduce drift.

<!-- /ANCHOR:adr-007-context -->

<!-- ANCHOR:adr-007-decision -->
### Decision

Execution order is locked to:
1. Documentation re-baseline,
2. shell runtime safety,
3. parser/registry parity,
4. MCP runtime correctness,
5. verification and closure.

<!-- /ANCHOR:adr-007-decision -->

<!-- ANCHOR:adr-007-consequences -->
### Consequences

Positive:
- Contracts are clear before code changes start.
- Verification is mapped before implementation churn.

Negative:
- Slightly slower initial momentum due to documentation-first pass.

<!-- /ANCHOR:adr-007-consequences -->

<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: DB-Unavailable Dedup Behavior Must Be Explicit

<!-- ANCHOR:adr-008-context -->
### Metadata

| Field | Value |
|-------|-------|
| Status | Proposed |
| Date | 2026-02-16 |
| Deciders | User (pending), @codex |

### Context

`session-manager.ts` currently allows memory sends when DB is unavailable, which bypasses dedup and can increase repeated memory emission. This behavior exists but is not an explicit product decision.

<!-- /ANCHOR:adr-008-context -->

### Options

| Option | Description | Tradeoff |
|--------|-------------|----------|
| A | Fail-open (current) with explicit degraded flag in response/logs | Higher duplicate risk, lower drop risk |
| B | Fail-closed when dedup DB unavailable | Lower duplicate risk, higher omission risk |
| C | Configurable mode with safe default + explicit telemetry | More robust, slightly higher implementation complexity |

<!-- ANCHOR:adr-008-decision -->
### Proposed Direction

Adopt Option C with explicit configuration and test coverage.

<!-- /ANCHOR:adr-008-decision -->

### Pending Decision

User confirmation needed on default mode (`fail-open` or `fail-closed`) when no explicit config is provided.

<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Remove Non-Executable Snippets from Shell Command Blocks

<!-- ANCHOR:adr-009-context -->
### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-02-16 |
| Deciders | @codex |

### Context

Audit memory docs included pseudo-tool invocations inside fenced `bash` blocks, causing copy/paste execution failures.

<!-- /ANCHOR:adr-009-context -->

<!-- ANCHOR:adr-009-decision -->
### Decision

Any non-shell snippet must be labeled as pseudo/API example and must not be presented inside `bash` fences.

<!-- /ANCHOR:adr-009-decision -->

<!-- ANCHOR:adr-009-consequences -->
### Consequences

Positive:
- Fewer operator errors during recovery/debugging.

Negative:
- Existing memory docs may require cleanup in follow-up maintenance tasks.

<!-- /ANCHOR:adr-009-consequences -->

<!-- /ANCHOR:adr-009 -->

---

## Current ADR Status Snapshot

| ADR | Status |
|-----|--------|
| ADR-005 | Accepted |
| ADR-006 | Accepted |
| ADR-007 | Accepted |
| ADR-008 | Proposed (user default-mode decision pending) |
| ADR-009 | Accepted |
