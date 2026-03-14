## Agent I05: Cross-Workspace Dependency Verification

**Date:** 2026-03-08
**Base path:** `.opencode/skill/system-spec-kit`
**Workspaces:** `shared`, `mcp_server`, `scripts`

---

### Summary

The monorepo uses npm workspaces with TypeScript project references. All three workspaces are correctly referenced in both the root `tsconfig.json` and root `package.json`. All workspace `tsconfig.json` files have `composite: true`. One version conflict (`better-sqlite3`) and one engine inconsistency (`shared` vs root) were found. No lock file staleness issues detected.

**Verdict: PASS with 1x P1 and 2x P2 findings**

---

### tsconfig References

| Check | Status | Details |
|-------|--------|---------|
| Root `tsconfig.json` references all 3 workspaces | PASS | `["./shared", "./mcp_server", "./scripts"]` |
| Root `tsconfig.json` has `composite: true` | PASS | Line 14 |
| `shared/tsconfig.json` has `composite: true` | PASS | Line 4 |
| `mcp_server/tsconfig.json` has `composite: true` | PASS | Line 4 |
| `scripts/tsconfig.json` has `composite: true` | PASS | Line 4 |
| All workspace tsconfigs extend root | PASS | All use `"extends": "../tsconfig.json"` |

**Reference graph consistency:**

- `shared/tsconfig.json` references: *none* (leaf workspace -- correct)
- `mcp_server/tsconfig.json` references: `../shared` (correct -- depends on shared only)
- `scripts/tsconfig.json` references: `../shared`, `../mcp_server` (correct -- depends on both)

This matches the actual import graph:
- `mcp_server` imports from `@spec-kit/shared` (70+ imports across source and tests)
- `scripts` imports from `@spec-kit/shared` AND `@spec-kit/mcp-server` (20+ imports)
- `shared` has zero cross-workspace imports (leaf node)

**Result: All tsconfig references are consistent and correctly ordered.**

---

### Package.json Consistency

#### Root package.json

| Field | Value | Status |
|-------|-------|--------|
| `workspaces` | `["shared", "mcp_server", "scripts"]` | PASS -- matches tsconfig references |
| `engines.node` | `>=18.0.0` | See P2 below |
| Root `typescript` devDep | `^5.9.3` | Matches mcp_server devDep |

#### Workspace dependency declarations

| Workspace | Declares dependencies on | Actual imports from | Match? |
|-----------|-------------------------|-------------------|--------|
| `shared` | *none* | *none* | PASS |
| `mcp_server` | *none* (relies on npm workspace resolution) | `@spec-kit/shared` | PASS (implicit via workspace) |
| `scripts` | *none* (relies on npm workspace resolution) | `@spec-kit/shared`, `@spec-kit/mcp-server` | PASS (implicit via workspace) |

**Note:** Neither `mcp_server/package.json` nor `scripts/package.json` explicitly declares `@spec-kit/shared` or `@spec-kit/mcp-server` as a dependency. This works because npm workspaces resolve `@spec-kit/*` packages automatically from the monorepo root. This is a valid pattern for private monorepos but could cause issues if workspaces are ever published independently.

---

### Version Conflicts

#### Workspace version alignment

| Package | shared | mcp_server | scripts | Root | Status |
|---------|--------|------------|---------|------|--------|
| Package version | 1.7.2 | 1.7.2 | 1.7.2 | 1.7.2 | PASS |
| `better-sqlite3` | -- | `^12.6.2` | `12.6.2` (pinned) | -- | **P1** |
| `sqlite-vec` | -- | `^0.1.7-alpha.2` | `0.1.7-alpha.2` (pinned) | -- | P2 |
| `typescript` | -- | `^5.9.3` (devDep) | -- | `^5.9.3` (devDep) | PASS |
| `@huggingface/transformers` | -- | `^3.8.1` | -- | `^3.8.1` (devDep) | PASS |
| `onnxruntime-common` | -- | `^1.21.0` | -- | `^1.21.0` | PASS |

**`better-sqlite3` conflict detail:**
- `mcp_server` declares `"better-sqlite3": "^12.6.2"` (caret range, allows 12.x.x)
- `scripts` declares `"better-sqlite3": "12.6.2"` (exact pin, only 12.6.2)

In practice npm workspace hoisting means both workspaces will use the same resolved version, so this is unlikely to cause a runtime issue. However, the inconsistency signals different intent: scripts pins for reproducibility while mcp_server allows patch updates. This should be normalized.

**`sqlite-vec` similar pattern:**
- `mcp_server`: `"^0.1.7-alpha.2"` (caret)
- `scripts`: `"0.1.7-alpha.2"` (pinned)

Same mismatch pattern as `better-sqlite3`.

#### Engine requirement inconsistency

