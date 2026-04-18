# Iteration 003

## Focus

Resolve how Phase 018 R4's merge-preserving repair interacts with Iteration 002's recommended field-level merge policy, then turn that recommendation into a concrete implementation and migration shape that does not make the `007/008/009/010` packet-root defect worse.

## Actions

1. Read Iteration 001 and Iteration 002 for the current field catalogue, rich-file count, and strategy ranking.
2. Read `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`.
3. Read `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`, focusing on:
   - `getPerFolderDescriptionIssues()`
   - `normalizePerFolderDescription()`
   - `buildCanonicalDescriptionOverrides()`
   - `getDescriptionWritePayload()`
   - `generatePerFolderDescription()`
   - `loadExistingDescription()`
4. Read `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts`.
5. Read the Phase 018 packet (`018-cli-executor-remediation`) via `spec.md`, `plan.md`, and `decision-record.md` search hits for R4/R5.
6. Cross-read the sibling canonical-save invariants research packet to verify the live `007/008/009/010` missing-`spec.md` behavior.

## 018 R4 Integration

### What Phase 018 R4 actually shipped

- `folder-discovery.ts` now distinguishes three existing-file states:
  - `existing.ok`: schema-valid `description.json`
  - `existing.reason === 'schema_error'`: valid JSON object with structural/type issues
  - `existing.reason === 'parse_error'`: unreadable JSON
- The schema-error lane calls `mergePreserveRepair({ partial, canonicalOverrides })` from `lib/description/repair.ts`.
- That helper preserves every non-canonical top-level key from the parseable partial object, then reapplies canonical overrides.
- `memoryNameHistory` is still handled separately after the merge.

### Interaction with the Iteration 002 recommendation

- There is **no field-policy conflict** between Phase 018 R4 and the recommended field-level merge strategy.
- Phase 018 R4 already encodes the same high-level rule that Iteration 002 recommended:
  - canonical derived fields win
  - authored/non-canonical fields survive
- The duplication is architectural, not semantic:
  - schema-valid files currently preserve authored fields through `{ ...existing.data, ...canonicalOverrides }`
  - schema-invalid-but-parseable files preserve authored fields through `mergePreserveRepair(...)`
- That means the current system already has **two merge mechanisms with the same intent**, split by validation outcome.

### Unification recommendation

Unify the valid-file path and the schema-error repair path behind a single merge policy module.

Recommended policy:

- Canonical fields always win:
  - `specFolder`
  - `description`
  - `keywords`
  - `lastUpdated`
  - `specId`
  - `folderSlug`
  - `parentChain`
  - `memorySequence`
- Tracking field refreshed separately:
  - `memoryNameHistory`
- Authored optional fields preserved explicitly:
  - `title`
  - `type`
  - `trigger_phrases`
  - `path`
- Unknown extension keys preserved intentionally, not accidentally, so preservation is contract-backed rather than spread-order luck.

### Net Q4 answer

Phase 018 R4 should **not** be treated as competing with the recommended strategy. It is the schema-invalid half of that strategy already. The right next step is to collapse both branches into one shared merge mechanism so the field policy is explicit for valid and repair flows alike.

## Implementation Spec

### 1. Schema changes

The reviewed regeneration path still validates `description.json` with a hand-rolled checker in `getPerFolderDescriptionIssues()`. I did not find a shared Zod-backed per-folder description schema on this path, so the cleanest implementation is to introduce one now and let the runtime validator delegate to it.

Recommended schema surface:

- Required canonical fields:
  - `specFolder: string`
  - `description: string`
  - `keywords: string[]`
  - `lastUpdated: string`
- Required-by-normalization/defaulted fields:
  - `specId: string`
  - `folderSlug: string`
  - `parentChain: string[]`
  - `memorySequence: number`
  - `memoryNameHistory: string[]`
- Explicit authored optional fields:
  - `title?: string`
  - `type?: string`
  - `trigger_phrases?: string[]`
  - `path?: string`
- Unknown extension keys:
  - allow via `.passthrough()` so existing extension data can remain legal

Type shape:

- Convert `PerFolderDescription` to a schema-derived type, or keep the interface but ensure it matches the new Zod schema exactly.
- Keep normalization responsible for defaulting:
  - `parentChain = []`
  - `memorySequence = 0`
  - `memoryNameHistory = []`

### 2. Merge / write-path changes

Implement a shared merge policy module, either by expanding `lib/description/repair.ts` or by splitting out a new helper alongside it.

Target behavior:

