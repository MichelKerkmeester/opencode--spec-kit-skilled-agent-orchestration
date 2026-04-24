---
title: "Implementation Plan [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan]"
description: "Deliver orchestrator-managed wave execution for deep research and deep review by adding segment planning, coordination-board tracking, and deterministic merge behavior on top of the Phase 002 graph substrate."
trigger_phrases:
  - "042.003"
  - "implementation plan"
  - "wave executor"
  - "segment planner"
  - "coordination board"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflows, CommonJS orchestration helpers, Markdown runtime contracts, JSONL artifacts |
| **Framework** | Spec Kit deep-loop orchestrator over LEAF research and review workers |
| **Storage** | Packet-local segment JSONL, reducer-owned `board.json`, a derived dashboard render, merged lineage outputs, and Phase 002 graph state |
| **Testing** | Vitest lifecycle and merge suites plus strict packet validation |

### Overview

This phase scales deep research and deep review by adding orchestrator-managed wave execution rather than agent-managed spawning. The delivery order is intentionally front-loaded around the biggest risk: first prove workflow fan-out/join capability on top of the current YAML engine, then ship v1 heuristic segmentation plus prepass artifacts, then layer v2 graph-enhanced segmentation once Phase 002 is operational, and only then harden merge and resume behavior for broader activation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Workflow fan-out/join capability is proven or an engine-extension path is chosen.
- [x] Phase 002 graph convergence is identified as the convergence authority for segments.
- [x] The LEAF-worker rule is fixed and non-negotiable.
- [x] Large-target triggers are defined for review and research.
- [x] Segment, board, and merge artifacts are clearly packet-local.

### Definition of Done

- [x] Deterministic segment planning exists for both review files and research domains.
- [x] `hotspot-inventory.json` and `domain-ledger.json` are defined as mandatory prepass artifacts.
- [x] Wave lifecycle ownership is explicit at the orchestrator or workflow layer.
- [x] Coordination-board state is documented as reducer-owned `board.json` with a derived dashboard render.
- [x] Merge behavior preserves provenance, conflict metadata, and explicit keyed identity.
- [x] Wave mode remains bounded to large targets and does not replace the default path.
- [x] Tests prove planner determinism, lifecycle correctness, merge idempotence, and resume behavior.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Segmented fan-out orchestration with packet-local state, reducer-owned execution ledgering, and deterministic keyed merge.

### Key Components

- **Fan-out/join proof layer**: establishes the canonical orchestration path for parallel dispatch and join on top of today's YAML workflow engine.
- **Wave segment planner**: produces stable v1 heuristic segments and optional v2 graph-enhanced segments.
- **Decomposition prepass**: emits `hotspot-inventory.json` for review and `domain-ledger.json` for research before any wave dispatch.
- **Wave lifecycle manager**: owns fan-out, join, prune, promote, merge, and resume transitions.
- **Wave convergence layer**: wraps Phase 002 graph signals for per-segment decisions.
- **Coordination board**: keeps `board.json` as the canonical execution ledger and a derived human-readable dashboard render.
- **Segment state and merge layer**: keeps segment JSONL replayable and mergeable into the main lineage.

### Data Flow

```text
Inventory target
  -> prove or select fan-out/join path
  -> emit hotspot-inventory.json or domain-ledger.json
  -> evaluate activation gates
  -> plan v1 heuristic segments
  -> optionally refine with v2 graph signals
  -> dispatch N parallel LEAF iterations
  -> evaluate each segment with graph-backed convergence
  -> prune converged or stuck segments
  -> promote important findings to board.json
  -> join segment waves
  -> merge segment lineage back into main packet state using explicit keys
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 3-pre: Workflow Fan-Out/Join Proof

**Scope**: REQ-000, REQ-002

**Why first**: Wave execution is blocked until the system can prove a safe fan-out/join path. The current YAML engine has no native parallel dispatch, so this proof must land before any segmentation or merge design can be treated as buildable.

**Files to change**:
- `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/deep-review.md`

**Verification strategy**:
- Prove the current YAML path cannot natively fan out or join safely.
- Prove one canonical replacement path, either helper-module orchestration or engine extension, can fan out and join without breaking reducer or resume contracts.

**Estimated effort**: Medium-High because it may require workflow-engine work before feature work can begin.

### Phase 3a: Heuristic Segmentation and Prepass Artifacts

**Scope**: REQ-001, REQ-003, REQ-004, REQ-006, REQ-007

**Why second**: Once fan-out/join is proven, the safest first implementation is a deterministic v1 based on inventories, thresholds, and explicit machine-owned artifacts rather than graph-coupled behavior.

**Files to change**:
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-review/references/state_format.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`

