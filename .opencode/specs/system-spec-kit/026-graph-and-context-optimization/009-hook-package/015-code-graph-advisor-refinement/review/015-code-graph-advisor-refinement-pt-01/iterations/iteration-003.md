# Iteration 003

## Focus

Maintainability and traceability depth for PR 5 metrics, PR 4 vocabulary/backward-compat aliases, PR 6/7 regression-test coverage, cross-cutting prose drift, and adversarial validation of R2-P1-001 through R2-P1-003.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/cache/listener-uniqueness.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts`
- `.claude/settings.local.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md`

Checks performed:

- `rg` for `GraphFreshness`, `StructuralReadiness`, `TrustState`, and `SkillGraphTrustState` across MCP server code, scripts, hooks, runtime config folders, and plugin docs.
- `rg` for promotion and legacy vocabulary prose across the requested feature catalog, manual playbook, READMEs, and implementation summary.
- `test -f` confirmed the new corpus exists, the old legacy corpus path is missing, and the query-latency baseline file currently exists.

## Findings

### P0

None.

### P1

#### R3-P1-001 - PR-4 T-027 compatibility alias surface is not actually centralized in `trust-state.ts`

Dimension: traceability. PR source: PR-4.

Task T-027 requires a canonical `TrustState` re-export from `skill-advisor/lib/freshness/trust-state.ts` with V1-V5 deprecation aliases at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/tasks.md:83`. The implemented module defines the canonical 4-value `SkillGraphTrustState` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:36` and only aliases `TrustState` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:59`. The old storage/readiness names are still exported from the code-graph side instead: `GraphFreshness` from `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:27`, `StructuralReadiness` from `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:43`, and the V2/V4 definitions remain in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts:7-8`.

Impact: callers cannot follow the promised T-027 migration path of importing all deprecated V1-V5 aliases from the canonical trust-state surface. At least one non-code-graph handler still imports the old freshness type through `ensure-ready` at `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:15`, then casts into it at `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:636`. That keeps the compatibility story split across modules and makes a future alias removal easy to break silently.

Reproduce: run `rg -n "\b(GraphFreshness|StructuralReadiness|TrustState|SkillGraphTrustState)\b" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts .claude .codex .gemini`. The only alias exported by `trust-state.ts` is `TrustState`; the old V1/V2/V4 names are not deprecated from that canonical module.

Fix: either implement the promised one-release alias surface in `trust-state.ts` and migrate external imports toward it, or amend T-027/plan evidence to state that `GraphFreshness` and `StructuralReadiness` intentionally remain code-graph-owned compatibility exports.

#### R3-P1-002 - PR-7 settings parity can pass by skipping every assertion in the default non-Claude test environment

Dimension: maintainability. PR source: PR-7.

The parity suite documents that non-Claude runs skip the whole contract at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:44-48`, and the actual suite is wrapped in `describe.skipIf(!isClaudeCodeRuntime())` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:135`. The default test include does include this file through `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:20`, but on Codex/Copilot/Gemini CI it contributes zero assertions. The production JSON currently has the expected nested Claude command shape at `.claude/settings.local.json:24-74`, but the release gate would still stay green if that file regressed while the tests ran outside Claude.

Impact: the PR-7 guard validates the production settings file only in a Claude-marked process. A broken `.claude/settings.local.json` can pass default `npm run test`/`vitest` execution on non-Claude infrastructure, which is exactly the autonomous executor context used by this review packet.

Reproduce: unset `CLAUDE_CODE` and `CLAUDE_SESSION_ID`, then run `npx vitest run mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts --config vitest.config.ts` from `mcp_server`. The suite is skipped before reading `.claude/settings.local.json`.

Fix: split the always-static JSON shape assertions into a runtime-independent suite and keep only true Claude interpreter behavior behind the Claude runtime guard.

#### R3-P1-003 - Spec close-out summary still says the packet is planned and research-only

Dimension: traceability. PR source: Cross.

The packet implementation summary still describes the work as planned and not started: frontmatter says `Status: planned — research not yet started` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md:4`, continuity points to running `/spec_kit:deep-research:auto` as the next safe action at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md:17`, metadata says `Completed | Not yet — research phase not started` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md:51`, and the body says no source code has been modified at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/implementation-summary.md:60`.

Impact: the implementation packet is now being reviewed after ten implementation PRs and Phase 5 completion, but the canonical resume/summary document still routes future agents back to the pre-research scaffold. That undermines traceability for the review loop and makes completion checks depend on stale context.

Reproduce: open the implementation summary and compare its Metadata/What Was Built sections with the review state log, which already records iteration 1 and 2 implementation-review entries in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/review/015-code-graph-advisor-refinement-pt-01/deep-review-state.jsonl`.

