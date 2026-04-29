---
title: "code_graph_scan"
description: "Manual maintenance tool that scans workspace files, indexes structural nodes/edges, and optionally runs the gold-query verifier after explicit full scans."
trigger_phrases:
  - "code_graph_scan"
  - "code_graph runtime catalog"
  - "code_graph_scan"
importance_tier: "important"
---
# code_graph_scan

## 1. OVERVIEW

`code_graph_scan` is the explicit refresh path for the structural graph. It supports incremental scans, full scans, Git HEAD full-reindex promotion, detector provenance summaries, edge enrichment summaries, and optional gold-battery verification.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:177-230` resolves scan arguments and executes `indexFiles()`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:241-278` prunes removed files and persists indexed results.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:307-360` returns scan counts, readiness, provenance, and verification fields.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562-576` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Manual MCP maintenance call. Read paths may recommend it, but they do not run a broad full scan.

## 4. CLASS

manual. Packet 013 states manual `code_graph_scan`, verify, status, and doctor commands remain the control plane.

## 5. CAVEATS / FALLBACK

Run full scans in a disposable workspace for destructive exclude/prune checks. `verify:true` only runs after `incremental:false`.

## 6. CROSS-REFS

- [02-code-graph-verify.md](./02-code-graph-verify.md)
- [03-code-graph-status.md](./03-code-graph-status.md)
- [../../manual_testing_playbook/02--manual-scan-verify-status/003-code-graph-scan-incremental.md](../../manual_testing_playbook/02--manual-scan-verify-status/003-code-graph-scan-incremental.md)


