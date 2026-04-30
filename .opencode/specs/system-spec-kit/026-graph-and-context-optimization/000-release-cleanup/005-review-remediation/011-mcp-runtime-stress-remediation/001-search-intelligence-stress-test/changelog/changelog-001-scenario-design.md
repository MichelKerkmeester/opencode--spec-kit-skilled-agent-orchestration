---
title: "Changelog: 001-scenario-design"
description: "9-scenario corpus, 5-dimension scoring rubric, per-CLI dispatch matrix, and four executable dispatch scripts for the Search Intelligence Stress-Test Playbook."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
  - "001-scenario-design changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-26

> Spec folder: `system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design` (Level 1)
> Parent packet: `system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test`

### Summary

The design fixture for the parent stress-test playbook. Locks corpus version v1.0.0 with 9 scenarios across 3 features (Search/Query/Intelligence) by 3 prompt-types (Simple/Vague/Specific). Five of the nine scenarios cross-reference known 005 defect REQ IDs so a sweep against the live runtime serves as both a quality test and a regression check. The 5-dimension 0-2 rubric balances measurability (correctness, tool selection, latency, token efficiency, hallucination) with inter-rater reliability. The dispatch matrix codifies invocation contracts as concrete shell invocations with concurrency guards, idempotent run-folder layout, and reproducibility via meta.json captures.

### Added

- Scenario Corpus v1.0.0 with 9 scenarios (S1-S3 Search, Q1-Q3 Query, I1-I3 Intelligence). Each entry has prompt, expected outcome, target tools, success indicators, and cross-reference to sibling 005 defects where applicable
- 5-dimension scoring rubric on 0-2 scale: Correctness, Tool Selection, Latency, Token Efficiency, Hallucination, plus a narrative dimension. 10 points max per cell
- Per-CLI dispatch matrix codifying invocation contracts for cli-codex (gpt-5.5 medium fast read-only), cli-copilot (gpt-5.4 high allow-all-tools, max 3 concurrent), cli-opencode (opencode-go/deepseek-v4-pro high agent=general format=json), plus the cli-opencode --pure ablation arm
- Output schema covering per-run folder layout (prompt + output + meta.json + score.md) and aggregate findings format
- Scoring methodology with single-scorer-per-cell rule, second-reviewer trigger for any cell scoring 4 of 10 or below, tie-breaker rules, and hallucination spot-verification protocol
- Four executable dispatch scripts under scripts/ with bash -n syntax check, set +e wrap so non-zero CLI exits do not abort the sweep, and python3-based portable millisecond timing
- 9 prompt files under scripts/prompts/ (one per scenario)

### Changed

- Ablation mechanism revised mid-design from `--agent context` to `--pure` per cli-codex review P0. The original mechanism only swapped agent profiles; the corrected mechanism actually disables plugins and isolates model quality from MCP advantage
- cli-copilot dispatch invocation now passes `--effort high` explicitly per cli-codex review P0/P1 (reproducibility — preferred over relying on ~/.copilot/config.json)

### Fixed

- BSD date portability bug. macOS date does not implement `%3N` (milliseconds) and silently emits literal "N" suffix, which left LATENCY_MS unbound under set -u and crashed the script after the CLI dispatched but before meta.json was written. Replaced with `python3 -c 'import time;print(int(time.time()*1000))'`
- set -e tripping on non-zero CLI exit codes before EXIT_CODE could capture the value. Wrapped each CLI invocation in set +e / set -e so meta.json is populated for every cell including failures

### Verification

- bash -n syntax check passed on all four dispatch scripts
- Smoke test: cli-codex S1 dispatch produced exit 0 in 41 seconds, correctly cited 004-memory-save-rewrite/spec.md
- Strict spec validation: 0 errors, 1 non-blocking warning for custom domain section headers (Scenario Corpus, Scoring Rubric, Dispatch Matrix, Output Schema, Scoring Methodology) which are core to the design and do not fit the generic Level 1 template

### Files Changed

| File | Action | Purpose |
| ---- | ------ | ------- |
| `spec.md` | Create | Corpus, rubric, dispatch matrix, output schema, scoring methodology |
| `plan.md` | Create | Authoring methodology |
| `tasks.md` | Create | T001-T112 work units |
| `implementation-summary.md` | Create | Sub-phase outcome summary |
| `description.json` | Create | Indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
| `scripts/dispatch-cli-codex.sh` | Create | Codex per-cell dispatcher |
| `scripts/dispatch-cli-copilot.sh` | Create | Copilot dispatcher with 3-process concurrency guard |
| `scripts/dispatch-cli-opencode.sh` | Create | OpenCode dispatcher with --pure ablation mode |
| `scripts/run-all.sh` | Create | Orchestrator for the 30-cell sweep |
| `scripts/prompts/S1.md, S2.md, S3.md, Q1.md, Q2.md, Q3.md, I1.md, I2.md, I3.md` | Create | 9 fixed scenario prompts |

### Follow-Ups

- Recalibrate latency thresholds (10s, 60s) based on actual sweep distribution. The first sweep showed zero cells scoring above 0 on latency, indicating the thresholds are too aggressive for any non-trivial cell
- Build a v1.0.1 corpus with REQ-009 N=3 per cell if v1.0.0 N=1 signal proves noisy
- Consider extending cli-copilot to rotate models (gpt-5.4 vs claude-opus-4.6 vs gemini-3.1) for model-class comparison in v2
- Add a deterministic fallback prompt for Q1 when the structural code graph index is sparse (Q1/cli-opencode took 4 minutes on the first sweep falling back to grep)
- Cap S2 result count to make scoring tractable for the Vague-class scenario
