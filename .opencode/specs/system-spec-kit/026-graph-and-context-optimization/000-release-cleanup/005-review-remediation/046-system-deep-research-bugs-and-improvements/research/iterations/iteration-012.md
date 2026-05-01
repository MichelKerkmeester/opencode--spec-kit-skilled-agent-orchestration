# Iteration 012 — C2: Scorer fusion accuracy on edge cases

## Focus
Audited the Skill Advisor scorer fusion path for edge cases around ambiguity ties, near-duplicate projections, graph conflict handling, and adversarial trigger phrases. The main path reviewed was `scoreAdvisorPrompt()` plus its projection and lane inputs.

## Actions Taken
- Enumerated scorer files with `rg --files` under `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/`.
- Read `fusion.ts`, `projection.ts`, `ambiguity.ts`, `scoring-constants.ts`, `text.ts`, `weights-config.ts`, and scorer lane files.
- Checked scorer tests and stress fixtures around ambiguity and degenerate prompts.
- Ran `skill_advisor.py` on adversarial/multi-intent prompts to observe over-broad passing recommendations.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-012-C2-01 | P1 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts:89-90 | `scoreGraphCausalLane()` computes signed negative `conflicts_with` propagation, but final output filters to `value.score > 0`, so conflict evidence can only erase graph uplift and cannot penalize directly matching conflicting skills. In a prompt that matches two conflicting skills explicitly, fusion has no negative lane contribution to separate them. | Preserve negative graph contributions through the lane result and have `scoreAdvisorPrompt()` subtract them, or add a post-fusion conflict penalty across passing candidates before thresholding. |
| F-012-C2-02 | P1 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:146-147 | `projectionFromRow()` assigns the same `derivedTriggers` array to both `derivedTriggers` and `derivedKeywords`. `scoreDerivedLane()` later concatenates both arrays, so every derived phrase from SQLite projections is scored twice before capping. This inflates near-duplicate projections and stale generated metadata. | Keep `derivedKeywords` distinct from `derivedTriggers`, or dedupe the concatenated phrase list inside `scoreDerivedLane()` before scoring. Add a regression where one derived phrase appears in both fields and only contributes once. |
| F-012-C2-03 | P1 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:120-124 | `confidenceFor()` applies a task-intent floor of 0.82 when any write verb exists and direct or live-normalized evidence crosses a low floor. Combined with explicit token boosts, an adversarial prompt that lists many skill words can make many unrelated skills pass threshold at once. I observed `review code and git commit docs prompt figma chrome memory semantic search` returning eight passing skills. | Add a concentration/dispersion guard: if many unrelated skills pass from shallow token evidence, raise uncertainty, require an explicit workflow phrase, or emit ambiguity/UNKNOWN instead of broad pass-through. |
| F-012-C2-04 | P2 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts:9-12 | `isAmbiguousTopTwo()` only compares confidence for the first two passing recommendations. Fusion ranking, however, sorts by score plus command and primary-intent bonuses before confidence, so ambiguity can disagree with the actual ranking basis and ignores three-way or larger tie clusters. | Compute ambiguity from the same effective ranking score used by `scoreAdvisorPrompt()`, include score margin and confidence margin, and mark all passing candidates inside the tie cluster rather than only the first two. |

## Questions Answered
- Ambiguity ties are not modeled on the same score used for ranking; the current check is confidence-only and top-two-only.
- Near-duplicate generated projections can be amplified because projection maps the same derived phrase set into two scoring inputs.
- Adversarial trigger phrases can cause broad false-positive recommendations because token boosts plus the task-intent confidence floor let many skills pass simultaneously.
- Graph conflict edges are present in the lane model but are not carried into fusion as penalties.

## Questions Remaining
- Whether the Python advisor path still applies graph conflict penalties that the TypeScript scorer lacks, and whether parity requires moving that behavior into `fusion.ts`.
- Whether calibration fixtures contain multi-label tasks where several skills should intentionally pass, distinct from adversarial token stuffing.
- Whether command bridges should participate in ambiguity clustering differently from skills when slash commands are explicitly named.

## Next Focus
Follow-on C2 work should add a small fixture-projection test suite for conflict penalties, duplicate derived phrases, and token-stuffed prompts, then compare TypeScript and Python scorer parity on those same edge cases.
