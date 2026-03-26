# Iteration 018: Cross-Reference Sweep

## Findings

### 1) Links in `spec.md`/`plan.md` that point to missing files
- **Total:** 6
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/001-fusion-scoring-intelligence/plan.md:298` -> `../../../019-deep-research-rag-improvement/research/research.md` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/research/research.md`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/001-fusion-scoring-intelligence/spec.md:324` -> `../../../019-deep-research-rag-improvement/research/research.md` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/research/research.md`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/002-query-intelligence-reformulation/spec.md:246` -> `../../../019-deep-research-rag-improvement/research/research.md` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/research/research.md`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/004-feedback-quality-learning/plan.md:154` -> `../../../019-deep-research-rag-improvement/research/research.md` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/research/research.md`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/plan.md:157` -> `../../019-deep-research-rag-improvement/research/research.md` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/research/research.md`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/spec.md:127` -> `../../019-deep-research-rag-improvement/research/research.md` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/research/research.md`)

### 2) Predecessor/parent/successor references pointing to wrong paths
- **Total:** 133
- **Top concentration:**
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/021-runtime-contract-and-indexability/spec.md`: 4
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/022-source-capabilities-and-structured-preference/spec.md`: 4
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/024-runtime-contract-and-indexability/spec.md`: 4
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/025-source-capabilities-and-structured-preference/spec.md`: 4
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/023-live-proof-and-parity-hardening/spec.md`: 3
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/026-live-proof-and-parity-hardening/spec.md`: 3
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/002-mutation/spec.md`: 3
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/spec.md`: 3
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/spec.md`: 3
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/005-lifecycle/spec.md`: 3
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/006-analysis/spec.md`: 3
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/007-evaluation/spec.md`: 3
- **Representative examples:**
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:278` `Parent Spec` -> ``022-hybrid-rag-fusion`` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/022-hybrid-rag-fusion`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/001-session-source-validation/spec.md:28` `Predecessor` -> `010-integration-testing` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/001-session-source-validation/010-integration-testing`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/001-session-source-validation/spec.md:29` `Successor` -> `002-outsourced-agent-handback` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/001-session-source-validation/002-outsourced-agent-handback`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/002-outsourced-agent-handback/spec.md:31` `Predecessor` -> `001-session-source-validation` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/002-outsourced-agent-handback/001-session-source-validation`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/002-outsourced-agent-handback/spec.md:32` `Successor` -> `003-multi-cli-parity` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/002-outsourced-agent-handback/003-multi-cli-parity`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/spec.md:36` `Predecessor` -> `002-outsourced-agent-handback` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/002-outsourced-agent-handback`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/spec.md:37` `Successor` -> `004-source-capabilities-and-structured-preference` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/004-source-capabilities-and-structured-preference`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference/spec.md:29` `Predecessor` -> ``003-multi-cli-parity`` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference/003-multi-cli-parity`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference/spec.md:30` `Successor` -> ``005-live-proof-and-parity-hardening`` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference/005-live-proof-and-parity-hardening`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/005-live-proof-and-parity-hardening/spec.md:29` `Predecessor` -> ``004-source-capabilities-and-structured-preference`` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/005-live-proof-and-parity-hardening/004-source-capabilities-and-structured-preference`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/spec.md:31` `Successor` -> ``001-quality-scorer-unification`` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/001-quality-scorer-unification`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/001-quality-scorer-unification/spec.md:29` `Predecessor` -> `000-dynamic-capture-deprecation` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/001-quality-scorer-unification/000-dynamic-capture-deprecation`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/001-quality-scorer-unification/spec.md:30` `Successor` -> `002-contamination-detection` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/001-quality-scorer-unification/002-contamination-detection`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/002-contamination-detection/spec.md:29` `Predecessor` -> `001-quality-scorer-unification` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/002-contamination-detection/001-quality-scorer-unification`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/002-contamination-detection/spec.md:30` `Successor` -> `003-data-fidelity` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/002-contamination-detection/003-data-fidelity`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/spec.md:29` `Predecessor` -> `002-contamination-detection` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/002-contamination-detection`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/spec.md:30` `Successor` -> `004-type-consolidation` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/004-type-consolidation`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/004-type-consolidation/spec.md:29` `Predecessor` -> `003-data-fidelity` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/004-type-consolidation/003-data-fidelity`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/004-type-consolidation/spec.md:30` `Successor` -> `005-confidence-calibration` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/004-type-consolidation/005-confidence-calibration`)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/005-confidence-calibration/spec.md:29` `Predecessor` -> `004-type-consolidation` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/005-confidence-calibration/004-type-consolidation`)

