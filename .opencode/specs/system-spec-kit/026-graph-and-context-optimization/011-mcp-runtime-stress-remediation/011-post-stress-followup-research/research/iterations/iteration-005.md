# Iteration 005 — Authority preamble and telemetry passthrough closure

## Status
- Iteration: 5 / 10
- Focus: close Q-P0 with implementation-ready authority handling; refine Q-P1 harness scope; verify Q-OPP as schema/provenance passthrough
- newInfoRatio: 0.46
- Convergence trajectory: P0 and P1 now have recommended winners with falsifiable criteria; Q-OPP is close to converged as a no-rerank passthrough packet.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

Recommended winner: add an explicit target-authority preamble in the deep-loop Copilot dispatch helper, and make both deep-research and deep-review use it. This beats a cli-copilot documentation-only fix because the failing execution path is command-owned, non-interactive, and already launches Copilot with mutation authority.

Evidence:
- `010-stress-test-rerun-v1-0-2/findings.md:19` identifies I1/cli-copilot as the worst single cell, and `findings.md:113` through `findings.md:115` recommends tightening the planner-first/Gate-3 behavior rather than letting Copilot infer a target folder.
- `003-continuity-memory-runtime/004-memory-save-rewrite/spec.md:60` states the intended `/memory:save` runtime contract: planner-first by default, stopping short of mutation unless explicitly moved into a mutating mode.
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:66` through `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:70` currently only chooses raw prompt versus `@PROMPT_PATH`; it does not encode target authority.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:601` through `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:606` imports and calls that helper, then `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:617` through `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:625` dispatches `copilot -p ... --allow-all-tools --no-ask-user`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:667` through `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:683` duplicates the same Copilot prompt-size branch in shell, also with `--allow-all-tools` and `--no-ask-user`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` already exists as the right unit-test home for helper behavior, and `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts` already imports `resolveCopilotPromptArg`, so the migration has obvious coverage anchors.

Implementation sketch:

```ts
export type CopilotTargetAuthority =
  | { kind: 'approved'; specFolder: string }
  | { kind: 'missing'; writeIntent: boolean };

export function buildCopilotPromptArg(input: {
  promptPath: string;
  prompt: string;
  targetAuthority: CopilotTargetAuthority;
  thresholdBytes?: number;
}): string {
  const preamble = input.targetAuthority.kind === 'approved'
    ? `Spec folder: ${input.targetAuthority.specFolder} (operator-approved target authority for this task).\n`
    : input.targetAuthority.writeIntent
      ? 'Do not edit files or call mutating tools. Return only the Gate 3 folder-selection question/options.\n'
      : '';
  const prompt = `${preamble}\n${input.prompt}`;
  return Buffer.byteLength(prompt, 'utf8') <= (input.thresholdBytes ?? 16384)
    ? prompt
    : `${preamble}\nRead the instructions in @${input.promptPath} and follow them exactly. Do not deviate.`;
}
```

Patch sequence:
1. Add `buildCopilotPromptArg` in `executor-config.ts`, keep `resolveCopilotPromptArg` as a deprecated wrapper only if needed for compatibility.
2. In deep-research YAML, replace `resolveCopilotPromptArg(promptPath, prompt)` with `buildCopilotPromptArg({ promptPath, prompt, targetAuthority })`.
3. In deep-review YAML, replace the shell prompt-size branch with the same Node helper path so prompt authority cannot drift between loops.
4. Source `targetAuthority` only from the command's resolved spec folder / workflow state, not from bootstrap context, memory search, `last_active_child_id`, or prompt body text. If the workflow cannot prove the folder was operator-approved and write intent is present, use `kind:"missing", writeIntent:true`.

Falsifiable success criteria:
- Small prompt with approved folder: Copilot arg includes the exact approved spec folder and does not include the plan-only block.
- Large prompt with approved folder: the `@PROMPT_PATH` wrapper still carries the exact approved folder preamble before the file reference.
- Continuity-write prompt with missing authority: Copilot arg contains the plan-only Gate 3 block and no "operator-approved" wording.
- Prompt body mentions another last-active or bootstrap folder: generated arg still names only the explicit `targetAuthority.specFolder`.
- Deep-review and deep-research both call the same helper; no shell-only Copilot prompt branch remains.
- An I1-style `/memory:save` replay under cli-copilot returns a Gate 3 question when no target authority is passed, and performs no `memory_save` mutation.

## Q-P1: code-graph fast-fail not testable

Recommended winner: keep the existing mocked unit contract, then add a deterministic degraded-graph sweep sub-cell using an isolated `SPEC_KIT_DB_DIR`. Do not mutate or delete the operator's live graph DB.

