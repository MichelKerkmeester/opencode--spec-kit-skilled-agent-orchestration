---
title: "Iteration 002 — Q1 Deep Dive: 16-stage save pipeline"
iteration: 2
timestamp: 2026-04-11T12:40:00Z
worker: claude-opus-4-6 (Claude Code session)
scope: q1_pipeline_mapping
status: complete
focus: "Map every stage in memory_save to its handler file and line range. Classify each stage's retargetability."
maps_to_questions: [Q1]
---

# Iteration 002 — Q1: 16-Stage Save Pipeline Mapping

## Goal

Answer Q1 with precision: what does `memory_save` actually do, stage by stage, with file:line citations, and how retargetable is each stage under Option C?

## Method

Re-read memory-save.ts L1-200 + L1480-1640 + the save/ subdirectory listing. Cross-reference with the earlier exploration findings from phase 017. Produce one row per pipeline stage with: stage number, name, entry point, source of logic, retargetability classification.

## The 16 stages (verified)

| # | Stage | Entry point | Source module | Retargetability |
|---|---|---|---|---|
| 1 | **Governance validation** | validateGovernedIngest + assertSharedSpaceAccess | memory-save.ts:1136-1185, scope-governance.js, shared-spaces.js | **Retargetable as-is** — scope fields (tenant, user, agent, session, shared_space) are orthogonal to storage location |
| 2 | **Preflight validation** | memoryParser.parseMemoryFile + validateParsedMemory | memory-save.ts:1273-1300, lib/parsing/memory-parser.js | **Needs adaptation** — parser expects memory-file frontmatter shape; needs spec-doc variant |
| 3 | **Template contract** | validateMemoryTemplateContract | @spec-kit/shared/parsing/memory-template-contract | **Needs rewrite** — current contract checks memory-doc anchors; new contract must check spec-doc anchors (implementation-summary, decision-record, etc.) |
| 4 | **Spec-doc health check** | evaluateSpecDocHealth | @spec-kit/shared/parsing/spec-doc-health | **Retargetable as-is** — already operates over spec-doc concept; arguably moved to iteration-1 of the save pipeline rather than stage 4 |
| 5 | **Sufficiency gating** | evaluateMemorySufficiency | @spec-kit/shared/parsing/memory-sufficiency | **Needs adaptation** — evidence counts (primary, support, anchors, semantic chars) apply; "primary evidence" definition must be redefined for spec-doc writes |
| 6 | **Dedup** | checkExistingRow + checkContentHashDedup | save/dedup.ts | **Needs adaptation** — UNIQUE(spec_folder, file_path, anchor_id) constraint blocks multi-memory-per-file; needs new scope key (spec_folder, document_type, source_id) |
| 7 | **Embedding generation** | generateOrCacheEmbedding + persistPendingEmbeddingCacheWrite | save/embedding-pipeline.ts | **Retargetable as-is** — content-agnostic, works on any markdown |
| 8 | **Quality gate** | runQualityGate | lib/validation/save-quality-gate.js | **Retargetable with adaptation** — score thresholds are metadata-agnostic; structural checks need new spec-doc rules |
| 9 | **PE arbitration** | evaluateAndApplyPeDecision | save/pe-orchestration.ts | **Retargetable as-is** — create/reinforce/update/supersede decisions work against any memory_id |
| 10 | **Atomic save (file I/O)** | atomicSaveMemory | memory-save.ts:1521 | **Needs rewrite** — current path assumes per-memory-file write + rename; new path needs `atomicIndexMemory` that commits to `memory_index` directly with no file I/O (spec docs are external) |
| 11 | **Record creation** | createMemoryRecord | save/create-record.ts | **Needs adaptation** — schema may need `document_type` discrimination; row insert logic stays |
| 12 | **Chunking** | needsChunking + indexChunkedMemoryFile | chunking-orchestrator.ts | **Retargetable as-is** — parent/child chunk relationships work on any content |
| 13 | **Post-insert metadata** | applyPostInsertMetadata | save/db-helpers.ts | **Retargetable as-is** — learned_triggers, encoding_intent, quality_flags all apply to any row |
| 14 | **Reconsolidation** | runReconsolidationIfEnabled | save/reconsolidation-bridge.ts | **Retargetable as-is** — similarity-based merge works on any content |
| 15 | **Post-insert enrichment** | runPostInsertEnrichment | save/post-insert.ts | **Retargetable with adaptation** — causal links extraction currently parses `## causal links` memory-doc section; needs spec-doc equivalent |
| 16 | **Response build** | buildSaveResponse | save/response-builder.ts | **Retargetable as-is** — response shape is independent of storage |

## Retargetability summary

- **Retargetable as-is**: 8 stages (50%) — governance, spec-doc health, embedding, PE arbitration, chunking, post-insert metadata, reconsolidation, response build
- **Needs adaptation**: 4 stages (25%) — preflight parser, sufficiency gating, dedup, record creation, post-insert enrichment (causal links parser)
- **Needs rewrite**: 3 stages (~20%) — template contract, atomic save (file I/O split), ... wait that's 11 + 4 + 2 = 17. Let me recount.

