---
title: "05. Ranking telemetry"
description: "Carries ranking signals and response-level dedup counts through query, daemon, MCP and CLI layers."
---

# 05. Ranking telemetry

Carries ranking signals and response-level dedup counts through query, daemon, MCP and CLI layers. Ranking telemetry makes retrieval behavior inspectable. Callers can see which signals affected score and how many aliases were removed.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Ranking telemetry makes retrieval behavior inspectable. Callers can see which signals affected score and how many aliases were removed.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Query results include `rankingSignals`, `raw_score`, `path_class`, `dedupedAliases` and `uniqueResultCount`. The daemon maps those fields into protocol results and the MCP server maps them again into Pydantic response models.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:21` | Query | Defines response-level query telemetry. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:260` | Daemon | Maps query telemetry into daemon search results. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:152` | MCP server | Maps daemon telemetry into MCP output. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:77` | Protocol | Covers search response with result fields. |
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:407` | Reference | Documents raw score and ranking signals. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Patches and extensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--patches-and-extensions/05-ranking-telemetry.md`

<!-- /ANCHOR:source-metadata -->
