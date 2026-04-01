---
title: "Plan: Cross-Runtime Instruction Parity [024/021]"
description: "Implementation order for No Hook Transport tables and @context-prime agent."
---
# Plan: Phase 021 — Cross-Runtime Instruction Parity

## Implementation Order

1. **No Hook Transport section in CODEX.md** (20-30 LOC)
   - Add trigger table: fresh session → memory_context + code_graph_status
   - After resume/reconnect → session_resume or manual equivalent
   - After compaction/long gap → session_health check
   - Remove Claude-hook-specific wording

2. **No Hook Transport section in AGENTS.md** (30-40 LOC)
   - Add same trigger table for OpenCode/Copilot CLI
   - Include code graph auto-trigger instructions
   - Session Bootstrap delegation to @context-prime

3. **No Hook Transport section in GEMINI.md** (30-40 LOC)
   - Add trigger table adapted for Gemini CLI lifecycle
   - Reference Gemini-native hooks from Phase 022
   - Include fallback for non-hook Gemini usage

4. **@context-prime agent for OpenCode** (60-80 LOC)
   - Create `.opencode/agent/context-prime.md`
   - Agent calls: memory_context({ mode: "resume" }) + code_graph_status() + ccc_status()
   - Returns compact Prime Package: spec folder, task, blockers, next steps, graph status
   - Invoked on first turn or after /clear by orchestrator

5. **Orchestrator delegation** (10-15 LOC)
   - Update `.opencode/agent/orchestrate.md` to delegate to @context-prime on first turn
   - Add @context-prime to Agent Definitions in CLAUDE.md

6. **CLAUDE.md Agent Definitions update** (5-10 LOC)
   - Add @context-prime entry to Agent Definitions table
   - Document as LEAF-only retrieval agent for session priming

## Dependencies
- Phases 018-020 should land first (instructions reference session_health, session_resume, auto-prime)

## Estimated Total LOC: 140-350
