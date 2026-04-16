# Iteration 2: Legacy Compatibility and Distribution Baseline

## Focus
Determine whether non-JSON files are actually broken or still load through the parser's legacy compatibility path.

## Findings
1. Thirty-five files are stored in the older `Packet: ...` text format instead of JSON, which is 10.17% of the 344-file corpus. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Those files are not necessarily runtime failures because `validateGraphMetadataContent()` falls back from `JSON.parse()` into `parseLegacyGraphMetadataContent()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:96-163] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:172-203]
3. A representative legacy file under packet `024-compact-code-graph/013-correctness-boundary-repair` still carries packet identity, status, key topics, key files, and source docs, but does so without structured JSON arrays or derived entities. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair/graph-metadata.json:1-11]
4. Treating raw JSON parse failures as "invalid metadata" would overstate risk; the better classification is "legacy-format but runtime-loadable." [INFERENCE: based on parser fallback logic and the live corpus sample]

## Ruled Out
- Treating every non-JSON file as a hard runtime failure.

## Dead Ends
- JSON-only validation as the main corpus quality lens.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:96-203`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair/graph-metadata.json:1-11`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.9`
- Questions addressed: `RQ-7`, `RQ-8`
- Questions answered: none

## Reflection
- What worked and why: Reading a real legacy file clarified what compatibility preserves and what it drops.
- What did not work and why: Initial raw-JSON scans hid the fact that legacy files are still loadable.
- What I would do differently: Build relationship metrics on parser-compatible data, not JSON-only subsets.

## Recommended Next Focus
Validate manual `depends_on` relationships using the metadata's own specs-root-relative path base.
