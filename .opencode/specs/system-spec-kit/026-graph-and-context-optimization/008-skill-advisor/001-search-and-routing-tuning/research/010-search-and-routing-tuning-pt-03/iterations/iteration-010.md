# Iteration 10: Synthesis and Remediation Priorities

## Focus
Consolidate the loop into a single risk-ranked view of graph metadata integrity versus quality.

## Findings
1. Relationship integrity is good but shallow: all 4 declared dependencies resolve, there are 0 cycles, and there are 0 ghost children after proper path normalization. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. The dominant defects are semantic quality defects in derived fields, not relationship breakage: 40.13% missing `key_files`, 2,020 duplicate entities, 259 planned-with-implementation-summary mismatches, 216 over-cap trigger sets, and 130 stale timestamps. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Those defects trace back to concrete derivation behaviors: frontmatter-only status extraction, direct key-file seeding into entities, lack of trigger-phrase truncation in `deriveGraphMetadata()`, and legacy compatibility files that preserve weaker structure. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:346-353] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-471] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-560]
4. The next remediation wave should prioritize data-quality fixes over more relationship validation work: status derivation, key-file sanitization/canonicalization, duplicate-entity suppression, trigger-cap enforcement, and legacy JSON normalization. [INFERENCE: based on the cross-question metrics and parser/backfill behavior]

## Ruled Out
- Further relationship scanning as the best next investment.

## Dead Ends
- Treating graph integrity and graph usefulness as the same thing.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:346-353`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-471`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-560`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.3`
- Questions addressed: `RQ-1` through `RQ-8`
- Questions answered: `RQ-1` through `RQ-8`

## Reflection
- What worked and why: The loop converged once the scan used the same semantics as the parser instead of shell-level assumptions.
- What did not work and why: Early false positives came from path-base mismatches and JSON-only assumptions, not from the metadata itself.
- What I would do differently: Start future audits by explicitly modeling compatibility formats and path-normalization rules.

## Recommended Next Focus
Open a follow-on implementation packet for parser/backfill remediation rather than running more discovery.
