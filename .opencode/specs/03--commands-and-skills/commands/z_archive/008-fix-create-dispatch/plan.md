---
title: "Implementation Plan: Fix Create Command Dispatch Vulnerability + Defensive Hardening [008-fix-create-dispatch/plan]"
description: "This implements a security fix for the phantom dispatch vulnerability in create commands, following the proven pattern from Spec 118. The critical fix removes Task from skill.md..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "fix"
  - "create"
  - "command"
  - "008"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Fix Create Command Dispatch Vulnerability + Defensive Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (command files), YAML (workflow assets) |
| **Framework** | OpenCode command system (.opencode/command/) |
| **Storage** | None |
| **Testing** | Manual verification of command execution |

### Overview
This implements a security fix for the phantom dispatch vulnerability in create commands, following the proven pattern from Spec 118. The critical fix removes `Task` from `skill.md`'s allowed-tools and adds imperative guardrail blocks to all 6 create command files. YAML assets get REFERENCE ONLY markers for defense-in-depth.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Spec 118 pattern)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] Manual testing: `/create:skill` executes directly without sub-agent delegation
- [ ] CHANGELOG updated, tagged v2.0.1.2, released

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Static file modification - no architectural changes. Applying proven guardrail pattern from Spec 118 to a new command family.

### Key Components
- **Command files** (`.opencode/command/create/*.md`): 6 Markdown files with frontmatter + workflow content
- **YAML assets** (`.opencode/command/create/assets/*.yaml`): 6 workflow definition files loaded by commands

### Data Flow
User invokes `/create:*` command -> OpenCode reads command .md file -> Parses frontmatter (allowed-tools) -> Executes command content. Vulnerability: Go runtime scans for @agent + Task combo -> injects phantom dispatch.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Critical Fix (skill.md)
- [ ] Remove `Task` from skill.md `allowed-tools` frontmatter (Fix D)
- [ ] Add imperative guardrail block at line 7 after frontmatter (Fix A)
- [ ] Add YAML loading prominence to guardrail (Fix B)
- [ ] Verify `/create:skill` no longer triggers phantom dispatch

### Phase 2: Defensive Hardening (remaining 5 commands)
- [ ] Add guardrail block to agent.md (Fix A only, no YAML loading step)
- [ ] Add guardrail block to skill_reference.md (Fix A+B)
- [ ] Add guardrail block to skill_asset.md (Fix A+B)
- [ ] Add guardrail block to install_guide.md (Fix A+B)
- [ ] Add guardrail block to folder_readme.md (Fix A+B)

### Phase 3: YAML Asset Hardening
- [ ] Add `# REFERENCE ONLY` comment to all 6 YAML files (Fix E)
- [ ] Investigate orphaned create_agent.yaml

### Phase 4: Release
- [ ] Update CHANGELOG with v2.0.1.2 entry
- [ ] Commit all changes
- [ ] Tag v2.0.1.2
- [ ] Push and create GitHub release

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Invoke `/create:skill` and verify direct execution | OpenCode CLI |
| Manual | Verify no phantom dispatch in any create command | OpenCode CLI |
| Manual | Verify YAML assets still load correctly | OpenCode CLI |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 118 guardrail pattern | Internal | Green (completed) | Must reference for format consistency |
| Git access for tagging | Internal | Green | Cannot release without push access |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Create commands stop functioning after changes
- **Procedure**: `git revert` the commit; all changes are to static files with no data impact

<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Critical Fix) ──► Phase 2 (Hardening) ──► Phase 3 (YAML) ──► Phase 4 (Release)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Critical Fix | None | Phase 4 |
| Phase 2: Hardening | None (parallelizable with Phase 1) | Phase 4 |
| Phase 3: YAML Assets | None (parallelizable with Phases 1-2) | Phase 4 |
| Phase 4: Release | Phases 1, 2, 3 | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Critical Fix | Low | 10-15 minutes |
| Phase 2: Defensive Hardening | Low | 20-30 minutes |
| Phase 3: YAML Assets | Low | 10-15 minutes |
| Phase 4: Release | Low | 10-15 minutes |
| **Total** | **Low** | **50-75 minutes** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All 6 create commands tested after changes
- [ ] No command execution regressions

### Rollback Procedure
1. `git revert <commit-hash>` - single commit contains all changes
2. Verify create commands function as before
3. No data migrations or external state to revert

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - static file changes only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
