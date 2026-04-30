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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`detect_changes` maps unified diff hunks to structural symbols through line-range overlap. Its safety property is refusal: stale, empty, error, or failed-verification graphs produce `status:"blocked"` instead of false-safe empty impact.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual MCP analysis call. It passes `allowInlineIndex:false`, so it never silently indexes on the preflight path.

### Class

manual. It is an explicit preflight tool with no watcher or hook trigger.

### Caveats / Fallback

Run `code_graph_scan` first when blocked. Use plain diff review if the graph cannot be made fresh.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:1-12` | Handler | states the stale-graph hard-refuse invariant |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:241-260` | Handler | checks readiness before diff parsing and blocks stale state |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:265-368` | Handler | parses the diff and returns affected files/symbols |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:667-677` | Schema | defines the public schema |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Detect changes
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--detect-changes/01-detect-changes-preflight.md`

Related references:

- [../02--manual-scan-verify-status/01-code-graph-scan.md](../02--manual-scan-verify-status/01-code-graph-scan.md)
- [../../manual_testing_playbook/03--detect-changes/007-detect-changes-no-inline-index.md](../../manual_testing_playbook/03--detect-changes/007-detect-changes-no-inline-index.md)
<!-- /ANCHOR:source-metadata -->
