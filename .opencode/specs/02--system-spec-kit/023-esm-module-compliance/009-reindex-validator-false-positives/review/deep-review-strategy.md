# Deep Review Strategy — Spec 009 Bug Fixes

## Review Target
13 bug fixes for memory indexing pipeline and contextType migration across phases 008-009 of spec 023-esm-module-compliance.

## Scope
14 source files + 41 template files. All changes are on branch `system-speckit/024-compact-code-graph` and cherry-picked to `main`.

## Files Under Review

### Source Code
1. `scripts/lib/validate-memory-quality.ts` — File path fallback for spec_folder extraction, skip V12 for memory/spec docs
2. `scripts/lib/frontmatter-migration.ts` — VALID_CONTEXT_TYPES, DOC_DEFAULT_CONTEXT, normalizer alias, inference override
3. `scripts/extractors/session-extractor.ts` — detectContextType→planning, detectImportanceTier→planning
4. `mcp_server/handlers/memory-index.ts` — Force reindex warn-only for all files
5. `mcp_server/handlers/memory-save.ts` — Thread filePath to validator
6. `mcp_server/handlers/v-rule-bridge.ts` — Accept + forward filePath option
7. `mcp_server/lib/parsing/memory-parser.ts` — ContextType union, CONTEXT_TYPE_MAP decision→planning
8. `mcp_server/lib/search/vector-index-schema.ts` — CHECK constraint includes "planning"
9. `mcp_server/lib/storage/schema-downgrade.ts` — CHECK constraint includes "planning"
10. `mcp_server/lib/search/intent-classifier.ts` — find_spec/find_decision weights→planning
11. `mcp_server/lib/validation/save-quality-gate.ts` — isShortCriticalException accepts planning+decision
12. `mcp_server/lib/cognitive/fsrs-scheduler.ts` — Stability multiplier + no-decay set includes planning
13. `mcp_server/lib/eval/memory-state-baseline.ts` — Validation query includes planning
14. `mcp_server/tests/incremental-index-v2.vitest.ts` + `safety.vitest.ts` — CHECK constraint in test schemas

### Templates
15. `templates/context_template.md` — Detection logic pseudo-code + field comment
16. 40 files across `templates/level_1/`, `level_2/`, `level_3/`, `level_3+/`, `core/`, `addendum/` — contextType defaults

## Review Dimensions
All 7: correctness, security, traceability, maintainability, performance, reliability, completeness

## Iteration Plan
| Iter | Dimension | Focus |
|------|-----------|-------|
| 1 | Correctness | validate-memory-quality.ts regex + fallback, frontmatter-migration.ts defaults |
| 2 | Correctness | memory-parser.ts type map, session-extractor.ts return values |
| 3 | Security | filePath injection risk, SQL via context_type, path traversal |
| 4 | Traceability | Changelog ↔ actual code changes, spec docs match implementation |
| 5 | Maintainability | Duplicated mappings, backward compat decisions, alias patterns |
| 6 | Performance | Reindex batch processing, CHECK constraint, DB dedup query |
| 7 | Reliability | Edge cases: empty/null filePath, concurrent reindex, WAL mode |
| 8 | Completeness | Test coverage gaps, missing error handling, undocumented paths |
| 9 | Cross-cutting | Consistency of contextType mapping across all 6 locations |
| 10 | Adversarial | Challenge prior findings, verify evidence, check false positives |

## Known Context
- All fixes are released as v3.1.5.0
- contextType migration: "decision"→"planning" across source, DB, files
- DB dedup removed 13,211 duplicate rows
- Force reindex now indexes all 1,200 unique files with 0 failures

## Convergence
- Threshold: 0.10 (new findings ratio)
- P0 override: any new P0 blocks convergence
- Max iterations: 10
