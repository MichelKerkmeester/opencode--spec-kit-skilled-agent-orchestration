---
title: "Decision Record: CLI Testing Playbooks"
description: "ADRs for spec 048 — shared category taxonomy, per-CLI feature ID prefixes, per-CLI category counts, cross-AI handback isolation, and command-driven generation."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
trigger_phrases:
  - "048 adr"
  - "cli playbook adr"
  - "cli playbook taxonomy"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/048-cli-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Drafted ADR-001 through ADR-005"
    next_safe_action: "Freeze ADRs before Wave 1 dispatch"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000048"
      session_id: "048-adrs-init"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---

# Decision Record: CLI Testing Playbooks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---
<!-- ANCHOR:adr-001 -->
## ADR-001: Shared Category Taxonomy Across All 5 CLI Playbooks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-26 |
| **Deciders** | spec author + plan-mode review |

---

### Context

Five CLI orchestrator skills will each ship their own `manual_testing_playbook/`. Operators move between CLIs frequently — comparing how `cli-codex` handles agent routing versus how `cli-opencode` does it, or running the same prompt-template scenario against multiple CLIs. If each playbook invents its own category numbering, the 5 packages become 5 different navigation surfaces and cross-CLI workflows fragment.

### Constraints

- Each CLI has a different feature surface (model count, sandbox modes, agent rosters), so categories cannot be identical across all five.
- The canonical sk-doc contract uses `NN--category-name` numbering and the validator does not enforce taxonomy consistency.
- The system-spec-kit reference playbook drifted to 22 categories with little cross-skill alignment, but it is a single skill — the multi-CLI case is new.

---

### Decision

**We chose**: An invariant subset of three categories (`01--cli-invocation`, `06--integration-patterns`, `07--prompt-templates`) appears in the same numeric position in all 5 CLI playbooks; CLI-specific categories slot between 02–05 and append from 08+.

**How it works**: Every CLI playbook starts with `01--cli-invocation` (base flag/model/output-format scenarios), uses `06--integration-patterns` for cross-AI delegation patterns, and uses `07--prompt-templates` for template + CLEAR-card scenarios. Categories 02–05 and 08+ vary per CLI and reflect that CLI's unique surface.

**Clarification (content shape contract)**: The invariant is the NAME and POSITION of categories 01, 06, and 07 across all 5 playbooks. The CONTENT shape inside each invariant category is per-CLI specific to honor real surface differences. Category `06--integration-patterns` is the canonical example: cli-claude-code's category 06 covers cross-AI delegation through file IO and JSON envelopes, while cli-opencode's category 06 covers cross-AI handback via session resume and shared state. Both honor the integration-patterns invariant by name and position, but the per-feature scenarios under each are scoped to that CLI's actual integration surface. Operators navigating across CLIs find the right category by position; the scenarios within reflect what that CLI can actually do.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Invariant 01/06/07 + CLI-specific middle/tail** | Predictable navigation; allows per-CLI specialization; matches sibling intent | Requires manual review to enforce; some CLIs (cli-gemini) have a numeric gap at 05 | 9/10 |
| Fully invariant taxonomy across all CLIs | Maximum consistency | Forces synthetic categories where the CLI has no relevant features (e.g. cli-gemini has no session-continuity surface) | 4/10 |
| No invariants — each CLI invents its own taxonomy | Maximum freedom per CLI | Cross-CLI navigation becomes manual relearning every time | 3/10 |

**Why this one**: The 3-invariant approach captures the user's most common cross-CLI tasks (invocation comparison, integration-pattern reuse, template reuse) without forcing taxonomy symmetry where the underlying CLIs are genuinely different.

---

### Consequences

**What improves**:
- Operators learn the playbook structure once and apply it to all 5 CLIs
- Cross-CLI prompt-template scenarios can be cross-referenced by category number (always 07)
- Future CLI playbooks (e.g. a hypothetical 6th CLI) inherit the same invariants without taxonomy negotiation

