# Iteration 011 — Rebase Documentation Needs a Runtime Surface Inventory

Date: 2026-04-10

## Research question
What does the gap between Xethryon's rebase checklist documentation and its actual runtime surface teach `system-spec-kit` about researching and documenting forked agentic systems?

## Hypothesis
The highest-value lesson is not another feature to adopt, but a documentation discipline: fork analysis needs an explicit runtime-surface inventory, because human-written "mods from upstream" checklists drift faster than the fork's real behavior.

## Method
I compared Xethryon's fork-maintenance documents against the README claims and the live runtime modules that actually implement memory, autonomy, and swarm behavior. I then compared that with Spec Kit's research-packet structure.

## Evidence
- `XETHRYON_MODS.md` documents theme, branding, built-in agents, baked-in commands, build fixes, UI styling, and distribution, but it does not enumerate the full memory, reflection, autonomy, or swarm runtime surfaces that dominate the fork's behavior. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:10-180]
- The README advertises persistent project memory, self-reflection, git-aware context, autonomy mode, autonomous skill invocation, swarm orchestration, and a much larger command surface than the rebase checklist covers. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:11-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:27-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:163-181] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:185-224]
- The runtime implementation of those behaviors lives across background memory hooks, autonomy prompt injection, and swarm spawn/task-board modules rather than in the fork checklist itself. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:120-171] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/spawn.ts:80-130]
- Spec Kit's own research workflow already assumes reducer-owned artifacts and explicit packet outputs, which makes it a natural place to require a generated surface inventory instead of trusting a prose-only summary. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-343] [SOURCE: .opencode/skill/system-spec-kit/README.md:52-56] [SOURCE: .opencode/skill/system-spec-kit/README.md:227-246]

## Analysis
Xethryon's docs are not simply incomplete; they fail in a predictable way. The human-maintained checklist is strongest on visible, rebasing-oriented changes and weakest on distributed runtime behavior. That makes it a poor source of truth for a system whose real differentiation lives in prompt assembly, background post-turn hooks, and orchestration helpers. Phase 1 already showed claim drift; this iteration shows why drift happened. The process did not force anyone to maintain a complete runtime-surface inventory.

## Conclusion
confidence: high

finding: deep-research packets that study forks or external agentic systems should generate a runtime-surface inventory, not just prose findings. That inventory should explicitly record what the external system claims, where the behavior actually lives, and which surfaces are absent from the upstream-diff narrative.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a small schema for `claimed_surface`, `runtime_surface`, and `evidence_source`
- **Priority:** should-have

## Counter-evidence sought
I looked for a single Xethryon document that accurately enumerated both user-facing claims and the runtime modules implementing them. I did not find one; the knowledge was fragmented across README prose and multiple source files.

## Follow-up questions for next iteration
- Should Spec Kit stop at claim-status tracking, or also require each major claim to map to a concrete verification artifact such as tests, CI, or an explicit "no coverage found" note?
