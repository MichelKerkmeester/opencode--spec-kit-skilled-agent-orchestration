---
title: ".../007-deep-review-remediation/005-006-campaign-findings-remediation/002-spec-structure-and-validation/decision-record]"
description: "ADR for 002-spec-structure-and-validation Spec Structure and Validation Remediation."
trigger_phrases:
  - "decision record 002 spec structure and validation spec structure and val"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/002-spec-structure-and-validation"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded remediation blocker"
    next_safe_action: "Resolve source packet docs"
    completion_pct: 20
---
# Decision Record: 002-spec-structure-and-validation Spec Structure and Validation Remediation
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Theme-Owned Remediation Packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-21 |
| **Deciders** | Orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The consolidated 006 campaign review produced a large finding set that needs implementation-ready ownership. Grouping by theme keeps related defects, stale evidence, and validation failures close enough for focused remediation.

### Constraints

- The packet must validate as Level 3 before remediation starts.
- The orchestrator owns git commits.
- Findings must retain CF identifiers and source evidence summaries.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep Spec Structure and Validation as one remediation-owned Level 3 packet.

**How it works**: The packet stores scope in spec.md, execution order in plan.md, one task per finding in tasks.md, and verification gates in checklist.md. graph-metadata.json indexes evidence-derived files for routing and recovery.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Theme packets | Preserves review synthesis and keeps work bounded | Some packets are large | 9/10 |
| One giant remediation packet | Simple folder count | Too broad for ownership and verification | 4/10 |
| One packet per finding | Maximum granularity | 274 packets would be noisy | 3/10 |

**Why this one**: Theme packets match the source synthesis and are small enough for phased implementation handoff.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Findings have durable owners before code changes begin.
- Validation, graph metadata, and task ledgers stay aligned per theme.

**What it costs**:
- Large themes contain many tasks. Mitigation: remediate by severity inside each packet.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Evidence goes stale before implementation | M | Re-read target files before edits |
| P2 work distracts from blockers | M | Checklist keeps P0 and P1 gates first |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 274 findings need ownership |
| 2 | **Beyond Local Maxima?** | PASS | Compared one root, theme packets, and per-finding packets |
| 3 | **Sufficient?** | PASS | Level 3 files cover scope, plan, tasks, checklist, and ADR |
| 4 | **Fits Goal?** | PASS | Directly prepares remediation handoff |
| 5 | **Open Horizons?** | PASS | Packets can later receive implementation summaries |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Create Level 3 packet docs for the remediation theme.
- Add graph metadata and description metadata for memory discovery.

**How to roll back**: Ask the orchestrator to remove or replace this packet before implementation begins.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Runtime Fix With Blocked Recursive Packet Closeout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-21 |
| **Deciders** | Codex |

---

### Context

CF-176 named a live compiler validation failure caused by zero-edge graph metadata for `sk-deep-research` and `sk-git`. CF-207 also required recursive validation of the parent `002-skill-advisor-graph` packet, but the current recursive validator output still reports structural and integrity errors in historical child packet docs that are outside this assignment's write authority.

### Constraints

- Writes are limited to cited code files, their tests, and this sub-phase folder.
- Historical source packet spec docs outside this sub-phase cannot be edited here.
- Completion claims must reflect current command output.

---

### Decision

**We chose**: Close the runtime graph-health slice and leave recursive packet validation blocked.

**How it works**: The graph metadata now gives `sk-deep-research` and `sk-git` reciprocal sibling edges so compiler validation has no orphan skills. The advisor health wrapper treats the embedded `skill-advisor` graph node as an intentional graph-only node while still reporting any other inventory mismatch as degraded.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Fix runtime graph slice only | Respects write authority and removes live compiler failure | Leaves historical packet-doc validation failures open | 8/10 |
| Edit all failing historical packet docs | Could close recursive validation | Violates the user-provided write boundary | 1/10 |
| Mark CF-207 complete despite recursive failure | Matches requested happy path | False completion claim | 0/10 |

**Why this one**: It is the only option that improves live behavior while preserving the safety boundary and truthfulness of validation evidence.

---

### Consequences

**What improves**:
- `skill_graph_compiler.py --validate-only` now exits 0.
- `skill_advisor.py --health` now reports `status: ok` when `skill-advisor` is the only graph-only node.

**What it costs**:
- CF-207 cannot be closed in this sub-phase until the source packet docs are authorized for repair.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Recursive validation remains red | P0 closeout is blocked | Keep T010 and CHK-020 open with blocker evidence |
| A future graph-only node appears unintentionally | Health could hide mismatch | Allowlist contains only `skill-advisor`; all other graph-only nodes still degrade health |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live compiler validation exited 2 before the fix |
| 2 | **Beyond Local Maxima?** | PASS | Considered source-doc edits and false completion |
| 3 | **Sufficient?** | PARTIAL | Runtime graph slice is sufficient; recursive packet validation remains blocked |
| 4 | **Fits Goal?** | PARTIAL | Fixes one P1 runtime blocker without violating scope |
| 5 | **Open Horizons?** | PASS | Keeps explicit handoff for remaining doc remediation |

**Checks Summary**: 3/5 PASS, 2/5 PARTIAL

---

### Implementation

**What changes**:
- Add reciprocal graph edges for the two orphan skills named by CF-176.
- Preserve advisor health parity by allowlisting only the internal `skill-advisor` graph node as graph-only.
- Add vitest coverage for compiler validation and advisor health status.

**How to roll back**: Revert the graph metadata edge additions, health allowlist, and the new vitest file through orchestrator-owned git flow.
