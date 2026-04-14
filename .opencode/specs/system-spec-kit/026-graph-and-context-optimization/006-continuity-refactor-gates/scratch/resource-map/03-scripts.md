---
title: "Phase 018 Resource Map — Scripts, Generator, Core Indexing"
surface: scripts
agent: resmap-C
worker: cli-codex gpt-5.4 high fast
timestamp: 2026-04-11T14:07:45Z
scan_roots:
  - .opencode/skill/system-spec-kit/scripts/memory/
  - .opencode/skill/system-spec-kit/scripts/spec/
  - .opencode/skill/system-spec-kit/scripts/spec-folder/
  - .opencode/skill/system-spec-kit/mcp_server/core/
rows: 22
---

# Phase 018 Resource Map — Scripts, Generator, Core Indexing

## Inventory

| # | path | kind | purpose | phase_018_action | verb | effort | depends_on |
|---|---|---|---|---|---|---|---|
| 1 | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | generator | Public `/memory:save` CLI entrypoint; validates target spec folder, parses structured JSON, then delegates to `runWorkflow()` for write/index flow. | Retarget public save contract from standalone `memory/` file creation to routed spec-doc continuity writes while preserving explicit CLI-target authority. | refactor | XL | `scripts/core/workflow.ts`, planned `contentRouter`, planned `anchorMergeOperation`, `spec-doc-structure.ts` |
| 2 | `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts` | migration-script | Bulk frontmatter normalizer for templates, spec docs, and memory files. | Extend managed schema so spec docs receive `_memory` / continuity-compatible frontmatter before routed saves land. | extend | M | `lib/frontmatter-migration`, `_memory` schema from iter 022 |
| 3 | `.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts` | indexer | Full runtime bootstrap + forced memory index scan / embedding regeneration. | Reindex `spec_doc` and `continuity` documents after cutover, including archived rows if they remain queryable. | reindex | M | `@spec-kit/mcp-server/api/indexing`, expanded document-type support |
| 4 | `.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts` | utility | Reads memory result sets and computes composite ranking / recent-folder summaries. | Extend summaries so routed spec-doc continuity records and archived-state handling stay dashboard-safe after migration. | extend | S | shared folder-scoring, `is_archived` semantics |
| 5 | `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` | utility | Backward-compatible CLI shim around canonical memory-quality validation library. | Bridge quality-gate entrypoint to anchor-targeted continuity content or keep it as a compatibility wrapper if validation moves wholly into new save pipeline. | bridge | S | `lib/validate-memory-quality`, routed save pipeline |
| 6 | `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts` | migration-script | Cleans orphaned vector rows / history entries from the store. | Sweep stale legacy memory rows after dual-write / routed-write migration to avoid hybrid index drift. | migrate | M | vector ledger, document-type migration plan |
| 7 | `Legacy PR-10 dry-run classifier (script removed post-routing refactor)` | retired-script | Historical dry-run-only inventory / audit for historical JSON-mode memory defects. | Keep only as packet history; no active reuse surface remains after the routed spec-doc save refactor. | retired | M | routed write library, legacy memory corpus |
| 8 | `.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts` | migration-script | Corpus trigger-phrase sanitizer / canonicalizer for historical memories. | Extend trigger cleanup to routed spec-doc continuity surfaces if trigger phrases remain machine-owned frontmatter. | extend | M | live sanitizer, `_memory` frontmatter ownership |
| 9 | `.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts` | migration-script | Rebuilds auto-entity metadata from indexed content. | Recompute entities after continuity/spec-doc reindex so derived metadata follows new canonical storage. | extend | S | rebuilt index corpus, document-type expansion |
| 10 | `.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts` | generator | Canonical read-transform-render-write utility for root/phase changelog markdown. | Reuse its read-transform-write envelope and payload/render split as the phase-018 model for anchor-targeted doc mutation. | reuse | L | changelog templates, doc parsing helpers, atomic write wrapper |
| 11 | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | validator-shell | Public shell orchestrator for spec-folder validation, rule ordering, severity handling, recursive phase runs, and JSON output. | Add Node-backed spec-doc-structure rule orchestration, expose `MERGE_LEGALITY`, and keep shell as the public gate surface. | extend | L | new `spec-doc-structure.ts`, rule registry, JSON output contract |
| 12 | `.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh` | validator-shell | Four-level wrapper around `validate.sh` for detect / auto-fix / suggest / report workflows. | Bridge new rule outputs so progressive validation can surface routed-save structural failures without inventing a second validator. | bridge | S | `validate.sh` result surface |
| 13 | `.opencode/skill/system-spec-kit/scripts/spec/quality-audit.sh` | validator-shell | Batch validator across discovered spec folders for quality monitoring. | Fan out the extended validator across packets/phases so phase-018 rollout can be audited at corpus scale. | bridge | S | `validate.sh` rule expansion |
| 14 | `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | validator-shell | Completion gate for checklist / task readiness before claiming done. | Keep aligned with continuity-backed canonical docs so completion does not assume standalone memory artifacts are the delivery record. | keep | XS | checklist semantics, validator outputs |
| 15 | `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | utility | Detects / resolves spec folders and preserves explicit CLI authority. | Keep explicit phase-target resolution authoritative so routed writes do not reroute away from the selected phase/doc surface. | keep | S | `generate-context.ts`, alignment utilities |
| 16 | `.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts` | utility | Scores conversation-to-folder alignment and related doc/schema checks. | Optionally extend from folder-level scoring to doc/anchor candidate scoring once router planning needs deterministic tie-breakers. | extend | M | planned `contentRouter`, folder detector |
| 17 | `.opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts` | utility | Creates / validates spec-folder directory structure, especially `memory/`. | Keep as compatibility scaffolding during migration; after cutover it may become scratch/temp setup rather than canonical persistence. | keep | XS | migration posture, folder detector |
| 18 | `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` | utility | Generates per-folder `description.json` identity metadata. | Extend only if continuity writes need new per-folder counters / last-updated hints; otherwise keep independent from routed doc writes. | extend | S | description metadata schema |
| 19 | `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` | indexer | Script-side embedding + vector-index write helper used by workflow save path. | Extend index write payloads for `document_type='spec_doc' | 'continuity'`, anchor identity, and archived-state handling. | extend | L | vector index schema, save pipeline cutover |
| 20 | `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | utility | Builds memory classification, session dedup, causal links, anchor extraction, parent spec resolution, and evidence snapshots. | Extend metadata extraction to parse / emit `_memory.continuity`, anchor-level identity, and spec-doc evidence semantics instead of standalone memory assumptions. | extend | L | `_memory` frontmatter schema, continuity contract |
| 21 | `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts` | utility | Heuristic predecessor-memory linker for continuation / supersedes behavior. | Bridge legacy memory-to-memory continuation into continuity-backed doc lineage during migration; keep fail-closed eligibility rules. | bridge | M | continuity metadata, causal links, migration wrapper |
| 22 | `.opencode/skill/system-spec-kit/scripts/dist/memory/*.js` | utility | Compiled runtime artifacts for the `scripts/memory/*.ts` CLIs. | Regenerate after source changes only; do not hand-edit during phase 018. | regenerate | XS | TypeScript source changes, build pipeline |

## Scoped Notes

- `generate-context.ts` is intentionally thin today: it owns CLI parsing, explicit target precedence, and `runWorkflow()` delegation, not the actual write algorithm.
  That means phase 018 should keep most of the file as a wrapper and push routed-write complexity below it.

- The public contract still says output is a new memory file under `<spec-folder>/memory/` at `generate-context.ts:71-84`.
  That text becomes stale immediately once continuity content lands inside spec docs.

- `parseStructuredModeArguments()` already enforces the right precedence model at `generate-context.ts:368-387`.
  Explicit CLI target wins over payload target, which matches the phase-018 requirement to preserve operator-selected phase folders.

- `main()` is the key mutation seam at `generate-context.ts:550-571`.
  It already funnels everything through one `runWorkflow()` call, so the routed save can stay behind a single boundary.

- `nested-changelog.ts` is the clearest reusable shape in the scoped codebase.
  `buildNestedChangelogData()` collects canonical inputs, `generateNestedChangelogMarkdown()` renders, and `writeNestedChangelog()` performs the write at `nested-changelog.ts:652-735`.

- The changelog generator currently rewrites whole files from derived payloads, not anchor subregions.
  Phase 018 should reuse the same read-transform-write split, but swap the renderer for anchor-local merge logic plus post-merge validation.

- `validate.sh` is still a shell orchestrator, not the validator implementation.
  Its strongest value is rule ordering, severity mapping, recursive phase traversal, and JSON aggregation at `validate.sh:315-399`, `406-463`, and `509-524`.

- `validate.sh` currently knows nothing about `FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, or post-save fingerprint checks.
  Its help text and canonicalization map stop at the older rule set in `validate.sh:94-99` and `327-352`.

- `backfill-frontmatter.ts` already scans spec docs and `memory/` files together at `backfill-frontmatter.ts:343-395`.
  That makes it a natural migration companion for introducing `_memory` continuity blocks into spec docs before live routed saves.

- `reindex-embeddings.ts` is fully runtime-API driven and already force-reindexes the corpus at `reindex-embeddings.ts:44-123`.
  It needs document-type awareness, not a new execution model.

- `rank-memories.ts` is purely reader-side JSON scoring logic.
  It should change only if routed continuity rows become visible in dashboards or summary outputs.

- `validate-memory-quality.ts` is almost entirely a compatibility shim at `validate-memory-quality.ts:12-64`.
  If phase 018 centralizes quality gating inside the routed save pipeline, this file may remain mostly unchanged.

- `memory-indexer.ts` shows the strongest standalone-memory assumption in the scoped helpers.
  It calls `vectorIndex.indexMemory()` with `anchorId: null` and no document-type / archived-state fields at `memory-indexer.ts:162-172`.

- `memory-metadata.ts` already has useful continuity-adjacent primitives.
  `resolveParentSpec()` and `extractAnchorIds()` at `memory-metadata.ts:361-375` and `465-468` are directly relevant to doc-based save identity.

- `find-predecessor-memory.ts` is still hardwired to scan the `memory/` directory at `find-predecessor-memory.ts:257-340`.
  That means it must either stay as a migration bridge or be superseded by doc-level continuity lineage once legacy standalone files disappear.

- The brief named `memory-indexer.ts`, `memory-metadata.ts`, and `find-predecessor-memory.ts` under `mcp_server/core/`.
  In the current checkout, the canonical implementations are under `scripts/core/`, so phase planning should use the real path, not the requested-but-missing one.

- `scripts/spec-folder/README.md` confirms nested changelog is already treated as a canonical completion utility at `scripts/spec-folder/README.md:34-49`.
  That strengthens the case for reusing its model rather than inventing a second bespoke doc writer.

- `scripts/memory/README.md` explicitly documents `generate-context.ts` as the canonical save path and `dist/memory/` as the compiled runtime at `scripts/memory/README.md:28-49`.
  Any phase-018 refactor must keep those docs synchronized or they will drift immediately.

- The phase-018 iteration docs point to planned runtime modules that do not exist in the scanned source yet.
  I treated those as design targets, not present-code facts.

## Generator Refactor Scope

- `HELP_TEXT` at `generate-context.ts:51-125` needs a direct rewrite.
  The current wording says the command creates a memory file in `<spec-folder>/memory/`; phase 018 needs it to describe routed continuity writes into spec docs and any dual-write/debug behavior.

- `parseStructuredModeArguments()` at `generate-context.ts:344-388` should stay structurally intact.
  It already enforces the important rule that explicit CLI targets override payload `specFolder`, which phase 018 still needs.

- `parseArguments()` at `generate-context.ts:393-437` should stay mostly intact.
  The likely additive change is plumbing extra routed-save options or debug flags through the parsed result, not rewriting the whole positional/JSON parser.

- `validateArguments()` at `generate-context.ts:439-545` should largely stay.
  It is spec-folder validation / resolution logic, and nothing in the phase-018 design suggests changing target authority or path safety semantics.

- `installSignalHandlers()` and `handleSignalShutdown()` at `generate-context.ts:137-160` should stay unchanged.
  Lock release and graceful shutdown are still required even if the write target changes from a memory file to a spec doc anchor.

- `main()` at `generate-context.ts:550-571` is the only place that clearly needs a functional contract change inside this file.
  Today it passes parsed inputs to `runWorkflow()`; after the refactor it likely needs new workflow options for routed save strategy, merge planning, telemetry stage names, or dry-run comparison.

- The file does not currently own candidate selection, content routing, anchor merge, or indexing behavior.
  Those concerns sit below this layer, so phase 018 should resist dragging routing logic upward into the CLI wrapper.

- The best refactor shape is "thin wrapper stays thin."
  Keep spec-folder authority, JSON parsing, and process lifecycle here; move routed-write logic into shared workflow / library code so other scripts can reuse it.

- The most important non-code change inside this file is operator messaging.
  Error/help text must stop implying "memory file in `memory/`" once continuity writes become canonical.

- If phase 018 introduces new flags for merge-plan debugging, this file is the natural place to parse them.
  I did not find those flags in current code, so exact parameter names remain design-time, not code-time, facts.

## Validator Delta

- `validate.sh` should remain the public shell orchestrator per iter 022 at `iteration-022.md:17-23`.
  The new structural intelligence belongs in a Node/TS validator, not in more Bash parsing.

- The first required delta is a Node-backed spec-doc-structure validator surface.
  Iter 022 places it at `mcp_server/lib/validation/spec-doc-structure.ts` and defines rule order beginning with `ANCHORS_VALID` and `FRONTMATTER_MEMORY_BLOCK` at `iteration-022.md:17-23`.

- `validate.sh` help text must grow beyond the current legacy list at `validate.sh:94-99`.
  At minimum it needs to advertise the new spec-doc-structure rule set and `MERGE_LEGALITY`.

- Rule canonicalization and script mapping at `validate.sh:327-378` need new entries.
  Without that, `SPECKIT_RULES=MERGE_LEGALITY` or related targeted runs cannot work.

- Severity resolution at `validate.sh:315-323` also needs updates.
  Iter 022 treats `MERGE_LEGALITY` as an error-path rule and keeps missing-vs-malformed continuity state distinctions explicit.

- The public JSON output can stay as-is structurally.
  The delta is richer rule names / statuses in `results[]`, not a brand-new report format.

- The new validator should own `FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, and `POST_SAVE_FINGERPRINT`.
  `validate.sh` should orchestrate those by name, not re-implement them.

- The user brief asked specifically for one new rule set plus `MERGE_LEGALITY`.
  Based on iter 022, the clean implementation is a Node bridge that exposes multiple human-facing rules through the existing shell registry.

- `MERGE_LEGALITY` is not just another static folder check.
  Iter 022 describes it as a save-pipeline rule with an optional debug entrypoint such as `validate.sh --merge-plan <json>` at `iteration-022.md:100-104`.

- `POST_SAVE_FINGERPRINT` is likewise not a normal recursive-folder audit rule.
  It belongs in save-time verification with an optional debug surface like `--post-save --expected-fingerprint ...` per `iteration-022.md:176-181`.

- `progressive-validate.sh` and `quality-audit.sh` should consume `validate.sh` output after these changes, not fork their own structural logic.
  That keeps phase 018 on one validator stack instead of a shell stack plus a runtime stack.

## Scripts That Migrate With The Generator

- `backfill-frontmatter.ts` migrates with the generator because it prepares the destination docs.
  If spec docs must carry `_memory` / continuity blocks, this script is the bulk-prep surface before live saves hit those docs.

- `reindex-embeddings.ts` migrates with the generator because routed writes change what gets indexed.
  Once canonical content lives in spec docs, this becomes the fastest whole-corpus refresh path.

- `memory-indexer.ts` migrates with the generator because `runWorkflow()` ultimately lands here for script-side indexing.
  It must learn new document types and anchor/doc identity or the routed save remains invisible to search.

- `memory-metadata.ts` migrates with the generator because it defines the metadata vocabulary the workflow emits.
  Continuity frontmatter, anchor extraction, and evidence snapshots need doc-based rather than standalone-memory assumptions.

- `find-predecessor-memory.ts` partially migrates with the generator.
  It should remain as a legacy bridge while old `memory/*.md` files still exist, but it should not become the long-term canonical lineage resolver for doc-based continuity.

- `migrate-trigger-phrase-residual.ts` is a conditional migration companion.
  It only joins the routed path if trigger phrases remain machine-managed frontmatter on spec docs after phase 018.

- Legacy PR-10 dry-run classifier is retired post-routing refactor.
  Keep it as historical packet context only; it is not an active discovery or migration surface anymore.

- `cleanup-orphaned-vectors.ts` and `rebuild-auto-entities.ts` are post-cutover maintenance, not primary save callers.
  They migrate with the generator operationally, but not as front-door routed-write entrypoints.

- `rank-memories.ts` and `validate-memory-quality.ts` are reader/reporter edges.
  They should adapt to the new corpus shape, but they do not need to call the routed write path directly.

- `scripts/dist/memory/*.js` migrate only as build artifacts.
  They must be regenerated from source after the TypeScript refactor and never hand-patched.

## UNCERTAIN

- The exact parameter names that `generate-context.ts` will pass into the new routed save boundary are not present in current source.
  I can identify the seam (`main()` -> `runWorkflow()`), but not the final option names.

- The brief names `memory-indexer.ts`, `memory-metadata.ts`, and `find-predecessor-memory.ts` under `mcp_server/core/`.
  I did not find those files there; I used the real implementations under `scripts/core/`.

- I attempted CocoIndex semantic search twice for this audit and the tool calls were cancelled.
  The map therefore relies on direct file reads, line scans, and the phase-018 iteration docs rather than CocoIndex evidence.

- Iter 022 describes several new validator surfaces under `mcp_server/lib/validation/`.
  Those modules are planned design targets in this packet, not present implementations in the scanned source.

- The "standard allowlist from agent A" was not available in this workspace slice.
  I used a constrained verb set (`refactor`, `extend`, `bridge`, `reuse`, `migrate`, `reindex`, `audit`, `keep`, `regenerate`) and flagged this limitation here rather than inventing a hidden allowlist.
