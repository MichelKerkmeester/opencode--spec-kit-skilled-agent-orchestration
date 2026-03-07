---
title: "Decision Record: Performance Loading on User Interaction - anobel.com"
description: "Architecture decisions for loading taxonomy, shared bootstrap design, and external skill routing updates."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "adr"
  - "interaction gating"
  - "performance"
  - "skill routing"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Performance Loading on User Interaction - anobel.com

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt a Four-Tier Loading Taxonomy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-07 |
| **Deciders** | Spec author, project owner (pending implementation confirmation) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Current loading behavior mixes eager and lazy patterns without one clear vocabulary. This makes it difficult to reason about trade-offs and increases the chance of accidentally deferring critical flows.

We needed a classification model that is explicit enough for performance tuning but simple enough to apply consistently across website modules and skill documentation.

### Constraints

- Must preserve hero/LCP critical behavior and cookie consent sequencing.
- Must support multiple trigger mechanisms already used in the codebase.
- Must remain understandable for future maintainers.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Four gate classes as the canonical taxonomy: `eager`, `interaction`, `viewport`, and `idle`.

**How it works**: Every candidate module is assigned one gate class plus rationale. `eager` is reserved for startup-critical flows. `interaction`, `viewport`, and `idle` are used for progressively less urgent initialization paths.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four-tier taxonomy (chosen)** | Balanced precision and simplicity | Requires initial classification effort | 9/10 |
| Binary eager/deferred | Very simple | Too coarse for UX-sensitive cases | 5/10 |
| Many micro-categories | Highly expressive | Overly complex and hard to enforce | 4/10 |

**Why this one**: It captures required nuance for performance work while staying reviewable and teachable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Decisions become auditable and less subjective.
- Checklist and skill docs can align directly with one shared model.

**What it costs**:
- Upfront analysis time for candidate classification. Mitigation: classify high-impact targets first.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Misclassification of critical flow | H | Hard exclusion list + review gate |
| Inconsistent usage over time | M | Enforce taxonomy references in plan/tasks/checklist |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing approach is fragmented and hard to govern |
| 2 | **Beyond Local Maxima?** | PASS | Compared binary and high-granularity alternatives |
| 3 | **Sufficient?** | PASS | Four tiers cover all observed candidate types |
| 4 | **Fits Goal?** | PASS | Directly supports performance + reliability planning |
| 5 | **Open Horizons?** | PASS | Extendable without breaking existing model |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Candidate matrix in spec and plan references taxonomy explicitly.
- Tasks and checklist enforce taxonomy at implementation/review time.

**How to roll back**: Revert to previous eager-first model and remove taxonomy-enforcement checks if implementation proves too disruptive.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use Shared Gate Bootstrap Instead of Scattered Per-Page Logic

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-07 |
| **Deciders** | Spec author, project owner (pending implementation confirmation) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Lazy-loading patterns already exist but are distributed across modules and pages. Continuing with page-local gate logic would increase drift, duplicate trigger code, and raise race-condition risk when integrating with Motion-ready and service worker behaviors.

### Constraints

- Must preserve existing module responsibilities.
- Must support idempotent initialization across repeated trigger events.
- Must integrate with existing guards around Motion and form logic.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: A shared gate bootstrap runtime with module adapters.

**How it works**: A centralized runtime registers trigger channels (interaction, viewport, idle) and exposes a small API for feature adapters to initialize once. Modules keep their domain logic but no longer implement bespoke trigger orchestration.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared bootstrap + adapters (chosen)** | Consistent behavior, easier testing, lower drift | Requires initial refactor | 9/10 |
| Per-page trigger scripts | Fast to start | High maintenance cost and inconsistency | 4/10 |
| Per-module isolated loaders | Better than per-page | Duplicates trigger logic and policy decisions | 6/10 |

**Why this one**: It best balances maintainability, correctness, and future extension.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Single source of truth for trigger behavior.
- Easier rollout, rollback, and regression testing.

**What it costs**:
- Front-loaded integration work before module migration. Mitigation: phase bootstrap early and migrate high-impact modules first.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bootstrap bug affects many modules | H | Idempotent guards + staged rollout |
| Ordering race with Motion readiness | M | Explicit readiness checks + fallback |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current behavior already shows distributed lazy patterns |
| 2 | **Beyond Local Maxima?** | PASS | Compared per-page and per-module alternatives |
| 3 | **Sufficient?** | PASS | Covers trigger orchestration while preserving module logic |
| 4 | **Fits Goal?** | PASS | Reduces startup work and maintenance risk |
| 5 | **Open Horizons?** | PASS | Supports future modules and additional gates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Add central gate runtime in global startup path.
- Adapt forms, Lenis, Swiper, video, and navigation modules to bootstrap API.

