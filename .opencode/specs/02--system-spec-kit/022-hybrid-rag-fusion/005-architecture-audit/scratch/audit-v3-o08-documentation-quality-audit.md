# Audit V3 — O8: Documentation Quality Audit (Phases 014-018)

**Agent**: O8 (Claude Opus 4.6)
**Date**: 2026-03-21
**Scope**: Five documentation/finalization phases of the 022-hybrid-rag-fusion epic
**Audit Method**: Cross-reference spec claims against live filesystem, source code, and deliverable content

---

## Executive Summary

Phases 014-018 cover manual testing playbooks and four documentation rewrites (MCP README, Install Guide, Spec Kit README, Repo README). Phase 014 is the most mature with 19 child folders and alignment work completed. Phases 015-018 all have spec/plan/tasks created but **zero tasks are marked complete** -- the spec status fields say "In Progress" but no implementation-summary.md or checklist.md exists for any of them. Despite this, the actual README deliverables DO exist and are substantial, meaning the documentation was written but the spec folders tracking that work were never closed out.

The deliverables themselves contain **multiple count mismatches** against live source code. The most severe: tool count (33 actual vs 32 claimed everywhere), skill count (18 actual vs 16 claimed), command count (22 actual vs 21 claimed), and an incorrect MCP entry point path in the root README (`dist/index.js` does not exist; the correct file is `dist/context-server.js`).

**Total Findings**: 17
- CRITICAL: 2
- HIGH: 6
- MEDIUM: 7
- LOW: 2

---

## Findings

### O8-001: Root README references non-existent `dist/index.js` entry point
- **Severity**: CRITICAL
- **Category**: drift
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (lines 173, 566, 722)
- **Description**: The root README references `mcp_server/dist/index.js` as the MCP server entry point in three places: the Quick Start verification command (line 173), the `opencode.json` example (line 566), and a diagnostic command (line 722). This file does not exist on disk. The correct entry point is `dist/context-server.js`, which is what `opencode.json` actually uses and what the MCP README and Install Guide correctly reference.
- **Evidence**: `ls dist/index.js` returns "NOT FOUND". `ls dist/context-server.js` returns the file. `opencode.json` line 23 uses `context-server.js`. The MCP README Quick Start (line 122) correctly uses `context-server.js`.
- **Impact**: Anyone following the root README Quick Start or Troubleshooting section will get a "Cannot find module" error. The example `opencode.json` block in the root README would also fail if copy-pasted.
- **Recommended Fix**: Replace all three occurrences of `dist/index.js` with `dist/context-server.js` in the root README.

---

### O8-002: MCP tool count mismatch: 33 in source, 32 claimed everywhere
- **Severity**: CRITICAL
- **Category**: drift
- **Location**: Multiple files
- **Description**: `tool-schemas.ts` defines exactly 33 tools in the `TOOL_DEFINITIONS` array, but every documentation surface claims 32: the MCP README overview table (sums to 32 by listing L2 as 3), the Spec Kit README, the root README, and `CLAUDE.md`. The discrepancy originates from the MCP README's 7-Layer overview table listing L2 (Core) as 3 tools, while the L2 section heading and body document 4 tools (memory_search, memory_quick_search, memory_match_triggers, memory_save). The actual L2 count in `TOOL_DEFINITIONS` is 4.
- **Evidence**: `grep -c "^  name: '" tool-schemas.ts` returns 33. The `TOOL_DEFINITIONS` export lists L1:1, L2:4, L3:3, L4:4, L5:8, L6:8, L7:5 = 33. The MCP README overview table says L2:3, totaling 32. The L2 section heading says "(4 tools)".
- **Impact**: All documentation surfaces are off by 1. The package.json description is even further off, claiming "28 tools" (severely outdated).
- **Recommended Fix**: Update the MCP README overview table L2 row from 3 to 4. Update all documentation surfaces from "32" to "33". Update package.json description from "28" to "33".

---

