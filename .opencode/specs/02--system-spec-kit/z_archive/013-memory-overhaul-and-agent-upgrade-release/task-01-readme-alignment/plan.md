---
title: "Implementation Plan: Task 01 — README Audit & Alignment [task-01-readme-alignment/plan]"
description: "Audit 60+ README.md files in .opencode/ directory tree for stale source counts (4→5), stale intent counts (5→7), outdated schema versions, missing feature references (upgrade-le..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "task"
  - "readme"
  - "audit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Task 01 — README Audit & Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | SpecKit documentation system |
| **Storage** | File-based (git) |
| **Testing** | Manual verification, grep checks |

### Overview
Audit 60+ README.md files in `.opencode/` directory tree for stale source counts (4→5), stale intent counts (5→7), outdated schema versions, missing feature references (upgrade-level.sh, check-placeholders.sh, auto-populate workflow), missing anchor tags, and HVR violations. Produce `changes.md` documenting every required edit with before/after text.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All source specs 014-016, 122-129 implemented
- [x] Parent spec 130 provides context and file lists
- [x] Audit criteria defined in task spec.md

### Definition of Done
- [ ] All 60+ README files audited
- [ ] changes.md populated with complete edit list
- [ ] No placeholder text in changes.md
- [ ] All P0 items complete, P1 items complete or user-approved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual audit with systematic file-by-file review

### Key Components
- **High-Priority READMEs (P0)**: `.opencode/README.md`, `system-spec-kit/README.md`, `mcp_server/README.md`
- **Medium-Priority READMEs (P1)**: 55 sub-directory READMEs across system-spec-kit
- **Low-Priority READMEs (P2)**: HVR + anchor compliance check

### Data Flow
1. Read each README file
2. Check against audit criteria from spec.md
3. Document required changes in changes.md
4. Mark priority (P0/P1/P2) for each change
5. Provide before/after text for implementer
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: High-Priority READMEs (P0)
- [ ] Audit `.opencode/README.md` statistics table
- [ ] Audit `.opencode/skill/system-spec-kit/README.md` for 5 sources, 7 intents, schema v13
- [ ] Audit `.opencode/skill/system-spec-kit/mcp_server/README.md` for same + includeSpecDocs

### Phase 2: Medium-Priority READMEs (P1)
- [ ] Audit 17 mcp_server/lib/ READMEs
- [ ] Audit 16 scripts/ READMEs
- [ ] Audit 10 templates/ READMEs
- [ ] Audit 4 shared/ READMEs
- [ ] Audit 6 workflow skill READMEs
- [ ] Audit 2 MCP skill READMEs
- [ ] Audit `.opencode/skill/README.md` and `.opencode/install_guides/README.md`

### Phase 3: Low-Priority Compliance (P2)
- [ ] Check 60+ READMEs for anchor tag pairs
- [ ] Check for HVR violations
- [ ] Check for YAML frontmatter

