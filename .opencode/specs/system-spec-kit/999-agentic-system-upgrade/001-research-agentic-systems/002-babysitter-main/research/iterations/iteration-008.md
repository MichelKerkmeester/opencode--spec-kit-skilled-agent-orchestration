# Iteration 008 — Marketplace Model Rejection

Date: 2026-04-09

## Research question
Should `system-spec-kit` adopt Babysitter's full plugin marketplace and installer model inside the skill itself?

## Hypothesis
The answer will be no: Babysitter's marketplace is valuable for multi-product plugin distribution, but it is too wide a surface for `system-spec-kit`'s current repo-native workflow packaging.

## Method
I inspected Babysitter's plugin positioning and bundle metadata, then compared that with `system-spec-kit`'s current repo-native source-of-truth model and runtime directory rules.

## Evidence
- Babysitter explicitly positions plugins as installable instruction/process bundles managed through a plugin system and marketplace, not as simple code extensions. [SOURCE: external/README.md:168-178]
- The plugin bundle metadata is normalized around installable harness packages with named roots for hooks, commands, and skills. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10]
- `system-spec-kit` currently treats repo-local references, templates, and scripts as the operational sources of truth. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118]
- Runtime routing in this repo is based on checked-in runtime directories such as `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`, not on marketplace-installed bundles. [SOURCE: AGENTS.md:277-288]

## Analysis
Babysitter's marketplace solves a real problem: distributing one orchestration system across many harnesses and optional extensions. `system-spec-kit` does not have the same packaging problem today. Its workflows, templates, and commands already live in one repo and are versioned together. [SOURCE: external/README.md:168-178] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118]

Adopting the full marketplace model now would widen the operational surface before the more urgent deterministic issues are solved. The manifest boundary from iteration 007 is transferable; the installer/marketplace layer is not yet justified. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: AGENTS.md:277-288]

## Conclusion
confidence: medium

finding: `system-spec-kit` should reject a direct copy of Babysitter's plugin marketplace for now. The right move is to borrow normalized manifest metadata, not to introduce a new installer, registry, and lifecycle surface inside the skill.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/` distribution model and runtime-resolution concept
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for a present-day `system-spec-kit` need to distribute optional workflow bundles through a separate marketplace and found a single-repo, checked-in source-of-truth model instead. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118] [SOURCE: AGENTS.md:277-288]

## Follow-up questions for next iteration
- Can a headless internal runner deliver more value than a marketplace right now?
- Which current `system-spec-kit` scripts are closest to a reusable runner contract?
- How could lifecycle hooks help such a runner stay observable?
