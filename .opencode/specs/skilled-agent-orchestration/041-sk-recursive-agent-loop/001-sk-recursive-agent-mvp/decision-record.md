---
title: "Decision Record: Agent Improvement Loop [skilled-agent-orchestration/041-sk-agent-improver-loop/001-sk-agent-improver-mvp/decision-record]"
description: "Architecture decisions for building sk-agent-improver as a bounded experiment system instead of a freeform self-editing loop."
trigger_phrases:
  - "agent improvement decisions"
  - "decision record"
importance_tier: "important"
contextType: "general"
---
# Decision Record: Agent Improvement Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Start With an Evaluator-First, Proposal-Only MVP

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-03 |
| **Deciders** | Packet planning review |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to decide whether `sk-agent-improver` should begin by directly editing agent files or by staying in a proposal-only mode first. The research packet showed that this repo already has strong loop packaging patterns, but it does not yet have a benchmark-grade evaluator for agent quality. Shipping mutation first would make every later score suspect.

### Constraints

- Repo safety rules expect verification before claiming progress.
- Mutation and review are supposed to stay independent.
- Runtime mirrors make broad first-wave mutation hard to attribute correctly.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The MVP will be evaluator-first and proposal-only.

**How it works**: The loop generates candidates, scores them, records them, and stops before patching canonical files. Canonical edits become a later phase only after the scorer, ledger, and approval rules are trusted.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Proposal-only MVP** | Highest trust, easier to debug, aligns with repo safety model | Slower path to visible automatic editing | 9/10 |
| Mutation-first MVP | Faster demo value, fewer phases | Creates false-confidence risk and entangles evaluator quality with side effects | 3/10 |
| Full self-improving overnight loop | Maximum autonomy | Wrong trust boundary, too broad, not reviewable | 1/10 |

**Why this one**: It solves the real hard problem first. If the scorer is weak, no amount of automatic editing will make the system trustworthy.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Early experiments become auditable because every result is ledgered before any canonical mutation occurs.
- Reviewers can inspect the scorer and the candidate record independently.

**What it costs**:
- The first release will not automatically patch agent files. Mitigation: keep the dry-run path fast and make reducer outputs easy to review.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The MVP feels too conservative | M | Frame phase 1 as proof of evaluator quality, not as the final product |
| Teams pressure the loop into auto-editing early | H | Keep promotion gates explicit and block canonical edits until the checklist says otherwise |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The evaluator gap is the main blocker identified by research |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives included mutation-first and broad autonomy, both rejected |
| 3 | **Sufficient?** | PASS | Proposal-only mode is the smallest step that still proves evaluator quality |
| 4 | **Fits Goal?** | PASS | The packet goal is trustworthy improvement, not flashy automation |
| 5 | **Open Horizons?** | PASS | This choice leaves room for later bounded auto-editing |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Command/workflow logic must stop before canonical patching in phase 1.
- Scorer, reducer, and ledger artifacts become first-class implementation targets.

**How to roll back**: Revert the loop artifacts added in this packet and preserve research/planning docs for a future re-approach.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Use `.opencode/agent/handover.md` as the First Target Surface

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-03 |
| **Deciders** | Packet planning review |

---

### Context

We needed one first target that was narrow, canonical, and measurable. The research packet compared broad options like `@deep-research` with more structured artifact-producing surfaces and concluded that handover behavior is a much better evaluator fit.

### Constraints

- Phase 1 must target one canonical `.opencode/agent` surface only.
- The scorer needs deterministic structure checks, not subjective synthesis scoring.
- The target should already have a command workflow and a stable output contract.

---

### Decision

**We chose**: Use `.opencode/agent/handover.md` as the first mutable source surface, evaluated through handover output expectations.

**How it works**: The manifest marks `.opencode/agent/handover.md` as canonical. The loop generates bounded candidates related to that surface, and the scorer judges them against handover structure, required sections, and command-level expectations rather than open-ended prompt quality.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Handover target** | Structured output, existing command, fixed section expectations | Narrower than some teams may want | 9/10 |
| `@deep-research` as first target | High visibility, related to existing loop patterns | Too open-ended, evaluator becomes subjective fast | 4/10 |
| Whole `.opencode/agent/` directory | Broad coverage | No clean first-wave trust boundary | 2/10 |

