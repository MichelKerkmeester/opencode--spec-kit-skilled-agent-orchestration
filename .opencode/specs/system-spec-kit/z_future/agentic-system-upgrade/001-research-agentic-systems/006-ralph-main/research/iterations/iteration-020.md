# Iteration 020 — Two-Lane Architecture for Minimal vs Governed Workflows

## Research question
Does the external repo's deliberate absence of memory infrastructure, shared lifecycle tooling, and wide command surfaces suggest that `system-spec-kit` should expose an explicit lightweight lane instead of making every workflow feel like the full governed stack?

## Hypothesis
The strongest Phase 2 architecture signal is not "become Ralph," but "admit there are two classes of work and route them differently."

## Method
Synthesized the full Ralph repo map against `system-spec-kit`'s memory, command, and workflow surfaces to test whether a dual-lane architecture would fit the evidence better than the current mostly-unified surface.

## Evidence
- Ralph's core system is deliberately tiny: one shell loop, two prompt variants, two planning/conversion skills, and a minimal persisted state bundle. [SOURCE: external/README.md:132-145] [SOURCE: external/.claude-plugin/plugin.json:2-9] [SOURCE: external/ralph.sh:82-113]
- The external repo has no semantic memory database, no checkpoint/shared-memory lifecycle, no multi-command planning/implementation/review suite, and no broad management surface; its power comes from keeping the loop narrow. [SOURCE: external/README.md:90-130] [SOURCE: external/README.md:165-168]
- `system-spec-kit` intentionally spans a much wider stack: command families for resume/plan/implement/research/review, a large memory subsystem, and governance-aware retrieval/management surfaces. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-130] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145] [SOURCE: .opencode/command/memory/manage.md:48-99]

## Analysis
Phase 1 mostly treated Ralph as a source of tactical overlays. Phase 2 points to a larger conclusion: the repo is implicitly serving two different workflow classes with one increasingly heavy surface. Some work is narrow, linear, and verification-heavy; Ralph is excellent there. Other work is multi-phase, cross-session, retrieval-heavy, and governance-sensitive; `system-spec-kit` is excellent there. The missing piece is not another feature but an explicit architectural fork in the operator model so lightweight cases do not pay the full price of the governed stack by default.

## Conclusion
confidence: medium

finding: `system-spec-kit` should PIVOT toward an explicit two-lane architecture: a lightweight loop lane for narrow, linear autonomous execution, and the existing governed lane for knowledge-heavy, multi-phase, or high-governance work.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** define eligibility criteria and safety boundaries for the lightweight lane
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** The operator surface mostly assumes the full governed stack is the normal path, even though some workflows are much narrower. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-130] [SOURCE: .opencode/command/spec_kit/resume.md:37-141]
- **External repo's approach:** Ralph embraces a minimalist lane: small tasks, tiny state, one obvious runtime entrypoint, and manual escalation when needed. [SOURCE: external/README.md:90-130] [SOURCE: external/README.md:165-168]
- **Why the external approach might be better:** It prevents narrow workflows from inheriting governance and retrieval machinery they do not need. [SOURCE: external/README.md:170-188]
- **Why system-spec-kit's approach might still be correct:** High-value workflows still need the governed lane's memory, validation, and lifecycle guarantees. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-18] [SOURCE: .opencode/command/spec_kit/implement.md:171-205]
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Define two explicit workflow lanes. The lightweight lane uses sharp task sizing, append-only run-state, and project-native checks. The governed lane keeps the current spec-folder, memory, validation, and review stack. Route operators into one lane early, with a clear upgrade path from lightweight to governed when complexity or risk increases.
- **Blast radius of the change:** architectural
- **Migration path:** Pilot the lightweight lane in one command family first, document upgrade criteria, and keep `/spec_kit:resume` as the bridge between lanes.

## Counter-evidence sought
I looked for proof that Ralph's narrow model already solves the same governance and continuity scope as `system-spec-kit` and found the opposite: the repo's power comes from omission. That omission is only safe because the workflow class is intentionally narrow. [SOURCE: external/README.md:132-145] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

## Follow-up questions for next iteration
- None. This iteration closes Phase 2 and feeds directly into combined synthesis.
