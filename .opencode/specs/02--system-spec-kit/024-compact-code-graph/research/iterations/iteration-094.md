# Iteration 94: Cross-runtime UX parity matrix

## Focus
Produce the definitive comparison matrix for OpenCode, Codex CLI, Copilot CLI, and Gemini CLI against the current Claude Code baseline, using the per-runtime deep dives from iterations 084-087 plus the Q15 verification pass in iteration 078.

## Findings

### 1. Claude Code remains the 100% baseline because it already has wired lifecycle hooks plus fallback instructions
Iteration 078 re-confirmed the core asymmetry behind the parity problem: Claude in this repo already has real lifecycle hooks (`PreCompact`, `SessionStart`, `Stop`) plus documented fallback recovery, while the other runtimes still depend primarily on instruction files, resume commands, or optional hook/config work that has not been wired into the repo yet.

[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:8-33]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:79-96]

### 2. Definitive current-state parity matrix
The table below scores **current repo-state UX parity**, not theoretical product ceilings. Claude Code is the 100% reference point.

| Runtime | Instruction file mechanism (auto-loaded surface) | Agent definition format | MCP server availability | Hook support | Session detection mechanism | Auto-trigger pattern to add | Estimated parity vs Claude |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **OpenCode** | Root `CLAUDE.md` + `.opencode/agent/*.md` + command workflows such as `spec_kit_resume_auto.yaml`; no native session-start hook | Markdown agent files with YAML frontmatter | **Yes** - `opencode.json` exposes the 4 core MCP servers | **No** - no Claude-like lifecycle hook surface | Resume command (`/spec_kit:resume`) and first-turn fallback instructions using `memory_context(... mode: "resume" ...)` | Add one shared `Session Start Protocol`: `memory_match_triggers(prompt)` -> `memory_context(auto/resume)` -> `code_graph_status()` -> conditional `code_graph_scan({ incremental: true })` -> structural graph tools only on structural cues | **~68%** |
| **Codex CLI** | `CODEX.md` is the main startup surface; `.codex/agents/*.toml` reinforces behavior inside per-agent `developer_instructions` | TOML agent files with metadata + prompt text | **Yes** - same MCP family is exposed through Codex config/tooling | **No** - still instruction-driven, not hook-driven, in current repo design | "After Context Compaction" recovery in `CODEX.md` plus per-agent fallback to `memory_context(... profile: "resume" ...)` | Add a mandatory `CODEX.md` `Session Start Protocol` and an `@context` `SESSION PRIME` step with `memory_context()` + `code_graph_status()` before substantive work | **~72%** |
| **Copilot CLI** | Auto-loads `AGENTS.md`, `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md`, and optional root `CLAUDE.md` / `GEMINI.md` | Primary startup surface is markdown instructions; optional custom agents live in `.github/agents/*.agent.md`; in this repo the default Copilot profile maps to `.opencode/agent/*.md` via `AGENTS.md` | **Yes (functional)** - Copilot can use the same shared tool surface in this repo; parity does not depend on a separate Copilot-only MCP manifest | **Partial** - `.github/hooks/*.json` exists and supports session/tool events, but current repo wiring is generic (`superset-notify.json`), not Spec Kit-specific session priming | First-turn prompt cues in `AGENTS.md`; resume prompts use `memory_context(... profile: "resume" ...)`; `sessionStart` can be used if hooks are wired for Spec Kit | Keep universal startup logic in `AGENTS.md`; add a short `.github/copilot-instructions.md` that says: first code-facing turn -> `code_graph_status()`, stale/missing -> conditional scan, structural cue -> graph tools before plain text search | **~78%** |
| **Gemini CLI** | Root `GEMINI.md` auto-loads hierarchically and JIT by directory; Gemini can also be configured to load `AGENTS.md` through `context.fileName` | **None configured in repo today**; practical control surface is markdown instructions, with `.gemini/agents/` reserved by repo convention if later populated | **Potentially yes** - same servers can be mirrored into `.gemini/settings.json`, but the repo has no bridge/config yet | **Partial (runtime yes, repo no)** - upstream Gemini supports `SessionStart`, `PreCompress`, etc., but this repo has no `.gemini/settings.json`, hooks wiring, or Gemini agents | Current repo behavior is prompt-driven via `GEMINI.md`; future Gemini hooks could make session detection explicit and deterministic | Add a `Session Start / Resume / Structural Query Protocol` to `GEMINI.md`; create `.gemini/settings.json` to mirror MCP servers; then wire `SessionStart` + `PreCompress` for near-Claude behavior | **~62% current repo state** (`~75%` instruction-only target, `~88%` with hooks + settings) |

This matrix resolves the ambiguity left by earlier shorthand:

- **OpenCode** and **Codex CLI** are the two genuinely instruction-driven runtimes in the current repo.
- **Copilot CLI** is ahead of them because its instruction files are reliably auto-loaded and it already has a native hook surface, even though the current repo has not yet used that hook surface for Spec Kit startup priming.
- **Gemini CLI** has the **highest non-Claude ceiling** but the **lowest current repo maturity** because the repo still lacks `.gemini/settings.json`, Gemini agents, and Gemini hook wiring.

