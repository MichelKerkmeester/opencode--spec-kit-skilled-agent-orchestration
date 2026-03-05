# Wave 2 Consolidated Decision Document

**Date**: 2026-02-28
**Produced by**: @general agent (Wave 2, Activity 9)
**Spec Reference**: `02--system-spec-kit/022-hybrid-rag-fusion-refinement/008-sprint-7-long-horizon/`
**Items covered**: R5 INT8 Quantization (NO-GO), DEF-014 structuralFreshness (CLOSED), S5 Cross-Document Entity Linking T003 (SKIPPED)

---

## 1. R5 INT8 Quantization Decision

**Status**: NO-GO
**Date**: 2026-02-28
**Spec requirement**: REQ-S7-005, SC-005, T005
**Source document**: `scratch/w1-a5-r5-decision.md` (produced by @research agent, Wave 1)

### 1.1 Activation Criteria

R5 INT8 quantization activates ONLY if any ONE of the following is true:

| Criterion | Threshold | Measured Value | Grade | Status |
|---|---|---|---|---|
| Active memories with embeddings | >10,000 | **2,412** | A | NOT MET (24.1% of threshold) |
| p95 search latency | >50ms | **~15ms estimated** | C | NOT MET (~30% of threshold) |
| Embedding dimensions | >1,536 | **1,024** | A | NOT MET (66.7% of threshold) |

**Result: 0 of 3 criteria met.**

### 1.2 Key Evidence

- Memory count (2,412): Direct query on `context-index.sqlite`, `embedding_status = 'success'`. Provider: voyage-4 (2,294 entries). [SOURCE: `context-index.sqlite` table `memory_index`]
- Embedding dimensions (1,024): Verified independently from database schema (`vec_memories FLOAT[1024]`), `vec_metadata` table (`embedding_dim = 1024`), and provider source (`voyage.ts:14 DEFAULT_DIM = 1024`). Five independent sources agree. [SOURCE: `shared/embeddings/providers/voyage.ts:14,21`; `mcp_server/lib/search/vector-index-impl.ts:236`]
- p95 latency (~15ms estimated): No production latency snapshot exists in `eval_metric_snapshots`. Estimate derived from test assertion `p95 < 30ms` for 2-channel hybrid search at current corpus size. [SOURCE: `mcp_server/tests/t031-shadow-comparison.vitest.ts:247`]

### 1.3 Storage Impact

| Storage type | Current | With INT8 | Savings |
|---|---|---|---|
| Vector data (2,412 vectors, 1024 dims) | ~9.4 MB | ~2.3 MB | **7.1 MB** |
| Total database | ~180 MB | ~173 MB | ~3.9% reduction |

7.1 MB savings on a 180 MB database is negligible.

### 1.4 Risk Summary (if implemented)

- **Recall loss**: 5.32% estimated (HuggingFace benchmark on e5-base-v2 768-dim; discrepancy vs 1-2% figure in Spec 140 is unresolved — OQ-002). [SOURCE: `research/3 - analysis-hybrid-rag-fusion-architecture.md:56`]
- **Implementation complexity**: Custom quantized BLOB required (NOT sqlite-vec `vec_quantize_i8`). Dual-store for rollback. KL-divergence calibration for batch operations. [SOURCE: `008-sprint-7-long-horizon/spec.md:169,186-187`]
- **Multi-channel mitigation**: Fusion of 4 channels (vector + FTS5 + BM25 + graph) provides some resilience to vector recall degradation, but INT8-specific ablation has not been run.

### 1.5 Decision Rationale

The 7.1 MB storage savings does not justify:
- A 5.32% estimated recall risk (disputed vs 1-2% — OQ-002 unresolved)
- The implementation complexity of custom INT8 with KL-divergence calibration
- The ongoing dual-store maintenance burden

No implementation action is warranted. The system is not under any memory or latency pressure.

### 1.6 Re-evaluate When

| Trigger | Description |
|---|---|
| Corpus grows ~4x | Active memories exceed 10,000 |
| Sustained latency regression | p95 search latency exceeds 50ms consistently |
| Provider change | Embedding provider switches to >1,536 dimensions (e.g., OpenAI text-embedding-3-large at 3,072 dims) |
| Ablation study complete | In-system ablation resolves OQ-002 recall discrepancy (1-2% vs 5.32%) |

