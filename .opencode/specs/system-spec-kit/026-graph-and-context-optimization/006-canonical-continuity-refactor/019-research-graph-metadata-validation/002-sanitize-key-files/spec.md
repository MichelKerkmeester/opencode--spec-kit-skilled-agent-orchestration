---
title: "Sanitize Key Files in Graph Metadata"
status: complete
level: 2
type: implementation
parent: 019-research-graph-metadata-validation
created: 2026-04-12
---

# Sanitize Key Files in Graph Metadata

## Scope

Add a validation pass that rejects shell commands, version tokens, bare titles, MIME types, and other non-path strings from `key_files` before storing them in graph metadata. Currently 40.13% of key_files entries point to non-existent files because the parser accepts arbitrary strings.

## Key Files

- `mcp_server/lib/graph/graph-metadata-parser.ts` (lines 463-471)

## Out of Scope

- Resolving relative paths to absolute paths.
- Cleaning up already-persisted bad entries (separate migration task).
