---
title: "Provenance-rich response envelopes"
description: "Provenance-rich response envelopes expose internal pipeline scoring and retrieval trace data in search results when `includeTrace` is enabled."
---

# Provenance-rich response envelopes

## 1. OVERVIEW

Provenance-rich response envelopes expose internal pipeline scoring and retrieval trace data in search results when `includeTrace` is enabled.

When you search for something, the system normally just gives you the answer. With this feature turned on, it also shows you how it found the answer: which search methods it used, how it scored each result and where the information came from. It is like getting a receipt with your purchase that shows every step of the transaction.

---

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState) and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/search-results.ts` | Formatter | Defines `MemoryResultEnvelope` and conditionally adds `scores`, `source` and `trace` when `includeTrace` is enabled. |
| `mcp_server/handlers/memory-search.ts` | Handler | Resolves effective `includeTrace` (`SPECKIT_RESPONSE_TRACE` flag or request arg) and forwards it to response formatting. |
| `mcp_server/handlers/memory-context.ts` | Handler | Forwards `includeTrace` through internal `memory_search` calls so context responses can include provenance. |
| `mcp_server/lib/response/envelope.ts` | Lib | Builds and wraps the canonical MCP response envelope (`summary`, `data`, `hints`, `meta`) that carries formatted provenance payloads. |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Admits `includeTrace` for `memory_search` and `memory_context` input validation. |
| `mcp_server/tool-schemas.ts` | Schema | Documents `includeTrace` in published tool JSON schemas. |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/search-results-format.vitest.ts` | Formatter-level validation for trace channels, query complexity fallback and envelope payload shaping. |
| `mcp_server/tests/mcp-response-envelope.vitest.ts` | Protocol-level MCP envelope validation with `includeTrace` on/off provenance assertions. |
| `mcp_server/tests/envelope.vitest.ts` | Core response envelope contract validation (`content[]`, `meta` and wrapper behavior). |

---

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Provenance-rich response envelopes
- Current reality source: FEATURE_CATALOG.md
