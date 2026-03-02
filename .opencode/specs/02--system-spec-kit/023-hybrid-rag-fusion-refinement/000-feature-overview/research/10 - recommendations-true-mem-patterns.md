# Recommendations: true-mem Patterns for Spec Kit Memory

> **Research ID**: 140-R10
> **Status**: Complete
> **Date**: 2026-02-26
> **Source**: Analysis of https://github.com/rizal72/true-mem (v1.0.14)
> **Depends On**: 140-R9 (Deep Technical Analysis: true-mem Source Code)
> **Evidence Grade**: A (primary source analysis + architectural mapping to spec 140)

---

## 1. Executive Summary

This document distills actionable patterns from the true-mem cognitive memory plugin into specific recommendations for the Spec Kit Memory MCP server and the broader Spec Kit system. true-mem implements a cognitive psychology-based memory model (STM/LTM dual-store, Ebbinghaus decay, 7-feature scoring, 4-layer noise defense) in ~92KB with zero ML dependencies. While its Jaccard-only search is fundamentally weaker than our vector-based hybrid approach, several of its design patterns address gaps in our current system -- particularly around memory quality gating, scoring signal enrichment, and classification-based lifecycle policies.

**Impact on Spec 140**: 6 recommendations are directly adoptable within existing sprint boundaries. 2 are deferred as future investigation items. Total estimated effort: 18-30h across 4 sprints.

---

## 2. Recommendation Matrix

| ID | Recommendation | Sprint | Effort | Priority | Impact |
|----|---------------|--------|--------|----------|--------|
| TM-01 | Interference scoring signal | S2 | 4-6h | P1 | Medium-High |
| TM-02 | Content-hash fast-path dedup | S0 | 2-3h | P0 | High |
| TM-03 | Classification-based decay policies | S2 | 3-5h | P1 | Medium |
| TM-04 | Pre-storage quality gate (4-layer defense adaptation) | S4 | 6-10h | P1 | High |
| TM-05 | Dual-scope injection strategy | S5 | 4-6h | P2 | Medium |
| TM-06 | Reconsolidation-on-save pipeline | S4 | 6-10h | P1 | High |
| TM-07 | Role-aware extraction weights (future) | Deferred | -- | P3 | Low |
| TM-08 | Importance signal vocabulary expansion | S1 | 2-4h | P2 | Medium |

**Total adoptable effort: 18-30h** (TM-01 through TM-06)
**Deferred: 2 items** (TM-07, TM-08 contingent on auto-extraction feature)

---

## 3. Detailed Recommendations

### TM-01: Interference Scoring Signal

**What**: Add a negative-weight scoring signal that penalizes memories when competing/conflicting memories exist for the same concept.

**Why**: true-mem's 7-feature scoring model includes `interference` at -0.10 weight -- the only negative factor. This is psychologically grounded: similar competing memories degrade each other's accessibility (the "fan effect" in cognitive psychology). Our system already identifies this problem in R17 (fan-effect divisor in co-activation) but only addresses it in the co-activation channel, not in the composite scoring pipeline.

**How it works in true-mem**:
```
strength = 0.20*recency + 0.15*frequency + 0.25*importance
         + 0.20*utility + 0.10*novelty + 0.10*confidence
         - 0.10*interference
```
The interference score increases when memories with high Jaccard similarity (>0.5) exist in the same scope.

**Adaptation for Spec Kit Memory**:
- Add `interference_score REAL DEFAULT 0` to `memory_index` schema
- Compute at index time: count memories in same `spec_folder` with embedding cosine similarity > 0.75
- Apply as negative modifier in `composite-scoring.ts`: `-0.08 * interference_score`
- Recalculate on neighbor insert/delete (lazy: batch nightly, or eager: on `memory_save`)

**Sprint mapping**: S2 (Scoring Calibration) -- aligns with existing score normalization work
**Effort**: 4-6h
**Risk**: Low. Additive signal behind feature flag. No schema migration risk (new column with default).
**Interaction with spec 140**: Supplements R17 fan-effect divisor. R17 handles co-activation fan; TM-01 handles base scoring fan. Orthogonal.

[Assumes: composite-scoring.ts accepts pluggable signal functions]

---

