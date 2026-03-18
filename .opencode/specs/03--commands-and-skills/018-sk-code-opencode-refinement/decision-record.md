---
title: "Decision Record: sk-code--opencode refinement"
description: "Architecture and policy decisions for comment policy tightening, structural invariants, AI-oriented semantics, principle enforcement depth, and optional review scope."
SPECKIT_TEMPLATE_SOURCE: "decision-record + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "decision"
  - "adr"
  - "kiss dry solid"
  - "comment policy"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: sk-code--opencode refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Comment Reduction Threshold

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec owner, standards maintainer |

### Context
Current guidance permits up to five inline comments per ten lines, which still allows narrative and mechanical comments that reduce machine-parse signal quality. The refinement requires a measurable, enforceable threshold that meaningfully reduces comment noise without removing critical rationale.

### Constraints
- Threshold must stay simple enough to audit with `rg`.
- Policy must work consistently across JS, TS, Python, Shell, and Config guidance.

### Decision
**We chose**: maximum three inline comments per ten lines as the default threshold, with exceptions only for traceable requirement, bug, security, risk, or invariant rationale.

**How it works**: Shared policy text is updated first, then each language style guide mirrors the same threshold and exception model. Verification relies on explicit policy markers and language guide consistency checks.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3 comments / 10 lines (chosen)** | Stronger signal reduction, easy to verify, still practical | Requires policy updates across multiple files | 9/10 |
| Keep 5 comments / 10 lines | Minimal change effort | Too permissive, weak behavior change | 5/10 |
| 2 comments / 10 lines | Very strict and high signal density | Risk of suppressing useful rationale in complex logic | 6/10 |

**Why this one**: Three comments per ten lines is strict enough to improve parse quality and still practical for high-value rationale comments.

### Consequences

**What improves**:
- Lower inline comment noise in generated code and style examples.
- Better consistency for AI parsing across languages.

**What it costs**:
- Existing examples may need rewriting to meet threshold. Mitigation: prioritize shared policy text first and propagate uniformly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Threshold interpreted inconsistently | Medium | Add explicit examples and grep-verifiable markers in shared and language docs |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Spec REQ-003 requires stricter policy |
| 2 | Beyond Local Maxima? | PASS | Compared 5/10 and 2/10 options |
| 3 | Sufficient? | PASS | 3/10 balances enforcement and maintainability |
| 4 | Fits Goal? | PASS | Directly targets parse-noise reduction goal |
| 5 | Open Horizons? | PASS | Scales across all target language guides |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `sk-code--opencode/SKILL.md` and shared patterns define threshold and exception framing.
- Language style guides align with the same threshold and examples.

**How to roll back**: Restore threshold references to prior wording in scoped files and rerun policy assertion commands.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Preserve Numbered ALL-CAPS Section Headers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec owner, standards maintainer |

### Context
Numbered ALL-CAPS section headers are a structural invariant in current standards docs and support deterministic parsing and visual consistency. Refinement work must avoid accidental drift toward mixed-case headers.

### Constraints
- Existing taxonomy must remain recognizable to current contributors and tools.
- Preservation must be enforceable with a simple regex check.

### Decision
**We chose**: preserve the numbered ALL-CAPS convention as a non-regression invariant and add explicit checklist checks for it.

**How it works**: Shared code organization guidance codifies the invariant and language style guides retain compatible header patterns. Verification uses a header regex across shared and language files.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve ALL-CAPS numbering (chosen)** | Zero parser drift, stable visual hierarchy | Requires explicit discipline during edits | 10/10 |
| Allow mixed-case header variants | Flexible authoring | Increases structural ambiguity and drift | 4/10 |
| Remove numbered headers entirely | Simplifies writing | Breaks non-regression constraint and discoverability | 2/10 |

**Why this one**: It preserves compatibility and prevents structural regressions while adding low-cost verification.

### Consequences

**What improves**:
- Deterministic structure remains stable across all style guides.
- Reviewers get a direct non-regression check.

**What it costs**:
- Contributors must follow stricter header format. Mitigation: keep examples visible in shared docs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| One language guide drifts from format | High | Add checklist gate and regex verification over all guides |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Spec REQ-002 mandates preservation |
| 2 | Beyond Local Maxima? | PASS | Compared mixed-case and removal alternatives |
| 3 | Sufficient? | PASS | Invariant plus regex check is straightforward |
| 4 | Fits Goal? | PASS | Supports deterministic parse goals |
| 5 | Open Horizons? | PASS | Keeps future edits compatible |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Shared code organization guidance receives explicit non-regression language.
- Language guides and checklists include preservation checks.

**How to roll back**: Remove invariant checks and restore prior guidance, then rerun header verification to confirm prior baseline.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: AI-Oriented Inline Comment Semantics

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec owner, standards maintainer |

### Context
The refinement requires comment semantics optimized for AI parsing instead of narrative prose. Without explicit semantic categories, implementers may keep writing comments that describe mechanics instead of intent and constraints.

### Constraints
- Semantics must be language-agnostic but easy to map into JS, TS, Python, Shell, and JSONC examples.
- Categories must remain concise and traceable.

### Decision
**We chose**: adopt a bounded allowlist for inline comments: `WHY`, `GUARD`, `INVARIANT`, trace tags (`REQ-`, `BUG-`, `SEC-`), and risk/perf context.

