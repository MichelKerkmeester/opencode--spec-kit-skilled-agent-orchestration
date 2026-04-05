# Iteration 84: OpenCode Session-Start Auto-Trigger Design for Memory + Code Graph

## Focus
Read all `.opencode/agent/*.md` files, inspect `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`, and inspect the root `CLAUDE.md` workflow guidance. Design concrete instruction changes so OpenCode agents auto-trigger memory recovery and code-graph readiness on session start without relying on Claude-only hooks.

## Findings

### 1. OpenCode currently has 10 markdown agent definitions, but only 2 declare explicit MCP server bindings in frontmatter
I read all 10 OpenCode agent files:
- `.opencode/agent/context.md`
- `.opencode/agent/debug.md`
- `.opencode/agent/deep-research.md`
- `.opencode/agent/deep-review.md`
- `.opencode/agent/handover.md`
- `.opencode/agent/orchestrate.md`
- `.opencode/agent/review.md`
- `.opencode/agent/speckit.md`
- `.opencode/agent/ultra-think.md`
- `.opencode/agent/write.md`

Only `context.md` and `ultra-think.md` declare an explicit `mcpServers:` frontmatter block. `context.md` binds `spec_kit_memory` and `cocoindex_code`; `ultra-think.md` binds `spec_kit_memory` and `sequential_thinking`. The other 8 agents expose permissions in frontmatter, but do not declare explicit MCP server bindings there.

[SOURCE: .opencode/agent/context.md:1-23]
[SOURCE: .opencode/agent/ultra-think.md:1-23]
[SOURCE: .opencode/agent/debug.md:1-20]
[SOURCE: .opencode/agent/deep-research.md:1-20]
[SOURCE: .opencode/agent/deep-review.md:1-19]
[SOURCE: .opencode/agent/handover.md:1-20]
[SOURCE: .opencode/agent/orchestrate.md:1-16]
[SOURCE: .opencode/agent/review.md:1-20]
[SOURCE: .opencode/agent/speckit.md:1-20]
[SOURCE: .opencode/agent/write.md:1-20]

### 2. OpenCode already has a partial hook-aware context pattern, but it is scattered and memory-first only
`context.md` already makes memory-first retrieval a hard habit: its core workflow starts with `memory_match_triggers -> memory_context -> memory_search`, and its tool sequence continues from memory into CocoIndex, Glob, Grep, and Read. Several other agents already mention Claude `SessionStart` hook context explicitly: `deep-research`, `deep-review`, `handover`, and `speckit` each say "if hook-injected context is present, use it; otherwise fall back to `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`". `orchestrate.md` has the same recovery ordering in its "Context Recovery Priority" section. The gap is that none of these first-turn recovery paths call `code_graph_status()` or `code_graph_scan()`, so code graph freshness is not part of session startup today.

[SOURCE: .opencode/agent/context.md:45-49]
[SOURCE: .opencode/agent/context.md:117-119]
[SOURCE: .opencode/agent/deep-research.md:437-441]
[SOURCE: .opencode/agent/deep-review.md:542-546]
[SOURCE: .opencode/agent/handover.md:322-326]
[SOURCE: .opencode/agent/speckit.md:583-587]
[SOURCE: .opencode/agent/orchestrate.md:805-822]

### 3. The exact injection point in `spec_kit_resume_auto.yaml` is `workflow.step_2_load_memory`
The best place to insert code-graph auto-triggering is `workflow.step_2_load_memory`, immediately after the existing `memory_context(mode: "resume")` recovery step and before the flow extracts the "Resume Essentials" packet. That keeps the current order intact: recover session continuity first, then check structural-index readiness before recommending a "next safe action". A secondary, presentation-only insertion point exists in `step_4_present_resume`, where the workflow can surface `graph_status: ready | reindexing | unavailable` alongside the resume brief.

[SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:69-81]
[SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:127-155]

### 4. `CLAUDE.md` currently teaches memory startup but omits code graph from both startup and code-search guidance
The root `CLAUDE.md` Quick Reference table has:
- `Research/exploration` -> `memory_match_triggers()` then `memory_context()` or `memory_search()`
- `Code search` -> `CocoIndex search` -> `Grep()` -> `Glob()` -> `Read()`
- `Resume prior work` -> `/spec_kit:resume` or `memory_context(... mode: "resume" ...)`

