# Agent 10: Scratch/Research/Memory Hygiene Audit

_Snapshot note: inventories and counts below reflect the pre-report state and exclude this generated `scratch/agent-10-hygiene.md` file._

## Summary
| Directory | Items | Issues Found | Grade |
| --- | ---: | ---: | :---: |
| scratch/ | 129 | 5 | C |
| research/ | 118 | 4 | C |
| memory/ (root) | 5 | 0 | A |
| memory/ (children) | 8 | 4 | C |

Security scan result: no `.DS_Store`/`Thumbs.db` artifacts and no obvious secrets/tokens/API keys were detected in the audited scope using common secret-pattern heuristics.

## scratch/ Findings
### Directory Inventory

- Totals: 93 files, 36 directories, 129 entries.
- Code/header spot-check scope: `corpus-contract-scan.mjs`, `launch-qa-fixes.sh`, `launch-qa-validation.sh`, `launch-session-audit.sh`.

#### Complete listing with categories
- `scratch/agent-01-root-spec-audit.md` — Agent audit report
- `scratch/agent-02-phases-001-004.md` — Agent audit report
- `scratch/agent-03-phases-005-008.md` — Agent audit report
- `scratch/agent-04-phases-009-012.md` — Agent audit report
- `scratch/agent-05-phases-013-016.md` — Agent audit report
- `scratch/agent-06-hvr-compliance.md` — Agent audit report
- `scratch/agent-07-cross-reference.md` — Agent audit report
- `scratch/agent-08-impl-summaries.md` — Agent audit report
- `scratch/agent-09-checklist-evidence.md` — Agent audit report
- `scratch/corpus-contract-scan.mjs` — Operational script
- `scratch/historical-memory-remediation/` — Sandbox directory
  - `scratch/historical-memory-remediation/manifest.json`
  - `scratch/historical-memory-remediation/summary.md`
- `scratch/historical-memory-remediation-final/` — Sandbox directory
  - `scratch/historical-memory-remediation-final/manifest.json`
  - `scratch/historical-memory-remediation-final/summary.md`
- `scratch/historical-memory-remediation-final-clean/` — Sandbox directory
  - `scratch/historical-memory-remediation-final-clean/manifest.json`
  - `scratch/historical-memory-remediation-final-clean/summary.md`
- `scratch/historical-memory-remediation-final-post/` — Sandbox directory
  - `scratch/historical-memory-remediation-final-post/manifest.json`
  - `scratch/historical-memory-remediation-final-post/summary.md`
- `scratch/historical-memory-remediation-last-mile/` — Sandbox directory
  - `scratch/historical-memory-remediation-last-mile/manifest.json`
  - `scratch/historical-memory-remediation-last-mile/summary.md`
- `scratch/historical-memory-remediation-last-mile-apply/` — Sandbox directory
  - `scratch/historical-memory-remediation-last-mile-apply/manifest.json`
  - `scratch/historical-memory-remediation-last-mile-apply/summary.md`
- `scratch/historical-memory-remediation-last-mile-post/` — Sandbox directory
  - `scratch/historical-memory-remediation-last-mile-post/manifest.json`
  - `scratch/historical-memory-remediation-last-mile-post/summary.md`
- `scratch/historical-memory-remediation-partial-generic/` — Sandbox directory
  - `scratch/historical-memory-remediation-partial-generic/manifest.json`
  - `scratch/historical-memory-remediation-partial-generic/summary.md`
- `scratch/historical-memory-remediation-post-apply/` — Sandbox directory
  - `scratch/historical-memory-remediation-post-apply/manifest.json`
  - `scratch/historical-memory-remediation-post-apply/summary.md`
- `scratch/historical-memory-remediation-post-fix/` — Sandbox directory
  - `scratch/historical-memory-remediation-post-fix/manifest.json`
  - `scratch/historical-memory-remediation-post-fix/summary.md`
