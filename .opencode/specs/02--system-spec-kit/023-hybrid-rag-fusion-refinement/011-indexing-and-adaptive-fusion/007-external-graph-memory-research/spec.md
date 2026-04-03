---
title: "Feature Specification: External Graph Memory Research [02--system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research]"
description: "Research external graph memory solutions to identify improvements for graph system effectiveness, UX, and automatic utilization in Spec Kit Memory."
trigger_phrases:
  - "graph memory research"
  - "external graph solutions"
  - "graph effectiveness"
  - "knowledge graph memory"
  - "graph ux improvement"
importance_tier: "important"
contextType: "research"
---
# Feature Specification: External Graph Memory Research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory causal graph currently has 3,854 edges at 79.92% coverage, dominated by `supports` (2,578) and `caused` (1,265) relations. While structurally healthy, the graph is used reactively — retrieved only when causal boost or co-activation fires — rather than as a proactive, first-class retrieval channel. This research phase investigates how leading external graph memory systems (Zep, Mem0, GraphRAG, Memoripy, LightRAG, Cognee) handle graph construction, traversal, UX surface, and automatic utilization, and produces a ranked shortlist of improvements applicable to our system.

**Key Decisions**: Research scope (which systems to survey), and output format (ranked improvement backlog vs. immediate ADRs).

**Critical Dependencies**: Access to public documentation and source for surveyed systems. No code changes in this phase.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-01 |
| **Branch** | `011-007-external-graph-memory-research` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 006-default-on-boost-rollout |
| **Successor** | 008-create-sh-phase-parent |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Spec Kit Memory graph subsystem is structurally sound but underutilized. Causal boost fires on only a subset of queries, co-activation is bounded at runtime, and the graph surface is invisible to the user during retrieval — there is no UX feedback indicating which memories were graph-boosted or why. We have no systematic survey of how the field has advanced beyond our current design.

### Purpose

Produce a research report that maps external graph memory solutions to concrete, ranked improvement opportunities for our graph system across three dimensions: retrieval effectiveness, user-facing transparency, and automatic/proactive graph utilization.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Survey of publicly available graph memory systems: Zep, Mem0, Microsoft GraphRAG, Memoripy, LightRAG, Cognee, and Graphiti
- Analysis of graph construction strategies (automatic entity extraction, relation inference, temporal edges)
- Analysis of graph traversal strategies (BFS, DFS, community detection, path scoring)
- Analysis of UX patterns exposing graph signals to end users (explainability, provenance, visual trace)
- Analysis of automatic utilization patterns (proactive graph injection, trigger-free co-activation, memory decay via graph position)
- Ranked improvement backlog for our system derived from findings
- At least one ADR per major design decision surfaced by research

### Out of Scope

- Implementation of any improvements (handled in follow-on phases)
- Proprietary or closed-source systems without public documentation
- Graph visualization UI (separate concern from retrieval UX)
- Changing the existing causal edge schema

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create later | Primary research document with all findings |
| `spec.md` | Maintain | Source-of-truth phase specification |
| `plan.md` | Create or overwrite | Research execution plan |
| `tasks.md` | Create | Task breakdown |
| `checklist.md` | Create | Verification checklist |
| `decision-record.md` | Create | ADRs from research findings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Survey at least 5 external graph memory systems | research.md section 4 documents each system with: construction strategy, traversal strategy, UX surface, auto-utilization pattern |
| REQ-002 | Produce ranked improvement backlog | research.md section 2 contains at minimum 8 ranked improvement items with estimated impact (H/M/L) and implementation complexity (H/M/L) |
| REQ-003 | At least one ADR documenting a major design choice surfaced by research | decision-record.md contains ADR-001 with status Proposed or Accepted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Map findings to our existing feature flags | research.md section 5 cross-references each improvement with relevant SPECKIT_* flags or identifies gaps |
| REQ-005 | UX improvement analysis | research.md section 6 documents at least 3 UX patterns for exposing graph signals to users |
| REQ-006 | Automatic utilization analysis | research.md section 7 documents at least 3 patterns for proactive/trigger-free graph utilization |
| REQ-007 | Gap analysis against current implementation | research.md section 8 maps each external pattern to our current state (present / partial / absent) |
| REQ-008 | Baseline comparison must include the known internal retrieval gap | research.md explicitly carries forward the known zero-result `memory_search` example for "Semantic Search" and uses it to justify at least one recommendation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md is complete, covering all 7 required sections, with no placeholder content remaining
- **SC-002**: Ranked improvement backlog contains at least 8 items with impact + complexity scores
- **SC-003**: At least one ADR is filed in decision-record.md with full five-checks evaluation
- **SC-004**: Gap analysis table in research.md section 8 covers all identified external patterns
- **SC-005**: Research findings are saved to memory via generate-context.js for future session retrieval
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Public documentation for surveyed systems | Research blocked if docs are inaccessible | Use WebFetch; fall back to GitHub source, papers, blog posts |
| Risk | Research scope creep into implementation | Phase becomes too large to complete cleanly | Strict scope lock: research.md only, no code changes |
| Risk | Findings duplicate existing feature flags | Low-value output | Cross-reference SPECKIT_* flag catalog during survey; exclude already-implemented patterns from backlog |
| Risk | Systems are too different in architecture to yield actionable comparisons | Low transfer value | Focus on principles and patterns, not direct code adoption |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Research Quality
- **NFR-R01**: Each surveyed system must be assessed against the same evaluation framework (construction / traversal / UX / auto-utilization)
- **NFR-R02**: All claims must cite a source (URL, paper, or GitHub file path)
- **NFR-R03**: Improvement backlog items must be independently actionable (not bundled)

