---
title: "Deep Research Report — 009-xethryon"
description: "30-iteration research of Xethryon for system-spec-kit improvement opportunities. 23 actionable findings, 7 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 009-xethryon

## 1. Executive Summary
- External repo: Xethryon (`https://github.com/EstarinAzx/XETHRYON`), an OpenCode fork that compresses operator UX through persistent memory, compact command surfaces, runtime prompt injection, role switching, and bundled skills. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:149-225] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:66-115]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Phase 1 findings: 10 iterations, 8 actionable findings, 2 rejected recommendations
- Phase 2 findings: 10 iterations, 7 actionable findings, 3 rejected recommendations
- Phase 3 findings: 10 iterations, 8 actionable findings, 2 rejected recommendations
- Combined totals: Must-have 3 | Should-have 13 | Nice-to-have 7 | Rejected 7
- Phase 3 UX verdict totals: SIMPLIFY 2 | ADD 2 | MERGE 3 | KEEP 2 | REDESIGN 1
- Top Phase 3 adoption opportunities for `system-spec-kit`:
  - Redesign Gate 2 so skill routing is silent by default and only explained on ambiguity or request. [SOURCE: .opencode/skill/scripts/skill_advisor.py:6-16] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-259]
  - Add one guided lifecycle front door above `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete`. [SOURCE: .opencode/command/spec_kit/plan.md:13-21] [SOURCE: .opencode/command/spec_kit/implement.md:171-201] [SOURCE: .opencode/command/spec_kit/complete.md:198-217]
  - Add a guided spec-level chooser with required-file and validator previews. [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:30-35] [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:66-73] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100]
  - Merge `@context-prime` into startup/bootstrap behavior and keep `@context` as the visible retrieval role. [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context.md:25-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:140-158]
  - Shrink the YAML workflow-asset surface by factoring shared execution skeletons instead of repeating orchestration boilerplate across command assets. [SOURCE: .opencode/command/spec_kit/plan.md:13-21] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/command/index.ts:96-237]

## 2. External Repo Map
- Xethryon's operator surface is anchored around one TUI/chat loop with slash commands, bundled skills, prompt injection, and a smaller visible role vocabulary than `system-spec-kit`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:165-205] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:140-225]
- The runtime composes memory prompt, relevant memories, git context, and autonomy instructions directly into the session system prompt. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:80-115] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1555-1585]
- The loop includes one bounded reflection pass and a background memory post-turn hook, which gives Xethryon a lighter interaction feel but weaker artifact visibility than Spec Kit's explicit deep-loop files. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1389-1428] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1643-1659]

## 3. Cross-Phase Synthesis

### 3.1 Phase 1 — Adoption Baseline
- The strongest imports were procedural and evidence-oriented rather than architectural: claim verification, deferred reconsolidation cadence, bounded publication critique, continuity synopsis, role-transition hints, and packet-local coordination artifacts.
- Phase 1 also established three early rejections that held up through the rest of the research: do not port Xethryon's retrieval engine, do not adopt autonomous skill execution, and do not replace packet-bound memory authority with prompt-authored repo-global markdown.

### 3.2 Phase 2 — Refactor / Pivot Discipline
- Phase 2 showed that Xethryon's polished UX often sits on top of weaker verification and hidden runtime behavior, which means Spec Kit should import selected patterns without pivoting its core architecture.
- The most important Phase 2 architectural lesson was to preserve file-mediated, artifact-backed deep loops even when Xethryon's runtime reflection looks lighter. [SOURCE: .opencode/agent/deep-research.md:121-171] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1389-1428]

### 3.3 Phase 3 — UX, Agentic System & Skills Analysis
- The main UX problem in `system-spec-kit` is not raw feature count. It is exposed ceremony: too many visible lifecycle doors, too much visible routing theory, and too many operator-facing capability buckets.
- Xethryon repeatedly wins on perceived simplicity by hiding machinery behind one interaction surface. `system-spec-kit` should copy that compression selectively, not its hidden autonomy semantics.
- The best Phase 3 imports are therefore surface-level merges and simplifications:
  - merge the visible lifecycle into one guided front door
  - add a guided spec-level chooser instead of teaching taxonomy first
  - hide `context-prime` inside startup behavior
  - consolidate the visible skill catalog
  - make Gate 2 silent by default
  - compress gate theory into a preflight summary
  - add one workflow card spanning bootstrap, resume, and active execution
  - shrink the YAML asset surface without abandoning explicit machine-readable workflows
- Phase 3 also produced two firm rejections:
  - do not collapse `/memory:*` into the main lifecycle surface
  - do not replace explicit LEAF deep-loop agents with hidden runtime iteration

## 4. Findings Registry

