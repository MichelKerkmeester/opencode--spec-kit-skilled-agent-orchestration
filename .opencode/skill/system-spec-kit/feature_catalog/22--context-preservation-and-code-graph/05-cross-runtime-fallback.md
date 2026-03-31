---
title: "Cross-runtime tool fallback"
description: "Cross-runtime tool fallback ensures context injection works on runtimes without hook support via tool-based approach."
---

# Cross-runtime tool fallback

## 1. OVERVIEW

Cross-runtime tool fallback ensures context injection works on runtimes without hook support via tool-based approach.

Runtimes without Claude Code hooks (Codex CLI, Copilot CLI, Gemini CLI) use tool-based recovery. CLAUDE.md and agent definitions instruct the AI to call memory_context and memory_match_triggers manually after compaction. Runtime detection identifies the active runtime and its hook policy.

---

## 2. CURRENT REALITY

.claude/CLAUDE.md

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Config` | Claude-specific recovery instructions | mcp_server/lib/code-graph/runtime-detection.ts |
| `Lib` | Runtime identification and hook policy | mcp_server/tests/runtime-detection.vitest.ts |

### Tests

| File | Focus |
|------|-------|
| `Runtime detection and hook policy classification` | phase 004 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Cross-runtime tool fallback
- Current reality source: spec 024-compact-code-graph 
