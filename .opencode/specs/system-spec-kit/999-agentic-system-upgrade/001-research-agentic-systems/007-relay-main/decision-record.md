---
title: "Decision Record: 007-relay-main Research Phase"
description: "Records the scope, boundary, and synthesis decisions that governed the Agent Relay phase."
trigger_phrases:
  - "007-relay-main decision record"
  - "relay main adr"
  - "agent relay research decisions"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: 007-relay-main Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Preserve the transport-first boundary and reject broker replacement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Codex |

### Context

Relay includes orchestration-flavored workflow helpers, but this phase exists to study realtime transport and related ergonomics, not to collapse phase 002 into phase 007. Public already has a stronger deterministic control plane than Relay.

### Constraints

- Phase 002 owns deterministic orchestration, replay, and enforcement
- User requested phase-folder-only writes and no sub-agents

### Decision

**We chose**: Keep the transport-first interpretation of Relay and reject any recommendation that replaces Public's Task-tool orchestrator with a Relay-style broker.

**How it works**: The final report records broker replacement as `R-001` and treats transport concepts as selective borrowings only.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Transport-first boundary** | Preserves phase ownership and reduces churn | Leaves some Relay workflow ideas on the table | 9/10 |
| Broker replacement | Dramatic simplification in theory | Duplicates Public's strengths and blurs architecture boundaries | 2/10 |

**Why this one**: It matches the phase prompt and the code evidence.

### Consequences

**What improves**:
- Recommendations stay phase-correct
- Follow-on work can target gaps without destabilizing the control plane

**What it costs**:
- Some attractive Relay workflow patterns must be adapted indirectly. Mitigation: record them as internal refactors rather than product pivots.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The prompt explicitly protects phase 002 ownership |
| 2 | **Beyond Local Maxima?** | PASS | Replacement was considered and rejected with evidence |
| 3 | **Sufficient?** | PASS | Selective borrowing still captures the valuable transport ideas |
| 4 | **Fits Goal?** | PASS | Keeps phase 007 focused on communication ergonomics |
| 5 | **Open Horizons?** | PASS | Leaves room for bounded prototypes later |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Final report includes an explicit rejected recommendation
- Architecture spike suggestions avoid broker replacement

**How to roll back**: Open a separate architecture packet if future evidence truly challenges the boundary.
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Expand Phase 2 beyond feature adoption into architecture critique

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Codex |

### Context

Phase 1 mostly asked "what should Public adopt from Relay?" The user explicitly expanded Phase 2 to also ask whether some Public subsystems are fundamentally overcomplicated, poorly factored, or solving the wrong problem.

### Constraints

- At least 4 of the 10 new iterations must address refactor, pivot, simplification, architecture, or UX questions
- Findings still need concrete evidence and concrete Public targets

### Decision

**We chose**: Use Phase 2 to test Public's current architecture against Relay's simpler patterns, not just to collect more adoption ideas.

**How it works**: Iterations `011-020` include explicit `Refactor / Pivot Analysis` sections and the merged report adds a dedicated refactor/pivot recommendations section.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Architecture critique expansion** | Produces higher-value system judgments | Harder synthesis, more non-goals to explain | 9/10 |
| More adoption-only iterations | Easier to write | Repeats Phase 1 and misses the user's expanded scope | 3/10 |

**Why this one**: It matches the explicit Phase 2 ask and produced the strongest new signals.

### Consequences

**What improves**:
- The packet now identifies simplification and non-goal boundaries, not just features to copy
- Follow-on work can prioritize low-regret contract changes before larger architectural bets

**What it costs**:
- Some iterations conclude `KEEP` or `rejected` instead of adding new adopt-now work. Mitigation: keep those rejections explicit and valuable.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required by the user's Phase 2 expansion |
| 2 | **Beyond Local Maxima?** | PASS | Forces comparison beyond feature mimicry |
| 3 | **Sufficient?** | PASS | Still grounded in exact external/Public evidence |
| 4 | **Fits Goal?** | PASS | Produces clearer prioritization for follow-on packets |
| 5 | **Open Horizons?** | PASS | Leaves room for both doc work and architecture spikes |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Phase 2 iterations carry verdicts: REFACTOR, PIVOT, SIMPLIFY, or KEEP
- The merged report groups adopt-now work, architecture spikes, and explicit rejections

**How to roll back**: N/A. This is a research-method choice, not a runtime change.
---

### ADR-003: Repair the packet to a valid Level 3 baseline as part of closeout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Codex |

### Context

Strict validation showed the phase packet was missing `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`, and `phase-research-prompt.md` still contained bare markdown references that no longer resolved packet-locally.

### Constraints

- User asked to proceed directly within this phase folder
- All writes must stay inside the phase packet

### Decision

**We chose**: Restore the missing Level 3 docs and repair the packet-local prompt references in the same turn rather than leaving a structurally broken research packet behind.

**How it works**: The missing docs are now present, and the prompt points to `external/...` markdown paths where appropriate.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Repair the packet now** | Produces a valid, continue-ready packet | Slightly expands work beyond research-only artifacts | 8/10 |
| Report validation failure only | Smaller scope | Leaves a broken packet in place | 2/10 |

**Why this one**: It keeps the phase self-consistent and satisfies the validator without leaving obvious debt behind.

### Consequences

**What improves**:
- The packet is structurally valid and easier to continue later
- Packet-local references now resolve correctly

**What it costs**:
- Extra markdown authoring work in the closeout turn. Mitigation: keep doc content phase-specific and concise.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Strict validation failed without these docs |
| 2 | **Beyond Local Maxima?** | PASS | Fixes the actual packet defect, not just symptoms |
| 3 | **Sufficient?** | PASS | Required files plus prompt-link repair address the validator findings |
| 4 | **Fits Goal?** | PASS | Produces a valid research packet |
| 5 | **Open Horizons?** | PASS | Future turns can continue from a clean baseline |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Adds the missing Level 3 packet docs
- Updates `phase-research-prompt.md` packet-local markdown references

**How to roll back**: Delete or revise only the phase-local doc repairs if a later maintainer wants a different packet shape.
