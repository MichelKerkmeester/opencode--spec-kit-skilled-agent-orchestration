---
title: "Implementation Plan: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Parent implementation overview for eight child phases plus closing-audit remediation across runtime truth, semantic coverage, wave execution, offline optimization, and follow-on hardening."
trigger_phrases:
  - "042"
  - "implementation plan"
  - "parent overview"
  - "phase plan"
  - "deep research"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown planning docs, YAML workflows, CommonJS helpers, TypeScript MCP server code, JSON/JSONL artifacts, Vitest suites |
| **Framework** | Spec Kit deep-loop products coordinated through eight child implementation phases plus archived closing-audit remediation |
| **Storage** | Packet-local runtime artifacts plus child-phase planning packets and review archives |
| **Testing** | Phase-specific Vitest coverage, workflow contract checks, and strict spec validation |

### Overview

This parent plan is the coordination surface for the delivered eight-phase topology. Phases 1-4 established the runtime foundations, graph substrate, wave execution path, and offline optimizer boundary; Phases 5-8 hardened the shipped deep-loop surfaces against the residual contract drift that remained after the foundation work landed. The detailed implementation sequencing stays in the child folders. The parent plan tracks cross-phase order, handoffs, verification posture, and the post-phase-008 closing-audit remediation lane.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The parent packet is decomposed into eight child phases with linked specs, plans, and tasks.
- [x] Each top-level phase has a bounded scope and named predecessor relationship.
- [x] Deferred work is isolated to Phase 4b instead of being mixed into active implementation.
- [x] Parent docs are positioned as overview/index documents rather than duplicate implementation packets.

### Phase-Completion Gates

| Phase | Completion Gate |
|-------|-----------------|
| **Phase 1** | Runtime truth contracts, continuation lineage, reducer ownership boundaries, and parent/child validation are aligned |
| **Phase 2** | Coverage graph helpers, storage, MCP tools, reducer seam, and graph event contracts are aligned |
| **Phase 3** | Fan-out/join proof, activation gates, keyed merge, reducer-owned board, and wave validation are aligned |
| **Phase 4a** | Replay corpus, deterministic scoring/search, advisory promotion, and optimizer boundary docs are aligned |
| **Phase 4b** | Remains blocked until replay fixtures, behavioral suites, and multi-family corpus prerequisites are met |
| **Phase 5** | sk-improve-agent parity lands with journal wiring, runtime-truth contracts, and advisory optimizer alignment |
| **Phase 6** | Coverage-graph test suites and playbook surfaces are aligned across runtime and docs |
| **Phase 7** | Graph-aware stop-gate wiring and fail-closed reducer reconciliation are aligned in both loop products |
| **Phase 8** | Follow-on runtime hardening, release packaging, and phase-008 remediation are aligned before closing audit |
| **Closing Audit** | Archived review findings are either absorbed into Lanes 1-5 remediation or left explicitly open with release-ready justification |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Phase-gated delivery with child-packet ownership of detail and parent-packet ownership of sequencing, milestones, and handoffs.

### Phase Dependency Graph

```text
Phase 1: Runtime Truth Foundation
  -> Phase 2: Semantic Coverage Graph
    -> Phase 3: Wave Executor
      -> Phase 4a: Offline Loop Optimizer
        -> Phase 5: Agent-Improver Deep-Loop Alignment
          -> Phase 6: Graph Testing and Playbook Alignment
            -> Phase 7: Graph-Aware Stop Gate
              -> Phase 8: Further Deep-Loop Improvements
                -> Closing Audit + Lane 1-5 Remediation

Phase 4b remains explicitly deferred until its prerequisites are real.
```

### Milestones

| Milestone | Exit Condition | Linked Phase |
|-----------|----------------|--------------|
| **M1** | Phase 1 complete and validated | Runtime truth foundation |
| **M2** | Phase 2 complete and validated | Semantic coverage graph |
| **M3** | Phase 3 complete and validated | Wave executor |
| **M4** | Phase 4a complete and validated | Offline deterministic optimizer |
| **M5** | Phase 5 complete and validated | Agent-improver deep-loop alignment |
| **M6** | Phase 6 complete and validated | Graph testing and playbook alignment |
| **M7** | Phase 7 complete and validated | Graph-aware stop gate |
| **M8** | Phase 8 complete and validated | Further deep-loop improvements |
| **M9** | Closing audit archived and all routed remediation landed or explicitly tracked | Packet closeout |

