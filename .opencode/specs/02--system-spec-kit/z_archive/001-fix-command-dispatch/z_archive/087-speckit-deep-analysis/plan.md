---
title: "Implementation Plan: System-Spec-Kit Deep Analysis & Remediation [087-speckit-deep-analysis/plan]"
description: "Fix 3 critical bugs (SQL constraint, ghost tools, stale references), 15+ moderate misalignments (gate numbering, thresholds, missing commands), and perform ecosystem-wide AGENTS..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "system"
  - "spec"
  - "kit"
  - "087"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: System-Spec-Kit Deep Analysis & Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js MCP server), Python (skill_advisor), Bash (shell scripts), Markdown (documentation) |
| **Framework** | MCP SDK, better-sqlite3, sqlite-vec |
| **Storage** | SQLite with vector search extension |
| **Testing** | grep verification, skill_advisor.py threshold tests |

### Overview
Fix 3 critical bugs (SQL constraint, ghost tools, stale references), 15+ moderate misalignments (gate numbering, thresholds, missing commands), and perform ecosystem-wide AGENTS.md-to-AGENTS.md migration across 19+ files. All changes are correctness fixes to documentation and configuration, with one SQL schema fix.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (grep verification + threshold tests)
- [x] Dependencies identified (symlink architecture, shared DB)

### Definition of Done
- [x] All acceptance criteria met
- [x] Verification tests passing
- [x] Docs updated (spec/plan/tasks)

---

## 3. ARCHITECTURE

### Pattern
Multi-file documentation and code remediation across a symlinked framework directory.

### Key Components
- **MCP Server** (`vector-index.js`): SQL schema fix for CHECK constraint
- **Agent Definition** (`speckit.md`): Tool layers table rewrite + command additions
- **Skill Documentation** (`SKILL.md`): Reference corrections
- **Framework Config** (`AGENTS.md`): Convention documentation, gate fixes
- **Routing Script** (`skill_advisor.py`): Threshold tuning, debug disambiguation

### Data Flow
```
Analysis Reports → Prioritized Bug List → Phase 1 (Critical) → Phase 2 (Moderate) → Verification
```

---

## 4. IMPLEMENTATION PHASES

### Phase 0: Spec Folder Creation
- [x] Create `087-speckit-deep-analysis/` with Level 3+ templates
- [x] Populate with actual findings and implementation details

### Phase 1: Critical Bug Fixes (3 items)
- [x] BUG-1: Add `CREATE_LINKED` to CHECK constraints in vector-index.js (lines 431, 1172)
- [x] BUG-2: Rewrite speckit.md tool layers table to 7-layer architecture + add 4 missing commands
- [x] BUG-3: Replace AGENTS.md -> AGENTS.md in SKILL.md (5 occurrences)

### Phase 2: Moderate Misalignments (15+ items)
- [x] M-3: AGENTS.md tool prefix convention note in Section 8
- [x] M-4: AGENTS.md two save pathways note in Memory Save Rule
- [x] M-5: skill_advisor.py debug boost 1.0 -> 0.6
- [x] M-6: skill_advisor.py memory boost 0.6 -> 0.8, context 0.5 -> 0.6, multi-skill boosters increased
- [x] M-7: AGENTS.md Gate 4 Option B -> Gate 3 Option B
- [x] M-8: Gate 5 references removed (save.md, INSTALL_GUIDE.md, scripts-registry.json)
- [x] M-9: AGENTS.md confidence threshold clarification note
- [x] M-10: complete.md AGENTS.md section references updated
- [x] M-11: INSTALL_GUIDE.md gate references updated
- [x] M-12: opencode.json shared-DB architecture documented
- [x] M-13: gate-enforcement.md Quick Reference table gate numbers corrected
- [x] M-14: scripts-registry.json gate reference updated
- [x] M-1: Template file counts standardized (speckit.md, SKILL.md, README.md)
- [x] M-2: speckit.md missing commands added

### Phase 2b: Extended AGENTS.md Migration (bonus)
- [x] handover.md, implement.md, resume.md, research.md, plan.md
- [x] agent/research.md
- [x] 9 YAML asset files
- [x] skill_advisor.py comments
- [x] README.md

