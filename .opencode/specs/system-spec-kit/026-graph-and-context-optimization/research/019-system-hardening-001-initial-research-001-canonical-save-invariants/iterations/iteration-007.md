# Focus

Tighten the remaining loose ends before synthesis by finishing the metadata-field writeback audit, converting the validator sketch into rollout-ready rule candidates, and choosing the least-destructive remediation path for packet-root P0 #1 across `007` through `010`.

# Actions

1. Re-read iteration 006 to keep the writeback audit and validator work aligned with the established P0 framing and the known runtime/dist mismatch around `save_lineage`.
2. Inspected the live writeback path in:
   - `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
   - `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
3. Located the current validator surfaces that the new rules must complement rather than duplicate:
   - `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` (`POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY` family)
4. Read the root `description.json` and `graph-metadata.json` payloads for `007`, `008`, `009`, and `010` to classify their actual packet role and remediation fit.

# Metadata Field Audit Results

## `description.json`

### `memorySequence`

- Classification: always-written
- Evidence:
  - `scripts/spec-folder/generate-description.ts` explicitly preserves `existingData?.memorySequence ?? 0` on regeneration.
  - `mcp_server/tests/workflow-memory-tracking.vitest.ts` and `scripts/tests/workflow-canonical-save-metadata.vitest.ts` assert increment behavior on canonical saves.
- Conclusion: not a writeback gap candidate. It is part of the save-time description tracking contract, not optional metadata.

### `memoryNameHistory`

- Classification: always-written with bounded retention
- Evidence:
  - `scripts/spec-folder/generate-description.ts` preserves `existingData?.memoryNameHistory ?? []` on regeneration.
  - `mcp_server/tests/workflow-memory-tracking.vitest.ts` proves the 20-entry cap and append semantics.
- Conclusion: not a gap candidate. The cap is intentional and already regression-tested.

### `keywords`

- Classification: always-written, but intentionally not save-tracking
- Evidence:
  - `scripts/spec-folder/generate-description.ts` populates `keywords: extractKeywords(explicitDescription)`.
  - The generator preserves tracking fields separately (`memorySequence`, `memoryNameHistory`) rather than mutating `keywords` on every save.
- Conclusion: not a writeback gap candidate. Stability is expected because `keywords` derive from the packet description, not each saved memory filename.

## `graph-metadata.json.derived.*`

### `trigger_phrases`

- Classification: always-written for live packet roots, but can degrade to slug-derived fallback when no canonical root docs exist
- Evidence:
  - `graph-metadata-parser.ts` collects canonical packet docs and falls back to spec-folder identity when root docs are absent.
  - All four P0 packet roots still carry `derived.trigger_phrases` even without root `spec.md`.
- Conclusion: not a null-gap candidate. The issue is quality loss under missing root docs, not writeback omission.

### `key_topics`

- Classification: always-written for live packet roots; sometimes-null is only legitimate on malformed or archived edge cases
- Evidence:
  - Iteration 006 already showed 026-wide presence except for one merged archive file.
  - `007-010` all have non-empty `key_topics`, confirming root-doc absence does not suppress field emission.
- Conclusion: not a systemic writeback gap candidate.

### `importance_tier`

- Classification: always-written for live packet roots; sometimes-null is a legacy/archive anomaly, not a current writeback gap
- Evidence:
  - `007-010` each carry `derived.importance_tier`.
  - Prior corpus scan found only one archived review merge artifact missing it.
- Conclusion: not a current gap candidate.

### `status`

- Classification: always-written
- Evidence:
  - `007-009` resolve to `complete`; `010` resolves to `in_progress`, so the derivation path is clearly active even on coordination parents with missing root docs.
- Conclusion: not a writeback gap candidate. This field already reflects best-effort state derivation from surviving packet artifacts.

### `entities`

- Classification: sometimes legitimately empty
- Evidence:
  - All four coordination parents emit `entities: []` while still writing the field.
  - Coordination-parent roots are summary containers with little or no root textual corpus, so empty extraction is expected.
- Conclusion: not a writeback gap candidate. Empty array is legitimate.

### `causal_summary`

- Classification: always-written
- Evidence:
  - `007-010` each emit a causal summary sentence despite lacking root canonical docs.
- Conclusion: not a gap candidate.

### `save_lineage`

- Classification: writeback gap candidate and still the only systemic one
- Evidence:
  - `workflow.ts` is the correct caller surface for passing `saveLineage`, but the public wrapper in `mcp_server/api/indexing.ts` still exports `refreshGraphMetadata(specFolder: string)` with no refresh-options parameter.
  - Iteration 005 and 006 already confirmed the built runtime path and dist artifacts omit the lineage field entirely.
- Conclusion: remains P0 #2. This is the only field whose absence is systemic rather than archived, optional, or legitimately empty.

# Finalized Validator Assertions

These are shaped as new packet-root validator candidates that could be added under `scripts/spec/rules/` without overlapping the current freshness and fingerprint checks.

## 1. `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`

- Recommended file: `scripts/spec/rules/CANONICAL_SAVE_ROOT_SPEC_REQUIRED.ts`
- Severity: `error`
- Trigger expression:
  - directory is a packet root
  - `description.json` or `graph-metadata.json` exists
  - directory is not under `research/`, `review/`, `research_archive/`, `review_archive/`, or `**/iterations/**`
- Assertion:
  - packet root must contain root `spec.md`
