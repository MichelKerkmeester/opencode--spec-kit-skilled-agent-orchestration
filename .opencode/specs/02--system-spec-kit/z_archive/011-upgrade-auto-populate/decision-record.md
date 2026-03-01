---
title: "Decision Record: AI Auto-Populate on Spec Upgrade [128-upgrade-auto-populate/decision-record]"
description: "The upgrade-level.sh script injects template scaffolding with [placeholder] text when upgrading spec levels. These placeholders need to be replaced with real, context-aware cont..."
trigger_phrases:
  - "decision"
  - "record"
  - "auto"
  - "populate"
  - "spec"
  - "decision record"
  - "128"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: AI Auto-Populate on Spec Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: AI-Side Workflow vs Script Modification

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The `upgrade-level.sh` script injects template scaffolding with `[placeholder]` text when upgrading spec levels. These placeholders need to be replaced with real, context-aware content. The question is whether to modify the shell script to produce better content or to have the AI agent handle population as a separate post-upgrade step.

### Constraints
- Shell scripts cannot reason about content or derive context from existing documents
- The upgrade script is already complex (1600+ lines) with chained multi-step upgrades
- AI agents have full read access to all spec folder documents and can reason about content

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Keep the shell script as structural scaffolding only; add an AI-side post-upgrade workflow step that reads existing context and populates all placeholder sections.

**Details**: After `upgrade-level.sh` completes its structural work (creating files, injecting template sections, updating markers), the AI agent reads all existing spec folder documents, extracts context (problem statement, requirements, phases, decisions), identifies placeholder patterns in the newly injected sections, and replaces them with derived content using the Edit tool.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **AI-side workflow** | Leverages AI reasoning, no script changes, flexible | Requires AI involvement for every upgrade | 9/10 |
| Script modification | Fully automated, no AI dependency | Shell cannot reason about content, enormous complexity | 3/10 |
| Hybrid (script + AI) | Script fills what it can, AI fills rest | Two systems to maintain, unclear boundary | 5/10 |

**Why Chosen**: The shell script fundamentally cannot reason about content. Attempting to make it context-aware would require embedding an entire template engine with conditional logic, making the already-complex script unmaintainable. The AI agent naturally has the reasoning capabilities needed and already has access to all spec folder documents.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Shell script remains simple, deterministic, and maintainable
- AI produces higher-quality content by reasoning about actual spec context
- Approach is inherently flexible and improves as AI capabilities improve

**Negative**:
- Every upgrade requires AI agent involvement - Mitigation: Integrate into SpecKit workflows so it happens automatically

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| AI generates inaccurate content | Medium | Human review step; content derived from existing documents |
| Workflow not triggered | Medium | Integrate into /spec_kit:complete as mandatory post-upgrade step |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Spec 127 upgrade produced entirely placeholder-filled files; manual population took significant time |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives evaluated (AI-only, script-only, hybrid); AI-only is clearly superior for content reasoning |
| 3 | **Sufficient?** | PASS | Simplest approach: add a workflow step rather than rewriting the upgrade script |
| 4 | **Fits Goal?** | PASS | Directly addresses the problem of placeholder-filled upgrades |
| 5 | **Open Horizons?** | PASS | Approach improves naturally as AI capabilities improve; no lock-in |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- SpecKit workflow documentation (add post-upgrade populate instructions)
- `/spec_kit:complete` skill (integrate auto-populate step)

**Rollback**: Remove the post-upgrade populate step from workflow docs; upgrades revert to scaffold-only behavior

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Handling Missing Source Context

<!-- ANCHOR:adr-002-context -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | Michel Kerkmeester |

---

### Context

When auto-populating, some spec folders may not have enough source context to fill all template sections. For example, a spec with only a minimal spec.md and no plan.md cannot derive Phase Dependencies or Dependency Graphs.

### Constraints
- Cannot fabricate content that has no source basis
- Empty placeholders provide no value and look unfinished
- Some sections are structurally required by L3+ template

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Populate what can be derived from existing context; for sections without source material, write explicit "N/A - insufficient source context" rather than leaving placeholder brackets or fabricating content.

**Details**: The AI agent should distinguish between sections where it can derive accurate content (e.g., complexity scores from file counts) and sections where no source data exists (e.g., phase dependencies when no plan.md exists). For the latter, it writes a clear "N/A" with explanation rather than generating speculative content.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **N/A with explanation** | Honest, clear, no false content | Some sections look sparse | 8/10 |
| Leave placeholders | Easy to implement | Defeats the purpose of auto-populate | 2/10 |
| Generate speculative content | All sections filled | Risk of inaccurate/misleading content | 4/10 |

**Why Chosen**: Accuracy is more important than completeness. An explicit "N/A" with context is more useful than a fabricated answer and far better than a raw placeholder.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- No risk of inaccurate content in populated files
- Clear signal to the spec author about what needs manual attention

**Negative**:
- Some sections may appear sparse for minimal specs - Mitigation: Spec author can always fill in manually later

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Too many N/A sections | Low | Only applies to minimal specs; most have sufficient context |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must handle missing context gracefully |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives compared |
| 3 | **Sufficient?** | PASS | Simple rule: derive if possible, N/A otherwise |
| 4 | **Fits Goal?** | PASS | Supports accurate auto-population |
| 5 | **Open Horizons?** | PASS | Does not prevent future improvements |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- Auto-populate workflow instructions

**Rollback**: Switch to leaving original placeholders (revert to pre-populate behavior)

<!-- /ANCHOR:adr-002-consequences -->

<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3+ Decision Record
Document significant technical decisions
One ADR per major decision
-->
