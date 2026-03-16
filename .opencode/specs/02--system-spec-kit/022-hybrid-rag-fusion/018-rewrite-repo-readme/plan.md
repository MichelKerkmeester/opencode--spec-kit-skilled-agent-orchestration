---
title: "Plan: Rewrite Repo README"
description: "Implementation plan for a complete rewrite of the repository root README."
---
<!-- SPECKIT_LEVEL: 1 -->
# Plan: 018-rewrite-repo-readme

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Document type** | README.md (Markdown) |
| **Template** | `readme_template.md` from sk-doc |
| **Quality standard** | DQI >= 75, HVR compliant |
| **Source of truth** | Agent defs + skill directory + CLAUDE.md + command directory |

### Overview

Complete rewrite of the root README as the top-level entry point to the OpenCode system. Research inventories all agents, skills, commands, and configuration. Drafting follows the readme template with role-based navigation paths. Review validates DQI, HVR, and cross-reference consistency with D1 and D3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (agent defs, skill dir, CLAUDE.md)

### Definition of Done
- [ ] All 16 skills and 11 agents listed
- [ ] DQI >= 75 verified
- [ ] No banned HVR words
- [ ] Role-based navigation paths work
- [ ] Cross-references to D1 and D3 verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation rewrite — top-level overview linking to component documentation.

### Key Components
- **Agent definitions**: 11 agents across `.claude/agents/` and `.opencode/agent/`
- **Skill directory**: 16 skills in `.opencode/skill/`
- **Command directory**: Commands in `.opencode/command/`
- **CLAUDE.md**: Gate system, configuration, operational mandates
- **Component READMEs**: MCP README (D1), Spec Kit README (D3)

### Data Flow
```
agent defs + skill dir + CLAUDE.md + commands → research brief → draft → review → final README.md
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research
- [ ] Enumerate all 11 agents with roles and capabilities
- [ ] Enumerate all 16 skills with descriptions
- [ ] Extract gate system summary from CLAUDE.md
- [ ] Inventory command architecture
- [ ] Catalog code mode MCP configuration
- [ ] Write research brief to `scratch/research-brief.md`

### Phase 2: Draft
- [ ] Write Overview (what OpenCode is, key numbers)
- [ ] Write Quick Start (first steps for new users)
- [ ] Write Spec Kit Documentation section (summary, link to D3)
- [ ] Write Memory Engine section (summary, link to D1)
- [ ] Write Agent Network section (all 11 agents)
- [ ] Write Command Architecture section
- [ ] Write Skills Library section (all 16 skills)
- [ ] Write Gate System section
- [ ] Write Code Mode MCP section
- [ ] Write Configuration, Usage Examples, Troubleshooting, FAQ
- [ ] Write Related Documents with links to D1 and D3

### Phase 3: Review
- [ ] DQI scoring
- [ ] HVR compliance check
- [ ] Cross-reference validation (D1, D3, SKILL.md)
- [ ] Role-based navigation test (newcomer, developer, admin paths)
- [ ] No-duplication check against D1 and D3

### Phase 4: Assembly
- [ ] Apply review fixes
- [ ] Final DQI check
- [ ] Replace current README
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Quality | DQI score >= 75 | `validate_document.py` |
| Compliance | No banned HVR words | grep / sk-doc rules |
| Accuracy | All 16 skills, 11 agents | Compare against live directories |
| Structure | Section headers match template | Manual comparison |
| Links | Cross-references resolve | Path existence check |
| Dedup | No content duplicated from D1/D3 | Manual review |
| Navigation | Role-based paths work | Manual walkthrough |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP README rewrite (D1) | Internal | In Progress | Must coordinate cross-references |
| Spec Kit README rewrite (D3) | Internal | In Progress | Must coordinate cross-references |
| Agent definitions | Internal | Green | Agent inventory |
| Skill directory | Internal | Green | Skill inventory |
| CLAUDE.md | Internal | Green | Gate system source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: DQI < 75 after two review cycles
- **Procedure**: Restore from `README.md.bak`
<!-- /ANCHOR:rollback -->

---

<!--
PLAN: 018-rewrite-repo-readme
In Progress (2026-03-15)
4-phase: Research → Draft → Review → Assembly
-->
