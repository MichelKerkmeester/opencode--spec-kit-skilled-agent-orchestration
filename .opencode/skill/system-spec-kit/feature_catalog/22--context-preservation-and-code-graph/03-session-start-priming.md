---
title: "SessionStart priming"
description: "SessionStart priming injects context via stdout on Claude Code SessionStart based on source routing (compact/startup/resume/clear)."
---

# SessionStart priming

## 1. OVERVIEW

SessionStart priming injects context via stdout on Claude Code SessionStart based on source routing (compact/startup/resume/clear).

This hook handles four session start scenarios: after compaction it reads the cached PreCompact payload, on fresh startup it surfaces a Spec Kit Memory overview, on resume it loads prior session state, and after /clear it provides minimal context. The output is written to stdout for Claude Code to inject into the conversation.

---

## 2. CURRENT REALITY

The SessionStart hook routes by `source` field from stdin JSON. For `compact`: reads cached payload from hook state, injects, clears cache. For `startup`: outputs Spec Kit Memory tool overview. For `resume`: loads lastSpecFolder from hook state. For `clear`: minimal output. Token budget: 2000 for startup/resume, 4000 for compact.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/claude/session-prime.ts` | Hook | SessionStart injection with source routing |
| `mcp_server/hooks/claude/hook-state.ts` | Hook | Per-session state management |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hook-session-start.vitest.ts` | Source routing, cache read, output formatting |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: SessionStart priming
- Current reality source: spec 024-compact-code-graph phase 002
