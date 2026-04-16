---
title: "Decision Record: Canonical Intake and Middleware Cleanup"
description: "13 ADRs covering the canonical-intake architecture and middleware cleanup: structural parity formula; shared-module extraction; --intake-only flag over separate command; hard-delete over phased stub; intake lock scoping; resume routing; forward-looking sweep policy; complete.md ownership; explicit YAML gate remediation; distributed-governance rule; /memory:save repositioning; :auto-debug flag removal."
trigger_phrases:
  - "decision record"
  - "adr"
  - "structural overlap"
  - "m7 remediation"
  - "canonical intake"
  - "intake contract adr"
  - "middleware cleanup decisions"
  - "distributed governance"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: level_3/decision-record.md | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Rewrote 13 ADRs as cohesive design sequence under canonical-intake framing"
    next_safe_action: "Reference these ADRs when reviewing command-graph architecture"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/references/intake-contract.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/command/spec_kit/resume.md"
    session_dedup:
      fingerprint: "sha256:012-canonical-intake-adr-2026-04-15"
      session_id: "012-canonical-intake-adr-2026-04-15"
      parent_session_id: "012-canonical-intake-m7-m8-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001 (structural overlap formula) preserved verbatim"
      - "Shared-module and standalone-intake decisions documented as ADR-002 through ADR-010"
      - "Middleware cleanup governance decisions documented as ADR-011 through ADR-013"
---
# Decision Record: Canonical Intake and Middleware Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Structural Overlap Formula (M7)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-14 |
| **Deciders** | Codex remediation pass |

### Context

M7 originally measured structural overlap with `diff -u <new> <sibling> | grep -c '^[+-]'` divided by the new-file line count. That formula double-counts change volume because unified diff emits both removals and additions, so new files that differ meaningfully but still follow the same house structure can report negative overlap percentages. That made CHK-040 hard to interpret and blocked remediation evidence from saying anything useful about real parity.

We still needed a lightweight, file-local measurement that fits the packet's verification workflow and does not depend on semantic review tooling. The replacement metric had to stay readable, be reproducible from plain text files, and preserve the distinction between structural similarity and behavior-specific divergence.

### Constraints

- The metric must be computable from repo files without introducing new tooling requirements.
- The packet still needs a comparable measurement across the initial intake command card and both new intake YAML assets.
- The recorded result must explain intentional divergence rather than hiding it.

### Decision

**We chose**: shared-line similarity measured as `common_lines / max(total_lines)` using exact line matches with duplicate counts preserved.

**How it works**: For each new file and its nearest sibling, count the multiset intersection of exact lines, then divide by the larger file's total line count. This removes the negative-percentage failure mode from unified diff while still penalizing files that share only a small structural core.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared-line similarity** | Easy to reproduce, never negative, comparable across Markdown and YAML, keeps exact-line discipline | Still underweights semantic parity when setup variables or step payloads legitimately differ | 8/10 |
| Unified diff additions/removals over new-file size | Already used in packet evidence, cheap to run | Double-counts edits, produces negative overlap, obscures useful interpretation | 3/10 |
| Semantic or AST-aware similarity | Better reflects behavioral parity | Too heavy for packet-local verification and not available uniformly for Markdown + YAML | 6/10 |

**Why this one**: It fixes the broken math without pretending that the intake command surfaces are more similar than they are. It also keeps the evidence transparent for later reviewers.

### Consequences

**What improves**:
- Overlap percentages are readable and reproducible instead of going negative.
- CHK-040 can distinguish "formula was wrong" from "files still diverge materially."

