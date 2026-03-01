---
title: "Tasks: Path-Scoped Validation Rules [001-mvp-monolithic/tasks]"
description: "L1: spec.md, plan.md, tasks.md"
trigger_phrases:
  - "tasks"
  - "path"
  - "scoped"
  - "validation"
  - "rules"
  - "001"
  - "mvp"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Path-Scoped Validation Rules
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-path-scoped-rules |
| **Created** | 2024-12-24 |
| **Related** | [spec.md](./spec.md), [plan.md](./plan.md) |

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending task |
| `[x]` | Completed task |
| `[P]` | Can be done in parallel with other [P] tasks |
| `[B]` | Blocked - waiting on dependency |

---

## Phase 1: Core Validation Engine (P0)

### 1.1 Script Skeleton
- [ ] Create `validate-spec.sh` in `.opencode/skill/system-spec-kit/scripts/`
- [ ] Add argument parsing (folder path, --json, --help, --strict)
- [ ] Add help text with usage examples
- [ ] Source `common.sh` for shared utilities
- [ ] Define exit codes (0=pass, 1=warnings, 2=errors)
- [ ] Add version number and header

### 1.2 Level Detection
- [ ] Parse spec.md for `Level:` field in metadata
- [ ] Implement fallback inference:
  - [ ] Has decision-record.md → Level 3
  - [ ] Has checklist.md → Level 2
  - [ ] Otherwise → Level 1
- [ ] Store detected level for rule selection
- [ ] Log level detection method (explicit vs inferred)

### 1.3 FILE_EXISTS Check
- [ ] Define required files per level:
  ```
  L1: spec.md, plan.md, tasks.md
  L2: L1 + checklist.md
  L3: L2 + decision-record.md
  ```
- [ ] Check each required file exists
- [ ] Report missing files as ERROR
- [ ] Continue checking even if files missing

### 1.4 PLACEHOLDER_FILLED Check
- [ ] Define placeholder patterns:
  - [ ] `[YOUR_VALUE_HERE: ...]`
  - [ ] `[NEEDS CLARIFICATION: ...]`
  - [ ] `[FORMAT: ...]` (only if still has options like `|`)
  - [ ] `[OPTIONAL: ...]` (INFO, not error)
- [ ] Scan spec.md, plan.md, tasks.md for patterns
- [ ] Extract line number and context for each match
- [ ] Report unfilled placeholders as ERROR
- [ ] Exclude scratch/ and memory/ from this check

### 1.5 SECTIONS_PRESENT Check
- [ ] Define required sections per template:
  ```
  spec.md: Problem Statement, Requirements, Scope
  plan.md: Technical Context, Architecture, Phases
  tasks.md: Phase headers
  checklist.md: Priority sections (P0, P1, P2)
  decision-record.md: Context, Decision, Consequences
  ```
- [ ] Parse markdown headers from each file
- [ ] Compare against required sections
- [ ] Report missing required sections as WARNING
- [ ] Report missing optional sections as INFO

### 1.6 PRIORITY_TAGS Check
- [ ] Scan checklist.md for task items
- [ ] Verify items are under P0/P1/P2 headers
- [ ] Check format consistency: `- [ ] Task description`
- [ ] Report untagged items as WARNING
- [ ] Report malformed items as WARNING

### 1.7 EVIDENCE_CITED Check
- [ ] Find completed items: `- [x] Task description`
- [ ] Check for `[EVIDENCE: ...]` suffix
- [ ] Validate evidence format (file:line or description)
- [ ] Report missing evidence as WARNING (not error)
- [ ] Only applies to P0 and P1 items

### 1.8 Report Generation
- [ ] Implement text output (human-readable)
  - [ ] Color-coded (green ✓, red ✗, yellow ⚠)
  - [ ] Summary line with counts
  - [ ] Clear remediation hints
- [ ] Implement JSON output (--json flag)
  - [ ] Structured format per plan.md
  - [ ] Machine-parseable
- [ ] Calculate final status (pass/warn/fail)

### 1.9 Test Fixtures
- [ ] Create `scratch/test-fixtures/` directory
- [ ] Create `valid-level1/` with clean L1 spec
- [ ] Create `valid-level2/` with clean L2 spec
- [ ] Create `valid-level3/` with clean L3 spec
- [ ] Create `missing-files/` with incomplete files
- [ ] Create `unfilled-placeholders/` with placeholders
- [ ] Create `missing-sections/` with incomplete sections
- [ ] Create `test-validation.sh` runner script
- [ ] All tests pass

---

## Phase 2: Path Scoping (P1)

