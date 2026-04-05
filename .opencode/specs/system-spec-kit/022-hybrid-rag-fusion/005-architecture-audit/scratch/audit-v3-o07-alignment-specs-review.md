# Audit V3 — Agent O7: Alignment Specs Review (010-013)

**Auditor**: O7 (Claude Opus 4.6)
**Date**: 2026-03-21
**Scope**: Phases 011-skill-alignment, 012-command-alignment, 013-agents-alignment, 014-agents-md-alignment

---

## Executive Summary

All four alignment phases (010-013) have been implemented and marked Complete. However, the audit uncovered several drift issues that have emerged since completion: the command count changed from 7 to 6 after a context/analyze merge (011 Phase 5 / T24-T27), agent files have re-drifted since the 012 sync, the `/memory:shared` Quick Reference row is missing from live AGENTS.md/CLAUDE.md despite 013 claiming completion, and 010 has an in-progress sub-phase (001) that was never finished. Additionally, 012 and 013 are conceptually distinct (runtime agent files vs. governance framework tables) and NOT redundant.

**Verdicts:**
- 011-skill-alignment: **(b) in-progress** -- parent complete, sub-phase 001 incomplete
- 012-command-alignment: **(a) complete** -- thoroughly executed with addendum
- 013-agents-alignment: **(a) complete at time of execution**, but drift has recurred
- 014-agents-md-alignment: **(a) complete at time of execution**, but `/memory:shared` row missing from live files

---

## Phase-by-Phase Analysis

### 011-skill-alignment

**Status**: PARENT COMPLETE, SUB-PHASE IN-PROGRESS

The parent 010 phase went through extensive research (10 scratch agent files) and a 5-phase execution plan. Phase 5 applied ~83 fixes across SKILL.md, environment_variables.md, 3 reference files, and 7 stale catalog entries. 26/26 tasks completed. The implementation-summary is detailed and well-evidenced.

However, a sub-phase `001-post-session-capturing-alignment` was created to propagate changes from specs 016-018, 011, 012, and 013 back into system-spec-kit docs. Its tasks.md shows T001-T009 as `[x]` complete but T010-T012 (verification sprint) remain `[ ]` unchecked. The checklist.md has ALL items `[ ]` unchecked (CHK-001 through CHK-011). This sub-phase is in-progress and abandoned mid-flight.

### 012-command-alignment

**Status**: COMPLETE (with v2.4.0.0 addendum)

The most thoroughly executed of all four phases. 28/28 tasks completed across 5 phases plus a Phase 5 addendum that merged context.md into analyze.md, reducing the command suite from 7 to 6. All 32 MCP tools have documented command homes. The implementation updated 5 existing commands, created 2 new commands (analyze.md, shared.md), then merged context into analyze. Full verification evidence exists with 24/24 checklist items verified.

The final command surface is 6 commands: `/memory:analyze`, `/memory:save`, `/memory:manage`, `/memory:learn`, `/memory:continue`, `/memory:shared`.

### 013-agents-alignment

**Status**: COMPLETE at time of execution, but DRIFT HAS RECURRED

Phase 012 synced 18 agent files (9 agents x 2 runtimes: Claude, Gemini) from canonical `.opencode/agent/` on 2026-03-15. All 31 tasks completed, all 9 checklist items verified.

However, the canonical agents have been modified since the sync date (e.g., write.md modified Mar 19, context.md modified Mar 20, debug/orchestrate/ultra-think/speckit modified Mar 18). The Claude and Gemini copies have NOT been kept in sync for all of these changes. Specific drift found:
- `write.md`: canonical has new Mode 2 entries (Catalog Creation, Playbook Creation), Claude copy is missing them (683 bytes smaller)
- `deep-research.md`: Gemini copy has stale budget guidance ("Maximum 8 tool calls" vs canonical "8-11 tool calls") and missing progressive synthesis config

### 014-agents-md-alignment

**Status**: COMPLETE at time of execution, but POST-COMPLETION DRIFT

Phase 013 updated Quick Reference tables in 3 AGENTS.md governance framework files plus CLAUDE.md. 14/14 tasks completed across initial implementation and two refinement passes. The phase is distinct from 012: it handles governance framework markdown tables (Quick Reference workflows), NOT runtime agent definition files.