**What it costs**:
- Exact shared-line counts still undersell parity when two files deliberately use different variables or domain-specific prose. Mitigation: keep qualitative parity checks alongside the metric.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Readers treat low percentages as proof of bad structure | M | Pair the metric with key-order, section-order, and step-ID parity checks in checklist evidence |
| Future reviewers reuse the raw number without context | M | Record the formula, measurements, and divergence rationale in this ADR |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | CHK-040 was blocked by a mathematically misleading formula |
| 2 | **Beyond Local Maxima?** | PASS | We compared the current diff formula, a lighter exact-line alternative, and a heavier semantic alternative |
| 3 | **Sufficient?** | PASS | Exact shared-line similarity is enough for packet-local reporting when paired with qualitative parity checks |
| 4 | **Fits Goal?** | PASS | The decision stays inside M7 remediation and does not expand into runtime changes |
| 5 | **Open Horizons?** | PASS | A later packet can still adopt richer structural metrics without invalidating this evidence |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- M7 overlap evidence uses the corrected shared-line similarity metric.
- The remediation report records both the measured percentages and the reason the YAML surfaces remain intentionally low-overlap.

**Measured results**:

| Pair | Common lines | Max total lines | Corrected overlap |
|------|--------------|-----------------|-------------------|
| initial intake command card vs `.opencode/command/spec_kit/deep-research.md` | 159 | 340 | 46.76% |
| initial intake auto YAML vs `spec_kit_deep-research_auto.yaml` | 112 | 722 | 15.51% |
| initial intake confirm YAML vs `spec_kit_deep-research_confirm.yaml` | 145 | 897 | 16.16% |

**Divergence rationale**:
- The initial intake command card matched the sibling command-card skeleton closely after the added `REFERENCE` section, but it owned a different setup contract and output schema than deep research.
- The intake YAMLs intentionally diverged because intake workflows bind folder-state, level recommendation, and manual relationships, while deep-research YAMLs manage iteration loops, locks, convergence, and synthesis. Structural parity was therefore better evidenced by shared top-level key order, required step naming, and vocabulary conventions than by raw shared-line percentage alone.

**Historical note**: The initial intake command card and both paired YAMLs were hard-deleted in M14b when intake logic moved into `intake-contract.md`. These measurements remain as evidence of the M7 structural parity pass.

**How to roll back**: Delete this ADR and restore checklist/task evidence to the earlier diff-based wording if the packet later standardizes on a different structural metric.
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Shared Intake Module Over Inline Duplication

**Status**: Accepted · **Date**: 2026-04-15

### Context

The command-graph had three parallel intake surfaces accumulating drift: a standalone intake command + inline intake blocks in `/spec_kit:plan` + inline intake blocks in `/spec_kit:complete`. Each surface maintained its own copy of the five-state folder classification, four repair-mode branches, staged canonical-trio publication, relationship capture, resume semantics, and intake lock. As each surface evolved independently, the three copies drifted.

### Constraints

- Intake logic must remain accessible for both coupled (with planning) and standalone (intake-only) flows.
- Command cards should stay focused on workflow sequencing rather than intake mechanics.
- Hard-deleting the standalone intake command breaks external invokers; migration path required.

### Decision

**We chose**: Collapse three parallel intake surfaces into one shared reference module; hard-delete the standalone intake command.

**How it works**: Extract full intake contract into `.opencode/skill/system-spec-kit/references/intake-contract.md`. Both `/spec_kit:plan` and `/spec_kit:complete` reference this module in place of inline blocks. A `--intake-only` flag on `/spec_kit:plan` provides standalone intake invocation.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared module + hard delete [Chosen]** | Single source of truth, eliminates drift, cleanest end state | Breaks external invokers (mitigated via changelog) | 9/10 |
| Permanent standalone intake command alias | Zero migration pain | Perpetuates duplicate surface | 4/10 |
| Phased stub deprecation | Gentle migration window | Leaves deprecation artifact; incomplete cleanup | 6/10 |

**Why this one**: User chose atomic hard-delete via explicit AskUserQuestion. Shared-module extraction is the minimum mechanism to preserve both coupled-intake and standalone-intake flows without duplication.

### Consequences

**What improves**:
- Single source of truth for intake contract
- Eliminates drift risk across `plan.md` / `complete.md` / standalone-intake inline copies
- Simplifies command-graph from three intake entry points to one (plus `--intake-only` flag)

**What it costs**:
- External scripts invoking the standalone intake command break. Mitigation: changelog migration note `/spec_kit:start → /spec_kit:plan --intake-only`
- `plan.md` size grows (+~100 LOC of reference). Mitigation: reference-only inclusion; shared module carries detail

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
- Update 26 downstream refs

