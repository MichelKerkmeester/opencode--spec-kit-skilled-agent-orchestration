# Audit H-19: README.md Files

**Scope:** 68 total README files found, 22 sampled
**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6 (leaf agent)

## Sampled File Results

| # | File | HVR | Structure | Accuracy | Links | Issues |
|---|------|-----|-----------|----------|-------|--------|
| 1 | `system-spec-kit/README.md` | 1 violation | Quick Start: YES, Examples: YES | Test count stale; tool count inconsistent | All OK | comprehensive (1x); test stats 5,797/196 vs actual 243 files; tool count 25 vs 28 elsewhere |
| 2 | `config/README.md` | PASS | Quick Start: NO (has Usage), Examples: YES | File list accurate | All OK | No Quick Start section per se, but has Usage section with examples |
| 3 | `constitutional/README.md` | PASS | Quick Start: YES, Examples: YES | Lists `speckit-exclusivity.md` but file missing | OK | `speckit-exclusivity.md` referenced in directory listing but does not exist on disk |
| 4 | `mcp_server/README.md` | 1 violation | Quick Start: YES, Examples: YES | Test count stale; tool count 28 | All OK | "elevated" (1x in rollback context); test stats say 5,797/196 in one place, 7,008/226 in another |
| 5 | `mcp_server/api/README.md` | PASS | Quick Start: NO, Examples: NO | Accurate | All OK | Minimal README; no Quick Start or examples (acceptable for thin API surface doc) |
| 6 | `mcp_server/core/README.md` | PASS | Quick Start: NO, Examples: NO | Accurate | All OK | Compact format; no Quick Start/examples (acceptable for internal module) |
| 7 | `mcp_server/lib/README.md` | PASS | Quick Start: YES, Examples: YES | Module count "99 in 22 folders" vs 24 dirs found | All OK | Module total count may be slightly stale |
| 8 | `mcp_server/lib/search/README.md` | 1 violation | Quick Start: NO (has Usage Examples), Examples: YES | Schema claims v15; 34 files listed | All OK | "comprehensive" (1x); "underscore" used in code context (false positive, not HVR); no dedicated Quick Start section |
| 9 | `mcp_server/lib/cognitive/README.md` | PASS | Quick Start: NO (has Usage Examples), Examples: YES | Module count 10 matches listing | All OK | Clean; detailed technical content |
| 10 | `mcp_server/lib/storage/README.md` | PASS | Quick Start: NO (has Usage Examples), Examples: YES | Module count 8 matches listing | All OK | Clean |
| 11 | `mcp_server/handlers/README.md` | PASS | Quick Start: NO, Examples: NO | Module listing accurate | All OK | Compact format; internal module doc |
| 12 | `mcp_server/tools/README.md` | PASS | Quick Start: NO, Examples: NO | Claims 23 tools vs 25/28 elsewhere | All OK | Tool count discrepancy with root/mcp_server READMEs |
| 13 | `mcp_server/database/README.md` | PASS | Quick Start: NO, Examples: NO | Accurate | All OK | Compact format |
| 14 | `mcp_server/tests/README.md` | PASS | Quick Start: YES, Examples: YES | Claims 226 files/7,003 tests vs 243 actual files; VERIFICATION_REPORT.md listed but missing | OK | Test file count 226 vs 243 actual; references non-existent VERIFICATION_REPORT.md in structure |
| 15 | `scripts/README.md` | PASS | Quick Start: NO, Examples: YES | Inventory accurate | All OK | Compact format |
| 16 | `templates/README.md` | PASS | Quick Start: NO, Examples: YES (inline) | Accurate | All OK | Clean; concise |
| 17 | `scripts/memory/README.md` | PASS | Quick Start: NO, Examples: YES | Inventory matches 7 scripts | All OK | Compact; canonical runbook location |
| 18 | `shared/README.md` | PASS | Quick Start: YES, Examples: YES | Key stats accurate | All OK | Clean; well-structured |
| 19 | `templates/level_2/README.md` | PASS | Quick Start: YES, Examples: YES | File list accurate | All OK | Clean; concise |
| 20 | `mcp_server/lib/scoring/README.md` | PASS | Quick Start: NO (has Usage), Examples: YES | Module count 5 matches listing | OK | **Broken markdown**: TOC line reads `- [2. KEY CONCEPTS]](#2--key-concepts)` (extra `]`) |
| 21 | `mcp_server/formatters/README.md` | PASS | Quick Start: NO, Examples: NO | Accurate | All OK | Compact format |
| 22 | `mcp_server/lib/providers/README.md` | PASS | Quick Start: NO (has Usage Examples), Examples: YES | Module count 2 matches listing | All OK | Clean |

