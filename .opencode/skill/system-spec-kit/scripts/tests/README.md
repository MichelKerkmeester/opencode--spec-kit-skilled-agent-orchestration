---
title: "System Spec Kit Test Suite"
description: "Current test inventory for shell scripts, TypeScript modules, and integration workflows."
trigger_phrases:
  - "spec kit tests"
  - "test validation"
  - "upgrade-level tests"
---


# System Spec Kit Test Suite

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. RECOMMENDED RUN ORDER](#3--recommended-run-order)
- [4. FOCUS AREAS](#4--focus-areas)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `tests/` directory validates script behavior, TypeScript module contracts, end-to-end flows, and targeted Vitest regressions for import-policy rules, task enrichment, rendered-memory fixture guardrails, and phase/alignment workflows. Current footprint: 442 files when traversing the linked `test-fixtures/` corpus (160 physical files rooted under `tests/` itself), including 44 top-level `*.vitest.ts` suites.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


JavaScript tests:
- `test-alignment-validator.js`
- `test-ast-parser.js`
- `test-bug-fixes.js`
- `test-bug-regressions.js`
- `test-cleanup-orphaned-vectors.js`
- `test-embeddings-behavioral.js`
- `test-embeddings-factory.js`
- `test-export-contracts.js`
- `test-extractors-loaders.js`
- `test-five-checks.js`
- `test-folder-detector-functional.js`
- `test-frontmatter-backfill.js`
- `test-memory-quality-lane.js` - Tests memory quality validation lane
- `test-naming-migration.js`
- `test-phase-command-workflows.js`
- `test-phase-system.js`
- `test-phase-validation.js`
- `test-retry-manager-behavioral.js`
- `test-scripts-modules.js`
- `test-subfolder-resolution.js`
- `test-template-comprehensive.js`
- `test-template-system.js`
- `test-utils.js`
- `test-validation-system.js`

Shell tests:
- `test-phase-system.sh`
- `test-upgrade-level.sh`
- `test-validation.sh`
- `test-validation-extended.sh`

Python tests:
- `test_dual_threshold.py`

Vitest regression suites (44 total), grouped by category:
- Pipeline and workflow:
  - `collect-session-data.vitest.ts`
  - `generate-context-cli-authority.vitest.ts`
  - `test-integration.vitest.ts`
  - `workflow-e2e.vitest.ts`
  - `workflow-warning.vitest.ts`
- Memory and context:
  - `description-enrichment.vitest.ts`
  - `memory-indexer-weighting.vitest.ts`
  - `memory-learn-command-docs.vitest.ts`
  - `memory-pipeline-regressions.vitest.ts`
  - `memory-render-fixture.vitest.ts`
  - `memory-sufficiency.vitest.ts`
  - `memory-template-contract.vitest.ts`
  - `post-save-review.vitest.ts`
  - `runtime-memory-inputs.vitest.ts`
  - `session-enrichment.vitest.ts`
  - `task-enrichment.vitest.ts`
  - `validate-memory-quality.vitest.ts`
- Validation and quality:
  - `decision-confidence.vitest.ts`
  - `progressive-validation.vitest.ts`
  - `quality-scorer-calibration.vitest.ts`
  - `semantic-signal-golden.vitest.ts`
  - `validation-rule-metadata.vitest.ts`
  - `validation-v13-v14-v12.vitest.ts`
- Normalization and filtering:
  - `auto-detection-fixes.vitest.ts`
  - `contamination-filter.vitest.ts`
  - `content-filter-parity.vitest.ts`
  - `input-normalizer-unit.vitest.ts`
  - `slug-uniqueness.vitest.ts`
  - `spec-affinity.vitest.ts`
  - `trigger-phrase-filter.vitest.ts`
- Import policy and boundaries:
  - `architecture-boundary-enforcement.vitest.ts`
  - `import-policy-rules.vitest.ts`
  - `tool-sanitizer.vitest.ts`
- Templates and docs:
  - `ascii-boxes.vitest.ts`
  - `outsourced-agent-handback-docs.vitest.ts`
  - `template-mustache-sections.vitest.ts`
  - `template-structure.vitest.ts`
- Phase and project classification:
  - `phase-classification.vitest.ts`
  - `project-phase-e2e.vitest.ts`
- Phase 016 and alignment fixtures:
  - `alignment-drift-fixture-preservation.vitest.ts`
  - `tree-thinning.vitest.ts`
- Utilities and identity:
  - `backfill-frontmatter.vitest.ts`
  - `utils-regressions.vitest.ts`
  - `workspace-identity.vitest.ts`

Fixtures and cache:
- `fixtures/` - 80 fixture files for phase-system and validation workflows
- `test-fixtures/` - symlink to `../test-fixtures` with 282 fixture files
- Generated JS artifacts:
  - `progressive-validation.vitest.js`
  - `progressive-validation.vitest.js.map`
  - `progressive-validation.vitest.d.ts.map`
  - `tree-thinning.vitest.js`
  - `tree-thinning.vitest.js.map`
  - `tree-thinning.vitest.d.ts.map`
- `.pytest_cache/`


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:recommended-run-order -->
## 3. RECOMMENDED RUN ORDER


```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build

cd tests
node test-scripts-modules.js
bash test-phase-system.sh
node test-phase-validation.js
node test-extractors-loaders.js
npx vitest run tests/test-integration.vitest.ts
bash test-upgrade-level.sh
bash test-validation.sh
python3 test_dual_threshold.py
```


<!-- /ANCHOR:recommended-run-order -->
<!-- ANCHOR:focus-areas -->
## 4. FOCUS AREAS


- Upgrade path coverage for `spec/upgrade-level.sh` and placeholder handling.
- Subfolder resolution coverage for memory save and folder matching behavior.
- Validation regression coverage for shell rule orchestration.
- Import-policy coverage for regex and AST enforcement paths.
- Task enrichment and rendered-memory fixture coverage for hardened naming fallback behavior.
- Runtime memory-input coverage for explicit JSON-mode failures and structured next-step persistence.
- Stateless enrichment coverage for spec-folder parsing, git-derived file scoping, and hyphenated-spec relevance filtering.
- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
<!-- /ANCHOR:focus-areas -->
