---
title: "Implementation Plan: Agent Routing Documentation Update [119-agent-routing-doc-update/plan]"
description: "Update SKILL.md and README.md to document the agent routing changes from spec 014. Add @debug to agent exclusivity exceptions, create an Agent Dispatch subsection, update mode s..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "agent"
  - "routing"
  - "documentation"
  - "119"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Agent Routing Documentation Update

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | OpenCode skill system (.opencode/skill/system-spec-kit/) |
| **Storage** | N/A |
| **Testing** | Manual verification + grep |

### Overview

Update SKILL.md and README.md to document the agent routing changes from spec 014. Add @debug to agent exclusivity exceptions, create an Agent Dispatch subsection, update mode suffixes, and create a changelog entry.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear — 3 files need updating
- [x] Success criteria measurable — specific sections identified with line numbers
- [x] Dependencies identified — spec 014 complete

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-005)
- [ ] SKILL.md agent routing matches actual YAML implementations
- [ ] README.md mode suffixes complete
- [ ] Changelog created

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only changes to existing Markdown files.

### Key Components
- **SKILL.md**: AI workflow instructions — the authoritative reference for system-spec-kit
- **README.md**: Human-readable documentation — the public-facing reference
- **Changelog**: Version tracking for the skill

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: SKILL.md Updates

- [ ] T001 Add `debug-delegation.md` to Agent Exclusivity exceptions (line ~67)
- [ ] T002 Add Agent Dispatch subsection after Resource Router (~line 158) documenting:
  - @debug: implement + complete commands, trigger at failure >= 3
  - @review: implement + complete (dual-phase Mode 2 + Mode 4), debug (advisory)
  - @research: plan command, trigger at confidence < 60%
  - @handover: plan + implement + complete + research, session-end step

### Phase 2: README.md Updates

- [ ] T003 Add `:with-research` and `:auto-debug` to Mode Suffixes table (line ~228)
- [ ] T004 Update Recent Changes section (line ~781) with spec 014 reference

### Phase 3: Changelog

- [ ] T005 Create `.opencode/changelog/01--system-spec-kit/v2.2.9.0.md`

### Phase 4: Verification

- [ ] T006 Verify all agent names match between SKILL.md and command YAML files
- [ ] T007 Verify trigger conditions match YAML thresholds

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | Agent names in SKILL.md match YAML | grep across files |
| Manual | Mode suffixes complete | Visual verification |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 014 implementation | Internal | Complete | Defines the routing being documented |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation inaccurate or misleading
- **Procedure**: `git checkout -- .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/README.md`

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (SKILL.md) ──┐
                      ├──► Phase 4 (Verify)
Phase 2 (README.md) ──┤
                      │
Phase 3 (Changelog) ──┘
```

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: SKILL.md | Low | ~30 lines added |
| Phase 2: README.md | Low | ~15 lines added |
| Phase 3: Changelog | Low | ~40 lines |
| Phase 4: Verification | Low | grep checks |

<!-- /ANCHOR:effort -->

---
