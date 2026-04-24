# Iteration 002

## Focus

Complete the Q3 rich-file audit across live `description.json` files and compare the four Q2 preservation strategies against the current regeneration/write-path behavior.

## Actions

1. Read Iteration 001 to carry forward the initial field catalogue and preservation-boundary hypothesis.
2. Read the current save path in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`, focusing on `getPerFolderDescriptionIssues()`, `normalizePerFolderDescription()`, `buildCanonicalDescriptionOverrides()`, `getDescriptionWritePayload()`, `generatePerFolderDescription()`, and `loadExistingDescription()`.
3. Scanned every live `description.json` under `.opencode/specs` and classified a file as "rich" when it contained authored optional fields beyond the canonical scaffold (`title`, `type`, `trigger_phrases`, `path`) or custom top-level additions.
4. Compared the resulting live rich-file set against the current write semantics to separate what is definitely regenerated, what is preserved implicitly, and what remains contract-risky.
5. Evaluated the four candidate strategies against the live-file patterns and the Iteration 001 field catalogue.

## Rich File Audit Results

### Current live rich-file count

- Current scan found **28** rich `description.json` files, not 29.
- Breakdown by packet type:
  - **Implementation:** 27 rich files out of 416 total
  - **Research:** 0 rich files out of 22 total
  - **Archived:** 1 rich file out of 179 total
- The "29 rich files" reference appears to be slightly stale relative to the current tree.

### Which fields are customized

- `title`: 28 files
- `type`: 12 files
- `trigger_phrases`: 5 files
- `path`: 6 files
- Custom top-level additions: 1 archived backup file with `importance_tier` and `short_description`

### Pattern by packet type

#### Research packets

- No current research packet in the tree uses optional rich fields in `description.json`.
- Current research descriptions are effectively canonical-only metadata: generated core fields plus tracking history.

#### Implementation packets

- Rich files are concentrated in implementation and coordination packets, especially the `026-graph-and-context-optimization` train.
- The dominant pattern is:
  - child packets carry `title` only, mainly for clearer packet labels
  - coordination parents add `title` + `type`
  - a smaller subset of coordination and gate packets add `trigger_phrases` or `path`
- The optional fields appear deliberate and packet-local, not random drift.

#### Archived packets

- Only one archived backup file currently carries non-canonical custom keys.
- That file is the only observed example of authored keys outside the common rich-field set.

### What current regeneration actually overwrites

The write path in `folder-discovery.ts` is more preservation-friendly than the Iteration 001 generator-only view suggested:

- **Always overwritten by canonical regeneration**
  - `specFolder`
  - `description`
  - `keywords`
  - `lastUpdated`
  - `specId`
  - `folderSlug`
  - `parentChain`
  - `memorySequence`
- **Always refreshed separately**
  - `memoryNameHistory`
- **Preserved for schema-valid existing files**
  - optional authored fields such as `title`, `type`, `trigger_phrases`, and `path`
  - even unknown extra keys, because the valid-file path spreads `existing.data` first and the normalizer starts from the full parsed object
- **At-risk cases under current behavior**
  - direct edits to canonical fields inside `description.json` alone, because canonical overrides replace them on every regen
  - parse-error files, which fall back to minimal replacement
  - future maintainability risk: rich/custom field preservation is currently implicit behavior, not an explicit preservation contract

### Net Q3 conclusion

- The current system does **not** appear to be broadly deleting live rich fields during normal schema-valid regeneration.
- The real problem is contract clarity:
  - canonical fields are intentionally regenerated
  - authored optional fields survive mostly because the save path is permissive
  - custom additions survive today, but only as an implementation side effect rather than a documented guarantee

## Strategy Comparison Matrix

| Strategy | Migration Cost | Preservation Reliability | Complexity | Backward Compatibility | Assessment |
| --- | --- | --- | --- | --- | --- |
| Opt-in regen flag | Medium | High when respected, low when callers forget | Low to medium | Medium | Strong safety valve, but pushes correctness onto every caller and risks stale descriptions when regen should have happened |
| Hash-based change detection | Medium to high | Medium | Medium to high | Medium | Helps avoid unnecessary rewrites, but does not define which fields are canonical vs authored and adds hash bookkeeping without solving contract ambiguity |
| Schema-versioned authored layer | High | Very high | High | High if additive | Cleanest long-term model because authored metadata becomes explicit, but it requires schema/version migration and broader tooling updates |
| Field-level merge policy | Medium | High | Medium | High | Best fit for the current code shape: formalizes what is canonical and what is preserved without requiring a storage-model migration |

## Tentative Recommendation

Recommend **Strategy 4: field-level merge policy** as the next implementation direction.

Why this is the best fit for the evidence gathered so far:

- The live tree already depends on preservation of a small authored field set, mostly in implementation coordination packets.
- The current write path is already doing an implicit whole-object preservation merge for valid files.
- A field-level policy would turn that accidental behavior into an explicit contract:
  - keep canonical regeneration for `description`, `keywords`, and path-derived core metadata
  - explicitly preserve authored fields like `title`, `type`, `trigger_phrases`, and `path`
  - decide intentionally whether unknown custom keys are preserved, warned on, or migrated
- This is materially cheaper than introducing a schema-versioned authored layer and more reliable than an opt-in flag.

### Why the other strategies rank lower

- **Opt-in regen flag** reduces accidental overwrites, but it makes preservation dependent on call-site discipline rather than data semantics.
- **Hash-based detection** is useful as an optimization guard, not as the primary preservation model.
- **Schema-versioned authored layer** is still attractive if Phase 018 or later work wants a formally split metadata model, but it looks too heavy for the live risk surface observed in this iteration.

## Next Focus

Iteration 003 should inspect the Phase 018 / R4 interaction surface and convert this recommendation into a concrete implementation sketch:

1. identify where a field-level preservation contract would need to be enforced besides `folder-discovery.ts`
2. check whether any 018 continuity or description-refresh paths bypass this save logic
3. draft the smallest viable implementation contract, tests, and migration notes for optional/custom authored fields
