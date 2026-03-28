---
title: "Feature Specification: Fix Command Dispatch Vulnerability [001-fix-command-dispatch/spec]"
description: "During a security audit of the OpenCode command system, a critical vulnerability was discovered in 7 command .md files: phantom dispatch text and missing guardrails that cause c..."
trigger_phrases:
  - "feature"
  - "specification"
  - "fix"
  - "command"
  - "dispatch"
  - "spec"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Fix Command Dispatch Vulnerability

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-13 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:executive-summary -->
## 2. EXECUTIVE SUMMARY

During a security audit of the OpenCode command system, a critical vulnerability was discovered in 7 command `.md` files: phantom dispatch text and missing guardrails that cause commands to route to incorrect agents. The fix involves 4 targeted approaches: (A) remove phantom/invisible text, (B) add guardrail sections to all commands, (C) standardize template structure, and (D) validate YAML configs against `.md` definitions.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:problem -->
## 3. PROBLEM & PURPOSE

### Problem Statement
When `/spec_kit:complete` (and potentially other spec_kit commands) is executed, phantom dispatch text appears that instructs the AI to "call the task tool with subagent: debug/review" instead of following the intended YAML workflow. This text exists nowhere in any command or YAML file, indicating the OpenCode runtime injects it based on structural cues in the command files (@agent references combined with `allowed-tools: Task`). The result is that commands dispatch to wrong agents instead of executing their defined workflows.

### Purpose
Eliminate phantom dispatch injection across all 7 spec_kit command files and 13 YAML workflow files so that every command executes its intended workflow without triggering unintended agent dispatches.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:risk-matrix -->
## 4. RISK MATRIX

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Phantom text causes incorrect command dispatch | HIGH | HIGH | Fix A: Remove all phantom/invisible text |
| 2 | Missing guardrails allow unsafe AI execution | HIGH | HIGH | Fix B: Add guardrail sections to all commands |
| 3 | Inconsistent command structure across files | MEDIUM | MEDIUM | Fix C: Standardize template structure |
| 4 | YAML config drift from .md definitions | MEDIUM | LOW | Fix E: Validate YAML against .md files |
| 5 | Regression after fixes applied | LOW | HIGH | Phase 3 verification with cross-reference checks |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:scope -->
## 5. SCOPE

### In Scope
- Audit and fix all 7 spec_kit command `.md` files for dispatch vulnerability patterns
- Audit all 13 YAML workflow files in `.opencode/command/spec_kit/assets/` for related issues
- Apply structural fixes: move execution instructions to top, fence dispatch templates, add guardrails
- Document vulnerability patterns for future command creation

