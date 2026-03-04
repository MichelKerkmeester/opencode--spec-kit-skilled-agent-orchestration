# Architecture Boundaries: system-spec-kit

> Canonical ownership contract between `scripts/` and `mcp_server/`. See ADR-001 in the spec folder for decision rationale.

## Ownership Matrix

| Area | Owner | Purpose |
|------|-------|---------|
| `scripts/` | Build-time / CLI | Generation, indexing orchestration, eval runners, operational scripts |
| `mcp_server/` | Runtime | Request handlers, search, scoring, storage, MCP tools |
| `shared/` | Neutral | Reusable modules consumed by both scripts/ and mcp_server/ |
| `mcp_server/api/` | Public boundary | Stable surface for external consumers (scripts, evals, automation) |
| `mcp_server/scripts/` | Compatibility | Wrappers delegating to canonical scripts/ implementations |

## Allowed Dependency Directions

| From | To | Status |
|------|----|--------|
| `scripts/` | `shared/` | **Allowed** |
| `scripts/` | `mcp_server/api/*` | **Allowed** (preferred) |
| `scripts/` | `mcp_server/lib/*` | **FORBIDDEN** — use `api/` or `shared/` instead |
| `mcp_server/` | `shared/` | **Allowed** |
| `mcp_server/lib/` | `mcp_server/api/` | **FORBIDDEN** — api wraps lib, not the reverse |
| `mcp_server/scripts/` | `scripts/dist/*` | **Allowed** — compatibility wrappers only |

## Exception Governance

All exceptions must be registered in `scripts/evals/import-policy-allowlist.json` with:
- **owner**: team or individual responsible
- **reason**: why the exception exists
- **removeWhen**: condition for removing the exception
- **createdAt**: ISO date when exception was created
- **lastReviewedAt**: ISO date of last review
- **expiresAt**: ISO date for sunset (required for wildcard `lib/*` entries)

### Current Exceptions

| File | Import | Reason |
|------|--------|--------|
| `scripts/core/workflow.ts` | `@spec-kit/mcp-server/lib/providers/retry-manager` | Retry logic not yet in shared/ |
| `scripts/core/memory-indexer.ts` | `@spec-kit/mcp-server/lib/search/vector-index` | Vector indexing not exposed via api/ |
| `scripts/core/memory-indexer.ts` | `@spec-kit/mcp-server/core/config` | `DB_UPDATED_FILE` constant needed |
| `scripts/evals/run-performance-benchmarks.ts` | `@spec-kit/mcp-server/lib/*` (multiple) | Benchmark needs direct access to internal metrics |
| `scripts/evals/run-chk210-quality-backfill.ts` | `@spec-kit/mcp-server/lib/*` | Quality backfill accesses internal parsing |
| `scripts/memory/reindex-embeddings.ts` | `@spec-kit/mcp-server/lib/*` (multiple) | Reindex script needs direct access to internals |

## Compatibility Wrappers

`mcp_server/scripts/` contains **only** compatibility wrappers that delegate to canonical implementations in `scripts/`. These are NOT canonical scripts. See `mcp_server/scripts/README.md`.

### Wrapper Removal Criteria

Compatibility wrappers should be removed when both criteria are met:
- All known consumers have migrated to canonical `scripts/` entry points.
- A 2-sprint cool-down has passed with no rollback or support exceptions.

### Wrapper Removal Process

- **Reviewers**: system-spec-kit maintainers and the owning runtime/scripts maintainers for impacted paths.
- **Removal**: delete wrapper file(s), update any remaining docs/runbooks, and remove stale references from compatibility READMEs.
- **Verification**:
  - Run script entry points from canonical `scripts/` paths.
  - Confirm no references remain to removed wrapper paths (`rg "mcp_server/scripts/<name>"`).
  - Confirm CI and operational checks pass for affected workflows.

## Enforcement

| Tool | Path | Purpose |
|------|------|---------|
| Import-policy checker | `scripts/evals/check-no-mcp-lib-imports.ts` | Detects `@spec-kit/mcp-server/lib/*` imports in scripts/ |
| Allowlist | `scripts/evals/import-policy-allowlist.json` | Registered exceptions with ownership |
| API boundary check | `scripts/check-api-boundary.sh` | Checks lib/ → api/ direction |
| Architecture boundary check | `scripts/evals/check-architecture-boundaries.ts` | shared/ neutrality + mcp_server/scripts/ wrapper-only verification |

## Shared Module Policy

`shared/` modules must be stable. Breaking changes require coordination with both consumers (`scripts/` and `mcp_server/`). See `shared/README.md` for module inventory and import conventions.

## Allowlist Removal Criteria

Allowlist entries in `scripts/evals/import-policy-allowlist.json` should be removed when either condition is met:
- The `removeWhen` condition has been satisfied.
- The `expiresAt` date has passed.

## Allowlist Removal Process

- **Reviewers**: allowlist `owner` plus at least one system-spec-kit maintainer.
- **Removal**: delete or narrow the allowlist entry, then migrate caller imports to `mcp_server/api/*` or `shared/*` as applicable.
- **Verification**:
  - Run `scripts/evals/check-no-mcp-lib-imports.ts` and confirm no new violations.
  - Re-run affected evals/workflows that depended on the entry.
  - Update `lastReviewedAt` for retained exceptions.

## Related Documentation

- [mcp_server/api/README.md](mcp_server/api/README.md)
- [scripts/evals/README.md](scripts/evals/README.md)
- [shared/README.md](shared/README.md)
