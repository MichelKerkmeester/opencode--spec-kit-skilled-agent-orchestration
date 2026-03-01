---
title: "Feature Specification: AI Auto-Populate on Spec Upgrade [128-upgrade-auto-populate/spec]"
description: "When upgrade-level.sh upgrades a spec folder (e.g., L1 → L3+), it injects template scaffolding with placeholder text like [Response time target], [Low/Med/High], [Component A]. ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "auto"
  - "populate"
  - "spec"
  - "128"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->

# Feature Specification: AI Auto-Populate on Spec Upgrade

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

When `upgrade-level.sh` upgrades a spec folder (e.g., L1 → L3+), it injects template scaffolding with placeholder text like `[Response time target]`, `[Low/Med/High]`, `[Component A]`. These placeholders provide no value until manually filled in. This spec defines a post-upgrade AI workflow step where the agent reads existing spec folder context and auto-populates all injected scaffolding with accurate, derived content.

**Key Decisions**: AI-side workflow (not script modification), integrated as post-upgrade step in SpecKit workflows

**Critical Dependencies**: Existing spec folder must contain at least `spec.md` with substantive content for context extraction

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Number** | 128 |
| **Parent** | 02--system-spec-kit |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-16 |
| **Triggered By** | Spec 127 upgrade revealed all injected sections were empty placeholders |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `upgrade-level.sh` script injects template sections when upgrading spec levels, but all injected content is generic placeholder text. After upgrading spec 127 from L1 → L3+, the result was:

- `spec.md`: L2 NFR/Edge Cases/Complexity sections all `[placeholder]`
- `plan.md`: L2 Phase Dependencies/Effort, L3 Dependency Graph/Critical Path/Milestones/ADR, L3+ AI Execution/Workstreams/Communication all `[placeholder]`
- `checklist.md`: Created with entirely unchecked generic items
- `decision-record.md`: Created as empty template (had to be manually populated)

The upgrade script is a shell script — it cannot reason about content. But the AI agent invoking the upgrade CAN. The agent has full context of the spec folder (spec.md, plan.md, tasks.md, implementation-summary.md) and should use that context to populate the scaffolding.

### Purpose

After the upgrade script runs, the AI agent should read the injected placeholder sections and replace them with content derived from the existing spec folder documents, producing a complete and useful upgraded spec folder rather than one full of `[placeholder]` text.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Post-upgrade AI pass that fills placeholder content in all modified/created files
- Context extraction from existing spec documents (spec.md, plan.md, tasks.md, implementation-summary.md)
- Populating L2 sections: NFRs, Edge Cases, Complexity Assessment, Phase Dependencies, Effort Estimation, Enhanced Rollback
- Populating L3 sections: Dependency Graph, Critical Path, Milestones, ADR
- Populating L3+ sections: AI Execution Framework, Workstream Coordination, Communication Plan
- Populating checklist.md with spec-relevant items
- Populating decision-record.md with actual decisions from the spec work

### Out of Scope

- Modifying `upgrade-level.sh` itself (shell script stays as-is, does structural scaffolding only)
- Auto-populating during `spec_kit:complete` or `spec_kit:plan` workflows (separate concern)
- Generating content when no existing context is available (new empty spec folders)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| SpecKit workflow instructions | Modify | Add post-upgrade auto-populate step to workflow documentation |
| `upgrade-level.sh` documentation | Modify | Document that AI should populate after script runs |
| `/spec_kit:complete` skill | Modify | Integrate auto-populate as post-upgrade step |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-001 | AI reads all existing spec files after upgrade completes | Agent reads spec.md, plan.md, tasks.md, implementation-summary.md |
| R-002 | All `[placeholder]` patterns replaced with contextual content | Grep for `\[.*\]` placeholder patterns returns 0 in upgraded files |
| R-003 | Original user-written content preserved unchanged | Diff shows only placeholder sections modified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-004 | Complexity Assessment scores derived from actual spec scope | Scores reflect real file count, LOC, risk factors |
| R-005 | Phase Dependencies reflect actual plan phases | Dependency table matches plan.md phase structure |
| R-006 | Checklist items relevant to the specific spec | Generic items replaced or supplemented with spec-specific checks |
| R-007 | Decision-record.md populated with actual decisions (if any exist) | ADRs reference real decisions from implementation-summary or plan |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After upgrade, zero `[placeholder]` patterns remain in any spec file
- **SC-002**: Populated content is factually accurate to the spec's actual scope and implementation
- **SC-003**: The upgrade + populate flow completes without user intervention
- **SC-004**: Works for all upgrade paths (L1->L2, L1->L3, L1->L3+, L2->L3, L2->L3+, L3->L3+)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing spec content must be substantive | Cannot derive context from empty specs | Skip auto-populate for new/empty spec folders |
| Dependency | `upgrade-level.sh` must run first | Scaffolding needed before population | Enforce ordering in workflow documentation |
| Risk | AI may generate inaccurate content | Misleading spec documentation | Require human review of populated content |
| Risk | L2->L3 upgrade skipped due to EXECUTIVE SUMMARY false positive | Missing L3 sections in upgraded spec | Separate fix needed for idempotency check bug |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Auto-populate completes within 60 seconds for a single spec folder upgrade
- **NFR-P02**: Context extraction handles spec folders with up to 10 documents

