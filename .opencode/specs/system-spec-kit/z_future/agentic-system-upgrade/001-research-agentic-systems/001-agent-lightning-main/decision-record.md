---
title: "...ystem-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/decision-record]"
description: "Records the research-method, scope, and recommendation-framing decisions for the Agent Lightning phase."
trigger_phrases:
  - "001-agent-lightning-main decision record"
  - "agent lightning adr"
  - "research phase decisions"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: 001-agent-lightning-main Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use static source analysis instead of runtime training execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

We need to understand Agent Lightning's tracing, store, adapter, trainer, and algorithm contracts well enough to improve `system-spec-kit`, but the phase charter explicitly says not to spend time on heavyweight training or GPU setup. The load-bearing questions are about interfaces, data flow, and adoption boundaries, all of which are visible in the source tree, examples, and docs.

### Constraints

- The external repo is read-only
- The user asked for quality over speed, not runtime reproduction
- Recommendations must be tied to concrete Public targets rather than benchmark claims
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Study Agent Lightning primarily through static source analysis with targeted docs and examples, not by trying to run its training workflows.

**How it works**: Each iteration reads only the source files needed to answer one narrow question, verifies line numbers directly, and derives recommendations from code contracts rather than runtime setup success.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Static source analysis** | Fastest path to real contracts; aligns with scope; keeps evidence auditable | Cannot confirm runtime behavior beyond source and docs | 9/10 |
| Execute training examples | Could confirm runtime assumptions | High setup cost; out of scope; risks irrelevant dependency work | 3/10 |
| Read docs only | Faster | Too weak for adoption-quality recommendations | 2/10 |

**Why this one**: The phase is about transferable patterns, not benchmark reproduction. The source tree provides the most reliable signal at the lowest scope risk.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Recommendations stay grounded in source-visible contracts
- Research time goes into analysis rather than environment wrestling

**What it costs**:
- Some runtime-only behavior may remain `prototype later` rather than `adopt now`. Mitigation: state confidence honestly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Runtime nuance hidden from static analysis | M | Use conservative recommendation tiers and note uncertainty |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Heavy runtime setup is out of scope |
| 2 | **Beyond Local Maxima?** | PASS | Runtime execution and docs-only alternatives were considered |
| 3 | **Sufficient?** | PASS | The load-bearing contracts are visible in source |
| 4 | **Fits Goal?** | PASS | Supports adoption-quality analysis |
| 5 | **Open Horizons?** | PASS | Leaves room for follow-on prototype packets |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Research iterations cite source files directly
- No training commands or GPU flows are attempted

**How to roll back**: If static analysis proves insufficient, open a prototype-focused follow-on packet rather than changing this phase's method midstream.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Force each iteration to answer one falsifiable question tied to one Public target

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Codex |

---

### Context

Deep research can drift into broad summarization unless each pass has a narrow target. The user explicitly asked for one narrow, falsifiable question per iteration and actionable improvement ideas for `system-spec-kit`.

### Constraints

- Ten iterations must produce cumulative signal, not repetition
- Each finding must influence a real Public file, module, or concept

---

### Decision

**We chose**: Every iteration will be scoped to one precise question and one concrete Public adoption target.

**How it works**: The iteration template requires a falsifiable question, a conclusion, and an adoption recommendation naming a specific target path or module.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One narrow question per iteration** | Strong evidence discipline; easier convergence tracking | Requires more upfront planning | 10/10 |
| Broad subsystem summaries | Faster to draft | Weak falsifiability and weaker adoption guidance | 4/10 |

**Why this one**: It matches the phase contract and keeps the research auditable.

---

### Consequences

**What improves**:
- Iterations stay differentiated
- Synthesis becomes a registry of explicit adoption choices

