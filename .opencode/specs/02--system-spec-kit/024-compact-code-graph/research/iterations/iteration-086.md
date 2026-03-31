# Iteration 86: Copilot CLI Deep Dive for Auto-Trigger Patterns

## Focus
Investigate GitHub Copilot CLI's real instruction-loading surface and use it to design a reliable non-hook startup pattern for `memory_context` and `code_graph_scan`.

Specifically:

1. Check whether `.github/copilot/` exists in this repository
2. Read `AGENTS.md` for Copilot-relevant behavior
3. Reuse any applicable recovery guidance from `.claude/CLAUDE.md`
4. Verify which instruction files Copilot CLI auto-loads
5. Design session-start auto-trigger patterns for `memory_context` and `code_graph_scan`
6. Compare Copilot's markdown-based agent/instruction model with Codex's TOML agent model

## Findings

### 1. This repository has **no** `.github/copilot/` directory and no Copilot-specific repo config files yet
The repository's `.github` directory currently contains only `hooks/` and `workflows/`. A direct scan found no `.github/copilot/` subtree, no `.github/copilot-instructions.md`, and no `.github/instructions/**/*.instructions.md` files in the current repo state.

This matters because the current Copilot CLI documentation does **not** use `.github/copilot/` as the primary startup-instruction surface anyway. The documented auto-loaded surfaces are instruction files such as `AGENTS.md`, `.github/copilot-instructions.md`, and `.github/instructions/**/*.instructions.md`, plus optional local instruction files.

