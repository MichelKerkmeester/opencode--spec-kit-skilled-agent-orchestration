---
title: "Feature Specification [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec]"
description: "Define orchestrator-managed parallel wave execution for deep research and deep review so large targets can be segmented, converged, and merged without turning LEAF agents into sub-agent managers."
trigger_phrases:
  - "042.003"
  - "wave executor"
  - "segment planner"
  - "coordination board"
  - "parallel deep loop"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 003 adds orchestrator-managed parallel wave execution so deep research and deep review can handle very large targets without abandoning the LEAF-worker model. It formalizes deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the coverage-graph foundation from Phase 002.

Critical prerequisite: workflow fan-out/join capability must be proven before wave execution can be built. The current YAML workflow engine has no native parallel dispatch, so this phase must first establish either helper-module orchestration that safely performs fan-out/join outside the YAML surface or an explicit engine extension that makes parallel dispatch and join first-class.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-10 |
| **Branch** | `042-sk-deep-research-review-improvement-2` |
| **Parent Packet** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 3 of 4 |
| **Predecessor** | `../002-semantic-coverage-graph/spec.md` |
| **Successor** | `../004-offline-loop-optimizer/spec.md` |
| **Handoff Criteria** | Phase 004 can replay wave runs as deterministic, segment-aware traces with stable board and merge artifacts. |

<!-- ANCHOR:phase-context -->
**Phase Context**: This phase adds orchestrator-managed parallel batches on top of the coverage-graph substrate from Phase 002. The goal is scale without architectural drift: the workers stay LEAF, while orchestration logic handles segmentation, fan-out, pruning, promotion, and merge.

**Dependencies**:
- Proven fan-out/join capability via helper-module orchestration or YAML workflow engine extension.
- Phase 002 graph tools, especially graph-backed convergence and gap detection.
- Phase 001 stop reasons, journals, resume semantics, and reducer-owned sections.
- Existing deep-research and deep-review command or YAML entrypoints.

**Deliverables**:
- Proven workflow fan-out/join path before any wave-mode runtime wiring proceeds.
- v1 deterministic segmentation using heuristics: file-count thresholds, directory grouping, simple hotspot ranking, and stable segment identities.
- v2 graph/cluster-enhanced segmentation using the Phase 002 coverage graph once the graph surfaces are operational.
- Wave lifecycle orchestration for plan, fan-out, prune, promote, and merge.
- Mandatory decomposition prepass artifacts: `hotspot-inventory.json` for review and `domain-ledger.json` for research.
- Reducer-owned `board.json` execution ledger plus a derived human-readable dashboard render.
- Segment JSONL contract and merge rules keyed by explicit identifiers rather than append order.
- Verification for segment isolation, merge correctness, and default-path preservation.
<!-- /ANCHOR:phase-context -->
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop products are currently optimized for one iteration stream at a time. That works for moderate targets, but it becomes inefficient and hard to govern once a review scope crosses 1000 files or a research scope spans dozens of domains. Without a structured wave executor, operators must either accept slow sequential progress or invent ad hoc parallelism that risks duplicated work, conflicting findings, and unmergeable state. The problem is amplified by the current YAML workflow engine, which has no native parallel dispatch or join capability today.

### Purpose

Define an orchestrator-layer wave execution model that segments large review and research targets into bounded parallel batches, tracks each segment through convergence and promotion, and merges the results back into one auditable packet without changing the LEAF-worker rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Prove workflow fan-out/join capability before wave execution is wired into deep research or deep review.
- Add shared CommonJS planners for v1 deterministic review-file segmentation and research-domain segmentation.
- Add v2 graph/cluster-enhanced segmentation that refines decomposition using the Phase 002 coverage graph once it is operational.
- Define wave lifecycle steps: plan, fan-out, prune, promote, and merge.
- Introduce machine-first, reducer-owned packet-local coordination tracking with `board.json` as the canonical execution ledger and a derived human-readable dashboard render.
- Define mandatory decomposition prepass artifacts: `hotspot-inventory.json` for review and `domain-ledger.json` for research.
- Define segment-local JSONL or state artifacts and deterministic merge rules into the main packet lineage using explicit keys: `sessionId`, `generation`, `segment`, `wave`, and `findingId`.
- Apply Phase 002 graph convergence per segment so pruning and promotion decisions are evidence-backed.
- Add activation gates so wave execution only activates for review scopes with at least 1000 files plus hotspot spread, or research scopes with at least 50 domains plus cluster diversity; otherwise the default sequential path remains unchanged.
- Add workflow, config, and strategy surfaces for wave-aware execution without changing the default small-target path.
- Add tests for lifecycle correctness, segment isolation, merge idempotence, and resume or recovery behavior.

