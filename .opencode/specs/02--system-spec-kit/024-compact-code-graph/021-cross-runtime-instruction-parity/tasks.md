---
title: "Tasks: Cross-Runtime Instruction Parity [024/021]"
description: "Task tracking for instruction file parity and @context-prime agent."
---
# Tasks: Phase 021 — Cross-Runtime Instruction Parity

## Completed

- [x] No Hook Transport section added to CODEX.md — trigger table with session/resume/compaction flows
- [x] No Hook Transport section added to AGENTS.md — trigger table with code graph auto-trigger
- [x] No Hook Transport section added to GEMINI.md — trigger table adapted for Gemini lifecycle
- [x] @context-prime agent created — .opencode/agent/context-prime.md (227 lines) with `session_resume()` plus optional `session_health()`
- [x] @context-prime added to CLAUDE.md Agent Definitions — entry in agent routing table
- [x] Session lifecycle guidance documented — AGENTS.md defines `@context-prime` and includes No Hook Transport guidance
- [x] F059: Orchestrator delegation to @context-prime verified — `.opencode/agent/orchestrate.md` lines 18-21 delegate on first turn or after `/clear`

## Deferred

- [ ] Residual Claude-hook wording cleanup in non-Claude agent files — known gap remains in `.codex/agents/*.toml` and `.gemini/agents/*.md` follow-up work (P2)
