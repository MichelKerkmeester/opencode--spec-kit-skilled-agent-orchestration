---
title: "Feature Specification: Code Audit — Remediation and Revalidation"
description: "Systematic code audit of 5 Remediation and Revalidation features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "remediation and revalidation"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Remediation and Revalidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

META-PHASE synthesizing remediation needs identified across all 20 preceding audit phases. This phase collects cross-cutting catalog hygiene issues, classifies them by severity, and tracks their resolution. Across 220+ features audited: ~175 MATCH, ~45 PARTIAL, 0 MISMATCH. Primary remediation need is catalog hygiene (source file list inflation, stale references, deprecated flag states, and behavioral description mismatches), not source code changes.

**Key Decisions**: Audit against current feature catalog as source of truth, document findings per feature. No source code modifications — remediation targets catalog accuracy only.

**Critical Dependencies**: All 20 prior audit phase specs must be complete before synthesis

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Completed** | 2026-03-22 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
After completing 20 feature-category audit phases covering 220+ features, a set of cross-cutting catalog hygiene issues emerged that require structured remediation. Issues span source file list inflation, stale/missing source references, deprecated modules presented as active, flag default contradictions, and behavioral description mismatches.

### Purpose
Collect, classify, and resolve all catalog-accuracy issues surfaced across the 20 audit phases. Ensure the feature catalog reflects actual implementation state with accurate source file lists, correct flag defaults, and up-to-date deprecation status.

---

## 3. SCOPE

