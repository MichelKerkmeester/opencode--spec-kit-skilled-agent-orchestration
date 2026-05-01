# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation, no backward-compat constraint.

## STATE

Segment: 1 | Iteration: 6 of 9
Last 5 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 | Stuck count: 0
**ALL 10 design questions Q1-Q10 ANSWERED at iter 5.** Loop extended from 6 to 9 iterations per user request — iters 6-8 add depth/stress-testing BEFORE the iter-9 synthesis.

Iteration: 6 of 9

Focus Area: **DESIGN STRESS-TEST PASS 1 — Section-profile depth + manifest evolution policy + extreme-edge probe.**

The next 3 iterations stress-test the chosen design (C+F hybrid) against scenarios it hasn't been challenged on yet. Iter 6 covers the design's ROBUSTNESS UNDER EVOLUTION:

Three sub-tasks:

1. **Section-profile design depth (Q10 follow-through)**:
   Iter 5 chose `inline gates` over `fragment files`. Now design the inline-gate spec rigorously:
   - Exact gate syntax: `<!-- IF capability:architecture-decisions -->...<!-- /IF -->` — what about negation? composition? mutual-exclusion? nested gates?
   - Pre-process step: who strips ungated sections — a dedicated TS module, a sed-pipeline in the scaffolder, or runtime in the manifest-loader?
   - Edge case: what if a gate appears MID-SECTION (e.g., a single bullet point inside a list is gated)? Permitted or forbidden?
   - Edge case: what if two capabilities should produce the SAME section (de-dup on emission)?
   - Validator interaction: should `check-sections.sh` understand gates so it doesn't flag a stripped section as "missing"?
   - Write the inline-gate grammar formally as a small EBNF.

2. **Manifest evolution policy**:
   How do we add a NEW capability (e.g., `security-review`, `compliance`, `ada-accessibility`) WITHOUT breaking existing packets that don't declare it?
   - Schema versioning: does `spec-kit-docs.json` carry a `manifestVersion`? If yes, how is migration handled?
   - Forward-compat: a packet saved under manifest v1 read by manifest v2 — what guarantees survive?
   - Backward-compat: capability deprecation — soft-warn, hard-error, silent-drop?
   - Adding a NEW preset: does a preset namespace exist? Are presets in the manifest or a sibling file?
   - Section-profile evolution: if you ADD a section to a capability, do existing packets retroactively need that section? (Almost certainly NO — but make this explicit.)
   - Write a 5-row "manifest evolution scenario table": (Add capability / Remove capability / Rename capability / Add section to existing capability / Remove section from existing capability) × (impact, mitigation, validator behavior).

3. **Extreme-edge probe**:
   Find scenarios that BREAK the C+F hybrid design and document mitigations:
   - **Cross-capability conflict**: capability A says "section X required", capability B says "section X forbidden". What happens?
   - **Phase-parent with capabilities**: can a `kind: phase-parent` packet ALSO declare `architecture-decisions`? If yes, where does the decision-record.md live — parent or children?
   - **Workflow-owned packet inside investigation**: investigation packets need `research/` subfolder; how does the manifest declare a SUBFOLDER as required vs a flat file?
   - **Capability granularity**: what if the user wants ONLY part of "qa-verification" (e.g., they want checklist.md but not the validator-strict-mode-check)? Does the design allow capability splitting?
   - **Deletion safety**: if a packet was scaffolded with capability X, then the user removes X from the packet's frontmatter — what happens to the now-orphan files (decision-record.md if `architecture-decisions` removed)? Hard-warn? Auto-archive? Leave?

## CARRY-OVER FACTS

From iter 1: irreducible runtime core = spec.md + description.json + graph-metadata.json
From iter 2: addon lifecycle table populated
From iter 3: WINNER C+F hybrid (15 source files; F/B/D/G eliminated)
From iter 4: manifest schema written (kinds + capabilities + presets); 6 sample scaffolds verified; 6 golden tests defined
From iter 5: refactor plan file-by-file (create.sh, check-files.sh, check-sections.sh, validation TS, manifest-loader); Q10 chose INLINE GATES; risk register populated

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-005.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-006.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-006.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-005.md FIRST.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- This iter is design stress-testing; the design itself is FROZEN (C+F hybrid won iter 3). If a stress-test reveals a real flaw, document a MITIGATION inside the design — don't propose a different design.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-006.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Inline-Gate Grammar (EBNF)", "Manifest Evolution Policy + 5-Row Scenario Table", "Extreme-Edge Probe Results") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-006.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 6

1. **Inline-gate EBNF**: be formal — write a small grammar covering `IF`, `IF NOT`, `IF capability:X AND capability:Y`, `IF kind:phase-parent`, nesting rules. Should fit in 10-20 lines.
2. **Evolution policy**: 5-row table is the deliverable. Each row: scenario / impact / mitigation / validator behavior.
3. **Edge probe**: 5 scenarios listed above. For each: does it break C+F hybrid? If yes, what's the mitigation? If no, why not?
4. **Mitigations as design clarifications**: when an edge breaks the design, the fix goes INTO the design (e.g., add a `conflictResolution` field to the manifest, or a `precedence` rule). Document each clarification.
5. **Next focus**: iter 7 should do INTEGRATION PROBE — actually read the current `create.sh` + `check-files.sh` + `check-sections.sh` source code and produce concrete diffs (not pseudo-code) for the proposed changes.

Emit findings as `{"type":"finding","id":"f-iter006-NNN",...}`. Use graphEvents for design→edge-case→mitigation triplets.
