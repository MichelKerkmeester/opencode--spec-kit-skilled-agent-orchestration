# Phase 020 Wave B — description.json Repair Safety (R4 + R5)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-cli-executor-remediation/`
**Wave A state**: COMPLETE. 66/66 tests green. Executor provenance first-write + dispatch_failure event shipped.
**Your role**: Implement R4 (parse-vs-schema error discrimination + merge-preserving repair) + R5 (specimen regression tests with rich 017 packet fixtures). Also the feature flag.

**First line**: `GATE_3_ACKNOWLEDGED: proceeding with packet 020 Wave B`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Context

Research.md §5 F2+F3 identified: `generate-description.ts` collapses parse error and schema error into the same `null` branch, then rebuilds a minimal replacement that drops authored rich content. Of 86 packet description.json files in the 026 tree, 29 are one invalid edit away from lossy repair.

ADR-011 locked the merge policy: canonical derived fields always win; authored narrative + extension keys always preserved.

## Do these tasks

### T-REP-01 — Refactor generate-description.ts loader

**File**: `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`

Find the current file-loading path that returns `null` on any read/parse/validation issue. Refactor it to return a discriminated-union result:

```typescript
export type LoadResult =
  | { ok: true; data: PerFolderDescription }
  | { ok: false; reason: 'file_missing' | 'parse_error' | 'schema_error'; partial?: Record<string, unknown>; detail?: string };

function loadExistingDescription(path: string): LoadResult {
  // file_missing: existsSync false
  // parse_error: JSON.parse throws → {ok:false, reason:'parse_error', detail: <error message>}
  // schema_error: parses but fails schema → {ok:false, reason:'schema_error', partial: parsedObject, detail: <issue list>}
  // ok: parses AND validates
}
```

Preserve public API of `generate-description.ts`; loader is an internal helper.

### T-REP-02 — New repair module

**File to create**: `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts`

```typescript
// MODULE: description.json merge-preserving repair helper

export type MergePreserveInput<T extends Record<string, unknown>> = {
  partial: Record<string, unknown>;    // what we parsed (may fail schema)
  canonicalOverrides: T;                // fields that must win
};

export type MergePreserveResult<T extends Record<string, unknown>> = {
  merged: T & Record<string, unknown>;
  overriddenKeys: string[];
  preservedKeys: string[];
};

export function mergePreserveRepair<T extends Record<string, unknown>>(
  input: MergePreserveInput<T>
): MergePreserveResult<T> {
  // 1. Start with a shallow copy of partial
  // 2. For each key in canonicalOverrides: set on merged, record in overriddenKeys
  // 3. For keys in partial NOT in canonicalOverrides: stay as-is, record in preservedKeys
  // 4. Return result
}
```

No dependencies beyond stdlib + TypeScript.

### T-REP-03 — Wire the repair module into save path

Update `generate-description.ts`:
- When save path sees a schema_error result: build canonicalOverrides from computed fields (specFolder, description, keywords, lastUpdated, specId, folderSlug, parentChain, memorySequence) and call `mergePreserveRepair(partial, canonicalOverrides)` → write merged result.
- When save path sees parse_error: minimal replacement path stays (can't preserve unparseable content). Log a warning.
- When save path sees file_missing: minimal fresh creation (current behavior).
- When save path sees ok: in-place canonical field update (current behavior).

### T-REP-04 — Feature flag

Env var `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE`. Default `"true"` (merge-preserve enabled). If set to `"false"` or `"0"`, route schema_error back to minimal replacement (rollback behavior).

Read once at module load. Expose as `getRepairMergeSafe(): boolean`.

### T-TST-04 — New repair tests

**File to create**: `.opencode/skill/system-spec-kit/mcp_server/tests/description/repair.vitest.ts`

Cases:
- Basic merge: partial with 2 authored keys + canonicalOverrides with 3 keys → merged has 5 keys, 3 overridden + 2 preserved.
- Canonical wins on conflict: partial has `lastUpdated='old'`, canonicalOverrides has `lastUpdated='new'` → merged has `'new'`, overriddenKeys includes `lastUpdated`.
- Deep authored values preserved: `partial.keywords = ['x', 'y']`, `canonicalOverrides.keywords = ['a']` → `merged.keywords = ['a']` (canonical wins at field level, not deep merge).
- Null partial (empty): just yields canonicalOverrides as merged.
- preservedKeys list accuracy.
- overriddenKeys list accuracy.

### T-TST-05 — Specimen regression tests

**File to create**: `.opencode/skill/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts`
**Fixture dir**: `.opencode/skill/system-spec-kit/mcp_server/tests/description/fixtures/`

Steps:
1. Copy 3-4 rich 017 packet `description.json` files into fixtures: e.g., `016-foundational-runtime.description.json`, `017-sk-deep-cli-runtime-execution/001-executor-feature.description.json`, `017-sk-deep-cli-runtime-execution/002-runtime-matrix.description.json`. (If file-copying is possible; otherwise inline the content.)
2. Simulate a schema-error scenario by adding an extra invalid top-level key (e.g., `"invalid_shape": true`) or malforming a sub-field that trips validation.
3. Run the loader → assert schema_error result.
4. Apply mergePreserveRepair with the canonical overrides the generate-description script would produce.
5. Assert: authored summary keys survive, canonical fields updated, no data loss.
6. One test runs TWO consecutive repair passes on the same specimen and asserts stability (no drift beyond timestamps).

### T-REP-05 — Update loader export for external consumers

Add `export { loadExistingDescription }` from `generate-description.ts` so other modules can use the discriminated result. Or if the function was previously exported with a different name, keep the previous one as a thin wrapper that returns `null` for non-ok cases (back-compat).

## Invariants

- `file_missing` behavior unchanged (fresh minimal creation).
- `parse_error` behavior unchanged (minimal replacement; log warning).
- `schema_error` is the NEW case — merge-preserve if flag on, minimal otherwise.
- `ok` path unchanged (in-place update).
- Feature flag `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE=false` fully reverts to Phase 017 behavior.
- All existing description-related tests pass unchanged.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -5
npx vitest run tests/description/ tests/deep-loop/ 2>&1 | tail -8
```

Expected: tsc clean; description tests run (may be new package path; add to vitest config if needed); deep-loop still 66/66.

## Output

```
WAVE_B_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
NEW_MODULES: [description/repair.ts]
NEW_TESTS: [description/repair.vitest.ts, description/repair-specimens.vitest.ts]
FEATURE_FLAG: SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE
TSC_RESULT: [pass | fail]
VITEST_RESULT: [<n>/<m> passed]
```
</content>
</invoke>
