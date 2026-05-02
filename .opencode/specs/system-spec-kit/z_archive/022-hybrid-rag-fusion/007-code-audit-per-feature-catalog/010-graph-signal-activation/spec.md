---
title: "Feature [system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/spec]"
description: "Systematic code audit of 16 Graph Signal Activation features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "graph signal activation"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Code Audit — Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

### Executive Summary

Systematic code audit of 16 Graph Signal Activation features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/10--graph-signal-activation/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

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
| **Predecessor** | ../009-evaluation-and-measurement/spec.md |
| **Successor** | ../011-scoring-and-calibration/spec.md |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Graph Signal Activation has evolved significantly. Existing audit documentation was stale and no longer reflected the current 16-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 16 Graph Signal Activation features are accurately documented in the feature catalog and correctly implemented in source code.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Typed-weighted degree channel
- Co-activation boost strength increase
- Edge density measurement
- Weight history audit tracking
- Graph momentum scoring
- Causal depth signal
- Community detection
- Graph and cognitive memory fixes
- ANCHOR tags as graph nodes
- Causal neighbor boost and injection
- Temporal contiguity layer
- Unified graph retrieval and deterministic ranking
- Graph lifecycle refresh
- Async LLM graph backfill
- Graph calibration profiles
- Typed traversal

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/10--graph-signal-activation/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/010-graph-signal-activation/` | Create | Audit documentation |

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

- **SC-001**: All 16 features audited with findings documented
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
| Scope | 20/25 | Features: 16 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 13/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **51/100** | **Level 3** |

---

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

### User Stories

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Graph Signal Activation feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

### Audit Findings

**Result: 14 MATCH, 2 PARTIAL across 16 features.**

| ID | Feature | Status | Finding |
|----|---------|--------|---------|
| F01 | typed-weighted-degree | MATCH | Constants, cache, and feature flag all confirmed in source |
| F02 | co-activation-boost | MATCH | 0.25 default confirmed; minor catalog imprecision (states 0.3) — negligible |
| F03 | edge-density | MATCH | Thresholds and R10 escalation path confirmed |
| F04 | weight-history | MATCH | Audit tracking confirmed; source file list is over-inclusive but not incorrect |
| F05 | graph-momentum | MATCH | Momentum formula and cache confirmed |
| F06 | causal-depth | MATCH | Tarjan SCC, depth bonus of +0.05 confirmed |
| F07 | community-detection | MATCH | BFS + Louvain, debounce, Stage 2 wiring all confirmed |
| F08 | graph-cognitive-fixes | MATCH | All 7 fixes verified; minor file attribution imprecision — negligible |
| F09 | anchor-tags | MATCH | Correctly documented as DEFERRED; no implementation expected |
| F10 | causal-neighbor-boost | MATCH | Constants and multipliers confirmed |
| F11 | temporal-contiguity | MATCH | Deep Review Update (2026-03-25): temporal contiguity is live on Stage 1 vector paths and remains graduated/default-on; catalog and implementation now agree |
| F12 | unified-graph | MATCH | Deterministic ranking and explainability confirmed |
| F13 | graph-lifecycle | MATCH | Deep Review Update (2026-03-25): catalog and implementation now agree on default behavior |
| F14 | llm-graph-backfill | PARTIAL | Catalog contains self-contradictory default messaging; needs reconciliation |
| F15 | graph-calibration | PARTIAL | Graph calibration profiles are wired into Stage 2 via `stage2-fusion.ts:776`, but the community-threshold half is not connected |
| F16 | typed-traversal | MATCH | All constants and intent-priority logic confirmed |

### Key Issues Requiring Follow-up

1. **F15 — Partial graph calibration wiring**: Graph calibration profiles are wired into Stage 2 via `stage2-fusion.ts:776`, but the community-threshold half is not connected end-to-end. The catalog should keep this feature marked partial until both halves align.

2. **F14 — Self-contradictory catalog entry**: The `llm-graph-backfill` catalog entry contains conflicting statements about its default behavior. The entry must be reconciled to a single authoritative description.

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

- **RESOLVED**: 14 of 16 features are confirmed as accurately documented (MATCH).
- **OPEN — F15**: Graph calibration profiles are wired into Stage 2, but community-threshold integration remains incomplete.
- **OPEN — F14**: Which of the two conflicting defaults in the `llm-graph-backfill` catalog entry is authoritative?

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:questions -->
<!-- /ANCHOR:questions -->
