# Iteration 8: Q7 Integration with `@review` and `sk-code-review`

## Focus
Determine how `@deep-review` should integrate with the existing `@review` agent and `sk-code-review` skill so the deep-review loop reuses the baseline reviewer contract without duplicating rubric, severity, and overlay logic. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:32] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:135]

## Current Integration Snapshot
1. `@review` is already the generic single-pass reviewer: it is read-only, LEAF-only, must load the `sk-code` baseline plus exactly one `sk-code-*` overlay, applies severity-ranked findings, and can feed orchestrator quality gates. [SOURCE: .opencode/agent/review.md:30-32] [SOURCE: .opencode/agent/review.md:38-40] [SOURCE: .opencode/agent/review.md:46-57] [SOURCE: .opencode/agent/review.md:75-80] [SOURCE: .opencode/agent/review.md:104-109]
2. `@deep-review` is positioned as a hybrid of `@review` and `@deep-research`, but today it carries its own review workflow, scorecard schema, severity section, and scratch-state responsibilities instead of explicitly reusing the baseline review contract. [SOURCE: .opencode/agent/deep-review.md:28-32] [SOURCE: .opencode/agent/deep-review.md:46-58] [SOURCE: .opencode/agent/deep-review.md:122-146] [SOURCE: .opencode/agent/deep-review.md:149-213]
3. `sk-code-review` is the intended stack-agnostic review baseline and already defines the baseline+overlay precedence model, but one of its always-loaded references still carries single-pass UX assumptions and a `P0-P3` severity table that diverges from the `P0-P2` model in `@review` and `@deep-review`. [SOURCE: .opencode/skill/sk-code-review/SKILL.md:49-100] [SOURCE: .opencode/skill/sk-code-review/references/quick_reference.md:29-52] [SOURCE: .opencode/skill/sk-code-review/references/quick_reference.md:88-98] [SOURCE: .opencode/agent/review.md:134-140] [SOURCE: .opencode/agent/deep-review.md:125-146]

## Findings
### 1. The real overlap is review doctrine, not execution mode
`@review` and `@deep-review` overlap on the parts that should be shared: findings-first output, evidence-backed severity classification, adversarial checking for serious findings, and baseline+overlay review standards. They complement each other on execution mode: `@review` is a single-pass reviewer for PR/pre-commit/file/gate use, while `@deep-review` is the per-iteration evidence collector inside an autonomous loop with externalized state. [SOURCE: .opencode/agent/review.md:46-57] [SOURCE: .opencode/agent/review.md:104-150] [SOURCE: .opencode/agent/deep-review.md:24-32] [SOURCE: .opencode/agent/deep-review.md:46-58]

Recommended boundary:
- Shared: severity semantics, evidence requirements, findings schema, baseline+overlay precedence, baseline security/correctness minimums.
- `@review`-only: standalone mode selection, PR/pre-commit UX, optional numeric gate adapter.
- `@deep-review`-only: dimension queue execution, scratch artifact emission, convergence-facing metadata, and loop-specific traceability/adjudication extensions.

### 2. Direct agent-to-agent invocation is the wrong coupling point
Neither agent should invoke the other. Both are explicitly LEAF-only, and wiring reuse through nested dispatch would turn a contract-sharing problem into a runtime orchestration dependency. The correct integration point is a shared review-core contract plus orchestrator-mediated handoff when one mode wants to reuse another mode's output. [SOURCE: .opencode/agent/review.md:36-40] [SOURCE: .opencode/agent/deep-review.md:36-42] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:20-23] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:68-77]

Recommended flow:
- Optional preflight: orchestrator may run one `@review` pass before iteration 1 to seed hotspots and candidate findings.
- Main loop: orchestrator dispatches `@deep-review` iterations using the same shared review-core contract.
- Optional calibration: orchestrator may run a final `@review` comparator pass after convergence to catch any baseline-review misses.

### 3. `sk-code-review` should own the shared review-core contract, but not all of its current UX rules belong in deep review
`sk-code-review` is already the baseline review skill and should become the source of truth for shared doctrine. However, its quick reference mixes reusable review rules with human-interaction behavior such as "ask user what to do next before writing code" and a `P0-P3` table. Those are fine for interactive single-pass review, but they should not leak unchanged into autonomous deep review. [SOURCE: .opencode/skill/sk-code-review/SKILL.md:12-13] [SOURCE: .opencode/skill/sk-code-review/SKILL.md:49-100] [SOURCE: .opencode/skill/sk-code-review/references/quick_reference.md:21-22] [SOURCE: .opencode/skill/sk-code-review/references/quick_reference.md:50-52] [SOURCE: .opencode/skill/sk-code-review/references/quick_reference.md:90-97]

Recommended split inside `sk-code-review`:
- `review-core`: machine- and agent-consumable contract for severities, evidence requirements, findings order, overlay precedence, and baseline checks.
- `review-ux-single-pass`: human-facing report flow, next-step options, and mode-specific presentation for `@review`.
- `review-risk-pack`: existing checklists and overlays consumed by both modes.

