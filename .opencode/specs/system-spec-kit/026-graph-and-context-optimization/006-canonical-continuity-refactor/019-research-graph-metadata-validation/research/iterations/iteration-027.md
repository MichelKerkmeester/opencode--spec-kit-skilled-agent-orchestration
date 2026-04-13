# Iteration 27: Original RQ Before-After Deltas

## Focus
Compare the Wave 4 corpus tables directly against the eight original Wave 1 research answers.

## Findings
1. Structural answers stayed stable after implementation: broken dependencies remain `0/4`, cycle count remains `0`, and ghost-child count remains `0` even though child links increased from `290` to `309`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. `key_files` quality improved sharply: resolution rose from `59.87%` (`3,172/5,298`) to `81.25%` (`3,818/4,699`), while stored `key_files` volume fell by `599` entries despite the corpus gaining `20` active packets. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/research.md] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Status accuracy improved from `302` planned packets down to `56`, and `planned` folders with `implementation-summary.md` fell from `259` to `10`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/research.md] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Trigger-cap enforcement is now fully clean: over-cap folders dropped from `216` to `0`, max trigger count fell from `33` to `12`, and excess triggers above the cap fell from `949` to `0`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/research.md] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:659-667] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. Duplicate entity rows went from `2,020` across `270` folders to `0`, but entity-cap pressure got worse: the 16-entity cap now hits `360` of `364` active folders. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/research.md] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Treating the success of de-duplication as evidence that entity extraction is “done.” Cap saturation now makes that clearly false.

## Dead Ends
- None. The before/after math lined up once the active corpus was fixed at 364.

## Sources Consulted
- `research/research.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:474-559`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:659-667`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.34`
- Questions addressed: `PVQ-1`
- Questions answered: `PVQ-1`

## Reflection
- What worked and why: the original Wave 1 answers were concrete enough that the post-implementation deltas could be computed directly instead of re-interpreting the old narrative.
- What did not work and why: the older status and entity findings are still easy to over-quote unless the new corpus size is stated beside every delta.
- What I would do differently: preserve a machine-readable delta table in future waves so the next continuation does not have to rebuild it from prose.

## Recommended Next Focus
Inspect the remaining `planned` set manually so the status improvements can be separated into “real remaining work” versus “stale metadata or contract gap.”
