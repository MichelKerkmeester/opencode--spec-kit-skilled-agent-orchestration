---
title: "Extraction"
description: "Post-tool extraction, redaction, entity extraction, and ontology checks for memory creation."
trigger_phrases:
  - "extraction pipeline"
  - "extraction adapter"
  - "redaction gate"
---

# Extraction

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DATA FLOW](#2--data-flow)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/extraction/` turns selected tool output into memory-adjacent signals. It resolves target memory IDs, summarizes matched output, applies redaction, extracts entities, and optionally checks entity or relation pairs against an ontology schema.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:data-flow -->
## 2. DATA FLOW

```text
tool result
  -> stringifyToolResult()
  -> matchRule()
  -> summarize matched content
  -> applyRedactionGate()
  -> resolveMemoryIdFromText()
  -> insert working-memory attention or extracted record data
  -> optional entity and ontology checks
```

The extraction adapter fails closed when it cannot resolve a valid memory ID. Redaction runs before extracted content can reach downstream insert paths.

<!-- /ANCHOR:data-flow -->
<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Purpose |
|---|---|
| `extraction-adapter.ts` | Matches tool output, summarizes content, resolves memory IDs, and records attention signals |
| `redaction-gate.ts` | Redacts API keys, bearer tokens, private keys, email addresses, JWTs, and high-entropy values |
| `entity-extractor.ts` | Extracts, filters, stores, and rebuilds rule-based memory entities |
| `entity-denylist.ts` | Filters low-signal entity terms |
| `ontology-hooks.ts` | Loads schema data and validates entity or relation pairs when enabled |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

This module prepares extraction data and safety checks. It does not own canonical memory saves, response envelopes, search ranking, or graph traversal.

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `initExtractionAdapter()` | Connect extraction to the after-tool hook and database handle |
| `getExtractionMetrics()` | Read matched, inserted, skipped, and redacted counters |
| `resetExtractionMetrics()` | Reset extraction counters in tests or diagnostics |
| `applyRedactionGate()` | Redact sensitive text and report matched categories |
| `extractEntities()` | Extract rule-based entities from text |
| `filterEntities()` | Remove denied or low-signal entities |
| `storeEntities()` | Persist extracted entities for a memory record |
| `updateEntityCatalog()` | Refresh canonical entity catalog rows |
| `loadOntologySchema()` | Load the default or configured ontology schema |
| `validateExtraction()` | Check an entity and relation pair against the schema |

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation -->
## 6. VALIDATION

- Extraction rules reject unsafe regex patterns at startup.
- Redaction skips known-safe 40-character Git SHAs and UUIDs while still redacting high-entropy secrets.
- Memory ID resolution checks the database before returning an ID.
- Entity extraction deduplicates by normalized name and filters denylisted terms.
- Ontology hooks fail open when disabled and validate against configured allowed types when enabled.

<!-- /ANCHOR:validation -->
<!-- ANCHOR:related -->
## 7. RELATED

- `../cognitive/README.md`
- `../search/README.md`
- `../storage/README.md`
- `../../context-server.ts`

<!-- /ANCHOR:related -->