| Workspace | `engines.node` |
|-----------|----------------|
| Root | `>=18.0.0` |
| shared | `>=20.0.0` |
| mcp_server | `>=18.0.0` |
| scripts | `>=18.0.0` |

`shared` requires Node >= 20 while all others require >= 18. Since both `mcp_server` and `scripts` depend on `shared`, the effective minimum for the entire monorepo is Node 20 -- but root and the other workspaces advertise Node 18 compatibility.

---

### Lock File

| Check | Status | Details |
|-------|--------|---------|
| `package-lock.json` exists | PASS | Present at root |
| `bun.lock` exists | N/A | Not present (npm-based project) |
| Lock file in sync | ASSUMED PASS | Lock file exists; `npm ci` or `npm install` would fail if out of sync. No `npm install --dry-run` executed to verify (read-only agent). |

---

### Findings [P0/P1/P2/P3]

#### P0 (Blockers)

*None found.*

#### P1 (Required)

| # | Finding | Location | Impact | Recommendation |
|---|---------|----------|--------|----------------|
| 1 | **Version specifier mismatch: `better-sqlite3`** | `scripts/package.json:18` pinned `12.6.2` vs `mcp_server/package.json:38` caret `^12.6.2` | Both workspaces share a native binary module (`better-sqlite3`). Inconsistent version specifiers could cause subtle ABI mismatches if hoisting behavior changes or workspaces are run in isolation. Native modules are particularly sensitive to version differences. | Normalize to the same specifier. If pinning is desired for native module stability, pin in both: `"better-sqlite3": "12.6.2"`. If flexibility is desired, use caret in both. |

#### P2 (Suggestions)

| # | Finding | Location | Impact | Recommendation |
|---|---------|----------|--------|----------------|
| 1 | **Version specifier mismatch: `sqlite-vec`** | `scripts/package.json:19` pinned vs `mcp_server/package.json:40` caret | Same class of issue as `better-sqlite3` but lower severity since `sqlite-vec` is a JS extension, not a compiled native module. | Normalize specifiers for consistency. |
| 2 | **Engine requirement inconsistency** | `shared/package.json:12` requires `>=20.0.0`; root, mcp_server, scripts all require `>=18.0.0` | Misleading: the monorepo effectively requires Node 20+ because shared is a hard dependency, but root/mcp_server/scripts advertise Node 18 compat. A developer running Node 18 would get no warning from root/mcp_server/scripts but could hit failures from shared code. | Either raise all `engines.node` to `>=20.0.0` or lower shared to `>=18.0.0` if the Node 20 requirement is not actually needed. |
| 3 | **Implicit workspace dependencies** | `mcp_server/package.json`, `scripts/package.json` | Neither `mcp_server` nor `scripts` explicitly declares `@spec-kit/shared` (or `@spec-kit/mcp-server` for scripts) in their `dependencies`. This relies entirely on npm workspace resolution. If any workspace were published or extracted, the dependency graph would be broken. | Consider adding explicit workspace dependency declarations: `"@spec-kit/shared": "workspace:*"` in both mcp_server and scripts package.json files. This makes the dependency graph explicit and supports future extraction. |

#### P3 (Informational)

| # | Finding | Details |
|---|---------|---------|
| 1 | Root has `overrides` for `hono` and `onnxruntime-node > tar` | These pin transitive deps. Verify periodically that these overrides are still needed. |
| 2 | `@huggingface/transformers` appears in both root devDeps and mcp_server deps | Root: `devDependencies`, mcp_server: `dependencies`. This is intentional (root for type checking, mcp_server for runtime) but worth documenting. |

---

### Adversarial Self-Check (P1 Findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| `better-sqlite3` version specifier mismatch (pinned vs caret) | P1 | "npm workspace hoisting resolves both to the same version; no actual runtime divergence today" | Confirmed P1: native binary modules are high-risk for ABI issues; hoisting behavior is an implementation detail that could change; the intent mismatch is real and should be normalized | **P1** |

---

### Verdict

**PASS** -- The cross-workspace dependency structure is sound. All tsconfig references correctly mirror the actual import graph. All workspace versions are aligned at 1.7.2. The lock file is present.

One P1 finding (native module version specifier mismatch) should be addressed to prevent future risk. Three P2 suggestions improve hygiene but are not blocking.

| Dimension | Assessment |
|-----------|-----------|
| tsconfig references | Correct and complete |
| package.json workspaces | Correct and complete |
| composite flag | All workspaces have `composite: true` |
| Version conflicts | 1x P1 (better-sqlite3), 1x P2 (sqlite-vec) |
| Engine consistency | P2 (shared requires Node 20, rest say 18) |
| Lock file | Present (package-lock.json) |
| Import graph vs declarations | Consistent |
