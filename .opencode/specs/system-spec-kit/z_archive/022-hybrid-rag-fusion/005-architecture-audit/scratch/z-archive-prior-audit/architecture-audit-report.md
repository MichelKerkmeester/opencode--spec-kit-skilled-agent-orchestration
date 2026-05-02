# Architecture Audit Report: system-spec-kit vs mcp_server

Date: 2026-03-04
Scope:
- `.opencode/skill/system-spec-kit/` (all depths, excluding `node_modules/`, `dist/`)
- `.opencode/skill/system-spec-kit/mcp_server/` (all depths, excluding `node_modules/`, `dist/`)

## Phase 1 - Inventory and Mapping

## 1) Directory Trees (Complete)

Complete trees are captured in:
- `scratch/agent1-root-tree-readme-config.md` (root skill tree)
- `scratch/agent2-mcp-tree-readme-config.md` (mcp_server tree)

Top-level excerpts:

```text
.opencode/skill/system-spec-kit/
|-- assets/
|-- config/
|-- constitutional/
|-- mcp_server/
|-- references/
|-- scripts/
|-- shared/
|-- templates/
|-- package.json
`-- tsconfig.json
```

```text
.opencode/skill/system-spec-kit/mcp_server/
|-- api/
|-- configs/
|-- core/
|-- database/
|-- formatters/
|-- handlers/
|-- hooks/
|-- lib/
|-- scripts/
|-- tests/
|-- tools/
|-- utils/
|-- context-server.ts
|-- cli.ts
|-- startup-checks.ts
`-- tool-schemas.ts
```

## 2) Source File Coverage

| Scope | Count | Inventory Artifact |
|---|---:|---|
| root `scripts/**` + root-level sources (`*.ts,*.js,*.mjs,*.cjs,*.sh`) | 152 | `scratch/agent3-root-source-inventory.md` |
| `mcp_server/**` sources (`*.ts,*.js,*.mjs,*.cjs,*.sh`) | 431 | `scratch/agent4-mcp-source-inventory.md` |

Coverage status: all in-scope source files accounted for in per-file tables.

## 3) README Inventory

| Scope | Count | Artifact |
|---|---:|---|
| root skill tree | 34 | `scratch/agent1-root-tree-readme-config.md` |
| mcp_server tree | 33 | `scratch/agent2-mcp-tree-readme-config.md` |

## 4) Config Inventory

Key relationships captured:
- workspace and TS project references across root/shared/scripts/mcp_server
- runtime config loading in `scripts/core/config.ts` and `mcp_server/core/config.ts`
- mcp_server toolchain configs (`package.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`)

Artifacts:
- `scratch/agent1-root-tree-readme-config.md`
- `scratch/agent2-mcp-tree-readme-config.md`

## Phase 2 - Architectural Evaluation

| Criterion | Rating (1-5) | Evidence (violations or weaknesses) |
|---|---:|---|
| Concern Separation | 2 | Overlap in memory/index/eval between `scripts/*` and `mcp_server/*`; duplicate helper responsibilities (`scripts/core/memory-indexer.ts`, `mcp_server/lib/parsing/memory-parser.ts`) |
| Boundary Clarity | 2 | Intent exists in `mcp_server/api/index.ts`, but scripts still import `@spec-kit/mcp-server/lib/*` (`scripts/core/workflow.ts`, `scripts/evals/run-performance-benchmarks.ts`, `scripts/evals/deleted-chk210-quality-backfill-script`) |
| Dependency Direction | 2 | Back-edge wrapper `mcp_server/scripts/reindex-embeddings.ts -> ../../scripts/dist/...`; documented handler cycle (`causal-links-processor -> chunking-orchestrator -> memory-save -> pe-gating -> causal-links-processor`) |
| Naming Consistency | 3 | Most directories consistent; ambiguity remains in `mcp_server/scripts/README.md` (looks general, actually compatibility-only) |
| Discoverability | 3 | Many READMEs exist but no single cross-boundary contract doc; runtime-vs-CLI ownership requires code reading |
| Duplication | 2 | Duplicate/near-duplicate helpers: embeddings shims, quality extractors, token estimators, trigger extraction variants |

## Phase 3 - Recommendations (Sorted by Impact-to-Effort)

1. Create boundary contract doc
- WHY: No single ownership contract exists, so boundary decisions are implicit and inconsistent.
- WHAT: Create `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md`.
- Effort: Low
- Risk: Low
- DX Impact: High

2. Document public API consumer contract
- WHY: `mcp_server/api/*` is intended as boundary but insufficiently discoverable.
- WHAT: Create `.opencode/skill/system-spec-kit/mcp_server/api/README.md` and `.opencode/skill/system-spec-kit/scripts/evals/README.md` policy section.
- Effort: Low
- Risk: Low
- DX Impact: High

3. Enforce API-first imports for scripts
- WHY: Internal `lib/*` imports from scripts create brittle coupling and refactor risk.
- WHAT: Add scripts import-policy checker and allowlist (`.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts`, `.opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json`), then wire it into `.opencode/skill/system-spec-kit/scripts/package.json` checks.
- Effort: Medium
- Risk: Medium
- DX Impact: High

4. Clarify compatibility-wrapper ownership
- WHY: `mcp_server/scripts` can be mistaken for canonical operational scripts.
- WHAT: Retitle/rename `mcp_server/scripts/README.md` to compatibility-only scope and link to canonical runbook.
- Effort: Low
- Risk: Low
- DX Impact: Medium

5. Canonicalize reindex runbook location
- WHY: Reindex procedure is split across multiple docs causing drift risk.
- WHAT: Canonical runbook in `scripts/memory/README.md`; pointer sections in `mcp_server/scripts/README.md` and `mcp_server/database/README.md`.
- Effort: Low
- Risk: Low
- DX Impact: Medium

6. Consolidate duplicate helper logic
- WHY: Duplicate token/quality helper logic increases behavior drift risk.
- WHAT: Create `.opencode/skill/system-spec-kit/shared/utils/token-estimate.ts` and `.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts`; update callsites in `.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts`, `.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`.
- Effort: Medium
- Risk: Medium
- DX Impact: High

7. Break handler cycle
- WHY: Cycle increases maintenance risk and hidden orchestration coupling.
- WHAT: Create `.opencode/skill/system-spec-kit/mcp_server/handlers/orchestration-common.ts` and refactor `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` / `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` / `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` / `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts` so the documented cycle is broken.
- Effort: Medium
- Risk: High
- DX Impact: High

## Evidence Index

- `scratch/agent1-root-tree-readme-config.md`
- `scratch/agent2-mcp-tree-readme-config.md`
- `scratch/agent3-root-source-inventory.md`
- `scratch/agent4-mcp-source-inventory.md`
- `scratch/agent5-architecture-analysis.md`
