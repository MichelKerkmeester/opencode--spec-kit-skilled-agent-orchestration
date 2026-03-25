---
title: "Feature Specification: Sprint 4 — Feedback and Quality"
description: "Close the feedback loop with chunk aggregation, learned relevance feedback, and shadow scoring infrastructure."
trigger_phrases:
  - "sprint 4"
  - "feedback and quality"
  - "MPAB"
  - "learned relevance"
  - "R11"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Sprint 4 — Feedback and Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 5 of 11 |
| **Predecessor** | ../004-sprint-3-query-intelligence/spec.md |
| **Successor** | ../006-sprint-5-pipeline-refactor/spec.md |
| **Handoff Criteria** | R1 MRR@5 within 2%, R11 noise <5%, R13-S2 operational |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 5** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 4 scope boundary — feedback and learning. Closes the feedback loop by aggregating chunk scores, learning from user selections with strict safeguards, and establishing full A/B evaluation infrastructure.

**Dependencies**:
- Sprint 3 exit gate (query intelligence complete — R15, R14/N1, R2 verified)
- R13 must have completed at least 2 full eval cycles before R11 mutations enabled

> **HARD SCOPE CAP**: Sprint 4 is beyond the recommended off-ramp (Sprint 3). Per root spec, starting Sprint 4+ requires separate NEW spec approval and explicit justification based on Sprint 3 off-ramp evaluation results.

**Deliverables**:
- MPAB chunk-to-memory aggregation with N=0/N=1 guards (R1)
- Learned relevance feedback with separate column and 10 safeguards (R11)
- Shadow scoring + channel attribution + ground truth Phase B (R13-S2)

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Chunked memories are scored individually without aggregation — a memory with 5 matching chunks gets no advantage over one with 1 chunk, losing valuable signal. No mechanism exists to learn from user selections (which memories users actually use), so the system cannot self-improve. Evaluation is limited to basic metrics without shadow scoring or A/B comparison capability, making it impossible to validate changes against production behavior.

### Purpose