### Consolidated Effort

| Area | Effort Posture |
|------|----------------|
| **Phases 1-2** | Largest foundation waves; contract and graph reuse carried the heaviest verification load |
| **Phases 3-4a** | Medium-high orchestration and optimizer waves with hard prerequisite boundaries |
| **Phases 5-8** | Follow-on hardening waves focused on visible runtime/doc parity and release packaging |
| **Closing Audit** | Independent read-only release gate whose findings routed into five remediation lanes |

**Active total estimate**: delivered as eight focused child phases plus one archived closing-audit remediation pass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Scope Summary | Dependencies | Key Deliverables | Child Plan |
|-------|---------------|--------------|------------------|------------|
| **Phase 1: Runtime Truth Foundation** | Stop contracts, legal STOP, blocked-stop persistence, resume lineage, journals, observability groundwork, semantic convergence, reducer ownership, agent cleanup | None | Shared stop-truth contract, continuation lineage, behavior/parity foundation, Phase 1 checklist + ADRs | [./001-runtime-truth-foundation/plan.md](./001-runtime-truth-foundation/plan.md) |
| **Phase 2: Semantic Coverage Graph** | Reuse graph primitives, add `deep-loop-graph.sqlite`, expose four MCP tools, define reducer/MCP seam, add graph event contracts | Phase 1 | Shared graph libs, MCP handlers/tools, reducer integration seam, graph convergence signals | [./002-semantic-coverage-graph/plan.md](./002-semantic-coverage-graph/plan.md) |
| **Phase 3: Wave Executor** | Prove fan-out/join, add deterministic and graph-enhanced segmentation, activate large-target wave mode, preserve keyed merge and board ownership | Phases 1-2 | Fan-out/join proof, segment planner, `board.json`, keyed merge, wave resume tests | [./003-wave-executor/plan.md](./003-wave-executor/plan.md) |
| **Phase 4: Offline Loop Optimizer** | `4a` deterministic replay/config tuning now; `4b` prompt/meta optimizer deferred | Phases 1-3 | Replay corpus, rubric, deterministic replay runner, advisory-only promotion, deferred-track guardrails | [./004-offline-loop-optimizer/plan.md](./004-offline-loop-optimizer/plan.md) |
| **Phase 5: Agent-Improver Deep-Loop Alignment** | Bring sk-improve-agent into parity with the frozen stop-reason taxonomy, journal wiring, and advisory optimizer contract | Phases 1-4a | Journal emission contract, runtime-truth-aligned docs, advisory optimizer parity | [./005-agent-improver-deep-loop-alignment/plan.md](./005-agent-improver-deep-loop-alignment/plan.md) |
| **Phase 6: Graph Testing and Playbook Alignment** | Expand coverage-graph tests and operator playbook guidance so runtime and docs tell the same story | Phases 2, 5 | Additional Vitest coverage, playbook scenarios, discovery-surface updates | [./006-graph-testing-and-playbook-alignment/plan.md](./006-graph-testing-and-playbook-alignment/plan.md) |
| **Phase 7: Graph-Aware Stop Gate** | Wire graph convergence into both loop workflows and reconcile fail-closed reducer behavior with visible state logs | Phases 1-6 | Workflow wiring, reducer reconciliation, runtime-truth-aligned state-log docs | [./007-graph-aware-stop-gate/plan.md](./007-graph-aware-stop-gate/plan.md) |
| **Phase 8: Further Deep-Loop Improvements** | Land the 12 Codex research recommendations plus the four phase-008 closing-audit P1 fixes | Phases 1-7 | Release packaging, additional tests/playbooks, phase-008 remediation inputs | [./008-further-deep-loop-improvements/plan.md](./008-further-deep-loop-improvements/plan.md) |
| **Closing Audit + Remediation** | Run the post-phase-008 release gate and absorb its 16 findings into the same packet | Phases 1-8 | Archived review report, Lane 1-5 remediation, parent closeout sync | [./review/archive-rvw-2026-04-11/review-report.md](./review/archive-rvw-2026-04-11/review-report.md) |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Parent Expectation |
|-------|--------------------|
| **Validation** | Each child phase must remain `validate.sh --strict` clean |
| **Behavioral** | Runtime truth, graph convergence, wave execution, and optimizer safety must all be backed by executable tests before closeout |
| **Parity/Contract** | Canonical surfaces and mirrors must remain aligned where child phases call for it |
| **Replay** | Replayable artifacts are a shared assumption across Phases 1, 3, 4, and the closing audit |
| **Release Gate** | The archived closing audit remains the final independent review surface for packet closeout |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Consolidated research packet | Internal | Green | Parent rationale and phase scoping lose their evidence basis |
| Phase 1 contract lock | Internal | Green (complete) | Blocks every downstream phase |
| Phase 2 coverage graph readiness | Internal | Green (complete) | Blocks graph-enhanced wave behavior |
| Fan-out/join proof on current workflow engine | Internal | Green (proven) | Blocks Phase 3 implementation beyond planning |
| Replay fixtures + behavioral suites for optimizer graduation | Internal | Yellow | Keeps Phase 4b blocked and Phase 4a advisory-only |
| Phase 5 journal/runtime-truth parity | Internal | Green (complete) | Blocks honest operator-facing improve-agent docs |
| Phase 6 test/playbook parity | Internal | Green (complete) | Blocks trustworthy release-readiness evidence |
| Phase 7 graph-aware stop-gate wiring | Internal | Green (complete) | Blocks fail-closed graph convergence behavior |
| Phase 8 release packaging + remediation inputs | Internal | Green (complete) | Blocks closing-audit readiness |
| Archived closing audit report | Internal | Green (complete) | Removes the authoritative source for the Lane 1-5 remediation mapping |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Phase | Rollback Posture |
|-------|------------------|
| **Phase 1** | Revert runtime-truth changes as a bounded contract group before touching later phases |
| **Phase 2** | Disable graph-backed convergence and fall back to Phase 1 runtime truth if graph integration regresses |
| **Phase 3** | Disable wave activation and preserve the default single-stream path |
| **Phase 4** | Keep optimizer outputs advisory-only and leave canonical configs unchanged |
| **Phases 5-8** | Revert follow-on hardening by lane/phase while preserving the earlier foundations |
| **Closing Audit** | Preserve the archived report even if remediation is rolled back so the packet retains its release-gate evidence trail |

