### §1 — Executive Summary

The stress suite progressed from 28 files / 69 tests before packet 042, to 38 files / 94 tests after packet 043, to 56 files / 159 tests after packet 044. The coverage backlog is clear: the 54-row matrix now has 0 P0, 0 P1, and 0 P2 gaps remaining, with every row at `gap_classification=none`. The latest run passed with 56/56 test files and 159/159 tests, exit 0, 0 failures, and 0 skips reported in the run log. The primary stress axes now cover concurrency and leases, DoS/capacity pressure, large-corpus scaling, degraded-readiness fallbacks, perf budgets, filesystem isolation, subprocess boundaries, and consolidated cross-feature harness behavior.

### §2 — Coverage Trajectory Across Packets

| Packet | Date | New files | Total files | Total tests | Duration | Exit |
|--------|------|-----------|-------------|-------------|----------|------|
| Pre-042 baseline | — | — | 28 | 69 | 26s | 0 |
| 043 (P0 closures) | 2026-04-30 | +10 | 38 | 94 | 29s | 0 |
| 044 (P1+P2 closures) | 2026-04-30 | +18 | 56 | 159 | 46s | 0 |

### §3 — Per-Subdir Inventory

#### §3.1 `code-graph/`

| File path | Purpose | it blocks | Catalog feature_ids covered | Origin packet | FIXME tags or skip conditions |
|-----------|---------|-----------|-----------------------------|---------------|-------------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/budget-allocator-stress.vitest.ts` | code graph budget allocator stress behavior | 2 | `cg-007`, `cg-008` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts` | cg-014,015,016 — CCC integration | 6 | `cg-014`, `cg-015`, `cg-016` | 044 P1+P2 | Conditional skip through cccIt when ccc binary is unavailable |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts` | cg-007 — code_graph_context | 3 | `cg-007` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | code_graph_query degraded stress sweep (packet 013) | 5 | `cg-001`, `cg-002` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts` | cg-003 — code_graph_scan | 3 | `cg-003` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` | cg-008 — Context handler | 3 | `cg-008` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-crud-stress.vitest.ts` | cg-009,010,011 — deep-loop CRUD | 6 | `cg-009`, `cg-010`, `cg-011` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts` | cg-012 — Deep-loop graph convergence | 3 | `cg-012` | 043 P0 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts` | cg-006 — detect_changes preflight | 2 | `cg-006` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` | cg-017 — doctor apply mode | 2 | `cg-017` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts` | cg-004,005 — manual diagnostics | 4 | `cg-004`, `cg-005` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts` | walker DoS caps | 2 | `cg-003` | 042 baseline | None |

(12 files)

#### §3.2 `skill-advisor/`

| File path | Purpose | it blocks | Catalog feature_ids covered | Origin packet | FIXME tags or skip conditions |
|-----------|---------|-----------|-----------------------------|---------------|-------------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/advisor-recommend-handler-stress.vitest.ts` | sa-025 — advisor_recommend MCP tool | 3 | `sa-025` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` | sa-012 — Anti-stuffing cardinality caps | 2 | `sa-012` | 043 P0 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts` | sa-008..sa-011 — auto-indexing derived metadata stress behavior | 4 | `sa-008`, `sa-009`, `sa-010`, `sa-011` | 044 P1+P2 | FIXME(sa-011): sync provenance hashes graph-metadata.json itself, so repeated sync may report changed |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts` | sa-001 — Chokidar narrow-scope watcher | 2 | `sa-001` | 043 P0 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` | sa-003 — Daemon lifecycle restarts | 2 | `sa-003` | 043 P0 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts` | sa-013 — DF-IDF corpus stats | 3 | `sa-013` | 043 P0 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts` | sa-019 — Five-lane fusion | 3 | `sa-019` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` | sa-007 — Generation cache invalidation | 2 | `sa-007` | 043 P0 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` | sa-004 — Generation snapshot atomicity | 3 | `sa-004` | 043 P0 | FIXME(sa-004): catalog expects unavailable trust state; current generation recovers malformed counters |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts` | sa-030 / sa-031 / sa-032 / sa-033 — hooks parity layer | 4 | `sa-030`, `sa-031`, `sa-032`, `sa-033` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts` | sa-014..sa-018 — lifecycle routing stress behavior | 5 | `sa-014`, `sa-015`, `sa-016`, `sa-017`, `sa-018` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts` | sa-027 / sa-028 — MCP diagnostics under degraded daemon state | 3 | `sa-027`, `sa-028` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | sa-034 — OpenCode plugin bridge | 4 | `sa-034` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` | sa-037 — Python bench runner | 4 | `sa-037` | 043 P0 | it.skip: python3 not available on PATH; sa-037 skipped; FIXME(sa-037): tighten bench p95 envelope assertions when CI runtime contract stabilizes |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-compat-stress.vitest.ts` | sa-035 / sa-036 — Python compat | 5 | `sa-035`, `sa-036` | 044 P1+P2 | it.skip: python3 not available on PATH; sa-035/sa-036 skipped |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-extras-stress.vitest.ts` | sa-022 / sa-023 — scorer extras | 3 | `sa-022`, `sa-023` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts` | skill advisor scorer fusion stress behavior | 2 | `sa-019`, `sa-020`, `sa-021`, `sa-025` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts` | sa-002 — Single-writer lease | 3 | `sa-002` | 043 P0 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts` | skill graph rebuild concurrency | 1 | `sa-006`, `sa-026` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-projection-stress.vitest.ts` | sa-020 — Skill projection | 3 | `sa-020` | 044 P1+P2 | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/trust-state-stress.vitest.ts` | sa-005 — Trust-state classifier pressure | 2 | `sa-005` | 043 P0 | None |

(21 files)

#### §3.3 `memory/`

| File path | Purpose | it blocks | Catalog feature_ids covered | Origin packet | FIXME tags or skip conditions |
|-----------|---------|-----------|-----------------------------|---------------|-------------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts` | Gate D benchmark — memory search | 1 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-trigger-fast-path.vitest.ts` | Gate D benchmark — trigger fast path | 1 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-trigger-perf-benchmark.vitest.ts` | Gate D trigger fast-path benchmark | 1 | None in 042 matrix | 042 baseline | None |

