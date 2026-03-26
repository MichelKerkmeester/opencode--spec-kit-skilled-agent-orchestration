**Findings**
1. Blocking documentation mismatch: [MANUAL_TESTING_PLAYBOOK.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md#L143) says readiness depends on `231` per-scenario files and shows a category-folder-only count, but the repo currently has `230` category scenario files. The requested `find` reaches `231` only because it also counts the root playbook file. That makes the documented readiness check stale.
2. Feature coverage is incomplete: using explicit playbook `Feature catalog:` backlinks as the alignment source, `165/219` category catalog snippets are covered (`75.3%`). If you include the extra root catalog file counted by the requested command, coverage is `165/220` (`75.0%`).
3. Category naming is aligned for all visible numbered folders: `19/19` match. The main exceptions are catalog-side extras, not renamed categories: hidden `.github/`, root [FEATURE_CATALOG_IN_SIMPLE_TERMS.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md), and a root TOC section for phase workflows in [FEATURE_CATALOG.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L12).
4. There are `31` orphan playbook scenarios with no feature-catalog backlink. Most look intentional (`M-*`, `PHASE-*`, runtime/operator overlays), but some feature-like scenarios still appear unlinked, such as [166-result-explain-v1-speckit-result-explain-v1.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md#L33).

**Counts**
- Playbook scenario files, requested command: `231`
- Catalog snippet files, requested command: `220`
- Category-only files: playbook `230`, catalog `219`
- Coverage ratio: category folders `19/19`; feature backlinks `165/219` (`75.3%`), or `165/220` (`75.0%`) if the extra root catalog file is included

**UNTESTED features**
- `01--retrieval` (4): `07-ast-level-section-retrieval-tool.md`, `09-tool-result-extraction-to-working-memory.md`, `10-fast-delegated-search-memory-quick-search.md`, `11-session-recovery-memory-continue.md`
- `02--mutation` (2): `07-namespace-management-crud-tools.md`, `09-correction-tracking-with-undo.md`
- `10--graph-signal-activation` (7): `09-anchor-tags-as-graph-nodes.md`, `10-causal-neighbor-boost-and-injection.md`, `11-temporal-contiguity-layer.md`, `13-graph-lifecycle-refresh.md`, `14-llm-graph-backfill.md`, `15-graph-calibration-profiles.md`, `16-typed-traversal.md`
- `11--scoring-and-calibration` (7): `15-tool-level-ttl-cache.md`, `16-access-driven-popularity-scoring.md`, `17-temporal-structural-coherence-scoring.md`, `19-learned-stage2-weight-combiner.md`, `20-shadow-feedback-holdout-evaluation.md`, `21-calibrated-overlap-bonus.md`, `22-rrf-k-experimental.md`
- `12--query-intelligence` (5): `07-llm-query-reformulation.md`, `08-hyde-hypothetical-document-embeddings.md`, `09-index-time-query-surrogates.md`, `10-query-decomposition.md`, `11-graph-concept-routing.md`
- `13--memory-quality-and-indexing` (7): `11-content-aware-memory-filename-generation.md`, `12-generation-time-duplicate-and-empty-content-prevention.md`, `20-weekly-batch-feedback-learning.md`, `21-assistive-reconsolidation.md`, `22-implicit-feedback-log.md`, `23-hybrid-decay-policy.md`, `24-save-quality-gate-exceptions.md`
- `14--pipeline-architecture` (5): `15-warm-server-daemon-mode.md`, `16-backend-storage-adapter-abstraction.md`, `18-atomic-write-then-index-api.md`, `19-embedding-retry-orchestrator.md`, `20-7-layer-tool-architecture-metadata.md`
- `16--tooling-and-scripts` (3): `02-architecture-boundary-enforcement.md`, `08-watcher-delete-rename-cleanup.md`, `18-template-compliance-contract-enforcement.md`
- `18--ux-hooks` (14): `01-shared-post-mutation-hook-wiring.md`, `02-memory-health-autorepair-metadata.md`, `04-schema-and-type-contract-synchronization.md`, `06-mutation-hook-result-contract-expansion.md`, `07-mutation-response-ux-payload-exposure.md`, `10-atomic-save-parity-and-partial-indexing-hints.md`, `11-final-token-metadata-recomputation.md`, `13-end-to-end-success-envelope-verification.md`, `14-result-explainability.md`, `15-mode-aware-response-profiles.md`, `16-progressive-disclosure.md`, `17-retrieval-session-state.md`, `18-empty-result-recovery.md`, `19-result-confidence.md`
- Extra unmatched root catalog doc: `FEATURE_CATALOG_IN_SIMPLE_TERMS.md`

**ORPHAN scenarios**
- `01--retrieval` (4): `001-context-recovery-and-continuation.md`, `002-targeted-memory-lookup.md`, `185-memory-analyze-command-routing.md`, `187-quick-search-memory-quick-search.md`
- `02--mutation` (1): `101-memory-delete-confirm-schema-tightening.md`
- `05--lifecycle` (1): `100-async-shutdown-with-deadline-server-lifecycle.md`
- `10--graph-signal-activation` (3): `156-graph-refresh-mode-speckit-graph-refresh-mode.md`, `157-llm-graph-backfill-speckit-llm-graph-backfill.md`, `158-graph-calibration-profile-speckit-graph-calibration-profile.md`
- `11--scoring-and-calibration` (3): `102-node-llama-cpp-optionaldependencies.md`, `159-learned-stage2-combiner-speckit-learned-stage2-combiner.md`, `160-shadow-feedback-speckit-shadow-feedback.md`
- `12--query-intelligence` (2): `162-hyde-speckit-hyde.md`, `163-query-surrogates-speckit-query-surrogates.md`
- `13--memory-quality-and-indexing` (3): `003-context-save-index-update.md`, `164-batch-learned-feedback-speckit-batch-learned-feedback.md`, `165-assistive-reconsolidation-speckit-assistive-reconsolidation.md`
- `16--tooling-and-scripts` (12): `001-phase-detection-scoring.md`, `002-phase-folder-creation.md`, `003-recursive-phase-validation.md`, `004-main-agent-review-and-verdict-handoff.md`, `004-phase-link-validation.md`, `005-phase-command-workflow.md`, `108-spec-007-finalized-verification-command-suite-evidence.md`, `181-template-compliance-contract-enforcement.md`, `182-runtime-family-count-census.md`, `183-runtime-lineage-naming-parity.md`, `184-gemini-runtime-path-resolution.md`, `186-memory-manage-command-routing.md`
- `18--ux-hooks` (2): `166-result-explain-v1-speckit-result-explain-v1.md`, `167-response-profile-v1-speckit-response-profile-v1.md`

**CATEGORY MISMATCHES**
- Visible numbered category folders: none, `19/19` exact name matches
- Catalog-only extras: hidden `.github/`, root `FEATURE_CATALOG_IN_SIMPLE_TERMS.md`
- Structural mismatch in docs: playbook readiness text assumes `231` category scenarios, but filesystem has `230` category scenarios

**Quality sample**
- [001-unified-context-retrieval-memory-context.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md#L14): strong; clear objective, prompt, expected signals, pass/fail, exact commands, and catalog backlink.
- [001-context-recovery-and-continuation.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md#L14): good execution clarity and evidence requirements, but prose-only and no catalog backlink.
- [001-phase-detection-scoring.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/001-phase-detection-scoring.md#L14): strong deterministic steps and pass/fail criteria; phase-specific and intentionally outside normal feature-catalog coverage.
- [155-post-save-quality-review.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md#L14): strongest sample; explicit evidence, multiple verdict cases, and good catalog linkage. Slightly heavy because one file bundles many sub-scenarios.
- [166-result-explain-v1-speckit-result-explain-v1.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md#L14): test quality is solid, but alignment is weak because it links only to feature-flag/reference material, not a catalog feature file.

**SUMMARY**
Pre-release alignment is not yet ready: category structure is clean, but feature-to-playbook coverage is only about `75%`, there are `54` untested category features plus one extra unmatched root catalog doc, `31` orphan scenarios, and the root playbook’s own coverage-count contract is off by one. This was a read-only audit; no files were changed and no runtime tests were executed.