### Out of Scope

- Graph storage and graph-tool creation from Phase 002.
- Offline replay optimization, config search, and promotion gates from Phase 004.
- Allowing LEAF research or review agents to spawn child agents directly.
- Replacing the existing single-stream path for small review or research runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs` | Create | Shared planner for v1 heuristic segmentation and v2 graph-enhanced review or research segments. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` | Create | Orchestrator lifecycle helpers for fan-out, join, prune, promote, merge, and resume state transitions. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs` | Create | Reducer-owned `board.json` execution-ledger schema, status transitions, conflict tracking, and derived dashboard renderer helpers. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs` | Create | Segment JSONL, lineage, and merge helpers keyed by explicit segment identifiers. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs` | Create | Segment-level convergence helpers that wrap Phase 002 graph metrics and stop traces. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document domain-ledger prepass, activation gates, v1/v2 segmentation, fan-out/join, prune or promote rules, and merge behavior for research. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add `domain-ledger.json`, segment JSONL, `board.json`, derived dashboard, and keyed merge contracts. |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add segment plan, promoted findings, and merge checkpoints while keeping execution-ledger ownership machine-first. |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document `hotspot-inventory.json`, activation gates, v1/v2 segmentation, wave lifecycle, and merge behavior for review. |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add `hotspot-inventory.json`, segment JSONL, `board.json`, derived dashboard, and keyed merge contracts. |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add segment queues, conflict tracking, and merge checkpoints while keeping execution-ledger ownership machine-first. |
| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Define wave-aware review outputs and reducer-owned coordination sections. |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for research. |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for review. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add domain-ledger prepass, fan-out/join, prune, promote, and keyed merge steps for research. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode research flow aligned with activation-gated wave lifecycle rules. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add hotspot-inventory prepass, fan-out/join, prune, promote, and keyed merge steps for review. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode review flow aligned with activation-gated wave lifecycle rules. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts` | Create | Verify segment planning, ranking, and clustering behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` | Create | Verify lifecycle transitions, prune rules, and promotion rules. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts` | Create | Verify segment isolation, deterministic merge, and idempotent replay behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts` | Create | Verify wave interruption and resume behavior. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-000 | Workflow fan-out/join capability MUST be proven before wave execution can be built. | The packet defines and verifies one canonical path for parallel dispatch plus join, either through helper-module orchestration or a YAML engine extension; until that proof exists, wave execution remains blocked and the default sequential path stays authoritative. |
| REQ-001 | The phase MUST define two segmentation versions for both large review scopes and large research scopes. | v1 uses deterministic heuristics such as file-count thresholds, directory grouping, simple hotspot ranking, domain counts, authority levels, and stable cluster assignment; v2 explicitly layers Phase 002 coverage-graph or cluster signals on top of v1 once the graph surfaces are operational. |
| REQ-002 | Parallelism MUST live at the orchestrator layer while LEAF agents remain non-spawning workers. | Wave lifecycle steps are owned by shared orchestration logic and YAML workflows; no requirement or task asks `@deep-research` or `@deep-review` workers to spawn child agents directly. |
| REQ-003 | The phase MUST define a packet-local coordination board that is reducer-owned and machine-first. | `board.json` is the canonical execution ledger for per-segment state, conflict notes, deduplication markers, and promotion outcomes; the dashboard is a derived human-readable render and not a human-edited strategy surface. |
| REQ-004 | Segment-local JSONL and merge rules MUST preserve auditability when wave results are merged back into the main packet lineage. | Segment artifacts remain replayable on their own, merged records always include explicit keys `sessionId`, `generation`, `segment`, `wave`, and `findingId`, and merge logic never relies on append order as the source of truth. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each segment MUST use Phase 002 graph signals independently for convergence, pruning, promotion, and v2 decomposition upgrades. | Segment convergence explicitly references coverage-graph status or convergence outputs; prune logic can retire converged or stuck segments without dropping unresolved global gaps silently; graph-enhanced segmentation is blocked until the Phase 002 coverage graph is operational. |
| REQ-006 | Deep-research and deep-review workflows MUST expose wave execution as a bounded mode for large targets while preserving the default small-target path. | Wave mode activates only when review targets have at least 1000 files with hotspot spread or research targets have at least 50 domains with cluster diversity; otherwise command docs, YAML workflows, and config surfaces keep the normal single-stream flow as the default path. |
| REQ-007 | Wave planning MUST emit mandatory decomposition prepass artifacts before any segment fan-out occurs. | Review writes `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities; research writes `domain-ledger.json` with source domains, authority levels, and cluster assignments; both artifacts are consumed by later wave steps rather than treated as optional notes. |
| REQ-008 | Segment promotion and merge MUST preserve conflict and dedupe metadata instead of flattening segment results into one anonymous stream. | The coordination board and merge outputs explicitly keep `conflict`, `duplicate`, or `promoted` state so later synthesis and replay can explain where findings came from. |
| REQ-009 | The phase MUST add verification for lifecycle correctness, segment isolation, merge correctness, and resume behavior. | Planned tests cover fan-out/join proof, planner determinism, lifecycle transitions, keyed merge idempotence, interruption or resume semantics, activation-gate fallbacks, and protection against duplicate or conflicting promoted findings. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fan-out/join capability is proven before wave mode is wired into deep research or deep review.
- **SC-002**: Research and review each have documented v1 heuristic segmentation plus v2 graph-enhanced segmentation that scale to the large-target examples in the phase brief.
- **SC-003**: The wave lifecycle is explicit and ordered: prepass, plan, fan-out, prune, promote, join, then merge.
- **SC-004**: `board.json` is treated as the canonical packet-local execution ledger and the dashboard is clearly derived from it.
- **SC-005**: `hotspot-inventory.json` and `domain-ledger.json` are mandatory prepass artifacts before wave dispatch.
- **SC-006**: Segment-local artifacts remain replayable and mergeable without losing segment provenance or keyed identity.
- **SC-007**: Phase 002 graph convergence is reused per segment in v2 rather than redefined for wave mode.
- **SC-008**: Default non-wave execution remains the canonical small-target path.
- **SC-009**: Verification covers fan-out/join proof, planner determinism, lifecycle behavior, merge correctness, activation gates, and resume safety.

