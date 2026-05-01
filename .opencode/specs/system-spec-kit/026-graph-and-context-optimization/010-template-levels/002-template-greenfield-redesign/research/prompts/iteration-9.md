# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation.

## STATE

Segment: 1 | Iteration: **9 of 9 (FINAL SYNTHESIS)**
Last 8 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 -> 0.41 -> 0.38 | Stuck count: 0
All 10 design questions ANSWERED. Refactor diffs concrete. Dry-run validated 3 preset shapes through full pipeline.

Iteration: 9 of 9 — **FINAL SYNTHESIS PASS**

Focus Area: **Write the canonical research.md (17 sections) + emit resource-map.md + declare convergence + answer 3 final open items.**

Four sub-tasks:

1. **Write `research/research.md`**:
   Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`
   Use 17 sections covering:
   1. TL;DR (5 bullets max — recommendation, source-file delta, killer features)
   2. Recommendation (C+F hybrid; reasoning crisp)
   3. Background (current state + why level-system fails)
   4. Methodology (8 iterations, externalized state, cross-validation by cli-copilot)
   5. Findings per Q1-Q10 (with cited evidence per question)
   6. Final Design — Manifest schema (full JSON example, ~80-150 lines)
   7. Final Design — Inline-gate grammar (EBNF from iter 6)
   8. Final Design — Addon lifecycle map (table from iter 2)
   9. Final Design — Preset catalog (5-7 presets from iter 4 + iter 8)
   10. Refactor Plan — Phase-by-phase (file changes from iter 7's diffs, ordered)
   11. Risk Register (12 rows from iter 5)
   12. Manifest Evolution Policy (5-row table from iter 6)
   13. Edge-Case Probe Results + Mitigations (from iter 6)
   14. Dry-Run Verification (3 presets from iter 8 with intermediate state)
   15. File/LOC Deltas (86 → 15 source files; per-level dirs deleted; addon stubs eliminated)
   16. Open Items / Future Work (carry the 3 unresolved iter-8 questions + manifest-version migration adapter design)
   17. Appendices (A: graph from iter 1-8 nodes/edges; B: commands run; C: cross-validation summary linking to ../001-template-consolidation-investigation/001-template-consolidation-investigation/research/cross-validation/copilot-response.md)

2. **Emit `research/resource-map.md`**:
   Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/resource-map.md`
   Catalog every file path referenced in research.md. Group by section: READMEs / Documents / Commands / Agents / Skills / Specs / Scripts / Tests / Config / Meta. One-line theme per section.

3. **Resolve the 3 final open items from iter 8**:
   - Should EVERY authored doc carry template-contract frontmatter, or only `spec.md`? Pick one with reasoning. (Default leaning: only `spec.md` — keeps continuity surface clean.)
   - Should current-manifest validation support older `manifestVersion` values via adapters, or require exact match? (Default: greenfield = require exact match until first real migration; record this as ADR-002.)
   - Should `phase-parent --name X` create only a parent or require child phase definitions? (Default: parent only; children come via subsequent invocations of `create.sh --subfolder`.)

4. **Declare convergence**:
   newInfoRatio for iter 9 should be ≤ 0.10 (loop's threshold). If you find substantial new info during synthesis, flag it; otherwise declare `status: "converged"`.

## CARRY-OVER FACTS (the synthesis substrate)

From iter 1: irreducible runtime core = spec.md + description.json + graph-metadata.json. Memory parsers indexed by description_metadata + graph_metadata. Resume ladder priority: impl-summary → spec → plan → tasks → checklist → decision-record → research → handover → resource-map.
From iter 2: addon lifecycle classifications — handover (command-owned-lazy via /memory:save), debug-delegation (agent-exclusive via @debug + scaffold-debug-delegation.sh), research (workflow-owned-packet via /spec_kit:deep-research, in research/ subdir), resource-map (mixed author/workflow), context-index (author-scaffolded rare). Level 3+ governance is section-level only, not file-level.
From iter 3: WINNER C+F hybrid 35/35-relative, 15 source files. Eliminated F (16/35), B (24/35), D (26/35), G (31/35).
From iter 4: manifest schema example with kinds + capabilities + presets + per-doc-template ownership; 6 sample scaffolds verified covering simple/validated/arch/governed/phase-parent/investigation; golden test design with 5 preset snapshots.
From iter 5: refactor pseudo-code; INLINE GATES chosen (Q10); 12-row risk register; deletion list of current templates folders.
From iter 6: inline-gate EBNF formalized; 5-row manifest evolution scenario table; extreme-edge probe with mitigations.
From iter 7: real concrete diffs against `create.sh`, `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`, `template-utils.sh` with real line numbers; `manifestVersion` chosen; presets nested in `spec-kit-docs.json`; camelCase JSON keys.
From iter 8: 3-preset dry-run validated end-to-end; broken steps flagged + fixed; concretized 80-150 line `spec-kit-docs.json` JSON.

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-008.md (full history)
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-009.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-009.jsonl
- **Write canonical synthesis to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md** (THE headline deliverable)
- **Write resource map to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/resource-map.md**

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iterations 1-8 narratives BEFORE writing research.md (they contain the substrate).
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- research.md target size: 30-40 KB (similar to 010's 29.7 KB synthesis).
- DO NOT introduce new design directions in synthesis. Consolidate, don't redesign.

## OUTPUT CONTRACT

FOUR artifacts:
1. `iteration-009.md` narrative — short (1-3 KB) with convergence declaration + recommendation summary + pointer to research.md
2. State log JSONL append: `{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"converged" or "max_iterations","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-009.jsonl` delta file
4. **`research.md` canonical synthesis** populated from the 17-section outline; every section filled with iter-1-through-iter-8 evidence
5. **`resource-map.md`** newly written

## RESEARCH GUIDANCE FOR ITERATION 9

1. **research.md is the headline deliverable**. Spend most tool budget on it. Re-read iterations 1-8 narratives + the 010-cross-validation/copilot-response.md to ensure no factual drift.
2. **Be HONEST about deltas**: 86 → 15 source files. The previous PARTIAL framing (010) said 86 → 83 + 1 resolver. THIS framing says 86 → 15 (greenfield). Show both numbers in §15 for context.
3. **Resolve the 3 final open items inside research.md** — write them as ADR-002, ADR-003, ADR-004 in §10 (refactor plan) or §16 (open items resolved).
4. **Declare convergence**: status=`converged` if newInfoRatio < 0.10. State explicitly that the loop is complete.
5. **Final recommendation crisp**: "C+F hybrid manifest-driven greenfield. 86 → 15 source files. Levels eliminated. Lazy command-owned addons. Single manifest drives scaffolder + validator. Inline-gate sections. Implementation phases live in `plan.md` of the follow-on packet."

Emit findings as `{"type":"finding","id":"f-iter009-NNN",...}`. Keep iter-009.jsonl small — most volume should be in research.md, not the delta.
