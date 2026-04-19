# Canonical Save Invariants Research Draft

## 1. Executive Summary

This research pass audited the canonical `/memory:save` contract across the four persisted surfaces that matter for recovery and graph traversal: markdown `_memory.continuity`, `description.json`, `graph-metadata.json.derived.*`, and the indexed memory/vector row. The work combined source inspection of the TypeScript save path, verification of the built dist/runtime artifacts that the CLI actually exercises, and packet-root sampling across representative 026 children. The research brief was to answer five questions: enumerate the real field catalogue, derive enforceable cross-layer invariants, verify the exact closure scope of H-56-1, classify live divergence as real versus historical, and turn the result into implementation-ready validator assertions.

Two P0 defects remain. First, four active coordination-parent packet roots (`007`, `008`, `009`, `010`) still expose `description.json` and `graph-metadata.json` without a root `spec.md`, so they have neither a canonical continuity surface nor any graph `source_docs` evidence. That is a live dropped-state defect, not harmless drift. Second, `save_lineage` still does not persist on fresh saves. The source workflow passes `saveLineage: 'same_pass'`, but the public indexing wrapper drops refresh options and the built parser/schema omit the compiled field, so the shipped runtime cannot serialize lineage even after H-56-1 fixed same-pass freshness behavior.

The validator set is now specific enough to implement safely. The proposed rules catch missing root docs, empty `source_docs` on active packet roots, missing post-cutoff `save_lineage`, packet-identity drift across continuity/description/graph layers, and description-versus-graph freshness skew. The rule pack is intentionally non-overlapping with current validators such as `CONTINUITY_FRESHNESS`, `POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY`, and `GRAPH_METADATA_PRESENT`: those existing checks verify document freshness, save fingerprints, doc existence, or graph file presence, while the new rules target packet-root provenance, cross-surface identity, and lineage persistence that are not enforced today.

Recommended handoff is a sibling implementation child under `019-system-hardening`, proposed as `002-canonical-save-hardening`. The rollout should proceed in three waves: Wave A fixes save-lineage runtime parity and rebuilds dist artifacts; Wave B repairs the four coordination-parent packet roots so they regain canonical root docs and non-empty `source_docs`; Wave C backfills active packets, applies grandfathering cutoffs, and enables the new validator set. Estimated effort is about three to five implementation days total. Exit criteria are straightforward: fresh canonical saves persist `save_lineage`, repaired packet roots regain canonical provenance surfaces, and the validator assertions pass without relying on indefinite allowlists.

## 2. Invariant Catalogue

The canonical save pipeline writes or refreshes the following state surfaces:

- `_memory.continuity` is upserted into canonical markdown frontmatter with `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, `next_safe_action`, `blockers`, `key_files`, and session metadata ([`memory-save.ts:1215-1248`](../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1215), [`memory-save.ts:1462-1565`](../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1462)).
- `description.json` carries packet identity plus save-tracking fields such as `specFolder`, `lastUpdated`, `memorySequence`, and `memoryNameHistory` ([`generate-description.ts:81-91`](../../../../../skill/system-spec-kit/scripts/spec-folder/generate-description.ts#L81), [`workflow.ts:1377-1392`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1377)).
- `graph-metadata.json.derived.*` is intended to carry `trigger_phrases`, `key_topics`, `importance_tier`, `status`, `key_files`, `entities`, `causal_summary`, `created_at`, `last_save_at`, `save_lineage`, `last_accessed_at`, and `source_docs` ([`graph-metadata-schema.ts:36-49`](../../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts#L36), [`graph-metadata-parser.ts:1060-1072`](../../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts#L1060)).
- The vector-index row stores canonical document identity and metadata including `specFolder`, `filePath`, `anchorId`, `title`, `triggerPhrases`, `importanceWeight`, `documentType`, `specLevel`, `qualityScore`, `qualityFlags`, and scope metadata ([`create-record.ts:158-171`](../../../../../skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L158), [`create-record.ts:310-360`](../../../../../skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L310)).

Derived cross-layer invariants:

1. **Continuity-anchor parity.** The canonical target doc path and anchor written back into markdown must match the path and anchor stored in the indexed memory record, so retrieval points back at the same continuity surface ([`memory-save.ts:1462-1565`](../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1462), [`create-record.ts:310-314`](../../../../../skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L310)).
2. **Same-pass freshness.** Every successful canonical save should advance both `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` in the same workflow pass because both are driven from `metadataSaveTimestamp` ([`workflow.ts:1333-1450`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1333)).
3. **Description lineage.** Every canonical save should increment `memorySequence` and append the current save artifact name into `memoryNameHistory`, preserving an append-only description-side lineage ([`workflow.ts:1377-1392`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1377)).
4. **Packet-root source-doc parity.** A live packet root that carries `description.json` or `graph-metadata.json` must also have a valid root `spec.md`; otherwise `graph-metadata.json.derived.source_docs` cannot represent real canonical packet docs. The 026 parent packet already states that local directories do not become packet phases without a valid root `spec.md` ([`graph-metadata-parser.ts:1049-1072`](../../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts#L1049), [`026 spec.md:131-132`](../../../spec.md#L131)).
5. **Planner-mode parity.** `plan-only` and `full-auto` are both routed through the same workflow entrypoint, and the follow-up metadata block is now unconditional, so planner mode should no longer change description refresh, graph refresh, Step 11.5 reindex, or post-save review behavior ([`generate-context.ts:415-437`](../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts#L415), [`generate-context.ts:598-607`](../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts#L598), [`workflow.ts:1418-1611`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1418)).
6. **Refresh-option round-trip.** The workflow caller, public indexing API, parser, and built runtime artifacts must all preserve refresh options such as `saveLineage`; otherwise the canonical save contract differs between source and shipped runtime ([`workflow.ts:1434-1450`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1434), [`indexing.ts:95-97`](../../../../../skill/system-spec-kit/mcp_server/api/indexing.ts#L95), [`workflow.js:1163-1167`](../../../../../skill/system-spec-kit/scripts/dist/core/workflow.js#L1163)).
7. **Post-cutoff lineage completeness.** Once the runtime parity fix ships, any fresh graph write that stamps `last_save_at` must also stamp a valid `save_lineage` value from `description_only | graph_only | same_pass` ([`graph-metadata-schema.ts:11-13`](../../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts#L11), [`graph-metadata-parser.ts:1175-1180`](../../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts#L1175)).

## 3. Observed Divergences

Representative packet sample from the 026 tree:

| Packet sample | Root `spec.md` | Freshness invariant | Identity invariant | `save_lineage` | Classification | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `001-research-graph-context-systems` | hold | violate | hold | violate | expected | Older packet; historical freshness skew, canonical docs present |
| `004-agent-execution-guardrails` | hold | violate | hold | violate | expected | Same pattern as older in-progress packet |
| `007-release-alignment-revisits` | violate | n/a | n/a | violate | real | Metadata exists, no root `spec.md`, `source_docs=[]` |
| `008-cleanup-and-audit` | violate | n/a | n/a | violate | real | Same dropped-state shape as 007 |
| `009-playbook-and-remediation` | violate | n/a | n/a | violate | real | Same dropped-state shape as 007 |
| `010-search-and-routing-tuning` | violate | n/a | n/a | violate | real | Same dropped-state shape as 007, still `in_progress` |
| `012-command-graph-consolidation` | hold | violate | hold | violate | latent | `description.lastUpdated` materially newer than graph freshness |
| `013-advisor-phrase-booster-tailoring` | hold | violate | violate | violate | latent | Mixed packet identity formats across surfaces |
| `015-deep-review-and-remediation` | hold | hold | violate | violate | latent | Fresh same-pass timestamps but inconsistent packet identity |
| `019-system-hardening` | hold | hold | hold | violate | latent | Freshest sample still missing lineage, disproving the "historical only" theory |

Interpretation:

- **Expected** means older historical skew that predates the current save contract and does not imply state loss.
- **Benign** was not needed for the final sample set; earlier research identified artifact folders under `research/**/iterations` that must be explicitly excluded from packet-root assertions.
- **Latent** means state is still present but the invariant breach can mask future regressions or break exact-match joins.
- **Real** means canonical metadata exists without the canonical root docs needed to sustain continuity and graph provenance.

## 4. P0 Findings

### P0 #1: Active coordination-parent packet roots missing `spec.md`

Affected packet roots:

- `007-release-alignment-revisits`
- `008-cleanup-and-audit`
- `009-playbook-and-remediation`
- `010-search-and-routing-tuning`

Reproduction:

1. List the packet root and confirm `description.json` plus `graph-metadata.json` are present.
2. Confirm root `spec.md` is absent.
3. Inspect `graph-metadata.json.derived.source_docs` and observe `[]`.
4. Compare against the parent packet contract, which says local directories do not become packet phases unless they contain a valid root `spec.md` ([`026 spec.md:131-132`](../../../spec.md#L131), [`026 spec.md:217`](../../../spec.md#L217)).

Severity rationale:

- These folders are still listed as live children in the parent phase map ([`026 spec.md:112-145`](../../../spec.md#L112)).
- Without a root `spec.md`, `_memory.continuity` cannot exist at the packet root.
- `graph-metadata.json` therefore advertises a packet that has no canonical root-doc evidence and no continuity surface to update.

Proposed remediation:

- Treat all four roots as the same defect class: active coordination-parent packet roots promoted without canonical root docs.
- Repair, do not archive. The least-destructive fix is a coordination-parent root doc set that makes the packet role explicit and restores `source_docs` / continuity surfaces for the parent packet.

### P0 #2: `save_lineage` writeback bug from source/runtime mismatch

Reproduction:

1. Confirm source workflow passes `saveLineage: 'same_pass'` into `refreshGraphMetadata(...)` ([`workflow.ts:1434-1450`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1434)).
2. Confirm the public indexing wrapper only accepts `specFolder: string` and discards refresh options ([`indexing.ts:95-97`](../../../../../skill/system-spec-kit/mcp_server/api/indexing.ts#L95)).
3. Confirm the built workflow used by the runtime calls `refreshGraphMetadata(validatedSpecFolderPath)` with no second argument ([`workflow.js:1163-1167`](../../../../../skill/system-spec-kit/scripts/dist/core/workflow.js#L1163)).
4. Confirm the source parser/schema still intend to serialize `save_lineage` ([`graph-metadata-schema.ts:36-49`](../../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts#L36), [`graph-metadata-parser.ts:1060-1072`](../../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts#L1060)).
5. Confirm the built parser/schema omit the field entirely ([`graph-metadata-parser.js:848-860`](../../../../../skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-parser.js#L848), [`graph-metadata-schema.js:27-39`](../../../../../skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-schema.js#L27)).
6. Observe in the live 026 corpus that `save_lineage` is absent/null even on fresh packets such as `019-system-hardening`.

Severity rationale:

- This is a shipped runtime parity defect, not merely a source-side oversight.
- H-56-1 restored freshness behavior, but the runtime path still cannot preserve lineage values.
- `save_lineage` was the only metadata field that showed a universal writeback gap in the research sample.

Proposed fix:

- Widen `mcp_server/api/indexing.ts` so `refreshGraphMetadata()` accepts and forwards refresh options.
- Preserve the workflow caller contract that passes `saveLineage: 'same_pass'`.
- Rebuild the dist artifacts for workflow, graph parser, and graph schema.
- Add regression coverage at both workflow and indexing-API layers, then run a post-fix backfill over active packets before enabling lineage validation as a hard error.

## 5. H-56-1 Scope Verification

What H-56-1 did fix:

- Removed the dead `ctxFileWritten = false` behavior so description tracking now runs on every canonical save and updates `memorySequence`, `memoryNameHistory`, and `lastUpdated` ([`workflow.ts:1326-1413`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1326)).
- Removed planner-mode suppression so graph refresh, Step 11.5 reindex, and post-save review are no longer `plan-only` no-ops ([`workflow.ts:1418-1611`](../../../../../skill/system-spec-kit/scripts/core/workflow.ts#L1418)).
- Left `generate-context.ts` using `plan-only` as the default while still routing both planner modes through the same workflow entrypoint ([`generate-context.ts:77-82`](../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts#L77), [`generate-context.ts:415-437`](../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts#L415), [`generate-context.ts:598-607`](../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts#L598)).

What H-56-1 did not close:

- It did not repair `save_lineage` persistence because the bug survives below the source workflow layer in the wrapper/dist path.
- It did not repair already-promoted coordination-parent roots that still lack a root `spec.md`.
- It did not normalize all already-shipped packet identity formats across continuity, description, and graph surfaces.

Conclusion:

H-56-1 fully addressed the original metadata no-op for freshness behavior, but it did not close the lineage writeback defect and was never intended to repair pre-existing packet-root structural drift.

## 6. Proposed Validator Assertions

Five rollout-ready assertions:

| Rule name | Trigger expression | Severity | Grandfathering | Migration path |
| --- | --- | --- | --- | --- |
| `CANONICAL_SAVE_ROOT_SPEC_REQUIRED` | `isLivePacketRoot(path) && hasAny(description.json, graph-metadata.json) && !exists(root/spec.md)` | `ERROR` | Packet-marker allowlist limited to `007`, `008`, `009`, `010` until Wave B lands | Add canonical coordination-parent root docs or remove the packet from the live phase map. |
| `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED` | `isLivePacketRoot(path) && exists(graph-metadata.json) && derived.source_docs.length === 0` | `ERROR` | Reuse the same `007-010` packet-marker allowlist until Wave B lands | Rebuild graph metadata only after the packet has a canonical root doc surface again. |
| `CANONICAL_SAVE_LINEAGE_REQUIRED` | `derived.last_save_at >= canonicalSaveLineageCutoffIso && save_lineage not in {description_only, graph_only, same_pass}` | `WARNING` before Wave C, `ERROR` after cutoff | Cutoff date starts at the first release that includes Wave A plus the active-packet backfill | Fix wrapper/dist parity, backfill active packets, then promote the rule to a hard failure. |
| `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` | `normalize(continuity.packet_pointer) != normalize(description.specFolder) || normalize(description.specFolder) != normalize(graph.spec_folder)` | `WARNING` | Warning-only until the normalization sweep ships, then convert to a release-cutoff error | Route all three surfaces through one packet-identity resolver and rewrite mismatched stored values. |
| `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS` | `isRecentPacket(path) && description.lastUpdated > graph.derived.last_save_at + freshnessSlackMs` | `WARNING` | No packet allowlist; warning remains soft until runtime parity is stable for at least one release window | Treat this as a follow-up detector and repair lingering partial-save drift during backfill. |

Notes:

- Packet-root classification must explicitly exempt research/review artifact folders, especially `research/**/iterations`, because those are expected artifact structures rather than live packet roots.
- The new rules intentionally do not overlap `CONTINUITY_FRESHNESS`: that validator checks markdown continuity recency, while these rules check packet-root provenance, cross-surface identity, and graph/source-doc completeness.
- The new rules intentionally do not overlap `POST_SAVE_FINGERPRINT`: fingerprinting detects repeated or missing save-side effects, but it does not assert root-doc presence, non-empty `source_docs`, or persisted lineage values.
- The new rules intentionally do not overlap `SPEC_DOC_INTEGRITY` or `GRAPH_METADATA_PRESENT`: those existing checks confirm required files exist, while the proposed assertions verify whether the files describe a valid canonical packet state.

## 7. Remediation Plan

Recommended implementation hand-off target:

- `019-system-hardening/002-canonical-save-hardening`

Suggested waves:

1. **Wave A: save-lineage dist fix** (`1-2 days`)
   - Update `mcp_server/api/indexing.ts` to forward `GraphMetadataRefreshOptions`.
   - Rebuild dist artifacts so the workflow, graph parser, and graph schema all persist `save_lineage`.
   - Extend workflow/indexing regression coverage to assert `save_lineage: 'same_pass'` on fresh canonical saves.

2. **Wave B: packet-root remediation for `007/008/009/010`** (`1 day`)
   - Add the minimal coordination-parent root doc set needed to restore canonical packet-root continuity surfaces.
   - Re-run graph refresh so `derived.source_docs` is no longer empty on those live roots.
   - Retire the temporary packet-marker allowlist entries as each root is repaired.

3. **Wave C: validator rollout with grandfathering** (`1-2 days`)
   - Run a targeted active-packet backfill after Wave A lands.
   - Apply the release cutoff for lineage enforcement and finish the identity-normalization sweep.
   - Promote the rollout-ready validators to their intended severities once backfill and packet-root repair are complete.

Dependencies and sequencing:

- Wave A does **not** need Wave B first; it can start immediately and should land first because it establishes the shipped runtime contract.
- Wave B can run in parallel with Wave A, but Wave C should not finalize hard enforcement until both Wave A is released and Wave B has removed the `007-010` structural allowlist.
- Wave C depends directly on Wave A for lineage persistence and depends operationally on Wave B if the team wants to avoid carrying a structural grandfathering exception beyond rollout.

Overall success criteria:

- Fresh canonical saves persist `graph-metadata.json.derived.save_lineage` with a valid value on the shipped runtime path.
- Packet roots `007/008/009/010` regain canonical root docs plus non-empty `derived.source_docs`.
- The proposed validator assertions pass across the active packet set with only explicitly time-bounded grandfathering.

## 8. Open Questions / Out of Scope

Open questions:

- The exact rollout cutoff timestamp for enabling lineage as a hard validator should be set from the first release that includes the wrapper fix, rebuilt dist artifacts, and an active-packet backfill.
- The coordination-parent root-doc shape should be finalized during implementation: minimal `spec.md` versus a coordination-oriented root doc template, as long as it restores a canonical root-doc surface.

Out of scope for this research budget:

- Changing the save pipeline itself.
- Broadening the audit beyond the 026 tree to all packet families.
- Tuning freshness thresholds or retry budgets.
- Reconstructing precise historical lineage for packets saved before the runtime parity fix.