Gate 1 also starts every new message with `memory_match_triggers(prompt)`. There is no Session Start Protocol section and no structural code-graph step in the current quick-reference workflow. In other words, the universal template currently covers continuity context and semantic search, but not structural-index readiness.

[SOURCE: CLAUDE.md:44-51]
[SOURCE: CLAUDE.md:99-101]
[INFERENCE: repo search across `CLAUDE.md` returned no `code_graph` or "Session Start Protocol" matches]

### 5. The concrete OpenCode fix is to standardize one reusable `Session Start Protocol` block and move it into each agent's earliest context-loading step
The current design is fragmented: `context.md` puts memory loading at the top, `ultra-think.md` embeds it in PREPARE, and several other agents tuck hook-aware recovery into a late `HOOK-INJECTED CONTEXT & QUERY ROUTING` addendum. The cleanest OpenCode change is to define one shared instruction block and place it at the first executable context step in every relevant agent.

Proposed reusable instruction block:

```markdown
## Session Start Protocol (All Runtimes)

If hook-injected context is present, use it as the baseline context and skip duplicate recovery.

Otherwise, on the first turn of the session:
1. `memory_match_triggers(prompt)`
2. `memory_context({ input: prompt, mode: "auto" })`
3. If resuming known prior work, prefer `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume", specFolder })`
4. `code_graph_status()`
5. If the task is code-facing and the graph is missing or stale, run `code_graph_scan({ incremental: true })` once per session
6. If the prompt names files/symbols or asks structural questions, call `code_graph_context(...)` or `code_graph_query(...)` before Grep/Glob
```

Suggested insertion map:
- `context.md`: add this immediately before or inside the existing Tool Sequence section, because this agent is the canonical retrieval entry point.
- `ultra-think.md`: fold it into PREPARE step 2, which already loads memory context.
- `orchestrate.md`: extend the existing "Context Recovery Priority" section so orchestrator startup matches the LEAF agents.
- `deep-research.md`, `deep-review.md`, `handover.md`, `speckit.md`: replace the current `HOOK-INJECTED CONTEXT & QUERY ROUTING` addendum with the reusable block.
- `debug.md`, `review.md`, `write.md`: add a compact version right after their existing "Context Package" fast-path sections, with an explicit bypass when a Context Package is already supplied.

[SOURCE: .opencode/agent/context.md:45-49]
[SOURCE: .opencode/agent/context.md:117-119]
[SOURCE: .opencode/agent/ultra-think.md:50-58]
[SOURCE: .opencode/agent/orchestrate.md:805-822]
[SOURCE: .opencode/agent/deep-research.md:437-441]
[SOURCE: .opencode/agent/deep-review.md:542-546]
[SOURCE: .opencode/agent/handover.md:322-326]
[SOURCE: .opencode/agent/speckit.md:583-587]
[SOURCE: .opencode/agent/debug.md:95-100]
[SOURCE: .opencode/agent/review.md:60-64]
[SOURCE: .opencode/agent/write.md:83-87]

### 6. The concrete resume-workflow change is: graph freshness belongs in recovery, but graph expansion should stay query-driven
A good session-start policy should auto-check graph readiness, not auto-expand graph neighborhoods for every prompt. That matches the current resume philosophy: "recover the smallest useful context packet, then continue" and "stop as soon as one safe next action can be named". So the right split is:
- always run `memory_context(...)` during recovery
- always run cheap `code_graph_status()` after recovery on code-facing sessions
- run `code_graph_scan({ incremental: true })` only when the index is stale/missing
- defer `code_graph_context(...)` / `code_graph_query(...)` until the request actually becomes structural

This preserves low-friction resume behavior while making graph freshness automatic.

[SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:19-21]
[SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:75-81]
[SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:83-92]
[SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:127-142]

### 7. The concrete `CLAUDE.md` change is: add a `Session start` workflow row and a runtime-neutral `Session Start Protocol` section
The Quick Reference table should gain a new row:

```markdown
| **Session start** | Hook context if present -> else `memory_match_triggers(prompt)` -> `memory_context(...)` -> `code_graph_status()` -> if stale and code-facing: `code_graph_scan({ incremental: true })` |
```

The `Code search` row should be rewritten to distinguish structural from semantic search:

```markdown
| **Code search** | `code_graph_context()/code_graph_query()` for structural questions -> `CocoIndex search` for semantic/intent queries -> `Grep()` for exact text -> `Glob()` for file paths -> `Read()` for contents |
```

Then add a new `### Session Start Protocol` section immediately after the Quick Reference table. That section should be explicitly runtime-neutral:
- hook-capable runtimes (Claude) may satisfy startup through injected context
- non-hook runtimes (OpenCode, Codex, Copilot, Gemini) must self-trigger the same tool chain on first turn
- `code_graph_context()` should not fire for non-code or non-structural tasks

