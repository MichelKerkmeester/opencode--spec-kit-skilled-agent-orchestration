# C2: Vector Search Performance

**Agent:** general-purpose | **Duration:** ~261s | **Tokens:** 75,875

## Key Findings

- At our scale (100-5,000 rows, 384-dim), brute-force is <10ms — **performance is a non-issue**
- sqlite-vec at 100K/384-dim: <75ms; Turso at 40K/384-dim: ~240ms (sqlite-vec faster for raw brute-force)
- **libSQL Server already has DiskANN** — indexed ANN search available NOW
- Turso CLI (Rust rewrite) does NOT have vector indexes — on roadmap at 20.9% of 1.0 milestone
- sqlite-vec's ANN (IVF+DiskANN) also still planned, not shipped
- Pre-filtering by spec_folder can reduce scan space by 80%+ (trivial optimization)
- Quantization (vector8 vs vector32) gives 4x storage reduction and faster distance computation
- Practical threshold for 100ms: sqlite-vec ~100K rows, Turso ~10K-15K rows