### TM-02: Content-Hash Fast-Path Deduplication

**What**: Add SHA256 content hash check as Phase 0 of the memory save pipeline, before embedding generation.

**Why**: true-mem's three-phase dedup pipeline starts with an O(1) SHA256 hash check that catches exact duplicates instantly. Our current save pipeline (`memory-save.ts`) checks `content_hash` for incremental indexing but does NOT use it as a save-time dedup gate. When `memory_index_scan` runs, it skips unchanged files via hash -- but direct `memory_save` calls and the `generate-context.js` script can create duplicates if the same content is saved twice.

**How it works in true-mem**:
```typescript
function generateContentHash(text: string): string {
  const normalized = text.toLowerCase().trim();
  return createHash('sha256').update(normalized).digest('hex');
}
// Check BEFORE any embedding or similarity work
const existing = db.prepare('SELECT id FROM memory_units WHERE content_hash = ?').get(hash);
if (existing) return { status: 'duplicate', existingId: existing.id };
```

**Adaptation for Spec Kit Memory**:
- In `memory-save.ts` handler, add hash check as first validation step
- Query: `SELECT id FROM memory_index WHERE content_hash = ? AND spec_folder = ?`
- If match found: return early with `{ status: 'duplicate', existingId }` (skip embedding generation)
- Normalize: `text.toLowerCase().trim().replace(/\s+/g, ' ')`

**Sprint mapping**: S0 (Epistemological Foundation) -- this is a P0 data quality fix
**Effort**: 2-3h
**Risk**: Minimal. The `content_hash` column and index already exist. This adds a guard clause.
**Interaction with spec 140**: Complements G3 (chunk collapse bug fix) -- both prevent duplicate data pollution.

---

### TM-03: Classification-Based Decay Policies

**What**: Apply different FSRS decay behaviors based on memory `context_type` and `importance_tier`, rather than uniform decay across all memories.

**Why**: true-mem makes a key insight: only `episodic` memories should decay. Decisions, constraints, preferences, and learnings are effectively permanent. Our current FSRS implementation applies uniform decay via `stability` and `difficulty` parameters, but doesn't differentiate by content type. A decision about architectural direction (context_type: 'decision') should have fundamentally different retention characteristics than a debugging note.

**How it works in true-mem**:
```typescript
// config.ts
applyDecayOnlyToEpisodic: true  // Only 'episodic' type decays

// database.ts - applyDecay()
if (config.applyDecayOnlyToEpisodic) {
  // Filter: only process episodic memories
  memories = memories.filter(m => m.classification === 'episodic');
}
```

**Adaptation for Spec Kit Memory**:
- Map context_type to decay policy:

| context_type | Decay Policy | Rationale |
|-------------|-------------|-----------|
| decision | No decay (stability = max) | Architectural decisions are permanent |
| implementation | Standard decay | Implementation details fade as code changes |
| research | Slow decay (2x stability) | Research findings remain relevant longer |
| discovery | Standard decay | Exploratory findings may become stale |
| general | Standard decay | Default behavior |

- Map importance_tier overrides:

| importance_tier | Decay Override |
|----------------|---------------|
| constitutional | No decay (permanent) | Already handled |
| critical | No decay | New: suppress FSRS for critical |
| important | Slow decay (1.5x stability) | New |
| normal | Standard | No change |
| temporary | Fast decay (0.5x stability) | New |
| deprecated | Immediate (set to ARCHIVED) | Already handled |

- Implementation: Modify `fsrs-scheduler.ts` to accept decay policy multiplier based on type/tier lookup

**Sprint mapping**: S2 (Scoring Calibration) -- aligns with existing FSRS work and N4 cold-start boost
**Effort**: 3-5h
**Risk**: Low. Multiplier on existing FSRS parameters. No schema change needed.
**Interaction with spec 140**: Refines the existing FSRS decay without conflicting with any planned R-items. Provides more granular control that R13 evaluation can measure.

---

### TM-04: Pre-Storage Quality Gate (4-Layer Defense Adaptation)

**What**: Implement a multi-layer validation pipeline that runs BEFORE embedding generation in the `memory_save` handler, filtering low-quality or noisy content.

