# Iteration 20: Remediation Synthesis and Implementation Guidance

## Focus
Close the reopened wave by turning the five remediation investigations into implementation-ready guidance for the child phases.

## Findings
1. Status derivation is still the top priority. Even on the current 360-file corpus, 282 planned folders already contain `implementation-summary.md`, and 180 of those also satisfy the full checklist completion gate. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Key-file sanitization offers the biggest immediate quality gain after status. The combined structural-plus-regex filter removes 1,489 of the 2,195 current misses without changing schema shape or backfill contracts. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Entity de-duplication is the next best parser cleanup: 794 redundant name-collision slots are currently wasting a 16-slot field that already caps out in 349 folders. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Legacy normalization no longer blocks the active branch. The safest expression of phase 004 is now an optional backfill flag or a packet-scope recheck rather than a mandatory whole-tree rewrite. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. Trigger-phrase overflow is a small, low-risk cleanup that can ride with the parser edits: there is no cap enforcement today, and a single `.slice(0, 12)` would eliminate 949 excess stored triggers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-545] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Opening another discovery-only wave before the parser fixes land.

## Dead Ends
- Treating the stale 35-file legacy snapshot as a reason to keep phase 004 on the active critical path.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/research.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.34`
- Questions addressed: `FQ-1` through `FQ-5`
- Questions answered: `FQ-1` through `FQ-5`

## Reflection
- What worked and why: splitting the reopened wave into minimal-patch versus safer-patch answers kept the synthesis grounded in real implementation choices.
- What did not work and why: the old snapshot numbers were no longer safe to reuse verbatim once the corpus changed.
- What I would do differently: treat active-corpus drift as a first-class input any time a deep-research lineage is resumed after a gap.

## Recommended Next Focus
Hand execution to phases `001-fix-status-derivation`, `002-sanitize-key-files`, and `003-deduplicate-entities`, then re-check whether phase `004-normalize-legacy-files` should be retired or rewritten as a guarded no-op migration helper.