### 2.1 Configuration Schema
- [ ] Document `.speckit.yaml` schema in plan.md
- [ ] Define default values for all options
- [ ] Create example config file
- [ ] Add schema validation (basic)

### 2.2 Config Loader
- [ ] Find `.speckit.yaml` in project root
- [ ] Parse YAML using shell tools (grep/sed or simple parser)
- [ ] Merge with default values
- [ ] Handle missing config gracefully (use defaults)
- [ ] Log config source (file/defaults)

### 2.3 Path Pattern Matcher
- [ ] Implement glob pattern matching
- [ ] Support `**` for recursive match
- [ ] Support `*` for single segment
- [ ] Match file path against patterns in order
- [ ] Return first matching pattern's ruleset

### 2.4 Rule Sets
- [ ] Define NONE ruleset (skip all)
- [ ] Define MINIMAL ruleset (ANCHORS_VALID only)
- [ ] Define STANDARD ruleset (core checks)
- [ ] Define STRICT ruleset (all checks)
- [ ] Map ruleset to list of rule IDs

### 2.5 Pattern-to-Rules Wiring
- [ ] For each file in spec folder:
  - [ ] Match against path patterns
  - [ ] Determine ruleset
  - [ ] Execute only rules in that set
- [ ] Default pattern for unmatched files

### 2.6 Environment Overrides
- [ ] Check `SPECKIT_VALIDATION` (enable/disable)
- [ ] Check `SPECKIT_RULESET` (override default)
- [ ] Check `SPECKIT_STRICT` (warnings→errors)
- [ ] Check `SPECKIT_JSON` (force JSON output)
- [ ] Environment takes precedence over config file

### 2.7 ANCHORS_VALID Check
- [ ] Scan memory/*.md files
- [ ] Find `<!-- ANCHOR:id -->` opening tags
- [ ] Find `<!-- /ANCHOR:id -->` closing tags
- [ ] Verify each opening has matching closing
- [ ] Verify IDs are unique within file
- [ ] Report mismatched anchors as ERROR

---

## Phase 3: Integration (P1)

### 3.1 check-prerequisites.sh Integration
- [ ] Add optional call to validate-spec.sh
- [ ] Pass through --json flag if present
- [ ] Handle validation exit codes
- [ ] Don't break existing behavior (backward compatible)
- [ ] Add --skip-validation flag

### 3.2 AGENTS.md Gate 6 Update
- [ ] Add validation requirement to Gate 6
- [ ] Document validation step
- [ ] Specify when validation is required vs optional
- [ ] Add validation to completion verification checklist

### 3.3 /spec_kit:complete Integration
- [ ] Add validation to Step 11 (Completion)
- [ ] Run validation before claiming done
- [ ] Report validation results
- [ ] Block completion on errors (configurable)
- [ ] Allow completion with warnings

### 3.4 Backward Compatibility
- [ ] Test with all existing spec folders
- [ ] Verify no false positives on valid specs
- [ ] Verify no breaks to existing workflows
- [ ] Document any behavioral changes

---

## Phase 4: Documentation (P2)

### 4.1 SKILL.md Updates
- [ ] Add validation section to HOW IT WORKS
- [ ] Document validate-spec.sh in Resource Router
- [ ] Add validation to SUCCESS CRITERIA
- [ ] Document when to run validation

### 4.2 path_scoped_rules.md Conversion
- [ ] Remove "NOT YET IMPLEMENTED" banner
- [ ] Update to reflect actual implementation
- [ ] Document all path patterns
- [ ] Document all rule sets
- [ ] Add troubleshooting section

### 4.3 validation_rules.md Reference
- [ ] Create new reference document
- [ ] Document each rule:
  - [ ] Rule ID and description
  - [ ] Severity level
  - [ ] What triggers it
  - [ ] How to fix it
- [ ] Document configuration options
- [ ] Add examples

### 4.4 README.md Updates
- [ ] Add validation to feature list
- [ ] Update quick start section
- [ ] Add validation examples
- [ ] Update statistics table

### 4.5 scripts/README.md Updates
- [ ] Add validate-spec.sh documentation
- [ ] Document arguments and options
- [ ] Add usage examples
- [ ] Document exit codes

---

## Summary

| Phase | Tasks | Priority | Status |
|-------|-------|----------|--------|
| Phase 1 | 9 major tasks | P0 | Pending |
| Phase 2 | 7 major tasks | P1 | Pending |
| Phase 3 | 4 major tasks | P1 | Pending |
| Phase 4 | 5 major tasks | P2 | Pending |
| **Total** | **25 major tasks** | | |
