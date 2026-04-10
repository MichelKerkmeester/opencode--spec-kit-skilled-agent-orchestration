---
title: "Deep Research Report — 003-claude-code-mastery-project-starter-kit-main"
description: "20-iteration research of the Claude Code Mastery Project Starter Kit for system-spec-kit improvement opportunities. 16 actionable findings, 4 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 003-claude-code-mastery-project-starter-kit-main

## 1. Executive Summary
- External repo: `claude-code-mastery-project-starter-kit-main`; a Claude-first starter kit centered on commands, hooks, working docs, and scaffold profiles rather than a deeply implemented runtime substrate. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/package.json:7-40]
- Iterations executed: 20 of 20
- Stop reason: max_iterations
- Phase 2 changed the story materially: the most valuable signals were no longer just adoptable features, but architectural warnings about where `system-spec-kit` appears overbuilt.
- Total actionable findings: 16
- Must-have: 3 | Should-have: 10 | Nice-to-have: 3 | Rejected: 4
- Top 5 adoption opportunities for system-spec-kit:
  - Split low-friction session continuity from promoted indexed memory so routine save flow stops paying the full durable-memory tax. Origin: iteration 013.
  - Simplify validation around a smaller executable invariant core, with human-readable readiness views generated from those checks. Origin: iteration 016.
  - Add Claude-only secret guardrails to `.claude/settings.local.json` and companion hooks. Origin: iteration 006.
  - Move more deterministic Gate/CLAUDE policy into executable hook/config enforcement rather than prose alone. Origin: iteration 014.
  - Pivot command packaging toward a manifest-driven architecture that can generate help, routing, and runtime-specific exposure. Origin: iteration 017. Overlap: phase `005`.

## 2. Phase 2 Inflection
- Phase 1 was mostly about adoptable improvements from the external repo.
- Phase 2 found a stronger pattern: the external starter kit is most useful as a contrast that reveals where `system-spec-kit` has accumulated too much machinery for session capture, gate enforcement, validation, and loop state.
- The external repo repeatedly wins on operator ergonomics because it keeps key surfaces flatter:
  - universal vs project vs personal instruction layering
  - one compact working brief before heavier process
  - simple progress/readiness reporting
  - metadata/profile-driven command presentation
- The external repo does **not** justify copying its runtime/application architecture or replacing `system-spec-kit`'s governance model with starter-kit profiles.

## 3. External Repo Reality Check
- Core surfaces:
  - `CLAUDE.md`, `CLAUDE.local.md`, and `global-claude-md/` establish a clearer universal/project/personal split than the local repo currently exposes. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md:16-40] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.local.md:1-71]
  - `.claude/commands/` is metadata-driven enough for dynamic help and selective distribution. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:19-31]
  - `.claude/settings.json` and `global-claude-md/settings.json` push deterministic policy into hooks and deny lists. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-49] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/settings.json:1-38]
  - `.mdd/`, `progress`, `tests/CHECKLIST.md`, and `tests/ISSUES_FOUND.md` create highly readable working-state and readiness surfaces. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-30] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]
  - `claude-mastery-project.conf` and `/new-project` treat profiles as a first-class packaging/scaffolding control surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/claude-mastery-project.conf:47-116] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/new-project.md:63-103]

Architecture caution:
- The external repo is not a good runtime-substrate template for `system-spec-kit`.
- `package.json` expects a full app surface, but the captured `src/` tree only contains placeholder `.gitkeep` files. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/package.json:8-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/src/adapters/.gitkeep:1-1]
- Treat this repo as an operator-UX and workflow reference, not as proof that `system-spec-kit` should collapse its MCP/memory/runtime architecture into a starter-kit shell.

## 4. Findings Registry — Phase 1

### Finding F-001 — Add A Claude-Only Quick Reference Layer
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.claude/CLAUDE.md`
- Priority: should-have
- Description: The external starter kit keeps Claude-facing instructions highly compressed inside one file, while the local repo keeps governance in a stronger root `CLAUDE.md` and uses `.claude/CLAUDE.md` only as a supplement. The local architecture should stay intact, but `.claude/CLAUDE.md` should become a sharper Claude-only operator surface that mirrors the most actionable recovery, tool-routing, and command-entry guidance from the root file. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-31] [SOURCE: CLAUDE.md:34-56] [SOURCE: CLAUDE.md:72-81] [SOURCE: .claude/CLAUDE.md:5-14]

### Finding F-002 — Add A Guided Doc-First Front Door Without Replacing Spec Kit
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/README.txt`
- Priority: should-have
- Description: The external `/mdd` command is a memorable, guided entry point that asks consolidated questions, writes a working doc, generates tests, and presents a named-step plan before coding. Local Spec Kit is more robust but more fragmented from a new operator's perspective. A new front-door workflow or documented entry mode could route users into the existing research/plan/implement lifecycle with less cognitive overhead. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:44-71] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:71-131] [SOURCE: .opencode/command/spec_kit/README.txt:43-46] [SOURCE: .opencode/command/spec_kit/README.txt:121-159]