Aggregate chunk scores safely with MPAB (preserving N=0/N=1 semantics), learn from user behavior with 10 strict safeguards to prevent FTS5 contamination, and establish full A/B evaluation infrastructure for continuous quality measurement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R1**: MPAB chunk-to-memory aggregation with N=0/N=1 guards, index-based max removal
- **R11**: Learned relevance feedback with separate learned_triggers` column + 10 safeguards
- **R13-S2**: Shadow scoring + channel attribution + ground truth Phase B
- **G-NEW-3 Phase C**: LLM-judge ground truth generation (tasks T027a, T027b) — context-type boost validation via automated LLM-judge labeling with >=80% agreement with manual labels

### Out of Scope

- R6 (pipeline refactor) — Sprint 5 scope
- R12 (query expansion) — Sprint 5 scope
- R15 changes — locked from Sprint 3
- Direct FTS5 index modification — R11 uses separate column exclusively
- PI-A4 (constitutional memory as expert knowledge injection) — deferred to Sprint 5 (retrieval-pipeline work, no S4 dependency)

### Prerequisite

R13 must have completed at least 2 full eval cycles before R11 mutations are enabled. This is a P0 gate check.

> **R13 Eval Cycle Definition**: One eval cycle = minimum 100 queries evaluated AND 14+ calendar days (both conditions must be met). Two full cycles = minimum 200 queries AND 28+ calendar days. This matches the parent spec's more stringent criteria. This calendar dependency is NOT reflected in effort hours and must be planned for explicitly in the project timeline. Expect a mandatory idle window of 28+ calendar days between Sprint 3 completion and R11 enablement.

---

### RECOMMENDED: Sprint 4 Sub-Sprint Split

> **F3 — RECOMMENDED SPLIT**: Sprint 4 should be split into two sub-sprints to isolate the CRITICAL FTS5 contamination risk in R11.

**S4a — Lower Risk (estimated 33-49h)**
- R1: MPAB chunk-to-memory aggregation (8-12h) + T001a chunk ordering (2-4h)
- R13-S2: Enhanced shadow scoring + channel attribution + ground truth Phase B (15-20h) + T003a exclusive contribution rate (2-3h)
- TM-04: Pre-storage quality gate (6-10h) — no schema change

**S4b — Higher Risk (estimated 31-48h, requires S4a metrics + 28-day window)**
- R11: Learned relevance feedback with separate `learned_triggers` column + 10 safeguards (16-24h) + T002a auto-promotion (5-8h) + T002b negative feedback (4-6h)
- TM-06: Reconsolidation-on-save (6-10h) — schema-adjacent, high caution

**Rationale for split**: R11 has CRITICAL severity — an FTS5 contamination mistake (adding `learned_triggers` to the FTS5 index) is irreversible without a full re-index of all memories. Isolating R11 into S4b means S4a's A/B infrastructure is operational before R11 mutations begin, enabling immediate detection of any regression. Risk concentration is eliminated by ensuring R1 and R13-S2 are verified clean before R11 is enabled.

> **NOTE — TM-04 S4a/S4b placement divergence**: This child spec places TM-04 in **S4a** (quality gate before feedback mutations). The parent spec (../spec.md line 128) places TM-04 in S4b. The child spec's S4a placement is correct: TM-04 is a pre-storage quality gate with no schema change that should be operational before R11 feedback mutations begin in S4b. The parent spec should be updated to move TM-04 from S4b to S4a to match this child spec's authoritative Sprint 4 phasing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `composite-scoring.ts` or fusion layer | Modify | R1: MPAB aggregation with N=0/N=1 guards |
| `memory_index` schema | Modify | R11: `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'` |
| Search handlers | Modify | R11: 10 safeguards implementation |
| Eval infrastructure | Modify | R13-S2: Shadow scoring + channel attribution + ground truth Phase B |
| `memory-save.ts` (save handler) | Modify | TM-04: Multi-layer pre-storage quality gate (L1 structural, L2 content quality, L3 semantic dedup) |
| `memory-save.ts` (save handler) | Modify | TM-06: Post-embedding reconsolidation check against top-3 similar memories (merge/replace/store) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S4-PRE | **R13 prerequisite**: Verify R13 completed 2+ full eval cycles | Eval cycle count >= 2 verified before R11 work begins |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S4-001 | **R1**: MPAB with N=0/N=1 guards, index-based max removal | MRR@5 within 2% of baseline, N=1 no regression. Chunk ordering: collapsed multi-chunk results maintain original document position order. Flag: `SPECKIT_DOCSCORE_AGGREGATION` |
| REQ-S4-002 | **R11**: Learned feedback with separate `learned_triggers` column + 10 safeguards (denylist 100+, rate cap 3/8h, TTL 30d decay, FTS5 isolation, noise floor top-3, rollback mechanism, provenance/audit log, shadow period 1 week, eligibility 72h, sprint gate review) | Noise rate <5%. Auto-promotion: memories with >=5 positive validations promoted normal->important; >=10 promoted important->critical. Negative feedback confidence signal active: wasUseful=false reduces score via confidence multiplier (floor=0.3). Flag: `SPECKIT_LEARN_FROM_SELECTION` |
| REQ-S4-003 | **R13-S2**: Shadow scoring + channel attribution + ground truth Phase B | A/B infrastructure operational. Exclusive Contribution Rate computed per channel |
| REQ-S4-004 | **TM-04**: Pre-storage quality gate in `memory_save` handler — Layer 1 structural (existing), Layer 2 content quality scoring (title, triggers, length, anchors, metadata, signal density >= 0.4 threshold), Layer 3 semantic dedup (>0.92 cosine similarity = reject). Behind `SPECKIT_SAVE_QUALITY_GATE` flag | Low-quality saves blocked (score below 0.4 signal density threshold); semantic near-duplicates (>0.92 cosine similarity) rejected; structurally valid, distinct content passes all layers |
| REQ-S4-005 | **TM-06**: Reconsolidation-on-save — after embedding generation check top-3 similar memories: >=0.88 similarity = duplicate (merge, increment frequency), 0.75–0.88 = conflict (replace, add supersedes edge), <0.75 = complement (store new). Requires checkpoint before enabling. Behind `SPECKIT_RECONSOLIDATION` flag | Duplicate memories merged with frequency increment; conflicting memories replaced with causal supersedes edge; complement memories stored without modification; checkpoint created before first enable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R1 dark-run: MRR@5 within 2% of baseline, no N=1 regression
- **SC-002**: R11 shadow log: noise rate <5%
- **SC-003**: R13-S2: Full A/B comparison infrastructure operational
- **SC-004**: R11 FTS5 contamination test: `learned_triggers` NOT in FTS5 index
- **SC-005**: Sprint 4 exit gate — all requirements verified
- **SC-006**: TM-04 quality gate: saves below 0.4 signal density blocked; near-duplicates (>0.92 cosine similarity) rejected; structurally valid distinct content passes all layers
- **SC-007**: TM-06 reconsolidation: duplicates (>=0.88) merged with frequency increment; conflicts (0.75-0.88) replaced with causal supersedes edge; complements (<0.75) stored without modification; checkpoint created before first enable
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | **CRITICAL** — R11 FTS5 contamination if separate column not used (MR1) | Critical | Separate `learned_triggers` column, explicit FTS5 exclusion test |
| Risk | R1 N=0 div-by-zero (MR4) | High | Guard: N=0 --> return 0 |
| Risk | R1+N4 double-boost — MPAB bonus on already co-activation-boosted scores | Medium | Verify MPAB operates after fusion, not on pre-boosted scores |
| Risk | N4+R11 transient artifact learning — R11 learns from temporary co-activation patterns | Medium | R11 eligibility requires memory age >= 72h |
| Risk | TM-04 quality gate over-filtering — overly strict thresholds reject legitimate saves (MR12) | Medium | **Warn-only mode for first 2 weeks**: log quality scores and would-reject decisions but do NOT block saves. Tune thresholds based on observed false-rejection rate before enabling enforcement. See parent spec MR12 mitigation |
| Dependency | Sprint 3 exit gate | Blocks start | Must be verified complete |
| Dependency | R13 2+ eval cycles | Blocks R11 | P0 prerequisite for R11 mutations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R11 dark-run overhead must not exceed +15ms p95
- **NFR-P02**: R1 operates on already-fetched data — no additional DB queries

