# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation.

## STATE

Segment: 1 | Iteration: 8 of 9
Last 7 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 -> 0.41 | Stuck count: 0
All 10 questions ANSWERED. Refactor diffs against real source written iter 7 (with real line numbers). Open notes from iter 7: shell helper Node snippets are bridge only, `template-structure.js` needs follow-up diff, description+graph metadata generation should converge.

Iteration: 8 of 9

Focus Area: **END-TO-END DRY-RUN.** Walk a hypothetical packet through the entire proposed pipeline. Catch any step that doesn't actually produce correct output. This is the final stress test before iter 9 synthesis.

Three sub-tasks:

1. **Dry-run 3 packet shapes through the full pipeline**:
   For each preset below, document EVERY step: input → output, with intermediate state shown. If any step is ambiguous or breaks, flag it.
   
   Preset A: `simple-change` (kind=implementation, capabilities=[])
   Preset B: `arch-change` (kind=implementation, capabilities=[qa-verification, architecture-decisions])
   Preset C: `phase-parent` (kind=phase-parent, capabilities=[])

   Pipeline steps to walk for each:
   - Step 1 — User invokes: `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --preset <X> --name "Sample" .opencode/specs/sample/`
   - Step 2 — `create.sh` reads manifest, resolves preset → kind + capabilities
   - Step 3 — `create.sh` computes file list (core docs from kind + addAuthoredDocs from capabilities)
   - Step 4 — For each file, `create.sh` calls `copy_template` which calls inline-gate renderer
   - Step 5 — `create.sh` emits `description.json` + `graph-metadata.json` with kind + capabilities embedded
   - Step 6 — User runs `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sample/ --strict`
   - Step 7 — Validator reads packet's frontmatter for kind + capabilities, reads manifest for required files, checks
   - Step 8 — Validator runs section checks (check-sections.sh) using inline-gate-aware logic from iter 6
   - For each step, document: input artifact, output artifact, what could go wrong, validator behavior.

2. **Catch broken steps**:
   - Where does the dry-run reveal a missing piece? Most likely candidates: how does a packet's frontmatter declare its capabilities so validator can read them post-scaffold? where does `template-structure.js compare-manifest` plug in? how does the description+graph-metadata generator know the manifest contract version?
   - For each broken step: propose the fix (which file/function gets the missing piece).

3. **Sample manifest sketch concretized**:
   Write the FULL `spec-kit-docs.json` for the 3 dry-run presets. ~80-150 lines of valid JSON. Should be runnable mentally (even if not literally `jq`-able yet). Use camelCase per iter 7's naming decision.

## CARRY-OVER FACTS

From iter 1: irreducible runtime core = spec.md + description.json + graph-metadata.json
From iter 2: addon lifecycle table populated
From iter 3: WINNER C+F hybrid (15 source files)
From iter 4: manifest schema v1 written
From iter 5: refactor pseudo-code + INLINE GATES + 12-row risk register
From iter 6: inline-gate EBNF + 5-row evolution scenario table + edge mitigations
From iter 7: real concrete diffs against `create.sh`, `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`, `template-utils.sh` with real line numbers; `manifestVersion` chosen; presets nested in `spec-kit-docs.json`; camelCase JSON keys

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-007.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-008.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-007.md FIRST for the diffs.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- Dry-run is on PAPER (mental walk-through). DO NOT actually run any scaffolder against the production templates.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-008.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Dry-Run Preset A: simple-change", "Dry-Run Preset B: arch-change", "Dry-Run Preset C: phase-parent", "Broken Steps + Fixes", "Concretized Manifest JSON") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-008.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 8

1. **Walk EVERY step**: don't skip "obvious" ones. The bug usually hides in the obvious step.
2. **Show intermediate state**: e.g., after Step 3, print the file list as a markdown bullet list. After Step 4, sample the active vs stripped sections of one file. After Step 5, print the description.json + graph-metadata.json that would be emitted.
3. **Be honest about gaps**: if Step 7 can't actually run because the manifest doesn't store capability declarations in the packet's own frontmatter, that's a missing piece — flag it and propose the fix.
4. **Concretize the manifest** — the 3 presets need concrete JSON, not pseudo-JSON. Show kinds[], capabilities[], presets[], with all required fields filled in.
5. **Next focus**: iter 9 is FINAL SYNTHESIS. Recommend: write `research/research.md` (17 sections) consolidating all 8 iterations + emit `research/resource-map.md` + declare convergence + final recommendation.

Emit findings as `{"type":"finding","id":"f-iter008-NNN",...}`. Use graphEvents for pipeline-step→artifact edges.