### O8-003: Skill count mismatch: 18 actual vs 16 claimed
- **Severity**: HIGH
- **Category**: drift
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (line 48, 57, 389, 813)
- **Description**: The `.opencode/skill/` directory contains 18 actual skills (excluding `scripts/` utility folder and `README.md`). The root README claims 16 skills in multiple places. Two skills are missing from the Skills Library listing: `sk-deep-research` and `mcp-coco-index`.
- **Evidence**: `ls .opencode/skill/ | grep -v README | grep -v scripts` lists 18 skill directories, each with a `SKILL.md`. The root README Skills Library (Section 8) lists only 16 skills. `sk-deep-research` is referenced elsewhere in the README (the `@deep-research` agent uses it) but is not listed in the skills table. `mcp-coco-index` is referenced in CLAUDE.md as "CocoIndex Code MCP" but absent from the skills table.
- **Impact**: Users browsing the Skills Library miss two available skills. The framework description tagline ("16 specialized skills") is inaccurate.
- **Recommended Fix**: Add `sk-deep-research` and `mcp-coco-index` to the Skills Library tables in the root README. Update all count references from 16 to 18. Update MEMORY.md's "Skill Count: 16 folders" note.

---

### O8-004: Command count mismatch: 22 actual vs 21 claimed
- **Severity**: HIGH
- **Category**: drift
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (lines 48, 58, 813)
- **Description**: The actual command inventory is 22: 8 spec_kit + 6 memory + 7 create + 1 utility (agent_router). The root README claims 21 in the overview (line 48) and footer (line 813). The Command Architecture section (Section 7) lists 7 spec_kit commands (missing `deep-research`), 6 memory commands (correct), and 5 create commands (missing `feature-catalog` and `testing-playbook`).
- **Evidence**: `ls .opencode/command/spec_kit/*.md` shows 8 files including `deep-research.md`. `ls .opencode/command/create/*.md` shows 7 files including `feature-catalog.md` and `testing-playbook.md`. The root README spec_kit table (line 344-354) lists 7 commands, missing `/spec_kit:deep-research`. The create table (line 368-374) lists 5 commands, missing `/create:feature-catalog` and `/create:testing-playbook`.
- **Impact**: Users cannot discover the deep-research, feature-catalog, or testing-playbook commands from the root README.
- **Recommended Fix**: Add `/spec_kit:deep-research`, `/create:feature-catalog`, and `/create:testing-playbook` to the root README command tables. Update count from 21 to 22.

---

