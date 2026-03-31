---
title: "Decision Record: sk-prompt-improver Initial Creation [03--commands-and-skills/003-sk-prompt-initial-creation/decision-record]"
description: "Architecture decisions for packaging the Prompt Improver system as an OpenCode skill."
---
# Decision Record: sk-prompt-improver Initial Creation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a lean orchestrator with progressive disclosure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-01 |
| **Deciders** | Spec author, prompt-skill maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The source Prompt Improver system contains a large knowledge base. Putting everything into one SKILL.md would overload the runtime context window and make the skill harder to maintain.

### Constraints

- The orchestrator must stay under the project word-count expectations.
- Deep framework material still needs to remain accessible.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep SKILL.md lean and move deep framework content into reference files.

**How it works**: SKILL.md performs routing and orchestration, while reference files hold the heavier framework, scoring, and mode details. This preserves the full capability set without forcing every invocation to load the entire corpus.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lean orchestrator + references** | Better context efficiency, easier maintenance | Requires more cross-file navigation | 9/10 |
| Single-file skill | Easier single-file browsing | Too large and less maintainable | 4/10 |

**Why this one**: It preserves the system breadth while respecting runtime context constraints.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Routing stays lightweight.
- Reference material can grow without bloating the orchestrator.

**What it costs**:
- Users must sometimes load reference files explicitly. Mitigation: keep routing references explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reference sprawl | M | Keep references grouped by concern |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Source corpus is large |
| 2 | **Beyond Local Maxima?** | PASS | Single-file option was considered |
| 3 | **Sufficient?** | PASS | Lean orchestrator covers routing needs |
| 4 | **Fits Goal?** | PASS | Supports direct prompt-engineering workflows |
| 5 | **Open Horizons?** | PASS | New references can be added later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- SKILL.md stays concise.
- Framework and scoring material live in references.

**How to roll back**: Merge reference material back into SKILL.md and simplify routing references.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---


### ADR-002: Adapt the source material instead of copying it verbatim

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-01 |
| **Deciders** | Spec author, prompt-skill maintainers |

---


### Context

The original Prompt Improver documents assumed a standalone Claude Project environment. A verbatim copy would preserve instructions and assumptions that do not fit the OpenCode skill system.

### Constraints

- The adapted skill must behave like a native OpenCode skill.
- The original framework intent must remain intact.


---


### Decision

**We chose**: Adapt the source material to OpenCode conventions instead of copying it line for line.

**How it works**: Standalone-project assumptions were removed, routing and voice were converted to skill-friendly guidance, and the framework content was preserved in OpenCode-oriented references.


---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Adapt source material** | Native fit, clearer runtime guidance | Requires editorial effort | 9/10 |
| Copy source material directly | Faster initial transfer | Preserves the wrong operational assumptions | 3/10 |

**Why this one**: The skill needed to feel native inside OpenCode while preserving the source system’s useful content.


---


### Consequences

**What improves**:
- The skill reads like a native runtime artifact.
- Frameworks remain usable in the OpenCode workflow.

**What it costs**:
- Adaptation introduces editorial work. Mitigation: document key differences clearly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Important source nuance is lost | M | Keep the adaptation focused on runtime translation, not concept removal |


---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Source assumptions did not fit the target runtime |
| 2 | **Beyond Local Maxima?** | PASS | Verbatim copy was considered and rejected |
| 3 | **Sufficient?** | PASS | Adaptation preserves the core frameworks |
| 4 | **Fits Goal?** | PASS | The result is an OpenCode-native skill |
| 5 | **Open Horizons?** | PASS | Future framework updates can be adapted incrementally |

**Checks Summary**: 5/5 PASS


---


### Implementation

**What changes**:
- Skill text is rewritten for OpenCode conventions.
- Reference documents carry adapted framework content.

**How to roll back**: Restore the prior direct-copy strategy and remove the adaptation-specific wording.



---


### ADR-003: Consolidate overlapping format guidance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-01 |
| **Deciders** | Spec author, prompt-skill maintainers |

---


### Context

The source material included separate Markdown, JSON, and YAML guidance that overlapped heavily. Keeping them fully separate would increase reference count and maintenance effort.

### Constraints

- Format-specific examples still need to remain understandable.
- The reference set should stay navigable.


---


### Decision

**We chose**: Consolidate overlapping format guidance into a smaller, more maintainable structure.

**How it works**: Related format instructions are grouped together where they share the same conceptual scaffolding, reducing duplication while preserving the important differences.


---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Consolidated guidance** | Less duplication, fewer files to maintain | Some sections become denser | 8/10 |
| Separate guide per format | Clear format isolation | More duplication and file sprawl | 6/10 |

**Why this one**: It reduced maintenance cost without removing format-specific guidance.


---


### Consequences

**What improves**:
- Reference set stays smaller.
- Shared concepts appear once instead of several times.

**What it costs**:
- Combined docs are denser. Mitigation: keep headings explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users miss format-specific details | L | Use clear subsections and examples |


---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Multiple guides overlapped heavily |
| 2 | **Beyond Local Maxima?** | PASS | Separate-file option remained on the table |
| 3 | **Sufficient?** | PASS | Consolidation keeps examples and distinctions |
| 4 | **Fits Goal?** | PASS | Improves maintainability of the skill package |
| 5 | **Open Horizons?** | PASS | Additional formats can be folded in later if needed |

**Checks Summary**: 5/5 PASS


---


### Implementation

**What changes**:
- Overlapping format references are consolidated.
- Shared framework concepts are described once.

**How to roll back**: Split the consolidated format material back into separate dedicated reference files.



---
