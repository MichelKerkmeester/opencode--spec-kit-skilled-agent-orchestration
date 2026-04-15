---
title: "Decision Record: Start-into-Plan Merger"
description: "Nine ADRs covering supersession of 012's design, shared-module extraction, intake-only flag, hard delete strategy, resume routing, lock scoping, supersedes declaration, M5 split, complete.md ownership."
trigger_phrases:
  - "start into plan adr"
  - "merger decisions"
  - "supersedes 012"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-start-into-plan-merger"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Authored nine ADRs with Five Checks and alternatives rejected"
    next_safe_action: "Review ADRs with user before implementation begins"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:pending-first-implementation-run"
      session_id: "plan-authoring-2026-04-15"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Start-into-Plan Merger

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Supersede 012's "intake ≠ planning" separation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | User, claude-opus-4-6 |

### Context

Packet 012 (closed 2026-04-14) introduced `/spec_kit:start` as a separate canonical intake surface AND embedded inline `/start` absorption in `/spec_kit:plan` and `/spec_kit:complete`. The inline-absorption model proved complete — every invocation path already flows through plan or complete. The standalone `/spec_kit:start` command is vestigial, maintaining a third parallel copy of the same intake contract that drifts as each surface evolves independently.

### Constraints

- 012 is closed; its canonical docs are immutable records
- Hard-deleting `/spec_kit:start` breaks external invokers; migration path required
- Intake logic must remain accessible for both coupled (with planning) and standalone (intake-only) flows

### Decision

**We chose**: Collapse three parallel intake surfaces into one shared reference module; hard-delete the standalone `/spec_kit:start` command.

**How it works**: Extract full intake contract into `.opencode/skill/system-spec-kit/references/intake-contract.md`. Both `/spec_kit:plan` and `/spec_kit:complete` reference this module in place of inline blocks. A `--intake-only` flag on `/spec_kit:plan` provides standalone intake invocation. Supersession relationship declared in 015's `graph-metadata.json`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared module + hard delete [Chosen]** | Single source of truth, eliminates drift, cleanest end state | Breaks external invokers (mitigated via changelog) | 9/10 |
| Permanent `/spec_kit:start` alias | Zero migration pain | Perpetuates duplicate surface | 4/10 |
| Phased stub deprecation | Gentle migration window | Leaves deprecation artifact; incomplete cleanup | 6/10 |

**Why this one**: User chose atomic hard-delete via explicit AskUserQuestion. Shared-module extraction is the minimum mechanism to preserve both coupled-intake and standalone-intake flows without duplication.

### Consequences

**What improves**:
- Single source of truth for intake contract
- Eliminates drift risk across plan.md / complete.md / start.md inline copies
- Simplifies command-graph from three intake entry points to one (plus `--intake-only` flag)

**What it costs**:
- External scripts invoking `/spec_kit:start` break. Mitigation: changelog migration note `/spec_kit:start → /spec_kit:plan --intake-only`
- plan.md size grows (+~100 LOC of reference). Mitigation: reference-only inclusion; shared module carries detail

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| External invokers break silently | M | Explicit "command not found" from harness + changelog migration note |
| Atomic sweep misses a downstream ref | H | M0 audit + M5 closure grep (CHK-034) |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three parallel surfaces drift-risk real; every delay accumulates new refs |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives considered; user chose explicitly |
| 3 | **Sufficient?** | PASS | Shared module + flag is minimum to eliminate duplication |
| 4 | **Fits Goal?** | PASS | 026 parent is graph-optimization; this simplifies the graph |
| 5 | **Open Horizons?** | PASS | Shared-module pattern reusable for future command consolidations |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Create `.opencode/skill/system-spec-kit/references/intake-contract.md`
- Modify `plan.md`, `complete.md`, `resume.md` to reference shared module
- Delete `start.md`, 2 YAML assets, `.gemini/commands/spec_kit/start.toml`, skill registry entry
- Update 28 downstream refs

**How to roll back**: `git revert` the merger commits atomically; re-index memory for 012 and 015; restore skill registry entry from git history.
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Extract shared intake module (not inline duplication)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: 012 already has duplication between plan.md and complete.md inline intake blocks. Continuing the inline-duplication pattern after `/start` deletion would leave two parallel copies of the contract maintained by hand.

**Decision**: Extract a single canonical intake contract at `.opencode/skill/system-spec-kit/references/intake-contract.md`. Both plan.md and complete.md reference it.

**Alternatives Considered**:
- Inline duplication in plan.md and complete.md (rejected — doubles maintenance surface and preserves drift risk)
- `complete.md` calls `/spec_kit:plan --intake-only` (rejected — see ADR-009)

**Why this one**: Shared reference is the industry-standard fix for duplication. Matches user's explicit choice in AskUserQuestion.

**Five Checks**: 5/5 PASS (Necessary, Beyond Local Max, Sufficient, Fits Goal, Open Horizons).

---

## ADR-003: `--intake-only` flag (not separate `/spec_kit:intake` command)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Users who want standalone intake (create folder, repair metadata, resolve placeholders without planning) need an invocation path.

**Decision**: Add `--intake-only` flag on `/spec_kit:plan`. Halts after Step 1 completes.