### Acceptance Scenarios

1. **Given** the current YAML workflow engine has no native parallel dispatch, **when** this phase begins implementation, **then** a helper-module orchestration proof or engine extension must be chosen and validated before wave execution is treated as buildable.
2. **Given** a review scope with at least 1000 files and meaningful hotspot spread, **when** wave planning runs, **then** the review prepass emits `hotspot-inventory.json` and the planner emits stable v1 hotspot-ranked segments instead of one monolithic file list.
3. **Given** a research scope with at least 50 source domains and cluster diversity, **when** wave planning runs, **then** the research prepass emits `domain-ledger.json` and the planner emits bounded domain clusters with stable identities.
4. **Given** Phase 002 graph signals are operational, **when** v2 segmentation runs, **then** the planner refines decomposition using graph coverage or cluster signals rather than replacing the v1 heuristic baseline blindly.
5. **Given** one segment converges early, **when** prune evaluation runs, **then** that segment can retire without making global STOP legal until remaining gaps are satisfied.
6. **Given** two segments surface duplicate or conflicting findings, **when** promotion and merge happen, **then** the coordination board preserves those states and the merged JSONL remains keyed by explicit identifiers rather than append order.
7. **Given** a wave is interrupted mid-run, **when** resume starts, **then** only incomplete segment work is resumed and previously merged segment lineage remains intact.
8. **Given** a small-target run or a large target that lacks hotspot spread or cluster diversity, **when** deep research or deep review starts, **then** execution stays on the existing single-stream path and does not invoke wave machinery unnecessarily.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Workflow fan-out/join capability is not yet native in the YAML workflow engine | High | Treat proof of helper-module orchestration or engine extension as the first blocking deliverable before any wave runtime build begins. |
| Dependency | Phase 002 graph convergence must exist before segment pruning is trustworthy | High | Treat graph status and convergence as prerequisite surfaces for prune and promote decisions. |
| Dependency | Phase 001 resume semantics remain the lineage authority | Medium | Build wave resume on top of the same typed stop and journal model rather than creating a second checkpoint system. |
| Risk | Segment planners produce unstable partitions between runs | Medium | Require deterministic ranking and stable segment IDs based on scope metadata. |
| Risk | Merge behavior duplicates or overwrites findings across segments | High | Preserve segment provenance, conflict markers, and dedupe metadata through merge rules and tests. |
| Risk | Coordination-board maintenance becomes manual busywork | Medium | Keep `board.json` reducer-owned and generate the dashboard as a derived render, not a human-maintained strategy surface. |
| Risk | Wave mode leaks into small-target defaults and makes normal runs harder to understand | Medium | Gate wave mode behind explicit large-target criteria and keep the default path unchanged. |
| Risk | YAML workflow engine needs extension work before fan-out/join is trustworthy | High | Treat engine extension or helper-orchestration proof as the biggest implementation risk and keep sequential execution as the fallback until it is validated. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Segment planning should stay linear or near-linear in the size of the inventory so orchestration overhead does not dominate the run.
- Merge and board updates must remain cheap enough to execute after each wave.

