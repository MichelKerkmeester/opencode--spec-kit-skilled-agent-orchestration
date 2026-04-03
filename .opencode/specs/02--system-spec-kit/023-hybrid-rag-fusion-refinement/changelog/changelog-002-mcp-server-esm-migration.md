## [v0.2.0] - 2026-03-29

This release matters because it makes the MCP server package honest and predictable during the move to ESM (the modern JavaScript module system). The work updated the public entrypoints, aligned the build output, replaced fragile local and cross-package imports, kept the few remaining late-bound loaders explicit, and verified the built package before handoff to the next phase. The result is a package that builds as native ESM, starts cleanly, and gives library and command-line users a clearer contract.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/002-mcp-server-esm-migration` (Level 1)

---

## Architecture (6)

This phase changed how the package presents itself, how it builds, and how it connects its internal pieces.

### Public entrypoints now match the package's real behavior

**Problem:** The package still looked like CommonJS (the older module system used by Node.js, the JavaScript runtime) from the outside even though this phase was meant to finish an ESM migration. That kind of mismatch can send consumers and command-line tools toward the wrong output and turn packaging metadata into a startup trap.

**Fix:** The package now presents one clear module identity and one clear set of built entrypoints. That gives consumers and command-line use a stable package surface instead of making them depend on guesswork.

### The supported runtime floor is now stated up front

**Problem:** Some of the path-handling behavior used by this migration only works on newer Node.js versions. Without a declared minimum version, users could install the package on an older runtime and hit failures that look unrelated to the real cause.

**Fix:** The package now tells users its minimum supported runtime version before startup. That moves failure earlier and makes unsupported installs easier to understand.

### Build output now matches the package contract

**Problem:** A package can promise one module system while its build settings still emit output shaped for another. When those two layers disagree, a build may finish even though the compiled package is still risky to run.

**Fix:** The build now produces output that matches the package contract. That makes the published files, the startup path, and downstream expectations line up instead of pulling in different directions.

### Local imports now resolve predictably under stricter rules

**Problem:** ESM expects exact file targets for local imports. Older shorthand imports can leave hidden weak points where a feature looks fine in one path but fails when the loader follows stricter resolution rules.

**Fix:** Local links across the package now point to exact built targets. That gives the loader clear instructions and removes a large class of resolution failures before they reach users.

### Shared code now loads through package boundaries

**Problem:** Some shared code was still reached by walking through folder paths directly. That ties the server package to repository layout instead of the declared public surface of the shared package.

**Fix:** The server now reaches shared code through package imports instead of directory shortcuts. That makes cross-package loading more stable and keeps the migration aligned across both packages.

### Dynamic loading is now controlled instead of mixed

**Problem:** Direct loading calls from the older module system can break an ESM package in surprising places. At the same time, a few features still need late-bound loading (choosing a module while the program is already running) because they discover what to load at runtime.

**Fix:** The package removed the direct loading calls that would block an ESM rollout while keeping controlled late-bound loaders only where they are still required. That keeps normal execution consistent without pretending every dynamic loading need disappeared.

---

## Bug Fixes (3)

This part removed the smaller startup traps that could still break the migration after the structural work landed.

### Data files now load under stricter module rules

**Problem:** Data-file imports follow tighter rules under ESM than under older module behavior. One wrong setting can let source code look fine while the built package still fails when it starts.

**Fix:** Data-file loading now follows the stricter ESM rules expected by the runtime. That removes a last-minute startup failure that could survive the larger migration work.

### Path-aware features still find nearby resources

**Problem:** The older module system injected automatic location helpers that ESM does not provide. Features that depend on nearby files can lose track of their surroundings even when the main import graph looks correct.

**Fix:** Path-aware behavior now uses an ESM-safe location model. The server keeps finding neighboring resources after the module switch instead of failing only when a specific file lookup runs.

### The compiled server now launches cleanly

**Problem:** A migration is not complete just because the source files look modern. If the compiled package still fails to launch, users experience the release as broken no matter how tidy the source code appears.

**Fix:** The release now clears the startup path from compiled output to live launch. Users can start the built server without hitting the module-resolution failures that this phase was meant to remove.

---

## Testing (1)

This phase added release evidence, not just source edits.

### Verification now covers build, output, and launch

**Problem:** Source-level edits alone do not prove that a module migration is safe. The risky failures often appear only after compilation or only in the final built package.

**Fix:** Verification for this phase now checks the build, the emitted distribution files, and the startup path together. That makes the release evidence stronger and reduces the chance of shipping a package that looks migrated but still fails in practice.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Test files added in this phase | 0 | 0 |
| Verification steps recorded for this phase | 0 | 3 |
| Build verification passes recorded | 0 | 1 |
| Distribution inspection passes recorded | 0 | 1 |
| Startup smoke passes recorded | 0 | 1 |

This phase did not add new test files, but it closed the migration with concrete release evidence from one successful build, one emitted-output inspection, and one successful startup smoke run.

---

<details>
<summary>Technical Details: Files Changed (181 total)</summary>

### Source (181 files)

| File | Changes |
| ---- | ------- |
| `mcp_server/package.json` | Declared native ESM with `"type": "module"`, updated `main`, `exports`, and `bin` to built `.js` entrypoints, and set `engines.node` to `>=20.11.0`. |
| `mcp_server/tsconfig.json` | Switched package-local compiler settings to `module: "nodenext"`, `moduleResolution: "nodenext"`, and `verbatimModuleSyntax: true`. |
| `mcp_server/**/*.ts` | Rewrote 839 relative imports and re-exports to explicit `.js` specifiers for ESM resolution. |
| `mcp_server/**/*.ts` | Replaced production `__dirname` and `__filename` usage with ESM-safe metadata where local path discovery was required. |
| `mcp_server/**/*.ts` | Replaced production `../../shared/...` hops with `@spec-kit/shared/...` package imports. Remaining `../../shared/...` references are test-only. |
| `mcp_server/lib/cognitive/archival-manager.ts`, `mcp_server/lib/cognitive/tier-classifier.ts`, `mcp_server/lib/errors/core.ts`, `mcp_server/lib/scoring/composite-scoring.ts`, `mcp_server/lib/ops/file-watcher.ts`, `mcp_server/handlers/index.ts` | Converted bare `require()` call sites to ESM-safe loading patterns. |
| `mcp_server/handlers/v-rule-bridge.ts`, `mcp_server/cli.ts` | Bare `require()` calls converted, with `createRequire` retained where dynamic module loading is needed. |
| `mcp_server/lib/eval/ground-truth-data.ts` | Corrected JSON import attributes so the built package starts under strict ESM rules. |
| `mcp_server/dist/*.js` | Verified emitted output uses native `import` and `export` syntax instead of CommonJS wrappers. |

### Tests (0 files)

No new test files landed in this phase. Verification covered one package build, one emitted-output inspection pass, and one startup smoke run against the built server.

### Documentation (0 files)

No phase documentation files were part of the original migration deliverable. This changelog records the package-surface changes, import cleanup, and verification evidence after review.

</details>

---

## Upgrade

No migration required.

This change stays inside `@spec-kit/mcp-server`, so downstream consumers do not need to rewrite their own imports for this phase. If the package is run directly, use Node.js 20.11.0 or newer so the supported runtime behavior matches the package contract.