**Alternatives Considered**:
- `/spec_kit:intake` as permanent alias (rejected — reintroduces the separate surface we just eliminated)
- No standalone path (rejected — breaks the repair-metadata and placeholder-upgrade use cases)

**Why this one**: Single command surface; flag is discoverable via `--help`; aligns with user's "hard delete" choice — no alias preserved.

**Five Checks**: 5/5 PASS.

---

## ADR-004: Hard delete (not phased stub deprecation)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: 30+ downstream references exist. Options range from atomic sweep (clean end state, higher risk) to phased stub (gentler, leaves deprecation artifact).

**Decision**: Hard delete `start.md`, both YAML assets, `.gemini/.../start.toml`, skill registry entry in one atomic packet. Update all 28 downstream docs in the same packet.

**Alternatives Considered**:
- Phased stub (15-line redirect + deprecation notice; delete next release) — rejected for leaving artifact and requiring a follow-up packet
- Permanent alias — rejected in ADR-001

**Why this one**: User chose via AskUserQuestion. Zero-artifact end state. Atomic sweep within packet 015 boundary.

**Five Checks**: 5/5 PASS.

---

## ADR-005: `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only`

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Sessions may be interrupted mid-intake. Today `resume.md` routes to `/spec_kit:start` for `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}`. After merger, that route must redirect.

**Decision**: Update resume.md to route those reentry reasons to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`).

**Alternatives Considered**:
- Dedicated re-entry command — rejected as additional surface
- Route to full `/spec_kit:plan` and let it re-detect — rejected because prefilled state preserves user context

**Why this one**: Single re-entry path; matches shared-module semantics; preserves continuity.

**Five Checks**: 5/5 PASS.

---

## ADR-006: Intake lock scoped to Step 1 only

**Status**: Accepted · **Date**: 2026-04-15

**Context**: `start.md` today uses an intake lock with fail-closed semantics (`Stale or contended intake lock → Fail closed`). After merger, plan.md's Step 1 owns intake; Steps 2–8 are planning. The lock must cover Step 1 exclusively.

**Decision**: Shared intake contract specifies lock acquisition at Step 1 entry, release at Step 1 exit (regardless of whether Step 1 was triggered by `--intake-only` or full workflow). Steps 2–8 proceed without the lock.

**Alternatives Considered**:
- Workflow-wide lock — rejected as it blocks concurrent planning on unrelated folders
- No lock — rejected as it allows concurrent trio publication races

**Why this one**: Preserves `start.md`'s proven fail-closed semantics without overreaching into planning.

**Five Checks**: 5/5 PASS.

---

## ADR-007: Supersedes relationship declared at successor only

**Status**: Accepted · **Date**: 2026-04-15

**Context**: 015 supersedes 012's "intake ≠ planning" design decision. Where should the supersession relationship be recorded?

**Decision**: Record `manual.supersedes = [{packet_id: "012-spec-kit-commands", reason: "Collapsed separate-/start architecture into shared intake contract"}]` in 015's `graph-metadata.json`. Do NOT mutate 012's internals.

**Alternatives Considered**:
- Update 012's canonical docs with supersession note — rejected as it violates closed-packet immutability
- Add addendum to 012 — rejected as addendums extend, they don't supersede

**Why this one**: Closed packets are immutable records; supersession is a forward-looking relationship declared at the successor. Matches system-spec-kit convention.

**Five Checks**: 5/5 PASS.

---

## ADR-008: M5 split into M5a (forward-looking) and M5b (skip historical)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Grep surfaces references in forward-looking docs (skills, templates, READMEs, install guides, cli-* delegation), CLI routing, skill registry, AND historical docs (changelog entries, closed packet 012 internals).

**Decision**: Split M5 into M5a (update authoritative forward-looking docs) and M5b (skip historical records — changelog entries and closed packet 012 internals remain as-is).

**Alternatives Considered**:
- Blanket update all references including changelog — rejected because changelog entries are historical records; rewriting them falsifies history
- Update 012 internals to reflect supersession — rejected per ADR-007

**Why this one**: Preserves historical record integrity while achieving zero forward-looking refs.

**Five Checks**: 5/5 PASS.

---

## ADR-009: `complete.md` references shared module (not call-chain into `/plan`)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Three options for how complete.md handles intake after `/start` deletion: (a) inline duplicate, (b) extract shared module and reference, (c) call `/spec_kit:plan --intake-only` as a sub-command.

**Decision**: complete.md references the shared intake-contract.md module directly. It does NOT call `/spec_kit:plan --intake-only`.

**Alternatives Considered**:
- Inline duplicate — rejected per ADR-002
- Call `/spec_kit:plan --intake-only` — rejected because inverted dependency (longer workflow calling shorter) creates brittle coupling

**Why this one**: Shared module is the right abstraction level. Reference-inclusion avoids inter-command coupling. complete.md remains self-contained.

**Five Checks**: 5/5 PASS.

---

<!--
Level 3 Decision Record: nine ADRs covering the full architectural supersession.
ADR-001 carries full template structure (Alternatives table, Five Checks, Implementation, Rollback).
ADR-002 through ADR-009 use compressed format — sufficient for Level 3 decision traceability while avoiding repetition.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