1. Build canonical overrides once.
2. Merge valid existing files with the same helper used for schema-error partials.
3. Reapply `memoryNameHistory` explicitly after merge.
4. Keep parse-error behavior unchanged:
   - parse error still falls back to minimal replacement, because there is no safe partial object to preserve

Practical outcome:

- schema-valid path stops depending on object-spread accident
- schema-error path stops being a special-case preservation island
- future policy changes happen in one place

### 3. Migration path for the 86 existing files

The migration should be mostly automated because the recommended schema expansion is additive.

Proposed rollout:

1. Ship the additive schema + shared merge helper first.
2. Run an automated regen/audit pass across the 86 existing `description.json` files in the 026 tree.
3. Expected outcomes:
   - canonical-only files remain effectively unchanged except for normal canonical refreshes
   - the 28 currently rich files become explicitly schema-supported rather than implicitly preserved
   - schema-invalid-but-parseable files repair through the shared merge helper
4. Reserve manual work for structural outliers, not field migration:
   - `007-release-alignment-revisits`
   - `008-cleanup-and-audit`
   - `009-playbook-and-remediation`
   - `010-search-and-routing-tuning`

Why these four are manual:

- The sibling invariants research packet shows they have metadata files but no root `spec.md`.
- `generatePerFolderDescription()` still returns `null` when `spec.md` is unreadable or absent.
- That means the default spec-driven regen path never reaches the merge layer for those roots.

### 4. Validation fixtures that prevent regression

Recommended fixture set:

1. Schema-valid rich file:
   - existing file contains `title`, `type`, `trigger_phrases`, `path`
   - regen refreshes canonical fields
   - authored optional fields survive unchanged
2. Schema-valid file with unknown extension key:
   - existing file contains a custom top-level key
   - merge preserves it
   - final payload remains schema-valid via passthrough
3. Canonical conflict:
   - existing file mutates `description`, `keywords`, or `folderSlug`
   - regen overwrites those values from canonical sources
4. Schema-error but parseable rich file:
   - required scaffold is partly wrong, optional authored fields present
   - repair preserves authored optional fields while restoring canonical scaffold
5. Schema-error with malformed known optional field:
   - e.g. `trigger_phrases: "wrong-type"`
   - repair does not keep the bad typed known field in a way that leaves the file perpetually schema-invalid
6. Parse-error file:
   - malformed JSON falls back to minimal replacement
   - no preservation guarantee claimed
7. Explicit `--description` flow without `spec.md`:
   - folder has `description.json` but no `spec.md`
   - explicit mode still writes a fresh payload and preserves authored optional fields through the shared merge policy
8. Default regen without `spec.md`:
   - folder has metadata but lacks `spec.md`
   - generator returns `null`
   - caller reports failure instead of silently wiping metadata

### 5. File-touch list

Minimum likely file set:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/description/schema.ts` (new)
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/description-repair.vitest.ts` (new or equivalent targeted test file)
- fixture files under the existing spec-folder / description test fixtures tree

## Migration Compatibility

### Do the `007/008/009/010` packet roots break under the new strategy?

Not additionally. They are already in a degenerate state before the merge policy runs.

Current behavior:

- default regen path:
  - requires `spec.md`
  - returns `null` when `spec.md` is missing
  - never reaches the merge helper
- explicit `--description` path:
  - does **not** require `spec.md`
  - derives `specId`, `folderSlug`, and `parentChain` from the folder path
  - can still preserve authored fields through the save path

### Compatibility conclusion

- The new merge strategy is safe for normal packets because it only changes what happens **after** a new canonical description object exists.
- The four problematic packet roots remain a **separate structural defect**, not a schema-merge defect.
- Therefore:
  - do **not** include `007/008/009/010` in an automated spec-driven regen pass until they have root `spec.md` files or are formally demoted out of the live packet map
  - if temporary metadata maintenance is needed before root-doc remediation, use the explicit description mode or repair the packet roots first

### Degenerate flow answer

Yes, there is still a degenerate flow:

- `description.json` can exist without `spec.md`
- default regeneration cannot refresh it
- field-level merge policy does not fix that because generation fails earlier than merge

That means the merge work and the packet-root remediation work should stay separate in the implementation plan.

## Next Focus

Iteration 004 should tighten two remaining implementation-policy choices before synthesis:

1. Decide whether unknown extension keys stay top-level passthrough permanently or should migrate into a named authored metadata bag later.
2. Verify the smallest testable rollout sequence:
   - shared schema first
   - unified merge helper second
   - targeted regen/audit pass third
   - `007/008/009/010` root-doc remediation tracked separately
