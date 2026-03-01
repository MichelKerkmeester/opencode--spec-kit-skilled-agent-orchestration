---
title: "Completion Checklist [036-post-merge-refinement-1/checklist]"
description: "id: 036-post-merge-refinement"
trigger_phrases:
  - "completion"
  - "checklist"
  - "036"
  - "post"
importance_tier: "normal"
contextType: "implementation"
id: 036-post-merge-refinement
level: 2
---
# Completion Checklist

## P0 - Critical Issues (HARD BLOCKERS)

- [ ] **P0.1**: validate-spec.sh exists and is functional
  - [ ] Script created at `.opencode/skill/system-spec-kit/scripts/validate-spec.sh`
  - [ ] Exit codes work correctly (0/1/2)
  - [ ] Tested on 3+ existing spec folders
  - [ ] Gate 6 integration verified

- [ ] **P0.2**: MCP tool naming accurate in SKILL.md
  - [ ] All tool references use `semantic_memory_*` prefix
  - [ ] Tool table updated
  - [ ] No shorthand without clarifying note

- [ ] **P0.3**: recommend-level.sh resolved
  - [ ] Script created OR reference removed
  - [ ] SKILL.md:172 accurate

## P1 - High Priority (Must Complete)

- [ ] **P1.1**: Placeholder validation detects Mustache syntax
- [ ] **P1.2**: Lib directories consolidated (no duplication)
- [ ] **P1.3**: YAML assets for /spec_kit:plan exist or refs fixed
- [ ] **P1.4**: Constitutional tier in context_template.md
- [ ] **P1.5**: No phantom tool references (memory_load removed)

## P2 - Medium Priority (Should Complete)

- [ ] **P2.1**: Command path separators standardized
- [ ] **P2.2**: Template count accurate in SKILL.md
- [ ] **P2.3**: 035 spec status updated to Complete
- [ ] **P2.4**: MCP parameters fully documented

## Verification

- [ ] Full `/spec_kit:complete` workflow tested
- [ ] Full `/memory:save` workflow tested
- [ ] No console errors during workflows
- [ ] All P0 and P1 items verified

## Sign-off

| Phase | Date | Verified By | Notes |
|-------|------|-------------|-------|
| P0 Complete | | | |
| P1 Complete | | | |
| P2 Complete | | | |
| Final | | | |
