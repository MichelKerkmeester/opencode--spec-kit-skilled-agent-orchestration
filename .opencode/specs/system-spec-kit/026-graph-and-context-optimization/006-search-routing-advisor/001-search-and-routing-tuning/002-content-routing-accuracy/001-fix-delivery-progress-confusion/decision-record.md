---
title: "...visor/001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion/decision-record]"
description: "Decision record for cue-first delivery/progress routing remediation."
trigger_phrases:
  - "delivery progress decision"
  - "cue asymmetry"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex"
    recent_action: "Refreshed decision record anchors"
    next_safe_action: "No further phase-local work required"
    completion_pct: 100
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: Fix Delivery vs Progress Routing Confusion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fix Cue Asymmetry Instead of Retuning Thresholds

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-12 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

`narrative_progress` had broad implementation verbs and floor logic, while `narrative_delivery` needed clearer sequencing, gating, rollout, and verification-order cues. The current evidence is anchored in `content-router.ts:404-423` and `content-router.ts:965-993`.

### Constraints

- Keep the existing routing category set.
- Avoid threshold-only tuning until cue-level behavior is measured.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: strengthen delivery cues and gate the progress floor when strong delivery mechanics are present.

**How it works**: delivery cue patterns score sequencing, gating, rollout, and verification-order language. `strongDeliveryMechanics` suppresses the generic progress floor and lifts `narrative_delivery` for the intended mixed-signal cases.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Cue-first remediation | Fixes the observed overlap directly | Needs targeted regression tests | 9/10 |
| Threshold-only tuning | Smaller patch | Hides cue asymmetry and risks unrelated routing drift | 5/10 |

**Why this one**: the behavior difference is semantic, so cue-level evidence is more replayable than a broad threshold adjustment.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Delivery/progress examples replay from current code anchors.
- Router categories and tier architecture remain stable.

**What it costs**:
- Future reviewers must keep line anchors current. Mitigation: cite function regions and targeted tests together.

**Risks**:
- Overly broad delivery cues could catch ordinary progress notes. Mitigation: keep regression coverage focused on mixed delivery/progress text.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->
