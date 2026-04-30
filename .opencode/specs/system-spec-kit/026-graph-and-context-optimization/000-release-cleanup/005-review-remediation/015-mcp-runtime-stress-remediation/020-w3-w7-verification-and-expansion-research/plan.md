---
title: "Implementation Plan: W3-W7 Verification & Expansion Research"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Plan for executing a research-only 10-iteration deep research loop over W3-W7 wiring, adjacent integrations, enterprise-readiness gaps, and empty-folder audit. The work creates packet-local research artifacts only; runtime code and prior packets remain read-only."
trigger_phrases:
  - "020-w3-w7-verification-and-expansion-research"
  - "W3-W7 verification plan"
  - "deep research plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research"
    last_updated_at: "2026-04-29T07:50:00Z"
    last_updated_by: "codex"
    recent_action: "Created Level 2 plan for completed research packet"
    next_safe_action: "Use research/research-report.md Planning Packet for Phase G"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: W3-W7 Verification & Expansion Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSONL, TypeScript source review, shell audit |
| **Framework** | system-spec-kit deep research packet |
| **Storage** | Packet-local `research/` artifacts |
| **Testing** | JSONL parse checks, file-count checks, strict spec validator |

### Overview

Execute a research-only 10-iteration loop over W3-W7 runtime wiring and expansion opportunities. The approach is evidence-first: read predecessor packets and runtime/test files, produce per-iteration narratives and JSONL deltas, then synthesize a 9-section report with a remediation Planning Packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable in `spec.md`.
- [x] Dependencies identified: Phase C report, Phase D/E implementation packets, W3-W7 runtime/test files.

### Definition of Done
- [x] 10 iteration files created under `research/iterations/`.
- [x] 10 delta JSONL files created under `research/deltas/`.
- [x] `deep-research-state.jsonl` records iteration events and synthesis event.
- [x] `research/research-report.md` contains the required 9-section structure.
- [x] Packet validation run and any packet-local documentation issues repaired.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research loop with externalized state.

### Key Components
- **Research strategy**: `research/deep-research-strategy.md` tracks focus map, final findings, and convergence.
- **State log**: `research/deep-research-state.jsonl` records config, iteration events, and synthesis completion.
- **Iteration narratives**: `research/iterations/` captures evidence and verdict per iteration.
- **Deltas**: `research/deltas/` captures machine-readable finding events.
- **Final report**: `research/research-report.md` answers RQ1-RQ10 and seeds Phase G.

### Data Flow

Spec charter and predecessor evidence feed iteration-specific source reads. Each iteration writes a narrative and JSONL delta, appends state, updates strategy, and contributes to the final report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Bootstrap and Evidence Load
- [x] Read `spec.md`, strategy, config, state, Phase C report, and Phase D/E packet summaries.
- [x] Resolve stale predecessor path to the actual Phase D/E packet location.

### Phase 2: Iterative Research
- [x] Run W3 trust-tree production consumer audit.
- [x] Run W4 conditional rerank path audit.
- [x] Run W5 shadow data path audit.
- [x] Run W6 CocoIndex calibration audit.
- [x] Run W7 degraded-readiness coverage audit.
- [x] Run cross-W, adjacent-pipeline, empty-folder, enterprise, and expansion synthesis iterations.

### Phase 3: Synthesis and Verification
- [x] Write final 9-section report.
- [x] Write 10 iteration narratives and 10 delta files.
- [x] Validate JSONL artifacts.
- [x] Run strict validator and repair packet-local documentation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Required file counts | `find`, `wc` |
| Data validity | JSONL parseability | `jq` |
| Spec validation | Level 2 packet conformance | `scripts/spec/validate.sh --strict` |
| Manual review | Research report sections and citations | direct file read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase C report | Internal spec packet | Available | Would reduce predecessor context |
| Phase D/E packets | Internal spec packets | Available | Would block built-vs-planned comparison |
| `.opencode/skill/system-spec-kit/mcp_server/` | Runtime source | Available read-only | Would block W3-W7 wiring audit |
| Spec validator | Local script | Available | Needed for completion claim |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts are materially wrong or validator cannot be repaired without changing runtime code.
- **Procedure**: Revert packet-local docs/artifacts for this packet only, then re-run research from the last good state log entry.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Bootstrap evidence -> Iterative research -> Synthesis/report -> Packet validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Bootstrap evidence | Existing charter and predecessor packets | Iterative research |
| Iterative research | Bootstrap evidence | Synthesis/report |
| Synthesis/report | Iterative research | Packet validation |
| Packet validation | Synthesis/report | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Bootstrap evidence | Medium | Completed |
| Iterative research | High | Completed |
| Synthesis/report | Medium | Completed |
| Verification | Medium | Completed |
| **Total** | | **Completed in this session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime code changes.
- [x] Writes scoped to the approved packet.
- [x] Research artifacts are additive.

### Rollback Procedure
1. Remove or revert packet-local research artifacts.
2. Restore prior state/strategy files from VCS if needed.
3. Re-run strict validator.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
