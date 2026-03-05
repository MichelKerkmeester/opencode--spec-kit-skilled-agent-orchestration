# zvec INT8 Quantization: TypeScript Portability Analysis

> **Agent**: Research Agent 1 -- zvec INT8 Quantization TypeScript Portability
> **Date**: 2026-02-26
> **Spec**: 02--system-spec-kit/022-hybrid-rag-fusion-refinement
> **Status**: Complete

---

## 1. Current Embedding Storage Analysis

### 1.1 Active Configuration

| Parameter | Value | Source |
|-----------|-------|--------|
| Embedding Provider | Voyage (voyage-4) | `memory_health()` response |
| Embedding Dimension | 1024 | `embeddingProvider.dimension = 1024` |
| Total Memories | 2,147 | `memory_stats()` response |
| Successful Embeddings | 2,050 | `byStatus.success = 2050` |
| Database File Size | 180,453,376 bytes (~172 MB) | `ls -la context-index.sqlite` |
| sqlite-vec Version | 0.1.7-alpha.2 | `package.json` |

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:204-225`]
[SOURCE: `memory_health()` tool response -- embeddingProvider object]

### 1.2 Vec Table Schema

```sql
CREATE VIRTUAL TABLE vec_memories USING vec0(
  embedding FLOAT[1024]
)
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1662-1665`]

### 1.3 Bytes Per Record (FP32 Current State)

```
Per embedding: 1024 dimensions x 4 bytes/dimension = 4,096 bytes
Total vector storage (2,050 embeddings): 2,050 x 4,096 = 8,396,800 bytes (~8.0 MB)
```

The vec_memories virtual table stores each embedding as a contiguous FP32 BLOB. The `to_embedding_buffer` function converts Float32Array directly:

```typescript
function to_embedding_buffer(embedding: EmbeddingInput) {
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  return Buffer.from(new Float32Array(embedding).buffer);
}
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:148-153`]

### 1.4 Database Size Attribution

| Component | Estimated Size | % of DB |
|-----------|---------------|---------|
| vec_memories (FP32 BLOBs) | ~8.0 MB | 4.4% |
| memory_index (40+ columns, 2147 rows) | ~5-15 MB | 3-8% |
| memory_fts (FTS5 full-text index) | ~10-30 MB | 6-17% |
| SQLite overhead (WAL, indexes, pages) | remainder | ~70-86% |

**Key insight**: Vector storage accounts for approximately **4.4% of the total database size** (8 MB of 172 MB). The FTS5 index, in-memory BM25 data, and SQLite metadata dominate storage.

---

## 2. zvec Per-Record INT8 Quantization Algorithm

### 2.1 Algorithm Breakdown

The zvec per-record streaming quantizer (from `src/core/quantizer/record_quantizer.h`) works as follows:

**Step 1: Per-Record Min/Max Discovery**
```
For each vector independently:
  min = minimum value across all dimensions
  max = maximum value across all dimensions
```

**Step 2: Scale Factor Computation**
```
scale = 254 / max(max - min, epsilon)
bias = -min * scale - 127
```

This maps the range [min, max] into [-127, +127] (254 INT8 levels). The epsilon prevents division by zero for constant vectors.

**Step 3: Quantization (Encode)**
```
For each dimension i:
  quantized[i] = round(value[i] * scale + bias)
  clamp to [-127, 127]
```

**Step 4: Metadata Storage**
```
extras[0] = 1.0 / scale         // scale_reciprocal (for decode)
extras[1] = -bias / scale        // decode bias
extras[2] = sum(quantized)        // precomputed element sum
extras[3] = sum(quantized^2)      // precomputed squared sum
```

[SOURCE: `research-zvec.md` section 4.3, citing `src/core/quantizer/record_quantizer.h`]

### 2.2 Storage Layout

```
INT8 vector layout:
[int8_data (dim bytes)] [scale_recip (4B)] [bias (4B)] [sum (4B)] [squared_sum (4B)]

For 1024-dim:
  1024 + 16 = 1,040 bytes per vector
  vs. FP32: 1024 * 4 = 4,096 bytes per vector
  Compression ratio: 4,096 / 1,040 = 3.94x (74.6% reduction)
```

### 2.3 Decode (Dequantize)

```
For each dimension i:
  decoded[i] = quantized[i] * scale_reciprocal - decode_bias
