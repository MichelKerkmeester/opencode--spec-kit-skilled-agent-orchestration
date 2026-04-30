## Deep Research Iteration 2 (013 — Automation Reality Supplemental, continuation of 012)

You are deep-research agent dispatched for iteration 2 of 5. Iter 1 completed (deep-loop graph automation reality).

### State summary

- Segment: 1 | Iteration: 2 of 5
- Read prior iter 1 findings from `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-001.md` to avoid duplicate ground.
- Next focus: CCC + eval reporting + ablation runner reality

### Iteration 2 focus

**CCC + eval reporting + ablation runner reality** (RQ2)

Catalog every entry-point that invokes:

- `mcp__spec_kit_memory__ccc_reindex`
- `mcp__spec_kit_memory__ccc_feedback`
- `mcp__spec_kit_memory__ccc_status`
- `mcp__spec_kit_memory__eval_run_ablation`
- `mcp__spec_kit_memory__eval_reporting_dashboard`

For each tool answer:

1. Where does it auto-fire? Cite YAML/handler/test file:line.
2. Is it called by any background path (CI, scheduled cleanup, session bootstrap)?
3. What's the operator-only entry (CLI command, slash command, MCP tool call)?
4. Classification: `auto` / `half` / `manual` / `aspirational`.
5. If `aspirational` (documented but absent), severity: P0 (misleading operators) / P1 (stale doc) / P2 (low impact).

Specifically watch for:

- Tools that exist as MCP handlers but are never wired into any workflow (test-fixture-only)
- CI integrations claimed in docs but with no GitHub Actions / hook config
- Eval/dashboard helpers that only run in test fixtures vs production paths

### Source files to read (representative — add more as needed)

- `.opencode/skill/system-spec-kit/mcp_server/handlers/ccc-reindex.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/ccc-feedback.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/ccc-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-run-ablation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting-dashboard.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ccc/` (if exists)
- Any tests, fixtures, or yaml workflows that reference these tools
- `.github/workflows/` (CI integrations)

### Constraints

- READ ONLY. No source code mutations.
- Per-finding file:line citations MANDATORY (or `speculation: true` flag with severity ≤ P2).
- Adversarial honesty: if a tool is "documented as auto-fires" but no runtime path supports it, mark `aspirational` with appropriate severity.

### Output contract — write EXACTLY these files

#### 1. `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-002.md`

Markdown file with these sections:

```markdown
# Iteration 2: CCC + Eval + Ablation Reality

## Status
[converged | thought | insight | error | timeout]

## Focus
CCC + eval reporting + ablation runner reality

## Sources read
- file:line — what was found

## Findings (4-class reality map rows)

| Tool | Auto-fire trigger (file:line) | Manual entry | Class | Severity if aspirational |
|------|-------------------------------|--------------|-------|--------------------------|
| ccc_reindex | ... | ... | manual | n/a |
| ... | ... | ... | ... | ... |

## NEW gap-findings (P0/P1/P2)
For each "documented but absent" finding, give a 2-3 sentence justification + severity rationale.

## newInfoRatio estimate
[0.0 - 1.0] — fraction of new info vs prior iters + 012's baseline.

## Next focus
What iteration 3 should drill into.
```

#### 2. `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/deltas/iter-002.jsonl`

One-line JSONL records, MUST contain at least one record where `type === "iteration"`:

```jsonl
{"type":"iteration","run":2,"focus":"CCC + eval + ablation reality","status":"insight","findingsCount":<N>,"newInfoRatio":<0.0-1.0>,"timestamp":"<ISO 8601 NOW>"}
{"type":"finding","run":2,"id":"F-013-NNN","kind":"reality_map_row","tool":"<tool>","class":"<class>","severity":"<sev>","fileRef":"<file:line>","summary":"<one-line>"}
```

#### 3. Append ONE line to `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/deep-research-state.jsonl`

```jsonl
{"event":"iteration_complete","at":"<ISO 8601 NOW>","iter":2,"focus":"CCC + eval + ablation reality","newInfoRatio":<0.0-1.0>,"status":"insight"}
```

Output ONLY the file writes. Do not narrate. Do not summarize. Just write the three files and exit.
