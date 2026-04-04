---
title: "Cross-runtime tool fallback"
description: "Cross-runtime tool fallback ensures context injection remains available when runtime hooks are missing or unavailable."
---

# Cross-runtime tool fallback

## 1. OVERVIEW

Cross-runtime fallback ensures context injection remains available when runtime hooks are missing, disabled by scope, or intentionally unavailable.

All runtimes now have hook or bootstrap-based startup injection. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). When hooks fail or are unavailable in any runtime, recover through the tool-based path starting with `session_bootstrap()` on fresh start or after `/clear`. Runtime detection identifies the active runtime and its current hook policy.

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
