# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation, no backward-compat constraint.

## STATE

Segment: 1 | Iteration: 5 of 6
Last 4 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 | Stuck count: 0
Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9 ANSWERED. Manifest schema written iter 4. Sample scaffolds verified for 6 presets. Golden test design specified.
Open: Q10 (inline section-gating choice), refactor plan, risk register synthesis.

Iteration: 5 of 6

Focus Area: **REFACTOR PLAN + Q10 RESOLUTION + RISK REGISTER.** The penultimate iteration. Iter 6 is synthesis-only; this iter must close every remaining design question.

Three sub-tasks:

1. **Refactor plan (Q10 implementation)**: produce concrete file-by-file changes:
   - **`scripts/spec/create.sh`**: stop hardcoded `--level N` switch; read manifest; resolve preset → kind+capabilities; copy author-scaffolded docs only; emit description.json + graph-metadata.json. Show before/after pseudo-code for the relevant 20-30 lines.
   - **`scripts/rules/check-files.sh`**: stop hardcoded level→files matrix; read manifest; iterate over `kind.requiredCoreDocs` + `capabilities[].addsAuthoredDocs`; respect `absenceBehavior` (silent-skip for command-owned-lazy). Show before/after for the requirements lookup function.
   - **`scripts/rules/check-sections.sh` / `check-section-counts.sh` / `check-template-headers.sh`**: read `addsSectionProfiles` from manifest; stop hardcoded level→sections matrix.
   - **`mcp_server/lib/validation/spec-doc-structure.ts`** (if exists): consume same manifest via TS module; expose `loadManifest()` + `getRequiredDocs(kind, capabilities)`.
   - **New file**: `scripts/lib/template-utils.sh::scaffold_from_manifest()` shell function. Sketch the function signature + body (~20 lines).
   - **New file**: `mcp_server/lib/templates/manifest-loader.ts` TS module. Sketch the exports.
   - **Deletion list**: which files in current `templates/` get deleted? Concrete list.

2. **Q10 resolution — inline gates vs fragment files**: pick ONE.
   - Inline gates: `<!-- IF capability:architecture-decisions -->...<!-- /IF -->` inside spec.md.tmpl
   - Fragment files: separate `templates/manifest/section-fragments/architecture.md` referenced from manifest
   - Decide based on: ergonomics (which is easier to read/edit?), reusability (do sections repeat across docs?), generator complexity. Justify in 1-2 sentences.

3. **Risk register synthesis** (8-12 rows): ranked table covering:
   - From copilot's analysis: false simplicity, parser fragility, addon ownership confusion
   - From iter 1-4 findings: section-only traits (governance), command-owned-lazy semantics, manifest schema evolution, preset sprawl
   - For each: Impact (H/M/L), Likelihood (H/M/L), Mitigation (concrete, not "be careful"), Owner (who watches it)

## CARRY-OVER FACTS

From iter 1: irreducible runtime core = spec.md + description.json + graph-metadata.json
From iter 2: addon lifecycle table — handover (command-owned-lazy via /memory:save), debug-delegation (agent-exclusive via @debug + scaffold-debug-delegation.sh), research (workflow-owned by /spec_kit:deep-research), resource-map (mixed), context-index (author-scaffolded rare)
From iter 3: WINNER C+F hybrid, 15 source files
From iter 4: manifest schema + 6 sample scaffolds + golden test design

## CANDIDATE SOURCE-FILE INVENTORY (15 files, target — to refine)

```
templates/manifest/
├── spec-kit-docs.json                              # the single manifest (drives both scaffold + validator)
├── spec.md.tmpl                                    # author core
├── plan.md.tmpl                                    # author core
├── tasks.md.tmpl                                   # author core
├── implementation-summary.md.tmpl                  # author core (with _memory.continuity block)
├── checklist.md.tmpl                               # capability=qa-verification
├── decision-record.md.tmpl                         # capability=architecture-decisions
├── phase-parent.spec.md.tmpl                       # kind=phase-parent (lean)
├── resource-map.md.tmpl                            # author-scaffolded optional
├── context-index.md.tmpl                           # author-scaffolded rare
├── handover.md.tmpl                                # owner=/memory:save (lazy)
├── debug-delegation.md.tmpl                        # owner=@debug (lazy)
└── research.md.tmpl                                # owner=/spec_kit:deep-research (lazy, lives in research/)
scripts/lib/template-utils.sh                       # scaffold_from_manifest() shell entry
mcp_server/lib/templates/manifest-loader.ts         # TS entry
```

That's exactly 15 files. Verify or correct.

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-004.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-004.md FIRST for the manifest schema.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- Pseudo-code is OK for before/after; should be concrete enough that a follow-on packet can implement mechanically.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-005.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Refactor Plan — File-by-File Changes", "Q10 Decision: Inline Gates vs Fragments", "Risk Register") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-005.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 5

1. **Refactor plan**: read the current `create.sh`, `check-files.sh` content (just the relevant ~50 lines around the level switch). Produce before/after diffs as fenced code blocks. Be concrete.
2. **Q10 decision**: 1-2 sentence justification. Default leaning: INLINE GATES (preserves single-file authoring; section reuse across docs is rare based on iter 4's section profiles).
3. **Risk register**: 8-12 rows minimum. Each row: ID, Description, Impact, Likelihood, Mitigation, Owner. Use H/M/L scales.
4. **Next focus**: iter 6 is final synthesis. Recommend: write the canonical `research.md` populating all sections from iter 1-5 findings.

Emit findings as `{"type":"finding","id":"f-iter005-NNN",...}`. Use graphEvents for refactor→target-file edges.