### Phase 3: Verification
- [x] grep verification: 0 stale AGENTS.md refs in active files
- [x] grep verification: 0 ghost tools in speckit.md
- [x] grep verification: 0 Gate 4/5 refs in active scope
- [x] grep verification: CREATE_LINKED present in both CHECK constraints
- [x] skill_advisor.py "save memory context" -> 0.95 confidence (passes 0.8)
- [x] skill_advisor.py "debug this issue" -> below threshold (correct)

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All modified files | ripgrep/grep |
| Threshold test | skill_advisor.py | CLI invocation |
| Negative test | No false routing | CLI invocation |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| .opencode symlink | Internal | Green | Cannot edit framework files |
| Existing SQLite databases | Internal | Yellow | Old DBs keep old constraint |

---

## 7. ROLLBACK PLAN

- **Trigger**: Any file modification causes framework breakage
- **Procedure**: `git checkout` in Public repo to revert all .opencode changes

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Standardize on SKILL.md Section 4 for Template Counts

**Status**: Accepted

**Context**: Three different sources give conflicting template file counts (speckit.md, SKILL.md Section 4, SKILL.md Section 7, README.md). Need a single source of truth.

**Decision**: Use SKILL.md Section 4 counts (which include README.md) as the canonical source. Update all other references to match.

**Consequences**:
- Positive: Single source of truth for template counts
- Negative: README.md is now counted as a template file (arguably it's metadata, not a template)

### ADR-002: Lower Debug Boost Instead of Adding New Booster

**Status**: Accepted

**Context**: "debug" keyword routes to chrome-devtools at 1.0, conflicting with AGENTS.md's `/spec_kit:debug` pattern. Options: (A) add spec_kit_debug booster, (B) lower chrome-devtools debug boost.

**Decision**: Lower chrome-devtools "debug" boost from 1.0 to 0.6. "debugger" and "devtools" remain at 1.0+ for explicit routing.

**Consequences**:
- Positive: Ambiguous "debug" queries fall below 0.8 threshold, letting AGENTS.md behavioral rules handle routing
- Negative: Pure "debug in browser" queries need additional context words to cross threshold
- Mitigation: "debugger", "devtools", "chrome", "browser" still boost sufficiently

### ADR-003: Document Shared-DB Rather Than Create Project-Local DB

**Status**: Accepted

**Context**: SPEC_KIT_DB_DIR is not set in opencode.json, causing all projects to share one database. Options: (A) create .opencode-local/database/ and set env var, (B) document as intentional.

**Decision**: Document the shared-DB architecture in opencode.json with a note. Creating a project-local DB would split existing memories and require migration.

**Consequences**:
- Positive: No memory loss, no migration needed
- Negative: Memories from different projects share one database
- Mitigation: Note in opencode.json explains how to enable project isolation

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Analysis (6 parallel agents)
**Agents**: 6 Opus subagents analyzing different ecosystem areas
**Duration**: ~15 min (parallel)
**Output**: Comprehensive bug/misalignment report

### Tier 2: Implementation (sequential)
**Agent**: Primary agent
**Duration**: ~10 min
**Task**: Apply all fixes in priority order (P0 -> P1 -> P2)

### Tier 3: Extended Migration (delegated)
**Agent**: Bash subagent for bulk sed replacements
**Duration**: ~30s
**Task**: AGENTS.md -> AGENTS.md across YAML assets

### Tier 4: Verification (parallel)
**Agent**: Primary agent
**Duration**: ~2 min
**Task**: grep verification + threshold tests

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Critical Bugs | Primary | vector-index.js, speckit.md, SKILL.md | Complete |
| W-B | Moderate Fixes | Primary | AGENTS.md, complete.md, save.md, etc. | Complete |
| W-C | AGENTS.md Migration | Bash Agent | command/*.md, assets/*.yaml | Complete |
| W-D | Verification | Primary | grep checks, CLI tests | Complete |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | Primary | Proceed to W-B |
| SYNC-002 | W-B complete | Primary + Bash | Trigger W-C for bulk migration |
| SYNC-003 | All complete | Primary | Run W-D verification |
