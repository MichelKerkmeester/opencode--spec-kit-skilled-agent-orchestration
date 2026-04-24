# Deep-Research Iteration 5 — 020 Skill-Advisor Hook Surface

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.

## STATE

Iteration: 5 of 10. Last focus: Codex hook surface audit (iter 4).

Focus Area (iter 5): **Failure-mode + fail-open contract detailed design.** Work:
- Enumerate subprocess error modes:
  - Python not in PATH
  - `skill_advisor.py` script missing / moved
  - Subprocess timeout (> 2s)
  - Malformed JSON output
  - Non-zero exit code
  - Concurrent write to skill-graph SQLite (stale read window)
  - Process killed by signal
  - Network (if advisor fetches remote — currently NO, but future-proof)
- For each: exact hook behavior, freshness-signal value, log level, user-visible impact
- Retry policy — yes/no, backoff curve
- Define `AdvisorHookResult` TypeScript interface shape
- Document observability hooks (logs, metrics, healthcheck endpoint)

Answers Q5 (fail-open contract details).

## STATE FILES

Standard. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-005.md`: error-mode table + AdvisorHookResult type + retry policy + observability plan.
2. Canonical JSONL.
3. `deltas/iter-005.jsonl`.