**Why this one**: It gives the loop a real scoring contract from day one without pretending the repo is ready for broad autonomous mutation.

---

### Consequences

**What improves**:
- MVP scoring can focus on artifact integrity and required sections.
- The first target has a clear path from source surface to produced output.

**What it costs**:
- Early loop claims will be about one structured workflow, not all agents. Mitigation: treat this as deliberate proof-building rather than underscoping.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The handover target may be too narrow to generalize later | M | Use the manifest and promotion rules to make later expansion explicit |
| Teams misread the target as the only important agent surface | M | Document phase 2 and phase 3 expansion criteria clearly |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The loop needs one measurable target before it can generalize |
| 2 | **Beyond Local Maxima?** | PASS | We considered broader and more visible targets, then rejected them |
| 3 | **Sufficient?** | PASS | Handover is narrow but sufficient to validate scorer and ledger design |
| 4 | **Fits Goal?** | PASS | The goal is safe improvement, not maximum breadth on day one |
| 5 | **Open Horizons?** | PASS | The manifest model can later add more targets without changing the core design |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- The target manifest and evaluator contract must center on handover.
- Proposal-only dry runs must prove no canonical edits happen while scoring this surface.

**How to roll back**: Re-scope the packet to another structured target only if the handover evaluator proves too weak or too narrow in dry runs.

---

### ADR-003: Use a Control Bundle and Append-Only Ledger Instead of a Lone Control File

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-03 |
| **Deciders** | Packet planning review |

---

### Context

`autoagent-main` uses a strong single human-authored control file, but our repo already organizes iterative systems through command + skill + agent + disk-state bundles. We needed to decide whether to imitate the single-file control surface or express control as a small bundle that fits the repo's existing patterns.

### Constraints

- The repo already uses reducer-managed summaries and append-only iteration state in `sk-deep-research`.
- We need both human-readable policy and machine-readable mutability rules.
- Runtime mirror classification cannot stay implicit if later phases are going to be safe.

---

### Decision

**We chose**: Use a control bundle made of the improvement charter, target manifest, improvement config, and append-only experiment ledger.

**How it works**: The charter carries operator policy, the manifest names mutable and fixed surfaces, the config holds thresholds and budgets, and the JSONL ledger records every baseline, candidate, and scoring event. Reducer outputs are derived from this bundle rather than edited by hand.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Control bundle + JSONL ledger** | Fits repo patterns, separates human and machine concerns, reviewable | More files to initialize | 9/10 |
| Single control file | Simpler mental model, mirrors external repo | Too weak for mutability classes and reducer-driven state | 5/10 |
| Hidden config inside workflow prompts | Minimal visible files | Hard to audit and easy to drift | 2/10 |

**Why this one**: The repo already knows how to manage iterative state on disk. Reusing that pattern is safer than hiding control logic inside prompts.

---

### Consequences

**What improves**:
- Reviewers can inspect policy, target scope, configuration, and experimental outcomes separately.
- Later phases can change thresholds or add targets without rewriting the whole protocol.

**What it costs**:
- Packet initialization is more verbose than a single control file. Mitigation: ship templates and automated initialization in the command workflow.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The bundle feels heavy for small experiments | M | Keep templates lean and auto-generated from skill assets |
| Operators update one file and forget the others | M | Treat reducer outputs as derived, and validate the bundle at startup |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | We need both policy and machine-readable mutability data |
| 2 | **Beyond Local Maxima?** | PASS | The external single-file model was considered and rejected |
| 3 | **Sufficient?** | PASS | The bundle is the smallest unit that covers policy, scope, config, and ledgering |
| 4 | **Fits Goal?** | PASS | It aligns with the repo's existing iterative packet/state discipline |
| 5 | **Open Horizons?** | PASS | It supports later phases without redefining the architecture |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Skill assets must include control-bundle templates.
- Command initialization must generate the bundle and validate it before running.

**How to roll back**: Collapse to a lighter control model only if the bundle proves operationally noisy during dry runs and the evaluator needs fewer moving parts than expected.