- `scratch/launch-qa-fixes.sh` — Operational script
- `scratch/launch-qa-validation.sh` — Operational script
- `scratch/launch-session-audit.sh` — Operational script
- `scratch/legacy-memory-quarantine/` — Quarantine directory
  - `scratch/legacy-memory-quarantine/08-03-26_20-47__fixes-for-memory-pipeline-contamination.md`
  - `scratch/legacy-memory-quarantine/09-03-26_11-28__fixed-all-13-review-findings-from-gpt-5-4-triple.md`
  - `scratch/legacy-memory-quarantine/15-03-26_12-25__how-is-used-later-in-the-template-to-match-th.md`
  - `scratch/legacy-memory-quarantine/15-03-26_12-27__i-m-starting-with-the-repo-s-own-runbook-and.md`
  - `scratch/legacy-memory-quarantine/README.md`
- `scratch/research-reconciliation-checklist.md` — Reconciliation working doc
- `scratch/research-reconciliation-decisions.md` — Reconciliation working doc
- `scratch/research-reconciliation-impl-summary.md` — Reconciliation working doc
- `scratch/research-reconciliation-master.md` — Reconciliation working doc
- `scratch/research-reconciliation-spec.md` — Reconciliation working doc
- `scratch/rigorous-memory-contract-apply/` — Sandbox directory
  - `scratch/rigorous-memory-contract-apply/manifest.json`
  - `scratch/rigorous-memory-contract-apply/summary.md`
- `scratch/rigorous-memory-contract-apply-2/` — Sandbox directory
  - `scratch/rigorous-memory-contract-apply-2/manifest.json`
  - `scratch/rigorous-memory-contract-apply-2/summary.md`
- `scratch/rigorous-memory-contract-apply-3/` — Sandbox directory
  - `scratch/rigorous-memory-contract-apply-3/manifest.json`
  - `scratch/rigorous-memory-contract-apply-3/summary.md`
- `scratch/rigorous-memory-contract-apply-4/` — Sandbox directory
  - `scratch/rigorous-memory-contract-apply-4/manifest.json`
  - `scratch/rigorous-memory-contract-apply-4/summary.md`
- `scratch/rigorous-memory-contract-apply-5/` — Sandbox directory
  - `scratch/rigorous-memory-contract-apply-5/manifest.json`
  - `scratch/rigorous-memory-contract-apply-5/summary.md`
- `scratch/rigorous-memory-contract-audit/` — Sandbox directory
  - `scratch/rigorous-memory-contract-audit/manifest.json`
  - `scratch/rigorous-memory-contract-audit/summary.md`
- `scratch/rigorous-memory-contract-final/` — Sandbox directory
  - `scratch/rigorous-memory-contract-final/manifest.json`
  - `scratch/rigorous-memory-contract-final/summary.md`
- `scratch/rigorous-memory-contract-final-2/` — Sandbox directory
  - `scratch/rigorous-memory-contract-final-2/manifest.json`
  - `scratch/rigorous-memory-contract-final-2/summary.md`
- `scratch/rigorous-memory-contract-final-3/` — Sandbox directory
  - `scratch/rigorous-memory-contract-final-3/manifest.json`
  - `scratch/rigorous-memory-contract-final-3/summary.md`
- `scratch/rigorous-memory-contract-final-4/` — Sandbox directory
  - `scratch/rigorous-memory-contract-final-4/manifest.json`
  - `scratch/rigorous-memory-contract-final-4/summary.md`
- `scratch/rigorous-memory-contract-final-5/` — Sandbox directory
  - `scratch/rigorous-memory-contract-final-5/manifest.json`
  - `scratch/rigorous-memory-contract-final-5/summary.md`
- `scratch/rigorous-memory-contract-final-6/` — Sandbox directory
  - `scratch/rigorous-memory-contract-final-6/manifest.json`
  - `scratch/rigorous-memory-contract-final-6/summary.md`
- `scratch/specs-wide-memory-remediation-audit/` — Sandbox directory
  - `scratch/specs-wide-memory-remediation-audit/manifest.json`
  - `scratch/specs-wide-memory-remediation-audit/summary.md`
- `scratch/specs-wide-memory-remediation-cleanup-pass/` — Sandbox directory
  - `scratch/specs-wide-memory-remediation-cleanup-pass/manifest.json`
  - `scratch/specs-wide-memory-remediation-cleanup-pass/summary.md`
- `scratch/specs-wide-memory-remediation-final/` — Sandbox directory
  - `scratch/specs-wide-memory-remediation-final/manifest.json`
  - `scratch/specs-wide-memory-remediation-final/summary.md`
