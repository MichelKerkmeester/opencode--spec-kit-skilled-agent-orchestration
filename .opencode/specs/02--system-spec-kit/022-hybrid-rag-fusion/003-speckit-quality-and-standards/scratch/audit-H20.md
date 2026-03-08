# Audit H-20: Configuration Files

**Scope:** 13 config files across 4 workspace packages
**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6

---

## Per-File Results

| # | File | Checks Applied | Issues | Details |
|---|------|---------------|--------|---------|
| 1 | `package.json` (root) | strict N/A, versions, engines | 1 | All deps use `^` ranges (not exact pins); `engines` present |
| 2 | `tsconfig.json` (root) | strict, consistency | 0 | `"strict": true`; target=es2022, module=commonjs, moduleResolution=node |
| 3 | `mcp_server/package.json` | versions, engines | 1 | All deps use `^` ranges; `engines` present |
| 4 | `mcp_server/tsconfig.json` | strict, consistency | 0 | Extends root (inherits strict); adds `allowJs: true` (intentional) |
| 5 | `mcp_server/vitest.config.ts` | vitest checks | 1 | No coverage thresholds defined; no exclude patterns |
| 6 | `scripts/package.json` | versions, engines | 0 | All deps use exact pins (e.g., `"12.6.2"`); `engines` present |
| 7 | `scripts/tsconfig.json` | strict, consistency | 0 | Extends root (inherits strict); consistent settings |
| 8 | `shared/package.json` | versions, engines | 1 | No `engines` field; no dependencies (N/A for version pins) |
| 9 | `shared/tsconfig.json` | strict, consistency | 0 | Extends root (inherits strict); consistent settings |
| 10 | `.env.example` | security | 0 | All API keys commented/empty; clear setup instructions |
| 11 | `.gitignore` (root spec-kit) | security | 0 | Covers `dist/` dirs; `.env` covered by project root `.gitignore` |
| 12 | `.npmrc` | general | 0 | `install-strategy=nested` -- reasonable for workspace isolation |
| 13 | `scripts/.gitignore` | general | 0 | Prevents compiled artifacts in `sgqs/` source directory |

---

## Check 1: Strict Mode

**Result: PASS (all 4 tsconfig files)**

| tsconfig | strict | Method |
|----------|--------|--------|
| Root `tsconfig.json` | `true` | Direct declaration |
| `mcp_server/tsconfig.json` | `true` | Inherited via `"extends": "../tsconfig.json"` |
| `scripts/tsconfig.json` | `true` | Inherited via `"extends": "../tsconfig.json"` |
| `shared/tsconfig.json` | `true` | Inherited via `"extends": "../tsconfig.json"` |

---

## Check 2: Exact Version Pins

**Result: INCONSISTENT across workspaces**

| Package | Dependencies | Pin Style | Assessment |
|---------|-------------|-----------|------------|
| Root | `@huggingface/transformers`, `@types/better-sqlite3`, `@types/node`, `typescript`, `onnxruntime-common` | All `^` ranges | Non-exact |
| `mcp_server` | 7 deps + 4 devDeps + 2 optionalDeps | All `^` ranges | Non-exact |
| `scripts` | `better-sqlite3`, `sqlite-vec`, `tsx` | All exact pins | Exact |
| `shared` | None | N/A | N/A |

**Issue H20-01:** Root and `mcp_server` packages use `^` (caret) ranges for all dependencies, while `scripts` uses exact pins. This inconsistency means:
- `mcp_server` and root installs are non-deterministic without a lockfile
- `scripts` has stricter reproducibility guarantees

**Recommendation:** Either adopt exact pins uniformly (preferred for production MCP servers) or document that `^` ranges are intentional for root/mcp_server to receive compatible patches via lockfile.

---

## Check 3: Engine Requirements

**Result: 3/4 packages have `engines`**

| Package | `engines` field | Value |
|---------|----------------|-------|
| Root | Yes | `"node": ">=18.0.0"` |
| `mcp_server` | Yes | `"node": ">=18.0.0"` |
| `scripts` | Yes | `"node": ">=18.0.0"` |
| `shared` | **No** | Missing |

**Issue H20-02:** `shared/package.json` has no `engines` field. While it inherits runtime constraints from the workspace root, explicit declaration prevents misuse if the package is ever extracted or referenced independently.

---

## Check 4: Security Review

### `.env.example` -- PASS

- All API keys are commented out with empty values (`# VOYAGE_API_KEY=`, `# OPENAI_API_KEY=`)
- No real secrets, tokens, or credentials present
- Clear documentation with setup instructions and provider URLs
- Environment variable names follow conventional patterns

### `.gitignore` coverage -- PASS (with caveat)

| Pattern | Covered by | Location |
|---------|-----------|----------|
| `.env` | `.env` + `.env.*` + `.env.*.local` + `.env.local` | **Project root** `.gitignore` |
| `dist/` | `shared/dist/`, `mcp_server/dist/`, `scripts/dist/` | Spec-kit `.gitignore` |
| `node_modules/` | `**/node_modules` | Project root `.gitignore` |
| `*.db` / `*.sqlite3` | `*.db`, `*.sqlite3`, explicit database paths | Project root `.gitignore` |

**Caveat:** The spec-kit level `.gitignore` does not independently exclude `.env` files -- it relies on the project root `.gitignore`. If this package were extracted to a standalone repo, `.env` files would not be ignored. Consider adding `.env` to the spec-kit `.gitignore` for defense-in-depth.

---

## Check 5: Cross-Config Consistency

