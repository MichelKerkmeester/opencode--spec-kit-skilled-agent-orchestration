# Research Iteration 096: Auto-Priming Without Hooks

## Focus
Investigate how non-hook CLIs (OpenCode, Codex CLI, Copilot CLI, Gemini CLI) can achieve SessionStart-like auto-priming behavior via MCP first-call detection and gate doc instructions.

## Findings

### Current State

Claude already has real SessionStart priming through `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`. It branches on `compact`, `startup`, `resume`, and `clear`; injects cached compact recovery, key memory/code-graph tool reminders, stale graph warnings, and last spec folder hints; then writes the payload to stdout under a token budget. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:29-72`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-151`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:153-205`]

Non-hook runtimes already have a partial server-side equivalent: the MCP server runs `primeSessionIfNeeded()` before every tool dispatch, and on the first tool call it returns constitutional memories plus a code-graph status snapshot. That payload is currently injected into response hints/meta, not as a full recovery turn. Critically, the detector is a module-global `sessionPrimed` boolean, so it is "first call in this MCP server process," not "first call in an explicit logical session." [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:668-675`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:729-752`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:75-82`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:282-325`]

The server also has a runtime-agnostic instruction channel: `buildServerInstructions()` summarizes indexed memory/tools at startup and passes that string through `server.setInstructions(...)`. Today that text is generic and does not explicitly force first-turn resume/graph checks. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:579-603`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1509-1514`]

The recovery/session plumbing already exists. `memory_context` mints or validates a trusted session id, persists session state, computes resume heuristics, and can inject prior working-memory prompt context when `mode=resume` on a resumed session. `session-manager.ts` can also save and recover persisted `spec_folder`, `current_task`, `context_summary`, and `pending_work`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:783-816`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117-1217`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1291-1312`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020-1076`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126-1180`]

The doc/gate side is already partly in place. Root `CLAUDE.md` and `AGENTS.md` tell Copilot/Gemini sessions to call `memory_context(...resume...)` and `code_graph_status()` on the first turn; `CODEX.md` does the same for Codex; `.claude/CLAUDE.md` says Claude should trust hook payloads first; Gemini is configured to load `GEMINI.md` and `AGENTS.md`, while `.codex/config.toml` only configures MCP servers and does not itself provide a first-turn instruction slot. [SOURCE: `CLAUDE.md:69-76`; `AGENTS.md:69-76`; `CODEX.md:14-20`; `.claude/CLAUDE.md:5-23`; `.gemini/settings.json:8-13`; `.codex/config.toml:5-39`]

### Problem

The gap is not "zero auto-priming"; it is that non-hook CLIs only get weak, indirect priming. They lack Claude's true pre-user-turn SessionStart injection, so cold starts still happen when the model ignores doc instructions or when the first MCP response only carries priming in metadata/hints instead of a recovery payload. The current first-call detector is also process-scoped, not explicitly session-scoped, so it is robust only when each CLI session launches a fresh local MCP server process. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:81-82`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:286-312`; `opencode.json:10-56`; `.codex/config.toml:5-39`; `.gemini/settings.json:17-59`]

## Proposals

### Proposal A: MCP First-Call Auto-Prime Injection

- Description: Upgrade the existing `primeSessionIfNeeded()` path from "metadata-only first-call hinting" into a real priming payload builder. On the first tool call in a fresh MCP process/session, inject a compact `session_context` block containing recovered session state (`specFolder`, `currentTask`, `pendingWork` if available), code-graph health, and explicit next actions (`memory_context resume`, `code_graph_status`). Do this centrally in `context-server.ts`, not per tool.
- LOC estimate: 140-240
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` or `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`
- Dependencies: Reuse existing `primeSessionIfNeeded()`, `getCodeGraphStatusSnapshot()`, and `session-manager` recovery/state APIs; avoid recursive calls back into `memory_context`.
- Risk: MEDIUM — architecturally clean because the dispatch seam already exists, but "true session" semantics are only guaranteed if MCP process lifecycle matches CLI session lifecycle.
- Cross-runtime: OpenCode, Codex CLI, Gemini CLI, Copilot CLI — any runtime that actually hits this MCP server.

### Proposal B: Gate Doc First-Turn Instructions

- Description: Normalize and harden first-turn instructions in `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, and `GEMINI.md` so they all use the same mandatory sequence: `memory_context(...resume...)` then `code_graph_status()`, then fallback to CocoIndex/file reads if graph is stale. Optionally mirror this same wording in MCP `buildServerInstructions()`.
- LOC estimate: 25-60 for docs only, 35-75 if startup MCP instructions are also updated
- Files to change:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `CODEX.md`
  - `GEMINI.md`
  - optional: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- Dependencies: Runtime must actually load these docs. Gemini already does via `context.fileName`; Codex relies on doc-loading conventions; plain Copilot CLI is the weakest case.