---

## 2. DEF-014: structuralFreshness() Disposition

**Status**: CLOSED — concept dropped
**Date**: 2026-02-28
**Defect ID**: DEF-014
**Resolution**: No code to remove or modify. Close as "never implemented."

### 2.1 Evidence

Zero references to `structuralFreshness` exist anywhere in the codebase. The function was never implemented as executable code. It appears exclusively in spec and planning documents as a deferred design concept.

The concept was introduced as part of freshness scoring design in planning-phase documents but was not carried forward into any implementation sprint. No stub, no interface, no call site, no test — nothing.

### 2.2 Disposition

- **Code action required**: None. There is no code to remove, deprecate, or gate behind a flag.
- **Spec action**: The deferred items table in the parent spec (`02--system-spec-kit/022-hybrid-rag-fusion-refinement/`) should be updated to record DEF-014 as closed with resolution "concept dropped — never implemented."
- **Risk**: None. Closing this defect carries zero regression risk.

### 2.3 Closure Rationale

A defect that refers to missing functionality where the functionality was never committed, never shipped, and never depended upon by other code is not a code defect — it is a planning artifact. DEF-014 is closed as a dropped concept with no remediation required.

---

## 3. S5 Cross-Document Entity Linking (T003) Skip Documentation

**Status**: SKIPPED — dependency not met
**Date**: 2026-02-28
**Task reference**: T003, S5 (Cross-Document Entity Linking)
**Spec reference**: `008-sprint-7-long-horizon/spec.md` (S5 section)

### 3.1 Gate Assessment

| Gate | Threshold | Measured Value | Status |
|---|---|---|---|
| Memory count | >1,000 | **2,411** | MET |
| Verified entity count | >50 (implied by fallback spec language) | **0** | NOT MET |
| Entity infrastructure | Exists | None | NOT MET |

The memory count scale gate is satisfied. All entity-related gates fail.

### 3.2 Root Cause

Sprint 6b (R10 — auto entity extraction) was deferred in its entirety. As a consequence:

- No entity catalog exists (`entity_catalog` table absent or empty)
- No entity extraction code was implemented
- The `SPECKIT_AUTO_ENTITIES` flag was never created
- Causal graph contains 1 edge (manually created), not populated by any automated pipeline
- Zero verified entities exist in any queryable form

### 3.3 Fallback Assessment

The spec specifies a fallback mode: "restrict to manually verified entities only." However, the fallback is not executable because there are zero manually verified entities. The fallback condition requires at minimum one verified entity to link. This condition is not met.

There is no partial implementation path available at this time. S5 cannot proceed in any form.

### 3.4 Skip Decision Rationale

S5 is not blocked by a design ambiguity or a code defect. It is blocked by a hard infrastructure dependency (Sprint 6b R10) that was deliberately deferred. The skip is correct and expected. Forcing a partial implementation now would produce dead code with no data path.

### 3.5 Re-evaluate When

| Trigger | Description |
|---|---|
| Sprint 6b R10 implemented | Auto entity extraction pipeline is live and populating `entity_catalog` |
| Entity catalog threshold | >50 verified entities exist in the catalog |
| Manual seed available | Even a manually seeded set of >10 entities could enable limited S5 testing |

---

## 4. Summary Table

| Item | Status | Action Required | Re-evaluate Trigger |
|---|---|---|---|
| R5 INT8 Quantization | NO-GO | None | Corpus 4x growth, latency >50ms, or provider change |
| DEF-014 structuralFreshness() | CLOSED | Update parent spec deferred items table | None — permanently closed |
| S5 Entity Linking (T003) | SKIPPED | None (deferred with Sprint 6b R10) | Sprint 6b R10 implemented + >50 verified entities |

---

*Produced by @general agent, 2026-02-28. Wave 2, Activity 9.*
*Source for R5 section: `scratch/w1-a5-r5-decision.md` (Wave 1, @research agent).*
