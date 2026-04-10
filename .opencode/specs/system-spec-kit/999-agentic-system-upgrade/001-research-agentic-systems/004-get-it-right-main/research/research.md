---
title: "Deep Research Report — 004-get-it-right-main"
description: "30-iteration research of Get It Right for system-spec-kit improvement, UX simplification, and refactor opportunities. 26 actionable findings, 4 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 004-get-it-right-main

## 1. Executive Summary
- External repo studied: `Get It Right`, a small Reliant workflow for retry-based AI coding in brownfield codebases. Its visible product surface is one workflow, three role docs, and a few explanation docs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:7-12] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Total actionable findings: 26
- Must-have: 13 | Should-have: 13 | Nice-to-have: 0 | Rejected: 4
- Phase 1 established that Get It Right contains portable retry-loop patterns: fresh forks, pre-review objective checks, compressed review feedback, and explicit review strategy outputs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:13-53] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-29]
- Phase 2 showed the adoption shape is not "bolt retries into `/spec_kit:implement`." The real architecture is a separate retry controller, packet-local working state, outcome-centric attempt gates, and a shared loop kernel that retry, deep-research, and deep-review can all reuse. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-150] [SOURCE: .opencode/command/spec_kit/implement.md:151-205] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93]
- Phase 3 changed the center of gravity again. The biggest remaining gap is not just retry architecture. It is operator UX: too many lifecycle commands, too much visible memory machinery, too much public agent/skill taxonomy, and too much exposed gate/hook scaffolding compared with the external repo's simpler surface. [SOURCE: .opencode/README.md:52-60] [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/implement.md:29-125] [SOURCE: .opencode/command/spec_kit/complete.md:32-150]
- Top adoption opportunities across all three phases:
- Build one primary feature-workflow surface instead of teaching `plan`, `implement`, and `complete` as equally primary entry points. [SOURCE: .opencode/command/spec_kit/plan.md:149-181] [SOURCE: .opencode/command/spec_kit/implement.md:151-205] [SOURCE: .opencode/command/spec_kit/complete.md:156-229]
- Merge routine memory actions into the main spec-kit journey and reserve `/memory:*` for expert analysis or administration. [SOURCE: .opencode/command/memory/search.md:53-92] [SOURCE: .opencode/command/memory/manage.md:33-62] [SOURCE: .opencode/command/spec_kit/implement.md:195-205]
- Keep loop-critical working state packet-local and reserve durable memory for synthesis and explicit save boundaries. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:591-611]
- Extract a shared loop kernel across retry, deep-research, and deep-review. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]
- Redesign the visible gate/hook/constitutional surface so runtime automation hides more of the governance machinery. [SOURCE: CLAUDE.md:107-141] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-170] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-105]

## 2. External Repo Map
- `external/workflow.yaml` is the real source of truth: loop condition, retry budget, check gates, strategy branching, and output wiring all live there. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:1-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-150]
- The external role set is intentionally small: implementer, reviewer, refactorer. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-159]
- Checks are optional, parallel, and decisive. If lint/test/build fail, review is skipped and the loop continues. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:33-38] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:34-45]
- Only review feedback crosses iteration boundaries; implement narratives, logs, and refactor notes remain in forks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:47-48] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-29]
- Operator-visible control is compact: retry budget, mode, yield, verification commands, and optional UX review inputs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105]

```text
Original request
  -> Implement (fresh fork)
  -> Lint/Test/Build (parallel)
  -> Review (strategy selector)
  -> Refactor only on "refactor"
  -> Loop continues with review feedback only
```

## 3. Cross-Phase Synthesis
- **Phase 1:** adopt the portable retry mechanics, not the Reliant runtime. The important ideas are fresh context per attempt, reviewer-authored feedback as the bridge, and deterministic pre-review checks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:147-159]
- **Phase 2:** keep retry-mode separate from the normal implementation lifecycle, keep working state out of durable memory, and extract common loop primitives instead of building another bespoke stack. [SOURCE: .opencode/command/spec_kit/implement.md:151-205] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380]
- **Phase 3:** even if retry-mode were added tomorrow, the surrounding operator experience would still be too heavy. The bigger opportunity is to simplify how commands, memory, templates, agents, skills, gates, and hooks are presented and chained. [SOURCE: .opencode/README.md:52-60] [SOURCE: .opencode/skill/README.md:42-70] [SOURCE: CLAUDE.md:107-141]

