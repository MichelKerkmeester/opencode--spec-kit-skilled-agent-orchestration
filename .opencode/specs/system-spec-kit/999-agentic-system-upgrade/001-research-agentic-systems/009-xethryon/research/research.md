---
title: "Deep Research Report — 009-xethryon"
description: "10-iteration research of Xethryon for system-spec-kit improvement opportunities. 8 actionable findings, 2 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 009-xethryon

## 1. Executive Summary
- External repo: Xethryon (`https://github.com/EstarinAzx/XETHRYON`), an OpenCode fork that adds persistent project memory, self-reflection, git-aware prompt context, autonomy mode, autonomous skill invocation, and file-backed swarm coordination. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:7-20]
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 8
- Must-have: 1 | Should-have: 4 | Nice-to-have: 3 | Rejected: 2
- Top 3 adoption opportunities for system-spec-kit:
  - Add a required claim-verification ledger to deep-research iterations and synthesis so external README claims must be marked `verified`, `contradicted`, or `unresolved`. [SOURCE: .opencode/agent/deep-research.md:113-120] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:218-239]
  - Add AutoDream-style deferred reconsolidation cadence on top of the existing safer reconsolidation bridge. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:76-167] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:161-260]
  - Add an explicit one-pass research-publication critique gate to the deep-research workflow instead of relying on implicit quality checks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-116]

## 2. External Repo Map
- Structure: Xethryon keeps most changes inside `packages/opencode/src/xethryon/*` plus a few session/tool integrations, with the main phase-009 surfaces living in `memory/`, `reflection.ts`, `git.ts`, `autonomy.ts`, `tool/switch_agent.ts`, `tool/invoke_skill.ts`, and `swarm/*`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:24-102]
- Main runtime injection points:
  - `session/system.ts` wires memory prompt, relevant-memory recall, autonomy prompt, and git context. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:80-115]
  - `session/prompt.ts` injects memory/git/autonomy into the system prompt, runs the bounded reflection loop, and fires the post-turn memory hook. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1555-1585] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1643-1660]
- Memory lifecycle:
  - `memoryHook.ts` triggers session-memory update, durable extraction, and AutoDream in sequence. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:148-168]
  - `extractMemories.ts` uses a trailing-run guard to write markdown memories plus `MEMORY.md`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/extractMemories.ts:127-255]
  - `findRelevantMemories.ts` is dual-mode but defaults to keyword overlap plus recency/type bonuses when no `llmCall` is supplied. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:96-171]
  - `autoDream.ts` adds 24h/5-session gating with a lock-backed deferred consolidation path. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:76-167]
- Coordination model:
  - Role switching is prompt-injected and tool-enforced through `autonomy.ts` + `switch_agent.ts`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/switch_agent.ts:39-105]
  - Swarm coordination persists state in `.opencode/swarm/{team}/` via config, inbox, and task-board JSON files. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/paths.ts:11-58]

```text
User prompt
  -> session/system.ts
     -> memory prompt
     -> relevant memories
     -> git context
     -> autonomy prompt
  -> session/prompt.ts
     -> LLM turn
     -> optional reflection revise loop
     -> background memory hook
        -> session summary
        -> durable extraction
        -> AutoDream gate
  -> optional swarm tools
     -> team config
     -> inbox JSON
     -> tasks.json
```

## 3. Findings Registry