```

This is a simple linear transform per element -- O(dim) with no branching.

### 2.4 Quantized Distance Without Decode

For cosine similarity on quantized vectors, zvec computes directly in INT8 domain:

```
cosine_sim = ma * qa * IP(q_int8, m_int8) + mb * qa * sum_m + qb * ma * sum_q + dim * qb * mb
```

Where:
- `ma`, `mb` = scale and bias of stored vector
- `qa`, `qb` = scale and bias of query vector
- `IP(q_int8, m_int8)` = integer inner product (sum of products)
- `sum_m`, `sum_q` = precomputed element sums

This avoids decoding back to FP32, keeping computation in integer arithmetic until the final result.

[SOURCE: `research-zvec.md` section 5.3, citing `src/core/metric/quantized_integer_metric_matrix.h`]

---

## 3. sqlite-vec INT8 Native Support Assessment

### 3.1 Confirmed: sqlite-vec Supports INT8 Natively

sqlite-vec version 0.1.7-alpha.2 (installed) supports three vector types:

| Type | Column Syntax | Bytes/Element | Distance Functions |
|------|--------------|---------------|-------------------|
| float32 | `FLOAT[dim]` | 4 | vec_distance_cosine, vec_distance_L2 |
| int8 | `INT8[dim]` | 1 | vec_distance_cosine, vec_distance_L2 |
| bit | `BIT[dim]` | 1/8 | vec_distance_hamming |

[SOURCE: sqlite-vec GitHub README -- "Store and query float, int8, and binary vectors in vec0 virtual tables"]
[SOURCE: sqlite-vec API reference -- `vec_int8(vector)` constructor, `vec_distance_cosine` for float32/int8]

### 3.2 Native INT8 Table Creation

```sql
CREATE VIRTUAL TABLE vec_memories_int8 USING vec0(
  embedding INT8[1024]
);
```

**Critical finding**: sqlite-vec handles INT8 vectors natively. `vec_distance_cosine` works on INT8 vectors directly. There is NO need for a custom shim layer -- sqlite-vec performs the quantized distance computation internally.

### 3.3 Conversion Function

sqlite-vec provides `vec_quantize_i8()` for converting float32 vectors to int8. However, the documentation marks this as incomplete ("todo"). This means we may need to perform quantization in TypeScript and pass raw INT8 buffers.

### 3.4 Implication: Two Architecture Options

**Option A: Application-Level Quantization (Recommended)**
- Quantize in TypeScript before insertion
- Store quantized INT8 buffer in `INT8[1024]` column
- sqlite-vec computes distances natively on INT8
- We control scale/bias parameters

**Option B: sqlite-vec Built-in Quantization**
- Use `vec_quantize_i8()` at insert time
- Less control over quantization parameters
- Depends on alpha-quality function

---

## 4. TypeScript Implementation Sketch

### 4.1 Core Quantization Functions

```typescript
interface QuantizedEmbedding {
  /** INT8 quantized vector data */
  data: Int8Array;           // 1024 bytes
  /** Scale reciprocal for decode: value = quantized * scaleRecip + decodeBias */
  scaleRecip: number;        // 4 bytes
  /** Decode bias */
  decodeBias: number;        // 4 bytes
  /** Precomputed sum of quantized elements (for fast distance) */
  sum: number;               // 4 bytes
  /** Precomputed sum of squared quantized elements */
  squaredSum: number;        // 4 bytes
}
// Total metadata: 16 bytes

/**
 * Per-record INT8 quantization following zvec's streaming quantizer pattern.
 * Maps [min, max] of each vector independently to [-127, +127].
 */
function quantizeToInt8(embedding: Float32Array): QuantizedEmbedding {
  const dim = embedding.length;
  const EPSILON = 1e-7;

  // Step 1: Find per-record min/max
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < dim; i++) {
    if (embedding[i] < min) min = embedding[i];
    if (embedding[i] > max) max = embedding[i];
  }

  // Step 2: Compute scale/bias (maps [min, max] -> [-127, 127])
  const range = Math.max(max - min, EPSILON);
  const scale = 254 / range;
  const bias = -min * scale - 127;

  // Step 3: Quantize
  const data = new Int8Array(dim);
  let sum = 0;
  let squaredSum = 0;
  for (let i = 0; i < dim; i++) {
    const v = Math.round(embedding[i] * scale + bias);
    const clamped = Math.max(-127, Math.min(127, v));
    data[i] = clamped;
    sum += clamped;
    squaredSum += clamped * clamped;
  }

  return {
    data,
    scaleRecip: 1 / scale,
    decodeBias: -bias / scale,
    sum,
    squaredSum,
  };
}

