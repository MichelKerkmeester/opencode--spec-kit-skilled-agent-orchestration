# Causal edge deletion (memory_causal_unlink)

## Current Reality

Removes a single causal relationship edge by its numeric edge ID. You get edge IDs from `memory_drift_why` traversal results (a T202 enhancement that added edge IDs to the response specifically to enable this workflow).

A library-level variant, `deleteEdgesForMemory()`, removes all edges referencing a given memory ID. This variant is called automatically during memory deletion (`memory_delete`) to maintain graph integrity. You do not need to manually clean up edges when deleting a memory. The system handles it.

## Source Metadata

- Group: Analysis
- Source feature title: Causal edge deletion (memory_causal_unlink)
- Summary match found: No
- Current reality source: feature_catalog.md
