# Iteration 87: Gemini CLI Deep Dive — Instruction-Based Context Loading

## Focus
Investigate Gemini CLI as a runtime target for compact code graph context loading:

1. Check whether this repository already has a `.gemini/` runtime surface.
2. Read the root `GEMINI.md` and determine whether it contains Gemini-specific recovery logic.
3. Verify how Gemini CLI actually loads instruction files.
4. Check whether Gemini can access the same MCP servers as the other runtimes.
5. Design instruction-file auto-trigger patterns that force `memory_context()` and `code_graph_scan()`/`code_graph_context()` behavior.
6. Compare Gemini's context-loading model against Claude, OpenCode, and Codex.
7. Estimate realistic UX parity with Claude Code.

## Findings

### 1. The repository currently has **no `.gemini/` directory**, no Gemini agents, and no Gemini settings file
Repository scanning found **no `.gemini/` directory at all**. That means there is currently:

- no `.gemini/settings.json`
- no `.gemini/agents/`
- no Gemini-specific hook registration

So the repo's present Gemini footprint is limited to the root-level `GEMINI.md` plus the shared `.mcp.json`.

[SOURCE: repository glob `.gemini/**` returned no matches on 2026-03-31]

### 2. The root `GEMINI.md` exists, but it is a **universal framework file**, not a Gemini-specific recovery layer
The root `GEMINI.md` contains the same universal workflow framework used across runtimes. It does contain the expected memory-first workflow instructions:

- research/exploration -> `memory_match_triggers()` + `memory_context()`
- resume prior work -> `memory_context(... mode: "resume", profile: "resume" ...)`

It also includes the runtime-path table entry that says Gemini-specific agents should live under `.gemini/agents/`. But the file does **not** contain Gemini-only startup, compaction, hook, or code-graph bootstrap instructions.

So today `GEMINI.md` gives Gemini a generic framework, not a tuned Gemini recovery model.

[SOURCE: GEMINI.md:49-51]
[SOURCE: GEMINI.md:281]
[SOURCE: GEMINI.md search on 2026-03-31 found `memory_context` instructions but no Gemini-specific `SessionStart`, `PreCompress`, or `code_graph_scan` protocol]

### 3. Upstream Gemini CLI **does** automatically load `GEMINI.md`, and its context-loading model is stronger than a single root file
Official Gemini CLI docs confirm that `GEMINI.md` is auto-loaded through a **hierarchical context system**:

1. `~/.gemini/GEMINI.md`
2. workspace directories and parent directories
3. **just-in-time** scans of the accessed directory and its ancestors

This means Gemini can load:

- a global memory file
- a repo-root file
- more specific subdirectory instruction files when tools touch a path

That is materially more capable than a single static root instruction file.

Gemini also supports custom context filenames through `context.fileName`, including configurations such as:

```json
{
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"]
  }
}
```

So Gemini can be configured to load both `GEMINI.md` and `AGENTS.md`.

[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/reference/configuration.md]

### 4. Upstream Gemini CLI also has a **native hooks system**, so treating Gemini as "hookless" is now too strong
Official Gemini CLI hook docs and core hook types show that Gemini supports native lifecycle and tool hooks, including:

- `SessionStart`
- `SessionEnd`
- `BeforeAgent`
- `AfterAgent`
- `BeforeTool`
- `AfterTool`
- `BeforeModel`
- `AfterModel`
- `BeforeToolSelection`
- `PreCompress`

This is a major correction to the broader "non-Claude runtimes lack hooks" framing. That statement still fits **OpenCode** and **Codex** in this repo, but it does **not** fit upstream Gemini CLI anymore.

The key nuance is:

- **upstream Gemini CLI supports hooks**
- **this repository has not yet configured them**

So the current repo-level Gemini UX is still instruction-only, but the upstream product has a much higher parity ceiling.

[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/hooks/index.md]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/hooks/reference.md]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/packages/core/src/hooks/types.ts]

### 5. The repo's `.mcp.json` exposes the same 4 MCP servers, but Gemini CLI does **not** officially use `.mcp.json` as its config surface
This repository's `.mcp.json` registers the same four core MCP servers used elsewhere:

- `sequential_thinking`
- `spec_kit_memory`
- `cocoindex_code`
- `code_mode`

That matches the same server family present in:

- `.claude/mcp.json`
- `.codex/config.toml`
- `opencode.json`

However, official Gemini docs show that Gemini CLI reads MCP servers from **`~/.gemini/settings.json`** or **`.gemini/settings.json`** under the project root, using the `mcpServers` object.

I also checked the upstream `google-gemini/gemini-cli` repo and code search for `.mcp.json` returned **0 results**, which strongly suggests `.mcp.json` is **not** an official Gemini-native config surface.