/**
 * Dequantize INT8 back to FP32 (for re-ranking or verification).
 */
function dequantizeToFloat32(q: QuantizedEmbedding): Float32Array {
  const result = new Float32Array(q.data.length);
  for (let i = 0; i < q.data.length; i++) {
    result[i] = q.data[i] * q.scaleRecip + q.decodeBias;
  }
  return result;
}
```

### 4.2 Buffer Conversion for sqlite-vec

```typescript
/**
 * Convert QuantizedEmbedding to a Buffer for sqlite-vec INT8 column insertion.
 * sqlite-vec expects raw INT8 bytes for INT8[N] columns.
 */
function toInt8Buffer(q: QuantizedEmbedding): Buffer {
  return Buffer.from(q.data.buffer, q.data.byteOffset, q.data.byteLength);
}

/**
 * Convert Buffer from sqlite-vec back to Int8Array.
 */
function fromInt8Buffer(buf: Buffer): Int8Array {
  return new Int8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}
```

### 4.3 Integration with Existing Code

The key modification point is `to_embedding_buffer()` at line 148 of `vector-index-impl.ts`:

```typescript
// Current (FP32):
function to_embedding_buffer(embedding: EmbeddingInput) {
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  return Buffer.from(new Float32Array(embedding).buffer);
}

// With INT8 quantization (new):
function to_embedding_buffer_int8(embedding: EmbeddingInput): {
  buffer: Buffer;
  metadata: { scaleRecip: number; decodeBias: number; sum: number; squaredSum: number };
} {
  const fp32 = embedding instanceof Float32Array ? embedding : new Float32Array(embedding);
  const quantized = quantizeToInt8(fp32);
  return {
    buffer: toInt8Buffer(quantized),
    metadata: {
      scaleRecip: quantized.scaleRecip,
      decodeBias: quantized.decodeBias,
      sum: quantized.sum,
      squaredSum: quantized.squaredSum,
    },
  };
}
```

### 4.4 Schema Migration

```sql
-- New INT8 vector table (alongside existing FP32 for migration safety)
CREATE VIRTUAL TABLE vec_memories_int8 USING vec0(
  embedding INT8[1024]
);

