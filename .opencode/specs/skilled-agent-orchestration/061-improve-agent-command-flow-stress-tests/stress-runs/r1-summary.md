# 061 R1 Stress Run Summary

**Timestamp:** 2026-05-02T13:23:31Z
**Executor:** cli-copilot --model gpt-5.5 (high reasoning via ~/.copilot/settings.json)
**Substrate:** 062 wiring (commit 6374d5806) — static skill assets, materializer, nested legal-stop, stop-reason enum reconciled
**Per-CP layer partition:** CP-040/043/044/045 command-flow; CP-041/042 body-level + 5 required inputs

## Per-scenario verdicts

| CP | File | Layer | Verdict |
|---|---|---|---|
| CP-040 | 013-skill-load-not-protocol.md | command-flow | PASS |
| CP-041 | 014-proposal-only-boundary.md | body-level | PARTIAL |
| CP-042 | 015-active-critic-overfit.md | body-level | FAIL |
| CP-043 | 016-legal-stop-gate-bundle.md | command-flow | PASS |
| CP-044 | 017-improvement-gate-delta.md | command-flow | PASS |
| CP-045 | 018-benchmark-completed-boundary.md | command-flow | PARTIAL |

## Score

```
   3 PASS
   2 PARTIAL
   1 FAIL
```

## Evidence paths

Per-scenario transcripts and field-count files at `/tmp/cp-040-*` through `/tmp/cp-045-*`. Full run log at `r1-run-log.txt`.

## Comparison vs 060/002 R1

060/002 R1 (prepend-body shape, before 062 wiring): **0 PASS / 2 PARTIAL / 4 FAIL**

061 R1 (command-flow + body-level partition, after 062 wiring): see score above

## Next step

If all 6 PASS: synthesis test-report.md.
If PARTIAL/FAIL remain: triage; R2 with targeted fixes per ADR-4.