**Verification strategy**:
- Prove planner determinism from the same inventory input.
- Prove `hotspot-inventory.json` and `domain-ledger.json` are emitted before dispatch.
- Prove segment IDs and board row IDs remain stable across replay.
- Prove activation gates hold the runtime on the sequential path when thresholds or spread/diversity checks fail.

**Estimated effort**: Medium because the logic is concrete once the prepass contracts are explicit.

### Phase 3b: Graph-Enhanced Segmentation

**Scope**: REQ-001, REQ-005

**Why third**: v2 only becomes trustworthy after Phase 002 coverage-graph surfaces are operational. It should refine decomposition, not replace the heuristic baseline.

**Files to change**:
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`

**Verification strategy**:
- Prove v2 decomposition consumes Phase 002 graph signals and stays blocked if the graph is not operational.
- Prove graph-enhanced segmentation preserves stable segment identity relative to the v1 baseline.

**Estimated effort**: Medium because graph dependence is well-scoped but still contingent on Phase 002 readiness.

### Phase 3c: Lifecycle, Merge Proof, and Recovery Hardening

**Scope**: REQ-002, REQ-004, REQ-008, REQ-009

**Why fourth**: Merge correctness, join safety, and resume behavior are the operational guardrails that make wave mode safe to trust after the prerequisite and segmentation layers are in place.

**Files to change**:
- `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts`

**Verification strategy**:
- Prove segment-local lineage survives interruption and resume.
- Prove merge stays idempotent and preserves keyed identity, conflict, or dedupe metadata across repeated runs.
- Prove `board.json` remains reducer-owned and the dashboard remains a derived render.

**Estimated effort**: Medium-High because lifecycle, merge, and recovery now depend on the prerequisite orchestration path as well as keyed merge guarantees.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Segment planner, board helpers, convergence wrappers, keyed merge helpers | Vitest |
| Integration | Fan-out/join proof, YAML lifecycle sequencing, activation gates, and command-mode routing | Vitest |
| State/Replay | Segment JSONL isolation, merge idempotence, keyed identity, and resume | Vitest |
| Validation | Packet document structure and template compliance | `spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| YAML workflow engine fan-out/join capability | Internal | Red | Wave execution cannot begin until helper orchestration or engine extension is proven. |
| Phase 002 graph tools and convergence surfaces | Internal | Yellow | Phase 3b graph-enhanced segmentation and graph-backed pruning would be blocked. |
| Phase 001 resume and journal model | Internal | Green | Segment-level recovery would become inconsistent with existing runtime truth. |
| Deep research and review command workflows | Internal | Green | Wave mode would have no execution path. |
| Packet-local artifact discipline | Internal | Green | Segment, `board.json`, and merge outputs would become hard to replay or merge safely. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fan-out/join proof fails, wave execution produces unstable segments, incorrect merge results, or leaks complexity into default single-stream runs.
- **Procedure**: Disable wave mode in config or workflow routing, keep segment-planning helpers uninvoked, fall back to sequential execution, and preserve the single-stream runtime while prerequisite or merge issues are corrected under test.
- **Safety Note**: Rollback must keep prepass artifacts and segment artifacts readable for debugging even when wave mode is disabled.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 3-pre fan-out/join proof
  -> Phase 3a heuristic segmentation and prepass
  -> Phase 3b graph-enhanced segmentation
  -> Phase 3c lifecycle, merge, and recovery hardening
```

| Workstream | Depends On | Produces | Blocks |
|------------|------------|----------|--------|
| Phase 3-pre workflow proof | Existing YAML workflow engine and command flows | Canonical fan-out/join path | 3a, 3b, 3c |
| Phase 3a prepass and v1 planner | Phase 3-pre | Stable segments, inventories, `board.json` contract | 3b, 3c |
| Phase 3b graph-enhanced segmentation | Phase 3a plus Phase 002 graph readiness | v2 graph-aware segment refinement | 3c |
| Phase 3c lifecycle and merge hardening | Phases 3-pre through 3b | Safe wave execution, merge, and resume behavior | verification |
<!-- /ANCHOR:dependency-graph -->

---

### Effort Estimates

| Workstream | Estimate | Notes |
|------------|----------|-------|
| Phase 3-pre fan-out/join proof | Medium-High | The largest unknown is whether helper orchestration is sufficient or the YAML engine must be extended. |
| Phase 3a heuristic segmentation and prepass artifacts | Medium | Review-side work is concrete, but research still needs a new discovery ledger surface. |
| Phase 3b graph-enhanced segmentation | Medium | Depends on Phase 002 coverage graph being operational and stable enough to refine v1 safely. |
| Phase 3c lifecycle, merge, and recovery hardening | Medium-High | Join semantics, keyed merge guarantees, and resume safety all need integration and regression coverage. |
