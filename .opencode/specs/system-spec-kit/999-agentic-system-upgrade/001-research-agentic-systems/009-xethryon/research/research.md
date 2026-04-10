---
title: "Deep Research Report — 009-xethryon"
description: "20-iteration research of Xethryon for system-spec-kit improvement opportunities. 15 actionable findings, 5 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 009-xethryon

## 1. Executive Summary
- External repo: Xethryon (`https://github.com/EstarinAzx/XETHRYON`), an OpenCode fork that adds persistent project memory, self-reflection, git-aware prompt context, autonomy mode, autonomous skill invocation, and file-backed swarm coordination. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:7-20]
- Iterations executed: 20 of 20
- Stop reason: max_iterations
- Phase 1 findings: 10 iterations, 8 actionable findings, 2 rejected recommendations
- Phase 2 findings: 10 iterations, 7 actionable findings, 3 rejected recommendations
- Combined totals: Must-have 2 | Should-have 8 | Nice-to-have 5 | Rejected 5
- Refactor / pivot verdict totals from Phase 2: REFACTOR 1 | PIVOT 0 | SIMPLIFY 3 | KEEP 6
- Top 5 adoption opportunities for `system-spec-kit`:
  - Add a required claim-verification ledger so every major external claim is marked `verified`, `contradicted`, or `unresolved`. [SOURCE: .opencode/agent/deep-research.md:113-120] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:218-239]
  - Add a verification-evidence field per major claim so deep-research outputs must cite a direct test/source, indirect support, or an explicit coverage gap. [SOURCE: .opencode/agent/deep-research.md:113-120] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-359]
  - Add deferred reconsolidation cadence on top of the existing safer reconsolidation bridge, but only with durable pending-state tracking. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:85-186] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:161-187]
  - Make "future deep loops must externalize state" an explicit design principle instead of letting hidden runtime loops creep in. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23]
  - Add a read-only, branch-aware orientation block to startup/resume surfaces rather than pivoting to repo-global durable memory. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/paths.ts:92-129] [SOURCE: .opencode/skill/system-spec-kit/README.md:170-179]

## 2. External Repo Map
- Structure: Xethryon keeps most changes inside `packages/opencode/src/xethryon/*` plus a few session/tool integrations, with the phase-009 surfaces concentrated in `memory/`, `autonomy.ts`, `tool/switch_agent.ts`, `tool/invoke_skill.ts`, and `swarm/*`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:24-102]
- Main runtime injection points:
  - `session/system.ts` wires memory prompt, relevant-memory recall, autonomy prompt, and git context. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:80-115]
  - `session/prompt.ts` injects memory/git/autonomy into the system prompt, runs the bounded reflection loop, and fires the post-turn memory hook. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1555-1585] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1643-1659]
- Memory lifecycle:
  - `memoryHook.ts` triggers session-memory update, durable extraction, and AutoDream in sequence. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:148-171]
  - `extractMemories.ts` uses a trailing-run guard to write markdown memories plus `MEMORY.md`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/extractMemories.ts:127-155] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/extractMemories.ts:187-233]
  - `findRelevantMemories.ts` is dual-mode but defaults to keyword overlap plus recency/type bonuses when no `llmCall` is supplied. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171]
  - `autoDream.ts` adds 24h/5-session gating with a lock-backed deferred consolidation path. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:76-186]
- Coordination model:
  - Role switching is prompt-injected and tool-enforced through `autonomy.ts` + `switch_agent.ts`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/switch_agent.ts:39-105]
  - Swarm coordination persists state in `.opencode/swarm/{team}/` via config, inbox, and task-board JSON files. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/team_create.ts:25-87] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/spawn.ts:80-130] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/tasks-board.ts:36-157]
- Testing / documentation posture:
  - The README advertises many flagship features, but the rebase checklist covers only a subset and CI does not provide a feature-by-feature verification map. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:10-180] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/.github/workflows/test.yml:48-55] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/.github/workflows/test.yml:104-109]

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

## 3. Phase 1 Baseline
- Phase 1 established that the best import candidates were procedural, not architectural: claim-status tracking, deferred reconsolidation cadence, one-pass publication critique, runtime-agnostic continuity synopsis, compact role-transition guidance, and selective packet-local coordination artifacts.
- Phase 1 also rejected three tempting but weak imports in spirit, even before Phase 2 broadened the analysis: Xethryon's default retrieval engine is weaker than Spec Kit Memory, autonomous skill execution conflicts with Gate 3 and packet binding, and prompt-level always-on git injection is not necessary to get value from git state.
- The most important Phase 1 pattern was that Xethryon often looked stronger from README-level marketing than from live runtime evidence, which is why the claim-verification ledger became the Phase 1 must-have.

## 4. Phase 2 Additions

