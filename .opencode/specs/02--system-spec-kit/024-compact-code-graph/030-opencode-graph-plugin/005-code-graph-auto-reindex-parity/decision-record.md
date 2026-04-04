---
title: "Decision Record: Code Graph Auto-Reindex Parity [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity]"
description: "Architecture decisions for Phase 5: reuse the existing code graph readiness engine and mimic CocoIndex on-use refresh only within bounded inline safety limits."
trigger_phrases:
  - "phase 5 adr"
  - "auto reindex parity adr"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Code Graph Auto-Reindex Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse the Existing Freshness Engine Instead of Inventing a New Auto-Reindex Path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-04 |
| **Deciders** | Packet 030 follow-on implementation pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The code graph already has freshness detection, debounce, timeout protection, and both selective and full reindex capabilities. The main gap is that the structural read handlers currently disable inline indexing, so users still need to run `code_graph_scan` manually even for small stale sets.

### Constraints

- Structural read paths must remain bounded and safe.
- The packet should mimic CocoIndex’s first-use refresh behavior, not clone its implementation blindly.
- Parent packet 030 should stay truthful: Phase 5 should only be marked complete once runtime behavior and verification both land.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Reuse `ensureCodeGraphReady()` as the canonical freshness engine and change handler policy around it.

**How it works**: `code_graph_context` and `code_graph_query` will adopt bounded inline refresh for safe stale cases. Expensive refresh conditions will remain explicit stale-reporting cases with recommended follow-up actions.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse `ensureCodeGraphReady()` and enable bounded inline refresh** | Keeps one canonical freshness engine, lowest architecture drift | Requires careful handler/test updates | 9/10 |
| Build a new read-path-only auto-refresh subsystem | Total freedom for parity design | Duplicate logic, more maintenance risk | 4/10 |
| Leave read paths manual and only improve docs | Lowest implementation risk | Fails the parity goal and preserves UX gap | 5/10 |

**Why this one**: It gives the desired CocoIndex-like UX without splitting freshness logic across two systems.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Small stale graph drift can disappear automatically during structural reads.
- Users get more intuitive “use it and it refreshes” behavior.

**What it costs**:
- Structural read latency may rise slightly on some stale queries. Mitigation: keep existing debounce, timeout, and bounded-inline policy.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inline refresh accidentally triggers expensive rescans | H | Keep explicit refusal paths for empty/full-scan states and large stale sets |
| Parent packet overclaims shipped behavior | M | Keep Phase 5 marked complete only alongside runtime verification evidence |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current structural reads still require manual scan for many stale cases. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives included doc-only change and a duplicate engine. |
| 3 | **Sufficient?** | PASS | Reusing the existing engine is enough if handler policy changes. |
| 4 | **Fits Goal?** | PASS | The goal is CocoIndex-like on-use freshness, not graph redesign. |
| 5 | **Open Horizons?** | PASS | Leaves room for future doctor/ops improvements without duplicating readiness logic. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The phase adds a bounded inline refresh track to the structural handlers and returns readiness metadata to callers.
- Parent packet docs now mark Phase 5 as implemented and verified.

**How to roll back**: Restore `allowInlineIndex: false` on read paths and keep stale-readiness guidance only.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
