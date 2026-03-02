# Research Report: alibaba/zvec -- Deep Technical Analysis

## 1. Metadata

| Field          | Value                                                  |
| -------------- | ------------------------------------------------------ |
| Research ID    | ZVEC-2026-001                                          |
| Status         | Complete                                               |
| Date           | 2026-02-26                                             |
| Repository     | https://github.com/alibaba/zvec                        |
| Language       | C++ (core), Python/Node.js (bindings)                  |
| Stars          | ~7,958                                                 |
| License        | Apache 2.0                                             |
| Purpose        | Extract patterns for spec-kit memory MCP vector store  |

---

## 2. Executive Summary

Zvec is Alibaba's open-source, in-process vector database built on their battle-tested **Proxima** search engine. It provides a production-grade ANN (Approximate Nearest Neighbor) search system with three core index algorithms (Flat, HNSW, IVF), multi-precision quantization (FP32, FP16, INT8, INT4, Binary), and SIMD-optimized distance computations across x86 (SSE/AVX2) and ARM (NEON) architectures. The system supports dense and sparse vectors, hybrid search with structured filters, and streaming index updates.

For the spec-kit memory MCP server, zvec offers **directly applicable patterns** in three areas: (1) scalar quantization to reduce embedding storage 4-8x, (2) pre-normalized cosine similarity with appended norm metadata for fast distance computation, and (3) entropy-calibrated quantization thresholds using KL divergence to minimize accuracy loss.

---

## 3. Architecture Overview

### ASCII Architecture Diagram

```
+------------------------------------------------------------------+
|                         zvec Architecture                         |
+------------------------------------------------------------------+
|                                                                    |
|  BINDINGS LAYER (Python / Node.js / C++)                          |
|  +------------------------------------------------------------+   |
|  | python/zvec/zvec.py  |  src/binding/python/binding.cc       |   |
|  +------------------------------------------------------------+   |
|                              |                                     |
|  DB LAYER (Collection Management)                                 |
|  +------------------------------------------------------------+   |
|  | Collection | Schema | Segment Manager | Version Manager     |   |
|  | WAL        | RocksDB Context | SQL Engine                   |   |
|  +------------------------------------------------------------+   |
|                              |                                     |
|  CORE LAYER (Index Algorithms)                                    |
|  +------------------+------------------+-------------------+       |
|  | Flat Index       | HNSW Index       | IVF Index         |       |
|  | (brute-force)    | (graph-based)    | (cluster-based)   |       |
|  +------------------+------------------+-------------------+       |
|                              |                                     |
|  FRAMEWORK LAYER (Pluggable Pipeline)                             |
|  +------------------------------------------------------------+   |
|  | IndexFactory | IndexConverter | IndexReformer | IndexMetric |   |
|  | IndexBuilder | IndexSearcher  | IndexStreamer | IndexDumper |   |
|  +------------------------------------------------------------+   |
|                              |                                     |
|  QUANTIZER LAYER (Data Transformation)                            |
|  +------------------------------------------------------------+   |
|  | CosineConverter | HalfFloatConverter | IntegerQuantizer     |   |
|  | BinaryQuantizer | RecordQuantizer    | StreamingConverter   |   |
|  +------------------------------------------------------------+   |
|                              |                                     |
|  AILEGO LAYER (Math & Primitives)                                 |
|  +------------------------------------------------------------+   |
|  | Distance Matrix (Cosine, Euclidean, IP, Hamming)            |   |
|  | Normalizer (L1, L2) | SIMD Kernels (SSE/AVX2/NEON)         |   |
|  | Batch Distance | Thread Pool | Memory-mapped I/O            |   |
|  +------------------------------------------------------------+   |
|                                                                    |
+------------------------------------------------------------------+
```

### Component Hierarchy

The codebase is organized into four major layers:

1. **ailego/** -- Low-level math, algorithms, containers, SIMD kernels
2. **core/** -- Index algorithms (Flat, HNSW, IVF), metrics, quantizers, framework
3. **db/** -- Database layer (collections, segments, WAL, SQL engine, storage)
4. **binding/** -- Language bindings (Python, C++, Node.js)

[SOURCE: Repository file tree, 846 files total]

---

## 4. Core Algorithms

### 4.1 Entropy-Based Integer Quantization (HIGH Relevance)

**What it does:** Converts FP32 embeddings to INT8/INT4/INT16 representations with minimal information loss by using KL divergence to find the optimal quantization threshold.

**How it works:**

1. **Feed Phase**: Collect histogram of vector value distribution
2. **Train Phase**: Use KL divergence to find optimal clipping threshold
3. **Encode Phase**: Apply linear quantization with learned scale/bias
4. **Decode Phase**: Reverse with `value * scale_reciprocal - bias`

The training algorithm is based on NVIDIA's TensorRT INT8 calibration:
- Builds a histogram of all float values across the vector corpus
- For each candidate threshold, quantizes the histogram into target bins
- Expands quantized distribution back and computes KL divergence against original
- Selects threshold with minimum divergence

**Key Code Pattern** (encode/decode cycle):

```cpp
// From src/ailego/algorithm/integer_quantizer.cc

// Encode: float -> int8
void EntropyInt8Quantizer::encode(const float *in, size_t dim,
                                  int8_t *out) const {
  for (size_t i = 0; i < dim; ++i) {
    out[i] = static_cast<int8_t>(
        std::round(QuantizeValue<MIN_VALUE, MAX_VALUE>(in[i], scale_, bias_)));
  }
}

// Decode: int8 -> float
void EntropyInt8Quantizer::decode(const int8_t *in, size_t dim,
                                  float *out) const {
  for (size_t i = 0; i < dim; ++i) {
    out[i] = in[i] * this->scale_reciprocal() - this->bias();
  }
}
```

[SOURCE: `src/ailego/algorithm/integer_quantizer.cc` and `src/ailego/algorithm/integer_quantizer.h`]

**Storage compression ratios:**

| Precision | Bytes/dim | Compression vs FP32 | Use Case            |
| --------- | --------- | -------------------- | ------------------- |
| FP32      | 4         | 1x (baseline)        | Full precision      |
| FP16      | 2         | 2x                   | Good accuracy       |
| INT8      | 1         | 4x                   | Balanced            |
| INT4      | 0.5       | 8x                   | Maximum compression |
| Binary    | 1/32      | 128x                 | Coarse filtering    |

### 4.2 Binary Quantization (MEDIUM Relevance)

Converts float vectors to single-bit representation. Each dimension becomes 0 or 1 based on a threshold (default 0.0). Distance is computed via Hamming distance (popcount).

```cpp
// From src/ailego/algorithm/binary_quantizer.cc
void BinaryQuantizer::encode(const float *in, size_t dim, uint32_t *out) const {
  for (size_t i = 0; i < dim; i += 32) {
    size_t remain = i + 32 <= dim ? 32 : dim - i;
    uint32_t data = 0;
    uint32_t mask = 1;
    for (size_t j = 0; j < remain; j++) {
      if (in[i + j] >= threshold_) {
        data |= mask;
      }
      mask <<= 1;
    }
    *out = data;
    out++;
  }
}
```

[SOURCE: `src/ailego/algorithm/binary_quantizer.cc`]

**Application:** A 768-dim vector (typical for our embeddings) compresses from 3,072 bytes (FP32) to 96 bytes (binary). Useful as a coarse pre-filter before exact similarity.

### 4.3 Per-Record Streaming Quantization (HIGH Relevance)

Unlike global quantization (which trains on the full corpus), streaming quantization computes per-vector scale/bias and stores them alongside the quantized data.

```cpp
// From src/core/quantizer/record_quantizer.h
static inline void quantize_record(const float *vec, size_t dim,
                                   IndexMeta::DataType type,
                                   bool is_euclidean, void *out) {
  // For INT8:
  float min = std::numeric_limits<float>::max();
  float max = std::numeric_limits<float>::lowest();
  for (size_t i = 0; i < dim; ++i) {
    min = std::min(min, vec[i]);
    max = std::max(max, vec[i]);
  }
  float scale = 254 / std::max(max - min, epsilon);
  float bias = -min * scale - 127;

  // Encode + store extras: [quantized_data | scale_recip | bias | sum | sum2]
  for (size_t i = 0; i < dim; ++i) {
    float v = vec[i] * scale + bias;
    out_int8[i] = static_cast<int8_t>(std::round(v));
  }
  extras[0] = 1.0f / scale;    // scale reciprocal for decode
  extras[1] = -bias / scale;    // bias for decode
  extras[2] = sum;              // precomputed sum for distance
  extras[3] = squared_sum;      // precomputed squared sum
}
```

[SOURCE: `src/core/quantizer/record_quantizer.h`]

**Key insight for our system:** Each INT8 vector stores 4 extra floats (16 bytes) alongside the quantized data: `scale_reciprocal`, `bias`, `sum`, and `squared_sum`. These precomputed values enable exact distance computation on quantized data without decoding back to FP32.

**Storage layout for INT8:**

```
[int8_data (dim bytes)] [scale_recip (4B)] [bias (4B)] [sum (4B)] [squared_sum (4B)]
Total = dim + 16 bytes per vector
```

For INT4:
```
[int4_data (dim/2 bytes)] [scale_recip (4B)] [bias (4B)] [sum (4B)] [squared_sum (4B)]
Total = dim/2 + 16 bytes per vector
```

### 4.4 Cosine Similarity via Normalized Inner Product (HIGH Relevance)

Zvec optimizes cosine similarity by pre-normalizing vectors during insertion and appending the original L2 norm as metadata. At search time, cosine distance becomes a simple inner product on normalized vectors.

```cpp
// From src/core/quantizer/cosine_converter.cc
// During insert, CosineConverterHolder::Iterator::convert_record():
float norm = 0.0f;
ailego::Normalizer<float>::L2(buf, original_dimension_, &norm);

// Append norm after the normalized vector data:
::memcpy(reinterpret_cast<float *>(&normalize_buffer_[0]) +
             original_dimension_,
         &norm, NORM_SIZE);
```

[SOURCE: `src/core/quantizer/cosine_converter.cc`]

**Extra dimensions per data type for cosine:**

| Data Type | Extra Elements | Extra Bytes | Purpose          |
| --------- | -------------- | ----------- | ---------------- |
| FP32      | 1              | 4           | L2 norm          |
| FP16      | 2              | 4           | L2 norm          |
| INT8      | 20             | 20          | Norm + quant params |
| INT4      | 40             | 20          | Norm + quant params |

### 4.5 HNSW Graph Index (MEDIUM Relevance)

The HNSW implementation follows the standard algorithm with Proxima-specific optimizations:

- **Level probability**: Uses the standard `exp(-level / level_mult) * (1 - exp(-1 / level_mult))` formula
- **Lock granularity**: Uses a pool of 256 mutexes for concurrent writes, mapped via `kLockMask` bitmask
- **Parameters**: Configurable efConstruction, scaling factor, neighbor count, bloom filter for visited nodes

```cpp
// From src/core/algorithm/hnsw/hnsw_algorithm.h
int init() {
  double level_mult = 1 / std::log(static_cast<double>(entity_.scaling_factor()));
  for (int level = 0;; level++) {
    double proba = std::exp(-level / level_mult) * (1 - std::exp(-1 / level_mult));
    if (proba < 1e-9) break;
    level_probas_.push_back(proba);
  }
  return 0;
}
```

[SOURCE: `src/core/algorithm/hnsw/hnsw_algorithm.h`]

**HNSW parameters** (from `src/core/algorithm/hnsw/hnsw_params.h`):
- `efconstruction`: Construction-time beam width
- `scaling_factor`: Controls graph connectivity (higher = more connections)
- `max_neighbor_count`: Maximum edges per node
- `l0_max_neighbor_count_multiplier`: Bottom layer gets more connections
- `visit_bloomfilter_enable`: Bloom filter to track visited nodes during search
- `brute_force_threshold`: Below this count, use flat scan instead of graph

---

## 5. Distance Computation Optimizations

### 5.1 Matrix Distance Dispatch Table (HIGH Relevance)

Zvec pre-compiles distance functions for all power-of-2 batch sizes (1, 2, 4, 8, 16, 32) and dispatches via a lookup table. This avoids branch overhead for common batch sizes.

```cpp
// From src/core/metric/cosine_metric.cc
static const IndexMetric::MatrixDistanceHandle distance_table[6][6] = {
    {CosineDistanceMatrix<float, 1, 1>::Compute, nullptr, ...},
    {CosineDistanceMatrix<float, 2, 1>::Compute, CosineDistanceMatrix<float, 2, 2>::Compute, ...},
    {CosineDistanceMatrix<float, 4, 1>::Compute, ...},
    // ... up to 32x32
};

// Dispatch: O(1) lookup via popcount + ctz
if (m > 32 || n > 32 || ailego_popcount(m) != 1 || ailego_popcount(n) != 1) {
  return nullptr;
}
return distance_table[ailego_ctz(m)][ailego_ctz(n)];
```

[SOURCE: `src/core/metric/cosine_metric.cc`]

### 5.2 SIMD Batch Inner Product (MEDIUM Relevance)

AVX2-optimized batch inner product computation processes 8 floats per cycle with software prefetching.

```cpp
// From src/ailego/math_batch/inner_product_distance_batch_impl.h
// AVX2 batch inner product: processes 8 floats at a time
for (; dim + 8 <= dimensionality; dim += 8) {
  __m256 q = _mm256_loadu_ps(query + dim);
  __m256 data_regs[dp_batch];
  for (size_t i = 0; i < dp_batch; ++i) {
    data_regs[i] = _mm256_loadu_ps(ptrs[i] + dim);
  }
  // Prefetch next batch from memory
  if (prefetch_ptrs[0]) {
    for (size_t i = 0; i < dp_batch; ++i) {
      ailego_prefetch(prefetch_ptrs[i] + dim);
    }
  }
  // FMA: accumulate -= query * data (using fnmadd for minus inner product)
  for (size_t i = 0; i < dp_batch; ++i) {
    accs[i] = _mm256_fnmadd_ps(q, data_regs[i], accs[i]);
  }
}
```

[SOURCE: `src/ailego/math_batch/inner_product_distance_batch_impl.h`]

### 5.3 Quantized Distance without Decode (HIGH Relevance)

The quantized integer metric computes exact distances directly on INT8/INT4 data by using the stored metadata (scale, bias, sum, squared_sum). No decode to FP32 needed.

For cosine similarity on quantized INT8 vectors, the distance is computed as:

```
cosine_distance = 1 - (ma * qa * IP(q_int8, m_int8) + mb * qa * sum_m + qb * ma * sum_q + dim * qb * mb)
```

Where:
- `ma`, `mb` = scale and bias of the stored vector
- `qa`, `qb` = scale and bias of the query vector
- `IP(q_int8, m_int8)` = integer inner product (computed via SIMD)
- `sum_m`, `sum_q` = precomputed element sums

This avoids the decode step entirely, keeping all computation in integer domain until the final float result.

[SOURCE: `src/core/metric/quantized_integer_metric_matrix.h`]

### 5.4 FP16 Conversion (MEDIUM Relevance)

Platform-aware FP16 conversion using native hardware when available:

- **ARM64**: Uses native `__fp16` type and direct cast
- **x86 with F16C+AVX**: Uses `_cvtss_sh` / `_cvtsh_ss` intrinsics
- **Fallback**: Software implementation using bit manipulation

[SOURCE: `src/ailego/utility/float_helper.cc`]

---

## 6. Data Structures

### 6.1 NumericalVectorArray (MEDIUM Relevance)

A tightly-packed, dimension-aware vector array stored as a contiguous `std::string` buffer. Provides O(1) indexed access via pointer arithmetic.

```cpp
// From src/ailego/container/vector_array.h
const ValueType *operator[](size_t i) const {
  return (reinterpret_cast<const ValueType *>(buffer_.data()) +
          i * dimension_);
}
```

[SOURCE: `src/ailego/container/vector_array.h`]

Three variants exist for different precision levels:
- `NumericalVectorArray<T>` -- For FP32, FP16, INT8 (byte-aligned)
- `NibbleVectorArray<T>` -- For INT4 (nibble-aligned, two values per byte)
- `BinaryVectorArray<T>` -- For binary (bit-packed, 32 bits per uint32_t)

### 6.2 Bloom Filter for Visited Nodes (LOW Relevance)

HNSW uses bloom filters to track visited nodes during search, avoiding redundant distance computations.

[SOURCE: `src/ailego/container/bloom_filter.h`, `src/core/algorithm/hnsw/hnsw_params.h`]

### 6.3 CRoaring Bitmap (LOW Relevance)

Used for concurrent deletion tracking in the database layer.

[SOURCE: `src/db/common/concurrent_roaring_bitmap.h`, `thirdparty/CRoaring/`]

---

## 7. Performance Patterns

### 7.1 Software Prefetching

Zvec aggressively uses `ailego_prefetch()` (maps to `__builtin_prefetch`) to pre-load the next batch of vectors into CPU cache while processing the current batch.

[SOURCE: `src/ailego/math_batch/inner_product_distance_batch_impl.h`]

### 7.2 Compile-Time Template Specialization

Distance functions are template-specialized for each (M, N) batch size combination at compile time, eliminating runtime branching.

[SOURCE: `src/core/metric/cosine_metric.cc`, `src/core/metric/quantized_integer_metric_matrix.h`]

### 7.3 Streaming Converter Pattern (Builder/Streamer duality)

Zvec distinguishes between:
- **Builder**: Bulk index construction (can scan entire dataset for training)
- **Streamer**: Incremental inserts (per-record quantization, no global training)

The streaming quantizer uses per-record min/max instead of global calibration, trading some accuracy for the ability to add vectors without re-training.

[SOURCE: `src/core/quantizer/integer_quantizer_converter.cc` -- `IntegerStreamingConverter` class]

### 7.4 Memory-Mapped Storage

Multiple storage backends:
- `mmap_file_storage` -- Memory-mapped file I/O for large indexes
- `memory_forward_store` -- In-memory for small/hot data
- `bufferpool_forward_store` -- LRU buffer pool for medium datasets

[SOURCE: `src/core/utility/mmap_file_storage.cc`, `src/db/index/storage/`]

---

## 8. Integration Assessment for spec-kit Memory MCP

### 8.1 Could zvec compression reduce our embedding storage size? -- YES (HIGH Confidence)

**Current state:** Our spec-kit memory stores 768-dim FP32 embeddings as JSON arrays in SQLite BLOBs. Each embedding = 768 * 4 = 3,072 bytes.

**Applicable patterns from zvec:**

| Technique                     | Storage/Vector | Savings | Accuracy Impact    | Implementation Complexity |
| ----------------------------- | -------------- | ------- | ------------------ | ------------------------- |
| FP16 (half-precision)         | 1,536 bytes    | 50%     | Negligible         | Low                       |
| INT8 (per-record quantize)    | 784 bytes      | 74%     | ~1-2% recall loss  | Medium                    |
| INT4 (per-record quantize)    | 400 bytes      | 87%     | ~3-5% recall loss  | Medium                    |
| Binary (1-bit)                | 96 bytes       | 97%     | Significant        | Low (pre-filter only)     |

**Recommended approach**: INT8 per-record quantization (the streaming variant from zvec). It requires no global training, works with incremental inserts, and preserves enough precision for semantic search.

### 8.2 Are there quantization approaches applicable to our cosine similarity search? -- YES (HIGH Confidence)

**Direct applicability:** The per-record streaming quantizer pattern from zvec maps almost exactly to our use case:

1. On `memory_save()`: Quantize embedding to INT8 with per-record scale/bias
2. Store: `[int8_data(768B)] [scale_recip(4B)] [bias(4B)] [sum(4B)] [norm(4B)]` = 784 bytes
3. On `memory_search()`: Quantize query, compute distance directly on INT8 data

The quantized distance formula avoids decode:
```
similarity = scale_a * scale_q * INT8_DOT(a, q) + bias_corrections
```

### 8.3 What encoding schemes could speed up our vector matching? -- MULTIPLE OPTIONS (HIGH Confidence)

**Option A: Pre-normalized Cosine (Recommended)**
- Pre-normalize all vectors on insert
- Store L2 norm as appended metadata
- Cosine similarity becomes inner product (one multiply less per dimension)
- Relevance: HIGH -- direct drop-in for our cosine_similarity function

**Option B: Binary Pre-filter + Exact Re-rank**
- Convert each embedding to 96-byte binary representation
- Use Hamming distance (popcount) for fast candidate retrieval
- Re-rank top-K candidates with exact cosine similarity
- Relevance: MEDIUM -- useful when memory count grows beyond ~10K

**Option C: Quantized Distance Computation**
- Compute distances directly on INT8 data with metadata corrections
- No need to decode to FP32 for comparison
- Relevance: HIGH -- significant speedup for scan-heavy workloads

### 8.4 Any batch processing patterns useful for our memory_index_scan? -- YES (MEDIUM Confidence)

**Applicable patterns:**

1. **Builder/Streamer duality**: Our `memory_index_scan` (batch) should use the global entropy-calibrated quantizer, while `memory_save` (single) should use per-record quantization.

2. **Prefetch pattern**: When scanning through memories for re-indexing, prefetch the next memory's embedding while processing the current one.

3. **Multi-threaded builder**: zvec's IVF builder uses configurable `thread_count` for parallel index construction.

---

## 9. Concrete Recommendations

### Option A: INT8 Per-Record Quantization with Pre-Normalized Cosine (Recommended)

| Aspect      | Details                                                   |
| ----------- | --------------------------------------------------------- |
| Pros        | 74% storage reduction, no global training needed, maintains ranking quality, incremental-friendly |
| Cons        | 16 bytes metadata overhead per vector, ~1-2% recall degradation |
| Confidence  | HIGH                                                      |
| Complexity  | Medium (TypeScript port of quantize_record pattern)       |

**Implementation sketch (TypeScript):**

```typescript
interface QuantizedEmbedding {
  data: Int8Array;        // 768 bytes (quantized vector)
  scaleRecip: number;     // 4 bytes (for decode)
  bias: number;           // 4 bytes (for decode)
  sum: number;            // 4 bytes (precomputed sum)
  norm: number;           // 4 bytes (L2 norm)
}

function quantizeRecord(vec: Float32Array): QuantizedEmbedding {
  // 1. Compute L2 norm and normalize
  let normSq = 0;
  for (let i = 0; i < vec.length; i++) normSq += vec[i] * vec[i];
  const norm = Math.sqrt(normSq);

  // 2. Find per-record min/max on normalized values
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < vec.length; i++) {
    const v = vec[i] / norm;
    if (v < min) min = v;
    if (v > max) max = v;
  }

  // 3. Compute scale/bias (maps [min, max] -> [-127, 127])
  const scale = 254 / Math.max(max - min, 1e-7);
  const bias = -min * scale - 127;

  // 4. Quantize
  const data = new Int8Array(vec.length);
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    const v = Math.round((vec[i] / norm) * scale + bias);
    data[i] = Math.max(-127, Math.min(127, v));
    sum += data[i];
  }

  return {
    data,
    scaleRecip: 1 / scale,
    bias: -bias / scale,
    sum,
    norm,
  };
}

function quantizedCosineSimilarity(a: QuantizedEmbedding, b: QuantizedEmbedding): number {
  // Integer dot product (no decode needed)
  let dot = 0;
  for (let i = 0; i < a.data.length; i++) {
    dot += a.data[i] * b.data[i];
  }

  // Reconstruct cosine similarity from quantized domain
  const ip = a.scaleRecip * b.scaleRecip * dot
           + a.bias * b.scaleRecip * b.sum
           + b.bias * a.scaleRecip * a.sum
           + a.data.length * a.bias * b.bias;

  return ip;  // Already on normalized vectors, so this is cosine similarity
}
```

### Option B: FP16 Compression Only (Simpler Alternative)

| Aspect      | Details                                                   |
| ----------- | --------------------------------------------------------- |
| Pros        | 50% storage reduction, negligible accuracy loss, trivial implementation |
| Cons        | Less compression than INT8, still needs FP32 decode for computation |
| Confidence  | HIGH                                                      |
| Complexity  | Low (use Float16Array or manual bit packing)              |

### Option C: Binary Pre-Filter + Exact Cosine Re-Rank

| Aspect      | Details                                                   |
| ----------- | --------------------------------------------------------- |
| Pros        | 97% storage for filter layer, sub-millisecond candidate selection |
| Cons        | Requires two-pass search, additional binary index to maintain |
| Confidence  | MEDIUM                                                    |
| Complexity  | Medium-High (binary index + Hamming distance + re-rank)   |

---

## 10. Specific Code Patterns Worth Adopting

### Pattern 1: Pre-Computed Metadata Alongside Quantized Data

zvec stores 4 extra floats (scale_recip, bias, sum, squared_sum) with each quantized vector. This enables exact distance computation without decoding.

**Relevance:** HIGH -- Our SQLite schema could store this as a BLOB column:
```sql
ALTER TABLE memories ADD COLUMN embedding_q BLOB; -- INT8 quantized + 16B metadata
```

[SOURCE: `src/core/quantizer/record_quantizer.h`, lines in `quantize_record()`]

### Pattern 2: Cosine via Pre-Normalized Inner Product

zvec's `CosineConverter` normalizes vectors on insert and stores the original norm. This converts cosine distance to a simple inner product, which is faster to compute.

**Relevance:** HIGH -- Our `cosine_similarity()` function currently normalizes on every call. Pre-normalizing at insert time eliminates this repeated work.

[SOURCE: `src/core/quantizer/cosine_converter.cc`, `CosineConverterHolder::Iterator::convert_record()`]

### Pattern 3: Streaming vs Batch Quantization

zvec has two quantization paths:
- `IntegerQuantizerConverter`: Trains on full dataset (KL divergence calibration)
- `IntegerStreamingConverter`: Per-record quantization (no training needed)

**Relevance:** HIGH -- Our `memory_save` (single inserts) should use streaming quantization. Our `memory_index_scan` (bulk re-index) could use the trained variant for better quality.

[SOURCE: `src/core/quantizer/integer_quantizer_converter.cc`, both `IntegerQuantizerConverter` and `IntegerStreamingConverter` classes]

---

## 11. Constraints & Limitations

### What does NOT transfer to our system:

1. **SIMD optimizations**: Our TypeScript/Node.js runtime cannot use SSE/AVX2/NEON intrinsics directly. The integer dot product will run in scalar JavaScript, losing the ~8x speedup from SIMD. However, WebAssembly SIMD or native add-ons could bridge this gap in the future.

2. **HNSW graph index**: Our current memory count (~hundreds to low thousands) does not justify an HNSW index. Brute-force scan is sufficient and simpler. zvec's own `brute_force_threshold` parameter confirms this -- below a certain count, flat scan outperforms graph search.

3. **IVF clustering**: Requires a training step on significant data volume. Not applicable for our small-scale memory system.

4. **Memory-mapped I/O**: SQLite already handles I/O optimization. Adding mmap on top would add complexity without benefit.

### Platform constraints:

- zvec itself only runs on Linux (x86_64, ARM64) and macOS (ARM64) -- no Windows support
- The Node.js binding (`@zvec/zvec`) exists but is young; using zvec directly as a vector store would lock us to these platforms
- Our system needs to work anywhere Node.js runs, so adopting algorithms (not the library) is the correct approach

---

## 12. Testing & Validation Patterns

zvec's test suite covers:
- Integer quantizer accuracy tests (`tests/ailego/algorithm/integer_quantizer_test.cc`)
- Distance matrix correctness across precisions (`tests/ailego/math/cosine_distance_matrix_*`)
- Metric correctness for quantized types (`tests/core/metric/quantized_integer_metric_test.cc`)
- Half-float converter round-trip accuracy (`tests/core/quantizer/half_float_reformer_test.cc`)

**Recommended validation approach for our implementation:**
1. Quantize test embeddings, decode, measure MSE (Mean Squared Error)
2. Compare ranking order of top-K results between FP32 and quantized search
3. Measure recall@10 degradation on our actual memory corpus
4. Benchmark search latency with and without quantization

---

## 13. Security Considerations

- No encryption at rest (vectors stored in plaintext)
- No access control at the vector level
- Apache 2.0 license is compatible with our use

---

## 14. Maintenance & Upgrade Paths

### Incremental adoption path:

1. **Phase 1**: Pre-normalize embeddings on insert, store norm (0 storage penalty, faster search)
2. **Phase 2**: Add INT8 quantized column alongside FP32 (dual storage temporarily)
3. **Phase 3**: Use quantized column for search, FP32 for re-ranking top results
4. **Phase 4**: Drop FP32 column once quantized search accuracy is validated

### Compatibility:

- Quantization is independent of the embedding model -- works with any dimension
- Migration: existing embeddings can be batch-quantized via `memory_index_scan`
- Rollback: keep FP32 column during validation, drop only after confirmation

---

## 15. Troubleshooting Guide

| Issue                              | Cause                                    | Solution                                           |
| ---------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| Quantized recall drops >5%         | Per-record min/max too tight             | Use wider scale (127 -> 120 range)                 |
| INT4 accuracy too low              | 4-bit precision insufficient             | Fall back to INT8                                  |
| Binary hamming misranks            | Binary quantization loses magnitude info | Only use for pre-filtering, always re-rank         |
| Negative similarity scores         | Bias correction arithmetic error         | Verify: `scale * bias + offset` formula carefully  |
| Large metadata overhead            | 16 bytes per vector                      | For dim >= 128, metadata is <2% overhead           |

---

## 16. Acknowledgements

- **Proxima**: Alibaba's internal vector search engine, basis for zvec
- **TensorRT INT8 Calibration**: NVIDIA's entropy-based quantization (referenced in `integer_quantizer.cc` comments)
- **VectorDBBench**: Benchmark framework used for zvec performance testing

---

## 17. Appendix & Changelog

### Key File Reference

| File Path                                                   | Purpose                                | Relevance |
| ----------------------------------------------------------- | -------------------------------------- | --------- |
| `src/ailego/algorithm/integer_quantizer.h`                  | Entropy INT quantizer interface        | HIGH      |
| `src/ailego/algorithm/integer_quantizer.cc`                 | KL divergence calibration impl         | HIGH      |
| `src/ailego/algorithm/binary_quantizer.cc`                  | Binary quantization impl               | MEDIUM    |
| `src/core/quantizer/record_quantizer.h`                     | Per-record streaming quantization      | HIGH      |
| `src/core/quantizer/cosine_converter.cc`                    | Pre-normalized cosine pipeline         | HIGH      |
| `src/core/quantizer/integer_quantizer_converter.cc`         | Batch + streaming quantizer converters | HIGH      |
| `src/core/metric/cosine_metric.cc`                          | Cosine distance dispatch table         | MEDIUM    |
| `src/core/metric/quantized_integer_metric.cc`               | Quantized metric selection             | HIGH      |
| `src/core/metric/quantized_integer_metric_matrix.h`         | INT8/INT4 distance formulas            | HIGH      |
| `src/ailego/math/cosine_distance_matrix.h`                  | Cosine = 1 - IP on normalized vecs     | HIGH      |
| `src/ailego/math/normalizer.h`                              | L1/L2 normalization (SIMD)             | MEDIUM    |
| `src/ailego/math_batch/inner_product_distance_batch_impl.h` | AVX2 batch inner product               | LOW*      |
| `src/ailego/utility/float_helper.cc`                        | FP16 <-> FP32 conversion               | MEDIUM    |
| `src/ailego/container/vector_array.h`                       | Packed vector arrays                   | LOW       |
| `src/core/algorithm/hnsw/hnsw_algorithm.h`                  | HNSW graph search                      | LOW*      |
| `src/core/algorithm/hnsw/hnsw_params.h`                     | HNSW tuning parameters                 | LOW*      |

*LOW for current scale; becomes relevant if memory count exceeds ~10K

### Glossary

| Term              | Definition                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------- |
| **ANN**           | Approximate Nearest Neighbor -- finding similar vectors without exhaustive scan            |
| **HNSW**          | Hierarchical Navigable Small World -- graph-based ANN index                               |
| **IVF**           | Inverted File Index -- cluster-based ANN using Voronoi partitioning                       |
| **KL Divergence** | Kullback-Leibler Divergence -- measures information loss between two distributions         |
| **Entropy calibration** | Finding optimal quantization threshold by minimizing KL divergence                  |
| **Per-record quantization** | Computing scale/bias independently for each vector (vs global)                  |
| **Pre-normalization** | Normalizing vectors at insert time so cosine similarity becomes inner product          |
| **MIPS**          | Maximum Inner Product Search -- finding vectors with highest dot product                  |
| **Hamming distance** | Number of differing bits between two binary vectors (computed via popcount)             |
| **efConstruction** | HNSW parameter controlling search beam width during graph construction                   |
