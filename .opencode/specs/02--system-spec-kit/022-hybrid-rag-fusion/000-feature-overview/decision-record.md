---
title: "Decision Record: Hybrid RAG Fusion Refinement"
description: "Program-level ADR for how remediation and alignment are executed in the 8-sprint hybrid RAG refinement effort."
# SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2
trigger_phrases:
  - "hybrid rag decision record"
  - "sprint 140 adr"
  - "alignment remediation decision"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical-first, bounded-remediation workflow

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-28 |
| **Deciders** | Spec Kit maintainers |

---

### Context

The program reached late-stage drift where policy language and validator-state differed across global skill docs and sprint-local spec documentation. This created two risks: (1) conflicting interpretation of comment/header and feature-flag lifecycle rules, and (2) completion claims while Level 3+ validator errors were still unresolved.

---

### Decision

We apply remediation in this order:

1. Update canonical guidance with bounded edits only.
2. Propagate only required local sprint-doc clarifications.
3. Close validator error-class debt before claiming folder closure.

This sequence keeps scope tight while preserving traceability and reduces repeated divergence.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical-first bounded remediation (Chosen)** | Minimal churn, clear source-of-truth, reduced rework | Requires disciplined scope lock | 9/10 |
| Local-only sprint-doc fixes first | Fast local progress | High chance of re-divergence from canonical policy | 6/10 |
| Broad rewrite of skill + spec docs | Potential one-pass consistency | High risk, high review burden, scope creep | 4/10 |

---

### Consequences

**Benefits**:

- Reduces policy ambiguity with small, auditable deltas.
- Keeps sprint docs synchronized to one canonical contract.
- Converts validator debt from latent blocker to explicit remediation work.

**Costs**:

- Requires additional metadata normalization work (template-source headers and root-file restoration).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manual-gate language interpreted as weaker enforcement | Medium | Keep explicit P1 severity language in checklist and skill docs |
| Broad workspace noise obscures scoped improvements | Medium | Use file-scoped verification and targeted review gate |

---

### Five Checks Evaluation

| # | Check | Result |
|---|-------|--------|
| 1 | Necessary now? | PASS |
| 2 | Beyond local maxima? | PASS |
| 3 | Simplest sufficient path? | PASS |
| 4 | On critical path? | PASS |
| 5 | Avoids unnecessary debt? | PASS |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Parallel multi-agent remediation for comprehensive codebase review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-01 |
| **Deciders** | Spec Kit maintainers |

---

### Context

A 25-agent comprehensive review of the MCP server codebase identified ~65 issues spanning P0 blockers, P1 required fixes, and P2 suggestions. The issues touched ~50 files across handlers, lib modules, search pipeline, cognitive subsystem, eval framework, cache layer, and tests. Sequential remediation would be prohibitively slow given the scope.

---

### Decision

Execute remediation in 5 sequential waves with parallel agents within each wave:

1. **Wave 1 (P0):** 4 parallel agents — each assigned to an independent file with a P0 blocker
2. **Wave 2 (P1 code):** 6 parallel agents — partitioned by subsystem (scoring, flags, mutations, cache, cognitive, eval)
3. **Wave 3 (P1 standards):** 3 parallel agents — bulk header conversion, test cleanup, structural fixes
4. **Wave 4 (P2):** 2 parallel agents — performance and safety/config
5. **Wave 5 (docs):** 1 agent — documentation fixes across sprint folders

Each wave verified with `tsc --noEmit` + full test suite before proceeding. Test failures from behavioral changes fixed between waves.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parallel wave execution (Chosen)** | High throughput, wave gates catch regressions, independent file assignments prevent conflicts | Requires careful partitioning to avoid file collisions | 9/10 |
| Sequential single-agent | No collision risk, simple | ~68 fixes would take many hours sequentially | 4/10 |
| All-at-once parallel | Maximum speed | High risk of file conflicts, difficult verification | 3/10 |

---

### Consequences

**Benefits**:

- ~68 fixes completed in 5 waves with up to 16 concurrent agents
- Wave-gated verification caught 7 test failures early (before cascading)
- File-level partitioning eliminated merge conflicts between agents

**Costs**:

- Required careful pre-planning to assign independent files to each agent
- Test fixups between waves added overhead (7 failures across all waves)

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent modifying same file as another agent | High — merge conflicts | Strict file-level partitioning in wave assignments |
| Behavioral changes breaking unrelated tests | Medium — test failures | Full test suite run between waves; fix before proceeding |
| Over-scope from P2 suggestions | Low — scope creep | P2 limited to defensive changes (caps, guards, comments) |

---

### Five Checks Evaluation

| # | Check | Result |
|---|-------|--------|
| 1 | Necessary now? | PASS — P0 blockers included race conditions and data corruption risks |
| 2 | Beyond local maxima? | PASS — systematic review vs ad-hoc bug hunting |
| 3 | Simplest sufficient path? | PASS — wave structure is minimal coordination overhead |
| 4 | On critical path? | PASS — P0 blockers affected production reliability |
| 5 | Avoids unnecessary debt? | PASS — P2 items are defensive, not speculative |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002 -->