**How to roll back**: `git revert` the consolidation commits atomically; re-index memory; restore skill registry entry from git history.

---

## ADR-003: Reference-Only Absorption (plan.md Size + Cognitive Overhead Trade-Off)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Extracting intake into a shared module adds reference text to `plan.md` and `complete.md`. Projected `plan.md` size after intake absorption: 550-600 LOC. Question: how much of the intake contract should these command cards embed inline vs reference?

**Decision**: Both `plan.md` and `complete.md` reference `intake-contract.md` via a single pointer; no inline duplication of the five-state list, four repair modes, or publication mechanics.

**Alternatives Considered**:
- Inline duplication in `plan.md` and `complete.md` (rejected — doubles maintenance surface and preserves drift risk)
- `complete.md` calls `/spec_kit:plan --intake-only` (rejected — see ADR-009)

**Why this one**: Shared reference is the industry-standard fix for duplication. Matches user's explicit choice in AskUserQuestion.

**Five Checks**: 5/5 PASS (Necessary, Beyond Local Max, Sufficient, Fits Goal, Open Horizons).

---

## ADR-004: `--intake-only` Flag (Not Separate `/spec_kit:intake` Command)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Users who want standalone intake (create folder, repair metadata, resolve placeholders without planning) need an invocation path.

**Decision**: Add `--intake-only` flag on `/spec_kit:plan`. Halts after Step 1 completes.

**Alternatives Considered**:
- `/spec_kit:intake` as permanent alias (rejected — reintroduces the separate surface we just eliminated)
- No standalone path (rejected — breaks the repair-metadata and placeholder-upgrade use cases)

**Why this one**: Single command surface; flag is discoverable via `--help`; aligns with user's "hard delete" choice — no alias preserved.

**Five Checks**: 5/5 PASS.

---

## ADR-005: Hard Delete (Not Phased Stub Deprecation)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: 30+ downstream references existed. Options ranged from atomic sweep (clean end state, higher risk) to phased stub (gentler, leaves deprecation artifact).

**Decision**: Hard delete `start.md`, both YAML assets, `.gemini/.../start.toml`, skill registry entry in one atomic packet. Update all 26 downstream docs in the same packet.

**Alternatives Considered**:
- Phased stub (15-line redirect + deprecation notice; delete next release) — rejected for leaving artifact and requiring a follow-up packet
- Permanent alias — rejected in ADR-002

**Why this one**: User chose via AskUserQuestion. Zero-artifact end state. Atomic sweep within packet boundary.

**Five Checks**: 5/5 PASS.

---

## ADR-006: Intake Lock Scoped to Step 1 Only

**Status**: Accepted · **Date**: 2026-04-15

**Context**: The initial intake command surface used an intake lock with fail-closed semantics (`Stale or contended intake lock → Fail closed`). After consolidation, `plan.md`'s Step 1 owns intake; Steps 2-8 are planning. The lock must cover Step 1 exclusively.

**Decision**: Shared intake contract specifies lock acquisition at Step 1 entry, release at Step 1 exit (regardless of whether Step 1 was triggered by `--intake-only` or full workflow). Steps 2-8 proceed without the lock.

**Alternatives Considered**:
- Workflow-wide lock — rejected as it blocks concurrent planning on unrelated folders
- No lock — rejected as it allows concurrent trio publication races

**Why this one**: Preserves the initial intake surface's proven fail-closed semantics without overreaching into planning.

**Five Checks**: 5/5 PASS.

---

## ADR-007: `/spec_kit:resume` Routes Intake Re-entry to `/spec_kit:plan --intake-only`

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Sessions may be interrupted mid-intake. Before consolidation, `resume.md` routed to the standalone intake command for `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}`. After the standalone command is deleted, that route must redirect.

