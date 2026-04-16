# Iteration 38: Entity Precision Revalidation and Convergence Check

## Focus
Validate the entity surface after the scoped canonical-path preference fix, then decide whether the corpus is now clean enough to stop or still needs more discovery.

## Findings
1. Entity de-duplication remains stable: `0` active packets contain duplicate-name entity rows after the post-fix rerun. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. The suspicious-name bucket shrank to a single surviving artifact: `python` still appears once, sourced from code-fence language capture in `skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync`. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync/graph-metadata.json:133] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Scoped canonical-path matching improved the broad false-positive problem, but `9` true cross-spec canonical-doc leaks still remain, concentrated in mirrored `skilled-agent-orchestration` packets plus one `z_future` packet that still points at an old `999-...` decision record. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Entity density is still the dominant quality gap: the active corpus now stores `5,840` entity rows, averages exactly `16.00` per folder, and all `365 / 365` active packets still hit the 16-entity cap. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. Reusing the packet's heuristic scorecard with the updated evidence raises overall health to `91/100`: structure `100/100`, status/freshness `99/100`, `key_files` `82/100`, and entities `79/100`. This is better than the Wave 4 `89/100`, but the corpus is still not clean because unresolved `key_files` and saturated entity output remain material precision risks. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/iterations/iteration-034.md:8-11] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Opening another broad discovery wave. The remaining issues are narrow, implementation-shaped hygiene targets rather than unknown defect classes.

## Dead Ends
- None. The scoped leak rerun refined the residual entity problem without revealing another broad parser failure.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:474-559`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/research/iterations/iteration-034.md:8-11`
- Live 2026-04-13 bash + jq scan over `.opencode/specs/`

## Assessment
- New information ratio: `0.04`
- Questions addressed: `RVQ-3`
- Questions answered: `RVQ-3`

## Reflection
- What worked and why: refining the scope-leak check to true spec-root-relative cross-folder paths separated real entity precision problems from benign `research/research.md` references.
- What did not work and why: the entity-cap limit still masks prioritization quality because every active packet fills the available 16 slots.
- What I would do differently: carry a dedicated entity-prioritization metric in the next implementation phase instead of trying to infer precision only from cap hits.

## Recommended Next Focus
Stop early. Three consecutive revalidation iterations stayed below the `0.1` novelty threshold and only refined already-known residual hygiene buckets, so further discovery would be lower value than a tightly scoped implementation phase.
