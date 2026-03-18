---
title: "Implementation Plan: OpenCode Agent Path Only [018-opencode-agent-path-only/plan]"
description: "This task involves a systematic search-and-replace operation across AGENTS.md, skill files, and command files to change agent path references from .claude/agents and .codex/agen..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "opencode"
  - "agent"
  - "path"
  - "018"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: OpenCode Agent Path Only

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash (grep validation) |
| **Framework** | N/A (Documentation update) |
| **Storage** | N/A |
| **Testing** | grep-based validation |

### Overview
This task involves a systematic search-and-replace operation across AGENTS.md, skill files, and command files to change agent path references from `.claude/agents` and `.codex/agents` to `.opencode/agent` exclusively. Validation will use grep to confirm zero remaining non-OpenCode path references in active runtime documentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Files to change identified

### Definition of Done
- [ ] All agent path references updated to `.opencode/agent`
- [ ] Grep validation confirms zero remaining alternate paths
- [ ] Cross-platform convention documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation refactoring with validation

### Key Components
- **AGENTS.md**: Agent routing table (Section 7)
- **Skill files**: Any references to agent paths for exclusivity rules
- **Command files**: Any dispatch logic referencing agent paths

### Data Flow
1. Search for all occurrences of `.claude/agents` and `.codex/agents`
2. Evaluate each occurrence (runtime vs informational)
3. Replace runtime references with `.opencode/agent`
4. Validate with grep
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery
- [ ] Run comprehensive grep to find all agent path references
- [ ] Categorize findings: runtime vs informational vs platform-specific config
- [ ] Document which files require changes

### Phase 2: Core Implementation
- [ ] Update AGENTS.md agent routing table (Section 7)
- [ ] Update system-spec-kit SKILL.md agent exclusivity section
- [ ] Update command files in `.opencode/command/` if needed
- [ ] Add cross-platform convention notes to agent files

### Phase 3: Verification
- [ ] Run grep validation: `grep -r "\.claude/agents\|\.codex/agents" AGENTS.md .opencode/`
- [ ] Verify zero matches in runtime/active documentation
- [ ] Review changes for accuracy
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static Analysis | All markdown files | grep with regex |
| Manual Review | Changed sections | Visual inspection |
| Validation | Final state | grep confirmation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| grep utility | External | Green | Cannot validate; use manual search |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: References to `.opencode/agent` break platform-specific workflows
- **Procedure**: Revert to multi-path references in affected sections; document as intentional
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
