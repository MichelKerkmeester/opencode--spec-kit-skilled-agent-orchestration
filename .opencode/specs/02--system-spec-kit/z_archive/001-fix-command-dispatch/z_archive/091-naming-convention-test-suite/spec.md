---
title: "Feature Specification: Naming Convention Test Suite [091-naming-convention-test-suite/spec]"
description: "Comprehensive test suite to verify all ~246 files adjusted during the OpenCode naming convention migration (spec 090). Tests confirm that every JS, shell, and Python script work..."
trigger_phrases:
  - "feature"
  - "specification"
  - "naming"
  - "convention"
  - "test"
  - "spec"
  - "091"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Naming Convention Test Suite

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.0 -->

---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Comprehensive test suite to verify all ~246 files adjusted during the OpenCode naming convention migration (spec 090). Tests confirm that every JS, shell, and Python script works correctly after renaming snake_case identifiers to camelCase, that 3 discovered runtime bugs are fixed, and that backward-compatible MCP handler exports function properly.

**Key Dependencies**: Spec 090 (naming convention alignment) must complete first
**Critical Risk**: Renamed identifiers may break cross-file imports at runtime

---

<!-- /ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planning |
| **Created** | 2026-02-06 |
| **Parent Spec** | `090-opencode-naming-conventions` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The naming convention migration (spec 090) renames identifiers across ~206 JS files, 9 skill docs, and touches shell/Python scripts. Without a comprehensive test suite, we cannot verify that:
1. All cross-file imports resolve correctly after rename
2. MCP server starts and handles all tool calls
3. Module exports match what callers expect
4. The 3 runtime bugs discovered during audit are fixed
5. Shell scripts still function with their naming changes

### Purpose
Create an automated, repeatable test suite that validates every adjusted script post-migration. This test suite becomes the Definition of Done for spec 090.

---

## 3. SCOPE

### In Scope

| Test Category | Files | Tests |
|---------------|-------|-------|
| T1: Syntax validation | 197 JS + 28 shell | `node --check` + `bash -n` on every file |
| T2: Module import chain | 144 MCP server JS | `require()` every file, verify no throw |
| T3: Export contract | ~40 key modules | Verify expected function exports exist |
| T4: MCP server startup | 1 entry point | `context-server.js` loads without error |
| T5: Bug regression | 3 specific files | Verify 3 bugs from audit are fixed |
| T6: Backward-compat aliases | ~10 handler files | snake_case aliases in `module.exports` |
| T7: Cross-reference integrity | All JS files | Zero undefined references (grep sweep) |
| T8: Shell script execution | 28 shell files | Key scripts execute with `--help` or dry-run |
| T9: Script module exports | 53 scripts JS | `require()` every scripts/ JS file |
| T10: Naming convention compliance | All JS files | Zero remaining snake_case function defs |

### Out of Scope
- Full functional/integration testing of MCP tool handlers (requires live DB)
- Performance testing
- Python script testing beyond `test_dual_threshold.py`
- Frontend/web code testing

### Files to Create

| File Path | Description |
|-----------|-------------|
| `scripts/tests/test-naming-migration.js` | Main test runner |
| `scripts/tests/test-export-contracts.js` | Export contract verification |
| `scripts/tests/test-bug-regressions.js` | 3 specific bug regression tests |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 197 JS files pass `node --check` | Zero syntax errors |
| REQ-002 | All 144 MCP server JS files importable | `require()` succeeds for every file |
| REQ-003 | MCP server entry point loads | `context-server.js` initializes without crash |
| REQ-004 | Bug 1 fixed: memory-context.js:299 | `normalizedInput` reference resolves |
| REQ-005 | Bug 2 fixed: memory-parser.js:348,351 | `causalLinks`/`causalBlockMatch` resolve |
| REQ-006 | Bug 3 fixed: causal-edges.js:561 | `stats.source_count` property accessed correctly |
| REQ-007 | Backward-compat aliases present | snake_case keys exist in handler exports |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | All 53 scripts/ JS files importable | `require()` succeeds for every file |
| REQ-009 | Zero snake_case function definitions | grep finds zero `function snake_case(` patterns |
| REQ-010 | Zero orphaned snake_case calls | No call site references non-existent snake_case name |
| REQ-011 | Key export contracts match | 40+ modules export expected function names |
| REQ-012 | Shell scripts pass `bash -n` | Zero syntax errors across 28 files |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Test suite runs end-to-end with zero failures
- **SC-002**: All 3 regression bugs verified fixed
- **SC-003**: MCP server starts successfully
- **SC-004**: Zero snake_case function definitions remain (except backward-compat aliases)

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 090 migration complete | High | Tests designed to run post-migration |
| Risk | Some modules need DB connection to import | Medium | Wrap require() in try-catch, distinguish import errors from DB errors |
| Risk | better-sqlite3 native module issues | Low | Test on same Node.js version as production |

---

## RELATED DOCUMENTS

- **Parent Spec**: `090-opencode-naming-conventions/spec.md`
- **Audit Reports**: `scratchpad/audit-{1-7}-*.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
