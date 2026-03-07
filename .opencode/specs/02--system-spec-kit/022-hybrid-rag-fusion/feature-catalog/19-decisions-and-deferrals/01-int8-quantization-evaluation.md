# INT8 quantization evaluation

## Current Reality

Decision: **NO-GO**. All three activation criteria were unmet.

Active memories with embeddings: 2,412 measured versus the 10,000 threshold (24.1%). P95 search latency: approximately 15ms measured versus the 50ms threshold (approximately 30%). Embedding dimensions: 1,024 measured versus the 1,536 threshold (66.7%).

The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms, or the embedding provider changes to dimensions above 1,536.

## Source Files

No dedicated source files — this is a decision record.

## Source Metadata

- Group: Decisions and deferrals
- Source feature title: INT8 quantization evaluation
- Current reality source: feature_catalog.md
