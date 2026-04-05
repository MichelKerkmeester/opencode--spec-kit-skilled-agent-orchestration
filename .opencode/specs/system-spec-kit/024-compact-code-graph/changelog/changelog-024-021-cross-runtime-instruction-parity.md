# Changelog: 024/021-cross-runtime-instruction-parity

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 021-cross-runtime-instruction-parity -- 2026-03-31

When this phase landed, Claude still had the strongest startup/recovery story and the non-Claude instruction files were missing a consistent lifecycle fallback. This phase closed the instruction-layer gap by adding standardized "No Hook Transport" trigger tables to the non-Claude guidance and by introducing `@context-prime` for OpenCode-style bootstrap delegation. Later phases refined the public recovery contract around `session_bootstrap()`, Gemini hooks, Codex bootstrap parity, OpenCode startup digests, and repo-local Copilot startup wiring.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/`

---

## What Changed

### Documentation (4 changes)

---

### No Hook Transport table added to CODEX.md

**Problem:** Codex CLI had zero guidance for what the AI should do at key lifecycle moments -- starting a fresh session, resuming after a disconnect, recovering after the context window was compacted (trimmed to fit), or clearing the conversation. Claude Code handles all of these automatically via hooks (small scripts that fire at the right moment), but Codex CLI has no hook system. The AI running inside Codex simply did nothing at these moments, which meant it started every session without loading prior work, without checking whether the code graph (a structural index of the codebase) was fresh, and without knowing what task was in progress.

**Fix:** Added a "No Hook Transport" trigger table to `CODEX.md` -- the instruction file that Codex CLI reads on startup. The table maps each lifecycle event (fresh session, resume, compaction, `/clear`, structural search, memory save) to the exact tool calls the AI should make. For example, on a fresh session start the AI now knows to call `memory_context({ mode: "resume" })` to load prior context, plus `code_graph_status()` to check whether the structural index is current. This is the same behavior Claude Code gets from its hooks, just expressed as explicit instructions instead.

---

### No Hook Transport table added to AGENTS.md

**Problem:** The `AGENTS.md` file serves as the instruction file for both OpenCode (Copilot) and Copilot CLI. Like Codex CLI, these runtimes have no automated hook system, so the AI had no guidance on lifecycle behaviors -- it did not know to load memory on startup, check graph freshness, or recover context after a long gap. OpenCode coverage was estimated at 60%, and Copilot CLI at just 50%, compared to Claude Code's 100%.

**Fix:** Added the same standardized No Hook Transport trigger table to `AGENTS.md`, plus a reference to the new `@context-prime` agent (see below) for Session Bootstrap delegation. This gave OpenCode and Copilot-style flows an explicit fallback recovery script at the instruction level. The current packet state goes further than this changelog alone: OpenCode now has a transport digest path, and repo-local Copilot startup wiring is tracked in packet 030/031.

---

### No Hook Transport table added to GEMINI.md

**Problem:** Gemini CLI's instruction file (`GEMINI.md`) had no recovery or priming flows. Gemini was estimated at just 50% lifecycle coverage. While Phase 022 had introduced Gemini-native hooks, there was no fallback guidance for situations where hooks are unavailable or disabled, and the instruction file did not reference any lifecycle triggers.

**Fix:** Added a No Hook Transport trigger table adapted for Gemini's specific lifecycle, including references to the Gemini-native hooks introduced in Phase 022 and a fallback path for non-hook usage. In the current packet state, Gemini now has checked-in startup-hook support plus this fallback guidance, so this changelog entry should be read as the fallback-instruction step rather than the complete Gemini startup story.

---

### Claude-hook references removed from non-Claude files

**Problem:** Some orchestrator files for Codex (`.codex/agents/orchestrate.toml`) and Gemini (`.gemini/agents/orchestrate.md`) contained wording that referenced Claude Code's hook system -- mentioning hook-injected payloads, hook recovery flows, or Claude-specific event names. This was misleading: a developer using Codex CLI might read instructions that reference a hook system that does not exist in their runtime, creating confusion about what the AI can actually do.

**Fix:** Removed all Claude-hook-specific wording from non-Claude instruction and orchestrator files. Each runtime's instructions are now self-consistent, referencing only the mechanisms actually available in that runtime (trigger tables for hookless runtimes, native hooks for Gemini where applicable).

---

### New Features (2 changes)

---

### @context-prime agent created

**Problem:** In OpenCode, bootstrapping a session with full context required three separate manual calls: `memory_context()` to load prior session state, `code_graph_status()` to check the structural index, and `ccc_status()` to verify CocoIndex (the semantic code search system). There was no single-call way to prime a session, which meant the orchestrator either had to hard-code all three calls or the user had to remember them.

**Fix:** Created a new lightweight agent at `.opencode/agent/context-prime.md` (227 lines). This `@context-prime` agent is a LEAF-only retrieval agent -- meaning it gathers and returns information but never modifies files. It calls all three priming tools in one pass and returns a compact "Prime Package" containing: the active spec folder, the current task and its status, any blockers, recommended next steps, and the health status of the code graph. Session priming is now a single delegation (`@context-prime`) instead of three separate manual calls.

---

### @context-prime added to Agent Definitions in CLAUDE.md

**Problem:** After creating the `@context-prime` agent, it was not listed in the Agent Definitions table in `CLAUDE.md`. This table is the central directory that tells any AI assistant which agents exist and what they do. Without an entry, runtimes reading `CLAUDE.md` would not know the agent was available for session priming or post-`/clear` recovery.

**Fix:** Added an entry to the Agent Definitions table in `CLAUDE.md` describing `@context-prime` as a lightweight bootstrap agent for session start or after `/clear`. The entry specifies that it loads memory context, checks code graph and CocoIndex health, and returns a compact Prime Package with spec folder, task status, system health, and recommended next steps. All runtimes that read `CLAUDE.md` now know this agent exists and when to use it.

---

### Architecture (1 change)

---

### Cross-runtime lifecycle coverage raised to 80-85%

**Problem:** Before this phase, Claude Code operated at 100% lifecycle coverage -- every session event (startup, resume, compaction, clear) triggered the right recovery calls automatically via hooks. All other runtimes were far behind: OpenCode at 60%, Codex CLI at 55%, Copilot CLI and Gemini CLI at 50%. This meant that more than half the time, non-Claude AIs started sessions without context, did not recover after compaction, and skipped graph freshness checks.

**Fix:** With the No Hook Transport trigger tables added to the non-Claude instruction files and the `@context-prime` agent available for single-call priming, lifecycle coverage improved materially at the instruction layer. Later phases then replaced the implied ceiling here with concrete runtime work: Gemini hooks, freshness-aware startup banners, OpenCode transport digests, and repo-local Copilot startup wiring.

---

### Bug Fixes (1 change)

---

### F059: Orchestrator delegation to @context-prime needs verification

**Problem:** The `orchestrate.md` file was updated to include a Session Bootstrap delegation to `@context-prime`, so the orchestrator would automatically prime the session on first turn. However, whether this wiring actually triggers correctly has not been fully verified -- the delegation reference exists but end-to-end testing of the first-turn flow was not completed during this phase.

**Fix:** Tracked as finding F059, a P2 (low priority) deferred item. The wiring is in place and is expected to work based on the orchestrator's existing delegation pattern, but explicit verification is needed in a future phase to confirm the first-turn trigger fires as intended.

---

<details>
<summary><strong>Files Changed (6 files)</strong></summary>

| File | What changed |
|------|-------------|
| `.opencode/agent/context-prime.md` | New agent for one-call session priming (227 lines) |
| `.opencode/agent/orchestrate.md` | Session Bootstrap delegation to @context-prime |
| `CODEX.md` | No Hook Transport trigger table added |
| `AGENTS.md` | No Hook Transport trigger table + @context-prime reference |
| `GEMINI.md` | No Hook Transport trigger table for Gemini lifecycle |
| `CLAUDE.md` | @context-prime added to Agent Definitions table |

</details>

---

## Deep Review Fixes (2026-04-01)

### Doc Fixes
- @context-prime documented as using session_resume + session_health (not spec'd trio)
- Claude-hook wording gap in non-Claude files documented
- AGENTS.md vs orchestrate.md delegation clarified
- F059 marked as DONE with evidence

## Upgrade

No migration required. The new trigger tables are passive documentation -- they guide AI behavior but do not change any runtime code or configuration. The `@context-prime` agent is additive and does not affect existing workflows.
