---
title: "Verification Checklist: OpenCode Naming Convention Alignment [090-opencode-naming-conventions/checklist]"
description: "Verification Date: 2026-02-06"
trigger_phrases:
  - "verification"
  - "checklist"
  - "opencode"
  - "naming"
  - "convention"
  - "090"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: OpenCode Naming Convention Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3plus-govern | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available

---

## Code Quality — JS Migration

- [x] CHK-010 [P0] Zero snake_case function definitions (except backward-compat aliases) — `grep -rn "^function [a-z]*_[a-z]"` returns 0 matches
- [x] CHK-011 [P0] Zero orphaned snake_case function calls — 148/148 files pass runtime `require()` with 0 "is not defined" errors
- [x] CHK-012 [P0] All module.exports use camelCase as primary key — exports blocks rewritten in memory-parser.js, summary-generator.js, trigger-extractor.js, implementation-guide-extractor.js, and all handler files
- [x] CHK-013 [P0] Backward-compatible aliases present for MCP handler exports — 9 handler files + 4 shared lib files have snake_case backward-compat aliases
- [x] CHK-014 [P1] All parameters renamed to camelCase — verified via migration script + manual fixes (rank-memories.js options, memory-parser.js variables)
- [x] CHK-015 [P1] All module-level variables renamed to camelCase — verified via migration + second-pass sweep
- [x] CHK-016 [P1] Constants remain UPPER_SNAKE_CASE (no accidental rename) — 337 UPPER_SNAKE_CASE constants confirmed intact
- [x] CHK-017 [P1] SQL column names / external API keys untouched — SKIP_NAMES set in migration script preserved session_id, content_hash, importance_tier, etc.

---

## Testing

- [x] CHK-020 [P0] MCP server starts without errors (`node context-server.js`) — server loads successfully, all modules initialized
- [x] CHK-021 [P1] No new console errors or warnings at startup — only expected init messages (vector-index, checkpoints, co-activation, retry-manager)
- [x] CHK-022 [P1] Cross-directory imports resolve correctly — 148/148 non-test files pass isolated `require()` checks

---

## Skill Documentation

- [x] CHK-030 [P0] All 9 skill files reflect camelCase standard for JS — SKILL.md, 3 JS references, 2 shared references, 2 checklists, CHANGELOG updated
- [x] CHK-031 [P1] Naming matrix consistent across all files — Functions: camelCase, Constants: UPPER_SNAKE_CASE, Classes: PascalCase, Files: kebab-case
- [x] CHK-032 [P1] Code examples in docs use camelCase — all `process_data`, `fetch_data`, `load_config` examples updated

---

## File Organization

- [x] CHK-040 [P1] No Python/Shell files modified — Python test files confirm `def test_zero_matches_base_uncertainty` still present (snake_case)
- [x] CHK-041 [P1] No JSON/JSONC files broken — no JSON files were modified during migration
- [x] CHK-042 [P1] No file names changed (kebab-case preserved) — zero JS files with underscores in filename
- [x] CHK-043 [P2] scratch/ cleaned before completion — migration scripts in /tmp scratchpad, not in project

---

## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — ADR-001 (camelCase adoption), ADR-002 (backward-compat export strategy)
- [x] CHK-101 [P1] Backward-compat export strategy documented — decision-record.md ADR-002 covers pattern and scope
- [x] CHK-102 [P1] Migration approach documented with rationale — plan.md covers segment-based parsing, directory grouping, cross-ref sweep

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-02-06
