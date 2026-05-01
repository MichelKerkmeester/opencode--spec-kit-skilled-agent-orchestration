---
title: "Decision Record: deferred-followups [template:level_3/decision-record.md]"
description: "Policy decisions for the ten Gate 7 deferred followups."
trigger_phrases:
  - "deferred followups decisions"
  - "validation orchestrator ADR"
  - "exit code taxonomy ADR"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "scaffold/004-deferred-followups"
    last_updated_at: "2026-05-01T20:32:55Z"
    last_updated_by: "codex"
    recent_action: "Authored ADRs"
    next_safe_action: "Verify packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-deferred-followups"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: deferred-followups

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Validation orchestrator architecture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

Validation launched Node repeatedly for registry and TS rule work. The P1 item needs hot-path batching without deleting existing shell rule compatibility.

### Constraints

- Keep `validate.sh` as the stable caller-facing entrypoint.
- Preserve strict validation semantics for existing packet workflows.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a single Node process that loads the manifest, rule metadata, template contracts, and TS validation rules once per folder.

**How it works**: `validate.sh` delegates to `mcp_server/lib/validation/orchestrator.ts`. The orchestrator returns a `ValidationReport` and `validate.sh` keeps the legacy shell runner behind `SPECKIT_VALIDATE_LEGACY=1`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Single Node process** | Maximum startup reduction; one manifest load | Needs JS coverage for shell-era rules | 9/10 |
| Batched per-folder shell runner | Lower rewrite risk | Still pays repeated helper costs | 6/10 |
| Shared registry cache only | Smallest change | Does not solve TS rule startups | 4/10 |

**Why this one**: The P1 value is performance. The single process removes the startup pattern that caused the deferred item.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Fresh Level 3 validation runs in a small fraction of the previous wall-clock time.
- TS spec-doc rules execute in-process.

**What it costs**:
- The orchestrator must track core validation behavior. Mitigation: keep legacy mode as an escape hatch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Behavior drift from shell rules | M | Keep focused tests and legacy fallback |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | DEFER-G7-01 is P1 |
| 2 | **Beyond Local Maxima?** | PASS | Three architectures compared |
| 3 | **Sufficient?** | PASS | Maintains `validate.sh` entrypoint |
| 4 | **Fits Goal?** | PASS | Directly targets validation wall-clock |
| 5 | **Open Horizons?** | PASS | Gives TS validation a central API |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add `mcp_server/lib/validation/orchestrator.ts`.
- Export `validateFolder` from the public API barrel.
- Route `validate.sh` to the orchestrator by default.

**How to roll back**: Set `SPECKIT_VALIDATE_LEGACY=1` or revert the `validate.sh` delegation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: `parent_session_id` semantics

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | Codex |

### Context

Historical packets may omit session lineage or use `parent_session_id: null`. A strict existence requirement would break backward compatibility.

### Decision

Use lenient semantics. `parent_session_id: null` is valid, and a non-null value that cannot be found emits warning code `SESSION_LINEAGE_BROKEN`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Strict fail | Strongest integrity | Breaks legacy packets | 4/10 |
| **Lenient warn** | Compatible and visible | Does not block bad lineage | 9/10 |

### Consequences

Legacy packets continue to validate. Broken lineage is visible without turning old docs into blockers.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | DEFER-G7-09 |
| 2 | Beyond Local Maxima? | PASS | Strict and lenient compared |
| 3 | Sufficient? | PASS | Warning code is explicit |
| 4 | Fits Goal? | PASS | Preserves validation compatibility |
| 5 | Open Horizons? | PASS | Can be tightened later by severity config |

### Implementation

Add lineage warning emission to `spec-doc-structure.ts` and orchestrator validation.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Exit-code taxonomy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | Codex |

### Context

Script callers need to distinguish bad user input, actual validation failure, and system/runtime failures.

### Decision

Use `0 = success`, `1 = user error`, `2 = validation error`, and `3 = system error` across `create.sh`, `validate.sh`, and resolver wrappers.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Existing mixed codes | No change | Ambiguous automation | 3/10 |
| **Four-code taxonomy** | Clear caller contract | Needs documentation | 9/10 |

### Consequences

Automation can branch on failure type. Warning-only validation no longer consumes the user-error code.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | DEFER-G7-10 |
| 2 | Beyond Local Maxima? | PASS | Existing behavior compared |
| 3 | Sufficient? | PASS | Four codes cover the needed classes |
| 4 | Fits Goal? | PASS | Direct CLI contract fix |
| 5 | Open Horizons? | PASS | Compatible with shell and Node callers |

### Implementation

Update validation exits and document the taxonomy in `SKILL.md`.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Manifest version source-of-truth

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | Codex |

### Context

Template version checks previously inferred current version from rendered template text. That makes version policy implicit and brittle.

### Decision

Store template versions in `spec-kit-docs.json.versions[<basename>]`. The resolver exposes `templateVersions`, and staleness checks read the manifest map.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Grep rendered template | Simple | Implicit and fragile | 4/10 |
| **Manifest versions map** | Explicit and testable | Requires schema expansion | 9/10 |

### Consequences

Version ownership becomes manifest-backed and easier to extend for new document types.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | DEFER-G7-07 |
| 2 | Beyond Local Maxima? | PASS | Source choices compared |
| 3 | Sufficient? | PASS | Resolver and staleness consume it |
| 4 | Fits Goal? | PASS | Direct manifest policy fix |
| 5 | Open Horizons? | PASS | Supports new document types |

### Implementation

Add `versions` to the manifest and expose it in `LevelContract`.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Frontmatter migration policy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | Codex |

### Context

Legacy packets may carry v2.1 `SPECKIT_TEMPLATE_SOURCE` markers and broad document lists derived from files rather than manifest metadata.

### Decision

Support legacy v2.1 markers indefinitely in read paths. Writers always emit v2.2 or newer from manifest versions.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Sunset legacy markers | Cleaner future state | Breaks historical packets | 5/10 |
| **Indefinite read support** | Durable compatibility | Requires parser tolerance | 9/10 |

### Consequences

Old packets remain readable, while new packets use the current manifest contract.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | DEFER-G7-05 |
| 2 | Beyond Local Maxima? | PASS | Sunset and indefinite policies compared |
| 3 | Sufficient? | PASS | Read/write split is explicit |
| 4 | Fits Goal? | PASS | Migration compatibility is the point |
| 5 | Open Horizons? | PASS | New docs can still version forward |

### Implementation

Document the policy in `MIGRATION.md` and extension docs.
<!-- /ANCHOR:adr-005 -->
