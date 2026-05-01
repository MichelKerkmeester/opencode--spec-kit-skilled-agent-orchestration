# Iteration 029 — Hook, Constitutional, And Master-Doc Surface Compression

Date: 2026-04-10

## Research question
Does the combination of `CLAUDE.md`, constitutional gate docs, hook docs, and startup surfaces create too much operator-facing machinery compared to the external repo's lighter automation contract?

## Hypothesis
Yes. Public's automation stack is useful, but too much of its implementation detail leaks into the operator contract. The system likely needs a much slimmer top-level contract plus a runtime appendix for the rest.

## Method
I compared Public's gate and hook references with Agent Lightning's concise contributor guidance.

## Evidence
- `CLAUDE.md` requires Gates 1-3 before tool use, including memory recovery, skill routing, and spec-folder binding rules. [SOURCE: CLAUDE.md:109-168]
- `AGENTS.md` repeats the gate system, Gate 3 persistence rules, memory-save contract, and completion-verification rules. [SOURCE: AGENTS.md:161-222]
- The constitutional gate memory further mirrors this by summarizing gate cross-references and continuation validation. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-69]
- The main `system-spec-kit` skill also documents startup injection and runtime-specific hook surfaces such as `session-prime`, `session-stop`, transcript parsing, and cross-runtime fallback behavior. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:736-770]
- The dedicated hook reference adds concrete registration JSON, lifecycle stages, hook state storage, budgets, and fallback behavior. [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:1-50]
- Agent Lightning's contributor guidance stays short: architecture overview, project structure, commands, style, testing, and contribution expectations. [SOURCE: external/AGENTS.md:3-16]

## Analysis
Public's automation is not the problem. The problem is the number of places where an operator can encounter the same system from different angles: master behavior doc, repo instructions, constitutional memory, skill docs, and hook docs. That layering is useful for maintainers, but it is too thick for first-contact UX.

The external repo shows that good automation does not require making all of its machinery primary reading material. Public should keep the runtime sophistication while sharply separating operator-facing contracts from maintainer/runtime appendices.

## Conclusion
confidence: high

finding: `system-spec-kit` should redesign its operator contract into a slim top-level workflow guide, while moving hook lifecycles, duplicated gate detail, and runtime-specific mechanics into maintainers' or appendix-grade documentation.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `CLAUDE.md`, `AGENTS.md`, constitutional summaries, and hook documentation boundary
- **Change type:** documentation and automation UX redesign
- **Blast radius:** large
- **Prerequisites:** define single source of operator truth, identify appendix-only runtime details, and remove duplicate instruction loops
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators can meet the same system through master docs, repo docs, constitutional memories, hook references, and command contracts.
- **External repo's equivalent surface:** The contributor contract is short, and deeper operational details sit behind targeted docs rather than the main workflow surface.
- **Friction comparison:** Public demands more reading and more internal model awareness before confident action. Agent Lightning requires less front-loaded ceremony, even though the runtime itself is sophisticated.
- **What system-spec-kit could DELETE to improve UX:** Delete duplicated gate and startup explanations from the top-level operator contract when they are already enforced elsewhere.
- **What system-spec-kit should ADD for better UX:** Add a two-layer docs model: a short operator contract and a separate runtime-maintainer appendix for hooks, fallbacks, and internals.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for evidence that all of this duplicated exposure is required for safety, but most of the real safety comes from enforcement and fallbacks, not from making every operator read multiple overlapping sources.

## Follow-up questions for next iteration
- Which single document should own the operator contract?
- Which hook and gate details belong only in maintainer docs?
- Can Public keep auditability while halving the amount of top-level instruction text?
