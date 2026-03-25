---
title: "Implementation Plan: Feedback & Quality Learning"
description: "Three-phase plan implementing implicit feedback event ledger, FSRS hybrid decay, quality gate exceptions, batch learning, assistive reconsolidation, and shadow scoring."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases: ["D4 plan", "feedback learning plan", "event ledger plan", "shadow scoring plan"]
importance_tier: "critical"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Feedback & Quality Learning

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
- **Language:** TypeScript (strict mode)
- **Framework:** MCP Server (Model Context Protocol)
- **Storage:** SQLite (better-sqlite3 + sqlite-vec + FTS5)
- **Testing:** Vitest (4876+ existing tests)
- **Existing Code:** `save-quality-gate.ts`, `reconsolidation-bridge.ts`, `learned-feedback.ts`, `fsrs-scheduler.ts`

### Overview

Three implementation phases following the principle: **log before learning, shadow before live**. Phase A lays the foundation with event collection and gate adjustments (no ranking effect). Phase B uses accumulated data for batch learning and reconsolidation. Phase C validates everything via shadow scoring before any live promotion.

### Key Insight

The system is more mature than expected. Quality gates, reconsolidation, and learned feedback already exist with safeguards. The real gap is signal collection from the calling AI — Phase A addresses this directly.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Existing code reviewed: `save-quality-gate.ts`, `reconsolidation-bridge.ts`, `learned-feedback.ts`, `fsrs-scheduler.ts`
- [ ] SQLite schema for `feedback_events` table designed
- [ ] Feature flag names confirmed unique (no collision with existing flags)
- [ ] Eval baseline recorded per intent class

### Definition of Done
- [ ] All 6 requirements implemented behind feature flags
- [ ] All existing tests pass (4876+)
- [ ] New tests written for each requirement
- [ ] Shadow scoring report produced for at least 2 weekly cycles
- [ ] No live ranking changes until shadow validation passes
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Component Map

```
Save Pipeline
  └── save-quality-gate.ts ─── REQ-D4-003 (exception logic)
  └── reconsolidation-bridge.ts ─── REQ-D4-005 (threshold tiers)

Search Pipeline (Stage 2)
  └── feedback-ledger.ts [NEW] ─── REQ-D4-001 (event recording)
  └── learned-feedback.ts ─── REQ-D4-004 (batch aggregation)

Scheduling
  └── fsrs-scheduler.ts ─── REQ-D4-002 (hybrid decay)
  └── batch-feedback-job [NEW] ─── REQ-D4-004 (weekly run)

Evaluation
  └── shadow-scoring.ts [NEW] ─── REQ-D4-006 (holdout comparison)
```

### Data Flow

```
Search Query
  │
  ├─ Stage 2 hooks ──▶ feedback-ledger.ts ──▶ feedback_events (SQLite)
  │                                                 │
  │                                                 ▼
  │                           batch-feedback-job (weekly) ──▶ learned-feedback.ts
  │                                                              │
  │                                                              ▼
  └─ shadow-scoring.ts ◀── compare live rank vs learned rank ───┘
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Logging & Gates (Wave 1 Foundation)

**Focus:** Event collection infrastructure and gate adjustments. No ranking side effects.

| Req | Item | Size | Description |
|-----|------|------|-------------|
| REQ-D4-001 | #2 | S | Implicit feedback event ledger — SQLite table, 5 event types, Stage 2 hooks |
| REQ-D4-002 | #3 | S | FSRS hybrid decay — type-aware no-decay for decisions/constitutional/critical |
| REQ-D4-003 | #7 | S | Quality gate exception — bypass length for short decisions with structural signals |

**Effort:** 3S (~1 week)
**Dependencies:** None — can start in Wave 1 alongside D1.A, D3.A, D5.A

### Phase B — Learning & Consolidation (Wave 2)

**Focus:** Use accumulated Phase A event data for batch learning and reconsolidation improvements.

| Req | Item | Size | Description |
|-----|------|------|-------------|
| REQ-D4-004 | #19 | M | Weekly batch feedback learning — aggregate, min-support, cap, shadow compare |
| REQ-D4-005 | #20 | M | Assistive reconsolidation — auto-merge >=0.96, review 0.88-0.96, keep <0.88 |

**Effort:** 2M (~2 weeks)
**Dependencies:** REQ-D4-001 event data (Phase A must be complete)

### Phase C — Shadow Validation (Wave 4)

**Focus:** Validate all learned signals before live promotion.

| Req | Item | Size | Description |
|-----|------|------|-------------|
| REQ-D4-006 | #21 | M | Shadow scoring with holdout — compare live vs learned, promote after 2 stable weeks |

**Effort:** 1M (~1 week)
**Dependencies:** REQ-D4-004 learned signals (Phase B must be complete)
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Per Phase |
|-----------|-------|-----------|
| Unit | Event recording, decay classification, gate exception, aggregation, merge logic, shadow comparison | A: ~8, B: ~8, C: ~5 |
| Integration | Event ledger round-trip, quality gate bypass, reconsolidation pipeline, shadow eval pipeline | A: ~3, B: ~3, C: ~2 |
| Eval | MRR@5, NDCG@10 per intent class with flags on/off | 1 per phase |
| Regression | Existing test suite (4876+) | 1 per phase |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:effort -->
## 6. EFFORT ESTIMATION

| Phase | Items | Effort | Cumulative |
|-------|-------|--------|------------|
| A — Logging & Gates | 3S | ~1 week | 1 week |
| B — Learning & Consolidation | 2M | ~2 weeks | 3 weeks |
| C — Shadow Validation | 1M | ~1 week | 4 weeks |
| **Total** | **3S + 3M** | **~4 weeks** | |
<!-- /ANCHOR:effort -->

## 7. RELATED DOCUMENTS

- [Spec](spec.md) — D4 feature specification
- [Tasks](tasks.md) — D4 task tracking
- [Parent Spec](../spec.md) — Research-Based Refinement coordination
- [Parent Plan](../plan.md) — Cross-phase implementation waves
- Research (historical, path removed) — Full 29-recommendation synthesis

<!-- ANCHOR:dependencies -->
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
<!-- /ANCHOR:rollback -->