**How to roll back**: Disable bootstrap gating and restore eager init for affected modules through policy revert.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Expand External `sk-code--web` Routing and Docs for Interaction-Gated Loading

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-07 |
| **Deciders** | Spec author, skill maintainers (pending merge) |

---

<!-- ANCHOR:adr-003-context -->
### Context

Current PERFORMANCE routing in `sk-code--web` points to broad implementation docs and under-emphasizes high-value performance references. Task terminology such as `interaction`, `first interaction`, `defer`, `deferred loading`, `PageSpeed`, `Lighthouse`, `TBT`, `INP`, and `long tasks` is not strongly represented.

This causes performance tasks with interaction-gated intent to load less relevant guidance than available in existing performance docs.

### Constraints

- Changes must remain compatible with current skill routing architecture.
- New docs/assets should be concise and reusable.
- Existing performance references must stay discoverable.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Expand PERFORMANCE signal coverage and add dedicated interaction-gated resources with a fixed first increment.

**How it works**: Update keyword signals and `RESOURCE_MAP["PERFORMANCE"]`, then add a focused reference and both required first-increment assets (`interaction_gate_patterns.js` and `performance_loading_checklist`) so routing lands on actionable guidance for defer-by-intent performance tasks.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Routing + docs expansion (chosen)** | Better intent match and reuse | Requires maintaining additional docs/assets | 9/10 |
| Keep current router only | No extra work | Continues under-routing relevant docs | 3/10 |
| Add docs without router changes | New content exists | Discoverability remains weak | 6/10 |

**Why this one**: It addresses both discoverability and content quality in one coherent update.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Better routing precision for interaction/defer/Lighthouse/TBT/INP tasks.
- Faster and more consistent performance planning outcomes.

**What it costs**:
- Additional maintenance surface in skill docs/assets. Mitigation: keep assets small, modular, and tied to checklist usage.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overfitting router keywords | M | Keep balanced signals and test mixed-intent prompts |
| Doc drift between examples and real code | M | Add checklist-backed review during updates |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current routing under-loads relevant performance docs |
| 2 | **Beyond Local Maxima?** | PASS | Considered router-only and doc-only alternatives |
| 3 | **Sufficient?** | PASS | Signal + resource updates + dedicated reference + required asset pair cover need |
| 4 | **Fits Goal?** | PASS | Directly improves this and future interaction-gated work |
| 5 | **Open Horizons?** | PASS | Pattern/checklist assets enable repeatability |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Update `TASK_SIGNALS`/term coverage in the `sk-code--web` skill manifest.
- Expand PERFORMANCE `RESOURCE_MAP` to include targeted performance references.
- Add `interaction_gated_loading` reference in the performance references folder.
- Add both first-increment assets: `interaction_gate_patterns.js` and `performance_loading_checklist`.

**How to roll back**: Revert new PERFORMANCE terms and resources, and remove added docs/assets if routing quality degrades.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Freeze Canonical Candidate Matrix as Single Source of Truth

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-07 |
| **Deciders** | Spec author, project owner |

---

### Context

Previous planning captured good candidates but not one canonical implementation matrix shared across docs. That left room for drift between `spec.md`, `plan.md`, and `tasks.md`.

### Decision

**We chose**: Freeze matrix IDs CM-001..CM-011 as the single source of truth for module/page gate type, exact trigger, fallback, exclusion reason, expected benefit, and verification method.

### Consequences

- Positive: Removes ambiguity and contradictions across artifacts.
- Negative: Future policy updates must include coordinated matrix and task/checklist updates.

### Implementation

- Keep full matrix in `spec.md` and `plan.md`.
- Require `tasks.md` to map task IDs to matrix IDs.
- Require checklist gate CHK-009 for cross-doc matrix completeness.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Define Explicit Canary, Halt, Rollback, and Service-Worker Transition Rules

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-07 |
| **Deciders** | Spec author, project owner |

---

### Context

Rollout and cache strategy was too generic for a safe go/no-go process. Deferred loading changes can introduce production regressions or mixed cache-policy states if canary and rollback controls are not explicit.

### Decision

**We chose**:
1. Canary progression: 10% (`contact` + `werken_bij`) -> 50% (add `home`) -> 100%.
2. Hard halt conditions based on P0 regressions, TBT/INP thresholds, and mixed cache-policy detection.
3. Rollback toggle path using `GATE_ROLLOUT_MODE='legacy-eager'` in `src/0_html/global.html`.
4. Service worker transition rule: only one active policy-version cache namespace after `activate`.

### Consequences

- Positive: Deterministic rollback and safer release decisions.
- Negative: Requires stricter release discipline and mandatory SW lifecycle checks.

### Implementation

- `plan.md` section 7 defines canary, halt, rollback, and SW transition procedures.
- `tasks.md` includes rollout-readiness and SW verification tasks.
- `checklist.md` includes rollout and SW transition quality gates.
<!-- /ANCHOR:adr-005 -->

---