### Finding F-003 — Add A Lightweight Compressed-Brief Pattern, Not A Token Slogan
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: nice-to-have
- Description: The external "20K -> 200" message is partly marketing, but the actual workflow primitives are real: concise structured briefs, periodic note-to-disk, and resumable recovery. `system-spec-kit` already has stronger state and compaction infrastructure, so the right adoption is a lightweight compressed-brief convention, not copied token claims. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:116-149] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:187-189] [SOURCE: .opencode/command/spec_kit/deep-research.md:196-205] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-225]

### Finding F-004 — Introduce A Lightweight Working-Brief Template
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/`
- Priority: should-have
- Description: The local repo already outclasses `.mdd/` on continuity because it combines research packets, handover, and autosave. What it lacks is a lighter artifact shape that is easy to scan mid-session. A small working-brief template would improve ergonomics without weakening packet durability. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-13] [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/handover.md:42-58] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-83]

### Finding F-005 — Keep Recovery Hooks, Add A Thin Enforcement Layer
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.claude/settings.local.json`
- Priority: should-have
- Description: The external hook system and the local hook system solve different problems. The external starter kit excels at deterministic enforcement during tool use; the local system excels at recovery, continuity, and token-aware context injection. The best local move is a hybrid configuration: retain the existing recovery hooks and add only a minimal set of Claude-only enforcement hooks on top. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:2-64] [SOURCE: .claude/settings.local.json:7-42] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-173]

### Finding F-006 — Adopt Secret Guardrails First
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.claude/settings.local.json`
- Priority: must-have
- Description: The single best adopt-now finding is the external secret guardrail pair: block access to sensitive files before tool use, and scan staged files plus contents for secrets at stop time. Those two hooks are narrow, low-risk, and directly strengthen a repo that already carries powerful automation and memory tooling. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/block-secrets.py:13-29] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/block-secrets.py:49-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/verify-no-secrets.sh:42-77] [SOURCE: .claude/settings.local.json:7-42]

### Finding F-007 — Add Command Audience And Distribution Metadata
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/command/README.txt`
- Priority: should-have
- Description: The external repo's most transferable command-system lesson is metadata-driven distribution. Its help and update flows trust command frontmatter more than static prose. Local commands are well grouped but still documented statically. Adding metadata for audience, distribution, or runtime scope would make help surfaces more adaptive and less drift-prone. Overlap: this belongs partly to phase `005` because it touches broader command-system packaging. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/update-project.md:90-98] [SOURCE: .opencode/command/README.txt:38-49] [SOURCE: .opencode/command/spec_kit/README.txt:54-63]

### Finding F-008 — Expose Operator-Facing Observability
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/command/memory/manage.md`
- Priority: nice-to-have
- Description: The external repo turns AI monitoring into a user-visible workflow. The local repo already has pressure monitoring and other internal telemetry, but it does not present them as an operator-facing command surface. A read-only session-observability or telemetry-summary command would fill that gap without requiring RuleCatch itself. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/what-is-my-ai-doing.md:8-41] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:297-305] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:420-424] [SOURCE: .opencode/command/README.txt:40-49]

## 5. Findings Registry — Phase 2

### Finding F-009 — Add An Explicit Personal-Preference Layer
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `CLAUDE.md`, `.claude/CLAUDE.md`
- Priority: should-have
- Description: The external repo cleanly separates universal policy, project rules, and personal preferences with `global-claude-md/CLAUDE.md`, checked-in `CLAUDE.md`, and gitignored `CLAUDE.local.md`. `system-spec-kit` should keep its authoritative root rulebook, but it should simplify UX by adding an explicit personal-override layer instead of forcing those concerns into the same conceptual space as repo governance. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md:16-40] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.local.md:1-71] [SOURCE: CLAUDE.md:107-175]

### Finding F-010 — Add A First-Class Working-Brief Stage
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/`, `.opencode/command/spec_kit/README.txt`
- Priority: should-have
- Description: The external repo's MDD flow wins the earliest UX moment by starting with one compact working brief. `system-spec-kit` should keep its Level 1/2/3(+phase) governance model, but it should simplify entry by adding a sanctioned working-brief stage that can later be promoted into a full packet. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:42-131] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-30] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:77-127]