**Why**: true-mem's most sophisticated feature is its 4-layer false-positive defense (question detection, negative pattern matching, multi-keyword validation, role validation). Our current pre-flight validation (`memory_save` with `dryRun`) checks anchor format, duplicate detection, and token budget -- but does NOT assess content quality or filter noise. The `generate-context.js` script produces structured output, but direct memory saves via MCP tools have no content quality gate.

**Adaptation for Spec Kit Memory**:

**Layer 1: Structural Validation** (already exists)
- Anchor format check
- Token budget estimation
- Duplicate hash detection (TM-02)

**Layer 2: Content Quality Scoring** (NEW)
```
qualityScore = weighted average of:
  - title_present: 0.15 (has meaningful title, not just filename)
  - trigger_phrases_present: 0.20 (has >=2 trigger phrases)
  - content_length: 0.15 (>100 chars, <50K chars)
  - anchor_coverage: 0.15 (content has >=1 anchor section)
  - metadata_completeness: 0.10 (context_type, importance_tier set)
  - signal_density: 0.25 (ratio of meaningful content to boilerplate)
```
Threshold: qualityScore >= 0.4 to proceed (soft gate, warns below 0.6)

**Layer 3: Semantic Dedup Gate** (NEW - complements TM-02)
- After embedding generation, check top-1 similarity against existing memories in same spec_folder
- If cosine similarity > 0.92: reject as near-duplicate
- If cosine similarity 0.80-0.92: warn and proceed with `quality_flags: 'near_duplicate'`

**Layer 4: Reconsolidation Decision** (see TM-06)
- Handled separately as its own recommendation

**Sprint mapping**: S4 (Feedback Loop + Chunk Aggregation) -- aligns with R11 learned feedback
**Effort**: 6-10h
**Risk**: Medium. New validation logic could over-filter legitimate saves. Needs tuning.
**Interaction with spec 140**: Enhances R11 feedback quality by ensuring only high-quality memories enter the system. Prevents garbage-in/garbage-out in the feedback learning loop.

[Assumes: memory_save handler can be extended with pre-embedding validation steps]

---

### TM-05: Dual-Scope Injection Strategy

**What**: Implement memory injection at multiple context integration points, not just search-time retrieval.

**Why**: true-mem injects memories at 3 points: system prompt construction, tool execution, and session compaction. Our system relies on a single entry point: the LLM agent calls `memory_search` or `memory_match_triggers` explicitly. This is passive -- memories only surface when actively requested. true-mem's approach is active -- memories surface automatically at key lifecycle moments.

**Adaptation for Spec Kit Memory**:
This is primarily a Spec Kit Logic concern (not memory MCP), affecting how the system prompt and tool dispatch reference memory:

