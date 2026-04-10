---
title: "Deep Research Report - 003-claude-code-mastery-project-starter-kit-main"
description: "30-iteration research of the Claude Code Mastery Project Starter Kit for system-spec-kit improvement opportunities. 25 actionable findings, 5 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report - 003-claude-code-mastery-project-starter-kit-main

## 1. Executive Summary
- External repo: `claude-code-mastery-project-starter-kit-main`; a Claude-first starter kit centered on guided commands, hooks, working docs, and lightweight operator ergonomics rather than a deep runtime substrate. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:39-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Total actionable findings: 25
- Must-have: 5 | Should-have: 16 | Nice-to-have: 4 | Rejected: 5
- Phase 1 surfaced adoptable workflow ideas. Phase 2 exposed places where `system-spec-kit` appears overbuilt. Phase 3 confirmed that the biggest remaining opportunity is operator-surface simplification across commands, continuity, skills, and gate ceremony.
- Top 5 adoption opportunities for `system-spec-kit`:
  - F-023 - redesign the operator surface by moving deterministic gate behavior into runtime enforcement and shrinking the prose ceremony. Origin: iteration 028.
  - F-022 - keep skill routing, but hide the mandatory Gate 2 ceremony from most user-visible workflows. Origin: iteration 027.
  - F-017 - merge the visible lifecycle commands behind one guided front door. Origin: iteration 021.
  - F-018 - pull routine continuity actions back into the Spec Kit workflow surface instead of exposing memory as a parallel product. Origin: iteration 022.
  - F-014 - simplify validation around a smaller executable invariant core with generated readiness views. Origin: iteration 016.

## 2. Cross-Phase Synthesis
- The external repo is most valuable as an operator-UX reference, not as a runtime or application-architecture template.
- The local repo usually wins on durability, continuity, and deep autonomous workflows.
- The external repo usually wins on first-run clarity, fewer memorable entry points, and lower day-to-day cognitive load.
- The strongest combined recommendation is not "copy the starter kit." It is:
  - keep the strong local substrate
  - delete visible ceremony where automation can safely enforce policy
  - merge fragmented operator surfaces
  - add guided entry and better live orientation

## 3. External Repo Reality Check
- The external repo packages work around a few memorable commands, especially `/help`, `/mdd`, and `/progress`, backed by working docs and hooks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-131] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]
- It relies on lighter instruction layering and more executable settings than the local repo currently exposes at the operator surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-72] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/settings.json:1-39]
- It is not strong evidence for rebuilding `system-spec-kit` around starter-kit runtime assumptions. The captured packet remains scaffold-oriented and relatively shallow on the implementation side. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:92-104]

## 4. Findings Registry - Phases 1 and 2

### F-001 - Add a Claude-only quick reference layer
- Origin: `iteration-001.md`
- Priority: should-have
- Target: `.claude/CLAUDE.md`
- Summary: sharpen the Claude-only quick-reference surface without replacing the stronger root governance brief.

### F-002 - Add a guided doc-first front door without replacing Spec Kit
- Origin: `iteration-002.md`
- Priority: should-have
- Target: `.opencode/command/spec_kit/README.txt`
- Summary: introduce a memorable guided entry experience inspired by `/mdd`, but route into existing Spec Kit depth.

### F-003 - Add a lightweight compressed-brief pattern
- Origin: `iteration-003.md`
- Priority: nice-to-have
- Target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Summary: adopt the external repo's concise brief habit, not its marketing claims.

### F-004 - Introduce a lightweight working-brief template
- Origin: `iteration-004.md`
- Priority: should-have
- Target: `.opencode/skill/system-spec-kit/templates/`
- Summary: add a scan-friendly mid-session artifact that complements, not replaces, durable packets.

### F-005 - Keep recovery hooks and add a thin enforcement layer
- Origin: `iteration-005.md`
- Priority: should-have
- Target: `.claude/settings.local.json`
- Summary: retain recovery-first hooks but add narrow deterministic enforcement where Claude supports it.

### F-006 - Adopt secret guardrails first
- Origin: `iteration-006.md`
- Priority: must-have
- Target: `.claude/settings.local.json`
- Summary: copy the external secret-blocking and secret-verification pattern as the clearest tactical safety win.

### F-007 - Add command audience and distribution metadata
- Origin: `iteration-008.md`
- Priority: should-have
- Target: `.opencode/command/README.txt`
- Summary: start deriving command visibility and help from metadata instead of static taxonomy alone.

### F-008 - Expose operator-facing observability
- Origin: `iteration-009.md`
- Priority: nice-to-have
- Target: `.opencode/command/memory/manage.md`
- Summary: present AI activity and telemetry in a user-facing way rather than only as internal machinery.

### F-009 - Add a first-class personal-preference layer
- Origin: `iteration-011.md`
- Priority: should-have
- Target: `CLAUDE.md`, `.claude/CLAUDE.md`
- Summary: separate universal repo policy from personal working-style overrides more clearly.

