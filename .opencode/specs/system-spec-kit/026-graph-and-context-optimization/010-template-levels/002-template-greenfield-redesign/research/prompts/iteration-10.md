# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation, EXTENDED with workflow-invariant constraint.

## STATE

Segment: 1 | Iteration: 10 of 14
Last 9 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 -> 0.41 -> 0.38 -> 0.06 (CONVERGED iter 9)
**Loop reopened by user with new constraint.** Iters 10-14 challenge the converged design under a workflow-invariant requirement.

Iteration: 10 of 14 — **WORKFLOW-INVARIANT CONSTRAINT PASS — back to drawing board**

## NEW CONSTRAINT (the user's exact words, paraphrased)

> Reality: the user does NOT run `create.sh --level 3` directly. The user talks to AI (or invokes a slash command). The AI:
> 1. Detects spec-folder need (Gate 3 in CLAUDE.md)
> 2. Asks "use existing / create new / which folder?"
> 3. Picks level/preset from conversation context
> 4. Runs create.sh under the hood
> 5. Authors the docs from conversation
> 
> The user never sees `--level 3`. The user never sees `--preset arch-change`. The user just talks.
>
> CONSTRAINT: **AI behavior + user conversation flow + Gate 3 classifier behavior must remain byte-identical to today.** The new design's "kind / capabilities / preset" decomposition must NEVER surface to the user OR to the AI's user-facing prompts/skills. If implementing the design forces a single change to AI behavior or conversation flow, the design is wrong.

## YOUR TASK

Re-evaluate the previously converged C+F hybrid design AGAINST this constraint. Specifically:

1. **Re-read the Gate 3 classifier and AI-facing skill text** to identify EVERY surface where today's AI inferred level number gets used:
   - `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`
   - `.opencode/skill/system-spec-kit/SKILL.md`
   - `.opencode/skill/sk-doc/` (any AI-facing prompts about levels)
   - `CLAUDE.md` and `AGENTS.md` (the level system docs)
   - `.opencode/command/spec_kit/` slash command markdown files (do they mention level?)
   - `.opencode/agent/` agent markdown files (do they prompt the AI to think about levels?)
   - `.opencode/skill/system-spec-kit/scripts/spec/create.sh` `--help` text (would AI parse this for choices?)

2. **For every surface that mentions "level"**, classify:
   - **STRICTLY INVISIBLE TO USER** (e.g., `create.sh` internal switch) — safe to refactor freely
   - **AI-facing prompt text** (e.g., a skill telling the AI to "infer the appropriate level") — must keep mentioning "level", not "capability" or "preset"
   - **USER-FACING surface** (e.g., AGENTS.md user docs, a slash command `--help` displayed to the user) — must keep level vocabulary

3. **Stress-test the design against the constraint**:
   - **Stress-test 1**: today's classifier emits a level number (1/2/3/3+/phase). Does the new design accept that as input WITHOUT requiring the AI to know about kind/capabilities/preset? Sketch the EXACT mapping function (level → preset → kind+capabilities+files).
   - **Stress-test 2**: when the AI calls `create.sh --level 3`, does any user-visible output (stdout, log lines, file names, file contents) differ from today? List every diff. Should be zero, or only "clean" diffs (e.g., absence of stale empty stub files).
   - **Stress-test 3**: when the validator runs and reports failures, do the error messages mention "capability" or "preset"? They MUST mention "level" (or be silent about taxonomy entirely). Verify by reading `check-files.sh`, `check-sections.sh`, `check-template-headers.sh` proposed diffs from iter 7.
   - **Stress-test 4**: when the user resumes work via `/spec_kit:resume` or `/spec_kit:complete`, does any AI-facing prompt change? Read `.opencode/command/spec_kit/resume.md` and `.opencode/command/spec_kit/complete.md`.
   - **Stress-test 5**: when AI authors a packet's frontmatter, does it write `level: 3` (today's behavior) or something new? Recommend keeping `<!-- SPECKIT_LEVEL: 3 -->` and `level: 3` frontmatter for full backward-readability + AI-prompt-invariance.

4. **Identify any DESIGN CHANGES required to honor the constraint**:
   - Should the manifest's "preset" names be `level-1`, `level-2`, `level-3`, `level-3-plus`, `phase-parent` instead of `simple-change`/`arch-change`/etc, to maximize naming invariance?
   - Should the level→preset mapping be 1:1 (preset is just a synonym for level) instead of N:1 (multiple presets per level)?
   - Should `--preset X` flag be removed entirely from `create.sh`, leaving only `--level N`? (Internal mapping = implementation detail.)
   - Should `<!-- SPECKIT_LEVEL: 3 -->` frontmatter marker be PRESERVED on every authored doc (today's behavior) instead of moving to capability declarations?
   - Should ALL user-facing/AI-facing documentation (CLAUDE.md, SKILL.md, AGENTS.md, command markdown) continue to use ONLY level vocabulary?

5. **Update the recommendation accordingly**. The C+F hybrid design probably survives but with these modifications. Document the deltas vs the iter-9 synthesis.

## CARRY-OVER FACTS

From iters 1-8: parser contracts mapped, addon lifecycles classified, manifest schema written, refactor diffs concrete, dry-run validated.
From iter 9: synthesis converged on C+F hybrid (86 → 15 source files). ADR-001 Accepted.
From iter 5/7: `create.sh` change ~30-line diff; `check-files.sh` ~20-line diff; both consume manifest.

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-009.md
- Final synthesis: `research.md`
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-010.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-010.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-009.md (final synthesis) FIRST so you know what design you're stress-testing.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- The design (C+F hybrid manifest-driven greenfield) is FROZEN. Iters 10-14 add INVARIANT MITIGATIONS to the design, NOT a redesign. If the design fundamentally cannot satisfy the constraint, flag that as a P0 finding and recommend a smaller scope.
- Be HONEST: if the design needs modifications, list them concretely.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-010.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "AI-Facing Surface Audit", "Stress-Test Results 1-5", "Required Design Modifications", "Updated Recommendation Delta") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":10,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-010.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 10

1. **Audit FIRST, opine SECOND**: read every file in the AI-facing surface list before drawing conclusions about whether the constraint is satisfiable.
2. **Be precise about what counts as "AI-facing"**: the AI reads CLAUDE.md, SKILL.md, AGENTS.md, command markdown, and skill descriptions. If those mention "level" or "capability", that's AI-facing. The TS/shell source files the AI doesn't read (only invokes) are NOT AI-facing.
3. **Map every "level" mention to a category**: STRICTLY INVISIBLE / AI-facing / USER-facing.
4. **Recommend the simplest mapping that preserves invariance**: probably 1:1 level↔preset with names `level-1`, `level-2`, `level-3`, `level-3-plus`, `phase-parent`.
5. **Next focus**: iter 11 should write ADR-005 + the concrete diffs that lock in workflow-invariance + update relevant text. Iter 12 should re-run the iter-7 integration diffs through the workflow-invariant lens. Iter 13 should re-run the iter-8 dry-run with explicit AI-conversation transcripts. Iter 14 should re-synthesize research.md + research.md addendum.

Emit findings as `{"type":"finding","id":"f-iter010-NNN",...}`. Use graphEvents for AI-surface→file edges.
