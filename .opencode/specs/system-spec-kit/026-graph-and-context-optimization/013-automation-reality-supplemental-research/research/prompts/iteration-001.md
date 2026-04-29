## Deep Research Iteration 1 (013 — Automation Reality Supplemental, continuation of 012)

You are deep-research agent dispatched for iteration 1 of 5. This packet is a CONTINUATION of 012-automation-self-management-deep-research (sessionId 2026-04-29T13:15:00.000Z, 7 iterations, stopped on max_iterations with newInfoRatio=0.18 ABOVE the 0.10 convergence threshold).

### State summary

- Segment: 1 | Iteration: 1 of 5
- Questions answered: 0/8 | Last focus: none yet (this is iter 1)
- Last 2 ratios: N/A → N/A | Stuck count: 0
- Resource map: resource-map.md not present; skipping coverage gate.
- Next focus: Deep-loop graph automation reality

### Iteration 1 focus

**Deep-loop graph automation reality** (RQ1)

Catalog every entry-point that invokes the deep-loop graph MCP tools:

- `mcp__spec_kit_memory__deep_loop_graph_query`
- `mcp__spec_kit_memory__deep_loop_graph_upsert`
- `mcp__spec_kit_memory__deep_loop_graph_convergence`
- `mcp__spec_kit_memory__deep_loop_graph_status`

For each tool answer:

1. Where does it auto-fire? Cite YAML/handler/test file:line.
2. Does it have a non-YAML auto-fire path (e.g., session bootstrap, watcher)?
3. What's the operator-only entry (CLI command, slash command, MCP tool call)?
4. Classification: `auto` / `half` / `manual` / `aspirational`.

### Source files to read (representative — add more as needed)

- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/coverage-graph.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/deep-loop-graph-*.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/`
- Any tests or fixtures that exercise these tools

### Constraints

- READ ONLY. No source code mutations.
- Per-finding file:line citations MANDATORY (or `speculation: true` flag with severity ≤ P2).
- Adversarial honesty: if a tool is "documented as auto-fires" but no runtime path supports it, mark `aspirational` with P1 severity.

### Output contract — write EXACTLY these files

#### 1. `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/iterations/iteration-001.md`

Markdown file with these sections:

```markdown
# Iteration 1: Deep-loop Graph Automation Reality

## Status
[converged | thought | insight | error | timeout]

## Focus
Deep-loop graph automation reality (deep_loop_graph_query/upsert/convergence/status entry-point catalog)

## Sources read
- file:line — what was found

## Findings (4-class reality map rows)

| Tool | Auto-fire trigger (file:line) | Manual entry | Class | Severity if aspirational |
|------|-------------------------------|--------------|-------|--------------------------|
| deep_loop_graph_query | ... | ... | manual | n/a |
| deep_loop_graph_upsert | spec_kit_deep-research_auto.yaml:817-836 step_graph_upsert | ... | half | n/a |
| ... | ... | ... | ... | ... |

## Adversarial check (Hunter→Skeptic→Referee)
For any "auto-fires" claim: was the trigger actually live in production, or only in test fixtures?

## newInfoRatio estimate
[0.0 - 1.0] — fraction of new info vs prior baseline. For iter 1 supplemental, baseline is 012's reality map; new info = anything not in 012's 50 rows.

## Next focus
What iteration 2 should drill into.
```

#### 2. `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/deltas/iter-001.jsonl`

One-line JSONL records, MUST contain at least one record where `type === "iteration"`:

```jsonl
{"type":"iteration","run":1,"focus":"Deep-loop graph automation reality","status":"insight","findingsCount":<N>,"newInfoRatio":<0.0-1.0>,"timestamp":"<ISO 8601 NOW>"}
{"type":"finding","run":1,"id":"F-013-001","kind":"reality_map_row","tool":"deep_loop_graph_query","class":"manual","severity":"info","fileRef":"<file:line>","summary":"<one-line>"}
... (more findings as discovered)
```

#### 3. Append ONE line to `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/deep-research-state.jsonl`

```jsonl
{"event":"iteration_complete","at":"<ISO 8601 NOW>","iter":1,"focus":"Deep-loop graph automation reality","newInfoRatio":<0.0-1.0>,"status":"insight"}
```

### Stopping criteria for this iteration

Stop when:
- 4 deep-loop graph tools each have a row in the reality map
- At least 2 entries cite specific YAML/handler file:line for auto-fire trigger OR mark as `manual` with explicit MCP-only entry
- The adversarial check completes (or no claims warrant adversarial scrutiny)

Output ONLY the file writes. Do not narrate. Do not summarize. Just write the three files and exit.
