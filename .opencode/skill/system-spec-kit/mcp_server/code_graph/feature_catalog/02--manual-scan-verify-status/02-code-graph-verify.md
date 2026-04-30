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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`code_graph_verify` runs the gold-query battery against the current graph. It is a diagnostic verification gate, not a repair path.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual MCP maintenance call, or optional verification inside an explicit full `code_graph_scan`.

### Class

manual. `code_graph_scan / verify` has conditional local/native coverage, not ambient automation.

### Caveats / Fallback

The handler refuses stale graphs. Run `code_graph_scan({ incremental:false })` before verification when blocked.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:141-190` | Handler | resolves paths, checks readiness, blocks when not fresh, and runs the battery |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:23-26` | Library | defines the default battery path |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:405-430` | Library | loads and validates the battery JSON |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:645-664` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/02--manual-scan-verify-status/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Manual scan verify status
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--manual-scan-verify-status/02-code-graph-verify.md`

Related references:

- [01-code-graph-scan.md](./01-code-graph-scan.md)
- [../08--doctor-code-graph/01-doctor-apply-mode.md](../08--doctor-code-graph/01-doctor-apply-mode.md)
- [../../manual_testing_playbook/02--manual-scan-verify-status/005-code-graph-verify-blocked-on-stale.md](../../manual_testing_playbook/02--manual-scan-verify-status/005-code-graph-verify-blocked-on-stale.md)
<!-- /ANCHOR:source-metadata -->
