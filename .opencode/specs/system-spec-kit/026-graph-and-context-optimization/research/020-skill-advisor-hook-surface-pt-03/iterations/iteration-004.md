# Iteration 004 - V4 019/004 corpus adequacy for 005 hard gate

## Summary

The `019/.../labeled-prompts.jsonl` corpus is **balanced but incomplete for 005's hard-gate surface**. The bucket mix is solid at `32/32/32/32/36/36`, but the current 200 prompts do **not** cover 004's skip-policy classes (`empty`, `/help`, `/clear`, `/exit`, `/quit`, casual) and they do **not** include the wave-2 X5 adversarial prompt class (instruction-shaped or metalinguistic skill-name-poisoning inputs). That means 005's current §3.4 "200-prompt parity" check is realistic for the existing corpus, but it is **not sufficient by itself** to validate the full producer+renderer contract that 004 and wave-2 require. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:99-102] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:131-175]

## Corpus bucket counts

| Bucket | Count |
| --- | ---: |
| `true_write` | 32 |
| `true_read_only` | 32 |
| `memory_save_resume` | 32 |
| `mixed_ambiguous` | 32 |
| `deep_loop_prompts` | 36 |
| `skill_routing_prompts` | 36 |

The corpus is therefore well-distributed for routing/governance classification work, but that distribution does not imply hard-gate completeness for the hook surface. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]

## Coverage check against 004 prompt-policy skips

`004/spec.md` requires `shouldFireAdvisor()` to skip `empty / whitespace / /help / /clear / /exit / /quit / short casual acknowledgements`, and `REQ-002` makes those skip classes part of the producer acceptance surface. The current 200-prompt corpus contains none of those explicit skip-policy prompts, so `005`'s corpus parity lane cannot prove that the hook preserves the skip branch. `005/spec.md` does include one fixture-level `skippedShortCasual.json`, but that is narrower than the full skip matrix mandated by 004. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:99-102] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:171-172] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:105-115] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]

## Coverage check against wave-2 X5 adversarial prompts

Wave-2 X5 explicitly says the live integrity risk is **metalinguistic skill-name bias in raw prompt text**, and the required mitigations include prompt normalization plus metalinguistic-skill-name suppression before the renderer enforces a whitelist-only visible surface. The current 200-prompt corpus has no instruction-shaped prompts and no skill-slug-poisoning prompts, so it does not stress the X5 attack class that justified 004's normalization/suppression rules. `005/spec.md` already covers one renderer-side Unicode/instruction-shaped **label** fixture, but that is a repository-authored label attack, not a user-prompt poisoning fixture. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/research-extended.md:58-60] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:28-30] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:36-38] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:107-115] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]

## Findings

### P1

1. **The 200-prompt corpus is not sufficient to validate 004's full prompt-policy contract.** `004` makes skip-policy behavior part of the producer surface, but `005 §3.4` currently binds the hard gate to a corpus that contains none of the required skip prompts. Keep the 200-prompt parity lane, but add supplemental non-parity fixtures for `empty`, `/help`, `/clear`, `/exit`, `/quit`, and at least one short casual acknowledgement so the hard gate covers both fire-path parity and skip-path correctness. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:99-102] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:171-172] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:131-142] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]
2. **The corpus misses the wave-2 X5 prompt-poisoning class.** Wave-2's adversarial result hinges on prompts that mention or negate skill names without genuinely invoking them, but the current corpus lacks those metalinguistic cases. Add targeted fixtures such as `quotedSkillReference.json`, `negatedSkillMention.json`, and `instructionShapedPromptInput.json` so 005 can validate the producer's normalization/suppression boundary without reopening architecture or changing the 200-line routing corpus. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/research-extended.md:58-60] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:28-30] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:36-38] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]

### P2

1. **`005 §3.4`'s 100% top-1 parity gate is realistic for the current corpus and does not need a flaky-prompt tolerance.** The existing 200 prompts are all fire-path classification samples, and the hook path in 005 is defined as a parity check against the same direct CLI baseline with only a tiny `±0.001` confidence tolerance. The problem is not flakiness; the problem is scope. If the gate remains limited to the existing routing corpus, 100% top-1 parity is a reasonable invariant. If skip/adversarial prompts are later added, they should be checked as separate outcome classes (`skipped` / sanitization-blocked) instead of weakening the parity threshold. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:133-142] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:204-205] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]

## Recommended fixture additions

1. `emptyPrompt.json`
2. `slashHelp.json`
3. `slashClear.json`
4. `slashExit.json`
5. `slashQuit.json`
6. `shortCasualAck.json` (or expand the existing `skippedShortCasual.json` lane to cover the whole casual bucket explicitly)
7. `quotedSkillReference.json`
8. `negatedSkillMention.json`
9. `instructionShapedPromptInput.json`

## Direct answers

- **Does 019/004's corpus currently cover the six requested buckets?** Yes; counts are `32/32/32/32/36/36`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]
- **Does it include X5 adversarial prompts?** No. The missing class is user-prompt adversarial input: instruction-shaped text and metalinguistic skill-name-poisoning prompts. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/research-extended.md:58-60] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]
- **Does it cover 004's skip classes?** No. Those classes are absent from the corpus and need supplemental fixtures if 005 is meant to validate the whole producer policy. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:99-102] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-200]
- **Should 005 tolerate known flaky prompts instead of demanding 100% top-1 parity?** No. Keep 100% for the current 200 fire-path prompts; add separate supplemental fixtures for skip/adversarial outcomes rather than weakening the hard gate. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:133-142] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:204-205]
