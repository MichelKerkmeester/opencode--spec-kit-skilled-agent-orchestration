# Architecture Audit V3 -- Unified Master Report

**Date**: 2026-03-21
**Auditors**: 20 specialized agents (C01-C10 code agents, O01-O10 organizational agents)
**Scope**: Full-stack audit of system-spec-kit MCP server, scripts, shared modules, specs, and documentation
**Model**: Claude Opus 4.6 (1M context)

---

## 1. Executive Summary

Twenty audit agents reviewed the entire system-spec-kit codebase and specification tree. The audit covered handler architecture, database/storage, search/scoring, memory pipeline, scripts/utilities, shared modules, import policy, test coverage, build configuration, type safety, epic consistency, spec-code alignment, self-audit verification, feature catalog completeness, Hydra DB architecture, session capturing pipeline, alignment specs, documentation quality, cross-spec dependencies, and bug/regression scanning.

### Aggregate Finding Counts

| Severity | Count |
|----------|-------|
| CRITICAL | 14 |
| HIGH | 42 |
| MEDIUM | 52 |
| LOW | 30 |
| PASS/INFO | 7 |
| **Total** | **145** |

### Per-Agent Breakdown

| Agent | Domain | Findings | C | H | M | L |
|-------|--------|----------|---|---|---|---|
| C01 | Handler Analysis | 10 | 1 | 4 | 2 | 3 |
| C02 | Database/Storage | 6 | 0 | 2 | 3 | 1 |
| C03 | Search/Scoring | 7 | 0 | 2 | 5 | 0 |
| C04 | Memory Pipeline | 8 | 0 | 4 | 4 | 0 |
| C05 | Scripts/Lib | 14 | 0 | 6 | 4 | 1+(3 dead code) |
| C06 | Shared Boundary | 6 | 0 | 2 | 2 | 2 |
| C07 | Import Policy | 4 | 0 | 1 | 2 | 1 |
| C08 | Test Coverage | 10 | 0 | 4 | 4 | 1+(1 obs) |
| C09 | Build/Config | 5 | 0 | 3 | 2 | 0 |
| C10 | Type Safety | 5 | 0 | 0 | 4 | 1 |
| O01 | Epic Consistency | 21 | 3 | 8 | 6 | 4 |
| O02 | Spec-Code Alignment (002-004) | 8 | 0 | 1 | 0 | 4+(3 PASS) |
| O03 | Self-Audit (005) | 7 | 0 | 1 | 3 | 3 |
| O04 | Feature Catalog | 15 | 1 | 4 | 7 | 3 |
| O05 | Hydra DB Review | 12 | 0 | 3 | 6 | 3 |
| O06 | Session Capturing | 11 | 1 | 3 | 5 | 2 |
| O07 | Alignment Specs (010-013) | 9 | 0 | 2 | 2 | 5 |
| O08 | Documentation Quality | 17 | 2 | 6 | 7 | 2 |
| O09 | Cross-Spec Dependencies | 13 | 2 | 4 | 4 | 3 |
| O10 | Bug/Regression Scan | 25 | 3 | 7 | 8 | 7 |

---

## 2. CRITICAL Findings (14 total, deduplicated)

### CR-01: `memory-save.ts` is a 1,402 LOC god object acting as transport, orchestrator, governance engine, and enrichment pipeline
- **Source**: C01-002
- **Location**: `mcp_server/handlers/memory-save.ts`
- **Description**: The file imports persistence, parsing, quality scoring, governance, collaboration, deduplication, embeddings, PE gating, reconsolidation, post-insert enrichment, causal processing, and response building. It is effectively the entire save service layer living inside the handler directory.
- **Impact**: Every save-path change couples MCP transport, domain rules, persistence, and post-processing. Testing is expensive, reuse is awkward, and future decomposition is risky.
- **Recommended Fix**: Create `lib/save/memory-save-service.ts` orchestration service. Keep the handler limited to request validation, service invocation, and envelope formatting.

### CR-02: Epic spec folder count drastically understated (51 claimed vs 102 actual)
- **Source**: O01-001
- **Location**: `022-hybrid-rag-fusion/spec.md` lines 41, 304
- **Description**: The epic claims 51 total folders. The actual count on disk is 102. Missing from the count: 001's 10 sprint children, 009's 20+5 children, 010's 1 child, 014's 19 children, and the orphan folder.
- **Impact**: All complexity estimates, validation runs, and governance decisions based on the "51 folders" figure are misinformed. Program scale is underestimated by 2x.
- **Recommended Fix**: Update metadata to reflect actual count (~102) with an itemized breakdown.

### CR-03: Epic feature count stale (189 claimed vs 195 actual)
- **Source**: O01-002
- **Location**: `022-hybrid-rag-fusion/spec.md` lines 3, 21, 41, 215
- **Description**: The epic claims 189 features across 19 categories. Actual count is 195 snippet files. At least 2 categories have wrong per-category counts.
- **Impact**: Feature counts drive audit coverage targets and code-audit phase mapping. A 6-feature gap means some features may lack corresponding audit or test coverage.
- **Recommended Fix**: Update Section 5 feature table to match actual on-disk counts.

### CR-04: Phase number collision -- two phases numbered 009 in dashboard
- **Source**: O01-003, O09-011 (deduplicated)
- **Location**: `022-hybrid-rag-fusion/spec.md` lines 98-99
- **Description**: The dashboard lists two distinct phases both numbered 009: "Skill Alignment" and "Perfect Session Capturing". The skill alignment folder is actually numbered 010.
- **Impact**: Uniqueness invariant is broken. Automation and agents that parse the dashboard will fail to find the correct phase folders.
- **Recommended Fix**: Change the Skill Alignment row to 010 in both the Phase Status Dashboard and Phase Documentation Map.

