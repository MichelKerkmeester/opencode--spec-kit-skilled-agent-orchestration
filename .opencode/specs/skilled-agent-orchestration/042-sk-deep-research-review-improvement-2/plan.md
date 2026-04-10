---
title: "Implementation Plan: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Parent implementation overview for the four child phases that deliver runtime truth, semantic coverage, wave execution, and offline optimization."
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
| **Framework** | Spec Kit deep-loop products coordinated through four child implementation phases |
| **Storage** | Packet-local runtime artifacts plus child-phase planning packets |
| **Testing** | Phase-specific Vitest coverage plus strict spec validation |

### Overview

This parent plan is now the coordination surface for four top-level phases. The detailed implementation sequencing, sub-phases, and file lists live in the child folders. The parent plan tracks only the cross-phase order: establish runtime truth first, add semantic coverage next, scale to large-target orchestration third, and finish with offline optimization where only deterministic `4a` work is currently active.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The parent packet is decomposed into four child phases with linked specs, plans, and tasks.
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
  -> Phase 4: Offline Loop Optimizer
```

### Milestones

| Milestone | Exit Condition | Linked Phase |
|-----------|----------------|--------------|
| **M1** | Phase 1 complete and validated | Runtime truth foundation |
| **M2** | Phase 2 complete and validated | Semantic coverage graph |
| **M3** | Phase 3 complete and validated | Wave executor |
| **M4** | Phase 4a complete and validated | Offline deterministic optimizer |

### Consolidated Effort

| Area | Effort Posture |
|------|----------------|
| **Phase 1** | Largest foundation wave; carries the heaviest contract and verification load |
| **Phase 2** | Large integration wave; graph reuse plus new MCP/reducer seams |
| **Phase 3** | Medium-high orchestration wave with a hard prerequisite proof |
| **Phase 4a** | Narrower implementation wave; offline and advisory-only by design |
| **Phase 4b** | Deferred; estimate intentionally withheld until prerequisites exist |

**Active total estimate**: approximately 33-39 focused implementation sessions across Phases 1, 2, 3, and 4a.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Scope Summary | Estimated Effort | Dependencies | Key Deliverables | Child Plan |
|-------|---------------|------------------|--------------|------------------|------------|
| **Phase 1: Runtime Truth Foundation** | Stop contracts, legal STOP, blocked-stop persistence, resume lineage, journals, observability groundwork, semantic convergence, reducer ownership, agent cleanup | 10-13 focused sessions | None | Shared stop-truth contract, continuation lineage, behavior/parity foundation, Phase 1 checklist + ADRs | [./001-runtime-truth-foundation/plan.md](./001-runtime-truth-foundation/plan.md) |
| **Phase 2: Semantic Coverage Graph** | Reuse graph primitives, add `deep-loop-graph.sqlite`, expose four MCP tools, define reducer/MCP seam, add graph event contracts | 12 focused sessions | Phase 1 | Shared graph libs, MCP handlers/tools, reducer integration seam, graph convergence signals | [./002-semantic-coverage-graph/plan.md](./002-semantic-coverage-graph/plan.md) |
| **Phase 3: Wave Executor** | Prove fan-out/join, add deterministic and graph-enhanced segmentation, activate large-target wave mode, preserve keyed merge and board ownership | 8-10 focused sessions | Phases 1-2 | Fan-out/join proof, segment planner, `board.json`, keyed merge, wave resume tests | [./003-wave-executor/plan.md](./003-wave-executor/plan.md) |
| **Phase 4: Offline Loop Optimizer** | `4a` deterministic replay/config tuning now; `4b` prompt/meta optimizer deferred | 3-4 focused sessions for `4a`; `4b` TBD | Phases 1-3 | Replay corpus, rubric, deterministic replay runner, advisory-only promotion, deferred-track guardrails | [./004-offline-loop-optimizer/plan.md](./004-offline-loop-optimizer/plan.md) |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Parent Expectation |
|-------|--------------------|
| **Validation** | Each child phase must remain `validate.sh --strict` clean |
| **Behavioral** | Runtime truth, wave execution, and optimizer safety must all be backed by executable tests before closeout |
| **Parity/Contract** | Canonical surfaces and mirrors must remain aligned where child phases call for it |
| **Replay** | Replayable artifacts are a shared assumption across Phases 1, 3, and 4 |
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

Parent rollback rule: later phases should be reversible without invalidating the planning basis of earlier completed phases.
<!-- /ANCHOR:rollback -->
