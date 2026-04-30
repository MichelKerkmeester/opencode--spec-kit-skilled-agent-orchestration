# Iteration 004 — Copilot authority helper placement and CocoIndex telemetry boundary

## Status
- Iteration: 4 / 10
- Focus: narrow Q-P0 helper placement; deepen Q-OPP telemetry passthrough vs ranking adoption
- newInfoRatio: 0.41
- Convergence trajectory: Q-P0 is close to a specific shared-helper proposal; Q-OPP now has a concrete first consumer and a conservative adoption path.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

Iteration 003's proposed helper should not live only in the deep-research YAML branch. The better first fix is a shared deep-loop Copilot prompt builder in `executor-config.ts`, because the same high-risk autonomous Copilot pattern exists on at least two skill-owned loop surfaces.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:66` exports the current `resolveCopilotPromptArg` helper, and `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:67` through `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:69` show it only chooses raw prompt vs `@PROMPT_PATH` wrapper. It has no target-authority or plan-only guard.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:601` imports `runAuditedExecutorCommand`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:602` imports `resolveCopilotPromptArg`, and `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:606` passes the resulting prompt directly to Copilot.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:618` through `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:625` dispatch `copilot -p <prompt> --allow-all-tools --no-ask-user`, so a missing authority marker becomes a non-interactive mutating run.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:667` through `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:683` duplicates the same raw/large prompt Copilot branch in shell, also with `--allow-all-tools` and `--no-ask-user`.
- `.opencode/skill/cli-copilot/SKILL.md:269` through `.opencode/skill/cli-copilot/SKILL.md:274` already documents the invariant: pass the Gate-3 spec folder when pre-approved, otherwise ask before delegating because the delegated agent cannot answer Gate 3 interactively.
- `.opencode/skill/cli-copilot/references/integration_patterns.md:97` through `.opencode/skill/cli-copilot/references/integration_patterns.md:110` recommends plan-then-execute and explicitly includes `DO NOT modify any files yet` in the planning prompt.

Recommended approach:
1. Replace `resolveCopilotPromptArg` with, or wrap it behind, `buildCopilotPromptArg({ promptPath, prompt, targetAuthority })` in `executor-config.ts`.
2. Make `targetAuthority` explicit and closed: `{ kind: "approved", specFolder }` or `{ kind: "missing", writeIntent: true }`. Do not infer it from startup, resume, last-active, memory search, or prompt text.
3. For `approved`, prepend `Spec folder: <path> (operator-approved target authority for this task).`
4. For `missing + writeIntent`, prepend a plan-only block: `Do not edit files or call mutating tools. Return the Gate 3 folder-selection question/options only.`
5. Use the helper in both `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml`. Deep-review is not the observed failing cell, but it shares the same autonomous Copilot execution shape.
6. Leave the generic `cli-copilot` skill as documentation/template follow-up rather than the first executable dependency. Its rule is correct, but the concrete bypass lives in command-owned dispatch.

Falsifiable tests:
- Unit-test `buildCopilotPromptArg` below and above the 16KB threshold. The authority preamble must survive both raw-prompt and `@PROMPT_PATH` wrapper modes.
- Replay a continuity-write prompt with no approved folder. Expected: returned prompt contains the plan-only Gate 3 block and no `pre-approved` marker.
- Replay with an approved folder. Expected: returned prompt contains only that folder as target authority, even if the body includes another last-active or bootstrap folder.
- Add parity coverage for deep-review dispatch so the shell branch cannot drift from the deep-research helper.

## Q-P1: code-graph fast-fail not testable

See iteration-002 for the main deterministic harness recommendation. I did not re-open Q-P1 this pass; no new evidence changed the isolated `SPEC_KIT_DB_DIR` degraded-cell design.

## Q-P2: file-watcher debounce

See iteration-003. I did not re-open Q-P2 this pass; the status-readiness probe remains the preferred first remediation over changing the 2000ms watcher debounce.

## Q-OPP: CocoIndex fork telemetry leverage

The first downstream consumer is not `mcp_server/lib/search/`; it is the direct CocoIndex MCP result and the optional Code Graph context seed path. Spec Kit search currently treats CocoIndex as a separate semantic-code tool, not as a fused candidate source inside the memory search pipeline.

