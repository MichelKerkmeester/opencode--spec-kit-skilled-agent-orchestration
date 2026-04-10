# Iteration 011 — Research Packet Minimal Profile

Date: 2026-04-10

## Research question
Does the external repo's lean instruction-and-runtime model suggest that `system-spec-kit` should simplify how it documents research-only packets instead of forcing them through the general Level 1/2/3+ lifecycle?

## Hypothesis
Yes. The external repo's strongest signal is not "fewer docs everywhere," but "lighter docs for loop-driven work." `system-spec-kit` already has a distinct research state model, yet its top-level documentation guidance still frames all work through the broader feature-spec ladder.

## Method
I compared the external orchestrator's lean instruction template and anti-bloat portfolio rules with `system-spec-kit`'s level definitions, phase overlay, research template guidance, and deep-research state model. I looked for mismatches between how research packets actually operate and how the core documentation system says work should be structured.

## Evidence
- `[SOURCE: external/commands/orchestrator.md:193-220]` The external orchestrator generates a lean `CLAUDE.md` centered on overview, commands, current task phases, and a completion gate rather than a multi-document packet.
- `[SOURCE: external/portfolio/PORTFOLIO.md.example:45-50]` The portfolio rules explicitly ban overgrown project instructions and treat instruction-file sprawl as an anti-pattern.
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:51-57]` The local level model scales from Level 1 through Level 3+ by adding verification, architecture, and governance layers.
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-97]` The local guidance says all features start at Level 1 with `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- `[SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:17-27]` The phase system then overlays decomposition on top of the level system instead of replacing it.
- `[SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:51-56]` Phase activation requires a second scoring system in addition to the level score.
- `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-27]` The deep-research workflow already uses a separate packet shape centered on `deep-research-config.json`, JSONL state, a strategy file, a dashboard, iteration files, and `research/research.md`.
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:397-430]` Research documentation is also described as a comprehensive multi-section artifact that can expand significantly before implementation begins.

## Analysis
Phase 2 makes the mismatch clearer than Phase 1 did: `system-spec-kit` effectively has two documentation models already. One is the general feature packet with levels, checklists, and decision records. The other is the deep-loop packet with workflow-owned state and synthesis files. The current system treats the second model as a specialized overlay rather than a first-class profile. That creates avoidable complexity because research-only work ends up mentally translated through the broader feature-document ladder even when the actual runtime contract lives almost entirely under `research/`.

The external repo's answer is not better because it is sparse; it is better because it is honest about the job being done. A loop-driven research run needs a charter, state, evidence, synthesis, and a stop condition. It does not inherently need the full general feature packet semantics. `system-spec-kit` should keep the richer documentation path for implementation packets, but formalize a lighter "research packet" profile rather than leaving it half-inside and half-outside the main level taxonomy.

## Conclusion
confidence: high

finding: `system-spec-kit` should formalize a minimal research-packet profile for deep-research and deep-review phases. The current system already behaves that way in practice, but the core documentation model does not clearly acknowledge it.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/references/templates/template_guide.md`, `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md`, `.opencode/skill/sk-deep-research/references/state_format.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define what is mandatory for research-only packets versus implementation packets
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** General work is framed through Level 1/2/3+ packet depth, then optionally overlaid with phases; deep research has a separate runtime packet shape, but that shape is not clearly elevated as its own documentation profile.
- **External repo's approach:** The external toolkit uses a lean instruction file plus runtime state files for loop-driven work and explicitly warns against bloated instruction artifacts.
- **Why the external approach might be better:** It aligns the documentation surface to the actual operational contract, which reduces translation overhead for users and maintainers.
- **Why system-spec-kit's approach might still be correct:** A single documentation ladder is easier to teach and keeps all work under one governance umbrella.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Add a first-class "research packet minimal profile" that canonically requires `phase-research-prompt.md` plus `research/` state/synthesis artifacts, without pretending those runs map to the full Level 1 baseline.
- **Blast radius of the change:** medium
- **Migration path:** Document the profile first, then update validators and templates so existing research packets remain valid without forcing retroactive packet reshaping.

## Counter-evidence sought
I looked for a clear local statement that research packets are already exempt from the broader level system. I found a dedicated research-state model, but not a crisp first-class profile that resolves the overlap cleanly.

## Follow-up questions for next iteration
- Should research-packet minimal mode apply only to deep loops, or also to one-off packet-local audits?
- Which validators should remain active for research packets, and which should become implementation-only?
- Does this simplification affect how memory save should be treated at the end of a research run?