However, the `/memory:shared` row that 013 claims to have added (lines 57/84) is NOT present in the current live AGENTS.md or CLAUDE.md. The `/memory:analyze` row IS present but the `/memory:shared` row appears to have been removed or overwritten by a subsequent edit. Additionally, the spec still references "7-command suite" but the actual current surface is 6 commands (after the context/analyze merge in 011 Phase 5).

---

## Findings

### O7-001: 010 Sub-Phase 001 Abandoned Mid-Flight
- **Severity**: MEDIUM
- **Category**: completeness
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/001-post-session-capturing-alignment/`
- **Description**: The sub-phase `001-post-session-capturing-alignment` has tasks T001-T009 marked complete but T010-T012 (verification sprint) unchecked. ALL checklist items (CHK-001 through CHK-011) remain unchecked. The phase claims status "In Progress" in spec.md.
- **Evidence**: `tasks.md` lines 20-22 show `[ ] T010`, `[ ] T011`, `[ ] T012`. `checklist.md` shows all 11 items as `[ ]`.
- **Impact**: Work was performed (9 tasks) but never verified. The system-spec-kit docs may have partially-applied changes from specs 016-018 without verification that they are correct and complete.
- **Recommended Fix**: Either complete the verification sprint (T010-T012) and check off the checklist, or mark the sub-phase as abandoned with a note explaining why (if the work was superseded by Phase 019 or another effort).

### O7-002: 012 Agent Drift Has Recurred Post-Sync
- **Severity**: HIGH
- **Category**: alignment
- **Location**: `.claude/agents/write.md`, `.gemini/agents/deep-research.md`, and potentially others
- **Description**: The canonical `.opencode/agent/` definitions have been modified after the 012 sync date (Mar 15) but the Claude and Gemini runtime copies have not been updated for all changes. This is the exact same problem 012 was created to solve, now recurring 6 days later.
- **Evidence**:
  - `write.md`: canonical 22,801 bytes (Mar 19) vs Claude 22,118 bytes (Mar 15) -- 683 bytes smaller, missing Mode 2 entries for Catalog Creation and Playbook Creation, missing feature_catalog and manual_testing_playbook doc type rows, and missing deeper reference path pattern
  - `deep-research.md`: Gemini copy (Mar 18 18:10) stale vs canonical (Mar 18 19:41) -- budget guidance differs ("Maximum 8 tool calls" vs "8-11 tool calls"), missing progressive synthesis config block
  - `context.md`: canonical modified Mar 20, Claude/Gemini modified Mar 21 (likely re-synced)
- **Impact**: Claude and Gemini runtimes execute outdated agent instructions, causing behavioral inconsistency. The write agent in Claude lacks knowledge of feature catalog and testing playbook creation modes.
- **Recommended Fix**: (1) Re-run the 012 sync operation for all 9 agents. (2) Create an automated drift-detection mechanism (script or CI check) that compares body content hashes between canonical and runtime copies, preventing silent drift accumulation.

### O7-003: `/memory:shared` Row Missing from Live AGENTS.md and CLAUDE.md
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `AGENTS.md` line 64 area, `CLAUDE.md` line 65 area
- **Description**: Phase 013 implementation-summary claims the "Shared memory" row was added to all 3 AGENTS.md files and CLAUDE.md. However, grep for `/memory:shared` and "Shared memory" returns zero matches in both AGENTS.md and CLAUDE.md. The row appears to have been removed or overwritten by a subsequent edit.
- **Evidence**: `grep '/memory:shared' AGENTS.md` returns 0 matches. `grep 'Shared memory' AGENTS.md` returns 0 matches. The checklist.md for 013 claims `[x]` on the P0 item verifying `/memory:shared` presence. The Quick Reference table currently ends at the "Analysis/evaluation" row (line 63 in AGENTS.md) with no Shared memory row after it.
- **Impact**: The `/memory:shared` command is undiscoverable from the AGENTS.md Quick Reference table. Users and AI agents looking at the Quick Reference will not know this command exists.
- **Recommended Fix**: Re-add the "Shared memory" row to all AGENTS.md files and CLAUDE.md Quick Reference tables: `| **Shared memory** | /memory:shared -> create, member, status (deny-by-default governance) |`

### O7-004: 013 Spec References Stale "7-Command Suite"
- **Severity**: LOW
- **Category**: alignment
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/014-agents-md-alignment/spec.md` line 45, `plan.md` line 3, `implementation-summary.md` lines 3, 15
- **Description**: Phase 013 spec docs reference "7-command memory suite" as established by 011. However, 011 Phase 5 (T24-T27, v2.4.0.0 addendum) merged context into analyze, reducing the suite to 6 commands. The 013 docs were not updated to reflect this.
- **Evidence**: `spec.md` line 45: "012-command-alignment (source of truth for 7-command suite)". `implementation-summary.md` line 52 even says "7 (was 5) -- continue, save, learn, manage, analyze, shared, context" -- listing 7 commands but the actual current surface is 6 (context was deleted and merged into analyze).
- **Impact**: Minor documentation inaccuracy. A future reader might be confused about the actual command count.
- **Recommended Fix**: Update 013 spec references from "7-command" to "6-command" and remove `context` from the command list. Low priority since 013 is complete.

