<!-- SNAPSHOT: copied from 014-save-flow-backend-relevance-review/research/research.md on 2026-04-15. Authoritative source at original packet. -->

---
title: "Save-Flow Backend Relevance Review Post-Memory-Folder Retirement"
description: "20-iteration research synthesis on which post-v3.4.1.0 save-flow subsystems still earn their cost, which should be trimmed or deferred, and what the minimal replacement path looks like."
trigger_phrases:
  - "save flow relevance"
  - "canonical save backend"
  - "memory save simplification"
  - "save-flow trim recommendation"
  - "post-retirement save architecture"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-save-flow-backend-relevance-review"
    last_updated_at: "2026-04-15T09:54:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed 20-iteration save-flow relevance review and consolidated subsystem verdicts."
    next_safe_action: "Open implementation packet for planner-first default-path trim."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts"
      - ".opencode/skill/system-spec-kit/scripts/core/workflow.ts"
      - ".opencode/command/memory/save.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1-Q10 resolved in research/research.md and findings-registry.json"
---

# Save-Flow Backend Relevance Review

## Executive Summary

The post-v3.4.1.0 save path is no longer dominated by the retired `[spec]/memory/*.md` artifact flow; `workflow.ts` now skips legacy writes and legacy indexing, while the real durable mutation happens in the canonical save handler path. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1253] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1361] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1223]

The core that still clearly earns its cost is narrow: canonical routing, canonical merge preparation, routed record identity, atomic promotion/rollback, and thin continuity validation/upsert. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1260] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:89] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:852]

The rest of the stack is mixed. Save-time semantic reindex and graph-metadata refresh still add real value, but they are freshness/derived-state concerns that can be decoupled from the write core. PE gating and chunking are useful but niche. Tier 3 routing, reconsolidation-on-save, the quality-loop auto-fix pipeline, and the post-insert enrichment bundle are the clearest trim or defer targets. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1382] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:63] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:165] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:566] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:55]

Top-line recommendation: `trim-targeted`. Keep the canonical atomic writer and continuity contract, but shift the default operator flow toward planner-first output plus explicit follow-up actions instead of always-on save-time automation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2191] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270]

## Subsystem Analysis

### 1. `generate-context.js` CLI wrapper

Verdict: `partial-value`

The wrapper still does useful work: it validates structured input modes, preserves explicit CLI target precedence over payload spec-folder hints, and forwards normalized save intent into the workflow. [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:68] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:86] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:106]

Recommendation: keep, but do not mistake it for the write engine. It should stay as the full-save CLI shell or planner launcher, not as a justification for preserving unrelated hot-path complexity.

Risk if trimmed too far: explicit operator targeting becomes easier to override accidentally.

### 2. Script workflow orchestrator

Verdict: `partial-value`

The workflow has already shed the retired memory-artifact work: Step 9 skips legacy writes, Step 11 skips legacy indexing, and the remaining save-adjacent script duties are graph refresh plus touched-doc reindex. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1242] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1253] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1364]

Recommendation: trim further if a planner-first flow lands, but preserve the orchestration hooks for explicit reindex/refresh follow-ups or for a retained fully automated mode.

Risk if removed blindly: operators lose one-step freshness behavior and may need manual follow-up they do not realize is required.

### 3. Canonical atomic writer and routed record identity

Verdict: `load-bearing`

`buildCanonicalAtomicPreparedSave()` performs the essential save work: parse, route, merge, continuity upsert, and validator-plan construction. `create-record.ts` supplies canonical target identity and same-path/anchor-aware row lookup, while `atomic-index-memory.ts` handles promotion, rollback, pending-file cleanup, and retry behavior around the promoted file. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1223] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:176] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270]

Recommendation: keep intact. Any simplification should wrap this core, not replace it.

Risk if replaced carelessly: corrupted canonical docs, route collisions, or lost rollback guarantees under concurrent saves.

### 4. Content router core

Verdict: `load-bearing`

The current canonical flow still needs route category, target doc, target anchor, and merge mode. The router exposes that contract explicitly, and the command card still describes those 8 categories as the canonical save surface. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:22] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:85] [SOURCE: .opencode/command/memory/save.md:84]

Recommendation: keep the contract, especially the category-to-target mapping.

Risk if oversimplified: durable content can land in the wrong canonical doc or anchor.

### 5. Routing classifier stack (Tier 2 prototypes + optional Tier 3)

Verdict: `over-engineered`

