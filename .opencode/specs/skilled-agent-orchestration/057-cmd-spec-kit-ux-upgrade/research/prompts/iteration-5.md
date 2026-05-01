# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

Segment: 1 | Iteration: 5 of 10
Questions: 0/8 answered | Last focus: Axis 5 tool-discovery UX: SPAR .spar-kit/.local/tools.yaml seeded once vs internal skill-advisor hook, native MCP tools, and Code Mode progressive discovery.
Last 2 ratios: 0.64 -> 0.58 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Axis 6 (personas + UX tone): SPAR's 5 personas (Vera/Pete/Tess/Maya/Max), Key vs Optional follow-up split in spar-plan, teammate tone in spar-specify. Compare to our skill prompt patterns.

Research Topic: Compare external SPAR-Kit project against internal system-spec-kit (6 axes: installer, instruction files, command/skill granularity, template architecture, tool-discovery UX, personas/tone)
Iteration: 5 of 10
Focus Area: Axis 6 (personas + UX tone): SPAR's 5 personas (Vera/Pete/Tess/Maya/Max), Key vs Optional follow-up split in spar-plan, teammate tone in spar-specify. Compare to our skill prompt patterns.
Remaining Key Questions:   (no open questions tracked yet — derive from research charter)
Last 3 Iterations Summary: Iter 2: # Focus Deep dive Axis 2: instruction-file management. This pass compared SPAR's managed-block installer policy for `AGENTS.md` / `CLAUDE.md` against the internal hand-edited instruction files in Public and Barter, with special attention to the proposed 60-line cap and policy voc
  Iter 3: # Focus Axis 4 template architecture: compare SPAR-Kit's two authored templates plus declarative install asset policies against system-spec-kit's CORE + ADDENDUM v2.2 template tree, composed level outputs, and validation contracts. # Actions Taken 1. Read SPAR's authored template
  Iter 4: # Focus Axis 5 tool-discovery UX: compare SPAR's `.spar-kit/.local/tools.yaml` seed-once discovery surface with our skill-advisor hook, native Spec Kit Memory MCP tools, and Code Mode progressive MCP discovery. The focus was sessions where the user or agent does not already know 

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deltas/iter-005.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/iterations/iteration-005.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deltas/iter-005.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
