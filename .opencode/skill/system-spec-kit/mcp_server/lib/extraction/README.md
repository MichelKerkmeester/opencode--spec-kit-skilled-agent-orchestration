---
title: "Extraction"
description: "Post-tool extraction pipeline for automated memory creation. Resolves memory IDs, orchestrates extraction, and gates PII/secret content before insert."
trigger_phrases:
  - "extraction pipeline"
  - "extraction adapter"
  - "redaction gate"
---

# Extraction

> Post-tool extraction pipeline for automated memory creation. Resolves memory IDs, orchestrates extraction, and gates PII/secret content before insert.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The extraction module provides the post-tool extraction pipeline for automated memory creation. It handles two distinct concerns: orchestrating extraction with deterministic memory ID resolution (`extraction-adapter.ts`) and blocking PII or secret content before it reaches the memory insert path (`redaction-gate.ts`).

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 5 | `extraction-adapter.ts`, `redaction-gate.ts`, `entity-extractor.ts`, `entity-denylist.ts`, `ontology-hooks.ts` |

### Key Features

| Feature | Description |
|---------|-------------|
| **Memory ID Resolution** | Deterministic ID fallback ensures stable identity across extraction runs |
| **Post-Tool Orchestration** | Extraction adapter coordinates the full pipeline from tool output to memory insert |
| **PII Detection** | Pattern-based scanning for personal identifiers before memory insert |
| **Secret Detection** | Pattern-based scanning for API keys, tokens, and credentials |
| **Redaction Gate** | Hard gate: content flagged by pattern detection is blocked from insert |
| **Auto Entity Extraction (R10)** | Rule-based extraction of proper nouns, technology names, key phrases, headings, and quoted strings from memory content |
| **Entity Denylist** | Filters common nouns, technology stop words, and generic modifiers from entity extraction results |
| **Ontology Hooks** | Schema-guided extraction validation: loads OntologySchema (entity types + relation types) and validates entity/relation pairs against allowed lists. Gated by `SPECKIT_ONTOLOGY_HOOKS` |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
extraction/
 extraction-adapter.ts    # Post-tool extraction orchestration with deterministic memory ID resolution
 redaction-gate.ts        # PII/secret redaction gate before memory insert
 entity-extractor.ts      # Rule-based entity extraction from memory content (R10)
 entity-denylist.ts       # Common noun and stop word filtering for entity extraction (R10)
 ontology-hooks.ts        # Schema-guided extraction validation (SPECKIT_ONTOLOGY_HOOKS)
 README.md                # This file
```

### Key Files

| File | Purpose | Flag |
|------|---------|------|
| `extraction-adapter.ts` | Resolves memory IDs with deterministic fallback; orchestrates post-tool extraction pipeline | — |
| `redaction-gate.ts` | Scans content for PII and secrets using pattern-based detection; blocks flagged content from insert | — |
| `entity-extractor.ts` | Pure-TS rule-based entity extraction: proper nouns, technology names, key phrases, headings, quoted strings (R10) | — |
| `entity-denylist.ts` | Denylist of common nouns, technology stop words, and generic modifiers filtered from extraction results (R10) | — |
| `ontology-hooks.ts` | Loads `OntologySchema` (entity types + relation types), validates entity/relation pairs against schema. Default schema provides 6 canonical relations and 10 entity types. | `SPECKIT_ONTOLOGY_HOOKS` |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Extraction Adapter (`extraction-adapter.ts`)

**Purpose**: Coordinate the post-tool extraction pipeline from tool result to memory insert.

| Aspect | Details |
|--------|---------|
| **Memory ID Resolution** | Resolves a stable `memory_id` from tool output; falls back to deterministic hash if none provided |
| **Pipeline Orchestration** | Sequences: ID resolution -> content prep -> redaction gate -> memory insert |
| **Deterministic Fallback** | Hash-based ID generation ensures idempotent re-runs produce the same ID |

### Redaction Gate (`redaction-gate.ts`)

**Purpose**: Block PII and secret content before it enters the memory store.

| Aspect | Details |
|--------|---------|
| **PII Patterns** | Email addresses, phone numbers, national IDs, full names in structured fields |
| **Secret Patterns** | API keys, bearer tokens, private keys, connection strings, `.env`-style assignments |
| **Gate Behaviour** | Returns `{ allowed: boolean, reasons: string[] }` — content is blocked if `allowed === false` |
| **Pattern Source** | Regex-based, inline pattern list (no external dependency) |

### Entity Extractor (`entity-extractor.ts`) — R10

**Purpose**: Extract named entities from memory content using pure-TS rule-based extraction (zero npm dependencies). Gated via `SPECKIT_AUTO_ENTITIES`.

| Aspect | Details |
|--------|---------|
| **Extraction Rules** | 5 rules applied in order: capitalized multi-word sequences (proper_noun), code fence annotations (technology), words after key phrases (key_phrase), markdown headings (heading), quoted strings (quoted) |
| **Deduplication** | Results deduplicated by normalized text with summed frequencies |
| **Denylist Filtering** | `filterEntities()` removes common nouns and stop words via `entity-denylist.ts` |
| **Persistence** | `storeEntities()` writes extracted entities to the `memory_entities` table |
| **Catalog Update** | `updateEntityCatalog()` maintains canonical entity names for cross-document linking |
| **Edge Density Check** | `computeEdgeDensity()` returns the ratio of causal edges to total memories |

**Key exports:**

| Export | Signature | Description |
|--------|-----------|-------------|
| `extractEntities` | `(content: string) => ExtractedEntity[]` | Extract entities from raw text |
| `filterEntities` | `(entities: ExtractedEntity[]) => ExtractedEntity[]` | Remove denied entities |
| `storeEntities` | `(db, memoryId, entities) => void` | Persist entities to database |
| `updateEntityCatalog` | `(db, memoryId, entities, specFolder) => void` | Update canonical entity catalog |
| `computeEdgeDensity` | `(db) => number` | Calculate edge-to-memory ratio |

### Entity Denylist (`entity-denylist.ts`) — R10

**Purpose**: Provide a curated denylist of terms that should be filtered from entity extraction results.

| Aspect | Details |
|--------|---------|
| **Common Nouns** | High-frequency English nouns with low entity signal (e.g., "thing", "system", "work") |
| **Technology Stop Words** | Generic tech abbreviations too broad for entity names (e.g., "api", "sdk", "json") |
| **Generic Modifiers** | Adjectives/determiners with no entity-level meaning (e.g., "new", "main", "basic") |
| **Matching** | Case-insensitive via `isEntityDenied(term)` |

**Key exports:**

| Export | Signature | Description |
|--------|-----------|-------------|
| `ENTITY_DENYLIST` | `Set<string>` | Combined set of all denied terms |
| `isEntityDenied` | `(term: string) => boolean` | Check if a term is denied (case-insensitive) |
| `getEntityDenylistSize` | `() => number` | Return total denylist size |

**Gate result shape:**

| Field | Type | Description |
|-------|------|-------------|
| `allowed` | `boolean` | `true` if content passed all checks, `false` if blocked |
| `reasons` | `string[]` | Human-readable list of matched patterns that triggered a block |

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Run the Redaction Gate Before Insert

```typescript
import { checkRedactionGate } from './redaction-gate';

