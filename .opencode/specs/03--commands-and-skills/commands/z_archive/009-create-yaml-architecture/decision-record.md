---
title: "Decision Record: Create Commands YAML-First Architecture Refactor [009-create-yaml-architecture/decision-record]"
description: "6 create commands need identical architectural refactoring from inline-workflow to YAML-first. Doing all simultaneously risks inconsistency, makes debugging difficult, and incre..."
trigger_phrases:
  - "decision"
  - "record"
  - "create"
  - "commands"
  - "yaml"
  - "decision record"
  - "009"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Create Commands YAML-First Architecture Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Golden Reference Strategy

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | User, AI Agent |

---

### Context

6 create commands need identical architectural refactoring from inline-workflow to YAML-first. Doing all simultaneously risks inconsistency, makes debugging difficult, and increases the chance of subtle pattern drift between commands.

### Constraints
- All 6 commands must end up structurally identical
- Changes must be testable incrementally
- Multi-session execution is likely given scope

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Refactor skill.md first as the golden reference, validate completely, then mechanically replicate the pattern to the remaining 5 commands.

**Details**: skill.md was chosen because it's representative of the average create command (not too simple, not too complex). Once the pattern is validated end-to-end, the remaining 5 commands are refactored by mechanical replication, reducing the chance of pattern drift.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Golden reference (skill.md first)** | Single source of truth, easier debugging, mechanical replication | Slower start (1 command done before others) | 9/10 |
| Batch all 6 simultaneously | Faster initial progress | High inconsistency risk, harder debugging, pattern drift | 4/10 |
| Start with simplest command | Quick first win | May not be representative; pattern may not scale | 5/10 |
| Start with agent.md (hardest) | Tackles biggest risk first | 670 lines makes poor template; too complex for reference | 3/10 |

**Why Chosen**: Golden reference provides the best balance of quality, debuggability, and replicability. Once one command is fully validated, the pattern is proven and replication is mechanical.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Single source of truth for the architecture pattern
- Each subsequent command refactor is faster (mechanical replication)
- Easy to verify consistency by structural comparison

