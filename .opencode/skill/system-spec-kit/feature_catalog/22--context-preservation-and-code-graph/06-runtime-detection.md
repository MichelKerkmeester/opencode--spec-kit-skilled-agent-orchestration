---
title: "Runtime detection and hook policy"
description: "Runtime detection identifies the active AI runtime and classifies its hook policy as enabled, disabled_by_scope, unavailable, or unknown based on repo/config reality."
audited_post_018: true
---

# Runtime detection and hook policy

## 1. OVERVIEW

Runtime detection identifies the active AI runtime and classifies its hook policy as enabled, disabled_by_scope, unavailable, or unknown.

Capability-based detection reads environment variables to identify claude-code, codex-cli, copilot-cli, or gemini-cli. It then inspects the current repo/config where needed: Copilot checks `.github/hooks/*.json` for repo hook wiring, including `sessionStart` and the `userPromptSubmitted` wrapper that refreshes the managed Copilot custom-instructions block; Gemini checks `.gemini/settings.json` for hooks. Returns both runtime ID and hookPolicy. `areHooksAvailable()` and `getRecoveryApproach()` helpers simplify usage. Copilot `hookPolicy: enabled` is a file-based context path, not SDK `additionalContext`.

---

## 2. CURRENT REALITY

mcp_server/code_graph/lib/runtime-detection.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | Runtime detection from env vars | _ |


### Tests

| File | Focus |
|------|-------|
| `Runtime env simulation and detection` | phase 004 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Runtime detection and hook policy
- Current reality source: spec 024-compact-code-graph 
