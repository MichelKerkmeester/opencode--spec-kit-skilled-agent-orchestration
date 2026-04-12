# Iteration 016 — Make Loop Views Optional, Not Mandatory

Date: 2026-04-10

## Research question
Does the external repo suggest that `system-spec-kit`'s current deep-loop infrastructure is over-instrumented for some research and retry use cases?

## Hypothesis
Yes. Some current loop surfaces should be generated views or advanced-mode artifacts rather than required kernel files.

## Method
I compared Get It Right's minimal loop state with the current deep-research loop contract to identify which internal artifacts are essential versus layered observability.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:26-40] The external workflow defines a loop, a retry budget, and a small input surface without extra state artifacts beyond what the loop needs.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:54-145] The loop explanation centers on check gating, strategy selection, and feedback continuity rather than dashboards or reducer-managed views.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] The internal deep-research workflow declares config, state log, strategy, registry, dashboard, pause sentinel, archive root, synthesis snapshots, and iteration outputs as first-class packet paths.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-197] Initialization creates config, JSONL, strategy, and findings registry before any research iteration runs.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:218-369] Each iteration reads state, checks convergence, dispatches a leaf, runs a reducer, updates registry, and regenerates a dashboard.
- [SOURCE: .opencode/agent/deep-research.md:52-60] The agent contract itself assumes JSONL, strategy, reducer sync, and progressive research update as part of the canonical loop.
- [SOURCE: .opencode/agent/deep-research.md:159-165] Strategy, registry, and dashboard are explicitly treated as reducer-owned synchronized surfaces.

## Analysis
The internal deep-research system is strong when a long, auditable research lineage matters. But the external repo highlights how much loop value comes from a much smaller kernel: bounded attempts, clear stop logic, and one compressed bridge. In that light, some internal surfaces look more like observability and governance layers than kernel requirements. Strategy, registry, dashboard, and pause sentinels are useful, but requiring all of them for every loop raises authoring and maintenance overhead. A lightweight mode would better match smaller or narrower research loops.

## Conclusion
confidence: high
finding: `system-spec-kit` should keep its richer loop instrumentation, but treat part of it as optional generated views rather than mandatory kernel state.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and related loop contracts
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define the minimum viable loop kernel and which artifacts can be derived on demand
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** deep loops create and synchronize multiple state surfaces by default: config, JSONL, strategy, registry, dashboard, archive, and pause signals.
- **External repo's approach:** the retry loop focuses on attempt control and leaves most observability implicit.
- **Why the external approach might be better:** smaller kernels are easier to reason about, faster to initialize, and less fragile when resuming or repairing state.
- **Why system-spec-kit's approach might still be correct:** long unattended research and review waves benefit from richer convergence tracking and dashboarding.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** introduce a lightweight loop mode where only `iteration-NNN.md`, `state.jsonl`, and the final synthesis are mandatory; generate strategy, registry, and dashboard only when requested or when iteration count crosses a threshold.
- **Blast radius of the change:** medium
- **Migration path:** start by making reducer-owned views optional for new loops while preserving the current full mode as the default for high-governance research.

## Counter-evidence sought
I looked for evidence that every current loop artifact is essential to basic loop correctness. The docs instead present several of them as synchronized or auto-generated supporting views.

## Follow-up questions for next iteration
- What is the minimal loop kernel shared across retry, research, and review?
- Which current state artifacts are truly decision-critical?
- Could lightweight mode be selected automatically by task scope?
