---
title: "PreCompact hook context caching"
description: "PreCompact hook precomputes critical context before Claude Code compaction and caches to temp file for later injection."
---

# PreCompact hook context caching

## 1. OVERVIEW

PreCompact hook precomputes critical context before Claude Code compaction and caches to temp file for later injection.

When a long conversation is about to be compressed, this hook reads the transcript tail, extracts active file paths and topics, builds a compact context payload within the 4000-token budget, and caches it in hook state for the SessionStart hook to pick up after compaction completes.

---

## 2. CURRENT REALITY

The PreCompact hook runs as an external Node.js process triggered by Claude Code. It reads stdin JSON (session_id, transcript_path, trigger), tails the last 50 lines of the transcript JSONL, extracts file paths and spec folder references, builds a context string, truncates to COMPACTION_TOKEN_BUDGET (4000 tokens), and stores the payload in hook state at `${tmpdir}/speckit-claude-hooks/<project-hash>/<session-id>.json`. Stdout is NOT injected on PreCompact events — caching only.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/claude/compact-inject.ts` | Hook | PreCompact precompute and cache |
| `mcp_server/hooks/claude/shared.ts` | Hook | Stdin parsing, output formatting, timeout, logging |
| `mcp_server/hooks/claude/hook-state.ts` | Hook | Per-session state management |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hook-precompact.vitest.ts` | Context caching, budget enforcement, transcript extraction |
| `mcp_server/tests/hook-shared.vitest.ts` | Shared utility functions |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: PreCompact hook context caching
- Current reality source: spec 024-compact-code-graph phase 001
