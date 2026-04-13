---
title: "Sanitize Key Files in Graph Metadata - Tasks"
status: planned
---
# Tasks
- [ ] T-01: Add the exact `KEY_FILE_NOISE_RE`, `BARE_FILE_RE`, and canonical packet-doc allowlist near `mcp_server/lib/graph/graph-metadata-parser.ts:318-334`, following `../research/research.md:245-255`.
- [ ] T-02: Filter `referenced` and `fallbackRefs` before the merge in `mcp_server/lib/graph/graph-metadata-parser.ts:463-470`.
- [ ] T-03: Append `docs.map((doc) => doc.relativePath)` after filtering so canonical docs survive even when other references are rejected, per `../research/research.md:267-270,355-358`.
- [ ] T-04: Add or update integration coverage for command-shaped strings, version tokens, MIME-like values, `_memory.continuity`, colon-delimited pseudo-fields, and bare non-canonical filenames.
- [ ] T-05: Re-run corpus verification and record whether the filtered result tracks the wave-3 `1498 / 2207` removal shape from `../research/research.md:258-265`.
## Verification
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
