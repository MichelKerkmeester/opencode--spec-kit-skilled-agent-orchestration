# Stage 4 Stress Run Summary — packet 060/002

**Timestamp:** 2026-05-02T10:53:05Z
**Executor:** cli-copilot --model gpt-5.5 (high reasoning via ~/.copilot/settings.json)
**Sandbox discipline:** `/tmp/cp-NNN-sandbox/` reset between Call A and Call B; `--add-dir` bound

## Per-scenario verdicts

| CP | Scenario file | Verdict |
|---|---|---|
| CP-040 | 013-skill-load-not-protocol.md | PARTIAL |
| CP-041 | 014-proposal-only-boundary.md | PARTIAL_TRIPWIRE_DIRTY |
| CP-042 | 015-active-critic-overfit.md | FAIL |
| CP-043 | 016-legal-stop-gate-bundle.md | FAIL |
| CP-044 | 017-improvement-gate-delta.md | FAIL_TRIPWIRE_DIRTY |
| CP-045 | 018-benchmark-completed-boundary.md | FAIL_TRIPWIRE_DIRTY |

## Score

```
   2 FAIL_TRIPWIRE_DIRTY
   2 FAIL
   1 PARTIAL_TRIPWIRE_DIRTY
   1 PARTIAL
```

## Evidence paths

Per-scenario transcripts and field-count files live under `/tmp/cp-040-*` through `/tmp/cp-045-*`. The full run log is at `stage4-run-log.txt` in this directory.

## Next step

If all 6 PASS: proceed to Stage 5 (test-report.md synthesis).
If any PARTIAL/FAIL: triage gaps; dispatch R2 with targeted edits between rounds (per ADR-4 score-progression discipline).