**How it works**: Shared policy defines allowed categories and disallowed narrative/mechanical comments. Each language style guide includes aligned examples and references.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bounded semantic allowlist (chosen)** | Deterministic, parse-friendly, easy to audit | Requires careful wording updates | 9/10 |
| General "WHY not WHAT" guidance only | Familiar rule | Too open to interpretation | 6/10 |
| Strict prefixed taxonomy only | Very structured | May be too rigid for all contexts | 7/10 |

**Why this one**: It provides clear parsing semantics while preserving practical flexibility.

### Consequences

**What improves**:
- Higher signal-to-noise for AI parsing and review workflows.
- Consistent comment intent language across files.

**What it costs**:
- Existing examples need semantic remapping. Mitigation: update shared examples first, then language deltas.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overly rigid interpretation blocks useful context | Medium | Keep bounded exceptions for risk/perf and trace tags |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Spec REQ-004 requires parse-oriented semantics |
| 2 | Beyond Local Maxima? | PASS | Compared broad and rigid alternatives |
| 3 | Sufficient? | PASS | Allowlist is concise and enforceable |
| 4 | Fits Goal? | PASS | Directly improves AI parse clarity |
| 5 | Open Horizons? | PASS | Can extend with new tags if evidence supports |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Shared and language policy docs gain explicit semantic categories and examples.
- Checklist rules verify semantic presence and non-narrative guidance.

**How to roll back**: Revert to prior comment semantics language and remove allowlist references.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: KISS/DRY and SOLID Enforcement Depth

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec owner, standards maintainer |

### Context
Current checklists do not consistently encode KISS/DRY and full SOLID enforcement. The refinement needs explicit principle coverage at a depth that is strict enough for high-value review while still practical for shell and config domains.

### Constraints
- Universal checklist must contain complete SOLID coverage.
- Language checklists must include principle checks that match language reality.

### Decision
**We chose**: enforce full SRP/OCP/LSP/ISP/DIP in universal plus JS/TS checklists, with KISS/DRY and SRP-like practical gates in Python, Shell, and Config checklists.

**How it works**: Universal checklist defines complete architecture gates. Language checklists add direct, implementation-level phrasing appropriate to each language.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Depth-tiered enforcement (chosen)** | Balanced rigor, language-appropriate, enforceable | Requires careful checklist wording | 9/10 |
| Full SOLID everywhere equally | Uniform | Not meaningful for all procedural/config contexts | 6/10 |
| KISS/DRY only, no SOLID detail | Lightweight | Misses key architecture regression signals | 5/10 |

**Why this one**: It achieves strong architecture gates without forcing artificial abstraction checks where they do not fit.

### Consequences

**What improves**:
- Reviewers get explicit principle checks in every relevant checklist.
- Architecture quality drift becomes easier to detect consistently.

**What it costs**:
- Checklist maintenance burden increases slightly. Mitigation: keep phrasing concise and grep-verifiable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Principle wording becomes too abstract | Medium | Use pass/fail prompts and concrete anti-pattern cues |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Spec REQ-005 mandates KISS/DRY plus SOLID |
| 2 | Beyond Local Maxima? | PASS | Evaluated full-uniform and minimal options |
| 3 | Sufficient? | PASS | Tiered depth fits cross-language needs |
| 4 | Fits Goal? | PASS | Strengthens architecture quality gates |
| 5 | Open Horizons? | PASS | Supports future evolution without breaking applicability |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Universal and language checklists under `assets/checklists/` receive principle-specific checks.
- Verification commands assert marker presence and coverage.

**How to roll back**: Remove added principle checks from affected checklists and restore prior baseline wording.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Optional Scope for `sk-code--review`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec owner, review-skill maintainer |

### Context
The spec allows optional `sk-code--review` updates. Unconditional edits could create unnecessary churn, while skipping real mismatches could leave baseline-overlay drift unresolved.

### Constraints
- Optional scope must remain bounded and evidence-driven.
- Baseline findings-first behavior cannot be weakened.

### Decision
**We chose**: apply review-skill changes only when verification evidence shows a concrete mismatch between updated opencode policy and review detection language.

**How it works**: A trigger decision is recorded during verification. If no mismatch exists, pathway is marked N/A with rationale. If mismatch exists, apply minimal targeted edits only to listed optional files.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Conditional evidence-driven scope (chosen)** | Limits churn, preserves focus, still resolves gaps | Requires explicit trigger decision step | 10/10 |
| Always edit review files | Guarantees direct alignment attempt | Higher risk of unnecessary change | 6/10 |
| Never edit review files | Minimal scope | Can leave known mismatch unresolved | 5/10 |

**Why this one**: It preserves scope discipline while still allowing targeted correction when evidence justifies it.

### Consequences

**What improves**:
- Review file modifications are controlled and justified.
- Optional scope remains auditable through EVT-004.

**What it costs**:
- Additional decision step in verification. Mitigation: embed trigger rule directly in tasks and checklist.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Trigger decision is skipped | High | Make EVT-004 mandatory in global quality sweep |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Spec REQ-007 defines optional review alignment |
| 2 | Beyond Local Maxima? | PASS | Compared always/never/conditional models |
| 3 | Sufficient? | PASS | Explicit trigger plus EVT evidence is auditable |
| 4 | Fits Goal? | PASS | Preserves scope while enabling alignment |
| 5 | Open Horizons? | PASS | Supports future policy evolution with minimal churn |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Tasks include conditional review alignment step and trigger gate.
- Global quality sweep includes mandatory EVT-004 decision entry.

**How to roll back**: Revert optional review edits and mark pathway N/A with evidence if mismatch is not confirmed.
<!-- /ANCHOR:adr-005 -->