- `scratch/specs-wide-memory-remediation-final-post-cleanup/` — Sandbox directory
  - `scratch/specs-wide-memory-remediation-final-post-cleanup/manifest.json`
  - `scratch/specs-wide-memory-remediation-final-post-cleanup/summary.md`
- `scratch/specs-wide-memory-remediation-final-post-cleanup-2/` — Sandbox directory
  - `scratch/specs-wide-memory-remediation-final-post-cleanup-2/manifest.json`
  - `scratch/specs-wide-memory-remediation-final-post-cleanup-2/summary.md`
- `scratch/specs-wide-memory-remediation-structural-final/` — Sandbox directory
  - `scratch/specs-wide-memory-remediation-structural-final/manifest.json`
  - `scratch/specs-wide-memory-remediation-structural-final/summary.md`
- `scratch/specs-wide-memory-remediation-structural-fix/` — Sandbox directory
  - `scratch/specs-wide-memory-remediation-structural-fix/manifest.json`
  - `scratch/specs-wide-memory-remediation-structural-fix/summary.md`
- `scratch/task-c-apply/` — Sandbox directory
  - `scratch/task-c-apply/manifest.json`
  - `scratch/task-c-apply/summary.md`
- `scratch/task-c-final-audit/` — Sandbox directory
  - `scratch/task-c-final-audit/manifest.json`
  - `scratch/task-c-final-audit/summary.md`
- `scratch/task-c-post-audit/` — Sandbox directory
  - `scratch/task-c-post-audit/manifest.json`
  - `scratch/task-c-post-audit/summary.md`
- `scratch/task-c-pre-audit/` — Sandbox directory
  - `scratch/task-c-pre-audit/manifest.json`
  - `scratch/task-c-pre-audit/summary.md`
- `scratch/z-archive-remediation-final/` — Sandbox directory
  - `scratch/z-archive-remediation-final/manifest.json`
  - `scratch/z-archive-remediation-final/summary.md`
- `scratch/z-archive-remediation-post/` — Sandbox directory
  - `scratch/z-archive-remediation-post/manifest.json`
  - `scratch/z-archive-remediation-post/summary.md`

#### Code file header review
- `scratch/corpus-contract-scan.mjs` — OK; first line: `#!/usr/bin/env node`; second line: `/**`
- `scratch/launch-qa-fixes.sh` — OK; first line: `#!/usr/bin/env bash`; second line: `# ───────────────────────────────────────────────────────────────`
- `scratch/launch-qa-validation.sh` — OK; first line: `#!/usr/bin/env bash`; second line: `# ───────────────────────────────────────────────────────────────`
- `scratch/launch-session-audit.sh` — OK; first line: `#!/usr/bin/env bash`; second line: `# ───────────────────────────────────────────────────────────────`

### Issues

- OS artifacts: none found.
- Secrets/tokens/API keys: none found by heuristic scan.
- Stale hard-coded path: `scratch/launch-qa-validation.sh:18` points `SPEC_DIR` at `012-perfect-session-capturing`, which does not match the actual spec root `009-perfect-session-capturing`. This makes the launcher look stale and potentially unsafe to re-run as-is.
- Duplicate sandbox residue: 14 duplicate-content groups remain. Representative groups:
  - `scratch/historical-memory-remediation-final-post/manifest.json` == `scratch/historical-memory-remediation-final/manifest.json`
  - `scratch/historical-memory-remediation-final-post/summary.md` == `scratch/historical-memory-remediation-final/summary.md`
  - `scratch/historical-memory-remediation-last-mile-post/manifest.json` == `scratch/historical-memory-remediation-last-mile/manifest.json`
  - `scratch/historical-memory-remediation-last-mile-post/summary.md` == `scratch/historical-memory-remediation-last-mile/summary.md`
  - `scratch/rigorous-memory-contract-apply-2/manifest.json` == `scratch/rigorous-memory-contract-final-2/manifest.json`
  - `scratch/rigorous-memory-contract-apply-2/summary.md` == `scratch/rigorous-memory-contract-final-2/summary.md`
  - `scratch/rigorous-memory-contract-apply-3/manifest.json` == `scratch/rigorous-memory-contract-final-3/manifest.json`
  - `scratch/rigorous-memory-contract-apply-3/summary.md` == `scratch/rigorous-memory-contract-final-3/summary.md`
  - `scratch/rigorous-memory-contract-apply-4/manifest.json` == `scratch/rigorous-memory-contract-final-4/manifest.json`
  - `scratch/rigorous-memory-contract-apply-4/summary.md` == `scratch/rigorous-memory-contract-final-4/summary.md`
  - `scratch/specs-wide-memory-remediation-cleanup-pass/manifest.json` == `scratch/specs-wide-memory-remediation-final-post-cleanup/manifest.json`
  - `scratch/specs-wide-memory-remediation-cleanup-pass/summary.md` == `scratch/specs-wide-memory-remediation-final-post-cleanup/summary.md`
  - `scratch/z-archive-remediation-final/manifest.json` == `scratch/z-archive-remediation-post/manifest.json`
  - `scratch/z-archive-remediation-final/summary.md` == `scratch/z-archive-remediation-post/summary.md`
