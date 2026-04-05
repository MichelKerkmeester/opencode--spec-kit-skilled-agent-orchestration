---
title: "Feature [system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011-scoring-and-calibration/spec]"
description: "Systematic code audit of 22 live Scoring and Calibration features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "scoring and calibration"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Scoring and Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

### Executive Summary

Systematic code audit of 22 live Scoring and Calibration features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/11--scoring-and-calibration/` category is verified against source code to confirm accuracy, completeness, and catalog alignment.

**Key Decisions**: Audit against current feature catalog as source of truth, document findings per feature

**Critical Dependencies**: Feature catalog must be current and accurate

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../010-graph-signal-activation/spec.md |
| **Successor** | ../012-query-intelligence/spec.md |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Scoring and Calibration has evolved significantly. Existing audit documentation was stale and no longer reflected the current 22 live-feature inventory. This packet truth-syncs the certified live count and explicitly treats F23 as retired and out of scope for the active inventory.

### Purpose
Verify that all 22 live Scoring and Calibration features are accurately documented in the feature catalog and correctly implemented in source code.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Score normalization
- Cold-start novelty boost
- Interference scoring
- Classification-based decay
- Folder-level relevance scoring
- Embedding cache
- Double intent weighting investigation
- RRF K-value sensitivity analysis
- Negative feedback confidence signal
- Auto-promotion on validation
- Scoring and ranking corrections
- Stage 3 effectiveScore fallback chain
- Scoring and fusion corrections
- Local GGUF reranker via node-llama-cpp
- Tool-level TTL cache
- Access-driven popularity scoring
- Temporal-structural coherence scoring
- Adaptive shadow ranking
- Learned Stage 2 weight combiner
- Shadow feedback holdout evaluation
- Calibrated overlap bonus
- RRF K experimental tuning

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/11--scoring-and-calibration/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/011-scoring-and-calibration/` | Create | Audit documentation |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
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
| REQ-005 | Audit results reusable for release-control follow-up | Summary stats and companion-doc cross-references recorded in this packet |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 22 live features audited with findings documented
- **SC-002**: Zero unverified features remaining in this category

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy | Audit based on stale catalog | Verify catalog currency first |
| Risk | Source code changed since catalog update | Med | Cross-reference git history |
| Risk | Some features span multiple source files | Low | Follow import chains |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit completable by AI agent in single session

### Reliability
- **NFR-R01**: Findings must be reproducible by re-reading same sources

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Feature with no source files listed: Flag as catalog gap
- Feature spanning 10+ source files: Prioritize primary implementation file

### Error Scenarios
- Source file referenced in catalog no longer exists: Document as finding
- Feature partially implemented: Document completion percentage

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Features: 22 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 15/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **53/100** | **Level 3** |

---

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

### User Stories

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Scoring and Calibration feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

### Audit Findings

Audit completed 2026-03-22. 22 live features verified. Result: **19 MATCH, 3 PARTIAL**.

**Deep Review Update (2026-03-25)**: F19 and F20 are downgraded to PARTIAL because the live pipeline does not currently produce learned Stage 2 scores or run shadow holdout evaluation in production. F22 is restored to MATCH because the catalog function-name mismatch has been remediated. Certified inventory remains 22 live features; F23 is retired and excluded from this child audit.

### MATCH (19/22)

| ID | Feature | Finding |
|----|---------|---------|
| F01 | Score normalization | Confirmed in source |
| F02 | Cold-start novelty boost | Confirmed in source |
| F03 | Interference scoring | Confirmed in source |
| F04 | Classification-based decay | Confirmed in source |
| F05 | Folder-level relevance scoring | Confirmed in source |
| F06 | Embedding cache | Confirmed in source |
| F07 | Double intent weighting investigation | Confirmed in source |
| F08 | RRF K-value sensitivity analysis | Confirmed in source |
| F09 | Negative feedback confidence signal | Confirmed in source |
| F10 | Auto-promotion on validation | Confirmed in source |
| F11 | Scoring and ranking corrections | Confirmed in source |
| F12 | Stage 3 effectiveScore fallback chain | Confirmed in source |
| F14 | Local GGUF reranker via node-llama-cpp | Confirmed in source |
| F15 | Tool-level TTL cache | Confirmed in source |
| F16 | Access-driven popularity scoring | Confirmed in source |
| F17 | Temporal-structural coherence scoring | Confirmed in source |
| F18 | Adaptive shadow ranking | Confirmed in source |
| F21 | Calibrated overlap bonus | Confirmed in source |
| F22 | RRF K experimental tuning | Catalog function name now matches implementation |

### PARTIAL (3/22)

| ID | Feature | Issue |
|----|---------|-------|
| F13 | Scoring and fusion corrections | Catalog still cites retired `rsf-fusion` files in the scoring/fusion corrections references |
| F19 | Learned Stage 2 weight combiner | Pipeline hard-codes `null` model; learned score never produced in live Stage 2 |
| F20 | Shadow feedback holdout evaluation | No production entrypoint; `runShadowEvaluation()` only called in tests |

### Systemic Patterns
Behavioral drift is limited but real: F19 and F20 document capabilities that exist in code or test scaffolding but are not active on the live production path. F13 remains a traceability issue because the catalog still cites retired `rsf-fusion` files. F22 is now aligned after catalog remediation. Certified scope remains 22 live features, with F23 retired from the active inventory. No undocumented live features identified.

---

<!-- ANCHOR:questions -->
### Acceptance Scenarios

- **Given** a feature catalog entry in this phase, **when** the packet is reviewed, **then** the primary implementation or discrepancy is explicitly documented.
- **Given** the listed source files for a feature, **when** maintainers spot-check them against the repo, **then** the packet either confirms them or records the drift.
- **Given** a release-control follow-up session, **when** the packet is reopened, **then** the category verdict and summary statistics remain easy to find.
- **Given** the companion packet documents, **when** a validator checks cross-references, **then** the phase remains reusable inside the recursive `007` validation run.
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- F13: Remove retired `rsf-fusion` references from the scoring/fusion corrections catalog entry.
- F19/F20: Decide whether to wire learned/shadow evaluation paths into production or narrow catalog language to shadow/test-only behavior.

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:questions -->
<!-- /ANCHOR:questions -->
