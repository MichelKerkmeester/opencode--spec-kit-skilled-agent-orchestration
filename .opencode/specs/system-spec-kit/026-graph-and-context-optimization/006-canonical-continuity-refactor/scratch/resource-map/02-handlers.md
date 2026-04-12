---
title: "Phase 018 Resource Map — MCP Handlers & Save Pipeline"
surface: handlers
agent: resmap-B
worker: cli-codex gpt-5.4 high fast
timestamp: 2026-04-11T14:07:25Z
scan_roots:
  - .opencode/skill/system-spec-kit/mcp_server/handlers/
  - .opencode/skill/system-spec-kit/mcp_server/lib/
  - .opencode/skill/system-spec-kit/mcp_server/tools/
  - .opencode/skill/system-spec-kit/mcp_server/schemas/
rows: 31
---

# Scope Notes

- This map stays inside the requested handler/save/search/cognitive/validation/storage/tool/schema surfaces.
- Phase-018 verbs are derived from current code plus the packet design notes in `iteration-001`, `iteration-002`, `iteration-023`, `iteration-031`, and `iteration-039`.
- The 16-stage matrix follows the verified phase-017 stage model because `handlers/save/` contains fewer files than conceptual stages.

| # | path | kind | purpose | phase_018_action | verb | effort | depends_on |
|---:|---|---|---|---|---|---|---|
| 1 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | handler | Monolithic save entrypoint that runs governance, parse/quality gating, dedup, PE, enrichment, and atomic file save/index orchestration. | Split memory-file assumptions from continuity routing, replace file-targeted `atomicSaveMemory` with anchor/doc-targeted `atomicIndexMemory`, and preserve spec-folder mutex semantics. | rewrite | XL | `save/*.ts`, `memory-parser`, `scope-governance`, `save-quality-gate`, `withSpecFolderLock` |
| 2 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` | pipeline-stage | Creates/updates `memory_index` rows, computes lineage routing, persists BM25/vector metadata, and applies post-insert fields. | Retain row creation but adapt identity from memory-file path to routed spec-doc anchor or continuity-record source key. | add-field | M | `vector-index`, `bm25-index`, `fsrs-scheduler`, `post-insert-metadata`, `lineage-state` |
| 3 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts` | pipeline-stage | Same-path and content-hash duplicate detection keyed around `file_path` / `canonical_file_path` plus scope columns. | Re-key duplicate detection away from one-memory-file-per-path assumptions toward doc-anchor or continuity-record identity. | update-logic | M | `memory_index`, `content_hash`, `canonical_file_path`, scope columns |
| 4 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` | pipeline-stage | Generates weighted embeddings, caches them, and supports deferred lexical-only indexing. | Reuse as-is for routed canonical content; only the caller-supplied content unit changes. | no-change | XS | `embeddings`, `embedding-cache`, parsed content weighting |
| 5 | `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | validation-lib | Three-layer structural/content/dedup gate with warn-only rollout persistence in SQLite config. | Keep thresholds and rollout model, but swap memory-template structural checks for spec-doc-anchor continuity checks. | update-logic | M | `search-flags`, `vector-index`, context-type normalization |
| 6 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts` | pipeline-stage | Runs prediction-error arbitration and early-return reinforce/update/supersede paths before create-record. | Keep PE decision flow; only feed it continuity-indexed content instead of memory-file rows. | no-change | XS | `prediction-error-gate`, `pe-gating`, mutation ledger |
| 7 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts` | pipeline-stage | In-process per-spec-folder serialization for save critical sections. | Preserve unchanged and reuse as the concurrency envelope for anchor merge plus index commit. | no-change | XS | `memory-save.ts`, queued promise chain by `specFolder` |
| 8 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | pipeline-stage | Post-insert enrichment for causal links, auto-entities, summaries, entity linking, and graph lifecycle. | Retain enrichment order, but adapt causal-link extraction and any body-derived enrichers to continuity-record / routed-anchor payloads. | update-logic | M | `causal-links-processor`, entity extractor, summaries, graph lifecycle |
| 9 | `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | handler | Resolves causal references from parsed memory body fields into numeric memory IDs and inserts causal edges. | Adapt reference intake so causal links can come from thin continuity records instead of only parsed body sections. | restructure | M | `memory-parser` causalLinks shape, `causal-edges`, canonical path lookup |
| 10 | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | storage-lib | Durable causal-edge graph with conflict-safe upsert, traversal weighting, cache invalidation, and temporal-edge hooks. | Reuse storage semantics unchanged; caller provenance shifts from memory-body extraction to continuity-record metadata. | no-change | XS | `causal_edges` table, graph caches, transaction manager |
| 11 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | pipeline-stage | Save-time reconsolidation gate with checkpoint enforcement, auto-merge, and assistive review recommendations. | Leave logic intact; it operates on indexed content regardless of whether the canonical source is a memory file or spec-doc anchor. | no-change | XS | `reconsolidation`, vector search, BM25 repair, checkpoint gate |
| 12 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts` | pipeline-stage | Re-exports post-insert metadata helpers and checks reconsolidation checkpoint presence. | Pass through; no continuity-specific contract change found. | no-change | XS | `post-insert-metadata`, checkpoints table |
| 13 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | pipeline-stage | Builds index/save MCP envelopes, mutation feedback, warnings, consolidation follow-up, and deferred embedding hints. | Adjust save/result wording and metadata so responses describe doc-anchor continuity writes instead of file-persisted memory docs. | update-logic | S | `buildIndexResult`, `buildSaveResponse`, mutation hooks, consolidation |
| 14 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts` | pipeline-stage | Pure builders for dry-run and rejection responses around insufficiency and template-contract outcomes. | Swap memory-file rejection language for spec-doc / anchor-contract language and continuity-route failure cases. | update-logic | S | sufficiency result, template-contract result, quality loop |
| 15 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts` | pipeline-stage | Extracts markdown sections, bullets, and file-table evidence snapshots from parsed content. | Reuse for routed canonical content and anchor merge evidence; no structural blocker found. | no-change | XS | parsed markdown sections, evidence snapshot consumers |
| 16 | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts` | pipeline-stage | Shared save-pipeline contracts for atomic save, save args, index result, post-insert fields, and scope matching. | Rename or extend atomic/file-centric contracts so anchor/doc-targeted continuity saves become first-class. | rename | M | `AtomicSave*`, `SaveArgs`, `PostInsertMetadataFields` |
| 17 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | handler | Main retrieval handler using artifact routing, 4-stage pipeline, intent weighting, progressive disclosure, session dedup, and profiles. | Keep pipeline core but retarget formatting and source assumptions to spec-doc anchors plus continuity-record fallback instead of memory-file primacy. | restructure | L | `executePipeline`, artifact routing, progressive disclosure, `session-state`, profile formatters |
| 18 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | search-lib | Deterministic keyword/pattern/centroid classifier used by search and context routing. | Reuse unchanged; continuity refactor does not alter the user-intent taxonomy. | no-change | XS | `memory-search`, `memory-context` |
| 19 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts` | search-lib | Ephemeral session retrieval state for seen-result deprioritization, goal refinement, and anchor preferences. | Reuse unchanged; continuity routing still benefits from the same session-aware retrieval shaping. | no-change | XS | `memory-search`, retrieval session IDs |
| 20 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | handler | L1 orchestration layer that auto-routes between triggers, search, focused, deep, and resume strategies with token-pressure policy. | Restructure resume behavior around the new continuity-first ladder while preserving non-resume orchestration and session lifecycle logic. | restructure | L | `memory-search`, `memory-triggers`, pressure monitor, folder discovery, session manager |
| 21 | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | handler | Composite recovery handler that currently merges `memory_context`, code graph health, CocoIndex status, and cached continuity summary acceptance. | Rewrite recovery ordering so fast-path resume reads handover first, thin continuity record second, spec docs third, archived memory last. | rewrite | L | `handleMemoryContext`, cached session summary logic, structural bootstrap contract |
| 22 | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | handler | Composite bootstrap wrapper over `session_resume` + `session_health` with hints, next actions, and structural routing trust. | Follow `session_resume` retarget and adjust next-action language to the new continuity ladder without changing the wrapper role. | restructure | M | `handleSessionResume`, `handleSessionHealth`, payload contract/trust helpers |
| 23 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | handler | Filesystem discovery for spec docs and constitutional files, with spec-folder scoping and exclusions. | Promote spec docs as canonical continuity sources and leave `memory/` discovery as fallback/archive-only indexing logic. | restructure | M | spec-doc path config, canonical path keys, spec root walkers |
| 24 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | handler | Trigger-phrase matcher with scope validation, working-memory decay, co-activation, and tiered content injection. | Keep cognitive ranking, but shift trigger source loading from memory-file frontmatter toward spec-doc frontmatter plus thin continuity record metadata. | update-logic | M | trigger matcher, working memory, attention decay, tier classifier |
| 25 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | handler | Async ingestion job lifecycle for batch indexing with path validation, queueing, and forecast telemetry. | Small adaptation so batch ingest can treat spec docs and continuity records as the primary continuity ingest units. | update-logic | S | job queue, allowed base paths, ingest schemas |
| 26 | `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts` | handler | Public causal graph query/mutate surface for drift tracing, link creation, stats, and unlink. | No direct continuity rewrite needed; it already operates on stored edge graph abstractions. | no-change | XS | `causal-edges`, vector index lookups |
| 27 | `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts` | tool-schema | Dispatch surface for L2-L4 memory tools, including `memory_save` and `memory_quick_search` delegation. | Add continuity-save parameters only here plus schemas; dispatch pattern itself stays stable. | add-parameter | S | handler index, `validateToolArgs`, memory tool names |
| 28 | `.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts` | tool-schema | Dispatch surface for `memory_context`. | No structural change beyond following updated handler/schema contracts. | no-change | XS | `handleMemoryContext`, `validateToolArgs` |
| 29 | `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts` | tool-schema | Dispatch surface for ingest, learning, scan, `session_resume`, and `session_bootstrap`. | Update imports/arg contracts only insofar as resume/bootstrap parameters or summaries change. | update-imports | XS | lifecycle handlers, `validateToolArgs` |
| 30 | `.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts` | tool-schema | Dispatch surface for causal graph MCP tools. | No continuity-specific change found. | no-change | XS | `causal-graph` handlers, `validateToolArgs` |
| 31 | `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | tool-schema | Central strict Zod validation for memory/context/save/ingest/session tool inputs. | Extend save and resume schemas for route/category/anchor-aware continuity inputs and keep session wrappers aligned. | add-field | M | `memorySaveSchema`, `memoryContextSchema`, `session_resume`, `session_bootstrap` |

## Save Pipeline Stage Matrix

1. Stage 1 — Governance validation
   Current carrier: `memory-save.ts` via `validateGovernedIngest()` and shared-space access checks.
   Current purpose: Validate scope, provenance, retention, and shared-space permissions before any write.
   Phase-018 disposition: `pass-through`

2. Stage 2 — Preflight validation
   Current carrier: `memory-save.ts` + `memoryParser.parseMemoryFile()` / `validateParsedMemory()`.
   Current purpose: Parse the source document and surface structural errors before indexing.
   Phase-018 disposition: `adapt`

3. Stage 3 — Template contract
   Current carrier: `memory-save.ts` + `validateMemoryTemplateContract()`.
   Current purpose: Enforce the current memory-file template markers and contract expectations.
   Phase-018 disposition: `rewrite`

4. Stage 4 — Spec-doc health check
   Current carrier: `memory-save.ts` + `evaluateSpecDocHealth()`.
   Current purpose: Annotate or score spec-document health alongside save preparation.
   Phase-018 disposition: `pass-through`

5. Stage 5 — Sufficiency gating
   Current carrier: `memory-save.ts` + `evaluateMemorySufficiency()`.
   Current purpose: Reject thin or low-signal saves that do not have enough durable context.
   Phase-018 disposition: `adapt`

6. Stage 6 — Dedup
   Current carrier: `save/dedup.ts`.
   Current purpose: Prevent unchanged same-path re-indexing and content-hash duplicates.
   Phase-018 disposition: `adapt`

7. Stage 7 — Embedding generation
   Current carrier: `save/embedding-pipeline.ts`.
   Current purpose: Build or reuse cached embeddings for searchable content.
   Phase-018 disposition: `pass-through`

8. Stage 8 — Quality gate
   Current carrier: `lib/validation/save-quality-gate.ts`.
   Current purpose: Run structural, content-quality, and semantic-dedup checks with warn-only rollout logic.
   Phase-018 disposition: `adapt`

9. Stage 9 — Prediction-error arbitration
   Current carrier: `save/pe-orchestration.ts`.
   Current purpose: Decide create vs reinforce vs update vs supersede before record creation.
   Phase-018 disposition: `pass-through`

10. Stage 10 — Atomic save envelope
    Current carrier: `memory-save.ts` `atomicSaveMemory()` under `withSpecFolderLock()`.
    Current purpose: Promote pending file bytes, index under lock, and roll back on failure.
    Phase-018 disposition: `rewrite`

11. Stage 11 — Record creation
    Current carrier: `save/create-record.ts`.
    Current purpose: Insert/update `memory_index`, vector/BM25 state, lineage, and post-insert metadata.
    Phase-018 disposition: `adapt`

12. Stage 12 — Chunking
    Current carrier: `chunking-orchestrator.ts` from `memory-save.ts`.
    Current purpose: Split oversized content into parent/child indexed chunks.
    Phase-018 disposition: `pass-through`

13. Stage 13 — Post-insert metadata
    Current carrier: `save/db-helpers.ts` + `post-insert-metadata`.
    Current purpose: Persist content hash, context type, quality flags, scope, and governance metadata.
    Phase-018 disposition: `pass-through`

14. Stage 14 — Reconsolidation
    Current carrier: `save/reconsolidation-bridge.ts`.
    Current purpose: Optional reconsolidation or assistive recommendation flow after save-time similarity checks.
    Phase-018 disposition: `pass-through`

15. Stage 15 — Post-insert enrichment
    Current carrier: `save/post-insert.ts`.
    Current purpose: Process causal links, auto-entities, summaries, entity linking, and graph lifecycle updates.
    Phase-018 disposition: `adapt`

16. Stage 16 — Response build
    Current carrier: `save/response-builder.ts`.
    Current purpose: Return the final MCP envelope with warnings, async hints, and mutation feedback.
    Phase-018 disposition: `pass-through`

## Handler-Level Classification Summary

- `memory-save.ts` — `rewrite`
- `memory-search.ts` — `restructure`
- `memory-context.ts` — `restructure`
- `session-resume.ts` — `rewrite`
- `session-bootstrap.ts` — `restructure`
- `memory-index-discovery.ts` — `restructure`
- `memory-triggers.ts` — `surgical`
- `memory-ingest.ts` — `surgical`
- `causal-graph.ts` — `no-change`
- `causal-links-processor.ts` — `restructure`

## Cross-Cutting Notes

- `memory-save.ts` already centralizes stages 6-16 in `processPreparedMemory()`, which keeps the phase-018 blast radius narrower than the file size suggests.
- The two genuine rewrite centers still line up with phase-017 findings: stage 3 template contract and stage 10 atomic save.
- `withSpecFolderLock()` is the continuity-critical concurrency primitive; the design notes explicitly carry it forward into anchor merge.
- `memory-save.ts` already computes `specDocHealth` and `documentType`, which reduces how much new plumbing phase 018 needs before routing into spec docs.
- `memory-search.ts` is pipeline-rich but source-agnostic enough that the main continuity work is representation and formatting, not search-engine replacement.
- `memory-context.ts` is the orchestration choke point for fast-path resume; changing retrieval order there has larger user-visible impact than changing trigger or search scoring.
- `session-resume.ts` is the current home of cached continuity acceptance, so the new `resumeLadder` likely lands here before it propagates into `session-bootstrap.ts`.
- `memory-index-discovery.ts` already privileges spec docs and intentionally excludes `memory/` during spec-doc discovery, which matches Option C's target direction.
- `memory-triggers.ts` is cognitively rich but structurally simple; the continuity risk is trigger-source provenance, not ranking math.
- `save/post-insert.ts` and `causal-links-processor.ts` are the main places where body-embedded metadata assumptions still show through.
- `save/create-record.ts` and `save/dedup.ts` are the likely identity/key hotspots once indexed rows point to anchors or continuity records instead of memory-file paths.
- Tool dispatch is centralized in `tools/*.ts` plus `schemas/tool-input-schemas.ts`, so continuity-save parameter expansion should stay localized at the MCP edge.

## Detailed Save Pipeline Module Notes

- `save/create-record.ts`
  Current role: Opens the transaction that makes a save visible to retrieval by writing vector/BM25 rows, lineage state, and post-insert metadata.
  Phase-018 implication: It is the natural place to carry doc-anchor identity or continuity-record identity once stage 10 stops treating a standalone memory file as the source of truth.

- `save/dedup.ts`
  Current role: Mixes same-path duplicate suppression with content-hash duplicate checks and scope-aware matching.
  Phase-018 implication: Same-path logic is the part most exposed by Option C because multiple continuity writes can legitimately target one spec doc while mutating different anchors.

- `save/embedding-pipeline.ts`
  Current role: Extracts weighted sections, computes cache keys, and supports deferred cache persistence.
  Phase-018 implication: The code already works over markdown text, so the main question is what unit of text gets embedded after routing: anchor payload only, rebuilt anchor body, or continuity projection text.

- `save/pe-orchestration.ts`
  Current role: Decides whether a save creates a new record or mutates an existing one before create-record runs.
  Phase-018 implication: Because it operates on content plus candidate rows, it transfers well if upstream identity and candidate lookup stay stable.

- `save/spec-folder-mutex.ts`
  Current role: Guarantees in-process serialization per spec folder by chaining promises.
  Phase-018 implication: The design notes explicitly keep this envelope, which means anchor merge and continuity indexing should happen under the same lock rather than inventing a second mutex.

- `save/post-insert.ts`
  Current role: Runs enrichment steps that still assume body-embedded metadata may exist, especially causal links.
  Phase-018 implication: This becomes a translation boundary between routed canonical docs and metadata that is now expected to live in the thin continuity record.

- `save/reconsolidation-bridge.ts`
  Current role: Optional save-time cleanup or assistive recommendation bridge layered on top of vector similarity.
  Phase-018 implication: Low refactor risk because it consumes indexed content rather than filesystem structure, but its early-return summaries may need continuity wording.

- `save/db-helpers.ts`
  Current role: Thin re-export and checkpoint gate surface.
  Phase-018 implication: Very low risk; likely only call-site churn if any naming changes happen around reconsolidation or post-insert metadata.

- `save/response-builder.ts`
  Current role: Final outward-facing save contract for both success and rejection paths.
  Phase-018 implication: This is where file-centric summaries will become misleading unless the response starts naming doc path, anchor, and continuity disposition explicitly.

- `save/validation-responses.ts`
  Current role: Houses the reusable language for insufficiency and contract rejection outcomes.
  Phase-018 implication: A small file, but it will shape user-facing understanding of the refactor because current strings still speak in memory-file terms.

- `save/markdown-evidence-builder.ts`
  Current role: Pulls structured evidence from markdown sections, lists, and tables.
  Phase-018 implication: Useful as a shared helper for anchor-merge diagnostics and continuity evidence snapshots because it is already markdown-structure-aware and side-effect free.

- `save/types.ts`
  Current role: Declares the contracts that keep `memory-save.ts` and the submodules aligned.
  Phase-018 implication: Contract naming is likely to lag the design unless atomic/file-centric types are renamed early in the refactor.

## Retrieval And Resume Interaction Notes

- `memory-search.ts` already distinguishes artifact routing, intent weighting, progressive disclosure, and presentation profile shaping; continuity retargeting mostly changes source semantics, not pipeline topology.
- `memory-search.ts` also already supports anchors in its public args, which makes anchor-aware continuity retrieval an adaptation rather than a new feature family.
- `memory-context.ts` is where token pressure, folder discovery, and session lifecycle all meet; phase 018 changes here will affect operator UX faster than deeper storage changes.
- `memory-context.ts` currently treats resume as a search-driven strategy with optional auto-resume prompt context injection; the target design wants a different first-hit order before generic search kicks in.
- `session-resume.ts` already maintains a distinction between accepted and rejected cached summaries, which provides a natural slot for continuity-record trust decisions.
- `session-bootstrap.ts` is not the right place for new continuity storage logic; it should remain a wrapper and inherit the new semantics from `session-resume.ts`.
- `memory-index-discovery.ts` already prefers spec docs and excludes `memory/` during spec-doc crawling, which means the current discovery bias is directionally aligned with Option C.
- `memory-triggers.ts` uses session validation and working-memory decay that are orthogonal to source storage; the refactor risk is metadata location, not cognitive policy.
- `memory-ingest.ts` validates paths against allowed memory roots and creates async jobs; the continuity change is mainly about what those jobs are expected to ingest and label.
- `causal-graph.ts` is downstream of stored edge state, so it should remain stable if upstream save/ref enrichment continues to emit the same edge graph.
- `causal-links-processor.ts` is more exposed than `causal-graph.ts` because it still resolves references from parsed save payloads rather than from continuity-record metadata.
- `tools/*.ts` and `schemas/tool-input-schemas.ts` form a narrow MCP edge, which is why save-route overrides and resume-ladder flags can be added without scattering tool-contract edits through every handler.

## Evidence Notes

- `iteration-001` defines the four genuinely new phase-018 components: `contentRouter`, `anchorMergeOperation`, `thinContinuityRecord`, and `resumeLadder`.
- `iteration-001` also states that the refactor is rewiring, not rebuilding, and that `withSpecFolderLock` must survive intact.
- `iteration-002` fixes the 8 routing categories and shows that `metadata_only` content should bypass canonical narrative docs and land in the thin continuity record.
- `iteration-002` also makes the classifier override-able, which implies future MCP-edge schema growth rather than handler proliferation.
- `iteration-023` defines the merge envelope around `withSpecFolderLock(specFolder, fn)` plus anchor-body replacement and post-write verification hooks.
- `iteration-023` confirms that phase 018 merge semantics are anchor-scoped mutations against existing spec docs, not new file creation.
- `iteration-039` tightens the post-write verification model for mismatches, which reinforces that the replacement for `atomicSaveMemory` remains an atomic envelope, not a best-effort update.
- `memory-save.ts` imports almost every save-stage helper directly, which makes it the authoritative dependency spine for the save pipeline.
- `memory-search.ts` imports `executePipeline`, `artifact-routing`, progressive disclosure, and `session-state`, which is why the right phase-018 verb is restructure rather than rewrite.
- `memory-context.ts` routes to `memory_match_triggers` for `quick`, to `memory_search` for `deep` / `focused` / `resume`, and overlays pressure-policy and auto-resume behavior on top.
- `session-resume.ts` currently treats cached continuity as additive context rather than first-hit authority; that is the clearest continuity mismatch with the phase-018 target.
- `session-bootstrap.ts` is downstream of `session-resume.ts`, so its main change is to consume the retargeted resume contract rather than invent new continuity storage logic.

## UNCERTAIN

- UNCERTAIN: No sibling `resmap-A` artifact existed under `scratch/resource-map/` during this scan, so this file follows the user-specified frontmatter and section contract directly.
- UNCERTAIN: The exact code location for the new `contentRouter` is not fixed in the scanned handler tree; the design notes place it before merge/write, likely near the save/generate-context boundary, but do not name the final file yet.
- UNCERTAIN: The exact schema carrier for `thinContinuityRecord` is outside this audit slice; storage semantics are described in research notes, but the final table/column layout belongs to the schema-focused audit.
- UNCERTAIN: `memory-search.ts` and `memory-context.ts` clearly need continuity-source retargeting for resume and representation, but the final shape of anchor-level result formatting was not fully specified in the scanned files.
