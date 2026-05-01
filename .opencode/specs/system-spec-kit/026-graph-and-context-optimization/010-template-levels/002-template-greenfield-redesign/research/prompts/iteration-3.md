# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation, no backward-compat constraint.

## STATE

Segment: 1 | Iteration: 3 of 6
Last 2 ratios: 0.78 -> 0.82 | Stuck count: 0
Q1 ANSWERED (irreducible runtime core: spec.md + description.json + graph-metadata.json)
Q3 + Q4 + Q7 ANSWERED for the surveyed surfaces (addon lifecycles classified; parser contracts mapped; level-validators surveyed)
Open: Q2 (capability-flag matrix completeness), Q5 (single-manifest design), Q6 (phase-parent representation), Q8 (presets), Q9 (golden tests), Q10 (inline gates vs fragments) — and the BIG one: pick a design from {F, C+F hybrid, B, D, G}.

Iteration: 3 of 6

Focus Area: **DESIGN ELIMINATION ROUND.** Score the 5 candidate designs against the parser-contract reality (iter 1) and addon-lifecycle table (iter 2). Eliminate any design that violates them. Pick a winner OR narrow to 2 finalists for iter 4.

Use copilot's elimination test: can the design express owner / trigger / absence-behavior / section-header expectations / runtime metadata SEPARATELY? Designs that conflate any two of these get penalized.

Three sub-tasks:

1. **Score each design** against this rubric (1-5 each, total /35):
   - **R1**: Expresses irreducible core (spec.md + description.json + graph-metadata.json) without forcing extra files
   - **R2**: Distinguishes `author-scaffolded` vs `command-owned-lazy` vs `workflow-owned-packet` cleanly
   - **R3**: Single manifest drives both scaffolder + validator (no duplicated logic)
   - **R4**: Capability flags reproduce today's level matrix without hardcoded level lookup
   - **R5**: Section-level variance handleable (e.g., arch-only Risk Matrix subsection inside spec.md)
   - **R6**: Authoring ergonomics — maintainer can edit a template by editing markdown, not code/JSON
   - **R7**: Phase-parent semantics representable cleanly (kind / flag / profile)

2. **Eliminate or shortlist**: drop any design scoring <20/35. Justify each elimination in 1-2 sentences. Identify the winner OR top 2 finalists.

3. **Source surface count for finalists**: for each surviving design, estimate the source file count (as concrete number, not range). Verify NFR-M02 (source surface ≤30 files, preferably ≤15).

## CARRY-OVER FACTS

From iter 1:
- Irreducible runtime core: spec.md + description.json + graph-metadata.json (HARD requirement)
- description.json + graph-metadata.json schemas pinned; thin continuity contract pinned (<2048 bytes)

From iter 2:
- Addon lifecycle table populated. Key facts (synthesize from your reading):
  - `handover.md` — command-owned-lazy (writer: `/memory:save` content-router routes `handover_state` chunks)
  - `debug-delegation.md` — agent-exclusive (writer: `@debug` agent only via `scaffold-debug-delegation.sh`)
  - `research.md` — workflow-owned-packet (writer: `/spec_kit:deep-research` workflow; lives in `research/` subdir)
  - `resource-map.md` — author-scaffolded OR workflow-emitted (multi-source)
  - `context-index.md` — author-scaffolded (rare, ad-hoc migration bridge)
- Level 3+ governance "level" has NO unique file requirement (it's section-level, not file-level) — important nuance flagged by iter 2
- Command-owned lazy docs need separate "owner / absence semantics" expression in any manifest

## CANDIDATE DESIGNS (recap)

- **F**: Minimal scaffold (spec + description + graph-metadata only) + EVERY addon is command-owned-lazy. Validator: warning on absence of any addon.
- **C+F hybrid**: Capability flags drive scaffold for human-authored docs (plan, tasks, checklist, decision-record, impl-summary). Command/agent-owned addons (handover, debug-delegation, research) stay lazy. Mix.
- **B**: Single manifest + full-document templates per doc-type. Manifest: `(kind, traits) → required files`. All addons scaffolded as starter docs.
- **D**: Section-fragment library (~25 fragment files) with composer + manifest declaring section-id orderings per doc. Maximum reuse.
- **G**: Schema-first — templates expressed as TS data structures, markdown rendered from schema. No `.md.tmpl` files.

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md, iteration-002.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-003.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-001.md AND iteration-002.md FIRST.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-003.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Scoring Matrix", "Eliminated Designs", "Surviving Finalists with Source Surface Counts") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-003.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 3

1. **Build the scoring matrix as a markdown table** (rows = R1-R7, columns = F / C+F / B / D / G, cells = 1-5 with 1-line rationale).
2. **Eliminate** any design scoring <20/35 with cited reasoning.
3. **For finalists, count source files concretely**: which manifests, which template files, which generator scripts. Compare to today's 86 files.
4. **Edge-case probe**: how does each finalist handle phase-parent (Q6)? How does each handle the Level 3+ governance "section-only" trait that has no unique file?
5. **Next focus**: if a clear winner emerges, iter 4 should produce the manifest schema + sample packet scaffolds. If 2 finalists, iter 4 does head-to-head experiment.

Emit findings as `{"type":"finding","id":"f-iter003-NNN",...}`. Use graphEvents for design→capability edges.