**What it costs**:
- Some broad context has to be deferred into the repo-map and synthesis sections. Mitigation: capture it outside iteration conclusions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Questions become too narrow to matter | M | Review for concrete Public relevance before writing each iteration |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required by the user contract |
| 2 | **Beyond Local Maxima?** | PASS | Broad-summary alternative considered |
| 3 | **Sufficient?** | PASS | Supports convergence and synthesis |
| 4 | **Fits Goal?** | PASS | Produces actionable outputs |
| 5 | **Open Horizons?** | PASS | Leaves room for follow-on prototype packets |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Iteration files use the exact required structure
- State rows include confidence, priority, and new-signal tracking

**How to roll back**: If a question proves too narrow, supersede it in a later iteration rather than broadening the completed artifact.

---

### ADR-003: Only treat a recommendation as RL-specific when it adds leverage beyond existing Public orchestration

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Codex |

---

### Context

Public already has mature orchestration, validation, and memory surfaces. If the report recommends generic loop, command, or memory patterns that Public already has, it would create churn rather than value and would also blur the boundary with sibling phases.

### Constraints

- Phase 005 already covers more generic agent-loop topics
- The user wants actionable improvements, not redundant restatements

---

### Decision

**We chose**: Require every adoption recommendation to explain the RL-specific leverage or reject it as redundant.

**How it works**: Iteration and synthesis analysis explicitly compare Agent Lightning patterns against existing Public capabilities before assigning a tier.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **RL-specific filter** | Protects scope and recommendation quality | Requires more comparison work | 9/10 |
| Import broad orchestration ideas anyway | Easier to find "findings" | Creates overlap and weak follow-on planning | 2/10 |

**Why this one**: It preserves the purpose of this phase and keeps the research differentiated from sibling work.

---

### Consequences

**What improves**:
- Recommendations stay high-signal
- Rejections become useful evidence rather than dead ends

**What it costs**:
- Some interesting patterns will be rejected even if they are well designed. Mitigation: record them under rejected recommendations with rationale.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Under-crediting reusable generic patterns | M | Document them as rejected with clear reasoning rather than ignoring them |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Cross-phase overlap is a stated concern |
| 2 | **Beyond Local Maxima?** | PASS | Compared against a broader import-everything approach |
| 3 | **Sufficient?** | PASS | Keeps findings actionable |
| 4 | **Fits Goal?** | PASS | Supports better follow-on packet planning |
| 5 | **Open Horizons?** | PASS | Preserves rejected ideas for future reassessment |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Every major finding includes a comparison to existing Public surfaces
- The final report includes a dedicated rejected-recommendations section

**How to roll back**: Reclassify a rejected item in a future phase if new Public context changes the overlap calculus.

---

### ADR-004: Keep the workflow phase-local and treat `external/` as strictly read-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Codex |

---

### Context

The phase brief and user prompt both set a hard scope boundary: only the phase folder may be modified, and `external/` is reference material only.

### Constraints

- No writes outside this phase folder
- No edits under `external/`

---

### Decision

**We chose**: Constrain all writes to phase-local docs and research artifacts and verify that scope again at closeout.

**How it works**: All created files live in the phase root or `research/`, and closeout includes a phase-only write-scope check.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Phase-local only** | Fully aligned with user scope | Requires discipline during closeout | 10/10 |
| Write helper notes elsewhere | Could be convenient | Violates scope lock | 0/10 |

**Why this one**: The scope is explicit and non-negotiable.

---

### Consequences

**What improves**:
- Scope remains auditable
- No accidental churn to Product code or the external bundle

**What it costs**:
- Some reusable notes must stay embedded in phase artifacts rather than being promoted elsewhere. Mitigation: capture them in the final report.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidental spillover edits | H | Review diff before closing |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Explicit user scope |
| 2 | **Beyond Local Maxima?** | PASS | No safe broader alternative exists |
| 3 | **Sufficient?** | PASS | Phase artifacts can hold all outputs |
| 4 | **Fits Goal?** | PASS | Preserves auditability |
| 5 | **Open Horizons?** | PASS | Findings can still inform future packets |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Only phase-local docs and research files are created
- Closeout includes a scope check

**How to roll back**: Remove any accidental out-of-scope artifact immediately and recreate it within the phase folder if still needed.