### Finding F-001 — Claim Verification Ledger for Deep Research
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/agent/deep-research.md`
- Priority: must-have
- Description: Xethryon's README made a materially false-seeming claim about default LLM-ranked retrieval, and the current deep-research contract does not force a researcher to record that mismatch as `verified`, `contradicted`, or `unresolved`. Adding a mandatory claim-status ledger would make docs-vs-code drift a first-class artifact instead of an incidental observation.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:11-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171] [SOURCE: .opencode/agent/deep-research.md:113-120]

### Finding F-002 — Deferred Reconsolidation Cadence
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- Priority: should-have
- Description: Spec Kit's reconsolidation engine is safer than Xethryon's, but it only runs on save-time pathways. Xethryon's AutoDream shows a useful scheduling pattern: reconsolidate when enough time and enough activity have accumulated, with explicit pending state and locking.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:76-167] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/consolidationLock.ts:44-115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:161-260]

### Finding F-003 — Explicit One-Pass Publication Critique
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: Xethryon's reflection loop shows the value of one bounded critique pass before publication. Spec Kit should adopt that idea as an explicit, logged research-publication gate rather than a hidden runtime loop.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/reflection.ts:4-13] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-116]

### Finding F-004 — Runtime-Agnostic Continuity Synopsis
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- Priority: should-have
- Description: Xethryon's post-turn memory hook continuously refreshes a session synopsis. Spec Kit already has cached continuity acceptance logic, but the producer side is uneven across runtimes. A runtime-agnostic continuity synopsis would strengthen non-hook resumes.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:148-168] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:175-277] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:174-226]

### Finding F-005 — Compact Role-Transition Trigger Matrix
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Description: Spec Kit's routing rules are comprehensive but verbose. Xethryon's switch heuristics show that a compact trigger matrix can make correct role transitions easier without changing the underlying governance model.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/switch_agent.ts:39-68] [SOURCE: .opencode/agent/orchestrate.md:89-106]

### Finding F-006 — Project-Level Orientation Surface
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- Priority: nice-to-have
- Description: Xethryon's repo-scoped `MEMORY.md` gives every session an ambient orientation layer. Spec Kit should prototype an additive project-orientation surface derived from packet artifacts, not replace spec-folder memory with a repo-global free-form namespace.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/paths.ts:80-136] [SOURCE: .opencode/skill/system-spec-kit/README.md:50-57] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:36-57]

### Finding F-007 — Bootstrap-Time Git Snapshot
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- Priority: nice-to-have
- Description: Spec Kit already extracts git context for saved memories, but resume/bootstrap do not foreground live repo state. A small git snapshot section could make continuation choices safer without adopting Xethryon's always-on prompt injection.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/git.ts:68-193] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:93-107] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-72] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126]

### Finding F-008 — Packet-Local Coordination Board
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: nice-to-have
- Description: Xethryon's mailbox runtime is too application-specific, but its task-board artifact shape is portable. Spec Kit could prototype a reducer-owned coordination board inside `research/` and `review/` packets for high-scale agentic work.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/tasks-board.ts:36-157] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/mailbox.ts:52-108] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89]

## 4. Rejected Recommendations

### Rejection R-001 — Do Not Port Xethryon's Retrieval Engine
- Origin iteration: `iteration-001.md`
- Rationale: Xethryon's default recall path is a lightweight keyword/recency engine unless an `llmCall` is explicitly wired through. Spec Kit Memory's existing multi-channel retrieval stack is already materially stronger and more governed. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

### Rejection R-002 — Do Not Add Autonomous Skill Execution
- Origin iteration: `iteration-008.md`
- Rationale: Xethryon's `invoke_skill` pattern bypasses exactly the explicit setup and packet-binding steps that Spec Kit is designed to enforce. Borrow the reminder language if useful, but not the autonomous execution model. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:70-90] [SOURCE: .opencode/command/spec_kit/deep-research.md:39-47] [SOURCE: .opencode/command/spec_kit/deep-research.md:71-107]

## 5. Cross-Phase Implications
- Packet `006` overlap: findings F-002, F-004, and F-006 all touch persistent memory lifecycle and repo-level continuity. Phase `009` should keep ownership of Xethryon-specific memory lifecycle patterns, but any implementation planning should cross-check phase `006` before creating duplicate persistence workstreams.
- Packet `002` overlap: finding F-008 touches orchestration and coordination mechanics. Phase `009` should own the packet-local artifact pattern, while any proposal to add a live runtime mailbox or multi-session execution surface belongs in `002`.

## 6. Recommended Next Step
Plan the claim-verification ledger first. It is the smallest high-leverage change, it directly addresses the most important failure mode exposed by this research, and it will make every later external-system packet safer by default. After that, queue the deferred reconsolidation cadence and explicit one-pass publication critique as the next two implementation candidates.