Parent rollback rule: later phases should be reversible without invalidating the planning basis of earlier completed phases.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Runtime truth foundation complete | Phase 1 validated; stop-reason taxonomy, legal-stop gate, resume lineage, and reducer ownership aligned across both loops | Phase 1 closeout |
| M2 | Semantic coverage graph complete | Phase 2 validated; `deep-loop-graph.sqlite`, four MCP tools, reducer/MCP contract, and graph event shapes in place | Phase 2 closeout |
| M3 | Wave executor complete | Phase 3 validated; fan-out/join proof, deterministic + graph-enhanced segmentation, keyed merge, and activation gates wired | Phase 3 closeout |
| M4 | Offline deterministic optimizer complete | Phase 4a validated; replay corpus, multi-dim rubric, advisory-only candidate patches, audit trails shipped with `4b` explicitly blocked | Phase 4a closeout |
| M5 | Agent-improver alignment complete | Phase 5 validated; journal wiring, runtime-truth docs, and advisory optimizer contract aligned | Phase 5 closeout |
| M6 | Graph testing and playbook alignment complete | Phase 6 validated; coverage-graph tests and operator playbooks aligned | Phase 6 closeout |
| M7 | Graph-aware stop gate complete | Phase 7 validated; graph convergence workflow wiring and fail-closed reconciliation aligned | Phase 7 closeout |
| M8 | Further deep-loop improvements complete | Phase 8 validated; research/review/improve-agent follow-on hardening and phase-008 remediation landed | Phase 8 closeout |
| M9 | Closing-audit remediation complete | Archived closing audit preserved and all 16 findings routed into Lane 1-5 remediation or explicit residual-risk tracking | Packet closeout |
<!-- /ANCHOR:milestones -->
