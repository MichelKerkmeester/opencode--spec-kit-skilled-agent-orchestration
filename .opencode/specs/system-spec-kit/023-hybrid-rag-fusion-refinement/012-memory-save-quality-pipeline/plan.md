---
title: "Implementation Plan: Memory [system-spec-kit/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline/plan]"
description: "Level-3 implementation plan for structured save normalization, synthesis, quality scoring, and contamination-guard tuning."
trigger_phrases:
  - "memory save quality plan"
  - "json mode plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Memory Save Quality Pipeline

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (scripts workspace) |
| **Framework** | Spec-kit context generation pipeline |
| **Storage** | Markdown output + memory index ingestion |
| **Testing** | Script integration checks + validator runs |

### Overview
This plan stabilizes structured memory saves by ensuring input normalization, extractor synthesis, and quality/validation stages operate coherently for `--json`/`--stdin` payloads. The approach is incremental and preserves transcript-mode semantics.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause for structured-path quality failures documented.
- [x] Remediation areas identified (normalization, extraction, scoring, validation).
- [x] Scope constrained to quality pipeline behavior.

### Definition of Done
- [ ] Phase 012 documents pass structural validation (no hard errors).
- [ ] Structured-path runtime verification evidence refreshed.
- [ ] Checklist and summary updated with final rerun evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline hardening through targeted improvements in existing extraction and scoring components.

### Key Components
- **Normalization layer**: Maps structured fields into canonical internal forms.
- **Conversation extraction layer**: Produces meaningful synthetic exchanges when prompts are absent.
- **Quality/validation layer**: Scores output and applies contamination safeguards with structured-mode nuance.

### Data Flow
Structured payload enters normalization, feeds extraction/synthesis, then passes through decision/key-file shaping and quality scoring. Validation gates determine final save viability.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm structured-path failure signatures and quality symptoms.
- [x] Identify key files for normalization/extraction/validation/scoring.

### Phase 2: Core Implementation
- [x] Wire structured input through normalization.
- [x] Add structured message synthesis path.
- [x] Improve title/summary and decision/key-file shaping.
- [x] Add structured-aware contamination and quality-floor logic.

### Phase 3: Verification
- [ ] Run fresh runtime structured-save scenarios and capture score outcomes.
- [ ] Confirm transcript-path regression safety in rerun evidence.
- [ ] Record final validator/runtime closure evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Extractor and scorer behavior | Vitest |
| Integration | Structured payload end-to-end save path | `generate-context.js --json` |
| Manual | Recursive strict structure and consistency checks | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Script build/runtime availability | Internal | Green | Cannot verify functional behavior |
| Representative structured payloads | Internal | Yellow | Score/quality confidence delayed |
| Validation rule compatibility | Internal | Yellow | Structured saves may still over-block |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Structured saves regress or transcript mode behavior changes unexpectedly.
- **Procedure**: Revert structured-path changes by module, rebuild scripts dist, and rerun targeted checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Normalization ──► Synthesis ──► Quality/Validation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2h |
| Core Implementation | High | 4-10h |
| Verification | Medium | 2-4h |
| **Total** |  | **7-16h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline behavior documented.
- [x] Scope-limited file set identified.
- [ ] Final rerun evidence captured.

### Rollback Procedure
1. Revert structured-path patches in affected modules.
2. Rebuild scripts and rerun baseline checks.
3. Restore previous behavior docs if needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable for doc-only structural remediation; runtime path uses code rollback.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
workflow.ts
   ├── input-normalizer.ts
   ├── conversation-extractor.ts
   ├── collect-session-data.ts
   ├── decision-extractor.ts
   ├── validate-memory-quality.ts
   └── quality-scorer.ts
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Normalization | Input payload | Canonical fields | Synthesis |
| Synthesis | Canonical fields | Message stream | Scoring |
| Scoring/Validation | Message stream + metadata | Save outcome | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Normalization wiring and alias mapping
2. Structured synthesis path
3. Validation/scoring guard updates
4. Runtime verification and evidence capture

**Total Critical Path**: Medium-high (multi-module)

**Parallel Opportunities**:
- Decision/key-file shaping can run in parallel with title/summary derivation.
- Checklist/summary structural cleanup can run in parallel with runtime reruns.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Structured normalization wired | Canonical fields populated from JSON | Complete |
| M2 | Extraction/scoring behavior updated | Non-thin structured outputs generated | Complete |
| M3 | Verification closure | Validator errors cleared + runtime evidence refreshed | In progress |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse Existing Normalization and Add Structured Synthesis Path

**Status**: Accepted

**Context**: Existing pipeline already had partial structured support but not reliable coverage.

**Decision**: Extend existing normalization and extraction layers rather than creating a separate pipeline.

**Consequences**:
- Lower implementation risk and clearer maintenance path.
- Requires careful guarding to avoid transcript-path regressions.