**Negative**:
- Slower initial progress (only 1 command done in first iteration) - Mitigation: This is offset by faster subsequent commands

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| skill.md pattern doesn't generalize to agent.md (670 lines) | M | agent.md may need additional patterns; document deviations |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 6 commands need refactoring; a strategy is needed to manage consistency |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives considered (batch, simplest-first, hardest-first) |
| 3 | **Sufficient?** | PASS | Simplest strategy that ensures consistency |
| 4 | **Fits Goal?** | PASS | Directly enables consistent YAML-first architecture |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future command refactors |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/command/create/skill.md` (golden reference)
- 5 remaining `.md` files (replication targets)

**Rollback**: Revert skill.md to pre-refactor state; no cascade impact on other commands

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep Setup Phase in .md (Not in YAML)

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | User, AI Agent |

---

### Context

Create commands have complex setup logic: template discovery, path resolution, user input gathering, and Phase 0 (@write agent verification). This logic could live in the `.md` file or be moved entirely into YAML.

### Constraints
- YAML is primarily a workflow step executor, not a conditional logic engine
- Phase 0 is a pre-YAML guardrail that should run before any YAML loads
- Setup involves context-gathering that informs which YAML to load

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Keep setup and context-gathering logic in `.md` files; YAML handles only the post-setup workflow execution.

**Details**: The `.md` file handles: Phase 0 verification, mode detection (auto vs confirm), template/path resolution, and routing to the appropriate YAML. The YAML handles: step-by-step workflow execution, quality gates, circuit breakers, and output validation.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep setup in .md** | Clean separation of concerns, Phase 0 stays pre-YAML | Some logic split across files | 8/10 |
| Move everything to YAML | Single file per command variant | YAML poorly suited for conditional setup, Phase 0 lost | 3/10 |
| Separate setup.yaml | Explicit setup phase | Over-engineering; adds complexity without clear benefit | 4/10 |

**Why Chosen**: Natural separation of concerns. `.md` is the routing and context layer; YAML is the execution layer. This matches how spec_kit commands work.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Phase 0 guardrail preserved as pre-YAML check
- YAML stays focused on workflow steps (simpler, more maintainable)
- Mode detection in .md naturally routes to correct YAML

**Negative**:
- Logic split between .md and YAML - Mitigation: Clear documentation of responsibility boundary

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Developers confused about what goes where | L | EXECUTION PROTOCOL banner makes boundary explicit |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must decide where setup logic lives |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives considered |
| 3 | **Sufficient?** | PASS | Simplest approach maintaining existing responsibility split |
| 4 | **Fits Goal?** | PASS | Matches spec_kit architecture |
| 5 | **Open Horizons?** | PASS | Setup could move to YAML later if needed |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- All 6 `.md` command files (setup logic stays here)
- All 12 YAML files (workflow execution only)

**Rollback**: N/A — this is an architectural principle, not a code change

<!-- /ANCHOR:adr-002-impl -->

<!-- /ANCHOR:adr-002 -->

---

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Dual YAML Mode (Auto + Confirm)

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | User, AI Agent |

---

### Context

spec_kit commands use dual YAML variants: `_auto.yaml` (no confirmation pauses) and `_confirm.yaml` (confirmation at each step). Create commands currently lack auto mode entirely, with only a single YAML per command.

### Constraints
- Must match spec_kit convention for consistency
- Both variants must produce identical output
- Auto mode needed for batch/scripted workflows

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Create both `_auto` and `_confirm` YAML variants for each command, matching the spec_kit dual-mode convention.

**Details**: Existing YAMLs are renamed to `_confirm` variants. New `_auto` variants are created by removing confirmation pauses from `_confirm` variants while preserving all workflow steps and quality gates. The `.md` routing layer determines which YAML to load based on mode parameter.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dual YAML (auto + confirm)** | Matches spec_kit, clear separation | 12 files instead of 6 | 9/10 |
| Single YAML with mode parameter | Fewer files | Conditional logic in YAML is messy | 4/10 |
| Auto mode only | Simplest | Loses confirmation safety for complex operations | 2/10 |

**Why Chosen**: Consistency with spec_kit convention. Clean separation. Each YAML is simple and mode-specific.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Auto mode enabled for all 6 create commands (new capability)
- Consistent with spec_kit convention
- Each YAML file is simple (no conditional mode logic)

**Negative**:
- 12 YAML files instead of 6 - Mitigation: Mechanical creation; patterns identical

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Auto and confirm variants drift apart over time | M | Checklist item to verify both variants match on changes |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Auto mode currently broken; spec_kit convention requires it |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives considered |
| 3 | **Sufficient?** | PASS | Matches existing convention (not inventing new pattern) |
| 4 | **Fits Goal?** | PASS | Directly enables auto mode (SC-001) |
| 5 | **Open Horizons?** | PASS | Could add more modes later if needed |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- 6 existing YAMLs (renamed to `_confirm`)
- 6 new `_auto` YAMLs (created)
- 6 `.md` files (routing updated for mode detection)

**Rollback**: Delete `_auto` YAMLs, rename `_confirm` back to original names

<!-- /ANCHOR:adr-003-impl -->

<!-- /ANCHOR:adr-003 -->

---

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Phase 0 Stays in .md as Pre-YAML Guardrail

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-14 |
| **Deciders** | User, AI Agent |

---

### Context

Phase 0 in create commands verifies that the @write agent is being used (not @general or another agent). This is a guardrail that should run before any workflow begins. It could be placed in the YAML or kept in the `.md` file.

### Constraints
- Phase 0 must run before YAML loads
- Phase 0 is a routing/dispatch check, not a workflow step
- YAML should only contain workflow execution logic

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Keep Phase 0 (@write agent verification) in `.md` files as a pre-YAML guardrail.

**Details**: Phase 0 checks that the correct agent is being used before any document creation begins. This naturally belongs in the `.md` routing layer, running before the YAML workflow is dispatched. If the wrong agent is detected, Phase 0 can halt before any YAML execution occurs.

<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Phase 0 in .md** | Runs before YAML, natural guardrail position | Additional .md content | 9/10 |
| Phase 0 as YAML step 1 | All logic in YAML | Too late — YAML already loaded, wrong agent context | 3/10 |

**Why Chosen**: Phase 0 is conceptually a pre-execution check, not a workflow step. Keeping it in .md ensures it runs before any YAML dispatch.

<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Guardrail runs at earliest possible point
- Wrong-agent detection halts before any workflow execution

**Negative**:
- Phase 0 logic not visible in YAML workflow - Mitigation: .md clearly documents Phase 0 purpose

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 0 check bypassed in auto mode | L | Auto mode still loads .md first; Phase 0 runs regardless |

<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Agent verification prevents wrong-agent execution |
| 2 | **Beyond Local Maxima?** | PASS | 2 alternatives considered |
| 3 | **Sufficient?** | PASS | Minimal addition to .md, maximum safety |
| 4 | **Fits Goal?** | PASS | Preserves existing safety check during refactor |
| 5 | **Open Horizons?** | PASS | Could move to YAML later if routing layer changes |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- All 6 `.md` command files (Phase 0 preserved)

**Rollback**: N/A — preserving existing behavior

<!-- /ANCHOR:adr-004-impl -->

<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record - Create Commands YAML-First Architecture Refactor
4 ADRs documenting major architectural decisions
All decisions Accepted status
-->
