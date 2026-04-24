# Iteration 004 - Maintainability

## Scope

Reviewed stored metadata shape, key-file display paths, and future readability of the packet's generated metadata.

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| DR-MNT-001 | P2 | Stored `key_files` use duplicate display paths for the same implementation files. The parser and test file each appear once as a repo-relative `.opencode/...` path and once as a workspace-relative `mcp_server/...` path, consuming slots and making downstream resolution rules harder to reason about. | `graph-metadata.json:35`, `graph-metadata.json:36`, `graph-metadata.json:40`, `graph-metadata.json:43` |

## Notes

This does not block the feature, but canonicalizing stored display paths would reduce ambiguity and make the 20-slot cap more meaningful.

## Convergence

New findings ratio: `0.25`. Continue.
