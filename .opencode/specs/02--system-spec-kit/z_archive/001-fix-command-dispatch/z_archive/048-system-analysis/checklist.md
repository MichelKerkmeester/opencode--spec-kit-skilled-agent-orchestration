---
title: "QA Validation Checklist: SpecKit & Memory System Remediation [048-system-analysis/checklist]"
description: "cp .opencode/skill/system-spec-kit/database/context-index.sqlite \\\\\\\\"
trigger_phrases:
  - "validation"
  - "checklist"
  - "speckit"
  - "memory"
  - "system"
  - "048"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v1.0 -->

# QA Validation Checklist: SpecKit & Memory System Remediation

> **Spec**: 048-system-analysis
> **Level**: 3
> **Created**: 2025-12-30

---

## Checklist Summary

| Section | Items | Complete |
|---------|-------|----------|
| Pre-Implementation | 8 | ☐ |
| WS1: MCP Server Core | 9 | ☐ |
| WS2: Scripts | 10 | ☐ |
| WS3: Trigger & Search | 3 | ☐ |
| WS4: Commands & Assets | 3 | ☐ |
| WS5: Documentation | 13 | ☐ |
| WS6: Memory Files | 4 | ☐ |
| WS7: MCP Operations | 4 | ☐ |
| WS8: Security & Config | 6 | ☐ |
| WS9: UX Improvements | 6 | ☐ |
| Integration Testing | 11 | ☐ |
| Regression Testing | 10 | ☐ |
| Final Verification | 6 | ☐ |
| **Total** | **93** | |

---

## Pre-Implementation Checks

- [ ] **CHK-PRE-001**: Git branch created for changes (`git checkout -b fix/048-system-remediation`)
- [ ] **CHK-PRE-002**: Database backup created
  ```bash
  cp .opencode/skill/system-spec-kit/database/context-index.sqlite \
     .opencode/skill/system-spec-kit/database/context-index.sqlite.backup
  ```
- [ ] **CHK-PRE-003**: All file paths in analysis.md verified to exist
- [ ] **CHK-PRE-004**: Baseline tests run and passing
- [ ] **CHK-PRE-005**: MCP server starts without errors
- [ ] **CHK-PRE-006**: Memory search returns results
- [ ] **CHK-PRE-007**: Constitutional memories surface at top
- [ ] **CHK-PRE-008**: Performance baseline recorded (search latency, embedding time)

---

## Work Stream 1: MCP Server Core

### P0 Tasks
- [ ] **CHK-WS1-001**: `getFailedEmbeddings()` null check added (line ~104)
- [ ] **CHK-WS1-002**: `getRetryStats()` null check added (line ~121)
- [ ] **CHK-WS1-003**: Both functions return gracefully when db is null
- [ ] **CHK-WS1-004**: Warning logged when db is null

### P1 Tasks
- [ ] **CHK-WS1-005**: `hybrid-search.js` init() validates database parameter
- [ ] **CHK-WS1-006**: `hybrid-search.js` init() validates vectorSearchFn is function
- [ ] **CHK-WS1-007**: Constitutional cache TTL = 300000 (5 minutes)
- [ ] **CHK-WS1-008**: Prepared statements cached for common queries
- [ ] **CHK-WS1-009**: Performance improvement measured (target: 10% faster queries)

---

## Work Stream 2: Scripts

### P0 Tasks
- [ ] **CHK-WS2-001**: `tempPath` declared before try block in generate-context.js
- [ ] **CHK-WS2-002**: Catch block checks `if (tempPath)` before cleanup
- [ ] **CHK-WS2-003**: Error handling tested with simulated write failure
- [ ] **CHK-WS2-004**: `validate-spec-folder.js` includes `implementation-summary.md` in Level 1

### P1 Tasks
- [ ] **CHK-WS2-005**: Date parsing uses ISO timestamp (not formatted string)
- [ ] **CHK-WS2-006**: `cleanup-orphaned-vectors.js` wrapped in try/catch
- [ ] **CHK-WS2-007**: Cleanup script exits non-zero on error
- [ ] **CHK-WS2-008**: `formatAgeString()` extracted to utility file
- [ ] **CHK-WS2-009**: Both usages import from utility
- [ ] **CHK-WS2-010**: 30 lines of duplicate code removed

---

## Work Stream 3: Trigger & Search

- [ ] **CHK-WS3-001**: Simple alphanumeric phrases use `String.includes`
- [ ] **CHK-WS3-002**: Regex reserved for special character patterns
- [ ] **CHK-WS3-003**: Trigger matching still finds all expected matches

---

## Work Stream 4: Commands & Assets

- [ ] **CHK-WS4-001**: `spec_kit_debug_auto.yaml` exists
- [ ] **CHK-WS4-002**: `spec_kit_debug_confirm.yaml` exists
- [ ] **CHK-WS4-003**: Debug command works with `:auto` and `:confirm` modes

