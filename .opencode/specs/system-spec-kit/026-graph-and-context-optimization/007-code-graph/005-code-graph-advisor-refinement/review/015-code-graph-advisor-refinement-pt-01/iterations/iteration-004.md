# Iteration 004

## Focus

Security deep-dive across:

- PR 5 `spec_kit.*` metrics label trust and cardinality boundaries.
- PR 2 `.claude/settings.local.json` `bash -c` command injection surface.
- PR 4 freshness/trust-state narrowing after vocabulary unification.
- PR 7 settings parity assertion completeness for the F23.1 regression class.
- Hook command path resolution and executable selection.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts`
- `.claude/settings.local.json`

Checks performed:

- `rg` over `speckitMetrics` emission sites to trace every `spec_kit.*` label source to its series-key sink.
- `rg` over freshness/trust-state switch arms in code-graph handlers, skill-advisor library code, and shared context transport.
- `rg` over hook command strings and stale `bash`/Copilot adapter references in settings, hook docs, and install docs.

## Findings

### P0

None.

### P1

#### R4-P1-001 - PR-5 `skill_id` metric labels are repo-controlled strings with no cardinality clamp

Dimension: security. PR source: PR-5.

The `spec_kit.*` collector builds metric series keys directly from caller-provided label maps at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:578-590`. Several labels are closed by TypeScript at their emission sites: `mode` is normalized by `speckitQueryModeLabel()` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:12-17`; `language` is `SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'bash'` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:32`; `cache_layer` is hard-coded to `exact` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:102`; and freshness transitions use `SkillGraphTrustState = 'live' | 'stale' | 'absent' | 'unavailable'` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:36`.

`skill_id` is different. `fusion.ts` emits `skill.id` as `skill_id` for `spec_kit.scorer.lane_contribution` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:247` and `recommendation.skill` as `skill_id` for `spec_kit.scorer.primary_intent_bonus_applied_total` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:289`. Those IDs are loaded from SQLite `skill_nodes.id` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:165` or from filesystem `graph-metadata.json.skill_id` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:230-242`. There is no closed enum, regex clamp, length bound, allowlist, or fallback bucket before the values are interpolated into the series key.

Impact: with `SPECKIT_METRICS_ENABLED=true`, an untrusted or generated workspace can create many unique skill IDs and force high-cardinality `skill_id` series in the in-process collector. This is distinct from R1-P1-003's env-derived `runtime` and `freshness_state` issue: even after env labels are normalized, repo-controlled skill metadata can still explode the PR-5 cardinality envelope.

Reproduce: add many `.opencode/skill/<name>/graph-metadata.json` files with unique `skill_id` values or seed many `skill_nodes.id` rows, enable `SPECKIT_METRICS_ENABLED=true`, then call `scoreAdvisorPrompt()` with prompts that score those skills. `speckitMetrics.snapshot().metricsUniqueSeriesCount` grows with every distinct `skill_id`.

Fix: normalize `skill_id` to a bounded vocabulary or low-cardinality bucket before emission, for example known built-in skill IDs plus `custom_skill`, and have `SpeckitMetricsCollector` reject or bucket labels outside declared value policies.

#### R4-P1-002 - Claude hook commands execute a repo-relative hook selected by ambient cwd and PATH

Dimension: security. PR source: PR-2 / PR-7.

The four Claude commands in `.claude/settings.local.json` are fixed strings, so I did not find direct interpolation of settings fields or user-controlled `$VAR` expansions inside the `bash -c` literal. However, every command resolves both the repository root and the hook executable target at runtime from ambient process state:

- `.claude/settings.local.json:31` runs `cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" && node .opencode/.../dist/hooks/claude/user-prompt-submit.js`.
- `.claude/settings.local.json:43` uses the same pattern for `compact-inject.js`.
- `.claude/settings.local.json:55` uses the same pattern for `session-prime.js`.
- `.claude/settings.local.json:67` uses the same pattern for `session-stop.js`.

That means the hook file is not anchored to the directory containing the trusted `.claude/settings.local.json`; it is anchored to whichever Git toplevel or `pwd` Claude happens to provide when the hook fires. In nested Git repositories, submodules, detached worktrees, or a launched session whose cwd is outside the intended project, the same checked-in settings file can resolve `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/*.js` from a different repository. The command also invokes unqualified `node`, so the executable is selected from ambient `PATH` rather than a pinned runtime.

Impact: the current command avoids direct shell injection, but it leaves a path-confusion execution surface. A malicious nested workspace or PATH-controlled launch context can cause the hook to execute a different repo-relative `.opencode` script or a different `node` binary while the user believes the parent repo's hook configuration is in force.

Reproduce: from a nested Git repository that contains its own `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js`, run the command literal from `.claude/settings.local.json:31`. `git rev-parse --show-toplevel` resolves the nested repo and executes the nested `.opencode` hook path, not the parent settings file's hook path.

