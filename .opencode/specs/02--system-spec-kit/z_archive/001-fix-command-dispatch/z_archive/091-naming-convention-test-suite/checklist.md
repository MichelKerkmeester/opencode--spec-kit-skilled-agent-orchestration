---
title: "Checklist: Naming Convention Test Suite [091-naming-convention-test-suite/checklist]"
description: "CHK-001: PASS"
trigger_phrases:
  - "checklist"
  - "naming"
  - "convention"
  - "test"
  - "suite"
  - "091"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Naming Convention Test Suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.0 -->

---

## P0 - HARD BLOCKERS

- [x] CHK-001 All 200 JS files pass `node --check` (syntax valid)
- [x] CHK-002 All 98 MCP server JS files importable via `require()` (tests excluded)
- [x] CHK-003 All 43 scripts/ JS files importable via `require()` (tests excluded)
- [x] CHK-004 MCP server entry point (`context-server.js`) loads without crash
- [x] CHK-005 Bug 1 FIXED: `memory-context.js:299` uses `normalizedInput`
- [x] CHK-006 Bug 2 FIXED: `memory-parser.js:348,351` uses `causalLinks`/`causalBlockMatch`
- [x] CHK-007 Bug 3 FIXED: `causal-edges.js:561` accesses `stats.source_count`
- [x] CHK-008 All 28 shell scripts pass `bash -n` (syntax valid)
- [x] CHK-009 Zero snake_case function definitions in JS (except backward-compat)
- [x] CHK-010 Backward-compat aliases present in handler exports (22/22 aliases)

---

## P1 - REQUIRED

- [x] CHK-011 handlers/ export maps match expected function names (9/9 handlers pass)
- [x] CHK-012 lib/ export maps verified via runtime require() import chain
- [x] CHK-013 lib/cognitive/ verified via runtime require() import chain
- [x] CHK-014 lib/storage/ verified via runtime require() import chain
- [x] CHK-015 lib/scoring/ + lib/parsing/ verified via runtime require() import chain
- [x] CHK-016 scripts/ barrel index files re-export correctly (6/6 barrels pass)
- [x] CHK-017 Zero declaration/usage naming mismatches in production code
- [ ] CHK-018 Shell scripts: `registry-loader.sh` uses `called_by`/`gate_name` (not camelCase) — **Deferred to spec 090**
- [ ] CHK-019 Shell scripts: 3 files have `-u` flag added to `set` — **Deferred to spec 090**

---

## P2 - RECOMMENDED

- [ ] CHK-020 Skill docs: JS style_guide.md:106 misleading comment fixed — **Deferred to spec 090**
- [ ] CHK-021 Skill docs: config_checklist.md `camelCase keys` moved to P0 — **Deferred to spec 090**
- [x] CHK-022 Test suite has clear pass/fail output with counts
- [x] CHK-023 Test suite runs in <30 seconds (4.9s measured)

---

## Evidence

```
CHK-001: PASS
  Evidence: "All 200 JS files pass node --check" (test-naming-migration.js T1)
  Date: 2026-02-06

CHK-002: PASS
  Evidence: "98 MCP modules loaded OK (0 skipped: runtime deps)" (T2, tests/ excluded)
  Date: 2026-02-06

CHK-003: PASS
  Evidence: "43 script modules loaded OK (0 skipped: runtime deps)" (T9, tests/ excluded)
  Date: 2026-02-06

CHK-004: PASS
  Evidence: context-server.js loaded successfully during T2 import chain
  Date: 2026-02-06

CHK-005: PASS
  Evidence: "No references to normalized_input (bug is fixed)" (test-bug-regressions.js)
  Date: 2026-02-06

CHK-006: PASS
  Evidence: "No references to causal_links or causal_block_match (bug is fixed)" (test-bug-regressions.js)
  Date: 2026-02-06

CHK-007: PASS
  Evidence: "All SQL alias/JS property access pairs are consistent" (test-bug-regressions.js)
  Date: 2026-02-06

CHK-008: PASS
  Evidence: "All 28 shell scripts pass bash -n" (test-naming-migration.js T1)
  Date: 2026-02-06

CHK-009: PASS
  Evidence: "Zero snake_case function definitions found" (test-naming-migration.js T10)
  Date: 2026-02-06

CHK-010: PASS
  Evidence: "All 22 handle* functions have backward-compat aliases" (test-export-contracts.js T6)
  Date: 2026-02-06

CHK-011: PASS
  Evidence: 9/9 handler files pass export contract check (test-export-contracts.js T3)
  Date: 2026-02-06

CHK-016: PASS
  Evidence: 6/6 barrel files pass (core, extractors, loaders, renderers, spec-folder, utils)
  Date: 2026-02-06

CHK-017: PASS
  Evidence: "Zero declaration/usage naming mismatches found" (test-naming-migration.js T7)
  Date: 2026-02-06

CHK-022: PASS
  Evidence: All 3 test files show ✓/✗ per test, summary with PASSED/FAILED/SKIPPED counts
  Date: 2026-02-06

CHK-023: PASS
  Evidence: Full suite completes in 4.9 seconds
  Date: 2026-02-06
```
