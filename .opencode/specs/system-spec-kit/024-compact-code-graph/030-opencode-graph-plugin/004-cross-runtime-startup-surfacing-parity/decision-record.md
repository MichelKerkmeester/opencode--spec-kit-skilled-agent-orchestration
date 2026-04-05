---
title: "Decision Record: Cross-Runtime Startup Surfacing Parity [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity]"
description: "Architecture decisions for Cross-Runtime Startup Surfacing Parity: preserve the shipped runtime boundary and close the phase as a clean Level 3 artifact."
trigger_phrases:
  - "cross-runtime startup surfacing parity adr"
  - "level 3 decision record"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Cross-Runtime Startup Surfacing Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Preserve the Shipped Cross-Runtime Startup Surfacing Parity Boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-03 |
| **Deciders** | Packet 030 implementation evidence plus Level 3 repair pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

This phase was already implemented before the Level 3 repair. The documentation challenge was to preserve that runtime truth while upgrading the phase from a lower-level doc bundle into a complete Level 3 artifact with a checklist and decision record.

### Constraints

- The runtime claims in `implementation-summary.md` had to stay unchanged in meaning.
- The phase still had to stay inside its original scope boundary and predecessor/successor contract.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the shipped Cross-Runtime Startup Surfacing Parity runtime scope intact and rebuild the phase docs around that existing implementation evidence.

**How it works**: The phase spec, plan, checklist, and ADR now all describe the same delivered runtime boundary. The checklist cites the preserved verification evidence, and the ADR records why the phase stays bounded the way it does.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the shipped phase boundary and close it cleanly** | Preserves runtime truth, supports reliable recovery | Requires manual doc repair | 9/10 |
| Re-scope the phase while upgrading docs | Could fold in adjacent ideas | Would overstate what shipped and blur the packet boundary | 4/10 |
| Leave the phase at Level 1 with new files only | Less rewriting | Still weak for Level 3 recovery and review | 5/10 |

**Why this one**: It is the only option that keeps the phase truthful while making it fully recoverable as a Level 3 artifact.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The phase becomes self-contained for review, recovery, and follow-on planning.
- The runtime evidence remains aligned with the packet-local architecture story.

**What it costs**:
- The doc repair is manual rather than automated. Mitigation: keep it bounded to the packet and cite real evidence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future sessions infer extra scope from the Level 3 upgrade | M | Keep out-of-scope and handoff boundaries explicit in spec, plan, and checklist |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase needed Level 3 closure without changing the shipped runtime claim. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives included re-scoping the phase or leaving it under-documented. |
| 3 | **Sufficient?** | PASS | Clean Level 3 docs plus preserved implementation evidence are enough. |
| 4 | **Fits Goal?** | PASS | The goal is trustworthy phase recovery and review, not new runtime work. |
| 5 | **Open Horizons?** | PASS | The phase remains ready for future follow-on work without reopening scope. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The phase now has a clean Level 3 checklist and decision record.
- The phase spec and plan now carry Level 3 architecture and validation context without template bleed-through.

**How to roll back**: Restore the phase docs from the packet-local backup or version control baseline and rerun strict validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
