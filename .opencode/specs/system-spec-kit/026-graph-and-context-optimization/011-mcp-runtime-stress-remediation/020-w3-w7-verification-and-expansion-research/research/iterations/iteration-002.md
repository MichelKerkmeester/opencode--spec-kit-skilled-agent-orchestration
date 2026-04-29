---
iteration: 2
focus: RQ2 - W4 conditional rerank wiring
newInfoRatio: 0.84
status: complete
---

# Iteration 002 - W4 Conditional Rerank Wiring

## Focus

Confirm that `decideConditionalRerank` is invoked after commit `74b6ef6b8`, and trace whether the upstream caller puts it on every `memory_search` query path.

## Evidence Reviewed

- Commit `74b6ef6b8` is `refactor(026/000/005/007): W4 conditional rerank default-on; remove SPECKIT_CONDITIONAL_RERANK`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:26` implements `decideConditionalRerank`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:57` triggers on complex queries.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:60` triggers on high authority need.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:63` triggers on multi-channel weak margin.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:66` triggers on weak evidence.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:69` triggers on explicit disagreement reasons.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:327` invokes `decideConditionalRerank`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:328` creates an empty query plan with `complexity: 'unknown'`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:332` only passes candidate count, channel count, and top-score margin signals.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643` defaults `rerank = true`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:912` builds the V2 `PipelineConfig`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:949` calls `executePipeline`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:99` documents `SPECKIT_CROSS_ENCODER` as default true.

## Findings

### F-W4-001 - P1 - Rerank gate is wired, but underfed

Hunter: the Stage 3 gate is definitely live. `memory_search` defaults rerank on, builds the V2 pipeline, and Stage 3 calls `decideConditionalRerank`.

Skeptic: Stage 3 still skips when `options.rerank` is false, the cross-encoder flag is disabled, fewer than four results exist, or the gate has no triggers.

Referee: the gap is not "gate absent"; it is "gate underfed". The live gate recreates an empty QueryPlan with `complexity: 'unknown'`, so the Phase D query-plan telemetry is not actually driving complex-query, high-authority, weak-evidence, or disagreement triggers.

## Wiring Verdict

W4 is the only W3-W7 workstream with a clear production search path today, but it does not yet consume the richer QueryPlan object that Phase C/D intended.

## Opportunities

- Pass the real QueryPlan or equivalent routing metadata from `memory_search`/pipeline config into Stage 3.
- Include gate reason and triggers in search metadata even when rerank is skipped.

## Next Focus

Iteration 003 should trace W5 `_shadow` output from scorer construction to external response and any durable sink.
