---
title: "SessionStart priming (Claude)"
description: "Claude-specific SessionStart priming via stdout with source routing (compact/startup/resume/clear). For cross-runtime startup payload parity see the shared startup payload entry."
audited_post_018: true
phase_018_change: "Updated recovery wording so SessionStart guidance points at the phase-018 canonical recovery chain and /spec_kit:resume."
---

# SessionStart priming (Claude)

> **Scope note:** This page documents the Claude-specific SessionStart priming path. All four supported runtimes (Claude, Gemini, Copilot, Codex) now transport the same compact startup shared-payload (including `graphQualitySummary`) through their runtime-specific hooks — see `../18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md` and `references/config/hook_system.md` (Shared Startup Payload Parity section) for the cross-runtime matrix.

## 1. OVERVIEW

SessionStart priming injects context via stdout on Claude Code SessionStart based on source routing (compact/startup/resume/clear).

This hook handles four session start scenarios: after compaction it reads the cached PreCompact payload, on fresh startup it surfaces a Spec Kit Memory overview plus the shared startup payload (`graphQualitySummary`, `sharedPayloadTransport`), on resume it loads prior session state, and after /clear it provides minimal context. The output is written to stdout for Claude Code to inject into the conversation. The same payload shape is transported by `hooks/gemini/session-prime.ts`, `hooks/copilot/session-prime.ts`, and `hooks/codex/session-start.ts`.

---

## 2. CURRENT REALITY

The SessionStart hook routes by `source` field from stdin JSON. For `compact`: reads cached payload from hook state, injects, clears cache. For `startup`: outputs Spec Kit Memory tool overview. For `resume`: loads lastSpecFolder from hook state and points recovery back to `/spec_kit:resume` with the `handover.md -> _memory.continuity -> spec docs` chain. For `clear`: minimal output. Token budget: 2000 for startup/resume, 4000 for compact.

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
