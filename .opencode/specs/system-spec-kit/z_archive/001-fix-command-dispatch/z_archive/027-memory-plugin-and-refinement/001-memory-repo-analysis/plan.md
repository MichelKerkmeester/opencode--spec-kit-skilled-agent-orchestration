---
title: "...spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/001-memory-repo-analysis/plan]"
description: "Research plan defining the analysis approach, deliverables, and execution strategy for comparing system-memory with roampal-core."
trigger_phrases:
  - "implementation"
  - "plan"
  - "roampal"
  - "analysis"
  - "technical"
  - "001"
  - "memory"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Roampal Analysis - Technical Approach & Architecture

Research plan defining the analysis approach, deliverables, and execution strategy for comparing system-memory with roampal-core.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Research Plan
- **Tags**: memory-system, roampal, architecture-analysis, semantic-search
- **Priority**: P1-high - core improvement research
- **Branch**: N/A (research task, no code changes)
- **Date**: 2025-12-17
- **Spec**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/015-roampal-analysis/spec.md`

### Input
Feature specification from `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/015-roampal-analysis/spec.md`

### Summary
Conduct comprehensive comparative analysis between our system-memory skill (v11.2.0) and roampal-core to identify improvement opportunities. The research will analyze both architectures, identify capability gaps, and produce prioritized recommendations for future implementation. This is a research-only effort with no code changes.

### Technical Context

- **Language/Version**: N/A (research/documentation task)
- **Primary Dependencies**: system-memory skill, roampal-core repository analysis
- **Storage**: N/A - analysis of existing SQLite (our system) vs ChromaDB (roampal)
- **Testing**: Manual validation of analysis completeness
- **Target Platform**: Documentation artifacts
- **Project Type**: Research analysis (document-only output)
- **Performance Goals**: N/A (not performance-critical)
- **Constraints**: Time-boxed research, no implementation scope creep
- **Scale/Scope**: 2 systems, ~30 features to compare, 4-5 deliverable documents

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Stakeholders identified; decisions path agreed
- [x] Constraints known; risks captured
- [x] Success criteria measurable

### Definition of Done (DoD)
- [ ] All acceptance criteria met; documents complete
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record)
- [ ] All analysis findings documented with citations
- [ ] Recommendations validated for feasibility

### Rollback Guardrails
- **Stop Signals**: Research scope expanding into implementation, diminishing returns on analysis depth
- **Recovery Procedure**: Checkpoint current findings, reassess scope, document partial results

### Constitution Check (Complexity Tracking)

No complexity violations - this is a documentation/research effort with no code artifacts.

<!-- /ANCHOR:quality-gates -->
---

## 3. PROJECT STRUCTURE

### Documentation (This Feature)

```
.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/015-roampal-analysis/
  spec.md              # Feature specification (complete)
  plan.md              # This file (research plan)
  checklist.md         # Validation checklist (to be created)
  decision-record.md   # Key decisions from analysis (Level 3 required)
  scratch/             # Drafts, notes, temporary analysis files
  memory/              # Session context preservation
