# Iteration 001

## Focus

Baseline review for correctness and security across the highest-risk landed PRs:

- PR 3 delete sweep for the promotion subsystem.
- PR 4 readiness/trust-state vocabulary unification across status/context/query/startup-brief.
- PR 5 spec_kit metrics instrumentation, env gating, and cardinality envelope.
- PR 2 + PR 7 Claude settings nested-hook schema and parity coverage.

## Files Reviewed

- `.claude/settings.local.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md`

Validation run:

- `npx vitest run skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts code-graph/tests/code-graph-query-handler.vitest.ts code-graph/tests/code-graph-context-handler.vitest.ts --config vitest.config.ts` from `mcp_server`: 2 files passed, 1 skipped; 26 tests passed, 36 skipped. The parity suite is skipped outside Claude runtime by design.

## Findings

### P0

None.

### P1

#### R1-P1-001 — Startup brief collapses graph probe errors into `absent` trust

Dimension: correctness. PR source: PR-4.

`startup-brief.ts` detects `freshness === 'error'` and stores `graphState = 'missing'` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:245`, then later computes shared payload provenance with `trustStateFromGraphState(graph.graphState)` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:330`. But `trustStateFromGraphState('missing')` maps to `absent` at `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:1019`, while only `graphState === 'error'` maps to `unavailable` at `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:1022`.

Impact: startup-brief is one of the four PR-4 surfaces, and an unreachable/crashed graph probe is reported in the shared payload as "absent" rather than "unavailable". That contradicts the V2 error -> V5 unavailable contract used by context/query/status and can make consumers treat an operational failure as a normal empty scope.

Reproduce: mock `getGraphFreshness()` to return `error` with non-empty graph stats, then call `buildStartupBrief()`. The payload path `sharedPayload.provenance.trustState` will be `absent` because the intermediate `graphState` is `missing`.

Fix: preserve an error axis for startup provenance, or map the startup error branch directly to `trustState: 'unavailable'` instead of routing through `missing`.

#### R1-P1-002 — Delete sweep left a task-listed promotion test file on disk

Dimension: traceability. PR source: PR-3.

The implementation plan/task list names `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` as part of PR-3 deletion scope, but the file still exists and begins with promotion-threshold tests at `.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:1` and defines the suite at `.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:33`.

Impact: the delete sweep is not traceable to the approved PR boundary. Either this file was incorrectly listed for deletion, or the landed delta is incomplete. In either case the close-out evidence cannot claim that the PR-3 deletion list was fully applied.

Reproduce: run `find .opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts -maxdepth 1 -print`; the path is still present.

Fix: decide whether this test belongs to the removed promotion subsystem. If yes, delete it with PR-3. If no, update `plan.md`/`tasks.md` and close-out evidence so the delete inventory excludes the memory auto-promotion test.

#### R1-P1-003 — Metrics cardinality envelope is not enforced for env-derived labels

Dimension: security. PR source: PR-5.

The collector stores series keys directly from caller-provided labels at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:578` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:588`. Emission sites feed environment strings into labels without clamping to the declared vocabularies: `SPECKIT_RUNTIME` and `SPECKIT_ADVISOR_FRESHNESS` flow into recommendation metrics at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:320`, and `SPECKIT_RUNTIME` flows into edge metrics at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1419`.

Impact: enabling `SPECKIT_METRICS_ENABLED=true` lets arbitrary env values create unbounded label series in-process. That weakens the stated cardinality envelope and can become a metrics memory/telemetry denial-of-service footgun when wrappers vary those env values.

Reproduce: run scoring or indexing repeatedly with `SPECKIT_METRICS_ENABLED=true` and unique `SPECKIT_RUNTIME` values; `speckitMetrics.snapshot().metricsUniqueSeriesCount` grows with every unique env value.

Fix: normalize env-derived labels to closed enums (`claude`, `gemini`, `copilot`, `codex`, `unknown`; `live`, `stale`, `absent`, `unavailable`) before emitting, and have the collector reject unknown labels for metrics with declared label vocabularies.

### P2

#### R1-P2-001 — Stale manual evidence still claims deleted promotion suite passed

Dimension: maintainability. PR source: PR-3.

The manual scenario run still claims `promotion-gates.vitest.ts — 22/22 tests pass` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md:30` and repeats it at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md:84`, even though PR-3 removed the promotion-gates suite.

Impact: future reviewers can mistake historical evidence for current validation and chase a deleted test target. This does not block runtime behavior, but it undermines the delete-sweep audit trail.

Reproduce: `rg -n "promotion-gates.vitest.ts|22/22" .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md`.

Fix: mark the run as historical/pre-delete or scrub the deleted suite from current validation evidence.

## Verdict-So-Far

Pending. No P0 blocker found in iteration 1, but three P1 findings remain open. The highest-risk correctness issue is PR-4 startup payload trust-state drift; the highest-risk security issue is PR-5 metric label cardinality.

## Coverage Map

| PR | Coverage | Result |
|---|---|---|
| PR 2 | `.claude/settings.local.json` nested schema read; no top-level `bash`; no raw `hooks/copilot/` in settings | No finding |
| PR 3 | Deleted paths checked; residual references searched; manual evidence reviewed | R1-P1-002, R1-P2-001 |
| PR 4 | status/context/query/startup-brief readiness/trust-state paths reviewed | R1-P1-001 |
| PR 5 | metrics definitions, emission gates, env labels, collector behavior reviewed | R1-P1-003 |
| PR 7 | parity test shape reviewed; targeted run skipped under non-Claude runtime as intended | No finding |

Dimensions covered: correctness, security, traceability, maintainability.

## Next Focus

Iteration 2 should stay on PR-5 briefly to verify the remaining advertised metrics (`partial_persist_retries_total`, `confidence_brier_score`, and cache hit/miss semantics), then move to PR-6 cache invalidation listener uniqueness and PR-1 parity corpus path behavior.