**Decision**: Update `resume.md` to route those reentry reasons to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`).

**Alternatives Considered**:
- Dedicated re-entry command — rejected as additional surface
- Route to full `/spec_kit:plan` and let it re-detect — rejected because prefilled state preserves user context

**Why this one**: Single re-entry path; matches shared-module semantics; preserves continuity.

**Five Checks**: 5/5 PASS.

---

## ADR-008: Forward-Looking Sweep Only; Historical Records Preserved

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Grep surfaces references in forward-looking docs (skills, templates, READMEs, install guides, cli-* delegation), CLI routing, skill registry, AND historical docs (changelog entries, older packet internals, scratch).

**Decision**: Split the downstream sweep into forward-looking (authoritative docs like skills, templates, READMEs, install guides, cli-* delegation) and historical (changelog entries, scratch snapshots, older packet internals). Only forward-looking docs are updated; historical records remain as-is.

**Alternatives Considered**:
- Blanket update all references including changelog — rejected because changelog entries are historical records; rewriting them falsifies history
- Update other packets' internals to reflect the consolidation — rejected as those packets are closed records

**Why this one**: Preserves historical record integrity while achieving zero forward-looking refs.

**Five Checks**: 5/5 PASS.

---

## ADR-009: `complete.md` References Shared Module (Not Call-Chain into `/plan`)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: Three options for how `complete.md` handles intake after standalone-command deletion: (a) inline duplicate, (b) extract shared module and reference, (c) call `/spec_kit:plan --intake-only` as a sub-command.

**Decision**: `complete.md` references the shared `intake-contract.md` module directly. It does NOT call `/spec_kit:plan --intake-only`.

**Alternatives Considered**:
- Inline duplicate — rejected per ADR-003
- Call `/spec_kit:plan --intake-only` — rejected because inverted dependency (longer workflow calling shorter) creates brittle coupling

**Why this one**: Shared module is the right abstraction level. Reference-inclusion avoids inter-command coupling. `complete.md` remains self-contained.

**Five Checks**: 5/5 PASS.

---

## ADR-010: Explicit `intake_only` YAML Gate (M15 Remediation)

**Status**: Accepted · **Date**: 2026-04-15

**Context**: M11 implemented the `--intake-only` flag documentation in `plan.md`, but the YAML workflow assets did not contain an explicit gate to halt execution after Step 1. The 10-iteration deep review flagged this as P0 finding **P003-COR-001**: `/spec_kit:plan --intake-only` was documented but not executable; the workflow could fall through into normal planning steps.

**Decision**: Add an explicit `intake_only` gate in both `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` that terminates successfully after the Emit phase and bypasses planning Steps 2-7 when `intake_only == TRUE`.

**Alternatives Considered**:
- Rely on documentation alone (rejected — documented but not executable is broken)
- Replace `--intake-only` with a separate command (rejected — reintroduces the surface ADR-004 eliminated)
- Add runtime assertion that fails after Step 1 (rejected — returns error rather than clean exit)

**Why this one**: Explicit YAML gate matches the flag's documented behavior; clean exit semantics preserved; YAML parity between auto and confirm modes.

**Implementation**: Gate added as `if: intake_only == TRUE then return success after step_emit_trio` in both YAML workflows. Deep-review P003-COR-001 verified FIXED post-remediation.

**Five Checks**: 5/5 PASS.

---

## ADR-011: Distributed-Governance Rule Over `@speckit` Exclusivity (M9)

**Status**: Accepted · **Date**: 2026-04-14

**Context**: Before M9, the `@speckit` agent held exclusive write access for all spec-folder `*.md` files. After M9 identified `@speckit` + `@handover` + `/spec_kit:handover` + `/spec_kit:debug` as redundant middleware (v3.4.0.0 moved continuity into canonical docs and introduced `/memory:save`), the exclusivity rule needed replacement.

**Decision**: Replace `@speckit` exclusivity with a distributed-governance rule across `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, and `.opencode/skill/system-spec-kit/SKILL.md`:

> "Any agent writing spec folder docs MUST use templates from `.opencode/skill/system-spec-kit/templates/level_N/`, run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [spec_folder] --strict` after each file write, and route continuity updates through `/memory:save`. `@deep-research` retains exclusive write access for `research/research.md`. `@debug` retains exclusive write access for `.opencode/skill/system-spec-kit/templates/debug-delegation.md`."

