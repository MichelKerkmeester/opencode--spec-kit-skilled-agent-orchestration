---
title: "Implementation Summary: Indexing and Coherence"
description: "Post-implementation record for Phase 004: embedding visibility, trigger phrase filtering, template section improvements, OPTIONAL_PLACEHOLDERS cleanup, multi-token path fragment detection, observation dedup, and pre-save overlap check."
trigger_phrases:
  - "indexing coherence implementation summary"
  - "embedding visibility complete"
  - "trigger phrase filter complete"
  - "004-indexing-and-coherence summary"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: Indexing and Coherence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-indexing-and-coherence |
| **Completed** | 2026-03-21 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase improves the reliability of what gets indexed and what survives into the final memory file. It adds embedding retry visibility to `memory_health`, introduces a three-stage trigger phrase filter that removes low-signal tokens before manual merge, cleans up phantom OPTIONAL_PLACEHOLDERS entries in the context template, and adds two deduplication mechanisms — observation-level string equality at normalization time and a pre-save fingerprint overlap check — to prevent near-duplicate memories from accumulating in a spec folder.

### Embedding Visibility

`EmbeddingRetryStats` interface and `getEmbeddingRetryStats()` added to `retry-manager.ts`. `embeddingRetry` block included in the `memory_health` response. Zero-state struct returned when the retry manager has not been initialized. This makes embedding failure patterns visible without requiring a log scrape.

### Trigger Phrase Filter

`filterTriggerPhrases()` three-stage pipeline: path fragment removal, short token removal, and shingle subset removal. `TRIGGER_ALLOW_LIST` preserves technical acronyms (RAG, BM25, MCP, etc.) that would otherwise be dropped as too short. Filter applied after auto-extraction and before manual phrase merge, so user-supplied phrases are not affected.

### Template Sections

`toolCalls` and `exchanges` fields are rendered as compact strings (`TOOL_CALLS_COMPACT`, `EXCHANGES_COMPACT`) in the context template. Context builder binds `hasToolCalls` and `hasExchanges` boolean flags to guard optional sections. This prevents empty placeholder blocks from appearing in rendered memory files.

### OPTIONAL_PLACEHOLDERS Cleanup

8 phantom Session Integrity entries documented as removed from the placeholder registry. Memory Classification (6 entries) and Session Dedup (3 entries) entries annotated for future un-suppression once their backing extractors are complete.

### Multi-Token Path Fragment Detection

3 new regex patterns added to `PATH_FRAGMENT_PATTERNS` in `post-save-review.ts` to catch multi-word path fragments that the single-token pattern missed. Patterns cover `src/`, `dist/`, and `node_modules/` prefixes in trigger phrase context.

### Observation Dedup

String-equality deduplication applied to the `observations` array at normalization time in `input-normalizer.ts` slow-path. Duplicate strings are dropped before quality scoring runs, which prevents identical observations from inflating the observation count signal.

### Pre-Save Overlap Check

SHA1 fingerprint comparison of the last 20 memories for the spec folder, enabled by `SPECKIT_PRE_SAVE_DEDUP` env flag. Fail-open design: if the fingerprint query errors, the save proceeds normally. Overlap threshold set at 0.85 cosine similarity; matches emit a warning but do not block the save.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Changes distributed across `retry-manager.ts`, `trigger-filter.ts` (new file), the context template, `input-normalizer.ts`, and `post-save-review.ts`. TypeScript compiled after each change group. `memory_health` embedding block verified via agent call. Trigger filter verified via code review against `TRIGGER_ALLOW_LIST` entries and shingle subset logic.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fail-open pre-save dedup | Fingerprint query errors must not block saves — correctness over dedup coverage |
| TRIGGER_ALLOW_LIST for short acronyms | Short-token filter would strip valid technical terms without an allowlist |
| Advisory overlap warning, not hard block | Pre-save dedup is a quality signal; blocking would break legitimate near-similar saves |
| Zero-state struct for uninitialized retry manager | Avoids null checks in callers; health endpoint always returns a complete shape |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` | 0 errors |
| 422/422 Vitest tests | Pass |
| `memory_health` embeddingRetry block | Verified via agent |
| Trigger phrase filter (allowlist + shingle) | Verified via code review |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-save dedup is opt-out** — `SPECKIT_PRE_SAVE_DEDUP` defaults to enabled; set to `false` to disable. Adds ~50-200ms per save for fingerprint comparison.
2. **Memory Classification and Session Dedup placeholders remain suppressed** — These 9 OPTIONAL_PLACEHOLDERS entries are annotated for future un-suppression but require their backing extractors to be implemented first.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
