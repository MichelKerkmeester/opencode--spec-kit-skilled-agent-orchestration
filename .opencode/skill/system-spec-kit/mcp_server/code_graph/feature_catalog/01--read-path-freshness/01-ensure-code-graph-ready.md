---
title: "Ensure code graph ready"
description: "Shared readiness helper that detects empty, stale, full-scan, and selective-reindex states and can run bounded selective repair on read paths."
trigger_phrases:
  - "ensure code graph ready"
  - "code_graph runtime catalog"
  - "ensure code graph ready"
importance_tier: "important"
---
# Ensure code graph ready

## 1. OVERVIEW

`ensureCodeGraphReady()` is the read-path gate used by query, context, and verification surfaces. It detects graph readiness without a watcher, cleans deleted tracked files, and performs the minimum allowed inline repair.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:141-225` detects empty, stale, full-scan, and selective-reindex states.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-375` debounces checks and blocks inline repair when callers disallow it.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:398-421` runs selective reindex for stale tracked files.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:272-287` stages persistence so failed writes leave files stale for retry.

## 3. TRIGGER / AUTO-FIRE PATH

Called by read handlers after the operator invokes a code graph tool. It is not a background watcher.

## 4. CLASS

half. Packet 013 classifies code graph freshness checks as half because selective repair happens after a read invocation, while full scans remain explicit.

## 5. CAVEATS / FALLBACK

Full-scan states are refused by query/context when inline full scans are disabled. The fallback is `code_graph_scan({ incremental:false })` or plain `rg` if readiness crashes.

## 6. CROSS-REFS

- [02-query-self-heal.md](./02-query-self-heal.md)
- [../02--manual-scan-verify-status/01-code-graph-scan.md](../02--manual-scan-verify-status/01-code-graph-scan.md)
- [../../manual_testing_playbook/01--read-path-freshness/001-ensure-ready-selective-reindex.md](../../manual_testing_playbook/01--read-path-freshness/001-ensure-ready-selective-reindex.md)


