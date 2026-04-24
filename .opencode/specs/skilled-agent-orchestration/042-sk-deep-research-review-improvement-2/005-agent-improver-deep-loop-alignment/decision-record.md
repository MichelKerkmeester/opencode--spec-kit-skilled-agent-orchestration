---
title: "...agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/decision-record]"
description: "Consolidated decision record preserving the five accepted architectural choices from the improve-agent runtime-truth alignment."
trigger_phrases:
  - "005"
  - "agent improver adr"
  - "sk-improve-agent decision record"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Consolidated Runtime-Truth Alignment Decisions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | michelkerkmeester-barter |
| **Superseded Guidance** | Lifecycle wording later narrowed by `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md` |

### Context

Phase 005 introduced runtime-truth infrastructure for the improve-agent loop. The original packet spread the rationale across five ADRs. This closeout packet keeps those decisions intact but consolidates them under one template-compliant decision header so the packet validates cleanly while still preserving the substantive reasoning.

### Decision

The accepted decision set for Phase 005 is:

#### Decision Set 1: Keep journal emission in the orchestrator

- **Why**: the proposal agent stays side-effect free, preserving the evaluator-first model.
- **Evidence**: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` explicitly states the orchestrator-only constraint is preserved.

#### Decision Set 2: Reuse graph-style coverage tracking for improve-agent

- **Why**: improvement sessions needed explainable coverage without inventing an entirely separate persistence model.
- **Evidence**: `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` plus the `v1.1.0.0` release note describe the improvement-scoped mutation coverage graph.

#### Decision Set 3: Treat trajectory as a first-class convergence input

- **Why**: absolute scores alone can hide instability or short-lived spikes; trajectory data makes convergence more explainable.
- **Evidence**: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` and the runtime-truth playbook scenarios document dimension trajectory as a visible operator surface.

#### Decision Set 4: Keep parallel candidates opt-in

- **Why**: branching candidate exploration increases complexity and should not become the default path for every improve-agent run.
- **Evidence**: `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md`

#### Decision Set 5: Preserve backward compatibility through additive config defaults

- **Why**: the improve-agent runtime already existed in active use, so new runtime-truth fields had to remain additive.
- **Evidence**: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` states backward compatibility was verified; the later `v1.2.1.0` patch shows wording could still be corrected without reopening the runtime surface.

### Alternatives Considered

| Option | Pros | Cons | Outcome |
|--------|------|------|---------|
| Orchestrator-owned journal, additive helpers, optional parallel mode | Preserves existing evaluator-first model; keeps runtime changes additive | More moving parts across scripts and docs | Chosen |
| Let the target agent own journal writes | Simpler local event emission | Violates proposal-only boundary | Rejected |
| Keep improve-agent on a simpler non-graph path | Less implementation work | Leaves the loop opaque and misaligned with 042 runtime-truth goals | Rejected |
| Make parallel candidates the default | Broader exploration by default | Higher cost and complexity on every run | Rejected |
| Use hardcoded static target-profile wording as the durable contract | Easy to document | Drifted from later dynamic-mode positioning and would age poorly | Rejected for closeout wording |

### Consequences

**Positive**

- The phase shipped auditable helper modules instead of undocumented ad hoc logic.
- The packet can now point to current `sk-improve-agent` paths without losing the architectural rationale.
- The closeout can acknowledge later lifecycle wording corrections without invalidating the Phase 005 runtime delivery.

**Tradeoffs**

- Historical release text still exists and needed careful interpretation during closeout.
- The current packet has to distinguish between what Phase 005 shipped and what later follow-on releases narrowed or renamed.

### Verification

- [x] The five accepted decisions remain represented in this packet. `[EVIDENCE: decision sets 1-5 above]`
- [x] The packet uses one template-compliant ADR header instead of multiple custom top-level ADR headers. `[EVIDENCE: this file; strict validation]`
- [x] Later lifecycle wording drift is acknowledged rather than silently repeated. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`

### Rollback

If future packet curation needs the original ADR breakdown, the detailed historical wording remains recoverable from git history and the preserved scratch research file. This closeout record intentionally optimizes for current template compliance and accurate historical framing.
<!-- /ANCHOR:adr-001 -->
