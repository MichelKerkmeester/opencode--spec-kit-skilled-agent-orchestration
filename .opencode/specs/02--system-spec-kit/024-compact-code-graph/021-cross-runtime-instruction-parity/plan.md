---
title: "Plan: Cross-Runtime Instruction Parity [024/021]"
description: "Implementation order for No Hook Transport tables and @context-prime agent."
---
# Plan: Phase 021 — Cross-Runtime Instruction Parity

## Implementation Order

1. **No Hook Transport section in CODEX.md** (20-30 LOC)
   - Add trigger table: fresh session → session_resume, with optional session_health follow-up
   - After resume/reconnect → session_resume
   - After compaction/long gap → session_resume; optionally session_health when drift is suspected
   - Reduce Claude-hook-specific wording, but track residual references as a known gap until follow-up cleanup

2. **No Hook Transport section in AGENTS.md** (30-40 LOC)
   - Add same trigger table for OpenCode/Copilot CLI
   - Clarify AGENTS.md defines `@context-prime` and advertises session lifecycle guidance
   - Keep actual first-turn delegation in `.opencode/agent/orchestrate.md`

3. **No Hook Transport section in GEMINI.md** (30-40 LOC)
   - Add trigger table adapted for Gemini CLI lifecycle
   - Reference Gemini-native hooks from Phase 022
   - Include fallback for non-hook Gemini usage

4. **@context-prime agent for OpenCode** (60-80 LOC)
    - Create `.opencode/agent/context-prime.md`
   - Agent calls: `session_resume()` plus optional `session_health()`
   - Returns compact Prime Package: spec folder, task status, system health, and recommended next steps
    - Invoked on first turn or after /clear by orchestrator

5. **Orchestrator delegation** (10-15 LOC)
    - Update `.opencode/agent/orchestrate.md` to delegate to @context-prime on first turn
    - Add @context-prime to Agent Definitions in CLAUDE.md

## Status Notes

- **F059**: VERIFIED/DONE. `.opencode/agent/orchestrate.md` lines 18-21 explicitly delegate to `@context-prime` on the first user turn or after `/clear`.
- **Residual gap**: Claude Code SessionStart hook wording still persists in `.codex/agents/orchestrate.toml`, `.codex/agents/deep-research.toml`, `.codex/agents/speckit.toml`, and several `.gemini/agents/*.md` files. This phase should describe that wording as partially cleaned up, not fully removed.

6. **CLAUDE.md Agent Definitions update** (5-10 LOC)
   - Add @context-prime entry to Agent Definitions table
   - Document as LEAF-only retrieval agent for session priming

## Dependencies
- Phases 018-020 should land first (instructions reference session_health, session_resume, auto-prime)

## Estimated Total LOC: 140-350
