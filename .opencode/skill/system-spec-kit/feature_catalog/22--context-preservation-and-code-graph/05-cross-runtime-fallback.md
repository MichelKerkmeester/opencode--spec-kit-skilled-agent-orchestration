---
title: "Cross-runtime tool fallback"
description: "Cross-runtime tool fallback ensures context injection remains available when runtime hooks are missing or unavailable."
audited_post_018: true
phase_018_replaces: "Legacy placeholder recovery wording that pointed at .claude/CLAUDE.md instead of the canonical /spec_kit:resume ladder."
---

# Cross-runtime tool fallback

## 1. OVERVIEW

Claude Code uses native hooks. Codex CLI now has native `SessionStart` and `UserPromptSubmit` hooks when `codex_hooks = true` and user-level `~/.codex/hooks.json` registers the Spec Kit commands; older or restricted deployments fall back to the tool path or prompt wrapper. Copilot CLI uses repo-scoped `.github/hooks/*.json` wiring, but prompt-time context is delivered through a Spec Kit managed block in local Copilot custom instructions because Copilot hook stdout is not prompt-mutating. Gemini CLI uses `.gemini/settings.json` hook configuration plus the shipped Gemini hook entrypoints (including `mcp_server/hooks/gemini/session-prime.ts`). OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). When hooks fail or are unavailable in any runtime, recover through the canonical tool-based path starting with `/spec_kit:resume`, which resolves `handover.md -> _memory.continuity -> spec docs`; `session_bootstrap()` and `session_resume()` remain the lower-level recovery surfaces for structural bootstrap and detailed merged state. Runtime detection identifies the active runtime and its current hook policy.

---

## 2. CURRENT REALITY

Runtime detection is the source of truth for hook-aware fallback. It identifies the active runtime, classifies the current hook policy as `enabled`, `disabled_by_scope`, `unavailable`, or `unknown`, and then lets packet recovery fall back through `/spec_kit:resume` and the `handover.md -> _memory.continuity -> spec docs` chain when runtime hooks are missing. The contract is intentionally runtime-specific rather than "all shells behave the same." For Copilot, `enabled` means repo hooks can refresh custom instructions and compact-cache state; it does not mean hook stdout injects `additionalContext`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code-graph/lib/runtime-detection.ts` | Lib | Runtime identification and hook policy |
| `mcp_server/context-server.ts` | Server | Startup recovery guidance and tool routing hints |
| `mcp_server/tests/runtime-detection.vitest.ts` | Tests | Runtime env simulation and detection |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/runtime-detection.vitest.ts` | Runtime env simulation and detection |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Cross-runtime tool fallback
- Current reality source: spec 024-compact-code-graph 
