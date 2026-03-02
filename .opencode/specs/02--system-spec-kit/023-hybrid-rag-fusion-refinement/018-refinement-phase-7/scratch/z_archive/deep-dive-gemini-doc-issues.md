---
title: "Deep Dive - Gemini: Documentation Issues Verification (All 12)"
source: "cli-gemini (gemini-3.1-pro-preview)"
date: 2026-03-02
---

# Deep Dive: All 12 Documentation Issues Verified with Line Numbers

## C-1: Stage 2 signal count — CONFIRMED (12 signals, not 9)
**File:** `mcp_server/lib/search/pipeline/stage2-fusion.ts` (lines 335-515)
The doc claims 9, actual code has **12 signals**: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals (momentum+depth), testing effect, intent weights, artifact routing, feedback signals, artifact limiting, anchor metadata, validation metadata.

## C-2: Legacy V1 — CONFIRMED REMOVED
**File:** `mcp_server/handlers/memory-search.ts`
`postSearchPipeline` is GONE. Only remaining V1 references are removal comments (lines 390-394, 538).

## C-3: SPECKIT_PIPELINE_V2 — CONFIRMED DEPRECATED
**File:** `mcp_server/lib/search/search-flags.ts` (lines 51-56)
`isPipelineV2Enabled()` hardcoded `return true`. Doc still says "when disabled, legacy path is used" — factually wrong.

## D-1: resolveEffectiveScore() — CONFIRMED MISSING FROM DOC
**File:** `mcp_server/lib/search/pipeline/types.ts` (lines 42-52)
Signature: `export function resolveEffectiveScore(row: PipelineRow): number`
Fallback: `intentAdjustedScore → rrfScore → score → similarity/100`, all clamped [0,1].
Completely absent from existing_features.md.

## C-4: memory_update embedding — CONFIRMED MISMATCH
**File:** `mcp_server/handlers/memory-crud-update.ts` (lines 90-91)
Code: `const embeddingInput = contentText ? \`${title}\n\n${contentText}\` : title;`
Doc says "title only" — wrong.

## C-5: memory_delete cleanup — CONFIRMED (8 tables)
**Files:** `memory-crud-delete.ts` + `vector-index-impl.ts`
Cleans: memory_history, vec_memories, degree_snapshots, community_assignments, memory_summaries, memory_entities, memory_index, causal_edges. Doc says "only causal edges" — wrong.

## D-4: Five-factor normalization — CONFIRMED EXISTS
**File:** `mcp_server/lib/scoring/composite-scoring.ts` (lines 538-548)
Auto-normalizes when `Math.abs(wSum - 1.0) > 0.001`. Not mentioned in doc.

## I-1: R8 summary channel in Stage 1 — CONFIRMED PRESENT BUT UNDOCUMENTED
**File:** `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (lines 507-565)
`querySummaryEmbeddings()` runs in Stage 1. Not in existing_features Stage 1 description.
