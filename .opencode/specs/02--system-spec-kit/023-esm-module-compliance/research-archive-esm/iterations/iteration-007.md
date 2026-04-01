# Iteration 007

## Focus

Audit the current `mcp_server` runtime contract and quantify the difference between source style and actual runtime behavior.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/tsconfig.json`
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js`

## Findings

- `mcp_server` still inherits the CommonJS compiler baseline.
- `mcp_server/package.json` does not declare `"type": "module"`.
- `dist/context-server.js` is still a CommonJS artifact with `exports` and `require(...)`.
- The package is not ESM-compliant in any runtime sense that matters.

## Ruled Out

- Calling the package "mostly ESM already" because the sources use `import` / `export`.

## Dead Ends

- Treating generated output as secondary when the runtime executes `dist/*.js`.

## Next Focus

Audit `shared` to see whether it can remain CommonJS.