### O7-005: 010 Implementation-Summary Lists Stale Command Count
- **Severity**: LOW
- **Category**: alignment
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/implementation-summary.md` lines 14, 95
- **Description**: The 010 implementation-summary references "7 commands" (from 011) but the current surface is 6 commands after the context/analyze merge.
- **Evidence**: implementation-summary.md line 95: "CLOSED by Phase 5" gap table mentions "7 new `/memory:*` COMMAND_BOOSTS" which is correct (the boosts are still 7 because analyze absorbed context's tools). But spec.md line 57 says "Command alignment work completed by 012-command-alignment (32/32 tools, 7 commands)" and tasks.md line 66 says "32/32 tools across 7 commands".
- **Impact**: Minor. The tool count (32) is accurate; only the command count is stale.
- **Recommended Fix**: Update references from "7 commands" to "6 commands" where they appear. Low priority.

### O7-006: 012 Scope Missed deep-research Agent in Original Sync
- **Severity**: LOW
- **Category**: completeness
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment/spec.md`
- **Description**: Phase 012 listed 9 agents to sync but used the name `research/research.md` rather than distinguishing between `research/research.md` (which does not exist as a standalone agent) and `deep-research.md`. The actual canonical directory contains: context, debug, deep-research, handover, orchestrate, review, speckit, ultra-think, write. There is no separate `research/research.md` -- it was renamed/split to `deep-research.md`. The 012 spec references `research/research.md` 6 times.
- **Evidence**: `ls .opencode/agent/*.md` shows `deep-research.md`, not `research/research.md`. 012 tasks.md references "T011: Sync research.md" and "T020: Sync research.md". The actual file is `deep-research.md` in all 3 runtimes.
- **Impact**: The spec documentation uses an incorrect filename. However, the work WAS done correctly based on timestamp evidence (deep-research.md exists and was synced in all runtimes). This is a documentation naming error, not a functional gap.
- **Recommended Fix**: No action needed unless 012 docs are being reused for a future sync. The naming discrepancy is cosmetic -- the work was executed on the correct file.

### O7-007: No Automated Sync Mechanism for Multi-Runtime Agent Alignment
- **Severity**: HIGH
- **Category**: architecture
- **Location**: `.opencode/agent/`, `.claude/agents/`, `.gemini/agents/`
- **Description**: The 012 phase was a one-time manual sync. There is no automated mechanism to detect or prevent drift between canonical agent definitions and runtime copies. The drift that 012 fixed has already recurred within 6 days (O7-002). Without automation, this problem will continue to recur after every canonical agent update.
- **Evidence**: O7-002 demonstrates that write.md, deep-research.md, and potentially other agents have already drifted again. The 012 implementation-summary has no "drift prevention" section and its "Recommended Next Steps" section is empty.
- **Impact**: Every canonical agent update requires a manual 18-file sync operation. Missed syncs cause behavioral inconsistency across runtimes. The cost of this maintenance grows with the number of agents and runtimes.
- **Recommended Fix**: Create a sync script (e.g., `scripts/sync-agents.sh`) that: (1) reads each canonical `.opencode/agent/*.md`, (2) extracts body content (post-frontmatter), (3) injects it into each runtime copy while preserving runtime-specific frontmatter, (4) reports any files that changed. Run this script as part of the commit workflow or as a pre-push hook.

