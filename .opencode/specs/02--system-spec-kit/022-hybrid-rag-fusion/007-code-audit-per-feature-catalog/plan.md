---
title: "Implementation Plan: Code Audit per Feature Catalog"
description: "Master plan for auditing the 222-feature live catalog across 19 categories of the Spec Kit Memory MCP server (updated from 218 on 2026-03-26)"
trigger_phrases:
  - "audit plan"
  - "feature catalog"
  - "code audit"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Code Audit per Feature Catalog

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / JavaScript (Node.js) |
| **Framework** | MCP server (Model Context Protocol) |
| **Storage** | better-sqlite3, vector embeddings |
| **Testing** | Manual code audit + cross-reference |

### Overview
Comprehensive code audit of the entire Spec Kit Memory MCP server organized by 19 feature catalog categories totaling 222 live features. Each category is audited in its own child folder (`001-022`): category audit packets, two meta-phases for synthesis/remediation, and a downstream follow-up child for deprecated-feature implementation/removal.

### AI Execution Protocol

#### Pre-Task Checklist
- Confirm the live feature catalog inventory before recording umbrella-level totals.
- Verify child-packet validation status before updating the umbrella synthesis language.

#### Execution Rules
| Rule | Meaning |
|------|---------|
| `TASK-SEQ` | Update child packets before changing umbrella totals or status language |
| `TASK-SCOPE` | Keep umbrella edits focused on synthesis, ownership, and validation state |

#### Status Reporting Format
- Report changes in `MATCH/PARTIAL/pending/remediation` language tied to the phase map or implementation summary.

#### Blocked Task Protocol
- If a child packet fails validation, stop umbrella truth-sync changes until the child packet is repaired.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog current (19 categories, 222 live features)
- [x] Source code accessible
- [x] All 22 child phase folders created with Level 3 specs

### Definition of Done
- [x] All completed audit packets truth-synced to live inventories, with any residual gaps explicitly tracked
- [x] Cross-phase synthesis delivered
- [x] Remediation tracking initialized, including downstream child `022-implement-and-remove-deprecated-features`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel phase-based audit: each category audited independently, results synthesized at parent level.

### Key Components
- **Feature Catalog** (`feature_catalog/`): 19 categories, source of truth
- **Phase Folders** (`001-022`): Independent audit workstreams plus downstream implementation/removal follow-up
- **Synthesis**: Cross-phase findings, remediation tracking, and downstream deprecated-feature execution ownership

### Data Flow
Feature Catalog → Phase Audits (parallel) → Findings → Synthesis → Remediation → `022-implement-and-remove-deprecated-features`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline Setup
- [x] Create Level 3 spec docs in all 23 spec folders (parent + 22 children)
- [x] Verify feature catalog currency

### Phase 2: Parallel Category Audits (001-018, 020)
- [x] 001-retrieval (11 live features; 10 audited, 1 pending coverage sync) — 8 MATCH, 2 PARTIAL
- [x] 002-mutation (10 features) — 8 MATCH, 2 PARTIAL
- [x] 003-discovery (3 features) — 2 MATCH, 1 PARTIAL
- [x] 004-maintenance (2 features) — 1 MATCH, 1 PARTIAL
- [x] 005-lifecycle (7 features) — 4 MATCH, 3 PARTIAL
- [x] 006-analysis (7 features) — 5 MATCH, 2 PARTIAL
- [x] 007-evaluation (2 features) — 1 MATCH, 1 PARTIAL
- [x] 008-bug-fixes-and-data-integrity (11 features) — 9 MATCH, 2 PARTIAL
- [x] 009-evaluation-and-measurement (14 features) — 11 MATCH, 3 PARTIAL
- [x] 010-graph-signal-activation (16 features) — 12 MATCH, 4 PARTIAL
- [x] 011-scoring-and-calibration (22 features) — 20 MATCH, 2 PARTIAL
- [x] 012-query-intelligence (11 features) — 8 MATCH, 3 PARTIAL
- [x] 013-memory-quality-and-indexing (24 features) — 20 MATCH, 4 PARTIAL
- [x] 014-pipeline-architecture (22 features) — 19 MATCH, 3 PARTIAL
- [x] 015-retrieval-enhancements (9 features) — 8 MATCH, 1 PARTIAL
- [x] 016-tooling-and-scripts (17 features) — 16 MATCH, 1 PARTIAL
- [x] 017-governance (4 features) — 3 MATCH, 1 PARTIAL
- [x] 018-ux-hooks (19 features) — 17 MATCH, 2 PARTIAL
- [x] 020-feature-flag-reference (7 features) — 6 MATCH, 1 PARTIAL