### 4. The current deep-review scorecard and severity text are duplication hot spots
`@deep-review` currently embeds its own scorecard columns, dimension-specific strategies, and severity ladder, while `@review` already carries a general rubric and `sk-code-review` carries baseline review references. That is enough duplication to drift. The strongest example is severity: `@review` and `@deep-review` use `P0/P1/P2`, while the always-loaded quick reference still documents `P0/P1/P2/P3`. [SOURCE: .opencode/agent/review.md:113-150] [SOURCE: .opencode/agent/deep-review.md:106-146] [SOURCE: .opencode/agent/deep-review.md:162-190] [SOURCE: .opencode/skill/sk-code-review/references/quick_reference.md:88-98]

Recommended change:
- Remove rubric/severity duplication from `@deep-review` where possible and replace it with "load review-core, then apply deep-review extensions."
- Treat any remaining deep-review-only constructs as extensions: convergence metadata, traceability checks, claim-adjudication packets, and scratch output schema.
- Normalize severity to one canonical ladder before wiring the systems together.

### 5. Deep-review dimensions should compose with overlays, not compete with them
The baseline skill already says one overlay is selected for stack-specific style, build, test, and process conventions. Deep review should consume that same overlay selection once, then apply review-mode dimensions on top of it. In other words, overlays answer "what standards apply to this stack," while deep-review dimensions answer "which investigative lens is active in this iteration." [SOURCE: .opencode/skill/sk-code-review/SKILL.md:49-100] [SOURCE: .opencode/agent/review.md:48-49] [SOURCE: .opencode/agent/review.md:75-80] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:64-66]

Recommended interaction model:
- Baseline+overlay load once per review target.
- Iteration dimension selects which subset of the shared checks to emphasize.
- Review-only traceability protocols remain a deep-review extension layer, especially for spec/code/checklist/agent parity work.

### 6. A unified review model is feasible if it separates core contract, execution profile, and state flow
The repo can support both use cases with one shared model:
1. Review Core Contract: owned by `sk-code-review`, containing canonical severities, evidence rules, output ordering, overlay precedence, and baseline check families.
2. Execution Profile: `single-pass` (`@review`) or `iterative` (`@deep-review`).
3. Orchestration Layer: standalone report/gate output for `@review`; convergence, dedupe, planning packet, and scratch-state flow for deep review.

Data flow recommendation:
- `sk-code-review review-core` -> loaded by `@review` and `@deep-review`.
- Overlay selection -> shared once for the active target.
- `@review` output -> optional orchestrator seed packet with `origin = review-baseline`.
- `@deep-review` output -> typed iteration finding packets with `origin = deep-review-iteration`.
- Orchestrator -> deduped finding registry, severity adjudication, convergence signals, final `review-report.md`.

[INFERENCE: This preserves `@review` as the fast baseline reviewer, preserves `@deep-review` as the loop specialist, and moves reuse to the doctrine/data-contract layer where drift can actually be controlled.]

## Recommended Changes
1. Make `sk-code-review` the owner of a shared `review-core` contract consumed by both `@review` and `@deep-review`.
2. Keep `@review` and `@deep-review` separate execution profiles; do not allow direct nested invocation in either direction.
3. Refactor `@deep-review` to reference shared baseline+overlay doctrine instead of restating rubric and severity tables inline.
4. Split interactive single-pass UX guidance out from autonomous-loop doctrine inside `sk-code-review`.
5. Canonicalize the severity ladder before integration; the current `P0-P3` quick reference vs `P0-P2` agent docs is drift, not a feature.
6. Let the orchestrator exchange packets between the modes through typed seed/calibration outputs instead of ad hoc prose reuse.

## Ruled Out
- Having `@deep-review` invoke `@review` directly.
- Having `@review` invoke `@deep-review` to "go deeper."
- Copying the full review rubric and severity contract into `@deep-review` as a second long-lived source of truth.
- Reusing interactive single-pass instructions such as "ask user what to do next" inside the autonomous deep-review loop.

## Sources Consulted
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-config.json`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-state.jsonl`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/iterations/iteration-007.md`
- `.opencode/agent/review.md`
- `.opencode/agent/deep-review.md`
- `.opencode/skill/sk-code-review/SKILL.md`
- `.opencode/skill/sk-code-review/references/quick_reference.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`

## Assessment
- `newInfoRatio`: `0.34`
- Addressed: `Q7`
- Answered this iteration: `Q7`. This iteration added a concrete integration boundary, identified an internal baseline drift (`P0-P2` vs `P0-P3` plus interactive-only UX rules), and defined orchestrator-mediated packet sharing as the safe reuse path instead of nested agent calls.

## Reflection
- Worked: comparing agent definitions with the always-loaded quick reference exposed the most important integration risk faster than reading agent docs alone.
- Worked: separating doctrine reuse from execution-mode reuse clarified that the systems should share contracts, not call each other.
- Failed: treating `@review` and `sk-code-review` as interchangeable would have hidden the fact that the skill currently mixes reusable baseline doctrine with single-pass user-interaction behavior.
- Caution: if Q1's canonical manifest is implemented, `review-core` should become a generated or verified derivative of that manifest rather than a second independent schema.

## Recommended Next Focus
Synthesis: consolidate Q1-Q7 into one implementation roadmap that defines canonical review-contract ownership, generated artifacts, migration order, and the minimum set of changes needed across YAML, agents, skills, and report/output schemas.
