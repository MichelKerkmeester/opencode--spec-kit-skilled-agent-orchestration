# Deep-Research Iteration 1 — Code Graph Scan Scope Anomaly

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 5
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Next focus: Read structural-indexer.ts and indexer-types.ts end-to-end to map the actual control flow when incremental=false is passed AND previousGitHead === currentGitHead; reproduce the post-exclude file count empirically using the same `ignore` package the indexer uses; trace exactly where the 3 UNIQUE constraint errors originate.

Research Topic: Why mcp__spec_kit_memory__code_graph_scan({rootDir, incremental:false}) returned 33 files / 809 nodes / 376 edges after packet 012 was deployed, when the expected range per the packet 012 handover was 1000-3000 files. Determine whether this is a correct outcome, a regression in the `incremental` flag handling, a DB cleanup bug on the full-reindex path, or a different root cause. 3 UNIQUE constraint errors hit `code_nodes.symbol_id` for `structural-indexer.ts`, `tree-sitter-parser.ts`, `working-set-tracker.ts`. fullReindexTriggered=false despite incremental=false. previousGitHead === currentGitHead === 162a6cb16. dbFileSize unchanged at 473MB.

Iteration: 1 of 5
Focus Area: Read structural-indexer.ts + indexer-types.ts source; reproduce post-exclude file count; locate UNIQUE-constraint origin

Remaining Key Questions:
- Q1: Is incremental=false actually honored when previousGitHead === currentGitHead, or does the indexer short-circuit?
- Q2: How aggressive is the new .gitignore-aware walk + z_future / z_archive / mcp-coco-index/mcp_server exclude set on this repo? Empirical post-prune file count?
- Q3: Why did 3 indexer-self files hit UNIQUE constraint failed: code_nodes.symbol_id?
- Q4: Did the scan actually replace DB contents or leave a partially-pruned DB? dbFileSize unchanged at 473MB — relationship between row count and on-disk size?
- Q5: Given the evidence, is 33 the correct answer or a regression? If regression, minimal-diff fix?

Last 3 Iterations Summary: none yet

## STATE FILES

All paths are relative to the repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deltas/iter-001.jsonl`

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total. Max 15 minutes wall-clock.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## INVESTIGATION CONTEXT (read these files first)

1. `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` — primary indexer; packet 012 added .gitignore-aware walk
2. `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts` — defines DEFAULT_EXCLUDES list (look for z_future, z_archive, mcp-coco-index/mcp_server)
3. `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/lib/structural-indexer.js` — built output (the running server uses this)
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md` — packet 012 changes summary
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/session-handover-2026-04-23.md` — full session context

Recommended actions for this iteration (pick 3-5):

A. Read structural-indexer.ts top-to-bottom; document the control flow when scan is called with `incremental=false`. Specifically: does it conditionally skip work when `previousGitHead === currentGitHead`?
B. Read indexer-types.ts to confirm the exact DEFAULT_EXCLUDES content and its precedence vs. user-supplied excludes.
C. Reproduce the post-exclude file count empirically: write a small Node script using the `ignore@5.3.2` package + the same exclude set, walk the workspace root, count files matching the indexer's includeGlobs (likely `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, etc.). Compare to 33 actual.
D. Trace the UNIQUE constraint errors: search the indexer code for `INSERT INTO code_nodes` and locate where `symbol_id` is constructed; check whether the full-reindex path issues a DELETE before re-insert (likely missing for these 3 files).
E. Inspect handlers/code-graph/scan.ts (or equivalent) to see how the `incremental` parameter is forwarded into the indexer. Find the boolean check that triggers `fullReindexTriggered=true`.

## OUTPUT CONTRACT (mandatory)

You MUST produce THREE artifacts:

1. **Iteration narrative** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/iterations/iteration-001.md`. Sections: Focus, Actions Taken, Findings (with file:line citations), Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-state.jsonl`. Use type "iteration" exactly:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|thought|partial|error>","focus":"<short string>","graphEvents":[/* optional */]}
```

Append via single-line JSON with newline. Example: `echo '{"type":"iteration","iteration":1,...}' >> <state_log>`

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deltas/iter-001.jsonl`. One iteration record (same as state-log) plus per-event records (finding/observation/edge/ruled_out/invariant). One JSON object per line.

Example delta records:
```json
{"type":"iteration","iteration":1,"newInfoRatio":0.85,"status":"insight","focus":"..."}
{"type":"finding","id":"f-iter001-001","severity":"P0","label":"incremental=false short-circuits when git head unchanged","iteration":1}
{"type":"observation","id":"obs-iter001-001","packet":"012","classification":"real","iteration":1}
{"type":"edge","id":"e-iter001-001","relation":"CAUSES","source":"obs-iter001-001","target":"f-iter001-001","iteration":1}
{"type":"ruled_out","direction":"DB cleanup regression","reason":"...","iteration":1}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing or malformed.

## START

Begin Iteration 1. Read the indexer code first, then act on the recommended actions in priority order.
