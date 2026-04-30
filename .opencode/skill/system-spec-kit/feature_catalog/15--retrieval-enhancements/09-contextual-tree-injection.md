---
title: "Contextual tree injection"
description: "Contextual tree injection prefixes returned chunks with hierarchical context headers using cached spec folder descriptions."
---

# Contextual tree injection

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Contextual tree injection prefixes returned chunks with hierarchical context headers using cached spec folder descriptions.

When search results come back, each piece of information now carries a short label showing where it belongs in the project, like "Project > Feature > Detail." Without this, you would see raw content with no clue about its context. It is like seeing a chapter heading at the top of a photocopied page so you know which part of the book it came from.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Injects contextual headers after Stage 4 truncation and builds the cached tail-description map |
| `mcp_server/lib/search/search-flags.ts` | Lib | Exposes the `SPECKIT_CONTEXT_HEADERS` runtime gate |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Context header injection |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `15--retrieval-enhancements/09-contextual-tree-injection.md`

### MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `145` | Direct manual validation for enabled/disabled contextual header injection behavior |

<!-- /ANCHOR:source-metadata -->