Fix: update the implementation summary after Phase 5 to describe the implemented PR set, current review verdict, outstanding findings, validation evidence, and next remediation step.

### P2

#### R3-P2-001 - Copilot hook README still documents the deleted mixed `.claude/settings.local.json` top-level `bash` wrapper shape

Dimension: maintainability. PR source: PR-7 / PR-2.

The Copilot hook README still instructs users to use shared `.claude/settings.local.json` matcher wrappers with a Copilot top-level writer command at `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27`, and the example includes a matcher-group-level `bash` field pointing at `dist/hooks/copilot/user-prompt-submit.js` at `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:35`. The actual `.claude/settings.local.json` now has only nested Claude `hooks[]` command entries and no top-level `bash` field at `.claude/settings.local.json:24-74`.

Impact: the production config is correct, but runtime-adapter documentation still teaches the old shape that PR-2/PR-7 were meant to remove. A user following the README can reintroduce the duplicate-adapter wiring while the PR-7 parity suite still passes if it runs outside Claude.

Reproduce: compare `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27-64` with `.claude/settings.local.json:24-74`.

Fix: rewrite the Copilot registration section to describe the current Copilot-supported surface and avoid prescribing top-level `bash` inside `.claude/settings.local.json`.

## Verdict-So-Far

Conditional. No P0 found in iteration 3. New count: 3 P1 + 1 P2. Open count is now 9 P1 + 2 P2 if none of the prior findings are remediated. R2-P1-001, R2-P1-002, and R2-P1-003 were upheld. R1-P2-001 is partially mitigated by the manual playbook index noting that the scenario run was pre-PR-3 at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:265`, but the scenario run file itself still presents the deleted promotion suite as current evidence at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md:30` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md:84`.

Adversarial validation of iteration-2 findings:

- R2-P1-001 upheld. The new corpus file exists, the old spec-subfolder corpus path is missing, and the legacy parity test still reads that old path at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:27-33`. This is in the default Vitest include through `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:20`.
- R2-P1-002 upheld. The baseline exists today, but the invariant checks remain inside the catch-all at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:125-127` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:153-154`; skipped reports are accepted at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts:164-168`.
- R2-P1-003 upheld. `recent` is still unhandled and falls through to `absent` in the query latency freshness mapping at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:176`.

PR-5 maintainability notes:

- Metric names and label names are reusable as exported constants/types: `SpeckitMetricName` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:502` and `SPECKIT_METRIC_DEFINITIONS` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:521`.
- The dry-run cardinality budget is not enforced at runtime; the live collector only reports `metricsUniqueSeriesCount` via `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:626-649`, so R1-P1-003 remains upheld.
- `isSpeckitMetricsEnabled()` is not cached; it re-reads `process.env.SPECKIT_METRICS_ENABLED` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:553-555`, and emission sites call it per emission path. No new perf finding from this check.

PR-6 coverage note:

- `listener-uniqueness.vitest.ts` imports the production cache invalidation module and `skill-advisor-brief.ts`, clears listeners, triggers `invalidateSkillGraphCaches`, and verifies the production `advisorPromptCache.clear()` side effect at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/cache/listener-uniqueness.vitest.ts:21-35`. That does validate the source production path. Residual risk is build-artifact drift only; no new finding.

## Coverage Map

| PR | Coverage | Result |
|---|---|---|
| PR 1 | Legacy corpus path and default Vitest inclusion | R2-P1-001 upheld |
| PR 2 | Current `.claude/settings.local.json` vs stale Copilot hook documentation | R3-P2-001 |
| PR 4 | T-027 alias contract, current type exports, old import consumers | R3-P1-001; R2-P1-003 upheld |
| PR 5 | Metrics definitions, label reuse, runtime cardinality, env gate behavior | R1-P1-003 upheld; no new PR-5-only finding |
| PR 6 | Listener uniqueness test vs production cache invalidation path | No new finding |
| PR 7 | Settings parity test runtime guard and actual settings JSON | R3-P1-002; R3-P2-001 |
| PR 9 | Query-latency baseline fail-soft behavior | R2-P1-002 upheld |
| Cross | Requested prose/summary drift scan | R3-P1-003; R1-P2-001 partially mitigated but still open |

Dimensions covered this iteration: correctness, security, traceability, maintainability.

## Next Focus

Iteration 4 should check package scripts and CI/job wiring for whether the parity, cache, and bench suites are actually run in the intended environments, then review build/dist drift risk for hook entrypoints and generated artifacts after the source-level PR changes.
