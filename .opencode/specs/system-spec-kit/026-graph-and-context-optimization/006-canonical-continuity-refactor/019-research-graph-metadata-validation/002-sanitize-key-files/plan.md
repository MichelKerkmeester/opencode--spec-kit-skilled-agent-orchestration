---
title: "Sanitize Key Files in Graph Metadata - Execution Plan"
status: planned
parent_spec: 002-sanitize-key-files/spec.md
---
# Execution Plan
## Approach
This phase adds an explicit key-file predicate before `deriveKeyFiles()` normalizes and truncates values. The research already converged on the exact shape: reject command-like strings, version tokens, MIME-like values, `_memory.continuity`, colon-delimited pseudo-fields, and non-canonical bare filenames unless they are part of the packet-doc allowlist.

The implementation should filter `referenced` and `fallbackRefs`, then append canonical packet docs after filtering so the real packet files always survive. This is a sanitization phase, not a path-resolution or cleanup-migration phase.

## Steps
1. Add `KEY_FILE_NOISE_RE`, `BARE_FILE_RE`, and the canonical packet-doc allowlist near `mcp_server/lib/graph/graph-metadata-parser.ts:318-334`, using the exact predicate from `../research/research.md:241-270,355-358`.
2. Filter the `referenced` and `fallbackRefs` streams before the merge in `mcp_server/lib/graph/graph-metadata-parser.ts:463-470`, then append `docs.map((doc) => doc.relativePath)` after filtering so canonical packet docs always survive.
3. Keep `normalizeUnique(...).slice(0, 20)` unchanged after the predicate runs, because the research froze that as the final shape in `../research/research.md:267-270`.
4. Add integration coverage for command tokens, version tokens, MIME-like tokens, bare non-canonical filenames, and allowed canonical docs, then confirm the post-regeneration behavior matches the stronger `1498 / 2207` wave-3 result from `../research/research.md:258-265`.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`.
- Re-run the packet's corpus verification and confirm canonical packet docs still appear in `key_files` while junk tokens are removed before truncation.

## Risks
- Filtering after the merge would still let junk values compete with canonical docs for the 20-slot limit.
- Using the older `1489 / 2195` headline instead of the frozen predicate could cause unnecessary re-litigation of the filter design.
- Expanding into path resolution would turn a low-risk sanitization patch into a broader graph-metadata migration.
