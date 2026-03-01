---
title: "Decision Record: Make spec_kit Commands Codex-Compatible [010-speckit-codex-compatibility/decision-record]"
description: "Codex (OpenAI's coding agent) misinterprets agent routing metadata in spec_kit command files as dispatch instructions, causing three failure modes: premature @review dispatch, p..."
trigger_phrases:
  - "decision"
  - "record"
  - "make"
  - "spec"
  - "kit"
  - "decision record"
  - "010"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Make spec_kit Commands Codex-Compatible

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Three-Pronged Codex Compatibility Approach

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | User, AI Agent |

---

### Context

Codex (OpenAI's coding agent) misinterprets agent routing metadata in spec_kit command files as dispatch instructions, causing three failure modes: premature `@review` dispatch, premature `@handover` dispatch, and unnecessary `@debug` dispatch. The root cause is that agent routing metadata in both `.md` files (sections, tables) and YAML files (`dispatch:` fields, `agent_routing:` keys) look like executable instructions to Codex.

Five root causes were identified:
1. `## AGENT ROUTING` sections in `.md` files with `@agent` names in tables
2. `dispatch:` fields in YAML files with imperative `"Task tool -> @agent..."` strings
3. Weak `<!-- REFERENCE ONLY -->` HTML comment guards that Codex ignores
4. Two-layer architecture (`.md` + YAML) creates double-exposure of agent references
5. YAML `agent_routing` uses dispatch-like language

### Constraints

- Must eliminate all known Codex dispatch trigger vectors
- Must preserve agent routing capability for Claude
- Must not require architectural changes beyond config file edits
- Changes must be verifiable via grep-based automated checks
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Apply a three-pronged approach across all spec_kit command files: (A) strip agent routing sections from `.md` files, (B) add explicit CONSTRAINTS anti-dispatch guards to `.md` files, (C) restructure YAML `agent_routing` to `agent_availability` with non-imperative language.

**Details**:

- **Change A (Strip .md)**: Remove `## AGENT ROUTING` sections, dispatch templates, `## SUB-AGENT DELEGATION` sections, and `<!-- REFERENCE ONLY -->` guards from all 7 `.md` command files. This eliminates the primary dispatch trigger in `.md` files.

- **Change B (Constrain .md)**: Add `## CONSTRAINTS` section to each `.md` file with explicit "DO NOT dispatch" rules. This provides a positive anti-dispatch signal that Codex respects at the section level, which is stronger than HTML comments.

- **Change C (Restructure YAML)**: Rename `agent_routing` to `agent_availability` in all 11 YAML files. Remove `dispatch:` and `agent: "@xxx"` fields. Add `condition:` and `not_for:` fields. Change YAML comments from "REFERENCE ONLY" to "AGENT AVAILABILITY (conditional)". This preserves agent metadata while removing imperative dispatch language.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three-pronged (strip + constrain + restructure)** | Addresses all 5 root causes, preserves functionality, grep-verifiable | More changes than simpler approaches | 9/10 |
| Simple HTML commenting (`<!-- REFERENCE ONLY -->`) | Minimal changes | Too weak; Codex ignores HTML comments (root cause #3) | 2/10 |
| Full removal of all agent metadata | Eliminates dispatch completely | Breaks agent routing for Claude; loses functionality | 3/10 |
| Move agent metadata to separate config file | Clean separation | Over-engineering; adds file complexity for config that works in YAML | 4/10 |
| Only strip `.md` sections (Change A only) | Reduces `.md` trigger surface | YAML `dispatch:` fields still trigger Codex | 5/10 |
| Only restructure YAML (Change C only) | Preserves `.md` structure | `.md` AGENT ROUTING sections still trigger Codex | 5/10 |

**Why Chosen**: The three-pronged approach is the only option that addresses all 5 root causes simultaneously. Single-pronged approaches leave at least one trigger vector open. Full removal breaks functionality. Separate config file is over-engineering for what is fundamentally a language/naming problem in existing files.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- All 5 known Codex dispatch trigger vectors eliminated
- Agent routing capability fully preserved for Claude via `agent_availability` with `condition:` fields
- Changes are grep-verifiable with 5 automated success criteria
- No architectural changes required (pure config refactoring)
- Symlink means changes needed only once (`.opencode/command/spec_kit/`)

**Negative**:
- Slightly more verbose YAML (`condition:` + `not_for:` instead of just `dispatch:`) - Mitigation: Improved clarity worth the verbosity
- CONSTRAINTS section adds ~5 lines to each `.md` file - Mitigation: Negligible overhead

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Codex finds new dispatch vectors beyond the 5 identified | L | Three-pronged approach covers broad surface; monitor for new vectors |
| Claude confused by `agent_availability` naming | L | Semantically clear; `condition:` fields guide correct usage |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Codex prematurely dispatches agents; must fix for Codex compatibility |
| 2 | **Beyond Local Maxima?** | PASS | 6 alternatives considered; three-pronged is the only one addressing all 5 root causes |
| 3 | **Sufficient?** | PASS | Simplest multi-pronged approach; no over-engineering (no new files, no new architecture) |
| 4 | **Fits Goal?** | PASS | Directly eliminates all known Codex dispatch triggers while preserving Claude functionality |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future command files; `agent_availability` structure extensible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- 7 `.md` files in `.opencode/command/spec_kit/` (Changes A + B)
- 11 YAML files in `.opencode/command/spec_kit/assets/` (Change C)
- Symlink `.claude/commands/spec_kit/` automatically reflects all changes

**Rollback**: Git revert the commit containing all 18 file changes. Single commit on `main` branch.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record - Make spec_kit Commands Codex-Compatible
1 ADR documenting the three-pronged approach
Status: Accepted (2026-02-17)
5/5 Five Checks PASS
-->
