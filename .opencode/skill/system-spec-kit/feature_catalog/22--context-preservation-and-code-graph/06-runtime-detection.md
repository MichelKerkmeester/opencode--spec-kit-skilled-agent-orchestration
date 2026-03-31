---
title: "Runtime detection and hook policy"
description: "Runtime detection identifies the active AI runtime and classifies its hook policy as enabled, disabled_by_scope, or unavailable."
---

# Runtime detection and hook policy

## 1. OVERVIEW

Runtime detection identifies the active AI runtime and classifies its hook policy as enabled, disabled_by_scope, or unavailable.

Capability-based detection reads environment variables to identify claude-code, codex-cli, copilot-cli, or gemini-cli. Returns both runtime ID and hookPolicy. areHooksAvailable() and getRecoveryApproach() helpers simplify usage.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/runtime-detection.ts

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
