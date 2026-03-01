---
title: "Decision Record: SpecKit Phase System [138-spec-kit-phase-system/decision-record]"
description: "The phase system needed a home in the existing SpecKit architecture. Three options existed: introduce a new Level 4 tier for \"phased\" specs, implement phases as a behavioral lay..."
trigger_phrases:
  - "decision"
  - "record"
  - "speckit"
  - "phase"
  - "system"
  - "decision record"
  - "138"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Decision Record: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Behavioral Layer vs New Level Tier

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The phase system needed a home in the existing SpecKit architecture. Three options existed: introduce a new Level 4 tier for "phased" specs, implement phases as a behavioral layer on existing levels, or build a parallel system with sharded templates. The choice determined how much we would change the template system, compose.sh, and the level progression model. Organic usage in specs 136 and 138 already showed parent L3+ specs containing child sub-folders at L1 — we needed to formalize that pattern or replace it.

### Constraints

- The existing 1/2/3/3+ level progression is documented in CLAUDE.md and must remain consistent
- compose.sh handles level assembly and must not require structural changes for phase support
- Phase metadata (parent links, handoff criteria) must be distinguishable from version metadata
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Behavioral layer on existing levels, not a new level tier.

**How it works**: Phases are implemented as a flag (`--phase`) on create.sh that injects parent back-references and a Phase Documentation Map into an existing-level spec folder. The level system (L1/L2/L3/L3+) remains unchanged. A L1 child phase inside a L3+ parent is valid and encouraged. No new template tiers are needed.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **B: Behavioral layer (chosen)** | No level progression changes; matches existing organic pattern; compose.sh unchanged | Phase metadata must be layered on top, not native to templates | 9/10 |
| A: New Level 4 tier | Native phase support in templates; explicit model | Breaks 1/2/3/3+ progression; forces compose.sh changes; over-prescribes structure | 4/10 |
| C: Parallel sharded system | Fully independent; no coupling to level system | Maintenance burden; fragmentation; two systems to learn and maintain | 3/10 |

**Why this one**: Option B scored highest because phases are about execution decomposition, not documentation depth — adding a new level would conflate two orthogonal concerns. The organic pattern in 136/138 already validates this approach.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Users can combine any documentation level with any number of phases without learning new level semantics
- No changes to compose.sh or the level template system
- Phase templates are small addendums (parent section + child header), keeping overhead minimal

**What it costs**:
- Phase detection is a separate output from recommend-level.sh (two distinct outputs instead of one). Mitigation: Document the dual-output clearly in the script's --help and in CLAUDE.md

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users confuse phases with levels when reading docs | M | Explicit callout in CLAUDE.md Gate 3 section: "Phases are not levels" |
| Phase metadata not distinguishable from version metadata at a glance | L | Mutually exclusive flags (--phase vs --subfolder) make the distinction explicit at creation time |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Specs 136 and 138 demonstrate organic phase-like usage that caused confusion without a formal model |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; Level 4 and parallel system both scored below 5/10 |
| 3 | **Sufficient?** | PASS | Behavioral layer + small addendum templates covers all identified use cases without added complexity |
| 4 | **Fits Goal?** | PASS | Goal is to formalize the organic pattern — this directly formalizes it with minimal structural change |
| 5 | **Open Horizons?** | PASS | Level system remains extensible; phase system can evolve independently without touching level templates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `create.sh` — adds `--phase` flag that injects parent back-reference and Phase Documentation Map section
- `recommend-level.sh` — adds second output: phase recommendation (boolean + score) alongside level recommendation
- Parent spec templates (L3+) — add optional Phase Documentation Map section to spec.md and plan.md

