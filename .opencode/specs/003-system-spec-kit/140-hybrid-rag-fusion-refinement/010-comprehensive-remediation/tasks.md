# Tasks: Comprehensive MCP Server Remediation

---

## Wave 1 — Parallel Execution

- [x] **WS1-B** Database & Schema Safety (Agent 1, opus) — B1-B4
- [x] **WS1-C+1c** Scoring & Ranking + novelty cleanup (Agent 2, opus) — C1, C2, 1c
- [x] **WS1-C2** Causal-boost + Ablation (Agent 3, opus) — C3, C4
- [x] **WS1-D** Search Pipeline Safety (Agent 4, opus) — D1-D3
- [x] **WS1-E** Guards & Edge Cases (Agent 5, opus) — E1, E2
- [x] **WS2-1** Dead hot-path branches (Agent 6, sonnet) — 1a, 1b
- [x] **WS2-3** Dead module-level state (Agent 7, sonnet) — 3a-3e
- [x] **WS2-4** Dead functions & exports (Agent 8, sonnet) — 4a-4e (skip 4f: fsrs.ts planned features)
- [x] **WS3-P1** Quick wins performance (Agent 9, sonnet) — P1a-P1c
- [x] **WS3-P2** Test quality (Agent 10, sonnet) — P2a-P2d (P2d: no duplicate found in current file)

## Wave 2 — Dependent Work

- [x] **WS1-A** Entity normalization (Agent 11, opus) — A1, A2
- [x] **WS2-2** Dead flag functions (Agent 12, sonnet) — 2a-2c
- [x] **WS3-P4** SQL-level performance (Agent 13, sonnet) — P4a, P4b
- [x] **WS3-P3** Entity linker performance (Agent 14, sonnet) — P3a, P3b

## Wave 2.5 — Test Fixups (4 parallel agents)

- [x] Reconsolidation tests: `frequency_counter` → `importance_weight` (5 tests)
- [x] Five-factor scoring tests: citation fallback chain removed (3 tests)
- [x] Working-memory + session-cleanup tests: dead config fields removed (2 tests)
- [x] Channel/quality floor tests: QUALITY_FLOOR 0.2→0.005 (7 tests)
- [x] Entity-extractor tests: Unicode-aware normalization (2 tests)
- [x] Extraction-adapter tests: fallback removal (1 test)
- [x] Intent-routing tests: placeholder after getSubgraphWeights removal (1 test)
- [x] Memory-parser fix: isMemoryFile z_archive exclusion (1 test + source fix)

## Wave 3 — Verification

- [x] TypeScript compilation clean (`npx tsc --noEmit` — 0 errors)
- [x] Full test suite passes (226 files, 7003/7003 tests)
- [x] Spot-check critical fixes (all 8 checks pass)
- [x] Dead code verification grep (0 hits for all removed functions)
- [x] Implementation summary written
- [x] README updated (test counts 196→226 files, 5797→7003 tests)
- [x] Memory saved (memory #5103)