### 4.1 Documentation and Verification Drift
- Xethryon's strongest new Phase 2 lesson is that fork-analysis packets need both a runtime-surface inventory and a verification-evidence map. The README, rebase checklist, and test surfaces drift in different ways. A researcher needs structure that forces those differences into the final artifact rather than leaving them implicit.
- This is not a narrow Xethryon problem. It generalizes to any external repo whose real behavior is spread across prompts, hooks, and multiple helper modules.

### 4.2 Memory Architecture and Persistence
- Xethryon's repo-global markdown memory is useful as ambient orientation, but too weak as authoritative memory infrastructure. The extraction path trusts model-authored file writes and even shows an internal type-schema mismatch between the declared taxonomy and the extraction prompt.
- The best portable memory lesson remains Phase 1's cadence idea, now sharpened by Phase 2: deferred consolidation is useful only if pending work is durable, inspectable, and replay-safe.

### 4.3 Orchestration and Deep-Loop Architecture
- Phase 2 found that Xethryon's swarm runtime does not reveal a fundamentally better orchestration architecture. It mainly repackages capabilities already present in resumable task sessions with an added mailbox and task-board substrate.
- The stronger architectural signal actually favors Spec Kit: file-mediated deep loops are a better abstraction than hidden runtime reflection/memory loops when the loop outputs are themselves part of the deliverable.

### 4.4 UX and Operator Surface
- Xethryon's autonomy is simpler at the surface than in the architecture. The real import is UX compression, not behavioral replacement.
- The most portable UX gains are small: compact active-constraint hints, visible current-mode guidance, and startup/resume summaries that make Spec Kit easier to operate without hiding how it works.

## 5. Refactor / Pivot Recommendations

### REFACTOR
- **F-011 — Durable Deferred Reconsolidation State**
  - Rebuild any future deferred reconsolidation path around durable scheduler state, not process-local flags.

### SIMPLIFY
- **F-012 — Compact Constraint and Next-Step UX**
  - Keep Gate 1/2/3 and constitutional routing, but surface them as a compact operator summary instead of forcing users to reconstruct the workflow from long docs.
- **F-014 — Read-Only Branch-Aware Orientation**
  - If Spec Kit adds more ambient project orientation, keep it as a generated bootstrap/resume block instead of a new durable memory authority.
- **F-015 — Visible Mode Guidance in Bootstrap/Resume**
  - Borrow Xethryon's clarity of mode/status communication without importing hidden autonomy semantics.

### KEEP
- **R-003 — Do not pivot memory authority to prompt-authored repo-global markdown.**
- **R-004 — Do not pivot orchestration to a live swarm mailbox runtime.**
- **R-005 — Do not replace Level 1/2/3+ spec lifecycle and validation with lighter generic docs.**
- **F-013 — Preserve file-mediated loop architecture.**
- **F-009 / F-010 — improve research schema and evidence discipline, not the core system architecture.**

### PIVOT
- No Phase 2 finding justified a full architectural pivot. The external repo repeatedly suggested tactical imports and UX simplifications, not "throw this subsystem away and rebuild it like Xethryon."

## 6. Findings Registry

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
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-116]

### Finding F-004 — Runtime-Agnostic Continuity Synopsis
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- Priority: should-have
- Description: Xethryon's post-turn memory hook continuously refreshes a session synopsis. Spec Kit already has cached continuity acceptance logic, but the producer side is uneven across runtimes. A runtime-agnostic continuity synopsis would strengthen non-hook resumes.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:148-168] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:174-226]

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

### Finding F-009 — Runtime Surface Inventory for Fork Research
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: Fork research should not rely on prose summaries alone. Deep-research packets should generate a runtime-surface inventory that records major claimed surfaces, where they actually live in code, and what the rebase or maintenance docs omit.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:10-180] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:11-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:120-171]

### Finding F-010 — Verification Evidence Mapping for External Claims
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `.opencode/agent/deep-research.md`
- Priority: must-have
- Description: Deep-research outputs should map each major external claim to explicit verification evidence: direct tests, indirect runtime evidence, or an explicit "coverage not found" note. CI presence alone is not enough.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/.github/workflows/test.yml:48-55] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/package.json:8-12] [SOURCE: .opencode/agent/deep-research.md:113-120]

### Finding F-011 — Durable Deferred Reconsolidation State
- Origin iteration: `iteration-014.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- Priority: should-have
- Description: If Spec Kit adopts Xethryon-style deferred consolidation cadence, it must persist pending-state and replay-state durably rather than relying on process-local flags.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:25-42] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:85-186] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:161-187]

### Finding F-012 — Compact Constraint and Next-Step UX
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- Priority: nice-to-have
- Description: Keep Spec Kit's explicit gates, but compress the operator-facing explanation into a compact "active constraints / next safe action" summary rather than relying primarily on long-form constitutional docs.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:28-97] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-106]

### Finding F-013 — Preserve File-Mediated Loop Architecture
- Origin iteration: `iteration-017.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: Future quality loops in Spec Kit should stay reducer-visible and artifact-backed. Xethryon's hidden runtime loops are good UX compression, but a weaker architecture for governed research and review.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1643-1659] [SOURCE: .opencode/agent/deep-research.md:159-213] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23]

