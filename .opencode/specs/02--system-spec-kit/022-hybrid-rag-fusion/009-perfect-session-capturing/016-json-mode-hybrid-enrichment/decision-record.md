---
title: "Decision Record: JSON Mode Hybrid Enrichment (Phase 1B)"
description: "Captures the corrected decision record for phase 016: document the narrower JSON-mode work that shipped and stop claiming the unimplemented file-backed hybrid enrichment path."
trigger_phrases:
  - "decision"
  - "record"
  - "json mode"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: JSON Mode Hybrid Enrichment (Phase 1B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Restore Metadata Through Safe Hybrid Enrichment

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-20 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The original phase design targeted broader file-backed JSON enrichment than what actually shipped. The live code in this tree keeps file-backed JSON authoritative and adds narrower structured-summary support, but it does not include the dedicated `enrichFileSourceData()` branch described in the first draft of this phase pack.

### Constraints

- The corrected record must match the code that actually shipped.
- The solution had to stay backward compatible with existing JSON payloads.
- Routine saves must stay structured-first rather than silently reopening stateless reconstruction.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Correct the phase record to the narrower structured-JSON work that shipped, instead of continuing to describe an unimplemented hybrid enrichment path as completed.

**How it works**: The shipped code adds structured JSON summary fields such as `toolCalls` and `exchanges`, keeps file-backed JSON on the authoritative structured path, and preserves later hardening around count/confidence behavior. The phase record is corrected to stop asserting a shipped `enrichFileSourceData()` branch.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Correct docs to shipped JSON-mode scope** | Restores truthfulness, avoids silent scope expansion, stays backward compatible | Does not deliver the originally imagined hybrid enrichment branch | 9/10 |
| Implement the original hybrid path now | Would align docs to the old design | Broadens this phase beyond what is currently shipped and verified | 4/10 |
| Keep the old inaccurate record | No immediate doc work | Leaves the phase pack materially misleading | 1/10 |

**Why this one**: The immediate problem is documentation drift. Correcting the record avoids claiming capabilities the codebase does not actually ship.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The phase pack now matches the code that actually shipped.
- Structured JSON summary support remains documented without overstating file-backed enrichment.
- Later JSON-primary cleanup can build on truthful documentation rather than inherited misstatements.

**What it costs**:

- The original broader design is no longer represented as completed work.
- Any future hybrid enrichment work now needs its own explicit follow-up and verification.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future readers assume phase 016 already shipped hybrid enrichment | H | Correct the spec pack now and reference any future enrichment as new work |
| Later phases build on inaccurate premises | M | Keep 017+ docs aligned to the corrected JSON-primary contract |
| A future follow-up broadens scope without verification | M | Require a new spec if full file-backed enrichment is revived |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase pack was materially overstating shipped behavior |
| 2 | **Beyond Local Maxima?** | PASS | Compared doc correction against silent scope expansion and no-change options |
| 3 | **Sufficient?** | PASS | Correcting the record resolves the immediate truthfulness gap |
| 4 | **Fits Goal?** | PASS | The corrected goal is accurate documentation of shipped JSON-mode behavior |
| 5 | **Open Horizons?** | PASS | Future enrichment can still be pursued in a dedicated follow-up |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `session-types.ts` adds shipped structured-summary fields such as `toolCalls` and `exchanges`.
- `workflow.ts` keeps file-backed JSON authoritative rather than routing it through a dedicated hybrid enrichment branch.
- `input-normalizer.ts` and related JSON handling preserve the structured contract that actually shipped.
- The phase docs are corrected so they no longer describe unimplemented enrichment behavior as completed work.

**How to roll back**: Revert the documentation correction and restore the inaccurate earlier narrative. This is not recommended.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