### F-010 - Add a sanctioned working-brief stage before full packet depth
- Origin: `iteration-012.md`
- Priority: should-have
- Target: `.opencode/skill/system-spec-kit/templates/`
- Summary: allow a lighter starting artifact that can later promote into a full packet.

### F-011 - Split session digests from promoted memories
- Origin: `iteration-013.md`
- Priority: must-have
- Target: memory save and retrieval surfaces
- Summary: separate low-friction continuity capture from higher-integrity indexed memory promotion.

### F-012 - Move deterministic policy out of prose gates
- Origin: `iteration-014.md`
- Priority: should-have
- Target: `CLAUDE.md`, `.claude/settings.local.json`, hook packages
- Summary: move routine pre-flight behavior from instructions into executable policy.

### F-013 - Reduce deep-research primary state surfaces
- Origin: `iteration-015.md`
- Priority: should-have
- Target: deep-research agent and skill surfaces
- Summary: keep the loop model but narrow the number of always-synchronized primary artifacts.

### F-014 - Simplify validation around executable invariants
- Origin: `iteration-016.md`
- Priority: must-have
- Target: `validate.sh`, readiness outputs
- Summary: keep strong guarantees, but make the executable invariant core smaller and the human status layers derived.

### F-015 - Pivot to a manifest-driven command architecture
- Origin: `iteration-017.md`
- Priority: should-have
- Target: command inventory and help surfaces
- Summary: use a machine-readable manifest as the source of truth for command exposure, help, and routing.

### F-016 - Add human-readable readiness projections
- Origin: `iteration-019.md`
- Priority: nice-to-have
- Target: reporting and validation surfaces
- Summary: generate friendlier progress and readiness views from the stronger local state.

## 5. Phase 3 - UX, Agentic System & Skills Analysis
- Command UX:
  - The local repo has more power, but its lifecycle is fragmented across several visible commands plus workflow assets.
  - The external repo keeps more of the interview and routing logic behind a smaller memorable front door.
- Template and spec-folder UX:
  - The local Level 1/2/3 model remains strategically useful.
  - The external repo demonstrates that governance depth should be introduced gradually, not made into the user's first classification task.
- Sub-agent architecture:
  - The local continuity surface is more fragmented than it needs to be.
  - The deep-research and deep-review LEAF loops still look justified and should stay.
- Skills system:
  - The local skill substrate is strong but too visibly decomposed.
  - Public capability packaging should be simpler, with more routing hidden from operators.
- Automation and integration UX:
  - The local gate system carries too much behavior in prose.
  - The external repo shows a better split: short written guidance, more executable policy.
- End-to-end workflow friction:
  - A common feature flow in `system-spec-kit` currently asks the user to reason about gates, packet depth, command choice, memory boundaries, and completion semantics before momentum builds.
  - The external repo gets to momentum faster through guided starts and dynamic progress help.
- Phase 3 verdict distribution:
  - SIMPLIFY: 2
  - ADD: 2
  - MERGE: 4
  - KEEP: 1
  - REDESIGN: 1
- Phase 3 conclusion:
  - The local system should not become smaller by discarding its strong substrate.
  - It should become easier by hiding internal machinery, merging adjacent operator surfaces, and adding a guided front door plus better live orientation.

## 6. Findings Registry - Phase 3

### F-017 - Merge the visible lifecycle command front door
- Origin: `iteration-021.md`
- Priority: should-have
- Target: `.opencode/command/spec_kit/README.txt`, lifecycle routing
- Summary: keep plan, implement, complete, and resume internally, but stop making them equally visible primary entry points. [SOURCE: .opencode/command/spec_kit/README.txt:54-76] [SOURCE: .opencode/command/spec_kit/README.txt:121-178] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-131]

### F-018 - Pull routine memory UX back into Spec Kit
- Origin: `iteration-022.md`
- Priority: should-have
- Target: `.opencode/command/memory/README.txt`, `.opencode/command/spec_kit/README.txt`
- Summary: keep `/memory:*` for power users and admin work, but expose save, resume, and continuity-oriented search through the main workflow surface. [SOURCE: .opencode/command/memory/README.txt:36-52] [SOURCE: .opencode/command/memory/search.md:7-49] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:113-210]

### F-019 - Hide governance levels behind guided defaults
- Origin: `iteration-023.md`
- Priority: should-have
- Target: template selection and packet bootstrap
- Summary: preserve packet governance depth, but stop making Level 1 versus 2 versus 3 an up-front user burden. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-33] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-47] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-30]

### F-020 - Merge continuity surfaces around one operator concept
- Origin: `iteration-024.md`
- Priority: should-have
- Target: continuity agents, resume docs, handover surfaces
- Summary: collapse the visible distinction between `context`, `context-prime`, and `handover` into one continuity surface while keeping specialized internals if needed. [SOURCE: .opencode/agent/context.md:45-53] [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/handover.md:22-32]

