---
title: "Implementation Summary: Search and Routing Tuning"
description: "Coordination parent for three shipped sub-tracks: search-fusion tuning, content-routing accuracy, and graph-metadata validation."
trigger_phrases:
  - "search and routing tuning"
  - "search fusion reranker tuning"
  - "content routing accuracy"
  - "graph metadata validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning"
    last_updated_at: "2026-04-24T12:00:00Z"
    last_updated_by: "flatten-restructure"
    recent_action: "001/002/003 sub-phase folders deleted; detail merged into parent"
    next_safe_action: "No action needed"
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Search and Routing Tuning

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning` |
| **Completed** | `2026-04-21` |
| **Level** | `2` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Three parallel sub-tracks shipped addressing all aspects of search-pipeline and routing accuracy. The 19 leaf sub-phases across all tracks are complete. See Sub-phase summaries below for per-track detail.

## Sub-phase summaries

### 001-search-fusion-tuning

**Status:** complete. Six sub-phases shipped (`001–006`). **Completed:** `2026-04-13`.

Tuned the search-fusion pipeline end-to-end: neutralized the cross-encoder length penalty (returns `1.0`), added process-wide cache telemetry to `getRerankerStatus()`, introduced the internal `continuity` adaptive-fusion weight profile (`semantic 0.52 / keyword 0.18 / recency 0.07 / graph 0.23`), raised `MIN_RESULTS_FOR_RERANK` from 2 to 4, aligned all doc surfaces with the shipped 017 runtime, and added a judged 12-query continuity fixture that confirmed the baseline K=60 recommendation.

**Key files:** `cross-encoder.ts`, `adaptive-fusion.ts`, `stage3-rerank.ts`, `content-router.ts`

#### Sub-phase detail

**001-remove-length-penalty** — complete. Commit: `2958485d9f`. Removed the live scoring effect of the cross-encoder length penalty. `calculateLengthPenalty()` now returns `1.0`; `applyLengthPenalty()` is a compatibility-preserving no-op. Post-review remediation removed the retired `lp` cache-key discriminator so compatibility-mode callers reuse the same reranker cache entry. Tests: 4 files, 126 tests, PASS.

**002-add-reranker-telemetry** — complete. Commit: `2958485d9f`. Added process-wide cache telemetry (`hits`, `misses`, `staleHits`, `evictions`) to the shared reranker module. `getRerankerStatus()` now exposes a `cache` block with `entries`, `maxEntries`, and `ttlMs`. Tests: 2 files, 59 tests, PASS.

**003-continuity-search-profile** — complete. Commit: `2958485d9f`. Added an internal `continuity` weight profile to adaptive fusion. The internal search path threads a separate `adaptiveFusionIntent` value so callers can request `'continuity'` for fusion without changing the externally reported `detectedIntent`. Post-review remediation added a dedicated continuity MMR lambda. Tests: 3 files, 58 tests, PASS.

**004-raise-rerank-minimum** — complete. Commit: `2958485d9f`. Raised `MIN_RESULTS_FOR_RERANK` from `2` to `4`. Regression suite uses 4-row fixtures with explicit boundary assertions: 3-row candidate sets skip reranking; 4-row sets apply it. Tests: 2 files, 22 tests, PASS.

**005-doc-surface-alignment** — complete. Commit: `254461c386`. Aligned doc surfaces with the shipped 017 runtime: `README`, `ARCHITECTURE`, `command/memory/search`, `SKILL`, `mcp_server/configs/README`, feature catalog entries, and manual testing playbook scenarios.

**006-continuity-profile-validation** — complete. Enriched the Tier 3 continuity prompt (`buildTier3Prompt()` now includes the 3-level resume ladder and the 8 canonical routing categories). Added a judged 12-query continuity fixture to `k-value-optimization.vitest.ts`. Baseline K=60 confirmed. Tests: PASS.

**Key decision — design note:** `/spec_kit:resume` intentionally bypasses `handleMemorySearch()` and uses the canonical file ladder (`handover.md → _memory.continuity → spec docs`). The continuity fixture is intentionally synthetic and phase-local.

#### Key Decisions

| Decision | Why |
|----------|-----|
| Keep `applyLengthPenalty` in the API surface | Compatibility contract; downstream callers can still pass the param but scoring is now neutral |
| Raise rerank minimum to 4 | Reranking 2–3 docs spends API work for very little ordering gain |
| Keep continuity profile internal only | Public intent expansion is a separate follow-on |
| Fix `lp` cache-key discriminator post-review | Compatibility callers were splitting cache hit-rate across duplicate buckets |

#### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS (all sub-phases) |
| `npx vitest run` (all sub-phase test files) | PASS |
| `bash validate.sh --strict` | PASS |

#### Known Limitations

1. The continuity fixture is synthetic; future retuning should use real-query evidence.
2. `applyLengthPenalty` remains a compatibility term; future schema changes may allow clean removal.

---

### 002-content-routing-accuracy

**Status:** complete. Six sub-phases shipped (`001–006`). **Completed:** `2026-04-21`.

Improved the 3-tier content router classification accuracy in `mcp_server/lib/routing/content-router.ts` and related modules: fixed delivery/progress asymmetry in Tier 1, split hard drop detection from soft operational cues so genuine handover notes survive, wired the Tier 3 LLM classifier as a real save-path dependency, aligned all doc surfaces with the always-on Tier 3 contract, added document-wide prevalidation for task-update merge safety, and enriched the Tier 3 system prompt with the explicit continuity resume model.

**Key files:** `content-router.ts`, `routing-prototypes.json`, `memory-save.ts`, `anchor-merge-operation.ts`

#### Sub-phase detail

**001-fix-delivery-progress-confusion** — complete. Corrected the delivery-versus-progress asymmetry inside the Tier 1 router. Delivery now scores against sequencing, gating, rollout, and verification mechanics. Added `strongDeliveryMechanics` guard and delivery-biased floor. Refreshed overlapping delivery/progress prototype wording in `routing-prototypes.json`.

**002-fix-handover-drop-confusion** — complete. Split hard drop detection from soft operational command language so genuine handover notes no longer get refused for mentioning `git diff`, `list memories`, or `force re-index`. The router preserves `handover_state` when stop-state language is strong and keeps the old `0.92` drop behavior only for real transcript and boilerplate wrappers. Refreshed command-heavy handover prototypes.

**003-wire-tier3-llm-classifier** — complete. Turned the Tier 3 contract from a dormant interface into a real save-path dependency. `memory-save.ts` now reuses the frozen prompt contract from `content-router.ts`, calls an OpenAI-compatible endpoint when `SPECKIT_TIER3_ROUTING=true`, and injects both the classifier and a concrete in-memory router cache into `createContentRouter()`.

**004-doc-surface-alignment** — complete. Pulled the save-path docs back onto the shipped routing contract. Command docs, architecture/reference docs, playbook scenarios, feature catalog, and config mirrors now all describe the same 8-category canonical router, the always-on Tier 3 save path, and the corrected delivery-versus-handover boundaries. Updated `command/memory/save`, `command/memory/manage`, `ARCHITECTURE`, `SKILL`, feature catalog entries, and manual testing playbook scenario 202.

**005-task-update-merge-safety** — complete. Added a document-wide prevalidation step for task updates before `update-in-place` can mutate a task or checklist document. The merge path counts checklist lines matching the requested task identifier across the whole target document and refuses the write unless exactly one match exists. Zero-match and multi-match merge refusal explicitly covered in tests.

**006-tier3-prompt-enrichment** — complete. Updated the Tier 3 system prompt so the classifier sees the requested continuity model directly. The prompt now includes the explicit 3-level resume ladder, the `metadata_only` rule targeting `implementation-summary.md`, and the unchanged 8-category taxonomy. Prompt-shape assertions added to `content-router.vitest.ts`.

#### Key Decisions

| Decision | Why |
|----------|-----|
| Fix router logic over threshold tuning (001) | Root cause was asymmetric scoring signals, not threshold misconfiguration |
| Split hard drop from soft cues (002) | Operational command language is common in real handover notes and must not trigger drop |
| Wire Tier 3 as always-on (003) | Removes conditional dead code and ensures all saves get LLM classification |
| Scope merge prevalidation to whole document (005) | Multi-match ambiguity is document-wide, not section-local |

#### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS (all sub-phases) |
| `npx vitest run` (all sub-phase test files) | PASS |
| `bash validate.sh --strict` | PASS |

#### Known Limitations

1. Tier 3 classifier still requires `SPECKIT_TIER3_ROUTING=true` env flag for production activation.
2. Merge safety prevalidation covers checklist/task lines only; prose paragraph edits are not gated.

---

### 003-graph-metadata-validation

**Status:** complete. Seven sub-phases shipped (`001–007`). **Completed:** `2026-04-21`.

Improved the graph-metadata parser quality across five review findings: added checklist-aware status derivation, sanitized `key_files` against noise classes, deduplicated entities using canonical-path preference, scoped backfill traversal to active packets by default, aligned doc surfaces, added real path resolution with cross-track fallback and obsolete-path rejection, and raised the entity cap from 16 to 24 while tightening canonical-scope checks. Post-backfill corpus scan: `command-shaped key_files = 0`, `status outliers = 0`, `duplicateEntityNameGroups = 0`, `legacyGraphMetadataFiles = 0`.

**Key file:** `mcp_server/lib/graph/graph-metadata-parser.ts`

#### Sub-phase detail

**001-fix-status-derivation** — complete. Replaced the old frontmatter-only fallback with safer status derivation. Packets with `implementation-summary.md` can move to `complete` when their checklist is complete or absent. Checklist-backed work with unchecked items stays `in_progress`. Added `checklist-aware deriveStatus()` fallback and checklist completion helper.

**002-sanitize-key-files** — complete. Added a real guardrail in front of `derived.key_files`. The parser now rejects command-like strings, version tokens, MIME-style values, pseudo-fields, relative noise, title-like entries, and bare non-canonical filenames before they compete for the cap. Noise regexes frozen in regression coverage.

**003-deduplicate-entities** — complete. Taught `deriveEntities()` to treat entity names as the dedupe key. When the parser sees both a basename and a path-like canonical reference for the same document, it keeps the path-like canonical version and drops the duplicate slot. Added shared entity upsert logic, canonical collision preference, and a trigger-phrase cap.

**004-normalize-legacy-files** — complete. Commit: `2958485d9f`. Post-review remediation. Tightened the graph-metadata backfill traversal so active packets are the default corpus. `scripts/graph/backfill-graph-metadata.ts` now skips `z_archive` and `z_future` folders unless the operator opts in with `--include-archive`.

**005-doc-surface-alignment** — complete. Brought doc surfaces back into sync with the shipped graph metadata parser. Updated guidance consistently states that derived `status` is lowercase and checklist-aware, `key_files` are sanitized before storage, `entities` are deduplicated with canonical-path preference, `trigger_phrases` stop at 12 items, and graph-metadata backfill is inclusive by default. Updated `command/memory/save` and `command/memory/manage`.

**006-key-file-resolution** — complete. Replaced "keep whatever looks file-shaped" behavior with real path resolution. `deriveKeyFiles()` now resolves candidates against the current spec folder, the repo root, the system-spec-kit workspace roots, and the paired `system-spec-kit/` ↔ `skilled-agent-orchestration/` spec tracks before the final 20-slot cap. Anything not resolving to a file is dropped. Cross-track hit coverage and missing-file pruning added to tests.

**007-entity-quality-improvements** — complete. Entity cap raised from `16` to `24`. Bare runtime names rejected up front. Canonical-doc scope checks now only treat paths inside the current spec folder as canonical local docs; external canonical packet docs are skipped to prevent cross-spec entity leaks.

#### Key Decisions

| Decision | Why |
|----------|-----|
| Use checklist presence as status fallback | Prevents premature `complete` status on packets that have open checklist items |
| Inclusive backfill by default | Active packets are the dominant corpus; `--active-only` is opt-in to avoid silent exclusions |
| Raise entity cap to 24 | 16 was consistently hitting cap in real packet runs |
| Scope canonical entity check to current folder | Cross-spec canonical doc leaks polluted entity sets with unrelated packet references |

#### Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-schema.vitest.ts` | PASS (`14/14`) |
| `cd .opencode/skill/system-spec-kit && NODE_PATH=./mcp_server/node_modules ./mcp_server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts` | PASS (`3/3`) |
| `cd .opencode/skill/system-spec-kit && node scripts/dist/graph/backfill-graph-metadata.js` | PASS (`541` refreshed packets) |
| Post-backfill corpus scan | PASS: all zero outliers inside original research corpus |

