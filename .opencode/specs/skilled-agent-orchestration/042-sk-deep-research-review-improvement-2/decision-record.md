---
title: "Decision Record: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Architecture decisions for stop reasons, claim-verification storage, dashboard generation, council synthesis, and coordination-board state."
trigger_phrases:
  - "042"
  - "decision record"
  - "stop reason taxonomy"
  - "claim ledger"
  - "council synthesis"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Shared Stop-Reason Taxonomy and Legal Done Gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

### Context

We need a runtime answer to "why did this loop stop?" that works across both deep research and deep review. Right now stop behavior is partly implied by convergence math, partly spread across workflow steps, and not strong enough for recovery, dashboards, or user trust.

### Constraints

- The taxonomy must work for both research and review without turning them into the same product.
- STOP must remain auditable from packet-local artifacts.

### Decision

**We chose**: a shared named stop-reason taxonomy plus a separate legal done gate.

**How it works**: Each loop records `stopReason` from the same small taxonomy, while the legal done gate decides whether STOP is actually allowed. This keeps reason reporting simple and keeps the enforcement logic explicit.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared taxonomy + legal done gate** | One reporting language, explicit enforcement, easy dashboarding | Requires coordinated updates across many assets | 9/10 |
| Free-text stop reasons per loop | Fast to write | Not machine-friendly, drifts quickly, poor parity | 4/10 |
| Separate taxonomies for research and review | Preserves product differences | Harder parity and resume behavior, more operator confusion | 5/10 |

**Why this one**: It gives us a compact, auditable vocabulary without pretending research and review are the same workflow.

### Consequences

**What improves**:
- Dashboards, synthesis, and journals can report a single reason vocabulary.
- Blocked-stop cases become explicit instead of hidden in convergence math.

**What it costs**:
- We need synchronized changes across commands, assets, agents, and tests. Mitigation: make parity tests part of the same wave.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Taxonomy becomes too broad or too vague | Medium | Keep the enum small and use detail fields for nuance. |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Stop behavior is a direct trust gap from `CF-010`. |
| 2 | **Beyond Local Maxima?** | PASS | We considered free-text and per-loop taxonomies. |
| 3 | **Sufficient?** | PASS | Small enum plus done gate covers reporting and enforcement. |
| 4 | **Fits Goal?** | PASS | Runtime truth is a primary packet goal. |
| 5 | **Open Horizons?** | PASS | Supports future dashboards and continuation tooling without forcing a DSL rewrite. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Skill references, workflow assets, dashboards, agents, and parity tests adopt the shared taxonomy.
- Reducer/test surfaces learn blocked-stop reporting and resume-safe stop metadata.

**How to roll back**: Revert the new enum/done-gate fields together and restore the prior stop reporting language in skills, commands, agents, and parity tests.
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Claim-Verification Ledger Uses JSONL Canonical Storage With Rendered Summaries

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

Research packets need a durable way to show whether major claims were verified, contradicted, or left unresolved. A ledger must be machine-friendly enough for reducers and synthesis, but still readable in packet outputs.

#### Constraints

- The ledger must be append-friendly and packet-local.
- It should not require hand-maintained duplication between machine and human views.

#### Decision

**We chose**: JSONL as the canonical ledger format, with rendered markdown summaries in synthesis/dashboard outputs when needed.

**How it works**: The runtime writes structured ledger entries as JSONL so reducers and tests can reason over them. Research synthesis can then summarize those entries in human-readable tables or narrative sections without making markdown the source of truth.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical JSONL + rendered markdown** | Append-only, machine-friendly, easy reducer use, still human-readable through renderers | Requires one extra render path | 9/10 |
| Markdown table only | Easy for humans to skim | Brittle for automated checks and append-only workflows | 5/10 |
| JSON only, no rendered summary | Very machine-friendly | Poor packet readability and synthesis ergonomics | 6/10 |

