# Stress Coverage Audit

## §1 — Rubrics

**`stress_coverage_required` rubric:**
- **Y** — feature has concurrency, filesystem, lease, capacity-cap, large-corpus, perf-budget, or degraded-state surface
- **N** — pure config / types / registration / static contract with no runtime pressure surface
- **Maybe** — runtime surface exists but expected load is bounded; flag for human review

**`gap_classification` rubric:**
- **P0** — required (Y) AND no direct stress test AND no equivalent supplementary coverage; on a hot path
- **P1** — required (Y) AND direct test exists but is thin (single happy-path or insufficient pressure axis)
- **P2** — `Maybe` AND uncovered, OR documented nice-to-have
- **none** — required is N, OR direct stress test exists with adequate axes

## §2 — Per-Group Findings

Code graph read-path freshness is the best-covered code_graph group. `code-graph-degraded-sweep.vitest.ts` exercises empty graph, broad stale, readiness crash, and fresh-state query branches, while search-quality W7/W10 files add degraded readiness pressure. The two catalog features are hot read paths, but the direct stress axes are adequate for the current feature contracts.

- cg-001: none
- cg-002: none

Manual scan / verify / status has strong unit and manual-playbook coverage but uneven stress coverage. The scan path has walker DoS stress for oversized `.gitignore` and depth caps, but that does not fully pressure the scan handler or `verify:true` path. Verify and status remain bounded manual diagnostics and are flagged as P2 rather than release-blocking P0.

- cg-003: P1
- cg-004: P2
- cg-005: P2

Detect-changes preflight is intentionally bounded and read-only. Its stale-refusal contract is unit-covered in `code_graph/tests/detect-changes.test.ts` and manually covered by the code_graph playbook. There is no large-diff or stale-graph stress cell, so this stays a P2 human-review item.

- cg-006: P2

Context retrieval has meaningful but thin stress coverage. The `budget-allocator-stress.vitest.ts` file covers context budget pressure, and W10/search-session files provide related degraded-readiness pressure. The actual context handler's seed expansion, deadlines, and blocked responses are still mostly unit-covered, so both features are P1 rather than none.

- cg-007: P1
- cg-008: P1

Coverage graph has unit coverage under `mcp_server/tests/`, especially query, status, upsert, convergence, and graph-aware stop behavior. The missing stress axis is the convergence path: it is command-auto-fired before deep-loop stop voting and has no direct stress test or equivalent supplementary pressure. Query, status, and upsert are bounded enough to classify as P2.

- cg-009: P2
- cg-010: P2
- cg-011: P2
- cg-012: P0

MCP tool surface coverage is adequate without stress. The feature is a static registration and schema-dispatch contract, covered by `context-server.vitest.ts`, `tool-input-schema.vitest.ts`, and manual playbook shape checks. Stress coverage is not required by the rubric.

- cg-013: none

CCC integration is manual and bridge-oriented. Reindex shells out, feedback appends JSONL, and status probes availability; all have playbook scenarios, but no direct stress files. Because the current catalog presents these as manual operator tools rather than hot runtime paths, they are P2 follow-ups.

- cg-014: P2
- cg-015: P2
- cg-016: P2

Doctor code graph has filesystem mutation surface in apply mode, but it is an explicit operator command rather than an ambient runtime path. The manual playbook captures apply-mode policy and unit coverage covers ops hardening. Stress is useful later, especially around rollback and scan verification, but this is a P2 nice-to-have.

- cg-017: P2

Skill-advisor daemon and freshness is the largest P0 cluster. Only corrupt SQLite rebuild has direct concurrency stress via `skill-graph-rebuild-concurrency.vitest.ts`; watcher storms, lease contention, lifecycle degradation, generation publication, trust-state sweep, and cache invalidation lack direct stress coverage. These are hot recommendation preconditions, so unit coverage is not enough for release-readiness stress confidence.

- sa-001: P0
- sa-002: P0
- sa-003: P0
- sa-004: P0
- sa-005: P0
- sa-006: none
- sa-007: P0

Auto-indexing has two required stress gaps. Anti-stuffing/cardinality caps and DF/IDF active-corpus recomputation are explicit capacity and large-corpus surfaces with only unit coverage. Derived extraction, sanitizer, provenance lanes, and graph-metadata sync are runtime surfaces too, but their load expectations are bounded enough to keep them at P2.

- sa-008: P2
- sa-009: P2
- sa-010: P2
- sa-011: P2
- sa-012: P0
- sa-013: P0