**How to roll back**: Remove the `--phase` flag handling from create.sh and the phase score output from recommend-level.sh. Existing phase folders remain valid as standard sub-folders; remove Phase Documentation Map sections from parent specs manually if desired.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Phase vs Sub-Folder Distinction

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The existing `--subfolder` flag in create.sh creates versioned iterations within a spec folder — the same scope worked on again with a different approach. The new phase concept is semantically different: decomposition of a large scope into parallel or sequential execution slices. Both produce child directories under a parent spec folder with identical directory structures (memory/, scratch/, level files). We needed to decide whether to reuse the subfolder mechanism or create a distinct flag.

### Constraints

- create.sh already has --subfolder logic and related tests
- Both versioning and phasing use the same `[0-9][0-9][0-9]-*/` numbering convention
- validate.sh --recursive must handle both without special-casing per type
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Separate flags (`--phase` vs `--subfolder`), mutually exclusive, with shared directory infrastructure.

**How it works**: Both flags create child directories under the parent spec folder using the same `[0-9][0-9][0-9]-name/` numbering and identical directory scaffolding (memory/, scratch/, level-appropriate files). The distinction is in metadata injection only: `--phase` injects parent back-references and handoff criteria; `--subfolder` does not. The flags are mutually exclusive — you cannot pass both to a single create.sh invocation.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate flags, shared infra (chosen)** | Semantic clarity at creation time; shared validation; clear distinction in metadata | Slightly more create.sh complexity (two sub-folder modes) | 9/10 |
| Reuse --subfolder for phases | No create.sh changes needed | Versioning and phasing are conflated; metadata injection ambiguous; confusing to users | 3/10 |
| New top-level command (create-phase.sh) | Maximum clarity; fully independent | Duplicates create.sh infrastructure; two scripts to maintain | 5/10 |

**Why this one**: Shared infrastructure eliminates duplication while the flag distinction enforces the semantic boundary at creation time — the point where confusion is most likely and most costly to fix later.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Users see an explicit semantic choice at creation time: version iteration vs scope decomposition
- validate.sh --recursive treats both identically — no special-casing needed in the validation layer
- Phase-specific metadata (parent links, handoff criteria) is only present in --phase created folders, making it unambiguous

**What it costs**:
- create.sh has two sub-folder modes with different metadata injection paths. Mitigation: Extract shared scaffolding into a helper function; keep phase vs subfolder logic in thin conditional branches

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| User passes wrong flag and gets wrong metadata | M | Clear --help text; validate.sh can detect missing parent link in phase-intended folders and warn |
| A folder created with --subfolder is actually a phase and lacks metadata | L | Document manual promotion: add parent link and Phase Documentation Map section to existing subfolder |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without distinction, versioning and phasing produce identical artifacts — impossible to tell apart after the fact |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; reuse of --subfolder rejected due to semantic conflation |
| 3 | **Sufficient?** | PASS | Separate flags + shared scaffolding covers the full use case without a new top-level command |
| 4 | **Fits Goal?** | PASS | Goal is a formalized phase system — explicit flag is the minimum viable signal for the distinction |
| 5 | **Open Horizons?** | PASS | Shared infrastructure keeps the door open for future flag combinations (e.g., --phase --level 2) |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `create.sh` — adds `--phase` flag, makes it mutually exclusive with `--subfolder`, extracts shared scaffolding into internal helper, adds phase metadata injection branch
- `validate.sh` — no changes needed; --recursive already handles nested folders identically

**How to roll back**: Remove the `--phase` flag and its metadata injection from create.sh. Existing phase folders remain valid sub-folders; remove parent link sections manually if desired. Shared scaffolding helper can remain in place.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Conservative Phase Detection Thresholds

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |

---

### Context

recommend-level.sh needs a threshold to decide when to suggest phases. The threshold could be aggressive (suggest phases for any L2+ task) or conservative (only for clearly large, complex tasks). Over-suggestion degrades the UX for the common case — the majority of tasks are straightforward and phases add overhead without benefit. Under-suggestion means large tasks miss the guidance, but users can always invoke /spec_kit:phase manually.

### Constraints

