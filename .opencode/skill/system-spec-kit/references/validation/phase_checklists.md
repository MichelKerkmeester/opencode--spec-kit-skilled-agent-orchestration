---
title: Phase Checklists
description: Priority-based checklists for each phase of the SpecKit workflow.
---

# Phase Checklists - Validation Items by Development Phase

Priority-based checklists for each phase of the SpecKit workflow.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Priority Levels**:
- **P0 (HARD BLOCKER)** - Must complete before proceeding
- **P1 (MUST COMPLETE)** - Required for completion, can defer with approval
- **P2 (NICE TO HAVE)** - Optional, can defer without approval

> **Context**: Use these checklists during the Completion Verification Rule to ensure all requirements are met.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:planning-phase -->
## 2. PLANNING PHASE

### P0 - Hard Blockers

- [ ] Implementation approach selected
- [ ] Task breakdown created
- [ ] Acceptance criteria defined
- [ ] Spec folder created with required files

### P1 - Must Complete

- [ ] Edge cases identified
- [ ] Test strategy defined
- [ ] Performance considerations noted
- [ ] Dependencies mapped
- [ ] Timeline estimated

### P2 - Nice to Have

- [ ] Alternative approaches documented
- [ ] Rollback strategy defined
- [ ] Documentation plan created
- [ ] Code review approach noted

---

<!-- /ANCHOR:planning-phase -->
<!-- ANCHOR:research-phase -->
## 3. RESEARCH PHASE

### P0 - Hard Blockers

- [ ] Problem statement documented
- [ ] Existing solutions researched
- [ ] Technical constraints identified
- [ ] User stories drafted

### P1 - Must Complete

- [ ] Alternative approaches evaluated
- [ ] Dependencies identified
- [ ] Risk assessment completed
- [ ] Scope boundaries defined

### P2 - Nice to Have

- [ ] Related documentation reviewed
- [ ] Team input gathered
- [ ] Historical context captured
- [ ] Performance considerations noted

---

<!-- /ANCHOR:research-phase -->
<!-- ANCHOR:implementation-phase -->
## 4. IMPLEMENTATION PHASE

### P0 - Hard Blockers

- [ ] Code follows existing patterns (check code quality standards)
- [ ] Changes stay within spec.md scope (no scope creep)
- [ ] Unit tests written and passing
- [ ] No console errors in browser DevTools
- [ ] Bash 3.2 compatible (for shell scripts)
- [ ] checklist.md updated with progress

### P1 - Must Complete

- [ ] Integration tests pass
- [ ] Documentation updated (plan.md reflects actual implementation)
- [ ] ShellCheck compliant (for shell scripts)
- [ ] Error handling implemented
- [ ] Edge cases covered
- [ ] Browser verification completed (frontend changes)
- [ ] If stuck on same error 3+ times, run `/spec_kit:debug`
- [ ] If debugging > 15 minutes without progress, consider delegation

### P2 - Nice to Have

- [ ] Code comments added where non-obvious
- [ ] Performance optimized (no premature optimization)
- [ ] Logging implemented for debugging
- [ ] Configuration externalized

### Implementation Workflow

**Before Coding:**
- [ ] Read existing code first (understand before modify)
- [ ] Verify approach aligns with code quality standards
- [ ] Confirm simplest solution selected (KISS principle)

**During Coding:**
- [ ] Update checklist.md as items complete
- [ ] Test incrementally (don't batch all testing to end)
- [ ] Keep changes minimal and focused

**Before Claiming Complete:**
- [ ] All P0 items verified with evidence
- [ ] Browser tested if frontend (Completion Verification Rule requirement)
- [ ] For phased packets: recursive PHASE_LINKS validation passed, residual warnings reviewed against live folder/status truth
- [ ] Save context if significant progress: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`

### Debug Escalation Protocol

When debugging becomes prolonged or repetitive:

**Trigger Conditions:**
- Same error after 3+ fix attempts
- Debugging session > 15 minutes without resolution
- Frustration indicators ("stuck", "tried everything")

**Action:**
1. Run `/spec_kit:debug` command
2. Select AI model when prompted (Claude/Gemini/Codex)
3. Review sub-agent findings
4. Apply fix or iterate

**Benefits:**
- Fresh perspective from parallel agent
- Structured context handoff
- Documented debugging history

---

<!-- /ANCHOR:implementation-phase -->
<!-- ANCHOR:review-phase -->
## 5. REVIEW PHASE

### P0 - Hard Blockers

- [ ] All tests passing
- [ ] Code reviewed
- [ ] No blockers remaining
- [ ] Memory context saved: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`

### P1 - Must Complete

- [ ] Performance validated
- [ ] Security considerations checked
- [ ] Documentation complete
- [ ] User acceptance verified

### P2 - Nice to Have

- [ ] Code cleanup done
- [ ] Technical debt noted
- [ ] Future improvements documented
- [ ] Knowledge transfer complete

---

<!-- /ANCHOR:review-phase -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

### Reference Files

- [validation_rules.md](../validation/validation_rules.md) - Automated validation rules
- [level_specifications.md](../templates/level_specifications.md) - Level requirements

### Templates

- [checklist.md](../../templates/level_2/checklist.md) - Checklist template for spec folders (Level 2+)

### Skills

- Code quality standards for patterns and conventions
- sk-code--web skill for implementation lifecycle
<!-- /ANCHOR:related-resources -->
