---
title: "Feature Specification [system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/001-retrieval/spec]"
description: "Systematic code audit of 11 live Retrieval features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "retrieval"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Retrieval

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

### Executive Summary

Systematic code audit of the 11-feature live Retrieval category in the Spec Kit Memory MCP server. This packet currently preserves detailed findings for 10 audited features and explicitly tracks the remaining live-catalog delta for follow-up coverage sync.

**Key Decisions**: Audit against current feature catalog as source of truth, document findings per feature

**Critical Dependencies**: Feature catalog must be current and accurate

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Partial |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Successor** | ../002-mutation/spec.md |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Retrieval has evolved significantly. Existing audit documentation was stale and no longer reflected the current 11-feature inventory. This packet now truth-syncs the live count while documenting that the preserved findings cover 10 audited features and one newer live entry still needs packet-level coverage.

### Purpose
Truth-sync the Retrieval audit packet to the live 11-feature inventory, preserve the 10 audited findings already captured here, and make the remaining coverage gap explicit instead of overstating completion.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Unified context retrieval (memory_context)
- Semantic and lexical search (memory_search)
- Trigger phrase matching (memory_match_triggers)
- Hybrid search pipeline
- 4-stage pipeline architecture
- BM25 trigger phrase re-index gate
- AST-level section retrieval tool
- Quality-aware 3-tier search fallback
- Tool-result extraction to working memory
- Fast delegated search (memory_quick_search)
- Session recovery via `/memory:continue`

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/01--retrieval/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/001-retrieval/` | Create | Audit documentation |

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

- **SC-001**: 10 of 11 live Retrieval features have findings documented in this packet
- **SC-002**: The remaining live-catalog delta is explicitly called out instead of being implied complete

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
| Scope | 15/25 | Features: 11 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 11/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **44/100** | **Level 3** |

---

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

### User Stories

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Retrieval feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

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

- ~~Are there undocumented features in this category not yet in the catalog?~~ **Answered**: No new features found; 15+ source files are missing from the Feature 02 catalog entry (see AUDIT FINDINGS).
- ~~Have any features been deprecated since the last catalog update?~~ **Answered**: No deprecations found. Feature 07 (AST-level section retrieval) is correctly documented as DEFERRED, not deprecated.

---

### Audit Findings

Audit completed 2026-03-22. Current packet coverage: **8 MATCH, 2 PARTIAL, 1 pending coverage sync** across the 11-feature live Retrieval inventory.

### Feature 01 — Unified context retrieval (memory_context): MATCH
- All 164 source files confirmed to exist.
- 7 intent types, 5 modes, token budgets (800/2000/1500/1200) all verified.
- Pressure thresholds: 0.60→focused, 0.80→quick confirmed in source.
- `SPECKIT_PRESSURE_POLICY` and `SPECKIT_FOLDER_DISCOVERY` gating confirmed.
- Minor: ~15 indirect dependency files not listed in catalog (reasonable omission, no action required).

### Feature 02 — Semantic and lexical search (memory_search): PARTIAL
- 4-stage pipeline confirmed as the sole runtime path.
- Multi-concept queries, deep mode expansion, and cache all confirmed.
- **GAP**: 15+ source files missing from catalog entry: `adaptive-ranking.ts`, `scope-governance.ts`, `profile-formatters.ts`, `progressive-disclosure.ts`, `session-state.ts`, `chunk-reassembly.ts`, `search-utils.ts`, `eval-channel-tracking.ts`, `feedback-ledger.ts`, `shared-spaces.ts`, `query-decomposer.ts`, `entity-linker.ts`, `llm-reformulation.ts`, `hyde.ts`, `stage2b-enrichment.ts`.
- Reclassified per deep research: 15+ missing source files warrants PARTIAL, not MATCH.

### Feature 03 — Trigger phrase matching (memory_match_triggers): MATCH
- Most accurately documented feature in this category.
- `TURN_DECAY_RATE=0.98`, 2× candidate fetch, and tiered content (HOT=full, WARM=150 chars, COLD+=empty) all confirmed.

### Feature 04 — Hybrid search pipeline: MATCH
- 5 channels with correct weights confirmed: Vector=1.0, FTS=0.8, BM25=0.6, Graph=0.5, Degree=0.4.
- Minor: RSF shadow fusion is labeled as an "operational stage" in the catalog but is inactive at runtime (shadow/evaluation mode only).

### Feature 05 — 4-stage pipeline architecture: MATCH
- Pipeline orchestrator, 10 s stage timeout, and 12-step Stage 2 signal order all confirmed.
- **Missing from catalog**: `stage2b-enrichment.ts`, `ranking-contract.ts`.
- Undocumented detail: Stage 4 per-tier limits HOT=50, WARM=30, COLD=20, DORMANT=10, ARCHIVED=5.

### Feature 06 — BM25 trigger phrase re-index gate: MATCH
- No discrepancies found.

### Feature 07 — AST-level section retrieval tool: MATCH
- Correctly documented as DEFERRED. No discrepancies.

### Feature 08 — Quality-aware 3-tier search fallback: PARTIAL
- `stage4-filter.ts` is incorrectly listed as a source file; it handles memory-state filtering, not quality fallback logic.

### Feature 09 — Tool-result extraction to working memory: MATCH
- Minor: `MENTION_BOOST_FACTOR=0.05` is not documented in the catalog entry.

### Feature 10 — Fast delegated search (memory_quick_search): MATCH
- No discrepancies found.

### Coverage Delta — Feature 11: Session recovery via `/memory:continue`
- Live catalog entry `11-session-recovery-memory-continue` is now part of the Retrieval family.
- This packet's preserved findings still cover the earlier audited baseline, so `/memory:continue` remains pending a dedicated audit finding in this document.

### Cross-Cutting Observations
- Feature 02 catalog entry has the largest source-file gap (15+ files).
- Feature 08 contains the only incorrect source-file reference (`stage4-filter.ts`).
- Several undocumented constants surfaced: `MENTION_BOOST_FACTOR=0.05`, Stage 4 per-tier limits, `TURN_DECAY_RATE=0.98`.
- Features 06, 07, 10 are cleanly documented with no gaps.
- Live Retrieval inventory now contains an 11th entry (`/memory:continue`), so this packet should no longer be read as full-category completion.

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:questions -->
<!-- /ANCHOR:questions -->