(3 files)

#### §3.4 `session/`

| File path | Purpose | it blocks | Catalog feature_ids covered | Origin packet | FIXME tags or skip conditions |
|-----------|---------|-----------|-----------------------------|---------------|-------------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts` | Gate D benchmark — session resume | 1 | `cg-007` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts` | Gate D resume perf benchmark | 1 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/session-manager-stress.vitest.ts` | T014: interleaved session entry-limit stress | 2 | None in 042 matrix | 042 baseline | None |

(3 files)

#### §3.5 `search-quality/`

| File path | Purpose | it blocks | Catalog feature_ids covered | Origin packet | FIXME tags or skip conditions |
|-----------|---------|-----------|-----------------------------|---------------|-------------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/baseline.vitest.ts` | search-quality harness baseline | 1 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts` | search-quality harness telemetry export | 3 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/measurement-output.vitest.ts` | search-quality measurement output | 1 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/query-surrogates-stress.vitest.ts` | query surrogate stress behavior | 2 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts` | W10 degraded-readiness integration | 1 | `cg-001`, `cg-002`, `cg-007`, `cg-008` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts` | W11 CocoIndex calibration telemetry | 1 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w13-decision-audit.vitest.ts` | W13 decision audit | 2 | `sa-023` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w3-trust-tree.vitest.ts` | W3 composed RAG trust tree | 2 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts` | W4 conditional rerank gate | 4 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w5-shadow-learned-weights.vitest.ts` | W5 advisor shadow learned weights | 3 | `sa-019`, `sa-024` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w6-cocoindex-calibration.vitest.ts` | W6 CocoIndex overfetch and path-class calibration | 2 | None in 042 matrix | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-empty.vitest.ts` | W7 empty code-graph readiness stress cell | 1 | `cg-001` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts` | W7 full-scan-required code-graph readiness stress cell | 1 | `cg-001`, `cg-003` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-stale.vitest.ts` | W7 stale code-graph readiness stress cell | 1 | `cg-001`, `cg-002` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-unavailable.vitest.ts` | W7 unavailable code-graph readiness stress cell | 1 | `cg-001` | 042 baseline | None |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts` | W8 SearchDecisionEnvelope | 3 | `sa-019`, `sa-025` | 042 baseline | None |

(16 files)

#### §3.6 `matrix/`

| File path | Purpose | it blocks | Catalog feature_ids covered | Origin packet | FIXME tags or skip conditions |
|-----------|---------|-----------|-----------------------------|---------------|-------------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/matrix/shadow-comparison.vitest.ts` | T031-01: Synthetic Query Corpus | 21 | `sa-019`, `sa-020`, `sa-021`, `sa-025` | 042 baseline | None |

(1 file)

### §4 — Feature Coverage Map (54 features)

