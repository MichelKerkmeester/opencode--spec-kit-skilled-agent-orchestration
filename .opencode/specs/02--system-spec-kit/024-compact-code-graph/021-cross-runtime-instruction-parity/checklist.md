---
title: "Checklist: Cross-Runtime Instruction Parity [024/021]"
description: "7 items across P1/P2 for phase 021."
---
# Checklist: Phase 021 — Cross-Runtime Instruction Parity

## P1 — Must Pass

- [x] CODEX.md has No Hook Transport trigger table — fresh session, resume, compaction flows documented
- [x] AGENTS.md has No Hook Transport trigger table — code graph auto-trigger included
- [x] GEMINI.md has No Hook Transport trigger table — adapted for Gemini lifecycle
- [x] @context-prime agent created at .opencode/agent/context-prime.md — 227 lines, uses `session_resume()` plus optional `session_health()`

## P2 — Should Pass

- [x] @context-prime listed in CLAUDE.md Agent Definitions — entry added to routing table
- [x] AGENTS.md defines `@context-prime` and documents No Hook Transport session lifecycle guidance
- [x] F059: orchestrate.md wires delegation to @context-prime on first turn — VERIFIED in `.opencode/agent/orchestrate.md` lines 18-21
- [ ] Residual Claude-hook wording cleanup in non-Claude agent files — KNOWN GAP in `.codex/agents/*.toml` and `.gemini/agents/*.md`
