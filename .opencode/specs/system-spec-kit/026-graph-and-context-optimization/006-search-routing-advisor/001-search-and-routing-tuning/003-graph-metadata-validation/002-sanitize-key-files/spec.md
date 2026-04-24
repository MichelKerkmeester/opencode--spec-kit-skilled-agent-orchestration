---
title: "...n/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files/spec]"
description: 'title: "Sanitize Key Files in Graph Metadata"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "002"
  - "sanitize"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
created: 2026-04-12
level: 2
parent: 003-graph-metadata-validation
status: complete
type: implementation
---
# Sanitize Key Files in Graph Metadata

## Scope

Add a validation pass that rejects shell commands, version tokens, bare titles, MIME types, and other non-path strings from `key_files` before storing them in graph metadata. Currently 40.13% of key_files entries point to non-existent files because the parser accepts arbitrary strings.

## Key Files

- `mcp_server/lib/graph/graph-metadata-parser.ts` (lines 463-471)

## Out of Scope

- Resolving relative paths to absolute paths.
- Cleaning up already-persisted bad entries (separate migration task).
