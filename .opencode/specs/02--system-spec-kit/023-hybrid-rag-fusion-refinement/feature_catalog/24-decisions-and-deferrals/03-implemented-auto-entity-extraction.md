# Implemented: auto entity extraction

## Current Reality

Originally deferred at Sprint 6b pending a feasibility spike alongside N2. Rule-based heuristics would extract entities from memory content, gated on edge density.

**Now implemented.** Five regex extraction rules with a 64-word denylist, stored in a dedicated `memory_entities` table (not causal_edges) with an `entity_catalog` for canonical name resolution. Runs at save time behind `SPECKIT_AUTO_ENTITIES` (default ON). Schema migration v20 added `memory_entities` and `entity_catalog` tables. Zero external NLP dependencies. See [Auto entity extraction](#auto-entity-extraction) for the full description. Unblocks S5 (cross-document entity linking).

## Source Metadata

- Group: Decisions and deferrals
- Source feature title: Implemented: auto entity extraction
- Current reality source: feature_catalog.md
