---
title: Ontology-Guided Extraction Hooks
flag: SPECKIT_ONTOLOGY_HOOKS
status: graduated
default: 'true'
category: 10--graph-signal-activation
since: Phase 009 (2026-04-01)
spec: 02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements
---

# Ontology-Guided Extraction Hooks

## Purpose
Enable schema-guided entity and relation extraction by providing a domain ontology that validates extracted entity types and relation pairs against allowed patterns.

## Implementation
- File: `mcp_server/lib/extraction/ontology-hooks.ts` (5.8KB)
- `OntologySchema` defines allowed `entityTypes`, `relationTypes`, and optional `extractionRules`
- `loadOntologySchema()` loads schema from an explicit JSON file path or `SPECKIT_ONTOLOGY_SCHEMA`, then normalizes to lowercase
- `validateExtraction()` checks entity and relation pairs case-insensitively and enforces optional rule pairs when present
- No LLM calls - pure schema validation with default-schema fallback

## Feature Flag
- Name: `SPECKIT_ONTOLOGY_HOOKS`
- Default: ON (graduated)
- Set `SPECKIT_ONTOLOGY_HOOKS=false` to disable

## Related
- `17-temporal-edges.md` - temporal validity management
- `18-contradiction-detection.md` - edge conflict detection
