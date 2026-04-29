---
title: "code_graph_verify"
description: "Manual gold-query verification tool that blocks on stale readiness and executes the persisted code-graph battery only when fresh."
trigger_phrases:
  - "code_graph_verify"
  - "code_graph runtime catalog"
  - "code_graph_verify"
importance_tier: "important"
---
# code_graph_verify

## 1. OVERVIEW

`code_graph_verify` runs the gold-query battery against the current graph. It is a diagnostic verification gate, not a repair path.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:141-190` resolves paths, checks readiness, blocks when not fresh, and runs the battery.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:23-26` defines the default battery path.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:405-430` loads and validates the battery JSON.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:645-664` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Manual MCP maintenance call, or optional verification inside an explicit full `code_graph_scan`.

## 4. CLASS

manual. Packet 035 signs F6 `code_graph_scan / verify` as conditional local/native coverage, not ambient automation.

## 5. CAVEATS / FALLBACK

The handler refuses stale graphs. Run `code_graph_scan({ incremental:false })` before verification when blocked.

## 6. CROSS-REFS

- [01-code-graph-scan.md](./01-code-graph-scan.md)
- [../08--doctor-code-graph/01-doctor-apply-mode.md](../08--doctor-code-graph/01-doctor-apply-mode.md)
- [../../manual_testing_playbook/02--manual-scan-verify-status/005-code-graph-verify-blocked-on-stale.md](../../manual_testing_playbook/02--manual-scan-verify-status/005-code-graph-verify-blocked-on-stale.md)


