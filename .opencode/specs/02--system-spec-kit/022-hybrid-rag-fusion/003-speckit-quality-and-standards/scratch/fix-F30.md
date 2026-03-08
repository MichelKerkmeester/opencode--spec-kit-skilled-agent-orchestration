# Fix F30 - Configuration File Audit and Repairs

## Scope
- Base directory: `.opencode/skill/system-spec-kit/`
- File types touched: `package.json` only (plus this fix report in `scratch/` as requested)

## Requested Checks and Outcomes

### 1) Engines field in package.json files
Checked:
- `.opencode/skill/system-spec-kit/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/skill/system-spec-kit/scripts/package.json`
- `.opencode/skill/system-spec-kit/shared/package.json`

Result:
- `shared/package.json` was missing `engines` and has been updated to:

```json
"engines": {
  "node": ">=20.0.0"
}
```

- Root, `mcp_server`, and `scripts` already had `engines` defined, so no change was made there.

### 2) Coverage thresholds in vitest config
Checked:
- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts`

Result:
- No `coverage` section exists, so no thresholds were added (per instruction: only add thresholds when coverage exists but thresholds are missing).

### 3) resolveJsonModule in tsconfig files
Checked:
- `.opencode/skill/system-spec-kit/tsconfig.json`
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json`
- `.opencode/skill/system-spec-kit/scripts/tsconfig.json`
- `.opencode/skill/system-spec-kit/shared/tsconfig.json`

Also scanned for JSON imports. Found:
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts` imports `./data/ground-truth.json`

Result:
- `resolveJsonModule: true` is already configured (root + mcp_server), so no change required.

### 4) node16 pin style in tsconfig
Checked all tsconfig files listed above.

Result:
- No tsconfig uses `"module": "node16"`, so no `moduleResolution` change was needed.

## Validation Runs
Executed from `.opencode/skill/system-spec-kit/`:

1. `npm run -s typecheck`  
   - Failed due to pre-existing error in test code:
   - `mcp_server/tests/folder-discovery-integration.vitest.ts:661` (TS2345)

2. `npm run -s test:mcp`  
   - Failed with one existing test failure:
   - `tests/progressive-validation.vitest.ts` → `suggestions include remediation guidance`

These failures are outside the config scope addressed in this fix.

## Files Changed
- `.opencode/skill/system-spec-kit/shared/package.json`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards/scratch/fix-F30.md`
