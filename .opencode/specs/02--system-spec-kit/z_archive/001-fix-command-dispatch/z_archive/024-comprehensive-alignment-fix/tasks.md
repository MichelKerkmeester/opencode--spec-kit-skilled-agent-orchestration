---
title: "Task Breakdown [024-comprehensive-alignment-fix/tasks]"
description: "Actionable tasks for each checklist item. Complete in order within each phase."
trigger_phrases:
  - "task"
  - "breakdown"
  - "tasks"
  - "024"
  - "comprehensive"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown

Actionable tasks for each checklist item. Complete in order within each phase.

---

## Phase 1: P0 Critical

### P0.1 - Fix YAML Syntax Errors

- [ ] Run `yamllint` on all files in `.opencode/commands/`
- [ ] List all files with syntax errors
- [ ] Fix each error (common: indentation, quotes, colons)
- [ ] Re-run `yamllint` to confirm all pass
- [ ] Test command loading in OpenCode

### P0.2 - Correct Script Paths

- [ ] Extract all script paths from command definitions
- [ ] Verify each path exists using `ls` or `test -f`
- [ ] List all missing/incorrect paths
- [ ] Update each path to correct location
- [ ] Test script execution for each corrected path

### P0.3 - Missing Command Implementation

- [ ] Identify the missing command (from audit)
- [ ] Determine: implement or remove?
- [ ] If implement: create command file with proper structure
- [ ] If remove: find all references and delete them
- [ ] Verify no dangling references remain

### P0.4 - Resolve Documentation Contradiction

- [ ] Identify the contradicting sources
- [ ] Determine which is correct (current behavior)
- [ ] Update incorrect source to match truth
- [ ] Add note explaining the correction
- [ ] Verify both sources now agree

---

## Phase 2: P1 High Priority

### P1.1 - Bash Version Compatibility

- [ ] Identify Bash 4+ features used (associative arrays, etc.)
- [ ] List affected scripts
- [ ] Rewrite using POSIX alternatives or add shims
- [ ] Test on Bash 3.x (macOS default)
- [ ] Test on Bash 4.x+ (Linux)

### P1.2 - JSON Escaping Issues

- [ ] Identify commands producing JSON output
- [ ] Test each with special characters (quotes, newlines, backslashes)
- [ ] Fix escaping in output generation
- [ ] Verify JSON parses with `jq`

### P1.3 - Update AGENTS.md

- [ ] Review tool routing section for accuracy
- [ ] Update MCP tool references
- [ ] Verify gate definitions match implementation
- [ ] Update skill routing table
- [ ] Remove outdated workflow references

### P1.4 - Align Templates

- [ ] List all templates in `.opencode/skill/system-spec-kit/templates/`
- [ ] Compare each to actual expected output
- [ ] Update file lists in templates
- [ ] Update folder structure in templates
- [ ] Test template generation

### P1.5 - Command Parameter Types

- [ ] Review parameter definitions in commands
- [ ] Identify type mismatches
- [ ] Correct type annotations
- [ ] Test with valid and invalid inputs

### P1.6 - Update Skill References

- [ ] List all skill cross-references
- [ ] Verify each reference path exists
- [ ] Update renamed/moved skills
- [ ] Test skill loading

### P1.7 - Error Handling Paths

- [ ] Trace error paths in scripts
- [ ] Verify error handlers exist
- [ ] Fix missing handler references
- [ ] Test error conditions

### P1.8 - Fix Validation Script

- [ ] Review `validate-spec.sh` logic
- [ ] Identify logic errors
- [ ] Fix conditional checks
- [ ] Test with valid spec folder
- [ ] Test with invalid spec folder

---

## Phase 3: P2 Medium Priority

### P2.1 - Glob Tool Documentation

- [ ] Read current Glob tool behavior
- [ ] Compare to documentation
- [ ] Update examples to match behavior
- [ ] Verify parameter descriptions accurate

### P2.2 - Remove Obsolete Markers

- [ ] Search templates for TODO, FIXME, XXX markers
- [ ] List all occurrences
- [ ] Resolve or remove each marker
- [ ] Verify no placeholders remain

### P2.3 - Fix Cross-References

- [ ] Extract all internal links from docs
- [ ] Verify each link target exists
- [ ] Fix broken links
- [ ] Run link checker to confirm

### P2.4 - Clean Deprecated Instructions

- [ ] Identify deprecated features still documented
- [ ] Archive to `z_archive/` if valuable
- [ ] Remove from active documentation
- [ ] Update any remaining references

---

## Verification Tasks

### Post-P0 Verification
- [ ] Run `yamllint .opencode/commands/`
- [ ] Run test script to verify all paths
- [ ] Grep for missing command name

### Post-P1 Verification
- [ ] Run AGENTS.md consistency checker
- [ ] Generate spec folder from template, verify structure
- [ ] Load each skill, verify no errors

### Post-P2 Verification
- [ ] Run documentation link checker
- [ ] Search for remaining TODO/FIXME
- [ ] Manual review of key documentation pages

---

## Notes

- Each task is atomic - can be committed independently
- If blocked, document in `memory/` and continue with next
- Reference checklist.md for success criteria