[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md:8-139]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-085.md:8-98]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:17-127]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md:16-229]
[SOURCE: AGENTS.md:44-67]
[SOURCE: AGENTS.md:136-156]
[SOURCE: AGENTS.md:272-281]
[SOURCE: .github/hooks/superset-notify.json:1-33]
[SOURCE: https://docs.github.com/en/copilot/how-tos/copilot-cli/add-custom-instructions]

### 3. Top 3 most impactful cross-runtime improvements

#### 3.1 Standardize one runtime-neutral `Session Start Protocol` everywhere
This is the highest-leverage change because every non-Claude runtime already has some form of memory recovery, but all four deep dives found the same missing piece: **code-graph readiness is either absent, scattered, or optional**. A single shared block should be copied into `AGENTS.md`, `CODEX.md`, `GEMINI.md`, root `CLAUDE.md`, and the earliest context-loading sections of OpenCode/Codex agents:

1. `memory_match_triggers(prompt)`
2. `memory_context({ input: prompt, mode: "auto" })`
3. If resuming known work: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
4. `code_graph_status()`
5. If code-facing and stale/missing: `code_graph_scan({ incremental: true })`
6. Only then use `code_graph_context()` / `code_graph_query()` for structural prompts

This gives the biggest UX lift for the smallest implementation cost because it reuses existing instruction surfaces instead of depending on new runtime features.

[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md:63-139]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-085.md:28-93]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:71-121]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md:130-168]

#### 3.2 Implement universal MCP-side "first-call priming" (T1.5)
Iteration 078 narrowed the most important systems-level gap: the MCP server already has the **session primitive** needed for universal startup detection, but it still does **not** implement first-call priming. This is the best cross-runtime improvement because it reduces dependence on prompt obedience and makes startup behavior deterministic even in runtimes without strong hooks.

In practical terms: on the first trusted call of a new session, the MCP layer should be able to inject or surface the same baseline packet that current instruction files are trying to force manually. That would give OpenCode, Codex, Copilot, and Gemini a shared "automatic enough" recovery path instead of four separate prompt-engineering strategies.

[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:25-34]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:79-96]

#### 3.3 Ship the missing runtime glue instead of leaving the protocol purely aspirational
The matrix shows that the repo is not blocked by product capability as much as by **missing runtime glue**:

- **OpenCode** needs `code_graph_status()` / freshness handling inserted into `spec_kit_resume_auto.yaml` and early agent context blocks.
- **Copilot CLI** needs a short `.github/copilot-instructions.md` (and optionally path-specific `.github/instructions`) so the shared startup contract is not carried only by `AGENTS.md`.
- **Gemini CLI** needs the biggest repo-local bootstrap: `.gemini/settings.json` to mirror MCP servers, then optional `SessionStart` / `PreCompress` hooks to realize its higher ceiling.

Without these small runtime-specific bridges, the shared startup protocol remains documentation rather than behavior.

[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md:45-49]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md:101-139]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:100-121]
[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md:98-168]

## Ruled Out
- Treating the earlier "~90% parity" idea as a present-state fact for any non-Claude runtime. Iteration 078 re-verified that this remains a design projection, not shipped behavior.
- Treating Copilot and Gemini as identical to fully hookless runtimes. Copilot already has a native hook surface, and Gemini has both hierarchical instruction loading and upstream hooks, even if this repo has not wired them yet.
- Treating optional agent profiles alone as the universal startup layer. The high-leverage surfaces are the auto-loaded instruction files and MCP/runtime glue, not specialist agents by themselves.

## Dead Ends
- None. The matrix converged once the synthesis explicitly separated **current repo wiring** from **upstream runtime capability ceiling**.

## Sources Consulted
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-085.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md`
- `AGENTS.md`
- `.github/hooks/superset-notify.json`
- https://docs.github.com/en/copilot/how-tos/copilot-cli/add-custom-instructions

## Assessment
- New information ratio: **0.36**
- Questions addressed: **4/4**
- Questions answered:
  1. What is the definitive current-state UX parity matrix across OpenCode, Codex CLI, Copilot CLI, and Gemini CLI?
  2. What loads automatically for each runtime, and what is the real startup control surface?
  3. Which runtime gaps are architectural versus merely unconfigured locally?
  4. What are the top 3 highest-impact cross-runtime improvements?

## Reflection
- **What worked and why:** Cross-reading the four runtime deep dives with the Q15 verification pass made the current-state vs ceiling distinction explicit. That was especially valuable for Copilot and Gemini, where "supports hooks" and "repo actually uses hooks for Spec Kit parity" are not the same claim.
- **What did not work and why:** Earlier shorthand such as "non-Claude runtimes are hookless" or "~90% parity is achievable" was too compressed for a definitive matrix. The synthesis had to separate current wiring, instruction-only target state, and upstream product capability to avoid overclaiming.
- **What I would do differently:** If this matrix had been needed earlier, I would have forced each runtime deep dive to output both a **current repo parity** and a **configured ceiling** from the start. That would have removed the Gemini ambiguity sooner.

## Recommended Next Focus
Iteration 095 should turn this matrix into a concrete Phase D rollout order:

1. shared `Session Start Protocol` first,
2. MCP first-call priming second,
3. runtime-specific glue (`resume_auto`, Copilot instructions/hooks, Gemini settings/hooks) third.
