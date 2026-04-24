---
title: "Decision [system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/003-contextador/decision-record]"
description: "ADRs governing the research-only scope, cli-codex iteration delegation, and Level 3 documentation choices for the 003-contextador phase."
trigger_phrases:
  - "contextador adr"
  - "cli-codex delegation"
  - "research-only scope"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: Contextador Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep this phase research-only and confine writes to the phase folder

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Michel Kerkmeester, AI loop manager |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 003-contextador phase folder is part of a five-phase external systems research track. The phase prompt is explicit that the only writeable area is this phase folder, that `external/` is read-only, and that the goal is evidence-backed recommendations. Mixing research with implementation would dilute findings and risk unintended changes outside the folder.

### Constraints

- All writes restricted to `003-contextador/` (Gate 3 pre-approved for this folder only)
- `external/` is strictly read-only
- The five sibling phases must remain comparable in shape (research only, evidence-backed)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Research-only execution for 003-contextador with all writes confined to the phase folder.

**How it works**: The sk-deep-research loop runs from Setup through Synthesis and Save inside this folder. No code outside the folder is touched. Recommendations are produced as labeled findings, not patches.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Research-only inside phase folder** | Clean scope, low risk, comparable across phases | Defers any code changes | 9/10 |
| Research plus prototype patches in this phase | Faster path to adoption | Pollutes a research packet, risk of scope leak | 4/10 |
| Research in this folder plus parallel patches in a sibling spec | Keeps research clean, parallel work | Adds coordination overhead | 6/10 |

**Why this one**: Research-only gives the highest evidence quality and the lowest risk of unintended changes during the exploration phase.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Clear boundary between exploration and implementation
- Reproducible research artifact for the 026 track
- Sibling phases remain consistent in shape and depth

**What it costs**:

- Recommendations require a follow-up spec to translate "adopt now" findings into changes. Mitigation: implementation-summary.md lists concrete next-step targets.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Findings stay shelved with no implementation | M | Capture the next steps in implementation-summary.md and surface them via memory |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The 026 track explicitly needs evidence-backed recommendations before any code changes |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives compared above |
| 3 | **Sufficient?** | PASS | Research output plus implementation-summary.md is enough to drive a follow-up spec |
| 4 | **Fits Goal?** | PASS | Aligns with the 026 graph-and-context-optimization track goal |
| 5 | **Open Horizons?** | PASS | Recommendations remain available for future implementation phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Phase folder gains Level 3 spec docs and a sk-deep-research artifact set
- No edits outside the phase folder
- Iteration delegation defaults to cli-codex (gpt-5.4 high) with the internal `@deep-research` agent as the documented fallback. The full cli-codex routing decision lives in plan.md (L3 Architecture Decision Record section, ADR-001) so the decision-record file stays aligned with the active template's single-ADR shape.

**How to roll back**: Delete the phase folder's `research/` and `memory/` artifacts and the Level 3 spec docs. The phase prompt remains untouched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record - tailored to research-only phase 003-contextador
ADR-001 covers scope and iteration delegation jointly. The cli-codex preference is captured inside ADR-001 Implementation rather than as a separate ADR-002 to keep the decision record aligned with the active template's single-ADR shape.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
