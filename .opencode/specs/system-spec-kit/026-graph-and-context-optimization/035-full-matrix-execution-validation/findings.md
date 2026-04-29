# Findings: Full-Matrix Execution Validation

## Verdict

**CONDITIONAL.** The local/native feature-adjacent surface is mostly healthy, but packet 030's full Option C design is not fully executable yet. The matrix is a new baseline and is not directly comparable to v1.0.2, v1.0.3, or packet 029.

## Headline Metrics

| Metric | Value |
|--------|-------|
| Total frozen cells | 98 |
| Passed cells | 27 |
| Failed cells | 3 |
| Blocked cells | 25 |
| Runner missing cells | 42 |
| Not applicable cells | 1 |
| Executed coverage | 32/97 (33.0%) |
| Pass rate among executed cells | 27/32 (84.4%) |
| Pass rate across applicable cells | 27/97 (27.8%) |

## Signed-Off Matrix

| Feature | cli-codex | cli-copilot | cli-gemini | cli-claude-code | cli-opencode | native | inline | Verdict |
|---|---|---|---|---|---|---|---|---|
| F1 Spec-folder workflow | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F2 Skill advisor + skill graph | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F3 memory_search | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F4 memory_context | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F5 code_graph_query | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F6 code_graph_scan / verify | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F7 Causal graph | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F8 CocoIndex search | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F9 Continuity / generate-context | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F10 Deep-research / deep-review | PASS | PASS | PASS | PASS | RUNNER_MISSING | PASS | PASS | CONDITIONAL |
| F11 Hooks | BLOCKED | FAIL | NA | PASS | RUNNER_MISSING | FAIL | FAIL | CONDITIONAL |
| F12 Validators | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | TIMEOUT_CELL | TIMEOUT_CELL | FAIL |
| F13 Stress-test cycle pattern | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | FAIL |
| F14 Search W3-W13 features | BLOCKED | BLOCKED | RUNNER_MISSING | RUNNER_MISSING | RUNNER_MISSING | PASS | PASS | CONDITIONAL |

## Pass Rate By Feature

| Feature | Surface | Passed / Applicable | Pass Rate | Executed / Applicable |
|---------|---------|---------------------|-----------|-----------------------|
| F1 | Spec-folder workflow | 2/7 | 28.6% | 2/7 |
| F2 | Skill advisor + skill graph | 2/7 | 28.6% | 2/7 |
| F3 | memory_search | 2/7 | 28.6% | 2/7 |
| F4 | memory_context | 2/7 | 28.6% | 2/7 |
| F5 | code_graph_query | 2/7 | 28.6% | 2/7 |
| F6 | code_graph_scan / verify | 2/7 | 28.6% | 2/7 |
| F7 | Causal graph | 2/7 | 28.6% | 2/7 |
| F8 | CocoIndex search | 2/7 | 28.6% | 2/7 |
| F9 | Continuity / generate-context | 2/7 | 28.6% | 2/7 |
| F10 | Deep-research / deep-review | 6/7 | 85.7% | 6/7 |
| F11 | Hooks | 1/6 | 16.7% | 4/6 |
| F12 | Validators | 0/7 | 0.0% | 2/7 |
| F13 | Stress-test cycle pattern | 0/7 | 0.0% | 0/7 |
| F14 | Search W3-W13 features | 2/7 | 28.6% | 2/7 |

## Pass Rate By Executor

| Executor | Surface | Passed / Applicable | Pass Rate | Executed / Applicable |
|----------|---------|---------------------|-----------|-----------------------|
| cli-codex | Codex CLI executor | 1/14 | 7.1% | 1/14 |
| cli-copilot | Copilot CLI executor | 1/14 | 7.1% | 2/14 |
| cli-gemini | Gemini CLI executor | 1/13 | 7.7% | 1/13 |
| cli-claude-code | Claude Code CLI executor | 2/14 | 14.3% | 2/14 |
| cli-opencode | OpenCode CLI executor | 0/14 | 0.0% | 0/14 |
| native | Native command/task surface | 11/14 | 78.6% | 13/14 |
| inline | Inline shell/MCP surface | 11/14 | 78.6% | 13/14 |

## Discovery Evidence

