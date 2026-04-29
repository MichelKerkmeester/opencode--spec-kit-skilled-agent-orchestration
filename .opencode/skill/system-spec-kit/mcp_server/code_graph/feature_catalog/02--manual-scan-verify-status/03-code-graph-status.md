---
title: "code_graph_status"
description: "Diagnostic-only health probe that reads readiness, graph counts, parser health, edge drift, and gold verification trust without mutating graph state."
trigger_phrases:
  - "code_graph_status"
  - "code_graph runtime catalog"
  - "code_graph_status"
importance_tier: "important"
---
# code_graph_status

## 1. OVERVIEW

`code_graph_status` reports graph health and readiness. It uses a read-only readiness snapshot so status calls do not repair stale state.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158-180` reads the readiness snapshot before stats.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:181-212` returns a degraded envelope when stats are unavailable.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:214-260` assembles the successful status payload.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:599-603` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Manual diagnostic MCP call. Startup/resume surfaces may include status-like structural summaries, but this handler itself runs only when requested.

## 4. CLASS

manual diagnostic. Packet 013 uses the same language for diagnostic freshness tools: status detects, explicit repair paths rebuild or scan.

## 5. CAVEATS / FALLBACK

Status can recommend `rg` or `code_graph_scan`; it does not perform either. Treat stale status as an operator prompt, not repair proof.

## 6. CROSS-REFS

- [01-code-graph-scan.md](./01-code-graph-scan.md)
- [../01--read-path-freshness/01-ensure-code-graph-ready.md](../01--read-path-freshness/01-ensure-code-graph-ready.md)
- [../../manual_testing_playbook/02--manual-scan-verify-status/006-code-graph-status-readonly.md](../../manual_testing_playbook/02--manual-scan-verify-status/006-code-graph-status-readonly.md)


