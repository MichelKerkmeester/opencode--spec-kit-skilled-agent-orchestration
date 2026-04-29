---
title: "detect_changes preflight"
description: "Read-only diff preflight that maps unified-diff hunks to indexed symbols and refuses stale or unverifiable graph state."
trigger_phrases:
  - "detect_changes"
  - "code_graph runtime catalog"
  - "detect_changes preflight"
importance_tier: "important"
---
# detect_changes preflight

## 1. OVERVIEW

`detect_changes` maps unified diff hunks to structural symbols through line-range overlap. Its safety property is refusal: stale, empty, error, or failed-verification graphs produce `status:"blocked"` instead of false-safe empty impact.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:1-12` states the stale-graph hard-refuse invariant.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:241-260` checks readiness before diff parsing and blocks stale state.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:265-368` parses the diff and returns affected files/symbols.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:667-677` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Manual MCP analysis call. It passes `allowInlineIndex:false`, so it never silently indexes on the preflight path.

## 4. CLASS

manual. It is an explicit preflight tool with no watcher or hook trigger.

## 5. CAVEATS / FALLBACK

Run `code_graph_scan` first when blocked. Use plain diff review if the graph cannot be made fresh.

## 6. CROSS-REFS

- [../02--manual-scan-verify-status/01-code-graph-scan.md](../02--manual-scan-verify-status/01-code-graph-scan.md)
- [../../manual_testing_playbook/03--detect-changes/007-detect-changes-no-inline-index.md](../../manual_testing_playbook/03--detect-changes/007-detect-changes-no-inline-index.md)


