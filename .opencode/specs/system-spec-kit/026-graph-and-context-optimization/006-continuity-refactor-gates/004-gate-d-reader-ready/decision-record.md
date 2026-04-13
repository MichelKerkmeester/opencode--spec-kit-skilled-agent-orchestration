---
title: "Decision Record: Gate D — Reader Ready"
description: "Reader-ready ADRs for helper placement and archive-threshold handling."
trigger_phrases: ["gate d", "reader ready", "decision record", "resume ladder", "archived hit rate"]
importance_tier: "important"
contextType: "implementation"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/004-gate-d-reader-ready"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Marked Gate D ADR packet complete after syncing shipped evidence"
    next_safe_action: "Reuse ADR-001 and ADR-002 if a follow-on reader packet opens"
    key_files: ["decision-record.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
# Decision Record: Gate D — Reader Ready

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Extract `resumeLadder` into a shared helper

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Phase 018 Gate D packet owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Gate D must rewrite `session-resume.ts` and restructure `session-bootstrap.ts` around the same recovery order described in iterations 013, 018, 027, and 029. If the ladder stays inline, bootstrap, telemetry, and test coverage will drift the moment the wrapper adds its own shortcuts.

### Constraints

- Iteration 027 expects dedicated ladder stage spans instead of one opaque resume timer.
- Iteration 029 names 10 `resumeLadder` test rows that are easier to target against a shared module.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a shared helper module at `mcp_server/lib/resume/resume-ladder.ts`.

**How it works**: `session-resume.ts` owns packet resolution and final response shaping, but delegates ordered source reads, freshness comparison, and fallback telemetry to the helper. `session-bootstrap.ts` stays a wrapper and consumes the same helper-backed resume contract.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared helper** | Reusable telemetry and direct test target | One more module to wire | 9/10 |
| Inline in `session-resume.ts` | Fewer files | Harder bootstrap reuse and harder to unit-test | 6/10 |

**Why this one**: The helper matches the research language exactly and keeps the wrapper/thin-handler split clean.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Resume and bootstrap read the same recovery order.
- The 10 ladder cases from iteration 029 map directly to one module.

**What it costs**:
- Extra import and contract plumbing. Mitigation: keep bootstrap wrapper-only and expose a narrow helper API.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Helper API grows beyond recovery concerns | M | Keep search and response formatting outside the helper |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gate D changes two handlers that need one shared order |
| 2 | **Beyond Local Maxima?** | PASS | Compared inline and helper approaches |
| 3 | **Sufficient?** | PASS | Solves reuse without changing pipeline topology |
| 4 | **Fits Goal?** | PASS | Supports doc-first resume and perf telemetry |
| 5 | **Open Horizons?** | PASS | Leaves Gate E free to consume the same ladder |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add `mcp_server/lib/resume/resume-ladder.ts`.
- Make `session-resume.ts` and `session-bootstrap.ts` consume the helper.

**How to roll back**: Inline the helper logic back into `session-resume.ts`, remove the helper import from bootstrap, and rerun the resume test catalog.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

**ADR-002 - Use a two-layer archive threshold policy**

Status: Accepted on 2026-04-11.

Context: Gate D needs a short-window D0 safety ceiling, while the long-run permanence decision is already defined by iteration 036. A single threshold would blur "reader path still too archive-dependent right now" with "archive layer still needed over time."

Decision: Gate D uses a short-window ceiling plus the iteration 036 permanence ladder. During D0, the gate does not close if observed `archived_hit_rate` reaches 15% or higher. After rollout, the long-run decision follows iteration 036: below 0.5% EWMA is retire-candidate territory, 0.5%-2% keeps the thin layer, and above 2% opens routing investigation rather than retirement.

Alternatives considered: a single 15% threshold was simpler, but it ignored the statistical rulebook already written for phase 018 permanence.

Consequences: Gate D can block obvious archive overuse immediately, and long-run archive decisions stay conservative and auditable. The tradeoff is more telemetry discipline, so the checklist and Gate E handoff must repeat the two-layer policy clearly.

Implementation: document the 15% D0 ceiling in Gate D verification, then reuse the iteration 036 EWMA thresholds for any longer-term archive decision. Rollback means removing the short-window ceiling from the docs and updating checklist plus dashboard language together.

---
