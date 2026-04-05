# Research Iteration 100: Cross-Runtime Instruction Parity Gap Analysis

## Focus
Analyze what specific improvements to CODEX.md, AGENTS.md, and GEMINI.md would close the instruction parity gap with Claude Code's hook-based coverage.

## Findings

### Current State

Claude gets automatic context transport from three repo-implemented hooks: `PreCompact`, `SessionStart`, and `Stop`, registered in `.claude/settings.local.json` and documented in the hook README. [SOURCE: .claude/settings.local.json:5-40] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:7-23]

`CODEX.md` is a short supplement focused on manual recovery and tool routing, while `AGENTS.md` and `GEMINI.md` contain the full universal framework, including session-start recovery for Copilot/Gemini. [SOURCE: CODEX.md:1-40] [SOURCE: AGENTS.md:69-77] [SOURCE: GEMINI.md:69-77]

Gemini and Agents auto-load both `GEMINI.md` and `AGENTS.md` through `context.fileName`, but Codex has no equivalent config surfaced here, so it depends more on convention/manual compliance. [SOURCE: .gemini/settings.json:8-13] [SOURCE: .codex/config.toml:1-122]

### Problem

Non-hook CLIs lack Claude's automatic lifecycle execution, so context preservation depends on the agent remembering to run recovery steps. That leaves the "same tools, weaker transport" gap: Claude auto-caches, auto-reinjects, and auto-snapshots; Codex/Copilot/Gemini mostly document those behaviors instead of enforcing them. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:16-31] [SOURCE: CODEX.md:5-21]

## Analysis

### Claude Code Coverage (25 hook events)

Official Claude Code docs describe a broader hook/event surface of about 25 events, including: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `Notification`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `Stop`, `StopFailure`, `TeammateIdle`, `InstructionsLoaded`, `ConfigChange`, `CwdChanged`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove`, `PreCompact`, `PostCompact`, `Elicitation`, `ElicitationResult`, `SessionEnd`.

This repo, however, implements only three of them:
- `PreCompact`: precomputes/caches merged context before compaction.
- `SessionStart`: injects startup/resume/compact/clear context via stdout.
- `Stop`: async token/session snapshotting after responses.

What Claude gets from hooks that non-hook CLIs miss:
- Automatic pre-compaction capture.
- Automatic post-compaction/startup/resume reinjection.
- Automatic stop-time telemetry/session snapshotting.
- No reliance on "remember to call `memory_context` first."

Replicable via instruction docs:
- Session-start recovery checklist.
- Compaction recovery protocol.
- Code-graph health check trigger.
- Memory-save trigger rules.
- Query-intent routing and fallback logic.

Replicable only partially via MCP/tools, not docs alone:
- Automatic pre-compaction capture.
- Automatic startup/resume reinjection.
- Automatic stop-time snapshotting/telemetry.

### Gap by Runtime

#### CODEX.md Gaps
`CODEX.md` covers manual resume, session start, retrieval primitives, routing, and available MCP tools, but it lacks the richer operational guardrails already present elsewhere: no explicit memory-save trigger discipline, no self-monitoring loop, no working-set/compaction behavior guidance, no runtime-agent parity note, and no explicit "Codex has no hooks, always do X on first turn / after clear / after compact" matrix. [SOURCE: CODEX.md:1-40]

Most importantly, Codex appears least auto-loaded because `.codex/config.toml` exposes MCP/agents but no `context.fileName`-style instruction binding. [SOURCE: .codex/config.toml:1-122]

#### AGENTS.md Gaps
`AGENTS.md` already contains most of the universal framework, including session start for Copilot/Gemini, code search protocol, gates, memory-save rules, and runtime agent directory resolution. [SOURCE: AGENTS.md:44-230]

Its main parity gap is not missing framework content but missing explicit non-hook framing:
- It does not clearly say Copilot/Agents has no hook transport equivalent.
- It does not distinguish "manual first-turn recovery is mandatory because no hook injection exists."
- It should make compaction/clear/resume recovery more explicit as lifecycle triggers, not just a session-start note.

#### GEMINI.md Gaps
`GEMINI.md` is effectively the same as `AGENTS.md`, so it inherits the same strengths and the same ambiguity. [SOURCE: GEMINI.md:44-230]

Its missing piece is Gemini-specific override text analogous to `.claude/CLAUDE.md`:
- "No hook-aware injection in this runtime."
- "Because both `GEMINI.md` and `AGENTS.md` auto-load, Gemini-specific deltas should live here."
- Stronger first-turn / after-clear / after-compaction recovery instructions.

## Proposals

### Proposal A: Comprehensive Instruction Parity Update
- Description: Expand `CODEX.md`, `AGENTS.md`, and `GEMINI.md` with explicit non-hook lifecycle coverage: session start, after compaction, after clear, after resume, code-graph trigger, memory-save trigger, working-set fallback, and self-monitoring reminders.
- LOC estimate: 60-140
- Files to change: `CODEX.md`, `AGENTS.md`, `GEMINI.md`, likely `.codex/agents/orchestrate.toml`, `.gemini/agents/orchestrate.md`, `.agents/agents/orchestrate.md`
- Risk: LOW — mostly doc/instruction clarification, aligned to existing architecture

### Proposal B: Shared Instruction Template with Runtime Overrides
- Description: Create one shared parity block for non-hook runtimes, then keep small runtime-specific wrappers: `CODEX.md` for Codex-specific loading/tool names; `GEMINI.md` for Gemini-specific auto-load note; `AGENTS.md` for Copilot/Agents-specific note.
- LOC estimate: 80-180
- Files to change: `AGENTS.md`, `GEMINI.md`, `CODEX.md`, possibly a shared source doc if the repo supports generation/sync
- Risk: MEDIUM — better long-term maintenance, but introduces coordination across duplicated instruction surfaces

## Recommendation

Choose **Proposal A** first.

Reason: `AGENTS.md`/`GEMINI.md` already contain most of the framework, so the fastest parity gain is to add explicit non-hook lifecycle instructions and tighten runtime-specific wording. `CODEX.md` needs the largest uplift, while Gemini/Copilot need clearer override sections, not a rewrite.

Also update runtime-specific orchestrator agent files: some still mention "Claude Code SessionStart hook" in no-hook runtimes, which is misleading even if the fallback branch is safe. [SOURCE: .codex/agents/orchestrate.toml:798-821] [SOURCE: .gemini/agents/orchestrate.md:827-850]

## Cross-Runtime Impact

| Runtime | Current Parity | After Implementation | Change |
|---------|---------------|---------------------|--------|
| Claude | 100% | 100% | 0% |
| Codex | ~55% | ~80-85% | +25-30% |
| Copilot/Agents | ~50% | ~80% | +30% |
| Gemini | ~50% | ~80% | +30% |

## Next Steps

1. Add a "No Hook Transport" section to `CODEX.md`, `AGENTS.md`, and `GEMINI.md`.
2. Add explicit trigger tables for: fresh session, resume, compact, clear, pre-structural-search, pre-memory-save.
3. Update runtime-specific orchestrator agent files to remove Claude-hook wording in Codex/Gemini/Agents runtimes.
4. Optionally document instruction-file loading differences so maintainers know where parity edits must be duplicated.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
