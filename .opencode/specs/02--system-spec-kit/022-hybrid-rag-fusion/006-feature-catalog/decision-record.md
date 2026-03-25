---
title: "Decision Record: Feature Catalog Audit & Remediation"
---
# Decision Record: Feature Catalog Audit & Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: 30-Agent Partitioning Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-08 |
| **Deciders** | Michel Kerkmeester |

---

### Context

We need to verify ~180 feature snippets against source code AND investigate 55 undocumented gaps. A single agent cannot handle this volume within context limits. We need a partitioning strategy that maximizes coverage while staying within per-agent tool-call budgets (TCB: max 8 calls per leaf agent).

### Constraints

- Single-hop orchestration only (depth 0 to depth 1, no nesting)
- Max 8 tool calls per leaf agent with +30% buffer
- File-based collection required for 10+ agents (CWB Pattern C)

---

### Decision

**We chose**: Two-stream partitioning with 20 Copilot agents for category-contiguous verification and 10 Codex agents for architecture-zone gap investigation.

**How it works**: Stream 1 agents each cover 1-3 categories (5-12 snippet files) and verify descriptions + paths against source code. Stream 2 agents each cover a functional zone of the MCP server (4-6 source files) and verify specific gaps from the scan.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two-stream (chosen)** | Separation of concerns, optimal model per task | More agents to coordinate | 8/10 |
| Single-stream 30 agents | Simpler orchestration | Verification and investigation are different tasks | 5/10 |
| Fewer agents (10 total) | Less coordination | Context overflow, incomplete coverage | 3/10 |

**Why this one**: Verification (reading snippets + source) and investigation (deep-diving specific files for gaps) are fundamentally different tasks that benefit from different models and prompts.

---

### Consequences

**What improves**:
- Full coverage of all 180 snippets and 55 gaps within per-agent limits
- Copilot (GPT-5.4) excels at comparison tasks, Codex (GPT-5.3-Codex) excels at code analysis

**What it costs**:
- 30 concurrent launches may hit rate limits. Mitigation: Stagger launches 3-5s apart

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rate limiting with 30 agents | M | Stagger launches, retry on failure |
| Overlap between streams | L | Cross-validation in Phase C |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 180 snippets + 55 gaps exceed single-agent capacity |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives evaluated |
| 3 | **Sufficient?** | PASS | Each agent handles 5-12 items within TCB |
| 4 | **Fits Goal?** | PASS | Directly enables SC-001 through SC-004 |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future catalog audits |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- 20 verification reports created in `scratch/verification-C[01-20].md`
- 10 investigation reports created in `scratch/investigation-X[01-10].md`

**How to roll back**: Delete scratch files and re-run with adjusted partitioning.

---

<!-- /ANCHOR:adr-001 -->
### ADR-002: Gap Classification Methodology

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-08 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The prior 10-agent scan found 55 gaps with 3 significance tiers (high/medium/low). We need a classification system that maps each gap to a concrete remediation action, and we need to handle findings from the verification stream (Stream 1) that may overlap with or extend the gap list.

### Constraints

- Must handle both existing gaps and newly discovered issues
- Must produce actionable remediation items (not just "needs work")
- Must support P0/P1/P2 prioritization for execution ordering

---

### Decision

**We chose**: 3-tier significance (HIGH/MEDIUM/LOW) crossed with 6-action remediation categories, producing a prioritized manifest.

**How it works**: Each finding gets a significance tier AND an action category. Action categories map to priorities: PATH-VALIDATE is P0, DESC-UPDATE/PATH-ADD/PATH-REMOVE/REWRITE is P1, NEW-FEATURE high-sig is P1, NEW-FEATURE med/low is P2, CATEGORY-MOVE is P2.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-tier x 6-action (chosen)** | Actionable, prioritized | Slightly complex matrix | 9/10 |
| Simple pass/fail | Easy to implement | No granularity for remediation | 4/10 |
| Free-form recommendations | Flexible | Hard to aggregate and prioritize | 5/10 |

**Why this one**: The 6 action categories map directly to what needs to be done to fix each issue, and the significance tiers set execution priority.

---

### Consequences

**What improves**:
- Every finding has a concrete next action
- Prioritization is automatic based on action + significance

**What it costs**:
- Agents must produce structured output in the specified format. Mitigation: Prompt templates enforce format

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 55+ findings need systematic classification |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives evaluated |
| 3 | **Sufficient?** | PASS | 6 actions cover all possible remediation types |
| 4 | **Fits Goal?** | PASS | Directly produces the remediation manifest |
| 5 | **Open Horizons?** | PASS | Categories reusable for future audits |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Agent prompts include the 6 action categories
- Remediation manifest uses this classification

**How to roll back**: Reclassify findings with an alternative scheme.

---

### ADR-003: Catalog Structure Preservation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-08 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The prior scan recommended creating new categories (Server Operations, Save Path Intelligence, Infrastructure/Resilience) and splitting catch-all categories (08-Bug-fixes, 14-Pipeline). We need to decide whether to restructure during this audit or keep the current 20-category taxonomy.

### Constraints

- Restructuring would invalidate all existing `## Source Metadata` references
- The monolithic `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` uses category-based section ordering
- Other tooling (generate-source-files.mjs, replace-monolith-source-files.mjs) depends on category directory names

---

### Decision

**We chose**: Keep the existing 20-category structure for this audit. New features go into the closest existing category. Restructuring is deferred to a separate spec.

**How it works**: Gap investigation agents suggest a category for each new feature. The synthesis phase validates the suggestion against existing categories and assigns the closest match. Category restructuring tracked as a separate future task.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep 20 (chosen)** | No breaking changes, focused scope | Some categories become crowded | 8/10 |
| Add 3 new categories | Better organization | Breaks tooling, scripts, references | 4/10 |
| Full restructure | Optimal taxonomy | Massive scope creep, blocks audit | 2/10 |

**Why this one**: Category restructuring is a significant change that would triple the scope of this audit. The current 20 categories can house new features, even if imperfect.

---

### Consequences

**What improves**:
- Audit stays focused on accuracy, not reorganization
- No breaking changes to existing tooling

**What it costs**:
- Some categories may have 20+ features. Mitigation: Track as future improvement

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must decide before agents suggest categories |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives evaluated |
| 3 | **Sufficient?** | PASS | 20 categories can absorb 55 new features |
| 4 | **Fits Goal?** | PASS | Keeps audit scope manageable |
| 5 | **Open Horizons?** | PASS | Restructuring deferred, not blocked |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Agent prompts specify: suggest existing category from the 20 options
- Remediation manifest maps new features to existing categories

**How to roll back**: Create new categories if the 20-category structure proves inadequate during remediation.
