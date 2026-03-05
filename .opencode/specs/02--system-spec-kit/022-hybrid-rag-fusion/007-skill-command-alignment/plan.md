---
title: "Implementation Plan: Skill & Command Alignment"
description: "Canonical+sync editing strategy across 4 speckit agent runtimes with retroactive Level 3 documentation."
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Skill & Command Alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (agent definitions) |
| **Framework** | system-spec-kit (templates, validation) |
| **Storage** | Filesystem (4 agent files, 6 spec files) |
| **Testing** | validate.sh, diff verification |

### Overview
This plan implements a canonical+sync editing strategy: edit `.opencode/agent/speckit.md` first (the canonical source), then propagate identical body content to the 3 runtime mirrors (ChatGPT, Claude, Gemini). Retroactive Level 3 documentation captures both the completed doc sprint and this alignment work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (diff check, grep verification, validate.sh)
- [x] Dependencies identified (Spec 140 doc sprint completed)

### Definition of Done
- [ ] All 4 agent files have identical Section 2 body content
- [ ] All 5 gaps resolved (GAP-1, GAP-2, GAP-4, GAP-5, GAP-7)
- [ ] Level 3 spec folder passes validate.sh
- [ ] Context saved via generate-context.js
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical + Sync: single source of truth with mirrored copies

### Key Components
- **Canonical file**: `.opencode/agent/speckit.md` (Copilot/OpenCode runtime)
- **Mirror files**: ChatGPT, Claude, Gemini variants (differ only in frontmatter and path convention line)
- **Spec folder**: `004-skill-command-alignment/` (Level 3 retroactive documentation)

### Data Flow
Edit canonical -> diff-verify -> propagate identical body content to 3 mirrors -> verify all 4 match
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Agent File Updates (Scope B)
- [x] Edit canonical `.opencode/agent/speckit.md` (L4 + L6 + notes)
- [x] Sync to `.opencode/agent/chatgpt/speckit.md`
- [x] Sync to `.claude/agents/speckit.md`
- [x] Sync to `.gemini/agents/speckit.md`

### Phase 2: Spec Folder Documentation (Scope A)
- [x] Create spec.md
- [x] Create plan.md (this file)
- [x] Create tasks.md
- [x] Create checklist.md
- [x] Create decision-record.md

### Phase 3: Verification & Completion
- [ ] Diff-verify all 4 agent files
- [ ] Create implementation-summary.md
- [ ] Run validate.sh
- [ ] Save context via generate-context.js
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Diff | Section 2 body content identical across 4 files | diff command |
| Grep | Missing tools present in all 4 files | grep for tool names |
| Line count | All files under 550 lines | wc -l |
| Validation | Spec folder completeness | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 140 doc sprint | Internal | Green (completed) | Cannot identify gaps |
| Level 3 templates | Internal | Green (available) | Cannot create spec files |
| validate.sh | Internal | Green (available) | Cannot verify |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Agent files break or have incorrect content
- **Procedure**: `git checkout -- .opencode/agent/speckit.md .opencode/agent/chatgpt/speckit.md .claude/agents/speckit.md .gemini/agents/speckit.md`
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Agent Edits) ──► Phase 3 (Verify)
                              ▲
Phase 2 (Spec Docs) ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Agent Edits) | None | Phase 3 |
| Phase 2 (Spec Docs) | None | Phase 3 |
| Phase 3 (Verify) | Phase 1, Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Agent File Updates | Low | 3 edits x 4 files |
| Spec Documentation | Med | 5 files from templates |
| Verification | Low | diff + validate.sh |
| **Total** | | **~30 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (git tracks all changes)
- [ ] N/A: No feature flags needed
- [ ] N/A: No monitoring needed

### Rollback Procedure
1. `git checkout -- <agent-files>` to revert all 4 files
2. Delete spec folder if needed: `rm -rf 004-skill-command-alignment/`
3. Verify files restored to pre-change state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐
│  Phase 1    │────►│  Phase 3    │
│  Agent Edits│     │  Verify     │
└─────────────┘     └─────────────┘
                          ▲
┌─────────────┐           │
│  Phase 2    │───────────┘
│  Spec Docs  │
└─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Agent Edits) | None | 4 updated agent files | Phase 3 |
| Phase 2 (Spec Docs) | None | 5 spec files | Phase 3 |
| Phase 3 (Verify) | Phase 1, Phase 2 | impl-summary + validation | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 + Phase 2** - Parallel execution - CRITICAL
2. **Phase 3** - Sequential after both complete - CRITICAL

**Total Critical Path**: max(Phase 1, Phase 2) + Phase 3

**Parallel Opportunities**:
- Phase 1 (agent edits) and Phase 2 (spec docs) run simultaneously
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Agent files updated | All 4 files edited and synced | Phase 1 |
| M2 | Spec docs created | 5 files from templates | Phase 2 |
| M3 | Verification complete | validate.sh pass, diff clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Canonical + Sync Strategy

**Status**: Accepted

**Context**: 4 speckit agent files across runtimes need identical Section 2 content updates

**Decision**: Edit `.opencode/agent/speckit.md` as canonical, then propagate to 3 mirrors

**Consequences**:
- Lower divergence risk than editing all 4 independently
- Single source of truth for body content
- Frontmatter and path convention line remain runtime-specific

**Alternatives Rejected**:
- Edit all 4 independently: Higher risk of content divergence

### ADR-002: Save-time Note Placement

**Status**: Accepted

**Context**: Agents need awareness of quality gate, reconsolidation, and verify-fix-verify behaviors

**Decision**: Brief blockquote notes after the MCP Tool Layers table in Section 2

**Consequences**:
- Keeps agents lean (~6 extra lines per file)
- Information is contextually adjacent to the MCP tool listing
- Cross-references SKILL.md for full details

**Alternatives Rejected**:
- Separate section: Too heavy for ~6 lines of content
- Inline in table cells: Table cells would become unwieldy

## AI Execution Protocol

### Pre-Task Checklist
- Confirm scope lock for this phase folder before edits.
- Confirm validator command and target path.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute fixes in warning-category order and re-validate after each pass. |
| TASK-SCOPE | Do not modify files outside this phase folder unless explicitly required by parent-link checks. |

### Status Reporting Format
Status Reporting Format: `DONE | IN_PROGRESS | BLOCKED` with file path and validator evidence per update.

### Blocked Task Protocol
If BLOCKED, record blocker, attempted remediation, and next safe action before proceeding.