**Why this one**: It keeps the runtime truthful and testable without making humans read raw JSONL for every synthesis.

#### Consequences

**What improves**:
- Claim status becomes reducer- and test-friendly.
- Research summaries can cite the ledger without becoming hand-maintained ledgers themselves.

**What it costs**:
- Reducers or synthesis paths need a render step. Mitigation: keep markdown summaries derived, not editable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ledger becomes noisy and underused | Medium | Restrict canonical use to major claims and promotion checkpoints. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `CF-014` asks for explicit verification status tied to evidence. |
| 2 | **Beyond Local Maxima?** | PASS | We compared markdown-only and JSON-only approaches. |
| 3 | **Sufficient?** | PASS | JSONL plus rendered summaries keeps one canonical truth. |
| 4 | **Fits Goal?** | PASS | Trustworthy research output is a core packet objective. |
| 5 | **Open Horizons?** | PASS | Supports future dashboard, search, and promotion-checkpoint tooling. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- Research state docs, reducer logic, and synthesis contracts define the ledger path and entry schema.
- Behavior tests add verified/contradicted/unresolved coverage.

**How to roll back**: Remove the JSONL ledger artifact and revert synthesis/dashboard references to the prior citation-only model.

---

### ADR-003: Dashboards Stay Generated Markdown, Backed by Structured Metrics

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

The dashboards need richer runtime truth, but the repo already uses markdown dashboards as the packet-local observability surface. We need to decide whether to keep generated markdown, move to JSON-only, or introduce a richer HTML/UI artifact.

#### Constraints

- The result must stay easy to review in git and packet folders.
- It must remain reducer-friendly and runtime-agnostic.

#### Decision

**We chose**: keep dashboards as generated markdown, backed by structured reducer metrics and canonical state artifacts.

**How it works**: Reducers compute metrics from JSONL, journals, ledgers, and strategy/config files. Generated markdown remains the human-facing dashboard, while machine-readable sources stay authoritative underneath.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Generated markdown backed by structured metrics** | Git-friendly, packet-local, easy recovery surface, no extra UI stack | Needs careful renderer upkeep | 9/10 |
| JSON-only dashboards | Easy to compute | Poor operator ergonomics | 5/10 |
| HTML or app-based dashboards | Rich visuals | Too much infrastructure for packet-local runtime truth | 4/10 |

**Why this one**: It preserves the existing packet-local operator workflow while allowing richer structured metrics underneath.

#### Consequences

**What improves**:
- Operators keep a git-visible dashboard surface.
- Reducers can expand metrics without turning dashboards into manually curated docs.

**What it costs**:
- Markdown renderers need to stay synchronized with state schemas. Mitigation: reducer and parity tests become mandatory.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dashboard sections drift from state schema | Medium | Test section presence and metric mapping in reducer/parity suites. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `CF-010` explicitly calls for richer runtime health signals and summaries. |
| 2 | **Beyond Local Maxima?** | PASS | We compared structured-only and richer UI alternatives. |
| 3 | **Sufficient?** | PASS | Generated markdown already fits packet-local workflows. |
| 4 | **Fits Goal?** | PASS | The goal is better runtime truth, not a new UI product. |
| 5 | **Open Horizons?** | PASS | Structured metrics could power future renderers without changing packet truth. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- Dashboard assets expand in both skills.
- Reducer/test surfaces learn the new metrics and section rendering.

**How to roll back**: Revert the new dashboard metrics/sections while keeping the current generated-markdown pattern intact.

---

### ADR-004: Council Synthesis Is Opt-In and Lives Inside Deep Research

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

The research corpus suggests council-style synthesis for ambiguous cases, but it also warns that the mode is expensive and failure-prone if treated as default behavior.

#### Constraints

- We need optional perspective isolation without creating a separate parallel product.
- Default deep-research behavior must remain lean.

#### Decision