- The scoring system uses a 50-point scale derived from LOC, file count, risk factors, and integration complexity
- Phase suggestion must not appear for routine L2 tasks (100-499 LOC, few files)
- Threshold must be validated against real historical specs before shipping
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Conservative thresholds — phase score >= 25/50 AND documentation level >= 3.

**How it works**: recommend-level.sh computes a phase score (0-50) alongside the level recommendation. A phase suggestion fires only when both conditions are met: score >= 25 and recommended level is L3 or L3+. The threshold is configurable via --phase-threshold flag and a .speckit.yaml project override, so teams can adjust without modifying the script.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Conservative: score >= 25 AND level >= 3 (chosen)** | Validated against 136/138 retrospective; captures genuine complex tasks; rejects routine L2 | May under-suggest for borderline tasks in the 20-25 range | 9/10 |
| Aggressive: score >= 15 OR level >= 2 | More discoverable; catches borderline cases | High false positive rate; phase suggestion becomes noise; degrades common case UX | 4/10 |
| Fixed LOC only (>= 500 LOC) | Simple; easy to explain | Misses high-file-count or high-risk tasks with moderate LOC; ignores integration complexity | 5/10 |

**Why this one**: Retrospective validation confirmed the 25/50 threshold captures the two known real-world cases (spec 136: ~45/50, spec 138: ~35/50) while rejecting a typical L2 feature (~10/50). Conservative is better than aggressive because users can always escalate manually.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Estimated 80%+ of tasks will not trigger a phase suggestion, keeping the common case fast
- Users working on genuinely complex tasks get proactive guidance at the right moment
- False positive rate expected below 10% based on retrospective scoring of known specs

**What it costs**:
- Borderline tasks in the 20-25 score range will not get a phase suggestion. Mitigation: Document /spec_kit:phase as always available; mention it in Gate 3 help text

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scoring model diverges from real task complexity over time | M | Review threshold after 10 new L3+ specs; adjust via .speckit.yaml if needed |
| Users unaware phases exist for their borderline task | L | Gate 3 help text always mentions /spec_kit:phase as an option regardless of threshold |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a threshold, phase suggestion either fires too often (noise) or never (useless) |
| 2 | **Beyond Local Maxima?** | PASS | Three threshold strategies evaluated; aggressive and LOC-only both rejected with clear reasoning |
| 3 | **Sufficient?** | PASS | 25/50 AND level >= 3 covers all known real cases and provides a configurable escape hatch |
| 4 | **Fits Goal?** | PASS | Goal is proactive guidance for genuinely complex tasks — conservative threshold targets exactly that |
| 5 | **Open Horizons?** | PASS | Configurable via flag and .speckit.yaml; threshold can evolve without code changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `recommend-level.sh` — adds phase scoring algorithm (50-point scale), phase threshold check (>= 25 AND level >= 3), second output line for phase recommendation
- `.speckit.yaml` schema — adds `phase-threshold` override key (integer, default 25)
- `create.sh` — reads phase recommendation from recommend-level.sh when invoked without explicit flags

**How to roll back**: Remove the phase scoring block and second output line from recommend-level.sh. Remove phase-threshold from .speckit.yaml schema. create.sh reverts to level-only recommendation input.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Default Child Phase Level

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |

---

### Context

When `--phase` creates child spec folders, each child needs a documentation level. The parent is typically L3+, but children represent bounded scope slices — a foundation phase, an implementation phase, an integration phase. A child phase inherits the parent's overall risk context but has a much smaller scope. Defaulting to L3+ for all children would be prohibitively expensive in documentation overhead (~1075 lines per child). Defaulting too low risks under-documenting complex phases.

### Constraints

- L1 template: ~455 lines; L3+ template: ~1075 lines
- A typical phase scope is 100-300 LOC across 3-8 files
- The parent L3+ spec already covers full governance, risk matrix, and architectural decisions for the entire feature
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Children default to Level 1, with `--child-level N` override for individual phases that warrant higher documentation.

