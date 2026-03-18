---
title: "Feature Specification: Fix Create Command Dispatch Vulnerability + Defensive Hardening [008-fix-create-dispatch/spec]"
description: "OpenCode's Go runtime injects phantom dispatch instructions when it detects (1) @agent references in command file text AND (2) Task tool in the command's allowed-tools frontmatt..."
trigger_phrases:
  - "feature"
  - "specification"
  - "fix"
  - "create"
  - "command"
  - "spec"
  - "008"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Fix Create Command Dispatch Vulnerability + Defensive Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-14 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode's Go runtime injects phantom dispatch instructions when it detects (1) `@agent` references in command file text AND (2) `Task` tool in the command's `allowed-tools` frontmatter. This two-factor failure causes the AI to delegate work to sub-agents instead of executing the command workflow directly, breaking intended command behavior for `create/skill.md`.

### Purpose
Eliminate the active dispatch vulnerability in `create/skill.md` and defensively harden all 6 create command files against future regressions, continuing the pattern established in Spec 118 (`.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch`).

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 6 create command `.md` files in `.opencode/command/create/`
- 6 YAML workflow assets in `.opencode/command/create/assets/`
- CHANGELOG entry and release (v2.0.1.2)

### Out of Scope
- Memory commands (save.md, manage.md, context.md, continue.md, learn.md) - different command family, different risk profile
- agent_router.md - separate scope
- Style alignment - already compliant (emoji H2 headers present)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/skill.md` | Modify | Remove Task from allowed-tools (Fix D), add guardrail block (Fix A+B) |
| `.opencode/command/create/agent.md` | Modify | Add guardrail block (Fix A only, no YAML loading) |
| `.opencode/command/create/skill_reference.md` | Modify | Add guardrail block (Fix A+B) |
| `.opencode/command/create/skill_asset.md` | Modify | Add guardrail block (Fix A+B) |
| `.opencode/command/create/install_guide.md` | Modify | Add guardrail block (Fix A+B) |
| `.opencode/command/create/folder_readme.md` | Modify | Add guardrail block (Fix A+B) |
| `.opencode/command/create/assets/*.yaml` (x6) | Modify | Add REFERENCE ONLY comments (Fix E) |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove `Task` from skill.md allowed-tools | `Task` not present in frontmatter `allowed-tools` list |
| REQ-002 | Add imperative guardrail block to skill.md at line 7 | Guardrail block present after frontmatter, before command content |
| REQ-003 | Add imperative guardrail block to all 6 .md files | Each file has guardrail block at line 7 (after frontmatter) |
| REQ-004 | All changes committed and released | Tagged v2.0.1.2, pushed, GitHub release created |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Add REFERENCE ONLY comments to all 6 YAML assets | Each YAML file has `# REFERENCE ONLY` comment at top |
| REQ-006 | Investigate orphaned create_agent.yaml | Documented whether agent.md should load it or if it should be removed |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `create/skill.md` no longer triggers phantom dispatch (Task removed + guardrail present)
- **SC-002**: All 6 create commands have defensive guardrail blocks preventing future regressions
- **SC-003**: All 6 YAML assets marked as REFERENCE ONLY to prevent misinterpretation

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 118 pattern | Must follow same guardrail format | Reference Spec 118 implementation directly |
| Risk | Guardrail text may be ignored by model | Medium | Defense-in-depth: guardrail + Task removal together |
| Risk | Removing Task from skill.md may break functionality | Low | Verified: `/create:skill_reference` uses slash commands, not Task tool |

<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime impact - changes are to static command files only

### Security
- **NFR-S01**: Dispatch vulnerability eliminated for create/skill.md (active threat)
- **NFR-S02**: Defensive hardening prevents future two-factor vulnerability in remaining 5 commands

### Reliability
- **NFR-R01**: All create commands continue to function as designed after changes

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty guardrail block: Not applicable - guardrail text is static
- YAML asset loading: Verify commands that load YAML still function after REFERENCE ONLY comment added

### Error Scenarios
- Model ignores guardrail: Defense-in-depth via Task removal (skill.md) ensures root cause is eliminated regardless
- Fenced @write refs broken: Pre-verified - all refs already properly fenced

### State Transitions
- Not applicable - static file changes only

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 12 files across 2 directories, ~150-200 LOC changes |
| Risk | 15/25 | Security vulnerability fix, dispatch injection |
| Research | 5/20 | Vulnerability already analyzed, pattern proven in Spec 118 |
| **Total** | **30/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should orphaned `create_agent.yaml` be loaded by `agent.md` or removed entirely?

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