Refined evidence:
- `005-code-graph-fast-fail/spec.md:96` through `005-code-graph-fast-fail/spec.md:97` requires blocked responses to emit `fallbackDecision.nextTool` and to cover the routing matrix.
- The production branch is small and already explicit: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:791` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:804` maps readiness error to `rg` and full-scan-required to `code_graph_scan`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:76` through `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:129` already covers empty, stale full-scan, stale selective, and fresh branches with mocked readiness.
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:132` through `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:159` covers readiness errors routing to `rg`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:229` through `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:268` verifies two real full-scan-required readiness causes: git HEAD drift with apparently fresh tracked files and too-large stale sets.
- `findings.md:118` through `findings.md:120` says the v1.0.2 gap was not absent unit coverage; it was that Q1 cells never exercised degraded graph state end-to-end.

Implementation sketch for the v1.0.3 harness:
1. Launch the target CLI/MCP process with `SPEC_KIT_DB_DIR=<tmp isolated dir>`.
2. Do not run `code_graph_scan` before the degraded Q1 prompt.
3. Dispatch a callers/calls question that strongly prefers `code_graph_query`.
4. Capture the first structural read payload. Expected: `status:"blocked"`, `requiredAction:"code_graph_scan"`, and `fallbackDecision:{nextTool:"code_graph_scan", reason:"full_scan_required", retryAfter:"scan_complete"}`.
5. Run `code_graph_scan`, retry the same query, and require the retry to produce structural graph output or an honest no-result payload without falling into blind grep first.
6. Keep one negative-control cell with a pre-scanned isolated DB to prove fresh graphs do not emit `fallbackDecision`.

Falsifiable success criteria:
- Empty isolated DB produces `fallbackDecision.nextTool:"code_graph_scan"` before any grep fallback.
- Stale/full-scan isolated DB produces the same scan-first decision.
- Readiness error or intentionally unavailable DB produces `fallbackDecision.nextTool:"rg"` only after scan diagnostics are unavailable, declined, or failed.
- Fresh and selective-inline states do not emit fallbackDecision; they either answer normally or self-heal inline.
- The harness leaves the real repo graph untouched; all destructive setup happens under the temporary `SPEC_KIT_DB_DIR`.

## Q-P2: file-watcher debounce

See iteration-003 for the preferred approach. I did not re-open Q-P2 beyond confirming that Q-P1's isolated degraded harness should not be conflated with watcher tuning. The watcher fix remains: add a freshness self-check to `code_graph_status` first, then only lower the 2000ms debounce if status evidence still shows delayed pickup.

## Q-OPP: CocoIndex fork telemetry leverage

Recommended winner: close this as a Code Graph seed schema/provenance passthrough packet, not as a search-ranking packet. Do not add `path_class` reranking inside `mcp_server/lib/search` yet.

Refined evidence:
- `004-cocoindex-overfetch-dedup/spec.md:60` and `004-cocoindex-overfetch-dedup/spec.md:73` define the fork's source-identity, dedup, path-class rerank, and telemetry surface.
- `findings.md:44`, `findings.md:86`, and `findings.md:105` confirm fork telemetry was visible in direct S2/opencode cells: `dedupedAliases`, `uniqueResultCount`, `path_class`, and `raw_score`.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:607` through `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:621` lets `code_graph_context` accept CocoIndex seeds, but only exposes file/range/score/snippet/source-level fields.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464` through `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:482` mirrors that strict input schema and omits `rawScore`, `pathClass`, and `rankingSignals`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:20` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:27` models the same reduced `CocoIndexSeed`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:95` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:110` preserves score/snippet/range/provider/source only.
- `rg -n "pathClass|rankingSignals|dedupedAliases|uniqueResultCount|raw_score|source_realpath" .opencode/skill/system-spec-kit/mcp_server/lib/search` found no direct fork-telemetry adoption in the memory search pipeline. That supports "no deletion target" rather than "duplicated ranking boost".
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:548` through `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:568` has the schema test anchor for accepting seed payloads.

Implementation sketch:
1. Extend the `code_graph_context` tool schema and Zod schema with optional `rawScore`, `pathClass`, and `rankingSignals` on CocoIndex seeds.
2. Extend `CocoIndexSeed` and `ArtifactRef` with optional telemetry, preferably `telemetry: { rawScore?: number; pathClass?: string; rankingSignals?: string[] }`.
3. Preserve telemetry in `resolveCocoIndexSeed` without using it for graph ranking.
4. Add tests that a telemetry-rich CocoIndex seed survives schema validation and appears on the resolved anchor; a seed without telemetry keeps current behavior.
5. Leave `dedupedAliases` and `uniqueResultCount` at response-envelope level unless a future integration passes whole CocoIndex response objects into Code Graph.

Falsifiable success criteria:
- `code_graph_context` accepts a CocoIndex seed containing `score`, `rawScore`, `pathClass:"implementation"`, and `rankingSignals:["implementation_boost"]`.
- The resolved anchor preserves those fields as provenance/telemetry.
- Existing minimal CocoIndex seeds still validate and resolve unchanged.
- `mcp_server/lib/search` does not gain a second path-class rerank unless a later packet explicitly protects against double-boosting.

## Q-ARCH: intelligence-system seams (light touch)

Two seams remain the right synthesis candidates:

1. **Authority vs recovered context**: recovered memory/bootstrap context can suggest where work might belong, but mutating delegation needs an explicit authority token. Q-P0 is the concrete failure.
2. **Telemetry vs ranking**: specialized tools can enrich decisions without changing rank. Q-OPP should pass CocoIndex provenance through Code Graph first, then decide later whether any composed ranking needs it.

## Sources read this iteration (delta from prior)
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`

## Suggested focus for iteration 6
Treat Q-P0 and Q-P1 as provisionally converged unless new contradictions appear. Next useful pass: close Q-OPP by checking the exact `code_graph_context` response/anchor serialization path, then revisit Q-P2 with `file-watcher.ts` and `code_graph_status` side by side.
