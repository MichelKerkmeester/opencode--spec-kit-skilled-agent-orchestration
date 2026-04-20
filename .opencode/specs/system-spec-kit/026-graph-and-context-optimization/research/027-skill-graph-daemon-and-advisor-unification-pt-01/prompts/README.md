# Prompts — Phase 027 r01

Per-iter prompts were generated at dispatch time from a single template in the driver script, parameterized by the iteration → task map in `../deep-research-config.json`. The template is reproduced in `../deep-research-strategy.md §Per-Iteration Prompt Template`.

## Template

Each of the 40 per-iter codex invocations received a prompt structured as:

```
You are executing iteration {N} of a 40-iteration deep-research on Phase 027.

Repo root: <REPO>
Research packet: <RESEARCH_REL>/

# Your target this iteration
Track: {TRACK}
Question ID: {QID}
Title: {TITLE}

# Protocol
1. Read deep-research-strategy.md
2. Read deep-research-config.json
3. Read deep-research-state.jsonl
4. If N>1: read iterations/iteration-{N-1}.md
5. For your assigned question {QID}:
   - Find it in strategy §"Evidence Map"
   - Read listed evidence sources
   - Cite file:line for every claim
6. Write iterations/iteration-{NNN}.md with:
   Question / Evidence Collected / Analysis / Verdict (adopt_now|prototype_later|reject + confidence) / Dependencies / Open follow-ups / Metrics
7. Append one JSON line to deep-research-state.jsonl
8. Print: ITER_{N}_DONE

# Constraints
READ-ONLY. Single question per iter. No Phase 020-026 re-opening.
```

## Iteration → Task Map

See `../deep-research-config.json §iteration_task_map` (40 entries):
- Iters 1-8: Track A (A1-A8)
- Iters 9-15: Track B (B1-B7)
- Iters 16-23: Track C (C1-C8)
- Iters 24-31: Track D (D1-D8)
- Iters 32-35: Cross-track coherence (X1-X4)
- Iters 36-40: Synthesis intermediates (S1-S5)

## Synthesis Prompt

After iter 40, a single cli-codex invocation received the synthesis prompt (also in `deep-research-strategy.md §Synthesis Contract`) to produce `research.md` + `findings-registry.json`.

## Executor Invocation

```bash
codex exec --model gpt-5.4 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "$(cat <prompt-file>)" > <log-file> 2>&1
```

Fallback path (copilot) was configured but never triggered (0 fallbacks across 40 iters + synthesis).
