# Deep-Research Iteration 3 — 020 Skill-Advisor Hook Surface

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.

## STATE

Iteration: 3 of 10. Last focus: code-graph pattern parallel map (iter 2 complete).

Focus Area (iter 3): **Empirical cache-TTL + context-budget measurement using 019/004 corpus.** Work:
- Load `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl` (200 labeled prompts)
- Design a measurement methodology (not full execution — plan + sample):
  - For each prompt, what's the advisor subprocess p50/p95 latency?
  - What's the average confidence between similar prompts within the same session window?
  - For cache-TTL candidates (1min, 5min, 15min, 30min, 60min), what's the hit-rate tradeoff?
- Design brief-length tradeoff:
  - 40 tokens: top-1 skill name only
  - 60 tokens: top-1 + confidence + uncertainty
  - 80 tokens: top-1 + confidence + uncertainty + freshness
  - 120 tokens: top-1 + top-2 fallback + confidence + uncertainty + freshness
- Pick SAMPLE of 10-20 corpus prompts and manually walk through what each brief-length would include

Answers Q2 (cache TTL), Q3 (brief length), partial Q6 (when-to-fire).

## STATE FILES

Standard. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-003.md`: methodology + sample measurements + recommended TTL + brief-length curve.
2. Canonical JSONL.
3. `deltas/iter-003.jsonl`.