### Reliability

- Segment lineage must survive interruption and replay without losing provenance.
- Default single-stream behavior must remain available when wave mode is disabled or inapplicable.
- Merge correctness must be keyed by explicit identifiers and never depend on JSONL append order.

### Maintainability

- Planner, lifecycle, convergence, and merge logic should remain in shared helper modules rather than being embedded repeatedly in YAML.
- Research and review should differ mainly in planner inputs and artifact naming, not in orchestration rules.

---

## 8. EDGE CASES

- A repo hotspot spans multiple clusters and appears in more than one planned segment. Deduplication and promotion rules must prevent the same finding from being merged twice.
- A research domain cluster converges quickly while a second cluster remains unresolved. Prune logic must retire the first segment without making global STOP legal yet.
- A segment fails or stalls mid-wave. Resume behavior must restart only the affected segment or re-plan safely rather than invalidating the whole wave.
- Merge happens after some segments promoted findings with contradictory evidence. The coordination board must preserve that conflict instead of flattening to one winner silently.
- Small targets accidentally trigger the wave planner. Activation criteria must fall back to the single-stream path when segmentation adds no value.
- The YAML engine still cannot prove a safe join path for parallel branches. Wave execution must stay blocked and sequential mode must remain authoritative.
- JSONL append order differs from logical merge order after retries or resumed segments. Merge must sort and dedupe by explicit keys rather than line position.

---

## 9. COMPLEXITY ASSESSMENT

| Axis | Assessment |
|------|------------|
| **Planning** | High: deterministic segmentation for two different product types is non-trivial. |
| **State Management** | High: segment-local JSONL plus merged lineage must stay replayable and auditable. |
| **Workflow Orchestration** | High: fan-out, prune, promote, and merge add real lifecycle complexity. |
| **Review Feasibility** | Medium-High: review-side wave execution is comparatively concrete because the inputs are files, reducer contracts already exist, and evidence can stay file-level and auditable. |
| **Research Feasibility** | Medium: research-side wave execution needs a discovery artifact that does not exist yet today, and there is no init-time source inventory to segment from without first building `domain-ledger.json`. |
| **Operator UX** | Medium: complexity is acceptable only if the default path remains simple. |
| **Overall** | High: this phase introduces parallel execution semantics and must do so without weakening auditability. |

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Response |
|------|------------|--------|----------|
| Fan-out/join proof fails on current YAML engine | High | High | Block wave execution until helper orchestration or engine extension is validated. |
| Planner instability across runs | Medium | High | Stabilize segment identity and ranking inputs before rollout. |
| Merge drops provenance or dedupe state | Medium | High | Treat provenance preservation as a merge gate, not a nice-to-have. |
| Wave mode changes default behavior | Low | High | Keep activation criteria explicit and covered by regression tests. |
| Board state becomes manual | Medium | Medium | Generate `board.json` and refresh the derived dashboard through shared runtime helpers. |

---

## 11. USER STORIES

- As an operator reviewing a huge repository, I want the orchestrator to split work into bounded hotspots so I can trust progress without waiting for one giant sequential pass.
- As an operator researching many domains, I want segment-level convergence and promotion so the loop can focus resources where uncertainty still exists.
- As a future optimizer, I want segment-aware traces, board states, and merge metadata so I can replay and tune large-target behavior offline.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Which fan-out/join proof path becomes canonical for this phase: helper-module orchestration wrapped around today's YAML engine, or a direct YAML workflow engine extension? This is a blocking prerequisite, not optional follow-up work.
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

- Parent packet specification: `../spec.md`
- Parent packet plan: `../plan.md`
- Predecessor phase: `../002-semantic-coverage-graph/spec.md`
- Successor phase: `../004-offline-loop-optimizer/spec.md`
