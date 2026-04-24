---
title: ".../006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files/tasks]"
description: 'title: "Sanitize Key Files in Graph Metadata - Tasks"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "tasks"
  - "002"
  - "sanitize"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
status: complete
---
# Tasks
- [x] T-01: Add `KEY_FILE_NOISE_RE`, `BARE_FILE_RE`, canonical packet-doc matching, and the title-like guard near `extractReferencedFilePaths()` in `mcp_server/lib/graph/graph-metadata-parser.ts`.
- [x] T-02: Filter `referenced` and `fallbackRefs` before the merge in `deriveKeyFiles()` so noisy candidates never compete for the 20-slot cap.
- [x] T-03: Append `docs.map((doc) => doc.relativePath)` after filtering so canonical docs still survive even when other references are rejected.
- [x] T-04: Add focused predicate coverage for command-shaped strings, version tokens, MIME-like values, `_memory.continuity`, colon-delimited pseudo-fields, relative paths, and bare non-canonical filenames in `mcp_server/tests/graph-metadata-schema.vitest.ts`.
- [x] T-05: Re-run focused verification before the final corpus backfill so the sanitized predicate is exercised under typecheck and test coverage.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