[SOURCE: repository scan — `.github` lists only `hooks/` and `workflows/`; `.github/copilot/**/*`, `.github/copilot-instructions.md`, and `.github/instructions/**/*.instructions.md` returned no matches]
[SOURCE: https://docs.github.com/en/copilot/how-tos/copilot-cli/add-custom-instructions]
[SOURCE: https://docs.github.com/en/copilot/reference/custom-instructions-support]

### 2. `AGENTS.md` already gives Copilot the memory-side startup behavior, but not the code-graph startup behavior
The repo's root `AGENTS.md` already includes:

- a research/exploration workflow that starts with `memory_match_triggers()` and then `memory_context()` / `memory_search()`
- Gate 1 instructions that explicitly require `memory_match_triggers(prompt)` at turn start
- runtime routing that says the Copilot/OpenCode profile uses `.opencode/agent/`

So the memory-side priming pattern already exists in the universal instruction layer. What is still missing is an equally explicit instruction telling Copilot when to check code-graph freshness and when to enrich with structural context.

[SOURCE: AGENTS.md:49-49]
[SOURCE: AGENTS.md:136-138]
[SOURCE: AGENTS.md:272-278]

### 3. The recovery steps in `.claude/CLAUDE.md` transfer cleanly to Copilot as a **non-hook fallback pattern**
`.claude/CLAUDE.md` documents three useful recovery rules:

- after compaction: call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
- after `/clear`: do the same
- on session start: rely on `memory_match_triggers()` plus hook-based priming when available

The Copilot-relevant part is not the Claude hook system itself, but the fallback logic. For Copilot, which this research pass found using instruction-file loading rather than repo hook injection, the transferable pattern is:

- keep `memory_match_triggers(prompt)` as the universal first-turn behavior
- if the first turn implies resume / continue / compaction / clear / prior work, immediately call `memory_context(... profile: "resume")`
- treat any code-graph enrichment as instruction-driven or first-call-primed, not hook-injected

[SOURCE: .claude/CLAUDE.md:5-24]
[SOURCE: https://docs.github.com/en/copilot/how-tos/copilot-cli/add-custom-instructions]

### 4. Copilot CLI **does** auto-load instruction files automatically, and this is the correct integration surface
Current Copilot CLI documentation says repository and local instructions are automatically included in prompts. The relevant surfaces are:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`
- `$HOME/.copilot/copilot-instructions.md`
- additional directories via `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`

The custom-instructions docs also note that `CLAUDE.md` and `GEMINI.md` can be used at the repo root, and the CLI's help output likewise lists those as respected instruction files.

This means Copilot CLI does not need a custom bootstrap command or a `.github/copilot/` profile directory to get startup behavior. The simplest reliable integration path is to encode the startup rules in `AGENTS.md` and optionally refine them with repo-wide or path-specific Copilot instruction files.

[SOURCE: https://docs.github.com/en/copilot/how-tos/copilot-cli/add-custom-instructions]
[SOURCE: https://docs.github.com/en/copilot/reference/custom-instructions-support]

### 5. Recommended Copilot auto-trigger pattern: split **resume priming**, **graph freshness**, and **structural enrichment**
The safest Copilot startup pattern is **not** "always run everything." It should be a three-stage instruction pattern:

#### Stage A — universal first-turn context
On the first user turn of a fresh or resumed session:

1. Call `memory_match_triggers(prompt)`
2. If the prompt implies prior work (`resume`, `continue`, `previous work`, `after clear`, `after compaction`, `pick up where we left off`), call:
   `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`

This reuses the existing universal memory guidance already present in `AGENTS.md` and `.claude/CLAUDE.md`.

#### Stage B — graph freshness check, but only when code work is likely
If the prompt is about code understanding, implementation, debugging, refactoring, symbols, callers, imports, architecture, or mentions repo file paths:

1. Call `code_graph_status()`
2. If the graph is missing or stale, call `code_graph_scan({ incremental: true })`

This should be framed as **once per session / first relevant code task**, not every prompt, to avoid unnecessary overhead on purely conversational or documentation-only turns.

#### Stage C — structural enrichment only on structural cues
Only after code intent is clear, trigger structural expansion:

- file/path mentioned -> `code_graph_context({ seeds: [{ provider: "manual", filePath: "<path>" }], queryMode: "neighborhood" })`
- "what calls/imports/depends on..." -> `code_graph_query(...)`
- semantic discovery ("where is X implemented?") -> stay CocoIndex-first, then use code graph secondarily

This aligns with the repo's existing `AGENTS.md` rule that semantic code discovery should be CocoIndex-first while structural navigation should use code graph tools.

**Practical instruction-file placement for Copilot CLI**

- Put the universal startup rule in `AGENTS.md`
- Optionally add a short `.github/copilot-instructions.md` that reinforces "for code tasks, check code graph freshness before large structural exploration"
- Use `.github/instructions/**/*.instructions.md` only for scoped structural-enrichment rules (for example, only code paths), to avoid path-agnostic over-triggering

[SOURCE: AGENTS.md:69-91]
[SOURCE: AGENTS.md:136-138]
[SOURCE: https://docs.github.com/en/copilot/how-tos/copilot-cli/add-custom-instructions]

### 6. Copilot markdown profiles and Codex TOML agents imply different integration strategies
In this repo's runtime abstraction, the Copilot/OpenCode profile uses markdown agent definitions under `.opencode/agent/` with YAML frontmatter such as `name`, `description`, `mode`, `permission`, and `mcpServers`. Codex uses `.codex/agents/*.toml` with explicit fields such as `name`, `sandbox_mode`, `model`, `model_reasoning_effort`, plus a large `developer_instructions` string.

Separately, official Copilot custom-agent docs describe repository-level Copilot custom agents as markdown files with YAML frontmatter in `.github/agents/*.agent.md`.

The key integration implication is:

- **Codex**: the TOML agent files are already the canonical runtime prompt surface in this repo, so startup behavior can be reinforced both in `CODEX.md` and inside each TOML profile's `developer_instructions`
- **Copilot**: markdown agent profiles are useful for specialist delegation, but they are **not** the right place for universal session-start behavior by themselves, because they only apply when that profile is active or selected
- therefore, Copilot's universal startup triggers should live in auto-loaded instruction files (`AGENTS.md`, optionally `.github/copilot-instructions.md` / `.github/instructions/**/*.instructions.md`), not only in custom agent profiles

In short: **Codex can rely more heavily on per-agent TOML prompts; Copilot should rely more heavily on automatically loaded repository instruction files, with markdown agent profiles as a secondary specialization surface.**

[SOURCE: .opencode/agent/context.md:1-23]
[SOURCE: .opencode/agent/deep-research.md:1-20]
[SOURCE: .codex/agents/context.toml:1-24]
[SOURCE: .codex/agents/deep-research.toml:1-24]
[SOURCE: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents]

## Ruled Out
- Using `.github/copilot/` as the primary Copilot CLI auto-trigger surface
- Relying on Copilot custom agent profiles alone for universal startup priming
- Running `code_graph_scan()` on every Copilot prompt regardless of task type
- Treating Copilot and Claude as equivalent hook environments

## Dead Ends
- Earlier runtime assumptions that leaned on repo-local `.agents/agents/*.md` are not sufficient to prove live Copilot CLI auto-loading behavior; the official Copilot docs were needed to separate "optional custom agents" from "automatically included instruction files."

## Sources Consulted
- `AGENTS.md`
- `.claude/CLAUDE.md`
- `.opencode/agent/context.md`
- `.opencode/agent/deep-research.md`
- `.codex/agents/context.toml`
- `.codex/agents/deep-research.toml`
- repository scan of `.github/`
- https://docs.github.com/en/copilot/how-tos/copilot-cli/add-custom-instructions
- https://docs.github.com/en/copilot/reference/custom-instructions-support
- https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli
- https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents

## Assessment
- New information ratio: 0.71
- Questions addressed: all 6 task bullets
- Questions answered:
  1. `.github/copilot/` does not exist in this repo and is not the documented primary Copilot CLI instruction surface
  2. `AGENTS.md` already provides turn-start memory priming but not explicit code-graph priming
  3. `.claude/CLAUDE.md` recovery guidance is reusable as Copilot fallback logic
  4. Copilot CLI auto-loads repository-wide, path-specific, and agent instruction files automatically
  5. The best Copilot auto-trigger design is staged: memory first, graph freshness second, structural enrichment only on structural cues
  6. Copilot's markdown-based profile system pushes universal startup behavior toward instruction files; Codex's TOML agents can carry more of that behavior inside per-agent prompts

## Reflection
- What worked and why: Combining the repo's existing universal instruction framework with the official Copilot CLI docs made the real control surface obvious. The crucial distinction was between instruction files that are always auto-included and custom agents that are optional/specialist.
- What did not work and why: The older mental model of "Copilot profile files" was too close to the repo-local `.agents/agents` layout and not close enough to the current GitHub Copilot CLI documentation. That would have pushed startup logic into the wrong layer.
- What I would do differently: In future cross-runtime passes, separate three questions earlier: "what files auto-load," "what agent profiles exist," and "what is merely repo-local adapter structure." That avoids conflating optional agent selection with guaranteed startup behavior.

## Recommended Next Focus
Verify whether the current implementation plan for cross-runtime parity should add:

1. a universal `AGENTS.md` session-start structural-context section,
2. an optional `.github/copilot-instructions.md` companion file for Copilot CLI,
3. or an MCP-side "first relevant code task" priming mechanism so Copilot can get graph freshness checks without overloading instruction text.