So the practical conclusion is:

- Gemini can access the **same MCP servers**
- but only if `.mcp.json` is **mirrored/generated** into `.gemini/settings.json`
- the current repo does **not** provide that bridge yet

[SOURCE: .mcp.json:2-39]
[SOURCE: .claude/mcp.json:2-45]
[SOURCE: .codex/config.toml:5-39]
[SOURCE: opencode.json:10-56]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/tools/mcp-server.md]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/reference/configuration.md]
[SOURCE: GitHub code search `repo:google-gemini/gemini-cli ".mcp.json"` returned 0 results on 2026-03-31]

### 6. Best instruction-only design: use `GEMINI.md` to force a 3-path trigger protocol
Because Gemini auto-loads `GEMINI.md` hierarchically, the clean instruction-based design is to add an explicit **Session Start / Resume / Structural Query Protocol** block to the repo's `GEMINI.md`.

Recommended trigger patterns:

| Trigger type | Detect when user says / implies | Forced behavior |
| --- | --- | --- |
| **Resume / continuation** | `resume`, `continue`, `previous work`, `after clear`, spec-folder continuation | `memory_match_triggers(prompt)` -> `memory_context({ input: prompt, mode: "resume", profile: "resume" })` |
| **General exploration** | broad understanding / research requests | `memory_match_triggers(prompt)` -> `memory_context({ input: prompt, mode: "auto" })` |
| **Structural code questions** | `calls`, `imports`, `dependency`, `impact`, `what uses`, explicit file paths | `code_graph_status()` -> if stale/missing: `code_graph_scan({ incremental: true })` -> `code_graph_context(...)` or `code_graph_query(...)` |
| **Semantic implementation questions** | `how is X implemented`, `find code that`, `similar code` | `cocoindex_code.search(...)` first, then graph expansion only if structure matters |

#### Proposed `GEMINI.md` block

```markdown
## Session Start and Context-Loading Protocol

On the first turn of every new session, after `/clear`, or whenever the user asks
to resume/continue previous work:

1. Call `memory_match_triggers(prompt)`.
2. Call `memory_context({ input: prompt, mode: "auto" })`.
3. If the request references existing work, prior tasks, or a spec folder, use
   `memory_context({ input: prompt, mode: "resume", profile: "resume" })`.
4. If the request mentions files, symbols, calls, imports, dependencies, or impact:
   - call `code_graph_status()`
   - if the graph is missing or stale, call `code_graph_scan({ incremental: true })`
   - then call `code_graph_context(...)` or `code_graph_query(...)`
5. For semantic "how is X implemented?" questions, call `cocoindex_code.search(...)`
   before falling back to plain text search.
```

This is the **best instruction-only** pattern because it fits Gemini's native `GEMINI.md` hierarchy and JIT subdirectory loading model.

But instruction files are still **best-effort**, not deterministic enforcement. They can strongly bias the model, but they cannot guarantee the call sequence the way hooks can.

[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/hooks/reference.md]
[INFERENCE: design based on current repo tool surfaces in `.mcp.json` and existing memory/code-graph workflow conventions in `GEMINI.md`]

### 7. Gemini's context-loading model now sits **between Claude and the instruction-only runtimes**
Comparing Gemini to the three repo runtimes:

| Runtime | Current context mechanism | Determinism | Notes |
| --- | --- | --- | --- |
| **Claude Code** | Repo-wired hooks + `.claude/CLAUDE.md` fallback | **High** | Current strongest runtime in this repo: `PreCompact`, `SessionStart`, `Stop` are already wired |
| **OpenCode** | Root framework + `.opencode/agent/*.md` + command workflows | **Medium** | No native lifecycle hooks; recovery is instruction/command-driven |
| **Codex CLI** | `CODEX.md` + `.codex/agents/*.toml` + config TOML | **Medium** | No repo-native hook equivalent; recovery is manual/instruction-driven |
| **Gemini CLI (current repo state)** | Root `GEMINI.md` only | **Low-Medium** | Auto-loadable by Gemini, but no `.gemini/settings.json`, no agents, no hooks configured |
| **Gemini CLI (upstream capability ceiling)** | Hierarchical `GEMINI.md` + `.gemini/settings.json` + native hooks | **High** | Can approach Claude much more closely than OpenCode/Codex once actually configured |

Important distinction:

- **Current repo Gemini setup** is weaker than Codex/OpenCode because there is no `.gemini/` runtime config yet.
- **Gemini as a product/runtime** is actually closer to Claude than OpenCode/Codex once hooks and settings are used.

