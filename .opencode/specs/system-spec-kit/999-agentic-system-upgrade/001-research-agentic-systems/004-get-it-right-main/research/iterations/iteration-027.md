# Iteration 027 — Consolidate The `sk-code-*` Family Into A Smaller Public Skill Model

Date: 2026-04-10

## Research question
Is the current `sk-code-opencode` / `sk-code-full-stack` / `sk-code-web` / `sk-code-review` family too fragmented for operators compared with the external repo's much simpler capability packaging?

## Hypothesis
Yes. The baseline-plus-overlay idea is sound, but the current public skill family likely needs a smaller top-level mental model.

## Method
I compared the internal skill catalog and the overlapping role boundaries of the `sk-code-*` family against the external repo's simpler "small number of roles plus one workflow" packaging.

## Evidence
- [SOURCE: .opencode/skill/README.md:42-70] The skills system emphasizes 20 skills, Gate 2 routing, and on-demand loading across many categories.
- [SOURCE: .opencode/skill/README.md:121-129] The code-quality domain is explicitly described as multiple overlays with shared terminology.
- [SOURCE: .opencode/skill/README.md:152-177] The catalog lists four code-quality skills plus the wider framework foundation.
- [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-29] `sk-code-opencode` targets internal OpenCode system code and standards-only guidance.
- [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:42-58] It explicitly excludes web work and full development lifecycle guidance.
- [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-33] `sk-code-full-stack` covers implementation, testing, debugging, and verification across many stacks.
- [SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-37] `sk-code-web` is another orchestrator covering frontend implementation, debugging, and verification.
- [SOURCE: .opencode/skill/sk-code-review/SKILL.md:49-56] `sk-code-review` already frames the family as a baseline plus exactly one overlay skill.

## Analysis
There is a coherent architecture hiding inside the current skill family: one review baseline, one implementation baseline, and a small set of environment-specific overlays. But the public naming does not make that shape obvious. Operators instead see four similarly named skills that overlap in responsibilities and differ by context in ways they must infer. The external repo shows a better packaging instinct: keep the visible capability map smaller, then let the internals specialize. `system-spec-kit` should not delete specialized standards, but it should present them as one `sk-code` capability with context-aware submodes rather than a broad family of peer brands.

## Conclusion
confidence: high
finding: preserve the baseline-plus-overlay architecture, but consolidate the public `sk-code-*` family into a smaller unified `sk-code` model with context-aware routing underneath.

## Adoption recommendation for system-spec-kit
- **Target file or module:** skill catalog, skill routing UX, and `sk-code-*` family docs
- **Change type:** capability merge
- **Blast radius:** large
- **Prerequisites:** define a unified top-level `sk-code` contract and map current skills to submodes or overlays
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** multiple peer `sk-code-*` skills expose overlapping implementation, review, and verification concepts.
- **External repo's approach:** capability packaging is small and purpose-led.
- **Why the external approach might be better:** it reduces ambiguity at routing time and makes the system easier to teach.
- **Why system-spec-kit's approach might still be correct:** stack-specific overlays and OpenCode-specific rules are genuinely different and should not be erased.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** expose one public `sk-code` capability with modes like `review`, `web`, `opencode`, and `full-stack`, while keeping current files as internal routed components.
- **Blast radius of the change:** advisor rules, docs, command wording, and skill README inventory.
- **Migration path:** start by rewriting docs and Gate 2 output language around unified `sk-code` terminology, then optionally alias current skill names internally.

## UX / System Design Analysis

- **Current system-spec-kit surface:** operators see several similarly named code skills and must infer which one governs the current task.
- **External repo's equivalent surface:** the workflow presents a small number of distinct capabilities rather than a family tree.
- **Friction comparison:** the internal system is more adaptable, but the overlap between skill names increases routing ambiguity and onboarding cost.
- **What system-spec-kit could DELETE to improve UX:** the idea that each `sk-code-*` variant should be taught as a separate top-level product.
- **What system-spec-kit should ADD for better UX:** a single visible `sk-code` umbrella with automatic environment detection and clearer submode labels.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for documentation that already makes the family shape obvious to users. The baseline-plus-overlay idea exists, but it is easier to infer after reading multiple SKILL files than from the public surface alone.

## Follow-up questions for next iteration
- Should unified `sk-code` routing happen in docs first or in `skill_advisor.py` first?
- Which current file boundaries must remain because of real differences in references and scripts?
- Could review baseline plus overlay selection become an internal implementation detail?
