# Iteration 011 - Latency and Timing Boundaries

## Focus Questions

V3, V10

## Tools Used

- `sed` reads for timing test and subprocess runner
- Evidence synthesis from validation playbook

## Sources Queried

- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`

## Findings

- The subprocess runner defaults to a 1000 ms timeout, retries SQLite-busy once if enough budget remains, and reports typed error codes such as `SIGNAL_KILLED`, `SQLITE_BUSY_EXHAUSTED`, and `JSON_PARSE_FAILED`. (sourceStrength: primary)
- The timing harness gates cache-hit p95 at <= 50 ms and requires a corrected 30-turn replay hit rate >= 60%; the validation playbook reports Phase 020 evidence of cache-hit p95 0.016 ms and replay hit rate 66.7%. (sourceStrength: primary)
- The timing evidence is mostly mocked or harness-level and should not be treated as OpenCode host latency. It is sufficient to show the architecture can be fast on cache hits, not that every real turn stays below 50 ms. (sourceStrength: moderate)
- With-hook latency savings are mostly projected from avoided file reads and reduced prompt context, not measured wall-clock improvements in assistant runtime. (sourceStrength: moderate)
- Plugin follow-up should add an OpenCode-specific replay test that records cold, warm, cache-hit, cache-miss, fail-open, and bridge-process durations. (sourceStrength: moderate)

## Novelty Justification

This pass clarified what latency data is real, what is harness-level, and what remains unmeasured.

## New Info Ratio

0.34

## Next Iteration Focus

Refine corpus methodology and handling of label drift.