### tsconfig Settings Comparison

| Setting | Root | mcp_server | scripts | shared |
|---------|------|-----------|---------|--------|
| `target` | es2022 | inherited | inherited | inherited |
| `module` | commonjs | inherited | inherited | inherited |
| `moduleResolution` | node | inherited | inherited | inherited |
| `strict` | true | inherited | inherited | inherited |
| `esModuleInterop` | true | inherited | inherited | inherited |
| `skipLibCheck` | true | inherited | inherited | inherited |
| `forceConsistentCasingInFileNames` | true | inherited | inherited | inherited |
| `resolveJsonModule` | true | explicit (redundant) | inherited | inherited |
| `composite` | true | explicit (redundant) | explicit (redundant) | explicit (redundant) |
| `declaration` | true | inherited | inherited | inherited |
| `declarationMap` | true | inherited | inherited | inherited |
| `sourceMap` | true | inherited | inherited | inherited |
| `rootDir` | N/A | `.` | `.` | `.` |
| `outDir` | N/A | `./dist` | `./dist` | `./dist` |
| `allowJs` | false (default) | **true** | inherited (false) | inherited (false) |
| `baseUrl` | N/A | `.` | `.` | N/A |

**Result: CONSISTENT** -- All child tsconfigs extend root. Only intentional divergences:
- `mcp_server` enables `allowJs` (needed for JavaScript interop)
- `mcp_server` and `scripts` define `paths` aliases for cross-workspace imports
- `mcp_server` redundantly re-declares `resolveJsonModule` (harmless)

### Version Alignment

| Field | Root | mcp_server | scripts | shared |
|-------|------|-----------|---------|--------|
| `version` | 1.7.2 | 1.7.2 | 1.7.2 | 1.7.2 |
| `typescript` | ^5.9.3 | ^5.9.3 | N/A (uses root) | N/A |

**Result: CONSISTENT** -- All package versions aligned at 1.7.2; TypeScript versions match.

---

## Check 6: vitest.config.ts

**File:** `mcp_server/vitest.config.ts`

| Aspect | Value | Assessment |
|--------|-------|------------|
| Include pattern | `tests/**/*.vitest.ts` | PASS -- explicit, well-scoped |
| Exclude pattern | None defined | MINOR -- should exclude `node_modules`, `dist` |
| Test timeout | 30,000ms | PASS -- reasonable with documented rationale |
| Environment | `node` | PASS -- correct for server-side code |
| Globals | `true` | PASS -- conventional for vitest |
| Coverage thresholds | Not configured | FAIL -- no minimum coverage enforced |
| Aliases | `@lib` -> `lib/` | PASS -- matches project structure |

**Issue H20-03:** No coverage configuration. Consider adding:
```typescript
coverage: {
  provider: 'v8',
  thresholds: { statements: 70, branches: 60, functions: 70, lines: 70 },
  include: ['lib/**/*.ts'],
  exclude: ['tests/**', 'dist/**']
}
```

---

## Additional Findings

### H20-04: `shared/package.json` is minimal
The `shared` package has no `scripts`, no `dependencies`, no `devDependencies`, and no `engines` field. It only defines `name`, `version`, `private`, `main`, and `exports`. While minimal packages are valid, the absence of a build script means it relies entirely on the root `tsc --build` command.

### H20-05: `mcp_server/package.json` has redundant `resolveJsonModule`
The `mcp_server/tsconfig.json` re-declares `resolveJsonModule: true` which is already set in the root tsconfig it extends. This is harmless but adds maintenance burden.

### H20-06: Root overrides section
The root `package.json` contains `overrides` for `hono` and `tar` (via `onnxruntime-node`). These are security/compatibility patches. The `hono` override (`^4.11.10`) and `tar` override (`^7.5.8`) should be periodically reviewed for continued necessity.

### H20-07: `scripts/package.json` declares `"type": "commonjs"`
The `scripts` package is the only one that explicitly declares `"type": "commonjs"`. The root and other packages rely on the default (commonjs). This is fine but could be made consistent.

---

## Summary

| Metric | Count |
|--------|-------|
| Files scanned | 13 |
| Total issues found | 7 |
| Critical (security) | 0 |
| Consistency violations | 2 (version pin style H20-01, explicit `"type"` H20-07) |
| Missing fields | 1 (shared engines H20-02) |
| Test config gaps | 1 (no coverage thresholds H20-03) |
| Minor/informational | 3 (H20-04, H20-05, H20-06) |

### Issue Priority

| ID | Issue | Severity | Action |
|----|-------|----------|--------|
| H20-01 | Inconsistent dependency pin style across workspaces | P2 | Standardize or document rationale |
| H20-02 | `shared/package.json` missing `engines` field | P2 | Add `"engines": { "node": ">=18.0.0" }` |
| H20-03 | vitest.config.ts has no coverage thresholds | P2 | Add coverage configuration |
| H20-04 | `shared/package.json` is minimal (no scripts/deps) | P3 | Informational -- acceptable for shared types |
| H20-05 | Redundant `resolveJsonModule` in mcp_server tsconfig | P3 | Remove redundant declaration |
| H20-06 | Root overrides should be reviewed periodically | P3 | Add review date comment |
| H20-07 | Only `scripts` declares `"type": "commonjs"` explicitly | P3 | Standardize across packages |

**Overall Assessment:** The configuration is well-structured with a clean inheritance model through tsconfig project references. No security issues were found. The primary gaps are the inconsistent dependency pinning strategy and the absence of coverage thresholds in the test configuration.