**How it works**: When create.sh receives `--phase`, it scaffolds child folders at L1 unless `--child-level N` is also passed. The parent's Phase Documentation Map in spec.md and plan.md serves as the single source of truth for cross-phase coordination, dependencies, and handoff criteria. Individual phase escalation (`--child-level 2` or `--child-level 3`) is available when a specific phase has its own risk matrix or QA requirements.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Default L1 with --child-level override (chosen)** | Minimal overhead per phase; parent already has full docs; override available for complex phases | Users must remember to escalate when a phase is unexpectedly complex | 9/10 |
| Default L2 for all children | Adds checklist coverage for each phase | Doubles documentation overhead per phase for no average benefit; parent's checklist already covers the scope | 5/10 |
| Inherit parent level (L3+) for all children | Maximum coverage | ~1075 lines per child; context window pressure; defeats purpose of decomposition | 2/10 |
| Let user pick at creation time | Maximum control | Adds friction to every phase creation; most users will pick L1 anyway | 6/10 |

**Why this one**: L1 is the lightest template that still provides structured documentation (spec, plan, tasks). The parent's Phase Documentation Map handles cross-phase coordination. Documentation overhead per phase drops from ~1075 lines (L3+) to ~455 lines (L1) — a 57% reduction per child.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Documentation overhead per phase is ~455 lines vs ~1075 lines for L3+ — reduces context window pressure significantly
- Users can escalate individual phases without touching other phases: `create.sh --subfolder --level 2` on an existing phase folder
- Parent's Phase Documentation Map remains the single coordination point, avoiding duplication across child docs

**What it costs**:
- A complex phase that genuinely needs L2+ may start at L1 if the user forgets to pass --child-level. Mitigation: validate.sh can warn if a phase folder's actual implementation summary suggests scope beyond L1 (heuristic: file count or LOC in tasks.md)

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex phase under-documented at L1 | M | --child-level flag prominently documented; validate.sh heuristic warning for over-scope L1 phases |
| User escalates a child mid-implementation and template structure is incomplete | L | Document the escalation path: copy missing template sections from level_2/ or level_3/ as needed |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a default, every phase creation requires an explicit level decision — adds friction to the common case |
| 2 | **Beyond Local Maxima?** | PASS | Four options evaluated; L2 default and L3+ inherit both rejected on overhead grounds |
| 3 | **Sufficient?** | PASS | L1 provides spec/plan/tasks — sufficient for a bounded scope slice with a parent L3+ for context |
| 4 | **Fits Goal?** | PASS | Goal is to reduce phase creation friction; L1 default with override achieves this |
| 5 | **Open Horizons?** | PASS | --child-level flag and mid-implementation escalation path keep all options open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `create.sh` — `--phase` flag defaults child level to 1; adds `--child-level N` flag for override; passes level to template scaffolding for the child folder
- `validate.sh` — adds heuristic warning when a phase folder's tasks.md suggests scope beyond L1 (optional, non-blocking)

**How to roll back**: Remove `--child-level` flag from create.sh. Existing child phase folders at L1 remain valid; no structural changes needed. validate.sh heuristic can be disabled with a flag or removed entirely.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Gate 3 Option E Contextual Display

<!-- ANCHOR:adr-005-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |

---

### Context

Gate 3 in CLAUDE.md currently presents four options: A (existing spec), B (new spec), C (update related), D (skip). Adding a 5th option — E: "Add phase to existing spec" — supports the phase system but increases cognitive load for every Gate 3 interaction. The vast majority of Gate 3 interactions are for tasks where phases are irrelevant. We needed to decide whether to always show 5 options or display Option E conditionally.

### Constraints

- Gate 3 is triggered on every file modification request — it must remain fast and low-friction for simple tasks
- AI agents must be able to detect the display conditions programmatically without ambiguity
- /spec_kit:phase must remain discoverable even when Option E is not shown
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Option E shown only when at least one of three conditions is met: (1) an existing spec folder is detected with high complexity markers, (2) the user's task description contains phase-related keywords, or (3) recommend-level.sh --recommend-phases returns true.