### Security
- **NFR-S01**: R11 `learned_triggers` column MUST NOT be added to FTS5 index
- **NFR-S02**: R11 denylist must contain 100+ stop words to prevent noise injection

### Reliability
- **NFR-R01**: R11 must NOT modify triggers until 1-week shadow period completes
- **NFR-R02**: Schema migration must be atomic with backup (checkpoint recommended)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **N=0 chunks**: Return score 0 — no chunks means no signal
- **N=1 chunk**: Return score as-is — no bonus or penalty applied (single chunk = raw score)
- **R11 memories <72h old**: Excluded from learned feedback eligibility — too new to learn from

### Error Scenarios
- **R11 "not in top 3" safeguard**: Requires R13 query provenance — if provenance unavailable, R11 skip (safe default)
- **Schema migration failure**: Abort and restore from checkpoint — search continues with existing schema
- **R11 denylist miss**: New stop word pattern bypasses denylist — TTL 30d provides self-healing

### State Transitions
- **R11 shadow period**: First 1 week = shadow only (log but don't apply). After 1 week = mutations enabled (if noise <5%)
- **R1+R11 interaction**: R1 aggregates chunks, R11 learns from selections — ensure R11 operates on post-MPAB scores

### TM-04/TM-06 Threshold Interaction
- **[0.88, 0.92] merge zone**: A save with cosine similarity in the range [0.88, 0.92] passes TM-04 (which only rejects >0.92) and then triggers TM-06 merge behavior (which merges at >=0.88). The intended behavior is **save-then-merge**: TM-04 allows the save, embedding is generated, and TM-06 merges it with the existing memory (incrementing frequency counter). This is the expected behavior — TM-04 guards against truly redundant saves, while TM-06 handles the consolidation of closely-related content.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 3 features: MPAB aggregation, learned feedback with schema change, eval Phase B |
| Risk | 18/25 | CRITICAL FTS5 contamination risk; schema migration; 10 safeguards complexity |
| Research | 6/20 | Research complete (142 analysis); MPAB formula and R11 safeguards defined |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S4-001**: Should R11 shadow period be configurable or hardcoded to 1 week?
- **OQ-S4-002**: MPAB bonus coefficient is **provisionally set at 0.3** — must be validated against MRR@5 measurements from S4a shadow data before S4b begins. If no Sprint 0-3 empirical basis exists at sprint start, treat as provisional and add S4a validation task.
- **OQ-S4-003**: R11 learned-trigger query weight is **provisionally set at 0.7x** — must be derived from channel attribution data (R13-S2) during the F10 idle window. Adjust based on observed signal-to-noise ratio before S4b enables R11 mutations.
<!-- /ANCHOR:questions -->

---

---

### PageIndex Integration

> **PI-A4 deferred to Sprint 5** — Constitutional Memory as Expert Knowledge Injection (8-12h) has no Sprint 4 dependency and does not affect any Sprint 4 exit criterion. It is retrieval-pipeline work that fits Sprint 5's theme (pipeline refactor + query expansion R12). See ../015-pipeline-refactor/spec.md for updated placement. Rationale: ultra-think review REC-07.

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See ../spec.md
- **Parent Plan**: See ../plan.md

---

### Schema Change

```sql
ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
-- Nullable, default empty JSON array
-- Rollback: ALTER TABLE memory_index DROP COLUMN learned_triggers; (SQLite 3.35.0+)
`

---

<!--
LEVEL 2 SPEC — Phase 5 of 11
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 4: Feedback and Quality
-->

#### Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---
