# Architecture Boundaries: system-spec-kit

Canonical ownership contract between `scripts/` and `mcp_server/`. Defines allowed dependency directions, exception governance and enforcement tooling.

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP MATRIX](#2--ownership-matrix)
- [3. DEPENDENCY RULES](#3--dependency-rules)
- [4. EXCEPTION GOVERNANCE](#4--exception-governance)
- [5. COMPATIBILITY WRAPPERS](#5--compatibility-wrappers)
- [6. ENFORCEMENT](#6--enforcement)
- [7. SHARED MODULE POLICY](#7--shared-module-policy)
- [8. RELATED DOCUMENTS](#8--related-documents)

---

## 1. OVERVIEW

The `system-spec-kit` codebase splits into three ownership zones: **build-time scripts**, **runtime MCP server** and **shared modules**. Each zone has a clear purpose and strict import rules that prevent coupling between build-time and runtime code.

The `mcp_server/api/` surface acts as the stable boundary. Scripts that need runtime functionality must import through `api/` or `shared/`, never directly from `mcp_server/lib/`.

See ADR-001 in the spec folder for the full decision rationale.

---

## 2. OWNERSHIP MATRIX

| Area | Owner | Purpose |
|------|-------|---------|
| `scripts/` | Build-time / CLI | Generation, indexing orchestration, eval runners, operational scripts |
| `mcp_server/` | Runtime | Request handlers, search, scoring, storage, MCP tools |
| `shared/` | Neutral | Reusable modules consumed by both `scripts/` and `mcp_server/` |
| `mcp_server/api/` | Public boundary | Stable surface for external consumers (scripts, evals, automation) |
| `mcp_server/scripts/` | Compatibility | Wrappers delegating to canonical `scripts/` implementations |

---

## 3. DEPENDENCY RULES

### Allowed Directions

| From | To | Status |
|------|----|--------|
| `scripts/` | `shared/` | **Allowed** |
| `scripts/` | `mcp_server/api/*` | **Allowed** (preferred) |
| `mcp_server/` | `shared/` | **Allowed** |
| `mcp_server/scripts/` | `scripts/dist/*` | **Allowed** (compatibility wrappers only) |

### Forbidden Directions

| From | To | Why |
|------|----|-----|
| `scripts/` | `mcp_server/lib/*` | Use `api/` or `shared/` instead |
| `mcp_server/lib/` | `mcp_server/api/` | `api/` wraps `lib/`, not the reverse |

---

## 4. EXCEPTION GOVERNANCE

All exceptions must be registered in `scripts/evals/import-policy-allowlist.json` with these fields:

| Field | Required | Description |
|-------|----------|-------------|
| `owner` | Yes | Team or individual responsible |
| `reason` | Yes | Why the exception exists |
| `removeWhen` | Yes | Condition for removing the exception |
| `createdAt` | Yes | ISO date when exception was created |
| `lastReviewedAt` | Yes | ISO date of last review |
| `expiresAt` | Wildcard only | ISO date for sunset (required for `lib/*` entries) |

### Current Exceptions

| File | Import | Reason |
|------|--------|--------|
| `scripts/evals/run-performance-benchmarks.ts` | `@spec-kit/mcp-server/lib/*` (multiple) | Benchmark needs direct access to internal metrics |
| `scripts/evals/run-chk210-quality-backfill.ts` | `@spec-kit/mcp-server/lib/*` | Quality backfill accesses internal parsing |

### Removal Criteria

Remove an allowlist entry when either condition is met:

- The `removeWhen` condition has been satisfied
- The `expiresAt` date has passed

### Removal Process

1. **Review**: Allowlist `owner` plus at least one `system-spec-kit` maintainer must approve
2. **Migrate**: Delete or narrow the allowlist entry, then move caller imports to `mcp_server/api/*` or `shared/*`
3. **Verify**:
   - Run `scripts/evals/check-no-mcp-lib-imports.ts` and confirm no new violations
   - Re-run affected evals and workflows that depended on the entry
   - Update `lastReviewedAt` for retained exceptions

---

## 5. COMPATIBILITY WRAPPERS

`mcp_server/scripts/` contains **only** compatibility wrappers that delegate to canonical implementations in `scripts/`. These are not canonical scripts. See `mcp_server/scripts/README.md`.

### Removal Criteria

Remove a compatibility wrapper when both criteria are met:

- All known consumers have migrated to canonical `scripts/` entry points
- A 2-sprint cool-down has passed with no rollback or support exceptions

### Removal Process

1. **Review**: `system-spec-kit` maintainers and the owning runtime/scripts maintainers for impacted paths
2. **Remove**: Delete wrapper file(s), update any remaining docs/runbooks, remove stale references from compatibility READMEs
3. **Verify**:
   - Run script entry points from canonical `scripts/` paths
   - Confirm no references remain to removed wrapper paths (`rg "mcp_server/scripts/<name>"`)
   - Confirm CI and operational checks pass for affected workflows

---

## 6. ENFORCEMENT

| Tool | Path | Purpose |
|------|------|---------|
| Import-policy checker | `scripts/evals/check-no-mcp-lib-imports.ts` | Detects `@spec-kit/mcp-server/lib/*` imports in `scripts/` |
| AST import-policy checker | `scripts/evals/check-no-mcp-lib-imports-ast.ts` | AST-level import detection (multiline, comment-safe, re-export graph) |
| AST handler-cycle checker | `scripts/evals/check-handler-cycles-ast.ts` | Detects circular imports across `mcp_server/handlers/` |
| Allowlist | `scripts/evals/import-policy-allowlist.json` | Registered exceptions with ownership metadata |
| API boundary check | `scripts/check-api-boundary.sh` | Checks `lib/` to `api/` direction |
| Architecture boundary check | `scripts/evals/check-architecture-boundaries.ts` | `shared/` neutrality + `mcp_server/scripts/` wrapper-only verification |
| CI workflow | `.github/workflows/system-spec-kit-boundary-enforcement.yml` | Runs baseline + AST boundary checks on PRs and pushes |

---

## 7. SHARED MODULE POLICY

`shared/` modules must be stable. Breaking changes require coordination with both consumers (`scripts/` and `mcp_server/`). See `shared/README.md` for module inventory and import conventions.

---

## 8. RELATED DOCUMENTS

- [mcp_server/api/README.md](mcp_server/api/README.md) - Public API boundary surface
- [scripts/evals/README.md](scripts/evals/README.md) - Eval scripts and boundary enforcement
- [shared/README.md](shared/README.md) - Shared module inventory and conventions
