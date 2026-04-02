---
title: "Cross-runtime tool fallback"
description: "Cross-runtime tool fallback ensures context injection works on runtimes without hook support via tool-based approach."
---

# Cross-runtime tool fallback

## 1. OVERVIEW

Cross-runtime fallback ensures context injection remains available when runtime hooks are missing or unavailable.

Hook-capable runtimes can auto-prime through their runtime-specific adapters when available. OpenCode is the non-hook runtime and should recover through the tool-based path, starting with `session_bootstrap()` on fresh start or after `/clear`. If hook context is unavailable in another runtime, fall back to the same tool-based recovery sequence. Runtime detection identifies the active runtime and its hook policy.

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
