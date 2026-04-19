# Deep-Research Iteration 1 — 020 Extended Wave (cli-copilot)

Dispatched via `copilot -p @PROMPT --model gpt-5.4 --allow-all-tools --no-ask-user`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`. All writes pre-authorized. Proceed WITHOUT asking.

**Context**: Wave 1 (cli-codex) converged with all Q1-Q10 answered. You are wave 2 — deep-dive on remaining open questions + new angles. **DO NOT re-answer wave-1 questions**; only build on them or challenge them.

Wave 1 research.md: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`

## STATE

Iteration: 1 of 10
Focus: **X1 — Corpus parity + timing harness concrete design**

Wave 1 Q2 (cache TTL) and Q3 (brief length) produced recommendations but only sampled the 019/004 200-prompt corpus. This iteration designs the FULL harness.

Tasks:
1. Read wave-1 §Empirical Measurements for sample measurements already done
2. Read corpus at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
3. Design CONCRETE harness:
   - Fixture file layout (where test prompts live, how ground-truth is encoded)
   - Measurement methodology (cold vs warm runs, subprocess p50/p95/p99, cache-hit impact)
   - Pass/fail thresholds (exact numbers — e.g., p95 ≤ 50ms, cache hit rate ≥ 60%)
   - Regression gate integration (which CI command runs it, what failure looks like)
   - Test runner choice (vitest extension vs standalone script vs python)
4. Enumerate parity assertions: for each of 200 prompts, what must match (top-1 skill, confidence ± tolerance)?

## STATE FILES

- Config: `.../deep-research-config.json`
- State Log: `.../deep-research-state.jsonl` — APPEND canonical `"type":"iteration"` record
- Strategy: `.../deep-research-strategy.md`
- Registry: `.../findings-registry.json`
- Iter narrative: `.../iterations/iteration-001.md`
- Per-iter delta: `.../deltas/iter-001.jsonl`

All paths relative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/`

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13
- Iter 1 focus: concrete harness design only
- REQUIRED canonical JSONL `"type":"iteration"` EXACTLY
- REQUIRED delta file

## OUTPUT CONTRACT

1. `iterations/iteration-001.md` — harness design with fixture layout, methodology, thresholds, gate integration
2. Canonical JSONL: `{"type":"iteration","iteration":1,"newInfoRatio":0.85,"status":"in_progress","focus":"X1 corpus parity harness","findingsCount":N,"keyQuestions":10,"answeredQuestions":N,"timestamp":"...","durationMs":N,"graphEvents":[]}`
3. `deltas/iter-001.jsonl` — structured delta