[SOURCE: .claude/settings.local.json:5-39]
[SOURCE: .claude/CLAUDE.md:20-32]
[SOURCE: CODEX.md:7-31]
[SOURCE: .codex/config.toml:41-43]
[SOURCE: .codex/config.toml:86-121]
[SOURCE: .opencode/agent/context.md:1-23]
[SOURCE: opencode.json:10-56]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md]
[SOURCE: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/hooks/index.md]

### 8. Realistic UX parity vs Claude Code: **~75% instruction-only**, **~88% with Gemini hooks**
For the exact task asked here - **instruction-based context loading** - the realistic parity number is:

## **~75% parity with Claude Code**

Reasoning:

- **Gemini strengths**
  - native auto-loading of `GEMINI.md`
  - hierarchical + JIT directory context
  - configurable `AGENTS.md` compatibility
  - same MCP server set is portable

- **Instruction-only gaps vs Claude**
  - no deterministic startup injection
  - no guaranteed pre-compression save/prime path
  - no guaranteed first-turn `memory_context()` execution
  - no repo-local `.gemini/settings.json` or `.gemini/agents/` today

If Gemini hooks are allowed as part of the final runtime design, the parity ceiling rises to roughly:

## **~88% parity with Claude Code**

At that point the remaining gap is mostly **repo maturity**, not Gemini product capability:

- the repo already ships working Claude hook scripts
- the repo does **not** yet ship Gemini-specific settings, hook commands, or agents
- `PreCompress` vs `PreCompact` and Gemini's slightly different hook semantics still need translation

So the final assessment is:

- **Instruction-only Gemini design:** ~75%
- **Gemini-native hooks + settings + shared MCP mirroring:** ~88%

[INFERENCE: parity estimate derived from current repo state, official Gemini hook/context docs, and the existing Claude runtime wiring in this repository]

## Ruled Out
- Treating `.mcp.json` as an official Gemini CLI config file.
- Treating Gemini as fully "hookless" at the upstream runtime level.
- Claiming instruction files alone can enforce deterministic startup priming equivalent to Claude's current hook wiring.

## Dead Ends
- None. The only major correction was conceptual: repo-local Gemini evidence alone understates upstream Gemini's actual runtime capability, so upstream docs were required.

## Sources Consulted
- `GEMINI.md`
- `.mcp.json`
- `.claude/mcp.json`
- `.claude/settings.local.json`
- `.claude/CLAUDE.md`
- `CODEX.md`
- `.codex/config.toml`
- `.opencode/agent/context.md`
- `opencode.json`
- https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md
- https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/reference/configuration.md
- https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/tools/mcp-server.md
- https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/hooks/index.md
- https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/hooks/reference.md
- https://raw.githubusercontent.com/google-gemini/gemini-cli/main/packages/core/src/hooks/types.ts
- GitHub code search against `google-gemini/gemini-cli` for `.mcp.json`, `context.fileName`, and hook events

## Assessment
- New information ratio: **0.78**
- Questions addressed: **7/7**
- Questions answered:
  1. `.gemini/` currently does **not** exist in this repo.
  2. Root `GEMINI.md` exists but is generic, not Gemini-tuned.
  3. Gemini CLI auto-loads `GEMINI.md` hierarchically and can also load `AGENTS.md`.
  4. Gemini can access the same MCP servers, but through `.gemini/settings.json`, not `.mcp.json`.
  5. The best instruction-only design is a forced session/resume/structural-query protocol in `GEMINI.md`.
  6. Gemini's upstream model is stronger than OpenCode/Codex because it has both hierarchical context files and native hooks.
  7. Realistic parity is ~75% for instruction-only design and ~88% if Gemini hooks are brought into scope.

## Reflection
- **What worked and why:** Cross-checking the repo's current Gemini surface against upstream Gemini docs separated "what this repo currently configures" from "what Gemini as a runtime actually supports." That distinction was essential; otherwise Gemini would have been misclassified as just another instruction-only runtime.
- **What did not work and why:** Looking only at repo-local files initially suggested Gemini had no lifecycle surface, but that was incomplete because the repo has not yet created `.gemini/settings.json` even though upstream Gemini supports hooks and hierarchical context loading.
- **What I would do differently:** In future cross-runtime parity work, explicitly separate **repo-current state** from **upstream runtime capability** at the start of the iteration so parity estimates do not under-rate runtimes that are merely unconfigured locally.

## Recommended Next Focus
Decide whether Phase D should target:

1. **instruction-only Gemini parity** (`GEMINI.md` + `.gemini/settings.json` context/MCP setup), or
2. **near-Claude parity** by also adding Gemini hooks (`SessionStart` + `PreCompress`) and a `.mcp.json` -> `.gemini/settings.json` mirroring path.
