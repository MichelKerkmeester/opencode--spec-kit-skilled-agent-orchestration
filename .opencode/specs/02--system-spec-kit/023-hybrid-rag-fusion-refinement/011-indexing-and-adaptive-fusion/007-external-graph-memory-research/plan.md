---
title: "Implementation Plan: External Graph Memory Research [02--system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research]"
description: "Plan the research work needed to compare external graph memory systems against our current graph baseline and turn findings into a ranked improvement backlog."
trigger_phrases:
  - "external graph memory research"
  - "graph retrieval improvement survey"
  - "research phase plan"
  - "adaptive fusion graph research"
importance_tier: "important"
contextType: "research"
---
# Implementation Plan: External Graph Memory Research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research docs, public vendor docs, GitHub repositories |
| **Framework** | Spec Kit Memory graph retrieval and causal graph analysis |
| **Storage** | `research/research.md`, `decision-record.md`, `memory/` via `generate-context.js` |
| **Testing** | Structured manual review plus `validate.sh --strict` |

### Overview

This phase is research-only. It uses the existing graph baseline to compare seven external graph memory solutions: Zep, Mem0, GraphRAG, LightRAG, Memoripy, Cognee, and Graphiti. The baseline facts that drive the research are: 3,854 causal edges, 79.92% coverage, 6 orphaned edges, average strength 0.76, dominant `supports` and `caused` relations, and a `memory_search` query for "Semantic Search" that returned 0 results. The goal is to turn that gap between graph health and retrieval usefulness into a ranked backlog of graph improvements for retrieval effectiveness, UX transparency, and automatic graph use.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 007 `spec.md` defines a research-only scope and remains the source of truth
- [x] Baseline facts captured: graph stats, relation mix, and zero-result search example
- [x] Survey set fixed to seven named external solutions
- [x] No code changes permitted in this phase

### Definition of Done
- [x] `research/research.md` documents all seven systems on one comparison rubric
- [x] Ranked improvement backlog includes at least eight items with impact and complexity ratings
- [x] Findings map to current Spec Kit Memory behavior, including gaps in UX transparency and automatic use
- [x] `decision-record.md` contains at least one research-driven ADR
- [ ] Context is saved to `memory/` after the research artifact is complete
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the phase remains research-only and no code changes are introduced.
- Confirm the seven target systems and current internal baseline facts are visible in the working notes.
- Confirm every new claim will either cite a source or be labeled as unknown.

### Execution Rules
- Use one fixed comparison rubric across all seven systems.
- Do not convert research ideas into implementation claims.
- If a source is weak or unavailable, record the limitation directly instead of filling gaps from memory.

### Status Reporting Format
- Use `IN_PROGRESS`, `BLOCKED`, or `DONE` with the current system under review and the target section in `research/research.md`.

### Blocked Task Protocol
- If a source cannot be verified, mark that system as partially researched, record the blocker, and continue with the remaining systems.
- If the blocker affects the ranking quality, defer the impacted recommendation rather than overstating confidence.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Comparative research workflow with a fixed evaluation matrix and no code mutation.

### Key Components
- **Current-State Baseline**: Records the facts we already know about the internal graph system so external comparisons stay grounded in real weaknesses.
- **Survey Matrix**: Uses the same four lenses for every solution: retrieval behavior, UX transparency, automatic graph use, and operational fit.
- **Recommendation Backlog**: Converts raw findings into concrete improvement candidates with priority and implementation follow-up notes.
- **ADR Output**: Captures design choices that should survive past the research session.

