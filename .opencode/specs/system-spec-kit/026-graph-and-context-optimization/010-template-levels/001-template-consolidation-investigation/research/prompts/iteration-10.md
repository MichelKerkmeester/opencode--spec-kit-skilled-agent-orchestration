# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: **10 of 10 (FINAL)**
Last 9 ratios: 0.82 -> 0.76 -> 0.68 -> 0.61 -> 0.52 -> 0.44 -> 0.36 -> 0.28 -> 0.18 | Stuck count: 0
Recommendation: **PARTIAL** (stable across iter 3-9)
research.md (29K, 17 sections) DRAFTED at iter 9. All 10 questions answered.

Research Topic: Template system consolidation. Output recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file/LOC deltas, generator design choice, backward-compat path.

Iteration: 10 of 10 — **FINAL POLISH PASS**

Focus Area: **Final consistency pass on research.md + emit resource-map.md + write closing iteration narrative.** Three sub-tasks:

1. **Polish research.md**: re-read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md` end-to-end. Fix any: (a) stale numbers (cross-check file/LOC deltas, marker count 868, perf numbers 433ms/<500ms NFR-P01), (b) inconsistent recommendation language (must consistently say PARTIAL throughout, never drift to CONSOLIDATE/STATUS QUO mid-document), (c) broken/missing internal references (Q1-Q10, Phase 1-4, risk IDs), (d) tighten the TL;DR to 5 bullets max, (e) ensure the 4-Phase plan has explicit go/no-go gates between phases, (f) ensure each risk row has a concrete mitigation (not just "mitigate this").

2. **Emit resource-map.md** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/resource-map.md`. Catalog every file path referenced in research.md (templates/, scripts/, mcp_server/, command/, agent/, skill/, specs/, tests/). Group by section: READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta. One-line theme summary per section.

3. **Write closing iteration-010.md narrative**: state the loop is converging or has converged; declare the final recommendation (PARTIAL); list the 3 follow-on packets implied by the 4-Phase plan; close with a "ready for /spec_kit:plan" pointer.

This is the last iteration. After this, the workflow synthesis phase is complete; remaining steps are reducer (already automated), continuity save, and updating the spec packet's decision-record.md ADR-001 (which I'll do post-loop).

Remaining Key Questions: ALL 10 ANSWERED. Convergence declaration appropriate.

Last 3 Iterations Summary:
- Iter 7 (0.36): resolver API contract + perf budget closed
- Iter 8 (0.28): 17-section synthesis outline + ranked risk register + LOC deltas
- Iter 9 (0.18, status: canonical-draft-ready): README policy decided (option B: consolidate into templates/README.md master), exact deletion budget measured, canonical research.md drafted (29K, 17 sections populated)

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iterations: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md through iteration-009.md
- Canonical synthesis: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md (DRAFT — POLISH THIS)
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-010.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-010.jsonl
- **Write resource map to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/resource-map.md** (NEW THIS ITER)

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-009.md AND research.md FIRST before editing.
- Use Edit (not Write) on research.md so you preserve the structure and only fix specific issues.
- DO NOT use `.../` ellipsis paths.

## OUTPUT CONTRACT

FOUR artifacts:
1. `iteration-010.md` narrative with convergence declaration
2. State log JSONL append: `{"type":"iteration","iteration":10,"newInfoRatio":<0..1>,"status":"converged" or "max_iterations","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-010.jsonl` delta file
4. **`resource-map.md`** newly written
5. **`research.md`** edited (NOT rewritten) for consistency

## RESEARCH GUIDANCE FOR ITERATION 10

1. Re-read research.md and run the polish checklist (1a-1f above).
2. Build resource-map.md from grep'd file references in research.md (and prior iterations if needed). Use the section taxonomy from the prompt above.
3. Write iteration-010.md with declared convergence: `status: "converged"` if newInfoRatio drops below 0.05; `status: "max_iterations"` if it doesn't drop that low but we hit iter 10. Either way, the loop ends after this.
4. State the recommendation crisply ONE more time at the bottom of iteration-010.md: "PARTIAL: keep templates/level_N as committed goldens, build compose.sh + thin resolver wrapper to consume on-demand, gate Phase 4 deletion on byte-parity tests."

Emit findings as `{"type":"finding","id":"f-iter010-NNN",...}` records.
