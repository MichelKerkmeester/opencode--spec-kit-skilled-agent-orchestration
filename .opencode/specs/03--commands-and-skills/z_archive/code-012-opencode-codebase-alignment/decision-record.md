---
title: "Decision Record: OpenCode Codebase Alignment [012-opencode-codebase-alignment/decision-record]"
description: "The mission scope prioritizes consistency and correctness in touched files across TypeScript, JavaScript, Python, Shell, JSON, and JSONC. Broad refactors would increase semantic..."
trigger_phrases:
  - "decision"
  - "record"
  - "opencode"
  - "codebase"
  - "alignment"
  - "decision record"
  - "031"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: OpenCode Codebase Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Prefer Behavior-Preserving Alignment Over Broad Refactor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | OpenCode maintainers |

### Context

The mission scope prioritizes consistency and correctness in touched files across TypeScript, JavaScript, Python, Shell, JSON, and JSONC. Broad refactors would increase semantic drift risk, enlarge review surfaces, and weaken rollback reliability. Existing requirements in `spec.md` and sequencing in `plan.md` require behavior preservation and local, KISS-first edits.

### Constraints
- Runtime behavior and public contracts must remain stable for touched paths.
- Scope is restricted to standards alignment and in-scope bug fixes only.
- Review and rollback must remain practical at batch granularity.

### Decision

**Summary**: Alignment work is constrained to non-semantic edits plus local defect fixes required for correctness.

**Details**: Each changed file must be justifiable as either standards alignment or an in-scope bug fix discovered during alignment. If a necessary fix requires broad restructuring, the change is split and tracked as a separate follow-up instead of being folded into this mission.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: Behavior-preserving alignment** | Lowest regression risk; clear review intent; revert-safe batches | Leaves some structural debt for later work | 9/10 |
| Broad refactor while aligning | Could reduce long-term duplication sooner | High drift risk; large diffs; rollback complexity | 5/10 |
| Defer all fixes and do style-only edits | Very low immediate change risk | Preserves known defects; weakens mission value | 6/10 |

**Why Chosen**: This option best satisfies REQ-001, REQ-002, and REQ-012 while preserving delivery safety.

### Consequences

**Positive**:
- Maintains runtime stability while improving consistency.
- Keeps review, verification, and rollback tractable.

**Negative**:
- Some architectural cleanup is intentionally deferred.
- More follow-up work may be required after alignment completes.

**Accepted Trade-Offs**:
- Accept temporary structural imperfections to minimize runtime risk now.
- Accept additional future tasks instead of expanding current scope.

### Implementation Implications

- Every batch maps each changed file to alignment or defect-fix intent.
- Cross-cutting refactors are rejected in this mission unless separately scoped.
- Defect fixes remain local to touched files and include before/after evidence.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| **Necessary** | PASS | Directly addresses uneven standards and defect risk in touched files. |
| **Alternatives** | PASS | Compared against broad refactor and style-only options with explicit trade-offs. |
| **Sufficiency** | PASS | Small, local edits are enough to meet mission requirements without architecture churn. |
| **Fit-Goal** | PASS | Exactly aligned with behavior-preserving scope and KISS constraints. |
| **Long-Term Impact** | PASS | Preserves system stability now and leaves a clean path for separately governed refactors later. |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use a Batched Autonomous Execution Model

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | OpenCode maintainers |

### Context

The mission spans multiple languages and script-heavy operational surfaces. Fully serial, file-by-file execution is slow and increases context switching, while fully unconstrained parallelism increases conflict and regression risk. The spec and plan already define workstreams, batch boundaries, and notify-only versus hard-blocking checkpoints.

### Constraints
- Parallelism is allowed only for non-overlapping manifests.
- Each batch must remain independently testable and independently revertible.
- Hard-blocking checkpoints cannot be bypassed by autonomous progress.

### Decision

**Summary**: Execute in autonomous, bounded batches with controlled parallelism per workstream.

**Details**: Work proceeds without pause on notify-only checkpoints and pauses at hard-blocking checkpoints (baseline confirmation, verification review, launch approval, scope change). Parallel execution is permitted only where path overlap and contract coupling are absent.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: Batched autonomous model** | Fast delivery with explicit safety boundaries; predictable evidence collection | Requires strict discipline on manifests and gate handling | 9/10 |
| Fully serial manual progression | Lowest coordination complexity | Slower throughput; higher operator overhead | 7/10 |
| Fully parallel free-form execution | Maximum short-term speed | High merge risk; unclear accountability and rollback | 4/10 |

**Why Chosen**: It balances speed and safety for multi-language alignment without sacrificing verification control.

### Consequences

**Positive**:
- Improves throughput while keeping failure domains small.
- Produces consistent, batch-level evidence for review.

**Negative**:
- Requires explicit stream orchestration and manifest hygiene.
- Coordination overhead rises when dependencies are misclassified.

**Accepted Trade-Offs**:
- Accept moderate orchestration overhead to prevent high-cost regressions.
- Accept occasional stream pauses at hard-blocking checkpoints to preserve governance.

### Implementation Implications

- Enforce batch size and stream boundaries from `plan.md` before edits.
- Record per-batch command outcomes and requirement mapping.
- Block downstream batches when upstream failures are unresolved.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| **Necessary** | PASS | Multi-stream scope needs bounded autonomy to complete within practical time. |
| **Alternatives** | PASS | Serial and free-form parallel models were evaluated with explicit risks. |
| **Sufficiency** | PASS | Batch boundaries + checkpoints sufficiently constrain execution risk. |
| **Fit-Goal** | PASS | Matches execution protocol and workstream design already defined in spec artifacts. |
| **Long-Term Impact** | PASS | Creates reusable operating pattern for future alignment missions. |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Trigger Standards Reconciliation Only on Proven Mismatch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | OpenCode maintainers |