-- Metadata table for quantization parameters
CREATE TABLE IF NOT EXISTS vec_quantization_meta (
  memory_id INTEGER PRIMARY KEY,
  scale_recip REAL NOT NULL,
  decode_bias REAL NOT NULL,
  element_sum REAL NOT NULL,
  squared_sum REAL NOT NULL,
  FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
);
```

### 4.5 Cosine Similarity (TypeScript Application-Level, for MMR)

The existing MMR reranker (`mmr-reranker.ts:45-64`) computes cosine similarity in TypeScript on Float32Array embeddings fetched from `vec_memories`. If we switch to INT8, the MMR code needs to either:

**Option A**: Dequantize before MMR (simple, slight overhead)
```typescript
// In hybrid-search.ts, line ~540-544:
for (const row of embRows) {
  if (Buffer.isBuffer(row.embedding)) {
    const int8 = fromInt8Buffer(row.embedding);
    // Fetch metadata to dequantize, OR compute cosine directly on int8
    embeddingMap.set(row.rowid, dequantizeWithMeta(int8, metadataMap.get(row.rowid)));
  }
}
```

**Option B**: Compute cosine directly on INT8 using metadata (faster, matches zvec)
```typescript
function cosineInt8(
  a: Int8Array, aMeta: { scaleRecip: number; decodeBias: number; sum: number },
  b: Int8Array, bMeta: { scaleRecip: number; decodeBias: number; sum: number },
): number {
  const dim = a.length;
  let dot = 0;
  for (let i = 0; i < dim; i++) {
    dot += a[i] * b[i];
  }

  // Reconstruct floating-point cosine from quantized domain
  const sa = aMeta.scaleRecip, ba = aMeta.decodeBias;
  const sb = bMeta.scaleRecip, bb = bMeta.decodeBias;

  const realDot = sa * sb * dot
                + ba * sb * aMeta.sum
                + bb * sa * bMeta.sum
                + dim * ba * bb;

  // For normalized vectors, this is the cosine similarity
  // For unnormalized, we'd need norms too
  return realDot;
}
```

---

## 5. Precision Impact Analysis

### 5.1 Theoretical Error Bound

Per-record INT8 quantization maps the continuous range [min, max] into 254 discrete levels. The maximum quantization error per dimension is:

```
max_error_per_dim = (max - min) / 254
```

For typical OpenAI/Voyage embeddings where values range approximately [-0.1, +0.1]:
```
max_error_per_dim = 0.2 / 254 = 0.000787
```

For 1024 dimensions, the accumulated error in a dot product is bounded by:
```
max_dot_error = dim * max_error_per_dim^2 = 1024 * (0.000787)^2 = 0.000634
```

This is well below the threshold that would affect ranking.

### 5.2 Empirical Evidence from zvec Research

From the zvec research document:

| Precision | Bytes/dim | Recall Impact | Use Case |
|-----------|-----------|---------------|----------|
| FP32 | 4 | Baseline | Full precision |
| FP16 | 2 | Negligible | Good accuracy |
| INT8 | 1 | ~1-2% recall loss | Balanced |
| INT4 | 0.5 | ~3-5% recall loss | Maximum compression |

[SOURCE: `research-zvec.md` section 8.1]

### 5.3 Precision Impact for Our Use Case

**Mitigating factors at our scale:**
1. **Hybrid search**: Vector is only one of 4 channels (vector, FTS5, BM25, graph). A 1-2% recall loss in vector similarity is partially compensated by the other channels.
2. **RRF fusion**: Rank-based fusion is tolerant of small score perturbations -- a vector result at rank 3 vs rank 4 after quantization has minimal RRF impact.
3. **Top-K tolerance**: Our searches return top-10 to top-20 results. At 1-2% recall loss, the probability of a relevant result dropping from top-10 to top-11 is low.
4. **Constitutional injection**: Constitutional memories are always injected regardless of vector score, so the most important results are immune to quantization effects.

**Aggravating factors:**
1. **No SIMD acceleration**: TypeScript lacks SIMD for INT8 operations. The integer dot product runs in scalar JavaScript, negating some of the speed benefit that C/C++ INT8 implementations achieve.
2. **MMR uses embeddings**: The MMR reranker needs decoded or approximate cosine similarity. INT8 adds a decode step or metadata lookup that does not exist today.

### 5.4 Confidence Assessment

| Claim | Confidence | Evidence Grade |
|-------|-----------|---------------|
| INT8 recall loss <= 2% for 1024-dim Voyage embeddings | Medium | B (zvec research extrapolation, not measured on our corpus) |
| Ranking order preserved for top-10 | Medium-High | B (theoretical error bound + empirical zvec data) |
| Hybrid search compensates for vector degradation | High | A (direct code analysis of 4-channel fusion) |

---

## 6. Scale Analysis: When Is Quantization Worthwhile?

### 6.1 Current Storage Economics

```
Current FP32 vector storage:
  2,050 embeddings x 4,096 bytes = 8,396,800 bytes = 8.0 MB

Projected INT8 vector storage:
  2,050 embeddings x 1,024 bytes = 2,099,200 bytes = 2.0 MB
  2,050 metadata rows x 16 bytes  =    32,800 bytes = 0.03 MB
  Total INT8:                                        = 2.03 MB

