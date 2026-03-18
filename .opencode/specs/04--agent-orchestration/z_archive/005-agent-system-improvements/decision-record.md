---
title: "Decision Record: Agent System Improvements [005-agent-system-improvements/decision-record]"
description: "Research identified gaps in agent system documentation (missing verification sections, naming inconsistencies, no workflow diagrams). The question was whether to address these v..."
trigger_phrases:
  - "decision"
  - "record"
  - "agent"
  - "system"
  - "improvements"
  - "decision record"
  - "005"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Agent System Improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Documentation-Only Approach

<!-- ANCHOR:adr-001-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-27 |
| **Deciders** | User, Research Agents |

---

<!-- /ANCHOR:adr-001-metadata -->


<!-- ANCHOR:adr-001-context -->
### Context

Research identified gaps in agent system documentation (missing verification sections, naming inconsistencies, no workflow diagrams). The question was whether to address these via code changes (hooks, new agents) or documentation improvements.

<!-- /ANCHOR:adr-001-context -->


<!-- ANCHOR:adr-001-constraints -->
### Constraints
- No hooks available in the environment
- User requirement: no bloat or extra agents
- 7 existing agents are sufficient
- Changes must be low-risk

---

<!-- /ANCHOR:adr-001-constraints -->


<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: All improvements implemented as documentation/instruction changes only - no code modifications.

**Details**: Update 7 existing agent/command files with new sections (OUTPUT VERIFICATION, Mermaid diagrams), fix naming inconsistencies (@write), and add protocols (PDR). No new agents, no hooks, no architectural changes.

---

<!-- /ANCHOR:adr-001-decision -->


<!-- ANCHOR:adr-001-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Documentation-only** | Zero risk, fast, no dependencies | Relies on agent compliance | 9/10 |
| Code-based hooks | Enforcement guaranteed | Can't implement in environment | 2/10 |
| Add new agents | Specialized handling | Adds complexity, user rejected | 3/10 |
| Category routing system | Faster dispatch | Overkill for 7 agents | 4/10 |

**Why Chosen**: Highest impact with lowest risk. Hooks aren't available, new agents add complexity user explicitly rejected. Documentation changes achieve same goals through instruction clarity.

---

<!-- /ANCHOR:adr-001-alternatives-considered -->


<!-- ANCHOR:adr-001-five-checks-evaluation -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research identified real gaps (missing OUTPUT VERIFICATION, naming inconsistency) |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated, code approaches rejected for valid reasons |
| 3 | **Sufficient?** | PASS | Documentation changes address all identified issues |
| 4 | **Fits Goal?** | PASS | Directly improves agent reliability per spec requirements |
| 5 | **Open Horizons?** | PASS | No lock-in, changes are additive to existing structure |

**Checks Summary**: 5/5 PASS

---

<!-- /ANCHOR:adr-001-five-checks-evaluation -->


<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:


- Zero risk of breaking existing functionality
- Fast implementation (~4 hours total)
- No new dependencies or systems to maintain

**Negative**:
- Relies on agent instruction compliance - Mitigation: Strong wording (HARD BLOCK, MANDATORY)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents ignore new instructions | M | Use explicit enforcement language |
| Mermaid diagrams don't render | L | Test in VS Code preview first |

---

<!-- /ANCHOR:adr-001-consequences -->


<!-- ANCHOR:adr-001-implementation -->
### Implementation

**Affected Systems**:
- Agent files: orchestrate.md, speckit.md, research.md
- Command files: complete.md, research.md, debug.md, implement.md

**Rollback**: Git revert individual file changes

---

<!-- /ANCHOR:adr-001-implementation -->

<!-- /ANCHOR:adr-001 -->


<!-- ANCHOR:adr-002 -->
## ADR-002: AGENTS.md Exclusion

<!-- ANCHOR:adr-002-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-27 |
| **Deciders** | User |

---

<!-- /ANCHOR:adr-002-metadata -->


<!-- ANCHOR:adr-002-context -->
### Context

Initial research identified potential improvements to AGENTS.md (Never Touch list, code style examples, uncertainty permission). User explicitly requested AGENTS.md remain out of scope.

<!-- /ANCHOR:adr-002-context -->


<!-- ANCHOR:adr-002-constraints -->
### Constraints
- User directive: "don't touch agents.md in this spec"
- AGENTS.md serves different purpose than agent instructions

---

<!-- /ANCHOR:adr-002-constraints -->


<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: AGENTS.md is explicitly excluded from all recommendations in this spec.

**Details**: Three recommendations (#5 Never Touch list, #6 Code style examples, #7 Uncertainty permission) were removed. Remaining 9 recommendations target only .opencode/agent/ and .opencode/command/ files.

---

<!-- /ANCHOR:adr-002-decision -->


<!-- ANCHOR:adr-002-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exclude AGENTS.md** | Respects user scope, focused changes | Some improvements deferred | 9/10 |
| Include AGENTS.md | More comprehensive | Violates user requirement | 1/10 |

**Why Chosen**: User explicitly set this boundary. Respecting scope constraints is a core principle.

---

<!-- /ANCHOR:adr-002-alternatives-considered -->


<!-- ANCHOR:adr-002-five-checks-evaluation -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User requirement must be respected |
| 2 | **Beyond Local Maxima?** | PASS | N/A - scope constraint |
| 3 | **Sufficient?** | PASS | 9 recommendations still provide high value |
| 4 | **Fits Goal?** | PASS | Scope discipline is itself a goal |
| 5 | **Open Horizons?** | PASS | AGENTS.md improvements can be separate spec later |

**Checks Summary**: 5/5 PASS

---

<!-- /ANCHOR:adr-002-five-checks-evaluation -->


<!-- ANCHOR:adr-002-consequences -->
### Consequences


**Positive**:
- Focused, manageable scope
- Respects user boundaries
- Can address AGENTS.md in future spec if needed

**Negative**:
- Some identified improvements deferred - Mitigation: Document for future consideration

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| None | - | - |

---

<!-- /ANCHOR:adr-002-consequences -->


<!-- ANCHOR:adr-002-implementation -->
### Implementation

**Affected Systems**:
- Recommendations document updated
- Spec scope explicitly excludes AGENTS.md

**Rollback**: N/A - this is a scope decision

---

<!-- /ANCHOR:adr-002-implementation -->

<!-- /ANCHOR:adr-002 -->


<!-- ANCHOR:session-decision-log -->
## Session Decision Log

> **Purpose**: Track all gate decisions made during this session for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| Session 1 | Research Scope | PASS | HIGH | 0.1 | 10 parallel Opus agents completed comprehensive analysis |
| Session 1 | Hook Exclusion | BLOCK | HIGH | 0.0 | User: "WE CANT HAVE HOOKS" |
| Session 1 | Agent Count | BLOCK | HIGH | 0.0 | User: "no extra agents" |
| Session 1 | AGENTS.md Scope | BLOCK | HIGH | 0.0 | User: "dont touch agents.md" |
| Session 1 | Doc Approach | PASS | HIGH | 0.1 | Research validated current system sound |

**Log Instructions**:
- Record each gate decision as it occurs during the session
- Include both PASS and BLOCK decisions for completeness
- Link to relevant ADR if decision resulted in new architecture record

---

<!--
Level 3+ Decision Record
Document significant technical decisions
One ADR per major decision
Includes Session Decision Log for audit trail
-->

<!-- /ANCHOR:session-decision-log -->
