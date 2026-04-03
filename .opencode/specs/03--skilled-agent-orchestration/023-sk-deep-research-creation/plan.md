---
title: "Implementation Plan: Autonomous Deep Research Loop [03--commands-and-skills/023-sk-deep-research-creation/plan]"
description: "5-phase plan for 3-layer autoresearch integration (agent + command + skill) with ~2800 LOC across 18 files"
trigger_phrases:
  - "autoresearch plan"
  - "deep research implementation"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Autonomous Deep Research Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown specs, YAML workflows, and skill references |
| **Primary Runtime Surface** | `.claude/agents/deep-research.md`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/` |
| **State Model** | `deep-research-state.jsonl` plus `research/deep-research-strategy.md` |
| **Verification Basis** | Spec docs, ADRs, research synthesis, and legacy-reference cleanup evidence |

### Overview

Create 3 artifacts that enable autonomous iterative deep research:
1. **`@deep-research` agent** -- LEAF agent executing single research iterations
2. **`/spec_kit:deep-research` command** -- YAML workflow managing the loop lifecycle
3. **`sk-deep-research` skill** -- Protocol documentation, templates, reference docs

**Core insight**: Fresh context per iteration + externalized state solves context degradation. Our existing orchestrator dispatch model maps naturally because each Task dispatch is a fresh context.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Level 3 spec docs are populated and synchronized.
- The deep-research architecture, state model, and legacy-removal scope are documented before follow-on implementation.
- The v2 research findings are captured in `research/research.md` and `scratch/improvement-proposals.md`.

### Definition of Done
- v1 creation and legacy-removal work are documented with verification evidence in this spec folder.
- Required Level 3 files exist and validate without structural errors.
- Remaining v2 proposals are clearly marked as planned, not implemented.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A three-layer architecture: orchestrator-routed LEAF agent, command-managed loop, and skill-backed protocol documentation.

### Key Components
- **Agent layer**: `@deep-research` runs one research iteration per dispatch with fresh context.
- **Command layer**: `/spec_kit:deep-research` owns loop lifecycle, convergence checks, and synthesis flow.
- **Skill layer**: `sk-deep-research` documents the state format, loop protocol, and operator-facing guidance.

### Data Flow
The command initializes state files, dispatches the LEAF agent for each iteration, records structured state in JSONL plus strategy markdown, and synthesizes the final findings into `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec Folder Completion
Complete Level 3 documentation before implementation.
- spec.md, plan.md, tasks.md, checklist.md, decision-record.md, description.json

### Phase 2: Skill (sk-deep-research)
Build skill first because agent and command reference skill templates/docs.
- 2.1: Templates (config.json, strategy.md)
- 2.2: References (loop_protocol.md, state_format.md, convergence.md, quick_reference.md)
- 2.3: SKILL.md (8-section structure)
- 2.4: README.md

### Phase 3: Agent (@deep-research)
LEAF agent for single-iteration execution.
- `.claude/agents/deep-research.md` (~400 LOC)
- Pattern: `.claude/agents/deep-research.md` with legacy `@research` behavior retained only as archived historical context

### Phase 4: Command (/spec_kit:deep-research)
YAML workflows managing the loop.
- 4.1: TOML registration (`.agents/commands/spec_kit/deep-research.toml`)
- 4.2: Command spec (`.opencode/command/spec_kit/deep-research.md`)
- 4.3: YAML workflows (auto + confirm modes)
- Pattern: `/spec_kit:research` command structure

### Phase 5: Registration Updates
Wire everything into routing systems.
- CLAUDE.md agent routing table
- orchestrate.md agent selection
- skill README catalog
- skill_advisor.py keyword mappings
- descriptions.json entry

### Phase 5.5: Legacy @research Removal (Complete)
Remove the superseded `@research` agent and `/spec_kit:research` command from the entire codebase.
- 5.5.1: Delete 9 files (6 agent defs, 1 command, 2 YAMLs)
- 5.5.2: Update all orchestrate/speckit/deep-research/context/debug/ultra-think agents (all runtimes)
- 5.5.3: Update spec_kit YAML workflows (plan/complete agent_availability)
- 5.5.4: Update framework docs (CLAUDE.md, AGENTS.md, READMEs)
- 5.5.5: Update skill docs, install guides, .codex/config.toml
- 5.5.6: Verification — zero stale references outside changelog/specs

### Phase 6: v2 Priority 1 -- Robustness & Convergence (6 items, S-M effort)
Research-validated improvements that address known gaps. All P1 items.

- 6.1: JSONL Fault Tolerance (REQ-010) -- Update state_format.md + JSONL parser in convergence logic
- 6.2: Exhausted Approaches Enhancement (REQ-011) -- Update strategy template + agent protocol
- 6.3: State Recovery Fallback (REQ-012) -- Add recovery function to loop_protocol.md
- 6.4: Iteration Reflection Section (REQ-013) -- Update iteration template in agent definition
- 6.5: Tiered Error Recovery (REQ-014) -- Add 5-tier protocol to agent + convergence.md
- 6.6: Composite Convergence Algorithm (REQ-015) -- Replace shouldContinue() with 3-signal composite

### Phase 7: v2 Priority 2 -- Enrichment & User Control (6 items, S-L effort)
Capabilities that enhance research quality and operator experience.

- 7.1: Ideas Backlog File (REQ-016) -- Add convention, update init/stuck/resume paths
- 7.2: Sentinel Pause File (REQ-017) -- Add pause check to loop protocol
- 7.3: Compact State Summary (REQ-018) -- Generate 200-token summary for dispatch prompts
- 7.4: Enriched Stuck Recovery (REQ-019) -- Add 3 heuristics to convergence.md
- 7.5: Segment Partitioning (REQ-020) -- Add segment field to JSONL schema + convergence filter
- 7.6: Scored Branching with Pruning (REQ-021) -- New wave orchestration pattern + breakthrough detection