Lifecycle routing is unit-covered but not stressed. Age haircut, supersession, archive exclusion, schema migration, and rollback all have targeted tests in `native-scorer`, `redirect-metadata`, or `lifecycle-derived-metadata`. None has direct stress coverage over dense redirect graphs, large archive sets, or repeated rollback failures, so the group is P2 throughout.

- sa-014: P2
- sa-015: P2
- sa-016: P2
- sa-017: P2
- sa-018: P2

Scorer fusion has direct stress coverage for fusion and ambiguity, plus supplementary matrix/search-quality coverage. The direct stress file is still small: it uses fixture projections and two scenarios, so five-lane fusion and projection are P1. Ambiguity has an explicit tie stress case, weights config is static enough to be none, and attribution/ablation remain P2 because they are unit/supplementary only.

- sa-019: P1
- sa-020: P1
- sa-021: none
- sa-022: P2
- sa-023: P2
- sa-024: none

Skill-advisor MCP surface is mixed. `advisor_rebuild` has direct concurrency stress and is classified none, while `advisor_recommend` only gets scorer-level stress rather than full handler pressure and is P1. Status and validate are bounded diagnostics with unit/manual coverage, and the compat entrypoint is static.

- sa-025: P1
- sa-026: none
- sa-027: P2
- sa-028: P2
- sa-029: none

Hooks and plugin coverage is broad at the unit level but has no stress axis. Claude has a canonical manual scenario, Codex has dedicated hook-policy tests, and OpenCode plugin behavior has substantial unit coverage. Copilot and Gemini have parity tests but no canonical manual playbook scenario; all five remain P2 because runtime hook load is bounded but uncovered by stress.

- sa-030: P2
- sa-031: P2
- sa-032: P2
- sa-033: P2
- sa-034: P2

Python compat has one required gap. The CLI shim and regression suite are compatibility surfaces with unit/parity coverage and no direct stress, so they are P2. The bench runner is explicitly a perf-budget surface, and no file included by `vitest.stress.config.ts` covers it, so it is P0.

- sa-035: P2
- sa-036: P2
- sa-037: P0

## §3 — Gap Inventory

### P0 gaps

| feature_id | feature_name | rationale |
| --- | --- | --- |
| cg-012 | deep_loop_graph_convergence | Auto-fired before deep-loop stop voting and lacks direct or equivalent stress coverage. |
| sa-001 | Chokidar narrow-scope watcher | Filesystem watcher hot path lacks event-storm stress coverage. |
| sa-002 | Workspace single-writer lease | Concurrency lease path lacks multi-process contention stress. |
| sa-003 | Daemon lifecycle and health | Daemon degraded-state lifecycle lacks stress coverage beyond unit tests. |
| sa-004 | Generation-tagged snapshot publication | Snapshot publication lacks concurrent reader/publication stress. |
| sa-005 | Live / stale / absent / unavailable trust state | Recommendation trust-state preconditions lack direct degraded sweep stress. |
| sa-007 | Generation-tied cache invalidation | Hot cache invalidation path lacks generation pressure stress. |
| sa-012 | Anti-stuffing and cardinality caps | Capacity caps lack large adversarial or stuffing stress coverage. |
| sa-013 | DF/IDF corpus stats (active-only) | Large-corpus recomputation lacks stress coverage. |
| sa-037 | Python bench runner (`skill_advisor_bench.py`) | Perf-budget runner is not covered by the Vitest stress suite. |

### P1 gaps

| feature_id | feature_name | rationale |
| --- | --- | --- |
| cg-003 | code_graph_scan | Walker stress is useful but does not pressure full scan handler or verify=true. |
| cg-007 | code_graph_context | Budget stress is direct enough to count, but handler seed/deadline pressure is thin. |
| cg-008 | Context handler | Stress covers allocation only, not handler normalization and blocked-output paths. |
| sa-019 | Five-lane analytical fusion | Direct stress has two small fixture scenarios, not large-corpus lane pressure. |
| sa-020 | Skill-nodes / skill-edges projection | Projection is stressed only through small fixture projections. |
| sa-025 | `advisor_recommend` MCP tool | Direct stress covers scorer behavior but not the full MCP handler under load. |

### P2 gaps

