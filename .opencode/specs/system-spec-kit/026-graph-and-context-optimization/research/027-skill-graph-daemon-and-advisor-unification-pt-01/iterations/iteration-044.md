# Iteration 044 — Follow-up Track E: E4 — Debounce window empirical calibration

## Question
Debounce window empirical calibration — 10s default assumed; measure optimal for editor save patterns.

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:98-106` → Track E defines E4 as the debounce-calibration question and frames it as testing the earlier “10s default assumed” placeholder.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md:90-96` → A1/A6 require the watcher to survive editor atomic-rename patterns and keep debounce below 10s so multi-file saves do not thrash the daemon.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:133-135,160-161` → r01’s risk register and measurement plan treat “debounce stable writes” as the mitigation for noisy watcher loops, but only set a coarse `<10s` gate rather than a calibrated default.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:222,1495-1503,1521-1527` → The live skill-graph watcher already uses a `SKILL_GRAPH_WATCH_DEBOUNCE_MS` constant of `2000` and pairs it with `awaitWriteFinish: { stabilityThreshold: 1000 }`.
- `.opencode/skill/system-spec-kit/mcp_server/node_modules/chokidar/README.md:189-205` → Chokidar documents that `awaitWriteFinish` delays `add`/`change` until file size is stable, warns the right threshold is OS/hardware dependent, and notes higher thresholds make the watcher “much less responsive.”
- `.opencode/skill/system-spec-kit/mcp_server/node_modules/chokidar/README.md:212-218` → Chokidar’s `atomic` filter is enabled by default for non-polling watchers and already collapses common editor atomic-write delete/add artifacts within 100ms.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:400-427` → Repo watcher tests show that five writes spaced 20ms apart collapse to exactly one reindex when `debounceMs` is only `200`, demonstrating that burst coalescing happens at sub-second windows.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:744-763` → Separate watcher tests show a second write after `1200` ms of quiet time is treated as a new reindex cycle even with only `40` ms debounce, so second-scale quiet periods already separate distinct edit bursts.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-041.md:35-36` → E1 explicitly left “event-burst scenarios for multi-file editor saves” as the remaining work needed for E4, meaning the packet still lacks a dedicated end-to-end burst benchmark.

## Analysis
The strongest conclusion is that the packet’s earlier `<10s` figure is a **budget ceiling, not a justified default**. The live daemon already runs with a 2s skill-graph debounce and a 1s stable-write delay, while Chokidar warns that larger `awaitWriteFinish` values quickly trade correctness for responsiveness. Combined with Chokidar’s built-in 100ms atomic-write smoothing, the current stack already covers the editor behaviors A1 worried about without needing anything close to a 10-second delay. `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:222,1495-1503,1521-1527`, `.opencode/skill/system-spec-kit/mcp_server/node_modules/chokidar/README.md:189-205,212-218`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md:90-96`

The repo’s watcher tests reinforce that point. Rapid write bursts are already coalesced with a 200ms debounce, and a 1.2s quiet period is enough to distinguish a new edit cycle in the shared watcher utility. That does **not** mean the skill-graph watcher should drop to 200ms globally, because the skill-graph path triggers a whole-database scan rather than a single-file reindex; but it does show that “10s to survive editor save storms” is far more conservative than the observed behavior of the watcher stack the repo actually ships. `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:400-427,744-763`

What is still missing is the “empirical calibration” promised by E4: a dedicated benchmark that replays realistic multi-file save bursts against the actual skill-graph watcher and measures duplicate scans versus freshness lag across several debounce candidates. Iteration 041 explicitly called out that missing harness extension. So the honest answer is to keep the live 2s debounce as the **provisional implementation default** and reject 10s as the presumed default, but leave final optimization as a benchmark-backed prototype step rather than claiming the optimum has already been proven. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-041.md:35-36`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:160-161`

## Verdict
- **Call:** prototype later
- **Confidence:** medium
- **Rationale:** The evidence is strong enough to demote the old “10s assumed” placeholder and keep the existing 2s debounce / 1s stable-write pair as the provisional default, but the packet still lacks the burst-benchmark data needed to call any window empirically optimal.

## Dependencies
E1, A1, A6, A8

## Open follow-ups
- Add multi-file editor-burst scenarios to the E1 watcher harness and sweep debounce candidates (for example 250ms, 500ms, 1000ms, 2000ms, 3000ms, 5000ms) against 1x/2x/5x corpora.
- Measure end-to-end freshness lag from file write to advisor-ready graph state inside the real MCP process, not just the shared file-watcher utility.
- Re-check whether a single global debounce timer remains appropriate once E2’s shared-daemon ownership model is implemented.

## Metrics
- newInfoRatio: 0.47
- dimensions_advanced: [E]