Evidence:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md:69` through `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md:73` define the intended fork behavior: keep `.opencode/specs`, add identity fields, fetch `limit * 4`, dedup, rerank by `path_class`, and surface telemetry.
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:36` type per-result `score`, `raw_score`, `path_class`, and `rankingSignals`.
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:158` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:173` dedup by `source_realpath` or `content_hash`, while `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:196` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:205` apply the implementation/docs/spec rerank.
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:246` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:250` return `dedupedAliases` and `uniqueResultCount`; `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:282` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:284` confirm the `limit * 4` over-fetch.
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:152` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:171` map `raw_score`, `path_class`, `rankingSignals`, `dedupedAliases`, and `uniqueResultCount` into the MCP response.
- `rg -n "path_class|dedupedAliases|uniqueResultCount|rankingSignals|raw_score|source_realpath" .opencode/skill/system-spec-kit/mcp_server/lib/search` returned no hits, so there is no direct adoption of the fork telemetry inside the Spec Kit memory search package.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:600` describes `code_graph_context` as accepting CocoIndex search results as seeds. But `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:616` through `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:621` allow only provider, file/range, score, and snippet for CocoIndex seeds.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:20` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:27` model the same limited CocoIndex seed shape, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:95` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:110` preserve only `score`, `snippet`, `range`, provider, and source on the resolved graph anchor.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:11` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:18` list the memory search candidate channels; CocoIndex is not one of them.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1250` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1264` classify intent and compute adaptive fusion weights independently, without consuming fork-level `path_class` or `rankingSignals`.

Refined diagnosis:
The fork telemetry is already model-visible when the caller invokes `mcp__cocoindex_code__search` directly. The gap is not "telemetry absent"; it is "telemetry evaporates when a CocoIndex result becomes a Code Graph seed or when higher-level Spec Kit search describes routing." There is also no duplicated `path_class` rerank in `mcp_server/lib/search`, so there is no deletion target there.

Recommended approach:
1. Do not add a second downstream ranking boost yet. The fork has already adjusted `score` from `raw_score`; applying `path_class` again inside Code Graph or memory search risks double-counting.
2. Extend the `code_graph_context` seed schema and `CocoIndexSeed` interface with optional `rawScore`, `pathClass`, and `rankingSignals`. Preserve them in `ArtifactRef` under a small optional `telemetry` object.
3. Add response-level metadata for `dedupedAliases` and `uniqueResultCount` only where a caller passes the whole CocoIndex response envelope. Do not force those fields onto per-result seeds.
4. Surface the telemetry as explanation and audit context: "semantic seed was implementation-boosted", "docs/spec penalty applied", "N aliases deduped before graph expansion".
5. Add one v1.0.3 rubric dimension for telemetry passthrough: direct CocoIndex response shows fork fields; Code Graph expansion preserves per-seed fork metadata; no duplicate rank boost is applied.

Falsifiable tests:
- Build a `code_graph_context` fixture seed with `provider:"cocoindex"`, `score`, `rawScore`, `pathClass:"implementation"`, and `rankingSignals:["implementation_boost"]`. Expected: the resolved anchor preserves those telemetry fields.
- Send the same seed without telemetry. Expected: current behavior remains unchanged.
- Verify `mcp_server/lib/search` still has no path-class rerank unless a later packet explicitly introduces one with double-boost protection.

## Q-ARCH: intelligence-system seams (light touch)

Two seams now look worth keeping for synthesis:

1. **Target authority vs recovered context**: mutating command dispatch needs an explicit operator-approved authority field. Recovered context can suggest a folder, but it must not become authorization.
2. **Specialist telemetry vs composed context**: CocoIndex and Code Graph now cooperate through seeds, but only a thin file/range/score subset crosses the boundary. A typed telemetry/provenance envelope would let specialized intelligence survive composition without changing ranking semantics.

## Sources read this iteration (delta from prior)
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-003.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skill/cli-copilot/SKILL.md`
- `.opencode/skill/cli-copilot/references/integration_patterns.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

## Suggested focus for iteration 5
Close Q-P0 with an implementation-ready patch sketch and test matrix. Then either verify whether `code_graph_context` telemetry passthrough is enough to close Q-OPP, or do one final check of external bridge/tool schema surfaces before marking Q-OPP converged.
