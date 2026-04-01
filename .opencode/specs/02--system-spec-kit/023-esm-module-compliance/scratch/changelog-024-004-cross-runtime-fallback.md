# Changelog: 024/004-cross-runtime-fallback

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 004-cross-runtime-fallback — 2026-03-28

The system now works across all four AI runtimes (Claude Code, Codex CLI, Copilot CLI, Gemini CLI) -- not just Claude Code. Before this phase, only Claude Code could automatically recover context after a compaction event (when the AI's conversation window fills up and older messages are compressed away). Every other runtime would lose track of what it was doing. This phase adds a capability-based runtime detection system and a universal tool-based recovery strategy, so that every runtime can pick up where it left off using the same two MCP primitives regardless of whether hooks are available.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/`

---

## What Changed

### New Features (3)

---

### Runtime Detection

**Problem:** The system had no way to know which AI runtime was active or what capabilities it supported. All runtimes were treated identically, which meant the system could not tailor its recovery behavior. For instance, Claude Code supports lifecycle hooks (small programs that fire automatically at specific moments, like right before a compaction) while Codex CLI does not support hooks at all. Without knowing which runtime was in charge, the system could not make an informed decision about how to recover.

**Fix:** Built a `detectRuntime()` function that inspects environment variables -- special markers each runtime sets when it starts up -- to identify both the active runtime and its hook support policy. It returns two pieces of information: which runtime is active (Claude Code, Codex CLI, Copilot CLI, Gemini CLI, or unknown), and whether hooks are enabled, disabled by policy, or unavailable entirely. Detection uses env markers like `CLAUDE_CODE` / `CLAUDE_SESSION_ID` for Claude Code, `CODEX_CLI` / `CODEX_SANDBOX` for Codex CLI, and so on. This lets the system automatically choose the right recovery strategy for each runtime without any manual configuration.

---

### Recovery Approach Routing

**Problem:** There was no logic to decide whether to use hooks or a tool-based fallback for context recovery. Even when the system could theoretically detect the runtime, there was no decision layer that mapped "this runtime" to "use this recovery method." The result was that all runtimes either tried hooks (which only work in Claude Code) or did nothing at all.

**Fix:** Added a `getRecoveryApproach()` function that maps each runtime's hook policy to a concrete recovery strategy: either `hook_based` (for Claude Code, which has full hook support) or `tool_fallback` (for everything else). Copilot CLI and Gemini CLI technically support hooks, but they are classified as "disabled by policy" in this first version. This framing is deliberate -- it avoids making false claims about the ecosystem while allowing future enablement by simply updating the runtime detection fixture, with no code changes required.

---

### Gemini Hook Policy Detection

**Problem:** Gemini CLI supports hooks (since version 0.33.1), but there was no way to check whether a specific user had actually configured them. Without this check, the system could not distinguish between "Gemini user with hooks set up" and "Gemini user without hooks" -- it had to assume the worst case for everyone.

**Fix:** Added a `detectGeminiHookPolicy()` function that reads the `.gemini/settings.json` configuration file to determine whether hooks are actually set up for the current user. This gives the system a more informed signal for Gemini environments specifically. In the current version, Gemini is still classified as `disabled_by_scope` as a policy decision, but this detection lays the groundwork for enabling hook-based recovery in Gemini once adapter work is completed.

---

### Architecture (2)

---

### Claude-Specific Recovery Layer

**Problem:** The root `CLAUDE.md` instruction file handled all runtimes generically, but Claude Code has unique hook-based capabilities that the other runtimes lack. When Claude Code's hooks inject recovered context into a conversation (for example, after a compaction event), there were no instructions telling the AI what to do with that injected context. Should it use it directly? Should it ignore it and run the full manual recovery flow? The AI had no guidance, which could lead to redundant or conflicting recovery behavior. This was identified as "Gap B" during research iteration 012.

**Fix:** Created a new `.claude/CLAUDE.md` file with Claude-specific instructions. Claude Code loads both the root `CLAUDE.md` and this private file, so the instructions stack. The private file contains three key directives: (1) when hook-injected context appears in the conversation, use it directly and skip the manual recovery flow; (2) when hooks are absent or the injected payload looks stale or incomplete, fall back to the standard recovery protocol in the root file; (3) when SessionStart hooks inject startup context before the first user turn, treat it as additive context rather than the sole source of truth. This keeps Claude-specific logic out of the universal instruction file while giving Claude Code the guidance it needs.

---

### Universal Compaction Recovery Protocol

**Problem:** After a compaction event, different runtimes used inconsistent recovery steps -- or none at all. The root `CLAUDE.md` had generic instructions, but they did not specify the exact function call parameters needed for a proper recovery. In particular, the critical `profile: "resume"` parameter was missing. Without it, the MCP server (the memory system) returns full search results instead of a compact recovery brief, flooding the AI with information when it needs a concise summary of where it left off.

**Fix:** Updated both `CLAUDE.md` and `CODEX.md` with explicit instructions to immediately call `memory_context({ mode: "resume", profile: "resume" })` as the very first action after any compaction event. The `profile: "resume"` parameter is the key detail -- it tells the memory system to return a brief recovery package (current task, spec folder, blockers, next steps) instead of raw search results. All runtimes now use the same two primitives (`memory_match_triggers` followed by `memory_context` with the resume profile) for consistent recovery regardless of whether hooks are available.

---

### Testing (1)

---

### 7-Scenario Test Matrix

**Problem:** There was no test coverage for cross-runtime recovery paths. The system had no way to verify that Codex CLI, Copilot CLI, or Gemini CLI would correctly detect their runtime, apply the right hook policy, and select the appropriate recovery strategy. A regression in any of these paths would go unnoticed.

**Fix:** Built a comprehensive test suite covering seven scenarios, as specified during research iteration 015. The scenarios are: (1) Claude Code with hooks enabled, (2) Claude Code with hooks disabled, (3) Codex CLI, (4) Copilot CLI, (5) Gemini CLI, (6) unknown runtimes, and (7) graceful degradation. Each scenario verifies three things: the correct runtime is detected, the right hook policy is assigned, and the appropriate recovery approach is selected. Unknown runtimes safely fall back to tool-based recovery, which is the conservative default. The tests are split across three files -- `cross-runtime-fallback.vitest.ts` for the full matrix, `runtime-routing.vitest.ts` for routing logic, and `runtime-detection.vitest.ts` for unit-level detection tests.

---

<details>
<summary><strong>Files Changed (8)</strong></summary>

| File | What changed |
|------|-------------|
| `lib/code-graph/runtime-detection.ts` | New module with `detectRuntime()`, `getRecoveryApproach()`, and `detectGeminiHookPolicy()` functions |
| `CLAUDE.md` | Enhanced compaction recovery with explicit `memory_context(resume)` call and `profile: "resume"` parameter |
| `.claude/CLAUDE.md` | New Claude-specific hook-aware recovery instructions and SessionStart payload handling |
| `CODEX.md` | Added compaction recovery instructions using the same two MCP primitives |
| `startup-checks.ts` | Integrated runtime detection into MCP server startup flow |
| `tests/cross-runtime-fallback.vitest.ts` | New 7-scenario test matrix for runtime fallback paths |
| `tests/runtime-routing.vitest.ts` | New tests for runtime routing and detection logic |
| `tests/runtime-detection.vitest.ts` | New unit tests for `detectRuntime()` and policy resolution |

</details>

---

## Deep Review Fixes (2026-04-01)

### Code Fix
- **Runtime detection wired into startup** -- `detectRuntime()` now called during MCP server initialization, result stored and logged. Previously existed only in test files.

### Doc Fixes
- Gemini hook policy standardized to `unavailable` (was `disabled_by_scope`)
- `getRecoveryApproach()` return value aligned to `hooks` (was `hook_based`)
- Implementation-summary notes detectRuntime() is now wired into startup

## Upgrade

No migration required.
