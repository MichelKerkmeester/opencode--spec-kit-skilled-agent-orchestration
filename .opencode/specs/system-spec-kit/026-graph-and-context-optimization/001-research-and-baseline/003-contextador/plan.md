---
title: "Implementation [system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/003-contextador/plan]"
description: "Research-only execution plan that orchestrates a sk-deep-research loop over Contextador's checked-in source, with cli-codex (gpt-5.4 high) preferred for iteration delegation."
trigger_phrases:
  - "contextador research plan"
  - "deep research loop"
  - "cli-codex delegation"
  - "mcp query interface"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Contextador Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Reading TypeScript/Bun source in `external/`; producing Markdown + JSONL artifacts |
| **Framework** | sk-deep-research loop (`/spec_kit:deep-research:auto`) |
| **Storage** | Phase folder file system: `research/`, `memory/`, top-level Spec Kit docs |
| **Testing** | validate.sh --strict before research, checklist.md verification at the end |

### Overview

Run the autonomous sk-deep-research loop against Contextador's checked-in source under `external/`. Each iteration is a fresh agent dispatch that reads a focused slice of the codebase, writes findings to research/iterations/iteration-NNN.md (created at runtime), appends to the JSONL state log, and lets the reducer update findings-registry.json, the deep-research-strategy file, and the deep-research-dashboard file. cli-codex (gpt-5.4 high) is the preferred iteration runtime; the internal `@deep-research` agent is the fallback.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase folder pre-approved by user (skip Gate 3)
- [x] phase-research-prompt.md present and tailored to 003-contextador
- [x] external/ checkout intact (`src/mcp.ts`, `src/lib/core/`, `src/lib/mainframe/`, `package.json`, README, TROUBLESHOOTING, LICENSE-COMMERCIAL)
- [x] cli-codex skill loaded and Codex CLI available on PATH
- [x] Level 3 spec docs scaffolded and validate.sh --strict accepted

### Definition of Done

- [x] research/research.md compiled with at least 5 evidence-backed findings
- [x] Each finding labeled `adopt now`, `prototype later`, or `reject`
- [x] Cross-phase boundaries with 002-codesight and 004-graphify explicitly resolved
- [x] checklist.md fully verified with evidence
- [x] implementation-summary.md created
- [x] memory artifact written via generate-context.js
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Iterative research loop with externalized state - the sk-deep-research workflow owns init, loop, synthesis, and save phases. Iteration agents are stateless across runs; all durable state lives in JSONL plus reducer-owned registry and strategy files.

### Key Components

- **Loop Manager**: This conversation drives the workflow YAML phases (init, loop, synthesis, save).
- **Iteration Agent (preferred)**: cli-codex `gpt-5.4 high` invoked via `codex exec ... --sandbox workspace-write` with explicit prompts.
- **Iteration Agent (fallback)**: Internal `@deep-research` LEAF agent dispatched via Task tool when Codex is unavailable.
- **Reducer**: `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs` updates registry, strategy, and dashboard after each iteration.
- **Memory Save Bridge**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` produces the post-research memory artifact.

### Data Flow

```
phase-research-prompt.md
        |
        v
[Loop Manager] -- dispatches --> [Iteration Agent (cli-codex)]
        |                                |
        |<--- iteration file ------------+
        |        + JSONL append
        v
[reduce-state.cjs]
        |
        +--> findings-registry.json
        +--> deep-research-strategy file (machine-owned sections)
        +--> deep-research-dashboard.md
        |
        v
[Synthesis] --> research output (research markdown)
        |
        v
