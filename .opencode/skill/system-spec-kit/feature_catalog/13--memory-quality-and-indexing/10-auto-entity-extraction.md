---
title: "Auto entity extraction"
description: "Auto entity extraction runs five regex rules at save time to capture technology names, project identifiers and architectural concepts from memory content."
---

# Auto entity extraction

## 1. OVERVIEW

Auto entity extraction runs five regex rules at save time to capture technology names, project identifiers and architectural concepts from memory content.

Your notes mention tools, projects and concepts by name, but those names were never formally cataloged. This feature automatically spots those names when you save a memory and adds them to a shared catalog. Later, the system can use that catalog to connect memories that mention the same things, even if the surrounding text is completely different. It is like an automatic index at the back of a book that builds itself as you write.

---

## 2. CURRENT REALITY

Memory content contains implicit entities (technology names, architectural concepts, project identifiers) that are valuable for cross-document linking but were never explicitly captured. Manual entity tagging does not scale, and the system had zero entities in its catalog.

Auto entity extraction runs at save time using five pure-TypeScript regex rules with no external NLP dependencies. Rule 1 captures capitalized multi-word sequences (proper nouns like "Claude Code" or "Spec Kit Memory"). Rule 2 extracts technology names from code fence language annotations. Rule 3 identifies nouns following key phrases ("using", "with", "via", "implements"). Rule 4 pulls content from markdown headings. Rule 5 captures quoted strings.

Extracted entities pass through a denylist filter (`entity-denylist.ts`) containing 64 combined stop words across three categories: common nouns (29 words like "thing", "time", "example"), technology stop words (20 words like "api", "json", "npm") and generic modifiers (15 words like "new", "old", "simple"). Single-character entities and entities shorter than 2 characters are also filtered.

Deduplicated entities are stored in the `memory_entities` table with a UNIQUE constraint on `(memory_id, entity_text)`. The `entity_catalog` table maintains canonical names with Unicode-aware alias normalization (`/[^\p{L}\p{N}\s]/gu`, preserving letters and numbers from all scripts) and a `memory_count` field tracking how many memories reference each entity. An `edge_density` check (`totalEdges / totalMemories`) provides a diagnostic metric.

**Sprint 8 update:** Entity normalization was consolidated. Two divergent `normalizeEntityName` functions (ASCII-only in `entity-extractor.ts` vs Unicode-aware in `entity-linker.ts`) were unified into a single Unicode-aware version in `entity-linker.ts`. The `entity-extractor.ts` module now imports and re-exports this function. Similarly, a duplicate `computeEdgeDensity` function was consolidated into `entity-linker.ts`.

Entities are deliberately stored in a separate table rather than as causal edges. Mixing them into `causal_edges` would hit the `MAX_EDGES_PER_NODE=20` limit, distort N2 graph algorithms and pollute N3-lite consolidation. Runs behind the `SPECKIT_AUTO_ENTITIES` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Five regex extraction rules, entity dedup, `memory_entities` storage |
| `mcp_server/lib/extraction/entity-denylist.ts` | Lib | 64-word denylist filter (common nouns, tech stop words, generic modifiers) |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Canonical `normalizeEntityName()` (Unicode-aware) and `computeEdgeDensity()` |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | Extraction adapter coordinating entity extraction at save time |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isAutoEntitiesEnabled()` flag accessor (`SPECKIT_AUTO_ENTITIES`) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/entity-extractor.vitest.ts` | Entity extraction rule coverage |
| `mcp_server/tests/entity-linker.vitest.ts` | Entity linking and normalization tests |
| `mcp_server/tests/extraction-adapter.vitest.ts` | Extraction adapter tests |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Auto entity extraction
- Current reality source: FEATURE_CATALOG.md