- Workflow clutter: many sibling directories encode serial cleanup attempts (`*-final`, `*-post`, `*-apply`, `*-fix`, `*-clean`) without a single obvious canonical output, which makes it harder to know which sandbox result is authoritative.
- Working-doc residue: `scratch/research-reconciliation-checklist.md`, `scratch/research-reconciliation-decisions.md`, `scratch/research-reconciliation-impl-summary.md`, and `scratch/research-reconciliation-spec.md` still carry TODO/deferred phrasing and read as active work products rather than archived scratch notes.
- Convention drift: almost every sandbox directory follows a `manifest.json` + `summary.md` shape, but `scratch/legacy-memory-quarantine/` instead stores quarantined memory files plus a README. That is reasonable as evidence storage, but it breaks the prevailing organization pattern and should be called out explicitly.

### Overall organization assessment

`scratch/` is rich and informative, but crowded. Operational scripts are clean and properly headed, yet the directory has accumulated many iterative result folders and duplicate outputs. The main hygiene concern is discoverability rather than security: a future reader will have to guess which “final/post/apply” folder is the real terminal state.

## research/ Findings
### Directory Structure

- Totals: 112 files, 6 directories, 118 entries.
- Top-level files:
  - `research/README.md`
  - `research/analysis-summary.md`
  - `research/compliance-manifest.md`
  - `research/remediation-manifest.md`
  - `research/research-pipeline-improvements.md`