**What it costs**:
- Manual review needed during Wave 1 and Wave 2 to enforce invariants — validator does not catch this. Mitigation: invariants are P0 in checklist.md (CHK-040/041/042).
- Some CLIs have a numbering gap (e.g. cli-gemini omits 05). Mitigation: gap documented inline in the playbook.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wave 2 dispatcher (@write) drifts from invariants because it doesn't read this ADR | M | @write brief explicitly lists category schema from plan.md §4 |
| Future CLI playbook ignores invariants | L | This ADR shipped in spec folder + linked from spec.md as cross-reference |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 5 playbooks without shared invariants would fragment cross-CLI operator workflows |
| 2 | **Beyond Local Maxima?** | PASS | Considered fully invariant + no invariants; chose the middle path |
| 3 | **Sufficient?** | PASS | 3 invariants cover the common cross-CLI tasks without over-constraining CLI-specific space |
| 4 | **Fits Goal?** | PASS | Cross-CLI navigability is in the spec success criteria |
| 5 | **Open Horizons?** | PASS | Future CLI playbooks inherit the invariants automatically |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- plan.md §4 lists per-CLI category schemas honoring the invariants
- checklist.md CHK-040/041/042 enforce invariants as P0
- @write dispatch briefs include the per-CLI category list verbatim

**How to roll back**: Remove invariant constraints from checklist.md and update plan.md to allow free-form taxonomy per CLI; existing playbooks need not change.
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Per-CLI Feature ID Prefixes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-26 |
| **Deciders** | spec author |

---

### Context

Per-feature files have a Feature ID in their frontmatter and in the root playbook's cross-reference index. The system-spec-kit playbook drifted from prefix-based IDs (`EX-001`) to inline numeric IDs (`199`) over time. mcp-coco-index uses `CCC-` prefixes. With 5 CLI playbooks shipping simultaneously, ID collisions become possible if two playbooks both use inline numeric IDs starting at 001.

### Constraints

- Templates allow either prefix-based or inline numeric IDs; both are valid.
- Operators may copy/paste IDs across notes; collision-free IDs reduce confusion.
- Prefix should be short (2-3 letters) to keep tables compact.

---

### Decision

**We chose**: Each CLI playbook uses a distinct 2-letter prefix derived from the CLI name: `CC-` (cli-claude-code), `CX-` (cli-codex), `CP-` (cli-copilot), `CG-` (cli-gemini), `CO-` (cli-opencode).

**How it works**: Per-feature file frontmatter uses `title: "CC-001 -- {Feature Name}"`; root cross-reference index uses `| CC-001 | {Feature Name} | ... |`; per-feature filename uses the slug pattern 001-feature-slug, ending in .md.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-CLI 2-letter prefix** | Collision-free across 5 playbooks; compact in tables | Requires per-CLI specification | 9/10 |
| Inline numeric IDs (no prefix) | Simplest, matches recent system-spec-kit drift | Cross-playbook collisions when discussing scenarios | 4/10 |
| Full CLI name as prefix (`CLAUDE-001`) | Maximum clarity | Bloats tables and frontmatter | 5/10 |

