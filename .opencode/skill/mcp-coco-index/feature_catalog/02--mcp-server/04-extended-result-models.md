---
title: "04. Extended result models"
description: "Returns fork-specific dedup, raw score, path class and ranking telemetry fields."
---

# 04. Extended result models

Returns fork-specific dedup, raw score, path class and ranking telemetry fields. The MCP result model carries the fork telemetry needed to debug retrieval quality. It includes both row-level and response-level fields.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The MCP result model carries the fork telemetry needed to debug retrieval quality. It includes both row-level and response-level fields.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Each chunk includes `raw_score`, `path_class` and `rankingSignals`. The response includes `dedupedAliases` and `uniqueResultCount`, matching the CLI output shape added by the fork.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:42` | MCP model | Defines chunk result fields. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:59` | MCP model | Defines response-level telemetry. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:152` | MCP server | Maps daemon response fields into MCP models. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:77` | Protocol | Covers search responses with results. |
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:384` | Reference | Documents fork-specific telemetry fields. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP server
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mcp-server/04-extended-result-models.md`

<!-- /ANCHOR:source-metadata -->
