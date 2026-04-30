# Iteration 003 — Copilot dispatch authority and non-mutating status readiness

## Status
- Iteration: 3 / 10
- Focus: identify the Copilot prompt-construction insertion point, then decide whether Q-P2 should prefer debounce tuning or status freshness self-check
- newInfoRatio: 0.46
- Convergence trajectory: Q-P0 now has a concrete dispatch-file insertion point; Q-P2 is leaning toward status readiness action surfacing rather than lowering the default watcher debounce.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

Iteration 002's diagnosis still holds: this is an authority-propagation gap, not primarily a memory-save handler bug. The new evidence identifies the exact high-leverage insertion point for deep-loop cli-copilot dispatch, and it also shows why prompt-level authority needs to be explicit.

Evidence:
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:596` branches into `if_cli_copilot`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:604` reads the rendered iteration prompt path, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:605` reads the prompt body, and `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:606` passes both through `resolveCopilotPromptArg`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:618` dispatches the `copilot` binary; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:620` passes the prompt through positional `-p`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:624` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:625` run Copilot with `--allow-all-tools` and `--no-ask-user`, so an unapproved mutating prompt has no interactive recovery path.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:639` says Copilot has no stdin support; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:641` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:642` confirm large prompts are wrapped through an `@PROMPT_PATH` instruction.
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:66` defines `resolveCopilotPromptArg`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:67` returns the raw prompt below 16KB, while `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:69` returns a wrapper string for large prompts.

Recommended refinement:
1. Add a small `buildCopilotPromptArg` or `buildCopilotAuthorityPreamble` helper next to `resolveCopilotPromptArg`, rather than in the memory-save code path. It should prepend a non-optional authority block before either raw-prompt or `@path` wrapper dispatch:
   - approved case: `Spec folder: <path> (operator-approved target authority for this task).`
   - unapproved continuity-write case: `No operator-approved spec folder is present. Do not edit files or call mutating tools. Return the Gate 3 folder-selection question/options only.`
2. Wire the deep-research auto YAML's `if_cli_copilot` branch to use that helper before `runAuditedExecutorCommand`.
3. Mirror the same helper or test pattern into the generic `cli-copilot` skill prompt templates later, but keep the first remediation narrow: the observed loop executor path is concrete and testable.

Falsifiable test sketch:
- Add executor-config tests for `resolve/buildCopilotPromptArg` with a continuity-write prompt and no approved spec folder. Expected: the prompt argument contains the plan-only Gate 3 block and does not contain a pre-approved spec-folder marker.
- Add the approved-folder variant. Expected: the exact approved folder is present and startup/resume "last active" strings are not promoted into the authority field.
- Preserve the existing large-prompt branch by asserting the authority preamble survives both raw-prompt and `@path` wrapper modes.

## Q-P1: code-graph fast-fail not testable

See iteration-002 for the main recommendation: isolate the graph DB with `SPEC_KIT_DB_DIR`, skip `code_graph_scan`, then assert `code_graph_query` emits `fallbackDecision.nextTool:"code_graph_scan"`.

One small Q-P2-linked refinement: `ensureCodeGraphReady` already separates non-mutating and mutating readiness behavior. It detects empty and full-scan states at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:151` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:154`, flags stale tracked files at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:200` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:205`, and explicitly skips inline full scans for read paths at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:368` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:375`. That is the same contract status should report, without doing the scan.

## Q-P2: file-watcher debounce

The evidence no longer points cleanly at "lower debounce" as the first fix. The watcher already has tests for the scenarios the v1.0.2 drift was suspected to involve: rapid writes, rename/delete cleanup, burst renames, concurrent renames, and symlink alias dedup. The weak spot is that `code_graph_status` collapses readiness action to `action:"none"` even when the underlying detector could say `selective_reindex` or `full_scan`.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:49` sets `DEFAULT_DEBOUNCE_MS = 2000`.
- Chokidar already waits for write stability at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:251` through `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:253`, and the file-level debounce clears previous timers at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:278` through `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:283`.
- Watcher events are already wired for add/change/unlink at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:433` through `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:440`.
- The watcher test suite proves repeated add events reindex unchanged content at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:208` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:237`.
- It proves delete-before-debounce is silently ignored, and explicit unlink invokes `removeFn`, at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:277` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:326`.
- It has timing and debounce coverage: reindex within 5 seconds at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:364` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:390`, rapid saves coalesced at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:392` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:428`, and default-window coalescing at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:475` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:497`.
- It also covers rename patterns: single rename at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:430` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:469`, burst renames at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:503` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:548`, and concurrent renames at `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:554` through `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:601`.
- `code_graph_status` currently calls only `getGraphFreshness(process.cwd())` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:163`, then builds a readiness block with `action:"none"` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:189` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:194`.
- `getGraphFreshness` is explicitly non-mutating at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:452` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:455`, but it returns only freshness, not the detector's recommended action.
- Tool schema tests only assert that `code_graph_status` accepts empty input and rejects extra parameters at `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:543` through `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:545` and `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:607` through `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:611`; I did not find a dedicated handler test that asserts status readiness actions.

Recommended approach:
1. Do not lower `DEFAULT_DEBOUNCE_MS` first. The shipped tests already protect default-window coalescing and burst/rename behavior, and a lower value risks more churn without proving it prevents multi-file drift.
2. Add a non-mutating readiness-detail helper, for example `getGraphReadinessProbe(rootDir): ReadyResult`, that exposes `detectState`'s `action`, `reason`, stale file count, and deleted file count without calling `indexWithTimeout`.
3. Change `code_graph_status` to build its readiness block from that probe, still with `inlineIndexPerformed:false`. For stale selective cases, status should say `action:"selective_reindex"` and suggest a bounded reindex or scan. For full-scan cases, status should say `action:"full_scan"` and suggest `code_graph_scan`.
4. Add direct handler tests for `handleCodeGraphStatus` with mocked graph DB/readiness probe states: fresh/none, stale/selective_reindex, stale/full_scan, empty/full_scan, error/none. The test should assert status does not invoke indexing.

Falsifiable success criteria:
- After an induced stale tracked-file fixture, `code_graph_status` reports `freshness:"stale"` and `readiness.action:"selective_reindex"` or `"full_scan"` rather than `"none"`.
- The same status call leaves graph rows unchanged.
- Existing watcher tests continue to pass with the 2000ms default.

## Q-OPP: CocoIndex fork telemetry leverage

See iteration-001 and iteration-002. I did not re-open this beyond confirming it should remain secondary until Q-P0 and Q-P2 converge. The likely next useful pass is still mapping the first downstream consumer that receives CocoIndex MCP results and deciding whether `path_class` is explanation-only or a ranking feature.

## Q-ARCH: intelligence-system seams (light touch)

One seam is now worth naming more concretely: **readiness state vs remediation action**. Several surfaces already share readiness vocabulary, but `code_graph_status` reports freshness while discarding the action that would tell the operator what to do next. A small typed status-probe contract would improve status, stress harness scoring, and model behavior without changing graph indexing semantics.

The other seam remains Q-P0's **target authority vs recovered context**: prompt construction should carry an explicit operator-approved target-authority field, while startup/resume pointers remain advisory evidence only.

## Sources read this iteration (delta from prior)
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`

## Suggested focus for iteration 4
Deepen Q-P0 just enough to identify whether the same Copilot authority helper should live in shared CLI delegation templates or only deep-loop YAML dispatch. Then spend the main pass on Q-OPP: trace direct CocoIndex MCP result flow into Spec Kit search/model-visible envelopes and decide telemetry passthrough vs ranking adoption.
