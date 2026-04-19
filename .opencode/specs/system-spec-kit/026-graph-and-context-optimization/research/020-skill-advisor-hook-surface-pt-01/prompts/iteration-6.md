# Deep-Research Iteration 6 — 020 Skill-Advisor Hook Surface

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.

## STATE

Iteration: 6 of 10. Last focus: fail-open contract (iter 5).

Focus Area (iter 6): **Cross-runtime snapshot-test harness design + privacy audit.**

Part A — Snapshot test design (Q8):
- How to fixture a 3-runtime brief format test
- vitest snapshot format vs custom diff
- Per-runtime transport adapter differences (claude compact-inject, gemini compact-inject, copilot compact-cache)
- Regression budget: which runtimes auto-compared? what's tolerance?

Part B — Privacy audit (Q7):
- Prompt-fingerprint storage mechanism (in-memory session only vs persisted hook-state with TTL)
- Hash strategy (sha256 of prompt text? or stable tokenized form?)
- Phase 018 R4 shared-provenance contract implications
- What stays in hook-state JSON file vs in-memory only

Part C — Prompt-length threshold (Q6):
- Should hook fire on 3-char prompts? 20? 50?
- Empty prompt handling
- Tradeoff: low-threshold wastes calls on `/help`-style commands; high-threshold misses legit routing requests

Answers Q6, Q7, Q8.

## STATE FILES

Standard. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-006.md`: snapshot test plan + privacy audit + prompt-length policy.
2. Canonical JSONL.
3. `deltas/iter-006.jsonl`.
