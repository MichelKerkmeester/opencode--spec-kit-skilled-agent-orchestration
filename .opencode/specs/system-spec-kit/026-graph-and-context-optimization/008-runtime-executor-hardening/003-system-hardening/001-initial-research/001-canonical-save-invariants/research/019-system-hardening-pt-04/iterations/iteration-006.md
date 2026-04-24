# Focus

Cross-validate the two P0 findings across the full 026 tree, verify whether the `save_lineage` fix needs wrapper plus dist repair rather than a caller-only patch, inspect other metadata fields for similar writeback gaps, and pre-stage the `research.md` synthesis structure.

# Actions

1. Scanned the full 026 tree for packet roots and nested artifact directories carrying `spec.md`, `description.json`, and `graph-metadata.json` in different combinations.
2. Re-read the source and built refresh path in:
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-parser.js`
   - `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
   - `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js`
   - `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`
3. Read the closest existing regression suites:
   - `.opencode/skill/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts`
   - `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/p0-c-graph-metadata-laundering.vitest.ts`
4. Sampled 026 `description.json` and `graph-metadata.json` payloads to compare `save_lineage` against other optional metadata fields.
5. Reconciled the findings against the phase-local `deep-research-state.jsonl` tail to keep the synthesis aligned with iterations 1 through 5.

# Cross-Validation Results

## 1. P0 #1 scope holds; no additional active packet-root anomalies surfaced

- Outside `research/` and `review/`, the only packet roots with `description.json` and `graph-metadata.json` but no root `spec.md` are still:
  - `007-release-alignment-revisits`
  - `008-cleanup-and-audit`
  - `009-playbook-and-remediation`
  - `010-search-and-routing-tuning`
- No fifth active packet root joined that failure bucket on the full-tree rescan.

## 2. The inverse problem does not exist for live packet roots

- When constrained to packet roots, there are no active 026 packet roots with `spec.md` but missing `description.json` or `graph-metadata.json`.
- A raw `find` across the whole tree did surface three non-packet directories with `spec.md` and incomplete metadata:
  - `001-research-graph-context-systems/005-claudest/external/docs`
  - `001-research-graph-context-systems/005-claudest/external/plugins/claude-skills/skills/create-cli/examples`
  - `research/014-memory-save-rewrite/014-research-snapshot/primary-docs`
- These are not live packet roots. They are nested documentation or artifact folders, so they should not expand the P0 scope. They do confirm that any future root-spec validator must classify packet roots first rather than treating every `spec.md`-bearing descendant as a packet.

## 3. Nested `research/` and `review/` anomalies are expected iteration-artifact structure

- The full-tree sweep found 21 nested directories under `research/**/iterations` with `description.json` and `graph-metadata.json` but no `spec.md`.
- This pattern is consistent across iteration artifact roots and does not indicate another packet-root defect.
- Result: any root-doc invariant must explicitly exempt `**/iterations` artifact folders, or more generally scope itself to packet roots outside the research/review artifact classes.

## 4. P0 #2 fix path is broader than “pass options from workflow.js”

- The source parser path is correctly shaped to support lineage:
  - `refreshGraphMetadataForSpecFolder(specFolderPath, options = {})` is defined in source.
  - The source implementation normalizes `saveLineage` to `graph_only` when omitted, so passing `{ saveLineage: 'same_pass' }` is a valid source-side contract.
- The currently shipped runtime path still breaks before that contract can hold end-to-end:
  - `scripts/dist/core/workflow.js` calls `refreshGraphMetadata(validatedSpecFolderPath)` with no second argument.
  - `mcp_server/api/indexing.ts` exports `refreshGraphMetadata(specFolder: string)` and drops refresh options entirely before forwarding to the parser.
  - Iteration 5 already proved the built parser/schema omit `save_lineage`, so even a caller-only patch would not persist the field until dist is rebuilt from the corrected source.
- Conclusion:
  - In source, forwarding `{ saveLineage: 'same_pass' }` into the parser would persist the field.
  - In the shipped runtime path, the fix requires all of the following:
    1. widen `mcp_server/api/indexing.ts` so `refreshGraphMetadata()` accepts and forwards refresh options,
    2. keep the workflow caller passing `saveLineage: 'same_pass'`,
    3. rebuild the dist workflow plus graph parser/schema artifacts so runtime matches source.

## 5. Existing tests cover freshness, not lineage passthrough

- `workflow-canonical-save-metadata.vitest.ts` proves `last_save_at` advances across repeated canonical saves, but it does not assert `derived.save_lineage`.
- `graph-metadata-refresh.vitest.ts` proves refresh preserves manual fields and stamps `last_save_at`, but it also does not assert lineage.
- `p0-c-graph-metadata-laundering.vitest.ts` covers migration preservation and unknown-status fallback, not option forwarding.
- Best regression additions:
  - extend `workflow-canonical-save-metadata.vitest.ts` to assert `derived.save_lineage === 'same_pass'` on workflow-driven canonical saves,
  - add or extend an indexing-API-level test to prove `refreshGraphMetadata(specFolder, { saveLineage: 'same_pass' })` reaches the parser and survives to disk.

