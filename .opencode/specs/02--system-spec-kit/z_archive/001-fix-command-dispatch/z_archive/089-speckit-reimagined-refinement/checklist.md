---
title: "Checklist: system-spec-kit Reimagined Refinement [089-speckit-reimagined-refinement/checklist]"
description: "title: \"Checklist: system-spec-kit Reimagined Refinement\""
trigger_phrases:
  - "checklist"
  - "system"
  - "spec"
  - "kit"
  - "reimagined"
  - "089"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
spec: "089"
---
# Checklist: system-spec-kit Reimagined Refinement

---

## P0 - HARD BLOCKERS (Must Complete)

### Config: Path Resolution & Naming
- [ ] **C-001**: `content-filter.js` resolves `filters.jsonc` at correct path
  - Evidence: `node -e "console.log(require('path').join(...))"` outputs correct path
- [ ] **C-002**: Config property names match code property names (camelCase/snake_case aligned)
  - Evidence: grep shows matching names in both files
- [ ] **C-003**: Fallback values exist if config file is missing
  - Evidence: content-filter.js handles missing config gracefully

### MCP Server: LIKE Injection
- [ ] **S-001**: `resolve_memory_reference()` escapes `%` and `_` in user input
  - Evidence: Test with input containing `%` produces correct SQL
- [ ] **S-002**: `escapeLikePattern()` helper exists and is exported
  - Evidence: Function visible in module exports

### Documentation: Data Consistency
- [ ] **D-001**: LOC counts match across SKILL.md, level_specifications.md, level_selection_guide.md
  - Evidence: Side-by-side comparison shows identical numbers
- [ ] **D-002**: Voyage model version consistent across embedding_resilience.md and environment_variables.md
  - Evidence: grep for "voyage-" shows same version in both files
- [ ] **D-003**: Voyage version matches actual MCP server implementation
  - Evidence: Code default matches documentation

---

## P1 - MUST COMPLETE (Or User-Approved Deferral)

### Scripts: Security & Logic
- [ ] **SC-001**: validate.sh `get_rule_severity` no longer uses `eval`
  - Evidence: grep for "eval" in validate.sh returns 0 matches
- [ ] **SC-002**: create.sh handles "3+" level without truncation
  - Evidence: `bash create.sh --level 3+ test` creates correct folder

### SKILL.md Corrections
- [ ] **SK-001**: All 6 references verified as "AGENTS.md" (canonical name per Spec 087). Incorrect CLAUDE.md references reverted.
  - Evidence: grep count matches expected
- [ ] **SK-002**: Command file format corrected (.yaml → .md)
- [ ] **SK-003**: validate-spec.sh → validate.sh
- [ ] **SK-004**: generate-context.js line count updated (142 → actual)
- [ ] **SK-005**: Level range "1-3" → "1-3+"
- [ ] **SK-006**: Template version references consistent (v2.0 or v2.2, not mixed)

### References: Cross-References (13 total)
- [ ] **REF-001**: validate-spec.sh → spec/validate.sh (3 locations)
- [ ] **REF-002**: scripts/rules/ references removed or corrected (1 location)
- [ ] **REF-003**: memory_system.md path fixed (workflows/ → memory/)
- [ ] **REF-004**: Checklist template path includes level_2/ prefix
- [ ] **REF-005**: Decision-record template path includes level_3/ prefix
- [ ] **REF-006**: complexity_guide.md → level_selection_guide.md
- [ ] **REF-007**: AGENTS.md relative path depth corrected (decision-format.md)
- [ ] **REF-008**: Root README.md reference corrected (troubleshooting.md)
- [ ] **REF-009**: SKILL.md section references use whole numbers
- [ ] **REF-010**: All links verified by attempting file access

### Assets: Broken References
- [ ] **AS-001**: spec.md references fixed in level_decision_matrix.md
- [ ] **AS-002**: spec.md references fixed in parallel_dispatch_config.md
- [ ] **AS-003**: template_guide.md link corrected in template_mapping.md
- [ ] **AS-004**: Level 3+ added to template_mapping.md

### Agents: Frontmatter & Structure
- [ ] **AG-001**: orchestrate.md mode = valid value (agent)
- [ ] **AG-002**: write.md mode = valid value (agent)
- [ ] **AG-003**: write.md allowed-tools includes task
- [ ] **AG-004**: review.md has intro paragraph
- [ ] **AG-005**: @handover in orchestrate capability map
- [ ] **AG-006**: orchestrate.md has Section 0 (Model Preference)
- [ ] **AG-007**: speckit.md has no project-specific references

---

## P2 - CAN DEFER WITHOUT APPROVAL

### Config Cleanup
- [ ] **CC-001**: Dead config sections documented or removed
- [ ] **CC-002**: complexity-config.jsonc deprecated or deleted
- [ ] **CC-003**: config/README.md reflects actual functions

### Scripts Cleanup
- [ ] **SCL-001**: scripts-registry.json has no phantom entries
- [ ] **SCL-002**: All registry entries verified against filesystem

### References Cleanup
- [ ] **RC-001**: Deprecated COMPLEXITY_GATE content consolidated to appendix
- [ ] **RC-002**: level_selection_guide.md deprecated sections trimmed

### Pre-analysis Archive
- [ ] **PA-001**: 081 files have SUPERSEDED header
- [ ] **PA-002**: Implementation mapping exists (recommendation → implementing file)

---

## Verification Gates

### Pre-Merge Verification
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` passes (exit 0)
- [ ] MCP server starts without errors: `node .opencode/skill/system-spec-kit/mcp_server/index.js`
- [ ] No broken markdown links in modified files (manual spot-check of 5+ files)
- [ ] Git diff shows only intended changes (no accidental modifications)

### Post-Merge Verification
- [ ] memory_search() returns results (MCP server functional)
- [ ] memory_save() succeeds (LIKE injection fix doesn't break normal queries)
- [ ] Spec folder creation works: `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 3+ test-verify`
- [ ] Content filtering works with fixed path resolution
