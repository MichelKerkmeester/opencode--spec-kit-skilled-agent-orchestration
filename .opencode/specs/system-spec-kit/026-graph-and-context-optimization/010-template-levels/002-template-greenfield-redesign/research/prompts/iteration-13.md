# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast.

## STATE

Segment: 1 | Iteration: 13 of 14
Last 12 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 -> 0.41 -> 0.38 -> 0.06 -> 0.64 -> 0.57 -> 0.52
Status iter 12: `complete-ground-truth-leakage-probe`. 11 surfaces audited; level vocabulary preserved on ALL public/AI-facing channels EXCEPT 2 minor leaks in generated docs (`[capability]` placeholders, "Sub-phase manifest" wording).

Iteration: 13 of 14

Focus Area: **AI-CONVERSATION TRANSCRIPT DRY-RUN under workflow-invariant lens.** Walk 5 user-facing scenarios end-to-end as AI conversation transcripts. Verify every word the AI emits to the user stays level-only.

## YOUR TASK

For each of the 5 scenarios below, produce an explicit AI-conversation transcript: USER says X → AI responds Y → AI invokes Z under the hood → AI confirms W. The transcript should be REALISTIC (matching today's AI behavior using Gate 3 + sk-doc routing). After each transcript, verify zero leakage of preset/capability/kind/manifest vocabulary in the AI's user-visible turns.

### Scenario A: Routine implementation work, fresh spec folder

User says: "Let's add a new validator for the import-resolver edge case."
Walk through:
1. AI runs Gate 3 classifier → infers Level 2 (small validator change with QA gates)
2. AI prompts user with spec folder options (Option A/B/C/D from Gate 3)
3. User picks B (new spec folder)
4. AI invokes `create.sh --level 2 --short-name 'import-resolver-edge'`
5. AI shows scaffold confirmation
6. AI begins authoring spec.md content from conversation

For each AI turn, verify wording stays level-only.

### Scenario B: Architectural change requiring decision-record

User says: "Refactor the memory-parser to support pluggable indexers."
Walk through:
1. AI runs Gate 3 → infers Level 3
2. AI offers spec folder options
3. User picks B
4. AI invokes `create.sh --level 3 --short-name 'pluggable-indexers'`
5. AI confirms scaffold; decision-record.md is in the file list (confirmation message must mention decision-record by name, NOT by capability)
6. AI begins authoring

### Scenario C: Phase-parent for multi-phase migration

User says: "Plan a multi-phase migration from level system to manifest system."
Walk through:
1. AI infers phase-parent appropriate
2. AI offers spec folder options
3. User picks D (Phase folder) or chooses to scaffold parent first
4. AI invokes `create.sh --level 3 --phase --phases 4 --phase-names 'manifest-add,scaffolder-migrate,validator-migrate,legacy-delete' --short-name 'manifest-migration'`
5. AI confirms scaffold of parent + 4 children

### Scenario D: Validator failure remediation

User says: "validate.sh is failing on my new packet — what's wrong?"
Walk through:
1. AI runs `bash validate.sh <packet> --strict` and captures output
2. AI parses error messages (must say "Level 3 packet missing required file: decision-record.md", NOT "capability=architecture-decisions missing required file")
3. AI explains to user what's wrong using level vocabulary
4. AI offers to scaffold the missing file or wait for user

### Scenario E: Resume work via /spec_kit:resume

User invokes `/spec_kit:resume`
Walk through:
1. AI runs resume protocol per CLAUDE.md
2. AI reads spec folder + handover.md + spec docs
3. AI summarizes: "This is a Level 3 packet with implementation in progress. Last action: ..."
4. AI proposes next safe action
5. Verify no preset/capability/manifest words in AI's summary

## ALSO: RESOLVE 2 OPEN QUESTIONS FROM ITER 12

1. **Should the workflow-invariance CI test be ONE test or split into TWO** (live-templates+scripts test + public-docs test)? Pick one.
2. **Should existing generated fixtures under `scripts/tests/fixtures/` be rewritten immediately or in a follow-on?** Pick one.

## ALSO: FIX 2 LEAKS FOUND IN ITER 12

1. **Level 3/3+ generated docs contain `[capability]` placeholder text** — propose specific replacement wording (e.g., `[required field]` or `[applicable component]`)
2. **Phase-parent spec.md contains "Sub-phase manifest"** — propose specific replacement (e.g., "Sub-phase list" or "Phase children")

## CARRY-OVER FACTS

From iter 11: ADR-005 drafted; resolveLevelContract API spec'd; banned terms in public surfaces: `preset`, `capability`, `kind`, `manifest`
From iter 12: 11-surface audit; only 2 leaks identified (above); rest preserves level vocabulary

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-012.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-013.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-013.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-012.md FIRST.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- Transcripts should be REALISTIC — model AI's voice based on actual sk-doc / system-spec-kit prompt patterns. Don't invent vocabulary the AI wouldn't actually use.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-013.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Scenario A Transcript + Verdict", "Scenario B", "Scenario C", "Scenario D", "Scenario E", "2 Open Questions Resolved", "2 Leak Fixes (replacement wording)") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":13,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-013.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 13

1. **Transcripts as fenced code blocks**: format as `**USER**: ...` / `**AI**: ...` / `**(under the hood):** create.sh --level 3 ...`
2. **Per-scenario verdict**: PASS (level-only) / LEAK FOUND: <quote>
3. **Be realistic**: don't make the AI say "scaffolding the architecture-decisions capability" — model what today's AI would actually say ("scaffolding a Level 3 spec folder with decision-record.md").
4. **Leak fixes**: provide exact replacement strings + which template file gets the edit.
5. **Next focus**: iter 14 is FINAL SYNTHESIS — write `research.md` addendum with all iter-10-through-13 findings folded in, declare convergence, update the recommendation language.

Emit findings as `{"type":"finding","id":"f-iter013-NNN",...}`.
