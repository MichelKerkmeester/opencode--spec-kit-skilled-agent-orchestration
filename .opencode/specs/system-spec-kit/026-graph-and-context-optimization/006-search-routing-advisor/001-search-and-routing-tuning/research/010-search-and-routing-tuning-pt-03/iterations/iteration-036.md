# Iteration 36: Key-Files Noise Revalidation After Filter Tightening

## Focus
Re-run the active-corpus `key_files` validation after the tightened `keepKeyFile()` filter landed, with specific attention on whether command-shaped entries are still being stored.

## Findings
1. The active corpus now contains `365` non-archived `graph-metadata.json` files and `4,748` stored `key_files` entries. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Stored command-shaped `key_files` entries fell to `0`, which confirms the tightened filter closed the exact F11 noise class rather than merely changing how it was counted. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:43-49] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Resolve quality improved slightly but not decisively: `3,901 / 4,748` entries resolve under the same three-base heuristic (`repo root`, `spec-relative`, `system-spec-kit skill-relative`), which is `82.16%`; `847` entries still miss. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. The remaining miss set is now dominated by path-quality issues, not junk tokens: `749` path-like misses, `84` cross-track repo-relative misses, `9` obsolete `memory/metadata.json` references, and `5` bare filenames. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. The most repeated unresolved values are now concrete path residues such as `memory/metadata.json` (`9`), `hooks/memory-surface.ts` (`9`), `hooks/claude/session-prime.ts` (`7`), and `.opencode/agent/agent-improver.md` (`7`). [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Reopening command-snippet hygiene as the next parser target. That defect class is now closed in stored corpus output.

## Dead Ends
- None. The rerun cleanly separated residual misses into real path-canonicalization families.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:43-49`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:373-408`
- Live 2026-04-13 bash + jq scan over `.opencode/specs/`

## Assessment
- New information ratio: `0.08`
- Questions addressed: `RVQ-1`
- Questions answered: `RVQ-1`

## Reflection
- What worked and why: re-running the same three-base resolver made the post-fix numbers directly comparable to the earlier waves.
- What did not work and why: the top unresolved values are still heterogeneous enough that the next implementation phase should target path families, not a single regex.
- What I would do differently: split the future residual-hygiene phase into repo-relative canonicalization versus obsolete memory-path cleanup so success metrics stay crisp.

## Recommended Next Focus
Verify whether status normalization, trigger-cap compliance, and freshness are now actually clean, or whether the prior residual pocket only moved out of the most visible buckets.