- Subdirectories and full contents:
  - `research/agent-outputs/`
    - `research/agent-outputs/stateless-research/`
    - `research/agent-outputs/stateless-research/R01-code-path-trace.md`
    - `research/agent-outputs/stateless-research/R02-opencode-capture-analysis.md`
    - `research/agent-outputs/stateless-research/R03-git-history-mining.md`
    - `research/agent-outputs/stateless-research/R04-spec-folder-mining.md`
    - `research/agent-outputs/stateless-research/R05-claude-code-logs.md`
    - `research/agent-outputs/stateless-research/R06-quality-scoring-gap.md`
    - `research/agent-outputs/stateless-research/R07-input-normalizer-enhancement.md`
    - `research/agent-outputs/stateless-research/R08-file-detection-enhancement.md`
    - `research/agent-outputs/stateless-research/R09-observation-decision-building.md`
    - `research/agent-outputs/stateless-research/R10-integration-architecture.md`
    - `research/agent-outputs/stateless-research/RCA-memory-corruption-investigation.md`
    - `research/agent-outputs/stateless-research/audit-QA1-O01-workflow.md`
    - `research/agent-outputs/stateless-research/audit-QA1-O02-collect-session-data.md`
    - `research/agent-outputs/stateless-research/audit-QA1-O03-input-normalizer.md`
    - `research/agent-outputs/stateless-research/audit-QA1-O04-file-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA10-C18-copilot-synthesis.md`
    - `research/agent-outputs/stateless-research/audit-QA10-C19-test-recommendations.md`
    - `research/agent-outputs/stateless-research/audit-QA10-C20-remediation-plan.md`
    - `research/agent-outputs/stateless-research/audit-QA10-O18-opus-synthesis.md`
    - `research/agent-outputs/stateless-research/audit-QA10-O19-reconciliation.md`
    - `research/agent-outputs/stateless-research/audit-QA10-O20-quality-score.md`
    - `research/agent-outputs/stateless-research/audit-QA2-C01-workflow.md`
    - `research/agent-outputs/stateless-research/audit-QA2-C02-collect-session-data.md`
    - `research/agent-outputs/stateless-research/audit-QA2-C03-input-normalizer.md`
    - `research/agent-outputs/stateless-research/audit-QA2-C04-file-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA3-O05-spec-folder-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA3-O06-git-context-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA3-O07-integration.md`
    - `research/agent-outputs/stateless-research/audit-QA4-C05-spec-folder-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA4-C06-git-context-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA4-C07-integration.md`
    - `research/agent-outputs/stateless-research/audit-QA5-O08-opencode-capture.md`
    - `research/agent-outputs/stateless-research/audit-QA5-O09-session-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA5-O10-decision-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA6-C08-opencode-capture.md`
    - `research/agent-outputs/stateless-research/audit-QA6-C09-session-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA6-C10-decision-extractor.md`
    - `research/agent-outputs/stateless-research/audit-QA7-C11-config-filewriter.md`
    - `research/agent-outputs/stateless-research/audit-QA7-C12-contamination-types.md`
    - `research/agent-outputs/stateless-research/audit-QA7-O11-config-filewriter.md`
    - `research/agent-outputs/stateless-research/audit-QA7-O12-slug-types.md`
    - `research/agent-outputs/stateless-research/audit-QA8-O13-dataflow.md`
    - `research/agent-outputs/stateless-research/audit-QA8-O14-type-contracts.md`
    - `research/agent-outputs/stateless-research/audit-QA8-O15-imports.md`
    - `research/agent-outputs/stateless-research/audit-QA8-O16-provenance.md`
    - `research/agent-outputs/stateless-research/audit-QA8-O17-contamination-bypass.md`
    - `research/agent-outputs/stateless-research/audit-QA9-C13-null-safety.md`
    - `research/agent-outputs/stateless-research/audit-QA9-C14-execsync-security.md`
    - `research/agent-outputs/stateless-research/audit-QA9-C15-fs-security.md`
    - `research/agent-outputs/stateless-research/audit-QA9-C16-test-coverage.md`
    - `research/agent-outputs/stateless-research/audit-QA9-C17-regression.md`
    - `research/agent-outputs/stateless-research/audit-deep-research-scratch.md`
  - `research/analysis/`
    - `research/analysis/analysis-X01.md`
    - `research/analysis/analysis-X02.md`
    - `research/analysis/analysis-X03.md`
    - `research/analysis/analysis-X04.md`
    - `research/analysis/analysis-X05.md`
  - `research/audits/`
    - `research/audits/audit-C01.md`
    - `research/audits/audit-C02.md`
    - `research/audits/audit-C03.md`
    - `research/audits/audit-C04.md`
    - `research/audits/audit-C05.md`
    - `research/audits/audit-C06.md`
    - `research/audits/audit-C07.md`
    - `research/audits/audit-C08.md`
    - `research/audits/audit-C09.md`
    - `research/audits/audit-C10.md`
    - `research/audits/audit-C11.md`
    - `research/audits/audit-C12.md`
    - `research/audits/audit-C13.md`
    - `research/audits/audit-C14.md`
    - `research/audits/audit-C15.md`
    - `research/audits/audit-C16.md`
    - `research/audits/audit-C17.md`
    - `research/audits/audit-C18.md`
    - `research/audits/audit-C19.md`
    - `research/audits/audit-C20.md`
  - `research/fixes/`
    - `research/fixes/fix-01-crypto-id.md`
    - `research/fixes/fix-02-batch-rollback.md`
    - `research/fixes/fix-03-decision-confidence.md`
    - `research/fixes/fix-04-workflow-triple.md`
    - `research/fixes/fix-05-action-map.md`
    - `research/fixes/fix-06-postflight-delta.md`
    - `research/fixes/fix-07-config-wiring.md`
  - `research/qa/`
    - `research/qa/qa-01-alignment-extractors-large.md`
    - `research/qa/qa-02-alignment-workflow.md`
    - `research/qa/qa-03-alignment-collect.md`
    - `research/qa/qa-04-alignment-medium.md`
    - `research/qa/qa-05-alignment-small.md`
    - `research/qa/qa-06-p0-fixes.md`
    - `research/qa/qa-07-p1-fixes-part1.md`
    - `research/qa/qa-08-p1-fixes-part2.md`
    - `research/qa/qa-09-p2-fixes.md`
    - `research/qa/qa-10-p3-and-regressions.md`
    - `research/qa/qa-11-build-and-tests.md`
    - `research/qa/qa-12-runtime-quality.md`
    - `research/qa/qa-13-alignment-drift.md`
    - `research/qa/qa-14-manual-tests-happy.md`
    - `research/qa/qa-15-manual-tests-edge.md`
    - `research/qa/qa-16-feature-catalog-entry.md`
    - `research/qa/qa-17-readme-verification.md`
    - `research/qa/qa-18-cross-file-consistency.md`
    - `research/qa/qa-19-checklist-assessment.md`
    - `research/qa/qa-20-error-paths.md`
    - `research/qa/qa-21-security-reaudit.md`
    - `research/qa/qa-22-spec-completeness.md`
    - `research/qa/qa-23-final-synthesis.md`