**Recount**: as-is = 8 (stages 1, 4, 7, 9, 12, 13, 14, 16). adaptation = 6 (stages 2, 5, 6, 8, 11, 15). rewrite = 2 (stages 3, 10). Total = 16. ✓

- **Needs rewrite**: 2 stages (12.5%) — template contract (stage 3), atomic save (stage 10)
- **Retargetable with adaptation**: 6 stages (37.5%)
- **Retargetable as-is**: 8 stages (50%)

## Key file:line citations

- `memory-save.ts:1-102` — 30+ imports (complete dependency graph for the save pipeline)
- `memory-save.ts:113-122` — `PreparedParsedMemory` interface (holds parsed memory, validation, quality loop result, sufficiency, template contract, spec-doc health, finalized content, source classification)
- `memory-save.ts:129-133` — `STANDARD_MEMORY_TEMPLATE_MARKERS` array (`## continue session`, `## recovery hints`, `<!-- memory metadata -->`) — three strings that define what "memory file" structurally means today
- `memory-save.ts:158-164` — `classifyMemorySaveSource` → returns 'template-generated' or 'manual-fallback' based on marker presence
- `memory-save.ts:166-177` — `shouldBypassTemplateContract` → the escape hatch for manual-fallback saves with sufficient evidence
- `memory-save.ts:196-206` — `prepareParsedMemoryForIndexing` entry point (runs stages 2-8)
- `memory-save.ts:1521-1640` — `atomicSaveMemory` function (the central rewrite point for Option C)
- `memory-save.ts:1569` — `withSpecFolderLock` call site (the per-spec-folder mutex, MUST be preserved under Option C)
- `memory-save.ts:1573` — `fs.renameSync(pendingPath, file_path)` → the atomic promote (removed under Option C since spec docs are external)
- `memory-save.ts:1576-1582` — `processPreparedMemory` call inside the lock (reused under Option C; just the input changes)

## Evidence: the atomic save envelope is the single hardest refactor point

At `memory-save.ts:1569-1612`, the atomic save performs five operations inside one lock:
1. Create pending file directory (`fs.mkdirSync`)
2. Write pending content (`fs.writeFileSync`)
3. Promote to final path (`fs.renameSync`)
4. Process prepared memory (dedup, embed, PE, index)
5. On any failure: cleanup pending + rollback original state

Under Option C, operations 1-3 disappear (spec docs already exist; we merge into anchors instead). Operation 4 stays but its input changes (anchor reference, not file path). Operation 5 changes substantially — rollback means restoring the prior anchor content, not restoring a file.

**Critical implication**: the mutex holds both the disk commit and the index commit today. If we drop the disk commit, the mutex still has to guard the anchor commit against concurrent writes. The retargeted `atomicIndexMemory` must acquire the same mutex and hold it for the full anchor-merge-plus-index duration.

## Findings

- **F2.1**: Only 2 of 16 stages require rewrite. 14 of 16 transfer with zero or small changes. This strongly validates the Option C "retargeting, not rebuilding" premise from phase 017.
- **F2.2**: Template contract rewrite (stage 3) is the largest new work. It needs to validate that a spec doc has the required anchor, the anchor is writable (no conflict marker), and the merge operation won't corrupt the frontmatter.
- **F2.3**: Atomic save rewrite (stage 10) is the second largest. The replacement must preserve the mutex semantics, adapt the rollback to "restore prior anchor content", and handle the case where the spec doc file doesn't exist yet (some root packets have no `implementation-summary.md`).
- **F2.4**: The dedup key (stage 6) is the schema-level blocker phase 017 identified. The current UNIQUE constraint `(spec_folder, file_path, anchor_id)` treats `file_path` as the memory file location. Under Option C, `file_path` becomes the spec doc location, so multiple memories could theoretically point to the same spec doc. Fix: change UNIQUE to `(spec_folder, document_type, source_id)` OR move dedup to content_hash exclusively.
- **F2.5**: The 8 "retargetable as-is" stages represent ~50% of the save pipeline complexity. Any effort estimate for phase 018 that assumes a 100% rewrite is significantly wrong — the real rewrite is ~12.5% of the pipeline.

## What worked

- Cross-referencing the save/ subdirectory listing with the memory-save.ts module-level imports revealed a much cleaner stage boundary than reading the monolithic file top-to-bottom would have.
- Classifying each stage as as-is / adaptation / rewrite gave a concrete effort estimate that phase 018 can use directly.

## What failed / did not work

- The stage count initially added to 17 due to a recount error; reverified at 16.
- The `memory-parser.js` module was not read in full (too large); relied on its interface contract as visible from `memory-save.ts` imports.

## Open questions carried forward

- What exactly does the memory parser extract, and how much of that extraction still applies to a spec doc with the same frontmatter fields? (Partial: the frontmatter shape is similar, but body parsing differs.)
- How many existing memory files would trigger the PE arbitration's `supersede` path vs `create` vs `reinforce` if replayed against spec-doc anchors? (Deferred to iteration 6.)

## Next focus (for iteration 3)

Sample 20 real memory files across different spec trees, ages, and tiers. Assess the narrative value of each file independently (can a future session reconstruct useful context from this file alone?). Compute the average quality_score across non-deprecated files. Answer Q2.