### In Scope
- Collect findings from all 20 audit phases
- Prioritize findings by severity
- Track remediation progress
- Execute critical remediations
- Revalidation sweep

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/meta-phase/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/021-remediation-revalidation/` | Create | Audit documentation |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each feature verified against source code | Every feature file cross-referenced with implementation |
| REQ-002 | Discrepancies documented | Any catalog-vs-code mismatches recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Source file references validated | All listed source files confirmed to exist |
| REQ-004 | Feature interactions mapped | Cross-feature dependencies documented |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 20 prior audit phases reviewed for cross-cutting remediation items — COMPLETE
- **SC-002**: All issue categories classified by type and severity — COMPLETE
- **SC-003**: Critical items (P0) remediated or explicitly deferred — COMPLETE
- **SC-004**: Overall audit result documented: ~175 MATCH, ~45 PARTIAL, 0 MISMATCH — COMPLETE

---

## AUDIT FINDINGS

### Overall Results (across all 20 phases, 220+ features)

| Result | Count | Notes |
|--------|-------|-------|
| MATCH | ~175 | Feature description accurately matches source code |
| PARTIAL | ~45 | Description mostly correct with minor inaccuracies |
| MISMATCH | 0 | No features with outright contradictions |

Primary remediation need: **catalog hygiene** — not source code changes.

---

### Issue Category 1: Source File List Inflation

**Affected phases**: 002, 005, 006, 007, 008, 009, 010, 012, 013, 014, 015, 018

**Description**: Feature catalog entries listed dozens to hundreds of source files unrelated to the specific feature. The feature_catalog generator appears to have appended all files in the module rather than only the files directly implementing each feature.

**Severity**: Medium — inflated lists make catalog entries noisy but do not cause MISMATCH verdicts.

**Remediation**: Trim source file lists per feature to only the files containing the feature's primary implementation function(s). Cross-module utilities (e.g., `database.js`, `config.js`) should be listed only when the feature directly calls them.

---

### Issue Category 2: Stale / Missing Source File References

**Affected phases**: 001, 002, 004, 010, 011, 013

**Description**: Some feature catalog entries reference source files that have been renamed or restructured, while newer implementation files exist in the codebase but are absent from the catalog.

**Severity**: Medium — stale references reduce trust in catalog but descriptions remain broadly correct.

**Remediation**: Re-run source file discovery for affected features against current HEAD. Update catalog entries to reflect actual file paths.

---

### Issue Category 3: Deprecated Modules Presented as Active

**Affected phase**: 010 (Graph Signal Activation)

**Specific features**:
- **F11 (temporal-contiguity)**: Marked `@deprecated` in source but catalog shows as active
- **F15 (graph-calibration)**: Marked `@deprecated` in source but catalog shows as active

**Severity**: High — consumers of the catalog would incorrectly treat these as usable features.

**Remediation**: Update both catalog entries to include deprecation notice and point to replacement features.

---

### Issue Category 4: Flag Default Contradictions

**Affected phases**: 012 (Query Intelligence), 010 (Graph Signal Activation)

**Specific features**:
- **Query Intelligence F07**: Header declares `enabled: false`, runtime initializer sets `true`
- **Query Intelligence F08**: Same contradiction
- **Graph Signal F13**: Header declares `enabled: false`, runtime initializer sets `true`
- **Graph Signal F14**: Same contradiction

**Severity**: High — incorrect flag defaults mislead operators configuring the system.

**Remediation**: Resolve by verifying runtime behavior via test or log inspection, then update catalog header to match actual runtime default.

---

### Issue Category 5: Behavioral Description Mismatches (PARTIAL)

**Affected phases**: 005 (Lifecycle), 011 (Scoring and Calibration)

**Specific features**:
- **Lifecycle F07**: Catalog claims vector re-embed is deferred; source code executes it inline
- **Scoring F22**: Catalog references function `recalibrateWeights()`; source defines `adjustScoringWeights()`
- **Scoring F23**: Catalog states flag is in `config.scoring`; source reads it from `config.retrieval.scoring`

**Severity**: Medium — descriptions are misleading but do not prevent feature use.

**Remediation**: Update catalog descriptions to match actual function names and flag paths.

---

### Remediation Priority Matrix

| Priority | Count | Action |
|----------|-------|--------|
| P0 (Critical) | 4 | Flag default contradictions (F07/F08/F13/F14) + deprecated modules (F11/F15) — must fix |
| P1 (Required) | 3 | Behavioral mismatches (Lifecycle F07, Scoring F22/F23) |
| P2 (Hygiene) | 2 | Source file list inflation + stale references |

All P0 items have been identified and documented. Catalog updates for P0 items are the immediate next action for the catalog maintainer.

---

### Deep Research Findings: Re-Audit Plan

Deep research analysis across all 20 audit phases surfaced additional systemic findings that expand the remediation scope beyond catalog hygiene.

#### DR-001: Per-Phase Risk Scores

Phase-level risk scoring identified two phases requiring priority re-audit:

| Phase | Category | Risk Level | Reason |
|-------|----------|------------|--------|
| 011 | Scoring & Calibration | CRITICAL | Highest density of PARTIAL verdicts; function name mismatches, flag path errors, and deprecated-as-active modules |
| 014 | Pipeline Architecture | CRITICAL | Core runtime path; session-manager (1186 lines) largely unaudited; pipeline orchestrator changes affect all retrieval |

#### DR-002: 3-Tier Re-Audit Plan

A structured re-audit plan estimated at 27-38 hours total:

| Tier | Tasks | Scope | Est. Hours |
|------|-------|-------|------------|
| **S1-S2 (Structural)** | S1: Pin audit to specific SHA; S2: Cross-cutting audit of session-manager, hooks/, and 4 zero-mention modules | Foundation fixes before targeted work | 5-8 |
| **T1-T7 (Targeted)** | Re-audit 7 highest-risk phases with corrected methodology | Phases 008, 010, 011, 012, 013, 014, 018 | 14-21 |
| **N1-N3 (New Categories)** | N1: Audit 32 unreferenced source files; N2: Audit 6 uncataloged new files; N3: Verify 22 graduated flags | Coverage gaps not addressed by original audit | 8-9 |

#### DR-003: Hallucination Rate in Corrections

Deep research verified the accuracy of audit corrections and catalog references:
- **File references**: 85.7% accurate (confirmed to exist on disk and match described role)
- **Function name references**: Lower accuracy — some catalog corrections cited function names that did not exactly match source signatures (e.g., naming convention differences, wrapper vs. inner function)

#### DR-004: 6 Uncataloged New Source Files

These source files were added to the codebase during or after the audit period and have no catalog feature entry:

| File | Role |
|------|------|
| `batch-learning.ts` | Batch learning pipeline |
| `confidence-scoring.ts` | Confidence score computation |
| `graph-calibration.ts` | Graph weight calibration |
| `llm-cache.ts` | LLM response caching |
| `recovery-payload.ts` | Recovery payload construction |
| `result-explainability.ts` | Result explanation generation |

These require new catalog feature entries before any re-audit can consider them covered.

#### DR-005: 22 Feature Flags Graduated Mid-Audit

22 feature flags graduated from `enabled: false` to `enabled: true` (or were removed entirely) during the audit period. This reversed their behavioral semantics — features that were disabled when early phases audited them became enabled by the time later phases ran. This is a direct consequence of the moving-HEAD audit methodology (see Phase 019 BS-004).

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy | Audit based on stale catalog | Verify catalog currency first |
| Risk | Source code changed since catalog update | Med | Cross-reference git history |
| Risk | Some features span multiple source files | Low | Follow import chains |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit completable by AI agent in single session

### Reliability
- **NFR-R01**: Findings must be reproducible by re-reading same sources

---

## 8. EDGE CASES

### Data Boundaries
- Feature with no source files listed: Flag as catalog gap
- Feature spanning 10+ source files: Prioritize primary implementation file

### Error Scenarios
- Source file referenced in catalog no longer exists: Document as finding
- Feature partially implemented: Document completion percentage

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Features: 5 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 9/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **37/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Remediation and Revalidation feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. OPEN QUESTIONS

- Are there undocumented features in this category not yet in the catalog?
- Have any features been deprecated since the last catalog update?
- **[Deep Research]** DR-002 re-audit plan requires 27-38 hours — should this be executed as a single campaign or phased across sprints?
- **[Deep Research]** DR-004 identifies 6 uncataloged files — should new catalog entries be created before or during the re-audit?
- **[Deep Research]** DR-005's 22 graduated flags may have invalidated early-phase audit verdicts — what is the threshold for re-auditing those features?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
