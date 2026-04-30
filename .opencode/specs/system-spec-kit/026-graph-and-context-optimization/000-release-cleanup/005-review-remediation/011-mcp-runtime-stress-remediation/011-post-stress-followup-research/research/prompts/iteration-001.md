# Deep Research Iteration 001 — Initial Grounding

You are iteration 001 of a 10-iteration deep-research loop. Your job is to ground 5 open questions in real source-of-evidence artifacts and surface 2-3 candidate fix approaches per question.

## Strategy

**Topic**: Refine actionable fix proposals for four v1.0.2 stress-test follow-ups (P0 cli-copilot `/memory:save` Gate 3 bypass; P1 code-graph fast-fail not testable; P2 file-watcher debounce; opportunity CocoIndex fork telemetry not yet leveraged downstream), plus a light architectural touch on intelligence-system seams.

**Iteration 1 focus**: ground the 5 questions in real artifacts. Identify 2-3 candidate fix approaches per question. Don't commit to recommendations yet — surface options.

## Open Questions (5)

| ID | Topic | Priority |
|----|-------|----------|
| Q-P0 | cli-copilot `/memory:save` Gate 3 bypass — origin + minimal fix | P0 |
| Q-P1 | Deterministic graph degradation harness for fallbackDecision exercise | P1 |
| Q-P2 | File-watcher debounce: lower vs add freshness self-check vs both | P2 |
| Q-OPP | CocoIndex fork telemetry: which downstream consumers should adopt which fields; is `path_class` rerank duplicated upstream | P2 |
| Q-ARCH | Light arch touch: 1-2 intelligence-system seams worth focused refinement | P3 |

## Required Reading (this iteration)

Read these files and cite specific lines/anchors in your findings:

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5 (the source of all 4 follow-ups)
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md` (load-bearing for Q-P0)
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-codex-1/score.md` AND `runs/I1/cli-opencode-1/score.md` (compare correct-Gate-3 behavior to Q-P0's broken behavior)
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md` (planner-first contract definition for Q-P0)
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md` (fallbackDecision matrix for Q-P1)
6. `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts` lines 30-100 (Q-P2 debounce mechanism)
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md` (Q-OPP context)
8. Optional: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (search around line 1230 + grep for `path_class`, `dedupedAliases`, `rankingSignals` to confirm non-consumption — Q-OPP)

**Tool budget**: 12 tool calls max, 10 minutes wall-clock target. Use Read, Grep, Glob. No Bash needed for this iteration (no execution yet).

## Output requirement 1: write `research/iterations/iteration-001.md`

Use this structure:

```markdown
# Iteration 001 — Initial Grounding

## Status
- Iteration: 1 / 10
- Focus: ground 5 questions in real artifacts; surface 2-3 candidate fix approaches per question
- newInfoRatio: <decimal 0-1, your honest estimate of how much net-new info this iteration produced>
- Convergence trajectory: <one sentence on how close we are to converged>

## Q-P0: cli-copilot /memory:save Gate 3 bypass

### Evidence cited
- [file:line]: [what it shows]
- ...

### Root cause hypothesis
[One paragraph]

### Candidate fix approaches (2-3)
1. **[Approach name]**: [description], trade-offs: [pros/cons]
2. **[Approach name]**: [description], trade-offs: [pros/cons]
3. (optional) **[Approach name]**: ...

### Open sub-questions for next iteration
- ...

## Q-P1: code-graph fast-fail not testable

[same structure]

## Q-P2: file-watcher debounce

[same structure]

## Q-OPP: CocoIndex fork telemetry leverage

[same structure — note: include explicit grep results showing which `mcp_server/lib/search/*.ts` files DO/DO NOT mention each of the 7 fork fields]

## Q-ARCH: intelligence-system seams (light touch)

### Candidates surfaced (1-2 max, one-line "why now" each)
- ...

## Sources read this iteration
- [file path 1]
- [file path 2]
- ...

## Suggested focus for iteration 002
[One paragraph: which 1-2 questions deserve the deepest attention next based on what's still unresolved]
```

## Output requirement 2: write `research/deltas/iter-001.jsonl`

Single JSONL record (one line, no trailing newline issues):

```json
{"type":"iteration","iteration":1,"newInfoRatio":<decimal>,"status":"completed","focus":"initial-grounding","questionsCovered":["Q-P0","Q-P1","Q-P2","Q-OPP","Q-ARCH"],"sourcesRead":["<paths>"],"keyFindings":["<short summary 1>","<short summary 2>"],"timestamp":"<ISO 8601 UTC>"}
```

## Discipline

- **No fabrication.** Every cited file path MUST exist on disk; every line range MUST be verifiable.
- **No premature commitment.** Surface 2-3 candidates; don't pick a winner yet (later iterations refine).
- **Cite source-of-evidence**, not your priors.
- **Time/tool budget matters.** If tool calls hit 10, cut short and write what you have. The reducer will flag low coverage.
- **Honest `newInfoRatio`**. Iteration 1 typically lands 0.6-0.8 (lots of net-new info). If you couldn't read a required source, drop it.

After finishing, exit cleanly. The orchestrator (parent session) will read your iteration-001.md + iter-001.jsonl, run the reducer, render iteration-002 prompt, and re-dispatch.

---

# BEGIN NOW

Start by reading the source-of-evidence files listed under "Required Reading" above. Then write `research/iterations/iteration-001.md` and `research/deltas/iter-001.jsonl` per the structure specified. Use Read, Grep, Glob tools. Stay within 12 tool calls and 10 minutes. Do not ask for clarification — the prompt is complete. Begin.
