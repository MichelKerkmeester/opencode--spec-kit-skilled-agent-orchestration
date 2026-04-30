---
title: "Plan: Full-Matrix Execution Validation"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Execution and aggregation plan for packet 035 full-matrix validation."
trigger_phrases:
  - "035-full-matrix-execution-validation"
  - "full matrix execution"
  - "v1-0-4 stress"
  - "matrix execution validation"
  - "feature x executor matrix"
  - "feature × executor matrix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation"
    last_updated_at: "2026-04-29T14:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Aggregation complete"
    next_safe_action: "Use findings tickets"
    blockers: []
    completion_pct: 100
---
# Plan: Full-Matrix Execution Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSONL, shell, Vitest |
| **Framework** | system-spec-kit Level 2 packet |
| **Scope** | Matrix execution validation; no runtime code edits |
| **Testing** | Focused feature-adjacent runners with 5 minute cell timeout |

### Overview

The packet uses packet 030's Option C architecture as the target: each feature should own a runner and the meta-aggregator should normalize per-cell JSONL. Discovery found focused tests for most local feature surfaces but no dedicated full-matrix manifest, no complete per-feature runner set, and no external executor adapters for most cells. The plan therefore executes available focused runners and records remaining cells as blocked, missing, or not applicable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet 030 docs read. [EVIDENCE: packet 030 specification, plan, decision record, tasks, checklist, and corpus plan were read]
- [x] 013 Section 6 packet scope read. [EVIDENCE: research report read before execution]
- [x] Matrix scope frozen. [EVIDENCE: `research/iterations/iteration-001.md`]

### Definition of Done

- [x] Focused runners executed or cells explicitly marked. [EVIDENCE: `logs/feature-runs/` and `results/*.jsonl`]
- [x] Aggregated findings authored. [EVIDENCE: `findings.md`]
- [x] Follow-up tickets listed. [EVIDENCE: `findings.md` Tickets section]
- [x] Strict validator passes. [EVIDENCE: final validation run]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Frozen manifest table plus generated per-cell JSONL rows. The packet-local findings file acts as the meta-aggregator output.

### Data Flow

030 corpus plan -> 035 frozen matrix -> focused runner logs -> `results/<feature>-<executor>.jsonl` -> `findings.md` metrics and ticket ledger.

### Runner Policy

- Use only focused runner files, never `npm test` or broad suite aliases.
- Use 5 minute timeout per runner command.
- External CLI real dispatch is not synthesized when the runner adapter is absent.
- cli-codex is not self-invoked from this Codex runtime.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Create Level 2 packet files.
- Preserve startup prompt/log artifacts already created under this packet.
- Initialize matrix directories.

### Phase 2: Implementation

- Read packet 030 and 013 scope.
- Freeze 98 feature x executor cells.
- Execute available focused local runners.
- Record external CLI and missing-runner cells honestly.
- Aggregate results into findings.

### Phase 3: Validation

- Validate result and metadata JSON.
- Run strict packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Feature Group | Runner Evidence | Result |
|---------------|-----------------|--------|
| F1 | `logs/feature-runs/F1-gate3-classifier.log` | PASS |
| F2-F10, F14 | Focused Vitest logs in `logs/feature-runs/` | PASS for local/native coverage |
| F11 | `logs/feature-runs/F11-hooks.log` | FAIL due Copilot wiring assertion |
| F12 | `logs/feature-runs/F12-validators.log`, `logs/feature-runs/F12-normalizer-lint.log` | TIMEOUT_CELL for combined validator runner; normalizer-lint PASS |
| F13 | No runner found | RUNNER_MISSING |

External executor coverage is mostly blocked or runner_missing because packet 030 did not ship adapters and this Codex session cannot self-invoke cli-codex.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact |
|------------|--------|--------|
| Packet 030 design | Available | Provides feature/executor applicability |
| Focused local tests | Partially available | Enables PASS/FAIL evidence for local surfaces |
| External CLI auth/adapters | Incomplete | Blocks or misses most external executor cells |
| Strict validator | Available | Required completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If validation artifacts are malformed, remove only packet-local generated results/logs/docs and regenerate from the frozen matrix. No runtime code was changed, so no code rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

`030 design + 013 scope -> matrix freeze -> focused runner execution -> JSONL aggregation -> findings -> strict validation`
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Outcome |
|-------|------------|----------------|
| Setup | Low | Complete |
| Runner execution | Medium | Partial; external adapters missing |
| Aggregation | Medium | Complete |
| Validation | Low | Complete |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Has data migrations?** No.
- **Runtime edits?** No.
- **Reversal procedure**: delete only this packet's generated files and rerun from frozen matrix if needed.
<!-- /ANCHOR:enhanced-rollback -->