### Documentation
- **NFR-D01**: research.md must be indexable by Spec Kit Memory (no placeholder content, valid YAML frontmatter)
- **NFR-D02**: All spec artifacts must pass validate.sh with exit code 0 or 1

---

## 8. EDGE CASES

### Data Boundaries
- System unavailable during research: mark as "inaccessible" in the survey table; do not fabricate data
- Conflicting claims across sources: document the conflict and preferred interpretation with rationale

### Error Scenarios
- WebFetch timeout: retry once; if still failing, use cached knowledge and mark source as "knowledge-only"
- System discontinued or pivoted: note in survey; include historical design if documented

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 6, LOC: ~500 research doc, Systems: 7 |
| Risk | 8/25 | No auth changes, no API, no breaking changes |
| Research | 18/20 | Deep external survey across 7 systems, 4 dimensions each |
| Multi-Agent | 3/15 | Single researcher; WebFetch-heavy |
| Coordination | 5/15 | Dependencies: access to external docs only |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | External docs behind auth or paywalls | M | L | Use public GitHub, arXiv, blog posts as fallback |
| R-002 | Research finds no actionable gaps (our system already covers everything) | L | L | Still valuable as validation; document as confirmation |
| R-003 | Research too broad, backlog items too vague to implement | H | M | Each backlog item must include: what changes, which file/component, estimated LOC |

---

## 11. USER STORIES

### US-001: Researcher can survey external systems systematically (Priority: P0)

**As a** developer working on Spec Kit Memory, **I want** a structured survey of how Zep, Mem0, GraphRAG, LightRAG, Memoripy, Cognee, and Graphiti implement graph memory, **so that** I can identify proven patterns we have not yet adopted.

**Acceptance Criteria**:
1. Given research.md exists, When I open section 4, Then I see one subsection per system with: construction strategy, traversal strategy, UX surface, auto-utilization pattern, and a source URL

---

### US-002: Lead can review ranked improvement backlog (Priority: P0)

**As a** technical lead, **I want** a ranked backlog of graph improvements derived from research, **so that** I can prioritize which improvements to implement in follow-on phases.

**Acceptance Criteria**:
1. Given research.md section 2 exists, When I read it, Then I see at least 8 items ranked by impact × inverse-complexity, each with a one-line description and implementation pointers

---

### US-003: Future agent can find this research via memory search (Priority: P1)

**As a** future AI agent starting a new session, **I want** the research findings to be retrievable via `/memory:search "graph memory improvements"`, **so that** I do not repeat this research from scratch.

**Acceptance Criteria**:
1. Given research is complete, When I run memory_context with query "graph memory improvements", Then this research.md appears in top-5 results

---

### Acceptance Scenarios

1. **Given** the internal graph baseline is recorded, **When** the research starts, **Then** it includes 3,854 edges, 79.92% coverage, 6 orphaned edges, average strength 0.76, and the dominant `supports` and `caused` relations.
2. **Given** the survey covers Zep, Mem0, GraphRAG, LightRAG, Memoripy, Cognee, and Graphiti, **When** a reader checks the system comparison section, **Then** each system is described with the same evaluation rubric.
3. **Given** the current graph is structurally healthy but retrieval is still weak, **When** the report explains the problem, **Then** it includes the zero-result `memory_search` example for "Semantic Search".
4. **Given** the goal is better retrieval effectiveness, **When** the backlog is reviewed, **Then** it contains recommendation items tied to observed internal gaps rather than generic graph ideas.
5. **Given** the goal is UX transparency, **When** the report is reviewed, **Then** it identifies concrete ways to expose graph usage and provenance to users.
6. **Given** the goal is automatic graph utilization, **When** the report is reviewed, **Then** it documents patterns for proactive graph use without claiming they are already implemented internally.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should Graphiti (by Zep, open-sourced) be treated as a separate system from Zep or as an implementation detail of it?
  **Resolution**: Graphiti is reviewed as a separate system (section 4.7 in research.md) because its open-source temporal-first design is architecturally distinct from Zep Cloud.
- Is the improvement backlog consumed directly as phase 009+ tasks, or does it need a separate planning phase first?
  **Resolution**: The backlog feeds follow-on phases (see ADR-002 in decision-record.md). A separate planning phase is recommended before implementation per the diagnosis gate recommendation.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Findings**: See `research/research.md`
- **Parent Phase**: See `../spec.md`

<!-- /ANCHOR:questions -->
