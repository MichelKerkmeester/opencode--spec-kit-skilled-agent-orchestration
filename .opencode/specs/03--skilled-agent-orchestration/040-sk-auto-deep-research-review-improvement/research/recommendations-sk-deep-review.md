# Recommendations: sk-deep-review

## Executive Summary
Based on the combined 90-iteration research packet, `sk-deep-review` already has a strong review loop shape: fresh context per iteration, explicit review dimensions, severity-based findings, and durable packet artifacts under `review/`. Its biggest issues are contract drift and incomplete lifecycle hardening, not a missing review engine.

In simple terms: keep the review model, but make the review packet contract fully canonical, make continuation more explicit, and prevent drift across YAML, SKILL docs, README, playbooks, and runtime mirrors.

## What To Keep
- Fresh-context review iterations instead of long in-memory review sessions.
- Review packet isolation under `{spec_folder}/review/`.
- Explicit review dimensions: correctness, security, traceability, and maintainability/completeness.
- Severity-based findings (`P0` / `P1` / `P2`) as the main output contract.
- A final synthesized review report rather than only raw iteration notes.
- Operator-controlled pause/resume behavior as a simple file-based control point.

## Key Problems
- Review artifact naming still drifts across surfaces.
  - Some places teach `deep-review-*`.
  - Other places still teach `deep-research-*` for review mode.
- Pause sentinel naming also drifts, which makes operator behavior unreliable.
- Completed sessions are still too synthesis-centric and do not behave like first-class continuable review lineages.
- Review state is durable, but there is still no canonical reducer or findings registry to reconcile raw iterations with strategy and report state.
- Runtime mirrors can drift just like research-mode mirrors, especially around startup framing and declared capabilities.
- Review history is durable, but not yet lineage-aware in the same explicit way the research loop now needs.

## Prioritized Recommendations
### P0
- Freeze one canonical review naming contract.
  - Canonical review files should consistently use `deep-review-*`.
  - Canonical pause sentinel should consistently use `.deep-review-pause`.
- Add a dual-read, single-write migration window.
  - Read old names during migration.
  - Write only canonical review names.
  - Emit migration events whenever legacy artifacts are rehomed or normalized.
- Add explicit lifecycle branches for review mode.
  - `resume`, `restart`, `fork`, and `completed-continue` should be real review behaviors, not partial or implied ones.
- Add a canonical review findings registry.
  - This should track open findings, resolved findings, repeated findings, and dimension coverage.

### P1
- Add a deterministic reducer for review mode.
  - It should reconcile iteration files, review strategy, dashboard, findings registry, and final report.
  - **Reducer interface contract:**
    - Inputs: `{ latestJSONLDelta: Event[], newIterationFile: string, priorReducedState: ReducedState }`.
    - Outputs: `{ findingsRegistry: ReviewFindingsRegistry, dashboardMetrics: ReviewDashboardMetrics, strategyUpdates: StrategyPatch }`.
    - Failure modes: malformed JSONL delta → skip + emit warning event; missing iteration file → reducer is a no-op with logged error; schema version mismatch → reject with explicit version conflict event.
    - The reducer must be idempotent: re-running with the same inputs produces identical outputs.
  - Dashboard metrics synchronized by the reducer: `iterationsCompleted`, `dimensionsCovered`, `openFindings`, `resolvedFindings`, `findingsBySeverity` (P0/P1/P2), `convergenceScore`.
- Make review lineage explicit.
  - Use the same lineage model as research mode so review packets can be resumed, restarted, forked, and continued in a predictable way.
- Add parity gates across command assets, skill docs, README, references, and runtime mirrors.
  - Review-mode documentation drift should become a test failure, not a later manual discovery.
- Keep review-mode contracts clearly separate from research-mode contracts.
  - Shared machinery is fine, but mixed naming is not.

### P2
- Improve review-specific release-readiness criteria.
  - Distinguish between a useful in-progress review, a converged review, and a release-blocking review.
- Strengthen source-of-truth guidance for operators.
  - Make it obvious which file names, sentinel names, and packet paths are canonical.
- Add stronger ownership boundaries between machine-generated state and human-authored commentary inside review artifacts.

## Compatibility Guidance
- Review mode must stay file-derived so it works the same for hook and non-hook CLIs.
- Runtime startup behavior may differ, but review packet semantics must not.
- Migration logic must be backward-compatible enough to absorb older review packets without losing findings.
- Review-mode naming must be canonical across all surfaces before any stricter cleanup is attempted.
- Shared portability improvements from external repos should be reused, but they must not override review packet truth.
- Migration window for dual-read/single-write naming: **4 weeks** from canonical naming freeze. After 4 weeks, legacy read paths are removed. Migration events must be logged throughout the window to confirm adoption before removal.

## Validation And Testing Recommendations
- End-to-end tests for review `resume`, `restart`, `fork`, and `completed-continue`.
- Sentinel tests for `.deep-review-pause`, including migration-period support for legacy names if needed.
- Cross-surface contract tests comparing:
  - `SKILL.md`
  - `README.md`
  - references
  - YAML assets
  - runtime mirrors
- Reducer integrity tests comparing review iteration files, registry state, strategy, dashboard, and review report.
- Dimension coverage tests to ensure review convergence does not silently skip a review dimension. This is a correctness concern: an incomplete dimension sweep must block convergence claims.
- Severity schema tests to ensure `P0`, `P1`, and `P2` findings remain stable and machine-readable.

## Suggested Rollout Order
1. Freeze the canonical review naming and sentinel contract.
2. Add migration compatibility reads and deterministic rehome behavior.
3. Add explicit lifecycle branches and lineage keys for review mode.
4. Add the review findings registry and reducer.
5. Add parity gates across docs, YAML, and runtime mirrors.
6. Tighten release-readiness and cleanup rules after the migration window is proven.

## Final Recommendation
`sk-deep-review` does not need a different core loop. It needs a stricter contract. The best next move is to eliminate naming drift, make continuation real, and give review mode a reducer plus findings registry so the packet becomes stable, portable, and trustworthy across all runtimes.