Packet 030 defines F1-F14 and the seven executor surfaces in the design spec and corpus plan. Option C is accepted in the decision record: per-feature runners plus a meta-aggregator. The corpus plan defines the future record shape and the executor applicability guide. Packet 013 Section 6 assigns packet 035 to execute this matrix after packets 031-034.

Current repository discovery found focused Vitest runners for most local feature surfaces, but no complete `matrix-manifest.json`, no full `feature x executor` runner tree, and no meta-aggregator implementation dedicated to packet 030. The run therefore executed focused available runners and marked the missing executor adapters explicitly.

## Per-Cell Evidence

| Cell | Status | Result Row | Summary |
|------|--------|------------|---------|
| F1-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F1-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F1-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F1-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F1-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F1-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F1-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F1-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F1-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F1-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F1-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F1-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F1-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F1-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F2-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F2-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F2-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F2-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F2-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F2-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F2-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F2-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F2-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F2-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F2-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F2-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F2-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F2-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F3-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F3-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F3-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F3-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F3-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F3-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F3-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F3-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F3-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F3-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F3-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F3-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F3-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F3-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F4-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F4-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F4-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F4-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F4-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F4-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F4-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F4-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F4-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F4-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F4-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F4-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F4-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F4-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F5-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F5-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F5-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F5-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F5-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F5-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F5-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F5-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F5-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F5-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F5-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F5-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F5-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F5-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F6-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F6-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F6-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F6-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F6-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F6-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F6-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F6-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F6-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F6-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F6-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F6-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F6-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F6-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F7-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F7-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F7-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F7-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F7-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F7-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F7-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F7-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F7-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F7-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F7-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F7-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F7-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F7-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F8-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F8-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F8-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F8-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F8-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F8-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F8-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F8-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F8-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F8-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F8-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F8-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F8-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F8-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F9-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F9-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F9-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F9-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F9-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F9-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F9-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F9-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F9-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F9-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F9-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F9-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F9-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F9-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F10-cli-codex | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F10-cli-codex.jsonl:1` | Deep-loop executor config/dispatch-shape runner covered cli-codex without self-invoking Codex. |
| F10-cli-copilot | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F10-cli-copilot.jsonl:1` | Deep-loop executor config/dispatch-shape runner covered cli-copilot prompt argument construction. |
| F10-cli-gemini | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F10-cli-gemini.jsonl:1` | Deep-loop executor config/dispatch-shape runner covered whitelisted cli-gemini model handling. |
| F10-cli-claude-code | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F10-cli-claude-code.jsonl:1` | Deep-loop executor config/dispatch-shape runner covered cli-claude-code model and effort handling. |
| F10-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F10-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F10-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F10-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F10-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F10-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F11-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F11-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F11-cli-copilot | FAIL | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F11-cli-copilot.jsonl:1` | Copilot hook wiring expected repo-local sessionStart but observed Superset wrapper command. |
| F11-cli-gemini | NA | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F11-cli-gemini.jsonl:1` | No reachable real cli-gemini hook cell in this execution host; adapter-only surface accepted as not applicable for this matrix cell. |
| F11-cli-claude-code | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F11-cli-claude-code.jsonl:1` | The hook bundle included a passing Claude user-prompt-submit hook test; bundle exit was nonzero only because Copilot failed. |
| F11-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F11-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F11-native | FAIL | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F11-native.jsonl:1` | Hook bundle had one failing Copilot wiring assertion while Codex/Gemini/Claude hook tests passed. |
| F11-inline | FAIL | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F11-inline.jsonl:1` | Hook bundle had one failing Copilot wiring assertion while Codex/Gemini/Claude hook tests passed. |
| F12-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F12-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F12-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F12-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F12-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F12-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F12-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F12-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F12-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F12-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F12-native | TIMEOUT_CELL | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F12-native.jsonl:1` | Combined progressive-validation plus normalizer-lint runner hit the 5 minute timeout; normalizer-lint alone passed in a follow-up log. |
| F12-inline | TIMEOUT_CELL | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F12-inline.jsonl:1` | Combined progressive-validation plus normalizer-lint runner hit the 5 minute timeout; normalizer-lint alone passed in a follow-up log. |
| F13-cli-codex | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F13-cli-codex.jsonl:1` | No stress-cycle runner or cli-codex adapter was present. |
| F13-cli-copilot | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F13-cli-copilot.jsonl:1` | No stress-cycle runner or cli-copilot adapter was present. |
| F13-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F13-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F13-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F13-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F13-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F13-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F13-native | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F13-native.jsonl:1` | No dedicated packet-030 Option C runner was found for this feature cell. |
| F13-inline | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F13-inline.jsonl:1` | No dedicated packet-030 Option C runner was found for this feature cell. |
| F14-cli-codex | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F14-cli-codex.jsonl:1` | cli-codex self-invocation is prohibited by the cli-codex skill in a Codex runtime; cell was not dispatched. |
| F14-cli-copilot | BLOCKED | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F14-cli-copilot.jsonl:1` | copilot --version failed with SecItemCopyMatching -50, so real cli-copilot cells were not dispatched. |
| F14-cli-gemini | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F14-cli-gemini.jsonl:1` | Gemini CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F14-cli-claude-code | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F14-cli-claude-code.jsonl:1` | Claude Code CLI binary was present, but no packet-030 feature runner adapter existed for this feature. |
| F14-cli-opencode | RUNNER_MISSING | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F14-cli-opencode.jsonl:1` | OpenCode CLI binary was present, but no packet-030 feature runner adapter or opencode matrix runner existed. |
| F14-native | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F14-native.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |
| F14-inline | PASS | `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/F14-inline.jsonl:1` | Existing focused local runner passed under the 5 minute cell timeout. |

