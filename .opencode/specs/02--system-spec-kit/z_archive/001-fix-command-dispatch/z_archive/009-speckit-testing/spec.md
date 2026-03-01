---
title: "Feature Specification: SpecKit Post-Rename Testing [009-speckit-testing/spec]"
description: "Comprehensive testing of system-spec-kit skill after rename from workflows-spec-kit."
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "post"
  - "rename"
  - "spec"
  - "009"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: SpecKit Post-Rename Testing

Comprehensive testing of system-spec-kit skill after rename from workflows-spec-kit.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: speckit, testing, verification
- **Priority**: P1
- **Feature Branch**: `005-speckit-testing`
- **Created**: 2025-12-17
- **Status**: In Progress
- **Input**: Recent rename from workflows-spec-kit to system-spec-kit

### Purpose
Verify all SpecKit features work correctly after the recent rename and consolidation changes.

### Background
Two major changes occurred:
1. **003-speckit-consolidation**: Migrated from `.opencode/speckit/` to `.opencode/skills/workflows-spec-kit/`
2. **004-system-spec-kit-rename**: Renamed from `workflows-spec-kit` to `system-spec-kit`

Total: 197 replacements across ~41 files

---

## 2. SCOPE

### In Scope
- Test all 6 shell scripts for functionality
- Validate all 9 templates exist and are properly formatted
- Verify reference documentation consistency with AGENTS.md
- Search for orphaned old path references
- End-to-end integration testing of spec folder creation workflow

### Out of Scope
- Modifying existing functionality (read-only testing)
- Performance benchmarking
- New feature development

---

## 3. TEST AREAS

### Test Area 1 - Script Functionality (Priority: P0)
All scripts in `.opencode/skills/system-spec-kit/scripts/` must execute without errors.

**Scripts to test:**
- common.sh
- create-spec-folder.sh
- check-prerequisites.sh
- calculate-completeness.sh
- recommend-level.sh
- archive-spec.sh

### Test Area 2 - Template Validation (Priority: P0)
All templates in `.opencode/skills/system-spec-kit/templates/` must be valid.

**Templates to verify:**
- spec.md, plan.md, tasks.md
- checklist.md, decision-record.md
- research.md, research-spike.md
- handover.md, debug-delegation.md
- scratch/.gitkeep

### Test Area 3 - Documentation Consistency (Priority: P1)
References must align with AGENTS.md Section 2.

### Test Area 4 - Path Verification (Priority: P0)
Zero orphaned references to old paths should exist.

### Test Area 5 - Integration Testing (Priority: P1)
End-to-end workflow must function correctly.

---

## 4. SUCCESS CRITERIA

- All 6 scripts run without errors
- All 9 templates exist with proper formatting
- Reference documentation matches AGENTS.md
- Zero orphaned old path references found
- Create-spec-folder workflow produces valid output

---