### 3) Feature catalog entries that reference missing code files
- **Total:** 1553
- **Top concentration:**
  - `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md`: 282
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X10.md`: 102
  - `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`: 93
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md`: 59
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md`: 57
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C05.md`: 42
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C07.md`: 39
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X02.md`: 36
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X07.md`: 36
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md`: 32
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X04.md`: 31
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X06.md`: 31
- **Representative examples:**
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:221` -> `incremental-index-v2.vitest.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/incremental-index-v2.vitest.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:201` -> `incremental-index-v2.vitest.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/incremental-index-v2.vitest.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:138` -> `incremental-index-v2.vitest.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/incremental-index-v2.vitest.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:18` -> `handlers/memory-search.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/handlers/memory-search.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:18` -> `lib/search/hybrid-search.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/lib/search/hybrid-search.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:18` -> `hybrid-search.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/hybrid-search.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:26` -> `co-activation.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/co-activation.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:132` -> `incremental-index-v2.vitest.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/incremental-index-v2.vitest.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:172` -> `incremental-index-v2.vitest.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/incremental-index-v2.vitest.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md:18` -> `memory-crud-update.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/memory-crud-update.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:18` -> `lib/cognitive/working-memory.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/lib/cognitive/working-memory.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:20` -> `lib/extraction/extraction-adapter.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/lib/extraction/extraction-adapter.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:22` -> `context-server.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/context-server.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:24` -> `lib/storage/checkpoints.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/lib/storage/checkpoints.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:18` -> `tool-schemas.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/tool-schemas.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:20` -> `tools/memory-tools.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/tools/memory-tools.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:20` -> `schemas/tool-input-schemas.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/schemas/tool-input-schemas.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:217` -> `incremental-index-v2.vitest.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/incremental-index-v2.vitest.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:24` -> `tool-schemas.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/tool-schemas.ts`)
  - `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:128` -> `incremental-index-v2.vitest.ts` (missing `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/incremental-index-v2.vitest.ts`)

### 4) Checklist evidence citations that point to stale paths (012 packet)
- **Total:** 5
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/checklist.md:152` -> `007/009-evaluation-and-measurement` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/007/009-evaluation-and-measurement`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/checklist.md:154` -> `007/011-scoring-and-calibration` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/007/011-scoring-and-calibration`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/checklist.md:199` -> `0/N` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/0/N`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/checklist.md:214` -> `011-skill-alignment/001-post-session-capturing-alignment` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/011-skill-alignment/001-post-session-capturing-alignment`)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/checklist.md:289` -> `100/100` (missing `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/100/100`)

## Summary

- Broken links in 022 `spec.md`/`plan.md`: **6**
- Invalid metadata parent/predecessor/successor refs: **133**
- Feature catalog missing code-file references: **1553**
- 012 checklist stale evidence paths: **5**

## JSONL (type:iteration, run:18, dimensions:[traceability,maintainability])

{"type": "iteration", "run": 18, "dimensions": ["traceability", "maintainability"], "counts": {"broken_spec_plan_links": 6, "invalid_parent_predecessor_successor_refs": 133, "feature_catalog_missing_targets": 1553, "checklist_stale_evidence_paths": 5}, "artifacts": {"root_spec": ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md", "epic_spec": ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md", "packet_spec": ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md", "packet_plan": ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/plan.md", "packet_checklist": ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/checklist.md", "audit_data": "/.copilot_tmp_iteration018_precise.json"}}
