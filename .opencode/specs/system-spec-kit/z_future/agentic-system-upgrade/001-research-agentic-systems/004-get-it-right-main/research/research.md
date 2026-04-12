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