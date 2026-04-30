---
title: Ontology-Guided Extraction Hooks
description: "Catalog reference for Ontology-Guided Extraction Hooks."
flag: SPECKIT_ONTOLOGY_HOOKS
status: graduated
default: 'true'
category: 10--graph-signal-activation
---

# Ontology-Guided Extraction Hooks

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Enable schema-guided entity and relation extraction by providing a domain ontology that validates extracted entity types and relation pairs against allowed patterns.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

- File: `mcp_server/lib/extraction/ontology-hooks.ts` (5.8KB)
- `OntologySchema` defines allowed `entityTypes`, `relationTypes`, and optional `extractionRules`
- `loadOntologySchema()` loads schema from an explicit JSON file path or `SPECKIT_ONTOLOGY_SCHEMA`, then normalizes to lowercase
- `validateExtraction()` checks entity and relation pairs case-insensitively and enforces optional rule pairs when present
- No LLM calls - pure schema validation with default-schema fallback
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

No source files are listed yet.
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA
- Group: Graph Signal Activation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `10--graph-signal-activation/19-ontology-hooks.md`

### Feature Flag

- Name: `SPECKIT_ONTOLOGY_HOOKS`
- Default: ON (graduated)
- Set `SPECKIT_ONTOLOGY_HOOKS=false` to disable

### Related

- `17-temporal-edges.md` - temporal validity management
- `18-contradiction-detection.md` - edge conflict detection
<!-- /ANCHOR:source-metadata -->
