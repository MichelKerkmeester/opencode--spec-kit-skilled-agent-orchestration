You are running iteration 1 of 7 in a deep-research loop investigating code-graph resilience. Read this prompt fully, then perform research and produce required outputs.

# Iteration 1 — Failure-Mode Survey from Existing Scan Logs

## Focus
Survey existing deep-research and deep-review iteration logs across the repo for patterns of code-graph scan failure. Catalog recurring classes of error.

## Research Questions
- Q3: Failure modes in scan logs — what classes of scan failure recur?

## Required reads
1. Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-strategy.md`
2. Existing iteration logs (sample broadly, prefer those mentioning code_graph_scan or code_graph_status):
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/logs/iteration-*.log`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/logs/iteration-*.log`
   - Any other `*.log` under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` that mentions code_graph
3. Code-graph scan implementation: `.opencode/skill/system-spec-kit/mcp_server/lib/` (browse for code-graph related files, likely under `lib/code-graph/` or similar — find via `Glob`)

## What to look for
- Parser/tokenizer errors (encoding issues, syntax not handled)
- File-system errors (ENOENT mid-scan, permission denied, symlink loops)
- Timeout / OOM during scan
- Edge resolution failures (unresolved imports, missing symbols)
- Schema mismatches between scan output and DB schema
- Concurrency errors (multiple scans running at once, lock contention)
- Recurring patterns where the same file class triggers the same error

## Outputs (MANDATORY — produce all three)

### 1. Iteration markdown
Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-001.md`

Structure:
```
# Iteration 1 - Failure-Mode Survey

## Summary
[2-3 sentences]

## Findings

### Recurring failure classes
- [Class name]: [description]
  - Evidence: [log path:line ranges]
  - Frequency: [N occurrences across M logs]

### File classes triggering errors
- [Pattern]: [why it fails, where evidence]

### Confirmed-working scan paths
- [What does work, for contrast]

## Files Reviewed
- [list with line ranges]

## Convergence Signals
- newFindingsRatio: [number 0-1] (this is iteration 1 so likely 1.0)
- dimensionsCovered: ["failure-modes"]
```

### 2. Delta JSON
Path: `.opencode/specs/.../007-code-graph-resilience-research/research/deltas/iteration-001.json`

Schema:
```json
{
  "iteration": 1,
  "research_questions_answered": ["Q3"],
  "findings": [
    {"id": "F-FM-001", "class": "[failure-class]", "frequency": N, "evidence": "log:line"}
  ],
  "newFindingsCount": N,
  "newFindingsRatio": 0.0-1.0,
  "timestamp": "2026-04-25T..."
}
```

### 3. State log append
Append one JSONL line to `.opencode/specs/.../007-code-graph-resilience-research/research/deep-research-state.jsonl`:
```json
{"type":"iteration","iteration":1,"research_questions":["Q3"],"filesReviewed":[...],"newFindingsCount":N,"newFindingsRatio":...,"timestamp":"..."}
```

## Constraints
- Read-only research. Do NOT modify any reviewed file.
- Cite file:line for every finding.
- If you find zero recurring failures, say so — don't invent.
