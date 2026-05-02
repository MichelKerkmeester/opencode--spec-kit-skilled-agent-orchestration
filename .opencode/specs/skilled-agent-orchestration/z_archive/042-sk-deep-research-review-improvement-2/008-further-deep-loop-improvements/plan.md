---
title: "Implemen [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/plan]"
description: "Completed Level 3 implementation plan showing the delivered A-E passes and the closing-audit remediation that finalized Phase 008."
trigger_phrases:
  - "008"
  - "phase 8 plan"
  - "graph wiring plan"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Further Deep-Loop Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Primary Skills** | `sk-deep-research`, `sk-deep-review`, `sk-improve-agent` |
| **Shared Infrastructure** | `system-spec-kit` coverage-graph helpers, handlers, and tests |
| **Primary Evidence** | `v1.6.0.0`, `v1.3.0.0`, `v1.2.0.0`, `scratch/closing-review.md`, `c07c9fbcf`, `f99739742` |
| **Delivery Model** | Passes A-E followed by focused closing-audit remediation |
| **Packet Outcome** | Complete |

### Overview

The phase delivered in five major passes:

1. contract truth
2. graph wiring
3. reducer surfacing and replay consumers
4. fixtures and regression
5. release close-out

After those passes shipped, a focused closing review surfaced four remaining P1 issues. Those were closed in `c07c9fbcf`, and the final packet/release-readiness reconciliation landed in `f99739742`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Deep-research audit findings existed and were mapped into Phase 008 delivery. `[EVIDENCE: ../research/research.md]`
- [x] ADR decisions for graph regime, replay consumers, and tool routing were finalized before the implementation matured. `[EVIDENCE: commit 84a29f574; decision-record.md]`
- [x] The phase had bounded release surfaces across three skills and the shared graph stack. `[EVIDENCE: three Phase 008 changelogs]`

### Definition of Done

- [x] Research and review visibly consult the coverage graph on the live path. `[EVIDENCE: .opencode/changelog/12--sk-deep-research/v1.6.0.0.md; .opencode/changelog/13--sk-deep-review/v1.3.0.0.md]`
- [x] Improve-agent visibly emits journal events, enforces sample-size gates, and consumes replay artifacts. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md]`
- [x] Dedicated fixtures, tests, and playbooks were added. `[EVIDENCE: three changelogs; implementation-summary.md]`
- [x] The focused closing review was completed and the remaining release-readiness issues were remediated. `[EVIDENCE: scratch/closing-review.md; c07c9fbcf; f99739742]`
- [x] The packet now validates strictly under the current Level 3 contract. `[EVIDENCE: validate.sh --strict on this phase]`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Visible-path runtime truth backed by reducer-owned operator surfaces. The phase did not add a brand-new loop system; it wired the shipped helper surfaces into the actual workflows, reducers, and dashboards that operators use.

### Key Components

- Research workflow YAMLs and reducer surfaces
- Review workflow YAMLs and fail-closed reducer surfaces
- Improve-agent workflow YAMLs, reducer replay consumers, and sample-quality dashboard
- Shared coverage-graph convergence handler, query helpers, and tests
- Phase-local closing review and follow-up remediation commits

### Data Flow

Workflow emits normalized stop and graph events -> shared graph state is upserted and queried -> reducers surface graph, blocked-stop, replay, and sample-quality state -> release notes capture the shipped behavior -> closing audit verifies the release-readiness gaps and follow-on fixes close them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Truth

This pass normalized blocked-stop and pause-state emission on research and review workflows and wired improve-agent journal emission plus sample-size gates onto the visible path.

- [x] Research release captured blocked-stop and pause normalization. `[EVIDENCE: .opencode/changelog/12--sk-deep-research/v1.6.0.0.md]`
- [x] Review release captured the equivalent review-side contract truth. `[EVIDENCE: .opencode/changelog/13--sk-deep-review/v1.3.0.0.md]`
- [x] Improve-agent release captured journal wiring and corrected CLI usage. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md]`

### Phase 2: Graph Wiring

This pass made graph consultation real on the visible research and review paths and established the shared canonical graph regime.

- [x] ADR-001 selected the canonical graph approach. `[EVIDENCE: decision-record.md]`
- [x] Research and review releases both describe live graph upsert and convergence calls. `[EVIDENCE: v1.6.0.0; v1.3.0.0]`
- [x] Session isolation and graph-aware stop tests were added. `[EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts; graph-aware-stop.vitest.ts]`

### Phase 3: Reducer Surfacing and Replay

This pass made the new runtime state visible in operator-facing outputs.

- [x] Research reducer gained blocked-stop and graph-convergence surfacing. `[EVIDENCE: v1.6.0.0]`
- [x] Review reducer gained blocked-stop surfacing, fail-closed behavior, and repeated-finding split. `[EVIDENCE: v1.3.0.0]`
- [x] Improve-agent reducer gained replay consumers and sample-quality surfaces. `[EVIDENCE: v1.2.0.0]`

### Phase 4: Fixtures and Regression

This pass added durable test fixtures and scenario coverage.

- [x] All three skill families gained Phase 008 fixture or playbook coverage. `[EVIDENCE: three changelogs; implementation-summary.md]`
- [x] The dedicated graph and reducer suites were part of the shipped verification story. `[EVIDENCE: implementation-summary.md §Verification]`

