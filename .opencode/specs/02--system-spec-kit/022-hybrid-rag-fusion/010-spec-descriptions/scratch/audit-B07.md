# Audit B-07: Configuration Files
## Summary
| File | Status |
|------|--------|
| package.json | WARN |
| tsconfig.json | PASS |

## Detailed Findings
- `scripts/package.json` defines `build`, `lint`, `check:ast`, and `check`, but it does not expose a package-local `test` script even though the package contains multiple `tests/*.vitest.ts` files. Test execution is currently orchestrated from the parent workspace instead of this package manifest. [package.json:7-18, ../package.json:19-24, tests/tree-thinning.vitest.ts:5-6]
- Runtime and dev dependencies in `scripts/package.json` use caret ranges (`better-sqlite3`, `sqlite-vec`, `tsx`) rather than exact pins. The workspace-level `package-lock.json` does pin concrete installs, so day-to-day installs are reproducible, but the child manifest itself still allows drift on a fresh resolve or if published separately. [package.json:13-18, ../package-lock.json:1-27, ../package-lock.json:8393-8407]
- No published advisories were identified for `better-sqlite3@12.6.2`, `sqlite-vec@0.1.7-alpha.2`, or `tsx@4.21.0` from current public advisory sources during this audit, but `sqlite-vec` is still an alpha prerelease and should be treated as a stability/supply-chain watch item rather than a fully mature runtime dependency. [package.json:13-18]
- `scripts/package.json` does not declare its own `engines` field, while the parent workspace requires Node `>=18.0.0`. Because this package is separately named/versioned and relies on Node-native/runtime-specific behavior (`better-sqlite3`, ES2022 output), surfacing the minimum Node version locally would make the contract clearer. [package.json:2-18, ../package.json:11-13]
- No secrets, tokens, keys, or credentials were found in the reviewed config files. [package.json:1-20, tsconfig.json:1-31]
- No additional config files such as `jest.config.*`, `vitest.config.*`, or `.eslintrc.*` were found under `scripts/`. The package's `lint` script is a TypeScript no-emit compile check rather than a dedicated linter configuration. [package.json:7-12]
- `scripts/tsconfig.json` inherits `strict: true`, `target: es2022`, `module: commonjs`, `moduleResolution: node`, `declaration: true`, and project references from the parent TypeScript config. Those settings are consistent with the package's CommonJS runtime declaration (`"type": "commonjs"`) and with its use of project references/path aliases to `shared` and `mcp_server`. [tsconfig.json:1-31, ../tsconfig.json:2-22, package.json:5]
- The configured path mappings are actively used across the package, so they are not stale or speculative. Validation commands also passed (`npm run -s lint`, `npm run -s build`, `npm run -s check`), which supports that the current TypeScript configuration is internally consistent. [tsconfig.json:7-16, spec-folder/folder-detector.ts:14, memory/reindex-embeddings.ts:15-21, core/memory-indexer.ts:13-17]

## Issues [ISS-B07-NNN]
- **ISS-B07-001 — Package manifest uses semver ranges instead of exact pins (WARN).**
  - Impact: The committed lockfile controls current installs, but the manifest alone permits dependency drift and makes standalone reuse/publishing less deterministic.
  - Evidence: `better-sqlite3`, `sqlite-vec`, and `tsx` all use `^` ranges. [package.json:13-18]
- **ISS-B07-002 — Missing package-local test entrypoint (WARN).**
  - Impact: The package contains tests, but a maintainer working inside `scripts/` does not have a first-class `npm test` path, which weakens discoverability and package-local verification.
  - Evidence: Test files exist in `scripts/tests/`, while local scripts only define `build`, `lint`, `check:ast`, and `check`. [package.json:7-12, tests/tree-thinning.vitest.ts:5-6]
- **ISS-B07-003 — Node engine requirement is only declared at workspace root (WARN).**
  - Impact: Tooling/users interacting with the child package directly do not get an explicit runtime contract even though the package depends on Node-native modules and ES2022/CommonJS behavior.
  - Evidence: Root package declares `node >=18.0.0`; child package does not declare `engines`. [../package.json:11-13, package.json:1-20]
- **ISS-B07-004 — Alpha runtime dependency in production path (WARN).**
  - Impact: `sqlite-vec@0.1.7-alpha.2` is not currently flagged by public advisories, but prerelease dependencies carry higher regression and supply-chain risk than stable releases.
  - Evidence: Child package depends on `sqlite-vec` alpha at runtime. [package.json:13-16]

## Recommendations
1. Add a package-local `test` script for the `scripts/` workspace (or a clearly named smoke/integration test entrypoint) so build/lint/test are all discoverable from the package manifest.
2. Add `engines.node` to `scripts/package.json`, matching the workspace root (`>=18.0.0`) unless the package intentionally supports a different floor.
3. If deterministic standalone installs matter, replace runtime caret ranges with exact versions or document that reproducibility relies on the workspace lockfile.
4. Keep `tsconfig.json` as-is: strict mode, declarations, project references, and CommonJS alignment are all appropriate for the current package layout.
5. Continue monitoring `sqlite-vec` for stable releases or advisories; if it remains necessary, document why the alpha dependency is acceptable.
