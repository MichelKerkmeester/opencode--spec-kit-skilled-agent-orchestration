---
title: "Decision Record: Smart Router V2 Rollout [001-smart-router-v2/decision-record]"
description: "Current first-hit keyword routing in skill documents is brittle for mixed-intent prompts and cannot prioritize stronger signals. Smart Router V2 needs a deterministic but flexib..."
trigger_phrases:
  - "decision"
  - "record"
  - "smart"
  - "router"
  - "rollout"
  - "decision record"
  - "034"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Smart Router V2 Rollout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Weighted Intent Scoring with Confidence Fallback

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | ChatGPT Speckit Agent + Repository Maintainer |

---

### Context

Current first-hit keyword routing in skill documents is brittle for mixed-intent prompts and cannot prioritize stronger signals. Smart Router V2 needs a deterministic but flexible scoring method that improves relevance while preserving non-breaking behavior.

### Constraints
- Existing skill entry points and command invocation semantics must not change.
- The rollout spans two repositories (Public and Barter) and requires consistent semantics.
- Documentation must remain readable for maintainers and reviewers.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Adopt weighted keyword intent scoring (0.1-1.0), choose highest aggregate score, and keep low-confidence fallback to existing generic routing.

**Details**: Each target skill documents weighted intent groups with a common score band interpretation. If routing confidence remains weak, the skill retains current fallback behavior to avoid breaking user flows. This preserves backward compatibility while improving ranking quality for multi-signal prompts.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Weighted scoring + fallback (Chosen)** | Better mixed-intent handling, measurable tuning, backward compatible | Requires score calibration and review discipline | 9/10 |
| First-hit matching (status quo) | Simple and fast | Poor relevance for composite prompts, hard to tune | 4/10 |
| Rule-tree routing without weights | Predictable for fixed paths | Hard to scale across 10 targets, brittle maintenance | 6/10 |

**Why Chosen**: It provides the best balance of routing quality, maintainability, and compatibility with existing skill invocation behavior.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Improves intent ranking for prompts with multiple relevant signals.
- Enables consistent tuning language across Public and Barter skill targets.

**Negative**:
- Adds authoring complexity for score tables - Mitigation: define shared scoring bands and review checklist items.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Overweighting broad terms causes noisy routes | M | Peer review score rationale against scenario matrix |
| Divergent scoring style between repos | M | Keep shared scoring interpretation in this spec set |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing first-hit strategy cannot prioritize mixed-intent prompts |
| 2 | **Beyond Local Maxima?** | PASS | Three routing options compared with explicit trade-offs |
| 3 | **Sufficient?** | PASS | Keeps simple score table model with safe fallback, avoids over-engineering |
| 4 | **Fits Goal?** | PASS | Directly targets Smart Router V2 objective and success criteria |
| 5 | **Open Horizons?** | PASS | Supports future tuning without changing invocation API |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- Public repository skill definitions (8 targets)
- Barter repository skill definitions (2 targets)

**Rollback**: Revert modified SKILL.md files in the affected repository and restore baseline routing behavior.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Recursive Resource Discovery with Depth Guardrail

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | ChatGPT Speckit Agent + Repository Maintainer |

### Context
Several skill folders organize content in nested `references/` or `assets/` structures, which static top-level discovery can miss.

### Decision
Document recursive traversal with explicit maximum depth of 3 levels and graceful no-directory handling.

### Consequences
- Better surfacing of nested guidance with bounded traversal cost.
- Predictable behavior when target directories are absent.

---

## ADR-003: Public-First, Barter-Second Rollout Sequence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | ChatGPT Speckit Agent + Repository Maintainer |

### Context
The Public repository hosts a broader set of targets and should establish canonical Smart Router V2 phrasing before Barter alignment.

### Decision
Execute rollout in sequence: Public 8 targets first, then Barter 2 targets with parity checks.

### Consequences
- Reduces coordination risk and creates a clearer source-of-truth flow.
- Slightly longer total rollout duration than full parallel execution.

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
