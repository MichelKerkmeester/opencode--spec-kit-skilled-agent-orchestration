---
title: "Changelog: 002-scenario-execution"
description: "Run harness for the Search Intelligence Stress-Test Playbook. 30 of 30 cells dispatched and scored, findings.md synthesized with per-CLI averages and one new defect class."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
  - "002-scenario-execution changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-26

> Spec folder: `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution` (Level 1)
> Parent packet: `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test`

### Summary

The execution harness for the parent stress-test playbook. Defines the four-stage workflow (pre-flight, dispatch, manual scoring, findings aggregation) with idempotent run-folder layout so re-runs with --skip-existing resume mid-sweep without losing prior cells. The first full sweep ran 27 base cells (9 scenarios by 3 CLIs) plus 3 cli-opencode --pure ablation cells in 43 minutes wall-clock with zero dispatch failures. All 30 cells scored against the 001 rubric and synthesized into findings.md with per-CLI averages, top wins per CLI, top failures per CLI, cross-references to 005 defect REQs, and recommendations. The synthesis surfaces one net-new defect class (model-side hallucination on weak retrieval signal) that was not in 005's REQ-001..017.

### Added

- Execution scaffold with pre-flight contract, dispatch loop architecture, output capture schema, manual scoring workflow, findings aggregation contract
- 4-stage flow with clean handoffs (pre-flight failure aborts; dispatch failure marks SKIPPED; scoring is human-paced; aggregation reads score files)
- Per-run artifacts folder layout under runs/ with prompt + output + meta.json + score.md per cell
- Per-cell meta.json schema capturing latency_ms, tokens_in_estimate, tokens_out_estimate, model, exit_code, started_at, completed_at
- Concurrency strategy honoring cli-copilot 3-process cap (per repo Phase 018 convention) with serial dispatch for cli-codex and cli-opencode
- 30 captured run artifact folders (27 base cells plus 3 ablation cells), all with populated prompt + output + meta + score
- findings.md cross-CLI comparison with executive summary, per-scenario table, top 3 wins per CLI, top 3 failures per CLI, 005 cross-reference table, and 3 actionable recommendations

### Changed

- run-all.sh ablation step rewritten to call a dedicated dispatch_one_ablation function that invokes dispatch-cli-opencode.sh with the --pure ablation_mode argument, replacing the original --agent context approach

### Fixed

- One mid-sweep side-effect: cli-copilot in --allow-all-tools mode mutated an unrelated spec folder (048-cli-testing-playbooks/implementation-summary.md) during the I1 cell. Reverted immediately. Documented in findings.md as a recommendation to switch vague-intent dispatch to scoped prompts or a read-only mode

### Verification

- All 30 cells in runs/ have meta.json with exit_code 0
- All 30 cells in runs/ have score.md with 5-dimension scores plus narrative
- findings.md present with all required sections (Executive Summary, Per-Scenario Comparison, Top 3 Wins per CLI, Top 3 Failures per CLI, Cross-Reference to 005 Defects, Recommendations)
- Per-CLI averages: cli-codex 5.67 of 10, cli-copilot 4.22 of 10, cli-opencode 5.67 of 10, cli-opencode --pure 5.33 of 10
- New actionable insight surfaced not already in 005 (model-side hallucination guard for weak retrievals), satisfying parent SC-003
- Strict spec validation: 0 errors, 1 non-blocking warning for custom domain section headers (Execution Workflow, Findings Format, Executive Summary, Per-Scenario Comparison) which are core to the contract and do not fit the generic Level 1 template

### Files Changed

| File | Action | Purpose |
| ---- | ------ | ------- |
| `spec.md` | Create | Execution scaffold, run schema, findings format |
| `plan.md` | Create | 4-stage flow, concurrency strategy, scoring workflow |
| `tasks.md` | Create | T001-T504 work units (T001-T006 scaffold complete; T101-T504 executed by sweep agent) |
| `implementation-summary.md` | Create | Sub-phase outcome summary |
| `description.json` | Create | Indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
| `runs/<scenario>/<cli>-<n>/prompt.md` | Create | 30 captured prompts (one per cell) |
| `runs/<scenario>/<cli>-<n>/output.txt` | Create | 30 captured CLI stdout+stderr (one per cell) |
| `runs/<scenario>/<cli>-<n>/meta.json` | Create | 30 captured timing + token + exit code records |
| `runs/<scenario>/<cli>-<n>/score.md` | Create | 30 manual scores against the 5-dimension rubric |
| `runs/run-all.log` | Create | Sweep orchestrator log |
| `findings.md` | Create | Cross-CLI synthesis with per-CLI averages and recommendations |

### Follow-Ups

- File the model-side hallucination defect candidate (suggested 005/REQ-018) for the next remediation packet. Distinct from REQ-007 (broaden) and REQ-008 (no auto-bind)
- Tighten cli-copilot dispatch to scoped prompts or a read-only mode for vague-intent cells. The I1 side-effect that mutated 048-cli-testing-playbooks/implementation-summary.md is a Phase 018 safety regression risk in real workflows
- Re-run the sweep after the 005 Cluster 1-3 P0 fixes go live in the running daemon (dist rebuild plus daemon restart). The current sweep measured the pre-fix runtime
- Calibrate latency thresholds based on the observed distribution. Zero cells scored above 0 on latency in this sweep
- If signal at N=1 proves noisy across multiple sweeps, expand to N=3 per cell per parent REQ-009