---

## Work Stream 5: Documentation Alignment

### SKILL.md
- [ ] **CHK-WS5-001**: All 10 undocumented scripts now documented
- [ ] **CHK-WS5-002**: Mode terminology standardized ("Direct mode" vs "JSON mode")

### Templates
- [ ] **CHK-WS5-003**: `spec.md` template removes CHK036-038 references

### quick_reference.md
- [ ] **CHK-WS5-004**: Template count says "10" (not "12 total")

### memory_system.md
- [ ] **CHK-WS5-005**: Tier weights match code (critical=1.0, important=0.8)
- [ ] **CHK-WS5-006**: Re-embedding documented as "title change only"
- [ ] **CHK-WS5-007**: Deprecated tier documented as "never surfaces"
- [ ] **CHK-WS5-008**: Rate limiting documented (1-minute cooldown)
- [ ] **CHK-WS5-009**: Spec folder filter documented as "prefix match"

### Other
- [ ] **CHK-WS5-010**: `skill_advisor.py` docstring says "Gate 2"
- [ ] **CHK-WS5-011**: `.gitignore` path matches actual database location
- [ ] **CHK-WS5-012**: Template guide notes templates are "aspirational"
- [ ] **CHK-WS5-013**: AGENTS.md and SKILL.md terminology aligned

---

## Work Stream 6: Memory Files & Anchors

- [ ] **CHK-WS6-001**: Legacy memory files have proper closing `-->`
- [ ] **CHK-WS6-002**: `e2e-test-memory.md` uses HTML comment anchor format
- [ ] **CHK-WS6-003**: All memory files in specs/ validate with anchor checker
- [ ] **CHK-WS6-004**: No "## ANCHOR:" markdown headings remain

---

## Work Stream 7: MCP Operations

- [ ] **CHK-WS7-001**: `memory_update` rejects negative/zero IDs
- [ ] **CHK-WS7-002**: `memory_update` error message is descriptive
- [ ] **CHK-WS7-003**: All MCP operations return structured responses
- [ ] **CHK-WS7-004**: Error responses include actionable details

---

## Work Stream 8: Security & Config

- [ ] **CHK-WS8-001**: `.env.example` created with all expected variables
- [ ] **CHK-WS8-002**: No actual secrets in `.env.example`
- [ ] **CHK-WS8-003**: Checkpoint name validation regex: `/^[a-zA-Z0-9_-]+$/`
- [ ] **CHK-WS8-004**: Invalid checkpoint names rejected with error
- [ ] **CHK-WS8-005**: `search-weights.json` version = 16.0.0
- [ ] **CHK-WS8-006**: Version aligned with parent package

---

## Work Stream 9: UX Improvements

- [ ] **CHK-WS9-001**: Quick Start guide created (max 50 lines)
- [ ] **CHK-WS9-002**: Quick Start covers basic workflow
- [ ] **CHK-WS9-003**: Progress indicators show during generate-context.js
- [ ] **CHK-WS9-004**: Session end detection documented
- [ ] **CHK-WS9-005**: `fs.readFileSync` replaced with async in formatSearchResults
- [ ] **CHK-WS9-006**: Constitutional cache uses global key with specFolder filter

---

## Integration Testing

- [ ] **CHK-INT-001**: Memory save operation succeeds
- [ ] **CHK-INT-002**: Memory search returns relevant results
- [ ] **CHK-INT-003**: Memory delete removes entry and vector
- [ ] **CHK-INT-004**: Memory update modifies metadata
- [ ] **CHK-INT-005**: Embedding generation completes successfully
- [ ] **CHK-INT-006**: Checkpoint create stores snapshot
- [ ] **CHK-INT-007**: Checkpoint restore recovers state
- [ ] **CHK-INT-008**: Trigger matching finds expected phrases
- [ ] **CHK-INT-009**: Hybrid search combines FTS5 and vector results
- [ ] **CHK-INT-010**: Constitutional memories always appear at top
- [ ] **CHK-INT-011**: All /spec_kit:* commands execute without error

---

## Regression Testing

- [ ] **CHK-REG-001**: Existing memory files still indexed correctly
- [ ] **CHK-REG-002**: Existing checkpoints still restorable
- [ ] **CHK-REG-003**: Constitutional memories still surface at top
- [ ] **CHK-REG-004**: All 7 /spec_kit: commands work
- [ ] **CHK-REG-005**: Validation scripts produce same output for known inputs
- [ ] **CHK-REG-006**: generate-context.js produces valid memory files
- [ ] **CHK-REG-007**: Memory files index successfully
- [ ] **CHK-REG-008**: Search latency within acceptable range (<500ms)
- [ ] **CHK-REG-009**: No new console errors or warnings
- [ ] **CHK-REG-010**: Database integrity check passes

---

