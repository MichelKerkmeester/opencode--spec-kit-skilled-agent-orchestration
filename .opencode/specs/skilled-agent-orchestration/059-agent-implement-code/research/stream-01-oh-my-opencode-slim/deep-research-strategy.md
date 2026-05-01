---
title: Deep Research Strategy - Stream 01 oh-my-opencode-slim
description: Tracks research progress for stream-01 packet investigating oh-my-opencode-slim patterns
---

# Deep Research Strategy - Stream-01 oh-my-opencode-slim

## 1. OVERVIEW

### Purpose
Investigate reusable patterns from the oh-my-opencode-slim plugin that inform the design of a new @code LEAF agent. Single-stream packet; cross-stream synthesis happens at parent level (059-agent-implement-code).

### Usage
- **Init:** Stream-01 packet initialized with 5 priority key questions; question 3 (caller-restriction enforcement) is highest priority.
- **Per iteration:** cli-codex executor reads Next Focus, writes iteration evidence, reducer refreshes machine-owned sections.

---

## 2. TOPIC
Identify reusable patterns from oh-my-opencode-slim multi-agent orchestration plugin that inform the design of a new @code LEAF agent for our .opencode/agent/ inventory.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: Skill auto-loading patterns — RESOLVED iter-3.
- [x] Q2: Stack-agnostic detection mechanisms — RESOLVED iter-2.
- [x] Q3: Caller-restriction enforcement — RESOLVED iter-1.
- [x] Q4: Write-capable safety guarantees — RESOLVED iter-2.
- [x] Q5: Sub-agent dispatch contracts — RESOLVED iter-3.

---

## 4. NON-GOALS
- Cross-stream synthesis with stream-02 (opencode-swarm-main) and stream-03 (internal agent inventory). That happens at parent level.
- Building the @code agent itself; we only produce a recommended skeleton.
- Auditing the entire oh-my-opencode-slim codebase; only the patterns relevant to the 5 questions.

---

## 5. STOP CONDITIONS
- All 5 key questions resolved with at least one cited finding each (file:line citations from the external folder).
- Convergence: rolling-avg newInfoRatio < 0.05 over 3 iterations AND coverage >= 0.85.
- Hard cap: iteration 8.

---

## 6. ANSWERED QUESTIONS
All 5 questions resolved across 4 iterations. Stop reason: `all_questions_answered`. See `findings-registry.json` for the canonical resolution summaries and `iterations/iteration-{1..4}.md` for the evidence trail.

- Q3 (iter-1): Layered caller-restriction = mode classification + permission deny + plugin-owned `toolContext.agent` guard for `council_session` + delegate-task-retry hook reacting to OpenCode core's "Agent X is not allowed" errors.
- Q2 (iter-2): No stack detector. Reusable pattern is the codemap skill (agent infers globs and persists a hash-based folder map).
- Q4 (iter-2): apply-patch hook (root/worktree path guard + conservative verification + EOL preservation), per-agent MCP allowlist, prompt-level fixer constraints, prompt nudges via post-file-tool-nudge.
- Q1 (iter-3): Install-time recommendation (presets) + runtime visibility filter (filter-available-skills hook + getSkillPermissionsForAgent). No semantic auto-load.
- Q5 (iter-3): Two distinct dispatch paths — OpenCode task tool (validated by task-session-manager when sessionAgentMap===orchestrator) and direct client.session.create for council->councillor with parentID + tools.task=false. SubagentDepthTracker default max=3 (NOT depth-1).

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
[Populated after iteration 1]

---

## 8. WHAT FAILED
[Populated after iteration 1]

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated as approaches dead-end]

---

## 10. RULED OUT DIRECTIONS
[Populated as directions are ruled out]

---

## 11. NEXT FOCUS
Phase 3 synthesis (research.md). Loop converged: all_questions_answered.

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
This packet investigates oh-my-opencode-slim ONLY. Cross-stream synthesis with stream-02 and stream-03 happens at parent level (059-agent-implement-code). Preliminary grep located:
- `src/hooks/filter-available-skills/` — possible skill-gating mechanism
- `src/agents/index.ts:429` — comment about Council being "callable both as primary and ..." (suggests caller-mode distinctions exist)

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output (stream-local)
- Lifecycle branches: resume, restart (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/stream-01-oh-my-opencode-slim/.deep-research-pause
- Capability matrix: .opencode/skill/sk-deep-research/assets/runtime_capabilities.json
- Current generation: 1
- Started: 2026-05-01
