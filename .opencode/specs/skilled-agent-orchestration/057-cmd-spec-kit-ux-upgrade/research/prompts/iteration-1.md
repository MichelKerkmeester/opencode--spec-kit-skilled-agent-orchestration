# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

Segment: 1 | Iteration: 1 of 10
Questions: 0/8 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: SCOUT pass — read external/ structure (README.md, ROADMAP.md, technicalBrief.md, AGENTS.md, package.json) and the 5 SPAR skill SKILL.md files (install-root/skills/spar-{init,specify,plan,act,retain}/SKILL.md). Then read 1-2 install-root/targets/*.json to understand multi-target distribution. Produce a structural inventory + 2-3 first-pass findings on Axis 1 (installer/distribution) and Axis 3 (command/skill granularity, comparing 4 SPAR phases against our 6 spec_kit + 4 memory + 6 create commands). Defer deep template-architecture (Axis 4), instruction-file managed-blocks (Axis 2), tool-discovery (Axis 5), and personas (Axis 6) to iters 2-5. Cite concrete external/ AND internal/ paths in every finding.

Research Topic: Compare external SPAR-Kit project at .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/ (Specify -> Plan -> Act -> Retain workflow kit by jed-tech, npm @spar-kit/install Beta1) against internal system-spec-kit (.opencode/skill/system-spec-kit/SKILL.md, .opencode/skill/system-spec-kit/templates/, .opencode/command/spec_kit/, .opencode/command/memory/, .opencode/command/create/, .opencode/agent/). Produce 10-20 ranked, evidence-backed UX and orchestration patterns we should adopt-as-is, adapt, take inspiration from, or reject-with-rationale. For each finding: cite at least one path in external/ AND one path in internal surface; note adoption risk; name the follow-on packet (058-* through 06X-*) that would land it. Cover all 6 axes: (1) installer/multi-target distribution, (2) instruction-file management (managed blocks, brevity caps), (3) command/skill granularity (4 SPAR phases vs 6 spec_kit commands + flag suffixes), (4) template architecture (declarative asset policies vs core/addendum), (5) tool-discovery UX (.spar-kit/.local/tools.yaml vs skill-advisor + MCP), (6) personas/UX tone in skill prompts (5 SPAR personas, Key vs Optional follow-up split, teammate tone). Flag any axis where evidence is thin.
Iteration: 1 of 10
Focus Area: SCOUT pass — read external/ structure (README.md, ROADMAP.md, technicalBrief.md, AGENTS.md, package.json) and the 5 SPAR skill SKILL.md files (install-root/skills/spar-{init,specify,plan,act,retain}/SKILL.md). Then read 1-2 install-root/targets/*.json to understand multi-target distribution. Produce a structural inventory + 2-3 first-pass findings on Axis 1 (installer/distribution) and Axis 3 (command/skill granularity, comparing 4 SPAR phases against our 6 spec_kit + 4 memory + 6 create commands). Defer deep template-architecture (Axis 4), instruction-file managed-blocks (Axis 2), tool-discovery (Axis 5), and personas (Axis 6) to iters 2-5. Cite concrete external/ AND internal/ paths in every finding.
Remaining Key Questions: 
  1. Q1: What is the smallest viable subset of SPAR-Kit's managed-block policy we could adopt without breaking the AGENTS.md sync triad (Public + Barter + fs-enterprises)?
  2. Q2: Does collapsing `:auto`/`:confirm`/`:with-phases`/`:with-research` into a 2-axis matrix (mode × scope) break any existing skill-advisor or hook contracts?
  3. Q3: Could our 99-template tree compress to a SPAR-style declarative manifest with on-demand composition, given that `compose.sh` already materializes per-level outputs?
  4. Q4: Which SPAR personas (Vera/Pete/Tess/Maya/Max) translate cleanly to our skill prompts and which would clash with our terse-output style?
  5. Q5: Does the SPAR `tools.yaml` "seed once, never overwrite" model improve discoverability vs our skill-advisor + MCP routing for sessions where the user doesn't know what's available?
  6. Q6: Is the SPAR npm-installer pattern (`@spar-kit/install --target claude/cursor/codex`) worth the maintenance cost vs our manual skill installation, considering our cross-runtime hook reality (`.claude/`, `.opencode/`, `.codex/`, `.gemini/`)?
  7. Q7: What do SPAR's "Key Follow-Up vs Optional Follow-up" splits in `spar-plan` and the "creative, suggestive, teammate-like" tone in `spar-specify` suggest about our current consolidated-question protocol?
  8. Q8: Where is evidence thin — which axes need extra digging in later iterations?
Last 3 Iterations Summary: none yet

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/iterations/iteration-001.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deltas/iter-001.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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


---

## PACKET-SPECIFIC GUIDANCE (057-cmd-spec-kit-ux-upgrade)

### Comparison Surfaces

**External (read-only)**: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/`
- Root: `README.md`, `ROADMAP.md`, `technicalBrief.md`, `BETA1-RELEASE-CHECKLIST.md`, `AGENTS.md`, `package.json`, `VERSION`
- Installer: `bin/spar-kit.mjs`, `lib/cli.mjs`, `lib/install-engine.mjs`, `install-root/`
- Skills: `install-root/skills/spar-init/SKILL.md`, `install-root/skills/spar-specify/SKILL.md`, `install-root/skills/spar-plan/SKILL.md`, `install-root/skills/spar-act/SKILL.md`, `install-root/skills/spar-retain/SKILL.md`
- Targets: `install-root/targets/*.json` (per-agent install configs)
- Templates: `templates/spec.md`, `templates/plan.md`
- Personas: `Research/Personas/Personas.md`, `specs/` (sample SPAR-generated specs)

**Internal**:
- Skill: `.opencode/skill/system-spec-kit/SKILL.md`
- Templates: `.opencode/skill/system-spec-kit/templates/` (core/, addendum/, level_*/, examples/, cross-cutting)
- Commands: `.opencode/command/spec_kit/{plan,implement,deep-research,deep-review,resume,complete}.md` + `assets/*.yaml`
  - `.opencode/command/memory/{search,learn,manage,save}.md`
  - `.opencode/command/create/{agent,sk-skill,folder_readme,feature-catalog,testing-playbook,changelog}.md` + `assets/*.yaml`
