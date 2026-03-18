---
title: "Implementation Plan: Autonomous Deep Research Loop"
description: "5-phase plan for 3-layer autoresearch integration (agent + command + skill) with ~2800 LOC across 18 files"
trigger_phrases:
  - "autoresearch plan"
  - "deep research implementation"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Autonomous Deep Research Loop

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. APPROACH

Create 3 artifacts that enable autonomous iterative deep research:
1. **`@deep-research` agent** -- LEAF agent executing single research iterations
2. **`/spec_kit:deep-research` command** -- YAML workflow managing the loop lifecycle
3. **`sk-deep-research` skill** -- Protocol documentation, templates, reference docs

**Core insight**: Fresh context per iteration + externalized state solves context degradation. Our existing orchestrator dispatch model maps naturally -- each Task dispatch IS a fresh context.

---

## 2. PHASE BREAKDOWN

### Phase 1: Spec Folder Completion
Complete Level 3 documentation before implementation.
- spec.md, plan.md, tasks.md, checklist.md, decision-record.md, description.json

### Phase 2: Skill (sk-deep-research)
Build skill first because agent and command reference skill templates/docs.
- 2.1: Templates (config.json, strategy.md)
- 2.2: References (loop-protocol.md, state-format.md, convergence.md, quick_reference.md)
- 2.3: SKILL.md (8-section structure)
- 2.4: README.md

### Phase 3: Agent (@deep-research)
LEAF agent for single-iteration execution.
- `.claude/agents/autoresearch.md` (~400 LOC)
- Pattern: `.claude/agents/research.md` (483 lines)

### Phase 4: Command (/spec_kit:deep-research)
YAML workflows managing the loop.
- 4.1: TOML registration (`.agents/commands/autoresearch.toml`)
- 4.2: Command spec (`.opencode/command/autoresearch/autoresearch.md`)
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

- 6.1: JSONL Fault Tolerance (REQ-010) -- Update state-format.md + JSONL parser in convergence logic
- 6.2: Exhausted Approaches Enhancement (REQ-011) -- Update strategy template + agent protocol
- 6.3: State Recovery Fallback (REQ-012) -- Add recovery function to loop-protocol.md
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

---

## 3. DEPENDENCY GRAPH

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

---

## 4. KEY DESIGN DECISIONS

| Decision | Choice | Rationale |
|----------|--------|-----------|
| YAML manages the loop | YAML workflow | Self-contained; command loads YAML, YAML manages loop lifecycle |
| @deep-research is LEAF-only | No sub-agents | NDP compliance; all research self-contained per iteration |
| JSONL + strategy.md state | Dual-format | JSONL for structured data (machine), strategy.md for context (agent) |
| No code_mode MCP | Excluded from agent | Keeps TCB manageable |
| Separate from /spec_kit:research | New namespace | Different use cases; avoids bloating existing workflow |
| Default 10 max iterations | Configurable | Balances depth vs cost; diminishing returns at 15+ |

---

## 5. ESTIMATED LOC

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

## 6. CRITICAL REFERENCES

| File | Purpose |
|------|---------|
| `.claude/agents/research.md` | Agent definition pattern (483 LOC) — **DELETED in Phase 5.5** |
| `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml` | YAML workflow pattern (453 LOC) — **DELETED in Phase 5.5** |
| `.opencode/skill/sk-git/SKILL.md` | 8-section SKILL.md pattern (478 LOC) |
| `028-auto-deep-research/research.md` | Source design with all state formats |
| `.claude/agents/orchestrate.md` | NDP/CWB/TCB constraints |