## 4. Phase 1 Findings Registry

### Finding F-001 — Add An Opt-In Attempt Controller
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: should-have
- Description: `system-spec-kit` needs a first-class attempt controller for one difficult coding task rather than relying only on linear implementation flows. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:313-518]

### Finding F-002 — Use A Feedback-Only Bridge Between Attempts
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: should-have
- Description: the next attempt should receive a reviewer-authored corrective summary, not full attempt history. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:14-24] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:217-223]

### Finding F-003 — Reuse Fresh-Context Iteration Semantics
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: future retry workflows should reuse fresh forks and externalized state instead of cumulative chat context. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:152-158] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-330]

### Finding F-004 — Add A Pre-Review Validation Gate
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: broken attempts should fail fast on objective checks before semantic review runs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:54-75] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99]

### Finding F-005 — Extend The Review Agent With A Strategy Field
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/agent/review.md`
- Priority: should-have
- Description: retry controllers need a branch decision such as `pass | continue | refactor`, not only scored findings. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:183-223] [SOURCE: .opencode/agent/review.md:239-243]

### Finding F-006 — Adopt The Pattern, Not The Runtime
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/implement.md`
- Priority: must-have
- Description: port the retry control pattern, not Reliant-specific thread or node APIs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:294-330]

### Finding F-007 — Keep Retry Feedback Packet-Local
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/SKILL.md`
- Priority: should-have
- Description: retry guidance should live in packet-local state rather than durable indexed memory by default. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-gates.ts:17-67]

### Finding F-008 — Build A Configurable Parallel Verification Matrix
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: package lint/test/build as a reusable parallel attempt gate instead of ad hoc per-flow orchestration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:165-181] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99]

### Finding F-009 — Keep The Retry Loop Opt-In And Phase-Scoped
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/command/spec_kit/implement.md`
- Priority: must-have
- Description: retry-mode should be explicit and scoped to brownfield understanding failures, not the default implementation path. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:136-149] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:59-67]

## 5. Phase 2 Findings Registry