| feature_id | subsystem | feature_name | direct stress file | covered since |
|------------|-----------|--------------|---------------------|---------------|
| `cg-001` | code_graph | Ensure code graph ready | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts | baseline |
| `cg-002` | code_graph | Query self-heal | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts | baseline |
| `cg-003` | code_graph | code_graph_scan | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts; .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts | 044 P1+P2 |
| `cg-004` | code_graph | code_graph_verify | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts | 044 P1+P2 |
| `cg-005` | code_graph | code_graph_status | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts | 044 P1+P2 |
| `cg-006` | code_graph | detect_changes preflight | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts | 044 P1+P2 |
| `cg-007` | code_graph | code_graph_context | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/budget-allocator-stress.vitest.ts; .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts | 044 P1+P2 |
| `cg-008` | code_graph | Context handler | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/budget-allocator-stress.vitest.ts; .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts | 044 P1+P2 |
| `cg-009` | code_graph | deep_loop_graph_query | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-crud-stress.vitest.ts | 044 P1+P2 |
| `cg-010` | code_graph | deep_loop_graph_status | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-crud-stress.vitest.ts | 044 P1+P2 |
| `cg-011` | code_graph | deep_loop_graph_upsert | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-crud-stress.vitest.ts | 044 P1+P2 |
| `cg-012` | code_graph | deep_loop_graph_convergence | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts | 043 P0 |
| `cg-013` | code_graph | Tool registrations | None required | baseline |
| `cg-014` | code_graph | ccc_reindex | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts | 044 P1+P2 |
| `cg-015` | code_graph | ccc_feedback | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts | 044 P1+P2 |
| `cg-016` | code_graph | ccc_status | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts | 044 P1+P2 |
| `cg-017` | code_graph | Doctor apply mode | .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts | 044 P1+P2 |
| `sa-001` | skill_advisor | Chokidar narrow-scope watcher | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts | 043 P0 |
| `sa-002` | skill_advisor | Workspace single-writer lease | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts | 043 P0 |
| `sa-003` | skill_advisor | Daemon lifecycle and health | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts | 043 P0 |
| `sa-004` | skill_advisor | Generation-tagged snapshot publication | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts | 043 P0 |
| `sa-005` | skill_advisor | Live / stale / absent / unavailable trust state | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/trust-state-stress.vitest.ts | 043 P0 |
| `sa-006` | skill_advisor | Rebuild from source on corrupt SQLite | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | baseline |
| `sa-007` | skill_advisor | Generation-tied cache invalidation | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts | 043 P0 |
| `sa-008` | skill_advisor | Deterministic derived extraction | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts | 044 P1+P2 |
| `sa-009` | skill_advisor | A7 sanitizer at every write boundary | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts | 044 P1+P2 |
| `sa-010` | skill_advisor | Provenance fingerprints and trust lanes | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts | 044 P1+P2 |
| `sa-011` | skill_advisor | Graph-metadata derived sync | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts | 044 P1+P2 |
| `sa-012` | skill_advisor | Anti-stuffing and cardinality caps | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts | 043 P0 |
| `sa-013` | skill_advisor | DF/IDF corpus stats (active-only) | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts | 043 P0 |
| `sa-014` | skill_advisor | Derived-lane-only age haircut | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts | 044 P1+P2 |
| `sa-015` | skill_advisor | Asymmetric supersession routing | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts | 044 P1+P2 |
| `sa-016` | skill_advisor | Archive and future skills indexed but not routed | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts | 044 P1+P2 |
| `sa-017` | skill_advisor | Schema v1 to v2 additive backfill | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts | 044 P1+P2 |
| `sa-018` | skill_advisor | Atomic lifecycle rollback | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts | 044 P1+P2 |
| `sa-019` | skill_advisor | Five-lane analytical fusion | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts; .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts | 044 P1+P2 |
| `sa-020` | skill_advisor | Skill-nodes / skill-edges projection | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts; .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-projection-stress.vitest.ts | 044 P1+P2 |
| `sa-021` | skill_advisor | Top-2 ambiguity window | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts | baseline |
| `sa-022` | skill_advisor | Lane contribution attribution | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-extras-stress.vitest.ts | 044 P1+P2 |
| `sa-023` | skill_advisor | Lane-by-lane ablation protocol | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-extras-stress.vitest.ts | 044 P1+P2 |
| `sa-024` | skill_advisor | Lane weights configuration | None direct;  supplementary .opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w5-shadow-learned-weights.vitest.ts | baseline |
| `sa-025` | skill_advisor | `advisor_recommend` MCP tool | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts; .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/advisor-recommend-handler-stress.vitest.ts | 044 P1+P2 |
| `sa-026` | skill_advisor | `advisor_rebuild` MCP tool | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | baseline |
| `sa-027` | skill_advisor | `advisor_status` MCP tool | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts | 044 P1+P2 |
| `sa-028` | skill_advisor | `advisor_validate` MCP tool | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts | 044 P1+P2 |
| `sa-029` | skill_advisor | Stable `compat/index.ts` entrypoint | None required | baseline |
| `sa-030` | skill_advisor | Claude Code `user-prompt-submit` hook | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts | 044 P1+P2 |
| `sa-031` | skill_advisor | Copilot CLI `user-prompt-submit` hook | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts | 044 P1+P2 |
| `sa-032` | skill_advisor | Gemini CLI `user-prompt-submit` hook | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts | 044 P1+P2 |
| `sa-033` | skill_advisor | Codex CLI native SessionStart/UserPromptSubmit hooks with prompt-wrapper fallback | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts | 044 P1+P2 |
| `sa-034` | skill_advisor | OpenCode plugin bridge | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts | 044 P1+P2 |
| `sa-035` | skill_advisor | Python CLI shim (`skill_advisor.py`) | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-compat-stress.vitest.ts | 044 P1+P2 |
| `sa-036` | skill_advisor | Python regression suite (52/52) | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-compat-stress.vitest.ts | 044 P1+P2 |
| `sa-037` | skill_advisor | Python bench runner (`skill_advisor_bench.py`) | .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts | 043 P0 |

