# Spec folder description discovery

## Current Reality

A cached one-sentence description per spec folder (derived from spec.md) is stored in a `descriptions.json` file. The `memory_context` orchestration layer checks these descriptions before issuing vector queries.

If the target folder can be identified from the description alone, the system skips full-corpus search entirely. This is a lightweight routing optimization that reduces unnecessary computation for scoped queries where the user already has a specific folder in mind. Runs behind the `SPECKIT_FOLDER_DISCOVERY` flag (default ON).

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Spec folder description discovery
- Summary match found: Yes
- Summary source feature title: Spec folder description discovery
- Current reality source: feature_catalog.md