### Finding F-010 — Separate Retry Controller From `/spec_kit:implement`
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/command/spec_kit/retry.md` plus dedicated YAML assets
- Priority: must-have
- Description: retry-mode should be its own controller, not a branch buried inside the 9-step implementation workflow. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:7-24] [SOURCE: .opencode/command/spec_kit/implement.md:151-205]

### Finding F-011 — Use A Fixed Retry Packet Instead Of Level Arbitration
- Origin iteration: `iteration-012.md`
- system-spec-kit target: retry packet conventions plus `create.sh` / `validate.sh` routing rules
- Priority: should-have
- Description: retry-mode should not inherit the whole Level 1/2/3 packet arbitration model. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244]

### Finding F-012 — Simplify Retry UX To A Few Explicit Knobs
- Origin iteration: `iteration-013.md`
- system-spec-kit target: retry command surface
- Priority: should-have
- Description: retry-mode should be controlled by a few explicit knobs once the packet is known. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:89-139]

### Finding F-013 — Split Working State From Durable Memory More Aggressively
- Origin iteration: `iteration-014.md`
- system-spec-kit target: memory save architecture (`generate-context.js`, post-save review, loop contracts)
- Priority: must-have
- Description: loop continuity should be packet-local, with durable memory reserved for synthesis and explicit preservation boundaries. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93]

### Finding F-014 — Refactor Execution Loops Around A Smaller Core Role Set
- Origin iteration: `iteration-015.md`
- system-spec-kit target: agent architecture and orchestrator routing contracts
- Priority: should-have
- Description: execution loops should use a smaller reusable runtime role set even if the broader framework keeps more specialists. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-159] [SOURCE: .opencode/agent/orchestrate.md:95-107]

### Finding F-015 — Make Deep-Loop Views Optional, Not Mandatory
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: registry/dashboard/strategy outputs should be optional views for lighter loops, not mandatory ceremony in every case. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/agent/deep-research.md:159-165]

### Finding F-016 — Pivot Retry Validation Toward Outcome-Centric Attempt Gates
- Origin iteration: `iteration-018.md`
- system-spec-kit target: retry workflow and implementation completion contracts
- Priority: must-have
- Description: retry-mode should gate first on objective code outcomes and only later on full packet-validation concerns. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:54-75] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:94-99]

### Finding F-017 — Extract A Generic Loop Kernel Shared By Retry, Deep Research, And Deep Review
- Origin iteration: `iteration-020.md`
- system-spec-kit target: loop orchestration architecture across command YAMLs and support scripts
- Priority: should-have
- Description: retry, deep-research, and deep-review already share the same broad loop skeleton and should stop re-implementing it independently. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]

## 6. Phase 3 — UX, Agentic System & Skills Analysis
- The external repo's strongest new lesson is not another retry mechanic. It is restraint. Its public surface stays close to user intent: one workflow, three roles, a few knobs, and a tiny artifact set. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:19-49] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105]
- `system-spec-kit` now exposes enough commands, agents, skills, templates, and YAML assets that the framework itself risks becoming the task. [SOURCE: .opencode/README.md:52-60]
- The lifecycle command split is the largest visible UX issue: `plan`, `implement`, and `complete` all restate setup and phase semantics as first-class entry surfaces. [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/implement.md:29-125] [SOURCE: .opencode/command/spec_kit/complete.md:32-150]
- Memory is also over-exposed as a separate product surface for ordinary work. The system should preserve the deep tooling, but fold common save/resume/recall behavior into the normal feature path. [SOURCE: .opencode/command/memory/search.md:53-92] [SOURCE: .opencode/command/memory/manage.md:33-62]
- The template and validator layer remains valuable, but the visible mental model is too framework-maintainer oriented. [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:30-60] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-75]
- The agent and skill catalogs expose too many internal distinctions. The real public capability model could be much smaller without deleting the specialist internals. [SOURCE: .opencode/README.md:97-117] [SOURCE: .opencode/skill/README.md:42-70]
- The gate/hook/constitutional layer is already doing real automation. That is exactly why more of it should disappear from the everyday operator story. [SOURCE: CLAUDE.md:107-141] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-170] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-105]

## 7. Phase 3 Findings Registry

### Finding F-018 — Merge The Lifecycle Commands Behind One Primary Operator Surface
- Origin iteration: `iteration-021.md`
- system-spec-kit target: `spec_kit` lifecycle command architecture
- Priority: must-have
- Description: keep distinct internal phases, but stop teaching `plan`, `implement`, and `complete` as equally primary entry points. [SOURCE: .opencode/command/spec_kit/plan.md:149-181] [SOURCE: .opencode/command/spec_kit/implement.md:151-205] [SOURCE: .opencode/command/spec_kit/complete.md:156-229]

### Finding F-019 — Merge Routine Memory Actions Into The Main SpecKit Journey
- Origin iteration: `iteration-022.md`
- system-spec-kit target: memory command architecture plus `/spec_kit:*` lifecycle integration
- Priority: must-have
- Description: save, resume, and lightweight recall should feel built-in to the feature workflow rather than like a separate operator product. [SOURCE: .opencode/command/memory/search.md:53-92] [SOURCE: .opencode/command/memory/manage.md:33-62] [SOURCE: .opencode/command/spec_kit/implement.md:195-205]

### Finding F-020 — Simplify The Markdown Plus YAML Command Stack
- Origin iteration: `iteration-023.md`
- system-spec-kit target: command entry architecture and shared setup/routing logic
- Priority: should-have
- Description: centralize shared setup logic instead of restating ownership blocks and first-message ceremony in each command file. [SOURCE: .opencode/command/spec_kit/plan.md:7-21] [SOURCE: .opencode/command/spec_kit/plan.md:37-138] [SOURCE: .opencode/command/spec_kit/implement.md:35-120]

### Finding F-021 — Simplify Template Levels And Validation UX
- Origin iteration: `iteration-024.md`
- system-spec-kit target: template routing, level-selection UX, and validator messaging
- Priority: should-have
- Description: keep durable packets and strict validation, but expose stronger defaults and less framework architecture in everyday flows. [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:30-60] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-75] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100]

### Finding F-022 — Merge `@context-prime` And `@context` Into One Public Capability
- Origin iteration: `iteration-025.md`
- system-spec-kit target: agent routing, agent docs, and context bootstrap UX
- Priority: should-have
- Description: bootstrap and deep retrieval are different modes, but should not require separate public role identities. [SOURCE: .opencode/agent/orchestrate.md:18-21] [SOURCE: .opencode/agent/orchestrate.md:95-107] [SOURCE: .opencode/agent/context-prime.md:34-39] [SOURCE: .opencode/agent/context.md:45-54]

### Finding F-023 — Reduce The Visible Agent Roster Even If Specialist Internals Remain
- Origin iteration: `iteration-026.md`
- system-spec-kit target: public agent taxonomy and command-level role exposure
- Priority: should-have
- Description: keep specialist prompts internally, but group them into a smaller operator-facing capability model. [SOURCE: .opencode/README.md:97-117] [SOURCE: .opencode/agent/orchestrate.md:95-107] [SOURCE: .opencode/agent/handover.md:22-32]

### Finding F-024 — Consolidate The Public `sk-code-*` Family Into A Smaller `sk-code` Model
- Origin iteration: `iteration-027.md`
- system-spec-kit target: skill catalog, skill routing UX, and `sk-code-*` docs
- Priority: must-have
- Description: preserve baseline-plus-overlay internals, but stop presenting several similar `sk-code-*` brands as separate top-level products. [SOURCE: .opencode/skill/README.md:121-129] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-29] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-33] [SOURCE: .opencode/skill/sk-code-review/SKILL.md:49-56]

### Finding F-025 — Redesign The Gate / Hook / Constitutional Operator Surface
- Origin iteration: `iteration-029.md`
- system-spec-kit target: operator-facing policy docs, startup/resume UX, and gate/hook surfacing strategy
- Priority: must-have
- Description: keep governance and automation, but hide more of the transport and rule machinery during ordinary work. [SOURCE: CLAUDE.md:107-141] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:29-31]

### Finding F-026 — Redesign The Default End-To-End Feature Workflow Around Lower Friction Defaults
- Origin iteration: `iteration-030.md`
- system-spec-kit target: full operator journey across commands, skills, templates, gates, and memory
- Priority: must-have
- Description: define one opinionated default feature path and demote expert surfaces to opt-in modes. [SOURCE: .opencode/README.md:52-60] [SOURCE: .opencode/command/spec_kit/complete.md:198-229] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:19-49]

## 8. Verdict Recommendations

| Iteration | Subsystem | Verdict | Summary | Blast Radius |
| --- | --- | --- | --- | --- |
| 011 | Command / implementation flow | REFACTOR | Build retry-mode as a separate controller, not as an extension of the 9-step implement workflow | large |
| 012 | Spec packet shape | SIMPLIFY | Use a fixed retry packet instead of Level 1/2/3 arbitration | medium |
| 013 | Operator UX | SIMPLIFY | Replace the generic retry setup questionnaire with a few explicit knobs | medium |
| 014 | Memory architecture | PIVOT | Split loop-critical working state from durable indexed memory more aggressively | architectural |
| 015 | Agent taxonomy | REFACTOR | Introduce a smaller reusable runtime core for execution loops | large |
| 016 | Deep-loop infrastructure | SIMPLIFY | Make dashboard/registry/strategy optional generated views for lightweight loops | medium |
| 017 | Global specialist roster | KEEP | Preserve research/doc/handover specialists outside the retry kernel | large if misapplied |
| 018 | Validation philosophy | REFACTOR | Make objective code checks the primary retry gate and reserve packet validation for completion | large |
| 019 | Durable spec lifecycle | KEEP | Do not replace long-lived spec docs with README-style minimalism | large if misapplied |
| 020 | Iterative workflow architecture | REFACTOR | Extract a shared loop kernel across retry, deep-research, and deep-review | architectural |
| 021 | Lifecycle commands | MERGE | Collapse `plan` / `implement` / `complete` behind one primary operator surface | large |
| 022 | Memory UX | MERGE | Fold routine memory actions into the main spec-kit journey | large |
| 023 | Command stack | SIMPLIFY | Centralize shared setup logic instead of repeating markdown + YAML ceremony | medium |
| 024 | Templates / validation | SIMPLIFY | Keep strict docs, but expose fewer visible documentation modes | medium |
| 025 | Context agents | MERGE | Treat bootstrap and deep retrieval as one public capability with modes | medium |
| 026 | Agent roster | MERGE | Group public roles into a smaller intent-based taxonomy | medium |
| 027 | Skills system | MERGE | Present one public `sk-code` family with routed submodes | large |
| 028 | Specialist improve skills | KEEP | Keep narrow improvement skills as opt-in islands rather than deleting them | low |
| 029 | Gates / hooks / constitution | REDESIGN | Hide more governance plumbing behind runtime automation | architectural |
| 030 | Default workflow | REDESIGN | Build one lower-friction default feature path and treat advanced surfaces as expert modes | architectural |

## 9. Rejected Recommendations

### Rejection R-001 — Do Not Adopt Default In-Place Undo Refactoring
- Origin iteration: `iteration-006.md`
- Rationale: the external undo-only refactorer assumes a more isolated workspace model than `system-spec-kit` can safely assume in shared, dirty trees. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:11-18] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:414-417]

### Rejection R-002 — Do Not Collapse The Entire Agent System Into Three Loop Roles
- Origin iteration: `iteration-017.md`
- Rationale: `system-spec-kit` still needs explicit research, documentation, debug, and continuity specialists outside a retry kernel. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-159] [SOURCE: .opencode/agent/orchestrate.md:95-107]

### Rejection R-003 — Do Not Replace Durable Spec Docs With README-Style Minimalism
- Origin iteration: `iteration-019.md`
- Rationale: the external repo's minimal docs are fit-for-purpose for a focused loop product, but not a substitute for long-lived planning and audit artifacts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99]

### Rejection R-004 — Do Not Delete Narrow Improvement Skills
- Origin iteration: `iteration-028.md`
- Rationale: `sk-prompt-improver` and `sk-agent-improver` are bounded opt-in specialist workflows; the problem is overexposure, not existence. [SOURCE: .opencode/skill/sk-prompt-improver/SKILL.md:19-47] [SOURCE: .opencode/skill/sk-agent-improver/SKILL.md:24-56]

## 10. Cross-Phase Implications
- Retry-mode and Phase 3 UX work are now coupled. A good retry controller added to the current surface would still inherit too much command, memory, and gate ceremony. [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/complete.md:32-150]
- Deep-research and deep-review are useful architectural proofs, but they also demonstrate the cost of proliferating bespoke loop stacks and public specialist surfaces. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]
- Phase `001-agent-lightning-main` remains a downstream consumer, not the focus here. Retry feedback may later feed optimization systems, but Phase 004's job is still controller shape, context boundaries, and operator UX. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:57-67] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:101-119]

## 11. Priority Queue
1. **F-026 — Default feature workflow redesign:** define one opinionated, lower-friction feature path and classify advanced surfaces as expert modes. [SOURCE: .opencode/README.md:52-60] [SOURCE: .opencode/command/spec_kit/complete.md:198-229]
2. **F-018 — Merge lifecycle commands:** stop teaching three primary lifecycle entry points. [SOURCE: .opencode/command/spec_kit/plan.md:149-181] [SOURCE: .opencode/command/spec_kit/implement.md:151-205]
3. **F-019 — Inline routine memory into the journey:** make save/resume/basic recall feel native to spec-kit instead of parallel. [SOURCE: .opencode/command/memory/search.md:53-92] [SOURCE: .opencode/command/spec_kit/implement.md:195-205]
4. **F-025 — Gate/hook/operator-surface redesign:** preserve governance while hiding more plumbing. [SOURCE: CLAUDE.md:107-141] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-170]
5. **F-013 — Two-lane state model:** keep loop-critical state packet-local and durable memory curated. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93]
6. **F-017 — Shared loop kernel:** once the visible workflow is clarified, extract reusable loop primitives across retry, research, and review. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]
7. **F-024 — Public `sk-code` consolidation:** simplify routing and teaching around code-quality skills. [SOURCE: .opencode/skill/README.md:121-129] [SOURCE: .opencode/skill/sk-code-review/SKILL.md:49-56]

## 12. Recommended Next Step
Plan one follow-on architecture phase that treats retry architecture and operator UX as one combined design problem, not two disconnected efforts. The brief should answer these questions in order:
1. What is the single canonical feature-workflow surface?
2. How does that surface decide whether the user is planning, implementing, resuming, retrying, or completing?
3. Which memory behaviors are automatic, inline, or advanced-only?
4. Which governance behaviors stay visible, and which move behind hooks/runtime defaults?
5. What shared loop kernel powers retry, deep-research, and deep-review once the operator surface is simplified?

That sequence reflects the strongest final lesson from Get It Right: make the core workflow easy to enter, keep state boundaries crisp, and let the internal machinery serve the operator instead of educating the operator about the machinery. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:19-49] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170] [SOURCE: .opencode/README.md:52-60]
