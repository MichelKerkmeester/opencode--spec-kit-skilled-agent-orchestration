# Iteration 022 — Simplify Memory Command Exposure And Hide YAML Internals

Date: 2026-04-10

## Research question
Is the current `/memory:*` command family and YAML-asset exposure too parallel to `/spec_kit:*`, compared with the external repo's flatter orchestration surface?

## Hypothesis
Yes. The local memory surfaces are powerful, but too many everyday context actions are exposed as a sibling command family instead of being absorbed into the main workflow. YAML assets are a reasonable internal abstraction, but they should not be part of the operator mental model.

## Method
I compared the local `memory` command family and YAML-oriented command setup text with the external repo's orchestration model, where persistence and handoff concerns are mostly embedded in the orchestrator contract rather than surfaced as peer commands.

## Evidence
- `[SOURCE: .opencode/command/spec_kit/plan.md:11-21]` The planning command explicitly teaches the operator that markdown owns setup and YAML owns execution.
- `[SOURCE: .opencode/command/spec_kit/complete.md:11-21]` The same markdown-versus-YAML ownership model is repeated in the full lifecycle command.
- `[SOURCE: .opencode/command/memory/save.md:7-25]` `/memory:save` has its own multi-tier folder-resolution ceremony before the actual save workflow starts.
- `[SOURCE: .opencode/command/memory/search.md:1-5]` `/memory:search` is not just retrieval; it also exposes preflight, postflight, causal, ablation, and dashboard analysis as one large public command surface.
- `[SOURCE: .opencode/command/memory/manage.md:33-62]` `/memory:manage` exposes a broad administration surface for scanning, cleanup, checkpointing, ingest, and shared-memory lifecycle.
- `[SOURCE: .opencode/command/memory/learn.md:43-55]` `/memory:learn` creates a fourth public memory command for constitutional rules.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator.md:123-136]` The external orchestrator folds handoff and memory-management patterns into its own operator contract instead of exposing a comparable parallel public command family.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator.md:36-43]` The external public surface stays centered on mode activation and task execution, not on parallel persistence subcommands.

## Analysis
The issue is not that the memory system is too capable. The issue is that ordinary operators are being shown too much of the capability map. Saving context, resuming context, and loading relevant context feel like part of the main work lifecycle, not like separate tools that live beside planning and implementation. The current split makes the product feel like two neighboring systems: "SpecKit" and "Memory," with the user expected to know when to cross the street.

The same pattern shows up in YAML asset exposure. The assets are useful implementation plumbing, but telling the operator that markdown owns setup and YAML owns execution is not delivering user value. That information belongs to maintainers, not to the primary command prose.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep the memory platform and YAML workflow assets, but simplify the public surface by absorbing common memory actions into the main lifecycle and hiding YAML asset mechanics from operator-facing command docs.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/*.md`, `.opencode/command/memory/save.md`, `.opencode/command/memory/search.md`
- **Change type:** should-have
- **Blast radius:** operator-surface
- **Prerequisites:** define which memory actions stay advanced and which become implicit lifecycle behavior
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** `/spec_kit:*` and `/memory:*` operate like parallel products, and command docs expose YAML workflow implementation details directly.
- **External repo's equivalent surface:** Persistence, handoff, and loop-state handling sit behind the orchestrator surface instead of being presented as a second everyday command family.
- **Friction comparison:** The local system is richer, but the operator has to know too much about internal boundaries. The external repo feels flatter because more of the lifecycle is folded into the orchestrator contract.
- **What system-spec-kit could DELETE to improve UX:** Delete operator-facing references to YAML asset ownership and demote common memory actions from separate everyday commands to embedded workflow behavior.
- **What system-spec-kit should ADD for better UX:** Add implicit context-load and context-save behavior summaries to the main lifecycle entry surface, with advanced memory commands reserved for analysis and administration.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for evidence that the external repo benefits from exposing persistence, handoff, and administration as separate peer command families for normal work. I did not find that pattern.

## Follow-up questions for next iteration
- Which `/memory:*` actions should remain directly operator-invoked because they are truly specialist workflows?
- Can `/memory:search` split analysis/admin functions away from everyday retrieval without reducing power?
- Should YAML asset references move into maintainer docs generated from command metadata?