Fix: generate hook commands with an absolute, canonical project root captured at setup time or resolve the hook path relative to the settings file location rather than cwd. Prefer invoking a pinned Node path from setup (`process.execPath` or a configured absolute Node binary) or explicitly document and validate the allowed PATH contract.

### P2

None new.

## Label Trust Table

| Label | Source reviewed | Closed or sanitized? | Result |
|---|---|---|---|
| `mode` | `ContextArgs.queryMode` normalized by `speckitQueryModeLabel()` | Yes, emits `outline|blast_radius|relationship` | No finding |
| `language` | `SupportedLanguage` in parser/indexer types | Yes, `javascript|typescript|python|bash` | No finding |
| `edge_type` | `EdgeType` in indexer types | Yes, declared union of graph edge types | No finding |
| `outcome` | Local scan/parse outcome strings | Yes, `success|error` | No finding |
| `lane` | `SCORER_LANES` / contribution lane | Yes, scorer lane union | No finding |
| `cache_layer` | Prompt cache miss emission | Effectively closed today, hard-coded `exact`; definition also lists `near_dup` | No finding |
| `from_state` / `to_state` | `SkillGraphTrustState` transition recorder | Yes, `live|stale|absent|unavailable` | No finding |
| `freshness_state` | `code-graph-context.ts` local mapping and env label in `fusion.ts` | Context path closed; env path still open | R1-P1-003 upheld |
| `runtime` | `process.env.SPECKIT_RUNTIME` in `fusion.ts` / `structural-indexer.ts` | No | R1-P1-003 upheld |
| `skill_id` | SQLite `skill_nodes.id` or filesystem `graph-metadata.json.skill_id` | No | R4-P1-001 |

## Non-Findings / Coverage Notes

- PR 2 settings command injection: no field from `.claude/settings.local.json` is interpolated into the `bash -c` command. The only shell expansions in the production command strings are the fixed `$(git rev-parse --show-toplevel 2>/dev/null || pwd)` subshell and quoted command substitution. I did not find a user-controlled `$VAR` expansion in the checked-in settings file.
- PR 7 parity assertion completeness: inside a Claude-marked process, the parity suite does cover the exact F23.1 regression class. It asserts no matcher-group top-level `bash` field at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:180-183`, asserts each command contains the expected `dist/hooks/claude/<event>.js` fragment at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:196-202`, and greps the raw settings file for zero `hooks/copilot/` occurrences at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:226-250`. I did not find a shape-local counterexample that would pass these assertions while reintroducing a top-level matcher `bash` or Copilot adapter ref. R3-P1-002 still stands because the whole suite skips outside Claude.
- PR 4 freshness narrowing: the prompt describes V2 as five states including `unavailable`, but the reviewed code still defines `GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error'` at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts:7`; `unavailable` is a caller trust state, not a V2 graph freshness arm. Current switch sites reviewed in status, readiness-contract, shared-payload, skill-advisor-brief, and opencode transport cover the active unions. No new missing-arm finding from this pass.

## Validation of Iteration-3 P1s

- R3-P1-001 upheld. This pass re-read `trust-state.ts`, `ensure-ready.ts`, and `ops-hardening.ts`: `trust-state.ts` still exports only `TrustState = SkillGraphTrustState` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:59`, while `GraphFreshness` and `StructuralReadiness` remain code-graph-owned exports at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts:7-8`.
- R3-P1-002 upheld. This pass re-read the parity suite and confirmed all production settings assertions still sit inside `describe.skipIf(!isClaudeCodeRuntime())` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:135`; the assertions are strong when they run, but default non-Claude runs still skip them.

## Verdict-So-Far

Conditional. No P0 found in iteration 4. New count: 2 P1 + 0 P2. Open count becomes 11 P1 + 2 P2 if none of the prior findings have been remediated.

## Coverage Map

| PR | Coverage | Result |
|---|---|---|
| PR 2 | `.claude/settings.local.json` shell command literals, field interpolation, hook target resolution | R4-P1-002; no direct command-injection finding |
| PR 4 | Freshness/trust-state switches and active union definitions | No new finding; R3-P1-001 upheld |
| PR 5 | `spec_kit.*` metric definitions, collector sink, all discovered production emission labels | R4-P1-001; R1-P1-003 upheld |
| PR 7 | F23.1 parity assertions and counterexample search | No shape-local new finding; R3-P1-002 upheld |

Dimensions covered this iteration: security, correctness, traceability, maintainability.

## Next Focus

Iteration 5 should inspect build/dist drift for hook entrypoints and source maps, then test whether generated `dist/hooks/claude/*.js` behavior still matches the TypeScript sources and the settings contract.