### Phase 8: v2 Priority 3 -- Polish (3 items, S-M effort)
Measurable benefit, non-blocking.

- 8.1: Statistical newInfoRatio Validation (REQ-022) -- MAD noise floor in convergence.md
- 8.2: Progress Visualization (REQ-023) -- Markdown summary format in quick_reference.md
- 8.3: Git Commit Per Iteration (REQ-024) -- Add to loop protocol, targeted git add list

### Phase 9: v2 Priority 4 -- Track (3 items, S-L effort)
Ideas to monitor, not implement now.

- 9.1: File Mutability Declarations (REQ-025) -- fileProtection map in config schema
- 9.2: True Context Isolation (REQ-026) -- `claude -p` dispatch alternative
- 9.3: Research Simplicity Criterion (REQ-027) -- Soft quality criterion in assessment

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence Source |
|-----------|-------|-----------------|
| Structural validation | Required Level 3 sections, anchors, and headers | `validate.sh` and checklist evidence |
| Reference integrity | Active spec-doc links, research links, and runtime-path references | spec validator integrity pass |
| Architecture verification | ADR coverage, legacy-reference cleanup, and routing updates | `decision-record.md`, `checklist.md`, `implementation-summary.md` |
| Research-backed planning | v2 proposal traceability to deep-research findings | `research/research.md`, `scratch/improvement-proposals.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

```
Phase 1 (Spec Docs) -- no dependencies
    |
Phase 2 (Skill) -- depends on Phase 1
    |
Phase 3 (Agent) -- depends on Phase 2 (references skill docs)
    |
Phase 4 (Command) -- depends on Phase 2 + 3
    |
Phase 5 (Registration) -- depends on all above
    |
Phase 5.5 (Legacy Removal) -- depends on Phase 5 (removes superseded @research)
    |
=== v1 COMPLETE === v2 BELOW ===
    |
Phase 6 (P1 Improvements) -- depends on Phase 5.5 (modifies existing files)
    |
Phase 7 (P2 Improvements) -- depends on Phase 6 (builds on P1 patterns)
    |
Phase 8 (P3 Polish) -- independent of Phase 7
    |
Phase 9 (P4 Track) -- future, no immediate dependencies
```
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Structural validation fails, legacy research references must be restored, or the deep-research replacement path proves incomplete.
- **Procedure**: Revert the spec-folder edits, restore the prior command/agent documentation from version control, and re-run validation before resuming implementation work.
- **Scope**: Documentation and routing artifacts only; no production data migration is involved.
<!-- /ANCHOR:rollback -->

---

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| YAML manages the loop | YAML workflow | Self-contained; command loads YAML, YAML manages loop lifecycle |
| @deep-research is LEAF-only | No sub-agents | NDP compliance; all research self-contained per iteration |
| JSONL + strategy.md state | Dual-format | JSONL for structured data (machine), strategy.md for context (agent) |
| No code_mode MCP | Excluded from agent | Keeps TCB manageable |
| Separate from /spec_kit:research | New namespace | Different use cases; avoids bloating existing workflow |
| Default 10 max iterations | Configurable | Balances depth vs cost; diminishing returns at 15+ |

---

### Estimated LOC

| Component | Files | LOC |
|-----------|-------|-----|
| Spec folder docs | 6 | ~450 |
| Skill (SKILL.md + refs + templates + README) | 8 | ~1210 |
| Agent definition | 1 | ~400 |
| Command (spec + YAML x2 + TOML) | 4 | ~1190 |
| Registration updates | 5 | ~50 (additions to existing files) |
| **v1 Total** | **24** | **~3300** |
| Phase 6 (P1 v2) | 6 files modified | ~350 |
| Phase 7 (P2 v2) | 6 files modified + 1 new | ~400 |
| Phase 8 (P3 v2) | 3 files modified | ~150 |
| Phase 9 (P4 v2) | 3 files modified | ~100 |
| **v2 Total** | **~10 modified + 1 new** | **~1000** |
| **Grand Total** | **~25 files** | **~4300** |

---

### Critical References

| File | Purpose |
|------|---------|
| `.claude/agents/deep-research.md` | Active agent definition and pattern reference for the iterative research loop |
| `.opencode/command/spec_kit/deep-research.md` | Command workflow reference for the iterative research loop |
| `.opencode/skill/sk-git/SKILL.md` | 8-section SKILL.md pattern (478 LOC) |
| `research/research.md` | Source design and synthesis reference for the shipped state model |
| `.claude/agents/orchestrate.md` | NDP/CWB/TCB constraints |

---

### Pre-Task Checklist

- Confirm the active phase before editing runtime docs or references.
- Re-read the relevant state, research, and ADR context before changing loop behavior.
- Validate the current file after each structural repair.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| 1 | Preserve shipped v1 facts and mark v2 work as planned until implemented. |
| 2 | Keep runtime-path references aligned to existing `.claude/agents/*.md` surfaces. |
| 3 | Treat legacy `@research` references as historical context only; do not restore them without rollback. |

### Status Reporting Format

- Report which phase section was updated.
- Report validation outcome with exit code and remaining warnings.
- Flag any deferred v2 items as planned, not shipped.

### Blocked Task Protocol

1. Stop at the failing validator issue.
2. Repair the current document before editing another spec doc.
3. Re-run validation and only then continue to the next file.
