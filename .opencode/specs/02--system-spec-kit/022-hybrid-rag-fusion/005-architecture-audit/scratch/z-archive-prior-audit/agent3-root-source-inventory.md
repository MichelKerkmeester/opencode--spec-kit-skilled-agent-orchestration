# Agent 3 Source Inventory (system-spec-kit scripts + root-level sources)

- Generated: 2026-03-04T11:21:26.957Z
- Scope: `.opencode/skill/system-spec-kit/scripts/**` plus root-level `.ts/.js/.mjs/.cjs/.sh` in `.opencode/skill/system-spec-kit/`.
- Exclusions applied: `mcp_server/**`, `node_modules/**`, `dist/**`
- Total files inventoried: **152**

## File Inventory

| File path | Primary responsibility | Logical module/concern | Dependencies on other modules (imports / require / source refs) |
|---|---|---|---|
| .opencode/skill/system-spec-kit/scripts/check-api-boundary.sh | Checks api boundary for the script tooling workflow. | script tooling | ../api/... |
| .opencode/skill/system-spec-kit/scripts/check-links.sh | Checks links for the script tooling workflow. | script tooling | None detected |
| .opencode/skill/system-spec-kit/scripts/common.sh | Provides shared shell helpers reused across script tooling scripts. | script tooling | None detected |
| .opencode/skill/system-spec-kit/scripts/core/config.ts | Implements config for the core orchestration workflow. | core orchestration | ../utils/logger, @spec-kit/shared/utils/jsonc-strip, fs, path |
| .opencode/skill/system-spec-kit/scripts/core/file-writer.ts | Implements file writer for the core orchestration workflow. | core orchestration | ../utils/validation-utils, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/core/index.ts | Exports the entry points for the core orchestration module. | core orchestration | ./config, ./core/workflow, ./subfolder-utils |
| .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts | Implements memory indexer for the core orchestration workflow. | core orchestration | ../extractors/collect-session-data, ../lib/embeddings, ../lib/trigger-extractor, ../utils, @spec-kit/mcp-server/core/config, @spec-kit/mcp-server/lib/search/vector-index, fs, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts | Implements quality scorer for the core orchestration workflow. | core orchestration | None detected |
| .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts | Implements subfolder utils for the core orchestration workflow. | core orchestration | ./config, fs, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts | Implements topic extractor for the core orchestration workflow. | core orchestration | ../lib/topic-keywords |
| .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts | Implements tree thinning for the core orchestration workflow. | core orchestration | None detected |
| .opencode/skill/system-spec-kit/scripts/core/workflow.ts | Implements workflow for the core orchestration workflow. | core orchestration | ../extractors, ../extractors/collect-session-data, ../extractors/contamination-filter, ../extractors/file-extractor, ../extractors/quality-scorer, ../lib/content-filter, ../lib/embeddings, ../lib/flowchart-generator, ../lib/semantic-summarizer, ../lib/simulation-factory, +13 more |
| .opencode/skill/system-spec-kit/scripts/evals/collect-redaction-calibration-inputs.ts | Collects redaction calibration inputs for the evaluation and benchmarking workflow. | evaluation and benchmarking | child_process, fs, path |
| .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts | Maps ground truth ids for the evaluation and benchmarking workflow. | evaluation and benchmarking | better-sqlite3, fs, path |
| .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts | Runs ablation for the evaluation and benchmarking workflow. | evaluation and benchmarking | ../../mcp_server/api, fs, path |
| .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts | Runs bm25 baseline for the evaluation and benchmarking workflow. | evaluation and benchmarking | ../../mcp_server/api, better-sqlite3, fs, path |
| .opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts | Runs chk210 quality backfill for the evaluation and benchmarking workflow. | evaluation and benchmarking | ../extractors/quality-scorer.ts, ../memory/validate-memory-quality.ts, @spec-kit/mcp-server/lib/parsing/memory-parser, child_process, fs |
| .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts | Runs performance benchmarks for the evaluation and benchmarking workflow. | evaluation and benchmarking | @spec-kit/mcp-server/lib/cache/cognitive/working-memory, @spec-kit/mcp-server/lib/extraction/extraction-adapter, @spec-kit/mcp-server/lib/search/causal-boost, @spec-kit/mcp-server/lib/search/session-boost, better-sqlite3, fs, path, perf_hooks |
| .opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts | Runs phase1 5 shadow eval for the evaluation and benchmarking workflow. | evaluation and benchmarking | fs, path |
| .opencode/skill/system-spec-kit/scripts/evals/run-phase2-closure-metrics.mjs | Runs phase2 closure metrics for the evaluation and benchmarking workflow. | evaluation and benchmarking | fs, path, scripts/evals/run-phase2-closure-metrics.mjs |
| .opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts | Runs phase3 telemetry dashboard for the evaluation and benchmarking workflow. | evaluation and benchmarking | fs, path |
| .opencode/skill/system-spec-kit/scripts/evals/run-quality-legacy-remediation.ts | Runs quality legacy remediation for the evaluation and benchmarking workflow. | evaluation and benchmarking | better-sqlite3, fs, path |
| .opencode/skill/system-spec-kit/scripts/evals/run-redaction-calibration.ts | Runs redaction calibration for the evaluation and benchmarking workflow. | evaluation and benchmarking | fs, path |
| .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | Collects session data for the conversation and artifact extraction workflow. | conversation and artifact extraction | ../core, ../lib/simulation-factory, ../spec-folder, ../types/session-types, ../utils/message-utils, ./file-extractor, ./implementation-guide-extractor, ./session-extractor, path |
| .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts | Implements contamination filter for the conversation and artifact extraction workflow. | conversation and artifact extraction | None detected |
| .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts | Implements conversation extractor for the conversation and artifact extraction workflow. | conversation and artifact extraction | ../core, ../lib/flowchart-generator, ../lib/simulation-factory, ../types/session-types, ../utils/message-utils, ../utils/tool-detection |
| .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts | Implements decision extractor for the conversation and artifact extraction workflow. | conversation and artifact extraction | ../lib/anchor-generator, ../lib/decision-tree-generator, ../lib/simulation-factory, ../types/session-types, ../utils/data-validator, ../utils/message-utils |
| .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts | Implements diagram extractor for the conversation and artifact extraction workflow. | conversation and artifact extraction | ../lib/decision-tree-generator, ../lib/flowchart-generator, ../lib/simulation-factory, ../types/session-types, ../utils/data-validator, ../utils/tool-detection |
| .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts | Implements file extractor for the conversation and artifact extraction workflow. | conversation and artifact extraction | ../core, ../lib/anchor-generator, ../utils/file-helpers, ../utils/path-utils |
| .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts | Implements implementation guide extractor for the conversation and artifact extraction workflow. | conversation and artifact extraction | ./file-extractor, ], name: |
| .opencode/skill/system-spec-kit/scripts/extractors/index.ts | Exports the entry points for the conversation and artifact extraction module. | conversation and artifact extraction | ./collect-session-data, ./contamination-filter, ./conversation-extractor, ./decision-extractor, ./diagram-extractor, ./file-extractor, ./implementation-guide-extractor, ./opencode-capture, ./quality-scorer, ./session-extractor |
| .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts | Implements opencode capture for the conversation and artifact extraction workflow. | conversation and artifact extraction | fs, fs/promises, path, readline |
| .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts | Implements quality scorer for the conversation and artifact extraction workflow. | conversation and artifact extraction | None detected |
| .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts | Implements session extractor for the conversation and artifact extraction workflow. | conversation and artifact extraction | ../core, ../lib/topic-keywords, child_process, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh | Implements quality kpi for the quality KPI reporting workflow. | quality KPI reporting | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | Implements anchor generator for the shared library utilities workflow. | shared library utilities | crypto |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | Implements ascii boxes for the shared library utilities workflow. | shared library utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | Implements content filter for the shared library utilities workflow. | shared library utilities | ../utils/logger, @spec-kit/shared/utils/jsonc-strip, crypto, fs, path |
| .opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts | Implements decision tree generator for the shared library utilities workflow. | shared library utilities | ../lib/ascii-boxes, ../utils/logger, ./ascii-boxes |
| .opencode/skill/system-spec-kit/scripts/lib/embeddings.ts | Implements embeddings for the shared library utilities workflow. | shared library utilities | @spec-kit/shared/embeddings |
| .opencode/skill/system-spec-kit/scripts/lib/flowchart-generator.ts | Implements flowchart generator for the shared library utilities workflow. | shared library utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | Implements frontmatter migration for the shared library utilities workflow. | shared library utilities | path |
| .opencode/skill/system-spec-kit/scripts/lib/git-branch.sh | Implements git branch for the shared library utilities workflow. | shared library utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | Implements semantic summarizer for the shared library utilities workflow. | shared library utilities | ../utils/file-helpers, ./trigger-extractor, os |
| .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh | Provides shared shell helpers reused across shared library utilities scripts. | shared library utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts | Implements simulation factory for the shared library utilities workflow. | shared library utilities | ../types/session-types, crypto |
| .opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts | Implements structure aware chunker for the shared library utilities workflow. | shared library utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/template-utils.sh | Implements template utils for the shared library utilities workflow. | shared library utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts | Implements topic keywords for the shared library utilities workflow. | shared library utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts | Implements trigger extractor for the shared library utilities workflow. | shared library utilities | @spec-kit/shared/trigger-extractor |
| .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | Implements data loader for the data loading workflow. | data loading | ../core, ../extractors/opencode-capture, ../utils, ../utils/input-normalizer, fs/promises, os, path |
| .opencode/skill/system-spec-kit/scripts/loaders/index.ts | Exports the entry points for the data loading module. | data loading | ./data-loader |
| .opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts | Implements ast parser for the memory indexing and hygiene workflow. | memory indexing and hygiene | @spec-kit/shared/lib/structure-aware-chunker |
| .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts | Backfills frontmatter for the memory indexing and hygiene workflow. | memory indexing and hygiene | ../lib/frontmatter-migration, backfill-frontmatter.js, fs, path |
| .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts | Cleans up orphaned vectors for the memory indexing and hygiene workflow. | memory indexing and hygiene | @spec-kit/shared/paths, better-sqlite3, sqlite-vec |
| .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | Generates context for the memory indexing and hygiene workflow. | memory indexing and hygiene | ../core, ../core/workflow, ../extractors/collect-session-data, ../loaders, fs, path |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | Ranks memories for the memory indexing and hygiene workflow. | memory indexing and hygiene | @spec-kit/shared/scoring/folder-scoring, fs, path, rank-memories.js |
| .opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts | Reindexes embeddings for the memory indexing and hygiene workflow. | memory indexing and hygiene | @spec-kit/mcp-server/core, @spec-kit/mcp-server/handlers, @spec-kit/mcp-server/lib/providers/embeddings, @spec-kit/mcp-server/lib/search/hybrid-search, @spec-kit/mcp-server/lib/search/vector-index, @spec-kit/mcp-server/lib/storage/access-tracker, @spec-kit/mcp-server/lib/storage/checkpoints, @spec-kit/shared/types, fs, path |
| .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | Validates memory quality for the memory indexing and hygiene workflow. | memory indexing and hygiene | fs, path, validate-memory-quality.js |
| .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh | Heals index drift for the operations runbooks and remediation workflow. | operations runbooks and remediation | ${SCRIPT_DIR}/ops-common.sh, dist/memory/reindex-embeddings.js |
| .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh | Heals ledger mismatch for the operations runbooks and remediation workflow. | operations runbooks and remediation | ${SCRIPT_DIR}/ops-common.sh, dist/evals/run-quality-legacy-remediation.js, dist/memory/cleanup-orphaned-vectors.js |
| .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh | Heals session ambiguity for the operations runbooks and remediation workflow. | operations runbooks and remediation | ${SCRIPT_DIR}/ops-common.sh, dist/core/workflow.js, dist/evals/run-phase1-5-shadow-eval.js, dist/extractors/session-extractor.js |
| .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh | Heals telemetry drift for the operations runbooks and remediation workflow. | operations runbooks and remediation | ${SCRIPT_DIR}/ops-common.sh, dist/evals/run-phase3-telemetry-dashboard.js |
| .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh | Provides shared shell helpers reused across operations runbooks and remediation scripts. | operations runbooks and remediation | None detected |
| .opencode/skill/system-spec-kit/scripts/ops/runbook.sh | Implements runbook for the operations runbooks and remediation workflow. | operations runbooks and remediation | None detected |
| .opencode/skill/system-spec-kit/scripts/registry-loader.sh | Implements registry loader for the script tooling workflow. | script tooling | None detected |
| .opencode/skill/system-spec-kit/scripts/renderers/index.ts | Exports the entry points for the template rendering module. | template rendering | ./template-renderer |
| .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts | Implements template renderer for the template rendering workflow. | template rendering | ../core, ../utils/logger, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/rules/check-ai-protocols.sh | Checks ai protocols for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh | Checks anchors for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-complexity.sh | Checks complexity for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh | Checks evidence for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-files.sh | Checks files for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-folder-naming.sh | Checks folder naming for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh | Checks frontmatter for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh | Checks level match for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-level.sh | Checks level for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-links.sh | Checks links for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh | Checks phase links for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-placeholders.sh | Checks placeholders for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh | Checks priority tags for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh | Checks section counts for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-sections.sh | Checks sections for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh | Checks template source for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh | Checks toc policy for the validation rule checks workflow. | validation rule checks | None detected |
| .opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh | Checks native modules for the environment setup workflow. | environment setup | scripts/setup/check-native-modules.sh, scripts/setup/rebuild-native-modules.sh |
| .opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh | Checks prerequisites for the environment setup workflow. | environment setup | $SCRIPT_DIR/../common.sh |
| .opencode/skill/system-spec-kit/scripts/setup/rebuild-native-modules.sh | Rebuilds native modules for the environment setup workflow. | environment setup | scripts/setup/rebuild-native-modules.sh |
| .opencode/skill/system-spec-kit/scripts/setup/record-node-version.js | Records node version for the environment setup workflow. | environment setup | fs, path |
| .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts | Implements alignment validator for the spec-folder detection and alignment workflow. | spec-folder detection and alignment | ../utils/prompt-utils, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts | Implements directory setup for the spec-folder detection and alignment workflow. | spec-folder detection and alignment | ../core, ../utils, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | Implements folder detector for the spec-folder detection and alignment workflow. | spec-folder detection and alignment | ../core, ../utils/prompt-utils, ./alignment-validator, fs/promises, path |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | Exports the entry points for the spec-folder detection and alignment module. | spec-folder detection and alignment | ./alignment-validator, ./directory-setup, ./folder-detector |
| .opencode/skill/system-spec-kit/scripts/spec/archive.sh | Archives module logic for the spec lifecycle automation workflow. | spec lifecycle automation | None detected |
| .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh | Calculates completeness for the spec lifecycle automation workflow. | spec lifecycle automation | $stats_file |
| .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh | Checks completion for the spec lifecycle automation workflow. | spec lifecycle automation | None detected |
| .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh | Checks placeholders for the spec lifecycle automation workflow. | spec lifecycle automation | None detected |
| .opencode/skill/system-spec-kit/scripts/spec/create.sh | Creates module logic for the spec lifecycle automation workflow. | spec lifecycle automation | ${SCRIPT_DIR}/../lib/git-branch.sh, ${SCRIPT_DIR}/../lib/shell-common.sh, ${SCRIPT_DIR}/../lib/template-utils.sh |
| .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh | Implements progressive validate for the spec lifecycle automation workflow. | spec lifecycle automation | ${SCRIPT_DIR}/../lib/shell-common.sh |
| .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh | Recommends level for the spec lifecycle automation workflow. | spec lifecycle automation | None detected |
| .opencode/skill/system-spec-kit/scripts/spec/test-validation.sh | Tests validation for the spec lifecycle automation workflow. | spec lifecycle automation | None detected |
| .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh | Upgrades level for the spec lifecycle automation workflow. | spec lifecycle automation | ${SCRIPT_DIR}/../lib/shell-common.sh |
| .opencode/skill/system-spec-kit/scripts/spec/validate.sh | Validates module logic for the spec lifecycle automation workflow. | spec lifecycle automation | ${SCRIPT_DIR}/../lib/shell-common.sh, $rule_script |
| .opencode/skill/system-spec-kit/scripts/templates/compose.sh | Composes module logic for the template composition workflow. | template composition | None detected |
| .opencode/skill/system-spec-kit/scripts/tests/fixtures/generate-phase1-5-dataset.ts | Generates deterministic fixtures used by test and regression coverage test scenarios. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js | Validates progressive validation behavior through automated regression tests. | test and regression coverage | child_process, fs, os, path, vitest |
| .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts | Validates progressive validation behavior through automated regression tests. | test and regression coverage | child_process, fs, os, path, vitest |
| .opencode/skill/system-spec-kit/scripts/tests/test-alignment-validator.js | Validates alignment validator behavior through automated regression tests. | test and regression coverage | fs, module, os, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-ast-parser.js | Validates ast parser behavior through automated regression tests. | test and regression coverage | path |
| .opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js | Validates bug fixes behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-bug-regressions.js | Validates bug regressions behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js | Validates cleanup orphaned vectors behavior through automated regression tests. | test and regression coverage | better-sqlite3, fs, path, sqlite-vec |
| .opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js | Validates embeddings behavioral behavior through automated regression tests. | test and regression coverage | module, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js | Validates embeddings factory behavior through automated regression tests. | test and regression coverage | path |
| .opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js | Validates export contracts behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js | Validates extractors loaders behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js | Validates five checks behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js | Validates folder detector functional behavior through automated regression tests. | test and regression coverage | /nonexistent/path/to/better-sqlite3, fs, fs/promises, os, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js | Validates frontmatter backfill behavior through automated regression tests. | test and regression coverage | child_process, fs, os, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-integration.js | Validates integration behavior through automated regression tests. | test and regression coverage | child_process, crypto, fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js | Validates memory quality lane behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-naming-migration.js | Validates naming migration behavior through automated regression tests. | test and regression coverage | child_process, fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js | Validates phase command workflows behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.js | Validates phase system behavior through automated regression tests. | test and regression coverage | child_process, fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh | Validates phase system behavior through automated regression tests. | test and regression coverage | None detected |
| .opencode/skill/system-spec-kit/scripts/tests/test-phase-validation.js | Validates phase validation behavior through automated regression tests. | test and regression coverage | child_process, fs, os, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js | Validates retry manager behavioral behavior through automated regression tests. | test and regression coverage | better-sqlite3, module, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js | Validates scripts modules behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js | Validates subfolder resolution behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js | Validates template comprehensive behavior through automated regression tests. | test and regression coverage | child_process, fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-template-system.js | Validates template system behavior through automated regression tests. | test and regression coverage | child_process, fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh | Validates upgrade level behavior through automated regression tests. | test and regression coverage | None detected |
| .opencode/skill/system-spec-kit/scripts/tests/test-utils.js | Validates utils behavior through automated regression tests. | test and regression coverage | fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh | Validates validation extended behavior through automated regression tests. | test and regression coverage | $rule_path |
| .opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js | Validates validation system behavior through automated regression tests. | test and regression coverage | child_process, fs, path |
| .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh | Validates validation behavior through automated regression tests. | test and regression coverage | None detected |
| .opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js | Validates tree thinning behavior through automated regression tests. | test and regression coverage | ../core/tree-thinning, vitest |
| .opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts | Validates tree thinning behavior through automated regression tests. | test and regression coverage | ../core/tree-thinning, vitest |
| .opencode/skill/system-spec-kit/scripts/types/session-types.ts | Implements session types for the shared type definitions workflow. | shared type definitions | ../extractors/file-extractor, ../extractors/session-extractor |
| .opencode/skill/system-spec-kit/scripts/utils/data-validator.ts | Implements data validator for the general utilities workflow. | general utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts | Implements file helpers for the general utilities workflow. | general utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/utils/index.ts | Exports the entry points for the general utilities module. | general utilities | ./data-validator, ./file-helpers, ./input-normalizer, ./logger, ./message-utils, ./path-utils, ./prompt-utils, ./tool-detection, ./validation-utils |
| .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | Implements input normalizer for the general utilities workflow. | general utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/utils/logger.ts | Provides centralized logging helpers for general utilities workflows. | general utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/utils/message-utils.ts | Implements message utils for the general utilities workflow. | general utilities | ../core, ./logger |
| .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts | Implements path utils for the general utilities workflow. | general utilities | ./logger, fs, path |
| .opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts | Implements prompt utils for the general utilities workflow. | general utilities | readline |
| .opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts | Implements tool detection for the general utilities workflow. | general utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts | Implements validation utils for the general utilities workflow. | general utilities | None detected |
| .opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh | Wraps all templates for the script tooling workflow. | script tooling | None detected |
| .opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts | Wraps all templates for the script tooling workflow. | script tooling | ./lib/anchor-generator.js, node:fs, node:path |
| .opencode/skill/system-spec-kit/sqlite-vec.d.ts | Declares ambient TypeScript types for the sqlite-vec binding used by local tooling. | root declarations | better-sqlite3 |

## Obvious Naming Duplication Candidates vs `mcp_server`

| scripts/root file | mcp_server counterpart | normalized stem |
|---|---|---|
| .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts | .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | bm25-baseline |
| .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts | .opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts | bm25-baseline |
| .opencode/skill/system-spec-kit/scripts/lib/embeddings.ts | .opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts | embeddings |
| .opencode/skill/system-spec-kit/scripts/lib/embeddings.ts | .opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts | embeddings |
| .opencode/skill/system-spec-kit/scripts/lib/embeddings.ts | .opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts | embeddings |
| .opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts | .opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts | structure-aware-chunker |
| .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts | .opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts | trigger-extractor |
| .opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts | .opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts | embeddings |
| .opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts | .opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts | embeddings |
| .opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts | .opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts | embeddings |
| .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js | .opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts | progressive-validation |
| .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts | .opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts | progressive-validation |