- Agents: `.opencode/agent/*.md` (orchestrate, context, deep-research, deep-review, debug, review, improve-agent, improve-prompt, ultra-think, write)
- Helpers: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `.opencode/skill/system-spec-kit/templates/compose.sh`

### 6 Comparison Axes (cover at least 1 per finding)

1. **Installer / multi-target distribution** — SPAR npm `@spar-kit/install --target ...` vs our manual skill install across `.claude/`, `.opencode/`, `.codex/`, `.gemini/`.
2. **Instruction-file management** — SPAR managed-block boundaries (`<!-- spar-kit:start/end -->`), 60-line cap warning vs our hand-edited AGENTS.md sync triad.
3. **Command/skill granularity** — SPAR's 4 phases (Specify/Plan/Act/Retain) as independent skills vs our 6 spec_kit commands + 4 memory + 6 create + flag suffixes.
4. **Template architecture** — SPAR's 2 templates with declarative asset policies (`replace`, `seed_if_missing`, `managed_block`, `replace_managed_children`) vs our 99-template tree with `compose.sh`.
5. **Tool-discovery UX** — SPAR `.spar-kit/.local/tools.yaml` (seed once, never overwrite) vs our skill-advisor + MCP routing across 47 MCP tools.
6. **Personas / UX tone** — SPAR's 5 personas (Vera/Pete/Tess/Maya/Max) and explicit "creative, suggestive, teammate-like" tone, "Key Follow-Up vs Optional Follow-up" 7-question split vs our terse output norms.

### Output Requirements (cumulative across iterations)

By iter-10 you must have produced **10-20 ranked findings**, each with:
- A title (one line)
- Verdict tag: `adopt-as-is` | `adapt` | `inspired-by` | `reject-with-rationale`
- ≥1 path citation in external/ AND ≥1 path citation in internal surface (concrete file paths, not generic patterns)
- Adoption risk note (1 sentence)
- Follow-on packet name in `058-*` to `06X-*` form, with 1-2 sentence scope sketch

Write structured findings to `deltas/iter-NNN.jsonl` so the reducer can aggregate. Use record types: `finding`, `observation`, `invariant`, `ruled_out`. Each finding gets `{type:"finding", id:"f-iterNNN-XXX", severity:"P1|P2|P3", label:"...", verdict:"adopt-as-is|adapt|inspired-by|reject-with-rationale", axis:1-6, externalPath:"...", internalPath:"...", risk:"...", followOnPacket:"058-...", iteration:N}`.

### Iteration Budget

Target 8 tool calls (max 12). Spend them on: 2-3 `Read` of new external files + 2-3 `Read` of internal files + 1-2 `Grep`/`Glob` for cross-cutting patterns + 1 `Write` for iteration-NNN.md + 1 `Write` for iter-NNN.jsonl + 1 final state-log append.

### Tone

Be evidence-driven. No speculation without a path citation. If a comparison surface is not yet read, say "needs iter-N+1" rather than guess.