### Phase 5: Release Close-out and Audit Remediation

This pass packaged the releases, captured the closing review, and closed the remaining release-readiness findings.

- [x] Release notes were written for all three skills. `[EVIDENCE: v1.6.0.0; v1.3.0.0; v1.2.0.0]`
- [x] The focused closing review was recorded in the phase scratch area. `[EVIDENCE: scratch/closing-review.md]`
- [x] The remaining P1 and release-readiness gaps were closed in follow-on commits. `[EVIDENCE: c07c9fbcf; f99739742]`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Release verification | Skill-level Phase 008 releases | `.opencode/changelog/12--sk-deep-research/v1.6.0.0.md`; `.opencode/changelog/13--sk-deep-review/v1.3.0.0.md`; `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md` |
| Dedicated Vitest coverage | Graph parity, session isolation, graph-aware stop, review fail-closed, improve-agent sample-size behavior | `implementation-summary.md` and the dedicated suite paths |
| Fixture smoke tests | Interrupted session, blocked-stop session, low-sample benchmark | `implementation-summary.md`; three release notes |
| Closing audit | Focused release-readiness review | `scratch/closing-review.md` |
| Post-audit remediation verification | Targeted fixes plus full-script verification | `c07c9fbcf`, `f99739742`, `implementation-summary.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep-research audit findings | Internal | Complete | Phase 008 would have had no evidence-backed target without them. |
| Canonical graph decision | Internal | Complete | Required before graph wiring and score surfacing could stabilize. |
| Release packaging | Internal | Complete | The shipped behavior is primarily evidenced through the three release notes. |
| Closing review artifact | Internal | Complete | Needed to explain why follow-on remediation commits exist. |
| Packet-root reconciliation | Internal | Complete | Final release-readiness surfaces were aligned in `f99739742`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a future audit determines the Phase 008 runtime or documentation chain is materially inconsistent.
- **Procedure**: inspect the phase-local release notes first, then the closing-review artifact, then the remediation commits `c07c9fbcf` and `f99739742` to determine whether the inconsistency belongs to the original phase or to its follow-on audit closure.
- **Documentation note**: this closeout pass is documentation-only; no runtime rollback is introduced here.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Contract Truth
      |
      v
Graph Wiring
      |
      v
Reducer Surfacing and Replay
      |
      v
Fixtures and Regression
      |
      v
Release Close-out and Audit Remediation
```

| Phase | Depends On | Enables |
|-------|------------|---------|
| Contract Truth | Audit findings | Visible-path fidelity |
| Graph Wiring | Contract Truth + ADR decisions | Trustworthy graph-backed stop behavior |
| Reducer Surfacing and Replay | Contract Truth + Graph Wiring | Operator-visible truth |
| Fixtures and Regression | Prior phases | Durable verification |
| Release Close-out and Audit Remediation | All prior phases | Final packet closure |

---

## L2: EFFORT ESTIMATION

| Phase | Relative Complexity | Delivered Outcome |
|-------|---------------------|-------------------|
| Contract Truth | High | Visible-path event fidelity |
| Graph Wiring | High | Active graph consultation on live loops |
| Reducer Surfacing and Replay | High | Operator-visible truth across all three skills |
| Fixtures and Regression | Medium | Durable audit coverage |
| Release Close-out and Audit Remediation | Medium | Final readiness closure |
| **Overall** | **High** | **Multi-pass shipped phase with audit follow-through** |

---

## L2: ENHANCED ROLLBACK

### Pre-Rollback Checklist

- [x] Identify the three Phase 008 release notes. `[EVIDENCE: v1.6.0.0; v1.3.0.0; v1.2.0.0]`
- [x] Identify the focused closing review and remediation commits. `[EVIDENCE: scratch/closing-review.md; c07c9fbcf; f99739742]`

### Rollback Notes

1. If a discrepancy concerns runtime behavior, start from the relevant skill release note and work forward through the remediation commits.
2. If a discrepancy concerns packet readiness or phase-root reporting, inspect `f99739742` first.
3. If a discrepancy concerns the closing review itself, inspect `scratch/closing-review.md` and the targeted fixes in `c07c9fbcf`.

### Data Reversal

- **Has data migrations?** Phase 008 introduced additive outputs and graph-session handling; this closeout pass adds no new migrations.
- **Reversal procedure**: none required for the packet rewrite itself.

---

## L3: DEPENDENCY GRAPH

```
Audit Findings
      |
      +--> Research Runtime Truth  ----+
      |                               |
      +--> Review Runtime Truth   ----+--> Shared Graph Wiring --> Reducer Surfacing
      |                               |                              |
      +--> Improve-Agent Wiring   ----+                              +--> Fixtures and Playbooks
                                                                     |
                                                                     +--> Release Notes
                                                                     |
                                                                     +--> Closing Review -> Remediation Commits
```

### Dependency Matrix

| Component | Reads | Writes | Consumer |
|-----------|-------|--------|----------|
| Research release | Runtime and packet evidence | Release note | Phase packet |
| Review release | Runtime and packet evidence | Release note | Phase packet |
| Improve-agent release | Runtime and packet evidence | Release note | Phase packet |
| Closing review | Shipped phase state | Phase-local scratch review | Packet closeout and remediation |
| Remediation commits | Closing review findings | Final fixes | Packet-root and phase closure |
