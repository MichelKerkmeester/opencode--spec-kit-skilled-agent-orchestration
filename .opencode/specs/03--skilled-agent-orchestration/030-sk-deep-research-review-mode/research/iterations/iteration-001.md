# Iteration 1: Q1 Canonical Source-of-Truth Mapping

## Focus
Map all current locations where review-mode definitions live, identify how drift occurs, and recommend a single-source propagation model for YAML workflows, docs, agents, and playbooks.

## Findings
1. The runtime contract is duplicated in two parallel workflow files, and each file independently defines the same review-mode taxonomy: target types, review dimensions, synthesis sections, verdicts, convergence metadata, and appendix constants. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:30-31] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:511-559] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:657-666] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml:30-31] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml:612-660] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml:750-759]
2. Agent instructions duplicate core runtime semantics instead of importing them. Both `deep-review` variants restate the JSONL schema, severity-weighted `newFindingsRatio` formula, the P0 override rule, and the dimension-driven execution model, which means any taxonomy change must be hand-applied in multiple runtime profiles. [SOURCE: .opencode/agent/deep-review.md:229-258] [SOURCE: .opencode/agent/chatgpt/deep-review.md:231-260]
3. User-facing docs also restate the same contract in multiple places. The command entrypoint summarizes review parameters, verdicts, and report output; the quick reference republishes verdict rules, convergence guards, and report sections; the README republishes the 7 dimensions, verdicts, convergence weights, and report expectations; and the changelog freezes another snapshot of the same taxonomy. [SOURCE: .opencode/command/spec_kit/deep-research.md:212-242] [SOURCE: .opencode/command/spec_kit/deep-research.md:288-290] [SOURCE: .opencode/command/spec_kit/deep-research.md:390-394] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:258-296] [SOURCE: .opencode/skill/sk-deep-research/README.md:48-54] [SOURCE: .opencode/skill/sk-deep-research/README.md:336-342] [SOURCE: .opencode/changelog/12--sk-deep-research/v1.2.0.0.md:27-37] [SOURCE: .opencode/changelog/12--sk-deep-research/v1.2.0.0.md:69-95]
4. Drift is not hypothetical; review-mode support already required manual consistency sweeps and playbook audits to catch taxonomy mismatches. Documented examples include a previously stale `reviewTargetType` taxonomy, a dimension-order contradiction, a `:review` description mismatch, missing cross-reference protocol anchors outside YAML, and a report-section schema disagreement between `state_format.md` and the YAML synthesis step. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave1.md:44] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave1.md:74] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave1.md:121] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave2.md:63] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave2.md:84] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave2.md:103-104] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave3.md:53-59] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave3.md:196-197]
5. Even after repairs, there are still multiple normative copies of the same contract. `state_format.md` carries its own review-report section list and verdict wording, while `loop_protocol.md` separately carries dimension order, the 6 cross-reference protocols, and synthesis verdict rules, and also explicitly defers report generation back to `state_format.md`. This creates layered transitive dependencies rather than a single canonical contract. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:538] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:559-575] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:556] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:626] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:678-687]
6. The repo already has a native propagation precedent: `system-spec-kit` separates composition inputs from operational outputs and requires `scripts/templates/compose.sh` to regenerate the maintained templates after changing the canonical parts. That is the clearest in-repo model for review-mode propagation. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:104] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:114] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:55-70]
7. Best-fit recommendation: introduce a neutral review-mode contract manifest and generate downstream artifacts from it. The manifest should own dimensions, verdicts, target types, report sections, convergence defaults and guard definitions, cross-reference protocols, and shared JSONL field names. Generated outputs should include YAML appendix blocks or full review workflows, the deep-review agent taxonomy blocks for each runtime, quick-reference tables, README snippets, and playbook/source-anchor fixtures. This is an inference from the current duplication map and the existing `compose.sh` composition pattern. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:30-31] [SOURCE: .opencode/agent/deep-review.md:229-258] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:258-296] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:55-70]
8. YAML should not be the canonical source by itself. The workflow files are excellent runtime consumers, but they are a poor authoring surface for cross-runtime agent docs, report catalogs, and playbook anchors; using YAML as the only source would still force parsers or hand-copied prose everywhere else. A neutral manifest plus generated blocks fits the repo better than YAML-only canon or manual sync. This is an inference from the current spread of definitions across workflow, agent, reference, README, changelog, and playbook files. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:511-559] [SOURCE: .opencode/agent/chatgpt/deep-review.md:231-260] [SOURCE: .opencode/skill/sk-deep-research/README.md:48-54] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave3.md:53-59]

## Ruled Out
- Manual synchronization plus occasional consistency sweeps is not sufficient as the primary control; the repo already needed multiple playbook waves and consistency audits to catch drift after implementation. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave1.md:175-179] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/consistency-sweep-checks-1-4.md:29-48]
- YAML-only canon is not a good fit because review definitions are consumed by runtime workflows, agent docs, reference docs, README material, and playbook fixtures, not just by the workflow engine. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:30-31] [SOURCE: .opencode/agent/deep-review.md:229-258] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:258-296]

## Dead Ends
- CocoIndex semantic search returned no useful hits for this markdown-heavy contract-mapping task, so exact `rg` searches were needed to build the source map.

## Sources Consulted
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/agent/deep-review.md`
- `.opencode/agent/chatgpt/deep-review.md`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/README.md`
- `.opencode/changelog/12--sk-deep-research/v1.2.0.0.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave1.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave2.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/playbook-results-wave3.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/consistency-sweep-checks-1-4.md`

## Assessment (newInfoRatio, questions addressed/answered)
- `newInfoRatio`: `0.74`
- Addressed: `Q1`
- Answered this iteration: `Q1` is partially answered. The repo-wide duplication map is complete, the dominant drift mechanisms are identified, and there is a concrete recommendation to use a neutral review-mode contract manifest plus generation. The remaining gap is the exact schema shape and ownership boundaries for each generated artifact.

## Reflection (what worked/failed and why)
- Worked: targeted `rg` searches across the workflow, agent, reference, README, changelog, and scratch audit files quickly exposed both the normative copies and the prior drift incidents.
- Worked: re-reading the scratch playbook and consistency sweep files was especially valuable because they showed not just where definitions live, but which mismatches have already burned engineering time.
- Failed: semantic code search did not help on this markdown-heavy problem space, likely because the contract lives mostly in prose/config assets rather than executable code.
- Failed: broad repository-wide grep was noisy until narrowed to the review-mode file set.

## Recommended Next Focus
Specify the exact review-mode contract manifest and generation workflow:
1. Define the canonical schema keys for dimensions, verdicts, target types, report sections, convergence guards, and cross-reference protocols.
2. Decide which artifacts become fully generated vs mixed authored/generated with fenced markers.
3. Design a verification command that fails when generated YAML, agent docs, README snippets, quick-reference tables, or playbook anchors drift from the manifest.
