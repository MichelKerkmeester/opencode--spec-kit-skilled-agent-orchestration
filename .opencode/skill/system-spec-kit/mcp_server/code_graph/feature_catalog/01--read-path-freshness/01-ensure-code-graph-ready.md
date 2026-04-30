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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`ensureCodeGraphReady()` is the read-path gate used by query, context, and verification surfaces. It detects graph readiness without a watcher, cleans deleted tracked files, and performs the minimum allowed inline repair.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Called by read handlers after the operator invokes a code graph tool. It is not a background watcher.

### Class

half. Code graph freshness checks are half-auto because selective repair happens after a read invocation, while full scans remain explicit.

### Caveats / Fallback

Full-scan states are refused by query/context when inline full scans are disabled. The fallback is `code_graph_scan({ incremental:false })` or plain `rg` if readiness crashes.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:141-225` | Library | detects empty, stale, full-scan, and selective-reindex states |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-375` | Library | debounces checks and blocks inline repair when callers disallow it |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:398-421` | Library | runs selective reindex for stale tracked files |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:272-287` | Library | stages persistence so failed writes leave files stale for retry |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/01--read-path-freshness/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Read path freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--read-path-freshness/01-ensure-code-graph-ready.md`

Related references:

- [02-query-self-heal.md](./02-query-self-heal.md)
- [../02--manual-scan-verify-status/01-code-graph-scan.md](../02--manual-scan-verify-status/01-code-graph-scan.md)
- [../../manual_testing_playbook/01--read-path-freshness/001-ensure-ready-selective-reindex.md](../../manual_testing_playbook/01--read-path-freshness/001-ensure-ready-selective-reindex.md)
<!-- /ANCHOR:source-metadata -->