**Alternatives Considered**:
- Keep `@speckit` exclusivity (rejected — accepts middleware bloat)
- Delete `@speckit` without replacement rule (rejected — quality-gate regression risk)
- Create `@spec-master` as slim replacement (deferred as fallback if distributed-governance fails in practice)

**Why this one**: Replaces agent-exclusivity with template-driven + validator-enforced governance. Distributed responsibility across all agents with template reuse + `validate.sh --strict` as quality gate. Preserves `@deep-research` and `@debug` file-specific exclusivity.

**Five Checks**: 5/5 PASS.

---

## ADR-012: `/memory:save` as Canonical Packet Handover Maintainer (M9)

**Status**: Accepted · **Date**: 2026-04-14

**Context**: Before M9, `/spec_kit:handover` was the canonical command for authoring packet handover documents. M9 identified this as redundant after `/memory:save` content router introduced `handover_state` routing category.

**Decision**: Reposition `/memory:save` as the canonical packet handover maintainer via `handover_state` routing. Insert §1 "Handover Document Maintenance" subsection in `.opencode/command/memory/save.md` positioning `/memory:save` as the packet handover maintainer. Update `handover_state` contract row to reference the handover template path for initial creation. Delete `/spec_kit:handover` command + YAML assets + runtime mirrors.

**Alternatives Considered**:
- Keep `/spec_kit:handover` (rejected — redundant wrapper)
- Delete without repositioning `/memory:save` (rejected — loses canonical ownership)
- Auto-initialize 7-section packet handover template inside `/memory:save` handler (deferred to follow-on packet)

**Why this one**: Single canonical command for continuity + handover maintenance. Template + routing-prototype infrastructure preserved.

**Trade-off accepted**: Full 7-section packet handover regeneration is no longer available as a single command. `/memory:save` maintains the `session-log` anchor; stop hook auto-saves continuity; follow-on packet may enhance the `/memory:save` handler to auto-initialize the full template.

**Five Checks**: 5/5 PASS.

---

## ADR-013: `:auto-debug` Flag Removal and Explicit User Escalation Path (M9)

**Status**: Accepted · **Date**: 2026-04-14

**Context**: `/spec_kit:complete` carried an `:auto-debug` flag that auto-escalated to the `@debug` agent at 3+ failures. After `@debug` transitioned to Task-tool dispatch (no longer a LEAF orchestrator-invoked agent), the auto-escalation path became inconsistent with the runtime model.

**Decision**: Remove the `:auto-debug` flag from `/spec_kit:complete`. Replace with an explicit user-escalation path: when `failure_count >= 3`, surface a diagnostic summary and recommend the user dispatch `@debug` via Task tool manually.

**Alternatives Considered**:
- Keep `:auto-debug` with Task-tool dispatch under the hood (rejected — hidden dispatch violates the explicit-agent-routing principle)
- Remove the 3-failure escalation entirely (rejected — loses recovery signal)

**Why this one**: Explicit user escalation preserves the recovery signal while keeping agent dispatch explicit and user-controlled. `@debug` remains available via Task tool for deliberate debugging passes.

**Trade-off accepted**: Users who relied on auto-escalation now receive an escalation prompt instead of automatic dispatch. Silent auto-dispatch is no longer possible.

**Five Checks**: 5/5 PASS.

---

<!--
Decision Record — 13 ADRs covering the full canonical-intake architecture:
- ADR-001: Structural overlap formula (M7 remediation)
- ADR-002 through ADR-009: Shared-module architecture decisions (shared module, --intake-only, hard delete, resume routing, lock scoping, sweep policy, complete.md ownership, reference-only absorption)
- ADR-010: M15 deep-review remediation (explicit intake_only YAML gate)
- ADR-011: M9 distributed-governance rule
- ADR-012: M9 /memory:save repositioning
- ADR-013: M9 :auto-debug flag removal
ADR-001 and ADR-002 carry full template structure; ADR-003 through ADR-013 use compressed format for decision traceability.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