## Final Verification

- [ ] **CHK-FIN-001**: All P0 tasks marked complete in tasks.md
- [ ] **CHK-FIN-002**: All P1 tasks marked complete in tasks.md
- [ ] **CHK-FIN-003**: All P2 tasks marked complete in tasks.md
- [ ] **CHK-FIN-004**: Git commits follow conventional format
- [ ] **CHK-FIN-005**: No uncommitted changes remain
- [ ] **CHK-FIN-006**: Implementation summary created

---

## Sign-Off

| Phase | Completed By | Date | Notes |
|-------|--------------|------|-------|
| Phase 1 (P0) | | | |
| Phase 2 (P1) | | | |
| Phase 3 (P2) | | | |
| Final | | | |

---

### P3 Technical Debt (6 items)

**T-P3-001: Test Fixtures**
| ID | Item | Priority |
|----|------|----------|
| CHK-P3-001 | 10 P0 fixture folders created | **P3** |
| CHK-P3-002 | README.md documents fixture structure | **P3** |
| CHK-P3-003 | Valid fixtures pass validation | **P3** |
| CHK-P3-004 | Invalid fixtures fail validation | **P3** |

- [x] CHK-P3-001: 10 P0 fixture folders created ✅
- [x] CHK-P3-002: README.md documents fixture structure ✅
- [ ] CHK-P3-003: Valid fixtures pass validation (needs manual test)
- [ ] CHK-P3-004: Invalid fixtures fail validation (needs manual test)

**T-P3-002: Unicode Normalization**
| ID | Item | Priority |
|----|------|----------|
| CHK-P3-005 | normalizeUnicode() function added | **P3** |
| CHK-P3-006 | Trigger matching uses normalization | **P3** |
| CHK-P3-007 | Regex has 'u' flag for Unicode | **P3** |

- [x] CHK-P3-005: normalizeUnicode() function added ✅
- [x] CHK-P3-006: Trigger matching uses normalization ✅
- [x] CHK-P3-007: Regex has 'u' flag for Unicode ✅

**T-P3-003: Constitutional Directory Scanning**
| ID | Item | Priority |
|----|------|----------|
| CHK-P3-008 | includeConstitutional parameter added | **P3** |
| CHK-P3-009 | findConstitutionalFiles() function added | **P3** |
| CHK-P3-010 | Results include constitutional stats | **P3** |

- [x] CHK-P3-008: includeConstitutional parameter added ✅
- [x] CHK-P3-009: findConstitutionalFiles() function added ✅
- [x] CHK-P3-010: Results include constitutional stats ✅

**T-P3-004: Portable Paths**
| ID | Item | Priority |
|----|------|----------|
| CHK-P3-011 | opencode.json uses env var | **P3** |
| CHK-P3-012 | .utcp_config.json uses env vars | **P3** |
| CHK-P3-013 | narsil-server.sh requires explicit path | **P3** |
| CHK-P3-014 | .env.example updated | **P3** |

- [x] CHK-P3-011: opencode.json uses env var ✅
- [x] CHK-P3-012: .utcp_config.json uses env vars ✅
- [x] CHK-P3-013: narsil-server.sh requires explicit path ✅
- [x] CHK-P3-014: .env.example updated ✅

**T-P3-005: JS Validators Deprecation**
| ID | Item | Priority |
|----|------|----------|
| CHK-P3-015 | validate-spec-folder.js deleted | **P3** |
| CHK-P3-016 | validate-memory-file.js deleted | **P3** |
| CHK-P3-017 | SKILL.md updated | **P3** |
| CHK-P3-018 | execution_methods.md updated | **P3** |

- [x] CHK-P3-015: validate-spec-folder.js deleted ✅
- [x] CHK-P3-016: validate-memory-file.js deleted ✅
- [x] CHK-P3-017: SKILL.md updated ✅
- [x] CHK-P3-018: execution_methods.md updated ✅

**T-P3-006: dryRun for memory_delete**
| ID | Item | Priority |
|----|------|----------|
| CHK-P3-019 | dryRun parameter added to schema | **P3** |
| CHK-P3-020 | Handler returns preview for single delete | **P3** |
| CHK-P3-021 | Handler returns preview for bulk delete | **P3** |

- [x] CHK-P3-019: dryRun parameter added to schema ✅
- [x] CHK-P3-020: Handler returns preview for single delete ✅
- [x] CHK-P3-021: Handler returns preview for bulk delete ✅

---

## P3 Summary

| Task | Items | Completed |
|------|-------|-----------|
| T-P3-001 | 4 | 2 (2 need manual test) |
| T-P3-002 | 3 | 3 |
| T-P3-003 | 3 | 3 |
| T-P3-004 | 4 | 4 |
| T-P3-005 | 4 | 4 |
| T-P3-006 | 3 | 3 |
| **Total** | **21** | **19** |