The current classifier stack is broader than the problem now appears to require. Tier 1 already covers structured routes and some hard-drop classes; Tier 2 compares against a 40-example frozen prototype library; Tier 3 adds a best-effort model call with cache/fallback semantics and refusal behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:342] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:554] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569]

Recommendation: trim. Keep the category contract, expand Tier 1 heuristics where necessary, and reduce or retire Tier 3 from the default path.

Risk if trimmed poorly: more manual-review cases or occasional misroutes if Tier 1/Tier 2 replacement heuristics are not made explicit.

### 6. Quality loop

Verdict: `over-engineered`

The quality loop does more than guard correctness: it enforces 4+ trigger phrases for a perfect trigger score, auto-closes anchor mismatches, trims to token budget, and retries deterministic auto-fixes before rejecting. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:86] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:566]

Recommendation: replace with lighter planner-time hints or lazy harmonization, while preserving only the small set of checks that materially affect canonical merge safety.

Risk if removed with no fallback: trigger quality and metadata hygiene will drift.

### 7. Save-quality gate

Verdict: `partial-value`

Structural checks still prevent obviously malformed saves, and the short-critical exception shows the gate already distinguishes between hard and soft requirements. But the gate also layers weighted content scoring and semantic dedup by default, which is a much heavier opinionated quality contract than canonical mutation strictly needs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:346] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:398] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:602] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:252]

Recommendation: keep structural and legality protections, trim scoring-heavy layers from the default path, and treat semantic dedup as advisory or deferred.

Risk if weakened too aggressively: malformed canonical docs slip through.

### 8. Semantic indexing / touched-doc reindex

Verdict: `partial-value`

The command contract still promises indexed continuity data, and Step 11.5 is the current mechanism that reindexes touched canonical docs after save. That is valuable for immediate search freshness, but the write core finishes before this step runs. [SOURCE: .opencode/command/memory/save.md:123] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1382]

Recommendation: preserve as an explicit follow-up or retained auto mode, not as a reason to keep unrelated save-time automation.

Risk if decoupled without clear UX: operators think a saved update is immediately searchable when it is not yet indexed.

### 9. Graph-metadata refresh

Verdict: `partial-value`

Graph metadata is computed from canonical docs, derives status/key-files/topics/entities, preserves manual relationships, and can be refreshed via a standalone function. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:811] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:870] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:918] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979]

Recommendation: keep, but allow it to run explicitly or asynchronously rather than forcing it into every default save.

Risk if delayed: packet graph surfaces can remain briefly stale.

### 10. Thin continuity sync

Verdict: `load-bearing` for the contract, `partial-value` for save-flow ownership

The validator enforces packet pointer, timestamps, actor, action hints, question sets, and byte-budget compaction before the continuity block is accepted. That contract still matters. But governance docs explicitly allow direct AI edits for continuity-only updates, which means the save flow is not the only legitimate owner. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:852] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:898] [SOURCE: AGENTS.md:52] [SOURCE: AGENTS.md:208] [SOURCE: .opencode/command/memory/save.md:75]

Recommendation: keep the validator and markdown upsert library, but do not force all continuity changes through the heavyweight full-save path.

Risk if removed: resume quality degrades. Risk if over-owned: simple continuity edits pay unnecessary orchestration cost.

### 11. PE gating

Verdict: `partial-value`

PE gating scopes similar-memory lookup by governance fields and can reinforce, supersede, or append versions for indexed rows. It is useful index hygiene and lineage logic, but it sits after save validation and does not determine canonical merge correctness. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:63] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:141] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1815]

Recommendation: trim or reduce default scope, but preserve same-path lineage behavior somewhere in the retained core.

Risk if dropped entirely: duplicate indexed rows and weaker version lineage.

### 12. Reconsolidation bridge

Verdict: `over-engineered`

Reconsolidation requires a live embedding, enabled flags, and a checkpoint, then tolerates non-execution by warning and continuing. Assistive reconsolidation is explicitly advisory logging. This is not proportionate to the simplified post-retirement save contract. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:43] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:165] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:181]

Recommendation: replace with a deferred/background reconciliation tool if the behavior is still wanted at all.

Risk if removed: less automatic near-duplicate consolidation for the memory index.

### 13. Chunking orchestrator

Verdict: `partial-value`

Chunking still provides a real large-content escape hatch by creating a deferred parent record and child chunk records, with safe-swap behavior when re-chunking existing content. But it only matters for oversized content. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:189]

Recommendation: keep as a niche fallback, not as a design center for the default save path.

Risk if removed: no safe handling for oversized saves.

### 14. Post-insert enrichment bundle

Verdict: `over-engineered`

