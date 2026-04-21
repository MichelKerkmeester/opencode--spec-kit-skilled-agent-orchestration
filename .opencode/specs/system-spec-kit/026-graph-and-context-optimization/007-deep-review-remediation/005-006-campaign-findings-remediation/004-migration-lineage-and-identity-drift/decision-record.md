---
title: "Decision Record: 004-migration-lineage-and-identity-drift Migration, Lineage, and Identity Drift Remediation"
description: "ADR for 004-migration-lineage-and-identity-drift Migration, Lineage, and Identity Drift Remediation."
trigger_phrases:
  - "decision record 004 migration lineage and identity drift migration linea"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/004-migration-lineage-and-identity-drift"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted remediation decisions for current-lineage metadata and SQLite-only advisor runtime"
    next_safe_action: "Use implementation-summary.md for closeout evidence"
    completion_pct: 100
---
# Decision Record: 004-migration-lineage-and-identity-drift Migration, Lineage, and Identity Drift Remediation
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

**We chose**: Keep Migration, Lineage, and Identity Drift as one remediation-owned Level 3 packet.

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
- Close the P1 migration lineage findings in this remediation theme.
- Add graph metadata, description metadata, prompt, research-state, and advisor-runtime regression evidence.
- Normalize current routing fields to the live 006/001, 006/002, and 006/004 packet paths.
- Make SQLite the only runtime skill-graph source so `skill-graph.json` export cannot mask migration failure.

**How to roll back**: Ask the orchestrator to revert the remediation patch before committing.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