### §5 — Stress Axis Distribution

Primary-axis assignment is one file per category; counts sum to 56.

#### Concurrency / lease / multi-process (7 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/advisor-recommend-handler-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts`

#### Capacity caps / DoS / rate limits (7 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/budget-allocator-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/session-manager-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-extras-stress.vitest.ts`

#### Large corpus / 1000+ skill scaling (6 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-projection-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/trust-state-stress.vitest.ts`

#### Degraded state / fallback / readiness (9 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-empty.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-stale.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-unavailable.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts`

#### Perf budget / latency envelope (6 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/matrix/shadow-comparison.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-trigger-fast-path.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-trigger-perf-benchmark.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts`

#### Filesystem / temp dir / atomic rename (4 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts`

#### Subprocess / external binary (4 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-compat-stress.vitest.ts`

#### Mixed / consolidated (13 files)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/deep-loop-crud-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/baseline.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/measurement-output.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/query-surrogates-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w13-decision-audit.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w3-trust-tree.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w5-shadow-learned-weights.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w6-cocoindex-calibration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts`

### §6 — Skip and FIXME Inventory

- Latest run skip count: 0 reported skips. The final log reports `Test Files 56 passed (56)` and `Tests 159 passed (159)` only.
- Conditional skip guard: `code-graph/ccc-integration-stress.vitest.ts` uses `cccIt = hasCccBinary ? it : it.skip`; reason: `skipped: ccc binary unavailable at .opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`.
- Conditional skip guard: `skill-advisor/python-compat-stress.vitest.ts` registers `it.skip('python3 not available on PATH; sa-035/sa-036 skipped', ...)` only when `python3` is absent.
- Conditional skip guard: `skill-advisor/python-bench-runner-stress.vitest.ts` registers `it.skip('python3 not available on PATH; sa-037 skipped', ...)` only when `python3` is absent.
- FIXME `sa-004`: `generation-snapshot-stress.vitest.ts` notes that the catalog expects unavailable trust state, while current advisor generation recovers malformed counters.
- FIXME `sa-011`: `auto-indexing-derived-sync-stress.vitest.ts` notes that sync provenance currently hashes `graph-metadata.json` itself, so repeated sync may report changed after derived-block rewrites.
- FIXME `sa-037`: `python-bench-runner-stress.vitest.ts` keeps bench-runtime assertions loose until the bench can reliably publish documented p95 envelopes in CI.

### §7 — Method Notes

- Enumerated the stress corpus with `find .opencode/skill/system-spec-kit/mcp_server/stress_test -name '*.vitest.ts' -type f | sort`; the result was 56 files.
- Parsed each test file for the first `describe(...)` title, source-level `it(...)`/`it.skip(...)` blocks, the `cccIt(...)` wrapper, conditional skip guards, and `FIXME(feature_id)` comments.
- Cross-referenced `coverage-matrix.csv` by matching each path against both `stress_test_files` and `supplementary_stress_files`; direct and supplementary matches are both shown in §3, while §4 preserves the direct-file column semantics.
- Derived origin packets from packet 043 and 044 closure evidence: 28 baseline files, 10 packet-043 P0 files, and 18 packet-044 P1+P2 files.
- Used the latest packet-044 stress log for run status: exit 0, 56/56 files, 159/159 tests, and 46.09s duration. Earlier 042 and 043 logs supplied the trajectory rows.