## HVR Violations Summary

| Banned Word | File | Context | Count |
|-------------|------|---------|-------|
| `comprehensive` | `system-spec-kit/README.md` | "Comprehensive multi-domain research" (template description) | 1 |
| `comprehensive` | `mcp_server/lib/search/README.md` | "Sprint 8 delivered a comprehensive remediation pass" | 1 |
| `comprehensive` | `mcp_server/tests/README.md` | Filename: `errors-comprehensive.vitest.ts` (embedded in file name, not prose) | 1 |
| `elevated` | `mcp_server/README.md` | "elevated context errors" (technical usage in rollback procedure) | 1 |

**Notes on false positives excluded:**
- `forge/forget/forgetting`: All occurrences are legitimate uses of "forget/forgetting" in the context of memory decay. Not the banned word "forge."
- `navigate/navigating`: All 4 occurrences are bash comments (`# 1. Navigate to...`). These are instructional, not HVR prose. Borderline but arguably acceptable in command context.
- `underscore`: The single occurrence refers to literal underscore characters in code tokenization, not the banned word "underscore" meaning "to emphasize."

## Broken Links / Missing Files

| Source File | Referenced Path | Status |
|-------------|-----------------|--------|
| `constitutional/README.md` | `speckit-exclusivity.md` | **MISSING** - listed in directory structure but file does not exist |
| `mcp_server/tests/README.md` | `VERIFICATION_REPORT.md` | **MISSING** - listed in file structure then contradicted in prose ("does not include a standalone VERIFICATION_REPORT.md") |

## Formatting Issues

| File | Issue | Line |
|------|-------|------|
| `mcp_server/lib/scoring/README.md` | Malformed TOC link: `- [2. KEY CONCEPTS]](#2--key-concepts)` has extra `]` before `](`; should be `- [2. KEY CONCEPTS](#2--key-concepts)` | Line 20 |

## Accuracy / Consistency Issues

| Issue | Details | Severity |
|-------|---------|----------|
| **Test count inconsistency** | Root README says "5,797 tests across 196 files" (Last Verified 2026-02-27). Tests README says "7,003 tests across 226 files". MCP Server README says both "5,797/196" and "7,008/226" in different sections. Actual test files on disk: 243. | P1 |
| **MCP tool count inconsistency** | Root README "By The Numbers": 25 tools. Root README Components section: 28 tools. MCP Server README: 28 tools. Tools dispatch README: 23 tools. | P1 |
| **Module folder count** | lib/README.md claims "22 domain-specific folders" but 24 subdirectories found. | P2 |
| **ANCHOR coverage claim** | Root README claims "533 anchors across 78 skill READMEs" but only 68 README files found in system-spec-kit (excluding node_modules/dist). The 78 may include READMEs outside system-spec-kit. | P2 |
| **Constitutional directory listing** | constitutional/README.md lists `speckit-exclusivity.md` in its directory structure and "Verify Installation" section but the file does not exist. | P1 |
| **VERIFICATION_REPORT.md** | tests/README.md lists it in the file tree but then contradicts itself in Section 7, saying it does not exist. Self-contradictory. | P2 |

## Summary

- **Files in scope:** 68
- **Files sampled:** 22
- **HVR violations:** 2 genuine ("comprehensive" x2 in prose), 1 in filename (borderline), 1 borderline ("elevated") -- across 3 files
- **Broken/missing files:** 2 (`speckit-exclusivity.md`, `VERIFICATION_REPORT.md`)
- **Formatting issues:** 1 (malformed TOC link in scoring/README.md)
- **Accuracy/consistency issues:** 6 (test counts, tool counts, module counts, anchor coverage claim, constitutional listing, self-contradiction)

### Top Concerns

1. **Test count staleness (P1):** Three different numbers cited across READMEs (5,797/196 vs 7,003/226 vs 7,008/226 vs 243 actual files). Root README has the oldest numbers.
2. **Tool count inconsistency (P1):** Four different tool counts (23, 25, 28) across four READMEs. Needs a single source of truth.
3. **Missing constitutional file (P1):** `speckit-exclusivity.md` referenced in constitutional/README.md but does not exist on disk.
4. **Broken markdown in scoring README (P2):** Extra `]` in TOC link makes the link non-functional.
5. **HVR "comprehensive" usage (P2):** Two instances in prose. One in template description table ("Comprehensive multi-domain research"), one in sprint summary. Both could be replaced with more specific language.