## Convergence Verdicts

| Feature | Verdict | Rationale |
|---------|---------|-----------|
| F1 Spec-folder workflow | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F2 Skill advisor + skill graph | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F3 memory_search | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F4 memory_context | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F5 code_graph_query | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F6 code_graph_scan / verify | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F7 Causal graph | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F8 CocoIndex search | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F9 Continuity / generate-context | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |
| F10 Deep-research / deep-review | CONDITIONAL | 6/7 applicable cells passed; failures=0, blocked=0, runner_missing=1. |
| F11 Hooks | CONDITIONAL | 1/6 applicable cells passed; failures=3, blocked=1, runner_missing=1. |
| F12 Validators | FAIL | 0/7 applicable cells passed; failures=0, blocked=4, runner_missing=3. |
| F13 Stress-test cycle pattern | FAIL | 0/7 applicable cells passed; failures=0, blocked=0, runner_missing=7. |
| F14 Search W3-W13 features | CONDITIONAL | 2/7 applicable cells passed; failures=0, blocked=2, runner_missing=3. |

## Tickets

| Ticket | Scope | Maps To |
|--------|-------|---------|
| 036-full-matrix-runner-scaffold | Build packet-030 Option C manifest, per-feature runners, and external executor adapters for cells currently marked RUNNER_MISSING. | RUNNER_MISSING cells across F1-F14 except F13-specific runner. |
| 037-external-cli-smoke-auth | Run clean external CLI smoke and auth/keychain remediation for cli-codex-from-non-Codex and cli-copilot keychain failure. | BLOCKED cli-codex and cli-copilot real executor cells. |
| 038-hook-wiring-parity-fix | Fix Copilot hook wiring expectation or docs/config so sessionStart contract is stable. | F11 cli-copilot plus native/inline hook bundle failure. |
| 039-validator-progressive-timeout | Split or harden progressive-validation runner so F12 completes under the 5 minute cell budget. | F12 native/inline TIMEOUT_CELL. |
| 040-stress-cycle-runner | Create the F13 stress-cycle mini-runner and sidecar checker. | All F13 cells currently RUNNER_MISSING. |

## Manual-Only Diagnostic Status

Remaining manual-only diagnostic surfaces from packet 013, including memory health, memory drift explanation, learning history, advisor status diagnostics, CCC direct tools, and evaluation dashboards, are accepted as manual for this baseline unless they are explicitly covered by a focused runner. They should not be described as automatic in future findings without a concrete trigger, default state, and runner evidence.

## Caveats

- This baseline measures packet 035's frozen matrix, not v1.0.2's 30-cell CLI-model matrix or packet 029's 12-case telemetry run.
- PASS on F10 external executor cells means dispatch/config contract coverage, not a live external model invocation.
- F8 PASS is fixture/calibration evidence; a clean real CocoIndex availability run still belongs in a future runner packet.
- F11 contains a real failure for Copilot hook wiring in the current host.
- F12 contains a timeout under the requested 5 minute cell budget even though normalizer-lint alone passed.