**How it works**: Before rendering the Gate 3 prompt, the agent evaluates the three display conditions. If any condition is true, Option E is appended to the standard four options. If no condition is true, Gate 3 renders with the standard four options unchanged. The /spec_kit:phase command is always available regardless of whether Option E is shown.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Contextual display (chosen)** | Simple case stays fast (4 options); complex case gets guided discovery; programmatically deterministic | Slightly more complex Gate 3 prompt rendering logic; users may not know E exists if conditions are never met | 8/10 |
| Always show 5 options | Maximum discoverability; simplest logic | Adds cognitive load to every Gate 3 interaction; phases irrelevant for ~80% of tasks; slows common case | 5/10 |
| Remove Option E entirely, use /spec_kit:phase only | No Gate 3 changes needed | Phases only discoverable if user knows the command; no proactive guidance | 4/10 |

**Why this one**: Contextual display keeps the simple case simple (4 options, fast decision) while making phases discoverable at the exact moment they are relevant. The three trigger conditions are deterministic and can be evaluated programmatically by AI agents.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Gate 3 remains a fast 4-option decision for the ~80% of tasks where phases are irrelevant
- Users working on complex tasks get Option E surfaced proactively at the right moment
- /spec_kit:phase provides a fallback for discovery independent of Gate 3

**What it costs**:
- Gate 3 prompt logic becomes more complex — must evaluate three display conditions before rendering. Mitigation: Extract condition evaluation into a helper function or checklist in CLAUDE.md so it is clear and auditable
- Risk: users may not discover phases if the three conditions are never met for their workflow. Mitigation: CLAUDE.md Gate 3 section includes a note that /spec_kit:phase is always available

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Display conditions are ambiguous and AI agents evaluate them inconsistently | H | Define each condition precisely in CLAUDE.md with examples; include keyword list for condition 2 |
| User needs phases but sees only 4 options and misses the capability | M | CLAUDE.md Gate 3 section explicitly mentions /spec_kit:phase; Option E note in Gate 3 help text |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Always showing 5 options degrades Gate 3 UX for the majority of interactions where phases are irrelevant |
| 2 | **Beyond Local Maxima?** | PASS | Three display strategies evaluated; always-show and command-only both rejected with clear reasoning |
| 3 | **Sufficient?** | PASS | Three deterministic display conditions cover the known discovery paths without requiring user knowledge |
| 4 | **Fits Goal?** | PASS | Goal is discoverable phases without degrading the common case — contextual display achieves both |
| 5 | **Open Horizons?** | PASS | Display conditions can be extended in CLAUDE.md without code changes; /spec_kit:phase always available as fallback |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `CLAUDE.md` Gate 3 section — adds Option E definition, three display conditions with examples, keyword list for condition 2, note that /spec_kit:phase is always available
- `CLAUDE.md` Gate 3 section — documents the agent evaluation logic for condition checks before rendering the prompt

**How to roll back**: Remove Option E definition and display condition logic from CLAUDE.md Gate 3 section. /spec_kit:phase command remains available independently. No script changes needed.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

## SESSION DECISION LOG

| # | Decision | Rationale | Timestamp |
|---|----------|-----------|-----------|
| 1 | Phases are behavioral, not a new level | Preserves clean level progression; matches organic pattern | 2026-02-20 |
| 2 | --phase and --subfolder are mutually exclusive | Semantic clarity: decomposition vs iteration | 2026-02-20 |
| 3 | Conservative thresholds (25/50 + Level >= 3) | Avoid over-suggestion; validated against 136/138 retrospective | 2026-02-20 |
| 4 | Default child level is L1 | Reduces overhead; parent has full docs; children are focused slices | 2026-02-20 |
| 5 | Gate 3 Option E is contextually shown | Keep simple case fast; complex case discoverable | 2026-02-20 |

<!--
Level 3+ Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
State decisions with certainty. Be honest about trade-offs.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