### CR-05: Duplicate phase number 017 on disk
- **Source**: O09-001, O10-010 (deduplicated)
- **Location**: `022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/` and `022-hybrid-rag-fusion/017-spec-folder-alignment-audit/`
- **Description**: Two folders share phase number 017. The first has a complete spec (Level 1, In Progress). The second contains only an empty `scratch/` directory with no spec.md.
- **Impact**: Phase numbering collision breaks the 1:1 phase-to-number contract. References to "phase 017" are ambiguous.
- **Recommended Fix**: Delete the empty `017-spec-folder-alignment-audit` folder (its content, a single audit findings report, can be archived to 005's scratch).

### CR-06: 14 snippet files not referenced in feature catalog monolith index
- **Source**: O04-001
- **Location**: `feature_catalog/feature_catalog.md`
- **Description**: 14 individual snippet files exist on disk but have no corresponding entry or file reference in the monolith index. The index has 184 file references but 194 snippet files exist.
- **Impact**: Developers navigating the monolith index will miss 14 features. Automated tooling that parses the index will undercount.
- **Recommended Fix**: Add proper references for all 14 orphaned snippets in the monolith index.

### CR-07: Root README references non-existent `dist/index.js` entry point
- **Source**: O08-001
- **Location**: Root `README.md` lines 173, 566, 722
- **Description**: The root README references `mcp_server/dist/index.js` as the MCP server entry point in three places. This file does not exist. The correct entry point is `dist/context-server.js`.
- **Impact**: Anyone following the Quick Start or Troubleshooting section will get a "Cannot find module" error.
- **Recommended Fix**: Replace all three occurrences of `dist/index.js` with `dist/context-server.js`.

### CR-08: MCP tool count mismatch: 33 in source, 32 claimed everywhere
- **Source**: O08-002
- **Location**: Multiple files (MCP README, Spec Kit README, Root README, CLAUDE.md, package.json)
- **Description**: `tool-schemas.ts` defines exactly 33 tools, but every documentation surface claims 32. The discrepancy originates from the MCP README listing L2 as 3 tools when the actual count is 4. Package.json is even worse, claiming "28 tools".
- **Impact**: All documentation surfaces are off by 1. Package metadata is off by 5.
- **Recommended Fix**: Update all documentation surfaces to 33. Update package.json from "28" to "33".

### CR-09: 019-architecture-remediation has 8 unstarted remediation sprints (197 findings)
- **Source**: O06-005, O10-003 (deduplicated)
- **Location**: `009-perfect-session-capturing/019-architecture-remediation/`
- **Description**: The 15-agent architecture audit identified 197 unique findings organized into 8 sprints (S1-S8). All 90 checklist items (15 P0, 31 P1, 44 P2) remain unchecked. Sprint S1 alone has 12 CRITICAL findings including stale dist artifacts and broken ops scripts.
- **Impact**: 15 P0 items are hard blockers. Key issues include potential race conditions in concurrent saves, broken barrel exports, type naming collisions, and stale ops scripts.
- **Recommended Fix**: Begin Sprint S1 (Critical/Blocking Fixes) immediately. S1 resolves 22 findings in an estimated 4-6 hours.

### CR-10: Stale dist artifacts for deleted eval scripts
- **Source**: O10-001
- **Location**: `scripts/dist/evals/`
- **Description**: Stale `.d.ts.map`, `.js.map`, `.js`, `.d.ts` files remain for 4 deleted/renamed eval scripts: `run-chk210-quality-backfill`, `run-phase1-5-shadow-eval`, `run-phase3-telemetry-dashboard`, and `run-quality-legacy-remediation`.
- **Impact**: Confuses tooling and developers about what is actually available; dist may drift from source.
- **Recommended Fix**: Delete all stale dist artifacts. Rebuild dist with `npx tsc --build`.

### CR-11: Stale dist artifacts for relocated structure-aware-chunker
- **Source**: O10-002
- **Location**: `scripts/dist/lib/structure-aware-chunker.*`
- **Description**: Four stale dist files remain even though the module now lives at `shared/lib/structure-aware-chunker.ts`.
- **Impact**: Consumers may accidentally import from the wrong dist location.
- **Recommended Fix**: Delete the stale `scripts/dist/lib/structure-aware-chunker.*` files.

### CR-12: Epic dashboard missing phases 014-018 entirely
- **Source**: O09-002
- **Location**: `001-hybrid-rag-fusion-epic/spec.md` lines 77-97
- **Description**: The dashboard table lists phases 001-013 but omits phases 014-018. All five phases exist on disk with active spec.md files. Phase 014 alone has 19 child folders.
- **Impact**: The parent epic does not reflect the actual phase tree. Anyone reading the dashboard would not know phases 014-018 exist.
- **Recommended Fix**: Add rows for 014-018 to the dashboard with correct status and child counts.

### CR-13: Epic claims 9 phases are "Stub" when they are actually Complete or In-Progress
- **Source**: O01-006 through O01-010, O01-012 (aggregated)
- **Location**: `022-hybrid-rag-fusion/spec.md` Phase Status Dashboard
- **Description**: Phases 010-014 are labeled "Stub / Empty scaffold" but are actually: 010 Complete, 011 Complete, 012 Complete, 013 Complete (no status field), 014 Draft with 19 children and 213 scenarios. Phases 015-018 are labeled "Stub" but are actually "In Progress" with substantive specs.
- **Impact**: 50% status alignment rate. Planning will waste effort re-planning already-delivered work. An entire 19-folder testing hierarchy (014) is invisible.
- **Recommended Fix**: Update all 9 rows in the Phase Status Dashboard to reflect actual status with correct child counts and key metrics.

### CR-14: `999-finalization` folder referenced in epic but does not exist
- **Source**: O01-004
- **Location**: `022-hybrid-rag-fusion/spec.md` lines 108, 137
- **Description**: The epic references a `999-finalization` folder with 7 children (phases 012-018) as "Pending". No such folder exists on disk. The phases it lists as children are direct children of the epic root.
- **Impact**: The entire "finalization" concept is a phantom. Agents attempting to navigate to 999-finalization will get filesystem errors.
- **Recommended Fix**: Remove all references to `999-finalization`. Document phases 012-018 as direct children with their actual status.

---

## 3. HIGH Findings (42 total, deduplicated)

### Handler Architecture (C01)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C01-001 | 9 handlers exceed 500 LOC threshold | `handlers/` (9 files, 591-1402 LOC) | The largest files are 600-1400 LOC and span multiple architectural concerns. Reviewability and change isolation are degraded. |
| C01-003 | `memory-search.ts` contains the search service (1263 LOC) | `handlers/memory-search.ts` | Pipeline execution, session management, routing, telemetry, eval logging, trace construction, formatting, and fallback behavior all live inside the handler. |
| C01-004 | `memory-context.ts` imports sibling handlers directly | `handlers/memory-context.ts:16` | Creates circular-import pressure by importing `handleMemorySearch` and `handleMemoryMatchTriggers` from sibling handlers instead of a shared service. |
| C01-006 | Save mutex queue suppresses prior failures with empty catch | `handlers/memory-save.ts:128` | The per-spec-folder lock chain discards failure context with `.catch((_error) => {})`, making lock poisoning and race-related failures harder to diagnose. |

### Database/Storage (C02)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C02-002 | Conflict deprecation can commit without creating supersedes edge | `lib/storage/reconsolidation.ts:336` | `insertEdge()` returns `null` for several failure modes without throwing; the transaction can commit a deprecated memory with no causal link to its replacement. |
| C02-003 | "Atomic Save" allows cross-resource split-brain state | `lib/storage/transaction-manager.ts:203` | If rename fails after DB commit, the database points at state not yet present at the final filesystem path. Known limitation documented but not resolved. |

### Search/Scoring (C03)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C03-001 | Attention score alias overwrites the attention channel | `lib/search/pipeline/stage2-fusion.ts:167` | `attentionScore` is synced to equal the final ranking score, destroying the intended separation between session/attention signals and composite scores. Trace output can no longer distinguish "attention" from final ranking. |
| C03-003 | Flat-score normalization promotes zero-signal batches to 1.0 | `lib/scoring/composite-scoring.ts:853` | Any all-equal batch is normalized to `1.0`, turning flat or zero-signal result sets into perfect-confidence scores. Repeated in RSF and deprecated hybrid fallback. |

### Memory Pipeline (C04)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C04-001 | Filename de-duplication is not atomic; concurrent saves can overwrite | `scripts/core/workflow.ts:977`, `scripts/core/file-writer.ts:147` | Process-local lock only; `file-writer.ts` backs up and overwrites instead of treating collision as conflict. Two overlapping saves for same spec folder can lose a memory file entirely. |
| C04-002 | Vector index write failures silently downgraded to "embedding unavailable" | `scripts/core/memory-indexer.ts:148` | `indexMemory()` catches vector-write exceptions and returns `null`; workflow interprets as benign "embedding unavailable" instead of real write failure. |
| C04-003 | Post-save HIGH findings are advisory only; known-bad memories still indexed | `scripts/core/workflow.ts:2323` | The workflow prints the review result and continues directly into semantic indexing with no abort, exit-code, or retry path. |
| C04-004 | Orphan cleanup cannot remove stale searchable rows for deleted files | `scripts/memory/cleanup-orphaned-vectors.ts:72` | Cleanup only deletes rows missing `memory_index` parent; never checks whether `memory_index` row still points at a real file on disk. |

### Scripts/Lib (C05)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C05-001 | Default `npm run check` leaves AST-only import-policy bypasses unguarded | `scripts/package.json:15` | The AST checker is only in `check:ast`, not in the default `check` pipeline. Multi-hop barrel chains and non-`.ts` files are outside the default gate. |
| C05-002 | AST import-policy checker misses `import = require()` and `import()` type refs | `scripts/evals/check-no-mcp-lib-imports-ast.ts:207` | Two valid TypeScript import forms are outside the only deep checker. |
| C05-003 | Both import-policy checkers silently scan wrong directory when compiled | `scripts/evals/check-no-mcp-lib-imports.ts:55` | `SCRIPTS_ROOT = path.resolve(__dirname, '..')` resolves to `scripts/dist` in compiled mode instead of `scripts/`. |
| C05-005 | Redaction calibration false-positive rate uses wrong denominator | `scripts/evals/run-redaction-calibration.ts:84` | Rate computed against total tokens (every whitespace token) instead of detection count. Can print PASS for a detector that is mostly false positives. |
| C05-006 | Benchmark gates CHK-113/114 do not enforce performance | `scripts/evals/run-performance-benchmarks.ts:426` | Gates pass when counts match and numbers are finite, with no latency ceiling or acceptable slowdown threshold. |
| C05-007 | Redaction calibration bypasses import policy with wrong runtime path | `scripts/evals/run-redaction-calibration.ts:75` | Dynamic `require()` bypasses both import-policy checkers and points at a path that does not exist in this workspace. |

### Shared Boundary (C06)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C06-001 | Shared path helpers runtime-coupled to `mcp_server/database` | `shared/config.ts:23` | Hard-codes `mcp_server/database` directory checks, making the shared package non-neutral for reuse. |
| C06-002 | Two incompatible `DegradedModeContract` exports in shared surface | `shared/index.ts:180` | One in `algorithms/adaptive-fusion.ts` (camelCase), one in `contracts/retrieval-trace.ts` (snake_case + extra field). Barrel workaround already present. |

### Import Policy (C07)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C07-001 | Package alias traversal bypasses forbidden-import detection | `scripts/evals/import-policy-rules.ts:20` | `@spec-kit/mcp-server/api/../lib/...` resolves to forbidden `mcp_server/lib/*` but passes both checkers. True policy bypass. |

### Test Coverage (C08)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C08-001 | Root test pipeline omits scripts and shared test surfaces | `package.json:19` | Root `npm test` delegates only to `mcp_server` workspace plus two smoke checks. 332 `.vitest.ts` files exist but scripts/shared suites are not executed. |
| C08-002 | Test naming and runner coverage are inconsistent | `mcp_server/vitest.config.ts:15` | Config includes only `tests/**/*.vitest.ts` but repo has `.test.ts`, `.vitest.js`, and compiled test output in `dist/tests`. |
| C08-003 | Test suite does not typecheck (old error-envelope shape) | `tests/shared-memory-handlers.vitest.ts:129` | Tests dereference `envelope.data.details.reason` but `details` is optional. `npm run typecheck` fails on this file. |
| C08-004 | Many "deferred" suites are placeholders or source-string checks | `tests/interfaces.vitest.ts:477` | 45 deferred test blocks, some literal no-ops (`expect(true).toBe(true)`), some only regex-match source files. Creates false confidence. |

### Build/Config (C09)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| C09-001 | Production TS build includes test sources and currently fails | `mcp_server/tsconfig.json:17` | `**/*.ts` pulls Vitest suite into `tsc --build` graph. Both `npm run build` and `npm run typecheck` exit with code 2. |
| C09-003 | Workspace packages rely on root symlinks instead of declared dependencies | `scripts/package.json:17` | Internal packages consumed via TS `paths` and source imports but not declared in consuming manifests. Only works because root install creates `node_modules/@spec-kit/*` symlinks. |
| C09-004 | `@spec-kit/shared` uses runtime dependencies its manifest does not own | `shared/package.json:1` | Imports `@huggingface/transformers` at runtime but `shared/package.json` has zero dependencies. Only works through workspace root. |

### Epic/Spec Consistency (O01-O09)

| ID | Title | Location | Description |
|----|-------|----------|-------------|
| O01-005 | Phase 005 claimed Complete but spec says In-Progress | `022-hybrid-rag-fusion/spec.md:94` vs `005/spec.md` | Epic dashboard says "Complete" but child spec has `status: "in-progress"`. Checklist is 157/157 complete but status never updated. |
| O01-006-009 | Phases 010-013 claimed Stub but are actually Complete | Epic dashboard | Four phases labeled "Stub / Empty scaffold" are fully completed Level 2 spec folders. |
| O01-010 | Phase 014 claimed Stub but has 19 children and 213 scenarios | Epic dashboard line 103 | Single largest discrepancy. An entire manual testing hierarchy is invisible in the epic. |
| O01-011 | Phase 001 children count is 0 but actually 10 | Epic documentation map | Sprint children 001-010 are not counted. |
| O02-006 | Test isolation failure: duplicate-content no-op test fails in combined run | `tests/memory-save-ux-regressions.vitest.ts:218` | Test expects `'duplicate'` but receives `'reinforced'` in combined suite run. DB state from other test files affects content-hash dedup. |
| O03-001 | ARCHITECTURE.md exception table missing 4th allowlist entry | `ARCHITECTURE.md:199` | Table shows 3 entries but allowlist JSON has 4. Added on 2026-03-15 but never reflected. |
| O04-003 | Phase 016-tooling-and-scripts status contradiction | `007/016/spec.md` | Parent 007 says "Complete" but child 016 says "Draft". All 19 tasks are marked complete. |
| O04-005 | T100 already done but still marked pending | `006/tasks.md` | Replacement of `retry.vitest.ts` references was completed but task checkbox remains unchecked. |
| O04-011 | 30 Phase F remediation tasks still pending in 006 | `006/tasks.md` | At least T100 done, T101/T102 are false positives. Actual remaining work is unknown. Feature catalog description accuracy remains at 49.4% vs 95% target. |
| O04-002 | Section 20 (PHASE SYSTEM) has no snippet files | Feature catalog index section 20 | 4 H3 feature entries exist inline but no corresponding `20--phase-system/` folder with individual snippet files. |
| O05-002 | Shadow scoring write path permanently disabled -- Phase 4 "Complete" overstated | `lib/eval/shadow-scoring.ts:16` | Phase 4 core deliverable (shadow-mode adaptive ranking) is undermined. The A/B evaluation pipeline is broken. |
| O05-003 | `asOf` temporal queries not exposed through any MCP tool | `tools/*.ts` | Phase 2 claims `asOf` as delivered but no tool definition exposes it. The capability exists at storage layer only. |
| O05-012 | Spec-claimed phase dependencies not enforced at runtime | `lib/search/vector-index-schema.ts:1824` | All Hydra subsystems are always initialized regardless of phase. The phased rollout model was a development methodology, not a runtime construct. |
| O06-001 | Parent docs reference non-existent "Phase 020" | `009/plan.md:7`, `tasks.md:7`, `decision-record.md:7` | Trigger phrases and rollback procedures reference a phase 020 that does not exist. |
| O06-003 | Sub-Child 005-live-proof still in progress | `000-dynamic-capture-deprecation/005/` | Last blocker for claiming universal session capture parity. Tasks T002-T004 are still open. |
| O06-011 | Rollback procedure references non-existent Phase 020 | `009/plan.md:209` | Rollback steps reference "phases 018 through 020" but phase 020 does not exist. |
| O07-002 | Agent drift has recurred 6 days after 012 sync | `.claude/agents/write.md`, `.gemini/agents/deep-research.md` | Canonical agents modified post-sync, Claude/Gemini copies not updated. `write.md` missing Mode 2 entries, `deep-research.md` has stale budget guidance. |
| O07-007 | No automated agent sync mechanism exists | `.opencode/agent/`, `.claude/agents/`, `.gemini/agents/` | 012 was a one-time manual sync. No script or CI check prevents drift. |
| O08-003 | Skill count mismatch: 18 actual vs 16 claimed | Root README | Two skills (`sk-deep-research`, `mcp-coco-index`) missing from Skills Library listing. |
| O08-004 | Command count mismatch: 22 actual vs 21 claimed | Root README | Three commands (`/spec_kit:deep-research`, `/create:feature-catalog`, `/create:testing-playbook`) missing from tables. |
| O08-005 | Spec Kit README claims 7 memory commands but actual is 6 | Spec Kit README line 52 | After context/analyze merge, memory command count is 6 not 7. |
| O08-006 | Root README omits Graph and Degree search channels | Root README lines 280-285 | Only 3 of 5 channels documented. Architecture diagram says "3-channel hybrid" when actual is 5-channel. |
| O08-007 | Root README architecture diagram arithmetic error | Root README line 90 | Says "32 MCP tools: 32 memory + 7 code mode" (32+7=39, not 32). Self-contradictory label. |
| O09-003 | Broken predecessor reference in phase 003 | `003/spec.md:44` | References `008-spec-kit-code-quality` which was deleted. Dead link. |
| O09-004 | Broken predecessor reference in phase 005 | `005/spec.md:372` | References `006-extra-features` which was merged into 001. Dead link. |
| O09-005 | Empty spec folder 017-spec-folder-alignment-audit | `017-spec-folder-alignment-audit/` | Contains only empty `scratch/` with one file. No spec.md. Pollutes phase tree. |
| O09-006 | Status inconsistency -- 005 dashboard says Complete, spec says In-Progress | Epic dashboard vs `005/spec.md` | Same as O01-005. |
| O10-004 | Four circular dependencies via `from '../core'` imports | `scripts/lib/`, `scripts/renderers/`, `scripts/spec-folder/` | Four files import from `../core` instead of `../config`, creating structural circular dependency paths. |
| O10-005 | `workflow.ts` is a 2,472-line god module | `scripts/core/workflow.ts` | 2,472 lines with 7 direct file imports bypassing the barrel. |
| O10-006 | `memory-save.ts` modularization TODO still open (1,402 LOC) | `mcp_server/handlers/memory-save.ts` | Same as CR-01. Code comment says "TODO: Extract quality gate, reconsolidation, chunked-indexing." |
| O10-007 | `heal-session-ambiguity.sh` has no working verifier | `scripts/ops/heal-session-ambiguity.sh` | Script logs deprecation error and halts. Ops runbook contains non-functional script. |
| O10-008-009 | Re-export shims still exist (phase-classifier, memory-frontmatter, session-activity-signal) | `scripts/utils/`, `scripts/extractors/` | Shims forward to `lib/` paths but were supposed to be deleted. Creates import path confusion. |

---

## 4. Cross-Cutting Themes

### 4.1 Documentation Drift (Specs Say X, Code Does Y)

This is the single largest systemic issue. It manifests at every level:

- **Epic dashboard**: 50% status alignment rate (O01). 9 of 18 phases have wrong status labels.
- **Folder/feature counts**: Epic claims 51 folders (actual 102), 189 features (actual 195), 16 phases (actual 18).
- **Tool/skill/command counts**: MCP tools (32 claimed vs 33 actual), skills (16 vs 18), commands (21 vs 22), memory commands (7 vs 6).
- **File paths**: Root README `dist/index.js` does not exist; database path in README differs from Install Guide; Phase 4 spec references non-existent `lib/cache/cognitive/`.
- **Test counts**: Stale across all phases (point-in-time snapshots never updated).
- **Phase references**: "Phase 020" referenced in 7 documents but does not exist. `999-finalization` referenced but does not exist.
- **Status fields**: Phase 005 checklist 157/157 complete but status still "in-progress". Phase 016 tasks all done but status "Draft".

### 4.2 Boundary Enforcement Gaps

- **Import policy**: Package alias traversal bypass (C07-001). AST checker not in default pipeline (C05-001/C07-002). Missing `ImportEqualsDeclaration` handling (C05-002). Compiled-mode wrong root (C05-003). Raw filesystem reads bypass both checkers (C07-003).
- **Handler boundaries**: Handlers import sibling handlers instead of shared services (C01-004, C01-005). No architectural enforcement prevents handlers from growing unbounded.
- **Shared module coupling**: `shared/config.ts` hard-codes `mcp_server/database` path (C06-001). Runtime dependencies not declared in shared manifest (C09-004).
- **Workspace isolation**: Internal dependencies declared via TS paths but not in package manifests (C09-003).

### 4.3 Build/Test Pipeline Issues

- **Build is broken**: `npm run build` and `npm run typecheck` both fail due to test files included in production compilation (C09-001, C08-003).
- **Test coverage gaps**: Root pipeline omits scripts and shared suites (C08-001). 45 deferred test blocks (C08-004). 168 source files with no direct test imports (C08-008).
- **Test quality**: Placeholder `expect(true).toBe(true)` assertions (C08-004). Error-path tests only prove "something failed" (C08-005). Real-timer-dependent race assertions (C08-006, C08-007).
- **Test isolation bug**: Duplicate-content no-op test fails in combined suite (O02-006).
- **Stale dist artifacts**: 8+ stale files for deleted/relocated scripts (O10-001, O10-002).

### 4.4 Dead Code / Stale Artifacts

- **Dead re-exports**: `causal-links-processor.ts` backward-compatibility re-export (C01-008). `SpecDiscoveryOptions` exported but never imported (C01-009). `session-learning.ts` exports 5 unused types (C01-010).
- **Dead code in shared**: `getBackoffSequence`, `withRetry`, `createProfileSlug`, `parseProfileSlug`, `getMemoryTemplateSectionRules`, `filterStopWords`, `extractNgrams` all exported but never consumed (C06-004).
- **Dead pipeline code**: `cli-capture-shared.ts` extracted but never wired in (C05-011). `governance_metadata` column added but never populated (O05-010).
- **Dead references**: Ground-truth mapper hardcodes 7 legacy spec names that no longer exist (C05-010). Redaction calibration targets deleted spec path (C05-008).
- **Stale shims**: 3 re-export shims in scripts/utils and scripts/extractors that should have been deleted (O10-008, O10-009).
- **Phantom phases**: `017-spec-folder-alignment-audit` is empty. `999-finalization` does not exist. Phase 020 references point nowhere.

### 4.5 God Objects / Complexity Hotspots

| File | LOC | Concerns |
|------|-----|----------|
| `handlers/memory-save.ts` | 1,402 | Transport + orchestrator + governance + enrichment |
| `handlers/memory-search.ts` | 1,263 | Pipeline + session + routing + telemetry + eval + formatting |
| `handlers/memory-context.ts` | 980 | Strategy orchestration + sibling handler invocation |
| `scripts/core/workflow.ts` | 2,472 | Save orchestration + validation + indexing + review + signal handlers |
| `handlers/session-learning.ts` | 748 | Learning state management |
| `handlers/causal-graph.ts` | 745 | Causal graph operations |
| `handlers/quality-loop.ts` | 715 | Quality scoring pipeline |
| `handlers/memory-index.ts` | 647 | Index operations + save handler dependency |
| `handlers/memory-crud-health.ts` | 596 | CRUD + health operations |
| `handlers/chunking-orchestrator.ts` | 591 | Chunking pipeline |

### 4.6 Data Integrity Risks

- **Concurrent save file loss**: Filename de-duplication is process-local only; `file-writer.ts` overwrites on collision (C04-001).
- **Split-brain state**: Atomic save can commit DB then fail filesystem rename (C02-003).
- **Orphaned memories**: Conflict deprecation can commit without creating supersedes edge (C02-002). Cleanup cannot detect stale `memory_index` rows pointing at deleted files (C04-004).
- **Silent failure masking**: Vector write failures labeled as "embedding unavailable" (C04-002). Save mutex swallows prior failures (C01-006). Known-bad memories still get indexed (C04-003).
- **Score corruption**: Attention score overwrites destroy signal separation (C03-001). Zero-signal batches promoted to perfect confidence (C03-003).

---

## 5. Severity Heat Map

### By Codebase Area

| Area | CRITICAL | HIGH | MEDIUM | LOW | Total | Key Issues |
|------|----------|------|--------|-----|-------|------------|
| **handlers/** | 1 | 4 | 2 | 3 | 10 | God objects (save 1402, search 1263, context 980), circular-import pressure, silent failure masking |
| **database/storage/** | 0 | 2 | 3 | 1 | 6 | Split-brain atomicity, orphaned supersedes edges, stale downgrade utility, unbounded refresh queue |
| **search/scoring/** | 0 | 2 | 5 | 0 | 7 | Attention score corruption, zero-signal normalization to 1.0, unbounded graph FTS scale, per-query global degree recompute |
| **scripts/** | 3 | 10 | 9 | 4 | 26 | Stale dist artifacts, concurrent save file loss, silent failure masking, god module (workflow.ts 2472 LOC), circular deps, broken ops scripts, dead code |
| **shared/** | 0 | 2 | 2 | 2 | 6 | Runtime-coupled to mcp_server, incompatible duplicate types, orphaned public API |
| **specs/docs** | 10 | 22 | 31 | 23 | 86 | Epic dashboard 50% accuracy, duplicate phase numbers, phantom phases, count mismatches across all surfaces, 197 unstarted remediation findings |

### Hot Spots (Top 5 Files by Finding Density)

1. **`022-hybrid-rag-fusion/spec.md`** -- 12+ findings (counts, statuses, phantom phases, duplicate numbers)
2. **`handlers/memory-save.ts`** -- 4 findings (god object, silent failure, mutex swallowing, modularization TODO)
3. **`Root README.md`** -- 8 findings (wrong entry point, wrong counts for tools/skills/commands/channels, wrong DB path, arithmetic error)
4. **`scripts/core/workflow.ts`** -- 4 findings (god module, concurrent save race, silent failure masking, post-save review bypass)
5. **`scripts/evals/check-no-mcp-lib-imports*.ts`** -- 4 findings (AST not in default pipeline, missing import forms, wrong root in compiled mode)

---

## 6. Top 10 Priority Actions

### 1. Fix broken build: Exclude tests from production TS compilation
- **Source**: C09-001, C08-003
- **Impact**: `npm run build` and `npm run typecheck` both fail. This blocks CI and development.
- **Effort**: Small (tsconfig change + test type fix)
- **Fix**: Exclude `tests/**/*.ts` from `mcp_server/tsconfig.json`. Fix `shared-memory-handlers.vitest.ts` optional chaining.

### 2. Delete stale dist artifacts
- **Source**: O10-001, O10-002 (CRITICAL)
- **Impact**: Consumers may import from wrong locations; dist drifts from source.
- **Effort**: Small (delete 12+ files, rebuild)
- **Fix**: Delete stale dist files for 4 deleted eval scripts and relocated structure-aware-chunker.

### 3. Fix Root README entry point (`dist/index.js` does not exist)
- **Source**: O08-001 (CRITICAL)
- **Impact**: Anyone following Quick Start gets a "Cannot find module" error.
- **Effort**: Small (3 string replacements)
- **Fix**: Replace `dist/index.js` with `dist/context-server.js` in 3 locations.

### 4. Make concurrent memory saves collision-safe
- **Source**: C04-001
- **Impact**: Durable data loss when two saves overlap for same spec folder.
- **Effort**: Medium
- **Fix**: Use `O_EXCL` semantics or filesystem lock around filename allocation + rename.

### 5. Fix conflict deprecation atomicity (supersedes edge)
- **Source**: C02-002
- **Impact**: Deprecated memories stranded without causal link, breaking lineage reasoning.
- **Effort**: Small (treat null from `insertEdge()` as transaction-failing error)
- **Fix**: Throw and roll back deprecation if causal edge insertion fails.

### 6. Extract handler god objects into service layer
- **Source**: C01-002 (CRITICAL), C01-003, O10-005, O10-006
- **Impact**: Testing, reuse, and change isolation are degraded across the 3 largest handlers.
- **Effort**: Large (architectural refactoring)
- **Fix**: Create `lib/save/memory-save-service.ts` and `lib/search/memory-search-service.ts`. Keep handlers as thin transport adapters.

### 7. Fold AST import checker into default `npm run check` pipeline
- **Source**: C05-001, C07-002
- **Impact**: Stronger checker exists but is opt-in. Violations that only the AST checker sees can merge.
- **Effort**: Small (package.json script change)
- **Fix**: Add `check:ast` scripts to the default `check` pipeline.

### 8. Update epic dashboard to reflect actual phase status (50% accuracy)
- **Source**: O01-001 through O01-017, O09-002, CR-13
- **Impact**: All complexity estimates, planning, and governance decisions based on the dashboard are misinformed.
- **Effort**: Medium (spec editing across multiple files)
- **Fix**: Update folder count (102), feature count (195), phase count (18), all 9 stale "Stub" entries, missing phases 014-018, duplicate 009 entry, phantom 999-finalization.

### 9. Fix tool/skill/command count drift across all documentation
- **Source**: O08-002 (CRITICAL), O08-003, O08-004, O08-005, O08-007
- **Impact**: All documentation surfaces have wrong counts. Users cannot discover available capabilities.
- **Effort**: Medium (multiple file edits)
- **Fix**: Update to 33 tools, 18 skills, 22 commands, 6 memory commands. Add missing items to listing tables.

### 10. Begin Phase 019 Sprint S1 (Critical/Blocking Fixes)
- **Source**: O06-005, O10-003 (CRITICAL)
- **Impact**: 15 P0 items are hard blockers including race conditions, broken barrel exports, stale ops scripts.
- **Effort**: 4-6 hours (estimated)
- **Fix**: Execute Sprint S1 which resolves 22 findings. Then proceed to S2 (data integrity).

---

## 7. Agent Coverage Summary

| Agent | Domain | Finding Count | C | H | M | L | Key Finding |
|-------|--------|---------------|---|---|---|---|-------------|
| **C01** | Handler Analysis | 10 | 1 | 4 | 2 | 3 | `memory-save.ts` is a 1402 LOC god object combining transport, orchestration, governance, and enrichment (CR-01) |
| **C02** | Database/Storage | 6 | 0 | 2 | 3 | 1 | Conflict deprecation can commit without creating supersedes edge, leaving orphaned deprecated memories (C02-002) |
| **C03** | Search/Scoring | 7 | 0 | 2 | 5 | 0 | Attention score alias is overwritten by final ranking score, destroying signal separation in trace output (C03-001) |
| **C04** | Memory Pipeline | 8 | 0 | 4 | 4 | 0 | Concurrent saves can lose files due to non-atomic filename de-duplication (C04-001) |
| **C05** | Scripts/Lib | 14 | 0 | 6 | 4 | 4 | Default `check` pipeline leaves AST-only import-policy bypasses unguarded (C05-001) |
| **C06** | Shared Boundary | 6 | 0 | 2 | 2 | 2 | Two incompatible `DegradedModeContract` exports exist in the same shared surface (C06-002) |
| **C07** | Import Policy | 4 | 0 | 1 | 2 | 1 | Package alias traversal (`@spec-kit/mcp-server/api/../lib/...`) bypasses import detection (C07-001) |
| **C08** | Test Coverage | 10 | 0 | 4 | 4 | 2 | Root test pipeline omits scripts and shared surfaces; test suite does not typecheck (C08-001, C08-003) |
| **C09** | Build/Config | 5 | 0 | 3 | 2 | 0 | Production TS build includes tests and currently fails; workspace packages have undeclared dependencies (C09-001, C09-003) |
| **C10** | Type Safety | 5 | 0 | 0 | 4 | 1 | Tool dispatch relies on blind generic cast `parseArgs<T>()` with `{} as T` fallback; 33 double-casts in schema registry (C10-001, C10-002) |
| **O01** | Epic Consistency | 21 | 3 | 8 | 6 | 4 | Epic dashboard has 50% status alignment; 51 claimed vs 102 actual folders; 9 phases incorrectly labeled Stub (CR-02, CR-13) |
| **O02** | Spec-Code Alignment | 8 | 0 | 1 | 0 | 4 | Test isolation failure: duplicate-content no-op test fails in combined suite run, revealing order-dependent save behavior (O02-006) |
| **O03** | Self-Audit (005) | 7 | 0 | 1 | 3 | 3 | ARCHITECTURE.md exception table shows 3 entries but allowlist has 4; spec status still says "in-progress" despite 157/157 checklist complete (O03-001) |
| **O04** | Feature Catalog | 15 | 1 | 4 | 7 | 3 | 14 snippet files exist on disk but are not referenced by the monolith index (CR-06). Feature description accuracy is 49.4% vs 95% target. |
| **O05** | Hydra DB Review | 12 | 0 | 3 | 6 | 3 | Shadow scoring permanently disabled undermines Phase 4 completion claim; `asOf` queries internal-only despite Phase 2 claiming delivery; phased rollout was never a runtime construct (O05-002, O05-003, O05-012) |
| **O06** | Session Capturing | 11 | 1 | 3 | 5 | 2 | 197 findings from 15-agent audit organized into 8 sprints, all unstarted (CR-09). Post-save review skipped for recovery saves. |
| **O07** | Alignment Specs | 9 | 0 | 2 | 2 | 5 | Agent drift recurred 6 days after manual sync with no automated prevention mechanism (O07-002, O07-007) |
| **O08** | Documentation Quality | 17 | 2 | 6 | 7 | 2 | Root README entry point does not exist (CR-07). Tool/skill/command counts wrong across all surfaces (CR-08, O08-003, O08-004). |
| **O09** | Cross-Spec Dependencies | 13 | 2 | 4 | 4 | 3 | Duplicate phase 017 (CR-05). Epic dashboard missing phases 014-018 (CR-12). Two broken predecessor references (O09-003, O09-004). |
| **O10** | Bug/Regression Scan | 25 | 3 | 7 | 8 | 7 | Stale dist artifacts (CR-10, CR-11). 8 remediation sprints unstarted (CR-09). 4 circular dependencies via `../core` imports. Broken ops scripts. |

---

## Appendix A: Deduplication Notes

The following findings were reported by multiple agents and have been consolidated:

| Consolidated ID | Source Agents | Original IDs |
|-----------------|--------------|--------------|
| CR-04 | O01, O09 | O01-003, O09-011 |
| CR-05 | O09, O10 | O09-001, O10-010 |
| CR-09 | O06, O10 | O06-005, O10-003 |
| CR-13 | O01 (6-10, 12) | O01-006, O01-007, O01-008, O01-009, O01-010, O01-012 |
| CR-14 | O01 | O01-004 |
| O01-005 / O09-006 | O01, O09 | Same finding: 005 status inconsistency |
| C01-002 / O10-006 | C01, O10 | Same finding: memory-save.ts god object |
| C05-001 / C07-002 | C05, C07 | Same finding: AST checker not in default pipeline |

## Appendix B: Positive Findings

Several agents confirmed areas that are working well:

1. **JSON-primary save enforcement**: Triple-layer guard verified working correctly (O06-006, O06-007).
2. **Import policy enforcement**: Both regex and AST checkers pass clean. Allowlist has 4 valid entries with proper governance metadata (O03, C07).
3. **Handler cycle fix**: `causal-links-processor.ts` no longer imports from `memory-save.ts`. Zero circular dependencies across 41 handler files (O03).
4. **Shared module consolidation**: `token-estimate.ts` and `quality-extractors.ts` properly consolidated and consumed by both scripts and mcp_server (O03).
5. **Source-dist alignment**: 149/149 files aligned, 0 violations (O03-005).
6. **TypeScript strict mode**: Project type-checks cleanly under `strict: true`. No exported functions missing return types. No implicit `any` parameters (C10).
7. **All Phase 002/003/004 claimed code exists**: Canonical path dedup, tier normalization, constitutional learn refactor, mutation hooks, response hints all verified present (O02).
8. **BUG-NNN tagged fixes**: All 17 tagged bug fixes are present and none have regressed (O10).
9. **No true circular dependencies** in the spec dependency graph (DAG confirmed) (O09).
10. **Hydra DB core infrastructure**: Lineage tables, active projection, governance tables, retention sweeps, shared-space CRUD, and graph-unified retrieval all genuinely implemented (O05).
