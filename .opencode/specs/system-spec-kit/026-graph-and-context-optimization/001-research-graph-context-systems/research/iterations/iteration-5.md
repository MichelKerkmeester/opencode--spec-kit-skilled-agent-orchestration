# Iteration 5 — Q-A Token honesty audit

## Method
- Reused: `research/cross-phase-matrix.md`, `research/iterations/iteration-4.md`, `research/iterations/gap-closure-phases-1-2.json`, `research/iterations/gap-closure-phases-3-4-5.json`, and `research/phase-1-inventory.json`. The iter-4 handoff explicitly said to start from semantic query, structural query, and observability. [SOURCE: research/iterations/iteration-4.md:29-31] [SOURCE: research/cross-phase-matrix.md:12-17] [SOURCE: research/iterations/gap-closure-phases-1-2.json:260-310] [SOURCE: research/iterations/gap-closure-phases-3-4-5.json:11-62] [SOURCE: research/iterations/gap-closure-phases-3-4-5.json:281-329]
- New external reads: `001-claude-optimization-settings/external/reddit_post.md`, `002-codesight/external/{README.md,src/detectors/tokens.ts,src/eval.ts}`, `003-contextador/external/{README.md,src/lib/core/stats.ts}`, `004-graphify/external/graphify/benchmark.py`, and `005-claudest/research/research.md`.
- Public baseline reads: `.opencode/skill/system-spec-kit/mcp_server/{ENV_REFERENCE.md,context-server.ts,lib/response/envelope.ts,lib/telemetry/consumption-logger.ts,lib/telemetry/retrieval-telemetry.ts,lib/eval/reporting-dashboard.ts}`, `.opencode/skill/mcp-coco-index/SKILL.md`, and `.opencode/skill/system-spec-kit/mcp_server/{README.md,tool-schemas.ts,handlers/memory-search.ts}`.

## Audit summary

| System | Honesty score | Falsifiability ready |
|---|---|---|
| 001 Claude Optimization Settings | med | partial |
| 002 CodeSight | low | yes |
| 003 Contextador | low | yes |
| 004 Graphify | low | yes |
| 005 Claudest | med | partial |

## Surprises
- `001` is still the most grounded ratio-adjacent claim because it starts from real observed token deltas, even though the broader arithmetic is inconsistent. [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:22-24] [SOURCE: research/iterations/gap-closure-phases-1-2.json:152-198]
- `002` has the sharpest honesty mismatch: the README says "No estimates, no hypotheticals," while `tokens.ts` is estimate-heavy and `eval.ts` never checks token math. [SOURCE: 002-codesight/external/README.md:54-62] [SOURCE: 002-codesight/external/src/detectors/tokens.ts:4-60] [SOURCE: 002-codesight/external/src/eval.ts:97-142]
- `003` and `004` are not weak because they reduce no work; they are weak because their claimed percentages are built on synthetic denominators or heuristics rather than common counting authority. [SOURCE: 003-contextador/external/src/lib/core/stats.ts:26-28] [SOURCE: 004-graphify/external/graphify/benchmark.py:9-18]
- `005` ends up more honest by refusing the giant headline-number game. Its real contribution is measurement design plus cached-summary workflow reduction. [SOURCE: 005-claudest/research/research.md:171-190] [SOURCE: 005-claudest/research/research.md:285-320]
- Public already has enough observability to run an honest benchmark backbone today, but not enough provider-counted token authority to publish a headline system-wide savings number yet. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:213-225] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:271-275] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:116-138]
- The "savings" scales diverge badly: per-turn config overhead, per-project summary generation, per-query pointer compression, per-corpus graph benchmark, and per-stop cached-summary startup are different units. [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:22-24] [SOURCE: 002-codesight/external/README.md:56-62] [SOURCE: 003-contextador/external/README.md:13-19] [SOURCE: 004-graphify/external/graphify/benchmark.py:64-107] [SOURCE: 005-claudest/research/research.md:171-190]

## Handoff to iteration 6 (Q-E + Q-C)
- `002` stays composition-friendly and source-portable from a license/runtime perspective, but its 11.2x figure should not be carried into Q-C as evidence of proven token economics. [SOURCE: research/cross-phase-matrix.md:17-18] [SOURCE: research/iterations/gap-closure-phases-1-2.json:260-310]
- `003` should feed Q-E as concept-transfer-only twice over: AGPL/Bun are real feasibility constraints, and the 93% claim is too synthetic to justify product-pressure toward monolithic adoption. [SOURCE: research/cross-phase-matrix.md:17-18] [SOURCE: research/iterations/gap-closure-phases-3-4-5.json:11-62]
- `004` should feed Q-C as an extraction/evidence-tagging donor, not a benchmark winner; its ratio is not strong enough to argue for architectural centralization. [SOURCE: research/cross-phase-matrix.md:24-29] [SOURCE: research/iterations/gap-closure-phases-3-4-5.json:281-329]
- `005` is the important bridge into both Q-E and Q-C: the cached-summary and normalized-analytics patterns compose well with Public's split topology, but only after the producer metadata gap from `G5.SH` is closed. [SOURCE: research/cross-phase-matrix.md:63-74] [SOURCE: research/iterations/gap-closure-phases-3-4-5.json:676-718]
