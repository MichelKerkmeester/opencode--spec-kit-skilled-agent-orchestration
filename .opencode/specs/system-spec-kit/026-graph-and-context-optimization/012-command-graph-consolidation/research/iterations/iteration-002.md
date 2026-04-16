# Iteration 002 — Focus: Q6 Safest Post-Synthesis `spec.md` Write-Back Contract

## Focus
Determine the safest post-synthesis `spec.md` write-back contract for this packet by comparing anchor-bounded append-only, fenced addendum, and constrained anchor updates, using local command/YAML evidence plus document-mutator precedents from pre-training knowledge (`remark`/`unified`, `markdown-it`, `mdast-util`, and marker-based generated-block workflows).

## Findings
1. Full anchor rewriting is the least safe option in this repo. The command workflow treats `spec.md` as a canonical template whose required anchors and headers must be preserved in order, with strict validation expected to stop on template drift. The current strategy file already marks wholesale rewriting of user-authored `spec.md` sections as an exhausted direction. Pre-training precedent from `remark`/`unified` and `mdast-util` supports the same conclusion: AST tooling is reliable for bounded node transforms, but not for semantically re-authoring mixed human and machine prose when no explicit ownership range exists. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:544-571] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md:112-125] [SOURCE: pre-training knowledge - remark/unified and mdast-util bounded AST transforms]
2. Plain anchor-bounded append is safer than rewrite, but it is not sufficient by itself for post-synthesis summaries because anchors here are mainly retrieval and template boundaries, not machine-owned replacement ranges. `/memory:save` documents anchors as paired extraction markers, while the strongest local idempotent mutator contract (`review_mode_contract.yaml`) uses separate `BEGIN GENERATED` and `END GENERATED` sentinels plus explicit `idempotent: true`. Pre-training precedent from `markdown-it` token pipelines and marker-based note-generation patterns points the same way: section anchors help locate content, but deterministic re-generation needs a dedicated replaceable span. [SOURCE: .opencode/command/memory/save.md:146-148] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:9-13] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:172-176] [SOURCE: pre-training knowledge - markdown-it token streams and marker-based generated blocks]
3. The safest post-synthesis contract is a fenced generated addendum nested inside a stable existing host anchor, not a free-floating append and not a whole-anchor rewrite. The packet spec already expects post-synthesis to add findings "without overwriting user-authored content" and explicitly calls for a "clearly-fenced new section" to mitigate trust violations. The review-mode contract is the closest local mutator precedent: generated content is bracketed by explicit begin/end markers, declared mixed-ownership, and regenerated idempotently from a source-of-truth contract. Inference: deep-research should reserve one machine-owned subsection inside the chosen `spec.md` anchor and replace only that fenced block on rerun. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:143-145] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:158-160] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:9-13] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:355-372]
4. Constrained anchor updates remain useful, but only for narrow pre-init insertions, not as the main post-synthesis sink. The current spec already separates the two mutation shapes: pre-init adds the topic to Open Questions, while post-synthesis writes a research findings summary. That split matches document-mutator precedent from `remark`/`unified`: targeted insertions are good for single bullets or notes, but evolving synthesized output should replace its prior machine-owned summary rather than accumulate append-only text forever. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:143-145] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:158-160] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:568-571] [SOURCE: pre-training knowledge - remark/unified targeted node insertion]
5. Inference: the concrete safest write-back contract for Q6 is `host anchor + generated fence + fail-closed replacement`. A practical shape would be a `### Research Findings Sync (generated)` subsection inside `<!-- ANCHOR:risks -->`, with only the subsection body wrapped in stable markers such as `<!-- BEGIN GENERATED: deep-research/spec-findings -->` and `<!-- END GENERATED: deep-research/spec-findings -->`, plus a backlink to `research/research.md`. On rerun, the workflow should replace only the exact fenced span after exact marker match; if markers are missing, duplicated, or manually altered, it should stop and emit the required `spec_mutation` audit record instead of diff-rewriting adjacent prose. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:158-160] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:172-176] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:355-372] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md:112-125]

## Ruled Out
- Full rewrite of any existing `spec.md` anchor body during post-synthesis.
- Pure append-only findings inside an existing anchor without machine-owned generated markers.
- Adding a new primary top-level generated section ahead of canonical anchored sections when the existing template/validator contract expects the required anchors and headers to stay in order.

## Dead Ends
- `rg -n "ANCHOR:" .opencode/skill/ .opencode/command/ --type md` surfaced many anchor examples, but most were retrieval or documentation patterns rather than direct write-back contracts.
- `rg -n "spec.md" .opencode/command/spec_kit/assets/*.yaml` mostly exposed template-loading and strict-validation constraints, not a ready-made `spec.md` mutation implementation.

## Sources
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-001.md`
- `.opencode/command/memory/save.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
- Pre-training knowledge: `remark` / `unified`
- Pre-training knowledge: `markdown-it`
- Pre-training knowledge: `mdast-util`
- Pre-training knowledge: marker-based generated-block workflows such as Obsidian/Dataview-style inserts

## Assessment
- `newInfoRatio`: `0.46`
- Questions addressed: `Q6`, `Q3`, `Q5`
- Questions answered: `Q6`

## Reflection
- What worked: comparing anchor syntax guidance with the generated-marker contract cleanly separated location boundaries from ownership/idempotency boundaries.
- What failed: the repo does not expose a direct `spec.md` mutator precedent, so the recommendation had to be inferred from adjacent generated-content contracts rather than copied from an existing command.
- What to do differently: the next pass should convert this contract into explicit acceptance criteria and edge-case handling for marker-missing, duplicate-marker, and human-edited-block scenarios.

## Next Focus
Q3/Q5 — formalize rollback, duplicate-marker handling, and parallel-session edge cases for the recommended fence-based `spec.md` mutation contract.
