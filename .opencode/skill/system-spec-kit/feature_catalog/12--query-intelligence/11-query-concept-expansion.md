---
title: "Query concept expansion"
description: "D2 concept routing expands queries with alias terms from entity-linker via getConceptExpansionTerms(), broadening recall for queries that use synonyms or abbreviations, gated by the SPECKIT_QUERY_CONCEPT_EXPANSION flag."
---

# Query concept expansion

## 1. OVERVIEW

D2 concept routing expands queries with alias terms from entity-linker via `getConceptExpansionTerms()`, broadening recall for queries that use synonyms or abbreviations. When a query mentions a known concept, the entity-linker resolves it to a canonical node and returns its alias terms, which are appended to the candidate generation query to capture memories indexed under variant names.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_QUERY_CONCEPT_EXPANSION=false` to disable.

The entity-linker's `getConceptExpansionTerms()` function resolves query tokens against the concept graph and returns alias terms for matched entities. Stage 1 candidate generation appends these expansion terms to the search query before dispatching to retrieval channels. This increases recall without requiring exact keyword matches between queries and indexed content.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/entity-linker.ts` | Lib | Concept resolution and alias term expansion via `getConceptExpansionTerms()` |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1 candidate generation consuming expansion terms |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/concept-extraction.vitest.ts` | Concept extraction and expansion term resolution |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Query concept expansion
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_QUERY_CONCEPT_EXPANSION=false
