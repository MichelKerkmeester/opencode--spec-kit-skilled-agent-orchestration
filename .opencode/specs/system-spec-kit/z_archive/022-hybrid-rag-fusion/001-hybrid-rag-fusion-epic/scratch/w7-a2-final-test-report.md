# W7-A2 Final Test Report

- Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run --reporter=verbose 2>&1 | tail -50`
- Run timestamp: 2026-03-08T15:01:16.355Z request / observed completion during this session

## Test counts

| Metric | Count |
| --- | ---: |
| Total tests | 7157 |
| Passed | 7155 |
| Failed | 2 |
| Skipped | 0 |

## Comparison vs baseline

Baseline (2026-03-08, W3-A5):
- 7153 passed
- 4 known failures
- 0 test suite failures

Current run:
- Passed increased by 2 (7155 vs 7153 baseline)
- Failed tests decreased from the 4 known baseline failures to 2 observed failures
- However, 1 observed failure matches a known baseline issue, and 1 observed failure appears to be a new failure not listed in the baseline

## Failures observed

### Known baseline failure still present
1. `tests/handler-memory-ingest.vitest.ts`
   - `Handler Memory Ingest (Sprint 9 P0-3) > start queues job and returns queued response`
   - Error: missing `DATABASE_PATH` export on mocked `../core`

### New failure identified
1. `tests/job-queue.vitest.ts`
   - `ingest job queue crash recovery > resets incomplete jobs to queued from a clean cursor`
   - Error: `TypeError: mod.resetIncompleteJobsToQueued is not a function`

## Verdict

**FAIL**

Reason:
- Pass count is above baseline, but there is at least one **new** failing test (`tests/job-queue.vitest.ts`) that is not part of the accepted 4 known baseline failures.
