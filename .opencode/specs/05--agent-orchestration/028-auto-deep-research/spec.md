---
title: "Feature Specification: Autonomous Deep Research Loop"
description: "No built-in iterative research capability exists. Current /spec_kit:research is single-pass only, unable to deepen findings across multiple cycles or detect convergence."
trigger_phrases:
  - "autoresearch"
  - "deep research"
  - "autonomous research loop"
  - "research agent"
  - "iterative research"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Autonomous Deep Research Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Create a 3-layer autonomous deep research system: `@deep-research` agent (single iteration executor), `/spec_kit:deep-research` command (loop lifecycle manager via YAML workflows), and `sk-deep-research` skill (protocol documentation and templates). The system uses externalized JSONL + strategy file state with fresh agent context per iteration, solving context degradation in long research sessions.

**Key Decisions**: YAML manages the loop (not orchestrator directly), @deep-research is LEAF-only (NDP compliant), dual state format (JSONL + strategy.md)

**Critical Dependencies**: Existing orchestrator dispatch model, WebFetch tool, Spec Kit Memory MCP

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | v1 Complete (incl. Phase 5.5 legacy removal), v2 Planned |
| **Created** | 2026-03-18 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The current `/spec_kit:research` workflow is single-pass only. It investigates a topic once and documents findings. For deep, unknown topics requiring multiple rounds of discovery, there is no iterative deepening, progressive refinement, or autonomous loop execution. Research quality plateaus at whatever can be found in one pass.

### Purpose
Enable autonomous multi-iteration deep research where each cycle builds on prior findings, with convergence detection to stop when diminishing returns are reached, producing comprehensive research documentation.

---

## 3. SCOPE

### In Scope
- `@deep-research` LEAF agent for single-iteration execution
- `/spec_kit:deep-research` command with auto and confirm YAML workflows
- `sk-deep-research` skill with SKILL.md, references, and templates
- JSONL + strategy.md externalized state system
- Convergence detection algorithm (diminishing returns + stuck detection)
- Registration updates (CLAUDE.md, orchestrate.md, skill_advisor.py, README.md, descriptions.json)

### Out of Scope (v1)
- Parallel sub-query waves within a single iteration (v1.1 enhancement)
- Web search integration via MCP (v2.0)
- Self-improving prompts (v3.0)
- Legacy `@research` agent and `/spec_kit:research` command — deleted in Phase 5.5

### v2 Scope: Research-Validated Improvements (18 Proposals)

Derived from 14-iteration deep research across 4 autoresearch repos (karpathy, AGR, pi-autoresearch, autoresearch-opencode) with source code analysis and 322+ community issue validation. Full details: `scratch/improvement-proposals.md` v2.

**P1 -- Adopt Now (6 items)**:
- P1.5: JSONL Fault Tolerance -- silent skip of malformed lines, defaults for missing fields
- P1.3: Exhausted Approaches Enhancement -- structured blocking + positive "PRODUCTIVE" selection
- P1.4: State Recovery Fallback -- reconstruct JSONL from iteration-*.md Assessment sections
- P2.3: Iteration Reflection Section -- `## Reflection` in iteration template (why worked/failed)
- P1.1: Tiered Error Recovery -- 5 tiers in agent protocol (retry source, widen focus, reconstruct state, escalate, direct mode)
- P1.2: Composite Convergence Algorithm -- 3-signal weighted vote (rolling avg 0.30, MAD 0.35, question entropy 0.35)

**P2 -- Adopt Next (6 items)**:
- P2.2: Ideas Backlog File -- `scratch/research-ideas.md` checked at init, stuck recovery, auto-resume
- P2.6: Sentinel Pause File -- `scratch/.deep-research-pause` for clean pause/resume
- P3.2: Compact State Summary -- 200-token summary injected into every dispatch prompt
- P2.1: Enriched Stuck Recovery -- try opposites, combine findings, audit low-value iterations
- P2.4: Segment-Based State Partitioning -- segment field on JSONL records, per-segment convergence
- P2.5: Scored Branching with Pruning -- score parallel branches, prune low-value, breakthrough detection

**P3 -- Consider Later (3 items)**:
- P3.1: Statistical newInfoRatio Validation -- MAD noise floor detection
- P4.2: Progress Visualization -- markdown convergence summary
- P3.3: Git Commit Per Iteration -- auto-commit scratch/ with targeted git add

