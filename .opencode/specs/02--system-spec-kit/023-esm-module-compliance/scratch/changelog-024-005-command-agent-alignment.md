# Changelog: 024/005-command-agent-alignment

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 005-command-agent-alignment — 2026-03-31

Commands and agent definitions across all four runtimes (Claude Code, Codex, Copilot/OpenCode, Gemini) now integrate with the hook system for context preservation. Before this phase, commands like `/spec_kit:resume` returned raw search results instead of a compact recovery brief, `/memory:save` could duplicate work already done by the automatic Stop hook, and agent definitions still instructed the AI to manually recover context even when hooks had already injected it. This phase fixes those gaps while keeping everything backward-compatible for runtimes that don't support hooks.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/`

---

## What Changed

### Commands (2 changes)

#### Resume command now returns a compact brief

**Problem:** The `/spec_kit:resume` command is what you use to pick up where you left off in a previous session. It calls an internal function named `memory_context()` with a "resume" mode to fetch your prior work state. However, it was missing a second parameter called `profile: "resume"` -- a flag that tells the system to format the response as a condensed recovery brief (showing your current task, spec folder, blockers, and next steps). Without that flag, the system returned verbose, unformatted search results -- essentially a wall of raw data that was slow and difficult to scan.

**Fix:** Added the `profile: "resume"` parameter to the `memory_context()` call inside the resume command. This activates the condensed brief format, which was identified as a gap during research iteration 012. Users now get a short, structured summary instead of raw search output. The change was a single-line addition with no impact on other commands.

#### Memory save prevents duplicate saves

**Problem:** The system has an automatic "Stop hook" (`session-stop.ts`) that saves your session context whenever a conversation ends or the AI stops responding. The manual `/memory:save` command also saves session context -- but it had no awareness of the automatic hook. If the Stop hook fired and then you ran `/memory:save` within the same minute, you would get two nearly identical memory entries. Over time, these duplicates clutter the memory database and waste storage without adding value.

**Fix:** Added detection logic that checks whether `session-stop.ts` recently performed an auto-save by examining a timestamp called `pendingCompactPrime.cachedAt`. If an auto-save happened within the last 60 seconds, the command now shows a prompt asking whether to merge the new save with the existing one or skip entirely, rather than silently creating a duplicate. When no hooks are active (as in Codex, Copilot, or Gemini runtimes), the original unconditional save behavior is preserved -- so nothing changes for those environments.

---

### Architecture (2 changes)

#### Agent definitions updated across all four runtimes

**Problem:** Agent definitions are instruction files that tell the AI how to behave in specific roles (like the context agent, handover agent, or orchestrator agent). These files exist in four separate directories -- one per runtime environment (`.claude/agents/`, `.opencode/agent/`, `.codex/agents/`, `.gemini/agents/`). After the hook system was introduced, these agents still contained instructions telling the AI to manually call recovery tools (like `memory_context()`) after a context compaction event -- even when hooks had already injected that same context into the conversation automatically. This caused redundant tool calls that slowed down post-compaction recovery and wasted processing time.

**Fix:** Added a conditional block to agent definitions across all four runtime directories: if hook-injected context is already present in the conversation, the agent uses it directly; if not, the agent falls back to the existing manual recovery flow. This avoids redundant MCP calls while keeping agents fully functional on runtimes where hooks are not supported. Key agents updated include `@handover` (now references hook state), `@context` (checks for hook-injected context before doing broad codebase exploration), and `@orchestrate`.

#### Query-intent routing guidance added to agents

**Problem:** Agents had no guidance on which search tool to use for different kinds of questions. The system offers three distinct search mechanisms -- CocoIndex (semantic code search that understands meaning), Code Graph (structural navigation that traces function calls, imports, and dependencies), and Memory (session context that tracks what you were working on). Without routing guidance, agents would default to whichever tool they encountered first, often using the wrong one for the job. For example, an agent might use semantic search to answer "what calls this function?" when the Code Graph would give a faster, more precise answer.

**Fix:** Added routing tables to agent definitions that map query intent to the appropriate tool. "Find code that does X" routes to CocoIndex. "What calls this function?" or "What imports this file?" routes to the Code Graph. "What was I working on?" routes to Memory. These tables are advisory -- the agent still makes the final decision -- but they provide clear default behavior that matches each tool's strengths.

---

### Documentation (2 changes)

#### SKILL.md updated with Hook System and Code Graph sections

**Problem:** The SKILL.md file serves as the canonical reference for how the spec kit system works, including all commands and their integration points. After the hook system and code graph were introduced, SKILL.md had no mention of either. This meant the AI had no documentation to consult when deciding how commands interact with hooks, or when to leverage the code graph for structural queries instead of text search.

**Fix:** Added dedicated "Hook System" and "Code Graph" sections to SKILL.md. These sections document how commands interact with hooks (for example, how `/memory:save` checks for Stop hook auto-saves), and when to use the code graph for structural navigation (for example, tracing call chains or finding all importers of a module). This centralizes the documentation rather than scattering it across individual command files.

#### Full command audit completed

**Problem:** With the introduction of hooks, any command that makes assumptions about context state -- such as "context is always manually loaded" or "saves are always user-initiated" -- could behave incorrectly. Without a systematic audit, it was unclear which commands needed updates and which were already compatible.

**Fix:** All spec_kit commands (`resume`, `handover`, `complete`, `implement`) and memory commands (`search`, `manage`, `learn`, `save`) were audited for compaction-related assumptions. The audit confirmed that `memory search` uses `memory_context`/`memory_search`, `manage` uses `memory_stats`/`memory_health`, and `learn` uses constitutional APIs -- all of which are hook-compatible without modification. Only `resume` and `save` required changes (documented above). The remaining commands needed no updates.

---

<details>
<summary><strong>Files Changed (7 entries)</strong></summary>

| File | What changed |
|------|-------------|
| `.opencode/command/spec_kit/resume.md` | Added `profile: "resume"` to the `memory_context()` call for compact recovery briefs |
| `.opencode/command/memory/save.md` | Added Stop hook double-save detection with merge/skip prompt |
| `.claude/agents/*.md` | Hook-aware compaction recovery with manual tool fallback |
| `.opencode/agent/*.md` | Hook-aware compaction recovery with manual tool fallback |
| `.codex/agents/*.md` | Hook-aware compaction recovery with manual tool fallback |
| `.gemini/agents/*.md` | Hook-aware compaction recovery with manual tool fallback |
| `.opencode/skill/system-spec-kit/SKILL.md` | New Hook System and Code Graph sections for command integration |

</details>

## Upgrade

No migration required.
