---
title: "Decision Record: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/decision-record]"
description: "Records decisions for consolidating the 026 active phase surface while preserving child phase folders."
trigger_phrases:
  - "026 graph and context optimization"
  - "026 phase consolidation"
  - "29 to 9 phase map"
  - "merged phase map"
  - "graph context optimization root packet"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Renumbered nested phases"
    next_safe_action: "Use merged-phase-map.md and context indexes for navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:eedd47d8a93c36508e2f2fb7e0810d6467b298b0e4d6295125fb5bd10fb86805"
      session_id: "026-phase-consolidation-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: Graph and Context Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Consolidate the active phase surface into nine thematic wrappers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-21 |
| **Deciders** | 026 phase consolidation pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The root packet described a 19-phase train while the filesystem exposed 29 direct phase folders. Later phases were appended chronologically even when they were direct continuations of older themes, such as code graph packaging, search/advisor routing, deep-review remediation, runtime executor hardening, and hook parity.

### Constraints

- Every original phase packet must remain available.
- Root `research/`, `review/`, and `scratch/` folders must stay where they are.
- Runtime code is out of scope.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: replace the 29 direct top-level phase folders with nine active thematic wrappers.

**How it works**: Each wrapper has active Level 1 docs and a context index. Original folders live as direct children under the relevant thematic wrapper, while the single-source research packet is merged into phase `001`. Root `merged-phase-map.md` maps every old phase to its active home.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Nine thematic wrappers** | Preserves history while reducing active navigation | Requires metadata migration and bridge docs | 9/10 |
| Keep 29 top-level folders | No move needed | Navigation and validation remain noisy | 3/10 |
| Collapse to five broad themes | Smaller surface | Hides still-active areas like daemon/parity and code graph packaging | 6/10 |

**Why this one**: Nine themes match the actual story of the work without erasing active or scaffolded tracks.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Maintainers scan nine active folders instead of twenty-nine.
- Every old packet has an explicit child-phase path.
- Metadata preserves old IDs for continuity.

**What it costs**:
- Historical citations inside child packets may still describe old top-level paths. The bridge docs now carry the active mapping.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Old IDs disappear from graph lookup | H | Store old packet IDs in aliases and migration fields. |
| Child phase folders are mistaken for active phase work | M | Keep child folders under their thematic wrappers, not as root direct children. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Root map and filesystem disagreed. |
| 2 | **Beyond Local Maxima?** | PASS | Considered 29-folder and 5-folder alternatives. |
| 3 | **Sufficient?** | PASS | Nine wrappers cover every old phase. |
| 4 | **Fits Goal?** | PASS | Goal is active navigation reduction with history preservation. |
| 5 | **Open Horizons?** | PASS | New work can attach to thematic wrappers. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Old phase folders move under wrapper direct-child folders.
- Root docs describe nine active phases.
- Metadata records current paths and migration aliases.

**How to roll back**: Move child folders back to their old top-level names and restore root docs/metadata from version control.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
