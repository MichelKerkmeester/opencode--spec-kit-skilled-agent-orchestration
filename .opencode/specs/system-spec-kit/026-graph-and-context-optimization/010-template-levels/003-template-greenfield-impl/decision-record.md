---
title: "Decision Record: Template Greenfield Implementation — Inherits ADR-001 through ADR-005 from 011"
description: "This packet executes the design decided in packet 002. ADR-001 through ADR-005 are INHERITED unchanged. New ADR-006 added here only if implementation surfaces unforeseen design questions."
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
trigger_phrases:
  - "012 ADR"
  - "template impl decisions"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl"
    last_updated_at: "2026-05-01T14:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decision record stub authored; inherits ADR-001 to ADR-005 from packet 002"
    next_safe_action: "Append ADR-006+ only if new design questions surface during implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-14-10-template-impl"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Decision Record: Template Greenfield Implementation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Inherit packet 002's design decisions unchanged

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | michelkerkmeester (final), packet 002 deep-research loop (14 iterations, converged) |

<!-- ANCHOR:adr-001-context -->
### Context

Packet `002-template-greenfield-redesign` ran a 14-iteration deep-research loop and converged on the C+F hybrid manifest-driven greenfield design with 5 ADRs covering all material design questions. This packet (003) is the **implementation execution** of that design — not a redesign. Re-deciding here would create dual sources of truth.

### Constraints

- All design decisions live in `../002-template-greenfield-redesign/decision-record.md`
- Implementation must honor all 5 inherited ADRs without modification
- New ADRs in this packet ONLY if implementation surfaces a design question packet 002 didn't anticipate
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**INHERIT** ADR-001 through ADR-005 from packet 002 verbatim. Treat them as binding constraints on this packet's implementation:

- **ADR-001**: C+F hybrid manifest-driven greenfield design (86 → 14 files in `templates/manifest/` = 12 `.md.tmpl` + 1 internal `README.md` + 1 `spec-kit-docs.json` manifest; +5 runtime infrastructure files outside `templates/` = `level-contract-resolver.ts` + `inline-gate-renderer.{ts,sh}` + `template-utils.sh::resolve_level_contract` function + 4 vitest files; total source surface ~19 files vs today's 86 — number "15" cited in earlier docs referred to template files only; "13" referred to user-facing template files only excluding internal README; both consistent with this canonical breakdown)
- **ADR-002**: `manifestVersion` exact match for greenfield (no adapter machinery until first real migration)
- **ADR-003**: Template-contract frontmatter only on `spec.md` (not duplicated across other authored docs)
- **ADR-004**: Phase-parent scaffolds parent only (children added separately via `create.sh --subfolder`)
- **ADR-005**: `Level 1/2/3/3+` is the SOLE public/AI-facing vocabulary (preset/capability/kind names STRICTLY private; `--level N` flag stays public; CI test fails build on banned-vocabulary leak)

### How it works

This packet's `plan.md` Phase 1-4 + `tasks.md` T-101 through T-420 + `resource-map.md` §1-§8 collectively execute the inherited ADRs. Code review of any change in this packet checks against the relevant inherited ADR.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **INHERIT 011 ADRs (chosen)** | Single source of truth; no re-decision risk; implementation focuses on execution | Requires reviewers to read packet 002 for ADR context | **Winner** |
| Re-decide in 012 | All decisions visible in one packet | Creates drift risk; redundant work | Rejected |
| Move ADRs from 011 to 012 | Implementation packet owns its decisions | Loses the design-vs-implementation separation; 011 becomes hollow | Rejected |

**Why this one**: Packet 002 is the design packet. Packet 012 is the implementation packet. Decision provenance lives where the decision was made.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Single source of truth for design decisions (in 011)
- This packet stays focused on EXECUTION, not re-deliberation
- Reviewers know to check inherited ADRs only when scoped design questions arise

**What it costs**:
- Reviewers must navigate to packet 002 for ADR context. Mitigation: `spec.md` §3 + `plan.md` §3 explicitly point to 011 ADRs.
- If implementation surfaces a question 011 didn't anticipate, we add ADR-006+ HERE — not retroactively in 011

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Implementation deviates from inherited ADR without flagging | High | Code review checklist explicitly cites inherited ADRs |
| New design question surfaces mid-implementation | Medium | Stop implementation; add ADR-006+ to this packet's decision-record; resume |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Implementation packet must commit to a design; inherits cleanly from 011 |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered (re-decide / move-from-011 / inherit) |
| 3 | **Sufficient?** | PASS | All 5 inherited ADRs cover the implementation's design space |
| 4 | **Fits Goal?** | PASS | Aligns with parent 026 theme (graph + context optimization) |
| 5 | **Open Horizons?** | PASS | If new design questions arise, ADR-006+ slot is available |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: Nothing in code from this ADR alone — this is a meta-decision about decision provenance. Implementation per `plan.md` Phase 1-4.

**How to roll back**: N/A — meta-decision, not a code change.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## Inherited ADR Pointers

For ADR text, see `../002-template-greenfield-redesign/decision-record.md`:

- **ADR-001 (in 011)**: Direction for Template System Consolidation — chose C+F hybrid
- **ADR-002 (in 011)**: Manifest version policy — exact match for greenfield
- **ADR-003 (in 011)**: Template-contract frontmatter location — `spec.md` only
- **ADR-004 (in 011)**: Phase-parent scaffolding — parent only, children separately
- **ADR-005 (in 011)**: Workflow-invariant — `Level 1/2/3/3+` is SOLE public/AI-facing vocabulary

**ADR-006+** (this packet): None yet. Append here if implementation surfaces an unforeseen design question.