Savings: 8.0 MB - 2.03 MB = 5.97 MB (74.6% reduction in vector storage)
But: 5.97 MB is 3.3% of the 172 MB total database size.
```

### 6.2 Break-Even Analysis

The cost of implementing INT8 quantization includes:
- Schema migration (new vec0 table + metadata table)
- Quantization code (~200 lines TypeScript)
- Buffer conversion changes in 5-6 functions
- MMR reranker adaptation
- Migration script for existing 2,050 embeddings
- Testing infrastructure (precision validation tests)

**Estimated implementation effort**: 1-2 days for a skilled developer.

### 6.3 Scale Thresholds

| Memory Count | FP32 Size (1024d) | INT8 Size | Savings | Verdict |
|-------------|-------------------|-----------|---------|---------|
| 500 | 2.0 MB | 0.5 MB | 1.5 MB | Not worth the complexity |
| 2,000 | 8.0 MB | 2.0 MB | 6.0 MB | Marginal -- savings are 3% of DB |
| 5,000 | 20.0 MB | 5.0 MB | 15.0 MB | Starting to matter |
| 10,000 | 40.0 MB | 10.0 MB | 30.0 MB | Clearly worthwhile |
| 50,000 | 200.0 MB | 50.0 MB | 150.0 MB | Essential |

### 6.4 Performance Impact at Current Scale

**Search latency**: At 2,050 vectors, sqlite-vec's brute-force scan of FP32 vectors is fast enough. The bottleneck is embedding generation (API call to Voyage), not vector search.

| Operation | FP32 Estimate | INT8 Estimate | Notes |
|-----------|-------------|-------------|-------|
| Vector search (2K records) | <5ms | <3ms | Both dominated by SQLite I/O |
| Embedding generation | 200-500ms | 200-500ms | Unchanged (Voyage API) |
| Quantization overhead | 0ms | <1ms | 1024-dim quantization |
| Total query time | ~250ms | ~250ms | Embedding generation dominates |

**At current scale, quantization provides no measurable latency improvement.**

### 6.5 Memory Pressure Analysis

The in-memory BM25 index (`bm25-index.ts`) is fully rebuilt on startup and holds all document terms in RAM. This is likely a larger memory consumer than the SQLite buffer pool for vec_memories. The database file being 172 MB does not mean 172 MB is in RAM -- SQLite uses demand paging.

---

## 7. sqlite-vec Compatibility Deep Dive

### 7.1 Version 0.1.7-alpha.2 Capabilities

| Feature | Status | Notes |
|---------|--------|-------|
| `FLOAT[N]` columns | Stable | Currently used |
| `INT8[N]` columns | Supported | In API, documented |
| `BIT[N]` columns | Supported | For binary vectors |
| `vec_distance_cosine(INT8, INT8)` | Supported | Works on int8 columns natively |
| `vec_distance_L2(INT8, INT8)` | Supported | Euclidean on int8 |
| `vec_quantize_i8()` | Incomplete (todo) | Cannot rely on built-in quantization |
| `vec_int8(blob)` | Supported | Constructor for int8 from BLOB |

### 7.2 Query Pattern with INT8

```sql
-- Insert quantized vector:
INSERT INTO vec_memories_int8 (rowid, embedding) VALUES (?, ?);
-- where ? is Buffer.from(int8Array.buffer)