### Security
- **NFR-S01**: No external API calls during populate (all content derived from local files)
- **NFR-S02**: Original user content must never be overwritten or corrupted

### Reliability
- **NFR-R01**: Populate step is idempotent (running twice produces same result)
- **NFR-R02**: Failure during populate does not corrupt the upgrade script's scaffolding

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty spec folder (only spec.md with minimal content): Populate what can be derived, leave explicit "N/A" for sections without source context
- Maximum file count: Spec folders with 10+ documents should still complete within timeout
- Spec with no plan.md: Skip plan-dependent sections (Phase Dependencies, Dependency Graph)

### Error Scenarios
- Upgrade script failure mid-chain: Do not attempt populate on partially upgraded folders
- Template injection produces malformed markdown: Detect and report rather than corrupt further
- Concurrent upgrade of same folder: Not supported; shell script already prevents via atomic writes

### State Transitions
- Partial populate (interrupted mid-edit): Re-running populate should detect already-filled sections and skip them
- Spec folder already at target level: upgrade-level.sh rejects this; populate never triggered

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: ~3 workflow docs, LOC: ~200 instructions, Systems: 1 (SpecKit) |
| Risk | 10/25 | Auth: N, API: N, Breaking: N, Content accuracy risk: Y |
| Research | 12/20 | Needs analysis of all template structures and upgrade paths |
| Multi-Agent | 8/15 | Workstreams: 1 (single-agent populate workflow) |
| Coordination | 5/15 | Dependencies: 1 (upgrade-level.sh must run first) |
| **Total** | **50/100** | **Level 3+** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | AI generates inaccurate complexity scores | Medium | Medium | Derive scores from concrete metrics (file count, LOC) |
| R-002 | Original user content corrupted during populate | High | Low | Edit tool targets only placeholder patterns, preserves surrounding content |
| R-003 | EXECUTIVE SUMMARY false positive blocks L2->L3 upgrade | High | Confirmed | Separate bug fix for idempotency check in upgrade-level.sh |
| R-004 | Populated content becomes stale as spec evolves | Low | High | Document that populate is a one-time post-upgrade step |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Seamless Spec Upgrade (Priority: P0)

**As a** developer using SpecKit, **I want** spec upgrades to produce fully populated documents, **so that** I don't spend time manually filling in placeholder text.

**Acceptance Criteria**:
1. Given a spec folder at L1, When I upgrade to L3+, Then all injected sections contain context-aware content
2. Given an upgraded spec, When I grep for `[placeholder]` patterns, Then zero results are returned

### US-002: Accurate Content Derivation (Priority: P1)

**As a** spec author, **I want** the auto-populated content to accurately reflect my spec's scope, **so that** the upgraded documentation is immediately useful.

**Acceptance Criteria**:
1. Given a spec with 3 requirements and 2 phases, When auto-populate runs, Then complexity scores and phase dependencies reflect those exact numbers

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Michel Kerkmeester | Pending | - |
| Design Review | Michel Kerkmeester | Pending | - |
| Implementation Review | Michel Kerkmeester | Pending | - |
| Launch Approval | Michel Kerkmeester | Pending | - |

<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [ ] No external data exfiltration during populate
- [ ] Original content integrity verified post-populate
- [ ] File permissions preserved during Edit operations

### Code Compliance
- [ ] Workflow instructions follow SpecKit template standards
- [ ] MIT license compliance maintained

<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Michel Kerkmeester | Product Owner / Developer | High | Direct (spec author) |
| AI Agent (Claude) | Implementation Agent | High | Via SpecKit workflow |

<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-16)
**Initial specification** - L1 spec created defining the auto-populate workflow problem and requirements.

### v1.1 (2026-02-16)
**Upgraded to L3+** - Full L3+ upgrade with all sections auto-populated from spec context.

### v1.2 (2026-02-16)
**Implementation complete** - All deliverables integrated: `check-placeholders.sh` script created, `/spec_kit:complete` Step 10 scope-growth guidance added, SKILL.md expanded, documentation aligned. Phase 4 verification passed (all P0/P1 checklist items verified). Status: Complete.

<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Should auto-populate be integrated into `/spec_kit:complete` or kept as a separate post-upgrade step?
- How should the populate step handle sections where no source context exists (leave placeholder vs. write "N/A")?
- Should the EXECUTIVE SUMMARY false positive bug (L2->L3 skip) be fixed as part of this spec or tracked separately?

<!-- /ANCHOR:questions -->

---

## 17. RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Triggered by**: Spec 127 (`127-spec126-documentation-alignment`) — upgrade produced all-placeholder files
- **Upgrade script**: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`
- **Templates**: `.opencode/skill/system-spec-kit/templates/addendum/`
- **Script bug found**: `EXECUTIVE SUMMARY` false positive skips L2->L3 spec.md injection (separate fix needed)

---

<!--
LEVEL 3+ SPEC (~200 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->
