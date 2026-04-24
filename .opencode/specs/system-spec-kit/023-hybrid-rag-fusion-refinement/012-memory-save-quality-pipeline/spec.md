---
title: "Feature Specification: Memory [system-spec-kit/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline/spec]"
description: "Stabilize JSON-mode memory saves so structured input reliably produces usable, non-boilerplate memory context output."
trigger_phrases:
  - "memory save quality"
  - "json mode save"
  - "generate-context pipeline"
  - "context compaction save"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Memory Save Quality Pipeline

---

## EXECUTIVE SUMMARY

This phase addresses structured-input (`--json`/`--stdin`) quality regressions in memory save generation where normalization and extraction assumptions caused thin, low-value output. The work standardizes normalization, synthesis, quality scoring, and contamination handling for structured flows while preserving transcript-mode behavior.

**Key Decisions**: Reuse existing normalization pipeline; add structured-path message synthesis; add bounded quality floor.

**Critical Dependencies**: `workflow.ts`, extractor stack, validation rules, and quality scorer consistency.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-04-01 |
| **Branch** | `system-speckit/024-compact-code-graph` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 011-indexing-and-adaptive-fusion |
| **Successor** | 013-fts5-fix-and-search-dashboard |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Structured memory saves (`--json`/`--stdin`) could degrade into poor outputs when normalization did not adequately feed downstream extraction/scoring paths. This led to low quality scores, repetitive decision content, noisy key-file payloads, and avoidable contamination aborts for same-parent phase references.

### Purpose
Ensure structured saves produce coherent, retrieval-usable memory artifacts while preserving transcript-mode behavior and validator safety.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Normalize structured JSON fields into extractor-ready forms.
- Synthesize meaningful conversation messages when transcript prompts are absent.
- Improve title/summary derivation from structured input.
- Bound key-file enumeration and decision rendering noise.
- Relax contamination false positives for same-parent sibling phase references in structured mode.
- Add constrained quality floor logic for rich structured payloads.

### Out of Scope
- Major template rendering redesign.
- Non-memory command architecture changes.
- Broad contamination-rule policy changes outside structured mode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/core/workflow.ts` | Modify | Structured normalization wiring and metadata flow |
| `scripts/extractors/conversation-extractor.ts` | Modify | Structured-input message synthesis path |
| `scripts/extractors/collect-session-data.ts` | Modify | Summary/title derivation from structured context |
| `scripts/core/quality-scorer.ts` | Modify | JSON-aware quality floor logic |
| `scripts/lib/validate-memory-quality.ts` | Modify | Structured sibling-phase contamination relaxation |
| `scripts/extractors/decision-extractor.ts` | Modify | Reduced repetition for plain-string decisions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Structured input is normalized before extraction | `sessionSummary`, decisions, and file aliases flow into extractor-ready fields |
| REQ-002 | Structured saves avoid empty/thin synthetic output | Message synthesis provides meaningful user/assistant exchanges when transcript prompts are absent |
| REQ-003 | Structured contamination false positives are reduced | Same-parent sibling references in structured mode do not hard-abort as foreign scatter |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Title/summary reflect structured content | Generic fallback copy is replaced when session summary exists |
| REQ-005 | Decision and key-file payload quality improves | Plain-string decisions avoid repeated blocks and key-file list is bounded |
| REQ-006 | Structured quality floor is constrained | Floor is damped/capped and does not bypass contamination penalties |
| REQ-007 | Structured metadata remains schema-compatible | `memory_save` and index tooling accept generated metadata without schema regressions |
| REQ-008 | Verification artifacts are reproducible | The same structured scenarios can be rerun with stable output expectations |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validator reports no structural errors for Phase 012 docs.
- **SC-002**: Structured save pipeline behavior is documented consistently across spec, plan, tasks, checklist, decision record, and implementation summary.
- **SC-003**: Documentation avoids new unverified completion claims while preserving implemented-scope truth.

### Acceptance Scenarios

**Given** structured JSON input includes `sessionSummary`, `keyDecisions`, and `filesChanged`, **when** normalization executes, **then** extractor-ready fields are populated and stable across reruns.

**Given** transcript prompts are sparse or absent in structured mode, **when** synthetic message generation runs, **then** generated user and assistant messages remain meaningful and non-boilerplate.

**Given** plain-string decision entries are present in the input payload, **when** decision extraction renders output, **then** repeated blocks are reduced and decision content remains distinct.

**Given** same-parent sibling phase references appear in structured payload metadata, **when** contamination checks execute, **then** allowed sibling references do not hard-fail as foreign scatter.

**Given** quality scoring applies to structured save output, **when** bounded floor behavior is evaluated, **then** score damping/caps apply without bypassing contamination penalties.

**Given** a large `filesChanged/filesModified` list is supplied, **when** key-file rendering executes, **then** output is bounded and deterministic.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Structured-path overfitting | Could regress uncommon transcript scenarios | Keep structured guards explicit and transcript path unchanged |
| Risk | Quality floor masking weak content | Could over-score low-signal payloads | Use damping/cap and preserve contamination penalties |
| Dependency | Runtime test harness availability | Needed for confidence on scored outcomes | Mark runtime checks as pending until rerun evidence exists |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Structured-path synthesis should not materially increase save latency for typical payloads.

### Security
- **NFR-S01**: Contamination checks remain active outside scoped structured exemptions.

### Reliability
- **NFR-R01**: Structured saves produce deterministic output shape for equivalent input payloads.

---

## 8. EDGE CASES

### Data Boundaries
- Missing/short summaries should still fall back safely.
- Large `filesChanged/filesModified` payloads should be bounded.

### Error Scenarios
- Invalid structured payload fields should fail with actionable validation feedback.
- Mixed transcript + structured inputs should remain deterministic.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Multi-module extractor/validator/scoring changes |
| Risk | 20/25 | Quality + contamination behavior interactions |
| Research | 17/20 | Multiple root-cause iterations and remediation tuning |
| Multi-Agent | 10/15 | Parallel remediation/verification workstreams |
| Coordination | 10/15 | Cross-file behavior coupling |
| **Total** | **78/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Structured synthesis introduces noisy artifacts | M | M | Keep guard conditions strict and bounded |
| R-002 | Relaxed contamination scope becomes too permissive | H | L | Scope exemptions to same-parent structured references only |
| R-003 | Runtime scoring differs from documented expectation | M | M | Record post-rerun evidence before closure |

---

## 11. USER STORIES

### US-001: Structured Save Reliability (Priority: P0)

**As a** workflow operator, **I want** structured JSON saves to produce coherent memory context, **so that** saved memories remain useful after compaction and handover.

**Acceptance Criteria**:
1. Given structured input with summary/decisions, when save runs, then generated memory includes meaningful content and metadata.

### US-002: Safe Quality Guardrails (Priority: P1)

**As a** maintainer, **I want** quality scoring and contamination checks to stay protective but not over-block legitimate structured content, **so that** indexing quality improves without weakening safeguards.

**Acceptance Criteria**:
1. Given sibling-phase references in structured mode, when validation runs, then legitimate same-parent references are not falsely blocked.
2. Given structured JSON input includes session context, when normalization runs, then extractor-ready fields are populated consistently.
3. Given sparse transcript fields, when synthesis runs, then generated message pairs remain meaningful and non-boilerplate.
4. Given large filesChanged payloads, when key-file rendering runs, then output remains bounded and deterministic.
5. Given quality scoring executes on structured input, when floor logic applies, then contamination penalties are still preserved.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should structured quality floor thresholds become configurable per profile?
- Should contamination sibling allowlist generation be cached for repeated batch runs?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