**Why this one**: 2-letter prefixes balance compactness and disambiguation. CC/CX/CP/CG/CO are visually distinct (no two share the same second letter except by coincidence — they don't here).

---

### Consequences

**What improves**:
- IDs are unambiguous across the 5 playbooks
- Future updates can extend any prefix without renumbering others

**What it costs**:
- Slight overhead vs inline-numeric: 4 chars per ID instead of 3
- Operators must remember which prefix maps to which CLI (mitigated by the spec.md table)

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wave dispatcher uses wrong prefix | L | Plan.md §4 table specifies prefix per CLI |
| Future CLI playbook collides with existing prefix | L | Reserved prefixes documented; new CLI must pick a different 2-letter combo |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 5 playbooks with overlapping numeric IDs would create real cross-CLI confusion |
| 2 | **Beyond Local Maxima?** | PASS | Considered no-prefix and full-name-prefix |
| 3 | **Sufficient?** | PASS | 2 chars sufficient to disambiguate 5 playbooks |
| 4 | **Fits Goal?** | PASS | Spec success criteria include cross-CLI consistency |
| 5 | **Open Horizons?** | PASS | Reserves space for future CLIs |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- plan.md §4 specifies prefix per CLI
- checklist.md CHK-043 confirms prefix usage
- @write dispatch briefs specify prefix verbatim

**How to roll back**: Migrate per-feature files and root cross-reference index to inline numeric IDs; one playbook at a time.

---

## ADR-003: Per-CLI Category Counts (6/7/8/8/9)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-26 |
| **Deciders** | spec author |

---

### Context

The 5 CLIs vary in feature surface complexity. cli-gemini is the simplest (~15-18 testable features), cli-opencode is the most complex (~28-32 testable features with 3 distinct use cases). Forcing all 5 to the same category count would either over-fragment the simpler CLIs or under-cover the complex ones.

### Constraints

- Sibling system-spec-kit playbook averages ~14 per-feature files per category.
- mcp-coco-index averages ~3.3 per category.
- Categories should hold ~2-5 per-feature files each to remain navigable.

---

### Decision

**We chose**: Per-CLI category counts of 6 (cli-gemini), 7 (cli-claude-code), 8 (cli-codex, cli-copilot), 9 (cli-opencode), with each category holding ~2-5 per-feature files.

**How it works**: plan.md §4 specifies the exact category list per CLI. Categories 01/06/07 are invariant per ADR-001; the remaining slots reflect per-CLI surface.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-CLI count tuned to feature surface** | Right-sizes navigation; each category densely populated | Requires per-CLI design | 9/10 |
| Uniform 7 categories | Symmetric | Forces synthetic categories for cli-gemini, under-covers cli-opencode | 4/10 |
| Uniform 9 categories | Maximum coverage | Under-populates simpler CLIs | 5/10 |

**Why this one**: Per-CLI sizing keeps every category densely populated and reflects honest CLI complexity rather than forcing artificial symmetry.

---

### Consequences

**What improves**: Each playbook is right-sized; no synthetic or under-populated categories.

**What it costs**: Per-CLI design overhead during Wave dispatch briefing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wave dispatcher exceeds target file count | L | plan.md §4 caps each CLI at upper bound |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Symmetric counts would distort coverage |
| 2 | **Beyond Local Maxima?** | PASS | Considered uniform 7 and uniform 9 |
| 3 | **Sufficient?** | PASS | Reflects actual CLI complexity |
| 4 | **Fits Goal?** | PASS | Each playbook navigable, each category dense |
| 5 | **Open Horizons?** | PASS | Categories can grow within each playbook over time |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: plan.md §4 specifies per-CLI categories.

**How to roll back**: Re-architect a playbook by collapsing/splitting categories; one playbook at a time.

---

## ADR-004: Cross-AI Handback Scenarios Stay Isolated

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-26 |
| **Deciders** | spec author |

---

### Context

cli-opencode's `06--integration-patterns` includes "cross-AI handback" — a use case where opencode dispatches work to companion CLIs (cli-codex, cli-claude-code, etc.) and integrates their results. Should these scenarios actually invoke the companion CLIs as live integration tests, or remain isolated unit-style scenarios that document the contract without depending on companion CLIs being installed?

### Constraints

- Operators may not have all 5 CLIs installed.
- Live cross-CLI tests would require per-companion API keys, model availability, and rate-limit headroom.
- The playbook is a manual matrix, not an automated integration suite.

---

### Decision

**We chose**: Cross-AI handback scenarios in cli-opencode's playbook describe the orchestration pattern with exact prompts and expected signals, but remain isolated — they do not require the companion CLI to be installed for the scenario to PASS.

**How it works**: The scenario row's Pass/Fail Criteria reads "PASS if opencode emits the correct delegation event with the right model/agent/prompt; companion CLI execution is out of scope for this scenario." The scenario notes the dependency in the Description field but does not require the companion to actually run.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Isolated scenarios** (chosen) | Works with 0/4 companion CLIs installed; matches manual-matrix nature of the playbook | Less end-to-end | 9/10 |
| Live integration | True end-to-end coverage | Hard prerequisites; rate-limit fragility | 5/10 |
| Optional live integration tier | Best of both | Adds another execution mode to grade; overhead in playbook structure | 6/10 |

**Why this one**: The playbook is a manual validation matrix; integration tests belong in automated suites. The scenario documents the contract; an operator with the time and credentials can extend it manually.

---

### Consequences

**What improves**: Playbook runs anywhere; no companion-CLI hard dependencies.

**What it costs**: Real cross-AI handback bugs that only manifest when a companion CLI returns unexpected output may slip through.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator interprets isolated scenario as full validation | M | Scenario description explicitly states "companion CLI execution out of scope" |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Cross-AI handback is a real cli-opencode feature deserving coverage |
| 2 | **Beyond Local Maxima?** | PASS | Considered live and tiered alternatives |
| 3 | **Sufficient?** | PASS | Documents contract; operator can extend manually |
| 4 | **Fits Goal?** | PASS | Manual-matrix nature of the playbook respected |
| 5 | **Open Horizons?** | PASS | Future automated integration suite can extend this |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: cli-opencode's `06--integration-patterns` per-feature files use the isolated framing.

**How to roll back**: Add a tiered integration mode to scenarios in a follow-up update.

---

## ADR-005: Dispatch via /create:testing-playbook Rather Than Hand-Craft

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-26 |
| **Deciders** | spec author |

---

### Context

The work could be done either by hand-crafting all root + per-feature files in this thread, or by dispatching the canonical `/create:testing-playbook` command (via `@write`) per CLI. Hand-crafting is direct; dispatching enforces the shipped contract through the command's H0–H4 validation gates.

### Constraints

- The canonical command exists and is documented at `.opencode/command/create/testing-playbook.md`.
- Hand-craft and dispatch produce the same shipped contract output.
- Hand-craft drifts faster than the command if templates change.

---

### Decision

**We chose**: Dispatch `/create:testing-playbook <skill> create :auto` via `@write` once per CLI.

**How it works**: For each of the 5 CLIs, run `Agent(subagent_type="write", prompt="run /create:testing-playbook <skill> create :auto with source_strategy=manual_scenario_list, spec_choice=existing 048-cli-testing-playbooks, category_schema=<from plan.md §4>")`. The @write agent runs the command, which loads templates, generates root + per-feature files, runs the validator, and reports STATUS.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dispatch via canonical command** (chosen) | Contract enforcement via H0-H4 gates; future template changes propagate via update; matches the command's reason for existing | Slower per-CLI than hand-craft; requires @write context | 9/10 |
| Hand-craft directly | Fast; no agent dependency | Drifts when templates change; bypasses validator built into command | 5/10 |
| Hybrid (some CLIs dispatch, some hand-craft) | Flexible | Inconsistent provenance complicates future maintenance | 3/10 |

**Why this one**: The command exists for exactly this work. Hand-crafting bypasses the validation pipeline and creates files that look right but lack provenance through the canonical workflow.

---

### Consequences

**What improves**: All 5 playbooks have the same provenance; future `/create:testing-playbook update` invocations work cleanly; templates can evolve without breaking the playbooks.

**What it costs**: Slightly slower per-CLI delivery; depends on @write agent availability.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| @write Phase 0 hard-blocks repeatedly | M | Hand-craft fallback path documented in plan.md §6 |
| Command produces output that diverges from spec scope | L | Brief @write with category schema verbatim from plan.md §4 |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 5 playbooks need consistent provenance |
| 2 | **Beyond Local Maxima?** | PASS | Considered hand-craft and hybrid |
| 3 | **Sufficient?** | PASS | Canonical command produces the contract output |
| 4 | **Fits Goal?** | PASS | Aligns with spec maintainability NFR-M01 |
| 5 | **Open Horizons?** | PASS | Future template changes auto-propagate |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: 5 @write dispatches in 2 waves per plan.md §4.

**How to roll back**: `git checkout` the affected playbook trees and re-dispatch with corrected briefing.

---

## ADR-006: Root Prompt Text Is a Paraphrased Subset of Per-Feature Canonical Prompts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-26 |
| **Deciders** | spec author + deep-review iter-005 finding response |

---

### Context

Each per-feature scenario file carries a canonical Role then Context then Action then Format prompt sized to fully specify the operator action. The root MANUAL_TESTING_PLAYBOOK file in each playbook also lists summary prompts in its 9-column scenario table for navigability. Iter-005 of the deep review surfaced 76 drift entries between root summary prompts and per-feature canonical prompts. The drift is structural: the root cells trade fidelity for compactness so an operator scanning the table can find the right scenario without opening every per-feature file.

### Constraints

- The 9-column scenario table at the root level must remain readable across a single visual sweep; full canonical prompts would push every row to 200+ characters.
- The per-feature file is the single source of truth for scenario execution; operators run from there, not from the root summary.
- Renaming the root field would force a per-feature file rewrite of the cross-reference index.

---

### Decision

**We chose**: Root summary prompts in each MANUAL_TESTING_PLAYBOOK file are intentionally a paraphrased subset of the per-feature canonical prompts. The contract is that the root summary names the role, context and target outcome in compact form, and the per-feature file carries the full Role then Context then Action then Format prompt as the operator-execution contract. The 76 drift entries flagged by iter-005 are not bugs; they are the contracted relationship.

**How it works**: When generating or updating a playbook via `/create:testing-playbook`, the root summary cell is auto-derived from the per-feature canonical prompt by the workflow. Operators executing a scenario should always open the per-feature file to read the canonical prompt; the root summary is the navigation breadcrumb.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Root summary is paraphrased subset** (chosen) | Keeps root tables scannable; per-feature files stay authoritative | Requires this ADR to make the relationship explicit | 9/10 |
| Rename root field to `Prompt summary` | Names the field accurately; matches reality | Breaks backwards compatibility with existing playbooks; forces per-feature index rewrite | 5/10 |
| Force root prompts to match per-feature canonical prompts verbatim | Single source of truth, no drift | 200+ character rows destroy table readability; defeats the navigation purpose | 3/10 |

**Why this one**: The drift is intentional, not accidental. Making it explicit through this ADR is cheaper than restructuring 5 root playbooks plus the canonical command workflow.

---

### Consequences

**What improves**: Future updates can refresh root summaries without anxiety about per-feature drift; the per-feature file remains the canonical execution contract; operators have explicit guidance to open the per-feature file for execution.

**What it costs**: This relationship has to be documented in onboarding for new contributors so they don't try to "fix" the drift.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator runs from root summary without opening per-feature file | M | Root playbook overview section explicitly states "open the per-feature file before executing"; Failure Triage steps live only in per-feature files, so partial execution self-corrects |
| Future updates regenerate one but not the other | L | `/create:testing-playbook update` regenerates both atomically |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without this ADR, drift triggers a P1 finding every review cycle |
| 2 | **Beyond Local Maxima?** | PASS | Considered renaming the field and forcing verbatim copies |
| 3 | **Sufficient?** | PASS | Documents the contract; per-feature files remain authoritative |
| 4 | **Fits Goal?** | PASS | Operator navigability is a primary spec success criterion |
| 5 | **Open Horizons?** | PASS | Future automated drift detection can target the per-feature canonical prompt as the source of truth |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: implementation-summary.md Known Limitations §6 cites this ADR. No playbook content changes.

**How to roll back**: Force-regenerate root summaries from per-feature canonical prompts via a one-shot script; accepts the readability hit.
