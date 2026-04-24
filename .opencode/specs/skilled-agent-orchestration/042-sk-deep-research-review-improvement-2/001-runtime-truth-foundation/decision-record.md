---
title: "Dec [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record]"
description: "Architecture decisions for stop reasons, claim-verification storage, dashboard generation, council synthesis, and coordination-board state."
trigger_phrases:
  - "042"
  - "decision record"
  - "stop reason taxonomy"
  - "claim ledger"
  - "council synthesis"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
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
| **Status** | Accepted |
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
| **Status** | Accepted |
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
| **Status** | Accepted |
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
| **Status** | Accepted |
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
| **Status** | Accepted |
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

---

### ADR-006: Reducer Snapshot and Compaction Strategy

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

The research pass found that deep-research still reparses full iteration markdown and rewrites derived artifacts on each reducer run, which will degrade badly on 100+ iteration packets. We need a durability strategy that keeps append-only truth while making replay and reducer regeneration affordable.

#### Constraints

- The authoritative lineage must remain packet-local and replayable.
- Compaction cannot hide evidence needed for dashboards, stop-decision traces, or recovery.

#### Decision

**We chose**: delta replay plus periodic packet snapshots and compaction, with compaction triggered by explicit thresholds such as run count or JSONL size.

**How it works**: Append-only events remain canonical. Reducers consume only the latest delta after a trusted snapshot, while replay validation confirms that post-compaction outputs match a full replay. Trigger policy stays configurable so we can tune by run count, JSONL size, or both without changing the contract.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delta replay + periodic snapshots/compaction** | Preserves lineage truth, scales long packets, supports replay validation | Adds snapshot lifecycle and equivalence testing | 9/10 |
| Full replay on every reducer run | Simplest conceptual model | Degrades with packet size, expensive for 100+ iterations | 4/10 |
| Keep only latest reduced state, drop historical replay | Fast reducer path | Breaks auditability and replay confidence | 3/10 |

**Why this one**: It separates authoritative state from derived views without abandoning packet-local durability.

#### Consequences

**What improves**:
- Long packets stay reducer-friendly.
- Replay tests can compare pre- and post-compaction outputs deterministically.

**What it costs**:
- Snapshot lifecycle, equivalence checks, and compaction triggers must be documented and tested together. Mitigation: make replay validation part of the compaction contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Compaction accidentally drops recoverable lineage detail | High | Keep append-only truth canonical and block compaction finalization until replay equivalence passes. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Iteration 1 and Recommendation 1 explicitly call out reducer scale risk. |
| 2 | **Beyond Local Maxima?** | PASS | We compared full replay and reduced-state-only shortcuts. |
| 3 | **Sufficient?** | PASS | Delta replay plus snapshots covers scale without sacrificing packet-local truth. |
| 4 | **Fits Goal?** | PASS | Runtime durability is now a core packet goal. |
| 5 | **Open Horizons?** | PASS | Leaves room for future threshold tuning and offline optimization. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- Config/state docs, reducer logic, dashboards, and workflow assets define snapshot metadata, compaction triggers, and replay validation.
- Reducer/schema tests add equivalence coverage for invalid-state, resume, completed-continue, and compaction cases.

**How to roll back**: Disable snapshot/compaction triggers, restore full replay, and remove compaction-specific test and dashboard surfaces.
---

### ADR-007: Behavioral Testing Moves Forward in the Delivery Order

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

The original packet placed behavior-first testing after most runtime changes. The research pass found that this leaves early contract work underprotected, especially for replay, invalid-state handling, blocked-stop behavior, and reducer durability.

#### Constraints

- Early tests must not block on final parity-copy surfaces.
- The harness must stay thin enough to evolve with substrate work rather than ossifying wording.

#### Decision

**We chose**: start behavior/replay harness work immediately after Phase 1 contracts stabilize, and keep it running ahead of later substrate and trust-surface changes.

**How it works**: Phase 3 begins once the typed event schema exists. Thin replay fixtures and end-to-end harnesses are added early, then expanded as Phase 2a and 2b land. Parity alignment remains later, but it inherits a tested contract instead of defining one by prose alone.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move behavior/replay harnesses earlier** | Protects contract work, catches substrate drift sooner, supports replay corpus growth | Requires parallel coordination with active runtime changes | 9/10 |
| Keep behavior tests after most runtime work | Simpler sequencing | Leaves early contracts unguarded and delays replay confidence | 4/10 |
| Rely on parity/schema tests only | Fastest to wire | Misses runtime behavior and replay regressions | 5/10 |

**Why this one**: Replay tests are the bridge between reducer correctness and workflow correctness, so they need to arrive early enough to matter.

#### Consequences

