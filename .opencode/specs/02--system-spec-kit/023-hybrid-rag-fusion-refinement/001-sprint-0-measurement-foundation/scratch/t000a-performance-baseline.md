# T000a: Pre-Sprint-0 Performance Baseline

**Captured**: 2026-02-27
**Git commit**: `523627eb` (fix(spec-kit): Sprint 0 Wave 1 — graph IDs, chunk dedup, SHA256 dedup, eval DB)
**Preceding commits**: Wave 1 bug fixes already applied (T001, T002, T003, T054, T004)

---

## Test Suite

| Metric             | Value |
| ------------------ | ----- |
| Test files         | 158   |
| Total tests        | 4684  |
| Tests passing      | 4665  |
| Tests skipped      | 19    |
| Tests failing      | 0     |
| Duration           | 4.43s (transform 6.80s, setup 0ms, import 16.38s, tests 11.31s) |

Test files live in: `.opencode/skill/system-spec-kit/mcp_server/tests/`
Test runner: vitest via `npx vitest run --reporter=verbose`

All 158 test files ran without failures. The 19 skipped tests are primarily DB fixture tests (marked `[deferred - requires DB test fixtures]`).

---

## Memory Database

| Metric                  | Value       |
| ----------------------- | ----------- |
| Total memories          | 2,360       |
| Successful embeddings   | 2,260       |
| Partial embeddings      | 97          |
| Failed                  | 1           |
| Pending re-indexing     | 2           |
| DB size                 | 243,007,488 bytes (~232 MB) |
| Vector search           | enabled     |
| Total trigger phrases   | 5,791       |
| Oldest memory           | 2026-02-21T19:49:05Z |
| Newest memory           | 2026-02-27T14:00:03Z |

**Tier breakdown**:

| Tier           | Count |
| -------------- | ----- |
| constitutional | 2     |
| critical       | 856   |
| important      | 249   |
| normal         | 1,253 |

**Top spec folders by memory count**:

| Folder                                                             | Count |
| ------------------------------------------------------------------ | ----- |
| `02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion`  | 89    |
| `T`                                                                | 66    |
| `02--system-spec-kit/022-hybrid-rag-fusion`                        | 64    |
| `02--system-spec-kit/021-spec-kit-phase-system`                    | 44    |
| `03--commands-and-skills/skills/003-skill-rename`                         | 34    |
| `02--system-spec-kit/022-hybrid-rag-fusion-refinement`             | 26    |

---

## Graph Channel Metrics (baseline)

| Metric              | Value |
| ------------------- | ----- |
| totalQueries        | 0     |
| graphHits           | 0     |
| graphOnlyResults    | 0     |
| multiSourceResults  | 0     |
| graphHitRate        | 0     |

Graph channel has not accumulated query telemetry at this snapshot point (telemetry resets on server restart; the eval DB via `SPECKIT_EVAL_LOGGING` is the persistent store).

---

## Notes

- **p95 search latency** measurement is deferred to T005 logging hooks. The eval logger (`lib/eval/eval-logger.ts`) infrastructure is in place (T004 applied) but `SPECKIT_EVAL_LOGGING=true` must be enabled and a real query session must run to populate `eval_queries` / `eval_final_results` tables.
- Wave 1 bug fixes already applied: T001 (graph IDs), T002 (chunk dedup), T003 (SHA256 dedup), T004 (eval DB schema), T054 (content hash dedup). These are captured in commit `523627eb`.
- The `T` folder with 66 memories is an anomaly: a bare single-character spec folder name, likely an indexing artifact. Not a regression introduced by Wave 1.
- 97 memories have `partial` embedding status — these were partially chunked or had embedding generation failures. Not blocking but worth monitoring.
