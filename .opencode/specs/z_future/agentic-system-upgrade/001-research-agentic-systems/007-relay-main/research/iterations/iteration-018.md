# Iteration 018 — Keep the Level System, Simplify Its Exposure

Date: 2026-04-10

## Research question
Should `system-spec-kit` pivot away from Level 1/2/3+ spec classification toward a fundamentally different documentation lifecycle inspired by Relay's simpler user-facing model?

## Hypothesis
No. Relay's simple front door is a UX signal, not evidence that Public's level-based documentation lifecycle is fundamentally wrong.

## Method
Compared Relay's simple mode-oriented introduction with Public's level specifications and spec-folder governance requirements.

## Evidence
- Relay's docs emphasize approachable modes and examples, but the reviewed material does not show an equivalent governance-heavy documentation lifecycle with template levels, phase overlays, or implementation closeout requirements. [SOURCE: external/docs/introduction.md:2-6] [SOURCE: external/docs/introduction.md:67-97]
- Public's level system is explicit about what each level adds: baseline core docs, verification, architecture decisions, and governance. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-74]
- Level 2 adds checklist-based validation for riskier work, and Level 3 adds architecture decision recording for larger system changes. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:173-206] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:300-324]
- Level 3+ adds explicit governance for high-complexity, multi-agent work, and phases are a behavioral overlay rather than a separate level. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:374-404] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:776-803]
- The repo doctrine reinforces that every file-modifying conversation needs a spec folder, with levels acting as the graduated documentation contract. [SOURCE: AGENTS.md:233-252]

## Analysis
Relay is a transport-first runtime, not a packet-governance system. Its simpler UX should absolutely influence how Public *talks* about levels, but not whether levels exist. The level system carries real value: it matches verification burden, architecture risk, and governance cost to change complexity. The problem is presentation overhead, not the core model.

## Conclusion
confidence: high
finding: Public should keep the Level 1/2/3+ lifecycle. The better move is to simplify how loudly levels surface to operators, not to discard the model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** none for lifecycle replacement; only UX wording and operator-facing explanations
- **Change type:** rejected pivot
- **Blast radius:** large if attempted, so avoid
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Level-based spec-folder lifecycle maps documentation burden to complexity and risk.
- **External repo's approach:** Simpler user-facing modes with little evidence of comparable documentation/governance requirements.
- **Why the external approach might be better:** It is easier to explain and faster to adopt for lightweight operator tasks.
- **Why system-spec-kit's approach might still be correct:** Public solves a different class of problem that benefits from explicit documentation depth and validation scaling.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A. Keep the lifecycle model; simplify how it is explained.
- **Blast radius of the change:** large if changed, so keep current architecture
- **Migration path:** No lifecycle pivot. Only reduce front-door verbosity around level choice.

## Counter-evidence sought
Looked for concrete Relay evidence that a simpler transport UX also scales to Public's level of packet governance, decision logging, and validation burden; none appeared in the reviewed materials.

## Follow-up questions for next iteration
- Where can Public hide level complexity without losing rigor?
- Which level explanations are truly needed by end users?
- Should commands infer level more often so users choose it less explicitly?
