# Iteration 68 - maintainability - skill-assets-remainder

## Dispatcher
- iteration: 68 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:17:01.037Z

## Files Reviewed
- `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md`
- `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md`
- `.opencode/skill/sk-doc/assets/flowcharts/approval_workflow_loops.md`
- `.opencode/skill/sk-doc/assets/flowcharts/decision_tree_flow.md`
- `.opencode/skill/sk-doc/assets/flowcharts/parallel_execution.md`
- `.opencode/skill/sk-doc/assets/flowcharts/simple_workflow.md`
- `.opencode/skill/sk-doc/assets/flowcharts/system_architecture_swimlane.md`
- `.opencode/skill/sk-doc/assets/flowcharts/user_onboarding.md`
- `.opencode/skill/sk-doc/assets/skill/skill_asset_template.md`
- `.opencode/skill/sk-doc/assets/skill/skill_md_template.md`
- `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md`
- `.opencode/skill/sk-git/assets/commit_message_template.md`
- `.opencode/skill/sk-git/assets/pr_template.md`
- `.opencode/skill/sk-git/assets/worktree_checklist.md`
- `.opencode/skill/sk-improve-agent/assets/improvement_charter.md`
- `.opencode/skill/sk-improve-agent/assets/improvement_config_reference.md`
- `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md`
- `.opencode/skill/sk-improve-prompt/assets/cli_prompt_quality_card.md`
- `.opencode/skill/sk-improve-prompt/assets/format_guide_json.md`
- `.opencode/skill/sk-improve-prompt/assets/format_guide_markdown.md`
- `.opencode/skill/sk-improve-prompt/assets/format_guide_yaml.md`
- `.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md`
- `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md`
- `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md`
- `.opencode/skill/system-spec-kit/assets/template_mapping.md`

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Broken Level 1 copy command in `template_mapping.md`.**  
   The Level 1 "ready-to-use" command block copies `spec.md` into `###-name/spec.md` instead of `specs/###-name/spec.md`, while the same section's other commands target `specs/###-name/...`. An agent following the published block from repo root will fail on the very first copy step because the destination path is inconsistent with both Step 3 folder creation and the rest of the block. Evidence: `.opencode/skill/system-spec-kit/assets/template_mapping.md:106-112`.

   ```json
   {
     "claim": "The Level 1 copy block in template_mapping.md publishes a broken destination path for spec.md.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/assets/template_mapping.md:106-112"
     ],
     "counterevidenceSought": "Looked for a preceding step that changes cwd into a sibling `###-name/` directory or a separate wrapper that materializes that path before the copy block runs.",
     "alternativeExplanation": "This may be a one-line typo copied forward from an earlier template block rather than an intentional path convention.",
     "finalSeverity": "P1",
     "confidence": 0.98,
     "downgradeTrigger": "Downgrade if a nearby instruction explicitly requires running the block from inside a pre-created `###-name/` directory and that contract is made unambiguous."
   }
   ```

2. **`complexity_decision_matrix.md` advertises a non-existent repo-root create command.**  
   Section 8 tells operators to run `./scripts/spec/create.sh ...`, but the repository has no `scripts/spec/create.sh` at the root; the live script is under `.opencode/skill/system-spec-kit/scripts/spec/create.sh`. Because this asset is a quick-reference command surface, the published command fails as written in the repository root environment it documents. Evidence: `.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:206-221`; `.opencode/skill/system-spec-kit/SKILL.md:95-112`; repo scan confirmed only `.opencode/skill/system-spec-kit/scripts/spec/create.sh` exists.

   ```json
   {
     "claim": "complexity_decision_matrix.md exposes a broken create-spec command path.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:206-221",
       ".opencode/skill/system-spec-kit/SKILL.md:95-112"
     ],
     "counterevidenceSought": "Checked for a repo-root `scripts/spec/create.sh` wrapper or mirror script and found none.",
     "alternativeExplanation": "The author may have assumed a cwd inside the skill package, but the asset does not state that assumption and presents the commands as generic CLI quick-reference commands.",
     "finalSeverity": "P1",
     "confidence": 0.95,
     "downgradeTrigger": "Downgrade if a documented bootstrap step guarantees execution from inside `.opencode/skill/system-spec-kit/` before these commands are used."
   }
   ```

### P2 Findings
- **Stale continuity contract in `level_decision_matrix.md`.** The `ANCHORS_VALID` rule still says it applies to levels with `memory/` folders and describes semantic indexing in `memory/` artifacts, but current continuity guidance has moved to canonical surfaces such as `_memory.continuity` in `implementation-summary.md`. Evidence: `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md:235-239`.
- **The sk-doc skill-template assets teach the anchor convention with self-contradictory examples.** Each file says `<!-- ANCHOR:... -->` markers are required immediately before H2 sections, but the example blocks under that instruction omit the anchor comments entirely, which makes the example misleading for authors using the asset literally. Evidence: `.opencode/skill/sk-doc/assets/skill/skill_asset_template.md:124-142`; `.opencode/skill/sk-doc/assets/skill/skill_md_template.md:104-123`; `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md:51-69`.

## Traceability Checks
- **Cross-runtime consistency:** Reviewed assets are mostly single-source docs, so no `.claude/` vs `.opencode/` vs `.codex/` vs `.gemini/` mirror divergence surfaced in this subset.
- **Skill↔code alignment:** `template_mapping.md` and `complexity_decision_matrix.md` drift from the live system-spec-kit filesystem/command layout, so agents loading these quick-reference assets can be pointed at failing commands.
- **Command↔implementation alignment:** Most reviewed assets remain present and loadable; the material issues were inaccurate command strings and stale continuity guidance rather than missing asset files.

## Confirmed-Clean Surfaces
- `sk-doc` playbook templates: `manual_testing_playbook_snippet_template.md`, `manual_testing_playbook_template.md`
- `sk-doc` flowchart assets: `approval_workflow_loops.md`, `decision_tree_flow.md`, `parallel_execution.md`, `simple_workflow.md`, `system_architecture_swimlane.md`, `user_onboarding.md`
- `sk-git` assets: `commit_message_template.md`, `pr_template.md`, `worktree_checklist.md`
- `sk-improve-agent` assets: `improvement_charter.md`, `improvement_config_reference.md`, `improvement_strategy.md`
- `sk-improve-prompt` assets: `cli_prompt_quality_card.md`, `format_guide_json.md`, `format_guide_markdown.md`, `format_guide_yaml.md`
- `system-spec-kit` assets otherwise aligned in this pass: `parallel_dispatch_config.md`

## Next Focus
- Iteration 69 should use the final operational-doc pass to check any remaining runtime-loaded docs for repeated command-surface drift, especially quick-reference entry points and mirror-facing assets.
