---
title: "Changelog: 006-search-intelligence-stress-test"
description: "Cross-AI stress-test playbook with 9 scenarios across cli-codex, cli-copilot, cli-opencode, plus a cli-opencode --pure ablation arm. Sweep complete with 30 scored cells and findings.md surfacing one new defect class."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
  - "006-search-intelligence-stress-test changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-26

> Spec folder: `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test` (Level 1)
> Parent packet: `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime`

### Summary

A reproducible cross-AI stress-test playbook for the system-spec-kit Search/Query/Intelligence surfaces. Dispatches a fixed 9-scenario corpus through cli-codex (gpt-5.5 medium fast), cli-copilot (gpt-5.4 high), and cli-opencode (opencode-go/deepseek-v4-pro high with full Spec Kit Memory MCP), plus a cli-opencode --pure ablation arm that disables plugins to isolate model quality from MCP advantage. Two sub-phases shipped together: 001-scenario-design owns the corpus, 5-dimension rubric, dispatch matrix, output schema, and dispatch scripts; 002-scenario-execution owns the run harness, scoring workflow, and findings synthesis. All 30 cells (27 base plus 3 ablation) dispatched, all 30 scored, findings.md synthesized.

### Added

- Root packet covering the playbook contract (REQ-001..011), two-sub-phase architecture, scoring methodology
- 001-scenario-design sub-phase with 9-scenario corpus (S1-S3 Search, Q1-Q3 Query, I1-I3 Intelligence), 5-dimension 0-2 rubric, per-CLI dispatch matrix, output schema, dispatch scripts
- 002-scenario-execution sub-phase with run harness contract, scoring workflow, findings format
- Four executable dispatch scripts under 001-scenario-design/scripts (per-CLI dispatchers plus run-all.sh orchestrator) with cli-copilot 3-process concurrency guard
- 30 captured run artifacts under 002-scenario-execution/runs (per-cell prompt + output + meta.json + score.md)
- findings.md cross-CLI comparison with per-CLI averages, top wins/failures, recommendations
- Independent cli-codex review captured in scratch (gpt-5.5 high, scored 23/30), surfacing one P0 ablation-mechanism blocker that was addressed via --pure switch before sweep started
- Live MCP probe scratch note (live-probes-2026-04-26.md) verifying 005 P0 fixes are not active in the running daemon and surfacing two new defect candidates

### Changed

- Ablation mechanism switched from `--agent context` to `--pure` per cli-codex review P0 finding. The --agent context flag swaps an OpenCode agent profile but keeps plugins active; --pure actually disables plugins and isolates model quality from MCP advantage
- cli-copilot dispatch script now passes `--effort high` explicitly per cli-codex review P0/P1 reproducibility finding (preferred over relying on ~/.copilot/config.json)

### Fixed

- BSD date `+%s%3N` portability bug in the dispatch scripts. macOS BSD date silently outputs literal "N" suffix instead of nanoseconds, leaving LATENCY_MS unbound under set -u. Replaced with python3 inline call which is portable
- set -e tripping on non-zero CLI exits before EXIT_CODE could capture the value. Wrapped each CLI invocation in set +e / set -e so failed cells produce a populated meta.json instead of aborting the sweep

### Verification

- Smoke test: cli-codex S1 dispatch produced exit 0 in 41 seconds, correctly cited 004-memory-save-rewrite/spec.md as the canonical /memory:save planner-first packet
- Sweep totals: 30 of 30 cells dispatched, 30 of 30 scored, 0 dispatch failures, 43 minutes wall-clock
- Per-CLI averages from findings.md: cli-codex 5.67/10, cli-copilot 4.22/10, cli-opencode 5.67/10, cli-opencode --pure 5.33/10
- Strict spec validation: root and both sub-phases pass with 0 errors (one non-blocking warning per sub-phase for custom domain section headers like Scenario Corpus and Execution Workflow which are core to the design and do not fit the generic Level 1 template)

### Files Changed

| File | Action | Purpose |
| ---- | ------ | ------- |
| `006-search-intelligence-stress-test/spec.md` | Create | Root packet contract, REQ-001..011, sub-phase map |
| `006-search-intelligence-stress-test/plan.md` | Create | Two-sub-phase architecture and scoring methodology |
| `006-search-intelligence-stress-test/tasks.md` | Create | Phase 1 setup plus Phase 2 sub-phase scaffolding |
| `006-search-intelligence-stress-test/implementation-summary.md` | Create | Outcome summary with design decisions |
| `006-search-intelligence-stress-test/description.json` | Create | Memory-indexer metadata |
| `006-search-intelligence-stress-test/graph-metadata.json` | Create | Graph traversal metadata |
| `001-scenario-design/spec.md` | Create | Corpus, rubric, dispatch matrix, output schema, scoring methodology |
| `001-scenario-design/plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json` | Create | Sub-phase canonical docs |
| `001-scenario-design/scripts/dispatch-cli-codex.sh` | Create | Codex per-cell dispatcher |
| `001-scenario-design/scripts/dispatch-cli-copilot.sh` | Create | Copilot dispatcher with 3-process concurrency guard |
| `001-scenario-design/scripts/dispatch-cli-opencode.sh` | Create | OpenCode dispatcher with --pure ablation mode |
| `001-scenario-design/scripts/run-all.sh` | Create | Orchestrator for the 30-cell sweep |
| `001-scenario-design/scripts/prompts/{S1..I3}.md` | Create | 9 fixed scenario prompts |
| `002-scenario-execution/spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json` | Create | Execution sub-phase canonical docs |
| `002-scenario-execution/runs/<scenario>/<cli>-<n>/` | Create | 30 per-cell artifact folders (prompt + output + meta + score) |
| `002-scenario-execution/runs/run-all.log` | Create | Sweep orchestrator log |
| `002-scenario-execution/findings.md` | Create | Cross-CLI comparison + top wins/failures + recommendations |
| `006-search-intelligence-stress-test/scratch/cli-codex-review-2026-04-26.md` | Create | Independent design review (23/30) |
| `006-search-intelligence-stress-test/scratch/live-probes-2026-04-26.md` | Create | Live MCP probe verification + new defect candidates for synthesis |

### Follow-Ups

- Materialize the new defect class surfaced in findings.md (model-side hallucination guard when `requestQuality:"weak"` plus empty `recovery.suggestedQueries` fires) as a 005 follow-up REQ — distinct from REQ-007 (broaden) and REQ-008 (no auto-bind)
- Investigate cli-copilot --allow-all-tools side-effect risk (one mid-sweep run mutated 048-cli-testing-playbooks/implementation-summary.md before being reverted). Consider scoped prompts or read-only mode for vague-intent dispatch
- Recalibrate the latency rubric thresholds (currently 10s and 60s). Zero cells scored above 0 on latency in this sweep, suggesting the thresholds are too aggressive for any non-trivial cell
- Re-run the sweep after 005 P0 fixes are made live (dist rebuild plus daemon restart) to measure the deltas the playbook is designed to detect
- Build the v2 corpus with N=3 per cell if signal proves noisy at N=1, and consider rotating cli-copilot models (gpt-5.4 vs claude-opus-4.6 vs gemini-3.1) for model-class comparison
