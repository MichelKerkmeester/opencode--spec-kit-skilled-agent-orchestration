---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2"
title: "Decision Record: External Project Deep Research Closeout"
description: "Architecture decision record for adopting External Project ideas as selective research recommendations instead of direct code reuse."
trigger_phrases:
  - "git nexus decision record"
  - "007-external-project adr"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project"
    last_updated_at: "2026-04-25T07:10:00Z"
    last_updated_by: "codex"
    recent_action: "Documented External Project research adoption decision"
    next_safe_action: "Create follow-up packet for the first selected adaptation"
    blockers: []
    key_files:
      - "research/007-external-project-pt-01/research.md"
    session_dedup:
      fingerprint: "sha256:external-project-deep-research-2026-04-25"
      session_id: "dr-2026-04-25T06-21-07Z"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Selective adaptation chosen over direct External Project reuse"
---
# Decision Record: External Project Deep Research Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adapt External Project Patterns Selectively

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-25 |
| **Deciders** | Codex research workflow, user-requested packet |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to decide whether External Project should influence Public's Code Graph, Spec Kit Memory causal graph, and Skill Graph systems. External Project has overlapping graph, impact, route/tool, shape, and group-contract capabilities, but Public already has working SQLite graph storage, memory causal edges, and Skill Advisor graph-causal scoring.

### Constraints

- This packet is research-only and must not implement changes.
- External Project source under `external/` remains read-only.
- Public implementation source remains read-only during this workflow.
- Any later code reuse requires separate license review.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Adapt External Project architecture patterns selectively and reject direct wholesale reuse.

**How it works**: Code Graph should own structural graph improvements, Memory should link decisions to Code Graph evidence without duplicating code relations, and Skill Graph should feed richer skill/tool/resource evidence into the existing graph-causal lane. Follow-up implementation work should be split into focused packets.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Selective adaptation** | Preserves Public ownership boundaries and uses strongest External Project ideas | Requires follow-up implementation work | 9/10 |
| Direct External Project storage or source reuse | Faster if compatible | Runtime mismatch, license risk, and duplicated graph responsibilities | 3/10 |
| Ignore External Project | Avoids scope expansion | Misses useful evidence-backed patterns | 2/10 |
| One shared graph for code, memory, and skills | Simple conceptual model | Blurs ownership and weakens retrieval semantics | 4/10 |

**Why this one**: Selective adaptation keeps useful External Project lessons while respecting Public's existing systems and validation surfaces.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Public gets a ranked list of graph improvements grounded in source evidence.
- Future implementation can start from four scoped packets instead of a broad architecture rewrite.
- Memory and Skill Graph responsibilities stay distinct from Code Graph structural indexing.

**What it costs**:

- Follow-up packets must still implement and test the selected adaptations. Mitigation: start with phase DAG and edge provenance before higher-level impact tools.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| License review blocks source copying | Medium | Treat this packet as architecture inspiration until review completes |
| Follow-up packets become too broad | Medium | Split by target owner and validation surface |
| Edge vocabulary expands without handler support | Medium | Require query/context tests for every new edge type |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User requested research to avoid missing useful External Project ideas |
| 2 | **Beyond Local Maxima?** | PASS | Research compared Code Graph, Memory, and Skill Graph targets |
| 3 | **Sufficient?** | PASS | Recommendations stop at packet proposals, not implementation |
| 4 | **Fits Goal?** | PASS | Output includes Adopt/Adapt/Reject/Defer matrix |
| 5 | **Open Horizons?** | PASS | Follow-up packets are scoped for later implementation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `research/007-external-project-pt-01/research.md` records final recommendations and follow-up packet proposals.
- `spec.md` includes a generated findings summary for resume and discovery.
- Canonical Level 3 docs capture the research closeout state.

**How to roll back**: Remove the generated research closeout docs and `spec.md` generated findings block, then rerun the reducer and validation for the previous packet state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
