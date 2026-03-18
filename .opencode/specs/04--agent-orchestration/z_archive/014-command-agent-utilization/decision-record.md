---
title: "Decision Record: Command Agent Utilization Audit [014-command-agent-utilization/decision-record]"
description: "The original plan stated \"All 12 create YAML files have a spec_folder_setup step\" and planned to update all 12 with @speckit routing. This needed verification before implementat..."
trigger_phrases:
  - "decision"
  - "record"
  - "command"
  - "agent"
  - "utilization"
  - "decision record"
  - "014"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Command Agent Utilization Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scope Reduction — 4 Files for Phase 1, Not 12

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | Implementation team |

---

### Context

The original plan stated "All 12 create YAML files have a `spec_folder_setup` step" and planned to update all 12 with @speckit routing. This needed verification before implementation.

<!-- /ANCHOR:adr-001-context -->

### Constraints
- Only files with actual `spec_folder_setup` steps should be modified
- Files that create artifacts at predefined locations (e.g., `install_guides/`, skill `assets/`) are explicitly exempt from spec folder creation per their own Gate 3 EXEMPT status
- Modifying exempt files would add incorrect agent routing

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Apply Phase 1 (@speckit routing) to only the 4 files that actually have `spec_folder_setup` steps.

**Details**: Grep verification confirmed only `create_skill` and `create_agent` (auto + confirm = 4 files) have spec folder setup steps. The remaining 8 files (folder_readme, install_guide, skill_asset, skill_reference) create files at predefined locations and document their Gate 3 EXEMPT status in their MD reference files.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **4 files only (Chosen)** | Matches actual workflow structure; respects Gate 3 exemptions | Differs from original plan text | 9/10 |
| All 12 files (Plan's original) | Matches plan exactly | Would add @speckit routing to files that don't create spec folders — incorrect | 2/10 |
| Skip Phase 1 entirely | No risk of wrong edits | Leaves Rule 5 violation in place | 1/10 |

**Why Chosen**: Grep evidence showed only 4 files have the step. Applying changes to all 12 would have been factually incorrect.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Changes are scoped to exactly the files that need them
- Gate 3 EXEMPT files remain untouched

**Negative**:
- Plan text says "12 files" but only 4 were modified — documented here for clarity

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Future create commands may need spec folders | L | New commands should add @speckit routing at creation time |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 4 files genuinely violate Rule 5 with inline spec.md creation |
| 2 | **Beyond Local Maxima?** | PASS | Verified scope via grep before deciding |
| 3 | **Sufficient?** | PASS | All files with spec_folder_setup are covered |
| 4 | **Fits Goal?** | PASS | Directly addresses AGENTS.md Rule 5 compliance |
| 5 | **Open Horizons?** | PASS | Pattern is extensible to future create commands |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: 4 YAML workflow files

**Rollback**: `git checkout` on the 4 files

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Non-Blocking @review Quality Gate

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | Implementation team |

---

### Context

Adding @review quality scoring to create workflows required deciding whether the gate should block workflow completion (like @review in spec_kit:implement Step 7) or act as non-blocking advisory feedback.

<!-- /ANCHOR:adr-002-context -->

### Constraints
- Create commands produce diverse artifacts (skills, agents, READMEs, guides, assets, references)
- Users expect create commands to complete and produce output
- Quality scoring adds value but shouldn't prevent artifact delivery
- spec_kit:implement uses `blocking: true` for @review, but that's a verification context (checking completed work against checklist)

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Set `blocking: false` with `on_low_score` threshold of 70, logging warnings and suggesting improvements without halting the workflow.

**Details**: The quality review step dispatches @review to score the created artifact against a 100-point rubric (Accuracy 40%, Completeness 35%, Consistency 25%). Scores below 70 trigger improvement suggestions but do not prevent workflow completion. In confirm mode, users see the score and can choose to address issues.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Non-blocking (Chosen)** | Workflows always complete; users get feedback; matches advisory pattern | Low scores may be ignored | 8/10 |
| Blocking gate | Forces quality standards; matches spec_kit:implement pattern | Create commands are generative, not verification — blocking feels wrong | 4/10 |
| No quality gate | Simplest; no new steps | Misses opportunity to catch quality issues | 3/10 |
| Conditional blocking (block only P0 failures) | Nuanced enforcement | Over-complex for create context; hard to define P0 for diverse artifacts | 5/10 |

**Why Chosen**: Create commands are generative workflows where the user's primary goal is to produce an artifact. Blocking on quality scores would frustrate users and contradict the workflow's purpose. Advisory scoring provides value without friction.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Users always get their artifact
- Quality feedback is available for those who want it
- Confirm mode gives explicit choice to address issues

**Negative**:
- Low-quality artifacts may ship without fixes — Mitigation: score is visible; users can choose to improve

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users ignore quality feedback | L | Confirm mode surfaces score prominently |
| Threshold 70 may be too low/high | L | Adjustable per command in future |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Create commands had zero quality feedback |
| 2 | **Beyond Local Maxima?** | PASS | 4 options evaluated with trade-offs |
| 3 | **Sufficient?** | PASS | Non-blocking with threshold covers the need |
| 4 | **Fits Goal?** | PASS | Adds §3 compliance without disrupting workflows |
| 5 | **Open Horizons?** | PASS | Can upgrade to blocking per-command if needed |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**: All 12 YAML workflow files

**Rollback**: Remove quality_review steps from YAML files

<!-- /ANCHOR:adr-002-impl -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Consistent agent_routing YAML Block Structure

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | Implementation team |

---

### Context

Three different agent types (@speckit, @context, @review) needed routing blocks in YAML files. The block structure needed to be standardized for consistency and maintainability.

<!-- /ANCHOR:adr-003-context -->

### Constraints
- Must reference the specific AGENTS.md rule being satisfied
- Must specify agent file path for discoverability
- Must include dispatch instructions and fallback behavior
- Must work for both auto and confirm mode workflows

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Standardize on a 5-field `agent_routing` block: `agent`, `agent_file`, `rule_reference`, `dispatch`, and `fallback` (or `blocking` for @review).

**Details**:
```yaml
agent_routing:
  agent: "@[name]"
  agent_file: ".opencode/agent/[name].md"
  rule_reference: "AGENTS.md [Rule/§] — [description]"
  dispatch: "Task tool → @[name] [action description]"
  fallback: "general (with warning: [what's bypassed])"
```

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **5-field standard (Chosen)** | Consistent, self-documenting, traceable to AGENTS.md | Slightly verbose | 9/10 |
| Minimal (agent + dispatch only) | Compact | Loses rule traceability and fallback behavior | 4/10 |
| Inline comments instead of fields | Less structured overhead | Not machine-parseable; easy to miss | 3/10 |

**Why Chosen**: The 5-field structure ensures every agent routing decision is traceable to a specific AGENTS.md rule, includes fallback behavior, and is consistent across all 18 files.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Every routing block is self-documenting
- Rule references make compliance auditable
- Fallback fields ensure graceful degradation

**Negative**:
- ~6 lines of YAML per routing block — Mitigation: worth the clarity

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Inconsistent routing blocks would be harder to audit |
| 2 | **Beyond Local Maxima?** | PASS | 3 options considered |
| 3 | **Sufficient?** | PASS | 5 fields cover all routing needs |
| 4 | **Fits Goal?** | PASS | Standardization serves the audit purpose |
| 5 | **Open Horizons?** | PASS | Pattern applies to any future agent routing |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**: All 18 modified files (12 YAML + 6 MD)

**Rollback**: N/A — structural pattern, not a reversible change

<!-- /ANCHOR:adr-003-impl -->

<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record — 3 ADRs for spec 014
All decisions accepted with 5/5 Five Checks
-->
