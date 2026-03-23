---
title: "HyDE (Hypothetical Document Embeddings)"
description: "HyDE generates a short hypothetical document answering the query, embeds it, and uses the pseudo-document embedding as an additional retrieval channel for deep low-confidence queries, gated by the SPECKIT_HYDE flag."
---

# HyDE (Hypothetical Document Embeddings)

## 1. OVERVIEW

HyDE generates a short hypothetical document answering the query, embeds it, and uses the pseudo-document embedding as an additional retrieval channel for deep low-confidence queries, gated by the `SPECKIT_HYDE` flag.

When a search returns weak results, the problem is often a vocabulary mismatch between the query and the stored content. HyDE bridges this gap by asking an LLM to write a short document that would answer the question, then searching with that document's embedding instead of the query's. Since the hypothetical document uses the language of an answer rather than a question, it often matches stored content better. It is active by default (both `SPECKIT_HYDE` and `SPECKIT_HYDE_ACTIVE` are ON); set `SPECKIT_HYDE_ACTIVE=false` to revert to shadow mode where results are logged but not merged.

---

## 2. CURRENT REALITY

The HyDE module operates in two modes controlled by separate flags:
- `SPECKIT_HYDE` (default ON, graduated): generates pseudo-documents unless explicitly set to `false`
- `SPECKIT_HYDE_ACTIVE` (default ON, graduated): merges HyDE results unless explicitly set to `false`

HyDE only fires in deep mode with low-confidence baselines. Low confidence is detected when the maximum resolved score across the full baseline set is below `LOW_CONFIDENCE_THRESHOLD = 0.45` or the result set has fewer than `MIN_RESULTS_FOR_CONFIDENCE = 1` results, so callers do not need to pre-sort baseline rows.

Pseudo-documents are generated in `markdown-memory` format (matching corpus style) with a max of `MAX_HYDE_TOKENS = 200` tokens. LLM timeout is `HYDE_TIMEOUT_MS = 8000ms`. Results are cached via the shared LLM cache (module `llm-cache.ts`, same cache as LLM reformulation).

Budget: 1 LLM call per cache miss. Combined with reformulation: at most 2 total LLM calls per deep query. Set `SPECKIT_HYDE=false` to disable the feature entirely. In shadow mode (`SPECKIT_HYDE_ACTIVE=false`), results are logged but NOT merged. In active mode, results are merged into candidates. Debug logging available via `SPECKIT_HYDE_LOG=true`.

When HyDE candidates are returned in active mode, Stage 1 now subjects them to the same scope, tier, `contextType` and `qualityThreshold` filters used for main candidates before merge. Deep-mode HyDE hits no longer bypass those guardrails.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hyde.ts` | Lib | Pseudo-document generation, embedding, low-confidence detection, shadow/active mode |
| `mcp_server/lib/search/llm-cache.ts` | Lib | Shared LLM result cache |
| `mcp_server/lib/search/llm-reformulation.ts` | Lib | `normalizeQuery()` imported for cache key normalization |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isHyDEEnabled()` flag accessor |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1 integration: invokes HyDE in deep mode with low-confidence baseline |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/search-flags.vitest.ts` | Flag behavior for HyDE |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: HyDE (Hypothetical Document Embeddings)
- Current reality source: mcp_server/lib/search/hyde.ts module header and implementation
