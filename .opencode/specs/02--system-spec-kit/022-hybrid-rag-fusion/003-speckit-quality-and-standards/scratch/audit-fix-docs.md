# Fix Report: README Documentation (H-19)

**Source audit:** `audit-H19.md`
**Scope:** 68 README files, 22 sampled
**Date:** 2026-03-08

---

## HVR Banned Word Replacements

| File | Line | Banned Word | Proposed Replacement |
|------|------|-------------|---------------------|
| `system-spec-kit/README.md` | 588 | `Comprehensive` | `Multi-domain` (table cell: `research.md \| 3 \| Multi-domain research`) |
| `mcp_server/lib/search/README.md` | 795 | `comprehensive` | `thorough` or `full-scope` (sentence: "Sprint 8 delivered a thorough remediation pass across the search subsystem:") |
| `mcp_server/README.md` | 1049 | `elevated` | `increased` (sentence: "rank instability, increased context errors or extraction quality drop") |

**Notes:**
- `mcp_server/tests/README.md` has `comprehensive` embedded in filename `errors-comprehensive.vitest.ts` -- this is a filename reference, not prose. Renaming the test file is out of scope for a README fix. Marked as **borderline/skip**.
- `elevated` at line 1049 of `mcp_server/README.md` is used in a technical rollback context ("elevated context errors"). Borderline but replaceable with `increased` for HVR compliance.

---

## Accuracy Corrections

| File | Incorrect Claim | Correct Value | Source |
|------|----------------|---------------|--------|
| `system-spec-kit/README.md` line 106 | "25" MCP tools (By The Numbers table) | Verify and unify: root tree comment says 28 (line 815), tools/README says 23, test file asserts 25. **Needs single source of truth count.** | `context-server.ts` tool registration is the canonical source; recount required |
| `system-spec-kit/README.md` line 112 | "5,797 tests across 196 files" | Stale. tests/README.md says 7,003 tests / 226 files. Actual test files on disk: **243**. Update to actual disk count. | `find mcp_server/tests -name "*.vitest.ts" \| wc -l` = 243 |
| `system-spec-kit/README.md` line 743 | Comment: "Expected: 5,797 tests passing across 196 files" | Same staleness as line 112. Update to match actual counts. | Same as above |
| `system-spec-kit/README.md` line 815 | Tree comment: "(28 tools)" | Must match the unified tool count (see tool count issue above) | Recount from `context-server.ts` |
| `system-spec-kit/README.md` line 111 | "533 anchors across 78 skill READMEs" | Only 68 README files found in system-spec-kit. The "78" may include files outside system-spec-kit or be stale. **Recount required.** | `find` for README.md files in system-spec-kit = 68 |
| `mcp_server/README.md` (multiple lines) | Contains both "5,797/196" and "7,008/226" test stats in different sections | Unify to a single accurate figure. Current disk state: 243 test files. | Disk count |
| `mcp_server/lib/search/README.md` line 817 | "226 test files, 7,008 tests passing" | Test files on disk: 243. Test count needs re-run of `npx vitest run` to get current total. | Disk count for files; vitest run for test count |
| `mcp_server/tests/README.md` line 45 | "Test Files: 226" | Actual: 243 test files on disk | `find` count |
| `mcp_server/tests/README.md` line 46 | "Total Tests: 7,003" | Needs re-run of vitest to confirm current total | `npx vitest run` |
| `mcp_server/tools/README.md` line 38 | "23 tools across 5 dispatch modules" | Must match unified tool count | Recount from `context-server.ts` |
| `mcp_server/lib/README.md` line 47 | "Organized into 22 domain-specific folders" | Actual subdirectories: **24** | `find lib -maxdepth 1 -type d` = 24 |

---

## Broken Link Fixes

| File | Broken Link | Fix |
|------|-------------|-----|
| `constitutional/README.md` line 124 | `speckit-exclusivity.md` listed in directory structure and "Verify Installation" section | **File does not exist on disk.** Constitutional directory contains only `gate-enforcement.md` and `README.md`. Either (a) create the missing file, or (b) remove the reference from README.md lines mentioning it. |
| `mcp_server/tests/README.md` line 353 | `VERIFICATION_REPORT.md` listed in file tree | **File does not exist.** Line 625 explicitly says "This directory does not include a standalone `VERIFICATION_REPORT.md`." Self-contradictory. Remove from the file tree at line 353. |

---

## Formatting Fixes

| File | Issue | Fix |
|------|-------|-----|
| `mcp_server/lib/scoring/README.md` line 20 | Malformed TOC link: `- [2. KEY CONCEPTS]](#2--key-concepts)` has an extra closing bracket before the `(` | Change to: `- [2. KEY CONCEPTS](#2--key-concepts)` (remove the extra `]`) |

---

## Summary

- HVR fixes: 3 (2 genuine prose violations + 1 borderline)
- Accuracy fixes: 11 (test counts x5, tool counts x3, module folder count x1, anchor coverage x1, self-contradiction x1)
- Link fixes: 2 (speckit-exclusivity.md, VERIFICATION_REPORT.md)
- Formatting fixes: 1 (malformed TOC link)
- **Total: 17 discrete fixes**

### Priority Ordering

| Priority | Category | Count | Details |
|----------|----------|-------|---------|
| **P1** | Test count staleness | 5 | Three different numbers across 4 READMEs; 243 actual test files on disk |
| **P1** | Tool count inconsistency | 3 | Four different counts (23, 25, 28) across 4 READMEs |
| **P1** | Missing constitutional file | 1 | `speckit-exclusivity.md` referenced but absent |
| **P2** | HVR banned words | 3 | "comprehensive" x2 in prose, "elevated" x1 |
| **P2** | Self-contradictory content | 1 | `VERIFICATION_REPORT.md` listed in tree then denied in prose |
| **P2** | Broken markdown | 1 | Extra `]` in scoring/README TOC |
| **P2** | Module folder count | 1 | Claims 22, actual 24 |
| **P2** | Anchor coverage claim | 1 | Claims 78 READMEs, found 68 |
| | | **17** | |

### Dependency Note

The test count and tool count fixes require running actual counts before updating READMEs:
1. **Tool count:** Grep `context-server.ts` for registered tool definitions to get the canonical number.
2. **Test count:** Run `npx vitest run` from `mcp_server/` to get current test total. File count on disk is 243.
3. **Anchor count:** Run the anchor counting script or grep to verify current anchor total and README count.

All README updates should be done in a single pass to ensure cross-file consistency.