### O8-005: Spec Kit README claims "15 commands (8 spec_kit + 7 memory)" -- count drift
- **Severity**: HIGH
- **Category**: drift
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/README.md` (line 52)
- **Description**: The Spec Kit README Key Statistics table says "Commands: 15 (8 spec_kit + 7 memory)". The actual memory commands are 6 (not 7): analyze, continue, learn, manage, save, shared. The Spec Kit README's "Memory Commands (7)" section heading (line 329) also claims 7 but then lists 6 commands (with one extra row for "Analysis mode" that is a sub-feature of `/memory:analyze`, not a separate command).
- **Evidence**: `ls .opencode/command/memory/*.md` returns 6 files. The Spec Kit README heading says "(7)" but body lists 6 bullet rows plus 1 sub-feature annotation.
- **Impact**: Minor confusion about the actual number of memory commands.
- **Recommended Fix**: Update the Spec Kit README to say "Commands: 14 (8 spec_kit + 6 memory)" in the statistics table and "(6)" in the section heading. Or if the intent is to count all commands including create/, update to the real total of 22.

---

### O8-006: Root README memory channel listing omits Graph and Degree channels
- **Severity**: HIGH
- **Category**: completeness
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (lines 280-285, 90-96)
- **Description**: The MCP README correctly identifies 5 search channels (Vector, FTS5, BM25, Skill Graph, Degree). The root README's Memory Retrieval table (Section 5, lines 280-285) only lists 3 channels (Vector, BM25, FTS5) plus "Fusion" as a fourth row. The architecture diagram (line 93) says "3-channel hybrid: Vector + BM25 + FTS5 (RRF)" -- missing Graph and Degree channels. The MCP README's Key Statistics table correctly says "Search channels: 5".
- **Impact**: The root README understates the search system capabilities. Users reading only the root README get an incomplete picture.
- **Recommended Fix**: Update the root README Memory Retrieval table to include all 5 channels and fix the architecture diagram channel count.

---

### O8-007: Root README MCP tool count in architecture diagram says "32 MCP tools: 32 memory + 7 code mode" (text error)
- **Severity**: HIGH
- **Category**: quality
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (line 90)
- **Description**: Line 90 reads `MEMORY ENGINE (32 MCP tools: 32 memory + 7 code mode)`. The "32 MCP tools" claim is immediately contradicted by the arithmetic "32 memory + 7 code mode" which would be 39. The Key Statistics table (line 59) says "MCP tools: 39 (32 memory + 7 code mode)", which is internally consistent but still uses the wrong memory tool count (should be 33).
- **Impact**: The architecture diagram has a confusing label that contradicts both its own arithmetic and the statistics table above it.
- **Recommended Fix**: Fix the diagram label to say "MEMORY ENGINE (33 memory MCP tools)" or "MEMORY ENGINE (33 MCP tools)" and update the Key Statistics table to "40 (33 memory + 7 code mode)".

---

### O8-008: Spec Kit README missing `memory_quick_search` from tool grouping
- **Severity**: MEDIUM
- **Category**: completeness
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/README.md` (lines 292-302)
- **Description**: The MCP Tools summary table in the Spec Kit README lists 8 tool groups that sum to 32 tools. The `memory_quick_search` tool is not listed in any group. It should be in "Search and Retrieval" alongside `memory_search`.
- **Evidence**: The 5 tools listed in "Search and Retrieval" are: memory_context, memory_search, memory_match_triggers, memory_list, memory_stats. The tool `memory_quick_search` is missing.
- **Impact**: Users checking the Spec Kit README tool inventory would not know `memory_quick_search` exists.
- **Recommended Fix**: Add `memory_quick_search` to the "Search and Retrieval" group, updating its count from 5 to 6 and the overall total accordingly.

---

### O8-009: package.json description says "28 tools" -- severely outdated
- **Severity**: MEDIUM
- **Category**: drift
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/package.json` (line 4)
- **Description**: The package.json description field says "provides 28 tools" but the actual count is 33. This is 5 tools behind reality.
- **Evidence**: `"description": "Semantic Memory MCP Server - provides 28 tools for semantic search..."` vs 33 tools in `TOOL_DEFINITIONS`.
- **Impact**: NPM package metadata is misleading. Anyone inspecting the package sees an outdated capability description.
- **Recommended Fix**: Update the description field to say "provides 33 tools".

---

### O8-010: Phases 015-018 spec folders show "In Progress" with 0 tasks complete, but deliverables exist
- **Severity**: MEDIUM
- **Category**: completeness
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-rewrite-memory-mcp-readme/` through `018-rewrite-repo-readme/`
- **Description**: All four spec folders (015, 016, 017, 018) have status "In Progress" in their spec.md metadata and 0/N tasks marked complete in their tasks.md files. However, the actual deliverables (MCP README at 1404 lines, Install Guide at 1029 lines, Spec Kit README at 692 lines, Root README at 813 lines) all exist and appear to be the rewritten versions. None of the four spec folders contain `implementation-summary.md` or `checklist.md`. Memory files exist for 018, confirming work was done.
- **Evidence**: 018-rewrite-repo-readme/tasks.md shows "0/27 tasks complete". The root README contains the role-based navigation, agent listing, skills library, gate system, etc. that the spec describes. Memory file `16-03-16_12-15__phase5-implementation-83-fixes-applied.md` exists in 018.
- **Impact**: Spec folder tracking does not reflect reality. These phases appear incomplete in any audit or status report despite the deliverables being done. No implementation-summary provides traceability.
- **Recommended Fix**: Close out each spec folder: mark tasks as [x], update status to "Complete", create implementation-summary.md for each.

---

### O8-011: Install Guide references `.mcp.json` for Claude Code but actual file is `.claude/mcp.json`
- **Severity**: MEDIUM
- **Category**: drift
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` (lines 295, 390)
- **Description**: The Install Guide tells users to add MCP config to `.mcp.json` in the project root for Claude Code (Option B). While `.mcp.json` does exist at the project root, the canonical Claude Code config is at `.claude/mcp.json`. Both files exist, but the Install Guide only mentions `.mcp.json` and does not mention `.claude/mcp.json`. This may confuse users who have both files.
- **Evidence**: `ls .mcp.json` returns EXISTS. `ls .claude/mcp.json` returns EXISTS. The Install Guide says "Add the following to `.mcp.json` in your project root" without mentioning the `.claude/mcp.json` alternative.
- **Impact**: Users may configure the wrong file or wonder why they have two config files.
- **Recommended Fix**: Clarify in the Install Guide that Claude Code can use either `.mcp.json` (project root) or `.claude/mcp.json`, and state which takes precedence.

---

### O8-012: Root README database path inconsistency
- **Severity**: MEDIUM
- **Category**: drift
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (line 554)
- **Description**: The root README Configuration section (line 554) says the default database path is `.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite`. The Install Guide (line 81, 282) says the canonical path is `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite`. These are different paths -- the root README has `shared/mcp_server/database/` while the Install Guide has `mcp_server/dist/database/`.
- **Evidence**: Root README line 554: `Default database path: .opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite`. Install Guide lines 81, 109: `mcp_server/dist/database/context-index.sqlite`.
- **Impact**: Users looking at the root README will look for the database in the wrong location.
- **Recommended Fix**: Align the root README to use the canonical path from the Install Guide: `mcp_server/dist/database/context-index.sqlite`.

---

### O8-013: Playbook folder naming convention differs from spec child folder naming
- **Severity**: MEDIUM
- **Category**: quality
- **Location**: `.opencode/skill/system-spec-kit/manual_testing_playbook/` vs `.opencode/specs/.../014-manual-testing-per-playbook/`
- **Description**: The playbook subfolder naming uses `NN--name` (double-dash, e.g., `01--retrieval`, `13--memory-quality-and-indexing`) while the spec child folders use `NNN-name` (single-dash, e.g., `001-retrieval`, `013-memory-quality-and-indexing`). While this is not a functional issue, it creates a mapping friction when cross-referencing between the two directory trees. The spec.md Phase Documentation Map table references the spec folder naming.
- **Evidence**: Playbook: `01--retrieval`, `02--mutation`, etc. Spec children: `001-retrieval`, `002-mutation`, etc.
- **Impact**: Minor cognitive overhead when navigating between playbook and spec folder trees.
- **Recommended Fix**: Document the naming mapping explicitly, or consider standardizing one convention.

---

### O8-014: MCP README internal inconsistency in L2 Core tool count
- **Severity**: MEDIUM
- **Category**: quality
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md` (lines 235, 293)
- **Description**: The 7-Layer Architecture overview table (line 235) says "L2 | Core | 3". The L2 section heading (line 293) says "L2: Core (4 tools, token budget: 1500)". The section then documents 4 tools. The overview table is wrong; L2 has 4 tools.
- **Evidence**: Overview table line 235: `| L2 | Core | 3 |`. Section heading line 293: `### L2: Core (4 tools, token budget: 1500)`. Four tools documented: memory_search, memory_quick_search, memory_match_triggers, memory_save.
- **Impact**: Self-contradictory documentation within the same file.
- **Recommended Fix**: Update the overview table L2 row from 3 to 4.

---

### O8-015: Root README spec_kit commands table missing `/spec_kit:deep-research`
- **Severity**: LOW
- **Category**: completeness
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (lines 344-354)
- **Description**: The spec_kit commands table in Section 7 lists 7 commands but `.opencode/command/spec_kit/` contains 8 files including `deep-research.md`. The `/spec_kit:deep-research` command is mentioned in Section 4 (Quick Reference table in CLAUDE.md) and the `@deep-research` agent is documented, but the command itself is not in the root README's command table.
- **Evidence**: `ls .opencode/command/spec_kit/*.md` returns 8 files. The table header does not state a count but lists 7 rows.
- **Impact**: Users cannot discover `/spec_kit:deep-research` from the root README.
- **Recommended Fix**: Add `/spec_kit:deep-research` to the spec_kit commands table.

---

### O8-016: Root README create commands table missing 2 commands
- **Severity**: LOW
- **Category**: completeness
- **Location**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/README.md` (lines 368-374)
- **Description**: The create commands table lists 5 commands but `.opencode/command/create/` contains 7 `.md` files. Missing: `/create:feature-catalog` and `/create:testing-playbook`.
- **Evidence**: `ls .opencode/command/create/*.md` returns 7 files including `feature-catalog.md` and `testing-playbook.md`.
- **Impact**: Users cannot discover these two creation commands from the root README.
- **Recommended Fix**: Add both commands to the create table.

---

### O8-017: Spec 015 claims MCP README was "~1281 lines" but actual file is 1404 lines
- **Severity**: LOW (cosmetic)
- **Category**: drift
- **Location**: `.opencode/specs/.../015-rewrite-memory-mcp-readme/spec.md` (line 39)
- **Description**: The 015 spec's Problem Statement says "The MCP server README (`mcp_server/README.md`, ~1281 lines)". The current file is 1404 lines, indicating the README was updated after the spec was written (which is expected since the spec describes a rewrite).
- **Evidence**: `wc -l mcp_server/README.md` returns 1404.
- **Impact**: None -- this is expected. The spec describes the pre-rewrite state.
- **Recommended Fix**: No action needed. The line count in the spec refers to the original document before rewrite.

---

## Summary Table

| ID | Severity | Category | Location Summary | Issue |
|----|----------|----------|-----------------|-------|
| O8-001 | CRITICAL | drift | Root README | References non-existent `dist/index.js` (3 occurrences) |
| O8-002 | CRITICAL | drift | Multiple | Tool count 33 in source, 32 claimed everywhere |
| O8-003 | HIGH | drift | Root README | Skill count 18 actual, 16 claimed; 2 skills missing from listing |
| O8-004 | HIGH | drift | Root README | Command count 22 actual, 21 claimed; 3 commands missing from tables |
| O8-005 | HIGH | drift | Spec Kit README | Memory command count says 7 but actual is 6 |
| O8-006 | HIGH | completeness | Root README | Only 3 of 5 search channels documented |
| O8-007 | HIGH | quality | Root README | Architecture diagram label arithmetic error |
| O8-008 | MEDIUM | completeness | Spec Kit README | `memory_quick_search` missing from tool grouping |
| O8-009 | MEDIUM | drift | package.json | Says "28 tools" -- 5 behind reality |
| O8-010 | MEDIUM | completeness | Specs 015-018 | All 4 spec folders show 0% complete despite deliverables existing |
| O8-011 | MEDIUM | drift | Install Guide | References `.mcp.json` without mentioning `.claude/mcp.json` |
| O8-012 | MEDIUM | drift | Root README | Database path differs from Install Guide canonical path |
| O8-013 | MEDIUM | quality | Playbook/Spec | Folder naming convention mismatch between trees |
| O8-014 | MEDIUM | quality | MCP README | Internal L2 count inconsistency (3 vs 4) |
| O8-015 | LOW | completeness | Root README | Missing `/spec_kit:deep-research` from command table |
| O8-016 | LOW | completeness | Root README | Missing 2 create commands from table |
| O8-017 | LOW | drift | Spec 015 | Line count in spec is pre-rewrite (cosmetic, no fix needed) |

---

## Recommendations Priority

### Immediate (P0)
1. Fix `dist/index.js` -> `dist/context-server.js` in root README (O8-001)
2. Update tool count from 32 to 33 across all surfaces (O8-002, O8-014)
3. Update package.json description from "28" to "33" (O8-009)

### Short-term (P1)
4. Add missing skills (`sk-deep-research`, `mcp-coco-index`) to root README (O8-003)
5. Add missing commands to root README tables (O8-004, O8-015, O8-016)
6. Fix memory command count in Spec Kit README (O8-005)
7. Add missing search channels to root README (O8-006)
8. Fix architecture diagram label (O8-007)
9. Add `memory_quick_search` to Spec Kit README tool grouping (O8-008)
10. Fix database path in root README (O8-012)

### Medium-term (P2)
11. Close out spec folders 015-018 (O8-010)
12. Clarify Claude Code config file options in Install Guide (O8-011)
13. Document naming convention mapping between playbooks and spec folders (O8-013)
