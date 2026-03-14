# INT8 quantization evaluation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Records the NO-GO decision on INT8 quantization after all three activation criteria (corpus size, p95 latency, embedding dimensions) were unmet.

## 2. CURRENT REALITY

Decision: **NO-GO**. All three activation criteria were unmet.

Active memories with embeddings: 2,412 measured versus the 10,000 threshold (24.1%). P95 search latency: approximately 15ms measured versus the 50ms threshold (approximately 30%). Embedding dimensions: 1,024 measured versus the 1,536 threshold (66.7%).

The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms or the embedding provider changes to dimensions above 1,536.

## 3. SOURCE FILES

No dedicated source files. This is a decision record.

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: INT8 quantization evaluation
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

This evaluated whether compressing stored data to save space was worth the trade-off in search accuracy. The answer was no: the storage saved was tiny and the risk of slightly worse results was not justified. Think of it like deciding whether to photocopy your photos at lower quality to save a filing cabinet drawer. When the drawer is mostly empty anyway, the savings are not worth the blur.