1. **Auto-surface on context load** (`memory_context` already does this) -- verify it runs at conversation start
2. **Auto-surface on tool dispatch** -- MCP hooks could inject relevant memories before tool execution (similar to true-mem's `tool.execute.before`)
3. **Auto-surface on compaction** -- inject critical memories into compaction summary

The MCP server already has `hooks/auto-surface.ts` which partially implements this. The gap is primarily in the Spec Kit logic layer (CLAUDE.md/SKILL.md integration).

**Sprint mapping**: S5 (Pipeline Refactor + Spec-Kit Logic) -- aligns with S2/S3 template/validation optimization
**Effort**: 4-6h
**Risk**: Low. Hook-based injection is non-destructive.
**Interaction with spec 140**: Supports S2 and S3 items for spec-kit logic improvements. Does NOT conflict with any memory MCP changes.

---

### TM-06: Reconsolidation-on-Save Pipeline

**What**: When a new memory is saved that is semantically similar to an existing memory, automatically decide between merge (duplicate), replace (conflict), or store (complement) -- rather than always storing as new.

**Why**: true-mem's reconsolidation system handles the "what to do with similar memories" problem that our system currently ignores. When `memory_save` is called, our system always creates a new entry (unless exact content hash matches). This leads to memory accumulation where 5-6 memories about the same topic exist with slightly different wording, all competing for ranking position.

**How it works in true-mem**:
```
similarity >= 0.85 --> DUPLICATE: increment frequency on existing, skip new
similarity 0.70-0.85 --> CONFLICT: replace existing with newer version
similarity < 0.70 --> COMPLEMENT: store as new (truly different content)
```

**Adaptation for Spec Kit Memory**:

After embedding generation (but before final INSERT), run reconsolidation:

```
1. Query: top-3 most similar memories in same spec_folder (cosine similarity)
2. If best_match.similarity >= 0.88:
   → DUPLICATE: Update existing memory's access_count += 1, updated_at = now
   → Return { status: 'reconsolidated', action: 'merged', existingId }
3. If best_match.similarity >= 0.75:
   → CONFLICT: Update existing memory's content, re-generate embedding
   → Add causal_edge: new_id --supersedes--> old_id
   → Return { status: 'reconsolidated', action: 'replaced', existingId }
4. If best_match.similarity < 0.75:
   → COMPLEMENT: Store as new memory (standard path)
   → Optionally add causal_edge: new_id --supports--> old_id (if > 0.50)
```

**Sprint mapping**: S4 (Feedback Loop + Chunk Aggregation) -- aligns with R1 MPAB aggregation
**Effort**: 6-10h
**Risk**: Medium-High. Auto-replacement could lose valuable content if similarity thresholds are miscalibrated. MUST be behind feature flag.
**Interaction with spec 140**: Strongly synergistic with R1 (Memory Parent Aggregation Bundle). R1 handles chunk-level aggregation; TM-06 handles memory-level dedup. Together they dramatically reduce memory pollution.
**Mitigation**: Requires `memory_checkpoint_create()` before enabling. Log all reconsolidation decisions for R13 evaluation.

[Assumes: embedding is available at save-time for similarity computation]

---

### TM-07: Role-Aware Extraction Weights (DEFERRED)

**What**: When processing conversation-originated memories, weight human-authored content 10x higher than assistant-generated content.

**Why**: true-mem's role validation prevents assistant reformulations from being stored as user preferences. Our system doesn't currently auto-extract from conversations -- memories are manually created via `generate-context.js`. This recommendation becomes relevant IF Spec Kit Memory adds auto-extraction in the future.

**Current relevance**: None for current architecture. The generate-context.js script operates on structured spec folder contents, not raw conversation transcripts.

**Trigger condition**: Revisit when/if auto-extraction feature is planned (not in spec 140 scope).

**Sprint mapping**: Deferred (beyond S7)
**Risk**: N/A until feature exists

---

### TM-08: Importance Signal Vocabulary Expansion

**What**: Expand trigger phrase extraction with true-mem's 8-category importance signal vocabulary to improve trigger matching quality.

**Why**: true-mem defines 18 signal types across 8 categories with calibrated weights (0.6-0.9). Our trigger extraction (`trigger-extractor.ts`) uses regex patterns but has a narrower signal vocabulary. Expanding the vocabulary could improve trigger match rates.

**Specific additions from true-mem**:

| Signal Type | Weight | Example Triggers | Current Coverage |
|-------------|--------|-----------------|-----------------|
| EXPLICIT_REMEMBER | 0.9 | "remember this", "keep in mind" | Partial (constitutional memories) |
| EMPHASIS_CUE | 0.8 | "critical", "essential", "important" | Yes (importance_tier) |
| CORRECTION | 0.7 | "actually", "wait", "I was wrong" | No |
| BUG_FIX | 0.8 | "bug", "fix", "crash", "exception" | Partial (context_type: fix_bug) |
| DECISION | 0.7 | "decided", "chose", "went with" | Partial (context_type: decision) |
| CONSTRAINT | 0.7 | "can't", "forbidden", "must never" | Partial (constitutional) |
| PREFERENCE | 0.6 | "prefer", "like", "want" | No |
| REPEATED_REQUEST | 0.7 | Detected via frequency, not keywords | No (frequency tracked differently) |

**Gap**: CORRECTION and PREFERENCE signals are not in our current vocabulary.

**Sprint mapping**: S1 (Graph Signal Activation) -- low-effort vocabulary expansion alongside co-activation boost work
**Effort**: 2-4h
**Risk**: Low. Additive trigger phrases don't affect existing matches.
**Interaction with spec 140**: Enhances trigger matching quality, feeding into R4 (typed-degree as 5th RRF channel) with richer trigger data.

---

## 4. Integration with Spec 140 Sprint Plan

### Sprint Placement Summary

```
S0 (Epistemological Foundation):
  + TM-02: Content-hash fast-path dedup (2-3h)              [P0]

S1 (Graph Signal Activation):
  + TM-08: Importance signal vocabulary expansion (2-4h)     [P2]

S2 (Scoring Calibration + Efficiency):
  + TM-01: Interference scoring signal (4-6h)                [P1]
  + TM-03: Classification-based decay policies (3-5h)        [P1]

S4 (Feedback Loop + Chunk Aggregation):
  + TM-04: Pre-storage quality gate (6-10h)                  [P1]
  + TM-06: Reconsolidation-on-save pipeline (6-10h)          [P1]

S5 (Pipeline Refactor + Spec-Kit Logic):
  + TM-05: Dual-scope injection strategy (4-6h)              [P2]

Deferred:
  TM-07: Role-aware extraction (triggers on auto-extraction feature)
```

### Effort Impact on Spec 140

| Sprint | Current Estimate | TM Additions | New Estimate | % Increase |
|--------|-----------------|-------------|-------------|------------|
| S0 | 45-70h | +2-3h | 47-73h | +4% |
| S1 | 24-35h | +2-4h | 26-39h | +8% |
| S2 | 21-32h | +7-11h | 28-43h | +33% |
| S4 | 60-89h | +12-20h | 72-109h | +20% |
| S5 | 64-92h | +4-6h | 68-98h | +6% |

**Total program impact**: +27-44h across all sprints (~8-9% increase)

---

## 5. Risk Analysis

### High-Confidence Adoptions (TM-01, TM-02, TM-03, TM-08)

These 4 recommendations are **low-risk, additive changes** that don't modify existing behavior:
- TM-02 (hash dedup) adds a guard clause to an existing pipeline
- TM-01, TM-03 add configurable scoring signals behind feature flags
- TM-08 expands vocabulary without affecting existing matches

Combined effort: 11-18h. Recommended for immediate adoption.

### Medium-Confidence Adoptions (TM-04, TM-05, TM-06)

These 3 recommendations are **medium-risk, behavior-changing**:
- TM-04 (quality gate) could over-filter legitimate saves if thresholds miscalibrated
- TM-06 (reconsolidation) could auto-replace valuable content if similarity thresholds wrong
- TM-05 (dual-scope injection) could increase token consumption if not budgeted

**Mitigation requirements**:
- TM-04: Start with warn-only mode (log quality scores, don't reject) for 2 weeks
- TM-06: Require checkpoint before enabling; log all decisions for R13 review
- TM-05: Enforce per-injection-point token budgets (4000 max, matching true-mem)

Combined effort: 16-26h. Recommended for Sprint 4+ with flag governance.

### Patterns NOT Recommended for Adoption

| true-mem Pattern | Why Not Adopt |
|-----------------|---------------|
| Jaccard-only search | Our vector + hybrid approach is fundamentally superior |
| STM/LTM dual-store model | Our 6-tier model (constitutional through deprecated) provides finer granularity |
| 1000-row hard search cap | Arbitrary scaling limit; our sqlite-vec approach scales better |
| "Newer wins" conflict resolution | Too naive; our causal edges (supersedes relation) handle this with lineage tracking |
| OpenCode plugin hooks model | We use MCP protocol which is more portable and standardized |
| Zero-dependency philosophy | Our embedding-based search quality justifies the dependency cost |

---

## 6. Architecture Implications

### For Spec Kit Memory MCP Server

The primary impact is in 3 subsystems:

1. **Save pipeline** (`memory-save.ts`): TM-02 (hash dedup), TM-04 (quality gate), TM-06 (reconsolidation) all add pre-insert validation stages. These should be structured as a **save validation pipeline** with ordered stages:
   ```
   Stage 1: Content hash check (TM-02) — O(1), cheapest first
   Stage 2: Quality scoring (TM-04) — O(1), metadata analysis
   Stage 3: Embedding generation — O(1), API call (existing)
   Stage 4: Semantic dedup (TM-04 Layer 3) — O(n), requires embedding
   Stage 5: Reconsolidation (TM-06) — O(n), requires embedding
   Stage 6: Insert — O(log n), final write
   ```
   This pipeline structure aligns with R6's 4-stage pipeline refactor. TM recommendations add stages 1-2 (pre-embedding) and stage 5 (post-embedding, pre-insert).

2. **Scoring pipeline** (`composite-scoring.ts`): TM-01 (interference) and TM-03 (classification-based decay) add new scoring signals. These plug into the existing composite scoring framework.

3. **FSRS scheduler** (`fsrs-scheduler.ts`): TM-03 modifies decay behavior per type/tier. This is a parameter change, not an architectural change.

### For Spec Kit Logic (Non-Memory)

TM-05 (dual-scope injection) primarily affects the Spec Kit logic layer:
- SKILL.md instructions for when/how memory is auto-surfaced
- CLAUDE.md gate instructions for memory context loading
- Hook configurations for tool dispatch and compaction

This is a documentation + configuration change, not a code change in the MCP server.

---

## 7. Comparison: true-mem vs. Spec Kit Memory Strengths

| Capability | true-mem Advantage | Spec Kit Memory Advantage |
|-----------|-------------------|--------------------------|
| **Noise filtering** | 4-layer defense, role validation | Pre-flight validation, constitutional bypass |
| **Deduplication** | 3-phase pipeline (hash + Jaccard + reconsolidation) | Content hash (incremental indexing only) |
| **Scoring depth** | 7-feature model with interference | Multi-channel hybrid (vector + FTS + BM25 + graph) |
| **Semantic search** | -- | Vector embeddings, cross-encoder reranking, MMR diversity |
| **Relationships** | -- | Causal graph with 6 relation types, BFS traversal |
| **Lifecycle** | STM/LTM promotion with auto-promote | 6-tier system with FSRS spaced repetition |
| **Scale** | 1000-row cap, O(n) search | sqlite-vec, FTS5 indexes, unbounded (tested to 100K) |
| **Integration** | Active injection at 3 lifecycle points | Passive MCP tools (25 tools, 7 layers) |
| **Dependencies** | Zero (92KB bundle) | Embedding provider + sqlite-vec extension |

**Bottom line**: true-mem excels at **input quality** (filtering noise before storage) while Spec Kit Memory excels at **retrieval quality** (finding the right memory after storage). The recommendations in this document bridge that gap by bringing true-mem's input quality patterns into Spec Kit Memory's superior retrieval architecture.

---

## 8. Decision Record

### Adopted for Spec 140

| ID | Decision | Rationale |
|----|----------|-----------|
| TM-01 | ADOPT: Interference scoring | Psychologically grounded, computationally cheap, addresses fan-effect gap |
| TM-02 | ADOPT: Content-hash dedup | O(1) guard clause, near-zero risk, prevents duplicate pollution |
| TM-03 | ADOPT: Classification decay | More nuanced than uniform decay, aligns with existing tier system |
| TM-04 | ADOPT: Quality gate | Reduces garbage-in/garbage-out, critical for R11 feedback quality |
| TM-05 | ADOPT: Dual-scope injection | Defense-in-depth for context preservation, primarily config change |
| TM-06 | ADOPT: Reconsolidation | Addresses memory accumulation problem, synergistic with R1 |
| TM-08 | ADOPT: Signal vocabulary | Low-effort enhancement, improves trigger matching |

### Deferred

| ID | Decision | Trigger Condition |
|----|----------|-------------------|
| TM-07 | DEFER: Role-aware extraction | Auto-extraction feature is planned |

### Rejected (from true-mem, not recommended)

| Pattern | Decision | Rationale |
|---------|----------|-----------|
| Jaccard search | REJECT | Vector embeddings provide superior semantic understanding |
| Dual-store STM/LTM | REJECT | Our 6-tier system provides finer granularity |
| Zero-dependency philosophy | REJECT | Embedding quality justifies dependency cost |

---

## 9. Acknowledgements

- **Repository**: https://github.com/rizal72/true-mem
- **Author**: rizal72
- **License**: MIT
- **Version analyzed**: 1.0.14
- **Analysis method**: 5-agent parallel research synthesis
- **Prior work**: Built on findings from 140-R1 through 140-R8 (prior research waves)
