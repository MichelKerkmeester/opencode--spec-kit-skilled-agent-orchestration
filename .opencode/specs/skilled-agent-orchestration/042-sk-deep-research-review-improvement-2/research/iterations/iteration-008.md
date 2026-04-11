# Iteration 8: D2 Partial-Failure Reducer Audit

## Focus
This iteration investigated D2 by auditing how the new `sk-deep-review` reducer behaves when review state is only partially written. The focus was on malformed JSONL tolerance, markdown-driven finding lifecycle state, and whether blocked-stop gate evidence remains visible when iteration artifacts are incomplete.

## Findings
- `parseJsonl()` silently skips malformed JSONL lines instead of surfacing an error, so a truncated append record disappears from reducer input and repeated reducer runs stabilize around the surviving rows rather than flagging corruption (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:64-85`).
- Finding lifecycle state is markdown-authoritative: `parseIterationFile()` only extracts findings from `## Findings` -> `### P0/P1/P2` blocks, and `buildFindingRegistry()` derives `firstSeen`, `lastSeen`, severity transitions, and repeated-finding status from parsed iteration markdown while using JSONL only for `resolvedFindings` (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:165-200`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295`).
- In a temp harness against the live reducer entrypoint, a run-2 JSONL row reporting `dimensions:["security"]` and `findingsSummary {P0:1,P1:0,P2:0}` still produced a registry where `F001` remained `P1`, `lastSeen: 1`, and had no transition when `iteration-002.md` was truncated before a parseable finding bullet. The dashboard still rendered run 2 as `1/0/0`, which means progress rows can diverge from lifecycle state under partial markdown writes because the dashboard trusts JSONL while the registry trusts markdown (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:146-156`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:503-512`).
- The blocked-stop contract requires persisted `stopReason`, `legalStop.blockedBy`, and full `gateResults`, but the reducer-owned surfaces never read those fields. Under a partial iteration failure, the JSONL event can still retain the stop-block explanation, yet the dashboard/strategy outputs drop it entirely because rendering is driven by iteration summaries, severity counts, and dimension coverage only (`.opencode/skill/sk-deep-review/references/convergence.md:44-87`, `.opencode/skill/sk-deep-review/references/convergence.md:364-411`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-602`).
- The reducer's idempotency guarantee is therefore omission-based rather than failure-preserving: `reduceReviewState()` will deterministically reproduce the same registry/dashboard for the same broken on-disk inputs, but it does so by normalizing malformed JSONL away and by accepting partially written markdown as a valid zero-or-partial finding source (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:606-658`).

## Ruled Out
- This is not a blanket "any truncation breaks lifecycle" failure. If a truncated iteration file still includes a parseable finding bullet, `parseFindingLine()` and `buildFindingRegistry()` can still record the severity transition and mark the finding as repeated (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:116-143`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:239-267`).

## Dead Ends
- I did not execute the 50+ finding stress portion of the D2 question in this pass; the budget went to reproducing the partial-write divergence first, so scale behavior remains open.

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:39-40
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-007.md:39-40
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:64-85
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:165-200
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-658
- .opencode/skill/sk-deep-review/references/state_format.md:171-206
- .opencode/skill/sk-deep-review/references/convergence.md:44-87
- .opencode/skill/sk-deep-review/references/convergence.md:364-411
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:335-437

## Reflection
- What worked and why: A disposable temp review packet made it possible to separate "malformed JSONL is skipped" from the more important registry/dashboard divergence caused by partially written markdown.
- What did not work and why: A lightly truncated finding bullet still parsed successfully, so I had to tighten the reproduction to an interruption that occurred before the finding line became syntactically valid.
- What I would do differently: I would script a second synthetic packet with 50+ findings next so the remaining D2 scale question can be answered with the same observed-runtime approach.

## Recommended Next Focus
Stay on D2 for one more pass and stress the reducer with a synthetic 50+ finding review packet that mixes repeated finding IDs, severity upgrades/downgrades, and one blocked-stop event per cycle. The goal should be to measure whether Map-by-`findingId` dedup remains stable at scale, whether transition histories stay ordered and complete across many iterations, and whether the current omission of `legalStop.gateResults` from reducer-owned surfaces materially weakens recovery once the review packet is large enough that operators depend on those summaries.
