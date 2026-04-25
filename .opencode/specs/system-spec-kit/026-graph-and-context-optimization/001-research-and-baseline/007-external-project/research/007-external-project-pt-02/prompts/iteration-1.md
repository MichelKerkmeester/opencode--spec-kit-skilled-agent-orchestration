# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Architectural baseline — read External Project ARCHITECTURE.md and the package layout under external/src/ to map modules, the ingestion phase DAG, and the query/context/impact MCP tool surfaces. Produce a top-level inventory of patterns that LOOK portable to Public Code Graph, with file:line citations. Do NOT yet evaluate adopt/reject decisions — focus on cataloguing.

PACKET-SPECIFIC CONSTRAINTS (orchestrator-imposed for pt-02 sibling cross-check):
- ANCHORING GUARD: this is iteration 1 of an INDEPENDENT cross-check. You MUST NOT read or grep any file under research/007-external-project-pt-01/ during iterations 1-9. Iteration 10 (synthesis-only) MAY compare against pt-01 — but NOT this iteration.
- SOURCE GROUNDING: every claim about External Project or Public must carry a file:line citation, e.g. [SOURCE: external/ARCHITECTURE.md:80]. Synthesizing without citations is a quality-guard failure.
- READ-ONLY for both external/ AND Public implementation files — no edits to either. Only writes are: this iteration's narrative, JSONL append, and per-iteration delta file.
- TARGET FILES this iteration:
  - external/ARCHITECTURE.md (full)
  - external/src/ (top-level layout via ls + Read of 1-3 entrypoints)
  - external/shared/ (top-level layout)
  - External Project mcp tool surfaces (tools.ts, resources.ts) — top-level scan only
- Public reference points (read-only) for comparison framing only:
  - .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts
  - .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts
  - .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts

Research Topic: Independent cross-check (pt-02): Research the downloaded External Project project under .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/external/ for patterns to adopt, adapt, reject, or defer for Public's Code Graph package, Spec Kit Memory causal graph, and Skill Graph / Skill Advisor surfaces. Ground every claim in exact source citations (file:line). Do NOT modify external/ or Public implementation files. Produce a final Adopt/Adapt/Reject/Defer matrix, per-system recommendations, ownership boundaries, risks, and follow-up implementation packet proposals. Iterations 1-9 MUST NOT read pt-01 artifacts (anchoring guard); iteration 10 MAY compare findings against pt-01 only after independent synthesis is complete.
Iteration: 1 of 10
Focus Area: Architectural baseline — read External Project ARCHITECTURE.md and the package layout under external/src/ to map modules, the ingestion phase DAG, and the query/context/impact MCP tool surfaces. Produce a top-level inventory of patterns that LOOK portable to Public's Code Graph, with file:line citations. Do NOT yet evaluate adopt/reject decisions — focus on cataloguing.
Remaining Key Questions:   - RQ1: What External Project ingestion, graph schema, process-flow, and query/context patterns are portable to Public Code Graph?
  - RQ2: Which External Project impact, detect-changes, rename, route-map, tool-map, shape-check, or group-contract mechanisms are worth adapting for graph safety?
  - RQ3: Which External Project concepts can improve Spec Kit Memory causal graph without turning memory into a duplicate code index?
  - RQ4: Which External Project tool/resource/agent affordances can inform Skill Graph or Skill Advisor routing evidence?
  - RQ5: What should be adopted, adapted, rejected, or deferred, and what follow-up implementation packets should be created?
Last 3 Iterations Summary: (none yet — this is iteration 1)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/iterations/iteration-001.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/research/007-external-project-pt-02/deltas/iter-001.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
