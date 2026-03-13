# Agent 14 - Eval dashboard implementation note

- Scope: fixed reporting dashboard aggregation semantics in runtime code only; no spec docs changed.
- Copilot: verified `copilot` exists, set `~/.copilot/config.json` `reasoning_effort` to `xhigh`, then ran a non-interactive audit with `copilot -p ... --model gpt-5.3-codex --allow-all-tools 2>&1`.
- Root cause 1: `config.limit` was pushed into the snapshot SQL query, so the raw row cap could collapse older sprint groups before grouping and make `limit` return fewer sprint groups than requested.
- Root cause 2: channel aggregation queried rows for every filtered snapshot run before sprint limiting, which made the row-limit safeguard vulnerable to starving the kept sprint groups on large datasets.
- Runtime fix: aggregate filtered snapshots into sprint groups first, sort groups chronologically, apply `limit` at the sprint-group layer, derive included eval run ids from the kept groups, then query channel rows only for that reduced run set.
- Runtime fix: `DashboardReport.totalEvalRuns`, `DashboardReport.totalSnapshots`, and the generated summary now describe the included report scope after filters/limit instead of the whole database.
- Tests: added a regression that seeds 41 snapshots into the newest sprint so the old raw-row `LIMIT limit*20` behavior would have returned only one sprint for `limit: 2`; the fixed code returns the two most recent sprint groups and scoped totals.
- Docs: updated `lib/eval/README.md` to state that `limit` is applied after sprint grouping and totals reflect filtered report scope.
- Verification to run: targeted `vitest` suites for reporting dashboard + handler coverage, plus the OpenCode alignment verifier on the changed MCP server scope.
