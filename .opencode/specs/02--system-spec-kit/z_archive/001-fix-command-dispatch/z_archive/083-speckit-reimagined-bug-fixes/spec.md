---
title: "Spec Kit Reimagined Bug Fixes (Consolidated) [083-speckit-reimagined-bug-fixes/spec]"
description: "After the successful release of Spec Kit v1.2.1.0 (SpecKit Reimagined + Memory Command Consolidation), comprehensive parallel audits revealed 70+ issues across the command files..."
trigger_phrases:
  - "spec"
  - "kit"
  - "reimagined"
  - "bug"
  - "fixes"
  - "083"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Spec Kit Reimagined Bug Fixes (Consolidated)

> Comprehensive remediation of bugs, misalignments, and inconsistencies discovered in Spec Kit commands and documentation through multi-agent audits.

---

## Document Information

| Field | Value |
|-------|-------|
| **Spec ID** | 083-speckit-reimagined-bug-fixes |
| **Version** | 2.0.0 (Consolidated) |
| **Status** | In Progress |
| **Level** | 3 (Full Documentation) |
| **Created** | 2025-02-03 |
| **Author** | Automated Analysis (15 + 30 Parallel Agents) |

---

## 1. Overview

### 1.1 Problem Statement

After the successful release of Spec Kit v1.2.1.0 (SpecKit Reimagined + Memory Command Consolidation), comprehensive parallel audits revealed **70+ issues** across the command files, YAML workflow assets, MCP server code, and documentation. This specification consolidates findings from:

1. **Phase 1 (15-Agent Audit)**: Initial discovery of 35+ issues
2. **Phase 2 (30-Agent Audit)**: Additional 35 issues including verification failures
3. **Phase 3 (Implementation)**: Bug fixes and core infrastructure repairs

### 1.2 Scope

This specification covers remediation of:

**Phase 1 - Command & YAML Files:**
1. Memory Commands (5 files): save.md, manage.md, learn.md, continue.md, context.md
2. Spec Kit Commands (7 files): debug.md, research.md, complete.md, implement.md, plan.md, resume.md, handover.md
3. YAML Workflow Assets (16 files): All auto/confirm workflow configurations
4. Documentation (2 files): README.md, CHANGELOG.md
5. Agent Files (1 file): speckit.md

**Phase 2 - Extended Audit:**
1. YAML Workflow Assets (6 files): YAML syntax errors and misalignments
2. Command Files (5 files): Path references, tool names, step counts
3. Documentation (5 files): README, MCP README, level_decision_matrix, template README
4. MCP Server (3 files): package.json, error codes, core logic
5. Test Fixtures (5 files): Outdated ANCHOR format

**Phase 3 - Core Infrastructure:**
1. MCP Server core (vector-index.js, core.js, workflow.js)
2. Scoring modules (folder-scoring.js, importance-tiers.js)
3. Extractors (file-extractor.js, diagram-extractor.js, trigger-extractor.js)
4. Templates (Level 2 and Level 3 progressive inheritance)
5. Embedding providers

### 1.3 Path Confusion Resolution

**CRITICAL FINDING:** There is fundamental confusion in the codebase:

| Location | Current State | Truth |
|----------|---------------|-------|
| README.md v1.2.2 changelog | Claims path fixed TO `.claude/commands/` | **MISLEADING** |
| Actual file location | `.opencode/command/` | **CORRECT** |
| Symlink | `.claude/commands/spec_kit → .opencode/command/spec_kit/` | Works |

**Resolution:** The README changelog entry is BACKWARDS and needs correction.

### 1.4 Success Metrics

| Metric | Target |
|--------|--------|
| P0 Critical bugs resolved | 100% |
| P1 High-priority issues resolved | 100% |
| P2 Medium issues resolved | 100% |
| P3 Low issues resolved | 80% (best effort) |
| YAML files validate | 0 syntax errors |
| All commands functional | Verified via testing |
| Documentation accuracy | 100% alignment |

---

## 2. Requirements

### 2.1 Critical Issues (P0 - Must Fix)

#### Phase 1 P0 (7 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **BUG-001** | ANCHOR Format Mismatch | README.md lines 421, 696 | Uses `ANCHOR_END` instead of `/ANCHOR:` |
| **BUG-002** | Systematic YAML Path Error | All 12 commands | References `.opencode/command/` instead of `.claude/commands/` |
| **BUG-003** | Missing Steps in complete.md YAMLs | spec_kit_complete_*.yaml | Steps 11 and 14 missing |
| **BUG-004** | Missing PREFLIGHT/POSTFLIGHT | spec_kit_implement_*.yaml | Steps 5.5 and 7.5 not implemented |
| **BUG-005** | Invalid Task Tool Parameter | handover.md lines 398-401 | Uses non-existent `model` parameter |
| **BUG-006** | Step Misalignment | complete.md YAMLs | Step numbering off by 2 |
| **BUG-007** | Invalid Confidence Steps | resume.md YAML line 96 | References non-existent step 5 |