### README Status

- README.md exists.
- Its stated structure matches the current directory counts: analysis=5, audits=20, qa=23, fixes=7, agent outputs=52.
- The scratch note also aligns with the current shape: 4 operational scripts plus 35 sandbox-style working directories and one quarantine directory.
- First heading: `# Research: 009-perfect-session-capturing`

### Content Quality

- Meaningful-content spot checks:
  - `research/research-pipeline-improvements.md` — 53285 chars, heading `# Research: Session Capturing Pipeline Improvements`
  - `research/analysis-summary.md` — 6503 chars, heading `# Audit Analysis Summary`
  - `research/compliance-manifest.md` — 4120 chars, heading `# Memory Compliance Manifest`
  - `research/remediation-manifest.md` — 7039 chars, heading `# Remediation Manifest`
- Placeholder/empty-file scan: no empty research markdown files found in the audited tree.
- Broken internal/local links: 879 broken links across 26 files. The biggest offenders are:
  - `research/analysis/analysis-X02.md` — 68 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L91`
  - `research/analysis/analysis-X04.md` — 68 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L603`
  - `research/analysis/analysis-X03.md` — 64 broken links; example: `</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L82>`
  - `research/audits/audit-C10.md` — 62 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts`
  - `research/audits/audit-C16.md` — 56 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:4`
  - `research/audits/audit-C12.md` — 52 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L75`
  - `research/analysis/analysis-X01.md` — 48 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L790`
  - `research/audits/audit-C08.md` — 48 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:824`
  - `research/audits/audit-C20.md` — 44 broken links; example: ` /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:202 `
  - `research/audits/audit-C18.md` — 41 broken links; example: `../feature-catalog/16-tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md`
  - `research/audits/audit-C01.md` — 36 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts`
  - `research/audits/audit-C03.md` — 30 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:725`
  - `research/audits/audit-C05.md` — 28 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:384`
  - `research/audits/audit-C13.md` — 28 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts`
  - `research/audits/audit-C17.md` — 26 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts`
  - `research/audits/audit-C15.md` — 24 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L89`
  - `research/qa/qa-13-alignment-drift.md` — 24 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`
  - `research/audits/audit-C07.md` — 23 broken links; example: `?:\`
  - `research/audits/audit-C02.md` — 22 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:23`
  - `research/audits/audit-C09.md` — 22 broken links; example: `/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`
- Broken-link patterns observed:
  - absolute local filesystem paths wrapped as markdown links
  - URL-encoded spaces such as `Opencode%20Env` in local file paths
  - malformed angle-bracket/local-path syntax such as `</Users/...>`
  - inconsistent path naming such as `feature-catalog` instead of the repository’s `feature_catalog` directory
- Naming convention assessment: file names are generally systematic and readable (`analysis-X##`, `audit-C##`, `qa-##`, `fix-##`, `R##-*`). The exception is link targets embedded inside documents, where path naming is inconsistent enough to break navigation.

## memory/ Findings
### Root memory/

