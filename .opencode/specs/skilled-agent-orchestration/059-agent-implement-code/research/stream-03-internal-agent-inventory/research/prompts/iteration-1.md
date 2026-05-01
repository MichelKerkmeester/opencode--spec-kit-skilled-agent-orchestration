# Deep-Research Iteration 1 - Stream 03 Internal Agent Inventory

## STATE

This is iteration 1 of up to 8. No prior iterations. All 5 questions are open.

Research Topic: Inventory the existing internal .opencode/agent/* ecosystem and harness governance to identify (1) skill auto-loading patterns, (2) stack-agnostic detection mechanisms in sk-code, (3) caller-restriction enforcement (D3 BLOCKER), (4) write-capable safety guarantees, (5) sub-agent dispatch contracts and depth/nesting rules. Map findings to a concrete recommendation set for .opencode/agent/code.md design.
Iteration: 1 of 8
Focus Area: Q3 caller-restriction enforcement (D3 BLOCKER) - inspect every .opencode/agent/*.md frontmatter for caller-restriction fields, then check AGENTS.md and orchestrate.md routing patterns.
Remaining Key Questions:
- Q1: Skill auto-loading patterns - how do current agents pick up skills?
- Q2: Stack-agnostic detection mechanisms - how does sk-code detect stack?
- Q3: Caller-restriction enforcement (D3 BLOCKER)
- Q4: Write-capable safety guarantees - how do existing write-capable agents bound their writes?
- Q5: Sub-agent dispatch contracts and depth/nesting rules
Last 3 Iterations Summary: N/A (first iteration)

## STATE FILES

All paths are relative to the repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-config.json
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-state.jsonl
- Strategy: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-strategy.md
- Registry: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/findings-registry.json
- Write iteration narrative to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/iterations/iteration-001.md
- Write per-iteration delta file to: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects.

## TASK FOR THIS ITERATION

Focus on Q3 (caller-restriction enforcement) — this is the explicit D3 blocker:

1. Read every file under `.opencode/agent/*.md` and survey the frontmatter. Look for ANY field that could express caller-restriction (e.g. `caller:`, `dispatchableBy:`, `parent:`, `callableFrom:`, `task:`, `owner:`, `mode:`, `gate:`, `permissionedBy:`, etc.). Note exact frontmatter keys per agent.
2. Read AGENTS.md (root) §5 "Distributed Governance Rule" and §5 Agent Routing — capture the exact wording about which agents are dispatched by what.
3. Read `.opencode/agent/orchestrate.md` — identify how it lists/routes to other agents (e.g. is there a body section "Routes to: @debug, @write, ..." that the harness honors? Or is it pure prose?).
4. Search for any harness-level dispatch validator: grep/coco for `dispatchableBy`, `caller`, `parent_agent`, `restricted_callers`, `if (!isOrchestrator)` patterns in `.opencode/skill/system-spec-kit/mcp_server/`, `.opencode/plugin/`, or anywhere the harness loads agent files.
5. Note also: `.opencode/agent/improve-agent.md` and `.opencode/agent/improve-prompt.md` are dispatched by `/improve:agent` and `/improve:prompt` commands — check if their frontmatter says anything about caller restriction. Same for `@deep-research` and `@deep-review`.

Begin by inventorying every agent's frontmatter as a table, then assess what fields exist that COULD enforce caller restriction at the harness level vs convention only.

## OUTPUT CONTRACT

Produce THREE artifacts:

1. **Iteration narrative markdown** at `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/iterations/iteration-001.md`. Required sections (use `## Heading` format):
   - `# Iteration 1: <focus title>`
   - `## Focus`
   - `## Actions Taken`
   - `## Findings` (bulleted; cite file:line)
   - `## Questions Answered`
   - `## Questions Remaining`
   - `## Sources Consulted` (bulleted file:line list)
   - `## Reflection` with three labeled sub-bullets:
     - `- What worked and why: ...`
     - `- What did not work and why: ...`
     - `- What I would do differently: ...`
   - `## Recommended Next Focus`
   - Optional: `## Ruled Out` and/or `## Dead Ends` (bulleted)

2. **Canonical JSONL iteration record** appended to the state log file (single line, newline-terminated). Use EXACTLY `"type":"iteration"`. Required fields:
   ```json
   {"type":"iteration","run":1,"iteration":1,"status":"complete","focus":"<short>","findingsCount":<n>,"newInfoRatio":<0..1>,"keyQuestions":["q3","q4","q5"],"answeredQuestions":[],"ruledOut":[],"focusTrack":"caller-restriction","toolsUsed":["Read","Grep"],"sourcesQueried":["<file:line>", "..."],"timestamp":"<ISO8601>","durationMs":<ms>}
   ```
   Append via: `printf '%s\n' '<single-line-json>' >> specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-state.jsonl`

3. **Per-iteration delta file** at `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deltas/iter-001.jsonl`. One JSONL line per record:
   - One `{"type":"iteration",...}` matching the state-log append (exact same content)
   - Per-finding `{"type":"finding","id":"f-iter001-001","severity":"P1","label":"...","iteration":1}` records
   - Optionally per-observation/edge/ruled_out records

newInfoRatio for iteration 1 should be high (0.7-0.9) since everything is new context.

Begin now. Stay focused on Q3 caller-restriction. Use Read and Grep heavily. Do NOT modify any source files outside the artifact dir.