### F-021 - Consolidate the visible skill taxonomy
- Origin: `iteration-026.md`
- Priority: should-have
- Target: skill discovery and public routing surfaces
- Summary: keep internal modularity, but present fewer public capability buckets, especially across the overlapping `sk-code-*` family. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:18-60] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-29] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-32]

### F-022 - Remove mandatory explicit skill-routing ceremony
- Origin: `iteration-027.md`
- Priority: must-have
- Target: Gate 2 policy and `skill_advisor.py` usage
- Summary: keep routing as infrastructure, but make it implicit by default so users are not forced through an extra visible step on most substantial tasks. [SOURCE: CLAUDE.md:47-70] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-47] [SOURCE: .opencode/skill/scripts/skill_advisor.py:83-209]

### F-023 - Redesign the operator surface around runtime enforcement
- Origin: `iteration-028.md`
- Priority: must-have
- Target: `CLAUDE.md`, constitutional rule surfaces, hook/config policy
- Summary: shrink the written ceremony to principles and exceptions, and move deterministic rules into executable runtime enforcement. [SOURCE: CLAUDE.md:107-165] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-102] [SOURCE: .claude/settings.local.json:1-52] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-64]

### F-024 - Add one guided work command
- Origin: `iteration-029.md`
- Priority: should-have
- Target: `.opencode/command/spec_kit/`
- Summary: add `/spec_kit:start` or `/spec_kit:work` as a guided entry point that creates or resumes the right packet state and dispatches internally. [SOURCE: .opencode/command/spec_kit/plan.md:31-120] [SOURCE: .opencode/command/spec_kit/implement.md:29-120] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-131]

### F-025 - Add dynamic help, progress, and session-status surfaces
- Origin: `iteration-030.md`
- Priority: nice-to-have
- Target: command metadata and reporting surfaces
- Summary: make orientation live and state-aware so operators do not need to stitch together several static docs. [SOURCE: .opencode/command/README.txt:36-60] [SOURCE: .opencode/command/memory/manage.md:33-61] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]

## 7. Rejected Recommendations

### R-001 - Do not copy branch, port, and E2E hooks wholesale
- Origin: `iteration-007.md`
- Rationale: those hooks assume starter-kit app conventions that do not map cleanly to `system-spec-kit`.

### R-002 - Do not import the external mini-agent architecture
- Origin: `iteration-010.md`
- Rationale: the local repo needs richer specialization; only the concise role-contract style is worth borrowing.

### R-003 - Do not rebuild around the external app runtime shape
- Origin: `iteration-018.md`
- Rationale: the external repo is an operator shell, not sufficient evidence for a runtime rewrite.

### R-004 - Do not replace governance levels with starter-kit profiles
- Origin: `iteration-020.md`
- Rationale: profiles solve scaffolding ergonomics, not governance depth.

### R-005 - Do not collapse LEAF deep-research and deep-review loops
- Origin: `iteration-025.md`
- Rationale: the external repo does not provide equivalent convergence-oriented iteration architecture.

## 8. Combined Priority Queue
1. F-023 - redesign the operator surface around runtime enforcement.
2. F-022 - remove mandatory explicit skill-routing ceremony.
3. F-011 - split session digests from promoted memories.
4. F-014 - simplify validation around executable invariants.
5. F-006 - adopt secret guardrails first.
6. F-017 - merge the visible lifecycle command front door.
7. F-018 - pull routine memory UX back into Spec Kit.
8. F-020 - merge continuity surfaces around one operator concept.
9. F-015 - pivot to a manifest-driven command architecture.
10. F-024 - add one guided work command.
11. F-021 - consolidate the visible skill taxonomy.
12. F-019 - hide governance levels behind guided defaults.

## 9. Cross-Phase Implications
- Phase `005` overlap:
  - F-007, F-015, F-024, and F-025 all touch command discovery, generated help, or manifest-driven routing.
- Phase `008` overlap:
  - F-020, F-021, F-022, and R-005 all touch agent contracts, skill packaging, routing visibility, or roster granularity.
- Memory, gate, and validation overlap:
  - F-011, F-014, F-018, F-022, and F-023 form one larger simplification program around continuity, policy, and workflow startup.
- Template and UX overlap:
  - F-004, F-010, F-019, and F-024 all point toward a guided starter experience that promotes into stronger governance instead of demanding it immediately.

## 10. Recommended Next Steps
1. Plan a joint operator-surface redesign packet around F-017 through F-024, with F-023 as the anchor.
2. Keep F-006 as the clearest tactical adopt-now change while the larger UX redesign is scoped.
3. Use phase `005` to connect manifest-driven command architecture to the proposed help, progress, and guided-start surfaces.
4. Use phase `008` to rationalize continuity roles and skill packaging without touching the justified LEAF loop core.
