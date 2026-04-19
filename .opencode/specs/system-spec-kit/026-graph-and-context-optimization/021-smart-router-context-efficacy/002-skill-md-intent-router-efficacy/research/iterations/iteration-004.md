# Iteration 004: V7 ON_DEMAND Keyword Coverage

## Focus Question(s)

V7 - do real prompts contain the ON_DEMAND keywords that would unlock deep resources?

## Tools Used

- Python extraction of `ON_DEMAND_KEYWORDS` and `LOADING_LEVELS["ON_DEMAND_KEYWORDS"]`
- Exact case-insensitive keyword matching over the 019/004 corpus

## Sources Queried

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- `.opencode/skill/*/SKILL.md`

## Findings

- The corpus contains 200 prompts.
- Across all skills, 28 unique ON_DEMAND trigger phrases were extracted.
- Only 11 of 200 prompts hit any ON_DEMAND phrase, a 5.5% prompt-level hit rate.
- Every observed hit came from `sk-code-review` terms, especially `deep review`; no CLI, MCP, doc, git, or prompt-improvement ON_DEMAND phrase appeared in this corpus.
- Many ON_DEMAND phrases are operator meta-requests such as `full reference`, `all templates`, `deep dive`, and `complete reference`; ordinary task prompts rarely say those exact phrases.
- Low trigger hit rate means ON_DEMAND tiers are unlikely to load unless users or orchestration prompts are trained to request them explicitly.

## Novelty Justification

This showed that ON_DEMAND is conservative in practice and may miss legitimate deep-context needs.

## New-Info-Ratio

0.72

## Next Iteration Focus

V4 intent classification accuracy on a 30-prompt sample.
