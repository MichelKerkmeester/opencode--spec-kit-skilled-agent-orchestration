---
title: "Decision Record: 001-baseline-and-safety-rails"
description: "Phase-local architecture decisions for Hydra Phase 1 baseline hardening."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "phase 1 adr"
  - "baseline decision"
  - "safety rails adr"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: 001-baseline-and-safety-rails

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Finish Control-Plane Hardening Before Phase 2 Lineage Work

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainer |

---

### Context

Phase 2 depends on trustworthy runtime packaging, roadmap metadata, rollback tooling, and documentation. Starting lineage work before those basics are stable would blur whether failures come from the new data model or from pre-existing drift in the build, flags, or checkpoint path.

### Constraints

- The MCP server must remain runnable from compiled `dist`.
- Future data migrations need reversible checkpoint workflows.
- Documentation must not claim future Hydra phases are already shipped.

---

### Decision

**We chose**: complete baseline control-plane hardening before any Phase 2 lineage rollout begins.

**How it works**: Phase 1 delivers build correctness, roadmap-safe capability snapshots, checkpoint helper hardening, schema compatibility validation, and aligned docs. Phase 2 can assume these basics are in place instead of rebuilding them mid-stream.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Control-plane first** | Safer rollout, cleaner blame boundaries, better rollback confidence | Delays visible lineage work slightly | 9/10 |
| Begin lineage immediately | Faster feature delivery on paper | High chance of compounding hidden drift | 4/10 |
| Split build/docs cleanup from checkpoint work | Smaller first slice | Leaves rollback risk unresolved | 6/10 |

**Why this one**: It reduces ambiguity at the exact point where the roadmap starts touching data-plane behavior.

---

### Consequences

**What improves**:
- Later phases can trust build, checkpoint, and docs foundations.
- Regression evidence is easier to interpret.

**What it costs**:
- Some engineering time goes to control-plane work instead of new user-visible behavior. Mitigation: keep the phase tightly scoped and evidence-backed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 1 grows too large | M | Keep residual baseline items explicitly tracked |
| Teams confuse metadata flags with live runtime flags | M | Prefix roadmap flags and document the distinction |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 2 depends on baseline safety and truth-in-status |
| 2 | **Beyond Local Maxima?** | PASS | Compared against jumping straight to lineage |
| 3 | **Sufficient?** | PASS | Covers the core blockers without widening into later phases |
| 4 | **Fits Goal?** | PASS | Makes later Hydra implementation safer and more measurable |
| 5 | **Open Horizons?** | PASS | Leaves room for deeper baseline follow-up if needed |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Build/runtime packaging, capability snapshot logic, checkpoint helpers, schema compatibility validation, tests, and docs.

**How to roll back**: Revert the baseline hardening slice, rebuild `dist`, rerun the focused verification suite, and revert docs that depended on the change set.

<!-- /ANCHOR:adr-001 -->
