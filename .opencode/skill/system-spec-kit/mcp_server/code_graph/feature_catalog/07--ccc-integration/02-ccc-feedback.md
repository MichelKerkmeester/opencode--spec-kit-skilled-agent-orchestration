---
title: "ccc_feedback"
description: "Manual CocoIndex bridge tool that appends search feedback JSONL for future analysis."
trigger_phrases:
  - "ccc_feedback"
  - "code_graph runtime catalog"
  - "ccc_feedback"
importance_tier: "important"
---

# ccc_feedback

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`ccc_feedback` records operator feedback for CocoIndex search results.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only. No hook, CI, session bootstrap, or memory command path invokes feedback automatically.

### Class

manual, copied from the current reality map.

### Caveats / Fallback

Feedback writes under `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl`. It does not alter ranking immediately.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:29-60` | Handler | validates query/rating, creates the feedback directory, and appends JSONL |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:91-96` | Tool surface | validates required fields before dispatch |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741-753` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/07--ccc-integration/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CCC integration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--ccc-integration/02-ccc-feedback.md`

Related references:

- [01-ccc-reindex.md](./01-ccc-reindex.md)
- [03-ccc-status.md](./03-ccc-status.md)
<!-- /ANCHOR:source-metadata -->