### Phase 4: Documentation
- [ ] Populate changes.md with all findings
- [ ] Verify no placeholder text remains
- [ ] Add before/after text for each change
- [ ] Mark priority for each change
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each README against audit criteria | Read tool, manual review |
| Coverage | All 60+ READMEs checked | Glob + checklist |
| Format | changes.md structured correctly | Template verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Specs 014-016 implemented | Internal | Complete | Cannot audit unimplemented features |
| Specs 122-129 implemented | Internal | Complete | Cannot verify schema v13 or 5-source pipeline |
| Parent spec 130 | Internal | Complete | Provides context and file lists |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Audit incomplete or changes.md validation fails
- **Procedure**: Re-audit failed READMEs, update changes.md, re-validate
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (P0) ──────► Phase 2 (P1) ──────► Phase 3 (P2)
                                               │
                                               ▼
                                          Phase 4 (Documentation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| P0 READMEs | None | P1 READMEs |
| P1 READMEs | P0 complete | P2 Compliance |
| P2 Compliance | P1 complete | Documentation |
| Documentation | P2 complete | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| P0 READMEs (3 files) | Medium | 1-2 hours |
| P1 READMEs (55 files) | High | 3-4 hours |
| P2 Compliance (60+ files) | Medium | 1-2 hours |
| Documentation | Low | 30 minutes |
| **Total** | | **5.5-8.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Audit criteria understood from spec.md
- [ ] changes.md template ready
- [ ] Checklist.md available for tracking

### Rollback Procedure
1. Identify incomplete or incorrect audit findings
2. Re-audit affected READMEs
3. Update changes.md with corrected findings
4. Re-validate against checklist.md

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (audit only, no file changes)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Phase 1     │────►│   Phase 2     │────►│   Phase 3     │
│  P0 READMEs   │     │  P1 READMEs   │     │ P2 Compliance │
│   (3 files)   │     │  (55 files)   │     │  (60+ files)  │
└───────────────┘     └───────────────┘     └───────┬───────┘
                                                     │
                                              ┌──────▼──────┐
                                              │   Phase 4   │
                                              │ Documentation│
                                              │  changes.md  │
                                              └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| P0 READMEs | None | P0 audit findings | P1 READMEs |
| P1 READMEs | P0 complete | P1 audit findings | P2 Compliance |
| P2 Compliance | P1 complete | P2 audit findings | Documentation |
| Documentation | P2 complete | changes.md | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (P0 READMEs)** - 1-2 hours - CRITICAL
2. **Phase 2 (P1 READMEs)** - 3-4 hours - CRITICAL
3. **Phase 3 (P2 Compliance)** - 1-2 hours - NOT CRITICAL (P2 can defer)
4. **Phase 4 (Documentation)** - 30 minutes - CRITICAL

**Total Critical Path**: 4.5-6.5 hours (excluding P2)

**Parallel Opportunities**:
- None (audit must be systematic file-by-file)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | P0 Complete | 3 high-priority READMEs audited | Phase 1 |
| M2 | P1 Complete | 55 medium-priority READMEs audited | Phase 2 |
| M3 | P2 Complete | 60+ low-priority READMEs checked | Phase 3 |
| M4 | Documentation | changes.md complete | Phase 4 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: P0 READMEs (3 files)
**Duration**: ~90 minutes
**Agent**: Primary

### Tier 2: Batch Execution
**Files**: P1 READMEs (55 files, batch by directory)
**Duration**: ~3-4 hours
**Agent**: Primary (systematic file-by-file)

### Tier 3: Compliance Check
**Files**: P2 READMEs (60+ files, grep-based checks)
**Duration**: ~1-2 hours
**Agent**: Primary

### Tier 4: Integration
**Agent**: Primary
**Task**: Consolidate findings into changes.md
**Duration**: ~30 minutes
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-P0 | P0 READMEs | Primary | 3 high-priority files | Active |
| W-P1 | P1 READMEs | Primary | 55 medium-priority files | Blocked on W-P0 |
| W-P2 | P2 Compliance | Primary | 60+ low-priority files | Blocked on W-P1 |
| W-DOC | Documentation | Primary | changes.md | Blocked on W-P2 |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-P0 complete | Primary | Begin W-P1 |
| SYNC-002 | W-P1 complete | Primary | Begin W-P2 |
| SYNC-003 | W-P2 complete | Primary | Begin W-DOC |
| SYNC-004 | W-DOC complete | Primary | Claim completion |

### File Ownership Rules
- Each README owned by its audit phase (P0/P1/P2)
- changes.md owned by W-DOC
- No cross-workstream conflicts (separate files)
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Update checklist.md completion status
- **Per Priority Tier**: Verify findings accuracy before next tier
- **Blockers**: Escalate if audit criteria unclear from spec.md

### Escalation Path
1. Unclear audit criteria → Review spec.md and source spec changelogs
2. Too many findings → Consider batching in changes.md by directory
3. P2 taking too long → Defer with documented reason (P2 optional)
<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN for Task 01
Systematic README audit across 60+ files
4 phases: P0 → P1 → P2 → Documentation
-->
