# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation.

## STATE

Segment: 1 | Iteration: 7 of 9
Last 6 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 | Stuck count: 0
Q1-Q10 ANSWERED. Iter 5 wrote refactor plan as pseudo-code. Iter 6 stress-tested design (inline-gate EBNF + manifest evolution policy + edge mitigations). 

Iteration: 7 of 9

Focus Area: **INTEGRATION PROBE — concrete diffs against current source files.** Iter 5 was pseudo-code; iter 7 must produce real before/after diffs that a human implementer could literally apply.

Three sub-tasks:

1. **Read current source files** (full content, not greps):
   - `.opencode/skill/system-spec-kit/scripts/spec/create.sh` — focus on the level-switch logic (lines ~538-661 from prior research)
   - `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` — focus on the level→required-files matrix
   - `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` — focus on section presence checks
   - `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` — focus on header expectations
   - `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh` — focus on count thresholds per level
   - `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh::copy_template` — focus on the cp logic

2. **Produce concrete unified-diff-format proposed changes** for each file:
   - Use real line numbers from the current source
   - `-` lines = current code to remove, `+` lines = new code to add
   - Each diff hunk should be applyable with `patch -p0` if the user ever wants to
   - Document any imports/sourcing additions (e.g., `source .opencode/skill/system-spec-kit/scripts/lib/manifest-loader.sh`)

3. **Resolve open spec questions from iter 6**:
   - JSON Schema spelling: pick one — `templateContract` vs `template_contract`, `directories` vs `dirs`, `supportsKinds` vs `supported_kinds`, `conflictsWith` vs `conflicts_with`, preset namespaces — make decisions consistent with the existing spec-kit JSON conventions (check `description.json` and `graph-metadata.json` shapes for camelCase vs snake_case).
   - `manifestVersion` vs `schemaVersion` — pick one with reasoning.
   - Preset namespace: nested in `spec-kit-docs.json` under `presets[]` OR a separate `presets.json`?

## CARRY-OVER FACTS

From iter 1: irreducible runtime core
From iter 2: addon lifecycle table
From iter 3: WINNER C+F hybrid (15 source files)
From iter 4: manifest schema example (kinds + capabilities + presets)
From iter 5: refactor plan as pseudo-code; INLINE GATES chosen for Q10; 12-row risk register
From iter 6: inline-gate EBNF formalized; manifest evolution policy + 5-row scenario table; extreme-edge probe with mitigations folded into design

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-006.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-007.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-005.md AND iteration-006.md FIRST (refactor plan + edge mitigations).
- Use full repo-relative paths. NO `.../`.
- DO NOT actually mutate the source files. Diffs are PROPOSED, written into iteration-007.md only.
- Stay within `011-template-greenfield-redesign/research/` for writes.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-007.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Diff: create.sh", "Diff: check-files.sh", "Diff: check-sections.sh", "Diff: check-template-headers.sh", "Diff: check-section-counts.sh", "Diff: template-utils.sh", "JSON Naming Decisions") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-007.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 7

1. **Read each source file before drafting its diff.** Do not generate diffs from memory or assumption.
2. **Use real line numbers**: prefix each hunk with `@@ -<line>,<count> +<line>,<count> @@`.
3. **Smaller is better**: prefer minimal diffs. If the existing function can be replaced by a 1-line manifest call, do that — don't rewrite the whole function.
4. **JSON naming consistency**: read `description.json` and `graph-metadata.json` to detect the project's existing convention (likely camelCase based on prior iters), apply consistently to manifest schema.
5. **Next focus**: iter 8 should do END-TO-END DRY-RUN — scaffold a hypothetical packet using the manifest + diffs, walking through each step (resolve preset → copy templates → strip gates → emit metadata → run validator) and verifying every step produces correct output.

Emit findings as `{"type":"finding","id":"f-iter007-NNN",...}`. Use graphEvents for diff→target-file edges.
