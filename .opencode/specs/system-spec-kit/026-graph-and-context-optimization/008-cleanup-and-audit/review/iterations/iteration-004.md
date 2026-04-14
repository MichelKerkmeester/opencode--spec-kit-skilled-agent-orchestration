# Iteration 004

- Timestamp: 2026-04-14T09:47:00.000Z
- Focus dimension: maintainability
- Files reviewed: .opencode/agent/orchestrate.md, .claude/agents/orchestrate.md, .gemini/agents/orchestrate.md, .opencode/agent/speckit.md, .claude/agents/speckit.md, .gemini/agents/speckit.md, .codex/agents/orchestrate.toml, .codex/agents/handover.toml, .codex/agents/speckit.toml
- Outcome: Found active cross-runtime manuals that still advertise memory/ and shared-memory operator flows.

## Findings

### P0
- None.

### P1
- F003 - Cross-runtime agent docs still advertise retired memory and shared-memory workflows. Active runtime agent manuals still treat memory/ as a live spec-folder exception, and the Codex orchestrator still advertises /memory:manage shared plus memory/*.md handover inputs. These are active operator instructions, not archived notes, and they contradict the retired memory surface. [SOURCE: .opencode/agent/orchestrate.md:356-366] [SOURCE: .claude/agents/orchestrate.md:356-366] [SOURCE: .gemini/agents/orchestrate.md:356-366] [SOURCE: .opencode/agent/speckit.md:26-30] [SOURCE: .claude/agents/speckit.md:26-30] [SOURCE: .gemini/agents/speckit.md:26-30] [SOURCE: .codex/agents/orchestrate.toml:811-817] [SOURCE: .codex/agents/handover.toml:16-17] [SOURCE: .codex/agents/handover.toml:53-54] [SOURCE: .codex/agents/speckit.toml:14-17]

### P2
- None.

## Evidence Notes

- OpenCode, Claude, and Gemini orchestrators still list memory/ as an allowed spec-folder exception. [SOURCE: .opencode/agent/orchestrate.md:356-366] [SOURCE: .claude/agents/orchestrate.md:356-366] [SOURCE: .gemini/agents/orchestrate.md:356-366]
- OpenCode, Claude, Gemini, and Codex speckit agents still describe files in memory/ as a live exception. [SOURCE: .opencode/agent/speckit.md:26-30] [SOURCE: .claude/agents/speckit.md:26-30] [SOURCE: .gemini/agents/speckit.md:26-30] [SOURCE: .codex/agents/speckit.toml:14-17]
- Codex still advertises /memory:manage shared and requires memory/*.md as handover context. [SOURCE: .codex/agents/orchestrate.toml:811-817] [SOURCE: .codex/agents/handover.toml:16-17] [SOURCE: .codex/agents/handover.toml:53-54]

## State Update

- status: insight
- newInfoRatio: 0.37
- findingsSummary: P0 1, P1 2, P2 0
- findingsNew: P0 0, P1 1, P2 0
- nextFocus: Correctness stabilization pass over startup scanning, recovery hints, and representative tests.
