# Iteration 023 — Redesign Spec-Folder UX Around Named Profiles Instead Of Level Numbers

Date: 2026-04-10

## Research question
Is the current Level 1/2/3+ template and validation mental model intuitive enough for operators, or should `system-spec-kit` redesign that user-facing abstraction?

## Hypothesis
It should be redesigned. The current file set and validation depth are useful, but the operator-facing level ladder is too ceremonial and too file-centric compared with the simpler artifact model in the external repo.

## Method
I compared the local template architecture, level guidance, and validation rules with the external repo's lighter artifact model around `CLAUDE.md`, `BLUEPRINT.md`, and handoff-oriented files. I focused on operator comprehension rather than implementation correctness.

## Evidence
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-46]` The local template system uses a CORE-plus-ADDENDUM architecture with multiple composed level folders and a maintainer-facing composition model.
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-75]` The public abstraction is a four-step progressive enhancement ladder with Level 1, 2, 3, and 3+ guidance.
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-97]` Even Level 1 requires four files, including `implementation-summary.md`.
- `[SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:27-34]` Template usage is strict: never create from scratch, preserve structure, remove placeholders, and delete sample content.
- `[SOURCE: .opencode/skill/system-spec-kit/references/validation/validation_rules.md:40-57]` The validation system exposes fourteen named rules across files, placeholders, evidence, anchors, levels, counts, and phase links.
- `[SOURCE: .opencode/skill/system-spec-kit/references/validation/validation_rules.md:63-85]` `implementation-summary.md` is enforced for all levels as part of the file-exists contract.
- `[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:83-100]` The validator advertises strict mode, recursive validation, multiple rule classes, and level/file expectations at the CLI boundary.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator.md:128-138]` The external repo keeps its project understanding centered on a small set of anchor documents rather than a numbered packet taxonomy.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator-new.md:83-111]` The external greenfield flow persists the original prompt and scaffolds a few core directories and documents without exposing a comparable level system.

## Analysis
The local system is not over-documented by accident. It is intentionally building traceability, reuse, and completion rigor. The problem is the user-facing metaphor. "Level 1 versus Level 2 versus Level 3+" asks the operator to think in documentation taxonomy, while the real question they care about is closer to "What kind of job is this?" Small bounded change, validated change, architecture change, or governed multi-stream effort are more intuitive categories than numeric levels.

So the right move is not to delete spec folders. The right move is to redesign the surface language. Keep the current file contracts and validators internally, but present them as named work profiles with progressive reveal. Let operators choose "Quick change" or "Architecture packet" and let the system map that to the current template stack.

## Conclusion
confidence: high

finding: `system-spec-kit` should redesign spec-folder UX around named work profiles instead of asking operators to reason directly about Level 1/2/3+ template classes.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/references/templates/template_guide.md`, `CLAUDE.md`
- **Change type:** must-have
- **Blast radius:** operator-surface
- **Prerequisites:** define stable profile names and a reversible mapping to current levels
- **Priority:** must-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators are asked to think in terms of numeric levels, mandatory file sets, template composition, and strict validator rules.
- **External repo's equivalent surface:** The external repo uses a lighter artifact vocabulary centered on a handful of role documents and project state files.
- **Friction comparison:** `system-spec-kit` offers stronger rigor, but the level ladder imposes more cognitive load than the operator likely needs. The external repo is easier to explain in one sentence.
- **What system-spec-kit could DELETE to improve UX:** Delete numeric level language from the primary operator path.
- **What system-spec-kit should ADD for better UX:** Add named work profiles that map to current file sets and reveal extra artifact requirements only when needed.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for evidence that numeric documentation levels are a clearer operator metaphor than named work profiles. I did not find support for that framing in the external repo.

## Follow-up questions for next iteration
- Which current level distinctions are invisible to most operators and can be safely hidden?
- Should research packets and implementation packets become separate named profile families?
- How much of `validate.sh --strict` should remain operator-facing versus maintainer-facing?