- `memory/metadata.json` is valid JSON.
- Metadata keys present: `autoTriggered, decisionCount, diagramCount, embedding, filtering, messageCount, semanticSummary, skillVersion, timestamp`
- Required baseline operational fields are present for this schema: `timestamp`, `messageCount`, `decisionCount`, `diagramCount`, `skillVersion`, `autoTriggered`, `filtering`, `semanticSummary`, `embedding`.
- Root memory files:
  - `14-03-26_15-47__code-issues-found-during-review.md` — naming PASS, 601 lines, opens with `---` / `title: "Code issues found during review"`
  - `15-03-26_12-22__pass-automated-checks-100-pass-rate-across-lint.md` — naming PASS, 879 lines, opens with `---` / `title: "PASS Automated"`
  - `15-03-26_12-22__pass-automated-validation-is-strong-all-listed.md` — naming PASS, 885 lines, opens with `---` / `title: "PASS - Automated"`
  - `15-03-26_12-22__verified-trigger-phrase-yaml-rendering.md` — naming PASS, 449 lines, opens with `---` / `title: "Verified trigger phrase YAML"`
- Content meaningfulness: PASS. All four root memory files are substantial session snapshots rather than placeholders or empty stubs.

### Phase 001 memory/

- Files:
  - `16-03-26_18-04__quality-scorer-unification.md` — naming PASS, 621 lines, first non-empty line `---`
- `metadata.json` valid: YES; `specFolder`: missing; `memorySequence`: missing. Keys: `autoTriggered, decisionCount, diagramCount, embedding, filtering, messageCount, semanticSummary, skillVersion, timestamp`
- Content meaningfulness: PASS. The memory markdown is substantial and clearly session-derived.

### Phase 007 memory/

- Files:
  - `16-03-26_20-16__phase-classification.md` — naming PASS, 756 lines, first non-empty line `---`
  - `16-03-26_20-17__phase-classification.md` — naming PASS, 756 lines, first non-empty line `---`
  - `16-03-26_20-18__phase-classification.md` — naming PASS, 756 lines, first non-empty line `---`
- `metadata.json` valid: YES; `specFolder`: missing; `memorySequence`: missing. Keys: `autoTriggered, contaminationAudit, decisionCount, diagramCount, embedding, filtering, messageCount, semanticSummary, skillVersion, timestamp`
- Content meaningfulness: PASS, but organization is noisy: three same-slug snapshots were written within minutes (`20-16`, `20-17`, `20-18`), which suggests iterative overwrite avoidance rather than curated checkpoints.

### Phase 012 memory/

- Files:
  - `16-03-26_22-23__template-compliance.md` — naming PASS, 589 lines, first non-empty line `> **Warning:** Memory quality score is 55/100 (0.55), which is below the recommended threshold of 0.`
- `metadata.json` valid: YES; `specFolder`: missing; `memorySequence`: missing. Keys: `autoTriggered, contaminationAudit, decisionCount, diagramCount, embedding, filtering, messageCount, semanticSummary, skillVersion, timestamp`
- Content meaningfulness: mostly PASS, but the single memory file begins with a warning banner before the frontmatter (`> **Warning:** Memory quality score ...`), which makes the artifact less structurally clean than the other memory files.

## Remediation Recommendations

1. Clean `scratch/` by selecting one canonical result per remediation stream, then archive or delete redundant `*-final/*-post/*-apply/*-fix` siblings. At minimum, keep a README in each retained stream directory stating which folder is authoritative.
2. Fix `scratch/launch-qa-validation.sh` so `SPEC_DIR` points at `009-perfect-session-capturing` (or derive it dynamically from `SCRIPT_DIR`) before anyone reuses the launcher.
3. Normalize research links: prefer repo-relative links, remove absolute local-machine paths, fix `feature-catalog` → `feature_catalog`, and avoid URL-encoded path forms inside markdown links. The current broken-link count is high enough to justify a dedicated repair pass.
4. Decide whether child `memory/metadata.json` files are supposed to expose `specFolder` and `memorySequence`. If yes, update the generator or post-processor; if not, document the current schema clearly so audits do not expect fields that are never emitted.
5. Strip pre-frontmatter warning banners from memory markdown outputs (or relocate them into frontmatter/body fields) so memory files remain machine-consumable and structurally consistent.
6. For future scratch work, define one sandbox naming lifecycle (for example: `draft` → `apply` → `final`) and automatically prune superseded variants once a final result is accepted.