#### Phase 2 P0 (8 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **AUD-001** | Verify step presence | spec_kit_complete_confirm.yaml | Step_11 and step_14 need verification |
| **AUD-002** | Wrong step count comment | spec_kit_complete_confirm.yaml | Says "12 STEPS" should be "14 STEPS" |
| **AUD-003** | Fictional model name unfixed | debug.md line 57 | Still has `GPT-5.2-Codex` |
| **AUD-004** | YAML syntax error | debug_auto.yaml lines 353-361 | Orphaned template content |
| **AUD-005** | YAML syntax error | debug_confirm.yaml lines 406-414 | Same orphaned template issue |
| **AUD-006** | Wrong path reference | resume.md lines 250-251 | Uses wrong path |
| **AUD-007** | Misleading changelog | README.md line 66 | Path direction is backwards |
| **AUD-008** | Non-existent tool | context.md line 4 | References wrong tool name |

#### Phase 3 P0 (4 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **REQ-001** | Schema version mismatch | vector-index.js:107 | SCHEMA_VERSION = 9 should be 11 |
| **REQ-002** | Error code mismatches | core.js:38-41 | Duplicate/wrong error codes |
| **REQ-003** | File extractor null crashes | file-extractor.js:59,95 | No null handling |
| **REQ-004** | Level 3 template inheritance | level_3/*.md | Broken progressive inheritance |

### 2.2 High-Severity Issues (P1 - Should Fix)

#### Phase 1 P1 (8 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **BUG-008** | Phantom WebSearch Tool | research.md line 4 | References non-existent tool |
| **BUG-009** | Session Detection Mismatch | resume.md vs YAML | 4-tier vs 2-tier detection |
| **BUG-010** | YAML Contradiction | handover.md lines 258 vs 550 | Claims no YAML then references YAML |
| **BUG-011** | Section Mismatch | handover.md vs YAML | 7 sections vs 5 sections |
| **BUG-012** | README Step Count Wrong | README.md | complete=12 (should be 14) |
| **BUG-013** | Reference to Non-Existent Step | implement.md line 440 | References "Step 11" |
| **BUG-014** | Duplicate Step Number | implement.md lines 74 & 76 | Both numbered "6." |
| **BUG-015** | Agent File Orphaned References | speckit.md lines 419-420 | References deleted commands |

#### Phase 2 P1 (10 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **AUD-009** | Wrong step count | implement_auto.yaml line 694 | Says "8 STEPS" should be "9" |
| **AUD-010** | Wrong step count | implement_confirm.yaml line 734 | Same issue |
| **AUD-011** | Wrong step comment | plan_confirm.yaml line 183 | Says "Step 6" should be "Step 5" |
| **AUD-012** | Missing tool prefix | complete_auto.yaml line 971 | Missing `spec_kit_memory_` prefix |
| **AUD-013** | Invalid Task parameter | complete_auto.yaml line 1300 | Uses non-existent `model: opus` |
| **AUD-014** | Short tool names | context.md lines 465-470 | MCP Matrix uses short names |
| **AUD-015** | Short tool names | manage.md lines 324-347 | MCP Matrix uses short names |
| **AUD-016** | Short tool names | resume YAMLs lines 97, 286 | Tool names use short form |
| **AUD-017** | Wrong tool count | mcp_server/package.json | Says "13 tools" but there are 22 |
| **AUD-018** | Duplicate error codes | lib/errors/core.js | E040 and E041 defined twice |

#### Phase 3 P1 (4 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **REQ-005** | Tier weight inconsistency | folder-scoring.js | Doesn't match importance-tiers.js |
| **REQ-006** | Level 2 section numbering | level_2/spec.md:144 | Section 10 → Section 7 |
| **REQ-007** | Standardize tool prefixes | All memory commands | Use spec_kit_memory_ prefix |
| **REQ-008** | Missing tools in SKILL.md | SKILL.md | 14 tools documented, 22 exist |

### 2.3 Medium-Severity Issues (P2 - Fix When Possible)

#### Phase 1 P2 (15 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **BUG-016** | Outdated Section References | learn.md lines 43, 48, 53 | Wrong section numbers |
| **BUG-017** | Wrong Tool for sortBy | continue.md lines 283-289 | Uses wrong tool |
| **BUG-018** | Short Tool Names in Matrix | continue.md lines 123-127 | Uses short names |
| **BUG-019** | Fictional Model Name | debug.md line 57 | "GPT-5.2-Codex" |
| **BUG-020** | Step Comment Error | plan.md YAML line 211 | Wrong step number |
| **BUG-021** | Diagram Question Range | plan.md line 237 | Q0-Q5 should be Q0-Q6 |
| **BUG-022** | Context Loading Priority | resume.md | 4 sources vs 2 |
| **BUG-023** | Termination Messages | implement.md YAMLs | Says "step 8" should be "step 9" |
| **BUG-024** | Five Checks Not in YAML | implement.md | Documented but not in YAML |

#### Phase 2 P2 (12 items)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **AUD-019** | Duplicate step number | complete.md line 60 | Two items numbered "6." |
| **AUD-020** | Wrong ANCHOR format | README.md lines 296-297 | Uses `ANCHOR_END:` |
| **AUD-021** | Wrong ANCHOR format | README.md line 498 | Troubleshooting section |
| **AUD-022** | Wrong ANCHOR format | mcp_server/README.md lines 673, 678 | Uses wrong format |
| **AUD-023** | Wrong ANCHOR format | level_decision_matrix.md lines 219, 222 | Documents wrong format |
| **AUD-024** | Wrong ANCHOR format | templates/memory/README.md lines 67-81 | Wrong format |
| **AUD-025** | Wrong tier names | templates/memory/README.md lines 87-94 | High/Medium/Low vs important/normal/temporary |
| **AUD-026** | Decay description error | README.md lines 240-248 | Calendar-based but it's turn-based |
| **AUD-027** | Missing file in list | SKILL.md line 142 | Missing `embedding_resilience.md` |
| **AUD-028** | Missing file in list | SKILL.md line 143 | Missing `level_selection_guide.md` |
| **AUD-029** | Non-existent file | scripts/setup/README.md | Documents `setup.sh` but doesn't exist |
| **AUD-030** | YAML indentation | complete_auto.yaml lines 295-296 | Indentation issue |

### 2.4 Low-Severity Issues (P3 - Optional)

| ID | Issue | Location | Description |
|----|-------|----------|-------------|
| **BUG-025** | Outdated DRIFT CONTEXT Label | context.md line 470 | Should just say "CONTEXT" |
| **BUG-026** | Incomplete Related Commands | context.md lines 540-542 | Missing commands |
| **BUG-027** | Short Tool Name Example | save.md line 58 | Uses short form |
| **BUG-028** | Stats Mode Clarity | manage.md line 17 | "stats" listed but no keyword |
| **BUG-029** | CONTINUE_SESSION Not in YAML | resume.md | Defers to `/memory:continue` |
| **BUG-030** | Tool Capitalization | research.md line 4 | Uses capitalized tool names |
| **AUD-031** | Context priority order | resume.md | Differs from YAML |
| **AUD-032** | Case inconsistency | Various command files | Title Case vs lowercase |
| **AUD-033** | Version mismatch | core/README.md | Shows 1.8.0 vs package.json 1.7.2 |
| **AUD-034** | Missing mode in error | manage.md line 23 | Error message missing "stats" |
| **AUD-035** | Wrong script path | scripts/README.md line 91 | Wrong path for validate.sh |

---

## 3. Technical Architecture

### 3.1 Affected Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    AFFECTED COMPONENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COMMAND FILES (12 files)                                       │
│  ├─ .claude/commands/memory/*.md                                │
│  └─ .claude/commands/spec_kit/*.md                              │
│                                                                 │
│  YAML WORKFLOW ASSETS (16 files)                                │
│  └─ .claude/commands/spec_kit/assets/*.yaml                     │
│                                                                 │
│  MCP SERVER CORE (6 files)                                      │
│  ├─ lib/search/vector-index.js                                  │
│  ├─ lib/errors/core.js                                          │
│  ├─ lib/scoring/*.js                                            │
│  └─ lib/workflow.js                                             │
│                                                                 │
│  EXTRACTORS (3 files)                                           │
│  ├─ scripts/extractors/file-extractor.js                        │
│  ├─ scripts/extractors/diagram-extractor.js                     │
│  └─ shared/trigger-extractor.js                                 │
│                                                                 │
│  TEMPLATES (8+ files)                                           │
│  ├─ templates/level_2/*.md                                      │
│  └─ templates/level_3/*.md                                      │
│                                                                 │
│  DOCUMENTATION (5 files)                                        │
│  ├─ README.md                                                   │
│  ├─ SKILL.md                                                    │
│  ├─ CHANGELOG.md                                                │
│  └─ mcp_server/README.md                                        │
│                                                                 │
│  AGENT FILES (1 file)                                           │
│  └─ .opencode/agent/speckit.md                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Fix Categories

| Category | Issues | Files Affected |
|----------|--------|----------------|
| **YAML Syntax** | AUD-004, AUD-005, AUD-030 | 3 YAML files |
| **Step Count/Comments** | BUG-003-007, AUD-001-002, AUD-009-011, AUD-019 | 10+ files |
| **Tool Prefixes** | BUG-017-018, AUD-008, AUD-012, AUD-014-016 | 8 files |
| **Path Corrections** | BUG-002, AUD-006, AUD-007 | 14 files |
| **ANCHOR Format** | BUG-001, AUD-020-024 | 6 files |
| **Core Infrastructure** | REQ-001-004 | 4 files |
| **Template Inheritance** | REQ-004, REQ-006 | 6+ files |
| **Documentation** | AUD-017, AUD-025-029, REQ-008 | 8 files |

---

## 4. Agent Assignments (Phase 3)

### Agent 1: Core Infrastructure
- vector-index.js:107 - Schema version 9→11
- core.js:40-41 - Error code mismatch
- core.js:38 - Duplicate error code

### Agent 2: Scoring Modules
- folder-scoring.js + importance-tiers.js - Tier weight alignment
- composite-scoring.js:52-60 - "high" tier in multipliers

### Agent 3: Extractors
- file-extractor.js:59 - Null check for collected_data
- file-extractor.js:95 - Null check for observations
- file-extractor.js:31 - Replace process.exit(1) with throw
- diagram-extractor.js:23,30 - Replace process.exit(1) with throw

### Agent 4: Level 2 Templates
- level_2/spec.md:144 - Section numbering 10→7

### Agent 5: Level 3 Templates
- Progressive inheritance fixes
- Remove L3+ sections from L3 templates

### Agent 6: Memory Commands
- Tool prefix standardization (all memory commands)
- MCP Matrix tool name fixes

### Agent 7: SKILL.md Documentation
- Add 8 missing tools to tool table (14→22)
- Fix file path references

### Agent 8: Error Handling & Workflow
- prediction-error-gate.js:211 - False positive fix
- workflow.js:280 - Misleading error message

### Agent 9: Shared Utilities
- trigger-extractor.js:459-465 - Deduplication logic

### Agent 10: Providers & Documentation
- All embedding providers - Add getProviderName() method

---

## 5. Acceptance Criteria

### 5.1 Per-Priority Acceptance

| Priority | Criteria |
|----------|----------|
| **P0** | All 19 critical bugs resolved with evidence |
| **P1** | All 22 high-priority bugs resolved |
| **P2** | All 27 medium-priority bugs resolved |
| **P3** | At least 80% of low-priority bugs resolved |

### 5.2 Overall Acceptance

- [ ] All YAML files pass syntax validation
- [ ] No fictional model names remain
- [ ] All tool names use correct `spec_kit_memory_` prefix
- [ ] ANCHOR format consistently uses `/ANCHOR:` not `ANCHOR_END:`
- [ ] Path references are accurate
- [ ] Changelog entries are correct (not misleading)
- [ ] Schema version = 11
- [ ] Template progressive inheritance working
- [ ] Manual testing of key workflows successful
- [ ] Version bumped to 1.2.3.0

---

## 6. Constraints

### 6.1 Technical Constraints

1. **Backward Compatibility**: All fixes must maintain command invocation syntax
2. **No Breaking Changes**: Existing workflows must continue to work
3. **Atomic Fixes**: Each fix should be independently testable
4. **YAML Validation**: All YAML files must pass linting after changes

### 6.2 Process Constraints

1. **Verify Before Fix**: Contradictory findings need verification first
2. **Test After Fix**: All fixed YAMLs must be syntax-validated
3. **Document Changes**: Update CHANGELOG.md after all fixes
4. **Version Bump**: Increment to v1.2.3.0 after completion

---

## 7. Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Fixing one issue breaks another | Medium | High | Test each fix independently |
| YAML syntax errors introduced | Low | High | YAML lint before commit |
| Missing edge cases | Medium | Medium | Re-run analysis after fixes |
| Core infrastructure changes cause regressions | Medium | High | Test each fix individually |

---

## 8. References

- [Analysis Report: 15-Agent Audit](./analysis-report.md)
- [Bug Inventory](./bug-inventory.md)
- [Spec 082: SpecKit Reimagined](../082-speckit-reimagined/)
- [Spec 083: Memory Command Consolidation](../083-memory-command-consolidation/)
- [system-spec-kit README](/.opencode/skill/system-spec-kit/README.md)
- [system-spec-kit CHANGELOG](/.opencode/skill/system-spec-kit/CHANGELOG.md)
