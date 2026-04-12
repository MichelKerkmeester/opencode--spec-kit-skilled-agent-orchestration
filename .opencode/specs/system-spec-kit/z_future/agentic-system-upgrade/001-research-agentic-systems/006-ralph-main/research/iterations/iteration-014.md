# Iteration 014 — Validation Should Center on Acceptance Evidence

## Research question
Is `system-spec-kit`'s validation pipeline too document-centric compared with Ralph's story-level acceptance checks, and should that balance be simplified?

## Hypothesis
`system-spec-kit` still needs packet validation, but it likely overweights document completeness relative to executable acceptance evidence during autonomous execution.

## Method
Compared Ralph's acceptance-criteria and commit gate model in prompts, skills, and README with `system-spec-kit`'s level requirements, extended checklists, validator, and implementation workflow.

## Evidence
- Ralph's unit of truth is the story acceptance criteria: each story must be verifiable, include `Typecheck passes`, often `Tests pass`, and browser verification for UI work. [SOURCE: external/skills/ralph/SKILL.md:83-116] [SOURCE: external/skills/prd/SKILL.md:69-92]
- The runtime loop only commits after project quality checks pass and the story can be marked `passes: true`. [SOURCE: external/prompt.md:10-16] [SOURCE: external/README.md:122-130] [SOURCE: external/README.md:194-207]
- `system-spec-kit`'s level model escalates into large verification payloads, including Level 3+ extended checklists with 100-150 items, sign-offs, and AI execution protocol sections. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-403] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:407-410]
- The validator orchestrates many rule classes and recursive phase validation, while `/spec_kit:implement` adds separate quality-checklist, preflight, postflight, and evidence-verification phases around development. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] [SOURCE: .opencode/command/spec_kit/implement.md:171-187] [SOURCE: .opencode/command/spec_kit/implement.md:272-316]

## Analysis
Ralph is not anti-validation; it is radically specific about what counts as proof. The main difference is that its proof is attached directly to the story being executed. `system-spec-kit` has stronger packet integrity guarantees, but those guarantees can become the center of gravity, especially when tasks are still broad. That creates a bad loop: weakly-sized tasks force larger checklists, and larger checklists encourage process-heavy completion rather than sharp evidence about one verified change. The better architecture is two-tier validation: lightweight packet integrity checks plus first-class executable acceptance criteria on each task.

## Conclusion
confidence: high

finding: `system-spec-kit` should SIMPLIFY validation by making per-task executable acceptance evidence the primary completion contract, while narrowing document validation to packet integrity and safety checks.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** update `tasks.md` templates and `/spec_kit:implement` to require executable acceptance criteria per task
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Validation spans documentation presence, placeholder checks, anchors, checklist structure, pre/postflight learning capture, and evidence verification. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] [SOURCE: .opencode/command/spec_kit/implement.md:171-187]
- **External repo's approach:** Validation is centered on task-local acceptance criteria and project checks, with completion recorded directly in `prd.json`. [SOURCE: external/prompt.md:10-16] [SOURCE: external/skills/ralph/SKILL.md:83-116] [SOURCE: external/prd.json.example:5-17]
- **Why the external approach might be better:** It keeps proof attached to the unit of work, making autonomous continuation and retry much clearer. [SOURCE: external/README.md:122-130]
- **Why system-spec-kit's approach might still be correct:** Packet-level integrity and governance matter in workflows that need traceability, multi-phase documentation, and reviewable decisions. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-403]
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep `validate.sh` focused on packet integrity, required artifacts, and safety rules. Move proof-of-work responsibility into task acceptance criteria, checked by implementation/review workflows with explicit evidence links or command outputs.
- **Blast radius of the change:** architectural
- **Migration path:** Start by upgrading task templates and implementation commands, then prune validator rules that duplicate evidence already captured at the task level.

## Counter-evidence sought
I looked for strong task-local executable acceptance contracts in the current Level 3 tasks template and found broad phase buckets instead, which reinforces the current documentation-heavy validation bias. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/tasks.md:35-71]

## Follow-up questions for next iteration
- If packet validation is narrowed, how should the operator surface change so users are not forced through unnecessary meta-work?
- Which gates are still doing essential safety work, and which are mostly compensating for document-heavy workflows?
- Can the repo keep hard safety rules while reducing command-surface friction?
