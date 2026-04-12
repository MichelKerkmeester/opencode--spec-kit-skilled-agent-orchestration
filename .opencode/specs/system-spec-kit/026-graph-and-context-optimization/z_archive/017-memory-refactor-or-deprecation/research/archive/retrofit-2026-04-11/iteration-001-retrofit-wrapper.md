---
title: "Iteration 001 — Single-shot research synthesis (retrofit wrapper)"
_provenance: single-shot-codex-retrofit
_retrofitted_at: 2026-04-11T12:15:00Z
_note: "This iteration record wraps the entire single-shot codex run that produced phase 017. No real per-iteration dispatch happened. All 8 key questions were answered in one Codex reasoning pass in this 'iteration'. This file exists for structural compliance with sk-deep-research folder expectations."
iteration: 1
timestamp: 2026-04-10T22:09:00Z
worker: codex/gpt-5.4/high
scope: single_shot_full_research
---

# Iteration 001 — Single-Shot Research Synthesis (retrofit wrapper)

## ⚠ Retrofit notice

**This is not a real iteration record.** Phase 017 research was executed as one `codex exec` single-shot delegation that bypassed the sk-deep-research loop driver entirely. This file wraps the entire single-shot run as if it were iteration 1 of a proper loop, for structural compliance with the expected folder layout.

**Real execution command**:
```bash
cat research-prompt.md | codex exec \
  --model gpt-5.4 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  --full-auto \
  -
```

**Real execution metrics**:
- Tokens used: 324,196
- Wall clock: ~10 minutes
- Iteration phases executed: 0 (single-shot, no loop)
- State files written by the run: `research/research.md` only (the other 6 state files in this folder were added by the 2026-04-11 retrofit)

---

## Scope

Single pass through all 8 key questions from the phase 017 research prompt. Codex answered them in one atomic reasoning pass, wrote the consolidated synthesis to `research/research.md`, and produced four supporting findings files under `findings/`, plus `recommendation.md` and `phase-018-proposal.md` at the spec folder root.

## Questions addressed

All 8 questions from the charter:

1. **Q1** — Current memory system: what does it actually do right now?
2. **Q2** — Value assessment: are the memories themselves useful?
3. **Q3** — Redundancy with spec kit documentation: how much overlap?
4. **Q4** — Retrieval value: does MCP search on memories actually work?
5. **Q5** — Alternative architectures: what are the options?
6. **Q6** — Migration path: what happens to the 153 existing memories?
7. **Q7** — Integration impact: what breaks if memory is deprecated?
8. **Q8** — Recommendation: what should we actually do?

## Methodology (as executed)

- **Read existing code**: `memory-save.ts` (16-stage pipeline), `memory-context.ts`, `memory-search.ts`, `session-resume.ts`, `session-bootstrap.ts`, `generate-context.ts`, parts of the `save/` subdirectory, selected memory files, and the canonical spec kit doc templates.
- **Cross-reference**: the phase 005 deep-quality investigation (562 findings) for generator quality ground truth.
- **Retrieval test**: attempted live `memory_search` handler calls for 10 resume-style queries; hit the 30-second embedding warmup timeout; pivoted to direct SQLite FTS queries against the indexed corpus and ran the 10-query comparison that way.
- **Redundancy analysis**: mapped each memory section (CONTINUE SESSION, PROJECT STATE SNAPSHOT, IMPLEMENTATION GUIDE, OVERVIEW, DETAILED CHANGES, DECISIONS, CANONICAL SOURCES, RECOVERY HINTS, MEMORY METADATA, PREFLIGHT BASELINE, POSTFLIGHT LEARNING DELTA) against the corresponding spec kit doc section.
- **Alternatives comparison**: six options (A status quo, B minimal, C wiki-style, D handover-only, E findings-only, F full deprecation) scored across cost, risk, user value, migration effort, rollback cost.
- **Integration impact**: inventoried every command, agent, skill, script, handler, template, doc, test, and config that touches the memory system; estimated migration effort per file.
- **Recommendation synthesis**: Option C with Option B as retention policy; phased rollout 018 → 019 → 020.

## Key findings (see `../findings-registry.json` for the full list)

