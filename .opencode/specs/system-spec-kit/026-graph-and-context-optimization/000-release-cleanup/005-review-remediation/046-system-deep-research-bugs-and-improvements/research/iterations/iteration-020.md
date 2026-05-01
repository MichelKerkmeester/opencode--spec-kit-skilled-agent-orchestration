# Iteration 020 — D5: Build / dist / runtime separation

## Focus
Audited the `system-spec-kit` MCP server build boundary: `tsconfig` output rules, checked-in `dist/` artifacts, runtime `dist` consumers, and source imports that spell `.js`. The goal was to separate intentional NodeNext ESM specifiers from real source/dist drift.

## Actions Taken
- Read `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json`, root/shared/scripts `tsconfig.json`, and `package.json` files for build outputs and runtime entrypoints.
- Searched MCP server TypeScript for local `.js` imports and sampled `context-server.ts`, `skill_advisor/compat/index.ts`, and `gate3-corpus-runner.mjs`.
- Enumerated checked-in `mcp_server/dist` outputs and compared `dist/*.js` files to expected source `.ts` paths.
- Read `check-source-dist-alignment.ts` to see which compiled outputs are actually guarded.
- Verified runtime/plugin consumers of compiled outputs in `mcp_server/package.json`, `.opencode/plugins/spec-kit-skill-advisor.js`, `plugin_bridges/spec-kit-skill-advisor-bridge.mjs`, and `mcp-doctor.sh`.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-020-D5-01 | P2 | .opencode/plugins/spec-kit-skill-advisor.js:40 | `ADVISOR_SOURCE_PATHS` hashes `../skill/system-spec-kit/mcp_server/dist/skill-advisor/compat/index.js`, but the compiled tree is `dist/skill_advisor`, and `loadNativeAdvisorModules()` imports the underscore path at `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:150-151`. Because `getAdvisorContext()` uses `advisorSourceSignature()` in the cache key at `.opencode/plugins/spec-kit-skill-advisor.js:499-502`, compiled compat changes can be invisible to plugin cache invalidation. | Change the signature path to `dist/skill_advisor/compat/index.js`, or compute it from the same module URL used by `loadNativeAdvisorModules()`. Add a plugin test that fails if the watched dist path is missing. |
| F-020-D5-02 | P2 | .opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts:95 | `DIST_TARGETS` only scans `mcp_server/dist/lib` plus `scripts/dist`, so runtime-critical and drift-prone outputs under `mcp_server/dist/context-server.js`, `dist/api`, `dist/hooks`, `dist/skill_advisor`, and `dist/tests` are outside the alignment guard. The runtime package exports/bin point at `dist/api/index.js`, `dist/context-server.js`, and `dist/cli.js` in `.opencode/skill/system-spec-kit/mcp_server/package.json:6-15`, but those are not in the alignment target list. | Expand the checker to scan all `mcp_server/dist/**/*.js` except explicit, documented generated exceptions, or split it into `runtime-dist` and `test-dist` targets. Run it after a clean build so stale checked-in outputs cannot survive. |
| F-020-D5-03 | P2 | .opencode/skill/system-spec-kit/mcp_server/dist/tests/search-quality/harness.js:11 | Stale compiled test artifacts exist under `mcp_server/dist/tests/search-quality/*` with no matching `mcp_server/tests/search-quality/*.ts` source. The current source lives under `stress_test/search-quality`, where `runSearchQualityHarness()` starts at `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts:109`, and current compiled output also exists under `dist/stress_test/search-quality/*`. This is direct source/dist drift masked by F-020-D5-02. | Delete the stale `dist/tests/search-quality/*` artifacts and make the dist-alignment check catch orphaned files outside `dist/lib`. Prefer `rm -rf dist && tsc --build` in release-cleanup verification. |
| F-020-D5-04 | P2 | .opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:150 | The plugin bridge is source-of-truth runtime JavaScript, not compiled output: `runBridge()` spawns it directly from `.opencode/plugins/spec-kit-skill-advisor.js:407-412`, while MCP server `tsconfig` includes only `**/*.ts` at `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:20`. That boundary is workable, but undocumented and easy to confuse with generated `dist/*.js`. | Document `plugin_bridges/*.mjs` as source-of-truth runtime JS and add a syntax/smoke check for the bridge, or move it to TS so the normal build/typecheck surface owns it. |

## Questions Answered
- Which `.js` paths in TS source are compiled-output specifiers vs source-of-truth? In NodeNext TS files, local imports like `context-server.ts` importing `./core/index.js` at `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:27` are intentional ESM output specifiers for source `.ts` files, not direct source-of-truth JS.
- Which `.js` paths are actual compiled outputs? Package runtime entrypoints and docs/doctor paths point to checked-in `dist`, e.g. `@spec-kit/mcp-server` exports/bin in `.opencode/skill/system-spec-kit/mcp_server/package.json:6-15` and doctor checking `dist/context-server.js` at `.opencode/command/doctor/scripts/mcp-doctor.sh:147-163`.
- Which `.js` paths in source are source-of-truth runtime JS? `plugin_bridges/spec-kit-skill-advisor-bridge.mjs` and `skill_advisor/scripts/routing-accuracy/gate3-corpus-runner.mjs` are checked-in JS/MJS. The latter intentionally imports compiled shared output from `../../../../shared/dist/gate-3-classifier.js` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/gate3-corpus-runner.mjs:1-4`.
- Are there places where source and dist drift? Yes: stale `dist/tests/search-quality/*` artifacts remain after the source moved to `stress_test/search-quality`, and the existing alignment checker does not inspect that part of `dist`.

## Questions Remaining
- Should checked-in `dist/` remain comprehensive, or should release cleanup only keep runtime entrypoints needed by installed hooks/plugins?
- Should source-of-truth MJS bridge files stay outside TypeScript, or be migrated into TS for one build pipeline?
- Should `check-source-dist-alignment.ts` become a strict release gate for all generated JS, including hooks and tests?

## Next Focus
Follow-on work should turn this audit into a build-boundary policy: clean-build verification, a complete dist orphan checker, and a short maintainer note explaining `.js` import specifiers under NodeNext.