```

### Source Code (Repository Root)

N/A - This is a research task producing documentation only. No source code changes.

### Structure Decision

Research-only structure selected. All deliverables are documentation artifacts within the spec folder. No source code modifications required.

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Our System Analysis (system-memory v11.2.0)
**Duration: 2-3 hours**

- **Goal**: Document comprehensive understanding of our current memory architecture
- **Deliverables**:
  - Architecture overview document
  - MCP tool inventory (14 tools with purposes)
  - Six-tier importance system documentation
  - Hybrid search mechanism (Vector + FTS5 + RRF) analysis
  - Decay/promotion mechanics documentation
  - Checkpoint system analysis
- **Owner**: AI Agent
- **Parallel Tasks**: 
  - [P] Tool inventory documentation
  - [P] Tier system documentation
  - [P] Search mechanism analysis

**Key Analysis Points:**
| Component | Our Implementation | Notes |
|-----------|-------------------|-------|
| Tools | 14 MCP tools | memory_search, memory_load, memory_save, etc. |
| Importance | 6 tiers | constitutional→critical→important→normal→temporary→deprecated |
| Boosts | 3.0x/2.0x/1.5x/1.0x/0.5x/excluded | Per tier |
| Decay | 90-day half-life | Normal tier only, constitutional never decays |
| Promotion | Confidence-based | 90% after 5 validations → critical |
| Storage | SQLite + sqlite-vec | Single-file, local vectors |
| Search | Hybrid (Vector + FTS5 + RRF fusion) | Multi-signal ranking |
| Checkpoints | Full state backup/restore | 4 checkpoint tools |
| Trigger | Manual (keywords/commands) | User-initiated |

### Phase 1: Roampal-Core Analysis
**Duration: 3-4 hours**

- **Goal**: Document roampal-core's innovative features and architecture patterns
- **Deliverables**:
  - Hook-based context injection analysis (UserPromptSubmit)
  - Outcome-based learning documentation (score_response system)
  - Collection architecture (5 collections vs our single DB)
  - Promotion flow analysis (working→history→patterns)
  - Wilson score ranking mechanics
  - Knowledge Graph structure and routing patterns
  - Soft enforcement via prompt injection
- **Owner**: AI Agent
- **Parallel Tasks**:
  - [P] Hook system analysis
  - [P] Scoring system analysis
  - [P] Collection architecture analysis

**Key Analysis Points:**
| Component | Roampal Implementation | Notes |
|-----------|----------------------|-------|
| Collections | 5 types | memory_bank, patterns, history, working, books |
| Scoring | score_response() | worked/failed/partial/unknown |
| Promotion | Automatic | working→history→patterns based on scores |
| Ranking | Wilson score | Statistical confidence ranking |
| Knowledge Graphs | 3 graphs | routing_patterns, success_rates, failure_patterns |
| Trigger | Automatic (hooks) | UserPromptSubmit injects context |
| Enforcement | Soft (prompt injection) | Non-blocking guidance |
| Storage | ChromaDB | Cloud-native vector DB |

### Phase 2: Gap Analysis
**Duration: 2-3 hours**

- **Goal**: Identify specific capability gaps and improvement opportunities
- **Deliverables**:
  - Feature-by-feature comparison matrix
  - Gap identification with impact assessment
  - Technical feasibility evaluation per gap
  - Effort estimation (T-shirt sizing: S/M/L/XL)
- **Owner**: AI Agent
- **Parallel Tasks**: None (depends on Phase 0 and 1 completion)

**Comparison Framework:**
| Dimension | Our System | Roampal | Gap? | Priority |
|-----------|------------|---------|------|----------|
| Context Injection | Manual trigger | Automatic hooks | Yes | High |
| Learning | Validation-based | Outcome-based | Yes | High |
| Collections | Single DB | 5 specialized | Partial | Medium |
| Promotion | Confidence threshold | Score-based auto | Yes | Medium |
| Knowledge Graphs | None | Full routing | Yes | Medium |
| Enforcement | Hard (gates) | Soft (injection) | Design choice | Low |
| Vector Storage | sqlite-vec | ChromaDB | Trade-off | Low |
| Ranking | RRF fusion | Wilson score | Partial | Medium |

### Phase 3: Recommendations Document
**Duration: 2-3 hours**

- **Goal**: Produce prioritized, actionable recommendations for system improvements
- **Deliverables**:
  - High-priority recommendations (implement soon)
  - Medium-priority recommendations (plan for future)
  - Low-priority/deferred recommendations
  - Implementation approach for each recommendation
  - Dependencies and prerequisites mapping
  - Risk assessment matrix
  - Decision record (Level 3 requirement)
- **Owner**: AI Agent
- **Parallel Tasks**:
  - [P] High-priority recommendation details
  - [P] Medium-priority recommendation details
  - [P] Decision record drafting

**Recommendation Categories:**

**HIGH PRIORITY (Implement Soon)**
1. Outcome-Based Learning - Add score_response() capability
2. Automatic Context Injection - Hook integration research
3. Wilson Score Ranking - Enhanced ranking algorithm

**MEDIUM PRIORITY (Plan for Future)**
4. Knowledge Graphs - Routing pattern system
5. Collection Specialization - Dedicated memory types
6. Automatic Promotion Flow - Score-triggered promotion

**LOW PRIORITY (Consider Later)**
7. Soft Enforcement Mode - Optional prompt injection
8. ChromaDB Migration - Alternative vector storage
9. Working Memory - Ephemeral session context

<!-- /ANCHOR:phases -->
---

## 4A. OPENCODE HOOK ANALYSIS FINDINGS

### Analysis Completed: 2025-12-17

**Key Discovery**: OpenCode provides partial hook support - sufficient for a hybrid approach but not direct roampal-style hooks.

### OpenCode Capabilities Confirmed

| Capability | Available | Notes |
|------------|-----------|-------|
| `session.created` event | ✅ Yes | Plugin can inject context at session start |
| `session.idle` event | ✅ Yes | Can record exchanges during idle periods |
| `tool.execute.before/after` | ✅ Yes | Can intercept tool calls |
| `session.prompt()` with `noReply:true` | ✅ Yes | Can inject messages without expecting response |
| `session.prompt.before` (message interception) | ❌ No | Cannot intercept user messages before AI sees them |

### Hybrid 3-Layer Strategy

Since direct per-message hooks aren't available, we designed a hybrid approach:

**Layer 1: Session Start Injection (Plugin)**
- Trigger: `session.created` event
- Action: Inject constitutional memories + user profile (~500 tokens)
- Implementation: `.opencode/plugin/memory-context.js`

**Layer 2: Mandatory Trigger Matching (AGENTS.md)**
- Trigger: Every user message (soft enforcement via agent instructions)
- Action: AI calls `memory_match_triggers()` as first action
- Implementation: Update AGENTS.md Gate 3 / Phase 2

**Layer 3: Exchange Recording (Plugin)**
- Trigger: `session.idle` event
- Action: Record significant exchanges to working memory
- Implementation: `.opencode/plugin/memory-context.js`

### Revised Implementation Approach

The original plan to "defer hooks" (ADR-002) is now updated to "implement hybrid approach" since OpenCode provides sufficient building blocks for ~70% of roampal's automatic context injection value.

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Validation Approach

For research tasks, testing is replaced by validation checkpoints:

```
        /\
       /REV\      <- Final stakeholder review
      /------\
     / SELF   \   <- Self-review for completeness
    /----------\
   / CHECKLIST  \  <- Checklist verification (foundation)
  /--------------\
