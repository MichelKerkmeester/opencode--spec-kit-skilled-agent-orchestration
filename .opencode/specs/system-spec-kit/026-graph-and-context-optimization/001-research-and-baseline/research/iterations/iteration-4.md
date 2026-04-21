# Iteration 4 - Q-B Capability matrix

## Method
- Inputs read: `scratch/deep-research-prompt-master-consolidation.md`, `research/deep-research-strategy.md`, `research/iterations/iteration-3.md`, selected phase outputs from `001` through `005`, and shipped Public baseline sources under `.opencode/skill/mcp-coco-index/`, `.opencode/skill/system-spec-kit/`, and `.opencode/README.md`.
- Scoring approach: applied the charter's 9-capability rubric with `0/1/2/-`, scored conservatively when current-turn proof was indirect, and treated `001 Settings` as a research artifact rather than a runtime product.
- Evidence rule: every score in `research/cross-phase-matrix.md` is justified in the per-capability rationale with at least one `[SOURCE: ...]` pointer.

## Scoring summary

| Capability | Top score | Dominant system | Public score | Public gap? |
|---|---:|---|---:|---|
| Code AST coverage | 2 | 004 Graphify | 1 | No |
| Multimodal support | 2 | 004 Graphify | 1 | No |
| Structural query | 2 | Public | 2 | No |
| Semantic query | 2 | Public | 2 | No |
| Memory / continuity | 2 | Public (tie 005) | 2 | No |
| Observability | 2 | Public (tie 005) | 2 | No |
| Hook integration | 2 | Public (tie 005) | 2 | No |
| License compatibility | 2 | 002 CodeSight (tie 004/005) | - | No |
| Runtime portability | 2 | 002 CodeSight | 1 | No |

## Surprises
- `001 Settings` ended up as an N/A-heavy column, which is the honest outcome once the rubric is applied to a Reddit field-report audit rather than a shipped runtime.
- `004 Graphify` is the clearest leader on AST and multimodal extraction, but it still loses structural-query dominance because its serve layer is text-only and less precise than Public's typed graph handlers.
- `005 Claudest` remains a strong continuity and observability reference, yet Public still edges it on breadth because Public already combines recovery, graph freshness, feedback, and telemetry in one shipped stack.
- `002 CodeSight` does not dominate retrieval, but it cleanly wins runtime portability against the current stack because it stays inside a simple MIT + Node lane.
- No "true gap" rows surfaced: every capability already has at least one system at score `2`, so Public's problem is composition and prioritization more than total capability absence.

## Handoff to iteration 5 (Q-A token honesty)
- Iteration 5 should reuse the matrix rows for **semantic query**, **structural query**, and **observability** first, because those rows explain which systems are actually reducing search cost versus just reframing it.
- The token-honesty table should cite this matrix when separating "measurement strength" from "capability strength"; Graphify and Contextador have strong ideas with weak token-proof, while Public and Claudest have the best observability foundations for honest measurement.