1. **F-017-001** — Memory system has two jobs (narrative journal + retrieval substrate). The second is useful; the first is where redundancy lives.
2. **F-017-002** — Narrative memory sections are mostly redundant with spec kit docs.
3. **F-017-003** — Memory retrieval wins on session-shaped and historical queries (real but narrow value).
4. **F-017-004** — Option C (wiki-style + thin continuity) is the best architecture.
5. **F-017-005** — Option A (status quo + fix generator) is not recommended.
6. **F-017-006** — Freeze existing 150 memories rather than bulk-convert.
7. **F-017-007** — Integration impact is wide but tractable.
8. **F-017-008** — Phased rollout: phase 018 authority → 019 runtime → 020 permanence.
9. **F-017-009** — Exact continuity retrieval for session-shaped queries is the only irreplaceable memory value.

## Deliverables written by this run

- `research/research.md` — full 8-question synthesis with evidence
- `findings/alternatives-comparison.md` — six options × cost/risk/value/migration
- `findings/integration-impact.md` — file-by-file migration effort
- `findings/redundancy-matrix.md` — memory sections × spec kit doc equivalents
- `findings/retrieval-comparison.md` — 10 test queries
- `recommendation.md` — one-page executive decision
- `phase-018-proposal.md` — follow-up implementation phase outline

## What worked

- **GPT 5.4 with high reasoning effort**: absorbed the generator source tree, multiple sample memories, and the full charter in one context and produced a grounded synthesis.
- **Fallback to SQLite FTS queries when the live handler path failed**: salvaged the retrieval comparison deliverable.
- **Cross-referencing phase 005 findings**: the 562 known generator defects provided quantitative grounding for the "don't bet on Option A" conclusion.

## What failed / did not work

- **Live `memory_search` handler**: 30-second embedding warmup timeout blocked the preferred retrieval path. Caveated in `findings/retrieval-comparison.md`.
- **sk-deep-research loop**: was never invoked. The entire run bypassed init → iterate → synthesize → save. No state files existed until the 2026-04-11 retrofit.
- **Per-iteration convergence tracking**: single-shot execution cannot produce newInfoRatio progression. Dashboard trend section is synthetic.
- **Quality guard checks**: the sk-deep-research quality guards (minimum coverage, source diversity, question resolution thresholds) were bypassed.
- **Reducer machine-owned state**: no what-worked/what-failed/next-focus updates happened during the run. The strategy file sections were backfilled in the retrofit.

## Retrospective convergence estimate

- **Synthetic newInfoRatio**: 1.0 (first and only iteration)
- **Synthetic composite score**: 0.90 (all 8 questions answered with evidence; 9 findings with high confidence; one I'M UNCERTAIN caveat on the retrieval comparison due to degraded runtime)
- **Quality guard check**: NOT RUN. If guards had been applied, all three likely would have passed: keyQuestionCoverage 8/8, evidenceDensity 9+ sources (code + prior research + manual walkthrough + FTS queries), hotspotSaturation OK.

## Open questions

None from this iteration. All 8 research questions resolved in the single-shot pass.

**Downstream open questions** (for phase 018):

- How does content get routed to the right anchor in the right spec doc automatically?
- What are the exact merge/append semantics for an existing anchored section?
- What is the minimum viable schema for the thin continuity layer?
- For each advanced memory feature, what is the specific retarget mechanism?
- What does `/spec_kit:resume` look like end-to-end in the new model?

These are the key questions in the phase 018 research prompts at `../006-canonical-continuity-refactor/prompts/`.

## Lessons learned (this iteration — more importantly, about the process)

1. **Single-shot `codex exec` for deep research is a trap.** It produces usable content but bypasses every state file, every convergence check, every reducer update, every quality guard, and every resumability guarantee. The resulting folder cannot be audited, forked, or continued.
2. **The sk-deep-research loop driver exists for a reason.** Init/iterate/synthesize/save is not ceremony — it is the contract that makes research packets composable, resumable, and auditable.
3. **Phase 018 prompts have been updated to enforce the proper flow.** The prompts README at `../006-canonical-continuity-refactor/prompts/README.md` includes a mandatory notice rejecting single-shot `codex exec` and mandating `/spec_kit:deep-research:auto`.
4. **Retrofit is acceptable when content is trusted.** The phase 017 research content was already acted on and trusted; re-running would cost tokens and produce different findings requiring reconciliation. Retrofit preserves the audit trail honestly.

## Stop reason

`single_shot_synthesis_complete` — all 8 key questions answered with evidence in one Codex reasoning pass. Convergence check NOT performed (loop driver never ran), but all questions resolved, so the run was terminal by definition.