#### Notes

- Full-corpus backfill initially failed on two unrelated schema-invalid manual relationship arrays under `011-skill-advisor-graph`; both generated artifacts were normalized to packet-reference objects.
- Phase `004` is retired — the original research corpus had no legacy plaintext graph-metadata files, though promoted root packets may carry pre-migration metadata.

#### Known Limitations

1. Promoted root packets may still retain pre-migration metadata carried forward during promotion.
2. Phase 004 was retired — legacy plaintext `graph-metadata` files did not appear in the original research corpus.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each sub-track was dispatched sequentially via Codex. Sub-tracks were processed in order: search-fusion tuning (001–006), content-routing accuracy (001–006), graph-metadata validation (001–007). Iteration evidence for all sub-tracks is preserved in the `review/` and `research/` directories at this packet level.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flatten three sub-phase folders into parent | Eliminate extra nesting level; all content is captured in sub-phase summaries above |
| Preserve iteration evidence in parent review/research | Deep-review and deep-research output is audit evidence; not deleted |
| Keep `applyLengthPenalty` in API surface (001) | Compatibility contract; scoring is now neutral |
| Fix router logic over threshold tuning (002) | Root cause was asymmetric scoring signals |
| Use checklist presence as status fallback (003) | Prevents premature complete status on open checklist items |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Sub-phase folder depth check (`find -mindepth 2 -maxdepth 2 -type d -not -path '*/review*' ...`) | PASS: zero results |
| `bash validate.sh --strict` (post-flatten) | Exit 2 — pre-existing errors only (coordination parent missing plan/tasks/checklist files) |
| All 001/002/003 sub-phase implementation tests | PASS (per-sub-phase verification tables above) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This coordination parent has no plan, tasks, or checklist files — pre-existing gap for a coordination-parent role. Validator flags these but they are structural, not implementation blockers.
2. Continuity fixture for search-fusion tuning is synthetic; future retuning should use real-query evidence.
3. Promoted root packets may retain pre-migration graph-metadata carried forward during promotion.
<!-- /ANCHOR:limitations -->