**P4 -- Track (3 items)**:
- P4.1: File Mutability Declarations -- machine-enforceable read-only/append-only/write-once
- P4.3: True Context Isolation -- `claude -p` dispatch per iteration (Claude-only)
- P4.4: Research Simplicity Criterion -- newInfoRatio bonus for consolidation iterations

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/agents/autoresearch.md` | Create | LEAF agent definition (~400 LOC) |
| `.opencode/command/autoresearch/autoresearch.md` | Create | Command spec with setup phase (~310 LOC) |
| `.opencode/command/autoresearch/assets/autoresearch_auto.yaml` | Create | Autonomous mode YAML workflow (~400 LOC) |
| `.opencode/command/autoresearch/assets/autoresearch_confirm.yaml` | Create | Interactive mode YAML workflow (~470 LOC) |
| `.opencode/skill/sk-deep-research/SKILL.md` | Create | 8-section skill protocol (~430 LOC) |
| `.opencode/skill/sk-deep-research/README.md` | Create | Skill overview (~160 LOC) |
| `.opencode/skill/sk-deep-research/references/loop-protocol.md` | Create | Loop lifecycle spec (~180 LOC) |
| `.opencode/skill/sk-deep-research/references/state-format.md` | Create | JSONL/strategy format spec (~130 LOC) |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Create | Convergence algorithm spec (~140 LOC) |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Create | One-page cheat sheet (~100 LOC) |
| `.opencode/skill/sk-deep-research/templates/deep-research-config.json` | Create | Config template (~20 LOC) |
| `.opencode/skill/sk-deep-research/templates/deep-research-strategy.md` | Create | Strategy file template (~50 LOC) |
| `CLAUDE.md` | Modify | Add @deep-research to agent routing table |
| `.claude/agents/orchestrate.md` | Modify | Add @deep-research to agent selection |
| `.opencode/skill/README.md` | Modify | Add sk-deep-research to catalog (16 to 17) |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Add autoresearch keyword mappings |
| `.opencode/specs/descriptions.json` | Modify | Add 028-auto-deep-research entry |
| `.agents/commands/autoresearch.toml` | Create | TOML registration for command |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | @deep-research agent executes single research iteration | Agent reads state, performs research, writes findings, updates state files |
| REQ-002 | /spec_kit:deep-research command manages loop lifecycle | YAML workflow initializes state, dispatches iterations, checks convergence, synthesizes |
| REQ-003 | Externalized state persists across iterations | JSONL + strategy.md files readable by fresh agent context |
| REQ-004 | Convergence detection stops loop appropriately | Loop stops on max iterations, diminishing returns, or all questions answered |
| REQ-005 | Agent is LEAF-only (NDP compliant) | No sub-agent dispatch from @deep-research |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | sk-deep-research skill documents the protocol | SKILL.md with 8 sections, references, templates |
| REQ-007 | Stuck detection with recovery | 3 consecutive no-progress iterations trigger focus widening |
| REQ-008 | Registration in all routing systems | skill_advisor.py, CLAUDE.md, orchestrate.md, descriptions.json |
| REQ-009 | Auto and confirm execution modes | Two YAML workflows with approval gates in confirm mode |

### v2 Requirements (from deep research, P1-P4)

| ID | Requirement | Priority | Effort | Source |
|----|-------------|----------|--------|--------|
| REQ-010 | JSONL parser skips malformed lines with defaults | P1 | S | pi-autoresearch `reconstructState()` |
| REQ-011 | Exhausted approaches: structured BLOCKED entries + PRODUCTIVE selection | P1 | S | AGR 5-tier model |
| REQ-012 | State recovery from iteration-*.md when JSONL corrupted | P1 | S | pi-autoresearch dual recovery |
| REQ-013 | Iteration template includes `## Reflection` section | P1 | S | karpathy PR #282 |
| REQ-014 | Agent protocol defines 5-tier error recovery | P1 | S | AGR + Round 2 direct mode |
| REQ-015 | Composite convergence: 3-signal weighted vote | P1 | M | Optuna + pi-autoresearch PR #22 |
| REQ-016 | Ideas backlog file (`scratch/research-ideas.md`) | P2 | S | autoresearch-opencode |
| REQ-017 | Sentinel pause file support | P2 | S | autoresearch-opencode + pi-autoresearch Issue #6 |
| REQ-018 | Compact state summary in dispatch prompts | P2 | S | Novel (template approach) |
| REQ-019 | 3 explicit stuck recovery heuristics | P2 | S | AGR stuck detection protocol |
| REQ-020 | Segment field on JSONL records | P2 | S | pi-autoresearch segment model |
| REQ-021 | Scored branching with pruning + breakthrough detection | P2 | L | Novel synthesis |
| REQ-022 | MAD-based newInfoRatio noise floor detection | P3 | M | pi-autoresearch PR #22 |
| REQ-023 | Markdown progress visualization | P3 | S | AGR analysis.py |
| REQ-024 | Git commit per iteration (targeted git add) | P3 | S | AGR + pi-autoresearch Issue #3 |
| REQ-025 | File mutability declarations in config | P4 | S | AGR immutable file architecture |
| REQ-026 | True context isolation via `claude -p` | P4 | L | AGR Ralph Loop |
| REQ-027 | Simplicity criterion for newInfoRatio bonus | P4 | S | karpathy original philosophy |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `/spec_kit:deep-research:auto "What is markdown?"` with maxIterations=3 produces config.json, 3 JSONL entries, populated strategy.md, and research.md
- **SC-002**: Convergence test on narrow topic stops before max iterations
- **SC-003**: `skill_advisor.py "deep research"` routes to sk-deep-research with confidence >= 0.8
- **SC-004**: All 13 new files pass syntax validation

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Orchestrator dispatch model | Core loop mechanism | Well-established pattern, no changes needed |
| Dependency | WebFetch tool | External research capability | Degrade gracefully if unavailable |
| Risk | Context degradation in long loops | Med | Fresh context per iteration by design |
| Risk | Runaway loop costs | Med | Max iterations cap (default 10), convergence detection |
| Risk | Agent not reading state files | High | Explicit file paths in dispatch prompt |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration completes in <90 seconds (agent dispatch + execution)
- **NFR-P02**: Full 10-iteration loop completes in <15 minutes

