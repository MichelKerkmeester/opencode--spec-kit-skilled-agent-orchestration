# Deep Research Iteration 002

You are iteration 2 of 10 in a deep-research loop. Build on prior iterations and refine fix proposals for the 5 open questions.

## Topic


## Open Questions

| ID | Topic | Priority |
|----|-------|----------|
| Q-P0 | cli-copilot `/memory:save` Gate 3 bypass | P0 |
| Q-P1 | Deterministic graph degradation harness for fallbackDecision | P1 |
| Q-P2 | File-watcher debounce vs freshness self-check | P2 |
| Q-OPP | CocoIndex fork telemetry leverage in mcp_server/lib/search | P2 |
| Q-ARCH | 1-2 intelligence-system seams (light touch) | P3 |

## Required Reading

**Prior iterations** (read `Suggested focus for iteration` sections to find what to deepen):

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-001.md

**Strategy file** (current state of machine-owned sections — ANSWERED QUESTIONS, RULED OUT, NEXT FOCUS):
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md

**Source-of-evidence** (re-read as needed):
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/

**Tool budget**: 12 calls max, 10 min wall-clock target. Read, Grep, Glob, Bash (read-only).

## Iteration 2 focus

Read prior iterations' `Suggested focus for iteration 2` (if present) AND the strategy file's NEXT FOCUS section. Use those signals to decide which 1-2 questions deserve deepest attention. **Don't re-cover ground already covered** — refine, deepen, falsify, propose specific implementation sketches where feasible.

By iteration 2, expectations:




## Output requirement 1: write `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-002.md` (ABSOLUTE PATH)

Use this structure (omit a question section if it's already converged from prior iterations — note "see iteration-NNN" instead):

```markdown
# Iteration 002 — [your focus theme]

## Status
- Iteration: 2 / 10
- Focus: [theme]
- newInfoRatio: <decimal 0-1>
- Convergence trajectory: <one sentence>

## Q-P0: cli-copilot /memory:save Gate 3 bypass
[skip if converged; else: refined evidence + recommended approach progressing toward final]

## Q-P1: code-graph fast-fail not testable
[same]

## Q-P2: file-watcher debounce
[same]

## Q-OPP: CocoIndex fork telemetry leverage
[same]

## Q-ARCH: intelligence-system seams (light touch)
[same; this section can be very brief in iterations 1-7, more developed in 8-10]

## Sources read this iteration (delta from prior)
- ...

## Suggested focus for iteration 3
[short]
```

## Output requirement 2: write `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deltas/iter-002.jsonl` (ABSOLUTE PATH)

```json
{"type":"iteration","iteration":2,"newInfoRatio":<decimal>,"status":"completed","focus":"<theme>","questionsCovered":[...],"sourcesRead":[...],"keyFindings":[...],"timestamp":"2026-04-27T17:09:22Z"}
```

## Discipline

- **Use the absolute paths above** when writing output files. Do NOT write under "010-stress-test-rerun-v1-0-2/" — that's the source of evidence, not the destination.
- **No fabrication** — every cited file:line MUST verify on disk.
- **Honest newInfoRatio** — if iteration mostly re-traverses known ground, ratio is low (0.1-0.3); if substantial new evidence found, higher (0.4-0.7).
- **Refine, don't re-state** — by iteration 2 you should be deepening, not re-grounding.

# BEGIN NOW

Read prior iterations + strategy + source-of-evidence as needed. Then write the two output files at the absolute paths specified. Begin.
