---
title: "MCP Server Formatters"
description: "Response formatting modules for MCP search payloads, token metrics and safe content shaping."
trigger_phrases:
  - "formatters"
  - "search result formatting"
  - "token metrics"
---

# MCP Server Formatters

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`formatters/` converts internal memory and search records into MCP response payloads. It owns result shaping, optional content embedding, anchor extraction output and token savings metrics.

Current responsibilities:

- Format raw search rows into stable MCP result envelopes.
- Estimate token use for tiered and anchor-filtered content.
- Apply path checks before file content is embedded in responses.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
MCP tools and handlers
        │
        ▼
formatSearchResults()
        │
        +--> path checks from core/config.ts and lib/utils/path-security.ts
        +--> anchor parsing from lib/parsing/memory-parser.ts
        +--> token estimates from token-metrics.ts
        +--> response envelopes from lib/response/envelope.ts
        │
        ▼
MCP-ready search response
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
formatters/
+-- index.ts             # Public formatter exports
+-- search-results.ts    # Search result envelope and content formatter
`-- token-metrics.ts     # Token estimation and tier metrics
```

Allowed direction:

- `index.ts` exports formatter APIs only.
- `search-results.ts` may import parser, response, search and path-security helpers.
- `token-metrics.ts` may import shared token estimation.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
formatters/
+-- README.md
+-- index.ts
+-- search-results.ts
`-- token-metrics.ts
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Re-exports formatter types and functions for MCP server callers. |
| `search-results.ts` | Builds formatted search results, content fields, trace fields, trust badges and response envelopes. |
| `token-metrics.ts` | Estimates token counts and computes HOT, WARM and excluded-result savings metrics. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 6. BOUNDARIES AND FLOW

Formatters should stay presentation-focused. They may normalize payload shape, attach metrics and guard content reads. They should not own database queries, search ranking or MCP tool registration.

Main flow:

```text
raw results -> normalize fields -> optional content read -> optional anchor filter -> token metrics -> MCP envelope
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/formatters/README.md
```

For code changes in this folder, also run the MCP server TypeScript checks defined by the package scripts.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- `../handlers/README.md`
- `../core/README.md`
- `../utils/README.md`

<!-- /ANCHOR:related -->