The enrichment pipeline sequentially runs causal links, entity extraction, summaries, entity linking, and graph lifecycle, but each step is individually flag-guarded and wrapped so failures do not block the save. That makes it a poor fit for the critical default path and a strong candidate for deferred/background execution. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:166]

Recommendation: defer the bundle, potentially keeping causal-link extraction as the only save-adjacent survivor if its packet value remains high.

Risk if deferred: graph/search richness appears later rather than immediately.

## Proposed Minimal Replacement Design

Recommendation class: `trim-targeted`

### Minimal path

1. Planner step:
   Run `/memory:save` in a planner or dry-run mode that returns:
   - route category
   - target doc and anchor
   - merge mode
   - hard validation failures and warnings
   - continuity block payload
   - optional freshness follow-ups (`memory_index_scan`, graph refresh)

   This is feasible because the current dry-run already returns validation, quality-loop, template-contract, sufficiency, and spec-doc-health data without mutating files. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2191] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2346]

2. AI-applied canonical edit:
   The AI applies the canonical-doc mutation itself using the planner output, including `_memory.continuity` when needed.

3. Explicit freshness actions:
   - `memory_index_scan({ specFolder, includeSpecDocs: true })` when immediate search visibility matters.
   - `refreshGraphMetadataForSpecFolder(specFolder)` when packet graph surfaces must be current.

4. Optional full-auto mode:
   Preserve the current atomic writer as a fallback or premium path for users who still want end-to-end automated mutation with rollback guarantees.

### What stays

- canonical route planning contract
- anchor merge legality and cross-anchor contamination checks
- atomic promotion/rollback
- routed identity and same-path version handling
- thin continuity validation/upsert
- niche chunking fallback

### What trims or moves out of the default path

- Tier 3 routing and most of the prototype-heavy classifier support
- quality-loop auto-fix retries and trigger quota enforcement
- semantic dedup as a hard default save gate
- reconsolidation-on-save
- post-insert summaries/entity-linking/graph-lifecycle bundle
- mandatory synchronous graph refresh and reindex on every save

## Cross-Cutting Concerns and Mitigation

### Concurrency and rollback

Do not give up atomic promotion/rollback and per-spec-folder locking. Those protections are already implemented and are the strongest defense against partial writes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2496]

Mitigation: keep the atomic helper for full-auto mode, and if planner-first mode becomes default, ensure the AI-visible follow-up steps make freshness status explicit.

### Idempotency and lineage

Do not trim away routed identity or same-path append-only behavior without replacement. That logic keeps canonical rows, anchors, and version lineage coherent. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:89] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:176]

Mitigation: preserve canonical path + anchor identity even if PE gating is reduced.

### Freshness versus correctness

Indexing and graph refresh are valuable but not part of write correctness. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1382] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979]

Mitigation: label them clearly as follow-up freshness actions in planner output.

## Risk Table

| Simplification | Possible regression | Severity | Mitigation |
| --- | --- | --- | --- |
| Trim classifier stack | More manual review or occasional misroutes | Medium | Keep the 8-category contract and strengthen Tier 1 rules before reducing Tier 3 |
| Decouple reindex/graph refresh | Saved updates are not immediately searchable or graph-current | Medium | Expose explicit follow-up actions and status in planner output |
| Reduce PE/recon logic | More duplicate or weakly consolidated index rows | Medium | Preserve same-path identity and make deferred cleanup explicit |
| Remove quality-loop auto-fixes | Trigger/metadata quality drifts | Low-Medium | Replace hard retries with planner hints or lazy indexing-time normalization |
| Defer enrichment bundle | Graph/search richness appears later | Low-Medium | Run enrichment as background or explicit maintenance step |
| Remove atomic writer protections | Partial writes, rollback failures, canonical corruption | High | Do not remove; this is retained core |

## Decision Recommendation

Recommendation: `trim-targeted`

Why not `keep-all`:
Too much of the current stack is warning-tolerant or optional by construction, especially reconsolidation, save-time enrichment, heavy scoring, and Tier 3 routing. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:181] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:598]

Why not `replace-core`:
The canonical atomic writer, routed identity, and thin continuity validator already solve the hardest correctness problems well. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1223] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:852]

Why not `full-redesign`:
That would discard proven safety properties for a problem that is mostly about trimming optional hot-path machinery, not rebuilding canonical mutation from scratch.

Recommended next step:
Open an implementation packet that prototypes planner-first `/memory:save` output, retains the canonical atomic writer for auto mode, and moves Tier 3 routing, reconsolidation, and enrichment behind explicit or deferred follow-up paths.