```

### Checklist Verification
- **Scope**: All Phase deliverables
- **Tools**: Manual checklist.md review
- **Coverage Target**: 100% of acceptance criteria
- **Execution**: After each phase completion

### Self-Review
- **Scope**: Document quality, citation accuracy
- **Tools**: Manual review against spec requirements
- **Coverage Target**: All documents
- **Execution**: Before final delivery

### Final Review
- **Scope**: Complete research package
- **Tools**: Stakeholder walkthrough
- **Coverage Target**: All recommendations validated
- **Execution**: Post-Phase 3 completion

### CI Quality Gates

- [ ] All checklist items marked complete
- [ ] All acceptance criteria met
- [ ] All recommendations have feasibility assessments
- [ ] Decision record created (Level 3 requirement)
- [ ] No unresolved questions/blockers

<!-- /ANCHOR:testing -->
---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Feature coverage | 100% major features | Checklist verification |
| Gap identification | All significant gaps found | Cross-reference with both systems |
| Recommendation actionability | 100% have guidance | Review each recommendation |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Documentation completeness | All Level 3 artifacts | File existence + content check |
| Citation accuracy | All claims have sources | Manual verification |
| Feasibility validation | All recommendations assessed | Risk matrix review |

### Research Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Analysis depth | Comprehensive | Expert review |
| Comparison fairness | Balanced assessment | Both strengths/weaknesses noted |
| Practical applicability | Implementable recommendations | Technical feasibility scores |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Incomplete roampal documentation | Medium | Low | Analyze source code directly, use public repo | AI Agent |
| R-002 | Recommendations not feasible within SQLite architecture | High | Medium | Include feasibility assessment for each recommendation | AI Agent |
| R-003 | Scope creep into implementation | Medium | Medium | Strict research-only scope, document for future implementation | AI Agent |
| R-004 | Analysis bias toward either system | Medium | Low | Document both strengths and weaknesses objectively | AI Agent |
| R-005 | Missing critical roampal features | Medium | Medium | Systematic feature enumeration, multiple source review | AI Agent |

### Rollback Plan

- **Rollback Trigger**: Research taking >2x estimated time, blockers preventing progress
- **Rollback Procedure**:
  1. Document current findings in scratch/
  2. Create partial recommendations document
  3. Note incomplete areas for future research
- **Data Migration Reversal**: N/A (no data changes)
- **Verification**: Confirm all partial findings are preserved

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Timeline | Impact if Blocked |
|------------|------|-------|--------|----------|-------------------|
| system-memory skill source | Internal | Project | Green | Available | Critical - cannot analyze our system |
| SKILL.md documentation | Internal | Project | Green | Available | Medium - delays our analysis |
| Memory MCP server | Internal | Project | Green | Available | Low - can analyze code directly |

### External Dependencies

| Dependency | Type | Vendor | Status | Timeline | Impact if Blocked |
|------------|------|--------|--------|----------|-------------------|
| roampal-core repository | External | roampal-ai | Green | Public | Critical - cannot analyze competitor |
| roampal documentation | External | roampal-ai | Yellow | Limited | Medium - rely on code analysis |

### Resource Requirements

| Resource | Type | Purpose | Availability |
|----------|------|---------|--------------|
| AI Agent context | Compute | Analysis and documentation | Available |
| Source code access | Data | System-memory skill files | Available |
| GitHub access | Network | Roampal-core repository | Available |
| Spec folder | Storage | Document deliverables | Available |

<!-- /ANCHOR:dependencies -->
---

## 9. COMMUNICATION & REVIEW

### Stakeholders

- **Product**: AI Agent Framework maintainers
- **Engineering**: Memory system developers
- **Design**: N/A (no UI components)
- **QA**: Self-validated through checklists
- **Operations**: N/A (research task)

### Checkpoints

- **Phase 0 Complete**: Our system fully documented
- **Phase 1 Complete**: Roampal analysis complete
- **Phase 2 Complete**: Gap analysis with prioritization
- **Phase 3 Complete**: Recommendations finalized, decision record created

### Approvals

- **Technical Design**: Self-approved (research task)
- **Security Review**: N/A (no code changes)
- **Product Sign-off**: Stakeholder review of recommendations
- **Launch Approval**: N/A (documentation only)

---

<!-- ANCHOR:summary -->
## 10. TIMELINE SUMMARY

```
Phase 0: Our System Analysis        [██████████] 2-3 hours
         ├─ Tool inventory          [████]
         ├─ Tier documentation      [████]
         └─ Search analysis         [████]

