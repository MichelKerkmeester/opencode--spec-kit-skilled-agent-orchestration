---
title: "Decision Record: Gate E — Runtime Migration [system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/005-gate-e-runtime-migration/decision-record]"
description: "Architecture decisions for the Gate E rollout window, CLI handback timing, and legacy-cleanup posture."
trigger_phrases:
  - "decision record"
  - "gate e"
  - "runtime migration"
  - "cli handback"
  - "legacy cleanup"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Gate E — Runtime Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Batch CLI Handback Coordination in Gate E

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The resource map identifies 8 `cli-*` files that all document the same Memory Handback Protocol around `generate-context.js`. Gate C owns the runtime contract, so updating those external-facing files too early would create churn and could leave half the CLI surfaces describing a schema that no longer exists by the time `canonical` becomes the default.

### Constraints

- The 8 files must remain internally consistent because users treat them as one protocol, not four separate experiments.
- Gate E already owns the broad doc-parity batch, so the CLI files need to land where the final runtime truth is being published.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: update all 8 CLI handback files as one Gate E batch after the Gate C `generate-context.js` contract is settled.

**How it works**: Gate C finalizes the JSON schema and invocation behavior first. Gate E then rewrites each `cli-*` skill doc plus its prompt-template asset in one pass, verifies the wording matches the shipped contract, and closes the batch only when every CLI family says the same thing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gate E lockstep batch** | Lowest drift risk, matches the canonical rollout window, easy to verify as one protocol | Defers doc edits until the broader parity phase | 9/10 |
| Update during Gate C as code lands | Earlier documentation | High churn risk if the schema changes again before canonical |
| Stagger updates per CLI family | Smaller batches | Lets the four skill families drift and increases verification burden | 4/10 |

**Why this one**: Gate E is where the runtime contract becomes public truth. Batching the CLI handback files there keeps the external AI surfaces aligned with the same canonical moment the rest of the repo updates.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cross-AI handback docs move in one coherent batch.
- Verification is simpler because one checklist can prove the whole protocol.

**What it costs**:
- The CLI docs stay on the old wording until Gate E begins. Mitigation: treat Gate C output as internal contract proof, not public closeout.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gate C contract changes late | High | Re-freeze the schema before the Gate E batch starts |
| One CLI family misses the batch | High | Track all 8 files explicitly in the resource-map matrix |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Resource-map section 8.2 makes the shared protocol explicit |
| 2 | **Beyond Local Maxima?** | PASS | We considered Gate C timing and staggered updates |
| 3 | **Sufficient?** | PASS | One lockstep batch solves the drift problem without new tooling |
| 4 | **Fits Goal?** | PASS | Gate E is the canonical-publication phase |
| 5 | **Open Horizons?** | PASS | The batch can absorb final schema additions without reworking later gates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Rewrite the `cli-claude-code`, `cli-codex`, `cli-copilot`, and `cli-gemini` skill docs
- Rewrite the matching prompt-template assets
- Verify each file matches the same `generate-context.js` schema and follow-up indexing story

**How to roll back**: revert the 8-file batch together and restore the last schema-compatible wording that matches the active runtime contract.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Keep Gate E Closed in `canonical` by Default

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet implementer |

---

### Context

Iteration 034 defines `canonical` and `legacy_cleanup` as separate states, and iteration 040 treats Gate E as the proving window for `canonical`, not as the cleanup phase. Moving into `legacy_cleanup` too early would remove the legacy verification substrate before the permanence evidence and Gate F approval exist.

### Constraints

- Gate E requires at least 7 healthy days in `canonical`, while `legacy_cleanup` depends on the longer permanence decision path.
- Rollback must stay available during the runtime proving window, especially if week-3 evidence exposes a correctness or archive-fallback issue.

---

### Decision

**We chose**: close Gate E in `canonical` unless Gate F permanence evidence is already approved and explicitly authorizes the optional cleanup step.

**How it works**: the phase proves the canonical default, finishes the doc-parity work, and leaves the legacy path read-only but available as rollback substrate. If the separate permanence review later clears `legacy_cleanup`, that move is handled as Gate F work, not hidden inside Gate E closeout.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Close in `canonical` by default** | Matches the state machine, preserves rollback safety, respects Gate F ownership | Leaves one more step after Gate E | 10/10 |
| Move to `legacy_cleanup` during week 3 automatically | Faster cleanup | Breaks the separation between proving and permanence, weakens rollback safety | 3/10 |
| Stay in `canonical` forever with no cleanup path | Maximum safety | Ignores the planned permanence decision and leaves cleanup undefined | 6/10 |

**Why this one**: It matches the research-backed state machine exactly. Gate E proves the new default; Gate F decides whether the old path can actually be retired.

---

### Consequences

**What improves**:
- Gate E closeout stays honest about what has and has not been retired.
- The rollback substrate remains available during the most sensitive migration window.

**What it costs**:
- Cleanup is deferred into a later gate. Mitigation: keep the optional handoff explicit in tasks and checklist language.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Teams assume cleanup already happened | Medium | Repeat the state distinction in docs, tasks, and checklist language |
| Gate F gets starved because Gate E feels "good enough" | Medium | Carry an explicit cleanup recommendation or deferral note into the handoff |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Iteration 034 separates `canonical` from `legacy_cleanup` explicitly |
| 2 | **Beyond Local Maxima?** | PASS | We evaluated immediate cleanup and indefinite canonical hold |
| 3 | **Sufficient?** | PASS | One explicit state boundary keeps rollout and permanence work distinct |
| 4 | **Fits Goal?** | PASS | Gate E is the runtime proving window, not the retirement gate |
| 5 | **Open Horizons?** | PASS | Gate F still has room to approve cleanup or defer it with evidence |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Keep tasks, checklist, and phase-closeout language centered on healthy time in `canonical`
- Treat `legacy_cleanup` as optional handoff material for Gate F
- Preserve rollback documentation until permanence is formally approved

**How to roll back**: if a later decision wants Gate E to include cleanup, revise this ADR, update the checklist, and prove the longer permanence conditions before changing the gate boundary.
