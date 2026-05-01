# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast.

## STATE

Segment: 1 | Iteration: 12 of 14
Last 11 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 -> 0.41 -> 0.38 -> 0.06 -> 0.64 -> 0.57
Status iter 11: `complete-invariant-contract-locked`. ADR-005 drafted, resolveLevelContract API spec'd, iter-7 diffs revised to level-only vocabulary.

Iteration: 12 of 14

Focus Area: **GROUND-TRUTH INTEGRATION PROBE under workflow-invariant lens.** Read actual current source files (not just proposed diffs), map EVERY user-visible output surface, verify the revised-iter-7 diffs land cleanly without leaking preset/capability/kind vocabulary anywhere.

## YOUR TASK

For each of these surfaces, READ the actual current source code AND map the strings/messages emitted to user-visible channels (stdout, stderr, files written, log lines). Then verify the iter-11 revised diffs preserve level-only vocabulary on every channel.

1. **`create.sh --help` text** (file: `.opencode/skill/system-spec-kit/scripts/spec/create.sh`)
   - Capture every line of `--help` output today
   - Verify proposed change keeps level vocabulary; flag any introduction of preset/capability/kind

2. **`create.sh` normal stdout** — the success message, path summary, etc.
   - Capture today's success template
   - Verify proposed log lines stay level-only

3. **`create.sh` JSON stdout** (when `--json` flag used)
   - Today's JSON shape: capture exact field names
   - Verify proposed JSON keeps level vocabulary; flag any new fields named `preset`/`capability`/`kind`

4. **Phase-parent logs** (when `--phase` mode is active)
   - Today: what gets logged?
   - Proposed: same surface, level-only

5. **Sharded-spec warnings** (when `--sharded` flag is active)
   - Today: what's the warning text?
   - Proposed: preserve

6. **`check-files.sh` error output** (file: `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`)
   - Today's error messages: capture exact strings
   - Verify proposed error messages from iter-7-revised stay level-only

7. **`check-sections.sh` / `check-template-headers.sh` / `check-section-counts.sh` error output**
   - Same: capture today, verify proposed

8. **`validate.sh` summary output** — the "Errors: N Warnings: M" summary line
   - Already level-agnostic? Verify.

9. **Generated `spec.md` content** that scaffolder writes
   - Today: contains `<!-- SPECKIT_LEVEL: N -->` and `level: N` frontmatter
   - Proposed: same — confirm

10. **Generated `description.json`** field shape
    - Today: contains `level` field?
    - Proposed: keep `level: N`; do NOT add `preset` / `capabilities` / `manifestVersion` fields here (would leak to AI memory parsers)

11. **Generated `graph-metadata.json`** field shape
    - Today: contains `level` somewhere?
    - Proposed: keep level taxonomy in `derived.importance_tier` or `derived.metadata`; ban `preset`/`capability`/`kind` keys here

## RESOLVE 3 OPEN QUESTIONS FROM ITER 11

1. **Should the manifest schema's INTERNAL rows still be called `presets[]`?** Or use a less leak-prone term like `levelContracts[]`? Recommend a name that minimizes any chance of leakage if the manifest is ever exposed.
2. **Should `manifestVersion` appear in any AI-readable packet metadata, or be confined to a private cache?** Pick: (a) NEVER in packet metadata; (b) only in `description.json` private cache; (c) allowed in `description.json` as a small string field.
3. **What generated CI tests should fail the build if banned vocabulary appears?** Specify a `scripts/tests/workflow-invariance.vitest.ts` test that greps every user-facing surface for `preset|capability|kind`.

## CARRY-OVER FACTS

From iter 10: workflow-invariant constraint identified
From iter 11: ADR-005 drafted; `resolveLevelContract(level)` API spec'd; revised iter-7 diffs use level-only vocabulary in user-visible channels; banned terms in public surfaces: `preset`, `capability`, `kind`, `manifest`

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-011.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-012.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-012.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-011.md FIRST.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- Read ACTUAL source files (`create.sh`, `check-files.sh`, etc.) — don't infer.
- For each surface, document in a "today vs proposed" comparison block.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-012.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Surface Audit Tables (1-11)", "3 Open Questions Resolved", "Workflow-Invariance Test Spec", "Surface Leakage Risk Assessment") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":12,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-012.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 12

1. **Audit before opining**: read every source file before assessing leakage risk.
2. **For each surface, produce a 3-row comparison**: Today's text | Proposed text | Vocabulary verdict (LEVEL-ONLY / LEAKS / FIXED).
3. **Test spec**: write the actual TS/shell test code (~30-50 LOC) that would catch banned-vocabulary leakage in CI.
4. **Risk assessment**: rank each surface by leakage risk H/M/L. Prioritize H risks for explicit mitigations.
5. **Next focus**: iter 13 should re-dry-run the iter-8 scenarios with explicit AI-conversation transcripts (user says X → AI responds Y → AI invokes Z). Verify every word the AI emits stays level-only.

Emit findings as `{"type":"finding","id":"f-iter012-NNN",...}`.