**What improves**:
- Phase 2a and 2b work lands under behavior pressure instead of prose-only plans.
- Replay corpus investment starts early and compounds through the packet.

**What it costs**:
- More coordination across phases. Mitigation: keep the first harnesses thin and contract-oriented.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Early tests overfit unstable wording instead of stable contract signals | Medium | Prefer fixture semantics, typed fields, and reducer outputs over brittle text snapshots. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The research explicitly flags behavioral testing as too late in the current order. |
| 2 | **Beyond Local Maxima?** | PASS | We compared late testing and parity-only alternatives. |
| 3 | **Sufficient?** | PASS | Thin early harnesses plus later expansion match the packet's scope. |
| 4 | **Fits Goal?** | PASS | Better runtime truth requires earlier executable proofs. |
| 5 | **Open Horizons?** | PASS | Replay corpora can later feed offline optimizer work. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- The plan and tasks move replay corpus and behavioral harness creation ahead of parity lock.
- Behavioral suites gain invalid-state, resume, completed-continue, blocked-stop, and compaction-equivalence fixtures before optional-mode coverage expands.

**How to roll back**: Move the harness tasks back behind parity alignment and keep only schema/parity suites as the interim guardrail.
---

### ADR-008: Semantic Convergence Uses a Typed Decision Trace

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

Current convergence is stronger than threshold-only math, but it is still mostly statistical plus coverage-based. The research pass showed that large packets need semantic novelty, contradiction density, and citation overlap to explain why the workflow decided to stop or continue.

#### Constraints

- The result must stay packet-local and replayable.
- Semantic signals must complement, not replace, legal done gates and coverage rules.

#### Decision

**We chose**: a typed stop-decision trace that records semantic novelty, contradiction density, citation overlap, and blocked-stop details alongside the existing statistical signals.

**How it works**: Convergence remains multi-signal, but instead of collapsing meaning into a single score, the runtime records which semantic signals supported or blocked STOP. This keeps dashboards and recovery traces auditable and helps future tuning without inventing a hidden controller.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Typed semantic decision trace** | Auditable, replayable, good debugging surface, supports future tuning | More schema fields and dashboard sections to maintain | 9/10 |
| Scalar-only convergence score | Compact and easy to compare | Hides why STOP happened and why it was blocked | 4/10 |
| Human-written semantic notes only | Flexible prose | Not machine-checkable, weak for replay and testing | 5/10 |

**Why this one**: The workflow problem is no longer "what score did we get?" but "why did the workflow decide that?"

#### Consequences

**What improves**:
- Operators can inspect semantic reasons for stop, continue, or recovery.
- Contradiction-heavy packets stay visibly unsettled instead of looking converged by accident.

**What it costs**:
- Reducers, dashboards, and state docs need new typed fields. Mitigation: keep the first version packet-local and bounded to a small signal set.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Semantic signals become too expensive or fuzzy to trust | Medium | Start with packet-local heuristics and make unknown/unsupported states explicit. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Iteration 2 and Recommendation 5 call out the semantic gap directly. |
| 2 | **Beyond Local Maxima?** | PASS | We compared scalar-only and prose-only options. |
| 3 | **Sufficient?** | PASS | A typed trace adds explanation without replacing current legal gates. |
| 4 | **Fits Goal?** | PASS | The packet is about better-explained runtime truth. |
| 5 | **Open Horizons?** | PASS | Typed traces can later feed offline optimizer work. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- Convergence docs, workflow assets, dashboards, reducers, and tests define novelty, contradiction, and citation-overlap fields plus blocked-stop explanations.
- Behavioral fixtures prove that semantic contradictions can keep STOP blocked even when scalar novelty is low.

**How to roll back**: Remove the semantic trace fields and revert to the prior statistical-plus-coverage signals while keeping the legal done gate intact.
---

### ADR-009: Recovery Uses a Five-Tier Ladder With Provenance

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

Recovery behavior exists in both loops, but it is still relatively shallow and under-instrumented. The research pass argues that recovery is its own optimization surface and should leave provenance that later controller tuning can learn from.

#### Constraints

- Recovery must stay explicit and packet-local.
- The ladder cannot become an excuse to keep a failed run alive indefinitely.

#### Decision

**We chose**: a staged five-tier recovery ladder with provenance captured at each step.

**How it works**: Recovery escalates through five bounded tiers: query reformulation, authority/source diversification, decomposition or clustering, contradiction-resolution/adjudication, and graceful partial closeout. Each tier records why it was selected, what changed, and whether it helped so later replay or offline tuning can learn from it.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Five-tier recovery ladder with provenance** | Clear escalation path, auditable, replay-friendly, useful for later tuning | More structured recovery events to maintain | 9/10 |
| Single generic recovery branch | Simple | Too little diagnostic value, weak learning surface | 4/10 |
| Immediate human escalation after one failed retry | Safe for critical cases | Gives up too early and loses autonomous recovery signal | 5/10 |