This keeps the universal instruction file authoritative instead of scattering startup rules into runtime-specific docs.

[SOURCE: CLAUDE.md:44-51]
[SOURCE: CLAUDE.md:99-101]
[SOURCE: .opencode/agent/deep-research.md:439-441]
[SOURCE: .opencode/agent/orchestrate.md:807-822]

## Ruled Out
- Running `code_graph_context()` unconditionally on every session start. That would violate the resume workflow's "minimal friction" and "stop when one safe next action is known" design. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:19-21] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:75-76] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:83-86]
- Keeping the graph logic only inside late `HOOK-INJECTED CONTEXT & QUERY ROUTING` appendices. Those sections are useful as fallback notes, but they are not structured as mandatory first-turn behavior. [SOURCE: .opencode/agent/deep-research.md:437-441] [SOURCE: .opencode/agent/deep-review.md:542-546] [SOURCE: .opencode/agent/handover.md:322-326] [SOURCE: .opencode/agent/speckit.md:583-587]
- Requiring Claude-style lifecycle hooks for OpenCode. The existing OpenCode files already assume a non-hook fallback path (`memory_context` then `memory_match_triggers`), so the right upgrade is stronger self-trigger instructions, not a hook dependency. [SOURCE: .opencode/agent/orchestrate.md:807-812] [SOURCE: .opencode/agent/deep-research.md:439-441]

## Dead Ends
- None. The relevant gaps and insertion points were visible directly from current agent instructions and workflow YAML.

## Sources Consulted
- `CLAUDE.md`
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- `.opencode/agent/context.md`
- `.opencode/agent/debug.md`
- `.opencode/agent/deep-research.md`
- `.opencode/agent/deep-review.md`
- `.opencode/agent/handover.md`
- `.opencode/agent/orchestrate.md`
- `.opencode/agent/review.md`
- `.opencode/agent/speckit.md`
- `.opencode/agent/ultra-think.md`
- `.opencode/agent/write.md`

## Assessment
- New information ratio: 0.71
- Questions addressed:
  - What are all OpenCode agent files and which declare MCP bindings?
  - Where is the best resume-workflow injection point for code graph?
  - What does `CLAUDE.md` currently say about code search and resume?
  - What exact OpenCode agent instruction changes should auto-trigger `memory_context` and `code_graph_scan`?
  - What should a universal `Session Start Protocol` section look like?
- Questions answered:
  - OpenCode has 10 markdown agents; only `context` and `ultra-think` declare explicit `mcpServers` frontmatter today.
  - `workflow.step_2_load_memory` is the primary code-graph insertion point; `step_4_present_resume` is the secondary display point.
  - `CLAUDE.md` currently covers memory startup and semantic search, but not structural code-graph startup.
  - The cleanest OpenCode change is a single reusable Session Start Protocol block inserted at each agent's earliest context-loading step.
  - The cleanest universal-doc change is a new Quick Reference row plus a new `Session Start Protocol` section in `CLAUDE.md`.

## Reflection
- What worked and why: Reading all 10 agent files exposed a strong pattern that was not obvious from spot checks alone: OpenCode already has shared language for hook-injected context and fallback memory recovery, but it is scattered across multiple agents and positioned too late to act as a real startup contract.
- What did not work and why: Looking only at the Quick Reference table would have understated the current capability. The real gap is not "no startup logic exists" - it is "startup logic exists for memory, but not as a uniform first-turn protocol with graph readiness."
- What I would do differently: For the next cross-runtime pass, compare this proposed Session Start Protocol directly against `AGENTS.md`, `GEMINI.md`, and `CODEX.md` wording to verify that one universal section can be copied with minimal runtime-specific branching.

## Recommended Next Focus
Use this iteration's proposed `Session Start Protocol` as an input to the final cross-runtime parity matrix and implementation roadmap. The next useful synthesis step is to map which parts belong in `CLAUDE.md` (universal), which belong in `.opencode/agent/*.md` (OpenCode runtime behavior), and which belong in `spec_kit_resume_auto.yaml` (resume-command orchestration).
