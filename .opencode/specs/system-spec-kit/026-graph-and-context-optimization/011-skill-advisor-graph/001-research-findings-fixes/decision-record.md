---
title: "Decision Record: Research Findings Fixes"
description: "Architectural decisions for fixing P0/P1 issues from the 10-iteration deep research audit of the skill graph system."
trigger_phrases:
  - "001-research-findings-fixes"
  - "decision"
  - "graph fixes decisions"
importance_tier: "important"
contextType: "decisions"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes"
    last_updated_at: "2026-04-13T20:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created decision record"
    next_safe_action: "Review decisions"
    key_files: ["decision-record.md"]
---
# Decision Record: Research Findings Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ghost Candidate Guard via Pre-Graph Evidence Check

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | Claude Opus 4.6, GPT-5.4 (research audit) |

---

### Context

The 10-iteration deep research audit (GPT-5.4 via Codex) found that family and sibling boosts could push a skill into results with zero lexical evidence. A user asking about one CLI tool would see all four CLI siblings appear. This was the highest-severity finding (P0-1).

### Constraints

- Must not break existing regression cases (44/44 must still pass)
- Must preserve legitimate graph boosts for skills that already have some direct evidence

### Decision

**We chose**: Require pre-graph evidence before applying any graph boost. In both `_apply_graph_boosts()` and `_apply_family_affinity()`, skip targets where `snapshot.get(target, 0) <= 0`.

**How it works**: The snapshot captures pre-graph scores before any graph processing begins. If a skill has zero score in the snapshot (no lexical, phrase, semantic, or name match evidence), graph boosts are not applied to it. This prevents graph-only candidate creation while preserving boosts for skills that already have some signal.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pre-graph evidence check** | Simple, precise, preserves existing boosts | Slightly aggressive for weak signals | 9/10 |
| Minimum boost threshold (e.g., 0.3) | Allows some graph-only candidates | Arbitrary threshold, hard to tune | 5/10 |
| Separate graph-only result tier | Keeps all candidates visible | Complicates output format, confusing UX | 4/10 |

**Why this one**: The snapshot already exists for feedback loop prevention, so the check is one line per call site. Zero false positives observed in regression.

### Consequences

**What improves**:
- Eliminates phantom skill recommendations from graph propagation alone
- 44/44 regression cases still pass (zero impact on legitimate routing)

**What it costs**:
- Skills with very weak direct evidence (score ~0.01) can still receive graph boosts. Mitigation: acceptable because any evidence means the user mentioned something related.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-aggressive filtering removes valid candidates | L | Only blocks zero-evidence targets; any signal allows boost |
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Evidence Separation via Graph Boost Counter

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | Claude Opus 4.6 |

---

### Context

P0-5 found that graph-derived boosts were treated identically to direct keyword matches in confidence calculation. A skill boosted primarily through graph propagation would show the same confidence as one with strong direct evidence, inflating certainty for indirectly-related skills.

### Constraints

- Confidence calibration must remain backwards-compatible for direct-evidence-only results
- Penalty must be small enough to not break threshold behavior for legitimate graph boosts

### Decision

**We chose**: Track `_graph_boost_count` per recommendation and apply a 10% confidence penalty when graph-derived evidence exceeds 50% of total match reasons.

**How it works**: Each graph boost increments a counter. At calibration time, if `graph_fraction = graph_boost_count / num_matches > 0.5`, confidence is multiplied by 0.90. This distinguishes "strong direct match" from "mostly graph-propagated" without eliminating graph boosts.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Graph boost counter + penalty** | Proportional, measurable, backwards-compatible | Adds one field per recommendation | 8/10 |
| Separate confidence lanes (direct vs graph) | Clean separation | Doubles confidence logic, complex output | 4/10 |
| Static weight reduction for all graph boosts | Simple | Penalizes legitimate graph boosts uniformly | 5/10 |

**Why this one**: Minimal code change (~10 lines), only affects results where graph evidence dominates, and the 10% penalty is conservative enough to avoid threshold breakage.

### Consequences

**What improves**:
- Confidence scores more accurately reflect evidence quality
- Users can trust high-confidence results as directly-matched

**What it costs**:
- One additional field tracked per recommendation. Mitigation: negligible memory/compute.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Deep Review/Research Sibling Edge Removal

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | Claude Opus 4.6, GPT-5.4 (research finding P1-3) |

---

### Context

sk-deep-review and sk-deep-research were linked as siblings in graph metadata. Research found this caused mode leakage: a user asking for code review could see research suggested, and vice versa. These are distinct autonomous loop types with incompatible prompts.

### Decision

**We chose**: Remove the sibling edge entirely. Both skills now have empty `siblings` arrays.

**How it works**: Deleted `sk-deep-research` from `sk-deep-review/graph-metadata.json` siblings and vice versa. Direct name matching still works for both skills independently.

### Consequences

**What improves**:
- No cross-contamination between review and research modes
- Each skill routes only on its own direct evidence

**What it costs**:
- If a user genuinely wants both, they must ask for each separately. Mitigation: this is the correct behavior since they are different workflows.
<!-- /ANCHOR:adr-003 -->
