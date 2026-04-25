# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 10
Questions: 4/5 evidence-iterations | Last focus: RQ2 depth: GitNexus change-safety implementations for detect_changes, rename, impact, and shape_check.
Last 2 ratios: 0.72 -> 0.74 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: RQ3 + RQ4 cross-substrate analysis: read GitNexus tool/resource affordances (external/gitnexus/src/mcp/resources.ts, group surfaces, agent-facing files) AND Public's Memory causal graph (.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts, lib/search/causal-boost.ts) AND Public's Skill Graph compiler (.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py) and graph-causal scoring lane (.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts). For RQ3: identify which GitNexus concepts can ENHANCE Memory provenance/freshness display WITHOUT collapsing decision lineage into structural code edges. For RQ4: identify how skill-to-tool/skill-to-resource evidence could feed existing graph-causal scoring lane WITHOUT adding a new lane. Cite file:line. Anchoring guard still in effect.

PACKET-SPECIFIC CONSTRAINTS (orchestrator-imposed for pt-02 sibling cross-check):
- ANCHORING GUARD: this is iteration 5 of an INDEPENDENT cross-check. You MUST NOT read or grep any file under research/007-git-nexus-pt-01/ during iterations 1-9. Iteration 10 (synthesis-only) MAY compare against pt-01 — but NOT this iteration.
- SOURCE GROUNDING: every claim about GitNexus or Public must carry a file:line citation. Synthesizing without citations is a quality-guard failure.
- READ-ONLY for both external/ AND Public implementation files — no edits to either. Only writes are: this iteration narrative, JSONL append, and per-iteration delta file.
- PRIOR ITERATIONS: read the strategy.md (.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deep-research-strategy.md) and prior iteration files (.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/iterations/iteration-NNN.md) to build on prior findings. Avoid repeating prior findings — extend, contradict, or deepen them.

Research Topic: Independent cross-check (pt-02): Research the downloaded GitNexus project under .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/external/ for patterns to adopt, adapt, reject, or defer for Public Code Graph, Memory causal graph, and Skill Graph / Skill Advisor surfaces.
Iteration: 5 of 10
Focus Area: RQ3 + RQ4 cross-substrate analysis: read GitNexus tool/resource affordances (external/gitnexus/src/mcp/resources.ts, group surfaces, agent-facing files) AND Public's Memory causal graph (.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts, lib/search/causal-boost.ts) AND Public's Skill Graph compiler (.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py) and graph-causal scoring lane (.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts). For RQ3: identify which GitNexus concepts can ENHANCE Memory provenance/freshness display WITHOUT collapsing decision lineage into structural code edges. For RQ4: identify how skill-to-tool/skill-to-resource evidence could feed existing graph-causal scoring lane WITHOUT adding a new lane. Cite file:line. Anchoring guard still in effect.
Remaining Key Questions:   - RQ1: What GitNexus ingestion, graph schema, process-flow, and query/context patterns are portable to Public Code Graph?
  - RQ2: Which GitNexus impact, detect-changes, rename, route-map, tool-map, shape-check, or group-contract mechanisms are worth adapting for graph safety?
  - RQ3: Which GitNexus concepts can improve Spec Kit Memory causal graph without turning memory into a duplicate code index?
  - RQ4: Which GitNexus tool/resource/agent affordances can inform Skill Graph or Skill Advisor routing evidence?
  - RQ5: What should be adopted, adapted, rejected, or deferred, and what follow-up implementation packets should be created?
Last 3 Iterations Summary: run 2: RQ1 depth: GitNexus ingestion runner, graph schema internals, and Public Code Graph insert... (0.69)
  run 3: RQ2 groundwork: GitNexus MCP safety/query tools versus Public code_graph_query/context/sta... (0.72)
  run 4: RQ2 depth: GitNexus change-safety implementations for detect_changes, rename, impact, and ... (0.74)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deltas/iter-005.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/iterations/iteration-005.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/deltas/iter-005.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

Example delta file contents (one iteration):
```json
{"type":"iteration","iteration":3,"newInfoRatio":0.62,"status":"insight","focus":"..."}
{"type":"finding","id":"f-iter003-001","severity":"P1","label":"...","iteration":3}
{"type":"invariant","id":"inv-iter003-001","label":"...","iteration":3}
{"type":"observation","id":"obs-iter003-001","packet":"007","classification":"real","iteration":3}
{"type":"edge","id":"e-iter003-001","relation":"VIOLATES","source":"obs-001","target":"inv-001","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
