# System Spec Kit Tree + README + Config Inventory

Scope: `.opencode/skill/system-spec-kit/`
Constraints applied:
- Excluded all `node_modules/` and `dist/` directories.
- Included `.opencode/skill/system-spec-kit/mcp_server/` as a leaf, without descending.

Totals:
- Tree nodes listed: 713
- README files inventoried: 34
- Config files inventoried: 15

## 1) Complete ASCII Tree Diagram

```text
.opencode/skill/system-spec-kit/
|-- assets/
|   |-- complexity_decision_matrix.md
|   |-- level_decision_matrix.md
|   |-- parallel_dispatch_config.md
|   `-- template_mapping.md
|-- config/
|   |-- config.jsonc
|   |-- filters.jsonc
|   `-- README.md
|-- constitutional/
|   |-- gate-enforcement.md
|   `-- README.md
|-- mcp_server/  [not descended]
|-- references/
|   |-- config/
|   |   `-- environment_variables.md
|   |-- debugging/
|   |   |-- troubleshooting.md
|   |   `-- universal_debugging_methodology.md
|   |-- memory/
|   |   |-- embedding_resilience.md
|   |   |-- epistemic_vectors.md
|   |   |-- memory_system.md
|   |   |-- save_workflow.md
|   |   `-- trigger_config.md
|   |-- structure/
|   |   |-- folder_routing.md
|   |   |-- folder_structure.md
|   |   |-- phase_definitions.md
|   |   `-- sub_folder_versioning.md
|   |-- templates/
|   |   |-- level_selection_guide.md
|   |   |-- level_specifications.md
|   |   |-- template_guide.md
|   |   `-- template_style_guide.md
|   |-- validation/
|   |   |-- decision_format.md
|   |   |-- five_checks.md
|   |   |-- path_scoped_rules.md
|   |   |-- phase_checklists.md
|   |   `-- validation_rules.md
|   `-- workflows/
|       |-- execution_methods.md
|       |-- quick_reference.md
|       |-- rollback_runbook.md
|       `-- worked_examples.md
|-- scripts/
|   |-- core/
|   |   |-- config.ts
|   |   |-- file-writer.ts
|   |   |-- index.ts
|   |   |-- memory-indexer.ts
|   |   |-- quality-scorer.ts
|   |   |-- README.md
|   |   |-- subfolder-utils.ts
|   |   |-- topic-extractor.ts
|   |   |-- tree-thinning.ts
|   |   `-- workflow.ts
|   |-- evals/
|   |   |-- collect-redaction-calibration-inputs.ts
|   |   |-- map-ground-truth-ids.ts
|   |   |-- run-ablation.ts
|   |   |-- run-bm25-baseline.ts
|   |   |-- run-chk210-quality-backfill.ts
|   |   |-- run-performance-benchmarks.ts
|   |   |-- run-phase1-5-shadow-eval.ts
|   |   |-- run-phase2-closure-metrics.mjs
|   |   |-- run-phase3-telemetry-dashboard.ts
|   |   |-- run-quality-legacy-remediation.ts
|   |   `-- run-redaction-calibration.ts
|   |-- extractors/
|   |   |-- collect-session-data.ts
|   |   |-- contamination-filter.ts
|   |   |-- conversation-extractor.ts
|   |   |-- decision-extractor.ts
|   |   |-- diagram-extractor.ts
|   |   |-- file-extractor.ts
|   |   |-- implementation-guide-extractor.ts
|   |   |-- index.ts
|   |   |-- opencode-capture.ts
|   |   |-- quality-scorer.ts
|   |   |-- README.md
|   |   `-- session-extractor.ts
|   |-- kpi/
|   |   `-- quality-kpi.sh
|   |-- lib/
|   |   |-- anchor-generator.ts
|   |   |-- ascii-boxes.ts
|   |   |-- content-filter.ts
|   |   |-- decision-tree-generator.ts
|   |   |-- embeddings.ts
|   |   |-- flowchart-generator.ts
|   |   |-- frontmatter-migration.ts
|   |   |-- git-branch.sh
|   |   |-- README.md
|   |   |-- semantic-summarizer.ts
|   |   |-- shell-common.sh
|   |   |-- simulation-factory.ts
|   |   |-- structure-aware-chunker.ts
|   |   |-- template-utils.sh
|   |   |-- topic-keywords.ts
|   |   `-- trigger-extractor.ts
|   |-- loaders/
|   |   |-- data-loader.ts
|   |   |-- index.ts
|   |   `-- README.md
|   |-- memory/
|   |   |-- ast-parser.ts
|   |   |-- backfill-frontmatter.ts
|   |   |-- cleanup-orphaned-vectors.ts
|   |   |-- generate-context.ts
|   |   |-- rank-memories.ts
|   |   |-- README.md
|   |   |-- reindex-embeddings.ts
|   |   `-- validate-memory-quality.ts
|   |-- ops/
|   |   |-- heal-index-drift.sh
|   |   |-- heal-ledger-mismatch.sh
|   |   |-- heal-session-ambiguity.sh
|   |   |-- heal-telemetry-drift.sh
|   |   |-- ops-common.sh
|   |   |-- README.md
|   |   `-- runbook.sh
|   |-- renderers/
|   |   |-- index.ts
|   |   |-- README.md
|   |   `-- template-renderer.ts
|   |-- rules/
|   |   |-- check-ai-protocols.sh
|   |   |-- check-anchors.sh
|   |   |-- check-complexity.sh
|   |   |-- check-evidence.sh
|   |   |-- check-files.sh
|   |   |-- check-folder-naming.sh
|   |   |-- check-frontmatter.sh
|   |   |-- check-level-match.sh
|   |   |-- check-level.sh
|   |   |-- check-links.sh
|   |   |-- check-phase-links.sh
|   |   |-- check-placeholders.sh
|   |   |-- check-priority-tags.sh
|   |   |-- check-section-counts.sh
|   |   |-- check-sections.sh
|   |   |-- check-template-source.sh
|   |   |-- check-toc-policy.sh
|   |   `-- README.md
|   |-- setup/
|   |   |-- check-native-modules.sh
|   |   |-- check-prerequisites.sh
|   |   |-- README.md
|   |   |-- rebuild-native-modules.sh
|   |   `-- record-node-version.js
|   |-- spec/
|   |   |-- archive.sh
|   |   |-- calculate-completeness.sh
|   |   |-- check-completion.sh
|   |   |-- check-placeholders.sh
|   |   |-- create.sh
|   |   |-- progressive-validate.sh
|   |   |-- README.md
|   |   |-- recommend-level.sh
|   |   |-- test-validation.sh
|   |   |-- upgrade-level.sh
|   |   `-- validate.sh
|   |-- spec-folder/
|   |   |-- alignment-validator.ts
|   |   |-- directory-setup.ts
|   |   |-- folder-detector.ts
|   |   |-- index.ts
|   |   `-- README.md
|   |-- templates/
|   |   |-- compose.sh
|   |   `-- README.md
|   |-- test-fixtures/
|   |   |-- 001-empty-folder/
|   |   |   `-- .gitkeep
|   |   |-- 002-valid-level1/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 002-valid-level2/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 004-valid-level3/
|   |   |   |-- checklist.md
|   |   |   |-- decision-record.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 002-unfilled-placeholders/
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 006-missing-required-files/
|   |   |   |-- plan.md
|   |   |   `-- tasks.md
|   |   |-- 004-valid-anchors/
|   |   |   |-- memory/
|   |   |   |   `-- context.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 008-invalid-anchors/
|   |   |   |-- memory/
|   |   |   |   `-- context.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 002-valid-priority-tags/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 006-valid-evidence/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 011-anchors-duplicate-ids/
|   |   |   |-- memory/
|   |   |   |   `-- context.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 012-anchors-empty-memory/
|   |   |   |-- memory/
|   |   |   |   `-- .gitkeep
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 013-anchors-multiple-files/
|   |   |   |-- memory/
|   |   |   |   |-- invalid.md
|   |   |   |   `-- valid.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 014-anchors-nested/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 015-anchors-no-memory/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 016-evidence-all-patterns/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 017-evidence-case-variations/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 018-evidence-checkmark-formats/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 004-evidence-p2-exempt/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 008-evidence-wrong-suffix/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 002-invalid-priority-tags/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 022-level-explicit/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 023-level-inferred/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 024-level-no-bold/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 025-level-out-of-range/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 026-level-zero/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 006-level2-missing-checklist/
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 011-level3-missing-decision/
|   |   |   |-- checklist.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 012-missing-checklist-sections/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 013-missing-decision-sections/
|   |   |   |-- checklist.md
|   |   |   |-- decision-record.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 031-missing-evidence/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 032-missing-plan/
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 033-missing-plan-sections/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 034-missing-spec-sections/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 035-missing-tasks/
|   |   |   |-- plan.md
|   |   |   `-- spec.md
|   |   |-- 036-multiple-placeholders/
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 037-placeholder-case-variations/
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 038-placeholder-in-codeblock/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 039-placeholder-in-inline-code/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 040-priority-context-reset/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 041-priority-inline-tags/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 042-priority-lowercase/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 043-priority-mixed-format/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 044-priority-p3-invalid/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 045-valid-sections/
|   |   |   |-- checklist.md
|   |   |   |-- decision-record.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 046-with-config/
|   |   |   |-- .speckit.yaml
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 047-with-extra-files/
|   |   |   |-- implementation-summary.md
|   |   |   |-- notes.md
|   |   |   |-- plan.md
|   |   |   |-- research.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 048-with-memory-placeholders/
|   |   |   |-- memory/
|   |   |   |   `-- context.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 049-with-rule-order/
|   |   |   |-- .speckit.yaml
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 050-with-scratch/
|   |   |   |-- scratch/
|   |   |   |   `-- temp-notes.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- 051-with-templates/
|   |   |   |-- templates/
|   |   |   |   `-- template.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   `-- README.md
|   |-- tests/
|   |   |-- fixtures/
|   |   |   |-- phase-2/
|   |   |   |   |-- error-cases/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- multi-phase/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- named-phases/
|   |   |   |   |   `-- fixture.json
|   |   |   |   `-- single-phase/
|   |   |   |       `-- fixture.json
|   |   |   |-- phase-detection/
|   |   |   |   |-- above-threshold/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- below-threshold/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- boundary/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- extreme-scale/
|   |   |   |   |   `-- fixture.json
|   |   |   |   `-- no-risk-factors/
|   |   |   |       `-- fixture.json
|   |   |   |-- phase-validation/
|   |   |   |   |-- broken-links/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- empty-child/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- flat-spec/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- mixed-levels/
|   |   |   |   |   `-- fixture.json
|   |   |   |   |-- one-phase/
|   |   |   |   |   `-- fixture.json
|   |   |   |   `-- three-phase/
|   |   |   |       `-- fixture.json
|   |   |   `-- generate-phase1-5-dataset.ts
|   |   |-- progressive-validation.vitest.d.ts.map
|   |   |-- progressive-validation.vitest.js
|   |   |-- progressive-validation.vitest.js.map
|   |   |-- progressive-validation.vitest.ts
|   |   |-- README.md
|   |   |-- test_dual_threshold.py
|   |   |-- test-alignment-validator.js
|   |   |-- test-ast-parser.js
|   |   |-- test-bug-fixes.js
|   |   |-- test-bug-regressions.js
|   |   |-- test-cleanup-orphaned-vectors.js
|   |   |-- test-embeddings-behavioral.js
|   |   |-- test-embeddings-factory.js
|   |   |-- test-export-contracts.js
|   |   |-- test-extractors-loaders.js
|   |   |-- test-five-checks.js
|   |   |-- test-fixtures
|   |   |-- test-folder-detector-functional.js
|   |   |-- test-frontmatter-backfill.js
|   |   |-- test-integration.js
|   |   |-- test-memory-quality-lane.js
|   |   |-- test-naming-migration.js
|   |   |-- test-phase-command-workflows.js
|   |   |-- test-phase-system.js
|   |   |-- test-phase-system.sh
|   |   |-- test-phase-validation.js
|   |   |-- test-retry-manager-behavioral.js
|   |   |-- test-scripts-modules.js
|   |   |-- test-subfolder-resolution.js
|   |   |-- test-template-comprehensive.js
|   |   |-- test-template-system.js
|   |   |-- test-upgrade-level.sh
|   |   |-- test-utils.js
|   |   |-- test-validation-extended.sh
|   |   |-- test-validation-system.js
|   |   |-- test-validation.sh
|   |   |-- tree-thinning.vitest.d.ts.map
|   |   |-- tree-thinning.vitest.js
|   |   |-- tree-thinning.vitest.js.map
|   |   `-- tree-thinning.vitest.ts
|   |-- types/
|   |   |-- README.md
|   |   `-- session-types.ts
|   |-- utils/
|   |   |-- data-validator.ts
|   |   |-- file-helpers.ts
|   |   |-- index.ts
|   |   |-- input-normalizer.ts
|   |   |-- logger.ts
|   |   |-- message-utils.ts
|   |   |-- path-utils.ts
|   |   |-- prompt-utils.ts
|   |   |-- README.md
|   |   |-- tool-detection.ts
|   |   `-- validation-utils.ts
|   |-- .gitignore
|   |-- check-api-boundary.sh
|   |-- check-links.sh
|   |-- common.sh
|   |-- package.json
|   |-- README.md
|   |-- registry-loader.sh
|   |-- scripts-registry.json
|   |-- tsconfig.json
|   |-- wrap-all-templates.sh
|   `-- wrap-all-templates.ts
|-- shared/
|   |-- algorithms/
|   |   |-- adaptive-fusion.ts
|   |   |-- index.ts
|   |   |-- mmr-reranker.ts
|   |   `-- rrf-fusion.ts
|   |-- contracts/
|   |   `-- retrieval-trace.ts
|   |-- embeddings/
|   |   |-- providers/
|   |   |   |-- hf-local.ts
|   |   |   |-- openai.ts
|   |   |   `-- voyage.ts
|   |   |-- factory.ts
|   |   |-- profile.ts
|   |   `-- README.md
|   |-- lib/
|   |   `-- structure-aware-chunker.ts
|   |-- scoring/
|   |   |-- folder-scoring.ts
|   |   `-- README.md
|   |-- utils/
|   |   |-- jsonc-strip.ts
|   |   |-- path-security.ts
|   |   |-- README.md
|   |   `-- retry.ts
|   |-- chunking.ts
|   |-- config.ts
|   |-- embeddings.ts
|   |-- index.ts
|   |-- normalization.ts
|   |-- package.json
|   |-- paths.ts
|   |-- README.md
|   |-- trigger-extractor.ts
|   |-- tsconfig.json
|   `-- types.ts
|-- templates/
|   |-- addendum/
|   |   |-- level2-verify/
|   |   |   |-- checklist.md
|   |   |   |-- plan-level2.md
|   |   |   `-- spec-level2.md
|   |   |-- level3-arch/
|   |   |   |-- decision-record.md
|   |   |   |-- plan-level3.md
|   |   |   |-- spec-level3-guidance.md
|   |   |   |-- spec-level3-prefix.md
|   |   |   |-- spec-level3-suffix.md
|   |   |   `-- spec-level3.md
|   |   |-- level3plus-govern/
|   |   |   |-- checklist-extended.md
|   |   |   |-- plan-level3plus.md
|   |   |   |-- spec-level3plus-guidance.md
|   |   |   |-- spec-level3plus-suffix.md
|   |   |   `-- spec-level3plus.md
|   |   |-- phase/
|   |   |   |-- phase-child-header.md
|   |   |   `-- phase-parent-section.md
|   |   `-- README.md
|   |-- core/
|   |   |-- impl-summary-core.md
|   |   |-- plan-core.md
|   |   |-- README.md
|   |   |-- spec-core.md
|   |   `-- tasks-core.md
|   |-- examples/
|   |   |-- level_1/
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- level_2/
|   |   |   |-- checklist.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- level_3/
|   |   |   |-- checklist.md
|   |   |   |-- decision-record.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   |-- level_3+/
|   |   |   |-- checklist.md
|   |   |   |-- decision-record.md
|   |   |   |-- implementation-summary.md
|   |   |   |-- plan.md
|   |   |   |-- spec.md
|   |   |   `-- tasks.md
|   |   `-- README.md
|   |-- level_1/
|   |   |-- implementation-summary.md
|   |   |-- plan.md
|   |   |-- README.md
|   |   |-- spec.md
|   |   `-- tasks.md
|   |-- level_2/
|   |   |-- checklist.md
|   |   |-- implementation-summary.md
|   |   |-- plan.md
|   |   |-- README.md
|   |   |-- spec.md
|   |   `-- tasks.md
|   |-- level_3/
|   |   |-- checklist.md
|   |   |-- decision-record.md
|   |   |-- implementation-summary.md
|   |   |-- plan.md
|   |   |-- README.md
|   |   |-- spec.md
|   |   `-- tasks.md
|   |-- level_3+/
|   |   |-- checklist.md
|   |   |-- decision-record.md
|   |   |-- implementation-summary.md
|   |   |-- plan.md
|   |   |-- README.md
|   |   |-- spec.md
|   |   `-- tasks.md
|   |-- memory/
|   |   `-- README.md
|   |-- scratch/
|   |   |-- .gitkeep
|   |   `-- README.md
|   |-- sharded/
|   |   |-- 01-overview.md
|   |   |-- 02-requirements.md
|   |   |-- 03-architecture.md
|   |   |-- 04-testing.md
|   |   `-- spec-index.md
|   |-- .hashes
|   |-- context_template.md
|   |-- debug-delegation.md
|   |-- handover.md
|   |-- README.md
|   `-- research.md
|-- .env.example
|-- .gitignore
|-- .node-version-marker
|-- .npmrc
|-- package-lock.json
|-- package.json
|-- README.md
|-- SKILL.md
|-- sqlite-vec.d.ts
|-- tsconfig.json
`-- tsconfig.tsbuildinfo
```

## 2) README Inventory (One-line Coverage Scope)

- `.opencode/skill/system-spec-kit/README.md` - Unified documentation and context preservation skill providing spec folder workflows, memory management and MCP-powered semantic search.
- `.opencode/skill/system-spec-kit/config/README.md` - Configuration files for Spec Kit's memory system, complexity detection, search and content filtering
- `.opencode/skill/system-spec-kit/constitutional/README.md` - Always-surface rules and critical context that MUST be visible to AI agents on every interaction.
- `.opencode/skill/system-spec-kit/scripts/README.md` - Current script inventory and execution flow for system-spec-kit scripts.
- `.opencode/skill/system-spec-kit/scripts/core/README.md` - Core TypeScript workflow modules for context generation, scoring, writing, and indexing.
- `.opencode/skill/system-spec-kit/scripts/extractors/README.md` - Extractor inventory for session, conversation, decision, file, and implementation data capture.
- `.opencode/skill/system-spec-kit/scripts/lib/README.md` - Shared TypeScript and shell helper libraries used by system-spec-kit scripts.
- `.opencode/skill/system-spec-kit/scripts/loaders/README.md` - Data loader modules that normalize input from JSON, OpenCode capture, or simulation fallback.
- `.opencode/skill/system-spec-kit/scripts/memory/README.md` - TypeScript CLIs for memory context generation, enrichment, ranking, quality checks, and index maintenance.
- `.opencode/skill/system-spec-kit/scripts/ops/README.md` - Deterministic runbook helpers for spec-kit operational failure classes with bounded retry and escalation output.
- `.opencode/skill/system-spec-kit/scripts/renderers/README.md` - Renderer modules for Mustache-like template population and output cleanup.
- `.opencode/skill/system-spec-kit/scripts/rules/README.md` - Modular shell scripts that validate spec folder structure and documentation completeness
- `.opencode/skill/system-spec-kit/scripts/setup/README.md` - Prerequisite validation scripts for feature-folder readiness and environment requirements
- `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md` - TypeScript modules for spec folder detection and alignment validation.
- `.opencode/skill/system-spec-kit/scripts/spec/README.md` - Spec lifecycle scripts for create, upgrade, placeholder cleanup, validation, and completion checks.
- `.opencode/skill/system-spec-kit/scripts/templates/README.md` - Automated composition system for SpecKit documentation templates across all documentation levels.
- `.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md` - Test scenarios for validating SpecKit spec folder structure, content rules, validation logic and edge-case handling.
- `.opencode/skill/system-spec-kit/scripts/tests/README.md` - Current test inventory for shell scripts, TypeScript modules, and integration workflows.
- `.opencode/skill/system-spec-kit/scripts/types/README.md` - Shared session type definitions used across the Spec Kit scripts pipeline.
- `.opencode/skill/system-spec-kit/scripts/utils/README.md` - Shared utility modules providing core functionality for data validation, path sanitization, file operations, logging and input normalization across all system-spec-kit scripts.
- `.opencode/skill/system-spec-kit/shared/README.md` - Consolidated TypeScript modules shared between CLI scripts and MCP server for embedding generation and trigger extraction.
- `.opencode/skill/system-spec-kit/shared/embeddings/README.md` - Flexible embeddings system supporting multiple backends with strong fallback and per-profile databases.
- `.opencode/skill/system-spec-kit/shared/scoring/README.md` - Computes composite relevance scores for spec folders based on their memories, used for ranking and resume-recent-work workflows.
- `.opencode/skill/system-spec-kit/shared/utils/README.md` - Low-level utility functions providing security-hardened path validation and resilient retry logic shared across system-spec-kit.
- `.opencode/skill/system-spec-kit/templates/README.md` - System Spec Kit template architecture and level routing.
- `.opencode/skill/system-spec-kit/templates/addendum/README.md` - Level extension blocks used to compose final level templates.
- `.opencode/skill/system-spec-kit/templates/core/README.md` - Shared base templates used by all documentation levels.
- `.opencode/skill/system-spec-kit/templates/examples/README.md` - Reference examples showing expected documentation depth by level.
- `.opencode/skill/system-spec-kit/templates/level_1/README.md` - Baseline documentation templates for low-risk, small-scope changes.
- `.opencode/skill/system-spec-kit/templates/level_2/README.md` - Verification-focused templates for medium complexity changes.
- `.opencode/skill/system-spec-kit/templates/level_3+/README.md` - Governance-heavy templates for high-complexity or regulated work.
- `.opencode/skill/system-spec-kit/templates/level_3/README.md` - Architecture-oriented templates for large or high-risk implementation work.
- `.opencode/skill/system-spec-kit/templates/memory/README.md` - Memory workflow rules for generated context files in spec folders.
- `.opencode/skill/system-spec-kit/templates/scratch/README.md` - Template and guidelines for the scratch/ subdirectory used for temporary and disposable files during spec folder work.

## 3) Config Inventory + Relationships

### 3.1 Config files found in scope

- `.opencode/skill/system-spec-kit/package.json`
- `.opencode/skill/system-spec-kit/package-lock.json`
- `.opencode/skill/system-spec-kit/tsconfig.json`
- `.opencode/skill/system-spec-kit/.npmrc`
- `.opencode/skill/system-spec-kit/.env.example`
- `.opencode/skill/system-spec-kit/.node-version-marker`
- `.opencode/skill/system-spec-kit/config/config.jsonc`
- `.opencode/skill/system-spec-kit/config/filters.jsonc`
- `.opencode/skill/system-spec-kit/shared/package.json`
- `.opencode/skill/system-spec-kit/shared/tsconfig.json`
- `.opencode/skill/system-spec-kit/scripts/package.json`
- `.opencode/skill/system-spec-kit/scripts/tsconfig.json`
- `.opencode/skill/system-spec-kit/scripts/scripts-registry.json`
- `.opencode/skill/system-spec-kit/scripts/test-fixtures/046-with-config/.speckit.yaml`
- `.opencode/skill/system-spec-kit/scripts/test-fixtures/049-with-rule-order/.speckit.yaml`

### 3.2 ESLint / Prettier config status

- No in-scope ESLint or Prettier config files were found (`.eslintrc*`, `eslint.config.*`, `.prettierrc*`, `prettier.config.*`).
- `eslint` does appear in `package-lock.json` under workspace metadata for `mcp_server`, but that is not an in-scope config file.

### 3.3 Relationship map

- Root workspace orchestration:
  - `package.json` defines npm workspaces: `shared`, `mcp_server`, `scripts`.
  - Root `tsconfig.json` project references the same workspaces: `./shared`, `./mcp_server`, `./scripts`.
- Shared package build chain:
  - `shared/tsconfig.json` extends root `tsconfig.json`, compiling `shared/**/*.ts` into `shared/dist`.
  - `shared/package.json` exports from `shared/dist/*.js`, so its runtime surface depends on that build output.
- Scripts package build chain:
  - `scripts/tsconfig.json` extends root `tsconfig.json`, outputs to `scripts/dist`, and references `../shared` + `../mcp_server`.
  - `scripts/package.json` sets `main` to `dist/memory/generate-context.js` (compiled output dependency).
  - `scripts/tsconfig.json` path aliases (`@spec-kit/shared/*`, `@spec-kit/mcp-server/*`) mirror workspace boundaries.
- Runtime config loading:
  - `config/config.jsonc` is loaded by `scripts/core/config.ts` (`loadConfig()`), with default fallback on failure.
  - `config/filters.jsonc` is loaded directly by `scripts/lib/content-filter.ts` (`loadFilterConfig()`), separate from the core config loader.
- Script registry linkage:
  - `scripts/scripts-registry.json` is queried by `scripts/registry-loader.sh`.
- Validation config linkage:
  - `.speckit.yaml` is discovered/used by `scripts/spec/validate.sh` (folder-local first, repo-root fallback), with fixture-based validation tests.
- Environment/runtime controls:
  - `.env.example` documents embedding/runtime env vars consumed by shared/scripts runtime paths.
  - `.npmrc` (`install-strategy=nested`) controls workspace install layout behavior.
  - `.node-version-marker` records node/module/platform snapshot from setup/postinstall workflow.
- Lockfile coupling:
  - `package-lock.json` (lockfile v3) pins the workspace dependency graph.

### 3.4 Boundary note

- `mcp_server/` was intentionally treated as a boundary leaf for this assignment; relationships to it are listed only where declared by in-scope configs.