### Finding F-014 — Read-Only Branch-Aware Orientation Surface
- Origin iteration: `iteration-018.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- Priority: should-have
- Description: If Spec Kit wants stronger ambient orientation, it should add a read-only branch-aware orientation block to bootstrap/resume rather than auto-saving more durable repo-global memory.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/paths.ts:92-129] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryTypes.ts:183-202] [SOURCE: .opencode/skill/system-spec-kit/README.md:170-179]

### Finding F-015 — Visible Mode Guidance in Bootstrap / Resume
- Origin iteration: `iteration-020.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- Priority: nice-to-have
- Description: The best small UX import from Xethryon is a concise visible status strip near the top of bootstrap/resume responses: current spec folder, task state, strongest active constraint, and recommended next action.
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:47-68] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:70-82] [SOURCE: .opencode/skill/system-spec-kit/README.md:170-179]

## 7. Rejected Recommendations

### Rejection R-001 — Do Not Port Xethryon's Retrieval Engine
- Origin iteration: `iteration-001.md`
- Rationale: Xethryon's default recall path is a lightweight keyword/recency engine unless an `llmCall` is explicitly wired through. Spec Kit Memory's existing multi-channel retrieval stack is already materially stronger and more governed. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

### Rejection R-002 — Do Not Add Autonomous Skill Execution
- Origin iteration: `iteration-008.md`
- Rationale: Xethryon's `invoke_skill` pattern bypasses exactly the explicit setup and packet-binding steps that Spec Kit is designed to enforce. Borrow reminder language if useful, but not the autonomous execution model. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:70-90] [SOURCE: .opencode/command/spec_kit/deep-research.md:39-47] [SOURCE: .opencode/command/spec_kit/deep-research.md:71-107]

### Rejection R-003 — Do Not Pivot Memory Authority to Prompt-Authored Repo-Global Markdown
- Origin iteration: `iteration-013.md`
- Rationale: Xethryon's repo-global memory is useful for ambient orientation, but its prompt-authored file writes and type-contract mismatch make it a poor authority model for Spec Kit's governed memory system. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/extractMemories.ts:187-233] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryTypes.ts:14-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-84]

### Rejection R-004 — Do Not Pivot to a Live Swarm Mailbox Runtime
- Origin iteration: `iteration-015.md`
- Rationale: Xethryon's swarm runtime largely duplicates capabilities already present in resumable task sessions and coordinator workflows, while adding a second coordination substrate. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/task.ts:69-104] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/team_create.ts:25-87] [SOURCE: .opencode/agent/orchestrate.md:36-47]

### Rejection R-005 — Do Not Replace Spec Lifecycle and Validation with Lighter Generic Docs
- Origin iteration: `iteration-019.md`
- Rationale: Xethryon's lighter documentation posture is cheaper, but it also drifts more easily from runtime truth. Spec Kit's level system and validation pipeline are expensive because they solve a real provenance problem. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:10-180] [SOURCE: .opencode/skill/system-spec-kit/README.md:50-57] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100]

## 8. Cross-Phase Implications
- Packet `006` overlap: findings F-002, F-004, F-006, F-011, and R-003 all touch persistent memory lifecycle and orientation boundaries. Phase `009` should keep ownership of Xethryon-specific import decisions, but any implementation planning should cross-check phase `006` before opening overlapping persistence workstreams.
- Packet `002` overlap: findings F-008 and R-004 touch orchestration and coordination mechanics. Phase `009` should own the portable artifact lesson, while any live runtime coordination proposal belongs in `002`.
- Packet `001` overlap: findings F-009, F-010, and F-013 strengthen the deep-research/deep-review workflow itself and should feed back into the core command/agent packet rather than stay isolated to this repo comparison.

## 9. Priority Queue
1. Implement F-001 and F-010 together so every external claim in future packets has both a verdict and a verification basis.
2. Design F-011 as a durable, operator-visible deferred reconsolidation scheduler rather than a hidden runtime toggle.
3. Codify F-013 in loop docs so future deep-loop features stay reducer-visible and file-mediated.
4. Prototype F-014 and F-015 as additive bootstrap/resume UX improvements without changing memory authority.
5. Treat F-012 as a documentation/UX cleanup once the higher-leverage workflow changes land.

## 10. Recommended Next Step
The best next implementation packet is the research-schema upgrade: combine the Phase 1 claim-status ledger with Phase 2's verification-evidence mapping and runtime-surface inventory. That single workflow improvement would make future external-system research safer, more reproducible, and less likely to mistake polished README language for verified system behavior.