**We chose**: implement council synthesis as an opt-in profile inside deep research rather than as a default mode or a separate command family.

**How it works**: A packet can explicitly request named perspectives, each runs as a deliberate iteration track, and a later synthesis iteration reconciles the perspectives. No council artifacts are required for the common path.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in profile inside deep research** | Reuses existing runtime, keeps default small, preserves packet locality | Adds one optional mode to document/test | 9/10 |
| Always-on council behavior | More "thorough" by default | Too expensive, too noisy, wrong default | 3/10 |
| Separate command/product | Strong separation | Splits the deep-research story and increases surface area | 5/10 |

**Why this one**: It honors `CF-027` without turning an optional escalation path into a new default burden.

#### Consequences

**What improves**:
- Ambiguous packets gain a disciplined multi-perspective path.
- Default deep research stays focused and cheaper.

**What it costs**:
- One more optional profile must be documented and tested. Mitigation: keep it explicitly opt-in and phase it last.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Council mode leaks into the default path | Medium | Gate it behind explicit profile selection and separate behavior tests. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `CF-027` is useful for ambiguous packets, not routine ones. |
| 2 | **Beyond Local Maxima?** | PASS | We compared default-on and separate-command alternatives. |
| 3 | **Sufficient?** | PASS | An opt-in profile gives the capability without new front-door sprawl. |
| 4 | **Fits Goal?** | PASS | This packet wants optional depth, not operator-surface explosion. |
| 5 | **Open Horizons?** | PASS | The profile can evolve later without changing the default mode. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- Deep-research skill, command, workflow assets, state docs, and agent instructions gain an explicit council profile.
- Behavior/parity tests assert that default flows remain unchanged.

**How to roll back**: Remove the council profile fields and keep the default deep-research contract untouched.

---

### ADR-005: Coordination Board State Is Packet-Local and Structured

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

Large multi-phase research runs need a coordination surface, but `CF-030` is explicitly a nice-to-have and should not drag the core loop into shared global infrastructure.

#### Constraints

- The board must remain optional and packet-local.
- It should support conflict/dedupe/resource reasoning without requiring a service or database.

#### Decision

**We chose**: a packet-local structured coordination artifact with derived human-readable views when needed.

**How it works**: The packet stores structured phase state, headline findings, conflicts, duplicate signals, and resource suggestions inside its own artifact set. Dashboards or summaries can render that state, but the packet-local structured artifact stays canonical.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Packet-local structured board** | Stays optional, auditable, git-friendly, no shared infra | Adds one more artifact to large runs | 9/10 |
| Markdown-only coordination board | Easy to read | Weak for dedupe/conflict/resource logic | 5/10 |
| Global board service/database | Powerful | Too heavy and out of scope for this packet | 2/10 |

**Why this one**: It keeps the feature aligned with the packet-local loop philosophy and avoids a premature platform detour.

#### Consequences

**What improves**:
- Large research packets can coordinate phases without hidden external state.
- Conflict and dedupe signals become explicit artifacts instead of ad hoc notes.

**What it costs**:
- Another optional artifact to document and test. Mitigation: only enable it in explicitly large-run scenarios.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The board is overused for small packets | Low | Keep it opt-in and define minimum activation criteria. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `CF-030` targets very large agentic work only. |
| 2 | **Beyond Local Maxima?** | PASS | We compared markdown-only and global-service alternatives. |
| 3 | **Sufficient?** | PASS | Packet-local structured state is enough for the intended scope. |
| 4 | **Fits Goal?** | PASS | Preserves the deep-loop packet-local philosophy. |
| 5 | **Open Horizons?** | PASS | Could later feed richer renderers without changing canonical truth. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- Deep-research state docs, strategy, workflow assets, and behavior tests define and exercise the coordination artifact.
- Dashboards or synthesis can render the board when enabled.

**How to roll back**: Remove the optional coordination artifact and render paths without affecting the default deep-research runtime.
