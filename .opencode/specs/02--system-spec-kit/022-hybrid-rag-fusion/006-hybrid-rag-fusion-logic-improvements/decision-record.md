---
title: "Decision Record: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/decision-record.md]"
description: "Decision records for broad cross-system hardening across ranking, session/state integrity, telemetry governance, and prevention-first operations."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "adr"
  - "hybrid rag fusion"
  - "governance"
  - "prevention"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Broad Audit-First Hardening Across All Discovered Risk Systems

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Retrieval Maintainer, Platform Maintainer, QA Lead |

---

<!-- ANCHOR:adr-001-context -->
### Context

The original 006 framing was retrieval/fusion-centric. Research and continuity review showed material risk outside that narrow slice: graph relation contracts, cognitive ranking modifiers, session-learning quality, mutation/re-embedding consistency, parser/index health, storage recovery, telemetry schema drift, deferred test coverage, and operational readiness.

### Constraints

- Preserve existing SQLite-first architecture and avoid schema migration.
- Preserve carry-forward invariants from `002`, `003`, `004`, and `005`.
- Keep release safety based on measurable evidence and deterministic behavior.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: broaden 006 scope to full ten-subsystem hardening with explicit requirement -> phase -> task traceability.

**How it works**: Phase 1 locks baselines across all scoped systems; phases 2-4 implement ranked/channel, state-integrity, and governance/operations controls; phase 5 closes verification and sign-off. No subsystem discovered in research remains implicit or untracked.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Broad cross-system hardening (Chosen)** | Prevents silent failures across dependent systems; strongest continuity | Higher implementation and verification scope | 9/10 |
| Retrieval/fusion-only hardening | Faster initial delivery | Leaves discovered systemic risks unresolved | 4/10 |
| Two-stage plan with future phase for remaining systems | Lower immediate complexity | Defers known high-impact risks without guarantees | 6/10 |

**Why this one**: It is the only option that fully addresses discovered risk surface while preserving architecture continuity.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Risk controls become systemic rather than local to ranking internals.
- Governance and operational readiness become enforceable release criteria.

**What it costs**:
- Increased complexity and broader verification burden.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope expansion slows delivery | M | Enforce phase gates and critical-path discipline |
| Additional controls increase false positives initially | M | Use bounded threshold tuning and holdout fixtures |
| Multi-subsystem coupling complicates triage | H | Require telemetry schema governance and runbook drills |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research identified critical non-retrieval risks requiring direct controls. |
| 2 | **Beyond Local Maxima?** | PASS | Retrieval-only and staged alternatives were evaluated and rejected. |
| 3 | **Sufficient?** | PASS | Ten-subsystem scope maps all discovered risks to enforceable controls. |
| 4 | **Fits Goal?** | PASS | Aligns with user-requested broadened plan across relevant systems. |
| 5 | **Open Horizons?** | PASS | Preserves architecture while improving operational maturity. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Expanded requirements, phases, tasks, checklist, and baseline implementation summary.
- Added subsystem-specific thresholds and acceptance gates.
- Added sign-off consistency model across docs.

**How to roll back**: keep baseline fixtures, revert phase-specific controls in reverse order, re-run deterministic regression + recovery suites.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Unified Ranking Contract for Fusion, Graph Relations, and Cognitive Modifiers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Retrieval Maintainer, Session Maintainer |

### Context

Fusion scores, graph relation scores, and cognitive/FSRS modifiers influence final ranking. Without one bounded contract, ranking can drift and become difficult to explain or verify.

### Decision

Define one ranking contract with explicit contribution bounds, deterministic fallback ordering, and ablation-based quality guardrails. Graph relations and cognitive modifiers are first-class but bounded contributors.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified bounded ranking contract (Chosen)** | Consistent behavior, testable guardrails | Requires calibration and additional tests | 8.5/10 |
| Independent scoring subsystems | Faster local evolution | Cross-channel drift and debugging complexity | 5/10 |
| Disable cognitive modifiers | Simpler ranking path | Missed quality gains on long-tail recall | 6/10 |

### Consequences

- Positive: deterministic and explainable ranking behavior.
- Positive: measurable quality tradeoff boundaries via ablation tests.
- Tradeoff: tighter calibration loop and maintenance cost.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Multi-channel scoring is already active and requires contract governance. |
| 2 | **Beyond Local Maxima?** | PASS | Independent and simplified alternatives assessed. |
| 3 | **Sufficient?** | PASS | Bounds + ablation thresholds directly manage drift risk. |
| 4 | **Fits Goal?** | PASS | Supports broadened reliability and explainability objectives. |
| 5 | **Open Horizons?** | PASS | Enables future channels under the same contract model. |

**Checks Summary**: 5/5 PASS

### Implementation

- Add relation-scoring and cognitive-weight bounds.
- Add deterministic fallback sequencing tests.
- Emit debug metadata for score contribution rationale.

---

## ADR-003: State Integrity First for Session Learning, CRUD Re-Embedding, and Storage Recovery

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Platform Maintainer, Engineering Lead, QA Lead |

### Context