const content = 'User token: sk-abc123xyz, email: user@example.com';

const result = checkRedactionGate(content);

if (!result.allowed) {
  console.warn('Content blocked before memory insert:', result.reasons);
  // Content blocked before memory insert: ['API key pattern matched', 'Email address detected']
} else {
  // Proceed to memory insert
}
```

### Example 2: Resolve a Memory ID with Deterministic Fallback

```typescript
import { resolveMemoryId } from './extraction-adapter';

// Tool output may or may not include an explicit memory_id
const toolOutput = { content: 'session summary text', memory_id: undefined };

const memoryId = resolveMemoryId(toolOutput);
// Falls back to deterministic hash of content if memory_id is absent
console.log(`Resolved ID: ${memoryId}`);
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Gate before insert | `checkRedactionGate(content)` | All automated extraction paths |
| Resolve ID | `resolveMemoryId(toolOutput)` | Before any write to memory store |
| Log block reasons | `result.reasons.join(', ')` | Observability / audit logging |

<!-- /ANCHOR:usage-examples -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

### Feature Flags

| Environment Variable      | Default | Purpose                                                                 |
|---------------------------|---------|-------------------------------------------------------------------------|
| `SPECKIT_EXTRACTION`      | false   | Enable the post-tool extraction pipeline for automated memory creation. When `false`, extraction is disabled and tool outputs are not automatically processed into memories. |
| `SPECKIT_REDACTION_GATE`  | true    | Enable the PII/secret redaction gate before memory insert. When `true`, all content passes through pattern-based PII and secret detection before reaching the memory store. Set to `false` only in trusted environments where redaction overhead is unnecessary. |
| `SPECKIT_AUTO_ENTITIES`   | true    | Enable auto entity extraction (R10). When `true`, entities are extracted from memory content at save time using rule-based extraction and stored in the `memory_entities` table. Required by entity linking (S5). |

<!-- /ANCHOR:configuration -->

---

## 6. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [lib/contracts/README.md](../contracts/README.md) | Retrieval pipeline contracts |
| [lib/storage/README.md](../storage/README.md) | Storage layer (memory insert, transactions) |

### Related Modules

| Module | Purpose |
|--------|---------|
| `handlers/memory-save.ts` | Downstream consumer after extraction gate passes |
| `hooks/memory-surface.ts` | Triggers extraction pipeline post-tool |
| `lib/search/entity-linker.ts` | Cross-document entity linking (S5), consumes entities extracted by R10 |
| `lib/graph/` | Graph signals (N2) and community detection, consume entity and causal edge data |

<!-- /ANCHOR:related -->

---

**Version**: 1.8.0
**Last Updated**: 2026-02-28