### Data Flow
```
Current graph facts -> comparison rubric -> vendor/source review
vendor/source review -> system-by-system notes -> gap analysis
gap analysis -> ranked recommendations -> ADRs and handoff context
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Research Frame
- [x] Capture internal baseline facts in `research/research.md`
- [x] Define comparison rubric for all seven systems
- [x] Confirm evidence format for citations and confidence notes

### Phase 2: External Survey
- [x] Review Zep
- [x] Review Mem0
- [x] Review GraphRAG
- [x] Review LightRAG
- [x] Review Memoripy
- [x] Review Cognee
- [x] Review Graphiti

### Phase 3: Synthesis and Handoff
- [x] Build ranked recommendation backlog
- [x] Write gap analysis against current Spec Kit Memory behavior
- [x] Write at least one ADR from the findings
- [ ] Save session context to memory after research closes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Verify all seven systems were reviewed with the same rubric | Human review of `research/research.md` |
| Manual | Verify each backlog item names a concrete improvement and why it matters | Human review |
| Manual | Verify ADR rationale matches the research findings | Human review of `decision-record.md` |
| Structural | Verify spec artifacts are template-compliant and placeholder-free | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Public documentation for Zep | External | Required | Research note must cite fallback sources or mark evidence as incomplete |
| Public documentation for Mem0 | External | Required | Recommendation quality drops if the system cannot be verified |
| Public documentation for GraphRAG | External | Required | Retrieval comparison loses a strong graph-first baseline |
| Public documentation for LightRAG | External | Required | Misses lightweight retrieval tradeoffs |
| Public documentation for Memoripy | External | Required | Misses lightweight memory API tradeoffs |
| Public documentation for Cognee | External | Required | Misses automated knowledge graph ingestion patterns |
| Public documentation for Graphiti | External | Required | Misses temporal and event-centric graph patterns |
| `generate-context.js` | Internal | Required | Research results are harder to recover in future sessions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A source proves inaccessible, low confidence, or too thin to support a trustworthy comparison.
- **Procedure**: Record the limitation directly in `research/research.md`, keep the system in scope, and avoid unsupported conclusions. If the evidence is too weak, downgrade the recommendation strength rather than invent detail.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline framing -> external survey -> synthesis and backlog
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline and Research Frame | Existing 007 spec + baseline facts | External Survey |
| External Survey | Comparison rubric and source access | Synthesis and Handoff |
| Synthesis and Handoff | Completed survey notes | Research closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and Research Frame | Low | 30-45 minutes |
| External Survey | High | 4-6 hours |
| Synthesis and Handoff | Medium | 1-2 hours |
| **Total** | | **5.5-8.75 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm no source files or scripts were edited during this phase
- [ ] Confirm the research document clearly labels assumptions and evidence gaps
- [ ] Confirm backlog items do not claim implementation status

### Rollback Procedure
1. Remove unsupported claims from `research/research.md`
2. Mark weak evidence as unresolved instead of forcing a recommendation
3. Re-run `validate.sh --strict` on the phase folder
4. Save corrected context so later work does not inherit bad findings

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. This phase creates documentation only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
baseline facts
    |
    v
comparison rubric
    |
    v
external system survey
    |
    +----> gap analysis
    |          |
    |          v
    +----> recommendation backlog
               |
               v
             ADRs
               |
               v
           memory save
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline facts | Existing graph metrics and zero-result query evidence | Stable comparison frame | External survey |
| External system survey | Public docs and repositories | Structured notes per solution | Gap analysis |
| Gap analysis | Survey notes | Present/partial/absent assessment | Recommendation backlog |
| Recommendation backlog | Gap analysis | Prioritized improvement list | ADRs |
| ADRs | Backlog and design tradeoffs | Durable decisions | Memory save |
| Memory save | Final research output | Future session continuity | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Complete the seven-system survey** - 4-6 hours - CRITICAL
2. **Write the gap analysis** - 45-60 minutes - CRITICAL
3. **Rank and justify recommendations** - 30-45 minutes - CRITICAL
4. **Capture ADR and memory handoff** - 20-30 minutes - CRITICAL

**Total Critical Path**: about 5.5-8 hours

**Parallel Opportunities**:
- UX transparency notes and automatic-use notes can be extracted while surveying each system
- Citation cleanup can run in parallel with backlog ranking once survey notes exist
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Research frame locked | Comparison rubric and baseline facts documented | Start of research session |
| M2 | Survey complete | All seven systems reviewed with citations | End of survey work |
| M3 | Recommendations ready | Backlog and gap analysis complete | End of synthesis |
| M4 | Research phase archived for later use | ADR written and context saved | Phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the formal ADRs for this phase.

### ADR-P001: Use a Fixed Comparison Matrix Instead of Free-Form Research Notes

**Status**: Accepted

**Context**: The phase needs actionable follow-up, not a pile of disconnected notes. The current graph already shows strong edge coverage but weak retrieval visibility, so the research has to stay tied to concrete improvement themes.

**Decision**: Review every external system with the same lenses: retrieval effectiveness, UX transparency, automatic graph use, and operational fit. This keeps the output comparable and easier to turn into a ranked backlog.

**Consequences**:
- The research stays specific and easier to audit
- Some interesting side details may be omitted if they do not fit the matrix
- Follow-on implementation planning becomes faster because findings arrive in a uniform shape

**Alternatives Rejected**:
- Free-form note taking with ad hoc conclusions. Rejected because it makes ranking and comparison weaker.
