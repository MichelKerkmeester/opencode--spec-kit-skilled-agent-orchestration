---
title: "Decision Record: Wave Executor [042.003]"
description: "Accepted architecture decision for orchestrator-managed wave execution in deep research and deep review."
trigger_phrases:
  - "042.003"
  - "decision record"
  - "wave executor"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep parallelism at the orchestrator layer with a reducer-owned execution ledger

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet 042 closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a way to handle very large review and research targets without asking the deep-loop worker agents to become managers of their own child fleets. The current YAML workflow engine also has no native fan-out/join support, so any wave model had to prove a safe orchestration path before it could be treated as buildable. Once segments exist, merge behavior also has to preserve lineage, conflicts, and dedupe state without trusting append order or human-maintained notes.

### Constraints

- LEAF agents had to stay non-spawning workers.
- Sequential mode had to remain the default path for ordinary targets.
- Packet-local traceability had to survive retries, resume, and repeated merges.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep parallelism at the orchestrator layer, require a proven fan-out/join path before wave-mode runtime wiring proceeds, and make `board.json` the reducer-owned execution ledger for keyed merge behavior.

**How it works**: Shared lifecycle helpers own segmentation, dispatch, prune/promote decisions, join behavior, and merge. Research and review workers remain focused on their local segment work, while the reducer-owned board tracks segment status, promoted findings, dedupe markers, and conflicts and the human-facing dashboard remains a derived render.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Orchestrator-managed waves with a reducer-owned board and keyed merge** | Keeps worker responsibilities clean, preserves lineage, and stays auditable under retries | Requires explicit orchestration helpers and prerequisite proof work | 9/10 |
| Let LEAF workers spawn child agents | Flexible in theory | Breaks the product contract and makes packet lineage much harder to audit | 3/10 |
| Keep large targets strictly sequential | Simplest execution model | Fails the scale problem this phase exists to solve | 5/10 |

**Why this one**: It solves the scale problem while staying closest to the repo's existing architectural boundaries and preserving deterministic merge behavior.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Wave execution gains a clear lifecycle owner and prerequisite proof path.
- Merge behavior stays deterministic and explainable through explicit keys and reducer-owned state.
- Resume logic can target incomplete segment work without corrupting previously merged lineage.

**What it costs**:
- The orchestration layer becomes a new shared runtime surface. Mitigation: keep it explicit, tested, and phase-scoped.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fan-out/join proof is weaker than expected | H | Treat proof work as the first blocker before lifecycle integration |
| Wave mode leaks into small-target defaults | M | Gate activation behind explicit large-target criteria |
| Conflict state is flattened during merge | H | Keep conflict and dedupe metadata on the board and in merged outputs |
| Derived reporting is mistaken for canonical state | M | Use "derived dashboard render" language consistently across the phase docs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Large-target sequential execution was the explicit problem to solve |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives include worker-spawning, sequential-only, and explicit keyed orchestration |
| 3 | **Sufficient?** | PASS | Shared orchestration plus a reducer-owned board is enough without changing worker identity |
| 4 | **Fits Goal?** | PASS | The decision stays inside the phase scope and handoff goals |
| 5 | **Open Horizons?** | PASS | Later replay and optimizer work can consume stable wave traces without redesigning workers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add wave planner, lifecycle, convergence, segment-state, and coordination-board helpers
- Keep command/workflow docs explicit about the fan-out/join prerequisite and activation gates
- Update docs and workflows so merge, prune, promote, and resume use the keyed lineage contract

**How to roll back**: Disable wave-mode routing, keep segment helpers unused, preserve board artifacts for debugging, and return to sequential packet execution without mutating canonical single-stream state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
