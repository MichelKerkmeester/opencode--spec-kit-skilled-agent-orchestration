# Focus

Quantify the full 026-tree scope of packet metadata drift, determine whether `save_lineage` is an unwritten/dead field or a live writeback failure, and convert the observed drift patterns into validator-ready assertions with migration notes.

# Actions Taken

1. Re-read `iteration-001.md`, `iteration-002.md`, `iteration-003.md`, and `deep-research-state.jsonl` to keep Q4/Q5 aligned with the already-established invariant set.
2. Ran a full-tree inventory across `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/`, excluding `research/` and `review/`, to enumerate every packet directory carrying `spec.md`, `description.json`, and/or `graph-metadata.json`.
3. Counted every packet directory with metadata but no `spec.md`, then re-sampled the affected packet roots (`007`, `008`, `009`, `010`) to confirm that `graph-metadata.json.derived.source_docs` is empty in all four cases.
4. Grepped every non-research/non-review `graph-metadata.json` under the 026 tree for `derived.save_lineage` and confirmed that no packet currently stores a non-null lineage value.
5. Read the `save_lineage` source path in:
   - `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1434-1450`
   - `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:96-97`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1068-1072,1173-1181`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:8-46`
6. Re-sampled the previously observed drift packets (`012`, `013`, `015`, `019`) to carry exact current values into the validator draft instead of relying on shorthand notes from iteration 3.

# P0 Scope Quantified

## Full-tree packet count

- A whole-tree scan of numbered packet directories outside `research/` and `review/` found **96** canonical packet directories with at least one of `spec.md`, `description.json`, or `graph-metadata.json`.
- This is materially broader than the state summary's "`26 active`" assumption, so that earlier count appears stale or based on a narrower packet definition than the live tree now exposes.

## Metadata-without-spec scope

- Exactly **4** live packet roots currently have `description.json` and `graph-metadata.json` but no root `spec.md`:
  - `007-release-alignment-revisits`
  - `008-cleanup-and-audit`
  - `009-playbook-and-remediation`
  - `010-search-and-routing-tuning`
- All four also have:
  - `description.memorySequence = 0`
  - `graph-metadata.derived.save_lineage = null`
  - `graph-metadata.derived.source_docs = []`
- This widens iteration 3's P0 from two roots (`007`, `010`) to **four** roots with the same dropped-canonical-doc shape.

## save_lineage classification

- Across the same whole-tree scope, **0 / 96** packet `graph-metadata.json` files have a non-null `derived.save_lineage`.
- The field is **not** a dead schema/documentation leftover:
  - `graph-metadata-schema.ts` explicitly defines `save_lineage` with allowed values `description_only | graph_only | same_pass`.
  - `deriveGraphMetadata()` explicitly writes `save_lineage: options.saveLineage`.
  - `workflow.ts` explicitly calls the graph refresh with `saveLineage: 'same_pass'`.
- The strongest source-backed failure point is the public indexing API wrapper:
  - `workflow.ts` imports `refreshGraphMetadata` from `@spec-kit/mcp-server/api/indexing` and passes an options object.
  - `mcp_server/api/indexing.ts` exports `refreshGraphMetadata(specFolder: string)` and forwards only the folder path, discarding the second argument entirely.
- Classification: **live writeback bug, P0**.

### Remaining nuance

- Source inspection alone would suggest the dropped options should fall back to `graph_only` inside `graph-metadata-parser.ts`.
- Observed files still serialize `null`, not `graph_only`.
- That means the research answer is: the field is intended to be written and is currently not persisting, but there is still one unresolved sub-question about why runtime output remains `null` rather than the parser default. The most likely explanations are runtime/source divergence or another path bypassing the parser default.

# Validator Draft

## 1. `root-spec-required-when-metadata-exists`

- Trigger: packet directory outside `research/`/`review/` has `description.json` or `graph-metadata.json` but lacks `spec.md`
- Severity: `P0`
- Why: this is the exact `007/008/009/010` failure mode; the packet advertises canonical metadata without any canonical continuity surface
- Migration path: for existing roots, either create a minimal root packet doc set beginning with `spec.md` or explicitly demote/archive the root metadata so only child packets remain canonical

## 2. `graph-source-docs-required-for-active-packet`

- Trigger: `graph-metadata.json` exists for a packet directory outside `research/`/`review/`, but `derived.source_docs` is empty
- Severity: `P0`
- Why: it catches the same dropped-state class from the graph side even if a future migration creates placeholder files without real packet docs
- Migration path: regenerate graph metadata only after canonical root docs exist; grandfather current offenders only long enough to repair or archive them, not indefinitely

## 3. `save-lineage-required-on-fresh-graph-save`

- Trigger: `graph-metadata.json.derived.last_save_at` is on or after the wrapper-fix cutoff timestamp, but `derived.save_lineage` is null/missing
- Severity: `P0`
- Why: current source clearly intends lineage stamping, and the live tree shows universal failure on freshly updated packets like `019`
- Migration path: first fix the API wrapper so options propagate; then run a targeted graph refresh/backfill across active packets so newly written files serialize a real lineage value. Older packets can be temporarily grandfathered behind a cutoff date because historical lineage cannot be reconstructed exactly

## 4. `packet-identity-normalization`

- Trigger: normalized `description.specFolder`, frontmatter `_memory.continuity.packet_pointer`, and `graph-metadata.spec_folder` do not resolve to the same packet-relative identity
- Severity: `P1`
- Why: current live drift exists in at least two forms:
  - `013`: continuity drops the `system-spec-kit/` prefix
  - `015`: `description.specFolder` uses `.opencode/specs/...` while continuity + graph use packet-relative identity
- Migration path: normalize all three surfaces through one resolver and run a packet-local rewrite over drifted packets; permit a warning-only mode until a one-time normalization sweep completes

## 5. `description-newer-than-graph-on-recent-packet`

- Trigger: `description.lastUpdated` is materially newer than `graph-metadata.derived.last_save_at` on a packet that has been saved recently enough to fall inside the post-fix observation window
- Severity: `P1`
- Why: `012` shows a real asymmetry where description freshness advanced while graph freshness lagged, which can hide a partial canonical-save follow-up failure
- Migration path: warn-only for older packets or packets last touched before the fix cutoff; escalate to error only for packets whose recent save timestamp proves they should have received same-pass refresh behavior

# Questions Answered

- **Q4:** Answered with a whole-tree count. The live missing-root-spec scope is **4 packet roots**, not 2.
- **Q4 refinement:** the state summary's "`26 active`" packet count does not match the current live tree; the broader whole-tree packet inventory is 96 outside `research/` and `review/`.
- **Q5:** Initial validator set drafted with 5 concrete assertions, each including trigger, severity, and migration path.
- **save_lineage classification:** answered enough to reclassify the issue from "possible stale/null field" to **P0 writeback bug**, with one remaining runtime-detail sub-question about `null` vs `graph_only`.

# Next Focus

1. Inspect the built/runtime module surface used by `codex exec` to explain why observed files still persist `null` instead of `graph_only` after the API wrapper drops `same_pass`.
2. Verify whether `008` and `009` belong in the same remediation plan as `007` and `010` or whether they should instead be archived/demoted out of canonical packet status.
3. Convert the validator draft into concrete validator implementation points, including the cutoff logic for grandfathered historical packets versus fresh-save failures.
