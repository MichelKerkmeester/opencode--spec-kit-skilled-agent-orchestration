# Iteration 5: Correctness on hard-versus-soft drop triggers

## Focus
Re-read the scoring block to make sure only the intended hard wrapper patterns keep immediate drop dominance, while the softer command-language cues remain subordinate to genuine handover language.

## Findings

### P0

### P1

### P2

## Ruled Out
- Soft command patterns still behave like hard wrapper drop signals: ruled out by `content-router.ts:943-947`.

## Dead Ends
- None.

## Recommended Next Focus
Cross-check packet scope and implementation one more time.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: The hard/soft split holds: transcript-like wrappers still short-circuit to drop, but command references alone no longer erase handover state.
