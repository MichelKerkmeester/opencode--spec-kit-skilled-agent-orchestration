# Iteration 005: V4 Intent Classification Sample

## Focus Question(s)

V4 - sample 30 prompts from the 019/004 corpus and run keyword-weight scoring against the labeled top skill.

## Tools Used

- Python deterministic scoring over extracted intent dictionaries
- Backtick path extraction for file-extension shortcuts in `sk-code-opencode`

## Sources Queried

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- `.opencode/skill/sk-code-opencode/SKILL.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/sk-code-review/SKILL.md`
- `.opencode/skill/sk-deep-research/SKILL.md`

## Findings

- The first 30 corpus prompts included 26 prompts with a concrete labeled top skill and 4 prompts labeled `none`.
- Of the 26 scored prompts, 17 produced a non-UNKNOWN router result, for a 65.4% non-UNKNOWN rate.
- File-extension routing is strong for `sk-code-opencode`: `.ts`, `.py`, and `.json` prompts route cleanly when a path is present.
- Documentation and review prompts are weaker: `sk-doc` and `sk-code-review` often returned UNKNOWN for natural phrases like "document", "audit", "compare", and "review" because those words are not always in the internal intent keyword lists.
- `system-spec-kit` sometimes routes broadly but not precisely; for example `implementation-summary.md` in a phase prompt scored `PHASE` above `IMPLEMENT`.
- This is moderate evidence, not a final accuracy benchmark, because "correct intent" is subjective for multi-purpose skills and the corpus labels skill choice rather than resource-intent choice.

## Novelty Justification

This produced the first semi-empirical classifier signal and identified UNKNOWN-heavy skill families.

## New-Info-Ratio

0.65

## Next Iteration Focus

V3 observational log scan.