Ranking quality is insufficient if session routing, memory mutation, index consistency, or transaction replay can drift. The highest-impact failures here are often silent and compound over time.

### Decision

Treat session quality, CRUD re-embedding consistency, parser/index invariants, and mutation-ledger recovery parity as one state-integrity domain with release-gated checks.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified state-integrity domain (Chosen)** | End-to-end consistency, fewer silent failures | Broader implementation touch points | 9/10 |
| Separate incremental fixes | Smaller local changes | Leaves cross-system drift unresolved | 5.5/10 |
| Manual audits only | Low coding overhead | Low repeatability and weak prevention | 3/10 |

### Consequences

- Positive: session, index, and storage behavior become jointly verifiable.
- Positive: mutation consistency and recovery gain objective pass/fail criteria.
- Tradeoff: expanded CI and recovery simulation runtime.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing lineage demonstrates recurring cross-state defect classes. |
| 2 | **Beyond Local Maxima?** | PASS | Local and manual alternatives evaluated and rejected. |
| 3 | **Sufficient?** | PASS | Unified gates directly address end-to-end state integrity risk. |
| 4 | **Fits Goal?** | PASS | Aligns with broadened systemic hardening objective. |
| 5 | **Open Horizons?** | PASS | Establishes reusable pattern for future stateful modules. |

**Checks Summary**: 5/5 PASS

### Implementation

- Add session misroute/latency gates and session-learning freshness checks.
- Add CRUD mutation-to-embedding SLA checks.
- Add parser/index invariant checks and ledger replay verification.

---

## ADR-004: Telemetry Schema Governance with Documentation Drift Gating

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Operations Lead, QA Lead, Platform Maintainer |

### Context

Diagnostics become unreliable when emitted trace schema and documented fields diverge. This weakens incident triage and creates hidden operational risk.

### Decision

Introduce canonical trace schema validation in CI and enforce documentation drift checks so schema and docs must evolve together.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Schema + docs drift gate (Chosen)** | High diagnostic trust, objective enforcement | Requires schema registry maintenance | 8.5/10 |
| Schema validation without docs gate | Partial protection | Documentation drift still possible | 6/10 |
| Manual doc review only | Low tooling effort | High chance of mismatch and missed updates | 3/10 |

### Consequences

- Positive: operational diagnostics remain dependable.
- Positive: release-time detection of trace/schema mismatch.
- Tradeoff: additional maintenance for schema registry and docs checks.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Diagnostics are a critical dependency for expanded operations scope. |
| 2 | **Beyond Local Maxima?** | PASS | Schema-only and manual-review alternatives considered. |
| 3 | **Sufficient?** | PASS | Combined gate closes both emission and documentation drift. |
| 4 | **Fits Goal?** | PASS | Supports governance and operations reliability goals. |
| 5 | **Open Horizons?** | PASS | Enables consistent onboarding of future telemetry events. |

**Checks Summary**: 5/5 PASS

### Implementation

- Define schema registry and payload validators.
- Add docs drift comparison checks.
- Gate release on schema/docs alignment.

---

## ADR-005: Prevention-First Closure for Deferred Tests and Operational Self-Healing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | QA Lead, Operations Lead, Product Owner |

### Context

Deferred/skipped tests and unpracticed runbooks create latent release risk. Prior specs resolved urgent defects but left some paths weakly covered.

### Decision

Treat deferred/skipped-path closure and self-healing runbook drills as release-gated outcomes, not optional follow-ups.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Release-gated closure + drills (Chosen)** | Strong recurrence prevention and operational readiness | More verification workload | 9/10 |
| Best-effort closure post-release | Faster release cadence | High recurrence risk | 4/10 |
| Manual checklist only | Simpler process | Weak evidence and enforceability | 3.5/10 |

### Consequences

- Positive: known weak paths are either tested or explicitly approved with ownership.
- Positive: operators have validated runbooks before release.
- Tradeoff: additional CI/runtime overhead and planning effort.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prior lineage shows deferred paths can reintroduce failures. |
| 2 | **Beyond Local Maxima?** | PASS | Best-effort and manual alternatives evaluated. |
| 3 | **Sufficient?** | PASS | Explicit gates and drills directly reduce recurrence and MTTR risk. |
| 4 | **Fits Goal?** | PASS | Aligns with broadened prevention and operational resilience goals. |
| 5 | **Open Horizons?** | PASS | Establishes reusable verification discipline for future specs. |

**Checks Summary**: 5/5 PASS

### Implementation

- Build deferred/skipped-path inventory and closure tracker.
- Run operational drills for four failure classes.
- Record evidence and sign-off in checklist and implementation summary.

---

## Continuity Notes

- ADR-001 expands 006 scope while preserving architecture decisions from `002`.
- ADR-003 operationalizes defect-prevention lineage from `003` and `004` into state-integrity gates.
- ADR-002 and ADR-003 extend confidence behaviors from `005` across ranking and session-learning paths.
- ADR-004 and ADR-005 add governance and operations controls required for sustained reliability after implementation.

---

<!--
DECISION RECORD
Level 3+ ADR set aligned to broadened cross-system hardening scope and continuity requirements.
-->