- Risk: LOW — cheap, reversible, and already aligned with current project guidance.
- Cross-runtime: Strong for OpenCode, Codex CLI, Gemini CLI; weak for plain Copilot CLI; irrelevant to Claude's happy path.

### Proposal C: CLI Wrapper Scripts

- Description: Add launcher scripts that prepend a priming prompt before opening the real CLI, or run a non-interactive priming step first. This is the only approach that can fully compensate for runtimes that ignore project docs.
- LOC estimate: 90-180
- Files to change:
  - new wrapper scripts under a repo-owned `scripts/` or `bin/` directory
  - docs pointing users/aliases to those wrappers
- Dependencies: Per-runtime launch semantics; user adoption; shell alias or PATH changes outside the repo.
- Risk: HIGH — operationally effective but brittle, external to core MCP behavior, and hard to standardize across Codex/Copilot/Gemini interactive flows.
- Cross-runtime: Any runtime you explicitly wrap.

### Proposal D: Session-Aware Tool Response Enrichment

- Description: Formalize the existing metadata path so the first N tool responses include a top-level `session_context`/`sessionPriming` object with recovered state, graph status, and recommended next actions. This is an incremental evolution of what `context-server.ts` already does today.
- LOC estimate: 80-140
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`
- Dependencies: Existing envelope mutation path and first-call detector; optional stronger session keying if you want per-session instead of per-process behavior.
- Risk: LOW-MEDIUM — least invasive, but weaker than Proposal A because some clients/models may ignore metadata-heavy priming.
- Cross-runtime: Same as A for MCP-enabled clients.

## Recommendation

Best path: **A + B**, implemented with **D-style structured enrichment inside A**, and **defer C**.

Why: the repo already has the right seam. `context-server.ts` pre-dispatch priming and `memory-surface.ts` first-call detection mean you do **not** need a brand-new mechanism; you need to upgrade the payload from "first response metadata" to "actionable session recovery context," then reinforce it with stronger docs/server instructions. That gives the biggest reliability gain per LOC. Wrappers are only worth doing later for plain Copilot-style runtimes that still ignore both MCP hints and repo docs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:668-752`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:282-325`; `CODEX.md:14-20`; `CLAUDE.md:69-76`]

## Cross-Runtime Impact

| Runtime | Current Priming | After Implementation | Parity Change |
|---------|----------------|---------------------|---------------|
| Claude Code | Full hook-based | No change needed | 100% stays 100% |
| OpenCode | Manual/agent-based + docs | MCP first-call prime + docs | 60% -> 85% |
| Codex CLI | `CODEX.md` only | MCP first-call prime + docs | 55% -> 80% |
| Copilot CLI | None / weak | MCP first-call prime only | 50% -> 70% |
| Gemini CLI | Docs loaded via settings, no hooks configured | MCP first-call prime + loaded docs | 50% -> 85% |

## Next Steps

1. Replace the current process-global "one-shot hint" behavior with a named priming contract in `context-server.ts`/`memory-surface.ts`, still using first-call detection but returning structured `session_context`.

2. Populate that payload from existing `session-manager` recovery fields plus code-graph snapshot; do not recurse through `memory_context`.

3. Surface priming in both `meta` and human-readable `hints`, with a small fixed shape: `specFolder`, `currentTask`, `pendingWork`, `codeGraph`, `recommendedCalls`.

4. Update `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, and `GEMINI.md` to use identical first-turn wording; optionally add the same directive to `buildServerInstructions()`.

5. Add regression tests around first-call priming, non-first-call suppression, and stale/no-session fallback behavior.

6. Re-evaluate wrappers only if Copilot CLI still shows unacceptable cold-start behavior after A+B.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
- Runtime: ~5 minutes
- Token usage: ~990k in, ~18k out