**Why this one**: It makes recovery measurable without hiding it behind opaque controller magic.

#### Consequences

**What improves**:
- Recovery choices become understandable and comparable across packets.
- Later offline tuning can learn from which ladders actually helped.

**What it costs**:
- More recovery metadata in journals and dashboards. Mitigation: keep the first ladder compact and packet-local.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Recovery escalates too far instead of stopping honestly | Medium | Keep explicit abort/partial-closeout criteria in the fifth tier and expose them in the stop-decision trace. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Iteration 3 identifies recovery as a first-class optimization surface. |
| 2 | **Beyond Local Maxima?** | PASS | We compared one-branch recovery and early human-only escalation. |
| 3 | **Sufficient?** | PASS | Five tiers cover the main recovery classes without inventing a new controller product. |
| 4 | **Fits Goal?** | PASS | Better workflow explainability includes recovery explainability. |
| 5 | **Open Horizons?** | PASS | Provenance can later feed offline compiler/optimizer work. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- Loop protocol, state schema, journals, dashboards, and behavioral fixtures define the five recovery tiers and their provenance fields.
- Stop-decision traces reference the final recovery tier used before STOP, continue, or partial closeout.

**How to roll back**: Collapse back to the current smaller recovery set and remove ladder-tier provenance fields from the packet contracts.

---

### ADR-010: Journals and Ledgers Stay Separate Packet-Local Append-Only Artifacts

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

#### Context

This packet now needs both provenance-oriented journals and verification-oriented ledgers. They are related, but they serve different access patterns and lifecycle needs. If we overload the iteration JSONL stream or hide them inside a hand-edited strategy document, replay, auditing, and reducer ownership all become less clear.

#### Constraints

- Journals and ledgers must stay packet-local and append-only.
- Iteration JSONL should remain focused on iteration events rather than turning into a catch-all container.
- Machine-owned verification state should not depend on hand-edited markdown sections.

#### Decision

**We chose**: journals and ledgers are separate packet-local append-only files, not embedded in iteration JSONL.

**How it works**: Iteration JSONL continues to record iteration events. Journals capture provenance and recovery/audit traces in their own append-only artifact. Ledgers capture verification state transitions in their own append-only artifact. Reducers and dashboards can summarize all three surfaces, but each artifact keeps one clear job.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate packet-local append-only journals and ledgers** | Clean separation of concerns, clearer replay, better reducer ownership, easier audit access patterns | Adds two explicit artifact contracts to maintain | 9/10 |
| Embed journals and ledgers in iteration JSONL | Single file surface | Overloads the event stream, blurs artifact purpose, harder replay and tooling ergonomics | 4/10 |
| Embed journals and ledgers in a hand-edited strategy document | Human-visible location | Not append-only, conflicts with reducer-owned sections, weak machine contract | 3/10 |

**Why this one**: JSONL should stay focused on iteration events. Provenance concerns and verification-state concerns need different append-only artifacts so replay and auditability stay explicit.

#### Consequences

**What improves**:
- Packet replay can reason about iteration events, provenance, and verification state separately.
- Reducer ownership stays clearer because journals and ledgers no longer compete with hand-edited strategy sections.

**What it costs**:
- More artifact paths to document and validate. Mitigation: keep the contracts packet-local, append-only, and parity-tested.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Artifact boundaries drift and create duplicate state | Medium | Define one canonical purpose per artifact and enforce it with reducer/parity coverage. |

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet now needs separate provenance and verification surfaces without overloading iteration JSONL. |
| 2 | **Beyond Local Maxima?** | PASS | We compared embedding in JSONL and embedding in a hand-edited strategy document. |
| 3 | **Sufficient?** | PASS | Separate append-only files preserve auditability while keeping reducers straightforward. |
| 4 | **Fits Goal?** | PASS | Runtime truth depends on clear artifact ownership and replayable state. |
| 5 | **Open Horizons?** | PASS | Separate artifacts leave room for richer dashboards and replay tooling later. |

**Checks Summary**: 5/5 PASS

#### Implementation

**What changes**:
- State-format, loop-protocol, reducer, and dashboard docs define journals and ledgers as separate packet-local append-only artifacts.
- Behavioral and parity coverage assert that iteration JSONL remains focused on iteration events while journals and ledgers own their respective concerns.

**How to roll back**: Remove the separate artifact contracts and fold the data back into the prior single-surface approach, accepting the loss of clear artifact boundaries.