### Finding F-011 — Split Session Digests From Promoted Memories
- Origin iteration: `iteration-013.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, memory-quality and retrieval surfaces
- Priority: must-have
- Description: The local memory system currently asks one save path to satisfy both lightweight session continuity and high-integrity indexed memory. The external repo shows that cheap notes-to-disk already solve much of continuation pain. `system-spec-kit` should refactor into two lanes: lightweight session digests and promoted indexed memories. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-124] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:23-176]

### Finding F-012 — Move Deterministic Policy Out Of Prose Gates
- Origin iteration: `iteration-014.md`
- system-spec-kit target: `CLAUDE.md`, `.claude/settings.local.json`, hook packages under `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/`
- Priority: should-have
- Description: The external repo's hook/config surfaces perform more of the routine safety work directly. `system-spec-kit` should keep a constitutional rulebook, but more deterministic Gate and pre-flight behavior should move into executable policy layers where runtime support exists. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/settings.json:1-38] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-49] [SOURCE: CLAUDE.md:107-175]

### Finding F-013 — Reduce Deep-Research Primary State Surfaces
- Origin iteration: `iteration-015.md`
- system-spec-kit target: `.opencode/agent/deep-research.md`, `.opencode/skill/sk-deep-research/SKILL.md`
- Priority: should-have
- Description: The loop abstraction itself still looks right, but the number of synchronized primary artifacts looks broader than necessary. `system-spec-kit` should keep deep-research/deep-review loops while reducing the number of reducer-owned surfaces that must remain primary at all times. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60] [SOURCE: .opencode/agent/deep-research.md:159-213] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:215-244]

### Finding F-014 — Simplify Validation Around Executable Invariants
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, validation docs, derived checklist/reporting surfaces
- Priority: must-have
- Description: The external repo keeps its enforcement model concrete and executable, then layers human-readable status views on top. `system-spec-kit` likely needs richer guarantees, but its validation system should still collapse toward a smaller invariant core with generated readiness/checklist views rather than a sprawling operator-facing rule taxonomy. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/STARTER-KIT-VERIFICATION.md:21-57] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/unit/hooks.test.ts:1-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100]

### Finding F-015 — Pivot To A Manifest-Driven Command Architecture
- Origin iteration: `iteration-017.md`
- system-spec-kit target: `.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`, wrapper metadata
- Priority: should-have
- Description: Phase 1 identified a metadata gap. Phase 2 suggests the deeper move is architectural: command visibility, help, routing, and packaging should be derived from a machine-readable manifest rather than hand-maintained README taxonomy. Overlap: this belongs partly to phase `005`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:19-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/claude-mastery-project.conf:47-116] [SOURCE: .opencode/command/README.txt:106-168]

### Finding F-016 — Add Human-Readable Readiness Projections
- Origin iteration: `iteration-019.md`
- system-spec-kit target: command/reporting surfaces for validation and research workflows
- Priority: nice-to-have
- Description: The external repo is often easier to scan because it exposes progress, checklist, and issue surfaces in plain language. `system-spec-kit` already has richer underlying state; it should derive friendlier readiness/progress projections from that state rather than forcing users to stitch together specialized tool outputs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/CHECKLIST.md:1-55] [SOURCE: .opencode/agent/deep-research.md:159-213]

## 6. Rejected Recommendations

### Rejection R-001 — Do Not Copy Branch, Port, And E2E Hooks Wholesale
- Origin iteration: `iteration-007.md`
- Rationale: These hooks assume starter-kit-generated app repos with fixed branch expectations, `tests/e2e` conventions, and known port maps. They do not transfer cleanly to `system-spec-kit`, which already has its own git/spec governance and is not a generated application template. Only the port-conflict concept may deserve a future repo-specific variant. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-branch.sh:56-76] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-e2e.sh:46-69] [SOURCE: CLAUDE.md:129-175]

### Rejection R-002 — Do Not Import The External Mini-Agent Architecture
- Origin iteration: `iteration-010.md`
- Rationale: The local repo already has a richer agent system plus formal skill routing. Importing the external two-agent model would reduce capability rather than improve it. The worthwhile borrow is stylistic: concise role contracts and plain-language MCP install guidance. Overlap: the agent-contract portion belongs partly to phase `008`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/code-reviewer.md:1-6] [SOURCE: .opencode/agent/deep-research.md:22-32] [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16]

### Rejection R-003 — Do Not Rebuild Around The External App Runtime Shape
- Origin iteration: `iteration-018.md`
- Rationale: The external repo is a strong operator shell, but the captured packet does not include the runtime depth implied by its package scripts. It is not strong evidence for rebuilding `system-spec-kit`'s MCP/runtime architecture around starter-kit application assumptions. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/package.json:8-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/src/handlers/.gitkeep:1-1]

### Rejection R-004 — Do Not Replace Governance Levels With Starter-Kit Profiles
- Origin iteration: `iteration-020.md`
- Rationale: External profiles solve scaffolding ergonomics for generated projects. Local levels and phases solve governance depth and coordination. Replacing the latter with the former would distort the core decision model of `system-spec-kit`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/claude-mastery-project.conf:53-116] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:82-141]

## 7. Refactor / Pivot Recommendations
- **REFACTOR:** Split memory into session digests versus promoted memories, preserving the current rich pipeline only for promoted/indexed artifacts. Origin: F-011.
- **REFACTOR:** Keep a constitutional rulebook, but move deterministic safety and pre-flight behaviors from prose gates into executable hooks/config where runtimes support it. Origin: F-012.
- **PIVOT:** Treat a machine-readable command manifest as the source of truth for command taxonomy, runtime visibility, and generated help/docs. Origin: F-015.
- **SIMPLIFY:** Add a first-class personal-preference layer so repo governance stops carrying both universal rules and individual working-style concerns. Origin: F-009.
- **SIMPLIFY:** Introduce a working-brief stage before full packet depth so session startup is lighter without weakening later governance. Origin: F-010.
- **SIMPLIFY:** Reduce deep-research primary state to fewer always-synchronized artifacts, with dashboards/registries generated where possible. Origin: F-013.
- **SIMPLIFY:** Collapse validation into a smaller executable invariant core and generate human-readable readiness views from those checks. Origin: F-014.
- **KEEP:** Do not copy starter-kit runtime/application architecture, starter-kit profiles, or other scaffold-specific assumptions into `system-spec-kit`'s core model. Origin: R-003, R-004.

## 8. Combined Priority Queue
1. F-011 — Split session digests from promoted memories.
2. F-014 — Simplify validation around executable invariants and generated readiness views.
3. F-006 — Adopt Claude-only secret guardrails first.
4. F-012 — Move deterministic gate policy into executable hooks/config where possible.
5. F-015 — Pivot to a manifest-driven command architecture.
6. F-013 — Reduce deep-research primary state surfaces.
7. F-010 — Add a first-class working-brief stage before full packet depth.
8. F-007 — Add command audience/distribution metadata as the first step toward the manifest pivot.
9. F-005 — Add a thin enforcement layer on top of the current recovery-first hook stack.
10. F-009 — Add an explicit personal-preference layer.
11. F-002 — Add a guided doc-first front door into existing Spec Kit workflows.
12. F-004 — Introduce a lightweight working-brief template for mid-session scanability.
13. F-016 — Add human-readable readiness projections on top of existing validation and research state.
14. F-008 — Expose operator-facing observability as a command/reporting surface.
15. F-003 — Add a compressed-brief pattern without importing token-marketing claims.
16. F-001 — Sharpen `.claude/CLAUDE.md` as a Claude-only quick-reference layer.

## 9. Cross-Phase Implications
- Phase `005` overlap:
  - Finding F-007 is partly a command-system packaging problem because it concerns command metadata, dynamic help, and distribution semantics across command families.
  - Finding F-015 expands that overlap into a larger architecture question: command manifests, runtime visibility, and generated help/docs likely belong in the same follow-on workstream.
  - Any follow-on to expose operator-facing observability or readiness through commands may also intersect broader command taxonomy decisions.
- Memory/validation/gate overlap:
  - Findings F-011, F-012, and F-014 are not isolated polish items. Together they suggest a deeper simplification initiative across session capture, gate enforcement, and validation responsibilities.
  - These three findings should probably be planned as one architecture pass rather than three unrelated tweaks.
- Phase `008` overlap:
  - Rejection R-002 still leaves a useful follow-on for phase `008`: tighten agent contracts so local agent docs communicate tool budget, role, and output expectations as tersely as the external mini-agents.
  - MCP install guidance packaging also overlaps phase `008` if it becomes part of skill or agent-adjacent workflow docs rather than command docs.

## 10. Recommended Next Steps
1. Plan a joint architecture follow-on for memory, gate, and validation simplification anchored around F-011, F-012, and F-014.
2. Keep F-006 as the tactical adopt-now change because it is still the clearest low-risk safety upgrade.
3. Use phase `005` to turn Phase 1 metadata work into the larger Phase 2 manifest-driven command-architecture proposal.
4. Prototype the working-brief stage and readiness projections as generated/operator-facing layers, not as yet more mandatory primary artifacts.
