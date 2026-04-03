# Recommendations: sk-deep-research

## Executive Summary
Based on the combined 90-iteration research packet, `sk-deep-research` already has the right core idea: a disk-first, fresh-context loop that writes its continuity into packet files instead of relying on live model memory. The main weaknesses are not in the existence of the loop, but in the missing hard contracts around lineage, lifecycle execution, state reduction, and runtime parity.

In simple terms: keep the current packet-first model, but make the loop more explicit, more lineage-aware, and more deterministic across all CLIs.

## What To Keep
- Externalized state as the foundation: config, JSONL, strategy, dashboard, iteration files, and final synthesis.
- Fresh context per iteration instead of carrying long conversational memory.
- Progressive synthesis into `research/research.md`.
- A simple research packet shape that works in hook and non-hook runtimes.
- Pause support as a lightweight operator control.
- Convergence thinking based on new information, answered questions, and diminishing returns.

## Key Problems
- `resume`, `restart`, and `fork` are surfaced in the UX, but not all of them are fully real executable branches.
- Completed sessions still push too quickly toward synthesis instead of supporting true same-lineage continuation.
- The event/state model is operationally useful but too thin for genealogy; it cannot clearly reconstruct parent-child lineage.
- There is no canonical reducer keeping JSONL, strategy, dashboard, iteration files, and synthesis aligned.
- Runtime portability logic is still scattered instead of being represented as one explicit capability contract.
- Runtime mirrors across Codex/OpenCode/Claude/Gemini can drift because parity is still mostly convention-based.
- Logs and traces are useful, but they are not a substitute for a findings registry or lineage-aware history.

## Prioritized Recommendations
### P0
- Add a canonical lineage schema to research runs.
  - Minimum keys: `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`.
- Make lifecycle branches executable.
  - `resume` should continue the same lineage.
  - `restart` should start a new generation with explicit parent linkage.
  - `fork` should create a new branch with explicit ancestry.
  - `completed-continue` should reopen a completed lineage as a new segment.
  - **Guardrail for `completed-continue`:** the original synthesis must be snapshotted as immutable before reopening. New segments append to the lineage but cannot modify prior synthesis content. A `completedAt` + `reopenedAt` timestamp pair must be recorded to preserve the integrity boundary.
- Freeze one canonical naming contract for research artifacts and pause sentinels.

### P1
- Add a deterministic reducer after every iteration.
  - **Reducer interface contract:**
    - Inputs: `{ latestJSONLDelta: Event[], newIterationFile: string, priorReducedState: ReducedState }`.
    - Outputs: `{ findingsRegistry: FindingsRegistry, dashboardMetrics: DashboardMetrics, strategyUpdates: StrategyPatch }`.
    - Failure modes: malformed JSONL delta → skip + emit warning event; missing iteration file → reducer is a no-op with logged error; schema version mismatch → reject with explicit version conflict event.
    - The reducer must be idempotent: re-running with the same inputs produces identical outputs.
  - Dashboard metrics synchronized by the reducer: `iterationsCompleted`, `openQuestions`, `resolvedQuestions`, `keyFindings`, `convergenceScore`, `coverageBySources`.
- Add a canonical findings registry.
  - The registry should be machine-owned and should summarize open questions, resolved questions, key findings, and ruled-out directions.
- Add a runtime capability matrix.
  - Model support for function calling, sender fields, tool schema requirements, and fallback conversion should come from one explicit source of truth.
- Separate portability logic from research-state logic.
  - Borrow retry, fallback, and provider-adapter patterns from external repos, but do not let runtime behavior define packet truth.
- Add parity checks for runtime mirrors.
  - The same lifecycle and output contracts should be enforced across Codex, OpenCode, Claude, and Gemini variants.
- Strengthen recovery behavior for non-hook CLIs.
  - Recovery should remain explicit, file-derived, and behaviorally identical to hook-capable paths.

### P2
- Tighten the mutable surface of the loop where possible.
  - Keep the research core small and explicit instead of letting more and more behavior leak into loosely owned surfaces.
- Improve provenance for postmortems.
  - Keep strong execution traces, but treat them as debugging support rather than state authority.
- Add clearer separation between machine-owned and analyst-owned sections in the strategy and synthesis documents.

## Compatibility Guidance
- Disk artifacts must remain the source of truth for all runtimes.
- Hook support should improve startup ergonomics only; it should never be required for correctness.
- Non-hook runtimes must be able to derive the same next action from packet files alone.
- Provider compatibility decisions should be deterministic and centrally defined, not hidden in scattered model-name checks.
- Fallback bridges for non-function models are worth keeping, but they need drift tests because they are fragile by nature.
- Migration window for dual-read/single-write naming: **4 weeks** from canonical naming freeze. After 4 weeks, legacy read paths are removed. Migration events must be logged throughout the window to confirm adoption before removal.

## Validation And Testing Recommendations
- Lifecycle end-to-end tests for `resume`, `restart`, `fork`, and `completed-continue`.
- Reducer integrity tests that compare JSONL, iteration markdown, registry, strategy, dashboard, and final synthesis.
- Hook/non-hook parity tests that prove the same packet state leads to the same loop decisions.
- Runtime capability tests that verify provider-specific behavior matches the capability matrix.
- Migration replay tests for restoring or continuing older research packets without corrupting lineage.
- Pause/resume tests that verify sentinel behavior and correct event logging.

## Suggested Rollout Order
1. Freeze the research naming and lifecycle contract.
2. Add lineage metadata and real lifecycle execution branches.
3. Add the findings registry and deterministic reducer.
4. Introduce the runtime capability matrix and portability adapter layer.
5. Add parity gates and lifecycle test coverage.
6. Remove transitional compatibility logic only after proven adoption.

## Final Recommendation
`sk-deep-research` should evolve into a lineage-aware research engine, not just a resumable iteration loop. The existing packet-first design is the right base. The next step is to make lineage, reduction, and parity first-class so the loop becomes durable, inspectable, and consistent across every CLI surface.