Phase 1: Roampal Analysis           [████████████] 3-4 hours
         ├─ Hook system             [████]
         ├─ Scoring system          [████]
         └─ Collections/Graphs      [████]

Phase 2: Gap Analysis               [████████] 2-3 hours
         └─ Comparison matrix       [████████]

Phase 3: Recommendations            [████████] 2-3 hours
         ├─ Priority rankings       [████]
         ├─ Feasibility assessment  [████]
         └─ Decision record         [████]

TOTAL ESTIMATED TIME: 9-13 hours
```

<!-- /ANCHOR:summary -->
---

## 11. DELIVERABLES CHECKLIST

### Phase 0 Deliverables
- [ ] Architecture overview (in analysis doc)
- [ ] MCP tool inventory (14 tools documented)
- [ ] Six-tier importance system documentation
- [ ] Hybrid search mechanism analysis
- [ ] Decay/promotion mechanics documentation
- [ ] Checkpoint system analysis

### Phase 1 Deliverables
- [ ] Hook-based context injection analysis
- [ ] Outcome-based learning documentation
- [ ] Collection architecture analysis (5 types)
- [ ] Promotion flow documentation
- [ ] Wilson score ranking explanation
- [ ] Knowledge Graph analysis
- [ ] Soft enforcement documentation

### Phase 2 Deliverables
- [ ] Feature comparison matrix
- [ ] Gap identification list
- [ ] Technical feasibility per gap
- [ ] Effort estimates (T-shirt sizes)

### Phase 3 Deliverables
- [ ] High-priority recommendations (3+)
- [ ] Medium-priority recommendations (3+)
- [ ] Low-priority recommendations (3+)
- [ ] Implementation guidance per recommendation
- [ ] Dependencies mapping
- [ ] Risk assessment matrix
- [ ] Decision record (ADR format)

### Level 3 Required Artifacts
- [x] spec.md - Complete
- [x] plan.md - This document
- [ ] checklist.md - To be created
- [ ] decision-record.md - Phase 3 deliverable

---

## 12. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for requirements and user stories
- **Task Breakdown**: See `tasks.md` for implementation task list (after plan approval)
- **Checklist**: See `checklist.md` for validation criteria

### System Documentation

- **Our System**: `.opencode/skills/system-memory/SKILL.md`
- **Memory MCP Server**: `.opencode/skills/system-memory/mcp-server/`
- **Database Schema**: `.opencode/skills/system-memory/database/`

### External References

- **Roampal-Core**: https://github.com/roampal-ai/roampal-core
- **Wilson Score**: Statistical ranking algorithm for binomial confidence intervals
- **ChromaDB**: https://www.trychroma.com/

---

## NEXT STEPS

### Research Phase (COMPLETE)
1. ~~Review this plan~~ - Validated scope and timeline estimates
2. ~~Create checklist.md~~ - Validation criteria defined
3. ~~Complete Phase 0-3~~ - Analysis, gap identification, recommendations done
4. ~~Create decision-record.md~~ - ADR-001 through ADR-004 documented

### Implementation Phase (NEW)
5. **Create plugin scaffold** - `.opencode/plugin/memory-context.js`
6. **Implement Layer 1** - Session start injection with constitutional memories
7. **Implement Layer 3** - Exchange recording during idle periods
8. **Update AGENTS.md** - Add mandatory trigger matching to Gate 3 / Phase 2
9. **Test hybrid strategy** - Verify all 3 layers work together
10. **Document results** - Update memory/ folder with implementation learnings

### References
- See `tasks.md` for detailed task breakdown
- See `decision-record.md` ADR-002-REVISED for implementation decision
- See `checklist.md` P0: IMPLEMENTATION TASKS section

---
