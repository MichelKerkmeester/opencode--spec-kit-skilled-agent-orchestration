---
title: "Implementation Summary: Cross-Runtime Instruction Parity [024/021]"
description: "No Hook Transport tables in all instruction files and @context-prime agent for OpenCode."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/021-cross-runtime-instruction-parity |
| **Completed** | 2026-03-31 (1 item needs verification) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All runtime instruction files now contain identical "No Hook Transport" trigger tables so non-hook CLIs know exactly when and what to call. A new `@context-prime` agent provides one-call session priming for OpenCode.

### No Hook Transport Tables

Added standardized trigger tables to `CODEX.md`, `AGENTS.md`, and `GEMINI.md` with consistent guidance:

| When | What to Call |
|------|-------------|
| Fresh session start | `memory_context({ mode: "resume" })` + `code_graph_status()` |
| After resume/reconnect | `session_resume()` or manual equivalent |
| After compaction/long gap | `session_health()` → if stale, call `memory_context({ mode: "resume" })` |
| After `/clear` | Same as fresh session |
| Before structural search | `code_graph_context({ subject: "..." })` |

Claude-hook-specific wording was removed from non-Claude instruction files. Each runtime's table is adapted to its lifecycle (e.g., Gemini references its native hooks from Phase 022).

### @context-prime Agent

A new agent at `.opencode/agent/context-prime.md` (227 lines) that:
1. Calls `memory_context({ mode: "resume" })`
2. Calls `code_graph_status()`
3. Calls `ccc_status()`
4. Returns a compact Prime Package with spec folder, task, blockers, next steps, and graph status

This agent is referenced from AGENTS.md for Session Bootstrap delegation and added to the CLAUDE.md Agent Definitions as a LEAF-only retrieval agent.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files-changed -->
## Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `.opencode/agent/context-prime.md` | New | @context-prime agent for session priming (227 lines) |
| `.opencode/agent/orchestrate.md` | Modified | Session Bootstrap delegation reference |
| `CODEX.md` | Modified | No Hook Transport trigger table |
| `AGENTS.md` | Modified | No Hook Transport trigger table, @context-prime reference |
| `GEMINI.md` | Modified | No Hook Transport trigger table |
| `CLAUDE.md` | Modified | @context-prime added to Agent Definitions |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:verification -->
## Verification

- TypeScript: N/A (documentation and config changes only)
- Tests: N/A
- Review: Opus CONDITIONAL PASS 78/100, GPT-5.4 CONDITIONAL 82%
<!-- /ANCHOR:verification -->
