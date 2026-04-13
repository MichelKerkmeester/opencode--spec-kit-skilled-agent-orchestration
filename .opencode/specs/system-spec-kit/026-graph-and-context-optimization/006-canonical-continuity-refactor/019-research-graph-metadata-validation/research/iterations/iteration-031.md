# Iteration 31: Residual Key-File Miss Families

## Focus
Inspect the full active-corpus miss table after sanitization to identify the real remaining `key_files` cleanup targets.

## Findings
1. The active corpus still contains `881` missing `key_files`, down from `2,126` in Wave 1. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. The dominant residual family is path-like misses (`757`), with phrase-like misses (`99`) a distant second. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Forty-eight remaining misses are still shell-command snippets, mostly `cd ... && node ...` or `cd ... && npx vitest run ...`, which means the current `keepKeyFile()` predicate is still too permissive for command-shaped paths. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Top repeated misses now look like stale or under-normalized repo-relative references, not generic prose: `hooks/memory-surface.ts`, `memory/metadata.json`, `.opencode/agent/agent-improver.md`, `handlers/memory-search.ts`, and `handlers/memory-context.ts`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. `key_files` cap pressure improved but did not disappear: cap hits fell from `159` to `93`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/research.md] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Treating all residual misses as one generic “path-like” problem. The command-snippet subset and the stale memory-era subset clearly need different handling.

## Dead Ends
- The first category regex under-counted command-shaped misses because `cd ...` entries were still falling through into the path-like bucket.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562-568`
- Full active-corpus `key_files` miss table derived from the 2026-04-13 bash + jq scan

## Assessment
- New information ratio: `0.14`
- Questions addressed: `PVQ-3`
- Questions answered: `PVQ-3`

## Reflection
- What worked and why: looking at the top repeated misses made the residual categories concrete enough to turn directly into follow-on phase scope.
- What did not work and why: the original miss taxonomy from Wave 1 no longer fits cleanly because the post-sanitization misses are narrower and more path-specific.
- What I would do differently: treat “command-like but path-bearing” as its own first-class category in future scan scripts.

## Recommended Next Focus
Check whether entity quality now shows the same pattern as `key_files`: duplicates fixed, but a narrower set of precision problems still surviving.