## 6. `save_lineage` remains the unique systemic writeback gap

- 026 sample results:
  - `description.json.keywords`: present in `120 / 120`
  - `description.json.memoryNameHistory`: present in `120 / 120`
  - `graph-metadata.derived.importance_tier`: present in `120 / 121`, missing only in `review/015-deep-review-and-remediation/merged-015-archive/graph-metadata.json`
  - `graph-metadata.derived.key_topics`: present in `120 / 121`, missing only in the same merged archive file
  - `graph-metadata.derived.save_lineage`: missing in `121 / 121`
- That means `save_lineage` is not just “one more optional field that sometimes disappears.” It is the only sampled field exhibiting a universal writeback gap across the whole 026 corpus.

# New Invariants

1. `packet-root-metadata-requires-root-spec`
   - Outside research/review artifact roots, a directory carrying packet-level `description.json` or `graph-metadata.json` must also carry a root `spec.md`.
   - `**/iterations` descendants are an explicit exemption class and should not be treated as packet roots.

2. `refresh-api-options-must-round-trip`
   - The workflow caller, public indexing wrapper, parser implementation, and built dist artifacts must all preserve `GraphMetadataRefreshOptions` end-to-end.
   - A runtime path that accepts fewer refresh options than the source workflow passes is itself an invariant violation.

3. `post-cutoff-lineage-completeness`
   - For workflow-driven canonical saves after the rollout cutoff, any graph metadata write that stamps `derived.last_save_at` must also stamp a valid `derived.save_lineage`.
   - Missing lineage should be treated as a post-fix regression, not historical drift.

# Synthesis Outline

## 1. Invariant Catalogue

- Original Q2 invariants from iteration 2:
  - same-pass freshness
  - same-pass lineage
  - packet identity normalization
  - target-doc parity
  - planner-mode parity
- Iteration 6 refinements:
  - packet-root metadata requires root spec
  - iteration artifact exemption
  - refresh API option round-trip
  - post-cutoff lineage completeness

## 2. Observed Divergences

- P0 root-doc failures:
  - `007`, `008`, `009`, `010`
- P0 runtime/dist lineage failure:
  - workflow caller drops options in dist
  - indexing wrapper currently drops options in source
  - built parser/schema still omit `save_lineage`
- Non-P0 but still relevant:
  - `012` freshness asymmetry
  - `013` and `015` identity drift
  - iteration artifact directories that look anomalous unless root classification is applied first

## 3. P0 Findings

- P0 #1: active coordination-parent packet roots exist without canonical root docs
- P0 #2: `save_lineage` cannot survive the shipped runtime path because the wrapper and built artifacts do not preserve it

## 4. H-56-1 Verification

- H-56-1 restored follow-up parity for description refresh plus graph refresh timing.
- It did not guarantee lineage persistence because the lineage-specific write path still fails after the workflow layer.

## 5. Proposed Validator Assertions

- Finalize the five-rule set below, with packet-root classification and rollout cutoffs called out explicitly.

## 6. Migration Notes

- Repair or demote `007` through `010`
- widen the indexing wrapper
- rebuild dist artifacts
- backfill post-fix lineage
- then enable the lineage validator cutoff

# Near-Final Validator Set

1. `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`
   - Severity: `error`
   - Scope: packet roots outside research/review artifact roots
   - Rule: if packet-level metadata exists, root `spec.md` must exist
   - Exemption: `**/iterations` and other classified artifact roots

2. `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`
   - Severity: `error`
   - Scope: active packet roots that keep `graph-metadata.json`
   - Rule: `derived.source_docs` cannot be empty for live packet roots
   - Rollout: same allowlist window as `007` through `010`

3. `CANONICAL_SAVE_LINEAGE_REQUIRED`
   - Severity: `error` after cutoff
   - Scope: fresh graph writes after the post-fix release timestamp
   - Rule: `derived.last_save_at` after cutoff requires `derived.save_lineage` in `description_only | graph_only | same_pass`
   - Prerequisite: indexing wrapper widened, dist rebuilt, post-fix backfill completed

4. `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`
   - Severity: `warning`, later `error`
   - Scope: packet roots with continuity plus canonical metadata
   - Rule: continuity packet pointer, description specFolder, and graph spec_folder must normalize to the same packet identity
   - Rollout: warning first, then cutoff-based hardening after normalization sweep

5. `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`
   - Severity: `warning`
   - Scope: recent packet saves
   - Rule: `description.lastUpdated` must not materially outrun `graph-metadata.derived.last_save_at`
   - Rollout: keep warning-only until the save contract guarantees same-pass freshness in every mode

# Next Focus

Write the synthesis packet for `research.md` using the section map above, carry forward the two P0 reproductions with exact fix targets (`scripts/core/workflow.ts`, `mcp_server/api/indexing.ts`, rebuilt dist artifacts), and keep the validator rollout tied to an explicit post-fix cutoff plus backfill plan.