| feature_id | feature_name | rationale |
| --- | --- | --- |
| cg-004 | code_graph_verify | Bounded manual diagnostics have unit/manual coverage but no stress axis. |
| cg-005 | code_graph_status | Diagnostic degraded-state coverage is unit/manual only. |
| cg-006 | detect_changes preflight | Large-diff and stale-refusal stress are missing. |
| cg-009 | deep_loop_graph_query | Live unit tests exist but no large namespace stress. |
| cg-010 | deep_loop_graph_status | Status is bounded but not stress-covered. |
| cg-011 | deep_loop_graph_upsert | Batch-size and repeated-write stress are missing. |
| cg-014 | ccc_reindex | External CLI bridge is manual and not stress-covered. |
| cg-015 | ccc_feedback | JSONL repeated-write stress is missing. |
| cg-016 | ccc_status | External-binary degraded probes are not stress-covered. |
| cg-017 | Doctor apply mode | Filesystem apply/rollback stress is a documented nice-to-have. |
| sa-008 | Deterministic derived extraction | Large-corpus extraction stress is missing. |
| sa-009 | A7 sanitizer at every write boundary | Large adversarial sanitizer batch stress is missing. |
| sa-010 | Provenance fingerprints and trust lanes | Stress corpus for provenance lanes is missing. |
| sa-011 | Graph-metadata derived sync | Concurrent filesystem sync stress is missing. |
| sa-014 | Derived-lane-only age haircut | Scorer runtime path is unit-covered only. |
| sa-015 | Asymmetric supersession routing | Dense redirect-chain stress is missing. |
| sa-016 | Archive and future skills indexed but not routed | Archive-heavy corpus stress is missing. |
| sa-017 | Schema v1 to v2 additive backfill | Large batch migration stress is missing. |
| sa-018 | Atomic lifecycle rollback | Failure-injection rollback stress is missing. |
| sa-022 | Lane contribution attribution | Large/adversarial attribution payload stress is missing. |
| sa-023 | Lane-by-lane ablation protocol | Direct ablation stress is missing. |
| sa-027 | `advisor_status` MCP tool | Diagnostic degraded-state stress is missing. |
| sa-028 | `advisor_validate` MCP tool | Validation slice stress is missing. |
| sa-030 | Claude Code `user-prompt-submit` hook | Runtime hook stress is missing. |
| sa-031 | Copilot CLI `user-prompt-submit` hook | Runtime hook stress and canonical manual scenario are missing. |
| sa-032 | Gemini CLI `user-prompt-submit` hook | Runtime hook stress and canonical manual scenario are missing. |
| sa-033 | Codex CLI native SessionStart/UserPromptSubmit hooks with prompt-wrapper fallback | Prompt-volume and degraded-state stress are missing. |
| sa-034 | OpenCode plugin bridge | Plugin bridge stress is missing. |
| sa-035 | Python CLI shim (`skill_advisor.py`) | Subprocess-volume stress is missing. |
| sa-036 | Python regression suite (52/52) | The suite is parity coverage, not stress coverage. |

## §4 — Follow-on Recommendation

RECOMMEND opening packet `043-stress-test-gap-remediation` to write missing tests for the P0 features above. Do not auto-create — the user must approve scope.

### §4.1 — Closed by packet 043 (2026-04-30)

Packet `043-stress-test-gap-remediation` was opened and completed on the same day. All 10 P0 features above now have direct stress coverage:

| feature_id | New stress test file |
|------------|----------------------|
| cg-012 | `mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts` |
| sa-001 | `mcp_server/stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts` |
| sa-002 | `mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts` |
| sa-003 | `mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` |
| sa-004 | `mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` |
| sa-005 | `mcp_server/stress_test/skill-advisor/trust-state-stress.vitest.ts` |
| sa-007 | `mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` |
| sa-012 | `mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` |
| sa-013 | `mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts` |
| sa-037 | `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` |

After packet 043 landed, the matrix was updated for all 10 ids: `stress_test_files` now points at the new file, `gap_classification` is `none`, and `evidence` reads "Closed by packet 043". The full stress suite grew from 28 to 38 files (69 → 94 tests passing) with `npm run stress` exit 0 in 29s.

P1 (6 features) and P2 (30 features) gaps remain — they roll into the normal release-readiness backlog and are not blocking.

## §5 — Method Notes

- Read both catalog indexes first, then enumerated all 17 code_graph and 37 skill_advisor per-feature files in catalog order.
- Listed `mcp_server/stress_test/` and separated direct subsystem stress files from supplementary `memory/`, `session/`, `search-quality/`, and `matrix/` files.
- Searched subsystem-local tests under `code_graph/tests/`, `skill_advisor/tests/`, and relevant shared `mcp_server/tests/` files because coverage graph, advisor_rebuild, and Codex hook tests live outside the subsystem folders.
- Checked subsystem manual playbooks under `code_graph/manual_testing_playbook/` and `skill_advisor/manual_testing_playbook/`; the requested `mcp_server/manual_testing_playbook/` root path does not exist in this checkout.
- Applied the frozen rubric conservatively: unit/manual-only runtime pressure surfaces are P2 unless the feature is a required hot path, and thin direct stress is P1.
