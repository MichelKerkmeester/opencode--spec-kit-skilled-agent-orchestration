---
title: "Implementation Plan: Memory Deep Quality Investigation"
description: "Three-phase investigation plan: map 562 findings to root causes in the generator code, classify fixes, and produce a phase-006 proposal for generator-level remediation."
trigger_phrases:
  - "memory investigation plan"
  - "generator root cause analysis"
  - "memory quality deep dive"
  - "phase 005 investigation plan"
importance_tier: "important"
contextType: "research"
---
# Implementation Plan: Memory Deep Quality Investigation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js / TypeScript (generator), Markdown + YAML (memory files) |
| **Framework** | system-spec-kit memory v2.2 generator pipeline |
| **Storage** | File-based memory corpus + SQLite vector index (read-only for this phase) |
| **Testing** | Code tracing, spot checks, cross-reference validation |

### Overview
This is an **investigation-only** phase. Read the 562 findings from phase 004's deep audit, trace each category back to the generator code path that produced the defect, classify the root cause, and propose a follow-up phase 006 for the actual fix work. No file modifications.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 562 findings baseline available in `scratch/deep-findings.json`
- [x] Generator source code accessible under `.opencode/skill/system-spec-kit/scripts/src/memory/`
- [ ] Phase 004 marked complete (all 83 surface findings resolved)

### Definition of Done
- [ ] 16/16 finding categories mapped to root causes
- [ ] Each category classified as: generator bug / template bug / upstream data bug / historical accept
- [ ] Phase 006 proposal drafted
- [ ] No generator code modified
- [ ] No memory files modified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Investigation Approach
Code archaeology + cross-reference analysis. No runtime changes.

### Key Components (read-only)
- **deep-findings.json**: 562 findings across 16 categories (the investigation input)
- **generate-context.js / .ts source tree**: the generator being investigated
- **Sample memory files**: concrete examples of each defect category
- **root-causes document** (output): maps categories to generator code paths

### Data Flow
```
deep-findings.json
    ↓
For each category:
  ↓ Read 2-3 sample files
  ↓ Trace pattern in generator source
  ↓ Identify code path or upstream data source
  ↓ Classify as bug / template / data / historical
    ↓
root-causes document (per-category root cause map)
    ↓
phase-006-proposal document (prioritized fix plan)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `scratch/deep-findings.json` and verify category counts
- [ ] Inventory generator source tree under `.opencode/skill/system-spec-kit/scripts/src/memory/`
- [ ] Map each finding category to candidate source files (hypothesis)
- [ ] Sample 3 files per category for concrete inspection

### Phase 2: Implementation
- [ ] Root cause analysis for each of the 16 categories:
  - [ ] causal_links_empty (123 files) — trace extractor
  - [ ] trigger_phrases_overlapping (113) — trace phrase generator
  - [ ] provenance_empty (109) — trace session capture
  - [ ] git_fileCount_zero (44) — trace git state capture
  - [ ] title_pathSuffix (37) — trace title builder
  - [ ] spec_folder_health_errors (35) — trace validator
  - [ ] key_topics_duplicated (34) — trace topic extractor
  - [ ] stale_specFolder_refs (27) — trace reference validator
  - [ ] trigger_phrases_ngramNoise (15) — trace phrase filter
  - [ ] decisions_mismatch (14) — trace decision extractor
  - [ ] continueSession_template (6) — trace continue-session builder
  - [ ] duplicate_sessions (5) — trace session dedup
- [ ] Write `root-causes document` with one section per category
- [ ] Write `downstream-impact document` quantifying blast radius
- [ ] Write `phase-006-proposal document` with prioritized fix list

### Phase 3: Verification
- [ ] Verify all 16 categories have root causes documented
- [ ] Verify each root cause cites specific line numbers in generator code
- [ ] Verify phase-006 proposal has P0/P1/P2 priorities
- [ ] Verify no generator or memory files were modified
- [ ] Update implementation-summary.md with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Code tracing | Each category's root cause backed by generator source | Read, Grep |
| Spot checks | Each hypothesis verified with 3 sample files | Read |
| Cross-reference | Root causes consistent across categories | Manual review |
| No-modification | Verify no files changed during investigation | `git diff --stat` should show only scratch/ and this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `scratch/deep-findings.json` | Internal | Green | Cannot proceed without baseline |
| Generator source tree | Internal | Green | Required for root cause tracing |
| Phase 004 completion | Internal | Green | Prerequisite (surface pass done) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Investigation produces unclear or contradictory root causes.
- **Procedure**: No rollback needed — investigation is read-only. Re-run analysis with tighter scope.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Root Cause Analysis) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Root Cause Analysis |
| Root Cause Analysis | Setup | Verification |
| Verification | Root Cause Analysis | Phase 006 proposal |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min (read inputs, map source tree) |
| Root Cause Analysis | High | 2-3 sessions (16 categories × ~10 min each + synthesis) |
| Verification | Low | 30 min (cross-check outputs) |
| **Total** | | **3-4 sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [x] No generator code will be modified
- [x] No memory files will be modified
- [x] All outputs go to this phase folder

### Rollback Procedure
1. Read-only investigation — no rollback needed
2. If outputs are wrong, simply rewrite the artifacts in this phase folder

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — investigation-only
<!-- /ANCHOR:enhanced-rollback -->