### O7-008: 012 and 013 Are Distinct Phases (NOT Redundant)
- **Severity**: LOW
- **Category**: architecture
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment/` and `014-agents-md-alignment/`
- **Description**: An initial question was whether 012 and 013 are redundant. They are NOT. They address different alignment surfaces:
  - **012** syncs runtime agent DEFINITION files (`.claude/agents/*.md`, `.gemini/agents/*.md`) -- the files that AI runtimes load to configure agent behavior (tools, permissions, instructions).
  - **013** syncs AGENTS.md GOVERNANCE FRAMEWORK files (`AGENTS.md`, `AGENTS_example_fs_enterprises.md`, `Barter/coder/AGENTS.md`) -- the human-readable Quick Reference workflow tables that document command usage patterns.
  These are complementary, not overlapping. 012 ensures agents behave consistently; 013 ensures governance documentation reflects the current command surface.
- **Evidence**: 012 modified 18 agent definition files; 013 modified 3 AGENTS.md files + CLAUDE.md. Zero file overlap.
- **Impact**: None -- the phases are correctly separated.
- **Recommended Fix**: None needed. The separation is architecturally sound.

### O7-009: 010 checklist.md CHK-067 Permanently Failing
- **Severity**: LOW
- **Category**: completeness
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/checklist.md` line 109
- **Description**: CHK-067 (P1 item) requires `validate.sh` to pass with exit 0 or 1. It is permanently marked as `[ ]` with evidence explaining the exit 2 is due to 14 false positives from cross-folder relative paths. This is documented as a "validator limitation" but the P1 item will never pass unless the validator is updated.
- **Evidence**: checklist.md line 109-110: `[ ] CHK-067 [P1] validate.sh passes (exit 0 or 1, not exit 2)` with detailed evidence about the false positives.
- **Impact**: The 010 phase has a permanently unfulfilled P1 checklist item, making its completion technically incomplete by its own standards (18/19 P1 items).
- **Recommended Fix**: Either (a) update the validator to handle cross-folder relative paths correctly, or (b) reclassify CHK-067 as P2 with a note that exit 2 is accepted due to known validator limitation, or (c) mark it `[x]` with explicit evidence that the failures are false positives.

---

## Summary Table

| Finding | Severity | Category | Phase | Status |
|---------|----------|----------|-------|--------|
| O7-001 | MEDIUM | completeness | 010 | Sub-phase 001 abandoned mid-flight |
| O7-002 | HIGH | alignment | 012 | Agent drift has recurred post-sync |
| O7-003 | MEDIUM | alignment | 013 | `/memory:shared` row missing from live files |
| O7-004 | LOW | alignment | 013 | Stale "7-command" references |
| O7-005 | LOW | alignment | 010 | Stale command count references |
| O7-006 | LOW | completeness | 012 | Spec references `research/research.md` not `deep-research.md` |
| O7-007 | HIGH | architecture | 012 | No automated agent sync mechanism |
| O7-008 | LOW | architecture | 012/013 | Phases are distinct (NOT redundant) -- informational |
| O7-009 | LOW | completeness | 010 | CHK-067 permanently failing |

**Counts by severity:**
- CRITICAL: 0
- HIGH: 2 (O7-002, O7-007)
- MEDIUM: 2 (O7-001, O7-003)
- LOW: 5 (O7-004, O7-005, O7-006, O7-008, O7-009)

**Phase verdicts:**
| Phase | Verdict | Notes |
|-------|---------|-------|
| 011-skill-alignment | (b) in-progress | Parent complete, sub-phase 001 abandoned |
| 012-command-alignment | (a) complete | Thoroughly executed with v2.4.0.0 addendum |
| 013-agents-alignment | (a) complete* | *Drift has recurred; needs re-sync and automation |
| 014-agents-md-alignment | (a) complete* | *`/memory:shared` row missing; needs restoration |
