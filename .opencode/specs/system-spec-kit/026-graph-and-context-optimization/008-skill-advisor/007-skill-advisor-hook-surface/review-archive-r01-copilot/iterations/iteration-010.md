# Iteration 010 — Dimension(s): D1

## Scope this iteration
Deep-drilled the prompt-cache secret scope and subprocess launch boundary to confirm whether the privacy leak found in iteration 001 is still the only concrete D1 defect after the broader 020-024 stack landed.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:33-36` -> `DEFAULT_SECRET` is process-local and derived once from `process.pid`, launch time, and `Math.random()`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231-235` -> `commandArgs` still appends the raw `prompt` onto the Python argv vector.
- `advisor-subprocess.vitest.ts:57-69` -> subprocess tests assert JSON parsing behavior but do not replace argv transport with stdin or another private channel.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- `P1-001-01`: status: re-verified via `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231-235` and `advisor-subprocess.vitest.ts:57-69`.

## Metrics
- newInfoRatio: 0.08
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 1
- dimensions_advanced: [D1]
- stuck_counter: 1

## Next iteration focus
Check D2's UNKNOWN-fallback and freshness-state transitions so the deeper pass distinguishes documented abstain paths from correctness regressions.
