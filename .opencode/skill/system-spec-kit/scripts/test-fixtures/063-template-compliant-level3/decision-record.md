---
title: "Decision Record: Level 3 Fixture [template:level_3/decision-record.md]"
description: "Architecture decision records for the Level 3 compliance fixture."
trigger_phrases:
  - "fixture"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Level 3 Fixture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Level 3 for Maximum Template Coverage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-16 |
| **Deciders** | Fixture Author |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a fixture that exercises the most template features without requiring governance workflows. Level 3 covers decision records, user stories, complexity assessments, and all L2/L3 optional plan sections.

### Constraints

- Must pass strict validation with zero errors and zero warnings
- Must include all six required Level 3 files
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Level 3 as the fixture documentation level because it covers the maximum number of template features without requiring Level 3+ governance sections.

**How it works**: Each file follows the exact header and anchor order from the Level 3 templates, with placeholder content replaced by fixture-appropriate text.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Level 3** | Maximum feature coverage | More files to maintain | 8/10 |
| Level 3+ | Full governance coverage | Overkill for testing | 5/10 |
| Level 2 | Already exists as fixture 053 | Misses decision-record testing | 4/10 |

**Why this one**: Level 3 covers the most template features while staying within standard documentation practices.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Validator can test decision-record.md ADR pattern matching
- Validator can test L3 optional plan sections (dependency graph, critical path, milestones)

**What it costs**:
- Six files to maintain instead of five. Mitigation: Structure is stable once aligned with templates.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Template changes break fixture | M | Track template version in SPECKIT_TEMPLATE_SOURCE comments |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Level 3 fixture needed for complete validator coverage |
| 2 | **Beyond Local Maxima?** | PASS | Level 2 and Level 3+ alternatives evaluated |
| 3 | **Sufficient?** | PASS | Covers all standard (non-governance) template features |
| 4 | **Fits Goal?** | PASS | Directly enables Level 3 validation testing |
| 5 | **Open Horizons?** | PASS | Does not preclude adding Level 3+ fixture later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New fixture directory: `063-template-compliant-level3/`
- Six new markdown files matching Level 3 template contracts

**How to roll back**: Delete the fixture directory and remove any test references to it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
-->
