---
title: "LLM query reformulation"
description: "Corpus-grounded LLM query reformulation applies step-back abstraction combined with real corpus seed grounding to produce enriched query variants in deep mode, gated by the SPECKIT_LLM_REFORMULATION flag."
---

# LLM query reformulation

## 1. OVERVIEW

Corpus-grounded LLM query reformulation applies step-back abstraction combined with real corpus seed grounding to produce enriched query variants in deep mode, gated by the `SPECKIT_LLM_REFORMULATION` flag.

Sometimes a user's query is too specific or uses different vocabulary than what is stored. This feature rewrites the query using an LLM, but grounds it in actual corpus content first to prevent hallucination. It retrieves a few real results via cheap keyword search, feeds them to the LLM alongside the query, and asks for a step-back abstraction plus a couple of alternative phrasings. The result is better recall without making up terms that do not exist in the data.

---

## 2. CURRENT REALITY

The reformulation module performs a two-step process: (1) cheap seed retrieval via FTS5/BM25 keyword search (no embedding call, up to `SEED_LIMIT = 3` results) to ground the prompt in real corpus content, then (2) a single LLM call to produce a step-back abstraction and up to `MAX_VARIANTS = 2` corpus-grounded query variants. Timeout is `REFORMULATION_TIMEOUT_MS = 8000ms`. Output strings shorter than `MIN_OUTPUT_LENGTH = 5` characters are rejected.

LLM results are cached via a shared LLM result cache (key: normalized query + mode, TTL 1 hour) imported from `llm-cache.ts`, also shared with the HyDE module. Budget: at most 1 LLM call per reformulation. Combined with HyDE: at most 2 total LLM calls per deep query.

Only fires in deep mode (checked by the caller in `stage1-candidate-gen.ts`). Enabled by default (graduated). Set `SPECKIT_LLM_REFORMULATION=false` to disable. Fail-open: seed retrieval returns an empty array on error so the caller can proceed without grounding.

After reformulated variants run through retrieval, Stage 1 now reapplies the same candidate guardrails used for the main result set before merge: scope filtering when enforcement is active, tier filtering, `contextType` filtering and `qualityThreshold` filtering. Deep-mode reformulation hits no longer bypass post-scope context or quality gates.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/llm-reformulation.ts` | Lib | Seed retrieval, LLM reformulation, step-back abstraction, variant generation |
| `mcp_server/lib/search/llm-cache.ts` | Lib | Shared LLM result cache (used by both reformulation and HyDE) |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | FTS5/BM25 keyword search for seed retrieval |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isLlmReformulationEnabled()` flag accessor |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1 integration: invokes reformulation in deep mode |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/search-flags.vitest.ts` | Flag behavior for LLM reformulation |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: LLM query reformulation
- Current reality source: mcp_server/lib/search/llm-reformulation.ts module header and implementation
