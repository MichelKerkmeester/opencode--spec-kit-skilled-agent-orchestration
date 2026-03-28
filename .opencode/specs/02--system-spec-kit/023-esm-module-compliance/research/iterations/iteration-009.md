# Iteration 009

## Focus

Verify whether `scripts` can and should stay CommonJS.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/scripts/package.json`
- `.opencode/skill/system-spec-kit/package.json`
- `node scripts/dist/memory/generate-context.js --help`

## Findings

- `scripts/package.json` explicitly declares `"type": "commonjs"`.
- The workspace-level CLI smoke test depends on the CommonJS `generate-context.js` entrypoint.
- The 023 scope already excludes a scripts-wide ESM migration.
- `scripts` should remain CommonJS, and ESM work must preserve that reality.

## Ruled Out

- Flipping the entire workspace to ESM as the simplest path.

## Dead Ends

- Treating scripts compatibility as an afterthought once `mcp_server` is green.

## Next Focus

Measure how much boundary repair the scripts package will need.