### Reliability
- **NFR-R01**: State survives interruptions (JSONL append-only, auto-resume from state)

---

## 8. EDGE CASES

### Data Boundaries
- Empty research topic: Command setup phase asks for topic
- No WebFetch results: Agent continues with codebase-only research

### Error Scenarios
- Agent dispatch timeout: Retry once with reduced scope, then mark iteration as "timeout"
- State file corruption: Restore from last valid JSONL line
- 3+ consecutive failures: Halt loop, present partial findings

### v2 Error Scenarios (from real execution, Round 2)
- JSONL malformed line: Silent skip + warning count (P1.5, from pi-autoresearch)
- JSONL completely corrupted: Reconstruct from iteration-*.md Assessment sections (P1.4)
- Agent dispatch 529 overload: Orchestrator absorbs work in direct mode (P1.1 Tier 5)
- Post-breakthrough plateau: Don't interpret as convergence -- normal exploration behavior (P1.2)
- Zero-kept at scale: Trigger stuck recovery after N low-value iterations (P2.1, from karpathy Issue #307)
- Shell injection in git commits: Sanitize commit messages (P3.3, from pi-autoresearch PR #13)

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 18, LOC: ~2800, Systems: 3 (agent/command/skill) |
| Risk | 12/25 | No auth, no API, no breaking changes |
| Research | 18/20 | Complete (research.md exists) |
| Multi-Agent | 8/15 | 3 coordinated artifacts |
| Coordination | 10/15 | Dependencies between phases |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Agent ignores state files | H | M | Explicit paths + "Read state first" in Section 0 |
| R-002 | Convergence too aggressive | M | M | Configurable threshold, default 0.05 |
| R-003 | Infinite loop | H | L | Hard max iterations cap |
| R-004 | YAML workflow parsing errors | M | M | Follow established spec_kit_research pattern |

---

## 11. USER STORIES

### US-001: Deep Research on Unknown Topic (Priority: P0)

**As a** developer, **I want** to run autonomous iterative research on an unfamiliar topic, **so that** I get comprehensive findings without manually re-prompting.

**Acceptance Criteria**:
1. Given a research topic, When I run `/spec_kit:deep-research:auto "topic"`, Then the system iterates until convergence and produces research.md

### US-002: Interactive Research with Approval Gates (Priority: P1)

**As a** developer, **I want** to review each iteration before the next starts, **so that** I can steer the research direction.

**Acceptance Criteria**:
1. Given confirm mode, When each iteration completes, Then the system pauses and shows findings before continuing

### US-003: Resume Interrupted Research (Priority: P1)

**As a** developer, **I want** to resume a research loop after interruption, **so that** prior iterations are not wasted.

**Acceptance Criteria**:
1. Given existing JSONL state, When I resume, Then the loop continues from the last completed iteration

---

## 12. OPEN QUESTIONS

- None for v1 (all design decisions documented)
- v2 open: Should scored branching (P2.5) be orchestrator-managed or YAML-managed? Large effort either way.
- v2 open: Should `claude -p` dispatch (P4.3) coexist with Task tool dispatch or replace it?

---

## RELATED DOCUMENTS

- **Research**: See `research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
