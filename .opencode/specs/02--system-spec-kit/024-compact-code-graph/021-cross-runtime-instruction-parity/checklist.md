---
title: "Checklist: Cross-Runtime Instruction Parity [024/021]"
description: "7 items across P1/P2 for phase 021."
---
# Checklist: Phase 021 — Cross-Runtime Instruction Parity

## P1 — Must Pass

- [x] CODEX.md has No Hook Transport trigger table — fresh session, resume, compaction flows documented
- [x] AGENTS.md has No Hook Transport trigger table — code graph auto-trigger included
- [x] GEMINI.md has No Hook Transport trigger table — adapted for Gemini lifecycle
- [x] @context-prime agent created at .opencode/agent/context-prime.md — 227 lines, calls memory_context + code_graph_status + ccc_status

## P2 — Should Pass

- [x] @context-prime listed in CLAUDE.md Agent Definitions — entry added to routing table
- [x] Session Bootstrap delegation documented in AGENTS.md — references @context-prime
- [ ] F059: orchestrate.md wires delegation to @context-prime on first turn — NEEDS VERIFICATION