### Context

The mission treats `.opencode/skill/sk-code--opencode` as the normative standard source. However, some runtime constraints may reveal cases where literal rule application is unsafe or incorrect. Updating standards without strong evidence risks policy churn and inconsistent guidance.

### Constraints
- Standards updates are allowed only when mismatch evidence is concrete and reproducible.
- Reconciliation must be explicit: `docs update` or `documented exception`.
- Any standards change requires re-verification of affected streams.

### Decision

**Summary**: Only invoke standards reconciliation when a verified standards-vs-runtime mismatch is demonstrated.

**Details**: A mismatch log must include code evidence, failed/unsafe application rationale, and selected reconcile path. WS-STANDARDS updates are conditional work and are not used for policy expansion outside proven mission needs.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: Evidence-triggered reconciliation** | Stable standards baseline; avoids unnecessary doc churn; traceable exceptions | Requires disciplined evidence collection | 9/10 |
| Proactively rewrite standards during alignment | Might improve docs breadth quickly | Scope creep; unvalidated guidance changes | 5/10 |
| Never update standards in this mission | Prevents policy movement risk | Leaves known contradictions unresolved | 6/10 |

**Why Chosen**: This method preserves standards authority while allowing targeted, evidence-backed correction.

### Consequences

**Positive**:
- Keeps standards credible and synchronized with validated runtime reality.
- Prevents speculative policy drift during implementation.

**Negative**:
- Some ambiguities remain until evidence is gathered.
- Reconciliation work may add additional verification steps.

**Accepted Trade-Offs**:
- Accept slower standards updates in exchange for higher correctness confidence.
- Accept conditional WS-STANDARDS overhead only when triggered by proof.

### Implementation Implications

- Create and maintain a mismatch log tied to `T018-T021` flow.
- Require explicit reconciliation decision records per mismatch.
- Re-run impacted stream checks after standards updates or declared exceptions.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| **Necessary** | PASS | Prevents uncontrolled policy changes while addressing real contradictions. |
| **Alternatives** | PASS | Evaluated proactive rewrite and no-update extremes. |
| **Sufficiency** | PASS | Trigger + decision path + re-verification fully covers reconciliation risk. |
| **Fit-Goal** | PASS | Supports REQ-010 and conditional WS-7 scope without scope expansion. |
| **Long-Term Impact** | PASS | Improves standards trust with a repeatable correction mechanism. |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Enforce Verification and Rollback Gating Before Progression

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | OpenCode maintainers |

### Context

Alignment edits across scripts and runtime paths can produce subtle regressions, especially in shell behavior, command contracts, and cross-language interaction points. Without strict gates and rollback discipline, failures can cascade across workstreams and obscure root cause.

### Constraints
- No batch may advance with unresolved G2 or G3 failures.
- Final completion requires G4 pass and full verification ledger.
- Rollback must be non-destructive and bounded to failing batch scope.

### Decision

**Summary**: Apply explicit baseline, batch, stream, and final release gates, with mandatory rollback readiness per batch.

**Details**: Progression is blocked on failed gates, and failing batches are reverted or re-scoped before downstream work continues. Each batch carries a rollback recipe and evidence so failures can be isolated quickly without broad repository disruption.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: Strict verification + rollback gates** | High reliability; deterministic progression; strong auditability | More process overhead per batch | 10/10 |
| End-of-project verification only | Lower short-term overhead | Late defect discovery; expensive rollback and triage | 3/10 |
| Verification without rollback rehearsal | Moderate speed | Weak recovery confidence when failures occur | 6/10 |

**Why Chosen**: Reliability and controlled recovery are mandatory for a script-sensitive, multi-language mission.

### Consequences

**Positive**:
- Catches regressions early and near their source.
- Keeps recovery fast and bounded when failures happen.

**Negative**:
- Adds recurring verification cost to every batch.
- Requires disciplined evidence recording to remain effective.

**Accepted Trade-Offs**:
- Accept slower per-batch cadence to reduce probability and blast radius of regressions.
- Accept operational rigor over convenience for critical script surfaces.

### Implementation Implications

- Enforce G0-G4 sequence from `plan.md` and checklist hard blockers.
- Maintain a per-batch verification ledger with commands, outcomes, and timestamps.
- Keep commits and merge units aligned to rollback boundaries.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| **Necessary** | PASS | Multi-language, script-critical changes require immediate regression control. |
| **Alternatives** | PASS | Compared against end-only verification and no-rehearsal rollback patterns. |
| **Sufficiency** | PASS | Gate chain plus rollback rehearsal is sufficient to manage identified risks. |
| **Fit-Goal** | PASS | Directly supports REQ-001, REQ-011, and rollback boundary requirements. |
| **Long-Term Impact** | PASS | Establishes reusable quality and recovery discipline for future missions. |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-004 -->

---

## Decision Summary

| ADR | Title | Status |
|-----|-------|--------|
| ADR-001 | Prefer Behavior-Preserving Alignment Over Broad Refactor | Accepted |
| ADR-002 | Use a Batched Autonomous Execution Model | Accepted |
| ADR-003 | Trigger Standards Reconciliation Only on Proven Mismatch | Accepted |
| ADR-004 | Enforce Verification and Rollback Gating Before Progression | Accepted |

These ADRs govern implementation sequencing, risk control, and standards integrity for the OpenCode codebase alignment mission.
