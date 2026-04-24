---
title: "...ptimization/005-release-cleanup-playbooks/002-cleanup-and-audit/004-dead-code-and-architecture-audit/decision-record]"
description: "Accepted decision for keeping the audit focused on the active runtime and shared truth surfaces."
trigger_phrases:
  - "013 decision record"
  - "dead code audit adr"
  - "architecture audit adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/004-dead-code-and-architecture-audit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the accepted audit decision"
    next_safe_action: "Review packet"
    key_files: ["decision-record.md", "spec.md", "implementation-summary.md"]
level: 3
parent: "008-cleanup-and-audit"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: 018 / 013 — dead code and architecture audit

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the audit focused on active runtime code and shared truth surfaces

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-12 |
| **Deciders** | Codex implementation pass for Phase 018 / 013 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The canonical continuity refactor touched a wide part of the repo, but this phase was requested as an implementation audit of the active runtime. That meant the cleanup needed to stay inside `system-spec-kit` runtime code plus the explicitly requested shared docs that describe that runtime.

### Constraints

- Dead code had to be deleted, not just labeled deprecated.
- Packet closeout required strict validation and evidence-backed task completion.
- Shared truth surfaces still needed updating when they were the runtime source of truth.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep code cleanup inside the `mcp_server` and `scripts` workspaces, while allowing shared truth updates only for the package architecture document and the legacy 006 resource map.

**How it works**: runtime code is cleaned and verified first, then the shared docs that summarize that runtime are rewritten to current reality, and finally the phase packet captures the evidence.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Runtime-focused audit plus shared truth docs** | Matches operator scope, keeps the work finishable, still updates the key summaries | Requires explicit boundary discipline | 9/10 |
| Repo-wide cleanup sweep | Maximum cleanup | Too much churn for one phase | 4/10 |
| Packet-only documentation update | Fastest packet closeout | Would leave dead runtime code untouched | 2/10 |

**Why this one**: it solves the actual problem the operator named without turning the audit into an unbounded repo-wide rewrite.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Runtime cleanup stays focused and verifiable.
- The package architecture and the legacy 006 resource map remain trustworthy summaries.

**What it costs**:
- Some non-runtime utility or example stdout conventions remain intentionally untouched. Mitigation: document the boundary explicitly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared docs drift again later | M | Keep future runtime phases updating the same truth surfaces |
| Orphan triage overreaches | M | Prefer documentation over uncertain deletions |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The runtime still carried dead code and stale docs |
| 2 | **Beyond Local Maxima?** | PASS | The phase considered repo-wide and packet-only alternatives |
| 3 | **Sufficient?** | PASS | Runtime cleanup plus shared truth docs covers the requested outcome |
| 4 | **Fits Goal?** | PASS | It aligns exactly to the operator's audit request |
| 5 | **Open Horizons?** | PASS | Future phases can widen scope if needed without redoing this work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Runtime cleanup in the two active workspaces
- Shared truth updates in the package architecture doc and the legacy 006 resource map
- Packet closeout evidence in the phase folder

**How to roll back**: restore the smallest failing runtime cleanup and rerun the verification gate; do not broaden scope as a rollback shortcut.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
