# Iteration 041 — Follow-up Track E: E1 — Watcher benchmark harness on current + 2x + 5x skill set

## Question
Watcher benchmark harness on current + 2x + 5x skill set — measured CPU/RSS/descriptor baseline (unblocks A6).

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:98-106` → Track E makes E1 the first blocker for `027/001` and defines it as a watcher benchmark on current, 2x, and 5x skill-set scale.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:122-123` → `027/001` depends on A1-A6 and is explicitly the daemon/freshness foundation packet, so E1 can materially de-risk implementation sequencing.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:160-161` → r01 already reserved a daemon budget gate: `<5%` idle CPU, `<50MB` daemon budget, and watchdog/debounce measurement via a watcher benchmark.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:95` → A6’s original budget target is “Watching ~50-100 SKILL.md + supporting files + 10-20 asset dirs” with `<5%` idle CPU, `<50MB` RAM, `<10s` debounce.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-006.md:30-32,44-47` → r01 A6 already showed narrow metadata-only watching was plausible while broader source watching hit descriptor pressure, leaving a benchmark/prototype follow-up rather than a default.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1515-1527` → The current watcher still uses a Chokidar glob-shaped target (`path.join(skillGraphSourceDir, '*', SKILL_GRAPH_METADATA_FILENAME)`) with `awaitWriteFinish` and `followSymlinks: false`.
- `.opencode/skill/system-spec-kit/mcp_server/node_modules/chokidar/README.md:35-36,273-289` → Chokidar v4 removed glob support and documents two replacements: watch a directory with an `ignored` filter or pre-expand files before calling `watch()`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:251-258` → The repo already has a reusable watcher shape using `watchFactory(config.paths, { ignoreInitial, awaitWriteFinish, ignored, followSymlinks: false })`, so a benchmark should test the same options the runtime already trusts.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:6-10,84-97,228-279` → Existing benchmark tooling standardizes on JSON output, latency summaries (including p95), configurable thresholds, and pass/fail gates.
- `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:134-137,345-389` → Existing TypeScript benchmark tooling writes machine-readable JSON plus human-readable markdown artifacts under `scratch/`, including explicit thresholds and gate status.
- `/Users/michelkerkmeester/.copilot/session-state/4effcf42-e24c-4d22-8c9c-997806323deb/files/iter41-watch-benchmark-results.jsonl:1-3` → An isolated local probe mirroring current `.opencode/skill/*/{SKILL.md,graph-metadata.json,references,assets,scripts}` into synthetic 1x/2x/5x corpora measured: 1x = 20 skills / 22 metadata files / 3,769 files, 2x = 40 / 44 / 7,538, 5x = 100 / 110 / 18,845; metadata-file-list watching stayed at ~0.33-1.17% idle CPU, ~54.72-59.58MB RSS, and 22/44/110 extra descriptors, while root-dir-with-ignored-filter climbed to ~44.33-111.04% idle CPU, ~143.09-351.31MB RSS, and 3,769/7,538/18,845 descriptors.

## Analysis
E1 should be **adopt now** because the repo already treats benchmarks as first-class release gates, not ad hoc experiments. The Python advisor harness emits JSON reports with thresholded gates, and the TypeScript performance harness writes both JSON and markdown artifacts under `scratch/`; that gives Phase 027 a clear house style for a watcher benchmark as well: deterministic corpus input, machine-readable metrics, and explicit pass/fail thresholds rather than anecdotal observations. The missing piece is not benchmark philosophy but a watcher-specific harness wired to the actual daemon choices. `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:6-10,84-97,228-279` and `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:134-137,345-389`

The code-level setup makes E1 more urgent, not less. The live skill-graph watcher still passes a glob-shaped path into Chokidar, but the installed Chokidar v4 explicitly removed glob support and recommends either pre-expanding a file list or watching a directory with an `ignored` filter. Because the repo also already uses an `ignored`-filter watcher pattern elsewhere, E1 can benchmark exactly the two realistic replacement strategies instead of inventing new ones. `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1515-1527`, `.opencode/skill/system-spec-kit/mcp_server/node_modules/chokidar/README.md:35-36,273-289`, `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:251-258`

The empirical result is decisive enough to shape implementation order. On a synthetic corpus mirrored from the real skill tree, explicit metadata-file-list watching scaled linearly from 22 to 110 descriptors and stayed near the A6 CPU target at all three scales, while the broad directory-watch strategy exploded with corpus size, reaching 18,845 watched-file descriptors, 351MB RSS, and >100% idle CPU at 5x. That means E1 is not merely “nice to have” instrumentation: it is the mechanism that separates the safe default (narrow metadata watch) from the still-unsafe default (broad supporting-file watch) before `027/001` locks in daemon behavior. `/Users/michelkerkmeester/.copilot/session-state/4effcf42-e24c-4d22-8c9c-997806323deb/files/iter41-watch-benchmark-results.jsonl:1-3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:160-161`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:95`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** The repo already has a benchmark-and-gates pattern to reuse, and the current/2x/5x probe shows a large, decision-changing gap between narrow metadata watching and broad directory watching. E1 should ship as a gating harness for `027/001`, not as a post hoc experiment.

## Dependencies
A5, A6, E4

## Open follow-ups
- Run the same harness inside the actual MCP server process, not just an isolated Chokidar process, to decide whether the narrow 1x RSS result (~55MB) can be pulled under the `<50MB` daemon budget or needs a revised budget note.
- Add event-burst scenarios for multi-file editor saves so E4 can tune debounce against the same 1x/2x/5x corpus.
- Decide whether broad `SKILL.md`/`references`/`assets`/`scripts` watching remains a non-default experimental lane or gets narrowed to path-scoped metadata invalidation only for `027/001`.

## Metrics
- newInfoRatio: 0.74
- dimensions_advanced: [E]