### Out of Scope
- Modifying OpenCode runtime behavior - out of our control
- Changes to non-spec_kit commands - separate scope
- YAML workflow logic changes (only structural/formatting fixes)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/complete.md` | Modify | Primary fix target - worst case for phantom dispatch |
| `.opencode/command/spec_kit/debug.md` | Modify | Audit and apply structural fixes |
| `.opencode/command/spec_kit/handover.md` | Modify | Audit and apply structural fixes |
| `.opencode/command/spec_kit/plan.md` | Modify | Audit and apply structural fixes |
| `.opencode/command/spec_kit/research/research/research.md` | Modify | Audit and apply structural fixes |
| `.opencode/command/spec_kit/resume.md` | Modify | Audit and apply structural fixes |
| `.opencode/command/spec_kit/implement.md` | Modify | Audit and apply structural fixes |
| `.opencode/command/spec_kit/assets/*.yaml` | Modify | Audit 13 YAML files for routing/structural issues |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 6. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No command file triggers phantom dispatch text injection | Running each command produces no "Use the above message and context to generate a prompt and call the task tool with subagent" output |
| REQ-002 | All command files have execution instructions at top (before any agent references) | First substantive section after frontmatter is the imperative execution block |
| REQ-003 | All dispatch templates in command files are properly fenced with context markers | Dispatch templates wrapped in clearly labeled code blocks or conditional sections |
| REQ-004 | All 7 command files pass vulnerability audit for patterns V1-V6 | Zero findings on re-audit after fixes applied |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All 13 YAML workflow files audited for related structural issues | Audit report documenting findings for each file |
| REQ-006 | Vulnerability patterns documented for future command authors | Pattern guide with examples of what to avoid |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

- **SC-001**: Running `/spec_kit:complete` executes the 14-step YAML workflow without dispatching @debug or @review agents
- **SC-002**: All 7 command files pass a V1-V6 vulnerability pattern audit with zero findings
- **SC-003**: YAML files have clear routing that does not create ambiguous agent dispatch opportunities

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 8. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | OpenCode runtime injection behavior is undocumented | High - may not fully understand trigger conditions | Test empirically with each fix; document observed behavior |
| Risk | Structural changes may break command parsing | Med - commands could stop loading | Preserve all frontmatter fields exactly; test each command after fix |
| Risk | Some phantom text may come from runtime, not file structure | Med - fixes may not eliminate all injections | Document remaining issues; distinguish file-fixable vs runtime-only |
| Dependency | OpenCode command parser | Must understand how it processes .md files | Read existing working commands for comparison |

<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No change to command load time (structural edits only)

### Security
- **NFR-S01**: No secrets or credentials in any command file (already true, maintain)

### Reliability
- **NFR-R01**: All 7 commands must remain functional after fixes (zero regressions)
- **NFR-R02**: YAML workflow references must resolve correctly after any path/name changes

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty command arguments: Command files must handle gracefully (existing behavior preserved)
- Long workflow YAML: Files with many steps must not have truncation issues

### Error Scenarios
- Command file syntax error after edit: Detected by manual testing each command
- YAML parse failure: Validate YAML syntax after any modifications

### State Transitions
- Mid-workflow interruption: Not affected by structural changes (workflow logic unchanged)

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 20 files across 2 directories, structural analysis required |
| Risk | 15/25 | Undocumented runtime behavior, regression risk across all commands |
| Research | 12/20 | Must empirically identify injection triggers |
| **Total** | **45/70** | **Level 2 - Multiple files, QA verification needed** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- What exact combination of frontmatter fields + content patterns triggers OpenCode's phantom dispatch injection?
- Are there other commands outside spec_kit that exhibit the same vulnerability?
- Does the order of sections within a command .md file affect runtime parsing priority?

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:approval-workflow -->
## 10. APPROVAL WORKFLOW

| Checkpoint | Description | Approver | Status | Date |
|-----------|-------------|----------|--------|------|
| CP-1 | Audit completion (all 7 files audited) | Developer | APPROVED | 2026-02-14 |
| CP-2 | Fix plan approval | Developer | APPROVED | 2026-02-14 |
| CP-3 | Implementation sign-off | Developer | PENDING | - |
| CP-4 | Verification complete | Developer | PENDING | - |

<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 11. COMPLIANCE CHECKPOINTS

- **Security**: Command files don't expose sensitive dispatch patterns
- **Code Quality**: All commands follow guardrail standard (input validation, error handling, scope limits)
- **Documentation**: All ADRs documented in decision-record.md

<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 12. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest Level | Communication Method |
|------------|------|---------------|---------------------|
| Developer | Primary user, uses commands daily | HIGH | Direct interaction |
| AI Agent | Executes commands via dispatch | HIGH | Via guardrails in command files |
| OpenCode Runtime | Renders and routes commands | MEDIUM | Via config files |

<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 13. CHANGE LOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| v0.1 | 2026-02-14 | Initial spec (Level 2) | AI Agent |
| v0.2 | 2026-02-14 | Upgraded to Level 3+ with ADRs and governance | AI Agent |

<!-- /ANCHOR:changelog -->

---

<!--
LEVEL 3+ SPEC - Upgraded from Level 2 with governance sections
Executive summary, risk matrix, approval workflow, compliance checkpoints, stakeholder matrix, change log added
Vulnerability patterns V1-V6 defined; all files in scope listed
-->