-- Search with quantized query:
SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance
FROM memory_index m
JOIN vec_memories_int8 v ON m.id = v.rowid
WHERE vec_distance_cosine(v.embedding, ?) <= ?
ORDER BY distance ASC
LIMIT ?;
```

The query pattern is **identical** to the current FP32 pattern. Only the buffer contents change (INT8 vs FP32). sqlite-vec handles the INT8 distance computation internally.

### 7.3 Migration Strategy

**Phase 1: Dual-Store (Safe)**
- Create `vec_memories_int8` alongside existing `vec_memories`
- Insert quantized vectors into both on save
- Search still uses `vec_memories` (FP32)
- Validate INT8 search quality against FP32 baseline

**Phase 2: Switchover**
- Point search queries to `vec_memories_int8`
- Keep FP32 as backup
- Measure recall impact empirically

**Phase 3: Cleanup**
- Drop `vec_memories` FP32 table
- Single INT8 store

### 7.4 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| sqlite-vec INT8 bug in alpha | Medium | High | Dual-store phase; revert to FP32 |
| Quantization precision loss > 2% | Low | Medium | Empirical validation before switchover |
| MMR reranker degradation | Low | Low | Dequantize for MMR; overhead is negligible for top-20 |
| Migration corrupts existing data | Low | High | Additive schema; no modification of existing tables |

---

## 8. Alternative: Pre-Normalized Cosine Optimization (Zero-Cost Win)

### 8.1 Description

zvec's CosineConverter pre-normalizes vectors on insert and stores the original L2 norm. At search time, cosine distance reduces to inner product, saving one normalization step per comparison.

### 8.2 Applicability

Currently, `vec_distance_cosine` in sqlite-vec handles normalization internally. However, the TypeScript `computeCosine` function in `mmr-reranker.ts` normalizes on every call:

```typescript
// Current: O(3N) per pair -- dot + normA + normB
for (let i = 0; i < len; i++) {
  dot += a[i] * b[i];
  normA += a[i] * a[i];
  normB += b[i] * b[i];
}
const denom = Math.sqrt(normA) * Math.sqrt(normB);
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/mmr-reranker.ts:45-63`]

Pre-normalizing would eliminate 2/3 of the computation:
```typescript
// Pre-normalized: O(N) per pair -- just dot product
for (let i = 0; i < len; i++) {
  dot += a[i] * b[i]; // Already normalized, so this IS cosine similarity
}
```

### 8.3 Impact

For MMR with 20 candidates and ~10 selected, that is approximately 100 pairwise comparisons x 1024 dimensions. Savings: ~200,000 multiply-add operations. Likely unmeasurable at this scale, but a clean optimization.

---

## 9. Recommendation

### 9.1 Decision Matrix

| Option | Storage Savings | Precision Impact | Complexity | Latency Impact | Recommendation |
|--------|----------------|-----------------|------------|----------------|----------------|
| **A: INT8 Now** | 6 MB (3.3% of DB) | ~1-2% recall | Medium | None measurable | **SKIP** |
| **B: INT8 at 10K records** | 30 MB (significant) | ~1-2% recall | Medium | Slight improvement | **DEFER** |
| **C: Pre-normalize only** | 0 MB | 0% | Low | MMR ~30% faster | **IMPLEMENT** |
| **D: FP16 compression** | 4 MB (2.2% of DB) | Negligible | Low | None | **SKIP** |

### 9.2 Verdict: DEFER INT8 Quantization

**Rationale:**

1. **Storage savings are negligible at current scale.** Saving 6 MB when the database is 172 MB (3.3% reduction) does not justify the implementation complexity, migration risk, and testing overhead.

2. **No latency benefit.** At 2,050 vectors, brute-force FP32 search completes in <5ms. The bottleneck is Voyage API embedding generation (~200-500ms), not vector search.

3. **sqlite-vec alpha risk.** The INT8 support in 0.1.7-alpha.2 is documented but the `vec_quantize_i8()` function is explicitly marked as incomplete. Relying on alpha-quality features for a production memory system adds unnecessary risk.

4. **Hybrid search absorbs vector degradation.** Even if INT8 slightly degrades vector recall, the 4-channel fusion (vector + FTS5 + BM25 + graph) provides robustness. But there is no reason to accept any degradation when the savings are minimal.

5. **The math does not support premature optimization.** At the current growth rate (~2,000 memories over a development period), reaching 10,000 memories (where quantization becomes meaningful) is a future concern, not a present one.

### 9.3 Trigger for Reconsideration

Implement INT8 quantization when ANY of these conditions is met:
- Memory count exceeds **10,000** records
- Vector storage exceeds **40 MB** (10% of expected max DB size)
- sqlite-vec reaches **stable 1.0 release** with tested INT8 support
- A new embedding provider produces **>= 2048-dim** embeddings
- Latency profiling shows vector search **>50ms** per query

### 9.4 Immediate Action: Pre-Normalize Embeddings

The one zero-cost optimization from zvec that applies NOW:

1. Pre-normalize embeddings before storage (divide by L2 norm)
2. Store the original norm as metadata (for exact reconstruction if needed)
3. The `computeCosine` function in MMR can then skip normalization

This is a 10-line change with zero risk, zero storage cost, and a cleaner abstraction. However, it provides no measurable user-facing improvement at current scale, so even this should be prioritized only if the MMR path is being touched for other reasons.

---

## 10. Appendix: Code Locations Referenced

| File | Lines | Purpose |
|------|-------|---------|
| `vector-index-impl.ts` | 148-153 | `to_embedding_buffer()` -- FP32 serialization |
| `vector-index-impl.ts` | 204-225 | `get_embedding_dim()` -- dimension resolution |
| `vector-index-impl.ts` | 1658-1678 | `vec_memories` table creation |
| `vector-index-impl.ts` | 1826-1834 | Vector insert (FP32 buffer into vec0) |
| `vector-index-impl.ts` | 1984-1996 | Vector update (delete + re-insert) |
| `vector-index-impl.ts` | 2195-2208 | Vector search query (vec_distance_cosine) |
| `vector-index-impl.ts` | 2260-2300 | Multi-concept search (multiple vec_distance_cosine) |
| `hybrid-search.ts` | 523-580 | MMR embedding retrieval from vec_memories |
| `mmr-reranker.ts` | 45-64 | `computeCosine()` -- JavaScript cosine similarity |
| `mmr-reranker.ts` | 69-127 | `applyMMR()` -- MMR reranking with embeddings |
| `package.json` | 37 | sqlite-vec version: 0.1.7-alpha.2 |

All paths are relative to:
`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/`