[generate-context.js] --> memory/*.md
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Validate user inputs (research topic, spec folder, max iterations, convergence threshold)
- [x] Scaffold Level 3 docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- [x] Re-run validate.sh --strict and confirm a clean status

### Phase 2: Deep Research Loop

- [x] Initialize state files (config json, state jsonl, strategy markdown, findings registry json) inside research/
- [x] Load prior context via `memory_context` and inject into strategy.md
- [x] Dispatch up to 20 iterations using cli-codex (gpt-5.4 high) wherever possible
- [x] After each iteration, run `reduce-state.cjs` and verify iteration outputs
- [x] Stop when convergence is reached or max_iterations is hit

### Phase 3: Synthesis and Save

- [x] Compile the research output (research markdown) with at least 5 findings and the convergence report
- [x] Update checklist.md with evidence
- [x] Create implementation-summary.md
- [x] Save memory via generate-context.js
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Spec Kit folder structure and templates | `validate.sh --strict` |
| Convergence | Iteration loop convergence detection | sk-deep-research convergence rules |
| Evidence audit | Each finding cites a real source path | Manual review during synthesis |
| Memory verification | generate-context.js writes a memory artifact | `ls memory/*.md` after save |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-deep-research skill | Internal | Green | No deep research loop |
| cli-codex skill + codex CLI | Internal + External | Green | Fall back to internal @deep-research |
| system-spec-kit validate.sh | Internal | Green | Cannot verify Level 3 compliance |
| generate-context.js | Internal | Green | Cannot save memory |
| Contextador `external/` source | External | Green | Cannot do source-grounded research |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Iteration loop fails repeatedly, validation regressions, or research outputs cannot be reconciled with the source.
- **Procedure**: Archive `research/` to `research/archive/`, restore from JSONL state log if needed, regenerate the synthesis from iteration files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Deep Research Loop) ──► Phase 3 (Synthesis and Save)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Loop |
| Loop | Setup | Synthesis |
| Synthesis | Loop | Save |
| Save | Synthesis | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Single round of doc scaffolding plus validation |
| Deep Research Loop | High | Up to 20 total iterations with reducer synchronization and closeout refreshes |
| Synthesis and Save | Medium | Compile research.md, checklist, summary, memory |
| **Total** | | **One focused research session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Backup not required (research-only output, no production code touched)
- [x] All writes confined to phase folder
- [x] Iteration JSONL preserved before synthesis edits

### Rollback Procedure

1. Move `research/research.md` to `research/research.md.bak`
2. Re-run synthesis from iteration files
3. Re-verify checklist.md
4. Notify reviewer if findings change materially

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│ Setup        │────►│ Deep Research    │────►│ Synthesis/Save │
│ (scaffold)   │     │ Loop (cli-codex) │     │ (research.md)  │
└──────────────┘     └────────┬─────────┘     └────────────────┘
                              │
                       ┌──────▼───────┐
                       │ Reducer Runs │
                       │ per iteration│
                       └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| spec/plan/tasks/checklist/decision-record | Templates | Level 3 scaffold | Loop start |
| Deep research loop | Scaffold + state files | iteration files + JSONL | Synthesis |
| Reducer | Iteration outputs | registry + dashboard + strategy | Synthesis |
| Synthesis | Loop outputs | research.md | Memory save |
| Memory save | Synthesis + checklist | memory artifact | Phase done |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Scaffold Level 3 docs and pass validate.sh --strict** - CRITICAL
2. **Initialize sk-deep-research state files** - CRITICAL
3. **Run cli-codex iterations until convergence** - CRITICAL
4. **Synthesize research.md and update checklist** - CRITICAL
5. **Save memory via generate-context.js** - CRITICAL

**Total Critical Path**: Sequential, single-track research session

**Parallel Opportunities**:

- Reading external sources for separate iteration focuses can be batched within a single Codex call
- Reducer runs are sequential by design but cheap
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Level 3 scaffold ready | validate.sh --strict accepts the folder | Phase 1 done |
| M2 | Loop converges | sk-deep-research stops on convergence or max iterations | Phase 2 done |
| M3 | Research compiled | research.md has ≥5 findings with full schema | Phase 3 done |
| M4 | Memory saved | memory/*.md exists for 003-contextador | Phase 3 done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Prefer cli-codex (gpt-5.4 high) for iteration delegation

**Status**: Accepted

**Context**: User requested cli-codex gpt-5.4 high agents wherever possible. The default sk-deep-research workflow dispatches the internal `@deep-research` LEAF agent (Claude opus) per iteration.

**Decision**: Replace per-iteration agent dispatch with `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --sandbox workspace-write`, falling back to the internal `@deep-research` agent if Codex is unavailable or rate-limited.

**Consequences**:

- gpt-5.4 high reasoning depth applied to source-grounded research
- Iteration agent has direct access to write iteration files (research/iterations/iteration-NNN markdown) via the workspace-write sandbox
- Mitigation: every iteration prompt includes spec folder context to skip Gate 3 and respects the LEAF constraint (no sub-agent dispatch)

**Alternatives Rejected**:

- Internal `@deep-research` only: rejected because the user explicitly preferred cli-codex
- Mixed model parallel waves: rejected because the auto YAML uses single-track loop and wave orchestration is reference-only

---

### AI EXECUTION PROTOCOL (research loop manager)

This subsection captures the protocol the AI loop manager follows during the research phase. It is part of the L3 ADR addendum and not a separate top-level template section.

#### Pre-Task Checklist

Before each iteration:

- [x] Latest JSONL state read and current_iteration computed
- [x] strategy file Next Focus reviewed
- [x] Phase folder confirmed pre-approved (Gate 3 satisfied)
- [x] Iteration prompt scoped to a single subsystem from the reading order
- [x] cli-codex availability re-checked or fallback path armed

#### Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ-001 | Iterations follow the reading order: mcp.ts, then routing, then feedback and janitor, then Mainframe, then README-level | Loop manager picks the focus area for each dispatch |
| TASK-SCOPE-001 | All writes confined to the phase folder; `external/` stays read-only | Codex sandbox pinned to `workspace-write` and prompt forbids external writes |
| TASK-SEQ-002 | Reducer runs after every iteration before the next dispatch | Loop manager invokes the reducer between iterations |
| TASK-SCOPE-002 | LEAF constraint - iterations may NOT dispatch sub-agents | Iteration prompts state the constraint explicitly |
| TASK-SEQ-003 | Convergence check runs before each new iteration | Loop manager evaluates the composite convergence rules |

#### Status Reporting Format

Each iteration appends a JSONL record describing the iteration result. The dashboard refresh and the loop manager's Status Format use the same fields plus a per-iteration markdown file inside `research/iterations/`.

#### Blocked Task Protocol

If an iteration is BLOCKED (Codex CLI unreachable, file under `external/` missing, or repeated agent failures):

1. Append an `event` JSONL record describing the block with timestamp and reason
2. Try the documented fallback (internal `@deep-research` agent)
3. If still BLOCKED after 3 consecutive failures, halt the loop and proceed to synthesis with partial findings
4. Surface the BLOCKED state in the next dashboard refresh and in implementation-summary Known Limitations

---

<!--
LEVEL 3 PLAN - Tailored to research-only phase 003-contextador
- Loop manager + cli-codex iteration delegation
- Reducer-driven registry/dashboard/strategy synchronization
- Memory save via generate-context.js
-->