### 4.1 Actionable Findings
| ID | Iteration | Priority | Target | Summary |
|---|---|---|---|---|
| F-001 | 010 | must-have | `.opencode/agent/deep-research.md` | Add a claim-verification ledger so major external claims are marked `verified`, `contradicted`, or `unresolved`. |
| F-002 | 004 | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Add deferred reconsolidation cadence on top of save-time reconsolidation. |
| F-003 | 005 | should-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Add an explicit one-pass publication critique instead of relying on hidden reflection. |
| F-004 | 003 | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Generate a runtime-agnostic continuity synopsis for stronger non-hook recovery. |
| F-005 | 007 | should-have | `.opencode/agent/orchestrate.md` | Compress role-transition rules into a compact trigger matrix. |
| F-006 | 002 | nice-to-have | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Add a read-only project orientation surface derived from packet artifacts. |
| F-007 | 006 | nice-to-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Surface a small bootstrap-time git snapshot. |
| F-008 | 009 | nice-to-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Prototype a packet-local coordination board for high-scale agentic work. |
| F-009 | 011 | should-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Require a runtime-surface inventory in fork research. |
| F-010 | 012 | must-have | `.opencode/agent/deep-research.md` | Map major external claims to explicit verification evidence. |
| F-011 | 014 | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Persist deferred reconsolidation pending-state durably. |
| F-012 | 016 | nice-to-have | `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | Compress active constraints and next-step guidance into a short operator summary. |
| F-013 | 017 | should-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Preserve file-mediated loop architecture as an explicit design principle. |
| F-014 | 018 | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Add a read-only branch-aware orientation surface to bootstrap/resume. |
| F-015 | 020 | nice-to-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Add visible mode/status guidance near the top of bootstrap/resume payloads. |
| F-016 | 021 | should-have | `.opencode/command/spec_kit/plan.md` | Add one guided lifecycle front door above plan, implement, and complete. |
| F-017 | 023 | should-have | `.opencode/agent/speckit.md` | Add a guided spec-level chooser with required-file and validator previews. |
| F-018 | 024 | should-have | `.opencode/agent/orchestrate.md` | Merge `@context-prime` into startup behavior and keep `@context` as the visible retrieval role. |
| F-019 | 026 | nice-to-have | `.opencode/skill/system-spec-kit/SKILL.md` | Consolidate the visible skill catalog into fewer umbrella surfaces. |
| F-020 | 027 | must-have | `.opencode/skill/scripts/skill_advisor.py` | Redesign Gate 2 so skill routing is silent by default and only explained on ambiguity or request. |
| F-021 | 028 | should-have | `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | Replace most gate-theory exposure with a compact preflight summary and optional deep explanation. |
| F-022 | 029 | nice-to-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Add one active workflow card spanning bootstrap, resume, blockers, validation, and next action. |
| F-023 | 030 | should-have | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Factor shared workflow skeletons so YAML assets describe deltas rather than repeated orchestration. |

### 4.2 Rejected Recommendations
| ID | Iteration | Summary |
|---|---|---|
| R-001 | 001 | Do not port Xethryon's retrieval engine into Spec Kit Memory. |
| R-002 | 008 | Do not add Xethryon-style autonomous skill execution. |
| R-003 | 013 | Do not pivot memory authority to prompt-authored repo-global markdown. |
| R-004 | 015 | Do not pivot to a live swarm mailbox runtime. |
| R-005 | 019 | Do not replace the spec lifecycle and validation with lighter generic docs. |
| R-006 | 022 | Do not collapse `/memory:*` into `/spec_kit:*`; keep memory as a specialist surface. |
| R-007 | 025 | Do not replace explicit LEAF research/review agents with hidden runtime iteration. |

## 5. Phase 3 Verdict Breakdown
- **MERGE (3):**
  - lifecycle front door above plan/implement/complete
  - `context-prime` into startup/bootstrap behavior
  - visible skill catalog consolidation
- **SIMPLIFY (2):**
  - compress gate theory into a preflight summary
  - shrink the YAML asset abstraction boundary
- **ADD (2):**
  - guided spec-level chooser
  - active workflow card
- **KEEP (2):**
  - `/memory:*` remains a separate specialist surface
  - LEAF deep-loop agents remain explicit
- **REDESIGN (1):**
  - Gate 2 becomes silent-by-default routing instead of operator-facing ceremony

## 6. Priority Queue
1. Implement F-001 and F-010 together so future external research packets cannot blur README claims, runtime evidence, and verification coverage.
2. Implement F-020 next: silent skill routing is the highest-leverage UX improvement from Phase 3 because it removes ceremony without removing capability.
3. Prototype F-016 plus F-021 as one operator-surface package: guided lifecycle front door plus compact preflight summary.
4. Add F-017 and F-022 as onboarding/continuity improvements so spec creation and long-running work feel more guided.
5. Treat F-018, F-019, and F-023 as surface-cleanup work once the higher-leverage workflow changes land.

## 7. Recommended Next Step
The best next implementation packet is now a UX-compression packet inside `system-spec-kit` itself:

1. redesign Gate 2 into silent-by-default routing
2. add a single lifecycle front door
3. add a shared preflight/workflow summary object consumed by bootstrap, resume, and guided workflow entry

That packet would import Xethryon's biggest practical advantage, lower visible friction, without inheriting its weaker hidden-autonomy tradeoffs.