### Phase 3: Cross-Cutting Analysis
- [x] 019-decisions-and-deferrals — 4 decisions, 4 deferrals, 4 deprecated modules documented
- [x] 021-remediation-revalidation — synthesis complete, remediation backlog prioritized
- [x] 022-implement-and-remove-deprecated-features — live downstream child inventoried under umbrella ownership

### Phase 4: Final Synthesis
- [x] Compile cross-phase findings — 178 MATCH, 39 PARTIAL, 1 pending coverage sync, 0 MISMATCH
- [x] Generate master audit report — implementation-summary.md in all 23 spec folders

### Phase 5: Deep Research Remediation (2026-03-26) — NEW

12-agent deep research (~3.3M tokens GPT-5.4 via Codex CLI) identified audit coverage gaps requiring follow-up:

- **5A: Stale metadata** — Update feature count from 218 to 222 across spec/plan/phase docs
- **5B: 5 unaudited snippets** — Audit session recovery (001), template compliance (016), mapping note (019/020), 2 stubs (020/021)
- **5C: 13 BOTH_MISSING capabilities** — Source capabilities with no catalog entry AND no audit coverage. Assign to existing or new audit phases: `mcp_server/api/` surface (5 modules), ops/setup/kpi scripts, config contracts, constitutional/nodes assets
- **5D: 2 AUDIT_MISSING items** — `scripts/spec/create.sh` and `validate.sh` (in catalog but not audited)
- **5E: Stale phase remediation** — Reclassify phases 019/021/022 as mapping/meta; refresh overcounted summaries in 009/011

**Approach:** Assign BOTH_MISSING capabilities to the nearest existing audit phase where possible (e.g., api/eval.ts → phase 007/009, api/search.ts → phase 001/015). Only create new audit phases if no existing phase has a natural fit. Coordinate with 006-feature-catalog T200-T255 for catalog entry creation.

```
Phase 4 (Synthesis) ──► Phase 5 (Deep Research Remediation)
                          ├── 5A: Metadata fixes
                          ├── 5B: 5 unaudited snippets
                          ├── 5C: 13 BOTH_MISSING audits
                          ├── 5D: 2 AUDIT_MISSING
                          └── 5E: Stale phase refresh
```

### Traceability Contract

Phases `012-022` remain owned by `007-code-audit-per-feature-catalog`. Each child packet consumes a live catalog slice or synthesized upstream findings and returns a phase-local output back to the umbrella packet.

| Child | Inputs | Outputs | Ownership |
|-------|--------|---------|-----------|
| `012-018`, `020` | Category-specific live feature catalog entries + 007 audit method | Phase findings + implementation-summary.md | Umbrella-owned child audit packets |
| `019` | Outputs from completed category audit packets | Cross-phase decisions/deferrals synthesis | Umbrella-owned synthesis packet |
| `021` | Outputs from phases `001-020` | Prioritized remediation and revalidation summary | Umbrella-owned synthesis packet |
| `022-implement-and-remove-deprecated-features` | Deprecated-feature findings from `009`, `011`, `019`, and `021` | Downstream implementation/removal packet tracked back to the umbrella | Umbrella-owned follow-up child |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Feature-to-code traceability | Grep, Read, Glob |
| Completeness | Live inventory and residual gaps truth-synced | Checklist verification |
| Consistency | Uniform methodology across phases | Template adherence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog | Internal | Green | Cannot audit without reference |
| Source code | Internal | Green | Cannot verify implementation |
| Phase specs | Internal | Green | Required for tracking |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Methodology proves inadequate or catalog significantly changes
- **Procedure**: Archive current findings, update catalog, restart affected phases
<!-- /ANCHOR:rollback -->

---

## L3: DEPENDENCY GRAPH

```
Phase 1 (Setup) ──► Phase 2 (19 parallel audits) ──► Phase 3 (Cross-cutting) ──► Phase 4 (Synthesis)
                                                                                        │
                                                                                        ▼
                                                                                  Phase 5 (Deep Research Remediation)
                                                                                    ├── 5A-5B: Metadata + unaudited snippets
                                                                                    ├── 5C-5D: BOTH_MISSING + AUDIT_MISSING
                                                                                    └── 5E: Stale phase refresh
```

---

## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | All 23 spec folders created | Level 3 docs in every parent/child folder |
| M2 | All 19 category audits truth-synced | 222 live features inventoried; any gaps explicitly tracked |
| M3 | Cross-cutting analysis done | Decisions and remediations documented |
| M4 | Final synthesis delivered | Master audit report complete, with child 022 traceability recorded |
| M5 | Deep research remediation complete | 13 BOTH_MISSING capabilities audited, 5 unaudited snippets resolved, stale metadata fixed |