- Grandfathering:
  - start with an explicit allowlist for the four known offenders `007`, `008`, `009`, `010`
  - remove allowlist only after remediation lands
- Interaction:
  - complements `SPEC_DOC_INTEGRITY` by guarding packet-root existence, not frontmatter/body integrity inside already-present docs

## 2. `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`

- Recommended file: `scripts/spec/rules/CANONICAL_SAVE_SOURCE_DOCS_REQUIRED.ts`
- Severity: `error`
- Trigger expression:
  - packet root is active
  - `graph-metadata.json` exists
  - packet is not grandfathered
- Assertion:
  - `derived.source_docs.length > 0`
- Grandfathering:
  - same temporary allowlist as Rule 1 because the four coordination parents currently serialize `source_docs: []`
- Interaction:
  - complements `SPEC_DOC_INTEGRITY` by asserting graph provenance completeness, not markdown structure

## 3. `CANONICAL_SAVE_LINEAGE_REQUIRED`

- Recommended file: `scripts/spec/rules/CANONICAL_SAVE_LINEAGE_REQUIRED.ts`
- Severity: `error` after cutoff, `warn` before cutoff
- Trigger expression:
  - `graph-metadata.json.derived.last_save_at` exists
  - timestamp is after rollout cutoff
- Assertion:
  - `derived.save_lineage` must be one of `description_only`, `graph_only`, `same_pass`
- Grandfathering:
  - cutoff-based, not packet allowlist based
  - requires wrapper widening, dist rebuild, and one backfill before promotion to hard error
- Interaction:
  - complements `CONTINUITY_FRESHNESS` by checking lineage classification, not timestamp skew
  - complements `POST_SAVE_FINGERPRINT` by checking persisted graph output, not save-plan mutation safety

## 4. `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`

- Recommended file: `scripts/spec/rules/CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED.ts`
- Severity: `warning` initially
- Trigger expression:
  - packet root has canonical docs and metadata
- Assertion:
  - root `spec.md` frontmatter packet identity, `description.json.specFolder`, and `graph-metadata.json.spec_folder` normalize to the same packet path
- Grandfathering:
  - warning-only until the known renamed/merged legacy packets are normalized
- Interaction:
  - complements `SPEC_DOC_INTEGRITY` by comparing cross-file packet identity, not validating any single file in isolation

## 5. `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`

- Recommended file: `scripts/spec/rules/CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS.ts`
- Severity: `warning`
- Trigger expression:
  - both `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` exist
- Assertion:
  - `description.lastUpdated` must not materially outrun `derived.last_save_at` beyond the policy budget
- Grandfathering:
  - none needed while warning-only
- Interaction:
  - should reuse the same heuristic budget as `CONTINUITY_FRESHNESS`, but remain packet-root JSON focused instead of continuity-frontmatter focused
  - does not duplicate `CONTINUITY_FRESHNESS`, because that validator compares `_memory.continuity.last_updated_at` against graph freshness rather than `description.json`

# P0 #1 Remediation Recommendations

## `007-release-alignment-revisits`

- Recommendation: `c) mark packet as coordination-only with a minimal README`
- Why:
  - `description.json.type` already says `coordination-parent`
  - the root intent is to summarize three revisit children, not hold an implementation spec of its own
  - a minimal root doc set (`spec.md` or README-style coordination doc, plus source-doc capture) matches its actual role better than archiving it

## `008-cleanup-and-audit`

- Recommendation: `c) mark packet as coordination-only with a minimal README`
- Why:
  - it is another coordination parent with four real child packets and no evidence that the root itself should be archived
  - the packet still represents an active completed train and should remain discoverable as a parent summary

## `009-playbook-and-remediation`

- Recommendation: `c) mark packet as coordination-only with a minimal README`
- Why:
  - the root description explicitly frames it as a coordination parent for follow-on/remediation phases
  - its child packets carry the substantive work; the missing root spec is a summary-surface defect, not a signal that the packet should be archived

## `010-search-and-routing-tuning`

- Recommendation: `c) mark packet as coordination-only with a minimal README`
- Why:
  - root `status` is still `in_progress`, so archiving is clearly wrong
  - this packet is still the active parent for search/routing research threads and needs a discoverable root summary, not a stub or archive move

## Why not `a)` or `b)`?

- `a) create stub spec.md` is workable but too weak if it only satisfies the validator without explaining the coordination-parent role.
- `b) archive to z_archive/` is contradicted by the packet metadata itself, especially `010`, and would erase active parent discoverability rather than fixing it.
- Best fit: coordination-parent root doc with a short role statement, child inventory, and explicit note that substantive implementation lives in children.

# Synthesis Readiness

- Ready for synthesis draft.
- No new P0s surfaced.
- The field audit narrowed the real systemic writeback problem down to `save_lineage` only.
- The validator set is now specific enough to drop into implementation planning with rollout order and grandfathering defined.
- Packet-root remediation has converged to a single pattern across all four offenders: coordination-parent root docs, not archive moves.

# Next Focus

Start the synthesis draft in `research.md`, using the now-stable structure:

1. invariant catalogue
2. confirmed P0 findings
3. metadata-field audit summary
4. validator rollout order and grandfathering
5. packet-root remediation plan for `007-010`
6. implementation fix path for `save_lineage` (`workflow.ts` + `mcp_server/api/indexing.ts` + dist rebuild + post-fix backfill)
